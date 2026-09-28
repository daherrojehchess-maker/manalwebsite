-- Phase 7C: hide exact stock from API roles, empty search_path on older
-- definer functions, and a password-reset rate-limit bucket.
-- Checkout still reads products.stock inside SECURITY DEFINER functions.
-- Password minimum length and leaked-password protection stay dashboard settings.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS availability text
  GENERATED ALWAYS AS (
    CASE
      WHEN (metadata ->> 'stockStatus') IN ('in', 'low', 'out') THEN metadata ->> 'stockStatus'
      WHEN stock <= 0 THEN 'out'
      WHEN stock <= 10 THEN 'low'
      ELSE 'in'
    END
  ) STORED;

COMMENT ON COLUMN public.products.availability IS
  'Safe catalog status derived from stock. API roles can read this and cannot read stock.';

-- Table-level SELECT includes every column, so a column revoke is not enough.
REVOKE SELECT ON TABLE public.products FROM PUBLIC, anon, authenticated;
GRANT SELECT (
  id, name, description, price, category, brand, image, active,
  created_at, updated_at, slug, sku, sub, compare_at, unit,
  variant_hint, metadata, availability
) ON TABLE public.products TO anon, authenticated;

-- Older definers. Bodies stay the same; names are schema-qualified.
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NULLIF(pg_catalog.btrim(COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')), ''),
    NULLIF(
      pg_catalog.btrim(
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

CREATE OR REPLACE FUNCTION private.enforce_profile_role_immutable()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_action text,
  p_ip text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_limit integer;
  v_window interval;
  v_bucket text;
  v_start timestamptz;
  v_hits integer;
  v_ip text;
BEGIN
  IF p_action = 'login' THEN
    v_limit := 20;
    v_window := interval '15 minutes';
  ELSIF p_action = 'signup' THEN
    v_limit := 8;
    v_window := interval '60 minutes';
  ELSIF p_action = 'checkout_create' THEN
    v_limit := 12;
    v_window := interval '15 minutes';
  ELSIF p_action = 'payment_start' THEN
    v_limit := 12;
    v_window := interval '15 minutes';
  ELSIF p_action = 'password_reset' THEN
    v_limit := 5;
    v_window := interval '60 minutes';
  ELSE
    RETURN false;
  END IF;

  v_ip := pg_catalog.left(pg_catalog.btrim(COALESCE(p_ip, '')), 64);
  IF v_ip !~ '^[0-9A-Fa-f:.]+$' OR v_ip !~ '[.:]' THEN
    RETURN false;
  END IF;

  v_bucket := p_action || ':' || COALESCE(auth.uid()::text, '-') || ':' || v_ip;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_bucket, 0));

  SELECT window_start, hits
    INTO v_start, v_hits
  FROM private.rate_limit_buckets
  WHERE bucket = v_bucket
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO private.rate_limit_buckets (bucket, window_start, hits)
    VALUES (v_bucket, pg_catalog.now(), 1);
    RETURN true;
  END IF;

  IF v_start + v_window <= pg_catalog.now() THEN
    UPDATE private.rate_limit_buckets
    SET window_start = pg_catalog.now(), hits = 1
    WHERE bucket = v_bucket;
    RETURN true;
  END IF;

  IF v_hits >= v_limit THEN
    RETURN false;
  END IF;

  UPDATE private.rate_limit_buckets
  SET hits = hits + 1
  WHERE bucket = v_bucket;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, text) TO anon, authenticated;
