'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
const CART_KEY = 'cartId';

interface CartContextValue {
  cartId: string | null;
  itemCount: number;
  addItem: (stockItemId: string, qty: number) => Promise<{ error?: string }>;
  itemCountChanged: () => void;
}

const CartContext = createContext<CartContextValue>({
  cartId: null,
  itemCount: 0,
  addItem: async () => ({}),
  itemCountChanged: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);

  // Sync cartId from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setCartId(stored);
      fetchCount(stored);
    }
  }, []);

  function fetchCount(id: string) {
    fetch(`${API}/cart/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setItemCount(data.items?.length ?? 0);
      })
      .catch(() => {});
  }

  const itemCountChanged = useCallback(() => {
    if (cartId) fetchCount(cartId);
  }, [cartId]);

  const addItem = useCallback(
    async (stockItemId: string, qty: number): Promise<{ error?: string }> => {
      try {
        let id = cartId;

        if (!id) {
          const res = await fetch(`${API}/cart`, { method: 'POST' });
          if (!res.ok) return { error: 'Failed to create cart' };
          const data = await res.json();
          id = data.id as string;
          localStorage.setItem(CART_KEY, id);
          setCartId(id);
        }

        const res = await fetch(`${API}/cart/${id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stockItemId, qty }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          return { error: (body as { message?: string }).message ?? 'Could not add item' };
        }

        const cart = await res.json();
        setItemCount(cart.items?.length ?? 0);
        return {};
      } catch {
        return { error: 'Network error' };
      }
    },
    [cartId],
  );

  return (
    <CartContext.Provider value={{ cartId, itemCount, addItem, itemCountChanged }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
