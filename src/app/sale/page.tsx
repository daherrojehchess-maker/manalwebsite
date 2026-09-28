import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/ListingPage";
import { onSale, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "מבצעים על חומרי בניין וכלי עבודה",
  description: "מבצעים והנחות על צבע, איטום, כלי עבודה, ברזים ועוד. משלוחים לכל הארץ ואיסוף עצמי.",
  alternates: { canonical: "/sale" },
};

export default async function SalePage() {
  return <ListingPage title="המבצעים שלנו" intro="מחירים מיוחדים לזמן מוגבל ועד גמר המלאי." crumbs={[{ name: "מבצעים" }]} products={(await onSale()).map(toCard)} />;
}
