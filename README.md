# GiftBox — Ecommerce Gifting Platform

A production-oriented Next.js 14 (App Router) storefront for a gifting business:
product catalog, cart, wishlist, checkout with Razorpay, JWT auth, an order
history dashboard, and a lightweight admin panel — on MongoDB via Mongoose.

The storefront's browsing pages (home, listing, product detail, occasions,
blog) render from `src/data/products.ts` / `src/data/blog.ts` so the UI works
immediately with no database configured. The API routes under `src/app/api`
are the real, MongoDB-backed implementation — point client fetches at them
once you've seeded the database (see "Seeding the database" below).

## Stack

- **Framework:** Next.js 14, App Router, TypeScript
- **Styling:** Tailwind CSS, Framer Motion for the hero and page transitions
- **State:** Zustand (`cartStore`, `wishlistStore`, persisted to localStorage) + React Context for auth
- **Backend:** Next.js API routes (Node runtime) + Mongoose / MongoDB
- **Auth:** JWT in an httpOnly cookie, bcrypt-hashed passwords
- **Payments:** Razorpay Orders API + client-side Checkout.js + signature verification
- **Fonts:** Fraunces (display) + Manrope (body) via `next/font/google`

## Folder structure

```
giftbox/
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── sitemap.ts, robots.ts
│   │   ├── products/                 # listing (filters, sort, pagination) + [slug] detail
│   │   ├── occasions/[slug]/         # occasion-based landing pages
│   │   ├── cart/, wishlist/
│   │   ├── checkout/                 # address form + Razorpay Checkout.js
│   │   ├── order/success/, order/failure/
│   │   ├── login/, signup/
│   │   ├── dashboard/                # profile + order history (protected)
│   │   ├── admin/                    # product management (protected, admin-only)
│   │   ├── blog/                     # SEO content, [slug] posts
│   │   └── api/
│   │       ├── auth/{register,login,logout,me}
│   │       ├── products/, products/[slug]/
│   │       ├── orders/, orders/[id]/
│   │       ├── razorpay/{create-order,verify}
│   │       ├── reviews/
│   │       ├── wishlist/
│   │       └── admin/products/
│   ├── components/
│   │   ├── layout/    (Header, Footer)
│   │   ├── home/      (Hero, ProductRail, Occasions, Testimonials, Newsletter)
│   │   ├── product/   (ProductCard, ProductGallery, ProductFilters, AddToCartPanel)
│   │   ├── auth/      (AuthForm)
│   │   └── ui/        (Button, Skeleton, Stars)
│   ├── context/       (cartStore.ts, wishlistStore.ts — Zustand; AuthContext.tsx)
│   ├── lib/           (db.ts, auth.ts, razorpay.ts, utils.ts)
│   ├── models/        (User, Product, Order, Review — Mongoose schemas)
│   ├── data/          (products.ts, blog.ts — demo content)
│   └── middleware.ts  (protects /dashboard and /admin)
├── scripts/seed.js    (seeds MongoDB from scripts/seed-data.json)
├── .env.example
└── tailwind.config.ts
```

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

The app runs at `http://localhost:3000` and is fully browsable without a
database — cart, wishlist, and the product/occasion pages work from the
static catalog. Auth, checkout, orders, reviews, and the admin panel need
MongoDB configured.

### Environment variables (`.env.local`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (or self-hosted) connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | From the Razorpay dashboard (test or live) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key ID, exposed to the client for Checkout.js |
| `NEXT_PUBLIC_SITE_URL` | Used for metadata, OG tags, and sitemap URLs |
| `NEXT_PUBLIC_SITE_NAME` | Shown in the Razorpay checkout modal and page titles |

### Seeding the database

```bash
npm run seed
```

This clears and repopulates the `products` collection from
`scripts/seed-data.json` (two sample products — extend the JSON with the
rest of `src/data/products.ts` to fully match the demo catalog). Create your
first admin user by registering normally through `/signup`, then flipping
that user's `role` field to `"admin"` directly in MongoDB.

