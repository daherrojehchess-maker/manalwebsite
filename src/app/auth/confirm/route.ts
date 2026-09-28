import { NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";
import { passwordResetRedirectTo } from "@/lib/auth/reset-redirect";
import { createClient } from "@/lib/supabase/server";

function appBase(requestUrl: URL) {
  return passwordResetRedirectTo({
    isProduction: process.env.NODE_ENV === "production",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    host: requestUrl.host,
  }).replace(/\/auth\/confirm\?next=.*$/, "");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeRedirectPath(url.searchParams.get("next"), "/reset-password");
  const base = appBase(url);
  if (!code) {
    return NextResponse.redirect(`${base}/forgot-password?e=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/forgot-password?e=1`);
  }

  return NextResponse.redirect(`${base}${next}`);
}
