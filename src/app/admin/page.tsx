'use client';

// ============================================================
// Admin Dashboard — Statistical overview page
// Theme-aware: Light (default) / Dark via toggle
// ============================================================

import { formatRupiah } from '@/core/utils/format';
import {
  mockDashboardMetrics,
  mockSalesTrend,
  mockRecentTransactions,
} from '@/core/data/orders';
import { useMemo } from 'react';

// ── Metric Card Configuration ───────────────────────────────

interface MetricCardData {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  gradient: string;
  shadowColor: string;
  trend?: { value: string; up: boolean };
}

export default function DashboardPage() {
  const metrics = mockDashboardMetrics;
  const salesTrend = mockSalesTrend;
  const recentTrx = mockRecentTransactions;

  const metricCards: MetricCardData[] = useMemo(
    () => [
      {
        label: 'Total Pendapatan',
        value: formatRupiah(metrics.totalRevenue),
        subtext: 'Minggu ini',
        icon: '💰',
        gradient: 'from-emerald-500 to-teal-600',
        shadowColor: 'shadow-emerald-500/20',
        trend: { value: '+12.5%', up: true },
      },
      {
        label: 'Total Pesanan',
        value: metrics.totalOrders.toString(),
        subtext: 'Minggu ini',
        icon: '📦',
        gradient: 'from-blue-500 to-indigo-600',
        shadowColor: 'shadow-blue-500/20',
        trend: { value: '+8.2%', up: true },
      },
      {
        label: 'Meja Aktif',
        value: metrics.activeTables.toString(),
        subtext: 'Saat ini',
        icon: '🪑',
        gradient: 'from-amber-500 to-orange-500',
        shadowColor: 'shadow-amber-500/20',
      },
      {
        label: 'Produk Terlaris',
        value: metrics.topProduct.name,
        subtext: `${metrics.topProduct.quantity} terjual`,
        icon: '⭐',
        gradient: 'from-violet-500 to-purple-600',
        shadowColor: 'shadow-violet-500/20',
        trend: { value: '#1', up: true },
      },
    ],
    [metrics]
  );

  // ── Compute chart bar heights ─────────────────────────────
  const maxRevenue = useMemo(
    () => Math.max(...salesTrend.map((p) => p.revenue)),
    [salesTrend]
  );

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-500">
          Ringkasan performa cafe hari ini
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          METRIC CARDS
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[var(--bg-card)] p-5 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/[0.1] hover:-translate-y-0.5 shadow-sm"
          >
            {/* Gradient glow background */}
            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.07] blur-2xl transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-150`}
            />

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-neutral-500 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-neutral-500">{card.subtext}</p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-lg shadow-lg ${card.shadowColor} transition-transform duration-300 group-hover:scale-110`}
              >
                {card.icon}
              </div>
            </div>

            {card.trend && (
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={`flex h-5 items-center rounded-md px-1.5 text-[10px] font-bold ${
                    card.trend.up
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }`}
                >
                  {card.trend.up ? '↑' : '↓'} {card.trend.value}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-600">
                  vs minggu lalu
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          BOTTOM SECTION — Chart + Table
          ════════════════════════════════════════════════════ */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* ── Sales Trend Chart ───────────────────────────── */}
        <div className="col-span-1 xl:col-span-3 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Tren Penjualan
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-500">
                7 hari terakhir
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Pendapatan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Pesanan
              </span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="mt-6 flex items-end gap-3 h-52">
            {salesTrend.map((point, idx) => {
              const barHeight = (point.revenue / maxRevenue) * 100;
              const isToday = idx === salesTrend.length - 1;

              return (
                <div
                  key={point.date}
                  className="group relative flex flex-1 flex-col items-center gap-2"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg bg-slate-800 dark:bg-white/[0.1] backdrop-blur-xl px-3 py-2 text-center opacity-0 transition-all duration-200 group-hover:opacity-100 pointer-events-none z-10 min-w-[120px]">
                    <p className="text-xs font-semibold text-white">
                      {formatRupiah(point.revenue)}
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-neutral-400">
                      {point.orders} pesanan
                    </p>
                  </div>

                  {/* Bar */}
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                        isToday
                          ? 'bg-gradient-to-t from-amber-500/40 to-amber-400/80 shadow-sm shadow-amber-500/20'
                          : 'bg-gradient-to-t from-slate-100 to-slate-200 dark:from-white/[0.04] dark:to-white/[0.12] group-hover:from-amber-500/20 group-hover:to-amber-400/40'
                      }`}
                      style={{
                        height: `${barHeight}%`,
                        minHeight: '8px',
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-medium ${
                      isToday ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-neutral-600'
                    }`}
                  >
                    {point.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent Transactions Table ───────────────────── */}
        <div className="col-span-1 xl:col-span-2 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Transaksi Terbaru
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-500">
                {recentTrx.length} transaksi terakhir
              </p>
            </div>
            <button className="rounded-lg bg-amber-50 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-100 dark:hover:bg-white/[0.08]">
              Lihat Semua
            </button>
          </div>

          {/* Table */}
          <div className="mt-4 space-y-2">
            {recentTrx.map((trx) => (
              <div
                key={trx.id}
                className="group flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] p-3 transition-all hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-white/[0.05] text-sm shadow-sm dark:shadow-none ring-1 ring-slate-100 dark:ring-transparent">
                  {trx.method === 'QRIS' ? '📱' : '💵'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {trx.customer}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-500">
                    {trx.items} item · {trx.time}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatRupiah(trx.total)}
                  </p>
                  <span
                    className={`text-[10px] font-medium ${
                      trx.method === 'QRIS'
                        ? 'text-violet-500 dark:text-violet-400'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }`}
                  >
                    {trx.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
