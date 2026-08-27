'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';

const PUBLIC = ['/login', '/signup'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'));

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
    if (user && isPublic) {
      router.replace(user.role === 'admin' ? '/admin' : '/');
    }
  }, [user, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        Loading...
      </div>
    );
  }

  if (!user && !isPublic) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}
