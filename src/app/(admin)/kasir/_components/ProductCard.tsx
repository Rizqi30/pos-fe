'use client';

// ============================================================
// Product Card — Theme-aware card with CSS variables
// ============================================================

import { Product } from '@/core/types';
import { formatRupiah } from '@/core/utils/format';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      id={`product-${product.id}`}
      onClick={() => product.isAvailable && onSelect(product)}
      disabled={!product.isAvailable}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
        ${
          product.isAvailable
            ? 'border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5 active:scale-[0.97]'
            : 'border-[var(--border-subtle)] bg-[var(--bg-card)]/50 opacity-50 cursor-not-allowed'
        }
      `}
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {/* ── Product Image ─────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface)]">
        <div className="flex h-full w-full items-center justify-center text-4xl opacity-60 transition-transform duration-500 group-hover:scale-110">
          {product.categoryId === 'coffee' && '☕'}
          {product.categoryId === 'non-coffee' && '🧃'}
          {product.categoryId === 'food' && '🍔'}
          {product.categoryId === 'snack' && '🍟'}
          {product.categoryId === 'dessert' && '🍰'}
        </div>
      </div>

      {/* ── Product Info ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-1">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-bold text-amber-600">
            {formatRupiah(product.price)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-xs text-amber-500 opacity-0 transition-all group-hover:opacity-100">
            +
          </span>
        </div>
      </div>
    </button>
  );
}
