import { cache } from "react";
import { createAnonClient } from "@/lib/supabase/anon";
import { CATALOG_COLUMNS, rowToProduct } from "./from-row";
import type { Product } from "./types";

const complementRules: Record<string, string[]> = {
  "interior-paint": ["rollers", "brushes", "painting-accessories", "primers", "putty"],
  "exterior-paint": ["rollers", "brushes", "painting-accessories", "primers", "fillers"],
  "wood-metal-paint": ["brushes", "thinners", "painting-accessories"],
  primers: ["rollers", "interior-paint", "brushes"],
  putty: ["drywall-tools", "primers", "interior-paint"],
  "tile-adhesive": ["grout", "spacers", "tiling-tools", "primers-sealing"],
  grout: ["tile-care", "tiling-tools", "silicones"],
  silicones: ["hand-tools", "painting-accessories", "fillers"],
  adhesives: ["hand-tools", "painting-accessories", "gloves"],
  "roof-sealing": ["primers-sealing", "rollers", "brushes", "gloves"],
  "wet-rooms": ["tile-adhesive", "tiling-tools", "grout"],
  boards: ["profiles", "drywall-screws", "joint"],
  cordless: ["batteries", "bits-discs", "anchors"],
  "power-tools": ["eye-protection", "gloves", "bits-discs"],
  "kitchen-faucets": ["siphons", "valves", "silicones"],
  "shower-mixers": ["silicones", "valves"],
  "cement-concrete": ["concrete-additives", "gloves", "waste-bags"],
  decking: ["wood-finish", "screws"],
};

/** Public catalog: RLS already limits this to active rows. */
export const loadActiveProducts = cache(async (): Promise<Product[]> => {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from("products").select(CATALOG_COLUMNS).eq("active", true);
    if (error || !data) {
      console.error("catalog load failed", error?.message ?? "no data");
      return [];
    }
    return data.map(rowToProduct).filter((p): p is Product => Boolean(p));
  } catch (err) {
    console.error("catalog load failed", err instanceof Error ? err.message : "unknown");
    return [];
  }
});

export async function getProduct(idOrSlug: string) {
  const list = await loadActiveProducts();
  return list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function getProducts(ids: string[]) {
  const list = await loadActiveProducts();
  const byId = new Map(list.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

export async function bestsellers() {
  const list = await loadActiveProducts();
  return list.filter((p) => p.tags.includes("bestseller")).sort((a, b) => b.popularity - a.popularity);
}

export async function onSale() {
  const list = await loadActiveProducts();
  return list.filter((p) => p.compareAt && p.compareAt > p.price).sort((a, b) => b.popularity - a.popularity);
}

export async function newest() {
  const list = [...(await loadActiveProducts())].sort((a, b) => b.addedOrder - a.addedOrder);
  return list.filter((p) => p.tags.includes("new")).concat(list.filter((p) => !p.tags.includes("new")));
}

export async function featured() {
  return (await loadActiveProducts()).filter((p) => p.tags.includes("featured"));
}

export async function productsIn(categorySlug: string, subSlug?: string) {
  return (await loadActiveProducts()).filter((p) => p.category === categorySlug && (!subSlug || p.sub === subSlug));
}

export async function productsByBrand(brandSlug: string) {
  return (await loadActiveProducts()).filter((p) => p.brand === brandSlug);
}

export async function complementsFor(product: Product, limit = 5): Promise<Product[]> {
  const list = await loadActiveProducts();
  const byId = new Map(list.map((p) => [p.id, p]));
  const explicit = (product.complements ?? []).map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  const subs = complementRules[product.sub] ?? [];
  const ruled = subs
    .map((sub) => list.filter((p) => p.sub === sub).sort((a, b) => b.popularity - a.popularity)[0])
    .filter((p): p is Product => Boolean(p));
  const seen = new Set<string>([product.id]);
  const out: Product[] = [];
  for (const p of [...explicit, ...ruled]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export async function similarTo(product: Product, limit = 8): Promise<Product[]> {
  return (await loadActiveProducts())
    .filter((p) => p.id !== product.id && (p.sub === product.sub || p.category === product.category))
    .sort((a, b) => Number(b.sub === product.sub) - Number(a.sub === product.sub) || b.popularity - a.popularity)
    .slice(0, limit);
}

export async function productSlugs() {
  return (await loadActiveProducts()).map((p) => p.slug);
}
