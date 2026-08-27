'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/store/products';
import { CATEGORIES } from '@/data/products';
import { STORE } from '@/lib/config';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';

export default function HomePage() {
  const { getFeatured, getFlash, loading } = useProducts();
  const featured = getFeatured();
  const flash = getFlash();

  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 md:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-gold">Ghana Premium Drip</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Drip For Kings<br />and Queens
          </h1>
          <p className="max-w-lg text-zinc-400">
            Chains, watches, clothes, shoes & more. Pay with MTN MoMo. Free delivery on orders over GHS{' '}
            {STORE.freeDeliveryThreshold}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-yellow-400"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-medium transition hover:border-zinc-400"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-gold" />
            <div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="text-sm text-zinc-500">Accra & nationwide</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-gold" />
            <div>
              <p className="font-semibold">Secure MoMo</p>
              <p className="text-sm text-zinc-500">Manual verified payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="h-8 w-8 text-gold" />
            <div>
              <p className="font-semibold">WhatsApp Support</p>
              <p className="text-sm text-zinc-500">{STORE.whatsapp}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
            <Link
              key={c.id}
              href={`/shop?cat=${c.id}`}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-5 text-center text-sm font-semibold transition hover:border-gold hover:shadow-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {!loading && flash.length > 0 && (
        <section className="bg-orange/5 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Flash Deals</h2>
              <Link href="/shop" className="text-sm font-medium text-orange hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {flash.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Drip</h2>
          <Link href="/shop" className="text-sm font-medium text-gold hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : featured.length === 0 ? (
          <p className="text-zinc-500">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-zinc-950 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to level up your look?</h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-400">
            Order now, pay with MoMo, and get your package delivered across Ghana.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-bold text-zinc-950 hover:bg-yellow-400"
          >
            Browse Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
