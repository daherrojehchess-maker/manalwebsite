export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "initiated" | "paid" | "failed" | "refunded";

export type QuoteRequestStatus =
  | "pending"
  | "in_progress"
  | "quoted"
  | "accepted"
  | "closed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category: string | null;
          brand: string | null;
          stock: number;
          image: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
          slug: string | null;
          sku: string | null;
          sub: string | null;
          compare_at: number | null;
          unit: string;
          variant_hint: string | null;
          metadata: Json;
          availability: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category?: string | null;
          brand?: string | null;
          stock?: number;
          image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          slug?: string | null;
          sku?: string | null;
          sub?: string | null;
          compare_at?: number | null;
          unit?: string;
          variant_hint?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string | null;
          brand?: string | null;
          stock?: number;
          image?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          slug?: string | null;
          sku?: string | null;
          sub?: string | null;
          compare_at?: number | null;
          unit?: string;
          variant_hint?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          shipping_address: string | null;
          shipping_method: string | null;
          subtotal: number;
          shipping_cost: number;
          total: number;
          order_status: OrderStatus;
          payment_status: PaymentStatus;
          idempotency_key: string | null;
          confirmation_token_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_address?: string | null;
          shipping_method?: string | null;
          subtotal: number;
          shipping_cost?: number;
          total: number;
          order_status?: OrderStatus;
          payment_status?: PaymentStatus;
          idempotency_key?: string | null;
          confirmation_token_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_address?: string | null;
          shipping_method?: string | null;
          subtotal?: number;
          shipping_cost?: number;
          total?: number;
          order_status?: OrderStatus;
          payment_status?: PaymentStatus;
          idempotency_key?: string | null;
          confirmation_token_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_reservations: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          status: "held" | "committed" | "released";
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          status?: "held" | "committed" | "released";
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          status?: "held" | "committed" | "released";
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_reservations_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_reservations_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      quote_requests: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          details: string;
          status: QuoteRequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          details: string;
          status?: QuoteRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          details?: string;
          status?: QuoteRequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quote_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_checkout_order: {
        Args: {
          p_idempotency_key: string;
          p_items: Json;
          p_customer_name: string;
          p_customer_email: string;
          p_customer_phone: string;
          p_shipping_address: string;
          p_shipping_method: string;
          p_confirmation_token: string;
        };
        Returns: Json;
      };
      start_checkout_payment: {
        Args: {
          p_order_id: string;
          p_guest_token: string;
        };
        Returns: string;
      };
      get_checkout_confirmation: {
        Args: {
          p_order_id: string;
          p_guest_token: string;
        };
        Returns: Json;
      };
      consume_rate_limit: {
        Args: {
          p_action: string;
          p_ip: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      profile_role: ProfileRole;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      quote_request_status: QuoteRequestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
