'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { products, shopControls } from '@/lib/content';
import { formatPrice } from '@/lib/format';
import { useModal } from '@/components/ui/useModal';

/**
 * Client-side catalogue search. The catalogue is a static six-item array in
 * `lib/content.ts`, so matching in the browser is both instant and exact —
 * there is no index or endpoint to keep in sync.
 *
 * Matches against name, tagline, strength and the compound names in `specs`,
 * which is where "GHK-Cu" or "TB-500" actually appear for blends.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const panelRef = useModal<HTMLDivElement>(open, onClose);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.items.filter((p) => {
      const haystack = [
        p.name,
        p.tagline,
        p.strength,
        p.blurb,
        ...p.specs.map((s) => s.value),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 rounded-b-card bg-paper shadow-[0_24px_60px_-30px_rgba(14,14,16,0.4)] outline-none"
          >
            <div className="frame py-6">
              <div className="flex items-center gap-4 border-b border-line pb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="shrink-0 text-muted"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="site-search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={shopControls.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent t-lead text-ink outline-none placeholder:text-muted/60"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 text-micro font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
                >
                  Close
                </button>
              </div>

              <div aria-live="polite" className="max-h-[60vh] overflow-y-auto">
                {query.trim() && results.length === 0 && (
                  <p className="py-10 text-body font-normal text-muted">
                    No products match “{query.trim()}”.
                  </p>
                )}

                {results.length > 0 && (
                  <ul className="divide-y divide-line">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 py-4 transition-colors hover:bg-mist"
                        >
                          <span className="media relative h-16 w-14 shrink-0">
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-body font-medium text-ink">
                              {p.name}
                            </span>
                            <span className="block text-micro font-normal text-muted">
                              {p.tagline}
                            </span>
                          </span>
                          <span className="shrink-0 text-price font-bold tabular-nums text-ink">
                            {formatPrice(p.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {!query.trim() && (
                  <div className="py-8">
                    <p className="text-micro font-medium uppercase tracking-[0.12em] text-muted">
                      Browse by line
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {shopControls.categories
                        .filter((c) => c.value !== 'all')
                        .map((c) => (
                          <Link
                            key={c.value}
                            href={`/shop?category=${c.value}`}
                            onClick={onClose}
                            className="rounded-full border border-line px-5 py-2.5 text-micro font-semibold text-ink transition-colors hover:border-ink hover:bg-mist"
                          >
                            {c.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
