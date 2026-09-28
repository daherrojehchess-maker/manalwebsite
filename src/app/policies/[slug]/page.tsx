import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalReviewBanner } from "@/components/LegalReview";
import { Breadcrumbs } from "@/components/ui/primitives";
import { getPolicy, policies } from "@/lib/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPolicy(slug);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/policies/${p.slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const p = getPolicy(slug);
  if (!p) notFound();
  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: p.title }]} />
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="מדיניות ותקנונים" className="order-2 lg:order-1">
          <ul className="grid gap-1 text-[15px]">
            {policies.map((x) => (
              <li key={x.slug}>
                <Link href={`/policies/${x.slug}`} aria-current={x.slug === p.slug ? "page" : undefined} className="block rounded-md px-3 py-2 hover:bg-stone aria-[current=page]:bg-ink aria-[current=page]:text-white">
                  {x.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/accessibility" className="block rounded-md px-3 py-2 hover:bg-stone">
                הצהרת נגישות
              </Link>
            </li>
          </ul>
        </nav>
        <article className="order-1 max-w-3xl lg:order-2">
          <h1 className="mb-6 text-[28px] font-bold md:text-[36px]">{p.title}</h1>
          <LegalReviewBanner />
          <div className="grid gap-6">
            {p.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-2 text-xl font-bold">{s.heading}</h2>
                <ul className="list-inside list-disc text-[16px] text-ink-2 marker:text-muted">
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p className="placeholder-note mt-3 rounded-md p-3 text-sm">[נוסח סופי — להשלמה על ידי בעל העסק ועורך דין]</p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
