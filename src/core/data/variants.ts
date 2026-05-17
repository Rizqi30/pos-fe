// ============================================================
// Variant & Add-on Data — Category-specific options
// ============================================================

import { AddOn } from '@/core/types';

/** Drink categories that support temperature & size variants */
export const DRINK_CATEGORIES = new Set(['coffee', 'non-coffee']);

/** Food categories (no drink variants) */
export const FOOD_CATEGORIES = new Set(['food', 'snack', 'dessert']);

/** Returns true if the product category supports temperature/size variants */
export function isDrinkCategory(categoryId: string): boolean {
  return DRINK_CATEGORIES.has(categoryId);
}

/** Add-ons available per category */
const ADD_ONS_BY_CATEGORY: Record<string, AddOn[]> = {
  coffee: [
    { id: 'addon-shot', name: 'Extra Shot', price: 5_000 },
    { id: 'addon-whip', name: 'Whipped Cream', price: 3_000 },
    { id: 'addon-syrup', name: 'Vanilla Syrup', price: 4_000 },
  ],
  'non-coffee': [
    { id: 'addon-boba', name: 'Boba Pearl', price: 5_000 },
    { id: 'addon-whip', name: 'Whipped Cream', price: 3_000 },
    { id: 'addon-jelly', name: 'Coconut Jelly', price: 4_000 },
  ],
  food: [
    { id: 'addon-cheese', name: 'Extra Cheese', price: 4_000 },
    { id: 'addon-sauce', name: 'Extra Sauce', price: 2_000 },
    { id: 'addon-egg', name: 'Telur Ceplok', price: 3_000 },
  ],
  snack: [
    { id: 'addon-sauce', name: 'Extra Sauce', price: 2_000 },
    { id: 'addon-cheese', name: 'Extra Cheese', price: 4_000 },
  ],
  dessert: [
    { id: 'addon-cream', name: 'Extra Cream', price: 3_000 },
    { id: 'addon-choco', name: 'Chocolate Drizzle', price: 3_000 },
  ],
};

/** Get add-ons available for a given category */
export function getAddOnsForCategory(categoryId: string): AddOn[] {
  return ADD_ONS_BY_CATEGORY[categoryId] ?? [];
}
