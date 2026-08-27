'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { getAllOrders, Order } from '@/store/orders';
import { PRODUCTS } from '@/data/products';
import { formatGHS } from '@/lib/utils';
import { Package, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/login');
    if (isAdmin) setOrders(getAllOrders());
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return <div className="p-8 text-center text-zinc-500">Loading...</div>;
  }

  const pending = orders.filter((o) => o.status === 'pending_payment').length;
  const paid = orders.filter((o) => o.status === 'paid' || o.status === 'processing').length;
  const revenue = orders
    .filter((o) => !['cancelled', 'pending_payment'].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/orders"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/products"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            Products
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending payment" value={String(pending)} />
        <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Paid / Processing" value={String(paid)} />
        <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Total orders" value={String(orders.length)} />
        <StatCard icon={<Package className="h-5 w-5" />} label="Products" value={String(PRODUCTS.length)} />
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">Confirmed revenue (excl. pending)</p>
        <p className="text-3xl font-bold">{formatGHS(revenue)}</p>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="text-zinc-500">No orders yet.</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 8).map((o) => (
              <Link
                key={o.id}
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 hover:border-gold"
              >
                <div>
                  <p className="font-semibold">{o.id}</p>
                  <p className="text-sm text-zinc-500">
                    {o.customer.name} · {o.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <p className="font-bold">{formatGHS(o.total)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
