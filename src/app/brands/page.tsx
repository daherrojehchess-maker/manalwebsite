import type { Metadata } from "next";
import { BrandGrid } from "@/components/blocks";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "המותגים שלנו",
  description: "המותגים המובילים בענף הבנייה והשיפוץ: צבע, איטום, כלי עבודה, ברזים ועוד.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <div className="container-x">
      <Breadcrumbs items={[{ name: "מותגים" }]} />
      <h1 className="mb-2 text-[28px] font-bold md:text-[36px]">המותגים שלנו</h1>
      <p className="mb-8 max-w-2xl text-[17px] text-ink-2">בחרו מותג כדי לראות את כל המוצרים שלו באתר.</p>
      <BrandGrid />
    </div>
  );
}
