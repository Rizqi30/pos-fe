'use client';

// ============================================================
// Cart Store — Zustand state with variant & add-on support
// ============================================================

import { create } from 'zustand';
import {
  CartItem,
  Product,
  PaymentMethod,
  Transaction,
  VariantSelection,
  AddOn,
  buildCartItemId,
  calcItemUnitPrice,
} from '@/core/types';

interface CartState {
  // ── State ─────────────────────────────────────────────────
  items: CartItem[];
  paymentMethod: PaymentMethod;

  // ── Actions ───────────────────────────────────────────────
  addItemWithOptions: (
    product: Product,
    variants: VariantSelection,
    addOns: AddOn[],
    notes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  incrementItem: (cartItemId: string) => void;
  decrementItem: (cartItemId: string) => void;
  setItemNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const TAX_RATE = 0.11; // PPN 11%

export const useCartStore = create<CartState>((set) => ({
  items: [],
  paymentMethod: 'cash',

  addItemWithOptions: (product, variants, addOns, notes) =>
    set((state) => {
      const cartItemId = buildCartItemId(product.id, variants, addOns);
      const existing = state.items.find((i) => i.cartItemId === cartItemId);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes }
              : i
          ),
        };
      }

      const newItem: CartItem = {
        cartItemId,
        product,
        quantity: 1,
        notes: notes || undefined,
        variants,
        addOns,
      };
      return { items: [...state.items, newItem] };
    }),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId),
    })),

  updateQuantity: (cartItemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.cartItemId !== cartItemId) };
      }
      return {
        items: state.items.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity } : i
        ),
      };
    }),

  incrementItem: (cartItemId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrementItem: (cartItemId) =>
    set((state) => {
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      if (!item) return state;
      if (item.quantity <= 1) {
        return { items: state.items.filter((i) => i.cartItemId !== cartItemId) };
      }
      return {
        items: state.items.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }),

  setItemNotes: (cartItemId, notes) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, notes: notes || undefined } : i
      ),
    })),

  clearCart: () => set({ items: [], paymentMethod: 'cash' }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

// ── Selector helpers (derived state) ──────────────────────────

export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + calcItemUnitPrice(i) * i.quantity, 0);

export const selectTax = (state: CartState) =>
  Math.round(selectSubtotal(state) * TAX_RATE);

export const selectTotal = (state: CartState) =>
  selectSubtotal(state) + selectTax(state);

// ── Transaction builder ───────────────────────────────────────

export function buildTransaction(
  items: CartItem[],
  paymentMethod: PaymentMethod,
  cashReceived?: number
): Transaction {
  const subtotal = items.reduce(
    (sum, i) => sum + calcItemUnitPrice(i) * i.quantity,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return {
    id: `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    items: [...items],
    subtotal,
    tax,
    total,
    paymentMethod,
    status: 'completed',
    cashReceived: cashReceived ?? total,
    change: cashReceived ? cashReceived - total : 0,
    createdAt: new Date(),
  };
}
