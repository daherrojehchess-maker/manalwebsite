import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { BrandGrid, ContractorCta, GuideCards, ProductRail, ProfessionGrid, ProjectGrid, ReviewsPlaceholder, Section, StoreInfo, TrustSection } from "@/components/blocks";
import { SectionHeader, WhatsAppIcon } from "@/components/ui/primitives";
import { bestsellers, homeCategoryMosaic, onSale, quickShortcuts, type Art } from "@/lib/catalog";
import { site, whatsappHref } from "@/lib/site";

const shelf: Art[][] = [
  [
    { kind: "bucket", color: "#FFFFFF", label: "PAINT" },
    { kind: "bucket", color: "#D9D4C7", label: "EXT" },
    { kind: "tube", color: "#EDEBE6", label: "SIKA" },
    { kind: "spray", color: "#1A56A8" },
  ],
  [
    { kind: "drill", color: "#1A56A8" },
    { kind: "level", color: "#E4B343" },
    { kind: "faucet", color: "#C0C6CC" },
  ],
  [
    { kind: "bag", color: "#8A8F96", label: "CEMENT" },
    { kind: "bag", color: "#EDEBE6", label: "C2TE" },
    { kind: "roller", color: "#1A56A8" },
    { kind: "pipe", color: "#C97B4A" },
  ],
];

