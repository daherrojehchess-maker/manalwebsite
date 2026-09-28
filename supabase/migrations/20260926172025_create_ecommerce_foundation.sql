-- Phase 2: ecommerce database foundation
-- Tables, indexes, triggers, and RLS. No seed/catalog data.

-- ---------------------------------------------------------------------------
-- Extensions & private schema
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role;
GRANT USAGE ON SCHEMA private TO authenticated;

-- ---------------------------------------------------------------------------
-- Tables (created before helper functions that reference them)
-- ---------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  category TEXT,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT products_price_nonnegative CHECK (price >= 0),
  CONSTRAINT products_stock_nonnegative CHECK (stock >= 0)
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  shipping_method TEXT,
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT orders_subtotal_nonnegative CHECK (subtotal >= 0),
  CONSTRAINT orders_shipping_cost_nonnegative CHECK (shipping_cost >= 0),
  CONSTRAINT orders_total_nonnegative CHECK (total >= 0),
  CONSTRAINT orders_order_status_check CHECK (
    order_status IN (
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'completed',
      'cancelled'
    )
  ),
  CONSTRAINT orders_payment_status_check CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'refunded')
  )
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products (id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_nonnegative CHECK (unit_price >= 0),
  CONSTRAINT order_items_line_total_nonnegative CHECK (line_total >= 0)
);

CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quote_requests_status_check CHECK (
    status IN ('pending', 'in_progress', 'quoted', 'accepted', 'closed')
  )
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX profiles_role_idx ON public.profiles (role);

CREATE INDEX products_active_idx ON public.products (active);
CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_brand_idx ON public.products (brand);

CREATE INDEX orders_user_id_idx ON public.orders (user_id);
CREATE INDEX orders_order_status_idx ON public.orders (order_status);
CREATE INDEX orders_payment_status_idx ON public.orders (payment_status);
CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);

CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items (product_id);

CREATE INDEX quote_requests_user_id_idx ON public.quote_requests (user_id);
CREATE INDEX quote_requests_status_idx ON public.quote_requests (status);
CREATE INDEX quote_requests_created_at_idx ON public.quote_requests (created_at DESC);

-- ---------------------------------------------------------------------------
-- Private helpers (after tables they reference)
-- ---------------------------------------------------------------------------

-- Admin check from trusted profiles.role (never from user_metadata / JWT claims alone).
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO service_role;

CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC;

-- Auto-create profile for new auth users (role always customer)
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')), ''),
    NULLIF(
      TRIM(
        COALESCE(
          NEW.raw_user_meta_data ->> 'phone',
          NEW.phone,
          ''
        )
      ),
      ''
    ),
    'customer'
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC;

-- Block self-promotion / unauthorized role changes
CREATE OR REPLACE FUNCTION private.enforce_profile_role_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT private.is_admin() THEN
      RAISE EXCEPTION 'Changing profile role is not allowed'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  IF NEW.role NOT IN ('customer', 'admin') THEN
    RAISE EXCEPTION 'Invalid profile role'
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.enforce_profile_role_immutable() FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER quote_requests_set_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER profiles_enforce_role
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.enforce_profile_role_immutable();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.products FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.orders FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.order_items FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.quote_requests FROM PUBLIC, anon, authenticated;

GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
GRANT SELECT ON TABLE public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO authenticated;
GRANT SELECT ON TABLE public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quote_requests TO authenticated;

-- ---- profiles -------------------------------------------------------------
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR private.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ---- products -------------------------------------------------------------
CREATE POLICY "products_select_active_anon"
  ON public.products
  FOR SELECT
  TO anon
  USING (active = true);

CREATE POLICY "products_select_active_authenticated"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (active = true OR private.is_admin());

CREATE POLICY "products_admin_insert"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "products_admin_update"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "products_admin_delete"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- ---- orders ---------------------------------------------------------------
-- Customers: read own only. No customer INSERT/UPDATE/DELETE in Phase 2
-- (checkout will use controlled server paths later).
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR private.is_admin());

CREATE POLICY "orders_admin_insert"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "orders_admin_update"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "orders_admin_delete"
  ON public.orders
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- ---- order_items ----------------------------------------------------------
CREATE POLICY "order_items_select_own_or_admin"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    private.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin_insert"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "order_items_admin_update"
  ON public.order_items
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "order_items_admin_delete"
  ON public.order_items
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- ---- quote_requests -------------------------------------------------------
CREATE POLICY "quote_requests_select_own_or_admin"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR private.is_admin());

CREATE POLICY "quote_requests_insert_own"
  ON public.quote_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "quote_requests_admin_update"
  ON public.quote_requests
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "quote_requests_admin_delete"
  ON public.quote_requests
  FOR DELETE
  TO authenticated
  USING (private.is_admin());
