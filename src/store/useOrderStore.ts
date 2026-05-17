'use client';

// ============================================================
// Order Store — Zustand-based reactive state for order management
// ============================================================

import { create } from 'zustand';
import { Order, OrderStatus } from '@/core/types';
import { mockOrders } from '@/core/data/orders';

interface OrderState {
  // ── State ─────────────────────────────────────────────────
  orders: Order[];

  // ── Actions ───────────────────────────────────────────────
  /** Move an order to the next stage in the pipeline */
  advanceOrder: (orderId: string) => void;
  /** Move an order to a specific status */
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  /** Add a new order to the pipeline */
  addOrder: (order: Order) => void;
  /** Remove an order entirely */
  removeOrder: (orderId: string) => void;
}

const STATUS_PROGRESSION: Record<OrderStatus, OrderStatus | null> = {
  pending: 'preparing',
  preparing: 'completed',
  completed: null,
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: mockOrders,

  advanceOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus = STATUS_PROGRESSION[order.status];
        if (!nextStatus) return order;
        return { ...order, status: nextStatus, updatedAt: new Date() };
      }),
    })),

  setOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      ),
    })),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== orderId),
    })),
}));

// ── Selector helpers ──────────────────────────────────────────

export const selectOrdersByStatus = (status: OrderStatus) => (state: OrderState) =>
  state.orders.filter((o) => o.status === status);

export const selectPendingOrders = (state: OrderState) =>
  state.orders.filter((o) => o.status === 'pending');

export const selectPreparingOrders = (state: OrderState) =>
  state.orders.filter((o) => o.status === 'preparing');

export const selectCompletedOrders = (state: OrderState) =>
  state.orders.filter((o) => o.status === 'completed');

export const selectOrderCount = (state: OrderState) => state.orders.length;
