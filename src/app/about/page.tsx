import type { Metadata } from "next";
import { ContractorCta, Section, StoreInfo, TrustSection } from "@/components/blocks";
import { Breadcrumbs, PlaceholderNote } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description: `${site.name} — ${site.tagline}. ייעוץ מקצועי, מלאי זמין ושירות לאנשי מקצוע ולקוחות פרטיים.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "אודות" }]} />
        <div className="grid gap-8 pb-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-[28px] font-bold md:text-[38px]">{site.name}</h1>
            <p className="mt-2 text-[19px] text-ink-2">{site.tagline}</p>
            <PlaceholderNote className="mt-6 text-[15px]">
              <p className="font-semibold text-ink">[סיפור העסק — להשלמה על ידי בעל העסק]</p>
              <p className="mt-2">מתי ואיך העסק נוסד, מי עומד מאחוריו, [שנות ניסיון] שנות ניסיון, למי אתם משרתים, ומה מייחד אתכם (מלאי, ייעוץ, מחירים לאנשי מקצוע, אספקה מהירה).</p>
            </PlaceholderNote>
          </div>
          <dl className="grid grid-cols-2 gap-3 self-start">
            {[
              [site.yearsExperience, "שנות ניסיון"],
              ["[מספר]", "מוצרים במלאי"],
              ["[מספר]", "מותגים"],
              [site.deliveryAreas, "אזורי משלוח"],
            ].map(([v, l]) => (
              <div key={l} className="card p-5">
                <dt className="text-sm text-muted">{l}</dt>
                <dd className="mt-1 text-xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <TrustSection />
      <ContractorCta />
      <Section tone="stone">
        <StoreInfo />
      </Section>
    </>
  );
}
