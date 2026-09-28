import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { GuideCards } from "@/components/blocks";
import { Breadcrumbs, JsonLd, type Crumb } from "@/components/ui/primitives";
import { guides, productsIn, projects, toCard, type Category, type SubCategory } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";
import { buildFacets, CatalogSection } from "./CatalogSection";

export async function CategoryView({ category, sub }: { category: Category; sub?: SubCategory }) {
  const products = (await productsIn(category.slug, sub?.slug)).map(toCard);
  const title = sub ? sub.name : category.name;
  const crumbs: Crumb[] = sub ? [{ name: category.name, href: `/c/${category.slug}` }, { name: sub.name }] : [{ name: category.name }];
  const facets = buildFacets(products, {
    attrKeys: category.filters,
    ...(sub ? {} : { typeKey: "sub" as const, typeLabel: "סוג מוצר", typeOptions: category.subs.map((s) => ({ value: s.slug, label: s.name })) }),
  });
  const relatedProjects = projects.filter((p) => p.categories.some((c) => c.category === category.slug && (!sub || !c.sub || c.sub === sub.slug))).slice(0, 4);
  const relatedGuides = guides.filter((g) => relatedProjects.some((p) => p.guides.includes(g.slug))).slice(0, 3);
  const intro = sub ? `${sub.name} מהמותגים המובילים — ${category.intro}` : category.intro;

  return (
    <div className="container-x">
      <Breadcrumbs items={crumbs} />
      <header className="mb-6 grid gap-3 md:mb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-[28px] font-bold md:text-[36px]">{title}</h1>
          <span className="num text-[15px] text-muted">{products.length} מוצרים</span>
        </div>
        <p className="max-w-3xl text-[17px] text-ink-2">{intro}</p>
      </header>

      <nav aria-label={sub ? `עוד ב${category.name}` : `תתי-קטגוריות של ${category.name}`} className="mb-8">
        <ul className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {sub ? (
            <li className="shrink-0">
              <Link href={`/c/${category.slug}`} className="flex h-12 items-center rounded-full border border-line bg-white px-4 text-[15px] font-medium hover:border-ink">
                כל ה{category.name}
              </Link>
            </li>
          ) : null}
          {category.subs.map((s) => (
            <li key={s.slug} className="shrink-0">
              <Link
                href={`/c/${category.slug}/${s.slug}`}
                aria-current={sub?.slug === s.slug ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center gap-2 rounded-full border pe-4 ps-1.5 text-[15px] font-medium",
                  sub?.slug === s.slug ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                <span className={cn("grid size-9 place-items-center rounded-full p-1", sub?.slug === s.slug ? "bg-white" : "bg-stone")}>
                  <ProductArt art={s.art} className="size-full" />
                </span>
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length ? (
        <CatalogSection products={products} facets={facets} />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-lg font-semibold">המוצרים בקטגוריה זו יעלו לאתר בקרוב</p>
          <p className="mt-1 text-muted">בינתיים אפשר לבקש מחיר וזמינות בטלפון או ב-WhatsApp.</p>
        </div>
      )}

      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="prose-he max-w-3xl">
          {category.seoBody.map((b) => (
            <div key={b.heading}>
              <h2>{b.heading}</h2>
              <p>{b.text}</p>
            </div>
          ))}
          <h2>שאלות נפוצות</h2>
          <div className="not-prose divide-y divide-line rounded-lg border border-line bg-white">
            {category.faq.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
                <p className="mt-2 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        {relatedProjects.length ? (
          <aside>
            <h2 className="mb-3 text-lg font-bold">פרויקטים קשורים</h2>
            <ul className="grid gap-2">
              {relatedProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="card flex items-center gap-3 p-3 hover:border-ink">
                    <span className="grid size-12 place-items-center rounded-md bg-stone p-1">
                      <ProductArt art={p.art} className="size-full" />
                    </span>
                    <span className="font-semibold">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </section>

      {relatedGuides.length ? (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold">מדריכים שכדאי לקרוא</h2>
          <GuideCards items={relatedGuides} />
        </section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: category.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          itemListElement: products.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/p/${p.slug}`, name: p.name })),
        }}
      />
    </div>
  );
}
