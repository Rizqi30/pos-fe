'use client';

// ============================================================
// Admin Sidebar — Theme-aware global navigation
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Match path exactly, or prefix match */
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/kasir', label: 'Kasir POS', icon: '🛒' },
  { href: '/kitchen', label: 'Kitchen Display', icon: '🍳' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  const isActive = useCallback(
    (item: NavItem) => {
      if (item.exact) return pathname === item.href;
      return pathname.startsWith(item.href);
    },
    [pathname]
  );

  // ── Shared sidebar content ────────────────────────────────
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-[var(--border-primary)] px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl font-bold text-white shadow-lg shadow-orange-500/20">
          ☕
        </span>
        <div>
          <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
            Cafe POS
          </h1>
          <p className="text-[11px] font-medium text-[var(--text-muted)]">
            Admin Panel
          </p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
          Menu
        </p>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  active
                    ? 'bg-amber-500/12 text-amber-600 shadow-sm shadow-amber-500/5'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition-all duration-200
                  ${
                    active
                      ? 'bg-amber-500/15 shadow-inner'
                      : 'bg-[var(--bg-surface)] group-hover:bg-[var(--bg-hover)]'
                  }
                `}
              >
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom section ────────────────────────────────── */}
      <div className="border-t border-[var(--border-primary)] px-3 py-4 space-y-1">
        {/* Theme toggle row */}
        <div className="flex items-center justify-between rounded-xl px-3 py-2">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-base">
              🎨
            </span>
            <span className="text-sm font-medium text-[var(--text-muted)]">Tema</span>
          </div>
          <ThemeToggle />
        </div>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-base">
            ⚙️
          </span>
          Pengaturan
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/8 hover:text-red-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/8 text-base">
            🚪
          </span>
          Logout
        </button>
      </div>

      {/* ── User profile ──────────────────────────────────── */}
      <div className="border-t border-[var(--border-primary)] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-surface)] p-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 ring-2 ring-violet-500/20" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">Admin</p>
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              admin@cafepos.id
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Hamburger ─────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-lg text-[var(--text-muted)] shadow-lg transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-shrink-0 lg:flex-col border-r border-[var(--border-primary)] bg-[var(--bg-surface)]/60 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer ────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-[280px] bg-[var(--bg-card)] shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] transition-all hover:text-[var(--text-primary)]"
              aria-label="Close menu"
            >
              ✕
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
