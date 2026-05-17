'use client';

// ============================================================
// Admin Layout — Sidebar-aware layout with kasir exclusion
// Uses CSS theme variables for light/dark support
// ============================================================

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Kasir page gets full-width — no sidebar
  const isKasirMode = pathname === '/admin/kasir';

  if (isKasirMode) {
    return (
      <div className="h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── Sidebar (hidden on /kasir) ──────────────────────── */}
      <Sidebar />

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
