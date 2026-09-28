import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/art/ProductArt";
import { GuideCards, Section } from "@/components/blocks";
import { ProductGrid } from "@/components/product/ProductCard";
import { Breadcrumbs, JsonLd, WhatsAppIcon } from "@/components/ui/primitives";
import { getGuide, getProducts, getProject, guides, toCard } from "@/lib/catalog";
import { site, whatsappHref } from "@/lib/site";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return { title: g.title, description: g.excerpt, alternates: { canonical: `/guides/${g.slug}` }, openGraph: { type: "article", title: g.title, description: g.excerpt } };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const items = (await getProducts(g.productIds)).map(toCard);
  const related = g.projects.map(getProject).filter((x) => x !== undefined);
  const more = guides.filter((x) => x.slug !== g.slug && x.category === g.category).concat(guides.filter((x) => x.slug !== g.slug && x.category !== g.category)).slice(0, 3);

  return (
    <>
      <article className="container-x">
        <Breadcrumbs items={[{ name: "מדריכים וטיפים", href: "/guides" }, { name: g.title }]} />
        <div className="grid gap-10 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-3xl">
            <p className="eyebrow">
              {g.category} · {g.readMinutes} דק׳ קריאה
            </p>
            <h1 className="mt-2 text-[28px] font-bold leading-tight md:text-[40px]">{g.title}</h1>
            <p className="mt-3 text-[18px] text-ink-2">{g.excerpt}</p>
            <div className="mt-6 grid aspect-[16/7] place-items-center rounded-xl bg-stone p-8">
              <ProductArt art={g.art} className="h-full max-h-56" />
            </div>
            <nav aria-label="תוכן המדריך" className="mt-8 rounded-lg border border-line bg-white p-5">
              <p className="mb-2 font-bold">במדריך:</p>
              <ol className="grid list-inside list-decimal gap-1 text-[16px]">
                {g.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#s-${i}`} className="hover:underline">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="prose-he mt-8">
              {g.sections.map((s, i) => (
                <section key={s.heading} id={`s-${i}`} className="scroll-mt-28">
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                </section>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted">המידע במדריך כללי ואינו מחליף את הוראות היצרן. לפני עבודה יש לקרוא את הוראות השימוש והבטיחות של כל מוצר.</p>
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-5">
              <p className="font-bold">צריכים עזרה בבחירה?</p>
              <p className="mt-1 text-[15px] text-muted">שלחו תמונה ותיאור קצר, ונמליץ על המוצר המתאים.</p>
              <a href={whatsappHref(`היי, קראתי את המדריך "${g.title}" ויש לי שאלה`)} target="_blank" rel="noopener" className="btn btn-whatsapp mt-4 w-full">
                <WhatsAppIcon className="size-5" />
                ייעוץ ב-WhatsApp
              </a>
            </div>
            {related.length ? (
              <div className="card p-5">
                <p className="mb-2 font-bold">רשימות קנייה לפרויקט</p>
                <ul className="grid gap-1.5">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/projects/${p.slug}`} className="text-accent hover:underline">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </article>
      {items.length ? (
        <Section tone="white">
          <h2 className="mb-5 text-2xl font-bold">מוצרים שמוזכרים במדריך</h2>
          <ProductGrid products={items} />
        </Section>
      ) : null}
      <Section tone="stone">
        <h2 className="mb-5 text-2xl font-bold">מדריכים נוספים</h2>
        <GuideCards items={more} />
      </Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.excerpt,
          inLanguage: "he-IL",
          mainEntityOfPage: `${site.url}/guides/${g.slug}`,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
    </>
  );
}
