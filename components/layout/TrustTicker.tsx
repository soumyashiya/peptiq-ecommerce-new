import { brand, ticker } from '@/lib/content';

/**
 * Assurance strip that sits above the header bar. Rendered *inside* the fixed
 * header rather than as its own fixed element, so the two scroll as one block
 * and the page's top padding only has to clear a single offset.
 *
 * Every claim is stamped with the wordmark. The header is the one element on
 * screen at any scroll position, so on a page this long the stamp is what keeps
 * the brand present between the hero and the footer — at four per loop, one is
 * always in view. It is set in the display face, the same weight the headings
 * use, so it reads as the mark rather than as another uppercase claim.
 *
 * The stamps are `aria-hidden`: a screen reader would otherwise hear the brand
 * name before every item. The item list is duplicated once so the -50% keyframe
 * lands exactly where the first copy began, giving a seamless loop; that
 * duplicate is hidden too. CSS-only, and `motion-reduce` stops it.
 */
export function TrustTicker() {
  return (
    <div className="h-8 overflow-hidden bg-brand-lime text-ink">
      <div className="flex h-full w-max animate-ticker items-center motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex h-full shrink-0 items-center"
          >
            {ticker.items.map((item) => (
              <li
                key={item}
                className="flex items-center whitespace-nowrap px-6 text-label font-bold uppercase"
              >
                <span
                  aria-hidden
                  className="font-display text-[0.9375rem] font-extrabold leading-none tracking-[0.12em]"
                >
                  {brand.name}
                </span>
                <span className="mx-4 h-1 w-1 rounded-full bg-ink/40" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
