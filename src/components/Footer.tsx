import Link from 'next/link';
import { STORE } from '@/lib/config';
import { DELIVERY } from '@/lib/delivery';
import { toWaLink } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold text-white">{STORE.name}</h3>
          <p className="text-sm text-zinc-400">{STORE.tagline}</p>
          <p className="mt-2 text-xs text-zinc-500">Ghana No.1 Premium Drip Store</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=chains" className="hover:text-gold">
                Chains / Necklaces
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=watches" className="hover:text-gold">
                Watches
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=clothes" className="hover:text-gold">
                Clothes
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=shoes" className="hover:text-gold">
                Shoes / Footwear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/track-order" className="hover:text-gold">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-gold">
                My Account
              </Link>
            </li>
            <li>
              <a
                href={toWaLink(STORE.whatsapp, 'Hello, I need help with my order')}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
          <p className="text-sm">WhatsApp: {STORE.whatsapp}</p>
          <p className="text-sm">Phone: {STORE.phone}</p>
          <p className="text-sm break-all">Email: {STORE.email}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Delivery from GHS {DELIVERY.accra.fee} · Free over GHS {DELIVERY.freeThreshold}
          </p>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
