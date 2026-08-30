'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { STORE, REGIONS } from '@/lib/config';
import { getDeliveryQuote, DELIVERY } from '@/lib/delivery';
import { formatGHS, isGhanaPhone, generateOrderId, toWaLink } from '@/lib/utils';
import { addOrder, Order } from '@/store/orders';
import { toast } from 'sonner';
import { Copy, Check, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [region, setRegion] = useState('Greater Accra');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-zinc-500">Your cart is empty.</p>
        <a href="/shop" className="mt-4 inline-block text-gold hover:underline">
          Go to shop
        </a>
      </div>
    );
  }

  const quote = getDeliveryQuote(region, total);
  const deliveryFee = quote.fee;
  const grandTotal = total + deliveryFee;

  const copyMoMo = async () => {
    await navigator.clipboard.writeText(STORE.momoNumber);
    setCopied(true);
    toast.success('MoMo number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const placeOrder = () => {
    if (!name.trim() || !isGhanaPhone(phone) || !city.trim() || !address.trim()) {
      toast.error('Please fill all required fields with a valid Ghana phone (0XXXXXXXXX)');
      return;
    }
    if (!txId.trim() || txId.trim().length < 6) {
      toast.error('Enter a valid MoMo Transaction ID');
      return;
    }

    setSubmitting(true);
    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
        variantName: i.variantName,
      })),
      subtotal: total,
      deliveryFee,
      total: grandTotal,
      customer: {
        name: name.trim(),
        phone: phone.replace(/\s/g, ''),
        email: email.trim() || undefined,
        region,
        city: city.trim(),
        address: address.trim(),
      },
      payment: {
        method: 'momo',
        momoName: STORE.momoName,
        momoNumber: STORE.momoNumber,
        txId: txId.trim(),
      },
      timeline: [
        { at: new Date().toISOString(), status: 'pending_payment', note: `TXID: ${txId.trim()}` },
      ],
      userId: user?.id,
    };

    addOrder(order);
    clear();
    toast.success('Order placed! We will verify your payment shortly.');
    router.push(`/order-success/${orderId}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="mb-8 flex gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => s < step && setStep(s)}
            className={`flex-1 rounded-full py-2 text-center font-medium ${
              step === s
                ? 'bg-zinc-900 text-white'
                : step > s
                  ? 'bg-gold/20 text-zinc-800'
                  : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            {s === 1 ? 'Details' : s === 2 ? 'Delivery' : 'Payment'}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Customer details</h2>
          <input
            placeholder="Full name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            placeholder="Phone (0XXXXXXXXX) *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            placeholder="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            onClick={() => {
              if (!name.trim() || !isGhanaPhone(phone)) {
                toast.error('Enter name and valid Ghana phone');
                return;
              }
              setStep(2);
            }}
            className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Delivery address</h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">Region *</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder="City / Town *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <textarea
            placeholder="Street address / landmark *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />

          {/* Live delivery quote — Jumia-style */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-zinc-900">Delivery fee for {region}</p>
                {quote.free ? (
                  <p className="mt-1 text-green-700">
                    FREE delivery (orders ≥ {formatGHS(quote.freeThreshold)})
                  </p>
                ) : (
                  <p className="mt-1 text-zinc-700">
                    <span className="text-lg font-bold text-zinc-900">{formatGHS(quote.fee)}</span>
                    <span className="text-zinc-500"> · {quote.label}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-zinc-500">Estimated: {quote.eta}</p>
                {!quote.free && total < quote.freeThreshold && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Add {formatGHS(quote.freeThreshold - total)} more for free delivery nationwide.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-xs text-zinc-500">
            <p className="font-medium text-zinc-700">How fees work</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Greater Accra — {formatGHS(DELIVERY.accra.fee)}</li>
              <li>Nearby (Eastern, Central, Volta…) — {formatGHS(DELIVERY.near.fee)}</li>
              <li>Mid (Ashanti, Western, Bono…) — {formatGHS(DELIVERY.mid.fee)}</li>
              <li>Far (Northern, Upper regions…) — {formatGHS(DELIVERY.far.fee)}</li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (!city.trim() || !address.trim()) {
                toast.error('Enter city and address');
                return;
              }
              setStep(3);
            }}
            className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Pay with MTN MoMo</h2>
          <div className="rounded-xl bg-zinc-50 p-4 text-sm">
            <p className="text-zinc-500">Send exactly</p>
            <p className="text-2xl font-bold text-zinc-900">{formatGHS(grandTotal)}</p>
            <p className="mt-3 text-zinc-500">To</p>
            <p className="font-semibold">{STORE.momoName}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold tracking-wide">{STORE.momoNumber}</span>
              <button onClick={copyMoMo} className="rounded-lg p-1.5 hover:bg-zinc-200" aria-label="Copy">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              After sending, paste the Transaction ID (TXID) below. We verify manually and confirm via
              WhatsApp.
            </p>
          </div>

          <input
            placeholder="MoMo Transaction ID *"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />

          <div className="rounded-xl border border-zinc-100 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span>{formatGHS(total)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-zinc-500">Delivery ({region})</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatGHS(deliveryFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-zinc-100 pt-2 font-bold">
              <span>Total</span>
              <span>{formatGHS(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={submitting}
            className="w-full rounded-full bg-orange py-3 text-sm font-bold text-white hover:bg-orange/90 disabled:opacity-60"
          >
            {submitting ? 'Placing order...' : 'I have paid — Place Order'}
          </button>

          <a
            href={toWaLink(
              STORE.whatsapp,
              `Hi, I just paid ${formatGHS(grandTotal)} for my order. TXID: ${txId || '...'}`
            )}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-sm text-zinc-500 hover:text-gold"
          >
            Need help? Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
