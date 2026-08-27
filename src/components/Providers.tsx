'use client';

import { AuthProvider } from '@/store/auth';
import { CartProvider } from '@/store/cart';
import { ProductsProvider } from '@/store/products';
import { AuthGate } from '@/components/AuthGate';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <AuthGate>{children}</AuthGate>
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
