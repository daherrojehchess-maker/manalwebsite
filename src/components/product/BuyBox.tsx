"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, CreditCard, Minus, Plus, RotateCcw, ShoppingCart, Store, Truck } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { Price, StockBadge, WhatsAppIcon } from "@/components/ui/primitives";
import type { Art, ProductOption, StockStatus } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/format";
import { site, whatsappHref } from "@/lib/site";
import { actions } from "@/lib/store";
import { WishlistButton } from "./ProductActions";

type Props = {
  id: string;
  name: string;
  sku: string;
  url: string;
  brandName: string;
  art: Art;
  price: number;
  compareAt?: number;
  unit: string;
  stock: StockStatus;
  options: ProductOption[];
};

export function ProductPurchase(props: Props) {
  const { id, name, sku, url, brandName, art, price, compareAt, unit, stock, options } = props;
  const [selection, setSelection] = useState<Record<string, string>>(() => Object.fromEntries(options.map((o) => [o.name, o.values[0].label])));
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    actions.trackView(id);
  }, [id]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let delta = 0;
  let swatch: string | undefined;
  for (const o of options) {
    const v = o.values.find((x) => x.label === selection[o.name]);
    delta += v?.priceDelta ?? 0;
    if (v?.swatch) swatch = v.swatch;
  }
  const unitPrice = price + delta;
  const unitCompare = compareAt ? compareAt + delta : undefined;
  const shownArt: Art = swatch && ["bucket", "spray", "tube", "faucet", "socket"].includes(art.kind) ? { ...art, color: swatch } : art;
  const selectionText = options.map((o) => `${o.name}: ${selection[o.name]}`).join(", ");
  const waText = `היי, אשמח לייעוץ לגבי: ${name}${selectionText ? ` (${selectionText})` : ""} — מק״ט ${sku}\n${url}`;
  const outOfStock = stock === "out";

  const addToCart = () => actions.addToCart(id, name, qty, selection);
  const addToQuote = () => actions.addToQuote({ productId: id, name: selectionText ? `${name} (${selectionText})` : name, selection, unit, qty, note: "" });

  const views = [
    { art: shownArt, scale: 1, label: "תמונה ראשית" },
    { art: shownArt, scale: 1.55, label: "תקריב אריזה" },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-line bg-stone/60">
          <div className="size-[78%] transition-transform duration-300" style={{ transform: `scale(${views[view].scale})` }}>
            <ProductArt art={views[view].art} title={name} className="size-full" />
          </div>
          <WishlistButton id={id} name={name} className="absolute end-4 top-4 size-11" />
          <span className="absolute bottom-3 start-3 rounded bg-white/85 px-2 py-1 text-[12px] text-muted">[להחלפה בצילום מוצר אמיתי]</span>
        </div>
        <div className="mt-3 flex gap-3" role="tablist" aria-label="תמונות המוצר">
          {views.map((v, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={view === i}
              aria-label={v.label}
              onClick={() => setView(i)}
              className={cn("grid size-20 place-items-center overflow-hidden rounded-lg border-2 bg-stone/60", view === i ? "border-ink" : "border-transparent hover:border-line-strong")}
            >
              <ProductArt art={v.art} className="size-16" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <bdi className="font-semibold uppercase tracking-wide text-ink-2">{brandName}</bdi>
          <span>
            מק״ט: <bdi className="num">{sku}</bdi>
          </span>
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight md:text-[32px]">{name}</h1>

        <div className="mt-5">
          <Price price={unitPrice} compareAt={unitCompare} size="lg" />
          <p className="mt-1 text-sm text-muted">
            כולל מע״מ · ל{unit === "יח׳" ? "יחידה" : unit} · עד {site.installmentsText} תשלומים
          </p>
        </div>

        {options.map((o) => (
          <fieldset key={o.name} className="mt-6">
            <legend className="mb-2 text-[15px] font-semibold">
              {o.name}: <span className="font-normal text-ink-2">{selection[o.name]}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {o.values.map((v) => {
                const active = selection[o.name] === v.label;
                return (
                  <label
                    key={v.label}
                    className={cn(
                      "relative flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 px-3.5 text-[15px] font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                      active ? "border-ink bg-white" : "border-line bg-white hover:border-line-strong",
                    )}
                  >
                    <input type="radio" name={o.name} value={v.label} checked={active} onChange={() => setSelection((s) => ({ ...s, [o.name]: v.label }))} className="sr-only" />
                    {v.swatch ? <span className="size-5 rounded-full ring-1 ring-ink/15" style={{ background: v.swatch }} aria-hidden /> : null}
                    {v.label}
                    {v.priceDelta ? <span className="num text-[13px] text-muted">+{formatPrice(v.priceDelta)}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="mt-6">
          <StockBadge stock={stock} className="text-[15px]" />
          {!outOfStock ? <span className="text-[15px] text-muted"> · נשלח תוך {site.deliveryTimeText}</span> : null}
        </div>

        <div ref={ctaRef} className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-2 xs:gap-3">
          <div className="flex h-14 items-center rounded-md border border-line-strong bg-white">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-10 place-items-center text-ink-2 hover:text-ink xs:w-12" aria-label="הפחתת כמות">
              <Minus className="size-4" aria-hidden />
            </button>
            <label className="sr-only" htmlFor="qty">
              כמות
            </label>
            <input id="qty" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} className="num w-10 bg-transparent text-center text-lg font-semibold outline-none xs:w-12" />
            <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-10 place-items-center text-ink-2 hover:text-ink xs:w-12" aria-label="הוספת כמות">
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <button type="button" onClick={addToCart} disabled={outOfStock} className="btn btn-primary min-h-14 px-3 text-[16px] leading-tight whitespace-normal xs:text-[17px]">
            <ShoppingCart className="size-5" aria-hidden />
            {outOfStock ? "אזל מהמלאי" : `הוספה לעגלה · ${formatPrice(unitPrice * qty)}`}
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a href={whatsappHref(waText)} target="_blank" rel="noopener" className="btn btn-whatsapp min-h-12">
            <WhatsAppIcon className="size-5" />
            ייעוץ ב-WhatsApp
          </a>
          <button type="button" onClick={addToQuote} className="btn min-h-12 border border-line-strong bg-white text-ink hover:border-ink">
            <ClipboardList className="size-5" aria-hidden />
            הוספה להצעת מחיר
          </button>
        </div>

        <ul className="mt-6 divide-y divide-line rounded-lg border border-line bg-white text-[15px]">
          <li className="flex gap-3 p-4">
            <Truck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold">משלוח עד הבית</span> — {site.shippingPriceText}, חינם בקנייה מעל {site.freeShippingText}. זמן אספקה משוער: {site.deliveryTimeText}.
            </span>
          </li>
          <li className="flex gap-3 p-4">
            <Store className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold">איסוף עצמי ללא עלות</span> — מ{site.address}, מוכן תוך {site.pickupReadyText}.
            </span>
          </li>
          <li className="flex gap-3 p-4">
            <CreditCard className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold">תשלום מאובטח</span> — אשראי, Apple Pay, Google Pay ו-Bit · עד {site.installmentsText} תשלומים.
            </span>
          </li>
          <li className="flex gap-3 p-4">
            <RotateCcw className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold">החזרות וביטולים</span> — בהתאם ל
              <Link href="/policies/returns" className="underline">
                מדיניות ההחזרות
              </Link>
              .
            </span>
          </li>
        </ul>
      </div>

      <div className={cn("fixed inset-x-0 bottom-[56px] z-30 border-t border-line bg-white p-3 shadow-[0_-4px_16px_rgb(0_0_0/0.06)] transition-transform lg:hidden", showSticky ? "translate-y-0" : "pointer-events-none translate-y-[200%]")} aria-hidden={!showSticky}>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[13px] text-muted">{name}</p>
            <bdi className="num text-lg font-bold">{formatPrice(unitPrice)}</bdi>
          </div>
          <a href={whatsappHref(waText)} target="_blank" rel="noopener" className="grid size-12 place-items-center rounded-md border-[1.5px] border-whatsapp-ink text-whatsapp-ink" aria-label="ייעוץ ב-WhatsApp" tabIndex={showSticky ? 0 : -1}>
            <WhatsAppIcon className="size-6" />
          </a>
          <button type="button" onClick={addToCart} disabled={outOfStock} className="btn btn-primary min-h-12 px-5" tabIndex={showSticky ? 0 : -1}>
            הוספה לעגלה
          </button>
        </div>
      </div>
    </div>
  );
}
