'use client';

// ============================================================
// Product Store — Zustand CRUD for menu items
// ============================================================

import { create } from 'zustand';
import { Product } from '@/core/types';
import { products as initialProducts } from '@/core/data/products';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [...initialProducts],

  addProduct: (data) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...data,
          id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        },
      ],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  toggleAvailability: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      ),
    })),
}));
