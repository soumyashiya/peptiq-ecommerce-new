'use client';

import { useId, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/components/cart/CartProvider';
import { getProduct, peptiqStandard, type Product } from '@/lib/content';
import { formatPrice } from '@/lib/format';

const EASE = [0.16, 1, 0.3, 1] as const;

function ShopCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    add({ slug: product.slug, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="glass flex items-center gap-3 bg-paper/85 p-3">
      <Link href={`/products/${product.slug}`} className="relative h-20 w-16 flex-none overflow-hidden rounded-panel bg-mist">
        <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/products/${product.slug}`} className="block text-body font-bold leading-snug text-ink">
          {product.name}
        </Link>
        <p className="text-price font-bold text-ink">{formatPrice(product.price)}</p>
      </div>
      <button type="button" onClick={quickAdd} className="btn-primary flex-none px-5">
        {added ? peptiqStandard.addedLabel : peptiqStandard.addLabel}
      </button>
    </div>
  );
}

/**
 * The batch's three stages as an accordion beside one large photo. Opening a stage
 * swaps the photo and the product card on it, so the section reads as a way into the
 * catalogue rather than a statement. `children` is the heading block, which sits
 * above the accordion on desktop and above the photo on phones.
 */
export function StandardExplorer({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [active, setActive] = useState(0);
  const point = peptiqStandard.points[active];
  const product = getProduct(point.productSlug);

  return (
    <div className="grid gap-y-8 lg:grid-cols-[0.85fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
      <div className="lg:col-start-2">{children}</div>

      <div className="relative lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-mist lg:aspect-[5/6]">
          <AnimatePresence initial={false}>
            <motion.div
              key={point.title}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {/* `object-cover` scales this crop by height, so it renders wider than its box. */}
              <Image
                src={point.image}
                alt={point.alt}
                fill
                sizes="(min-width: 1024px) 90vw, 170vw"
                style={{ objectPosition: point.position }}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {product && (
          <div className="mt-3 lg:absolute lg:inset-x-5 lg:bottom-5 lg:mt-0">
            <ShopCard product={product} />
          </div>
        )}
      </div>

      <div className="lg:col-start-2">
        <ul className="border-b border-ink/15">
          {peptiqStandard.points.map((p, i) => {
            const open = i === active;
            const panelId = `${baseId}-${i}`;
            return (
              <li key={p.title} className="border-t border-ink/15">
                <h3>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left t-h3 text-ink"
                  >
                    {p.title}
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-body transition-colors duration-300 ${
                        open ? 'bg-brand-lime text-ink' : 'bg-paper/50 text-ink'
                      }`}
                    >
                      {open ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      className="overflow-hidden"
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={reduce ? undefined : { height: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {/* The min-height holds the longest body, so switching stages doesn't move the page. */}
                      <p className="max-w-[46ch] pb-6 text-body text-ink/70 lg:min-h-[6.75rem]">{p.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={peptiqStandard.shopCta.href} className="btn-primary">
            {peptiqStandard.shopCta.label}
          </Link>
          <Link href={peptiqStandard.cta.href} className="link-underline text-body font-semibold text-ink">
            {peptiqStandard.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
