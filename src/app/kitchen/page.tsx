'use client';

// ============================================================
// Kitchen Display System (KDS) — Full-screen, tablet-friendly
// With Station Filtering: All / Barista (Drinks) / Kitchen (Food)
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { Order, OrderStatus, CartItem, buildItemDescription } from '@/core/types';
import { formatRupiah } from '@/core/utils/format';
import ThemeToggle from '@/components/ThemeToggle';

// ── Station / Filter Types ──────────────────────────────────

type StationFilter = 'all' | 'barista' | 'kitchen';

interface StationConfig {
  key: StationFilter;
  label: string;
  icon: string;
  activeColor: string;
  activeBg: string;
  activeRing: string;
}

const STATIONS: StationConfig[] = [
  {
    key: 'all',
    label: 'All Orders',
    icon: '📋',
    activeColor: 'text-white',
    activeBg: 'bg-white/[0.12]',
    activeRing: 'ring-white/20',
  },
  {
    key: 'barista',
    label: 'Barista',
    icon: '☕',
    activeColor: 'text-violet-300',
    activeBg: 'bg-violet-500/15',
    activeRing: 'ring-violet-500/30',
  },
  {
    key: 'kitchen',
    label: 'Kitchen',
    icon: '🍳',
    activeColor: 'text-orange-300',
    activeBg: 'bg-orange-500/15',
    activeRing: 'ring-orange-500/30',
  },
];

// Category → Station mapping
const DRINK_CATEGORIES = new Set(['coffee', 'non-coffee']);
const FOOD_CATEGORIES = new Set(['food', 'snack', 'dessert']);

/** Filter items in an order based on the active station */
function filterItemsByStation(items: CartItem[], station: StationFilter): CartItem[] {
  if (station === 'all') return items;
  const categorySet = station === 'barista' ? DRINK_CATEGORIES : FOOD_CATEGORIES;
  return items.filter((item) => categorySet.has(item.product.categoryId));
}

/** Check if an order has any items for the active station */
function orderHasItemsForStation(order: Order, station: StationFilter): boolean {
  if (station === 'all') return true;
  return filterItemsByStation(order.items, station).length > 0;
}

// ── Column Configuration ────────────────────────────────────

interface ColumnConfig {
  key: OrderStatus;
  title: string;
  icon: string;
  accentColor: string;
  headerBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  actionLabel: string | null;
  actionBg: string;
  pulseColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'pending',
    title: 'INCOMING',
    icon: '🔔',
    accentColor: 'text-amber-400',
    headerBg: 'bg-amber-500/10 border-amber-500/20',
    cardBorder: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    actionLabel: 'Mulai Buat',
    actionBg: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600',
    pulseColor: 'bg-amber-400',
  },
  {
    key: 'preparing',
    title: 'PREPARING',
    icon: '🔥',
    accentColor: 'text-blue-400',
    headerBg: 'bg-blue-500/10 border-blue-500/20',
    cardBorder: 'border-l-blue-500',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    actionLabel: 'Siap Antar',
    actionBg: 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600',
    pulseColor: 'bg-blue-400',
  },
  {
    key: 'completed',
    title: 'READY',
    icon: '✅',
    accentColor: 'text-emerald-400',
    headerBg: 'bg-emerald-500/10 border-emerald-500/20',
    cardBorder: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    actionLabel: null,
    actionBg: '',
    pulseColor: 'bg-emerald-400',
  },
];

// ── Live Clock ──────────────────────────────────────────────

function useKitchenClock() {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setDisplay(fmt.format(new Date()));
    const timer = setInterval(() => setDisplay(fmt.format(new Date())), 1000);
    return () => clearInterval(timer);
  }, []);

  return display;
}

// ── Main Page ───────────────────────────────────────────────

