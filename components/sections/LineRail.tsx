'use client';

import Image from 'next/image';
import Link from 'next/link';
import { lines, products } from '@/lib/content';

/**
 * "Shop by line" — category tiles deep-linking into the filtered shop.
 *
 * The tile is the ProductCard structure with the catalogue fields swapped for
 * line ones: paper panel, inset image, a pill row, the name, a blurb, then a
 * baseline row ending in a round control. The two rails sit a screen apart on
 * the homepage, so they have to read as the same object — if `ProductCard`'s
 * geometry changes, change it here too.
 *
 * A tile is photographic only when its line sets `image`; otherwise it falls
 * back to `TILE_GRADIENT`. That opt-in exists because the generated product
 * `card.jpg` art is itself typographic — using it here stacked a product name
 * on top of a category name and the category, the thing being chosen, lost.
 * Only real photography earns the slot.
 *
 * The track auto-scrolls and pauses on hover or keyboard focus.
 *
 * Spacing is `mr-*` on each tile rather than `gap` on the container: with a gap,
 * the duplicated track's width is 2N·w + (2N−1)·g, so translating by exactly
 * −50% lands half a gap out and the loop visibly jumps. Margins make each copy
 * exactly half the track.
 */
const TILE_GRADIENT =
  'radial-gradient(110% 85% at 10% 98%, rgba(255,255,255,0.55) 0%, rgba(210,191,252,0) 62%), linear-gradient(158deg,#DCCCFD 0%,#D2BFFC 52%,#C7B4F7 100%)';

/**
 * Lines are keyed by either a category or a format (`blend`), matching the two
 * query params the tiles deep-link into, so the count checks both fields.
 */
function countFor(key: string) {
  return products.items.filter((p) => p.category === key || p.format === key).length;
}

function Tile({ line }: { line: (typeof lines.items)[number] }) {
  const count = countFor(line.key);

  return (
    // Same structure as the Bestsellers (`ProductCard` minimal) card: a
    // square-cornered 4:5 photo with an action that slides up on hover, then a
    // bold uppercase name and one small grey line, centred underneath.
    <Link
      href={line.href}
      className="group/tile mr-6 flex w-[70vw] shrink-0 flex-col items-center text-center sm:w-[36vw] lg:w-[19vw]"
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px]"
        style={{ backgroundImage: TILE_GRADIENT }}
      >
        {line.image && (
          <Image
            src={line.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 19vw, (min-width: 640px) 36vw, 70vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover/tile:scale-[1.04]"
          />
        )}

        {/* Decorative: the whole tile is the link, so this is not a second tab stop.
            Always visible on touch screens (no hover there) and on keyboard focus. */}
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+0.75rem)] rounded-md bg-ink py-3 text-micro font-semibold uppercase tracking-[0.12em] text-paper opacity-0 transition-all duration-500 ease-smooth group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-focus-visible/tile:translate-y-0 group-focus-visible/tile:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        >
          Shop the line
        </span>
      </div>

      <h3 className="mt-4 text-body font-extrabold uppercase leading-tight tracking-[0.02em] text-ink">
        {line.label}
      </h3>
      <p className="figures mt-1.5 text-micro text-muted">
        {count} {count === 1 ? 'product' : 'products'}
      </p>
    </Link>
  );
}

export function LineRail() {
  return (
    <section id="lines" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="pill-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              {lines.label}
            </span>
            <h2 className="mt-5 t-h2">{lines.title}</h2>
          </div>
          <Link href="/shop" className="link-underline shrink-0 whitespace-nowrap text-micro font-medium">
            {lines.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Full-bleed: the track runs the whole viewport, not the 1600px cap. */}
      <div className="group/rail mt-12 w-full overflow-hidden pl-6 md:pl-10 lg:pl-16">
        <div className="flex w-max animate-ticker [animation-duration:60s] [animation-play-state:running] group-hover/rail:[animation-play-state:paused] group-focus-within/rail:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
              {lines.items.map((line) => (
                <Tile key={`${copy}-${line.key}`} line={line} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="frame">
        <p className="mt-8 text-micro font-normal uppercase tracking-[0.12em] text-muted">
          {lines.items.length} lines · hover to pause
        </p>
      </div>
    </section>
  );
}
