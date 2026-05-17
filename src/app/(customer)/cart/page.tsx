'use client';

// ============================================================
// Customer Cart — Checkout with variant display, QRIS Payment
// ============================================================

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useCartStore,
  selectItemCount,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { formatRupiah } from '@/core/utils/format';
import {
  OrderType,
  Order,
  calcItemUnitPrice,
  buildItemDescription,
} from '@/core/types';

// ── QRIS Payment Modal ──────────────────────────────────────

interface QRISModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

function QRISPaymentModal({ isOpen, total, onClose, onSuccess }: QRISModalProps) {
  const [phase, setPhase] = useState<'loading' | 'scan' | 'success'>('loading');
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    if (!isOpen) {
      setPhase('loading');
      setCountdown(300);
      return;
    }
    const loadTimer = setTimeout(() => setPhase('scan'), 2000);
    return () => clearTimeout(loadTimer);
  }, [isOpen]);

  useEffect(() => {
    if (phase !== 'scan') return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'scan') return;
    const successTimer = setTimeout(() => {
      setPhase('success');
      setTimeout(onSuccess, 1500);
    }, 8000);
    return () => clearTimeout(successTimer);
  }, [phase, onSuccess]);

  if (!isOpen) return null;

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="mx-4 w-full max-w-sm rounded-3xl border border-white/[0.06] bg-[#12121a] p-6 shadow-2xl">
        {phase === 'loading' && (
          <div className="flex flex-col items-center py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-neutral-300">Memuat kode pembayaran...</p>
          </div>
        )}
        {phase === 'scan' && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-white">Bayar via QRIS</h3>
            <p className="mt-1 text-xs text-neutral-500">Scan QR code di bawah dengan e-wallet Anda</p>
            <div className="my-5 flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3">
              <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-[2px]">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.35 ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <div className="w-full rounded-xl bg-white/[0.04] p-3 text-center">
              <p className="text-xs text-neutral-500">Total Pembayaran</p>
              <p className="text-2xl font-black text-amber-400 tabular-nums">{formatRupiah(total)}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-neutral-500">⏱ Berlaku</span>
              <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-sm font-bold text-amber-400 tabular-nums">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-white/[0.04] py-3 text-sm font-medium text-neutral-400 transition-all active:scale-95 hover:bg-white/[0.08]"
            >
              Batal
            </button>
          </div>
        )}
        {phase === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Pembayaran Berhasil!</h3>
            <p className="mt-1 text-sm text-neutral-400">Pesanan Anda sedang diproses</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order Type Selector ─────────────────────────────────────

function OrderTypeSelector({ value, onChange }: { value: OrderType; onChange: (t: OrderType) => void }) {
  const options: { type: OrderType; icon: string; label: string; sub: string }[] = [
    { type: 'dine-in', icon: '🍽️', label: 'Dine-In', sub: 'Makan di tempat' },
    { type: 'takeaway', icon: '🛍️', label: 'Takeaway', sub: 'Dibungkus untuk dibawa' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => onChange(opt.type)}
          className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 transition-all duration-200 active:scale-95
            ${
              value === opt.type
                ? opt.type === 'dine-in'
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                  : 'border-amber-500/50 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
            }
          `}
        >
          <span className="text-2xl">{opt.icon}</span>
          <span className={`text-sm font-bold ${
            value === opt.type
              ? opt.type === 'dine-in' ? 'text-emerald-400' : 'text-amber-400'
              : 'text-neutral-400'
          }`}>
            {opt.label}
          </span>
          {value === opt.type && (
            <span className="text-xs text-neutral-500">{opt.sub}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Cart Content ────────────────────────────────────────────

function CartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const table = searchParams.get('table');

  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrderStore((s) => s.addOrder);

  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const tax = useCartStore(selectTax);
  const total = useCartStore(selectTotal);

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [showQRIS, setShowQRIS] = useState(false);
  const [nameError, setNameError] = useState(false);

  if (items.length === 0 && !showQRIS) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.04]">
          <span className="text-4xl opacity-40">🛒</span>
        </div>
        <h2 className="text-lg font-bold text-white">Keranjang Kosong</h2>
        <p className="mt-1.5 text-sm text-neutral-500">Belum ada item di keranjang Anda</p>
        <button
          onClick={() => router.push(`/menu${table ? `?table=${table}` : ''}`)}
          className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition-all active:scale-95"
        >
          ← Kembali ke Menu
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (!customerName.trim()) { setNameError(true); return; }
    setNameError(false);
    setShowQRIS(true);
  };

  const handlePaymentSuccess = () => {
    const tableNum = table ? parseInt(table, 10) : null;
    const orderCount = useOrderStore.getState().orders.length;

    const newOrder: Order = {
      id: `ord-cust-${Date.now()}`,
      orderNumber: `ORD-${String(orderCount + 1).padStart(3, '0')}`,
      orderType,
      tableNumber: tableNum,
      customerName: customerName.trim(),
      items: [...items],
      subtotal, tax, total,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addOrder(newOrder);
    clearCart();
    setShowQRIS(false);
    router.push(`/menu?table=${table ?? '00'}`);
  };

  return (
    <>
      <div className="space-y-4 px-4 pb-36 pt-4">
        <button
          onClick={() => router.push(`/menu${table ? `?table=${table}` : ''}`)}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-all hover:text-white"
        >
          <span>←</span> Kembali ke Menu
        </button>

        {/* ── Cart Items ───────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <h2 className="text-sm font-bold text-white mb-3">
            🛒 Keranjang ({itemCount} item)
          </h2>
          <div className="space-y-2">
            {items.map((item) => {
              const unitPrice = calcItemUnitPrice(item);
              const desc = buildItemDescription(item);
              return (
                <div key={item.cartItemId} className="rounded-xl bg-white/[0.03] p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
                      {item.product.categoryId === 'coffee' && '☕'}
                      {item.product.categoryId === 'non-coffee' && '🧃'}
                      {item.product.categoryId === 'food' && '🍔'}
                      {item.product.categoryId === 'snack' && '🍟'}
                      {item.product.categoryId === 'dessert' && '🍰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                      {desc && <p className="text-[11px] text-neutral-400 truncate">{desc}</p>}
                      {item.notes && <p className="text-[10px] text-amber-400/70 truncate">📝 {item.notes}</p>}
                      <p className="mt-0.5 text-xs text-amber-400">@ {formatRupiah(unitPrice)}</p>
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums flex-shrink-0">
                      {formatRupiah(unitPrice * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                      <button onClick={() => decrementItem(item.cartItemId)} className="h-8 w-8 text-sm font-bold text-neutral-300 hover:text-white active:scale-90">−</button>
                      <span className="w-8 text-center text-sm font-bold text-white tabular-nums border-x border-white/[0.06]">{item.quantity}</span>
                      <button onClick={() => incrementItem(item.cartItemId)} className="h-8 w-8 text-sm font-bold text-amber-400 hover:text-amber-300 active:scale-90">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Customer Name ────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <label htmlFor="customer-name" className="text-sm font-bold text-white">👤 Nama Pemesan</label>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(e) => { setCustomerName(e.target.value); if (e.target.value.trim()) setNameError(false); }}
            placeholder="Masukkan nama Anda..."
            className={`mt-2 h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-white placeholder-neutral-500 outline-none transition-all ${
              nameError ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/[0.06] focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/15'
            }`}
          />
          {nameError && <p className="mt-1.5 text-xs text-red-400">⚠️ Nama harus diisi</p>}
        </div>

        {/* ── Order Type ───────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <h2 className="text-sm font-bold text-white mb-3">📦 Tipe Pesanan</h2>
          <OrderTypeSelector value={orderType} onChange={setOrderType} />
        </div>

        {/* ── Summary ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <h2 className="text-sm font-bold text-white mb-3">📋 Ringkasan</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-neutral-300 tabular-nums">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">PPN (11%)</span>
              <span className="text-neutral-300 tabular-nums">{formatRupiah(tax)}</span>
            </div>
            <div className="my-2 h-px bg-white/[0.06]" />
            <div className="flex justify-between text-base">
              <span className="font-bold text-white">Total</span>
              <span className="font-black text-amber-400 tabular-nums">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pay Button ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-[#08080c]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-4 py-4">
          <button
            onClick={handlePayment}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all active:scale-[0.98]"
          >
            📱 Bayar via QRIS — {formatRupiah(total)}
          </button>
        </div>
      </div>

      <QRISPaymentModal isOpen={showQRIS} total={total} onClose={() => setShowQRIS(false)} onSuccess={handlePaymentSuccess} />
    </>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" /></div>}>
      <CartContent />
    </Suspense>
  );
}
