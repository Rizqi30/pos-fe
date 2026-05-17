'use client';

// ============================================================
// Product Detail Modal — 2-Column Desktop Layout (Kasir POS)
// Light theme with wide, comfortable layout
// ============================================================

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Product,
  Temperature,
  DrinkSize,
  VariantSelection,
  AddOn,
  VARIANT_PRICES,
} from '@/core/types';
import { formatRupiah } from '@/core/utils/format';
import { isDrinkCategory, getAddOnsForCategory } from '@/core/data/variants';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (
    product: Product,
    variants: VariantSelection,
    addOns: AddOn[],
    notes: string
  ) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAdd,
}: ProductDetailModalProps) {
  const [temperature, setTemperature] = useState<Temperature>('hot');
  const [size, setSize] = useState<DrinkSize>('regular');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [notes, setNotes] = useState('');

  // Reset state when a new product is opened
  useEffect(() => {
    if (product) {
      setTemperature('hot');
      setSize('regular');
      setSelectedAddOns([]);
      setNotes('');
    }
  }, [product]);

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

  const handleSubmit = useCallback(() => {
    if (!product) return;
    const variants: VariantSelection = isDrink
      ? { temperature, size }
      : {};
    onAdd(product, variants, selectedAddOns, notes);
    onClose();
  }, [product, isDrink, temperature, size, selectedAddOns, notes, onAdd, onClose]);

  if (!product) return null;

  const categoryIcon =
    product.categoryId === 'coffee' ? '☕' :
    product.categoryId === 'non-coffee' ? '🧃' :
    product.categoryId === 'food' ? '🍔' :
    product.categoryId === 'snack' ? '🍟' : '🍰';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — wide 2-column */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700"
        >
          ✕
        </button>

        {/* ── 2-Column Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* ─── LEFT COLUMN: Product Info + Notes (2/5) ─── */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100/80 p-6 md:p-8 flex flex-col">
            {/* Product hero */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-5xl shadow-sm ring-1 ring-slate-200/60">
                {categoryIcon}
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-800 leading-tight">
                {product.name}
              </h2>
              {product.description && (
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                  {product.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-600">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs text-slate-400">harga dasar</span>
              </div>
            </div>

            {/* Notes input — pinned to bottom of left col */}
            <div className="mt-auto pt-6">
              <h3 className="text-sm font-bold text-slate-700 mb-2">
                📝 Catatan
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Less sugar, no ice, extra hot, dll..."
                rows={3}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Variants + Add-ons (3/5) ─── */}
          <div className="md:col-span-3 max-h-[70vh] overflow-y-auto p-6 md:p-8 space-y-6 border-t md:border-t-0 md:border-l border-slate-200/60">
            {/* Temperature (drinks only) */}
            {isDrink && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-sm">☕</span>
                  Temperatur
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'hot' as Temperature, icon: '☕', label: 'Panas', sub: 'Harga dasar', extra: 0 },
                    { key: 'iced' as Temperature, icon: '🧊', label: 'Es / Dingin', sub: `+${formatRupiah(VARIANT_PRICES.iced)}`, extra: VARIANT_PRICES.iced },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setTemperature(opt.key)}
                      className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-4 transition-all duration-150
                        ${
                          temperature === opt.key
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm shadow-emerald-500/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${
                          temperature === opt.key ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {opt.label}
                        </p>
                        <p className={`text-xs ${
                          temperature === opt.key ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {opt.sub}
                        </p>
                      </div>
                      {temperature === opt.key && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size (drinks only) */}
            {isDrink && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm">📐</span>
                  Ukuran
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'regular' as DrinkSize, icon: '🥤', label: 'Regular', sub: 'Harga dasar', extra: 0 },
                    { key: 'large' as DrinkSize, icon: '🥛', label: 'Large', sub: `+${formatRupiah(VARIANT_PRICES.large)}`, extra: VARIANT_PRICES.large },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSize(opt.key)}
                      className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-4 transition-all duration-150
                        ${
                          size === opt.key
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm shadow-emerald-500/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${
                          size === opt.key ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {opt.label}
                        </p>
                        <p className={`text-xs ${
                          size === opt.key ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {opt.sub}
                        </p>
                      </div>
                      {size === opt.key && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {availableAddOns.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-sm">✨</span>
                  Tambahan
                </h3>
                <div className="space-y-2.5">
                  {availableAddOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 transition-all duration-150
                          ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/70 shadow-sm shadow-emerald-500/10'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }
                        `}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}>
                          ✓
                        </span>
                        <span className={`flex-1 text-left text-sm font-medium ${
                          isSelected ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {addOn.name}
                        </span>
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          +{formatRupiah(addOn.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state for food without add-ons (shouldn't happen with current data) */}
            {!isDrink && availableAddOns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-3xl opacity-30">🍽️</span>
                <p className="mt-2 text-sm text-slate-400">Tidak ada opsi tambahan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: Full-width Add Button ───────────────── */}
        <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-5 md:px-8">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] hover:shadow-emerald-500/40 hover:brightness-105"
          >
            <span className="text-lg">🛒</span>
            <span>Tambah ke Pesanan</span>
            <span className="rounded-xl bg-white/20 px-3.5 py-1 text-sm font-black tabular-nums">
              {formatRupiah(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
