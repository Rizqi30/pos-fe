'use client';

// ============================================================
// Add Product Form — Create a new menu item
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';

export default function AddProductPage() {
  const router = useRouter();
  const addProduct = useProductStore((s) => s.addProduct);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('coffee');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // Local state for dynamic variants/addons UI (for visual completeness as requested)
  const [variants, setVariants] = useState([{ name: 'Temperatur', options: 'Panas (Harga Dasar), Es (+Rp 3.000)' }]);
  const [addons, setAddons] = useState([{ name: 'Extra Shot', price: 5000 }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addProduct({
      name,
      categoryId,
      price: Number(price),
      description,
      image: '/products/placeholder.jpg', // Placeholder for image upload
      isAvailable: true,
    });

    router.push('/admin/produk');
  };

  return (
    <div className="flex h-full flex-col px-8 py-8 overflow-y-auto scrollbar-thin">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/produk"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tambah Produk Baru</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Masukkan detail informasi produk menu baru
          </p>
        </div>
      </header>

      {/* ── Form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-8 pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Informasi Dasar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cth: Caffe Latte"
                  className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="coffee">Kopi</option>
                    <option value="non-coffee">Non-Kopi</option>
                    <option value="food">Makanan</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Harga Dasar (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Deskripsi</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail produk ini..."
                  className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Media & Upload */}
          <div className="space-y-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Media</h2>
            <div className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600">
              <span className="text-4xl">📸</span>
              <span className="text-sm font-medium">Upload Gambar</span>
              <span className="text-xs opacity-60">PNG, JPG up to 2MB</span>
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Variants */}
          <div className="space-y-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Varian Dinamis</h2>
              <button type="button" className="text-sm font-semibold text-amber-500 hover:text-amber-600">+ Tambah</button>
            </div>
            
            {variants.map((v, i) => (
              <div key={i} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{v.name}</span>
                  <span className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-red-500">Hapus</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">{v.options}</div>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="space-y-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Add-ons Tambahan</h2>
              <button type="button" className="text-sm font-semibold text-amber-500 hover:text-amber-600">+ Tambah</button>
            </div>
            
            {addons.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <span className="text-sm font-medium text-[var(--text-secondary)]">{a.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-emerald-600 font-medium">+ Rp {a.price.toLocaleString('id-ID')}</span>
                  <span className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-red-500">Hapus</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/produk"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:brightness-105 active:scale-95"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}
