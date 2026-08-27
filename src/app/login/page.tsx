'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace(user.role === 'admin' ? '/admin' : '/account');
    return null;
  }

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success('Welcome back!');
      router.push(email.toLowerCase().includes('admin') ? '/admin' : '/account');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>
      <form onSubmit={handle} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        No account?{' '}
        <Link href="/signup" className="font-medium text-gold hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-zinc-400">
        Admin demo: admin@thekingsandqueens.com / Admin@2024
      </p>
    </div>
  );
}
