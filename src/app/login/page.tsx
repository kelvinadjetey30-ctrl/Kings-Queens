'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace(user.role === 'admin' ? '/admin' : next.startsWith('/') ? next : '/');
    return null;
  }

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success('Welcome back!');
      // Role comes from auth store after login — check via re-read would be async; use email only for redirect hint
      const e = email.trim().toLowerCase();
      const dest =
        e === 'admin@thekingsandqueens.com'
          ? '/admin'
          : next.startsWith('/')
            ? next
            : '/';
      router.push(dest);
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-center text-3xl font-bold">Welcome</h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Sign in to shop THE KINGS AND QUEENS
      </p>
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
