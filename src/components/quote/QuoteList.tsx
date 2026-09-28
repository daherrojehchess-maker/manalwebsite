"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/lib/site";
import { actions, useStore } from "@/lib/store";
import { useLineProducts } from "@/lib/useLines";

const UNITS = ["יח׳", "שק", "דלי", "לוח", "מ״ר", "מ׳", "קרטון", "משטח"];

export function QuoteList() {
  const quote = useStore((s) => s.quote);
  const hydrated = useStore((s) => s.hydrated);
  const { items } = useLineProducts(quote.flatMap((l) => (l.productId ? [l.productId] : [])));
  const byId = new Map(items.map((p) => [p.id, p]));
  const [free, setFree] = useState({ name: "", qty: 1, unit: UNITS[0] });

  if (!hydrated) return <div className="card h-64 animate-pulse bg-stone" aria-busy="true" />;

  const waText = `היי, אשמח להצעת מחיר עבור:\n${quote.map((l) => `• ${l.qty} ${l.unit} — ${l.name}${l.selection && Object.keys(l.selection).length ? ` (${Object.values(l.selection).join(", ")})` : ""}${l.note ? ` — ${l.note}` : ""}`).join("\n")}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div>
        {quote.length ? (
          <ul className="card divide-y divide-line">
            {quote.map((l) => {
              const p = l.productId ? byId.get(l.productId) : undefined;
              return (
                <li key={l.key} className="flex gap-4 p-4">
                  <span className="grid size-20 shrink-0 place-items-center rounded-md bg-stone p-2">
                    {p ? <ProductArt art={p.art} className="size-full" /> : <ClipboardList className="size-8 text-muted" aria-hidden />}
                  </span>
                  <div className="grid min-w-0 flex-1 gap-2">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        {p ? (
                          <Link href={`/p/${p.slug}`} className="line-clamp-2 font-semibold hover:text-accent">
                            {p.name}
                          </Link>
                        ) : (
                          <p className="font-semibold">{l.name}</p>
                        )}
                        {l.selection && Object.keys(l.selection).length ? <p className="text-sm text-ink-2">{Object.entries(l.selection).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p> : null}
                        {p ? (
                          <p className="text-[13px] text-muted">
                            מק״ט <bdi className="num">{p.sku}</bdi>
                          </p>
                        ) : (
                          <p className="text-[13px] text-muted">פריט חופשי</p>
                        )}
                      </div>
                      <button type="button" onClick={() => actions.removeFromQuote(l.key)} className="grid size-10 shrink-0 place-items-center rounded-md text-muted hover:bg-stone hover:text-danger" aria-label={`הסרת ${p?.name ?? l.name}`}>
                        <Trash2 className="size-5" aria-hidden />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <QtyStepper value={l.qty} onChange={(qty) => actions.updateQuote(l.key, { qty })} label={p?.name ?? l.name} />
                      <label className="sr-only" htmlFor={`unit-${l.key}`}>
                        יחידת מידה
                      </label>
                      <select id={`unit-${l.key}`} value={l.unit} onChange={(e) => actions.updateQuote(l.key, { unit: e.target.value })} className="field h-11 min-h-11 w-auto py-0">
                        {Array.from(new Set([l.unit, ...UNITS])).map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <label className="sr-only" htmlFor={`note-${l.key}`}>
                      הערה לפריט
                    </label>
                    <input id={`note-${l.key}`} value={l.note} onChange={(e) => actions.updateQuote(l.key, { note: e.target.value })} placeholder="הערה (גוון, מידה, מועד אספקה…)" className="field min-h-11" />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="card flex flex-col items-center p-10 text-center">
            <ClipboardList className="size-14 text-muted" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">הרשימה ריקה</h2>
            <p className="mt-2 max-w-md text-muted">הוסיפו מוצרים מכל עמוד מוצר בלחיצה על &quot;הוספה להצעת מחיר&quot;, או כתבו פריטים חופשיים כאן למטה.</p>
          </div>
        )}

        <form
          className="card mt-4 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!free.name.trim()) return;
            actions.addToQuote({ name: free.name.trim(), qty: free.qty, unit: free.unit, note: "" });
            setFree({ name: "", qty: 1, unit: free.unit });
          }}
        >
          <div>
            <label htmlFor="free-name" className="label">
              הוספת פריט שלא מצאתם באתר
            </label>
            <input id="free-name" value={free.name} onChange={(e) => setFree({ ...free, name: e.target.value })} placeholder="לדוגמה: בלוק 20 איטונג" className="field min-h-11" />
          </div>
          <QtyStepper value={free.qty} onChange={(qty) => setFree({ ...free, qty })} label="פריט חופשי" />
          <select aria-label="יחידת מידה" value={free.unit} onChange={(e) => setFree({ ...free, unit: e.target.value })} className="field h-11 min-h-11 w-auto py-0">
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary min-h-11">
            <Plus className="size-5" aria-hidden />
            הוספה
          </button>
        </form>
      </div>

      <aside className="card flex flex-col gap-4 p-5 md:p-6 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold">
          <span className="num">{quote.length}</span> פריטים ברשימה
        </h2>
        <p className="text-[15px] text-ink-2">הרשימה נפרדת מהעגלה. שלחו אותה ונחזור עם הצעת מחיר תוך {site.quoteResponseText}.</p>
        <Link href="/quote/request" aria-disabled={!quote.length} className="btn btn-primary min-h-13 w-full text-[17px] aria-disabled:pointer-events-none aria-disabled:opacity-50">
          המשך לבקשת הצעת מחיר
        </Link>
        <a href={whatsappHref(waText)} target="_blank" rel="noopener" aria-disabled={!quote.length} className="btn btn-whatsapp w-full aria-disabled:pointer-events-none aria-disabled:opacity-50">
          <WhatsAppIcon className="size-5" />
          שליחת הרשימה ב-WhatsApp
        </a>
        {quote.length ? (
          <button type="button" onClick={() => actions.clearQuote()} className="text-sm text-muted underline hover:text-danger">
            ניקוי הרשימה
          </button>
        ) : null}
      </aside>
    </div>
  );
}
