# Wolf Flow LLC Storefront

Next.js 14+/15 App Router storefront for downloadable AI workflow PDFs.

## Features
- Homepage, catalog, collection, product, success, and about pages
- Stripe Checkout session flow (single-product checkout)
- Stripe webhook processing for completed/expired checkouts
- Supabase-backed products/orders/collections
- Private storage downloads with signed URLs (24h expiry)
- Resend transactional confirmation emails
- Idempotent seed script for products, files, and Stripe entities

## Environment Variables
Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run migrations in Supabase using `supabase/migrations/001_init.sql`.
3. Create private storage bucket: `product-files`.
4. Place catalog JSON at `data/products.json` and PDFs in `data/pdfs/`.
5. Seed catalog:
   ```bash
   pnpm seed
   ```
6. Start dev server:
   ```bash
   pnpm dev
   ```

## Stripe Webhook
- Endpoint: `/api/webhooks/stripe`
- Events: `checkout.session.completed`, `checkout.session.expired`
- Configure in Stripe dashboard to point to `${NEXT_PUBLIC_SITE_URL}/api/webhooks/stripe`

## Deployment (Vercel)
1. Push repo and import to Vercel.
2. Add environment variables.
3. Set Stripe webhook endpoint to deployed URL.
4. Use Supabase project in `us-east-1` for lower latency.

## Notes
- Stripe Tax is enabled via `automatic_tax` in checkout session creation.
- Success page reads order by Stripe `session_id`.
- Download endpoint enforces expiry and max download count.
