"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage, isValidEmail, isValidPassword, isValidPhone, PASSWORD_RESET_ACK, PASSWORD_TOO_SHORT } from "@/lib/auth/errors";
import { passwordResetRedirectTo } from "@/lib/auth/reset-redirect";
import { safeRedirectPath, signupConfirmRedirectTo } from "@/lib/auth/safe-redirect";
import { allowRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/security/rate-limit";

const SIGNUP_ACK = "אם ניתן לפתוח את החשבון, נשלח אימייל לאישור. לאחר האישור אפשר להתחבר.";

export type AuthActionResult = { ok: true; message?: string } | { ok: false; error: string };

function formString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const fullName = formString(formData, "fullName");
  const email = formString(formData, "email").toLowerCase();
  const phoneDigits = formString(formData, "phone").replace(/\D/g, "");
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(formString(formData, "next"));

  if (!fullName) return { ok: false, error: "נא למלא שם מלא." };
  if (!isValidEmail(email)) return { ok: false, error: "נא למלא כתובת אימייל תקינה." };
  if (phoneDigits && !isValidPhone(phoneDigits)) return { ok: false, error: "נא למלא מספר טלפון תקין." };
  if (!isValidPassword(password)) return { ok: false, error: PASSWORD_TOO_SHORT };
  if (!(await allowRateLimit("signup"))) return { ok: false, error: RATE_LIMIT_MESSAGE };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: signupConfirmRedirectTo({
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        next: "/account",
      }),
      data: {
        full_name: fullName,
        phone: phoneDigits || null,
      },
    },
  });

  if (error) {
    const code = (error.code ?? "").toLowerCase();
    const raw = (error.message ?? "").toLowerCase();
    if (code === "user_already_exists" || raw.includes("already registered") || raw.includes("user already registered")) {
      return { ok: true, message: SIGNUP_ACK };
    }
    return { ok: false, error: authErrorMessage(error) };
  }

  // Role is never accepted from the client — DB trigger always inserts `customer`.
  if (data.user && data.session) {
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phoneDigits || null,
      })
      .eq("id", data.user.id);
    redirect(next);
  }

  // Confirmation is required (Auth mailer_autoconfirm is false). The same
  // acknowledgement is returned when the address is already registered.
  return { ok: true, message: SIGNUP_ACK };
}

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const email = formString(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(formString(formData, "next"));

  if (!isValidEmail(email)) return { ok: false, error: "נא למלא כתובת אימייל תקינה." };
  if (!password) return { ok: false, error: "נא למלא סיסמה." };
  if (!(await allowRateLimit("login"))) return { ok: false, error: RATE_LIMIT_MESSAGE };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: authErrorMessage(error) };
  }

  redirect(next);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData): Promise<AuthActionResult> {
  const email = formString(formData, "email").toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: "נא למלא כתובת אימייל תקינה." };
  if (!(await allowRateLimit("password_reset"))) return { ok: false, error: RATE_LIMIT_MESSAGE };

  const headerStore = await headers();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: passwordResetRedirectTo({
      isProduction: process.env.NODE_ENV === "production",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      host: headerStore.get("host"),
    }),
  });

  return { ok: true, message: PASSWORD_RESET_ACK };
}

export async function updatePassword(formData: FormData): Promise<AuthActionResult> {
  const password = String(formData.get("password") ?? "");
  if (!isValidPassword(password)) return { ok: false, error: PASSWORD_TOO_SHORT };

  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) {
    return { ok: false, error: "הקישור אינו תקף או שפג תוקפו. בקשו קישור חדש." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: authErrorMessage(error) };
  redirect("/account");
}

export async function updateProfile(formData: FormData): Promise<AuthActionResult> {
  const fullName = formString(formData, "fullName");
  const phoneDigits = formString(formData, "phone").replace(/\D/g, "");

  if (!fullName) return { ok: false, error: "נא למלא שם מלא." };
  if (phoneDigits && !isValidPhone(phoneDigits)) return { ok: false, error: "נא למלא מספר טלפון תקין." };

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { ok: false, error: "יש להתחבר מחדש כדי לעדכן את הפרופיל." };
  }

  // Never update `role` here — RLS + DB trigger block privilege escalation.
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phoneDigits || null,
    })
    .eq("id", userId);

  if (error) {
    return { ok: false, error: "לא ניתן לעדכן את הפרופיל כרגע. נסו שוב." };
  }

  return { ok: true, message: "הפרטים נשמרו." };
}
