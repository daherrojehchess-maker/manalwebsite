"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { bindCheckoutConfirmationCookie, readCheckoutConfirmationToken } from "@/lib/orders/confirmation";
import { allowRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/security/rate-limit";

export type CheckoutItemInput = {
  slug: string;
  quantity: number;
  selection?: Record<string, string>;
};

export type CheckoutOrderInput = {
  idempotencyKey: string;
  items: CheckoutItemInput[];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  fulfillment: "delivery" | "pickup";
  city?: string;
  street?: string;
  apt?: string;
  elevator?: string;
  notes?: string;
  company?: string;
  companyId?: string;
  terms: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MESSAGES: Record<string, string> = {
  "checkout:empty_cart": "העגלה ריקה.",
  "checkout:unavailable_product": "אחד המוצרים אינו זמין להזמנה.",
  "checkout:insufficient_stock": "הכמות המבוקשת גדולה מהמלאי.",
  "checkout:invalid_quantity": "כמות לא תקינה.",
  "checkout:invalid_selection": "בחירת אפשרויות לא תקינה. חזרו למוצר ובחרו מחדש.",
  "checkout:invalid_customer": "פרטי הלקוח או הכתובת אינם תקינים.",
  "checkout:invalid_product": "לא ניתן להשלים את ההזמנה כרגע.",
  "checkout:invalid_request": "לא ניתן להשלים את ההזמנה כרגע.",
  "payment:insufficient_stock": "הכמות המבוקשת גדולה מהמלאי.",
  "payment:reservation_expired": "זמן השמירה של ההזמנה הסתיים. נסו שוב.",
  "payment:not_payable": "לא ניתן להמשיך לתשלום עבור הזמנה זו.",
  "payment:forbidden": "לא ניתן לאמת את ההזמנה.",
};

function safeMessage(raw: string | undefined) {
  for (const [code, message] of Object.entries(MESSAGES)) {
    if (raw?.includes(code)) return message;
  }
  return "לא ניתן לשמור את ההזמנה. נסו שוב.";
}

type CreatedOrder = {
  order_id?: unknown;
  created?: unknown;
  token_bound?: unknown;
};

/**
 * Creates a pending unpaid order, then holds stock for payment preparation.
 * Prices, names, and totals are resolved inside Postgres.
 * Stock is not decremented here. The raw guest token is stored only in an httpOnly cookie.
 */
export async function createCheckoutOrder(input: CheckoutOrderInput): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  if (!(await allowRateLimit("checkout_create"))) return { ok: false, error: RATE_LIMIT_MESSAGE };
  if (!input.terms) return { ok: false, error: "יש לאשר את התקנון ומדיניות הפרטיות" };
  if (!UUID_RE.test(input.idempotencyKey)) return { ok: false, error: MESSAGES["checkout:invalid_request"] };
  if (!input.items?.length || input.items.length > 50) return { ok: false, error: MESSAGES["checkout:empty_cart"] };

  const first = input.firstName.trim();
  const last = input.lastName.trim();
  let customerName = `${first} ${last}`.replace(/\s+/g, " ").trim();
  const company = input.company?.trim();
  if (company) {
    const companyId = (input.companyId ?? "").replace(/\D/g, "");
    customerName = `${customerName} | ${company} (${companyId})`;
  }

  const shippingAddress =
    input.fulfillment === "pickup"
      ? "איסוף עצמי"
      : [input.street, input.city, input.apt, input.elevator, input.notes]
          .map((part) => part?.trim())
          .filter(Boolean)
          .join(", ");

  const items = input.items.map((item) => ({
    slug: item.slug,
    quantity: item.quantity,
    selection: item.selection ?? {},
  }));

  const minted = randomBytes(32).toString("base64url");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_checkout_order", {
    p_idempotency_key: input.idempotencyKey,
    p_items: items,
    p_customer_name: customerName,
    p_customer_email: input.email.trim(),
    p_customer_phone: input.phone,
    p_shipping_address: shippingAddress,
    p_shipping_method: input.fulfillment,
    p_confirmation_token: minted,
  });

  const created = data as CreatedOrder | null;
  const orderId = typeof created?.order_id === "string" ? created.order_id : "";
  if (error || !orderId) {
    return { ok: false, error: safeMessage(error?.message) };
  }

  let guestToken = "";
  if (created?.created === true || created?.token_bound === true) {
    await bindCheckoutConfirmationCookie(minted);
    guestToken = minted;
  } else {
    guestToken = await readCheckoutConfirmationToken();
  }

  if (!(await allowRateLimit("payment_start"))) return { ok: false, error: RATE_LIMIT_MESSAGE };

  const reserved = await supabase.rpc("start_checkout_payment", {
    p_order_id: orderId,
    p_guest_token: guestToken,
  });
  if (reserved.error || reserved.data !== "initiated") {
    return { ok: false, error: safeMessage(reserved.error?.message) };
  }

  return { ok: true, orderId };
}
