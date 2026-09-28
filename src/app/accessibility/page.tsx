import type { Metadata } from "next";
import { LegalReviewBanner } from "@/components/LegalReview";
import { Breadcrumbs } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הצהרת הנגישות של האתר ופרטי רכז/ת הנגישות.",
  alternates: { canonical: "/accessibility" },
};

const done = [
  "האתר בנוי בעברית עם כיווניות מימין לשמאל (RTL) ומבנה כותרות היררכי",
  "ניווט מלא באמצעות מקלדת, כולל קישור \"דילוג לתוכן\"",
  "סימון מיקוד (focus) נראה לעין בכל הרכיבים האינטראקטיביים",
  "ניגודיות צבעים גבוהה וגודל טקסט בסיסי של 16px לפחות",
  "תוויות לשדות טפסים והודעות שגיאה מקושרות לשדות",
  "טקסט חלופי לתמונות ולאייקונים בעלי משמעות",
  "כיבוד הגדרת \"הפחתת תנועה\" של מערכת ההפעלה",
];

export default function AccessibilityPage() {
  return (
    <div className="container-x max-w-3xl pb-14">
      <Breadcrumbs items={[{ name: "הצהרת נגישות" }]} />
      <h1 className="mb-6 text-[28px] font-bold md:text-[36px]">הצהרת נגישות</h1>
      <LegalReviewBanner />
      <div className="prose-he">
        <h2>התאמות שבוצעו באתר</h2>
        <ul>
          {done.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h2>רמת הנגישות</h2>
        <p className="placeholder-note rounded-md p-3 text-sm">[רמת התאמה לתקן הישראלי 5568 / WCAG 2.x ותאריך בדיקה — יש להשלים לאחר בדיקת נגישות מקצועית]</p>
        <h2>נגישות החנות הפיזית</h2>
        <p className="placeholder-note rounded-md p-3 text-sm">[הסדרי נגישות בחנות: חניית נכים, גישה ללא מדרגות, שירותים נגישים — להשלמה על ידי בעל העסק]</p>
        <h2>רכז/ת נגישות</h2>
        <p>
          שם: [שם רכז/ת הנגישות] · טלפון: <bdi>{site.phoneDisplay}</bdi> · אימייל: <bdi>{site.email}</bdi>
        </p>
        <p>נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן.</p>
      </div>
    </div>
  );
}
