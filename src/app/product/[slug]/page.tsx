'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getProductBySlug, PRODUCTS } from '@/data/products';
import { useCart } from '@/store/cart';
import { formatGHS } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { toast } from 'sonner';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { add } = useCart();
  const router = useRouter();

  const [variantId, setVariantId] = useState(product?.variants?.[0]?.id || '');
  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId),
    [product, variantId]
  );

  const price = selectedVariant?.price ?? product?.price ?? 0;
  const stock = selectedVariant?.stock ?? 99;

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-zinc-500">Product not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-gold hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price,
      qty,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    });
    toast.success('Added to cart');
  };

  const handleBuy = () => {
    handleAdd();
    router.push('/cart');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatGHS(price)}</span>
            {product.compareAt && product.compareAt > price && (
              <span className="text-zinc-400 line-through">{formatGHS(product.compareAt)}</span>
            )}
          </div>

          <p className="mt-4 text-zinc-600">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Select option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={v.stock < 1}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      variantId === v.id
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 hover:border-zinc-400'
                    } ${v.stock < 1 ? 'opacity-40' : ''}`}
                  >
                    {v.name} {v.stock < 1 && '(sold out)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-zinc-200">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 hover:bg-zinc-50"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(Math.min(stock, qty + 1))}
                className="p-2 hover:bg-zinc-50"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-zinc-500">{stock} in stock</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              disabled={stock < 1}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-900 px-6 py-3 text-sm font-semibold transition hover:bg-zinc-50 disabled:opacity-40"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuy}
              disabled={stock < 1}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
