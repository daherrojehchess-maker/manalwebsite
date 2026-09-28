import type { Metadata } from "next";
import { Mail, MessageCircle, Package, Truck } from "lucide-react";
import { Section, StoreInfo } from "@/components/blocks";
import { Breadcrumbs, WhatsAppIcon } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "החנות שלנו – כתובת, שעות פעילות ואיסוף עצמי",
  description: `${site.name}: ${site.address}, ${site.city}. שעות פעילות, ניווט ב-Waze, אזורי משלוח ואיסוף עצמי.`,
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "החנות וצור קשר" }]} />
        <h1 className="mb-6 text-[28px] font-bold md:text-[36px]">החנות וצור קשר</h1>
        <StoreInfo />
      </div>
      <Section>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <li className="card p-5">
            <Truck className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">אזורי משלוח</h2>
            <p className="mt-1 text-[15px] text-muted">
              {site.deliveryAreas} · אספקה תוך {site.deliveryTimeText} · {site.shippingPriceText}
            </p>
          </li>
          <li className="card p-5">
            <Package className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">איסוף עצמי</h2>
            <p className="mt-1 text-[15px] text-muted">הזמינו באתר ואספו מהחנות — מוכן תוך {site.pickupReadyText}. נשלח הודעה כשההזמנה מוכנה.</p>
          </li>
          <li className="card p-5">
            <MessageCircle className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">WhatsApp</h2>
            <p className="mt-1 text-[15px] text-muted">שאלה על מוצר, בקשת מחיר או תמונה מהשטח.</p>
            <a href={whatsappHref()} target="_blank" rel="noopener" className="btn btn-whatsapp mt-4 w-full">
              <WhatsAppIcon className="size-5" />
              <bdi>{site.whatsappDisplay}</bdi>
            </a>
          </li>
          <li className="card p-5">
            <Mail className="size-7 text-accent" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">אימייל</h2>
            <p className="mt-1 text-[15px] text-muted">
              <bdi>{site.email}</bdi>
            </p>
          </li>
        </ul>
      </Section>
    </>
  );
}
