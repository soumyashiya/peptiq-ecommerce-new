'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { brand, faq } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Every topic's questions in one list; the topics stay in content for grouping. */
const ITEMS = faq.topics.flatMap((t) => t.items);

/**
 * FAQ — two columns inside the header's gutters. Left: a small label, the
 * heading, a line pointing anything else to the research inbox, and the photo.
 * Right: every question as a hairline-divided row, one answer open at a time,
 * then the two pages most questions lead to.
 *
 * The photo carries its own page-lavender border, so it sits on the page with no
 * frame of its own and blends in. It keeps its own 6:5 ratio, so nothing is cropped.
 *
 * Answers restate the shipping and refund policies in `lib/content.ts`: change a
 * policy and its answer here together.
 */
export function Faq() {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28 py-section-sm">
      <div className="frame grid gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-x-20">
        {/* Held in place while the longer question list scrolls past it. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-label font-bold uppercase text-ink/60">{faq.eyebrow}</p>
            <h2 className="mt-4 t-h2 text-ink">{faq.title}</h2>
            <p className="mt-5 text-body text-ink/70">
              {faq.emailLead}{' '}
              <a href={`mailto:${brand.email}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                {brand.email}
              </a>
              .
            </p>
          </Reveal>

          <Reveal className="relative mt-8 hidden aspect-[1374/1145] lg:block">
            <Image
              src={faq.image}
              alt={faq.imageAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div>
          <ul className="border-t border-ink/15">
            {ITEMS.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${baseId}-${i}`;
              return (
                <li key={item.q} className="border-b border-ink/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lead font-semibold text-ink"
                    >
                      {item.q}
                      <span
                        aria-hidden
                        className={`flex h-6 w-6 flex-none items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        className="overflow-hidden"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <p className="max-w-[64ch] pb-6 pr-10 text-body text-ink/70">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {faq.links.map((link) => (
              <Link key={link.href} href={link.href} className="btn-secondary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
