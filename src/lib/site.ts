/**
 * Business details. Every bracketed value is a placeholder the owner must replace.
 * Numeric/contact fields stay null until real values are supplied; the UI falls back to the bracketed text.
 */
export const site = {
  name: "[שם העסק]",
  tagline: "חומרי בניין, שיפוץ וכלי עבודה",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.co.il",
  phoneDisplay: "[טלפון]",
  /** Digits only, e.g. "0501234567". */
  phoneDigits: null as string | null,
  whatsappDisplay: "[WhatsApp]",
  /** International format without "+", e.g. "972501234567". */
  whatsappE164: null as string | null,
  email: "[אימייל]",
  address: "[כתובת]",
  city: "[עיר]",
  hours: [
    { days: "א׳–ה׳", time: "[שעות פעילות]" },
    { days: "ו׳ וערבי חג", time: "[שעות פעילות]" },
    { days: "שבת", time: "סגור" },
  ],
  deliveryAreas: "[אזורי משלוח]",
  shippingPriceText: "[מחיר משלוח]",
  freeShippingText: "[סכום למשלוח חינם]",
  /** Set a number (₪) to enable the free-shipping progress bar in the cart. */
  freeShippingThreshold: null as number | null,
  shippingPrice: null as number | null,
  deliveryTimeText: "[זמן אספקה]",
  pickupReadyText: "[זמן הכנה לאיסוף]",
  installmentsText: "[מספר תשלומים]",
  yearsExperience: "[שנות ניסיון]",
  quoteResponseText: "[זמן מענה להצעת מחיר]",
  vatRate: 0.18,
} as const;

export function phoneHref() {
  return site.phoneDigits ? `tel:${site.phoneDigits}` : "/store";
}

export function whatsappHref(text = "היי, אשמח לקבל ייעוץ לגבי מוצר באתר") {
  const base = site.whatsappE164 ? `https://wa.me/${site.whatsappE164}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function wazeHref() {
  return `https://waze.com/ul?q=${encodeURIComponent(`${site.address} ${site.city}`)}&navigate=yes`;
}

export function mapsHref() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.address} ${site.city}`)}`;
}
