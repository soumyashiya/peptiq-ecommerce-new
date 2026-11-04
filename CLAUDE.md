# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint                 # next lint
npx tsc --noEmit             # typecheck (the build also type-checks)
```

There is no test suite — no test runner is installed and no test files exist.

## Known build-breaking condition (read before running `npm run build`)

`npx tsc --noEmit` is clean. **`npm run build` still fails locally** on one deliberate issue:

**`app/api/send-order-confirmation/route.ts`** imports `../../../../../shared-email/order-email.js` — a path that only resolves on the VPS, where the project root is `/var/www/peptiq/app/` (five levels up reaches `/var/www/shared-email/`). The file's own comment states that breaking local builds is intentional. Do not "correct" the depth without confirming the deployment layout.

Use `npx tsc --noEmit` plus `npm run dev` for verification instead. **Typecheck alone is not enough** — see the RSC note under Formatters below for a class of bug it cannot catch.

## Content model — edit `lib/content.ts`, not components

`lib/content.ts` (~950 lines) is the single source of truth for every string, price, image path, product, and policy. Components import named exports from it and render them; nothing is hard-coded in JSX. Changing copy or catalogue data means editing this file only.

Key exports: `brand`, `compliance`, `nav`, `hero`, `story`, `stats`, `sustainability`, `shop`, `products` (+ `getProduct(slug)`, `getProducts(slugs)`), `services`, `innovation`, `gallery`, `news`, `contact`, `resources`, `footer`, `policies` (+ `getPolicy(slug)`).

Commerce surfaces live in the same file: `ticker`, `assurances`, `lines` (category rail), `merch` (`bestsellers` / `newArrivals` — explicit editorial slug lists, so the homepage never silently reshuffles when a product is added), `supply` + `supplyPricing()` + `SUPPLY_DISCOUNT`, `process`, and `shopControls` (category tabs, sort modes, format filters).

Each `Product` carries `category` (`metabolic` | `recovery` | `aesthetic` | `longevity`), `format` (`single` | `blend`), `tagline`, `strength`, and optional `badge`. `rating`/`reviewCount` exist but are **deliberately unset** — product cards render stars only when they're populated, so the site never publishes an unverifiable average. Populate them from real review data.

`products.items` and `policies.items` drive `generateStaticParams()` for `/products/[slug]` and `/policies/[slug]`, plus `app/sitemap.ts` and the JSON-LD on `/shop`. Adding a product to the array is all that's needed to get a route, sitemap entry, and structured data — but the referenced images must exist under `public/images/products/<slug>/`.

**Product imagery.** Each product has two first-party assets: `card.jpg` (1000×1250, 4:5 — grid and rails) and `wide.jpg` (1500×1000, 3:2 — the PDP gallery). They are generated Peptiq-branded typographic cards, not photography, and were authored to replace watermarked third-party (ALLUVI Healthcare) product photos that previously shipped here — do not reintroduce those.

**Hero.** `public/images/hero1.jpg` (2752×1536, film-look grade) — set via `hero.image` in `lib/content.ts`, cropped by `object-[42%_center]` in `Hero.tsx` so the subjects stay right of the copy column. Hero type is **paper on the `.hero::after` scrim**; the image itself carries no opacity or filter. Earlier heroes are still on disk and unreferenced: `hero-new.jpg` (same shot, ungraded), `hero-model.jpg` (same shot, 1920×1080) and `hero-lavender.jpg` (a product-only still-life with no people, used when the copy was ink-on-light-wash).

⚠️ The hero shot depicts two people holding **ALLUVI Healthcare**-branded cartons and pens — both the third-party branding and the human/lifestyle framing sit against the research-use-only copy. It is the client's chosen image; flag it rather than swapping it back.

⚠️ **ALLUVI-branded product still appears in `public/images/independent-lab-test.webp`.** The old hero (`hero-new1.webp`) carried it too and was deleted once orphaned. Other `/public/images/*.webp` files have not been audited. This is a separate brand/legal exposure from the product shots and still needs replacing. The artwork's top band is intentionally empty because the UI overlays a badge (top-left) and wishlist button (top-right); branding and strength sit in the card's footer. When real photography arrives, drop it in at the same two paths and no code changes. Note `next.config.mjs` serves `/images/*` with `stale-while-revalidate` and these filenames are not content-hashed, so replacing bytes in place can serve a stale image for up to a day — prefer a new filename for a visual change you need immediately.

**`compliance`** holds research-use-only disclaimers rendered verbatim on product, cart, checkout, and order pages. Its doc comment is explicit: do not soften the wording. This is a research-peptide catalogue and the copy deliberately avoids any medical, therapeutic, or personal-use framing — keep new copy consistent with that.

## Architecture

**Next.js 14 App Router + React 18 + TypeScript (strict)**, Tailwind, and a GSAP/Lenis/Framer Motion motion stack. Path alias `@/*` → repo root.

### Provider stack (`app/layout.tsx`)

```
AuthProvider → AuthGate → CartProvider → WishlistProvider → SmoothScroll → ChromeShell → {children}
                                                          └→ CartDrawer
```

- **`AuthProvider`** (`components/auth/`) — JWT in `localStorage` under `peptiq-token`; on mount it re-verifies against `GET /api/auth/verify` and clears the token on failure. Exposes `useAuth()` with `{ user, hydrated, login, signup, logout }`. Always gate on `hydrated` before treating `user === null` as logged-out.
- **`AuthGate`** — route-level guard. Public routes are listed as `PUBLIC_EXACT` (exact match) and `PUBLIC_PREFIXES` (prefix match, for dynamic segments). Protected children stay **unmounted** while unauthenticated, so no protected markup is ever painted. New pages need an entry here or they become login-walled.
- **`CartProvider`** (`components/cart/`) — cart in `localStorage` under `peptiq-cart`, keyed by product `slug`; `add()` also opens the drawer. `useCart()` gives `{ items, count, subtotal, add, remove, setQty, clear, openCart, closeCart }`.
- **`WishlistProvider`** (`components/wishlist/`) — slugs only, in `localStorage` under `peptiq-wishlist`. Entries resolve against the live catalogue on render, so a changed price shows through and a removed slug drops out silently.
- **`SmoothScroll`** (`components/providers/`) — Lenis driven by GSAP's ticker so ScrollTrigger never drifts. It intercepts anchor clicks globally and calls `ScrollTrigger.refresh()` before scrolling, because pinned sections misreport offsets otherwise. Bails out entirely under `prefers-reduced-motion`.
- **`ChromeShell`** (`components/layout/`) — hides Header/Footer/skip-link on `BARE_ROUTES` (`/login`, `/register`, `/forgot-password`).

### Backend: external microservice, not Next.js routes

The site talks to a **Central Order Management microservice** at `API_BASE` in `lib/api.ts` (`https://www.microservices.tech`; a commented-out `http://localhost:5003` is the local alternative). Full endpoint contracts live in `API_DOCUMENTATION (3).md`; the OCR payment-screenshot verifier is separately documented in `payment.md`.

`apiFetch<T>(path, init)` is the only client. It prefixes `API_BASE` for relative paths, attaches the bearer token unless `auth: false`, serializes `init.json`, passes `init.form` (FormData) through untouched so the browser sets the multipart boundary, and normalizes failures into `ApiError { message, status, body }` — the message is pulled from the response's `error` or `message` field. Callers should catch as `ApiError` and read `.message`/`.status`.

Endpoints in use: `/api/auth/{register,login,verify,forgot-password}`, `/api/promos/validate`, `/api/user-orders` (+ `/:orderNumber`), `/api/klyme/verify-payment/:uuid`, `/api/aabanpay/verify-payment/:sessionId`, and a newsletter subscribe.

The **only** local API route is `app/api/send-order-confirmation/route.ts`, which proxies to the shared-email package described above.

### Checkout flow

`app/checkout/page.tsx` posts `payment_method: 'manual'` to `POST /api/user-orders` with `auth: false` (guest checkout is supported). It then fires the confirmation email **from the server's echoed response fields, not the form inputs**, so the email reflects what was persisted; that call is best-effort and its failure must never surface as a checkout error. Promo codes apply client-side as a percentage after `POST /api/promos/validate`. Hosted-gateway returns land on `app/checkout/{klyme,aabanpay}-callback/`, which verify server-side before showing a result.

### Styling and motion conventions

- Design tokens are in `tailwind.config.ts`: colors (`ink`, `paper`, `mist`, `line`, `brand{,-sky,-teal,-soft,-lime}`, `muted`), a fluid `clamp()` type scale (`text-display`/`h1`/`h2`/`h3`/`lead`/`body`/`label`/`nav`/`btn`/`price`/`micro`), `max-w-{frame,content,prose}`, `spacing.section{,-sm}`, `rounded-{card,panel}`, and the `ease-smooth`/`ease-expo` curves. Use these rather than arbitrary values.
- **Lavender (`brand.wash`, `#D2BFFC`, read off hermujo.com) is the page background**, set once on `body` in `globals.css`. Sections are transparent and inherit it; the exception is `BAND` in `Process.tsx` plus the top of `News.tsx`, which share a pale lavender (`#F1EBFC`) hand-over and must be changed together. White (`paper`) and frosted white (`.glass`, white border) are for things that sit *on top*.
- `brand.wash` and `brand.soft` currently share `#D2BFFC`. Support text on the page is `text-muted` (`#444444`, 5.3:1) or `ink` at reduced opacity.
- The page colour is also hard-coded in the fades in `Story.tsx`, `BAND` in `Process.tsx` and the gradient in `News.tsx` — change those with it or they end on a hard seam.
- **Palette is black / lime / white on lavender**, measured from hermujo.com. Token *names* are historical and describe roles, not hues. **`brand.lime` (`#EFF860`) is a surface colour only** — always pair it with `text-ink`. `brand` is black because it must work both as a background with white text and as text on white and on the page.
- **Typography is measured, not invented.** The whole scale in `tailwind.config.ts` was read off the reference site's (hermujo.com) computed styles at 390 / 929 / 1440px and the clamps interpolate between the measured mobile and desktop endpoints. The table in that file's `fontSize` comment is the record — update it if you retune, don't silently drift from it.
- Two faces, both via `next/font`: **Quicksand** (`--font-sans` → `font-sans`) is the face for *all* content — it is also the reference's actual UI face, verified, not approximated. **Baloo 2** (`--font-display` → `font-display`, weight 800) stands in for the reference's headline face **Indarung**, a licensed single-weight caps-only woff2 that cannot be used here. Note `font-display` (family) and `text-display` (size) are separate Tailwind namespaces that happen to share a word.
- **Headings go through `.t-display` / `.t-h1` / `.t-h2` / `.t-h3`** (`globals.css`), never through a raw size class. Each bundles family + size + weight + leading + tracking, so a heading can't be half-styled, and the scale retunes from one place. Like the reference, the display face now covers section headings (`h2`) too; `.t-h3` is the first level back in Quicksand. Don't add `font-*`, `leading-*` or `tracking-*` beside one of these — the class already owns them.
- **Nothing is set below weight 400.** Quicksand 300 is no longer loaded at all. The reference's hierarchy runs 400 (body) → 500 (lead) → 600 (nav, links, buttons) → 700 (badges, prices) → 800 (headings), and thin type at small sizes was the single biggest thing separating this site's feel from it. `font-light` will silently fall back.
- `tracking-tight` is overridden to **-0.01em** (Tailwind's stock value is -0.025em, roughly twice as tight as the reference's headlines). It is overridden in the theme precisely so the ~50 call sites don't have to change — retune it there.
- Shared UI kit in `globals.css`, used across the marketing sections — prefer these over re-deriving classes inline:
  - `.btn-primary` / `.btn-secondary` — pill buttons
  - `.pill-eyebrow` — rounded label above a heading (icon + text)
  - `.card-soft` — translucent rounded card; designed to sit on `bg-brand-soft`
  - `.icon-chip` — lime rounded-square icon holder inside cards
  - `.step-numeral` — oversized ghosted ordinal
  - `.product-grid` — the one place card density is set (1 / 2 / 3 / 4 up, four from `xl`). Every static grid of `ProductCard`s uses it, so retuning card size is one edit rather than five. Its breakpoints are mirrored by `GRID_SIZES`, `ProductCard`'s default `sizes`, so a grid call site should not pass `sizes` at all.
- **Changing `tailwind.config.ts` requires a dev-server restart.** Adding a theme key (a font family, a colour) does not regenerate utilities on HMR — the class lands in the HTML, no CSS rule is emitted, and the style silently falls back with no error anywhere. If a new utility "does nothing", restart before debugging.
- `app/globals.css` defines the reusable component classes: `.frame` (page gutters), `.container-content`, `.section-tag` (the numbered `[0X]` rule), `.link-underline`, `.media` (cover image + hover zoom), plus `.gpu` and `.text-balance`.
- Reduced motion is honoured globally in `globals.css` and again per-component — keep new animation degradable.
- Shared UI primitives live in `components/ui/`: `Reveal`, `RevealMask`, `Parallax`, `Counter`, `RotatingWord`, `SectionTag`.
- **`useModal(isOpen, onClose)`** (`components/ui/useModal.ts`) is the required hook for any overlay — Escape handling, focus trap, focus restore, and scrollbar-compensated scroll lock. Attach its ref to the panel, not the scrim. Used by the cart drawer, mobile menu, checkout dialog, and `JanoshikModal`.

### Page composition

`app/page.tsx` is a flat composition of `components/sections/*` — the homepage is section-ordering only, with all content from `lib/content.ts`. Ordering is commerce-forward: Hero → Assurances → LineRail → Bestsellers → SupplyProgramme → Story → Stats → NewArrivals → Process → Sustainability → Services → Innovation → Gallery → News → Contact.

The old static `Products` section was replaced by the LineRail / Bestsellers / NewArrivals trio. **Bestsellers carries the `#products` anchor** the nav points at — don't remove that id. `components/sections/Products.tsx` still exists but is no longer mounted.

`ProductCard` (`components/products/`) is the single card used by every rail, the shop grid and the wishlist, so card behaviour changes land everywhere at once. `Rail` (`components/ui/`) is a real scroll-snap container rather than a transform carousel, so touch/trackpad/keyboard scrolling work for free and the arrows only nudge `scrollLeft`.

**Card size is one number, in two places.** Static grids get it from `.product-grid`; the scroll rails (`LineRail`, the expanded `Bestsellers`, `News`, `ReviewReel`) set a `vw` width per item because they are not grids. Both are tuned to land a card at roughly the same ~350px on a wide screen, so a card is the same object whichever surface you meet it on — change one and change the other. A rail's `sizes` has to be edited alongside its width or Next serves the wrong candidate.

Product detail pages are server components that render a client `JanoshikModal` surfacing the batch's third-party lab report, auto-opening once per product per session (tracked in `sessionStorage` under `janoshik_lab_popup_<slug>`).

### Shop filtering

`ShopGrid` keeps its state in the URL (`?category=`, `?sort=`, `?format=`) rather than in component state, so homepage category tiles and footer links can deep-link into a filtered view and any view is shareable. It uses `router.replace` (filtering isn't a navigation step) and therefore needs the `<Suspense>` boundary it's wrapped in on `app/shop/page.tsx` — `useSearchParams` would otherwise break static rendering.

### Formatters and the RSC boundary

`formatPrice` lives in **`lib/format.ts`**, a plain module with no `'use client'`. This matters: a plain function exported from a client module becomes a *client reference* when a server component imports it, and calling it throws at render time while `tsc` stays perfectly happy. Keep shared helpers out of `'use client'` modules, and verify with `npm run dev`, not just typecheck.

### `next.config.mjs`

Sets security headers (HSTS, nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy) on every response, AVIF/WebP with a trimmed `deviceSizes` matrix, and `optimizePackageImports` for `framer-motion`/`gsap`. `/images/*` gets `max-age=86400, stale-while-revalidate=604800` rather than `immutable`, because those filenames are not content-hashed and would otherwise pin a stale image for a year after replacement. Remote images are restricted to `images.unsplash.com` — add new hosts to `images.remotePatterns`.

## Repo hygiene note

The repo root holds ~100 stray `.jpeg` screenshots from earlier design iterations (`gallery-*.jpeg`, `story-*.jpeg`, `m-*.jpeg`, etc.) and duplicated `- Copy` variants. They are tracked but unused by the app. Don't mistake them for assets; site images live in `public/images/`.
