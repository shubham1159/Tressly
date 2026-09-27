"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { computeOrderTotals } from "@/lib/utils";

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setGiftOptions: (productId: string, isGift: boolean, giftMessage?: string) => void;
  clearCart: () => void;
  totals: () => ReturnType<typeof computeOrderTotals>;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0),
        })),
      setGiftOptions: (productId, isGift, giftMessage) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, isGift, giftMessage } : i)),
        })),
      clearCart: () => set({ items: [] }),
      totals: () => {
        const subtotal = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return computeOrderTotals(subtotal);
      },
    }),
    { name: "giftbox-cart" }
  )
);
