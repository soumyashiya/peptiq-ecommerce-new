'use client';

import { useState } from 'react';
import { merch, getProducts, compliance } from '@/lib/content';
import { Rail } from '@/components/ui/Rail';
import { ProductCard } from '@/components/products/ProductCard';

/**
 * Cards shown in the collapsed grid before "Shop all" expands the rail.
 *
 * Four, not three, because `.product-grid` is four-up from `xl` — three cards
 * left a quarter of the row empty next to the "Shop all" button.
 */
const PREVIEW_COUNT = 4;

/**
 * Bestsellers. Carries the `#products` anchor that the nav points at, since it
 * replaced the old static Products section as the homepage's primary catalogue
 * entry point.
 *
 * Two states, deliberately different layouts: it opens on a full-width grid of
 * {@link PREVIEW_COUNT} cards, and "Shop all" expands the full list into the
 * scroll-snap rail in place rather than navigating away, so the homepage keeps
 * its scroll position.
 */
export function Bestsellers() {
  const items = getProducts(merch.bestsellers.slugs);
  const [showAll, setShowAll] = useState(false);

  const canExpand = items.length > PREVIEW_COUNT;
  const expanded = showAll || !canExpand;
  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <section id="products" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        {/* Wraps rather than overflows: `whitespace-nowrap` on the button means
            it cannot shrink, so on a narrow screen it has to drop to its own
            line or it runs off the right edge of the frame. */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
          <div>
            <span className="pill-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
              </svg>
              {merch.bestsellers.label}
            </span>
            <h2 className="mt-5 t-h2">
              {merch.bestsellers.title}
            </h2>
          </div>
          {canExpand && (
            <button
              type="button"
              onClick={() => setShowAll((open) => !open)}
              aria-expanded={showAll}
              className="btn-secondary shrink-0 whitespace-nowrap"
            >
              {showAll ? 'Show less' : merch.bestsellers.cta}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-12">
          {expanded ? (
            <Rail label="Bestselling research peptides" footnote={`${items.length} lines`}>
              {visible.map((product) => (
                <div
                  key={product.slug}
                  className="w-[70vw] shrink-0 snap-start sm:w-[36vw] lg:w-[19vw]"
                >
                  <ProductCard
                    variant="minimal"
                    product={product}
                    sizes="(min-width: 1024px) 19vw, (min-width: 640px) 36vw, 70vw"
                  />
                </div>
              ))}
            </Rail>
          ) : (
            /*
             * Collapsed state is a grid, not the rail: rail-width cards would
             * leave the right of the row empty, so the preview spans the frame
             * and lines up flush with the heading on both edges. It uses the
             * shared `.product-grid`, so the preview cards are the same size as
             * the shop's — {@link PREVIEW_COUNT} is set to fill its widest row.
             *
             * Four-up from `lg` rather than `xl`: these are the pared-back
             * `minimal` cards, which hold at the width the expanded rail gives
             * them at that breakpoint (19vw), and taking the fourth track a
             * breakpoint later would leave one card stranded on its own row.
             */
            <>
              <div className="product-grid lg:grid-cols-4">
                {visible.map((product) => (
                  <ProductCard key={product.slug} variant="minimal" product={product} />
                ))}
              </div>
              <p className="mt-8 text-micro font-normal uppercase tracking-[0.12em] text-muted">
                {`${visible.length} of ${items.length} lines`}
              </p>
            </>
          )}
        </div>

        <p className="mt-10 border-t border-line pt-6 text-micro font-normal text-muted">
          {compliance.productDisclaimerShort}
        </p>
      </div>
    </section>
  );
}
