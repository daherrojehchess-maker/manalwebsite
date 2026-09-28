-- Correct the catalog grants: table-level SELECT still exposed products.stock.
-- Also restore the rate-limit IP check after an over-escaped regex rejected IPv4.

REVOKE SELECT ON TABLE public.products FROM PUBLIC, anon, authenticated;
GRANT SELECT (
  id, name, description, price, category, brand, image, active,
  created_at, updated_at, slug, sku, sub, compare_at, unit,
  variant_hint, metadata, availability
) ON TABLE public.products TO anon, authenticated;

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