## Razorpay integration — how it works

1. **Checkout page** (`/checkout`) collects the delivery address and calls
   `POST /api/razorpay/create-order` with the cart contents and computed totals.
2. That route creates a Razorpay Order (`razorpay.orders.create`) **and** a
   `status: "created"` record in our own `orders` collection, so every
   payment attempt is tied to a real order document from the start.
3. The client opens Razorpay's Checkout.js modal with the returned
   `razorpay_order_id`.
4. On success, Checkout.js calls the `handler` callback with
   `razorpay_payment_id` and `razorpay_signature`, which the client posts to
   `POST /api/razorpay/verify`.
5. That route recomputes the HMAC-SHA256 signature server-side
   (`order_id|payment_id` signed with `RAZORPAY_KEY_SECRET`) and only marks
   the order `"paid"` if it matches — this is the step that actually
   confirms the payment; never trust the client-side callback alone.
6. On failure (`payment.failed` event, or a signature mismatch), the order
   is marked `"failed"` and the user is routed to `/order/failure`.

Go live by swapping the `rzp_test_...` keys for `rzp_live_...` keys in
`.env.local` / your hosting provider's environment settings — no code
changes needed.

## Deployment

**Frontend + API routes (Vercel):**
1. Push this repo to GitHub.
2. Import it in Vercel, set the environment variables above in the project
   settings, and deploy. API routes ship as serverless functions alongside
   the frontend — no separate backend is required for this setup.

**Optional standalone backend (Render / Node server):**
If you'd rather run the API separately (e.g. to share it with a mobile app),
the code in `src/app/api` is plain Node/Mongoose logic that ports directly
into an Express app — move each `route.ts` handler into a matching Express
route, keep `src/lib` and `src/models` as-is, and point `NEXT_PUBLIC_*`
variables at that server's URL.

**Database:** MongoDB Atlas (free tier is enough to start) — whitelist
Vercel's/Render's outbound IPs or allow `0.0.0.0/0` for serverless
deployments where IPs aren't static.

## Notable implementation choices

- **Cart & wishlist are client-persisted** (Zustand + localStorage) rather
  than server-side, so guests can shop without an account; they sync to
  MongoDB only at checkout (cart) or via `/api/wishlist` once signed in.
- **Auth is a JWT in an httpOnly cookie**, checked both in `middleware.ts`
  (redirects unauthenticated visits to `/dashboard` and `/admin`) and in
  each protected API route (`getAuthUser`), so a page can't be reached
  without a valid session even if middleware is bypassed.
- **Two JWT verifiers, on purpose:** `middleware.ts` runs on the Edge
  runtime, which can't use the Node crypto APIs `jsonwebtoken` needs — it
  verifies tokens with `lib/edge-auth.ts` (built on `jose`, WebCrypto-based)
  instead. API routes run on the Node runtime and keep using
  `jsonwebtoken` via `lib/auth.ts`, since they also need `jwt.sign()`.
  Both read the same `JWT_SECRET`.
- **GST and shipping are computed in one place** (`computeOrderTotals` in
  `src/lib/utils.ts`) and reused by the cart page, checkout page, and the
  create-order API route, so the number the customer is shown always
  matches the amount actually charged.

## What's intentionally left as a starting point, not finished

- Product search is a simple substring filter on the mock data; the
  `/api/products` route already supports MongoDB `$text` search once
  products are seeded with a text index (already defined on the schema).
- The admin panel covers product CRUD; order status updates (e.g. marking
  `shipped`/`delivered`) would be a small addition to
  `src/app/api/admin/products` (add an `/api/admin/orders` route following
  the same pattern).
- Image uploads aren't wired up — the admin form takes image URLs directly.
  Swap in Cloudinary or S3 by uploading client-side and passing the
  resulting URL into the same field.
