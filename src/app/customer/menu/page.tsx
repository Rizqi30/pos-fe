'use client';

// ============================================================
// Customer Menu — Theme-aware mobile menu
// ============================================================

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { categories, products } from '@/core/data/products';
import { useCartStore, selectItemCount, selectTotal } from '@/store/useCartStore';
import { formatRupiah } from '@/core/utils/format';
import { Product } from '@/core/types';

function NoTableWarning() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10">
        <span className="text-5xl">📱</span>
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Scan QR Code</h2>
      <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)] leading-relaxed">
        Silakan scan QR code yang tersedia di meja Anda untuk mulai memesan.
      </p>
      <div className="mt-8 flex items-center gap-2 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-6 py-4">
        <span className="text-2xl">🔗</span>
        <code className="text-xs text-[var(--text-muted)]">/menu?table=05</code>
      </div>
    </div>
  );
}

function MenuProductCard({ product, table }: { product: Product; table: string }) {
  const router = useRouter();
  const itemInCart = useCartStore((s) => s.items.filter((i) => i.product.id === product.id));
  const totalQty = itemInCart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={() => router.push(`/customer/menu/${product.id}?table=${table}`)}
      className="w-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3 text-left transition-all duration-200 active:scale-[0.98]"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      <div className="flex gap-3">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-3xl">
          {product.categoryId === 'coffee' && '☕'}
          {product.categoryId === 'non-coffee' && '🧃'}
          {product.categoryId === 'food' && '🍔'}
          {product.categoryId === 'snack' && '🍟'}
          {product.categoryId === 'dessert' && '🍰'}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted)] line-clamp-1">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold text-amber-600">{formatRupiah(product.price)}</span>
            {totalQty > 0 ? (
              <span className="flex items-center gap-1 rounded-xl bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-600 ring-1 ring-amber-500/25">
                <span className="tabular-nums">{totalQty}×</span>
                <span>di keranjang</span>
              </span>
            ) : (
              <span className="rounded-xl bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
                + Pilih
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function StickyCartBar({ table }: { table: string }) {
  const itemCount = useCartStore(selectItemCount);
  const total = useCartStore(selectTotal);
  const router = useRouter();
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md px-4 pb-4">
        <button
          onClick={() => router.push(`/customer/cart?table=${table}`)}
          className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 shadow-2xl shadow-orange-500/30 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-black text-white tabular-nums">
              {itemCount}
            </span>
            <span className="text-sm font-semibold text-white">Lihat Keranjang</span>
          </div>
          <span className="text-base font-bold text-white tabular-nums">{formatRupiah(total)}</span>
        </button>
      </div>
    </div>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const table = searchParams.get('table');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && product.isAvailable;
    });
  }, [activeCategory, searchQuery]);

  if (!table) return <NoTableWarning />;

  return (
    <>
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu favorit..."
            className="h-11 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] pl-9 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none transition-all focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/15"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[10px] text-[var(--text-muted)]">✕</button>
          )}
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/25'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] active:bg-[var(--bg-hover)]'
                }`}
            >
              <span>{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 px-4 pb-28">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl opacity-30">🔍</span>
            <p className="mt-3 text-sm text-[var(--text-muted)]">Tidak ada menu ditemukan</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="mt-3 rounded-lg bg-[var(--bg-surface)] px-4 py-2 text-xs text-amber-600">Reset Filter</button>
          </div>
        ) : (
          filteredProducts.map((product) => <MenuProductCard key={product.id} product={product} table={table} />)
        )}
      </div>

      <StickyCartBar table={table} />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>}>
      <MenuContent />
    </Suspense>
  );
}
