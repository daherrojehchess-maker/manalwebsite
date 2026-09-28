"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, Lock, ShoppingCart, Store, Trash2, Truck } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { ProductCard } from "@/components/product/ProductCard";
import { Rail, RailItem } from "@/components/product/Rail";
import { SectionHeader } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { actions, useStore } from "@/lib/store";
import { computeTotals } from "@/lib/totals";
import { unitPrice, useLineProducts } from "@/lib/useLines";
import { ExpressPay } from "./ExpressPay";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const { items, suggestions, loading } = useLineProducts(
    cart.map((l) => l.productId),
    true,
  );
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  if (!hydrated || (loading && !items.length)) {
    return <div className="card h-64 animate-pulse bg-stone" aria-busy="true" aria-label="טוען עגלה" />;
  }

  if (!cart.length) {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <ShoppingCart className="size-14 text-muted" strokeWidth={1.5} aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">העגלה ריקה</h2>
        <p className="mt-2 text-muted">חפשו מוצר או התחילו מהקטגוריות הפופולריות.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-primary">
            לכל המוצרים
          </Link>
          <Link href="/sale" className="btn btn-secondary">
            למבצעים
          </Link>
        </div>
      </div>
    );
  }

  const byId = new Map(items.map((p) => [p.id, p]));
  const lines = cart.map((l) => ({ line: l, product: byId.get(l.productId) })).filter((x) => x.product);
  const subtotal = lines.reduce((sum, { line, product }) => sum + unitPrice(product!, line.selection) * line.qty, 0);
  const t = computeTotals(subtotal);
  const count = cart.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          {t.threshold !== null ? (
            <div className="mb-4 rounded-lg bg-accent-soft p-4">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <Truck className="size-5 text-accent" aria-hidden />
                {t.remainingForFree ? (
                  <>
                    עוד <span className="num">{formatPrice(t.remainingForFree)}</span> למשלוח חינם
                  </>
                ) : (
                  "מגיע לכם משלוח חינם!"
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={t.threshold} aria-valuenow={Math.min(subtotal, t.threshold)} aria-label="התקדמות למשלוח חינם">
                <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${Math.min(100, (subtotal / t.threshold) * 100)}%` }} />
              </div>
            </div>
          ) : null}
          <ul className="card divide-y divide-line">
            {lines.map(({ line, product: p }) => {
              const price = unitPrice(p!, line.selection);
              const sel = Object.entries(line.selection);
              return (
                <li key={line.key} className="flex gap-4 p-4">
                  <Link href={`/p/${p!.slug}`} className="grid size-24 shrink-0 place-items-center rounded-md bg-stone p-2 md:size-28">
                    <ProductArt art={p!.art} className="size-full" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-muted">{p!.brandName}</p>
                        <Link href={`/p/${p!.slug}`} className="line-clamp-2 font-semibold leading-snug hover:text-accent">
                          {p!.name}
                        </Link>
                        {sel.length ? <p className="mt-0.5 text-sm text-ink-2">{sel.map(([k, v]) => `${k}: ${v}`).join(" · ")}</p> : null}
                        <p className="mt-0.5 text-[13px] text-muted">
                          מק״ט <bdi className="num">{p!.sku}</bdi>
                        </p>
                      </div>
                      <p className="num shrink-0 text-lg font-bold">{formatPrice(price * line.qty)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                      <QtyStepper value={line.qty} onChange={(v) => actions.setCartQty(line.key, v)} label={p!.name} />
                      <div className="flex items-center gap-1">
                        <span className="num me-2 text-sm text-muted">
                          {formatPrice(price)} / {p!.unit}
                        </span>
                        <button type="button" onClick={() => actions.removeFromCart(line.key)} className="grid size-10 place-items-center rounded-md text-muted hover:bg-stone hover:text-danger" aria-label={`הסרת ${p!.name} מהעגלה`}>
                          <Trash2 className="size-5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                for (const { line, product } of lines) actions.addToQuote({ productId: line.productId, name: `${lines.length} מוצרים מהעגלה`, selection: line.selection, unit: product!.unit, qty: line.qty, note: "" });
              }}
            >
              <ClipboardList className="size-5" aria-hidden />
              העברה לרשימת הצעת מחיר
            </button>
            <Link href="/products" className="btn btn-light">
              המשך קנייה
            </Link>
          </div>
        </div>

        <aside className="card flex flex-col gap-4 p-5 md:p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">סיכום הזמנה</h2>
          <dl className="grid gap-2 text-[16px]">
            <div className="flex justify-between">
              <dt>
                סכום ביניים (<span className="num">{count}</span> פריטים)
              </dt>
              <dd className="num">{formatPrice(t.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>משלוח</dt>
              <dd className="num">{t.shipping === 0 ? "חינם" : t.shipping !== null ? formatPrice(t.shipping) : site.shippingPriceText}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
              <dt>סה״כ לתשלום</dt>
              <dd className="num">{formatPrice(t.total)}</dd>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <dt>
                מתוכו מע״מ (<span className="num">{Math.round(site.vatRate * 100)}%</span>)
              </dt>
              <dd className="num">{formatPrice(t.vat)}</dd>
            </div>
          </dl>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setCouponMsg(coupon.trim() ? "קוד הקופון אינו תקף" : "נא להזין קוד קופון");
            }}
          >
            <label htmlFor="coupon" className="sr-only">
              קוד קופון
            </label>
            <input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="קוד קופון" className="field min-h-11 flex-1" aria-describedby={couponMsg ? "coupon-msg" : undefined} />
            <button type="submit" className="btn btn-secondary min-h-11 px-4">
              החלה
            </button>
          </form>
          {couponMsg ? (
            <p id="coupon-msg" role="status" className="-mt-2 text-sm text-danger">
              {couponMsg}
            </p>
          ) : null}
          <Link href="/checkout" className="btn btn-primary min-h-13 w-full text-[17px]">
            <Lock className="size-5" aria-hidden />
            מעבר לתשלום
          </Link>
          <ExpressPay />
          <ul className="grid gap-2 border-t border-line pt-4 text-sm text-ink-2">
            <li className="flex gap-2">
              <Truck className="size-4 shrink-0 text-muted" aria-hidden />
              משלוח ל{site.deliveryAreas} תוך {site.deliveryTimeText}
            </li>
            <li className="flex gap-2">
              <Store className="size-4 shrink-0 text-muted" aria-hidden />
              איסוף עצמי ללא עלות — מוכן תוך {site.pickupReadyText}
            </li>
            <li className="flex gap-2">
              <Lock className="size-4 shrink-0 text-muted" aria-hidden />
              תשלום מאובטח · עד {site.installmentsText} תשלומים · חשבונית מס
            </li>
          </ul>
        </aside>
      </div>

      {suggestions.length ? (
        <section className="mt-14">
          <SectionHeader title="לא לשכוח גם:" subtitle="מוצרים שבדרך כלל נקנים יחד עם מה שבעגלה" />
          <Rail label="מוצרים משלימים">
            {suggestions.map((p) => (
              <RailItem key={p.id}>
                <ProductCard product={p} />
              </RailItem>
            ))}
          </Rail>
        </section>
      ) : null}
    </>
  );
}
