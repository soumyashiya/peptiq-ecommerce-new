'use client';

import Link from 'next/link';
import { getProducts, compliance } from '@/lib/content';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { ProductCard } from '@/components/products/ProductCard';

/**
 * Saved products. The wishlist stores slugs only, so entries resolve against
 * the live catalogue on every render — a product whose price or image changed
 * shows the current values, and a removed slug drops out silently.
 */
export default function WishlistPage() {
  const { slugs, count, clear } = useWishlist();
  const items = getProducts(slugs);

  return (
    <main className="pt-28 md:pt-32">
      <div className="frame pb-section-sm md:pb-section">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-micro text-muted">
          <Link href="/" className="transition-colors hover:text-brand-teal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">Wishlist</span>
        </nav>

        <header className="mt-10 flex flex-wrap items-end justify-between gap-6 lg:mt-14">
          <div>
            <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
              SAVED
            </p>
            <h1 className="mt-4 t-h1">Your wishlist</h1>
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-micro font-medium text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Clear wishlist
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="mt-16 rounded-card bg-mist px-6 py-20 text-center">
            <p className="t-h3">Nothing saved yet.</p>
            <p className="mx-auto mt-4 max-w-md text-body font-normal text-muted">
              Tap the heart on any product to keep it here while you decide.
            </p>
            <Link href="/shop" className="btn-primary mt-8">
              Browse the range
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-10 text-micro font-normal text-muted">
              {items.length} {items.length === 1 ? 'product' : 'products'}
            </p>
            <div className="product-grid mt-6">
              {items.map((product, i) => (
                <ProductCard key={product.slug} product={product} priority={i < 4} />
              ))}
            </div>
          </>
        )}

        <p className="mt-16 border-t border-line pt-6 text-micro font-normal leading-relaxed text-muted">
          {compliance.productDisclaimer}
        </p>
      </div>
    </main>
  );
}
