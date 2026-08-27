'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { formatGHS } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {product.flash && (
          <span className="absolute left-2 top-2 rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-white">
            FLASH
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-zinc-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-zinc-900">{formatGHS(product.price)}</span>
          {product.compareAt && (
            <span className="text-xs text-zinc-400 line-through">{formatGHS(product.compareAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
