const FALLBACK = "/account";
const INTERNAL_ORIGIN = "https://internal.invalid";

/**
 * Accept only a same-origin relative path. Protocol-relative, absolute, and
 * malformed values fall back to `/account`.
 */
export function safeRedirectPath(value: unknown, fallback = FALLBACK): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!isRelativePath(trimmed)) return fallback;

  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return fallback;
  }
  if (decoded !== trimmed && !isRelativePath(decoded)) return fallback;

  let url: URL;
  try {
    url = new URL(decoded, INTERNAL_ORIGIN);
  } catch {
    return fallback;
  }
  if (url.origin !== INTERNAL_ORIGIN || url.username || url.password) return fallback;

  const path = `${url.pathname}${url.search}${url.hash}`;
  if (!isRelativePath(path)) return fallback;
  return path;
}

const ACCOUNT_PATH = "/account";

/**
 * Signup confirmation links. The origin is only the configured site URL.
 * A request host is accepted and ignored so it cannot replace that origin.
 * `next` must be an internal path; anything else becomes /account.
 */
export function signupConfirmRedirectTo(input: {
  siteUrl: string;
  next?: unknown;
  host?: string | null;
}) {
  void input.host;
  const site = (input.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const next = safeRedirectPath(input.next ?? ACCOUNT_PATH, ACCOUNT_PATH);
  return `${site}/auth/confirm?next=${encodeURIComponent(next)}`;
}

function isRelativePath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return false;
  if (value.includes("\\") || value.includes("://")) return false;
  if (/[\u0000-\u001F\u007F]/.test(value)) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return false;
  return true;
}
