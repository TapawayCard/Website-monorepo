"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type CardConfig, priceCartPaise } from "@/lib/catalog";

export type CartItem = CardConfig & { id: string };

type CartCtx = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotalPaise: number;
  add: (cfg: CardConfig) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tapaway_cart";

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load from device storage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked */
    }
  }, [items, ready]);

  const add = (cfg: CardConfig) =>
    setItems((prev) => [...prev, { ...cfg, id: newId() }]);
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(50, qty)) } : i))
    );
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + (i.qty || 1), 0);
  const subtotalPaise = priceCartPaise(items);

  return (
    <Ctx.Provider value={{ items, ready, count, subtotalPaise, add, remove, setQty, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
