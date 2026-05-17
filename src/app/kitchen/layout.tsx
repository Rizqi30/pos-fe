import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kitchen Display — Cafe POS',
  description: 'Full-screen kitchen display system for chefs and baristas',
};

/**
 * Kitchen route layout — fully standalone, no admin sidebar.
 * High-contrast dark theme optimized for kitchen/tablet use.
 */
export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#08080c] text-white">
      {children}
    </div>
  );
}
