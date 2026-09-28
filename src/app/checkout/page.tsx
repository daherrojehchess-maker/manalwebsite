import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { CheckoutForm, type PayMethod } from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = { title: "תשלום", robots: { index: false } };

const METHODS: PayMethod[] = ["card", "applepay", "googlepay", "bit"];

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { pay } = await searchParams;
  const initial = METHODS.find((m) => m === pay) ?? "card";
  return (
    <div className="container-x py-6 md:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-[28px] font-bold md:text-[34px]">
          <Lock className="size-6 text-success" aria-hidden />
          תשלום מאובטח
        </h1>
        <Link href="/cart" className="inline-flex items-center gap-1 text-[15px] font-semibold text-accent">
          <ChevronRight className="size-4" aria-hidden />
          חזרה לעגלה
        </Link>
      </div>
      <CheckoutForm initialPay={initial} />
    </div>
  );
}
