'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, SEED_PRODUCTS } from '@/data/products';

const KEY = 'kq_products_v2';

type ProductsCtx = {
  products: Product[];
  loading: boolean;
  addProduct: (p: Omit<Product, 'id' | 'slug'> & { slug?: string }) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => void;
  getBySlug: (slug: string) => Product | undefined;
  getFeatured: () => Product[];
  getFlash: () => Product[];
  byCategory: (cat: string) => Product[];
  resetToSeed: () => void;
};

const ProductsContext = createContext<ProductsCtx | null>(null);

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `product-${Date.now()}`
  );
}

function uniqueSlug(base: string, existing: Product[], excludeId?: string) {
  let slug = base;
  let n = 1;
  while (existing.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}
    setProducts(SEED_PRODUCTS);
    localStorage.setItem(KEY, JSON.stringify(SEED_PRODUCTS));
    setLoading(false);
  }, []);

  const persist = useCallback((list: Product[]) => {
    setProducts(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  const addProduct = useCallback(
    (input: Omit<Product, 'id' | 'slug'> & { slug?: string }) => {
      const id = `p_${Date.now()}`;
      const base = input.slug ? slugify(input.slug) : slugify(input.name);
      const product: Product = {
        ...input,
        id,
        slug: uniqueSlug(base, products),
        images: input.images?.length ? input.images : [input.image],
        tags: input.tags || [],
      };
      persist([product, ...products]);
      return product;
    },
    [products, persist]
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx < 0) return null;
      const current = products[idx];
      let slug = current.slug;
      if (patch.slug) slug = uniqueSlug(slugify(patch.slug), products, id);
      const next: Product = {
        ...current,
        ...patch,
        id: current.id,
        slug,
        images: patch.image
          ? [patch.image, ...(patch.images || current.images || []).filter((u) => u !== patch.image)]
          : patch.images || current.images,
      };
      const list = [...products];
      list[idx] = next;
      persist(list);
      return next;
    },
    [products, persist]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persist(products.filter((p) => p.id !== id));
    },
    [products, persist]
  );

  const getBySlug = useCallback((slug: string) => products.find((p) => p.slug === slug), [products]);
  const getFeatured = useCallback(() => products.filter((p) => p.featured), [products]);
  const getFlash = useCallback(() => products.filter((p) => p.flash), [products]);
  const byCategory = useCallback(
    (cat: string) => (cat === 'all' || !cat ? products : products.filter((p) => p.category === cat)),
    [products]
  );
  const resetToSeed = useCallback(() => persist([...SEED_PRODUCTS]), [persist]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getBySlug,
        getFeatured,
        getFlash,
        byCategory,
        resetToSeed,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
