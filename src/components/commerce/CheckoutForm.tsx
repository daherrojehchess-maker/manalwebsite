"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Lock, Store, TriangleAlert, Truck } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { PlaceholderNote } from "@/components/ui/primitives";
import { cn, formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { createCheckoutOrder } from "@/lib/orders/create-order";
import { actions, useStore } from "@/lib/store";
import { computeTotals, type Fulfillment } from "@/lib/totals";
import { unitPrice, useLineProducts } from "@/lib/useLines";

export type PayMethod = "card" | "applepay" | "googlepay" | "bit";
const PAY: { id: PayMethod; label: string; hint: string }[] = [
  { id: "card", label: "כרטיס אשראי", hint: `עד ${site.installmentsText} תשלומים` },
  { id: "applepay", label: "Apple Pay", hint: "במכשירי Apple" },
  { id: "googlepay", label: "Google Pay", hint: "ב-Android וב-Chrome" },
  { id: "bit", label: "Bit", hint: "תשלום מהנייד" },
];
const HEAVY = new Set(["building-materials", "drywall", "tiling"]);

type Errors = Record<string, string>;

export function CheckoutForm({ initialPay = "card" }: { initialPay?: PayMethod }) {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const hydrated = useStore((s) => s.hydrated);
  const { items, loading } = useLineProducts(cart.map((l) => l.productId));
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [pay, setPay] = useState<PayMethod>(initialPay);
  const [business, setBusiness] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated || (loading && !items.length)) return <div className="card h-96 animate-pulse bg-stone" aria-busy="true" />;
  if (!cart.length && !submitting) {
    return (
      <div className="card p-10 text-center">
        <h2 className="text-2xl font-bold">אין מוצרים בעגלה</h2>
        <Link href="/products" className="btn btn-primary mt-6">
          לכל המוצרים
        </Link>
      </div>
    );
  }

  const byId = new Map(items.map((p) => [p.id, p]));
  const lines = cart.map((l) => ({ line: l, product: byId.get(l.productId) })).filter((x) => x.product);
  const subtotal = lines.reduce((s, { line, product }) => s + unitPrice(product!, line.selection) * line.qty, 0);
  const t = computeTotals(subtotal, fulfillment);
  const heavy = lines.some(({ product }) => HEAVY.has(product!.category));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (!v("firstName")) errs.firstName = "נא למלא שם פרטי";
    if (!v("lastName")) errs.lastName = "נא למלא שם משפחה";
    if (!/^0\d{8,9}$/.test(v("phone").replace(/\D/g, ""))) errs.phone = "נא למלא מספר טלפון תקין";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) errs.email = "נא למלא כתובת אימייל תקינה";
    if (business && !v("company")) errs.company = "נא למלא שם עסק";
    if (business && !/^\d{9}$/.test(v("companyId").replace(/\D/g, ""))) errs.companyId = "ח.פ. / ע.מ. — 9 ספרות";
    if (fulfillment === "delivery") {
      if (!v("city")) errs.city = "נא למלא עיר";
      if (!v("street")) errs.street = "נא למלא רחוב ומספר";
    }
    if (!fd.get("terms")) errs.terms = "יש לאשר את התקנון ומדיניות הפרטיות";
    setErrors(errs);
    setFormError(null);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!cart.length) return;
    setSubmitting(true);
    const existingKey = sessionStorage.getItem("bm-checkout-idempotency");
    const idempotencyKey = existingKey && existingKey.length > 0 ? existingKey : crypto.randomUUID();
    sessionStorage.setItem("bm-checkout-idempotency", idempotencyKey);
    const result = await createCheckoutOrder({
      idempotencyKey,
      items: cart.map((line) => ({ slug: line.productId, quantity: line.qty, selection: line.selection })),
      firstName: v("firstName"),
      lastName: v("lastName"),
      phone: v("phone"),
      email: v("email"),
      fulfillment,
      city: v("city"),
      street: v("street"),
      apt: v("apt"),
      elevator: v("elevator"),
      notes: v("notes"),
      company: business ? v("company") : undefined,
      companyId: business ? v("companyId") : undefined,
      terms: true,
    });
    if (!result.ok) {
      setFormError(result.error);
      setSubmitting(false);
      return;
    }
    sessionStorage.removeItem("bm-checkout-idempotency");
    actions.clearCart();
    router.push(`/checkout/success?order=${encodeURIComponent(result.orderId)}&m=${fulfillment}`);
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, span = false) => (
    <div className={span ? "min-w-0 sm:col-span-2" : "min-w-0"}>
      <label htmlFor={`co-${name}`} className="label">
        {label}
      </label>
      <input id={`co-${name}`} name={name} className="field" aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `co-${name}-err` : undefined} {...props} />
      {errors[name] ? (
        <p id={`co-${name}-err`} className="mt-1 text-sm font-medium text-danger">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  const choice = (active: boolean) => cn("flex cursor-pointer items-start gap-3 rounded-lg border-[1.5px] p-4 transition-colors", active ? "border-accent bg-accent-soft" : "border-line bg-white hover:border-line-strong");

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="grid min-w-0 gap-6">
        <fieldset className="card min-w-0 p-5 md:p-6" aria-labelledby="co-step-personal">
          <h2 id="co-step-personal" className="mb-4 text-xl font-bold">1. פרטים אישיים</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("firstName", "שם פרטי *", { autoComplete: "given-name" })}
            {field("lastName", "שם משפחה *", { autoComplete: "family-name" })}
            {field("phone", "טלפון נייד *", { type: "tel", inputMode: "tel", autoComplete: "tel", dir: "ltr", className: "field text-right" })}
            {field("email", "אימייל (לקבלת חשבונית) *", { type: "email", autoComplete: "email", dir: "ltr", className: "field text-right" })}
          </div>
          <label className="mt-4 flex items-center gap-3 text-[16px]">
            <input type="checkbox" checked={business} onChange={(e) => setBusiness(e.target.checked)} className="size-5 accent-[var(--color-accent)]" />
            חשבונית מס על שם עסק
          </label>
          {business ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {field("company", "שם העסק *", { autoComplete: "organization" })}
              {field("companyId", "ח.פ. / ע.מ. *", { inputMode: "numeric", dir: "ltr", className: "field text-right" })}
            </div>
          ) : null}
        </fieldset>

        <fieldset className="card min-w-0 p-5 md:p-6" aria-labelledby="co-step-shipping">
          <h2 id="co-step-shipping" className="mb-4 text-xl font-bold">2. משלוח או איסוף</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={choice(fulfillment === "delivery")}>
              <input type="radio" name="fulfillment" value="delivery" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} className="mt-1 size-5 accent-[var(--color-accent)]" />
              <span>
                <span className="flex items-center gap-2 font-bold">
                  <Truck className="size-5" aria-hidden /> משלוח עד הבית / לאתר
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {t.shipping === 0 && fulfillment === "delivery" ? "חינם" : site.shippingPrice !== null ? formatPrice(site.shippingPrice) : site.shippingPriceText} · תוך {site.deliveryTimeText}
                </span>
              </span>
            </label>
            <label className={choice(fulfillment === "pickup")}>
              <input type="radio" name="fulfillment" value="pickup" checked={fulfillment === "pickup"} onChange={() => setFulfillment("pickup")} className="mt-1 size-5 accent-[var(--color-accent)]" />
              <span>
                <span className="flex items-center gap-2 font-bold">
                  <Store className="size-5" aria-hidden /> איסוף עצמי מהחנות
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  ללא עלות · {site.address}, {site.city}
                </span>
              </span>
            </label>
          </div>
          {fulfillment === "delivery" ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field("city", "עיר / יישוב *", { autoComplete: "address-level2" })}
              {field("street", "רחוב ומספר בית *", { autoComplete: "address-line1" })}
              {field("apt", "קומה / דירה", { autoComplete: "address-line2" })}
              <div>
                <label htmlFor="co-elevator" className="label">
                  מעלית בבניין
                </label>
                <select id="co-elevator" name="elevator" className="field">
                  <option>בית פרטי / קומת קרקע</option>
                  <option>יש מעלית</option>
                  <option>אין מעלית</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-notes" className="label">
                  הערות לשליח
                </label>
                <textarea id="co-notes" name="notes" rows={2} className="field" placeholder="קוד כניסה, שעות נוחות, איש קשר באתר…" />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-[15px] text-ink-2">נשלח הודעה כשההזמנה מוכנה לאיסוף (בדרך כלל תוך {site.pickupReadyText}).</p>
          )}
          {heavy && fulfillment === "delivery" ? (
            <p className="mt-4 flex gap-2 rounded-md bg-[#FFF7E6] p-3 text-[15px]">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
              בהזמנה יש סחורה כבדה (שקים / לוחות). המשלוח יתואם טלפונית; פריקה עד המדרכה אלא אם סוכם אחרת.
            </p>
          ) : null}
        </fieldset>

        <fieldset className="card min-w-0 p-5 md:p-6" aria-labelledby="co-step-payment">
          <h2 id="co-step-payment" className="mb-4 text-xl font-bold">3. תשלום</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAY.map((m) => (
              <label key={m.id} className={choice(pay === m.id)}>
                <input type="radio" name="pay" value={m.id} checked={pay === m.id} onChange={() => setPay(m.id)} className="mt-1 size-5 accent-[var(--color-accent)]" />
                <span>
                  <span className="block font-bold">{m.label}</span>
                  <span className="block text-sm text-muted">{m.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {pay === "card" ? (
            <div className="mt-5 flex items-center gap-3 rounded-md border border-dashed border-line-strong bg-stone/60 p-4 text-[15px] text-ink-2">
              <CreditCard className="size-6 shrink-0 text-muted" aria-hidden />
              פרטי הכרטיס יוזנו בעמוד סליקה מאובטח של חברת הסליקה. האתר לא שומר פרטי אשראי.
            </div>
          ) : null}
          <PlaceholderNote className="mt-4">[חיבור לספק סליקה ישראלי (למשל Cardcom / Tranzila / Meshulam / PayPlus) יוגדר בשלב חיבור המערכת]</PlaceholderNote>
        </fieldset>
      </div>

      <aside className="card flex flex-col gap-4 p-5 md:p-6 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold">ההזמנה שלכם</h2>
        <ul className="grid max-h-72 gap-3 overflow-y-auto">
          {lines.map(({ line, product: p }) => (
            <li key={line.key} className="flex items-center gap-3">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-md bg-stone p-1.5">
                <ProductArt art={p!.art} className="size-full" />
                <span className="num absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{line.qty}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-[15px] font-medium">{p!.name}</span>
                {Object.values(line.selection).length ? <span className="block text-[13px] text-muted">{Object.values(line.selection).join(" · ")}</span> : null}
              </span>
              <span className="num text-[15px] font-semibold">{formatPrice(unitPrice(p!, line.selection) * line.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="grid gap-2 border-t border-line pt-4 text-[16px]">
          <div className="flex justify-between">
            <dt>סכום ביניים</dt>
            <dd className="num">{formatPrice(t.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{fulfillment === "pickup" ? "איסוף עצמי" : "משלוח"}</dt>
            <dd className="num">{t.shipping === 0 ? "חינם" : t.shipping !== null ? formatPrice(t.shipping) : site.shippingPriceText}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
            <dt>סה״כ לתשלום</dt>
            <dd className="num">{formatPrice(t.total)}</dd>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <dt>כולל מע״מ</dt>
            <dd className="num">{formatPrice(t.vat)}</dd>
          </div>
        </dl>
        <label className="flex items-start gap-3 text-[15px]">
          <input type="checkbox" name="terms" className="mt-1 size-5 accent-[var(--color-accent)]" aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? "co-terms-err" : undefined} />
          <span>
            קראתי ואני מסכים/ה ל
            <Link href="/policies/terms" target="_blank" className="underline">
              תקנון
            </Link>{" "}
            ול
            <Link href="/policies/privacy" target="_blank" className="underline">
              מדיניות הפרטיות
            </Link>
          </span>
        </label>
        {errors.terms ? (
          <p id="co-terms-err" className="-mt-2 text-sm font-medium text-danger">
            {errors.terms}
          </p>
        ) : null}
        {formError ? (
          <p className="text-sm font-medium text-danger" role="alert">
            {formError}
          </p>
        ) : null}
        <label className="flex items-start gap-3 text-[15px] text-ink-2">
          <input type="checkbox" name="marketing" className="mt-1 size-5 accent-[var(--color-accent)]" />
          אשמח לקבל עדכונים ומבצעים (אפשר להסיר בכל עת)
        </label>
        <button type="submit" disabled={submitting} className="btn btn-primary min-h-13 w-full text-[17px]">
          <Lock className="size-5" aria-hidden />
          {pay === "card" ? "המשך לתשלום מאובטח" : `תשלום ב-${PAY.find((m) => m.id === pay)!.label}`}
        </button>
        <p className="text-center text-[13px] text-muted">בלחיצה תועברו לתשלום. חשבונית מס תישלח לאימייל.</p>
      </aside>
    </form>
  );
}
