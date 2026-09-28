-- Phase 6A: inventory reservations, payment state, and guest confirmation.
-- No payment provider is called. products.stock changes only in private.confirm_checkout_payment.
-- Active holds are status = 'held' AND expires_at > now(). Expired holds do not reduce available stock.

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'initiated', 'paid', 'failed', 'refunded'));

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS confirmation_token_hash bytea;

COMMENT ON COLUMN public.orders.confirmation_token_hash IS
  'SHA-256 of the guest confirmation token. The raw token is never stored.';

CREATE TABLE IF NOT EXISTS public.inventory_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  quantity integer NOT NULL,
  status text NOT NULL DEFAULT 'held',
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT inventory_reservations_quantity_positive CHECK (quantity > 0),
  CONSTRAINT inventory_reservations_status_check CHECK (status IN ('held', 'committed', 'released')),
  CONSTRAINT inventory_reservations_order_product_key UNIQUE (order_id, product_id)
);

CREATE INDEX IF NOT EXISTS inventory_reservations_held_product_idx
  ON public.inventory_reservations (product_id)
  WHERE status = 'held';

CREATE INDEX IF NOT EXISTS inventory_reservations_held_expires_idx
  ON public.inventory_reservations (expires_at)
  WHERE status = 'held';

COMMENT ON TABLE public.inventory_reservations IS
  'Stock holds for payment preparation. Available stock is products.stock minus held rows that have not expired. Stock is decremented only when a hold is committed.';

DROP TRIGGER IF EXISTS inventory_reservations_set_updated_at ON public.inventory_reservations;
CREATE TRIGGER inventory_reservations_set_updated_at
  BEFORE UPDATE ON public.inventory_reservations
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

ALTER TABLE public.inventory_reservations ENABLE ROW LEVEL SECURITY;

REVOKE INSERT, UPDATE, DELETE ON public.inventory_reservations FROM anon, authenticated;

DROP POLICY IF EXISTS inventory_reservations_admin_select ON public.inventory_reservations;
CREATE POLICY inventory_reservations_admin_select
  ON public.inventory_reservations
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

-- Customers have no insert, update, or delete policy. Writes go through private functions.

-- ---------------------------------------------------------------------------
-- Hash of the raw guest token. NULL when the token is missing or malformed.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.checkout_token_hash(p_token text)
RETURNS bytea
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE
    WHEN p_token ~ '^[A-Za-z0-9_-]{43}$'
      THEN extensions.digest(pg_catalog.convert_to(p_token, 'UTF8'), 'sha256')
    ELSE NULL
  END;
$$;

