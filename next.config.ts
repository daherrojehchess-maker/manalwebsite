import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function supabaseConnectSrc() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  try {
    const host = new URL(raw ?? "").host;
    if (host) return `https://${host} wss://${host}`;
  } catch {
    /* fall through to the hosted wildcard */
  }
  return "https://*.supabase.co wss://*.supabase.co";
}

// Static CSP (no per-request nonce). Nonces would force every page to render
// dynamically and change catalog caching. Next.js and Tailwind inject inline
// scripts and styles, so those two sources stay 'unsafe-inline'. Dev adds
// 'unsafe-eval' for React's debug runtime. HSTS is ignored by browsers on
// plain HTTP, so localhost is unaffected.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseConnectSrc()}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=15552000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
