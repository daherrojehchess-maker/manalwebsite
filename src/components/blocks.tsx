import Link from "next/link";
import {
  BadgePercent,
  Boxes,
  Building2,
  ChevronLeft,
  Clock,
  Droplets,
  Grid3x3,
  Hammer,
  Headset,
  Layers,
  MapPin,
  Navigation,
  Paintbrush,
  Phone,
  ShieldCheck,
  Store,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { ProductCard } from "@/components/product/ProductCard";
import { Rail, RailItem } from "@/components/product/Rail";
import { PlaceholderNote, SectionHeader, WhatsAppIcon } from "@/components/ui/primitives";
import { brands, guides as allGuides, professions, projects as allProjects, toCard, type Guide, type Product, type Project } from "@/lib/catalog";
import { mapsHref, phoneHref, site, wazeHref, whatsappHref } from "@/lib/site";

export function Section({ children, className = "", tone = "default", id }: { children: React.ReactNode; className?: string; tone?: "default" | "stone" | "white"; id?: string }) {
  const bg = tone === "stone" ? "bg-stone" : tone === "white" ? "bg-white" : "";
  return (
    <section id={id} className={`${bg} py-10 md:py-14 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function ProductRail({ title, products, href, subtitle, showQuote }: { title: string; products: Product[]; href?: string; subtitle?: string; showQuote?: boolean }) {
  if (!products.length) return null;
  return (
    <>
      <SectionHeader title={title} href={href} subtitle={subtitle} />
      <Rail label={title}>
        {products.map((p) => (
          <RailItem key={p.id}>
            <ProductCard product={toCard(p)} showQuote={showQuote} />
          </RailItem>
        ))}
      </Rail>
    </>
  );
}

const trustItems = [
  { icon: ShieldCheck, title: "רכישה מאובטחת", text: "תשלום בסליקה מאובטחת, Apple Pay, Google Pay ו-Bit" },
  { icon: Truck, title: "משלוחים מהירים", text: `משלוח תוך ${site.deliveryTimeText} ל${site.deliveryAreas}` },
  { icon: Headset, title: "ייעוץ מקצועי", text: "צוות שמכיר את החומרים — בטלפון וב-WhatsApp" },
  { icon: BadgePercent, title: "מחירים לקבלנים", text: "תמחור מיוחד לאנשי מקצוע ולפרויקטים" },
  { icon: Store, title: "איסוף עצמי", text: `מוכן לאיסוף תוך ${site.pickupReadyText}` },
  { icon: Boxes, title: "מבחר גדול של מותגים", text: "המותגים המובילים בענף, במלאי" },
];

export function TrustSection() {
  return (
    <Section tone="white">
      <SectionHeader title="קונים בראש שקט" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
        {trustItems.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col items-start gap-3">
            <span className="grid size-12 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="mt-0.5 block text-[15px] text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const professionIcons: Record<string, typeof Building2> = {
  building: Building2,
  paint: Paintbrush,
  droplets: Droplets,
  zap: Zap,
  hammer: Hammer,
  grid: Grid3x3,
  layers: Layers,
  wrench: Wrench,
};

export function ProfessionGrid() {
  return (
    <>
      <SectionHeader title="מה המקצוע שלכם?" subtitle="מוצרים, קטגוריות וערכות שנבחרו במיוחד לתחום שלכם" href="/pros" linkText="לאזור אנשי המקצוע" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {professions.map((p) => {
          const Icon = professionIcons[p.icon] ?? Wrench;
          return (
            <li key={p.slug}>
              <Link href={`/pros/${p.slug}`} className="group card flex h-full items-center gap-3 p-4 transition-colors hover:border-ink md:p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-ink text-white transition-colors group-hover:bg-accent">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-[16px] font-bold md:text-[17px]">{p.name}</span>
                <ChevronLeft className="ms-auto size-5 text-muted transition-transform group-hover:-translate-x-0.5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function ProjectGrid({ items = allProjects }: { items?: Project[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {items.map((p) => (
        <li key={p.slug}>
          <Link href={`/projects/${p.slug}`} className="group card flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-pop)]">
            <span className="grid aspect-[4/3] place-items-center bg-stone p-5">
              <ProductArt art={p.art} className="size-full max-h-36 transition-transform duration-200 group-hover:scale-105" />
            </span>
            <span className="flex flex-1 items-center justify-between gap-2 p-4">
              <span className="text-[16px] font-bold md:text-[17px]">{p.name}</span>
              <span className="text-sm font-semibold text-accent">רשימת קנייה</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function BrandGrid({ limit }: { limit?: number }) {
  const list = limit ? brands.slice(0, limit) : brands;
  return (
    <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-9">
      {list.map((b) => (
        <li key={b.slug}>
          <Link href={`/brands/${b.slug}`} className="card flex h-20 flex-col items-center justify-center gap-0.5 px-2 text-center grayscale transition hover:border-ink hover:grayscale-0">
            <span className="text-[17px] font-bold tracking-tight text-ink" dir="ltr">
              {b.name}
            </span>
            <span className="text-[12px] text-muted">{b.nameHe}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContractorCta() {
  return (
    <section className="py-10 md:py-14">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-xl bg-ink px-6 py-10 text-white md:px-12 md:py-14">
          <div className="absolute inset-y-0 left-0 hidden w-1/2 opacity-[0.07] md:block" aria-hidden style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 22px)" }} />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#8FB3DA]">לקבלנים ואנשי מקצוע</p>
              <h2 className="text-[26px] font-bold md:text-[34px]">מחירים מיוחדים לפרויקטים ולעבודה מקצועית</h2>
              <p className="mt-3 max-w-xl text-[17px] text-white/75">שלחו רשימת חומרים או כתב כמויות — ונחזור אליכם עם הצעת מחיר מסודרת, כולל אספקה לאתר.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row lg:justify-end">
              <Link href="/quote/request" className="btn btn-primary min-h-13 text-[17px]">
                קבלת הצעת מחיר
              </Link>
              <a href={whatsappHref("היי, אני איש מקצוע ואשמח לקבל הצעת מחיר")} target="_blank" rel="noopener" className="btn min-h-13 border-[1.5px] border-white/40 text-white hover:bg-white/10">
                <WhatsAppIcon className="size-5" />
                WhatsApp לאנשי מקצוע
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GuideCards({ items = allGuides.slice(0, 3) }: { items?: Guide[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map((g) => (
        <li key={g.slug}>
          <Link href={`/guides/${g.slug}`} className="group card flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-pop)]">
            <span className="grid aspect-[16/9] place-items-center bg-stone p-6">
              <ProductArt art={g.art} className="h-full max-h-40 transition-transform duration-200 group-hover:scale-105" />
            </span>
            <span className="flex flex-1 flex-col gap-2 p-5">
              <span className="text-sm font-semibold text-accent">
                {g.category} · {g.readMinutes} דק׳ קריאה
              </span>
              <span className="text-lg font-bold leading-snug">{g.title}</span>
              <span className="text-[15px] text-muted">{g.excerpt}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ReviewsPlaceholder() {
  return (
    <>
      <SectionHeader title="בעלי מקצוע ולקוחות ממליצים" />
      <ul className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <PlaceholderNote className="h-full">
              <p className="font-semibold text-ink">[ביקורת לקוח אמיתית #{i}]</p>
              <p className="mt-2">מקום לציטוט אמיתי מלקוח או מאיש מקצוע, עם שם פרטי, מקצוע/עיר ומקור (Google / פייסבוק).</p>
              <p className="mt-3 text-[13px] text-muted">להזנה על ידי בעל העסק. אין לפרסם ביקורות שאינן אמיתיות.</p>
            </PlaceholderNote>
          </li>
        ))}
      </ul>
    </>
  );
}

export function StoreInfo() {
  return (
    <div className="grid overflow-hidden rounded-xl border border-line bg-white md:grid-cols-2">
      <div className="p-6 md:p-10">
        <h2 className="text-2xl font-bold md:text-[30px]">בואו לבקר בחנות</h2>
        <p className="mt-2 text-muted">ייעוץ פנים אל פנים, איסוף עצמי מהיר ומבחר מלא במלאי.</p>
        <dl className="mt-6 grid gap-5 text-[16px]">
          <div className="flex gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <dt className="font-semibold">כתובת</dt>
              <dd className="text-ink-2">
                {site.address}, {site.city}
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <dt className="font-semibold">שעות פעילות</dt>
              {site.hours.map((h) => (
                <dd key={h.days} className="text-ink-2">
                  {h.days}: {h.time}
                </dd>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Truck className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
            <div>
              <dt className="font-semibold">משלוחים ואיסוף עצמי</dt>
              <dd className="text-ink-2">
                משלוחים ל{site.deliveryAreas} · {site.shippingPriceText} · איסוף עצמי ללא עלות
              </dd>
            </div>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={wazeHref()} target="_blank" rel="noopener" className="btn btn-primary">
            <Navigation className="size-5" aria-hidden />
            ניווט ב-Waze
          </a>
          <a href={phoneHref()} className="btn btn-secondary">
            <Phone className="size-5" aria-hidden />
            <bdi>{site.phoneDisplay}</bdi>
          </a>
        </div>
      </div>
      <a href={mapsHref()} target="_blank" rel="noopener" className="group relative block min-h-72 bg-stone" aria-label="פתיחת המפה ב-Google Maps">
        <svg className="absolute inset-0 size-full" aria-hidden preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#ECEAE4" />
          <path d="M0 260 L600 180" stroke="#fff" strokeWidth="26" />
          <path d="M180 0 L260 400" stroke="#fff" strokeWidth="18" />
          <path d="M420 0 L380 400" stroke="#fff" strokeWidth="12" />
          <path d="M0 90 L600 120" stroke="#fff" strokeWidth="10" />
          <rect x="40" y="130" width="110" height="80" rx="6" fill="#E2DFD7" />
          <rect x="290" y="240" width="70" height="120" rx="6" fill="#E2DFD7" />
          <rect x="450" y="40" width="120" height="60" rx="6" fill="#DCE6D6" />
        </svg>
        <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-full place-items-center">
          <MapPin className="size-12 fill-accent text-white drop-shadow" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="absolute bottom-4 right-4 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow group-hover:bg-ink group-hover:text-white">פתיחה ב-Google Maps</span>
      </a>
    </div>
  );
}