REVOKE ALL ON FUNCTION private.checkout_token_hash(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.checkout_token_hash(text) FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Order creation now stores the confirmation-token hash.
-- A replay does not rotate the hash. Prices still come only from products.
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.create_checkout_order(uuid, jsonb, text, text, text, text, text);
DROP FUNCTION IF EXISTS private.create_checkout_order(uuid, jsonb, text, text, text, text, text);

CREATE OR REPLACE FUNCTION private.create_checkout_order(
  p_idempotency_key uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address text,
  p_shipping_method text,
  p_confirmation_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing uuid;
  v_existing_hash bytea;
  v_token_hash bytea;
  v_order_id uuid;
  v_item jsonb;
  v_slug text;
  v_qty integer;
  v_selection jsonb;
  v_product_id uuid;
  v_product_name text;
  v_product_price numeric;
  v_product_stock integer;
  v_product_active boolean;
  v_product_metadata jsonb;
  v_unit numeric;
  v_line numeric;
  v_lines jsonb := '[]'::jsonb;
  v_subtotal numeric := 0;
  v_shipping numeric := 0;
  v_name text;
  v_email text;
  v_phone text;
  v_address text;
  v_count integer;
  v_seen integer := 0;
BEGIN
  IF p_idempotency_key IS NULL THEN
    RAISE EXCEPTION 'checkout:invalid_request' USING ERRCODE = 'P0001';
  END IF;

  v_token_hash := private.checkout_token_hash(p_confirmation_token);
  IF v_token_hash IS NULL THEN
    RAISE EXCEPTION 'checkout:invalid_request' USING ERRCODE = 'P0001';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_idempotency_key::text, 0));

  SELECT id, confirmation_token_hash
    INTO v_existing, v_existing_hash
  FROM public.orders
  WHERE idempotency_key = p_idempotency_key;

  IF v_existing IS NOT NULL THEN
    RETURN pg_catalog.jsonb_build_object(
      'order_id', v_existing,
      'created', false,
      'token_bound', v_existing_hash IS NOT DISTINCT FROM v_token_hash
    );
  END IF;

  v_name := pg_catalog.btrim(COALESCE(p_customer_name, ''));
  v_email := pg_catalog.lower(pg_catalog.btrim(COALESCE(p_customer_email, '')));
  v_phone := pg_catalog.regexp_replace(COALESCE(p_customer_phone, ''), '\D', '', 'g');
  v_address := pg_catalog.btrim(COALESCE(p_shipping_address, ''));

  IF pg_catalog.char_length(v_name) < 2 OR pg_catalog.char_length(v_name) > 200 THEN
    RAISE EXCEPTION 'checkout:invalid_customer' USING ERRCODE = 'P0001';
  END IF;
  IF v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' OR pg_catalog.char_length(v_email) > 200 THEN
    RAISE EXCEPTION 'checkout:invalid_customer' USING ERRCODE = 'P0001';
  END IF;
  IF v_phone !~ '^0[0-9]{8,9}$' THEN
    RAISE EXCEPTION 'checkout:invalid_customer' USING ERRCODE = 'P0001';
  END IF;
  IF p_shipping_method NOT IN ('delivery', 'pickup') THEN
    RAISE EXCEPTION 'checkout:invalid_request' USING ERRCODE = 'P0001';
  END IF;
  IF p_shipping_method = 'delivery' THEN
    IF pg_catalog.char_length(v_address) < 3 OR pg_catalog.char_length(v_address) > 500 THEN
      RAISE EXCEPTION 'checkout:invalid_customer' USING ERRCODE = 'P0001';
    END IF;
  ELSE
    v_address := 'איסוף עצמי';
  END IF;

  IF p_items IS NULL OR pg_catalog.jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'checkout:empty_cart' USING ERRCODE = 'P0001';
  END IF;
  v_count := pg_catalog.jsonb_array_length(p_items);
  IF v_count < 1 OR v_count > 50 THEN
    RAISE EXCEPTION 'checkout:empty_cart' USING ERRCODE = 'P0001';
  END IF;

  FOR v_item IN SELECT value FROM pg_catalog.jsonb_array_elements(p_items)
  LOOP
    v_seen := v_seen + 1;
    v_slug := pg_catalog.btrim(COALESCE(v_item ->> 'slug', ''));
    IF v_slug !~ '^[a-z0-9-]{1,80}$' THEN
      RAISE EXCEPTION 'checkout:unavailable_product' USING ERRCODE = 'P0001';
    END IF;

    BEGIN
      v_qty := (v_item ->> 'quantity')::integer;
    EXCEPTION
      WHEN invalid_text_representation OR numeric_value_out_of_range THEN
        RAISE EXCEPTION 'checkout:invalid_quantity' USING ERRCODE = 'P0001';
    END;
    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 999 THEN
      RAISE EXCEPTION 'checkout:invalid_quantity' USING ERRCODE = 'P0001';
    END IF;

    v_selection := v_item -> 'selection';

    SELECT p.id, p.name, p.price, p.stock, p.active, p.metadata
      INTO v_product_id, v_product_name, v_product_price, v_product_stock, v_product_active, v_product_metadata
    FROM public.products p
    WHERE p.slug = v_slug;

    IF NOT FOUND OR v_product_active IS NOT TRUE THEN
      RAISE EXCEPTION 'checkout:unavailable_product' USING ERRCODE = 'P0001';
    END IF;

    v_unit := private.checkout_unit_price(v_product_price, COALESCE(v_product_metadata, '{}'::jsonb), v_selection);
    v_line := pg_catalog.round(v_unit * v_qty, 2);
    v_subtotal := v_subtotal + v_line;
    v_lines := v_lines || pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object(
        'product_id', v_product_id,
        'product_name', v_product_name,
        'unit_price', v_unit,
        'quantity', v_qty,
        'line_total', v_line,
        'stock', v_product_stock
      )
    );
  END LOOP;

  IF v_seen <> v_count THEN
    RAISE EXCEPTION 'checkout:invalid_request' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT line ->> 'product_id' AS product_id, sum((line ->> 'quantity')::integer) AS qty
      FROM pg_catalog.jsonb_array_elements(v_lines) AS line
      GROUP BY line ->> 'product_id'
    ) totals
    JOIN public.products p ON p.id = totals.product_id::uuid
    WHERE totals.qty > p.stock - COALESCE((
      SELECT sum(r.quantity)
      FROM public.inventory_reservations r
      WHERE r.product_id = p.id
        AND r.status = 'held'
        AND r.expires_at > pg_catalog.now()
    ), 0)
  ) THEN
    RAISE EXCEPTION 'checkout:insufficient_stock' USING ERRCODE = 'P0001';
  END IF;

  v_shipping := 0;

  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_method,
    subtotal,
    shipping_cost,
    total,
    order_status,
    payment_status,
    idempotency_key,
    confirmation_token_hash
  ) VALUES (
    auth.uid(),
    v_name,
    v_email,
    v_phone,
    v_address,
    p_shipping_method,
    v_subtotal,
    v_shipping,
    v_subtotal + v_shipping,
    'pending',
    'pending',
    p_idempotency_key,
    v_token_hash
  )
  RETURNING id INTO v_order_id;

  INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
  SELECT
    v_order_id,
    (line ->> 'product_id')::uuid,
    line ->> 'product_name',
    (line ->> 'unit_price')::numeric,
    (line ->> 'quantity')::integer,
    (line ->> 'line_total')::numeric
  FROM pg_catalog.jsonb_array_elements(v_lines) AS line;

  IF (SELECT COALESCE(sum(line_total), 0) FROM public.order_items WHERE order_id = v_order_id) <> v_subtotal THEN
    RAISE EXCEPTION 'checkout:invalid_request' USING ERRCODE = 'P0001';
  END IF;

  RETURN pg_catalog.jsonb_build_object(
    'order_id', v_order_id,
    'created', true,
    'token_bound', true
  );
