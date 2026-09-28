import { cookies } from "next/headers";
import { checkoutConfirmCookieOptions } from "@/lib/orders/confirmation-cookie";
import { createClient } from "@/lib/supabase/server";

export const CHECKOUT_CONFIRM_COOKIE = "checkout_confirm";
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CheckoutConfirmation = {
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

export { checkoutConfirmCookieOptions } from "@/lib/orders/confirmation-cookie";

export async function bindCheckoutConfirmationCookie(token: string) {
  const jar = await cookies();
  jar.set(
    CHECKOUT_CONFIRM_COOKIE,
    token,
    checkoutConfirmCookieOptions(process.env.NODE_ENV === "production"),
  );
}

export async function readCheckoutConfirmationToken() {
  const token = (await cookies()).get(CHECKOUT_CONFIRM_COOKIE)?.value ?? "";
  return TOKEN_RE.test(token) ? token : "";
}

export async function getCheckoutConfirmation(orderId: string): Promise<CheckoutConfirmation | null> {
  if (!UUID_RE.test(orderId)) return null;
  const token = await readCheckoutConfirmationToken();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_checkout_confirmation", {
    p_order_id: orderId,
    p_guest_token: token,
  });
  if (error || !data || typeof data !== "object" || Array.isArray(data)) return null;

  const row = data as {
    order_status?: unknown;
    payment_status?: unknown;
    total?: unknown;
    created_at?: unknown;
    items?: unknown;
  };
  if (typeof row.order_status !== "string" || typeof row.payment_status !== "string") return null;
  if (typeof row.total !== "number" || typeof row.created_at !== "string" || !Array.isArray(row.items)) return null;

  const items = row.items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const name = "name" in item ? item.name : null;
    const quantity = "quantity" in item ? item.quantity : null;
    if (typeof name !== "string" || typeof quantity !== "number") return [];
    return [{ name, quantity }];
  });

  return {
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    total: row.total,
    createdAt: row.created_at,
    items,
  };
}