function Hero() {
  return (
    <section className="pt-4 md:pt-6">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-xl bg-ink text-white lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-14">
            <h1 className="text-[30px] font-bold leading-[1.2] md:text-[44px] md:leading-[1.15]">כל מה שצריך לבנייה ולשיפוץ — במקום אחד</h1>
            <p className="mt-4 max-w-xl text-[17px] text-white/75 md:text-lg">חומרי בניין, כלי עבודה ומוצרים מהמותגים המובילים, עם שירות מקצועי ומשלוחים מהירים.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary min-h-13 px-7 text-[17px]">
                לכל המוצרים
              </Link>
              <a href={whatsappHref()} target="_blank" rel="noopener" className="btn min-h-13 border-[1.5px] border-white/40 px-6 text-[17px] text-white hover:bg-white/10">
                <WhatsAppIcon className="size-5" />
                ייעוץ מקצועי
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/80">
              {["איסוף עצמי מהחנות", "מחירים מיוחדים לקבלנים", `משלוח חינם מעל ${site.freeShippingText}`].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-[#8FB3DA]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden min-h-[380px] bg-[#23272C] lg:block" aria-hidden>
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 64px)" }} />
            <div className="absolute inset-6 flex flex-col justify-between">
              {shelf.map((row, i) => (
                <div key={i} className="relative flex items-end justify-around px-4">
                  {row.map((art, j) => (
                    <ProductArt key={j} art={art} className="size-[100px] xl:size-[112px]" />
                  ))}
                  <div className="absolute inset-x-0 -bottom-1 h-2.5 rounded-sm bg-[#3A3F45]" />
                </div>
              ))}
            </div>
            <p className="absolute bottom-3 left-4 text-[11px] text-white/40">[להחלפה בצילום אמיתי של המחסן / החנות]</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MainCategories() {
  const [top, bottom] = [homeCategoryMosaic.slice(0, 2), homeCategoryMosaic.slice(2)];
  return (
    <Section>
      <SectionHeader title="מה אתם מחפשים?" href="/products" linkText="לכל המוצרים" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-6">
        {top.map((c) => (
          <li key={c.title} className="lg:col-span-3">
            <CategoryTile tile={c} tall={false} />
          </li>
        ))}
        {bottom.map((c) => (
          <li key={c.title} className="sm:col-span-1 lg:col-span-2">
            <CategoryTile tile={c} tall />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-muted">[רקע הקטגוריות להחלפה בצילומים אמיתיים מהחנות / מהשטח]</p>
    </Section>
  );
}

function CategoryTile({
  tile,
  tall,
}: {
  tile: (typeof homeCategoryMosaic)[number];
  tall: boolean;
}) {
  const light = tile.ink === "light";
  const hasPhoto = Boolean(tile.image);
  return (
    <Link
      href={tile.href}
      aria-label={tile.title}
      className={`group relative block outline-offset-4 [mask-image:url(/categories/brush-mask.png)] [mask-size:100%_100%] [mask-repeat:no-repeat] [mask-mode:alpha] [-webkit-mask-image:url(/categories/brush-mask.png)] [-webkit-mask-size:100%_100%] [-webkit-mask-repeat:no-repeat] ${tall ? "aspect-[4/5] sm:aspect-[5/6] lg:aspect-[5/6]" : "aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/10]"}`}
    >
      <span className="absolute inset-0 overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105" aria-hidden>
        {hasPhoto ? (
          <Image src={tile.image!} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority={tile.title === "ברזים"} />
        ) : (
          <span className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${tile.scene.from} 0%, ${tile.scene.via} 48%, ${tile.scene.to} 100%)` }} />
        )}
      </span>
      {!hasPhoto ? (
        <>
          <span
            className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
            aria-hidden
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 3px, rgb(0 0 0 / 0.04) 3px 4px), repeating-linear-gradient(0deg, transparent 0 5px, rgb(255 255 255 / 0.03) 5px 6px)",
            }}
          />
          <span className="absolute inset-0 grid place-items-center p-6 opacity-40 transition-opacity duration-300 group-hover:opacity-55" aria-hidden>
            <ProductArt art={tile.art} className={tall ? "size-[55%] max-h-44" : "size-[42%] max-h-40"} />
          </span>
        </>
      ) : null}
      <span className={`absolute inset-0 ${light ? "bg-gradient-to-t from-black/50 via-black/20 to-black/10" : "bg-gradient-to-t from-white/25 via-transparent to-black/[0.04]"}`} aria-hidden />
      <span
        className={`relative z-10 flex size-full items-center justify-center px-4 text-center text-[22px] font-bold leading-tight tracking-tight md:text-[28px] lg:text-[30px] ${light ? "text-white drop-shadow-[0_1px_8px_rgb(0_0_0/0.45)]" : "text-ink"}`}
      >
        {tile.title}
      </span>
    </Link>
  );
}

function QuickShortcuts() {
  return (
    <section className="pb-4" aria-label="גישה מהירה">
      <div className="container-x">
        <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:justify-between md:px-0">
          {quickShortcuts.map((s) => (
            <li key={s.title} className="shrink-0">
              <Link href={s.href} className="group flex w-[84px] flex-col items-center gap-2 text-center md:w-[96px]">
                <span className="grid size-[76px] place-items-center rounded-full border border-line bg-white p-3 transition-colors group-hover:border-accent md:size-[88px]">
                  <ProductArt art={s.art} className="size-full" />
                </span>
                <span className="text-[14px] font-medium group-hover:text-accent">{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="py-4 md:py-6">
      <div className="container-x">
        <Link href="/projects/roof-sealing" className="group grid items-center gap-4 overflow-hidden rounded-xl border border-line bg-accent-soft px-6 py-6 md:grid-cols-[auto_1fr_auto] md:px-10">
          <ProductArt art={{ kind: "bucket", color: "#F4F1EA", label: "ROOF" }} className="hidden size-24 md:block" />
          <div>
            <p className="text-sm font-semibold text-accent">לקראת החורף</p>
            <p className="text-xl font-bold md:text-2xl">עונת האיטום כבר כאן — כל מה שצריך לאיטום הגג, ברשימה אחת</p>
          </div>
          <span className="btn btn-primary w-fit">לרשימת הקנייה</span>
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const top = (await bestsellers()).slice(0, 10);
  const sale = (await onSale()).slice(0, 10);
  return (
    <>
      <Hero />
      <MainCategories />
      <QuickShortcuts />
      <Section>
        <ProductRail title="הכי נמכרים" products={top} href="/products?sort=bestsellers" />
      </Section>
      <PromoBanner />
      <Section>
        <SectionHeader title="מה אתם רוצים לעשות?" subtitle="רשימות קנייה מלאות לפי פרויקט — חומרים, כלים והדרכה" href="/projects" linkText="לכל הפרויקטים" />
        <ProjectGrid />
      </Section>
      <Section tone="stone">
        <ProfessionGrid />
      </Section>
      <Section>
        <ProductRail title="המבצעים שלנו" products={sale} href="/sale" subtitle="מחירים מיוחדים לזמן מוגבל" />
      </Section>
      <TrustSection />
      <Section>
        <SectionHeader title="המותגים שלנו" href="/brands" linkText="לכל המותגים" />
        <BrandGrid limit={9} />
      </Section>
      <ContractorCta />
      <Section>
        <SectionHeader title="מדריכים וטיפים" href="/guides" linkText="לכל המדריכים" />
        <GuideCards />
      </Section>
      <Section>
        <ReviewsPlaceholder />
      </Section>
      <Section>
        <StoreInfo />
      </Section>
    </>
  );
}
