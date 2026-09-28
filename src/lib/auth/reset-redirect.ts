const RESET_PATH = "/reset-password";

/**
 * Recovery links go to this app's auth confirm route.
 * Production ignores the request host. Development accepts only localhost.
 */
export function passwordResetRedirectTo(input: {
  isProduction: boolean;
  siteUrl: string;
  host: string | null;
}) {
  const site = (input.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const host = input.host ?? "";
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  const base = !input.isProduction && local ? `http://${host}` : site;
  return `${base}/auth/confirm?next=${encodeURIComponent(RESET_PATH)}`;
}
