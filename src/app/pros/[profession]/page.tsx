import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ContractorCta, ProjectGrid, Section } from "@/components/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/primitives";
import { categoryHref, categoryLabel, getProducts, getProfession, getProject, professions, toCard } from "@/lib/catalog";

export function generateStaticParams() {
  return professions.map((p) => ({ profession: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pros/[profession]">): Promise<Metadata> {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) return {};
  return {
    title: `מוצרים ל${p.title} – חומרים, כלים ומחירים לאנשי מקצוע`,
    description: p.intro,
    alternates: { canonical: `/pros/${p.slug}` },
  };
}

export default async function ProfessionPage({ params }: PageProps<"/pros/[profession]">) {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) notFound();
  const items = (await getProducts(p.productIds)).map(toCard);
  const related = p.projects.map(getProject).filter((x) => x !== undefined);

  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "לקבלנים ואנשי מקצוע", href: "/pros" }, { name: p.title }]} />
        <header className="pb-6">
          <p className="eyebrow">{p.name}</p>
          <h1 className="mt-1 text-[28px] font-bold md:text-[38px]">מוצרים ל{p.title}</h1>
          <p className="mt-3 max-w-2xl text-[17px] text-ink-2">{p.intro}</p>
        </header>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {p.categories.map((c) => (
            <li key={`${c.category}/${c.sub ?? ""}`}>
              <Link href={categoryHref(c.category, c.sub)} className="card flex h-full items-center justify-between gap-2 p-4 font-bold hover:border-ink">
                {categoryLabel(c.category, c.sub)}
                <ChevronLeft className="size-5 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Section>
        <h2 className="mb-5 text-2xl font-bold">המוצרים המבוקשים ביותר</h2>
        <ProductGrid products={items} showQuote />
      </Section>
      {related.length ? (
        <Section tone="stone">
          <h2 className="mb-5 text-2xl font-bold">פרויקטים נפוצים</h2>
          <ProjectGrid items={related} />
        </Section>
      ) : null}
      <ContractorCta />
    </>
  );
}
