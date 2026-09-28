import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { GuideCards, ProductRail } from "@/components/blocks";
import { ProductPurchase } from "@/components/product/BuyBox";
import { Bundle } from "@/components/product/Bundle";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Breadcrumbs, JsonLd } from "@/components/ui/primitives";
import { complementsFor, getBrand, getCategory, getProduct, getSub, guides, similarTo, toCard } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const brand = getBrand(p.brand);
  return {
    title: `${p.name}${brand ? ` ${brand.name}` : ""} – ${formatPrice(p.price)}`,
    description: `${p.short} משלוח לכל הארץ או איסוף עצמי. ייעוץ מקצועי ב-WhatsApp.`,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { type: "website", title: p.name, description: p.short },
  };
}

const sectionsNav = [
  ["description", "תיאור"],
  ["benefits", "יתרונות"],
  ["uses", "שימושים"],
  ["specs", "מפרט טכני"],
  ["how-to", "הוראות שימוש"],
  ["faq", "שאלות נפוצות"],
] as const;

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const brand = getBrand(p.brand);
  const cat = getCategory(p.category)!;
  const sub = getSub(p.category, p.sub);
  const complements = await complementsFor(p, 6);
  const similar = await similarTo(p, 10);
  const relatedGuides = guides.filter((g) => g.productIds.includes(p.id) || g.productIds.some((id) => similar.slice(0, 3).some((s) => s.id === id))).slice(0, 3);
  const url = `${site.url}/p/${p.slug}`;

  return (
    <div className="container-x">
      <Breadcrumbs items={[{ name: cat.name, href: `/c/${cat.slug}` }, ...(sub ? [{ name: sub.name, href: `/c/${cat.slug}/${sub.slug}` }] : []), { name: p.name }]} />

      <ProductPurchase
        id={p.id}
        name={p.name}
        sku={p.sku}
        url={url}
        brandName={brand?.name ?? ""}
        art={p.art}
        price={p.price}
        compareAt={p.compareAt}
        unit={p.unit}
        stock={p.stock}
        options={p.options ?? []}
      />

      <p className="mt-6 max-w-3xl text-[17px] text-ink-2 lg:hidden">{p.short}</p>

      {complements.length ? (
        <div className="mt-12">
          <Bundle items={complements.map(toCard)} />
        </div>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="תוכן הדף" className="hidden lg:block">
          <ul className="sticky top-24 grid gap-1 border-s-2 border-line">
            {sectionsNav.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="-ms-0.5 block border-s-2 border-transparent px-4 py-2 text-[15px] text-ink-2 hover:border-ink hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl space-y-12">
          <section id="description" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">תיאור</h2>
            <p className="text-[17px] leading-8 text-ink-2">{p.description}</p>
          </section>
          <section id="benefits" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">יתרונות</h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[16px]">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-4" aria-hidden />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </section>
          <section id="uses" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">שימושים</h2>
            <ul className="list-disc space-y-1.5 ps-5 text-[16px] text-ink-2 marker:text-accent">
              {p.uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </section>
          <section id="specs" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">מפרט טכני</h2>
            <table className="w-full overflow-hidden rounded-lg border border-line bg-white text-[15px]">
              <tbody>
                {[["מותג", brand?.name ?? "—"] as [string, string], ["מק״ט", p.sku] as [string, string], ...p.specs].map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-stone/50" : ""}>
                    <th scope="row" className="w-2/5 px-4 py-3 text-start font-semibold">
                      {k}
                    </th>
                    <td className="px-4 py-3 text-ink-2">
                      <bdi>{v}</bdi>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[13px] text-muted">הנתונים לדוגמה. יש להסתמך על הוראות היצרן ועל גיליון המוצר הרשמי.</p>
          </section>
          <section id="how-to" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">הוראות שימוש</h2>
            <ol className="grid gap-3">
              {p.howTo.map((s, i) => (
                <li key={s} className="flex gap-3 text-[16px]">
                  <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                  <span className="pt-0.5 text-ink-2">{s}</span>
                </li>
              ))}
            </ol>
          </section>
          <section id="faq" className="scroll-mt-28">
            <h2 className="mb-3 text-2xl font-bold">שאלות נפוצות</h2>
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {p.faq.map((f) => (
                <details key={f.q} className="px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                  <p className="mt-2 text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-4 text-[15px] text-muted">
              יש לכם שאלה נוספת?{" "}
              <Link href="/store" className="font-semibold text-accent underline">
                צרו איתנו קשר
              </Link>
            </p>
          </section>
        </div>
      </div>

      {complements.length ? (
        <section className="mt-16">
          <ProductRail title="מוצרים משלימים" products={complements} />
        </section>
      ) : null}
      <section className="mt-14">
        <ProductRail title="מוצרים דומים" products={similar} href={`/c/${cat.slug}${sub ? `/${sub.slug}` : ""}`} />
      </section>
      {relatedGuides.length ? (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold md:text-[30px]">מדריכים קשורים</h2>
          <GuideCards items={relatedGuides} />
        </section>
      ) : null}
      <RecentlyViewed excludeId={p.id} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          sku: p.sku,
          description: p.short,
          ...(brand ? { brand: { "@type": "Brand", name: brand.name } } : {}),
          category: sub?.name ?? cat.name,
          url,
          offers: {
            "@type": "Offer",
            priceCurrency: "ILS",
            price: p.price,
            availability: p.stock === "out" ? "https://schema.org/OutOfStock" : p.stock === "low" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
            url,
            seller: { "@type": "Organization", name: site.name },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </div>
  );
}
