// ============================================================
// Kasir Layout — Full-width shell for POS terminal
// ============================================================

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {children}
    </div>
  );
}
