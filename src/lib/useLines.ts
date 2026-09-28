"use client";

import { useEffect, useState } from "react";
import type { CardProduct, ProductOption } from "@/lib/catalog";

export type LineProduct = CardProduct & { sku: string; options: ProductOption[] };

type Result = { items: LineProduct[]; suggestions: CardProduct[]; loading: boolean };

/** Loads product data for store lines (cart, quote, wishlist). */
export function useLineProducts(ids: string[], suggest = false): Result {
  const key = Array.from(new Set(ids)).sort().join(",");
  const [data, setData] = useState<{ key: string; items: LineProduct[]; suggestions: CardProduct[] }>({ key: "", items: [], suggestions: [] });

  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    fetch(`/api/lines?ids=${encodeURIComponent(key)}${suggest ? "&suggest=1" : ""}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { items: [], suggestions: [] }))
      .then((d) => setData({ key, ...d }))
      .catch(() => {});
    return () => ctrl.abort();
  }, [key, suggest]);

  if (!key) return { items: [], suggestions: [], loading: false };
  return { items: data.items, suggestions: data.suggestions, loading: data.key !== key };
}

export function unitPrice(p: Pick<LineProduct, "price" | "options">, selection: Record<string, string> = {}) {
  let delta = 0;
  for (const o of p.options) {
    const v = o.values.find((x) => x.label === selection[o.name]);
    if (v?.priceDelta) delta += v.priceDelta;
  }
  return p.price + delta;
}
