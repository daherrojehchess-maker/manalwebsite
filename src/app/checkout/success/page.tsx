import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { PlaceholderNote, WhatsAppIcon } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/format";
import { getCheckoutConfirmation } from "@/lib/orders/confirmation";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = { title: "ההזמנה התקבלה", robots: { index: false } };

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const sp = await searchParams;
  const raw = typeof sp.order === "string" ? sp.order : "";
  const order = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw) ? raw : "";
  const pickup = sp.m === "pickup";
  const confirmation = order ? await getCheckoutConfirmation(order) : null;
  return (
    <div className="container-x max-w-2xl py-12 text-center">
      <CircleCheck className="mx-auto size-16 text-success" aria-hidden />
      <h1 className="mt-4 text-[30px] font-bold">תודה! ההזמנה התקבלה</h1>
      {order ? (
        <p className="mt-2 text-[18px]">
          מספר הזמנה: <bdi className="num font-bold">{order}</bdi>
        </p>
      ) : null}
      <p className="mt-3 text-[17px] text-ink-2">
        {pickup ? `נשלח הודעה כשההזמנה מוכנה לאיסוף (בדרך כלל תוך ${site.pickupReadyText}).` : `נציג יתאם אתכם את מועד המשלוח. זמן אספקה: ${site.deliveryTimeText}.`} אישור וחשבונית מס יישלחו לאימייל.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          חזרה לחנות
        </Link>
        <a href={whatsappHref(`היי, לגבי הזמנה מספר ${order}`)} target="_blank" rel="noopener" className="btn btn-whatsapp">
          <WhatsAppIcon className="size-5" />
          שאלה על ההזמנה
        </a>
      </div>
      <PlaceholderNote className="mx-auto mt-10 text-start">
        <p>ההזמנה נשמרה וממתינה לתשלום. לא בוצע חיוב. חיבור לספק הסליקה יגיע בשלב נפרד.</p>
        {confirmation ? (
          <>
            <ul className="mt-3 grid gap-1">
              {confirmation.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
            <p className="num mt-2">סה״כ {formatPrice(confirmation.total)}</p>
          </>
        ) : null}
      </PlaceholderNote>
    </div>
  );
}
