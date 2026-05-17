// ============================================================
// Mock Data — Orders & Dashboard metrics
// ============================================================

import { Order, DashboardMetrics, SalesTrendPoint, CartItem, buildCartItemId } from '@/core/types';
import { products } from './products';

/** Mock variants for demonstration */
const MOCK_VARIANTS = [
  { temperature: 'hot' as const, size: 'regular' as const },
  { temperature: 'iced' as const, size: 'regular' as const },
  { temperature: 'hot' as const, size: 'large' as const },
  { temperature: 'iced' as const, size: 'large' as const },
];

const MOCK_ADDONS = [
  { id: 'addon-shot', name: 'Extra Shot', price: 5_000 },
  { id: 'addon-cheese', name: 'Extra Cheese', price: 4_000 },
];

const DRINK_CATS = new Set(['coffee', 'non-coffee']);

function pickProducts(ids: string[]): CartItem[] {
  return ids
    .map((id, idx) => {
      const product = products.find((p) => p.id === id);
      if (!product) return null;
      const isDrink = DRINK_CATS.has(product.categoryId);
      const variants = isDrink
        ? MOCK_VARIANTS[idx % MOCK_VARIANTS.length]
        : {};
      const addOns = idx === 0 && isDrink ? [MOCK_ADDONS[0]] : idx === 0 && !isDrink ? [MOCK_ADDONS[1]] : [];
      const quantity = Math.ceil(Math.random() * 2);
      return {
        cartItemId: buildCartItemId(product.id, variants, addOns),
        product,
        quantity,
        variants,
        addOns,
      } as CartItem;
    })
    .filter(Boolean) as CartItem[];
}

function createOrder(
  overrides: Partial<Order> & { id: string; orderNumber: string }
): Order {
  const items = overrides.items ?? pickProducts(['prod-001', 'prod-003']);
  const subtotal =
    overrides.subtotal ??
    items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax = overrides.tax ?? Math.round(subtotal * 0.11);
  const total = overrides.total ?? subtotal + tax;

  return {
    customerName: 'Customer',
    orderType: 'dine-in' as const,
    tableNumber: 1,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    items,
    subtotal,
    tax,
    total,
    ...overrides,
  };
}

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000);

export const mockOrders: Order[] = [
  // ── Pending ─────────────────────────────────────────────
  createOrder({
    id: 'ord-001',
    orderNumber: 'ORD-001',
    tableNumber: 3,
    customerName: 'Budi Santoso',
    items: pickProducts(['prod-001', 'prod-003', 'prod-015']),
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    status: 'pending',
    createdAt: minutesAgo(2),
    updatedAt: minutesAgo(2),
  }),
  createOrder({
    id: 'ord-002',
    orderNumber: 'ORD-002',
    tableNumber: 7,
    customerName: 'Siti Rahayu',
    items: pickProducts(['prod-004', 'prod-007']),
    paymentMethod: 'cash',
    paymentStatus: 'unpaid',
    status: 'pending',
    createdAt: minutesAgo(5),
    updatedAt: minutesAgo(5),
  }),
  createOrder({
    id: 'ord-003',
    orderNumber: 'ORD-003',
    orderType: 'takeaway',
    tableNumber: null,
    customerName: 'Andi Wijaya',
    items: pickProducts(['prod-002', 'prod-018']),
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    status: 'pending',
    notes: 'Gula setengah',
    createdAt: minutesAgo(1),
    updatedAt: minutesAgo(1),
  }),

  // ── Preparing ───────────────────────────────────────────
  createOrder({
    id: 'ord-004',
    orderNumber: 'ORD-004',
    tableNumber: 1,
    customerName: 'Dewi Lestari',
    items: pickProducts(['prod-005', 'prod-011', 'prod-019']),
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'preparing',
    createdAt: minutesAgo(12),
    updatedAt: minutesAgo(8),
  }),
  createOrder({
    id: 'ord-005',
    orderNumber: 'ORD-005',
    tableNumber: 5,
    customerName: 'Reza Pratama',
    items: pickProducts(['prod-008', 'prod-012']),
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    status: 'preparing',
    createdAt: minutesAgo(15),
    updatedAt: minutesAgo(10),
  }),

  // ── Completed ───────────────────────────────────────────
  createOrder({
    id: 'ord-006',
    orderNumber: 'ORD-006',
    tableNumber: 2,
    customerName: 'Rina Marlina',
    items: pickProducts(['prod-006', 'prod-009', 'prod-017']),
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(18),
  }),
  createOrder({
    id: 'ord-007',
    orderNumber: 'ORD-007',
    tableNumber: 4,
    customerName: 'Hendra Gunawan',
    items: pickProducts(['prod-010', 'prod-013']),
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(30),
  }),
  createOrder({
    id: 'ord-008',
    orderNumber: 'ORD-008',
    tableNumber: 6,
    customerName: 'Mega Putri',
    items: pickProducts(['prod-001', 'prod-020']),
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(45),
  }),
];

// ── Dashboard Metrics ─────────────────────────────────────────

export const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: 4_850_000,
  totalOrders: 127,
  activeTables: 5,
  topProduct: {
    name: 'Cappuccino',
    quantity: 42,
  },
};

export const mockSalesTrend: SalesTrendPoint[] = [
  { date: '10 Mei', revenue: 580_000, orders: 15 },
  { date: '11 Mei', revenue: 720_000, orders: 19 },
  { date: '12 Mei', revenue: 650_000, orders: 17 },
  { date: '13 Mei', revenue: 890_000, orders: 24 },
  { date: '14 Mei', revenue: 760_000, orders: 20 },
  { date: '15 Mei', revenue: 950_000, orders: 26 },
  { date: '16 Mei', revenue: 300_000, orders: 8 },
];

export const mockRecentTransactions = [
  {
    id: 'TRX-001',
    customer: 'Budi Santoso',
    items: 3,
    total: 78_000,
    method: 'QRIS' as const,
    time: '14:05',
  },
  {
    id: 'TRX-002',
    customer: 'Siti Rahayu',
    items: 2,
    total: 56_000,
    method: 'Cash' as const,
    time: '13:48',
  },
  {
    id: 'TRX-003',
    customer: 'Andi Wijaya',
    items: 2,
    total: 47_000,
    method: 'QRIS' as const,
    time: '13:30',
  },
  {
    id: 'TRX-004',
    customer: 'Dewi Lestari',
    items: 3,
    total: 102_000,
    method: 'Cash' as const,
    time: '13:12',
  },
  {
    id: 'TRX-005',
    customer: 'Reza Pratama',
    items: 2,
    total: 67_000,
    method: 'QRIS' as const,
    time: '12:55',
  },
  {
    id: 'TRX-006',
    customer: 'Rina Marlina',
    items: 3,
    total: 85_000,
    method: 'Cash' as const,
    time: '12:40',
  },
  {
    id: 'TRX-007',
    customer: 'Hendra Gunawan',
    items: 2,
    total: 50_000,
    method: 'QRIS' as const,
    time: '12:22',
  },
];