export default function KitchenPage() {
  const orders = useOrderStore((s) => s.orders);
  const clock = useKitchenClock();
  const [activeStation, setActiveStation] = useState<StationFilter>('all');

  // Filter orders by station — remove orders that have zero matching items
  const filteredOrders = useMemo(
    () => orders.filter((o) => orderHasItemsForStation(o, activeStation)),
    [orders, activeStation]
  );

  const ordersByStatus: Record<OrderStatus, Order[]> = useMemo(
    () => ({
      pending: filteredOrders.filter((o) => o.status === 'pending'),
      preparing: filteredOrders.filter((o) => o.status === 'preparing'),
      completed: filteredOrders.filter((o) => o.status === 'completed'),
    }),
    [filteredOrders]
  );

  // Counts for header summary
  const totalCounts = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      completed: orders.filter((o) => o.status === 'completed').length,
    }),
    [orders]
  );

  return (
    <div className="flex h-screen flex-col select-none bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ════════════════════════════════════════════════════
          KDS HEADER — Branding, Summary, Clock
          ════════════════════════════════════════════════════ */}
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-surface)]/60 px-6">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg shadow-lg shadow-orange-500/20">
            🍳
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
              Kitchen Display
            </h1>
            <p className="text-[11px] text-[var(--text-muted)] font-medium">
              Cafe POS — Live Orders
            </p>
          </div>
        </div>

        {/* Center: Summary */}
        <div className="hidden md:flex items-center gap-6">
          {COLUMNS.map((col) => {
            const count = totalCounts[col.key];
            return (
              <div key={col.key} className="flex items-center gap-2">
                <span className="text-lg">{col.icon}</span>
                <span className={`text-2xl font-bold tabular-nums ${col.accentColor}`}>
                  {count}
                </span>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  {col.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Theme Toggle + Clock */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-3xl font-bold tabular-nums text-[var(--text-primary)]/80 tracking-wide">
            {clock ?? '--:--:--'}
          </span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          STATION FILTER BAR
          ════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-2.5">
        {STATIONS.map((station) => {
          const isActive = activeStation === station.key;
          // Show filtered count for non-all stations
          const stationCount =
            station.key === 'all'
              ? orders.length
              : orders.filter((o) => orderHasItemsForStation(o, station.key)).length;

          return (
            <button
              key={station.key}
              onClick={() => setActiveStation(station.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95
                ${
                  isActive
                    ? `${station.activeBg} ${station.activeColor} ring-1 ${station.activeRing} shadow-sm`
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]'
                }
              `}
            >
              <span className="text-base">{station.icon}</span>
              <span>{station.label}</span>
              <span
                className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-black tabular-nums ${
                  isActive
                    ? 'bg-white/[0.1] text-inherit'
                    : 'bg-white/[0.04] text-neutral-600'
                }`}
              >
                {stationCount}
              </span>
            </button>
          );
        })}

        {/* Active station label (right-aligned) */}
        {activeStation !== 'all' && (
          <div className="ml-auto flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
            <span>
              Menampilkan{' '}
              <span className="font-bold text-[var(--text-primary)]">
                {activeStation === 'barista' ? 'minuman' : 'makanan'}
              </span>{' '}
              saja
            </span>
            <button
              onClick={() => setActiveStation('all')}
              className="rounded-md bg-[var(--bg-hover)] px-2 py-1 text-[var(--text-muted)] transition-all hover:text-[var(--text-primary)]"
            >
              ✕ Reset
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          3-COLUMN KANBAN BOARD
          ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 gap-0 overflow-hidden bg-[var(--bg-secondary)]">
        {COLUMNS.map((col) => {
          const columnOrders = ordersByStatus[col.key];

          return (
            <div
              key={col.key}
              className="flex flex-1 flex-col border-r border-[var(--border-primary)] last:border-r-0"
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between border-b px-5 py-3 ${col.headerBg}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{col.icon}</span>
                  <span
                    className={`text-sm font-black uppercase tracking-widest ${col.accentColor}`}
                  >
                    {col.title}
                  </span>
                </div>
                <span
                  className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-sm font-bold ${col.badgeBg} ${col.badgeText}`}
                >
                  {columnOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
                {columnOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
                    <span className="text-5xl">{col.icon}</span>
                    <p className="mt-3 text-sm font-medium text-[var(--text-muted)]">
                      Kosong
                    </p>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      config={col}
                      station={activeStation}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Kitchen Order Card ──────────────────────────────────────

interface KitchenOrderCardProps {
  order: Order;
  config: ColumnConfig;
  station: StationFilter;
}

function KitchenOrderCard({ order, config, station }: KitchenOrderCardProps) {
  const advanceOrder = useOrderStore((s) => s.advanceOrder);
  const [isActioning, setIsActioning] = useState(false);

  const handleAction = useCallback(() => {
    setIsActioning(true);
    setTimeout(() => {
      advanceOrder(order.id);
      setIsActioning(false);
    }, 300);
  }, [advanceOrder, order.id]);

  const elapsed = getElapsedTime(order.createdAt);

  // Filter items based on station view
  const visibleItems = useMemo(
    () => filterItemsByStation(order.items, station),
    [order.items, station]
  );

  // Dynamic action label based on station context
  const stationActionLabel = useMemo(() => {
    if (!config.actionLabel) return null;
    if (station === 'all') return config.actionLabel;
    if (config.key === 'pending') {
      return station === 'barista' ? 'Buat Minuman' : 'Buat Makanan';
    }
    if (config.key === 'preparing') {
      return station === 'barista' ? 'Minuman Siap' : 'Makanan Siap';
    }
    return config.actionLabel;
  }, [config.actionLabel, config.key, station]);

  // How many items are hidden by the filter
  const hiddenCount = order.items.length - visibleItems.length;

  return (
    <div
      className={`group rounded-2xl border border-[var(--border-primary)] border-l-4 ${config.cardBorder} bg-[var(--bg-card)] shadow-sm transition-all duration-300 hover:shadow-md
        ${isActioning ? 'scale-95 opacity-40' : ''}
      `}
    >
      {/* ── Card Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {order.orderNumber}
          </span>
          {order.orderType === 'takeaway' ? (
            <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30">
              🛍️ Takeaway{order.tableNumber ? ` — Meja ${order.tableNumber}` : ''}
            </span>
          ) : (
            <>
              {order.tableNumber && (
                <span className="rounded-lg bg-slate-100 dark:bg-white/[0.08] px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-neutral-300">
                  🪑 Meja {order.tableNumber}
                </span>
              )}
              <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30">
                🍽️ Dine-In
              </span>
            </>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className={`text-xs font-bold tabular-nums ${
              elapsed.minutes >= 10 ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-neutral-500'
            }`}
          >
            ⏱ {elapsed.display}
          </span>
        </div>
      </div>

      {/* Customer */}
      <p className="px-5 text-sm font-medium text-slate-500 dark:text-zinc-400">{order.customerName}</p>

      {/* ── Items (filtered by station) ───────────────────── */}
      <div className="mt-3 space-y-0.5 px-5 pb-2">
        {visibleItems.map((item) => {
          const desc = buildItemDescription(item);
          return (
            <div key={item.cartItemId} className="border-b border-slate-100 dark:border-white/[0.04] last:border-b-0">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-sm font-black text-amber-600 dark:text-amber-400">
                    {item.quantity}×
                  </span>
                  <div className="min-w-0">
                    <span className="text-base font-bold text-slate-900 dark:text-white block truncate">
                      {item.product.name}
                    </span>
                    {desc && (
                      <span className="text-xs font-medium text-slate-500 dark:text-zinc-300 block truncate">
                        {desc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Per-item notes */}
              {item.notes && (
                <div className="ml-9 mb-1.5 rounded-md bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300/80">
                  📝 {item.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Hidden items hint (when filtering) ───────────── */}
      {hiddenCount > 0 && (
        <div className="mx-5 mb-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-neutral-500">
          +{hiddenCount} item lain (
          {station === 'barista' ? 'makanan' : 'minuman'}) di station lain
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────── */}
      {order.notes && (
        <div className="mx-5 mb-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-300">
          📝 {order.notes}
        </div>
      )}

      {/* ── Footer + Action ──────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pb-4 pt-2">
        <span className="text-sm font-bold text-slate-800 dark:text-white tabular-nums">
          {formatRupiah(order.total)}
        </span>

        {stationActionLabel && (
          <button
            onClick={handleAction}
            disabled={isActioning}
            className={`rounded-xl ${config.actionBg} px-6 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50`}
          >
            {config.key === 'pending' ? '👨‍🍳' : '✅'} {stationActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Utility ─────────────────────────────────────────────────

function getElapsedTime(date: Date): { display: string; minutes: number } {
  const diffMs = Date.now() - date.getTime();
  const totalMins = Math.floor(diffMs / 60_000);
  const mins = totalMins % 60;
  const hrs = Math.floor(totalMins / 60);

  if (hrs > 0) {
    return {
      display: `${hrs}h ${mins}m`,
      minutes: totalMins,
    };
  }
  return {
    display: `${mins}m`,
    minutes: totalMins,
  };
}
