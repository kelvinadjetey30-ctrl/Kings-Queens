'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { getAllOrders, updateOrderStatus, Order, OrderStatus } from '@/store/orders';
import { formatGHS, toWaLink } from '@/lib/utils';
import { STORE } from '@/lib/config';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const STATUSES: OrderStatus[] = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const { isAdmin, loading, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const refresh = () => setOrders(getAllOrders());

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/login');
    if (isAdmin) refresh();
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return <div className="p-8 text-center text-zinc-500">Loading...</div>;
  }

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const setStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    refresh();
    toast.success(`Order ${id} → ${status}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === s ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">No orders in this filter.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{o.id}</p>
                  <p className="text-sm text-zinc-500">
                    {format(new Date(o.createdAt), 'dd MMM yyyy HH:mm')} · {o.customer.name} ·{' '}
                    {o.customer.phone}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {o.customer.address}, {o.customer.city}, {o.customer.region}
                  </p>
                  {o.payment.txId && (
                    <p className="mt-1 text-xs font-mono text-zinc-600">TXID: {o.payment.txId}</p>
                  )}
                </div>
                <p className="text-lg font-bold">{formatGHS(o.total)}</p>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-600">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.qty}× {i.name} {i.variantName ? `(${i.variantName})` : ''}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm capitalize outline-none focus:border-gold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <a
                  href={toWaLink(
                    o.customer.phone,
                    `Hi ${o.customer.name}, update on your order ${o.id} from ${STORE.name}: status is now ${o.status.replace(/_/g, ' ')}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  WhatsApp customer
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
