'use client';

// ============================================================
// Theme Store — Global light/dark toggle with persistence
// ============================================================

import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light', // Default: light

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next === 'dark');
        localStorage.setItem('cafe-pos-theme', next);
      }
      return { theme: next };
    }),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('cafe-pos-theme', theme);
    }
    set({ theme });
  },
}));

/** Call once on mount to hydrate theme from localStorage */
export function hydrateTheme() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('cafe-pos-theme') as Theme | null;
  const theme = saved ?? 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  useThemeStore.setState({ theme });
}
