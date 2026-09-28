import Link from "next/link";
import { SearchBox } from "@/components/layout/SearchBox";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { homeCategoryCards } from "@/lib/catalog";
import { whatsappHref } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-x max-w-3xl py-14">
      <p className="num text-[15px] font-semibold text-accent">404</p>
      <h1 className="mt-1 text-[30px] font-bold md:text-[38px]">העמוד לא נמצא</h1>
      <p className="mt-2 text-[17px] text-ink-2">ייתכן שהמוצר הוסר או שהקישור שגוי. נסו לחפש:</p>
      <SearchBox className="mt-6" />
      <div className="mt-8 flex flex-wrap gap-2">
        {homeCategoryCards.slice(0, 8).map((c) => (
          <Link key={c.href} href={c.href} className="rounded-full bg-white px-4 py-2 text-[15px] ring-1 ring-line hover:ring-ink">
            {c.title}
          </Link>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          לדף הבית
        </Link>
        <a href={whatsappHref("היי, לא מצאתי באתר את מה שחיפשתי")} target="_blank" rel="noopener" className="btn btn-whatsapp">
          <WhatsAppIcon className="size-5" />
          עזרה ב-WhatsApp
        </a>
      </div>
    </div>
  );
}
