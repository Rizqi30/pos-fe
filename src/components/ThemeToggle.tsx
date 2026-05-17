'use client';

// ============================================================
// Theme Toggle — Sun/Moon switch button
// ============================================================

import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-base transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* Sun icon (shown in dark mode) */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        }`}
      >
        ☀️
      </span>
      {/* Moon icon (shown in light mode) */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? '-rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      >
        🌙
      </span>
    </button>
  );
}
