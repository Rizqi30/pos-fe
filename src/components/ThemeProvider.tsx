'use client';

// ============================================================
// Theme Provider — Hydrates theme on mount, prevents flash
// ============================================================

import { useEffect } from 'react';
import { hydrateTheme } from '@/store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateTheme();
  }, []);

  return <>{children}</>;
}
