'use client';

import { useState } from 'react';
import { getOrder, Order } from '@/store/orders';
import { formatGHS } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [id, setId] = useState('');
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getOrder(id.trim().toUpperCase());
    setOrder(found || null);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Track Order</h1>
      <form onSubmit={search} className="flex gap-2">
        <input
          placeholder="Order ID e.g. ELT-12345"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Track
        </button>
      </form>

      {order === null && (
        <p className="mt-8 text-center text-zinc-500">Order not found. Check the ID and try again.</p>
      )}

      {order && (
        <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Order</p>
              <p className="text-xl font-bold">{order.id}</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            Placed {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
          </p>
          <div className="border-t border-zinc-100 pt-4">
            <p className="text-sm font-medium">Items</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.qty}× {i.name} {i.variantName ? `(${i.variantName})` : ''} — {formatGHS(i.price * i.qty)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-4 font-bold">
            <span>Total</span>
            <span>{formatGHS(order.total)}</span>
          </div>
          <div className="border-t border-zinc-100 pt-4">
            <p className="mb-2 text-sm font-medium">Timeline</p>
            <ul className="space-y-2">
              {order.timeline.map((t, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <div>
                    <p className="font-medium capitalize">{t.status.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-zinc-500">
                      {format(new Date(t.at), 'dd MMM, HH:mm')}
                      {t.note ? ` · ${t.note}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/order-success/${order.id}`} className="block text-center text-sm text-gold hover:underline">
            View full details
          </Link>
        </div>
      )}
    </div>
  );
}
