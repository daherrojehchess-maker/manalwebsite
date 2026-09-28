"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductCard";
import { useStore } from "@/lib/store";
import { useLineProducts } from "@/lib/useLines";

export function WishlistView() {
  const ids = useStore((s) => s.wishlist);
  const hydrated = useStore((s) => s.hydrated);
  const { items, loading } = useLineProducts(ids);

  if (!hydrated || (loading && !items.length)) return <div className="card h-64 animate-pulse bg-stone" aria-busy="true" />;
  const list = ids.map((id) => items.find((p) => p.id === id)).filter((p) => p !== undefined);
  if (!list.length) {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <Heart className="size-14 text-muted" strokeWidth={1.5} aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">אין עדיין מוצרים שמורים</h2>
        <p className="mt-2 text-muted">לחצו על הלב בכרטיס מוצר כדי לשמור אותו לכאן.</p>
        <Link href="/products" className="btn btn-primary mt-6">
          לכל המוצרים
        </Link>
      </div>
    );
  }
  return <ProductGrid products={list} />;
}
