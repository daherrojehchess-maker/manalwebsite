import type { Metadata } from "next";
import { ProjectGrid } from "@/components/blocks";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "פרויקטים – רשימות קנייה לפי עבודה",
  description: "איטום גג, צביעת הבית, שיפוץ אמבטיה, קיר גבס ועוד — שלבי העבודה ורשימת כל המוצרים שצריך.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: "פרויקטים" }]} />
      <h1 className="mb-2 text-[28px] font-bold md:text-[36px]">מה אתם רוצים לעשות?</h1>
      <p className="mb-8 max-w-2xl text-[17px] text-ink-2">בחרו פרויקט וקבלו את שלבי העבודה ורשימת קנייה מלאה: חומרים, כלים ומוצרים משלימים.</p>
      <ProjectGrid />
    </div>
  );
}
