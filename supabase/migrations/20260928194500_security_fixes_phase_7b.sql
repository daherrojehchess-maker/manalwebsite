-- Phase 7B: persistent rate limits and narrower table grants.
-- Leaked-password protection is not a SQL setting. Enable it in the project's
-- Auth settings: "Prevent the use of leaked passwords" (HaveIBeenPwned).
-- Requires the Pro plan. Password sign-in stays enabled.
-- https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
-- RLS policies are unchanged. Checkout still writes through SECURITY DEFINER RPCs.
-- service_role keeps table writes for operational admin access. The authenticated
-- role no longer has customer-unused INSERT/UPDATE/DELETE grants.

CREATE TABLE IF NOT EXISTS private.rate_limit_buckets (
  bucket text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL CHECK (hits >= 0)
);

ALTER TABLE private.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.rate_limit_buckets FROM PUBLIC, anon, authenticated;

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

COMMENT ON FUNCTION public.consume_rate_limit(text, text) IS
  'Shared Postgres rate limit for login, signup, checkout creation, and payment preparation. Returns false when limited or when the input is invalid. Does not fail open.';

REVOKE INSERT, UPDATE, DELETE ON TABLE public.orders FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.order_items FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM authenticated;
REVOKE UPDATE, DELETE ON TABLE public.quote_requests FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.order_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quote_requests TO service_role;
