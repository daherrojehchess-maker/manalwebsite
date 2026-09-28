"use client";

import Link from "next/link";
import { ClipboardList, Heart, ShoppingCart } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/format";

export function CardCartButton({ id, name, slug, hasOptions, outOfStock }: { id: string; name: string; slug: string; hasOptions: boolean; outOfStock: boolean }) {
  if (outOfStock) {
    return (
      <Link href={`/p/${slug}`} className="btn btn-secondary min-h-11 w-full px-3 text-[15px]">
        עדכנו אותי כשחוזר
      </Link>
    );
  }
  if (hasOptions) {
    return (
      <Link href={`/p/${slug}`} className="btn btn-secondary min-h-11 w-full px-3 text-[15px]">
        בחירת אפשרויות
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => actions.addToCart(id, name)} className="btn btn-primary min-h-11 w-full px-3 text-[15px]">
      <ShoppingCart className="size-[18px]" aria-hidden />
      הוספה לעגלה
    </button>
  );
}

export function WishlistButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const active = useStore((s) => s.wishlist.includes(id));
  return (
    <button
      type="button"
      onClick={() => actions.toggleWishlist(id, name)}
      aria-pressed={active}
      aria-label={active ? "הסרה מהמועדפים" : "הוספה למועדפים"}
      className={cn("grid size-9 place-items-center rounded-full bg-white/90 text-ink-2 shadow-sm ring-1 ring-line transition hover:text-accent", className)}
    >
      <Heart className={cn("size-[18px]", active && "fill-accent text-accent")} aria-hidden />
    </button>
  );
}

export function QuoteLinkButton({ id, name, unit }: { id: string; name: string; unit: string }) {
  return (
    <button
      type="button"
      onClick={() => actions.addToQuote({ productId: id, name, unit, qty: 1, note: "" })}
      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ink-2 hover:text-accent"
    >
      <ClipboardList className="size-4" aria-hidden />
      הוספה להצעת מחיר
    </button>
  );
}
