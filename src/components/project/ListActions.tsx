"use client";

import { ClipboardList, ShoppingCart } from "lucide-react";
import { actions } from "@/lib/store";

export type ListItem = { id: string; name: string; unit: string; selection: Record<string, string>; available: boolean };

export function ListActions({ items, label }: { items: ListItem[]; label: string }) {
  const buyable = items.filter((i) => i.available);
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        className="btn btn-primary"
        disabled={!buyable.length}
        onClick={() => {
          for (const i of buyable) actions.addToCart(i.id, `${buyable.length} מוצרים לפרויקט ${label}`, 1, i.selection);
        }}
      >
        <ShoppingCart className="size-5" aria-hidden />
        הוספת הרשימה לעגלה
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          for (const i of items) actions.addToQuote({ productId: i.id, name: `${items.length} מוצרים לפרויקט ${label}`, selection: i.selection, unit: i.unit, qty: 1, note: "" });
        }}
      >
        <ClipboardList className="size-5" aria-hidden />
        הוספה לרשימת הצעת מחיר
      </button>
    </div>
  );
}
