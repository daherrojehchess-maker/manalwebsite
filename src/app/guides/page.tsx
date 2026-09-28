import type { Metadata } from "next";
import { GuideCards } from "@/components/blocks";
import { Breadcrumbs } from "@/components/ui/primitives";
import { guides } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "מדריכים וטיפים – בנייה, שיפוץ ואיטום",
  description: "מדריכים מעשיים: איך בוחרים חומר איטום, דבק לקרמיקה, רולר, סוגי גבס, טיפול ברטיבות ועוד.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: "מדריכים וטיפים" }]} />
      <h1 className="mb-2 text-[28px] font-bold md:text-[36px]">מדריכים וטיפים</h1>
      <p className="mb-8 max-w-2xl text-[17px] text-ink-2">ידע מקצועי שעוזר לבחור נכון ולעבוד נכון — עם קישור ישיר למוצרים שמוזכרים בכל מדריך.</p>
      <GuideCards items={guides} />
    </div>
  );
}
