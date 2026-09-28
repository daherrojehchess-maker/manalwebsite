import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  role: ProfileRole | null;
};

/**
 * Verified session + profile from the database.
 * Role always comes from `profiles.role`, never from user_metadata.
 */
export async function getAuthState(): Promise<AuthState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { user: null, profile: null, role: null };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { user: null, profile: null, role: null };
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle();

  return {
    user: userData.user,
    profile: profile ?? null,
    role: profile?.role ?? null,
  };
}

/** Current authenticated user, or null. */
export async function getCurrentUser() {
  const { user } = await getAuthState();
  return user;
}

/** Current user's profile row, or null. */
export async function getCurrentProfile() {
  const { profile } = await getAuthState();
  return profile;
}

/** True when `profiles.role === 'admin'` for the signed-in user. */
export async function isAdmin() {
  const { role } = await getAuthState();
  return role === "admin";
}

/**
 * Require a signed-in user. Redirects to login when unauthenticated.
 * Prefer this over client-only checks for protected pages/actions.
 */
export async function requireUser(redirectTo = "/account") {
  const state = await getAuthState();
  if (!state.user) {
    redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
  }
  return state as AuthState & { user: User };
}

/**
 * Require an admin (`profiles.role`). Redirects customers to /account.
 * Does not create admins and does not read role from user_metadata.
 */
export async function requireAdmin(redirectTo = "/account") {
  const state = await requireUser(redirectTo);
  if (state.role !== "admin") {
    redirect("/account");
  }
  return state as AuthState & { user: User; role: "admin"; profile: Profile };
}
