"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Clock, Search, X } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { cn, formatPrice } from "@/lib/format";
import type { Suggestion } from "@/lib/search";

const RECENT_KEY = "bm-recent-searches";
const POPULAR = ["סיליקון", "צבע טמבור", "Sikaflex", "דבק קרמיקה", "רולר", "מברגה", "לוח גבס", "איטום גג"];

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x !== q)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

export function SearchBox({ className, size = "lg" }: { className?: string; size?: "lg" | "md" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Suggestion | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (res.ok) {
          setData(await res.json());
          setActive(-1);
        }
      } catch {}
    }, 140);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showSuggestions = q.trim().length >= 2 && data;
  const flat: { href: string; label: string }[] = showSuggestions
    ? [
        ...data.categories.map((c) => ({ href: c.href, label: c.name })),
        ...data.brands.map((b) => ({ href: b.href, label: b.name })),
        ...data.products.map((p) => ({ href: p.href, label: p.name })),
      ]
    : [];

  function go(term: string) {
    const t = term.trim();
    if (!t) return;
    saveRecent(t);
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  }

  function navigate(href: string) {
    if (q.trim()) saveRecent(q.trim());
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? flat.length - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      navigate(flat[active].href);
    }
  }

  let idx = -1;
  const optionProps = (href: string) => {
    idx++;
    const i = idx;
    return {
      id: `${listId}-${i}`,
      role: "option" as const,
      "aria-selected": active === i,
      onMouseEnter: () => setActive(i),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(href);
      },
      className: cn("flex items-center gap-3 rounded-md px-3 py-2", active === i ? "bg-stone" : "hover:bg-stone"),
    };
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className={cn(
          "flex items-center overflow-hidden rounded-lg border-2 bg-white transition-colors",
          open ? "border-accent" : "border-ink/80 hover:border-ink",
        )}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          חיפוש מוצרים
        </label>
        <Search className="ms-4 size-5 shrink-0 text-muted" aria-hidden />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setRecent(readRecent());
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="חפשו מוצר, מותג או קטגוריה…"
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className={cn("min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden", size === "lg" ? "h-12" : "h-11")}
        />
        {q ? (
          <button type="button" onClick={() => { setQ(""); setData(null); inputRef.current?.focus(); }} className="grid size-9 place-items-center text-muted hover:text-ink" aria-label="ניקוי החיפוש">
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
        <button type="submit" className={cn("m-1 hidden rounded-md bg-accent px-5 font-semibold text-white hover:bg-accent-hover sm:block", size === "lg" ? "h-10" : "h-9")}>
          חיפוש
        </button>
      </form>

      {open ? (
        <div id={listId} role="listbox" aria-label="הצעות חיפוש" className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-white p-3 shadow-[var(--shadow-pop)]">
          {!showSuggestions ? (
            <div className="grid gap-4 p-1">
              {recent.length ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-muted">חיפושים אחרונים</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} type="button" onClick={() => { setQ(r); go(r); }} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink">
                        <Clock className="size-3.5 text-muted" aria-hidden />
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="mb-2 text-sm font-semibold text-muted">חיפושים פופולריים</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((r) => (
                    <button key={r} type="button" onClick={() => { setQ(r); go(r); }} className="rounded-full bg-stone px-3 py-1.5 text-sm hover:bg-stone-2">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : flat.length === 0 ? (
            <div className="p-3 text-[15px]">
              <p className="font-semibold">לא מצאנו תוצאות עבור „{q}”</p>
              <p className="mt-1 text-muted">נסו מילה אחרת, שם מותג או קטגוריה — או שלחו לנו הודעה ונמצא עבורכם.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {data.categories.length || data.brands.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.categories.length ? (
                    <div>
                      <p className="px-3 pb-1 text-[13px] font-semibold text-muted">קטגוריות</p>
                      {data.categories.map((c) => (
                        <a key={c.href} href={c.href} {...optionProps(c.href)}>
                          <span className="text-[15px] font-medium">{c.name}</span>
                          {c.parent ? <span className="text-sm text-muted">ב{c.parent}</span> : null}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {data.brands.length ? (
                    <div>
                      <p className="px-3 pb-1 text-[13px] font-semibold text-muted">מותגים</p>
                      {data.brands.map((b) => (
                        <a key={b.href} href={b.href} {...optionProps(b.href)}>
                          <span className="text-[15px] font-medium" dir="ltr">{b.name}</span>
                          <span className="text-sm text-muted">{b.nameHe}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {data.products.length ? (
                <div className="border-t border-line pt-2">
                  <p className="px-3 pb-1 text-[13px] font-semibold text-muted">מוצרים</p>
                  {data.products.map((p) => (
                    <a key={p.id} href={p.href} {...optionProps(p.href)}>
                      <span className="grid size-14 shrink-0 place-items-center rounded-md bg-stone p-1.5">
                        <ProductArt art={p.art} className="size-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-[15px] font-medium">{p.name}</span>
                        <span className="block text-[13px] text-muted">
                          {p.category}
                          {p.brand ? <> · <bdi>{p.brand}</bdi></> : null}
                        </span>
                      </span>
                      <bdi className="num shrink-0 font-bold">{formatPrice(p.price)}</bdi>
                    </a>
                  ))}
                </div>
              ) : null}
              <Link href={`/search?q=${encodeURIComponent(q.trim())}`} onClick={() => { saveRecent(q.trim()); setOpen(false); }} className="block rounded-md bg-stone px-3 py-2.5 text-center text-[15px] font-semibold text-accent hover:bg-stone-2">
                לכל התוצאות עבור „{q.trim()}”
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
