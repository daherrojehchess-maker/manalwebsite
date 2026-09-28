"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroller with snap; arrows appear on desktop only. RTL: "next" scrolls toward the left. */
export function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * -el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div ref={ref} role="region" aria-label={label} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:gap-4 md:px-0">
        {children}
      </div>
      <button type="button" onClick={() => scroll(-1)} aria-label="הקודם" className="absolute -right-5 top-1/3 hidden size-11 place-items-center rounded-full bg-white shadow-[var(--shadow-pop)] ring-1 ring-line hover:bg-stone lg:grid">
        <ChevronRight className="size-5" aria-hidden />
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="הבא" className="absolute -left-5 top-1/3 hidden size-11 place-items-center rounded-full bg-white shadow-[var(--shadow-pop)] ring-1 ring-line hover:bg-stone lg:grid">
        <ChevronLeft className="size-5" aria-hidden />
      </button>
    </div>
  );
}

export function RailItem({ children }: { children: React.ReactNode }) {
  return <div className="w-[46%] shrink-0 snap-start xs:w-[44%] md:w-[31%] lg:w-[23.5%] xl:w-[18.8%]">{children}</div>;
}
