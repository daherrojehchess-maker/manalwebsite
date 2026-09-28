import type { Metadata } from "next";
import { QuoteRequestForm } from "@/components/quote/QuoteRequestForm";
import { Breadcrumbs } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "בקשה להצעת מחיר",
  description: "שלחו רשימת חומרים או כתב כמויות וקבלו הצעת מחיר לפרויקט, כולל אספקה לאתר.",
  alternates: { canonical: "/quote/request" },
};

export default function QuoteRequestPage() {
  return (
    <div className="container-x max-w-4xl pb-14">
      <Breadcrumbs items={[{ name: "לקבלנים", href: "/pros" }, { name: "בקשה להצעת מחיר" }]} />
      <h1 className="text-[28px] font-bold md:text-[34px]">בקשה להצעת מחיר</h1>
      <p className="mb-6 mt-2 text-[17px] text-ink-2">מלאו את הפרטים ונחזור אליכם תוך {site.quoteResponseText}. מוצרים שהוספתם לרשימת הצעת המחיר כבר מופיעים בטופס.</p>
      <QuoteRequestForm useList />
    </div>
  );
}
