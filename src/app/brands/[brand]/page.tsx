import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/catalog/ListingPage";
import { brands, getBrand, productsByBrand, toCard } from "@/lib/catalog";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/brands/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) return {};
  return {
    title: `מוצרי ${b.name} (${b.nameHe}) – קטלוג מלא ומחירים`,
    description: `כל מוצרי ${b.nameHe} באתר: ${b.about} משלוחים לכל הארץ ואיסוף עצמי.`,
    alternates: { canonical: `/brands/${b.slug}` },
  };
}

export default async function BrandPage({ params }: PageProps<"/brands/[brand]">) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();
  return (
    <ListingPage
      title={`${b.nameHe} · ${b.name}`}
      intro={b.about}
      crumbs={[{ name: "מותגים", href: "/brands" }, { name: b.nameHe }]}
      products={(await productsByBrand(b.slug)).map(toCard)}
    />
  );
}