END;
$$;

REVOKE ALL ON FUNCTION private.create_checkout_order(uuid, jsonb, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.create_checkout_order(uuid, jsonb, text, text, text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_checkout_order(
  p_idempotency_key uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address text,
  p_shipping_method text,
  p_confirmation_token text
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.create_checkout_order(
    p_idempotency_key,
    p_items,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_shipping_address,
    p_shipping_method,
    p_confirmation_token
  );
$$;

REVOKE ALL ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text, text) TO anon, authenticated;

COMMENT ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text, text) IS
  'Creates a pending unpaid order. Stores a hash of the guest confirmation token. Does not reserve or decrement stock.';

-- ---------------------------------------------------------------------------
-- Payment preparation. Holds stock for 15 minutes. Does not decrement stock.
-- Guest orders require the raw confirmation token. Authenticated orders require auth.uid().
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.start_checkout_payment(
  p_order_id uuid,
  p_guest_token text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
  v_order_status text;
  v_payment_status text;
  v_hash bytea;
  v_stored bytea;
  v_product_ids uuid[];
  v_found boolean;
BEGIN
  IF p_order_id IS NULL THEN
    RAISE EXCEPTION 'payment:forbidden' USING ERRCODE = 'P0001';
  END IF;

  SELECT user_id, order_status, payment_status, confirmation_token_hash
    INTO v_user_id, v_order_status, v_payment_status, v_stored
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;
  v_found := FOUND;

  v_hash := private.checkout_token_hash(p_guest_token);

  IF NOT v_found
     OR (v_user_id IS NOT NULL AND auth.uid() IS DISTINCT FROM v_user_id)
     OR (v_user_id IS NULL AND (v_hash IS NULL OR v_stored IS DISTINCT FROM v_hash))
  THEN
    RAISE EXCEPTION 'payment:forbidden' USING ERRCODE = 'P0001';
  END IF;

  IF v_order_status <> 'pending' OR v_payment_status NOT IN ('pending', 'initiated') THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.order_items WHERE order_id = p_order_id AND product_id IS NULL
  ) THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  IF v_payment_status = 'initiated' THEN
    IF EXISTS (
      SELECT 1
      FROM (
        SELECT product_id, sum(quantity)::integer AS qty
        FROM public.order_items
        WHERE order_id = p_order_id
        GROUP BY product_id
      ) items
      FULL OUTER JOIN (
        SELECT id, product_id, quantity, status, expires_at
        FROM public.inventory_reservations
        WHERE order_id = p_order_id
      ) r ON r.product_id = items.product_id
      WHERE items.product_id IS NULL
         OR r.id IS NULL
         OR r.status <> 'held'
         OR r.expires_at <= pg_catalog.now()
         OR r.quantity <> items.qty
    ) OR NOT EXISTS (
      SELECT 1 FROM public.order_items WHERE order_id = p_order_id
    ) THEN
      RAISE EXCEPTION 'payment:reservation_expired' USING ERRCODE = 'P0001';
    END IF;
    RETURN 'initiated';
  END IF;

  SELECT COALESCE(array_agg(product_id ORDER BY product_id), '{}'::uuid[])
    INTO v_product_ids
  FROM (
    SELECT DISTINCT product_id
    FROM public.order_items
    WHERE order_id = p_order_id
  ) items;

  IF pg_catalog.cardinality(v_product_ids) = 0 THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  PERFORM p.id
  FROM public.products p
  WHERE p.id = ANY (v_product_ids)
  ORDER BY p.id
  FOR UPDATE;

  IF (
    SELECT count(*) FROM public.products WHERE id = ANY (v_product_ids)
  ) <> pg_catalog.cardinality(v_product_ids) THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT product_id, sum(quantity)::integer AS qty
      FROM public.order_items
      WHERE order_id = p_order_id
      GROUP BY product_id
    ) items
    JOIN public.products p ON p.id = items.product_id
    WHERE items.qty > p.stock - COALESCE((
      SELECT sum(r.quantity)
      FROM public.inventory_reservations r
      WHERE r.product_id = p.id
        AND r.status = 'held'
        AND r.expires_at > pg_catalog.now()
    ), 0)
  ) THEN
    RAISE EXCEPTION 'payment:insufficient_stock' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.inventory_reservations (order_id, product_id, quantity, status, expires_at)
  SELECT p_order_id, items.product_id, items.qty, 'held', pg_catalog.now() + interval '15 minutes'
  FROM (
    SELECT product_id, sum(quantity)::integer AS qty
    FROM public.order_items
    WHERE order_id = p_order_id
    GROUP BY product_id
  ) items;

  UPDATE public.orders
  SET payment_status = 'initiated'
  WHERE id = p_order_id
    AND order_status = 'pending'
    AND payment_status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  RETURN 'initiated';
