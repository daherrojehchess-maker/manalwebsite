import type { Metadata } from "next";
import { BadgePercent, Building2, ClipboardList, FileText, Truck, UserCheck } from "lucide-react";
import { ProfessionGrid, Section } from "@/components/blocks";
import { QuoteRequestForm } from "@/components/quote/QuoteRequestForm";
import { Breadcrumbs, WhatsAppIcon } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "לקבלנים ואנשי מקצוע – מחירים לפרויקטים",
  description: "מחירים מיוחדים לקבלנים, שיפוצניקים ואנשי מקצוע. שלחו כתב כמויות וקבלו הצעת מחיר מסודרת עם אספקה לאתר.",
  alternates: { canonical: "/pros" },
};

const audience = ["קבלנים", "חברות בנייה", "שיפוצניקים", "בעלי מקצוע", "לקוחות מוסדיים", "רכש בכמויות", "פרויקטים גדולים"];

const benefits = [
  { icon: BadgePercent, title: "תמחור לפי כמות", text: "מחירים מותאמים להיקף ההזמנה ולפרויקט." },
  { icon: Truck, title: "אספקה לאתר", text: `תיאום משלוחים לאתר העבודה ב${site.deliveryAreas}.` },
  { icon: UserCheck, title: "איש קשר קבוע", text: "נציג שמכיר את הפרויקטים שלכם וזמין בטלפון וב-WhatsApp." },
  { icon: FileText, title: "חשבוניות מסודרות", text: "חשבונית מס על שם העסק לכל הזמנה." },
];

const steps = [
  { icon: ClipboardList, title: "שולחים רשימה", text: "ממלאים טופס, מצרפים כתב כמויות או מוסיפים מוצרים ל\"רשימת הצעת מחיר\" באתר." },
  { icon: FileText, title: "מקבלים הצעה", text: `הצעת מחיר מסודרת תוך ${site.quoteResponseText}.` },
  { icon: Building2, title: "מאשרים ומקבלים", text: "איסוף מהחנות או אספקה ישירה לאתר." },
];

export default function ProsPage() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "לקבלנים ואנשי מקצוע" }]} />
      </div>
      <section className="pb-4">
        <div className="container-x">
          <div className="grid gap-8 rounded-xl bg-ink px-6 py-10 text-white md:px-12 md:py-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#8FB3DA]">לקבלנים ואנשי מקצוע</p>
              <h1 className="text-[30px] font-bold leading-tight md:text-[42px]">מחירים מיוחדים לפרויקטים ולעבודה מקצועית</h1>
              <p className="mt-4 max-w-xl text-[17px] text-white/75">אנחנו עובדים עם אנשי מקצוע מהזמנה של כמה שקים ועד אספקה לפרויקט שלם. שלחו רשימה — ונחזור עם הצעת מחיר.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#quote-form" className="btn btn-primary min-h-13 text-[17px]">
                  קבלת הצעת מחיר
                </a>
                <a href={whatsappHref("היי, אני איש מקצוע ואשמח לקבל הצעת מחיר")} target="_blank" rel="noopener" className="btn min-h-13 border-[1.5px] border-white/40 text-white hover:bg-white/10">
                  <WhatsAppIcon className="size-5" />
                  WhatsApp לאנשי מקצוע
                </a>
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold text-white/80">עובדים עם:</p>
              <ul className="flex flex-wrap gap-2">
                {audience.map((a) => (
                  <li key={a} className="rounded-full border border-white/20 px-3.5 py-1.5 text-[15px]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-5">
              <Icon className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
              <p className="mt-3 text-lg font-bold">{title}</p>
              <p className="mt-1 text-[15px] text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <h2 className="mb-6 text-2xl font-bold md:text-[30px]">איך זה עובד</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4">
              <span className="num grid size-11 shrink-0 place-items-center rounded-full bg-accent text-lg font-bold text-white">{i + 1}</span>
              <span>
                <span className="flex items-center gap-2 text-lg font-bold">
                  <Icon className="size-5 text-muted" aria-hidden /> {title}
                </span>
                <span className="mt-1 block text-[15px] text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="quote-form" className="scroll-mt-24">
        <h2 className="mb-2 text-2xl font-bold md:text-[30px]">בקשה להצעת מחיר</h2>
        <p className="mb-6 text-muted">ככל שהרשימה מפורטת יותר — ההצעה מדויקת יותר. אפשר גם לצרף קובץ.</p>
        <QuoteRequestForm />
      </Section>

      <Section tone="stone">
        <ProfessionGrid />
      </Section>
    </>
  );
}
