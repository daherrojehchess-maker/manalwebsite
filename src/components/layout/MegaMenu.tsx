"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, Menu } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { cn } from "@/lib/format";
import { whatsappHref } from "@/lib/site";
import type { MenuData } from "./menu-data";

export function MegaMenu({ data }: { data: MenuData }) {
  const [open, setOpen] = useState<string | null>(null);
  const [panel, setPanel] = useState<string>(data.all[0].slug);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openWithIntent = (key: string, delay = 120) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpen(key);
      if (key !== "all") setPanel(key);
    }, delay);
  };
  const close = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(null), 150);
  };

  const current = data.all.find((c) => c.slug === panel) ?? data.all[0];
  const activeTop = pathname.startsWith("/c/") ? pathname.split("/")[2] : null;

  return (
    <nav
      aria-label="ניווט ראשי"
      className="relative hidden border-t border-line bg-white lg:block"
      onMouseLeave={close}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) setOpen(null);
      }}
    >
      <div className="container-x flex h-12 items-stretch gap-1">
        <button
          type="button"
          aria-expanded={open === "all"}
          onClick={() => setOpen(open === "all" ? null : "all")}
          onMouseEnter={() => openWithIntent("all")}
          className={cn("flex items-center gap-2 rounded-t-md px-4 font-semibold", open === "all" ? "bg-ink text-white" : "bg-stone text-ink hover:bg-stone-2")}
        >
          <Menu className="size-5" aria-hidden />
          כל הקטגוריות
        </button>
        <ul className="flex min-w-0 flex-1 items-stretch">
          {data.nav.map((c) => (
            <li key={c.slug} className="flex">
              <Link
                href={`/c/${c.slug}`}
                onMouseEnter={() => openWithIntent(c.slug)}
                onFocus={() => setPanel(c.slug)}
                aria-expanded={open === c.slug}
                className={cn(
                  "flex items-center gap-1 border-b-2 px-2.5 text-[15px] font-medium whitespace-nowrap xl:px-3",
                  open === c.slug || activeTop === c.slug ? "border-accent text-accent" : "border-transparent text-ink hover:text-accent",
                )}
              >
                {c.shortName ?? c.name}
                <ChevronDown className="size-3.5 opacity-60" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="/sale" onMouseEnter={close} className="px-3 text-[15px] font-bold text-accent hover:underline">
            מבצעים
          </Link>
          <Link href="/brands" onMouseEnter={close} className="px-3 text-[15px] font-medium hover:text-accent">
            מותגים
          </Link>
          <Link href="/pros" onMouseEnter={close} className="rounded-full border-[1.5px] border-ink px-4 py-1.5 text-[15px] font-semibold hover:bg-ink hover:text-white">
            לקבלנים
          </Link>
        </div>
      </div>

      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-t border-line bg-white shadow-[var(--shadow-pop)]" onMouseEnter={() => clearTimeout(timer.current)}>
          <div className="container-x grid grid-cols-[260px_1fr] gap-0 py-0">
            <ul className="border-e border-line py-3">
              {data.all.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/c/${c.slug}`}
                    onMouseEnter={() => setPanel(c.slug)}
                    onFocus={() => setPanel(c.slug)}
                    className={cn("flex items-center justify-between rounded-s-md px-4 py-2 text-[15px]", panel === c.slug ? "bg-stone font-semibold text-ink" : "text-ink-2 hover:bg-stone")}
                  >
                    {c.name}
                    <ChevronLeft className="size-4 opacity-50" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-[1fr_240px] gap-8 p-6">
              <div>
                <div className="mb-4 flex items-baseline justify-between">
                  <p className="text-xl font-bold">{current.name}</p>
                  <Link href={`/c/${current.slug}`} className="inline-flex items-center gap-1 text-[15px] font-semibold text-accent">
                    לכל ה{current.name}
                    <ChevronLeft className="size-4" aria-hidden />
                  </Link>
                </div>
                <ul className="grid grid-cols-3 gap-x-6 gap-y-1">
                  {current.subs.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/c/${current.slug}/${s.slug}`} className="block rounded-md px-2 py-2 text-[15px] text-ink-2 hover:bg-stone hover:text-ink">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <a href={whatsappHref(`היי, אשמח לייעוץ בנושא ${current.name}`)} target="_blank" rel="noopener" className="group flex flex-col justify-between rounded-lg bg-stone p-5">
                <ProductArt art={current.art} className="mx-auto size-32 transition-transform group-hover:scale-105" />
                <span>
                  <span className="block text-sm text-muted">לא בטוחים מה מתאים?</span>
                  <span className="block font-semibold">ייעוץ ב-WhatsApp</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
