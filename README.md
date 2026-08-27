# THE KINGS AND QUEENS

Ghana No.1 Premium Drip Store — **Drip For Kings and Queens**

Next.js 14 App Router · TypeScript · Tailwind · localStorage cart/orders · MTN MoMo manual checkout · Admin panel

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Product catalog (chains, watches, bracelets, clothes, slippers)
- Cart + quantity / variants
- 3-step checkout with MTN MoMo (copy number + paste TXID)
- Order success page + track by order ID
- Customer signup/login (localStorage)
- Admin dashboard: view/update order status, products list
- WhatsApp float + support links
- Free delivery threshold, Accra vs outside fees

## Admin login

- **Email:** `admin@thekingsandqueens.com`
- **Password:** `Admin@2024`

## Config

Copy `.env.example` → `.env.local` and set your real values:

```
NEXT_PUBLIC_MOMO_NAME=The Kings and Queens Enterprise
NEXT_PUBLIC_MOMO_NUMBER=055XXXXXXX
NEXT_PUBLIC_WHATSAPP=055XXXXXXX
NEXT_PUBLIC_ADMIN_EMAIL=admin@thekingsandqueens.com
NEXT_PUBLIC_ADMIN_PASSWORD=Admin@2024
```

Defaults work for local demo if you skip this.

## Deploy (Vercel)

1. Import this repo on [vercel.com](https://vercel.com)
2. Add the env vars above
3. Deploy — domain can be linked to `thekingsandqueens.online`

## Notes

- Orders & accounts are stored in the browser (`localStorage`) for this demo.
- Admin can mark orders paid / shipped from `/admin/orders`.
- To go production with a real database, connect Supabase later (schema ready to extend).
