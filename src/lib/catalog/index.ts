import { brands, getBrand } from "./brands";
import { getCategory, getSub } from "./categories";
import type { Product } from "./types";

export * from "./types";
export * from "./categories";
export { brands, getBrand };
export * from "./discovery";
export {
  loadActiveProducts,
  getProduct,
  getProducts,
  bestsellers,
  onSale,
  newest,
  featured,
  productsIn,
  productsByBrand,
  complementsFor,
  similarTo,
  productSlugs,
} from "./query";

export function brandsInCategory(categorySlug: string, products: Product[]) {
  const set = new Set(products.filter((p) => p.category === categorySlug).map((p) => p.brand).filter(Boolean));
  return brands.filter((b) => set.has(b.slug));
}

export function variantPrice(product: Product, selection: Record<string, string>) {
  let delta = 0;
  for (const opt of product.options ?? []) {
    const v = opt.values.find((x) => x.label === selection[opt.name]);
    delta += v?.priceDelta ?? 0;
  }
  return {
    price: product.price + delta,
    compareAt: product.compareAt ? product.compareAt + delta : undefined,
  };
}

/** Minimal product shape for cards and client-side filtering. */
export type CardProduct = Pick<
  Product,
  "id" | "slug" | "name" | "brand" | "category" | "sub" | "art" | "price" | "compareAt" | "unit" | "variantHint" | "stock" | "tags" | "popularity" | "addedOrder" | "attrs"
> & {
  brandName: string;
  hasOptions: boolean;
};

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    brandName: getBrand(p.brand)?.name ?? "",
    category: p.category,
    sub: p.sub,
    art: p.art,
    price: p.price,
    compareAt: p.compareAt,
    unit: p.unit,
    variantHint: p.variantHint,
    stock: p.stock,
    tags: p.tags,
    popularity: p.popularity,
    addedOrder: p.addedOrder,
    attrs: p.attrs,
    hasOptions: Boolean(p.options?.length),
  };
}

export function productHref(p: Pick<Product, "slug">) {
  return `/p/${p.slug}`;
}

export function categoryHref(category: string, sub?: string) {
  return sub ? `/c/${category}/${sub}` : `/c/${category}`;
}

export function categoryLabel(category: string, sub?: string) {
  const c = getCategory(category);
  if (!c) return "";
  if (!sub) return c.name;
  return getSub(category, sub)?.name ?? c.name;
}
