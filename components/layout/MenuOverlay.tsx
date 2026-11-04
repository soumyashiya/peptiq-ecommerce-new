'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { brand, getProduct, menu, nav } from '@/lib/content';
import { useModal } from '@/components/ui/useModal';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Resolves `#anchor` links to `/#anchor` off the homepage. */
  linkHref: (href: string) => string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function MenuOverlay({ open, onClose, linkHref }: Props) {
  // Portalled to <body>: the header has a backdrop-filter once scrolled, which
  // makes it the containing block for `fixed` children and would clip the overlay.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useModal<HTMLDivElement>(open, onClose);

  const primary = [nav.cta, ...nav.links.filter((l) => l.href !== '#top')];
  const featured = getProduct(menu.featured.slug);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-brand-wash text-ink outline-none"
          data-lenis-prevent
        >
          {/* Decorative rings, top-right */}
          <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-ink/10" />
          <div aria-hidden className="pointer-events-none absolute -right-56 top-20 h-[30rem] w-[30rem] rounded-full border border-brand/15" />

          {/* Top bar mirrors the header so the wordmark doesn't jump */}
          <div className="frame relative flex h-[72px] items-center md:h-[84px]">
            <div className="flex flex-1 basis-0">
              <button
                type="button"
                onClick={onClose}
                className="group flex items-center gap-4 text-ink transition-colors hover:text-brand"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
                <span className="text-micro font-bold uppercase tracking-[0.2em]">{menu.closeLabel}</span>
              </button>
            </div>
            <Link href="/" onClick={onClose} className="flex shrink-0 flex-col items-center leading-none" aria-label={brand.name}>
              <span className="pl-[0.32em] text-price font-medium uppercase tracking-[0.32em] md:text-price">{brand.name}</span>
              <span className="mt-1.5 pl-[0.4em] text-[8px] font-semibold uppercase tracking-[0.4em] opacity-80 md:text-[9px]">
                {brand.sub}
              </span>
            </Link>
            <div className="flex-1 basis-0" />
          </div>

          <div className="frame relative grid gap-14 pb-16 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            {/* ── Big numbered links ── */}
            <nav aria-label="Primary">
              <ul>
                {primary.map((l, i) => (
                  <motion.li
                    key={l.href + l.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}
                    className="border-b border-ink/15"
                  >
                    <a
                      href={linkHref(l.href)}
                      onClick={onClose}
                      className="group flex items-baseline gap-4 py-3 md:gap-6 md:py-4"
                    >
                      <span className="w-6 text-micro font-semibold text-brand md:text-micro">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="t-h1 transition-[color,transform] duration-500 ease-smooth group-hover:translate-x-2 group-hover:text-brand">
                        {l.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* ── Link columns + featured batch ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
              className="lg:pt-8"
            >
              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                {menu.columns.map((col) => (
                  <div key={col.title}>
                    <p className="text-label font-bold uppercase text-brand">{col.title}</p>
                    <ul className="mt-5 space-y-3">
                      {col.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="text-nav font-semibold text-ink/75 transition-colors hover:text-brand"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {featured && (
                <Link
                  href={`/products/${featured.slug}`}
                  onClick={onClose}
                  className="group mt-12 flex items-center gap-5 rounded-card bg-paper p-4 shadow-[0_20px_50px_-30px_rgba(10,11,13,0.35)] transition-colors hover:bg-brand-lime"
                >
                  <span className="relative h-16 w-24 flex-none overflow-hidden rounded-[10px] bg-mist">
                    <Image src={featured.image} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-label font-bold uppercase tracking-[0.2em] text-brand">
                      {menu.featured.label}
                    </span>
                    <span className="mt-1 block truncate text-h3 font-semibold">{featured.name}</span>
                    <span className="block text-micro text-muted">{menu.featured.meta}</span>
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="flex-none text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
