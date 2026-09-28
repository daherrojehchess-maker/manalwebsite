import { Breadcrumbs, type Crumb } from "@/components/ui/primitives";
import { categories, type CardProduct } from "@/lib/catalog";
import { buildFacets, CatalogSection } from "./CatalogSection";

export function ListingPage({
  title,
  intro,
  crumbs,
  products,
  relevanceFirst,
  children,
  byCategory = true,
}: {
  title: string;
  intro?: React.ReactNode;
  crumbs: Crumb[];
  products: CardProduct[];
  relevanceFirst?: boolean;
  children?: React.ReactNode;
  byCategory?: boolean;
}) {
  const present = new Set(products.map((p) => p.category));
  const facets = buildFacets(products, byCategory ? { typeKey: "category", typeLabel: "קטגוריה", typeOptions: categories.filter((c) => present.has(c.slug)).map((c) => ({ value: c.slug, label: c.name })) } : {});
  return (
    <div className="container-x">
      <Breadcrumbs items={crumbs} />
      <header className="mb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-[28px] font-bold md:text-[36px]">{title}</h1>
          <span className="num text-[15px] text-muted">{products.length} מוצרים</span>
        </div>
        {intro ? <div className="mt-2 max-w-3xl text-[17px] text-ink-2">{intro}</div> : null}
      </header>
      {children}
      <CatalogSection products={products} facets={facets} relevanceFirst={relevanceFirst} />
    </div>
  );
}
