-- Extend products for full catalog migration while keeping Phase 2 core columns.
-- App-facing product id remains the slug for cart/wishlist localStorage compatibility.
-- Database primary key stays UUID (deterministic per slug).

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS sub TEXT,
  ADD COLUMN IF NOT EXISTS compare_at NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'יח׳',
  ADD COLUMN IF NOT EXISTS variant_hint TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Unique slug required for idempotent upserts and URL routing.
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_uidx ON public.products (slug);

CREATE INDEX IF NOT EXISTS products_sub_idx ON public.products (sub);
CREATE INDEX IF NOT EXISTS products_brand_idx ON public.products (brand);

ALTER TABLE public.products
  ADD CONSTRAINT products_compare_at_nonnegative CHECK (compare_at IS NULL OR compare_at >= 0);

COMMENT ON COLUMN public.products.slug IS 'Stable public product key (legacy catalog id). Used by URLs, cart, wishlist.';
COMMENT ON COLUMN public.products.metadata IS 'Rich catalog fields (art, options, tags, specs, etc.) required by existing UI.';
COMMENT ON COLUMN public.products.image IS 'Serialized ProductArt JSON for now (no CDN images yet).';
COMMENT ON COLUMN public.products.stock IS 'Numeric stock qty. UI stock status derived: 0=out, 1-10=low, else in.';
