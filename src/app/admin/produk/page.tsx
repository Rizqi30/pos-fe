'use client';

// ============================================================
// Product Management (Admin) — View and Manage Products
// ============================================================

import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import { formatRupiah } from '@/core/utils/format';

export default function ProductManagementPage() {
  const products = useProductStore((s) => s.products);
  const toggleAvailability = useProductStore((s) => s.toggleAvailability);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'coffee': return '☕';
      case 'non-coffee': return '🧃';
      case 'food': return '🍔';
      case 'snack': return '🍟';
      case 'dessert': return '🍰';
      default: return '📦';
    }
  };

  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'coffee': return 'Kopi';
      case 'non-coffee': return 'Non-Kopi';
      case 'food': return 'Makanan';
      case 'snack': return 'Snack';
      case 'dessert': return 'Dessert';
      default: return categoryId;
    }
  };

  return (
    <div className="flex h-full flex-col px-8 py-8">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Produk</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Kelola daftar menu, harga, dan ketersediaan stok
          </p>
        </div>
        <Link
          href="/admin/produk/tambah"
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 hover:shadow-amber-500/30 active:scale-95"
        >
          <span>+</span> Tambah Produk
        </Link>
      </header>

      {/* ── Data Table ────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-secondary)]">
            <thead className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs font-semibold uppercase text-[var(--text-muted)]">
              <tr>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Dasar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                    Belum ada produk yang ditambahkan.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-[var(--bg-hover)]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-2xl border border-[var(--border-subtle)]">
                          {getCategoryIcon(product.categoryId)}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1 w-48">
                            {product.description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium border border-[var(--border-subtle)]">
                        {getCategoryIcon(product.categoryId)} {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)] tabular-nums">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(product.id)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          product.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                        }`}
                      >
                        {product.isAvailable ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          title="Hapus Produk"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
