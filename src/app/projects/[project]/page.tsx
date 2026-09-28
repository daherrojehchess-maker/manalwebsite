import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCards, Section } from "@/components/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { ListActions, type ListItem } from "@/components/project/ListActions";
import { Breadcrumbs, WhatsAppIcon } from "@/components/ui/primitives";
import { categoryHref, categoryLabel, getGuide, getProducts, getProject, projects, toCard, type Product } from "@/lib/catalog";
import { whatsappHref } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ project: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[project]">): Promise<Metadata> {
  const { project } = await params;
  const p = getProject(project);
  if (!p) return {};
  return {
    title: `${p.name} – שלבי עבודה ורשימת קנייה`,
    description: `${p.intro} כל החומרים והכלים ל${p.name} במקום אחד.`,
    alternates: { canonical: `/projects/${p.slug}` },
  };
}

function toListItem(p: Product): ListItem {
  return {
    id: p.id,
    name: p.name,
    unit: p.unit,
    available: p.stock !== "out",
    selection: Object.fromEntries((p.options ?? []).map((o) => [o.name, o.values[0].label])),
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[project]">) {
  const { project } = await params;
  const p = getProject(project);
  if (!p) notFound();

  const groups = [
    { title: "חומרים נדרשים", items: await getProducts(p.required) },
    { title: "מומלץ להוסיף", items: await getProducts(p.recommended) },
    { title: "כלים", items: await getProducts(p.tools) },
    { title: "מוצרים משלימים", items: await getProducts(p.complementary) },
  ].filter((g) => g.items.length);
  const all = groups.flatMap((g) => g.items);
  const guides = p.guides.map(getGuide).filter((g) => g !== undefined);

  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "פרויקטים", href: "/projects" }, { name: p.name }]} />
        <header className="grid gap-6 pb-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <p className="eyebrow">פרויקט</p>
            <h1 className="mt-1 text-[28px] font-bold md:text-[38px]">{p.name}</h1>
            <p className="mt-3 max-w-2xl text-[17px] text-ink-2">{p.intro}</p>
            <div className="mt-6">
              <ListActions items={all.map(toListItem)} label={p.name} />
            </div>
          </div>
          <div className="card p-5 md:p-6">
            <h2 className="text-lg font-bold">שלבי העבודה</h2>
            <ol className="mt-4 grid gap-3">
              {p.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[16px]">
                  <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </header>
      </div>

      {groups.map((g, i) => (
        <Section key={g.title} tone={i % 2 ? "white" : "default"} className="!py-8">
          <h2 className="mb-5 text-xl font-bold md:text-2xl">
            {g.title} <span className="num text-base font-normal text-muted">({g.items.length})</span>
          </h2>
          <ProductGrid products={g.items.map(toCard)} showQuote />
        </Section>
      ))}

      <Section>
        <div className="flex flex-col gap-5 rounded-xl bg-accent-soft p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-xl font-bold">לא בטוחים בכמויות?</h2>
            <p className="mt-1 text-ink-2">שלחו לנו מידות ותמונה של השטח — ונעזור לחשב כמה צריך.</p>
          </div>
          <a href={whatsappHref(`היי, אני מתכנן/ת ${p.name} ואשמח לעזרה בחישוב כמויות`)} target="_blank" rel="noopener" className="btn btn-whatsapp">
            <WhatsAppIcon className="size-5" />
            ייעוץ ב-WhatsApp
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="me-1 self-center font-semibold">קטגוריות קשורות:</span>
          {p.categories.map((c) => (
            <Link key={`${c.category}/${c.sub ?? ""}`} href={categoryHref(c.category, c.sub)} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-line hover:ring-ink">
              {categoryLabel(c.category, c.sub)}
            </Link>
          ))}
        </div>
      </Section>

      {guides.length ? (
        <Section tone="stone">
          <h2 className="mb-6 text-2xl font-bold">מדריכים לפרויקט</h2>
          <GuideCards items={guides} />
        </Section>
      ) : null}
    </>
  );
}
