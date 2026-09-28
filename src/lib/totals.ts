import { site } from "@/lib/site";

export type Fulfillment = "delivery" | "pickup";

/** Prices are VAT-inclusive (consumer pricing in Israel). */
export function computeTotals(subtotal: number, fulfillment: Fulfillment = "delivery") {
  const threshold = site.freeShippingThreshold;
  const freeShipping = threshold !== null && subtotal >= threshold;
  const shipping: number | null = fulfillment === "pickup" || freeShipping ? 0 : site.shippingPrice;
  const total = subtotal + (shipping ?? 0);
  const vat = total - total / (1 + site.vatRate);
  return { subtotal, shipping, total, vat, threshold, remainingForFree: threshold !== null ? Math.max(0, threshold - subtotal) : null };
}
