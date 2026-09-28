import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/catalog/CategoryView";
import { categories, getCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return { title: c.seoTitle, description: c.seoDescription, alternates: { canonical: `/c/${c.slug}` } };
}

export default async function CategoryPage({ params }: PageProps<"/c/[category]">) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  return <CategoryView category={c} />;
}
