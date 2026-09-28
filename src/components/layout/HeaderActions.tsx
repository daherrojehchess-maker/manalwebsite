"use client";

import Link from "next/link";
import { ClipboardList, Heart, Phone, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { phoneHref, site } from "@/lib/site";

function Count({ n }: { n: number }) {
  if (!n) return null;
  return <span className="num absolute -top-1 -left-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{n > 99 ? "99+" : n}</span>;
}

export function HeaderActions() {
  const cartCount = useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const quoteCount = useStore((s) => s.quote.length);
  const wishCount = useStore((s) => s.wishlist.length);
  const item = "relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-ink-2 hover:bg-stone hover:text-ink";
  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      <a href={phoneHref()} className="me-2 hidden items-center gap-2 rounded-md px-2 py-1 hover:bg-stone xl:flex">
        <Phone className="size-5 text-accent" aria-hidden />
        <span className="flex flex-col leading-tight">
          <span className="text-[12px] text-muted">הזמנות וייעוץ</span>
          <bdi className="text-[15px] font-bold">{site.phoneDisplay}</bdi>
        </span>
      </a>
      <Link href="/account" className={`${item} hidden md:flex`} aria-label="החשבון שלי">
        <User className="size-[22px]" aria-hidden />
        <span className="text-[12px] font-medium">חשבון</span>
      </Link>
      <Link href="/wishlist" className={`${item} hidden md:flex`} aria-label={`מועדפים${wishCount ? ` (${wishCount})` : ""}`}>
        <Heart className="size-[22px]" aria-hidden />
        <span className="text-[12px] font-medium">מועדפים</span>
        <Count n={wishCount} />
      </Link>
      {quoteCount ? (
        <Link href="/quote" className={item} aria-label={`רשימת הצעת מחיר (${quoteCount})`}>
          <ClipboardList className="size-[22px]" aria-hidden />
          <span className="hidden text-[12px] font-medium md:block">הצעת מחיר</span>
          <Count n={quoteCount} />
        </Link>
      ) : null}
      <Link href="/cart" className={item} aria-label={`עגלת קניות${cartCount ? ` (${cartCount} פריטים)` : ""}`}>
        <ShoppingCart className="size-[22px]" aria-hidden />
        <span className="hidden text-[12px] font-medium md:block">עגלה</span>
        <Count n={cartCount} />
      </Link>
    </div>
  );
}
