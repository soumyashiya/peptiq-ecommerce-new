'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  type Product,
  type ProductCategory,
  supply,
  supplyPricing,
  shopControls,
} from '@/lib/content';
import { useCart } from '@/components/cart/CartProvider';
import { formatPrice } from '@/lib/format';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

/**
 * The single product card used by every rail, the shop grid and the wishlist,
 * so a change to card behaviour lands everywhere at once.
 *
 * ── The treatment ──────────────────────────────────────────────────────────
 * A warm editorial card: cream surface, tall square-cornered image, a
 * letterspaced serif name paired with a bronze price, then hairline meta. All
 * of its colours and the serif are scoped to `.product-card` in globals.css
 * and are not site tokens — see the note there.
 *
 * Reading order, which is also the buying order:
 *   image  →  name + price  →  what it is  →  strength  →  saving  →  add
 *
 * ── Two deliberate departures from the reference comp ──────────────────────
 * 1. STARS. The comp shows five filled stars. `Product.rating` is unset across
 *    the whole catalogue on purpose (see its doc comment) — publishing an
 *    unverifiable average is exactly what this brand must not do. The stars
 *    render only when real review data exists, so today that row shows the
 *    strength chip alone. Populate `rating`/`reviewCount` and they appear.
 *
 * 2. ADD TO BAG. The comp has no add control; it ends on the savings box.
 *    Dropping quick-add would take the action off every rail and the shop
 *    grid, so the savings line stays as the outlined box and the add button
 *    sits below it in the same geometry. It is a real button, not a hover
 *    reveal, so touch and keyboard reach it without a pointer.
 */

/** Category copy, taken from the shop's own filter labels so the two never drift. */
const CATEGORY_LABEL = Object.fromEntries(
  shopControls.categories.map((c) => [c.value, c.label]),
) as Record<ProductCategory, string>;

/**
 * Default `sizes`, matching `.product-grid`'s track count at each breakpoint
 * (1 / 2 / 3 / 4 up). Grid call sites can leave `sizes` off entirely; only the
 * scroll rails, whose cards are a fixed `vw` wide, need to pass their own.
 */
const GRID_SIZES = '(min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw';

export function ProductCard({
  product,
  priority = false,
  sizes = GRID_SIZES,
  variant = 'default',
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  /**
   * `minimal` — a pared-back, centred card: softly rounded photo with a wishlist
   * toggle and a hover-reveal "Add to cart" pill, then bold uppercase name and
   * price. Currently used by the Bestsellers rail only.
   */
  variant?: 'default' | 'minimal';
}) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);

  const wished = has(product.slug);
  const { saving } = supplyPricing(product.price);
  const href = `/products/${product.slug}`;

  const quickAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (variant === 'minimal') {
    return (
      <article className="group flex h-full flex-col items-center text-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px]">
          <Link href={href} aria-label={product.name} className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
            />
          </Link>

          <button
            type="button"
            onClick={() => toggle(product.slug)}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={wished}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={wished ? 'text-brand' : ''}>
              <path d="M12 20.3 4.9 13.2a4.5 4.5 0 0 1 6.4-6.3l.7.7.7-.7a4.5 4.5 0 0 1 6.4 6.3Z" />
            </svg>
          </button>

          {/*
            Slides up over the photo on hover. Always visible on touch screens
            (no hover there) and whenever it has keyboard focus.
          */}
          <button
            type="button"
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+0.75rem)] rounded-md bg-ink py-3 text-micro font-semibold uppercase tracking-[0.12em] text-paper opacity-0 transition-all duration-500 ease-smooth hover:bg-ink/80 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
          >
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
        {/* Product title on the `h3` token (20→26px) — the brief's 20–28px
            product-title band. The price line under it stays on body, because
            on this compact card it is secondary meta, not the headline price. */}
        <h3 className="mt-4 text-h3 font-extrabold uppercase leading-tight tracking-[0.02em] text-ink">
          <Link href={href} className="transition-colors hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="figures mt-1.5 text-body text-muted">{formatPrice(product.price)} USD</p>
      </article>
    );
  }

  return (
    // No surface, no padding, no shadow — a drop-shadow needs a card edge to
    // fall from, so the hover affordance lives on the photograph instead.
    <article className="product-card group flex h-full flex-col">
      <div className="pc-media">
        <Link href={href} aria-label={product.name} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.04]"
          />
        </Link>

        {/* Paper, not the card surface — there is no card surface any more, and
            the badge sits on the photograph regardless. */}
        {product.badge && (
          <span
            className="pointer-events-none absolute left-3 top-3 rounded-[2px] bg-paper px-2.5 py-1 text-label font-medium uppercase tracking-[0.16em]"
            style={{ color: 'var(--pc-ink)' }}
          >
            {product.badge}
          </span>
        )}

        {/* Dark translucent disc rather than a white one: it holds against a
            photographic image at any exposure without needing a border. */}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={
            wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
          }
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-ink/70"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wished ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.3 4.9 13.2a4.5 4.5 0 0 1 6.4-6.3l.7.7.7-.7a4.5 4.5 0 0 1 6.4 6.3Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        {/* Name and price share a baseline — the two things being compared
            across a row of cards. */}
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="pc-name min-w-0">
            <Link href={href} className="transition-opacity duration-300 hover:opacity-65">
              {product.name}
            </Link>
          </h3>
          <span className="pc-price shrink-0">{formatPrice(product.price)}</span>
        </div>

        <p className="pc-meta mt-1.5">
          {CATEGORY_LABEL[product.category]} · {product.tagline}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="pc-chip">{product.strength}</span>

          {/* Rendered only when real review data exists — see Product.rating. */}
          {typeof product.rating === 'number' && (
            <span
              className="flex items-center gap-0.5"
              aria-label={`${product.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  aria-hidden
                  style={{
                    fill: i < Math.round(product.rating as number) ? 'var(--pc-accent)' : 'var(--pc-rule)',
                  }}
                >
                  <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
                </svg>
              ))}
            </span>
          )}
        </div>

        {/* `mt-auto` pins the action block to the foot so cards of unequal copy
            length still align along the same baseline. */}
        <div className="mt-auto space-y-1.5 pt-3.5">
          <p className="pc-box" style={{ color: 'var(--pc-muted)' }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M10 3h4M11 3v6.2L5.8 18A2 2 0 0 0 7.5 21h9a2 2 0 0 0 1.7-3L13 9.2V3" />
            </svg>
            Save {formatPrice(saving)} with {supply.shortName}
          </p>

          <button
            type="button"
            onClick={quickAdd}
            className="pc-box"
            style={
              added
                ? { background: 'var(--pc-accent)', borderColor: 'var(--pc-accent)', color: '#fff' }
                : { background: 'var(--pc-ink)', borderColor: 'var(--pc-ink)', color: '#fff' }
            }
          >
            {added ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 13 4 4 10-10" />
                </svg>
                Added
              </>
            ) : (
              <>
                <span className="sr-only">Add {product.name} to bag</span>
                <span aria-hidden>Add to bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
