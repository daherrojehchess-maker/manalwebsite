"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, Menu, Phone, X } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import { phoneHref, site, whatsappHref } from "@/lib/site";
import type { MenuData } from "./menu-data";

type Tab = "categories" | "professions" | "projects";

export const OPEN_MOBILE_MENU = "open-mobile-menu";

export function MobileMenu({ data }: { data: MenuData }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("categories");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MOBILE_MENU, onOpen);
    return () => window.removeEventListener(OPEN_MOBILE_MENU, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-md hover:bg-stone lg:hidden" aria-label="פתיחת תפריט" aria-expanded={open}>
        <Menu className="size-6" aria-hidden />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="תפריט">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={close} aria-label="סגירת תפריט" />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-[var(--shadow-drawer)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-lg font-bold">תפריט</span>
              <button type="button" onClick={close} className="grid size-11 place-items-center rounded-md hover:bg-stone" aria-label="סגירה">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1 border-b border-line p-2" role="tablist">
              {(
                [
                  ["categories", "קטגוריות"],
                  ["professions", "מקצועות"],
                  ["projects", "פרויקטים"],
                ] as [Tab, string][]
              ).map(([key, label]) => (
                <button key={key} role="tab" aria-selected={tab === key} type="button" onClick={() => setTab(key)} className={cn("min-h-11 rounded-md text-[15px] font-semibold", tab === key ? "bg-ink text-white" : "text-ink-2 hover:bg-stone")}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {tab === "categories" ? (
                <ul className="divide-y divide-line">
                  {data.all.map((c) => (
                    <li key={c.slug}>
                      <button type="button" onClick={() => setExpanded(expanded === c.slug ? null : c.slug)} aria-expanded={expanded === c.slug} className="flex min-h-14 w-full items-center gap-3 px-4 text-start">
                        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-stone p-1">
                          <ProductArt art={c.art} className="size-full" />
                        </span>
                        <span className="flex-1 text-[16px] font-medium">{c.name}</span>
                        <ChevronDown className={cn("size-5 text-muted transition-transform", expanded === c.slug && "rotate-180")} aria-hidden />
                      </button>
                      {expanded === c.slug ? (
                        <ul className="bg-stone/60 pb-2">
                          <li>
                            <Link href={`/c/${c.slug}`} onClick={close} className="flex min-h-11 items-center px-6 font-semibold text-accent">
                              לכל ה{c.name}
                            </Link>
                          </li>
                          {c.subs.map((s) => (
                            <li key={s.slug}>
                              <Link href={`/c/${c.slug}/${s.slug}`} onClick={close} className="flex min-h-11 items-center px-6 text-ink-2">
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="divide-y divide-line">
                  {(tab === "professions" ? data.professions.map((p) => ({ ...p, href: `/pros/${p.slug}` })) : data.projects.map((p) => ({ ...p, href: `/projects/${p.slug}` }))).map((p) => (
                    <li key={p.slug}>
                      <Link href={p.href} onClick={close} className="flex min-h-14 items-center justify-between px-4 text-[16px] font-medium">
                        {p.name}
                        <ChevronLeft className="size-5 text-muted" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <ul className="mt-2 border-t-8 border-stone py-2">
                {[
                  ["/sale", "מבצעים"],
                  ["/brands", "מותגים"],
                  ["/pros", "לקבלנים ואנשי מקצוע"],
                  ["/guides", "מדריכים וטיפים"],
                  ["/store", "החנות, שעות ואיסוף עצמי"],
                  ["/account", "החשבון שלי"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} onClick={close} className={cn("flex min-h-12 items-center px-4 text-[16px]", href === "/sale" && "font-bold text-accent")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-3">
              <a href={phoneHref()} className="btn btn-secondary min-h-12 px-2">
                <Phone className="size-5" aria-hidden />
                <bdi>{site.phoneDisplay}</bdi>
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener" className="btn btn-whatsapp min-h-12 px-2">
                <WhatsAppIcon className="size-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
