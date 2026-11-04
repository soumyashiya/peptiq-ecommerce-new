'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { spotlight, getProduct, supplyPricing, SUPPLY_DISCOUNT, compliance } from '@/lib/content';
import { formatPrice } from '@/lib/format';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Product spotlight slider: shot on the left, oversized ghost name behind,
 * offer panel on the right. Slides advance every `spotlight.interval` ms and
 * crossfade; autoplay pauses on hover/focus and is off entirely under
 * reduced motion. The dots underneath switch slides directly.
 *
 * Pricing comes from the live product, so a price change in `products` shows
 * through here without touching `spotlight`. Each slide `image` must be a
 * transparent cut-out — it floats directly on the band with no panel.
 *
 * Sits directly on the lavender page, which the frosted offer panel needs in
 * order to read as glass.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const slides = spotlight.slides.flatMap((s) => {
  const product = getProduct(s.slug);
  return product ? [{ ...s, product }] : [];
});

export function Spotlight() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = useCallback((n: number) => setI(((n % slides.length) + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return;
    const id = setTimeout(() => go(i + 1), spotlight.interval);
    return () => clearTimeout(id);
  }, [i, paused, reduce, go]);

  if (slides.length === 0) return null;

  const slide = slides[i];
  const { product } = slide;
  const { perDelivery } = supplyPricing(product.price);
  const href = `/products/${product.slug}`;

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -16 },
    transition: { duration: 0.55, ease: EASE },
  } as const;

  return (
    <section
      id="spotlight"
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative scroll-mt-28 overflow-hidden py-section-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Ghost wordmark — decorative, sits behind both columns. */}
      <AnimatePresence mode="wait">
        <motion.p
          key={slide.slug}
          aria-hidden
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[clamp(6rem,17vw,18rem)] font-normal uppercase leading-none tracking-tight text-paper/25"
        >
          {slide.title}
        </motion.p>
      </AnimatePresence>

      {/*
        Two capped columns, centred as a pair. At ~1440px they fill the frame
        (edge-aligned with the header); on wider screens the pair stays together
        instead of drifting apart into a wide empty gap.
      */}
      <div className="frame relative grid items-center gap-12 lg:grid-cols-[minmax(0,600px)_minmax(0,600px)] lg:justify-center lg:gap-36">
        <Reveal direction="right">
          <Link
            href={href}
            aria-label={product.name}
            className="group relative mx-auto block aspect-square w-full max-w-[480px] lg:ml-auto lg:mr-0 lg:max-w-[520px]"
          >
            {/* Breathing glow behind the product. */}
            <span
              aria-hidden
              className="spot-glow absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(210,191,252,0.35)_45%,rgba(210,191,252,0)_70%)] blur-2xl"
            />
            {/* Drifting orbs — staggered so they never move in sync. */}
            {[
              'left-[4%] top-[18%] h-4 w-4 [animation-delay:-1s]',
              'right-[6%] top-[10%] h-3 w-3 [animation-delay:-3s]',
              'right-[2%] bottom-[22%] h-5 w-5 [animation-delay:-5s]',
              'left-[10%] bottom-[8%] h-2.5 w-2.5 [animation-delay:-2s]',
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`spot-orb absolute rounded-full bg-paper/80 shadow-[0_0_18px_rgba(255,255,255,0.6)] ${pos}`}
              />
            ))}
            <div className="spot-float relative h-full w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.slug}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <Image
                    src={slide.image}
                    alt={product.name}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 520px, 90vw"
                    className="object-contain drop-shadow-[0_30px_40px_rgba(60,30,120,0.25)] transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.06]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Link>
        </Reveal>

        <Reveal direction="left" delay={0.1} className="w-full">
          <AnimatePresence mode="wait">
            <motion.div key={slide.slug} {...fade} aria-live="polite">
              <span className="inline-block rounded-full bg-brand-lime px-3.5 py-1.5 text-label font-bold uppercase tracking-[0.16em] text-ink">
                {slide.badge}
              </span>

              <h2 className="mt-5 break-words t-h1 text-ink">
                {slide.title}
                <span className="text-brand">.</span>
              </h2>
              <p className="mt-3 t-lead italic text-ink/60">{slide.kicker}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {slide.chips.map((chip) => (
                  <li
                    key={chip}
                    className="flex items-center gap-1.5 rounded-full bg-paper/50 px-3.5 py-1.5 text-micro font-medium text-ink [backdrop-filter:saturate(1.8)_blur(20px)]"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8.5 12 2.5 2.5 4.5-5" />
                    </svg>
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="glass mt-8 max-w-[480px] p-6 md:p-7">
                <p className="flex items-center gap-2 text-micro font-medium text-ink/70">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-teal" aria-hidden>
                    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  {spotlight.proof}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="figures text-price font-bold leading-none text-ink">
                    {formatPrice(perDelivery)}
                  </span>
                  <span className="figures text-body font-medium text-ink/50 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-brand-lime px-2.5 py-1 text-label font-bold uppercase tracking-[0.12em] text-ink">
                    Save {Math.round(SUPPLY_DISCOUNT * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-micro font-normal text-ink/65">{spotlight.supplyNote}</p>

                <Link href={href} className="btn-primary mt-7">
                  {slide.cta}
                </Link>

                <p className="mt-5 text-label font-normal text-ink/70">{spotlight.footnote}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots — the active one stretches and fills over the interval. */}
          {slides.length > 1 && (
            <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Choose product">
              {slides.map((s, idx) => {
                const active = idx === i;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={s.product.name}
                    onClick={() => go(idx)}
                    className={`relative h-2 overflow-hidden rounded-full transition-all duration-500 ease-smooth ${
                      active ? 'w-10 bg-paper/60' : 'w-2 bg-ink/20 hover:bg-ink/40'
                    }`}
                  >
                    {active && !reduce && (
                      <span
                        key={`${i}-${paused}`}
                        className="absolute inset-y-0 left-0 w-full origin-left bg-brand"
                        style={{
                          animation: `tprogress ${spotlight.interval}ms linear forwards`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-label font-normal text-ink/70">
            {compliance.productDisclaimerShort}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
