/**
 * Supabase client entry points for the App Router.
 *
 * - Browser / Client Components: `import { createClient } from "@/lib/supabase/client"`
 * - Server Components / Route Handlers / Server Actions: `import { createClient } from "@/lib/supabase/server"`
 *
 * Do not import the browser client from server code, or the server client from client components.
 */

export { getSupabaseEnv } from "./env";
export type { Database, Tables, TablesInsert, TablesUpdate, ProfileRole } from "./database.types";
export type {
  TypedSupabaseClient,
  Profile,
  Product,
  Order,
  OrderItem,
  QuoteRequest,
} from "./types";
