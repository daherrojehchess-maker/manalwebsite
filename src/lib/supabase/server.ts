import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

/**
 * Server Component / Route Handler / Server Action Supabase client.
 * Creates a fresh client per call so request cookies stay isolated.
 * Uses the publishable key only — never the service-role secret.
 */
export async function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
          // Cache headers apply in Proxy; Server Components cannot set response headers here.
          void headers;
        } catch {
          // Called from a Server Component where cookies cannot be set.
          // Session refresh is handled by src/proxy.ts via updateSession().
        }
      },
    },
  });
}
