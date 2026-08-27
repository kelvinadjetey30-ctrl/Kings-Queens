'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrder, Order } from '@/store/orders';
import { formatGHS, toWaLink } from '@/lib/utils';
import { STORE } from '@/lib/config';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrder(getOrder(id) || null);
  }, [id]);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-zinc-500">Order not found.</p>
        <Link href="/track-order" className="mt-4 inline-block text-gold hover:underline">
          Track another order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold">Order Received!</h1>
        <p className="mt-2 text-zinc-500">
          We will verify your MoMo payment and update you on WhatsApp.
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-zinc-500">Order ID</p>
            <p className="text-xl font-bold">{order.id}</p>
          </div>
          <span className="h-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-sm text-zinc-500">
          {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
        </p>

        <div className="border-t border-zinc-100 pt-4">
          <p className="text-sm font-medium">Customer</p>
          <p className="text-sm text-zinc-600">
            {order.customer.name} · {order.customer.phone}
          </p>
          <p className="text-sm text-zinc-600">
            {order.customer.address}, {order.customer.city}, {order.customer.region}
          </p>
        </div>

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

        <div className="border-t border-zinc-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span>{formatGHS(order.subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-zinc-500">Delivery</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : formatGHS(order.deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between font-bold">
            <span>Total paid</span>
            <span>{formatGHS(order.total)}</span>
          </div>
          {order.payment.txId && (
            <p className="mt-2 text-xs text-zinc-500">TXID: {order.payment.txId}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={toWaLink(
            STORE.whatsapp,
            `Hi, I placed order ${order.id}. TXID: ${order.payment.txId || 'N/A'}. Please confirm.`
          )}
          target="_blank"
          rel="noreferrer"
          className="block rounded-full bg-[#25D366] py-3 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          Confirm on WhatsApp
        </a>
        <Link
          href="/shop"
          className="block rounded-full border border-zinc-200 py-3 text-center text-sm font-semibold hover:bg-zinc-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
