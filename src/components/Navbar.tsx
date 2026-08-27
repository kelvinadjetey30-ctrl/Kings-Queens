'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X, Crown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { STORE } from '@/lib/config';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/track-order', label: 'Track Order' },
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Crown className="h-6 w-6 text-gold" />
          <span className="hidden sm:inline">{STORE.name}</span>
          <span className="sm:hidden">K&Q</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition hover:text-gold',
                pathname === l.href ? 'text-gold' : 'text-zinc-700'
              )}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-purple hover:underline">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="rounded-full p-2 hover:bg-zinc-100" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-zinc-100" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={user ? '/account' : '/login'}
            className="rounded-full p-2 hover:bg-zinc-100"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            className="rounded-full p-2 hover:bg-zinc-100 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-100 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-800"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-purple">
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
