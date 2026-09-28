"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/format";
import { OPEN_MOBILE_MENU } from "./MobileMenu";

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  if (pathname.startsWith("/checkout")) return null;

  const item = (active: boolean) => cn("relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[12px] font-medium", active ? "text-accent" : "text-ink-2");

  return (
    <nav aria-label="ניווט תחתון" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <Link href="/" className={item(pathname === "/")}>
        <House className="size-[22px]" aria-hidden />
        בית
      </Link>
      <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_MOBILE_MENU))} className={item(pathname.startsWith("/c/"))}>
        <LayoutGrid className="size-[22px]" aria-hidden />
        קטגוריות
      </button>
      <Link href="/search" className={item(pathname.startsWith("/search"))}>
        <Search className="size-[22px]" aria-hidden />
        חיפוש
      </Link>
      <Link href="/cart" className={item(pathname.startsWith("/cart"))}>
        <ShoppingCart className="size-[22px]" aria-hidden />
        עגלה
        {cartCount ? <span className="num absolute top-1.5 left-[calc(50%-22px)] grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{cartCount}</span> : null}
      </Link>
      <Link href="/account" className={item(pathname.startsWith("/account"))}>
        <User className="size-[22px]" aria-hidden />
        חשבון
      </Link>
    </nav>
  );
}
