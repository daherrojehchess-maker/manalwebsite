import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Persistent limiter backed by `private.rate_limit_buckets` in Postgres.
 * The counter lives in the database, so it is shared across serverless instances.
 * There is no in-memory fallback: if the database check fails, the action is refused.
 *
 * The bucket is action + auth.uid() + client IP. The IP is taken from the incoming
 * request and passed into the RPC. A caller who uses the publishable key directly
 * can supply a different IP; Vercel Firewall is the place to enforce the unspoofable
 * network address in front of this check.
 */
const ACTIONS = ["login", "signup", "checkout_create", "payment_start", "password_reset"] as const;

export type RateLimitAction = (typeof ACTIONS)[number];

export const RATE_LIMIT_MESSAGE = "נשלחו יותר מדי בקשות. נסו שוב בעוד מספר דקות.";

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const IPV6 = /^[0-9a-fA-F:.]{2,64}$/;

export async function allowRateLimit(action: RateLimitAction): Promise<boolean> {
  const ip = clientIp(await headers());
  if (!ip) return false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("consume_rate_limit", {
      p_action: action,
      p_ip: ip,
    });
    return !error && data === true;
  } catch {
    return false;
  }
}

function clientIp(headerStore: Headers): string | null {
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const real = headerStore.get("x-real-ip")?.trim() ?? "";
  const candidate = normalizeIp(forwarded) ?? normalizeIp(real);
  if (candidate) return candidate;

  const host = (headerStore.get("host") ?? "").toLowerCase();
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]")) {
    return "127.0.0.1";
  }
  return null;
}

function normalizeIp(value: string): string | null {
  const bare = value.replace(/^\[|\]$/g, "");
  if (IPV4.test(bare)) return bare;
  if (bare.includes(":") && IPV6.test(bare)) return bare;
  return null;
}
