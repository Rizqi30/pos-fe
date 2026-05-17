// ============================================================
// Formatting utilities
// ============================================================

/**
 * Format a number to Indonesian Rupiah currency string.
 * e.g. 28000 → "Rp 28.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a Date to a locale-aware date-time string.
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
