'use client';

// ============================================================
// Customer Layout — Mobile-first shell with theme support
// ============================================================

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

function CustomerHeader() {
  const searchParams = useSearchParams();
  const table = searchParams.get('table');

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      {/* Cafe Branding */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-base font-bold text-white shadow-md shadow-orange-500/25">
          ☕
        </span>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none">
            Cafe POS
          </h1>
          <p className="text-[10px] text-[var(--text-muted)]">Self-Service Menu</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {/* Table Badge */}
        {table && (
          <div className="flex items-center gap-2 rounded-full bg-amber-500/15 px-3.5 py-1.5 ring-1 ring-amber-500/25">
            <span className="text-sm">🪑</span>
            <span className="text-xs font-bold text-[var(--accent-text)] tabular-nums">
              Meja {table.padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Mobile-first container — centered on desktop */}
      <div className="mx-auto max-w-md">
        <Suspense
          fallback={
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-[var(--border-primary)] bg-[var(--header-bg)] px-4">
              <div className="h-5 w-24 animate-pulse rounded bg-[var(--bg-surface)]" />
            </header>
          }
        >
          <CustomerHeader />
        </Suspense>
        <main>{children}</main>
      </div>
    </div>
  );
}
