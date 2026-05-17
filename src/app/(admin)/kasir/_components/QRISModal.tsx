'use client';

// ============================================================
// QRIS Payment Modal
// ============================================================

import { formatRupiah } from '@/core/utils/format';
import { useEffect, useState, useCallback } from 'react';

type ModalStage = 'qr' | 'loading' | 'success';

interface QRISModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QRISModal({
  isOpen,
  total,
  onClose,
  onSuccess,
}: QRISModalProps) {
  const [stage, setStage] = useState<ModalStage>('qr');

  // Reset stage when modal opens
  useEffect(() => {
    if (isOpen) setStage('qr');
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleConfirmPayment = useCallback(() => {
    setStage('loading');
    // Simulate payment verification
    setTimeout(() => {
      setStage('success');
      setTimeout(() => {
        onSuccess();
      }, 1800);
    }, 2000);
  }, [onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[var(--admin-surface)] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-neutral-400 transition-all hover:bg-white/[0.12] hover:text-white"
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* ── QR Display Stage ─────────────────────────── */}
        {stage === 'qr' && (
          <div className="flex flex-col items-center px-8 pb-8 pt-10">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl shadow-lg shadow-violet-500/30">
              📱
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">
              Pembayaran QRIS
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Scan QR code di bawah ini
            </p>

            {/* QR Code Placeholder */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white p-4">
              <div className="relative flex h-48 w-48 items-center justify-center">
                {/* Simulated QR pattern */}
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full"
                  fill="none"
                >
                  {/* Corner squares */}
                  <rect x="10" y="10" width="50" height="50" rx="4" fill="#1a1a2e" />
                  <rect x="18" y="18" width="34" height="34" rx="2" fill="white" />
                  <rect x="24" y="24" width="22" height="22" rx="2" fill="#1a1a2e" />

                  <rect x="140" y="10" width="50" height="50" rx="4" fill="#1a1a2e" />
                  <rect x="148" y="18" width="34" height="34" rx="2" fill="white" />
                  <rect x="154" y="24" width="22" height="22" rx="2" fill="#1a1a2e" />

                  <rect x="10" y="140" width="50" height="50" rx="4" fill="#1a1a2e" />
                  <rect x="18" y="148" width="34" height="34" rx="2" fill="white" />
                  <rect x="24" y="154" width="22" height="22" rx="2" fill="#1a1a2e" />

                  {/* Data modules pattern */}
                  {[
                    [70, 10], [80, 10], [90, 10], [100, 10], [110, 10], [120, 10],
                    [70, 20], [100, 20], [120, 20],
                    [70, 30], [80, 30], [90, 30], [100, 30], [110, 30], [120, 30],
                    [80, 40], [110, 40],
                    [70, 50], [90, 50], [100, 50], [120, 50],
                    [10, 70], [30, 70], [50, 70], [70, 70], [90, 70], [110, 70], [130, 70], [150, 70], [170, 70],
                    [20, 80], [40, 80], [80, 80], [100, 80], [120, 80], [160, 80],
                    [10, 90], [30, 90], [50, 90], [70, 90], [90, 90], [130, 90], [150, 90], [170, 90],
                    [40, 100], [60, 100], [80, 100], [100, 100], [140, 100], [160, 100],
                    [10, 110], [30, 110], [50, 110], [70, 110], [110, 110], [130, 110], [170, 110],
                    [20, 120], [60, 120], [80, 120], [100, 120], [120, 120], [150, 120],
                    [10, 130], [40, 130], [60, 130], [90, 130], [110, 130], [140, 130], [170, 130],
                    [70, 140], [90, 140], [110, 140], [130, 140],
                    [80, 150], [100, 150], [140, 150], [160, 150], [170, 150],
                    [70, 160], [90, 160], [120, 160], [140, 160],
                    [80, 170], [100, 170], [110, 170], [130, 170], [150, 170], [170, 170],
                    [140, 140], [150, 140], [160, 140],
                  ].map(([x, y], i) => (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width="8"
                      height="8"
                      rx="1"
                      fill="#1a1a2e"
                    />
                  ))}

                  {/* Center logo */}
                  <rect x="78" y="78" width="44" height="44" rx="8" fill="white" />
                  <rect x="82" y="82" width="36" height="36" rx="6" fill="#7c3aed" />
                  <text
                    x="100"
                    y="106"
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    Q
                  </text>
                </svg>

                {/* Scanning animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-qr-scan" />
              </div>
            </div>

            {/* Total amount */}
            <div className="mt-6 rounded-xl bg-white/[0.04] px-6 py-3 text-center">
              <p className="text-xs text-neutral-500">Total Pembayaran</p>
              <p className="mt-0.5 text-2xl font-bold text-amber-400 tabular-nums">
                {formatRupiah(total)}
              </p>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirmPayment}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.98]"
            >
              Konfirmasi Pembayaran
            </button>

            <p className="mt-3 text-xs text-neutral-600">
              Tekan setelah customer melakukan pembayaran
            </p>
          </div>
        )}

        {/* ── Loading Stage ────────────────────────────── */}
        {stage === 'loading' && (
          <div className="flex flex-col items-center px-8 py-16">
            {/* Spinner */}
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/[0.06]" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-500" />
              <div className="absolute inset-3 animate-spin-reverse rounded-full border-4 border-transparent border-t-amber-400" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-white">
              Memverifikasi Pembayaran
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              Mohon tunggu sebentar...
            </p>
            <div className="mt-4 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-violet-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Success Stage ────────────────────────────── */}
        {stage === 'success' && (
          <div className="flex flex-col items-center px-8 py-16">
            {/* Animated checkmark */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl text-white shadow-xl shadow-emerald-500/30 animate-in zoom-in duration-500">
              ✓
            </div>
            <h3 className="mt-6 text-lg font-bold text-white">
              Pembayaran Berhasil!
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              Transaksi telah diproses
            </p>
            <div className="mt-4 rounded-xl bg-emerald-500/10 px-6 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                {formatRupiah(total)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
