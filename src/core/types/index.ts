// ============================================================
// POS Core Domain Types
// ============================================================

/** Supported payment methods for transactions */
export type PaymentMethod = 'cash' | 'qris';

/** Transaction lifecycle states */
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

/** Product category for filtering */
export interface Category {
  id: string;
  name: string;
  icon: string; // emoji or icon identifier
}

/** A single product available for sale */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description?: string;
  stock?: number;
  isAvailable: boolean;
}

// ============================================================
// Variant & Add-on Types
// ============================================================

/** Temperature variant for drinks */
export type Temperature = 'hot' | 'iced';

/** Size variant for drinks */
export type DrinkSize = 'regular' | 'large';

/** Selected variant options for a cart item */
export interface VariantSelection {
  temperature?: Temperature;
  size?: DrinkSize;
}

/** An add-on extra that can be attached to a product */
export interface AddOn {
  id: string;
  name: string;
  price: number;
}

/** Add-on definitions grouped by product category */
export interface AddOnGroup {
  categoryId: string;
  addOns: AddOn[];
}

/** Surcharge constants */
export const VARIANT_PRICES = {
  iced: 3_000,
  large: 5_000,
} as const;

/** An item currently in the shopping cart */
export interface CartItem {
  /** Unique key: product + variant combo (for deduplication) */
  cartItemId: string;
  product: Product;
  quantity: number;
  notes?: string;
  variants: VariantSelection;
  addOns: AddOn[];
}

/** Generate a deterministic cart item ID for dedup */
export function buildCartItemId(
  productId: string,
  variants: VariantSelection,
  addOns: AddOn[]
): string {
  const temp = variants.temperature ?? 'hot';
  const size = variants.size ?? 'regular';
  const addOnKey = addOns
    .map((a) => a.id)
    .sort()
    .join(',');
  return `${productId}__${temp}__${size}__${addOnKey}`;
}

/** Calculate the unit price including variant surcharges + add-ons */
export function calcItemUnitPrice(item: CartItem): number {
  let price = item.product.price;
  if (item.variants.temperature === 'iced') price += VARIANT_PRICES.iced;
  if (item.variants.size === 'large') price += VARIANT_PRICES.large;
  price += item.addOns.reduce((sum, a) => sum + a.price, 0);
  return price;
}

/** Build a compact description string for display */
export function buildItemDescription(item: CartItem): string {
  const parts: string[] = [];
  if (item.variants.temperature === 'iced') parts.push('Es');
  if (item.variants.temperature === 'hot') parts.push('Panas');
  if (item.variants.size === 'large') parts.push('Large');
  const variantStr = parts.length > 0 ? `(${parts.join(', ')})` : '';
  const addOnStr = item.addOns.map((a) => `+ ${a.name}`).join(' ');
  return [variantStr, addOnStr].filter(Boolean).join(' ');
}

// ============================================================
// Transaction & Order Types
// ============================================================

/** A completed or pending transaction record */
export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  cashReceived?: number;
  change?: number;
  createdAt: Date;
}

/** Order lifecycle stages for the kitchen workflow */
export type OrderStatus = 'pending' | 'preparing' | 'completed';

/** Payment confirmation states */
export type PaymentStatus = 'paid' | 'unpaid';

/** Whether the customer is eating in or taking away */
export type OrderType = 'dine-in' | 'takeaway';

/** A customer order flowing through the kitchen pipeline */
export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber: number | null;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Dashboard Types
// ============================================================

/** Metrics displayed on the admin dashboard overview */
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeTables: number;
  topProduct: {
    name: string;
    quantity: number;
  };
}

/** A single data point for the sales trend chart */
export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}
