import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/catalog/CategoryView";
import { categories, getCategory, getSub } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subs.map((s) => ({ category: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/c/[category]/[sub]">): Promise<Metadata> {
  const { category, sub } = await params;
  const c = getCategory(category);
  const s = getSub(category, sub);
  if (!c || !s) return {};
  return {
    title: `${s.name} – ${c.name} במחירים משתלמים`,
    description: `${s.name} מהמותגים המובילים. ייעוץ מקצועי, משלוחים לכל הארץ ואיסוף עצמי. מחירים מיוחדים לקבלנים.`,
    alternates: { canonical: `/c/${c.slug}/${s.slug}` },
  };
}

export default async function SubCategoryPage({ params }: PageProps<"/c/[category]/[sub]">) {
  const { category, sub } = await params;
  const c = getCategory(category);
  const s = getSub(category, sub);
  if (!c || !s) notFound();
  return <CategoryView category={c} sub={s} />;
}
