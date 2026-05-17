'use client';

// ============================================================
// Customer Product Detail — Theme-aware full-page customization
// Route: /menu/[id]?table=XX
// ============================================================

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { products } from '@/core/data/products';
import { useCartStore, selectItemCount, selectTotal } from '@/store/useCartStore';
import { formatRupiah } from '@/core/utils/format';
import { Temperature, DrinkSize, VariantSelection, AddOn, VARIANT_PRICES } from '@/core/types';
import { isDrinkCategory, getAddOnsForCategory } from '@/core/data/variants';

function ProductDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const table = searchParams.get('table') ?? '';
  const productId = params.id as string;

  const product = products.find((p) => p.id === productId);
  const addItemWithOptions = useCartStore((s) => s.addItemWithOptions);
  const itemCount = useCartStore(selectItemCount);
  const cartTotal = useCartStore(selectTotal);

  const [temperature, setTemperature] = useState<Temperature>('hot');
  const [size, setSize] = useState<DrinkSize>('regular');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [notes, setNotes] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const isDrink = product ? isDrinkCategory(product.categoryId) : false;
  const availableAddOns = product ? getAddOnsForCategory(product.categoryId) : [];

  const toggleAddOn = useCallback((addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addOn.id);
      if (exists) return prev.filter((a) => a.id !== addOn.id);
      return [...prev, addOn];
    });
  }, []);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (isDrink && temperature === 'iced') price += VARIANT_PRICES.iced;
    if (isDrink && size === 'large') price += VARIANT_PRICES.large;
    price += selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return price;
  }, [product, isDrink, temperature, size, selectedAddOns]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const variants: VariantSelection = isDrink ? { temperature, size } : {};
    addItemWithOptions(product, variants, selectedAddOns, notes);
    setJustAdded(true);
    setTimeout(() => { router.push(`/menu?table=${table}`); }, 800);
  }, [product, isDrink, temperature, size, selectedAddOns, notes, addItemWithOptions, router, table]);

  if (!product) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl opacity-30">🔍</span>
        <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Produk Tidak Ditemukan</h2>
        <button onClick={() => router.push(`/menu?table=${table}`)} className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white">
          ← Kembali ke Menu
        </button>
      </div>
    );
  }

  const categoryIcon =
    product.categoryId === 'coffee' ? '☕' :
    product.categoryId === 'non-coffee' ? '🧃' :
    product.categoryId === 'food' ? '🍔' :
    product.categoryId === 'snack' ? '🍟' : '🍰';

  const categoryBg =
    product.categoryId === 'coffee' ? 'from-amber-100 to-orange-100' :
    product.categoryId === 'non-coffee' ? 'from-teal-100 to-emerald-100' :
    product.categoryId === 'food' ? 'from-orange-100 to-red-100' :
    product.categoryId === 'snack' ? 'from-rose-100 to-pink-100' :
    'from-pink-100 to-purple-100';

  const categoryBgDark =
    product.categoryId === 'coffee' ? 'dark:from-amber-900/80 dark:to-amber-800/60' :
    product.categoryId === 'non-coffee' ? 'dark:from-teal-900/80 dark:to-teal-800/60' :
    product.categoryId === 'food' ? 'dark:from-orange-900/80 dark:to-orange-800/60' :
    product.categoryId === 'snack' ? 'dark:from-red-900/80 dark:to-red-800/60' :
    'dark:from-pink-900/80 dark:to-pink-800/60';

  return (
    <div className="pb-28">
      {/* ── Hero Section ──────────────────────────────────── */}
      <div className={`relative bg-gradient-to-br ${categoryBg} ${categoryBgDark} px-5 pb-8 pt-4`}>
        <button
          onClick={() => router.push(`/menu?table=${table}`)}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-card)]/70 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-sm transition-all active:scale-95"
        >
          <span>←</span> Menu
        </button>

        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-[var(--bg-card)]/60 text-6xl backdrop-blur-sm ring-1 ring-[var(--border-primary)] shadow-2xl">
            {categoryIcon}
          </div>
          <h1 className="mt-5 text-2xl font-black text-[var(--text-primary)] leading-tight">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)] leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-3 rounded-xl bg-[var(--bg-card)]/60 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-bold text-amber-600 tabular-nums">{formatRupiah(product.price)}</span>
            <span className="ml-1.5 text-xs text-[var(--text-faint)]">harga dasar</span>
          </div>
        </div>
      </div>

      {/* ── Options Section ───────────────────────────────── */}
      <div className="space-y-5 px-4 pt-6">
        {isDrink && (
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4" style={{ boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">☕ Temperatur</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { key: 'hot' as Temperature, icon: '☕', label: 'Panas', sub: 'Harga dasar' },
                { key: 'iced' as Temperature, icon: '🧊', label: 'Es / Dingin', sub: `+${formatRupiah(VARIANT_PRICES.iced)}` },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTemperature(opt.key)}
                  className={`relative flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150
                    ${temperature === opt.key
                      ? 'border-amber-500/60 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                      : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--text-faint)]'
                    }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${temperature === opt.key ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`}>{opt.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{opt.sub}</p>
                  </div>
                  {temperature === opt.key && <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {isDrink && (
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4" style={{ boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">📐 Ukuran</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { key: 'regular' as DrinkSize, icon: '🥤', label: 'Regular', sub: 'Harga dasar' },
                { key: 'large' as DrinkSize, icon: '🥛', label: 'Large', sub: `+${formatRupiah(VARIANT_PRICES.large)}` },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSize(opt.key)}
                  className={`relative flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150
                    ${size === opt.key
                      ? 'border-amber-500/60 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                      : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--text-faint)]'
                    }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${size === opt.key ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`}>{opt.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{opt.sub}</p>
                  </div>
                  {size === opt.key && <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableAddOns.length > 0 && (
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4" style={{ boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">✨ Tambahan</h3>
            <div className="space-y-2">
              {availableAddOns.map((addOn) => {
                const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                return (
                  <button
                    key={addOn.id}
                    onClick={() => toggleAddOn(addOn)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150
                      ${isSelected
                        ? 'border-amber-500/60 bg-amber-500/10'
                        : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--text-faint)]'
                      }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 text-[10px] font-bold transition-all ${isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-[var(--text-faint)] bg-transparent text-transparent'}`}>✓</span>
                    <span className={`flex-1 text-left text-sm font-medium ${isSelected ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`}>{addOn.name}</span>
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${isSelected ? 'bg-amber-500/15 text-amber-600' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>+{formatRupiah(addOn.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4" style={{ boxShadow: 'var(--card-shadow)' }}>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">📝 Catatan</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Less sugar, no ice, extra hot, dll..."
            rows={3}
            className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none transition-all resize-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/15"
          />
        </div>
      </div>

      {/* ── Sticky Bottom Button ──────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-4 py-4 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold shadow-xl transition-all active:scale-[0.98]
              ${justAdded ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/25'}`}
          >
            {justAdded ? <>✅ Ditambahkan!</> : (
              <><span>🛒</span><span>Masukkan Keranjang</span><span className="rounded-lg bg-white/20 px-2.5 py-0.5 text-xs font-black tabular-nums">{formatRupiah(totalPrice)}</span></>
            )}
          </button>
          {itemCount > 0 && !justAdded && (
            <button onClick={() => router.push(`/cart?table=${table}`)} className="flex w-full items-center justify-between rounded-xl bg-[var(--bg-surface)] px-4 py-3 text-xs transition-all active:scale-[0.98]">
              <span className="text-[var(--text-muted)]">🛒 {itemCount} item di keranjang</span>
              <span className="font-bold text-amber-600 tabular-nums">{formatRupiah(cartTotal)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
