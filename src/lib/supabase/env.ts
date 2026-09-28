/**
 * Public Supabase credentials (safe for browser + server).
 * Never put the service-role / secret key here or in any NEXT_PUBLIC_* variable.
 */

function required(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and set your Supabase project values.`,
    );
  }
  return value;
}

/** Read and validate public Supabase env vars. Throws only when a client is created. */
export function getSupabaseEnv() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}
