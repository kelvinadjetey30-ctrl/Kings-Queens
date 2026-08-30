'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useProducts } from '@/store/products';
import { CategoryId, CATEGORY_OPTIONS, SUBCATEGORIES, Product } from '@/data/products';
import { formatGHS } from '@/lib/utils';
import { fileToCompressedDataUrl } from '@/lib/imageUpload';
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

type FormState = {
  name: string;
  category: CategoryId;
  subcategory: string;
  description: string;
  price: string;
  compareAt: string;
  image: string;
  featured: boolean;
  flash: boolean;
};

const emptyForm = (): FormState => ({
  name: '',
  category: 'chains',
  subcategory: SUBCATEGORIES.chains[0],
  description: '',
  price: '',
  compareAt: '',
  image: '',
  featured: false,
  flash: false,
});

function productToForm(p: Product): FormState {
  const subs = SUBCATEGORIES[p.category] || [];
  return {
    name: p.name,
    category: p.category,
    subcategory: p.subcategory && subs.includes(p.subcategory) ? p.subcategory : subs[0] || '',
    description: p.description,
    price: String(p.price),
    compareAt: p.compareAt != null ? String(p.compareAt) : '',
    image: p.image,
    featured: !!p.featured,
    flash: !!p.flash,
  };
}

export default function AdminProductsPage() {
  const { isAdmin, loading, user } = useAuth();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, clearAll } = useProducts();
  const fileRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [filterCat, setFilterCat] = useState<string>('all');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/login');
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return <div className="p-8 text-center text-zinc-500">Loading...</div>;
  }

  const filtered =
    filterCat === 'all' ? products : products.filter((p) => p.category === filterCat);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(productToForm(p));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const setCategory = (category: CategoryId) => {
    const subs = SUBCATEGORIES[category];
    setForm((f) => ({
      ...f,
      category,
      subcategory: subs[0] || '',
    }));
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setForm((f) => ({ ...f, image: dataUrl }));
      toast.success('Image ready');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    const name = form.name.trim();
    const price = parseFloat(form.price);
    if (!name) {
      toast.error('Name is required');
      return;
    }
    if (isNaN(price) || price < 0) {
      toast.error('Enter a valid price');
      return;
    }
    if (!form.image.trim()) {
      toast.error('Upload a product image from your gallery');
      return;
    }
    const compareAt = form.compareAt.trim() ? parseFloat(form.compareAt) : undefined;
    if (compareAt != null && (isNaN(compareAt) || compareAt < 0)) {
      toast.error('Invalid compare-at price');
      return;
    }
    const image = form.image.trim();
    const catLabel = CATEGORY_OPTIONS.find((c) => c.id === form.category)?.name || form.category;

    try {
      if (editingId) {
        updateProduct(editingId, {
          name,
          category: form.category,
          subcategory: form.subcategory || undefined,
          description: form.description.trim(),
          price,
          compareAt,
          image,
          images: [image],
          featured: form.featured,
          flash: form.flash,
        });
        toast.success(`Updated — shows under ${catLabel}`);
      } else {
        addProduct({
          name,
          category: form.category,
          subcategory: form.subcategory || undefined,
          description: form.description.trim() || name,
          price,
          compareAt,
          image,
          images: [image],
          tags: form.subcategory ? [form.subcategory] : [],
          featured: form.featured,
          flash: form.flash,
        });
        toast.success(`Added under ${catLabel} — buyers can see it now`);
      }
      closeModal();
    } catch {
      toast.error('Could not save (image may be too large). Try a smaller photo.');
    }
  };

  const remove = (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    deleteProduct(p.id);
    toast.success('Product deleted');
  };

  const subOptions = SUBCATEGORIES[form.category] || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-sm text-zinc-500">
            Upload from your gallery. Main category = shop filter. Empty until you add items.
          </p>
        </div>
        <div className="flex gap-2">
          {products.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Delete ALL products from the site?')) {
                  clearAll();
                  toast.success('Catalog cleared');
                }
              }}
              className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Clear all
            </button>
          )}
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filterCat === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
          }`}
        >
          All ({products.length})
        </button>
        {CATEGORY_OPTIONS.map((c) => {
          const n = products.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filterCat === c.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {c.name} ({n})
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  No products yet. Click <strong>Add product</strong> and upload from your gallery.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-zinc-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {CATEGORY_OPTIONS.find((c) => c.id === p.category)?.name || p.category}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{p.subcategory || '—'}</td>
                  <td className="px-4 py-3 font-medium">{formatGHS(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800">
                          Featured
                        </span>
                      )}
                      {p.flash && (
                        <span className="rounded bg-orange/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange">
                          Flash
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-1 inline-flex rounded-lg p-2 hover:bg-zinc-100"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingId ? 'Edit product' : 'Add product'}</h2>
              <button onClick={closeModal} className="rounded-lg p-1 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Main category * (shop filter)
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Type / subcategory
                </label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {subOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500">Price (GHS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500">
                    Compare-at (optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.compareAt}
                    onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Product image * (from your gallery)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onPickFile}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm font-medium text-zinc-700 hover:border-gold hover:bg-gold/5 disabled:opacity-60"
                >
                  {uploading ? (
                    'Compressing…'
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      {form.image ? 'Change photo' : 'Choose from gallery'}
                    </>
                  )}
                </button>
                {form.image ? (
                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Preview" className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="mt-3 flex h-24 items-center justify-center gap-2 rounded-xl bg-zinc-50 text-xs text-zinc-400">
                    <ImageIcon className="h-4 w-4" /> No image yet
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured (home)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.flash}
                    onChange={(e) => setForm({ ...form, flash: e.target.checked })}
                  />
                  Flash deal
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 rounded-full border border-zinc-200 py-2.5 text-sm font-medium hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={uploading}
                className="flex-1 rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {editingId ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
