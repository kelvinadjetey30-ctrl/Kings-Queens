'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { formatGHS } from '@/lib/utils';
import { DELIVERY, deliveryFromFee } from '@/lib/delivery';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-zinc-500">Add some drip to get started.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const freeEligible = total >= DELIVERY.freeThreshold;
  const fromFee = deliveryFromFee();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Cart ({count})</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId || 'd'}`}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-sm text-zinc-500">{item.variantName}</p>
                    )}
                  </div>
                  <p className="font-semibold">{formatGHS(item.price * item.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border border-zinc-200">
                    <button
                      onClick={() => setQty(item.productId, item.qty - 1, item.variantId)}
                      className="p-1.5 hover:bg-zinc-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.productId, item.qty + 1, item.variantId)}
                      className="p-1.5 hover:bg-zinc-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.productId, item.variantId)}
                    className="text-zinc-400 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span>{formatGHS(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery</span>
              <span>
                {freeEligible ? 'FREE' : `from ${formatGHS(fromFee)}`}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Fee depends on your region at checkout (Accra {formatGHS(DELIVERY.accra.fee)} → Far{' '}
            {formatGHS(DELIVERY.far.fee)}).
          </p>
          {!freeEligible && (
            <p className="mt-2 text-xs text-zinc-500">
              Add {formatGHS(DELIVERY.freeThreshold - total)} more for free delivery.
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-zinc-100 pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatGHS(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-zinc-900 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-zinc-500 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
