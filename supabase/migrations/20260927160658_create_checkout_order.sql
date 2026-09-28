-- Phase 5: controlled checkout order creation.
-- Prices, names, and stock come from public.products. The caller cannot set them.
-- Stock is validated but NOT decremented. Reservation waits for payment confirmation.
-- Shipping matches src/lib/site.ts today: shippingPrice and freeShippingThreshold are unset,
-- so both delivery and pickup store shipping_cost = 0. VAT is already inside product prices.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key uuid;

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_uidx
  ON public.orders (idempotency_key);

COMMENT ON COLUMN public.orders.idempotency_key IS
  'One checkout attempt. A replay with the same key returns the original order and does not insert again.';

-- ---------------------------------------------------------------------------
-- Unit price from the product row + option labels stored in metadata.
-- selection is only { option name: value label }. priceDelta is never accepted from the client.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.checkout_unit_price(
  p_price numeric,
  p_metadata jsonb,
  p_selection jsonb
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_options jsonb;
  v_opt jsonb;
  v_val jsonb;
  v_key text;
  v_label text;
  v_price numeric := p_price;
  v_matched boolean;
  v_required integer;
  v_provided integer;
BEGIN
  IF p_selection IS NULL OR p_selection = 'null'::jsonb THEN
    p_selection := '{}'::jsonb;
  END IF;
  IF pg_catalog.jsonb_typeof(p_selection) <> 'object' THEN
    RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
  END IF;

  v_options := p_metadata -> 'options';
  IF v_options IS NULL OR v_options = 'null'::jsonb OR v_options = '[]'::jsonb THEN
    IF p_selection <> '{}'::jsonb THEN
      RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
    END IF;
    RETURN pg_catalog.round(v_price, 2);
  END IF;

  IF pg_catalog.jsonb_typeof(v_options) <> 'array' THEN
    RAISE EXCEPTION 'checkout:invalid_product' USING ERRCODE = 'P0001';
  END IF;

  v_required := pg_catalog.jsonb_array_length(v_options);
  SELECT count(*) INTO v_provided FROM pg_catalog.jsonb_object_keys(p_selection);
  IF v_required <> v_provided THEN
    RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
  END IF;

  FOR v_opt IN SELECT value FROM pg_catalog.jsonb_array_elements(v_options)
  LOOP
    v_key := v_opt ->> 'name';
    IF v_key IS NULL OR NOT (p_selection ? v_key) THEN
      RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
    END IF;
    v_label := p_selection ->> v_key;
    IF v_label IS NULL OR pg_catalog.char_length(v_label) > 80 THEN
      RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
    END IF;

    v_matched := false;
    FOR v_val IN SELECT value FROM pg_catalog.jsonb_array_elements(COALESCE(v_opt -> 'values', '[]'::jsonb))
    LOOP
      IF v_val ->> 'label' = v_label THEN
        IF (v_val ? 'priceDelta') AND pg_catalog.jsonb_typeof(v_val -> 'priceDelta') <> 'number' THEN
          RAISE EXCEPTION 'checkout:invalid_product' USING ERRCODE = 'P0001';
        END IF;
        v_price := v_price + COALESCE((v_val ->> 'priceDelta')::numeric, 0);
        v_matched := true;
        EXIT;
      END IF;
    END LOOP;
    IF NOT v_matched THEN
      RAISE EXCEPTION 'checkout:invalid_selection' USING ERRCODE = 'P0001';
    END IF;
  END LOOP;

  IF v_price < 0 THEN
    RAISE EXCEPTION 'checkout:invalid_product' USING ERRCODE = 'P0001';
  END IF;
  RETURN pg_catalog.round(v_price, 2);
END;
$$;

REVOKE ALL ON FUNCTION private.checkout_unit_price(numeric, jsonb, jsonb) FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- Inserts orders + order_items in one transaction. Raises on any invalid line,
-- so a partial order is never committed.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.create_checkout_order(
  p_idempotency_key uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address text,
  p_shipping_method text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing uuid;
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

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_idempotency_key::text, 0));

  SELECT id INTO v_existing
  FROM public.orders
  WHERE idempotency_key = p_idempotency_key;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
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
    WHERE totals.qty > p.stock
  ) THEN
    RAISE EXCEPTION 'checkout:insufficient_stock' USING ERRCODE = 'P0001';
  END IF;

  -- Intentionally no stock decrement. Unpaid pending orders must not hold inventory
  -- until a payment confirmation step exists.
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
    idempotency_key
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
    p_idempotency_key
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

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION private.create_checkout_order(uuid, jsonb, text, text, text, text, text) FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.create_checkout_order(uuid, jsonb, text, text, text, text, text) TO anon, authenticated;

-- Public wrapper is invoker-only so the definer body stays out of the exposed schema.
CREATE OR REPLACE FUNCTION public.create_checkout_order(
  p_idempotency_key uuid,
  p_items jsonb,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address text,
  p_shipping_method text
)
RETURNS uuid
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
    p_shipping_method
  );
$$;

REVOKE ALL ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text) TO anon, authenticated;

COMMENT ON FUNCTION public.create_checkout_order(uuid, jsonb, text, text, text, text, text) IS
  'Creates a pending unpaid order from product slugs. Ignores client prices. Does not decrement stock.';
