'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

/**
 * Masked line reveal for headings.
 *
 * Every other entrance on the site is the shared `Reveal` fade-and-rise, which
 * is right for blocks but makes a headline arrive like a paragraph. This is the
 * page's one authored text moment: each line sits in its own overflow-hidden
 * box and slides up from beneath it, so the words are uncovered rather than
 * faded in — the same gesture the hero already uses, lifted out so section
 * headings can share it instead of each re-deriving it.
 *
 * ── Why the padding/margin pair on the inner span ────────────────────────────
 * A heading's line box is tighter than its font's descender depth, so an
 * `overflow: hidden` wrapper sized to the line clips the tail of a `g`, `p` or
 * `q` — and "Peptiq" ends in one. The inner span is padded 0.18em at the
 * bottom and pulled back by the same amount, which grows the clipping box past
 * the descenders without changing where the line sits.
 *
 * Under reduced motion the lines render in place with no transform.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export function RevealLines({
  lines,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  /** Seconds between consecutive lines. */
  stagger = 0.09,
}: {
  /** One entry per visual line. Nodes are allowed, for inline accents. */
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
  };

  const line: Variants = {
    hidden: { y: reduce ? '0%' : '115%' },
    show: { y: '0%', transition: { duration: reduce ? 0 : 0.85, ease: EASE } },
  };

  const MotionTag = motion[Tag] as typeof motion.h2;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((content, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            variants={line}
            className="block pb-[0.18em] [margin-bottom:-0.18em]"
          >
            {content}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
