"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, FileText, Upload, X } from "lucide-react";
import { PlaceholderNote, WhatsAppIcon } from "@/components/ui/primitives";
import { site, whatsappHref } from "@/lib/site";
import { actions, useStore } from "@/lib/store";

const CUSTOMER_TYPES = ["קבלן / חברת בנייה", "שיפוצניק", "איש מקצוע (צבע, אינסטלציה, חשמל…)", "מוסד / ועד בית / עירייה", "לקוח פרטי – פרויקט גדול"];
const MAX_MB = 10;
const ACCEPT = ".pdf,.xls,.xlsx,.csv,.doc,.docx,.jpg,.jpeg,.png";

type Errors = Partial<Record<"name" | "phone" | "materials" | "consent" | "files", string>>;

export function QuoteRequestForm({ useList = false }: { useList?: boolean }) {
  const quote = useStore((s) => s.quote);
  const listText = quote.map((l) => `${l.qty} ${l.unit} — ${l.name}${l.note ? ` (${l.note})` : ""}`).join("\n");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="card p-6 text-center md:p-10" role="status">
        <CircleCheck className="mx-auto size-14 text-success" aria-hidden />
        <h2 className="mt-3 text-2xl font-bold">הבקשה התקבלה</h2>
        <p className="mt-2 text-[17px] text-ink-2">
          מספר בקשה: <bdi className="num font-bold">{sent}</bdi>
        </p>
        <p className="mt-1 text-ink-2">נחזור אליכם עם הצעת מחיר תוך {site.quoteResponseText}.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={whatsappHref(`היי, שלחתי בקשה להצעת מחיר מספר ${sent}`)} target="_blank" rel="noopener" className="btn btn-whatsapp">
            <WhatsAppIcon className="size-5" />
            המשך ב-WhatsApp
          </a>
          <Link href="/" className="btn btn-secondary">
            חזרה לחנות
          </Link>
        </div>
        <PlaceholderNote className="mx-auto mt-8 max-w-md text-start">
          [שלב הדגמה: הטופס עדיין לא מחובר לשרת. בהמשך הבקשות יישלחו למייל העסק ויופיעו בממשק הניהול תחת &quot;בקשות להצעת מחיר&quot;.]
        </PlaceholderNote>
      </div>
    );
  }

  function onFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    let err: string | undefined;
    for (const f of Array.from(list)) {
      if (f.size > MAX_MB * 1024 * 1024) err = `הקובץ ${f.name} גדול מ-${MAX_MB}MB`;
      else if (!next.some((x) => x.name === f.name)) next.push(f);
    }
    setFiles(next.slice(0, 5));
    setErrors((e) => ({ ...e, files: err }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Errors = {};
    if (!String(fd.get("name") ?? "").trim()) errs.name = "נא למלא שם";
    const phone = String(fd.get("phone") ?? "").replace(/\D/g, "");
    if (!/^0\d{8,9}$/.test(phone)) errs.phone = "נא למלא מספר טלפון תקין";
    if (!String(fd.get("materials") ?? "").trim() && !files.length) errs.materials = "נא לפרט חומרים או לצרף קובץ";
    if (!fd.get("consent")) errs.consent = "נא לאשר את מדיניות הפרטיות";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setSent(`Q-${Date.now().toString().slice(-6)}`);
    if (useList) actions.clearQuote();
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1 text-sm font-medium text-danger">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card grid gap-5 p-5 md:grid-cols-2 md:p-8">
      <div>
        <label htmlFor="q-name" className="label">
          שם מלא *
        </label>
        <input id="q-name" name="name" autoComplete="name" className="field" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-err" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="q-phone" className="label">
          טלפון *
        </label>
        <input id="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="field text-right" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-err" : undefined} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="q-business" className="label">
          שם העסק
        </label>
        <input id="q-business" name="business" autoComplete="organization" className="field" />
      </div>
      <div>
        <label htmlFor="q-type" className="label">
          סוג לקוח
        </label>
        <select id="q-type" name="type" className="field">
          {CUSTOMER_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="q-area" className="label">
          אזור עבודה
        </label>
        <input id="q-area" name="area" placeholder="עיר / אזור האתר" className="field" />
      </div>
      <div>
        <label htmlFor="q-date" className="label">
          מועד אספקה רצוי
        </label>
        <input id="q-date" name="date" type="date" className="field" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="q-materials" className="label">
          רשימת חומרים *
        </label>
        <textarea
          id="q-materials"
          name="materials"
          rows={6}
          defaultValue={useList ? listText : ""}
          key={useList ? listText : "empty"}
          placeholder={"לדוגמה:\n50 שקי מלט 50 ק״ג\n20 לוחות גבס ירוק\n30 דליי צבע לבן 18 ל׳"}
          className="field"
          aria-invalid={Boolean(errors.materials)}
          aria-describedby={errors.materials ? "materials-err" : undefined}
        />
        {err("materials")}
      </div>
      <div>
        <label htmlFor="q-qty" className="label">
          כמות / היקף משוער
        </label>
        <input id="q-qty" name="quantity" placeholder="לדוגמה: דירת 4 חדרים, 120 מ״ר" className="field" />
      </div>
      <div>
        <span className="label">קבצים (כתב כמויות, רשימת חומרים, תוכניות)</span>
        <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-strong bg-stone/50 px-4 text-[15px] font-medium hover:border-ink">
          <Upload className="size-5" aria-hidden />
          בחירת קבצים
          <input type="file" name="files" multiple accept={ACCEPT} className="sr-only" onChange={(e) => onFiles(e.target.files)} />
        </label>
        <p className="mt-1 text-[13px] text-muted">PDF, Excel, Word או תמונה · עד {MAX_MB}MB לקובץ · עד 5 קבצים</p>
        {err("files")}
        {files.length ? (
          <ul className="mt-2 grid gap-1.5">
            {files.map((f) => (
              <li key={f.name} className="flex items-center gap-2 rounded-md bg-stone px-3 py-2 text-sm">
                <FileText className="size-4 shrink-0" aria-hidden />
                <bdi className="line-clamp-1 flex-1">{f.name}</bdi>
                <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))} aria-label={`הסרת ${f.name}`} className="grid size-7 place-items-center rounded hover:bg-stone-2">
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-[15px]">
          <input type="checkbox" name="consent" className="mt-1 size-5 accent-[var(--color-accent)]" aria-invalid={Boolean(errors.consent)} />
          <span>
            אני מאשר/ת את{" "}
            <Link href="/policies/privacy" className="underline">
              מדיניות הפרטיות
            </Link>{" "}
            ומסכים/ה לקבל פנייה בנוגע לבקשה.
          </span>
        </label>
        {err("consent")}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
        <button type="submit" className="btn btn-primary min-h-13 text-[17px] sm:min-w-72">
          שליחת בקשה להצעת מחיר
        </button>
        <a href={whatsappHref("היי, אני איש מקצוע ואשמח לקבל הצעת מחיר")} target="_blank" rel="noopener" className="btn btn-whatsapp min-h-13">
          <WhatsAppIcon className="size-5" />
          או שלחו רשימה ב-WhatsApp
        </a>
      </div>
    </form>
  );
}
