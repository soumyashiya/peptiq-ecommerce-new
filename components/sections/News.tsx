'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { news } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Testimonials — a centred title over a row of tall portrait cards. Each card
 * carries a white name tag overlapping its bottom-left corner; hovering (or
 * focusing) a card slides a dark panel up over the photo with the stars and
 * the review itself. On touch screens, where there is no hover, a tap toggles
 * the same panel.
 *
 * The row is a real scroll-snap container, so touch and trackpad swiping work;
 * the dots underneath track the card nearest the left edge and jump to a card
 * when pressed.
 */
function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" className={i < n ? 'fill-brand-lime' : 'fill-paper/25'}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function News() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  // Keep the active dot in step with the card nearest the track's left edge.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const sync = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      // At the very end the last card may never reach the left edge.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) best = cards.length - 1;
      setActive(best);
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    return () => el.removeEventListener('scroll', sync);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }, []);

  return (
    <section
      id="news"
      className="scroll-mt-28 py-section-sm md:py-section"
      // Picks up the pale lavender `Process` ends on and returns to the page colour.
      style={{ backgroundImage: 'linear-gradient(180deg, #F1EBFC 0%, #D2BFFC 40%)' }}
    >
      <div className="frame">
        <Reveal>
          <h2 className="mx-auto max-w-[24ch] text-balance text-center t-h1 text-ink">{news.title}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ul
            ref={trackRef}
            aria-label="Customer reviews"
            className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-16 [&::-webkit-scrollbar]:hidden"
          >
            {news.items.map((t, i) => {
              const isOpen = open === i;
              return (
                <li key={t.name} className="w-[70%] flex-none snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={`${t.name}'s review`}
                    className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-brand-soft/40 text-left"
                  >
                    <Image
                      src={t.avatar}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 70vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                    />

                    {/* Review panel — slides up on hover/focus, or when tapped open. */}
                    <span
                      className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/95 via-ink/80 to-ink/30 p-6 pb-24 text-paper transition-all duration-500 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                      }`}
                    >
                      <span className="flex items-center gap-2" aria-label={`${t.rating} out of 5`}>
                        <Stars n={t.rating} />
                        <span className="figures text-micro font-semibold">{t.rating.toFixed(1)}</span>
                      </span>
                      <span className="mt-4 block text-body font-medium text-paper/90">“{t.quote}”</span>
                    </span>

                    {/* Name tag */}
                    <span className="absolute bottom-0 left-0 bg-paper px-5 py-4 pr-10">
                      <span className="block text-[1.0625rem] font-bold text-ink md:text-h3">{t.name}</span>
                      <span className="mt-1 block text-micro text-muted">
                        {t.role} · {t.org}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div className="mt-8 flex justify-center gap-2.5" role="tablist" aria-label="Choose review">
          {news.items.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Show ${t.name}'s review`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-ink' : 'w-2 bg-ink/20 hover:bg-ink/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
