import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/ListingPage";
import { loadActiveProducts, toCard } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "חדשים באתר",
  description: "המוצרים החדשים ביותר באתר — כלים, חומרים ואביזרים שהצטרפו לאחרונה.",
  alternates: { canonical: "/new" },
};

export default async function NewPage() {
  const products = await loadActiveProducts();
  const list = products.filter((p) => p.tags.includes("new")).map(toCard);
  return <ListingPage title="חדשים באתר" crumbs={[{ name: "חדשים באתר" }]} products={list} />;
}
