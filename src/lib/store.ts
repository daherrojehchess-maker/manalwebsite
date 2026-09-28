"use client";

import { useSyncExternalStore } from "react";

export type CartLine = {
  key: string;
  productId: string;
  selection: Record<string, string>;
  qty: number;
};

export type QuoteLine = {
  key: string;
  productId?: string;
  name: string;
  selection?: Record<string, string>;
  unit: string;
  qty: number;
  note: string;
};

export type Toast = { id: number; kind: "cart" | "quote" | "wishlist"; title: string } | null;

type State = {
  cart: CartLine[];
  quote: QuoteLine[];
  wishlist: string[];
  recent: string[];
  toast: Toast;
  hydrated: boolean;
};

const STORAGE_KEY = "bm-store-v1";
const empty: State = { cart: [], quote: [], wishlist: [], recent: [], toast: null, hydrated: false };

let state: State = empty;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    const { cart, quote, wishlist, recent } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, quote, wishlist, recent }));
  } catch {}
}

function set(patch: Partial<State>, save = true) {
  state = { ...state, ...patch };
  if (save) persist();
  emit();
}

function hydrate() {
  if (state.hydrated || typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<State>) : {};
    state = { ...empty, ...saved, toast: null, hydrated: true };
  } catch {
    state = { ...empty, hydrated: true };
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      state = { ...state, ...JSON.parse(e.newValue) };
      emit();
    } catch {}
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!state.hydrated) {
    hydrate();
    queueMicrotask(emit);
  }
  return () => listeners.delete(listener);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(empty),
  );
}

const lineKey = (productId: string, selection: Record<string, string> = {}) =>
  `${productId}|${Object.entries(selection).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&")}`;

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function showToast(kind: NonNullable<Toast>["kind"], title: string) {
  clearTimeout(toastTimer);
  set({ toast: { id: Date.now(), kind, title } }, false);
  toastTimer = setTimeout(() => set({ toast: null }, false), 4000);
}

export const actions = {
  addToCart(productId: string, name: string, qty = 1, selection: Record<string, string> = {}) {
    const key = lineKey(productId, selection);
    const existing = state.cart.find((l) => l.key === key);
    const cart = existing
      ? state.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      : [...state.cart, { key, productId, selection, qty }];
    set({ cart });
    showToast("cart", name);
  },
  setCartQty(key: string, qty: number) {
    set({ cart: qty <= 0 ? state.cart.filter((l) => l.key !== key) : state.cart.map((l) => (l.key === key ? { ...l, qty } : l)) });
  },
  removeFromCart(key: string) {
    set({ cart: state.cart.filter((l) => l.key !== key) });
  },
  clearCart() {
    set({ cart: [] });
  },
  addToQuote(line: Omit<QuoteLine, "key">) {
    const key = line.productId ? lineKey(line.productId, line.selection) : `free-${Date.now()}`;
    const existing = state.quote.find((l) => l.key === key);
    const quote = existing
      ? state.quote.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l))
      : [...state.quote, { ...line, key }];
    set({ quote });
    showToast("quote", line.name);
  },
  updateQuote(key: string, patch: Partial<QuoteLine>) {
    set({ quote: state.quote.map((l) => (l.key === key ? { ...l, ...patch } : l)) });
  },
  removeFromQuote(key: string) {
    set({ quote: state.quote.filter((l) => l.key !== key) });
  },
  clearQuote() {
    set({ quote: [] });
  },
  toggleWishlist(productId: string, name: string) {
    const has = state.wishlist.includes(productId);
    set({ wishlist: has ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId] });
    if (!has) showToast("wishlist", name);
  },
  trackView(productId: string) {
    set({ recent: [productId, ...state.recent.filter((id) => id !== productId)].slice(0, 12) });
  },
  dismissToast() {
    set({ toast: null }, false);
  },
};
