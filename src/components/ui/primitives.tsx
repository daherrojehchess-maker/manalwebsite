import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn, discountPercent, formatPrice } from "@/lib/format";
import type { StockStatus } from "@/lib/catalog";
import { site } from "@/lib/site";

export function Price({ price, compareAt, size = "md", className }: { price: number; compareAt?: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const pct = discountPercent(price, compareAt);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5 num", className)}>
      <bdi className={cn("font-bold text-ink", size === "lg" ? "text-[28px] leading-9" : size === "md" ? "text-[20px] leading-7" : "text-base")}>{formatPrice(price)}</bdi>
      {pct > 0 && compareAt ? (
        <>
          <bdi className={cn("text-muted line-through", size === "lg" ? "text-lg" : "text-sm")}>{formatPrice(compareAt)}</bdi>
          {size === "lg" ? <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-sm font-semibold text-accent">חיסכון {pct}%</span> : null}
        </>
      ) : null}
    </div>
  );
}

export function DiscountBadge({ price, compareAt }: { price: number; compareAt?: number }) {
  const pct = discountPercent(price, compareAt);
  if (!pct) return null;
  return <span className="num rounded-[5px] bg-accent px-2 py-0.5 text-[13px] font-bold text-white">‎-{pct}%</span>;
}

const stockMap: Record<StockStatus, { text: string; dot: string; color: string }> = {
  in: { text: "במלאי", dot: "bg-success", color: "text-success" },
  low: { text: "מלאי מוגבל", dot: "bg-warning", color: "text-warning" },
  out: { text: "אזל מהמלאי", dot: "bg-danger", color: "text-danger" },
};

export function StockBadge({ stock, className }: { stock: StockStatus; className?: string }) {
  const s = stockMap[stock];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", s.color, className)}>
      <span className={cn("size-2 rounded-full", s.dot)} aria-hidden />
      {s.text}
    </span>
  );
}

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "בית", href: "/" }, ...items];
  return (
    <nav aria-label="פירורי לחם" className="py-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-ink hover:underline">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {c.name}
              </span>
            )}
            {i < all.length - 1 ? <ChevronLeft className="size-3.5 opacity-60" aria-hidden /> : null}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, ...(c.href ? { item: `${site.url}${c.href}` } : {}) })),
        }}
      />
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SectionHeader({ title, href, linkText = "לכל המוצרים", eyebrow, subtitle }: { title: string; href?: string; linkText?: string; eyebrow?: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
        <h2 className="text-2xl font-bold md:text-[30px]">{title}</h2>
        {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 text-[15px] font-semibold text-accent hover:text-accent-hover">
          {linkText}
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("placeholder-note rounded-md p-4 text-sm text-ink-2", className)}>{children}</div>;
}
