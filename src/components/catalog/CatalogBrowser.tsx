"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/format";
import type { CardProduct } from "@/lib/catalog";

export type Facets = {
  typeLabel?: string;
  typeKey?: "sub" | "category";
  typeOptions?: { value: string; label: string }[];
  brandOptions: { value: string; label: string }[];
  attrKeys: string[];
};

const SORTS = [
  ["popular", "פופולריות"],
  ["bestsellers", "הנמכרים ביותר"],
  ["price-asc", "מחיר נמוך לגבוה"],
  ["price-desc", "מחיר גבוה לנמוך"],
  ["new", "חדש באתר"],
] as const;

const PAGE = 12;

export function CatalogBrowser({ products, facets, relevanceFirst = false, showQuote = false }: { products: CardProduct[]; facets: Facets; relevanceFirst?: boolean; showQuote?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [attrSel, setAttrSel] = useState<Record<string, string[]>>({});
  const [visible, setVisible] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  const list = (k: string) => (params.get(k) ?? "").split(",").filter(Boolean);
  const brandSel = list("brand");
  const typeSel = list("type");
  const inStock = params.get("stock") === "1";
  const saleOnly = params.get("sale") === "1";
  const min = Number(params.get("min") ?? "") || undefined;
  const max = Number(params.get("max") ?? "") || undefined;
  const sort = params.get("sort") ?? (relevanceFirst ? "relevance" : "popular");

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    setVisible(PAGE);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const toggleIn = (key: "brand" | "type", value: string) => {
    const cur = key === "brand" ? brandSel : typeSel;
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    update({ [key]: next.join(",") || null });
  };

  const attrOptions = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const key of facets.attrKeys) {
      const values = new Set(products.map((p) => p.attrs[key]).filter(Boolean));
      if (values.size > 1) out[key] = Array.from(values).sort();
    }
    return out;
  }, [products, facets.attrKeys]);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (brandSel.length && !brandSel.includes(p.brand)) return false;
      if (typeSel.length && facets.typeKey && !typeSel.includes(p[facets.typeKey])) return false;
      if (inStock && p.stock === "out") return false;
      if (saleOnly && !(p.compareAt && p.compareAt > p.price)) return false;
      if (min !== undefined && p.price < min) return false;
      if (max !== undefined && p.price > max) return false;
      for (const [k, vals] of Object.entries(attrSel)) if (vals.length && !vals.includes(p.attrs[k])) return false;
      return true;
    });
    const by: Record<string, (a: CardProduct, b: CardProduct) => number> = {
      popular: (a, b) => b.popularity - a.popularity,
      bestsellers: (a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) || b.popularity - a.popularity,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      new: (a, b) => b.addedOrder - a.addedOrder,
    };
    if (by[sort]) r = [...r].sort(by[sort]);
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, params, attrSel, facets.typeKey]);

  const count = (pred: (p: CardProduct) => boolean) => products.filter(pred).length;

  const pills: { label: string; clear: () => void }[] = [
    ...brandSel.map((b) => ({ label: facets.brandOptions.find((o) => o.value === b)?.label ?? b, clear: () => toggleIn("brand", b) })),
    ...typeSel.map((t) => ({ label: facets.typeOptions?.find((o) => o.value === t)?.label ?? t, clear: () => toggleIn("type", t) })),
    ...Object.entries(attrSel).flatMap(([k, vals]) => vals.map((v) => ({ label: `${k}: ${v}`, clear: () => setAttrSel((s) => ({ ...s, [k]: s[k].filter((x) => x !== v) })) }))),
    ...(inStock ? [{ label: "במלאי בלבד", clear: () => update({ stock: null }) }] : []),
    ...(saleOnly ? [{ label: "במבצע", clear: () => update({ sale: null }) }] : []),
    ...(min || max ? [{ label: `מחיר: ${min ?? 0}–${max ?? "∞"} ₪`, clear: () => update({ min: null, max: null }) }] : []),
  ];

  const clearAll = () => {
    setAttrSel({});
    router.replace(sort !== "popular" && sort !== "relevance" ? `${pathname}?sort=${sort}` : pathname, { scroll: false });
  };

  const filters = (
    <div className="divide-y divide-line">
      {facets.typeOptions && facets.typeOptions.length > 1 ? (
        <FilterGroup title={facets.typeLabel ?? "סוג מוצר"}>
          {facets.typeOptions.map((o) => (
            <Check key={o.value} checked={typeSel.includes(o.value)} onChange={() => toggleIn("type", o.value)} label={o.label} count={count((p) => p[facets.typeKey!] === o.value)} />
          ))}
        </FilterGroup>
      ) : null}
      {facets.brandOptions.length > 1 ? (
        <FilterGroup title="מותג">
          {facets.brandOptions.map((o) => (
            <Check key={o.value} checked={brandSel.includes(o.value)} onChange={() => toggleIn("brand", o.value)} label={o.label} count={count((p) => p.brand === o.value)} ltr />
          ))}
        </FilterGroup>
      ) : null}
      <FilterGroup title="מחיר">
        <PriceRange key={`${min}-${max}`} min={min} max={max} onApply={(a, b) => update({ min: a ? String(a) : null, max: b ? String(b) : null })} />
      </FilterGroup>
      {Object.entries(attrOptions).map(([key, values]) => (
        <FilterGroup key={key} title={key}>
          {values.map((v) => (
            <Check
              key={v}
              checked={attrSel[key]?.includes(v) ?? false}
              onChange={() => {
                setVisible(PAGE);
                setAttrSel((s) => {
                  const cur = s[key] ?? [];
                  return { ...s, [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
                });
              }}
              label={v}
              count={count((p) => p.attrs[key] === v)}
            />
          ))}
        </FilterGroup>
      ))}
      <FilterGroup title="זמינות ומבצעים">
        <Check checked={inStock} onChange={() => update({ stock: inStock ? null : "1" })} label="במלאי בלבד" count={count((p) => p.stock !== "out")} />
        <Check checked={saleOnly} onChange={() => update({ sale: saleOnly ? null : "1" })} label="במבצע" count={count((p) => Boolean(p.compareAt && p.compareAt > p.price))} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[272px_1fr] lg:gap-8">
      <aside className="hidden lg:block" aria-label="סינון מוצרים">
        <div className="sticky top-24">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">סינון</h2>
            {pills.length ? (
              <button type="button" onClick={clearAll} className="text-sm font-medium text-accent hover:underline">
                ניקוי הכל
              </button>
            ) : null}
          </div>
          {filters}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-[112px] z-20 -mx-4 mb-4 flex items-center gap-2 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur md:top-[124px] lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          <button type="button" onClick={() => setDrawer(true)} className="btn btn-secondary min-h-11 flex-1 px-3 lg:hidden">
            <SlidersHorizontal className="size-5" aria-hidden />
            סינון{pills.length ? ` (${pills.length})` : ""}
          </button>
          <p className="hidden text-[15px] text-muted lg:block" aria-live="polite">
            <span className="num font-semibold text-ink">{filtered.length}</span> מוצרים
          </p>
          <label className="relative flex-1 lg:ms-auto lg:w-60 lg:flex-none">
            <span className="sr-only">מיון לפי</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value === (relevanceFirst ? "relevance" : "popular") ? null : e.target.value })} className="field min-h-11 appearance-none pe-9 font-medium">
              {relevanceFirst ? <option value="relevance">מיון: רלוונטיות</option> : null}
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  מיון: {l}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          </label>
        </div>

        {pills.length ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {pills.map((p) => (
              <button key={p.label} type="button" onClick={p.clear} className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-white px-3 py-1.5 text-sm font-medium hover:border-ink">
                {p.label}
                <X className="size-3.5" aria-label="הסרה" />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="text-sm font-medium text-accent hover:underline">
              ניקוי הכל
            </button>
          </div>
        ) : null}

        <p className="mb-3 text-sm text-muted lg:hidden" aria-live="polite">
          {filtered.length} מוצרים
        </p>

        {filtered.length ? (
          <>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {filtered.slice(0, visible).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} showQuote={showQuote} />
                </li>
              ))}
            </ul>
            {visible < filtered.length ? (
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm text-muted">
                  מוצגים {Math.min(visible, filtered.length)} מתוך {filtered.length}
                </p>
                <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="btn btn-secondary min-w-60">
                  הצגת מוצרים נוספים
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-lg font-semibold">לא נמצאו מוצרים שמתאימים לסינון</p>
            <p className="mt-1 text-muted">נסו להסיר חלק מהמסננים.</p>
            <button type="button" onClick={clearAll} className="btn btn-primary mt-4">
              ניקוי כל המסננים
            </button>
          </div>
        )}
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="סינון מוצרים">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} aria-label="סגירה" />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-xl bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-lg font-bold">סינון</h2>
              <button type="button" onClick={() => setDrawer(false)} className="grid size-11 place-items-center rounded-md hover:bg-stone" aria-label="סגירה">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4">{filters}</div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 border-t border-line p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <button type="button" onClick={clearAll} className="btn btn-secondary">
                ניקוי
              </button>
              <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary">
                הצגת {filtered.length} מוצרים
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="py-3">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-10 w-full items-center justify-between text-[15px] font-bold">
        {title}
        <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? <div className="mt-1 grid gap-0.5">{children}</div> : null}
    </div>
  );
}

