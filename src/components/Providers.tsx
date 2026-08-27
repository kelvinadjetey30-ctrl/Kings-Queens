'use client';

import { AuthProvider } from '@/store/auth';
import { CartProvider } from '@/store/cart';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </CartProvider>
    </AuthProvider>
  );
}
