import Link from "next/link";
import { Clock, CreditCard, Lock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { categories, guides } from "@/lib/catalog";
import { phoneHref, site, whatsappHref } from "@/lib/site";
import { Logo } from "./Logo";

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="mb-3 text-[15px] font-bold text-white">{title}</h2>
      <ul className="space-y-2">
        {links.map(([href, label]) => (
          <li key={href + label}>
            <Link href={href} className="text-[15px] text-white/70 hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-ink pb-24 text-white lg:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-xs text-[15px] text-white/70">חומרי בניין, שיפוץ וכלי עבודה לבית ולאנשי מקצוע. ייעוץ מקצועי, משלוחים ואיסוף עצמי.</p>
          <ul className="space-y-2.5 text-[15px] text-white/80">
            <li>
              <a href={phoneHref()} className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4" aria-hidden /> <bdi>{site.phoneDisplay}</bdi>
              </a>
            </li>
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="size-4" /> <bdi>{site.whatsappDisplay}</bdi>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden /> {site.address}, {site.city}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden /> {site.hours[0].days}: {site.hours[0].time}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden /> <bdi>{site.email}</bdi>
            </li>
          </ul>
        </div>
        <Col title="קטגוריות" links={categories.slice(0, 8).map((c) => [`/c/${c.slug}`, c.name])} />
        <Col
          title="שירות לקוחות"
          links={[
            ["/store", "צרו קשר"],
            ["/policies/shipping", "משלוחים ואיסוף"],
            ["/policies/returns", "החזרות והחלפות"],
            ["/policies/cancellation", "ביטול עסקה"],
            ["/account", "מעקב הזמנה"],
          ]}
        />
        <Col
          title="מידע"
          links={[
            ["/about", "אודות"],
            ["/store", "החנות ושעות פעילות"],
            ["/brands", "מותגים"],
            ["/policies/terms", "תקנון האתר"],
            ["/policies/privacy", "מדיניות פרטיות"],
            ["/accessibility", "הצהרת נגישות"],
          ]}
        />
        <Col
          title="לקבלנים"
          links={[
            ["/pros", "מחירים לאנשי מקצוע"],
            ["/quote/request", "בקשת הצעת מחיר"],
            ["/quote", "רשימת הצעת מחיר"],
            ["/pros/contractors", "לקבלנים"],
            ["/pros/renovators", "לשיפוצניקים"],
          ]}
        />
        <Col title="מדריכים" links={guides.slice(0, 5).map((g) => [`/guides/${g.slug}`, g.title])} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-5 text-sm text-white/60 md:flex-row md:items-center">
          <p>
            © {site.name} · כל המחירים כוללים מע״מ · <span className="text-white/80">האתר בהקמה — מוצרים ומחירים לדוגמה בלבד</span>
          </p>
          <p className="flex items-center gap-3">
            <Lock className="size-4" aria-hidden /> תשלום מאובטח
            <CreditCard className="size-4" aria-hidden /> אשראי · Apple Pay · Google Pay · Bit
          </p>
        </div>
      </div>
    </footer>
  );
}