function Check({ checked, onChange, label, count, ltr }: { checked: boolean; onChange: () => void; label: string; count: number; ltr?: boolean }) {
  return (
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-1 text-[15px] hover:bg-stone", count === 0 && !checked && "opacity-45")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="size-[18px] accent-[var(--color-accent)]" />
      <span className="flex-1">{ltr ? <bdi>{label}</bdi> : label}</span>
      <span className="num text-sm text-muted">{count}</span>
    </label>
  );
}

function PriceRange({ min, max, onApply }: { min?: number; max?: number; onApply: (min?: number, max?: number) => void }) {
  const [a, setA] = useState(min ? String(min) : "");
  const [b, setB] = useState(max ? String(max) : "");
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onApply(Number(a) || undefined, Number(b) || undefined);
      }}
    >
      <label className="flex-1">
        <span className="mb-1 block text-[13px] text-muted">מ-₪</span>
        <input inputMode="numeric" value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ""))} className="field min-h-10 px-2 py-1.5" />
      </label>
      <label className="flex-1">
        <span className="mb-1 block text-[13px] text-muted">עד ₪</span>
        <input inputMode="numeric" value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ""))} className="field min-h-10 px-2 py-1.5" />
      </label>
      <button type="submit" className="btn btn-secondary min-h-10 px-3 text-sm">
        סינון
      </button>
    </form>
  );
}
