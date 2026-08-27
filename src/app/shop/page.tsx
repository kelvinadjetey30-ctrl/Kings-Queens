'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { cn } from '@/lib/utils';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState('featured');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.tags.some((t) => t.includes(term))
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cat, sort, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Shop</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition',
                cat === c.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
