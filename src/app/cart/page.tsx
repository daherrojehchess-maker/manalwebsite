import type { Metadata } from "next";
import { CartView } from "@/components/commerce/CartView";

export const metadata: Metadata = { title: "עגלת קניות", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-x py-6 md:py-8">
      <h1 className="mb-6 text-[28px] font-bold md:text-[34px]">עגלת קניות</h1>
      <CartView />
    </div>
  );
}