END;
$$;

REVOKE ALL ON FUNCTION private.start_checkout_payment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.start_checkout_payment(uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.start_checkout_payment(
  p_order_id uuid,
  p_guest_token text
)
RETURNS text
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.start_checkout_payment(p_order_id, p_guest_token);
$$;

REVOKE ALL ON FUNCTION public.start_checkout_payment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_checkout_payment(uuid, text) TO anon, authenticated;

COMMENT ON FUNCTION public.start_checkout_payment(uuid, text) IS
  'Holds inventory for 15 minutes and sets payment_status to initiated. Does not capture payment or decrement stock.';

-- ---------------------------------------------------------------------------
-- Called only after a verified provider webhook. Not granted to anon or authenticated.
-- payment:reservation_expired means the capture must be refunded; stock is unchanged.
-- A second call after success returns paid and does not decrement stock again.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.confirm_checkout_payment(p_order_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order_status text;
  v_payment_status text;
  v_product_ids uuid[];
BEGIN
  IF p_order_id IS NULL THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  SELECT order_status, payment_status
    INTO v_order_status, v_payment_status
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  IF v_payment_status = 'paid' THEN
    RETURN 'paid';
  END IF;

  IF v_order_status <> 'pending' OR v_payment_status <> 'initiated' THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  SELECT COALESCE(array_agg(product_id ORDER BY product_id), '{}'::uuid[])
    INTO v_product_ids
  FROM (
    SELECT DISTINCT product_id
    FROM public.order_items
    WHERE order_id = p_order_id
      AND product_id IS NOT NULL
  ) items;

  PERFORM p.id
  FROM public.products p
  WHERE p.id = ANY (v_product_ids)
  ORDER BY p.id
  FOR UPDATE;

  PERFORM r.id
  FROM public.inventory_reservations r
  WHERE r.order_id = p_order_id
  ORDER BY r.product_id
  FOR UPDATE;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT product_id, sum(quantity)::integer AS qty
      FROM public.order_items
      WHERE order_id = p_order_id
      GROUP BY product_id
    ) items
    FULL OUTER JOIN (
      SELECT id, product_id, quantity, status, expires_at
      FROM public.inventory_reservations
      WHERE order_id = p_order_id
    ) r ON r.product_id = items.product_id
    WHERE items.product_id IS NULL
       OR r.id IS NULL
       OR r.status <> 'held'
       OR r.expires_at <= pg_catalog.now()
       OR r.quantity <> items.qty
  ) THEN
    RAISE EXCEPTION 'payment:reservation_expired' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.products p
  SET stock = p.stock - r.quantity
  FROM public.inventory_reservations r
  WHERE r.order_id = p_order_id
    AND r.product_id = p.id
    AND r.status = 'held'
    AND r.expires_at > pg_catalog.now();

  UPDATE public.inventory_reservations
  SET status = 'committed'
  WHERE order_id = p_order_id
    AND status = 'held';

  UPDATE public.orders
  SET payment_status = 'paid',
      order_status = 'confirmed'
  WHERE id = p_order_id
    AND payment_status = 'initiated'
    AND order_status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'payment:not_payable' USING ERRCODE = 'P0001';
  END IF;

  RETURN 'paid';
