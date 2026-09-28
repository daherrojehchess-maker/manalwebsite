import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/ListingPage";
import { loadActiveProducts, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "כל המוצרים – חומרי בניין, שיפוץ וכלי עבודה",
  description: "כל המוצרים באתר: חומרי בניין, צבע, איטום, גבס, אינסטלציה, חשמל, כלי עבודה ועוד. סינון לפי מותג, מחיר וזמינות.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await loadActiveProducts();
  return <ListingPage title="כל המוצרים" intro="כל הקטלוג במקום אחד. סננו לפי קטגוריה, מותג, מחיר וזמינות." crumbs={[{ name: "כל המוצרים" }]} products={products.map(toCard)} />;
}
