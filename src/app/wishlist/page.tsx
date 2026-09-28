import type { Metadata } from "next";
import { WishlistView } from "@/components/commerce/WishlistView";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "מועדפים", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: "מועדפים" }]} />
      <h1 className="mb-6 text-[28px] font-bold md:text-[34px]">המועדפים שלי</h1>
      <WishlistView />
    </div>
  );
}