END;
$$;

REVOKE ALL ON FUNCTION private.confirm_checkout_payment(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.confirm_checkout_payment(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION private.confirm_checkout_payment(uuid) TO service_role;

COMMENT ON FUNCTION private.confirm_checkout_payment(uuid) IS
  'Commits held stock after a verified payment. Idempotent once paid. Expired holds raise payment:reservation_expired and leave stock unchanged.';

-- ---------------------------------------------------------------------------
-- Marks expired holds released. Cancels initiated orders that were never paid.
-- Expired holds already stop counting before this runs.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.release_expired_reservations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order_ids uuid[];
  v_count integer := 0;
BEGIN
  SELECT COALESCE(array_agg(id ORDER BY id), '{}'::uuid[])
    INTO v_order_ids
  FROM (
    SELECT DISTINCT order_id AS id
    FROM public.inventory_reservations
    WHERE status = 'held'
      AND expires_at <= pg_catalog.now()
  ) expired_orders;

  IF pg_catalog.cardinality(v_order_ids) = 0 THEN
    RETURN 0;
  END IF;

  PERFORM o.id
  FROM public.orders o
  WHERE o.id = ANY (v_order_ids)
  ORDER BY o.id
  FOR UPDATE;

  UPDATE public.inventory_reservations
  SET status = 'released'
  WHERE order_id = ANY (v_order_ids)
    AND status = 'held'
    AND expires_at <= pg_catalog.now();

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.orders o
  SET payment_status = 'failed',
      order_status = 'cancelled'
  WHERE o.id = ANY (v_order_ids)
    AND o.payment_status = 'initiated'
    AND o.order_status = 'pending'
    AND NOT EXISTS (
      SELECT 1
      FROM public.inventory_reservations r
      WHERE r.order_id = o.id
        AND r.status = 'held'
        AND r.expires_at > pg_catalog.now()
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.inventory_reservations r
      WHERE r.order_id = o.id
        AND r.status = 'committed'
    );

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION private.release_expired_reservations() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.release_expired_reservations() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION private.release_expired_reservations() TO service_role;

COMMENT ON FUNCTION private.release_expired_reservations() IS
  'Releases expired holds and cancels untouched initiated orders. Does not require cron for stock math; expiry is enforced by expires_at.';

-- ---------------------------------------------------------------------------
-- Narrow confirmation read. UUID alone is not authorization.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_checkout_confirmation(
  p_order_id uuid,
  p_guest_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
  v_order_status text;
  v_payment_status text;
  v_total numeric;
  v_created timestamptz;
  v_stored bytea;
  v_hash bytea;
  v_items jsonb;
BEGIN
  IF p_order_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT user_id, order_status, payment_status, total, created_at, confirmation_token_hash
    INTO v_user_id, v_order_status, v_payment_status, v_total, v_created, v_stored
  FROM public.orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_hash := private.checkout_token_hash(p_guest_token);

  IF (v_user_id IS NOT NULL AND auth.uid() IS DISTINCT FROM v_user_id)
     OR (v_user_id IS NULL AND (v_hash IS NULL OR v_stored IS DISTINCT FROM v_hash))
  THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(
    pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object(
        'name', product_name,
        'quantity', quantity
      )
      ORDER BY created_at
    ),
    '[]'::jsonb
  )
    INTO v_items
  FROM public.order_items
  WHERE order_id = p_order_id;

  RETURN pg_catalog.jsonb_build_object(
    'order_status', v_order_status,
    'payment_status', v_payment_status,
    'total', v_total,
    'created_at', v_created,
    'items', v_items
  );
END;
$$;

REVOKE ALL ON FUNCTION private.get_checkout_confirmation(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.get_checkout_confirmation(uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_checkout_confirmation(
  p_order_id uuid,
  p_guest_token text
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
STABLE
SET search_path = ''
AS $$
  SELECT private.get_checkout_confirmation(p_order_id, p_guest_token);
$$;

REVOKE ALL ON FUNCTION public.get_checkout_confirmation(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_checkout_confirmation(uuid, text) TO anon, authenticated;

COMMENT ON FUNCTION public.get_checkout_confirmation(uuid, text) IS
  'Returns status, total, and item names for the order owner or a guest with the confirmation token. Does not authorize by UUID alone.';
