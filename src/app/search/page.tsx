import type { Metadata } from "next";
import Link from "next/link";
import { ListingPage } from "@/components/catalog/ListingPage";
import { SearchBox } from "@/components/layout/SearchBox";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { homeCategoryCards, loadActiveProducts, toCard } from "@/lib/catalog";
import { popularSearches, searchProducts } from "@/lib/search";
import { whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "חיפוש מוצרים",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";

  if (!q) {
    return (
      <div className="container-x py-8">
        <h1 className="text-[28px] font-bold md:text-[36px]">מה תרצו למצוא?</h1>
        <SearchBox className="mt-5 max-w-2xl" />
        <h2 className="mt-10 mb-3 text-lg font-bold">חיפושים פופולריים</h2>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((s) => (
            <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-line hover:ring-ink">
              {s}
            </Link>
          ))}
        </div>
        <h2 className="mt-10 mb-3 text-lg font-bold">קטגוריות</h2>
        <div className="flex flex-wrap gap-2">
          {homeCategoryCards.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-line hover:ring-ink">
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const catalog = await loadActiveProducts();
  const results = searchProducts(q, catalog).map(toCard);
  if (!results.length) {
    return (
      <div className="container-x py-10">
        <h1 className="text-[26px] font-bold md:text-[32px]">לא מצאנו תוצאות עבור „{q}”</h1>
        <p className="mt-2 max-w-xl text-[17px] text-ink-2">נסו לחפש שם מותג, סוג מוצר או קטגוריה. לא מוצאים? שלחו לנו הודעה — סביר שיש לנו את זה במלאי.</p>
        <SearchBox className="mt-6 max-w-2xl" />
        <a href={whatsappHref(`היי, חיפשתי באתר "${q}" ולא מצאתי. אפשר עזרה?`)} target="_blank" rel="noopener" className="btn btn-whatsapp mt-6">
          <WhatsAppIcon className="size-5" />
          שאלו אותנו ב-WhatsApp
        </a>
        <h2 className="mt-10 mb-3 text-lg font-bold">אולי תמצאו כאן</h2>
        <div className="flex flex-wrap gap-2">
          {homeCategoryCards.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-line hover:ring-ink">
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return <ListingPage title={`תוצאות עבור „${q}”`} crumbs={[{ name: "חיפוש" }]} products={results} relevanceFirst />;
}
