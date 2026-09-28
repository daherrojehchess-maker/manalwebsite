import type { Metadata } from "next";
import { QuoteList } from "@/components/quote/QuoteList";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "רשימת הצעת מחיר", robots: { index: false } };

export default function QuotePage() {
  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: "לקבלנים", href: "/pros" }, { name: "רשימת הצעת מחיר" }]} />
      <h1 className="mb-6 text-[28px] font-bold md:text-[34px]">רשימת הצעת מחיר</h1>
      <QuoteList />
    </div>
  );
}
