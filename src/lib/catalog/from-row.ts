import type { Tables } from "@/lib/supabase/database.types";
import type { Art, Product, ProductOption, ProductTag, StockStatus } from "./types";

type ProductRow = Tables<"products">;

type CatalogMetadata = {
  art?: Art;
  options?: ProductOption[] | null;
  tags?: ProductTag[];
  popularity?: number;
  addedOrder?: number;
  short?: string;
  benefits?: string[];
  uses?: string[];
  specs?: [string, string][];
  howTo?: string[];
  faq?: { q: string; a: string }[];
  attrs?: Record<string, string>;
  keywords?: string[] | null;
  complements?: string[] | null;
  stockStatus?: StockStatus;
};

function parseArt(image: string | null, meta: CatalogMetadata): Art {
  if (meta.art?.kind) return meta.art;
  if (image) {
    try {
      const parsed = JSON.parse(image) as Art;
      if (parsed?.kind) return parsed;
    } catch {
      /* image may be a URL later */
    }
  }
  return { kind: "bucket" };
}

/** Public catalog columns. `stock` is intentionally absent. */
export const CATALOG_COLUMNS =
  "id,name,description,price,category,brand,image,active,created_at,updated_at,slug,sku,sub,compare_at,unit,variant_hint,metadata,availability" as const;

function stockStatus(availability: string | null | undefined, meta: CatalogMetadata): StockStatus {
  if (meta.stockStatus === "in" || meta.stockStatus === "low" || meta.stockStatus === "out") {
    return meta.stockStatus;
  }
  if (availability === "in" || availability === "low" || availability === "out") return availability;
  return "out";
}

function asMeta(value: unknown): CatalogMetadata {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as CatalogMetadata;
  }
  return {};
}

/**
 * Map a Supabase products row to the existing UI Product shape.
 * App-facing `id` stays the catalog slug so cart/wishlist localStorage keeps working.
 */
export function rowToProduct(row: Omit<ProductRow, "stock">): Product | null {
  const slug = row.slug?.trim();
  if (!slug) return null;
  const meta = asMeta(row.metadata);
  const short = meta.short || row.description || row.name;
  return {
    id: slug,
    slug,
    sku: row.sku?.trim() || slug,
    name: row.name,
    brand: row.brand ?? "",
    category: row.category ?? "",
    sub: row.sub ?? "",
    art: parseArt(row.image, meta),
    price: Number(row.price),
    compareAt: row.compare_at == null ? undefined : Number(row.compare_at),
    unit: row.unit || "יח׳",
    variantHint: row.variant_hint ?? undefined,
    options: meta.options ?? undefined,
    stock: stockStatus(row.availability, meta),
    tags: meta.tags ?? [],
    popularity: meta.popularity ?? 50,
    addedOrder: meta.addedOrder ?? 0,
    short,
    description: row.description || short,
    benefits: meta.benefits ?? [],
    uses: meta.uses ?? [],
    specs: meta.specs ?? [],
    howTo: meta.howTo ?? [],
    faq: meta.faq ?? [],
    attrs: meta.attrs ?? {},
    keywords: meta.keywords ?? undefined,
    complements: meta.complements ?? undefined,
  };
}
