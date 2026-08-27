'use client';

import { AuthProvider } from '@/store/auth';
import { CartProvider } from '@/store/cart';
import { ProductsProvider } from '@/store/products';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
