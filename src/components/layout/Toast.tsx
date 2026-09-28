"use client";

import Link from "next/link";
import { CircleCheck, X } from "lucide-react";
import { actions, useStore } from "@/lib/store";

const copy = {
  cart: { title: "נוסף לעגלה", href: "/cart", cta: "לעגלה ולתשלום" },
  quote: { title: "נוסף לרשימת הצעת המחיר", href: "/quote", cta: "לרשימה" },
  wishlist: { title: "נשמר במועדפים", href: "/wishlist", cta: "למועדפים" },
};

export function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;
  const c = copy[toast.kind];
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-3 bottom-[76px] z-50 mx-auto max-w-md rounded-lg border border-line bg-white p-4 shadow-[var(--shadow-drawer)] lg:inset-x-auto lg:bottom-auto lg:left-6 lg:top-6 lg:w-[380px]">
      <div className="flex items-start gap-3">
        <CircleCheck className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{c.title}</p>
          <p className="line-clamp-1 text-sm text-muted">{toast.title}</p>
        </div>
        <button type="button" onClick={actions.dismissToast} className="grid size-8 place-items-center rounded-md text-muted hover:bg-stone" aria-label="סגירה">
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Link href={c.href} onClick={actions.dismissToast} className="btn btn-primary min-h-11 flex-1">
          {c.cta}
        </Link>
        <button type="button" onClick={actions.dismissToast} className="btn btn-secondary min-h-11 flex-1">
          המשך קנייה
        </button>
      </div>
    </div>
  );
}
