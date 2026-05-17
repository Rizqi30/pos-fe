'use client';

// ============================================================
// Kasir POS — Full-width cashier workspace with theme support
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { categories, products } from '@/core/data/products';
import { useCartStore, selectItemCount } from '@/store/useCartStore';
import { formatRupiah } from '@/core/utils/format';
import { Product, VariantSelection, AddOn } from '@/core/types';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import ProductDetailModal from '@/components/ProductDetailModal';
import ThemeToggle from '@/components/ThemeToggle';

// ── Types ───────────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  icon: string;
  exiting?: boolean;
}

// ── Live Clock Hook (SSR-safe) ──────────────────────────────

const clockFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function useLiveClock() {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    setClock(clockFormatter.format(new Date()));
    const timer = setInterval(
      () => setClock(clockFormatter.format(new Date())),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  return clock;
}

// ── Order Notification Toasts ───────────────────────────────

function useToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((prev) => [
        ...prev,
        {
          id: `toast-${Date.now()}`,
          message: 'Pesanan baru dari Meja 03 — Rp 78.000',
          icon: '🔔',
        },
      ]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts
      .filter((t) => !t.exiting)
      .map((t) =>
        setTimeout(() => dismissToast(t.id), 8000)
      );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissToast]);

  return { toasts, dismissToast };
}

// ── Main Page ───────────────────────────────────────────────

export default function KasirPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addItemWithOptions = useCartStore((s) => s.addItemWithOptions);
  const clock = useLiveClock();
  const { toasts, dismissToast } = useToastNotifications();

  const handleAddFromModal = useCallback(
    (product: Product, variants: VariantSelection, addOns: AddOn[], notes: string) => {
      addItemWithOptions(product, variants, addOns, notes);
    },
    [addItemWithOptions]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.categoryId === activeCategory;
      const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && product.isAvailable;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex h-screen flex-col">
      {/* ════════════════════════════════════════════════════
          TOP HEADER BAR
          ════════════════════════════════════════════════════ */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-surface)]/70 px-5 backdrop-blur-xl">
        {/* ── Left: Empty Spacer (or Kitchen Link if needed) ── */}
        <div className="flex w-24"></div>

        {/* ── Center: POS Branding ────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white shadow-md shadow-orange-500/20">
            ☕
          </span>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none">
              Cafe POS
            </h1>
            <p className="text-[10px] text-[var(--text-muted)]">Kasir Mode</p>
          </div>
        </div>

        {/* ── Right: Theme Toggle + Clock + User ─────────── */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-[var(--bg-hover)] px-3 py-1.5">
            <span className="text-xs text-[var(--text-muted)]">🕐</span>
            <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums min-w-[190px]">
              {clock ?? (
                <span className="inline-block h-3 w-36 animate-pulse rounded bg-[var(--bg-surface)]" />
              )}
            </span>
          </div>
          <div className="hidden md:block h-6 w-px bg-[var(--border-primary)]" />
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-[var(--text-muted)] leading-none">Kasir</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                Admin
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 ring-2 ring-violet-500/20" />
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          MAIN WORKSPACE — Product Grid + Cart
          ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Product Catalog ──────────────────────── */}
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Search & Category Filters */}
          <div className="flex flex-col gap-3 border-b border-[var(--border-primary)] bg-[var(--bg-surface)]/30 px-5 py-3 backdrop-blur-sm">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                🔍
              </span>
              <input
                id="search-products"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu..."
                className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none transition-all focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200
                    ${
                      activeCategory === cat.id
                        ? 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 shadow-sm shadow-amber-500/10'
                        : 'bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }
                  `}
                >
                  <span className="text-sm">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {filteredProducts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className="text-5xl opacity-30">🔍</span>
                <p className="text-sm text-[var(--text-muted)]">
                  Tidak ada produk ditemukan
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 rounded-lg bg-[var(--bg-surface)] px-4 py-2 text-sm text-amber-600 transition-all hover:bg-[var(--bg-hover)]"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT: Cart / Receipt ──────────────────────── */}
        <aside className="hidden w-[400px] flex-shrink-0 border-l border-[var(--border-primary)] lg:block">
          <CartPanel />
        </aside>

        {/* ── Mobile Cart FAB ────────────────────────────── */}
        <MobileCartFAB />
      </div>

      {/* ════════════════════════════════════════════════════
          TOAST NOTIFICATIONS
          ════════════════════════════════════════════════════ */}
      <div className="fixed right-5 top-[4.5rem] z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-amber-500/20 bg-[var(--bg-card)] px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300
              ${
                toast.exiting
                  ? 'translate-x-[120%] opacity-0'
                  : 'translate-x-0 opacity-100 animate-in slide-in-from-right-2'
              }
            `}
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-lg">
              {toast.icon}
            </span>
            <p className="text-sm font-medium text-[var(--text-secondary)] pr-2">
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[10px] text-[var(--text-muted)] transition-all hover:text-[var(--text-primary)]"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {/* ════════════════════════════════════════════════════
          PRODUCT DETAIL MODAL
          ════════════════════════════════════════════════════ */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddFromModal}
      />
    </div>
  );
}

// ── Mobile Floating Cart Button ─────────────────────────────

function MobileCartFAB() {
  const [showMobileCart, setShowMobileCart] = useState(false);
  const itemCount = useCartStore(selectItemCount);

  return (
    <>
      <button
        onClick={() => setShowMobileCart(true)}
        className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 lg:hidden
          ${itemCount > 0 ? 'animate-bounce-gentle' : ''}
        `}
        aria-label="Buka keranjang"
      >
        🛒
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>

      {showMobileCart && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileCart(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl animate-in slide-in-from-bottom duration-300">
            <div className="h-full overflow-y-auto">
              <CartPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
