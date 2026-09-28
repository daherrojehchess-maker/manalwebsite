import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "./database.types";

/** Typed Supabase client for this project's public schema. */
export type TypedSupabaseClient = SupabaseClient<Database>;

export type Profile = Tables<"profiles">;
export type Product = Tables<"products">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type QuoteRequest = Tables<"quote_requests">;
