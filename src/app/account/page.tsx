'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { getOrdersByUser, Order } from '@/store/orders';
import { formatGHS } from '@/lib/utils';
import { format } from 'date-fns';

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (user) setOrders(getOrdersByUser(user.id));
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center text-zinc-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-zinc-500">{user.name} · {user.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Logout
        </button>
      </div>

      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="mb-6 block rounded-xl bg-purple/10 px-4 py-3 text-sm font-medium text-purple hover:bg-purple/20"
        >
          Go to Admin Dashboard →
        </Link>
      )}

      <h2 className="mb-4 text-xl font-semibold">My Orders</h2>
      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-zinc-500">
          No orders yet.{' '}
          <Link href="/shop" className="text-gold hover:underline">
            Start shopping
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order-success/${o.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 hover:border-gold"
            >
              <div>
                <p className="font-semibold">{o.id}</p>
                <p className="text-sm text-zinc-500">
                  {format(new Date(o.createdAt), 'dd MMM yyyy')} · {o.status.replace('_', ' ')}
                </p>
              </div>
              <p className="font-bold">{formatGHS(o.total)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
