'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  products,
  merch,
  shopControls,
  compliance,
  type Product,
  type ProductFormat,
} from '@/lib/content';
import { ProductCard } from '@/components/products/ProductCard';

/**
 * Shop listing with category tabs, sort and a format filter.
 *
 * State lives in the URL (`?category=`, `?sort=`, `?format=`) rather than in
 * component state, so the category tiles on the homepage and the footer's
 * "New in" links can deep-link straight into a filtered view, and any view a
 * visitor reaches is shareable. Only the filter *panel's* open/closed state is
 * local, since that is presentation rather than a view.
 */
export function ShopGrid() {
  const router = useRouter();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') ?? 'all';
  const sort = params.get('sort') ?? 'featured';
  const format = params.get('format');

  // Replace rather than push: filtering is not a navigation step, so the back
  // button should leave the shop instead of walking back through every tab.
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === 'all') next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false });
  };

  const items = useMemo(() => {
    let list: Product[] = [...products.items];

    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (format) list = list.filter((p) => p.format === (format as ProductFormat));

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'new':
        // Newest first, using the editorial new-arrivals order; anything not
        // listed there keeps its catalogue position behind the listed items.
        return list.sort(
          (a, b) => rank(merch.newArrivals.slugs, a.slug) - rank(merch.newArrivals.slugs, b.slug)
        );
      case 'bestsellers':
        return list.sort(
          (a, b) => rank(merch.bestsellers.slugs, a.slug) - rank(merch.bestsellers.slugs, b.slug)
        );
      default:
        return list;
    }
  }, [category, sort, format]);

  const activeFilters = (format ? 1 : 0) + (category !== 'all' ? 1 : 0);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {shopControls.categories.map((c) => {
          const active = c.value === category;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setParam('category', c.value)}
              aria-pressed={active}
              className={`rounded-full border px-5 py-2.5 text-micro font-semibold transition-colors ${
                active
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-ink hover:border-ink hover:bg-mist'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="shop-filters"
          className="flex items-center gap-2 text-micro font-medium text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeFilters > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-lime px-1.5 text-label font-bold text-ink">
              {activeFilters}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="shop-sort" className="text-micro font-normal text-muted">
            Sort:
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="rounded-full border border-line bg-paper px-4 py-2 text-micro font-semibold text-ink outline-none transition-colors focus:border-brand"
          >
            {shopControls.sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div id="shop-filters" className="mt-4 rounded-panel bg-mist px-6 py-6">
          <p className="text-micro font-medium uppercase tracking-[0.12em] text-muted">
            Format
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {shopControls.formats.map((f) => {
              const active = format === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setParam('format', active ? null : f.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-micro font-semibold transition-colors ${
                    active
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line bg-paper text-ink hover:border-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={() => router.replace('/shop', { scroll: false })}
                className="ml-2 text-micro font-medium text-brand-teal underline-offset-4 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <p aria-live="polite" className="mt-8 text-micro font-normal text-muted">
        {items.length} {items.length === 1 ? 'product' : 'products'}
      </p>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="t-h3">Nothing matches those filters.</p>
          <button
            type="button"
            onClick={() => router.replace('/shop', { scroll: false })}
            className="btn-primary mt-6"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="product-grid mt-6">
          {items.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 4} />
          ))}
        </div>
      )}

      <p className="mt-16 border-t border-line pt-6 text-micro font-normal leading-relaxed text-muted">
        {compliance.productDisclaimer}
      </p>
    </div>
  );
}

/** Position in an editorial slug list; unlisted slugs sort to the end. */
function rank(slugs: string[], slug: string) {
  const i = slugs.indexOf(slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}
