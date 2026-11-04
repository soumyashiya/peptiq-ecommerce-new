'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { hero, stats } from '@/lib/content';

// The headline is the text LCP candidate and is masked out until it slides in,
// so the entrance is kept short — the stagger still reads, but LCP lands ~1.2s earlier.
const lineVariants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 },
  }),
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Layered parallax: image drifts down, text lifts and fades.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // `.hero` carries the base colour and the ::after scrim — see globals.css.
  return (
    <section ref={ref} id="top" className="hero h-[100svh] min-h-[680px]">

      <motion.div
        style={{ y: reduce ? 0 : imageY, scale: reduce ? 1 : imageScale }}
        className="absolute inset-0"
      >
        {/*
          Scale-only entrance: a transparent element is not a paint, so fading the
          LCP image in would defer LCP past the whole 1.6s ease and waste `priority`.
        */}
        <motion.div
          initial={{ scale: reduce ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={95}
            /*
             * Lower percentage shows more of the image's LEFT, which pushes the
             * subjects further right in frame and keeps the copy column clear.
             * At 70% the product box collided with the headline.
             */
            /*
             * No opacity, filter or blend — matching the reference site, where
             * the image is untouched and ALL the darkening comes from the
             * .hero::after scrim. Fading the image dulls the subject too;
             * a scrim only darkens where the copy sits.
             */
            className="object-cover object-[42%_center]"
          />
        </motion.div>
      </motion.div>

      {/*
        Outer element owns the scroll-linked parallax/fade; the inner
        `.hero-content` owns the one-shot entrance. Keeping them on separate
        elements is deliberate — see the note on `.hero-content` in globals.css.
      */}
      <motion.div
        style={{ y: reduce ? 0 : textY, opacity: fade }}
        className="frame absolute inset-x-0 bottom-12 md:bottom-20"
      >
       <div className="hero-content">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-5 py-[7px] text-label font-semibold uppercase tracking-[0.06em] text-ink md:text-micro">
          <span aria-hidden className="text-brand">✦</span>
          {hero.footerLeft} · {hero.footerRight}
        </span>

        <h1 className="mt-4 max-w-5xl t-display uppercase text-paper [text-shadow:0_2px_24px_rgba(0,0,0,0.18)]">
          {[hero.line1, hero.line2].map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p
          className="mt-7 max-w-[32rem] t-lead text-paper/90 md:mt-10"
        >
          {hero.kicker}
        </p>

        {/*
          These two were a hand-copied duplicate of `.btn-primary` /
          `.btn-secondary`, and the duplicate is exactly what went stale: the
          shared classes moved to the `btn` token while the hero kept a literal
          13→14px pair, so the hero CTA and every section CTA stopped being the
          same object. They now use the shared classes, which is the only way
          that stays true through a scale change.

          The secondary overrides colour only, because it sits on a photograph
          and the default ink border would disappear into it. Those overrides
          are utilities, emitted after the components layer, so they win at
          equal specificity.
        */}
        <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4">
          <Link href={hero.primaryCta.href} className="btn-primary group min-w-[15rem]">
            {hero.primaryCta.label}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="btn-secondary border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>

        <ul
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-micro font-semibold text-paper md:mt-14 md:text-micro"
        >
          {stats.items.slice(0, 3).map((s, i) => (
            <li key={s.caption} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-paper/40">•</span>}
              <span className="flex items-center gap-1.5">
                {i === 0 && (
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-brand-lime">
                    <path d="M12 2.5 14.6 5l3.5-.4.6 3.5 3 1.9-1.4 3.2 1.4 3.2-3 1.9-.6 3.5-3.5-.4L12 23.5 9.4 21l-3.5.4-.6-3.5-3-1.9L3.7 12.8 2.3 9.6l3-1.9.6-3.5 3.5.4Z" fill="currentColor" />
                    <path d="m8.5 12.5 2.3 2.3 4.7-4.8" className="stroke-ink" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="text-brand-lime">
                  {s.value}
                  {s.suffix}
                </span>{' '}
                {s.caption}
              </span>
            </li>
          ))}
        </ul>
       </div>
      </motion.div>
    </section>
  );
}
