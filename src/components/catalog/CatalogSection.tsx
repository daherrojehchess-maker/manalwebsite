import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { getBrand, type CardProduct } from "@/lib/catalog";
import { CatalogBrowser, type Facets } from "./CatalogBrowser";

export function buildFacets(products: CardProduct[], opts: Partial<Facets> = {}): Facets {
  const brandSlugs = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  return {
    brandOptions: brandSlugs.map((b) => ({ value: b, label: getBrand(b)?.name ?? b })).sort((a, b) => a.label.localeCompare(b.label)),
    attrKeys: [],
    ...opts,
  };
}

/** Client filtering with a server-rendered grid as the crawlable fallback. */
export function CatalogSection({ products, facets, relevanceFirst, showQuote }: { products: CardProduct[]; facets: Facets; relevanceFirst?: boolean; showQuote?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="lg:ps-[304px]">
          <ProductGrid products={products} showQuote={showQuote} />
        </div>
      }
    >
      <CatalogBrowser products={products} facets={facets} relevanceFirst={relevanceFirst} showQuote={showQuote} />
    </Suspense>
  );
}
