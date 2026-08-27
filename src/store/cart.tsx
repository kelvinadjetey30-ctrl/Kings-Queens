'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variantId?: string;
  variantName?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  remove: (productId: string, variantId?: string) => void;
  setQty: (productId: string, qty: number, variantId?: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartCtx | null>(null);
const KEY = 'kq_cart';

function itemKey(productId: string, variantId?: string) {
  return `${productId}__${variantId || 'default'}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.variantId);
      const idx = prev.findIndex((i) => itemKey(i.productId, i.variantId) === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + (item.qty || 1) };
        return next;
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  }, []);

  const remove = useCallback((productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.variantId) !== itemKey(productId, variantId)));
  }, []);

  const setQty = useCallback((productId: string, qty: number, variantId?: string) => {
    if (qty < 1) {
      remove(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.productId, i.variantId) === itemKey(productId, variantId) ? { ...i, qty } : i
      )
    );
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
