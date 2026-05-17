'use client';

// ============================================================
// Cart Panel — Theme-aware receipt-style cart with variants
// ============================================================

import { formatRupiah } from '@/core/utils/format';
import { calcItemUnitPrice, buildItemDescription } from '@/core/types';
import {
  useCartStore,
  selectItemCount,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '@/store/useCartStore';
import { useState } from 'react';
import QRISModal from './QRISModal';

export default function CartPanel() {
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const tax = useCartStore(selectTax);
  const total = useCartStore(selectTotal);

  const [showQRIS, setShowQRIS] = useState(false);

  const handleCashPayment = () => {
    if (items.length === 0) return;
    alert(
      `💵 Pembayaran Cash\n\nTotal: ${formatRupiah(total)}\n\nTransaksi berhasil!`
    );
    clearCart();
  };

  return (
    <>
      <div className="flex h-full flex-col bg-[var(--bg-card)]">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-base">
              🧾
            </span>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Pesanan</h2>
              <p className="text-[11px] text-[var(--text-faint)]">{itemCount} item</p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {/* ── Cart Items ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <span className="text-4xl opacity-30">🛒</span>
              <p className="text-sm text-[var(--text-muted)]">Belum ada pesanan</p>
              <p className="text-xs text-[var(--text-faint)]">
                Klik produk untuk menambahkan
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {items.map((item) => {
                const unitPrice = calcItemUnitPrice(item);
                const desc = buildItemDescription(item);

                return (
                  <li
                    key={item.cartItemId}
                    className="group rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3.5 transition-all hover:border-amber-500/20"
                  >
                    {/* Row 1: Icon + Name + Delete */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-lg ring-1 ring-[var(--border-primary)]">
                        {item.product.categoryId === 'coffee' && '☕'}
                        {item.product.categoryId === 'non-coffee' && '🧃'}
                        {item.product.categoryId === 'food' && '🍔'}
                        {item.product.categoryId === 'snack' && '🍟'}
                        {item.product.categoryId === 'dessert' && '🍰'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight truncate">
                          {item.product.name}
                        </p>
                        {desc && (
                          <p className="mt-0.5 text-[11px] text-[var(--text-muted)] truncate">
                            {desc}
                          </p>
                        )}
                        {item.notes && (
                          <p className="mt-0.5 text-[10px] text-amber-500 truncate">
                            📝 {item.notes}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs font-medium text-emerald-600">
                          @ {formatRupiah(unitPrice)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] text-[var(--text-faint)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Row 2: Qty Pill + Line Total */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl bg-[var(--bg-card)] ring-1 ring-[var(--border-primary)]">
                        <button
                          onClick={() => decrementItem(item.cartItemId)}
                          className="flex h-8 w-8 items-center justify-center rounded-l-xl text-sm font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:scale-90"
                        >
                          −
                        </button>
                        <span className="flex h-8 w-9 items-center justify-center border-x border-[var(--border-primary)] text-sm font-bold text-[var(--text-primary)] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.cartItemId)}
                          className="flex h-8 w-8 items-center justify-center rounded-r-xl text-sm font-bold text-emerald-500 transition-all hover:bg-emerald-50 active:scale-90 dark:hover:bg-emerald-500/10"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                        {formatRupiah(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Receipt Footer ─────────────────────────────── */}
        <div className="border-t border-dashed border-[var(--border-primary)] px-5 py-4">
          <div className="mb-3 text-center text-[10px] tracking-[0.3em] text-[var(--text-faint)] select-none">
            · · · · · · · · · · · · · · · · · · · ·
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>PPN (11%)</span>
              <span className="tabular-nums">{formatRupiah(tax)}</span>
            </div>
            <div className="my-1 border-t border-[var(--border-primary)]" />
            <div className="flex justify-between text-lg font-bold text-[var(--text-primary)]">
              <span>Total</span>
              <span className="tabular-nums text-emerald-600">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Payment Actions ────────────────────────────── */}
        <div className="flex gap-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
          <button
            id="btn-pay-cash"
            onClick={handleCashPayment}
            disabled={items.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-105 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            💵 Cash
          </button>
          <button
            id="btn-pay-qris"
            onClick={() => setShowQRIS(true)}
            disabled={items.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-105 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            📱 QRIS
          </button>
        </div>
      </div>

      <QRISModal
        isOpen={showQRIS}
        total={total}
        onClose={() => setShowQRIS(false)}
        onSuccess={() => {
          setShowQRIS(false);
          clearCart();
        }}
      />
    </>
  );
}
