"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import type { CardProduct } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import { actions } from "@/lib/store";

/** "Frequently bought together" — simple products can be added in one click; ones with options link to their page. */
export function Bundle({ items }: { items: CardProduct[] }) {
  const addable = items.filter((p) => !p.hasOptions && p.stock !== "out");
  const [picked, setPicked] = useState<string[]>(addable.map((p) => p.id));
  const total = addable.filter((p) => picked.includes(p.id)).reduce((s, p) => s + p.price, 0);

  if (!items.length) return null;
  return (
    <section className="rounded-xl border border-line bg-white p-5 md:p-7" aria-labelledby="bundle-title">
      <h2 id="bundle-title" className="text-xl font-bold md:text-2xl">
        לקוחות שקנו מוצר זה צריכים בדרך כלל גם:
      </h2>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const canAdd = addable.includes(p);
            const on = picked.includes(p.id);
            return (
              <li key={p.id} className={cn("flex items-center gap-3 rounded-lg border p-3", on ? "border-ink/30" : "border-line")}>
                {canAdd ? (
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setPicked((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                    aria-label={`הוספת ${p.name} לחבילה`}
                    className="size-5 shrink-0 accent-[var(--color-accent)]"
                  />
                ) : (
                  <span className="size-5 shrink-0" aria-hidden />
                )}
                <span className="grid size-16 shrink-0 place-items-center rounded-md bg-stone p-1.5">
                  <ProductArt art={p.art} className="size-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={`/p/${p.slug}`} className="line-clamp-2 text-[15px] font-medium leading-5 hover:text-accent">
                    {p.name}
                  </Link>
                  <span className="mt-1 block text-sm">
                    <bdi className="num font-bold">{formatPrice(p.price)}</bdi>
                    {!canAdd ? <span className="text-muted"> · בחירת אפשרויות בדף המוצר</span> : null}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        {addable.length ? (
          <div className="rounded-lg bg-stone p-5">
            <p className="text-sm text-muted">סה״כ לפריטים שנבחרו ({picked.length})</p>
            <bdi className="num block text-2xl font-bold">{formatPrice(total)}</bdi>
            <button
              type="button"
              disabled={!picked.length}
              onClick={() => {
                for (const p of addable.filter((x) => picked.includes(x.id))) actions.addToCart(p.id, p.name);
              }}
              className="btn btn-primary mt-3 w-full"
            >
              <Plus className="size-5" aria-hidden />
              הוספת הפריטים לעגלה
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
