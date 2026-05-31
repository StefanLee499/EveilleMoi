# EveilleMoi

A soft, holistic-wellness website for a brand built around **massage**, **astrology**, and a **monthly ritual box**. Built as a polished, production-quality demo — modern stack, custom illustrations, real animations, working booking + cart flows.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with a custom palette (sage, terracotta, cream)
- **Framer Motion** for scroll reveals, page transitions, and interactive UI
- **Zustand** (with localStorage persistence) for the shopping cart
- **Lucide** icons + **custom SVG illustrations** (moon, leaf, hand, stars)
- **API routes** with file-based JSON storage (no DB or payment required)

## Features

- **6 pages** — Home, About, Services, Shop, Journal (blog + dynamic article pages), Contact
- **Multi-step booking flow** (service → date/time → details) with validation, saved to `/.data/bookings.json`
- **Shopping cart drawer** — add monthly box products, adjust quantities, "reserve" (no payment), saved to `/.data/orders.json`
- **Contact form** + **newsletter signup** — saved to `/.data/contacts.json`
- **Blog** with filterable categories and individual article pages
- **Authentication**: customer + admin roles, signed-cookie sessions, scrypt-hashed passwords
- **Customer account page** — edit name / phone / birth date / preferences, change password
- **Admin panel** at `/admin` — create / edit / delete journal articles, update service & shop prices
- **Custom SVG illustrations** with subtle animations (floating moon, swaying leaf, breathing hand)
- **Sticky responsive nav** with user menu, login state, and live cart count
- **Fully responsive**, semantic, accessible

## Default admin account

On first run a default admin user is seeded:

```
email:    admin@eveillemoi.local
password: admin1234
```

**Change this immediately in production** — either delete `/.data/users.json` after creating a real admin via the database, or update the seed in `lib/store.ts`. Set `AUTH_SECRET` env var to a long random string in production.

## Design Direction

Light cream background with darker sage & terracotta accents (per the brief). Elegant serif display (Cormorant Garamond) paired with a calm sans (Inter). Generous whitespace, soft shadows, a faint paper grain — a quiet, feminine, "slow" aesthetic.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

Build for production:
```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx              # root layout + nav + footer + cart drawer
  page.tsx                # Home
  about/page.tsx
  services/page.tsx
  shop/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx    # dynamic article
  contact/page.tsx
  api/
    bookings/route.ts     # POST -> .data/bookings.json
    orders/route.ts       # POST -> .data/orders.json
    contact/route.ts      # POST -> .data/contacts.json (JSON or form)
  globals.css
components/
  Nav.tsx · Footer.tsx · Logo.tsx
  CartDrawer.tsx          # animated side drawer
  BookingForm.tsx         # 3-step animated wizard
  Illustrations.tsx       # custom animated SVGs
  Motion.tsx              # Reveal / Parallax / FadeWord helpers
lib/
  content.ts              # services, products, articles (typed)
  cart-store.ts           # Zustand cart (persisted)
  storage.ts              # tiny JSON file storage helper
```

## Where data is stored

Submitted bookings, orders, and contact messages are written to a local `.data/` directory at the project root (created on first write, git-ignored). Swap `lib/storage.ts` for a real DB (Postgres, SQLite, etc.) when ready.

## Notes & creative choices

- **No payment gateway** (per the brief). Cart checkout creates a "reservation" record and shows a thank-you state.
- **Booking** uses a 3-step wizard rather than a flat form — feels softer and more guided.
- **Illustrations** are inline SVG (no image dependencies) so the site is lightweight and the animations are crisp at any resolution.
- The palette **inverts the brief slightly** in two hero moments (dark sage background on the quote + footer) to give the design rhythm — light, dark, light — while keeping the global feel light and airy.
- **`/blog?c=Astrology`** filters the journal by category.
- The newsletter form in the footer posts to the same `/api/contact` route with `kind=newsletter`.

— Made with care.
