"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/primitives";
import type { CardProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { Rail, RailItem } from "./Rail";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const recent = useStore((s) => s.recent);
  const ids = recent.filter((id) => id !== excludeId).slice(0, 10);
  const key = ids.join(",");
  const [items, setItems] = useState<CardProduct[]>([]);

  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    fetch(`/api/cards?ids=${encodeURIComponent(key)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]);

  if (!key || !items.length) return null;
  return (
    <section className="mt-14">
      <SectionHeader title="נצפו לאחרונה" />
      <Rail label="נצפו לאחרונה">
        {items.map((p) => (
          <RailItem key={p.id}>
            <ProductCard product={p} />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
