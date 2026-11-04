'use client';

import { useState } from 'react';
import Image from 'next/image';
import { gallery } from '@/lib/content';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

/** Corner registration ticks — a clinical accent shown on the active panel. */
function CornerTicks({ show }: { show: boolean }) {
  const base =
    'pointer-events-none absolute h-5 w-5 border-brand-sky transition-opacity duration-500';
  return (
    <span className={show ? 'opacity-80' : 'opacity-0'}>
      <span className={`${base} left-3 top-3 border-l border-t`} />
      <span className={`${base} right-3 top-3 border-r border-t`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
    </span>
  );
}

export function Gallery() {
  const items = gallery.items;
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden py-section-sm md:py-section">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-brand/20 blur-[120px]"
      />

      <div className="frame relative">
        {/* Header: overline + title left, intro + counter right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal direction="none">
              <p className="flex items-center gap-4 text-label font-medium uppercase tracking-[0.12em] text-brand-sky">
                <span className="h-px w-8 bg-brand-sky" />
                {gallery.label}
              </p>
              <h2 className="mt-6 max-w-[16ch] t-h2 text-balance">
                {gallery.title}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="max-w-prose text-body text-muted">{gallery.intro}</p>
              <div className="mt-6 flex items-center gap-4 font-normal tabular-nums">
                <span className="text-h2-sm leading-none text-brand-sky">
                  0{active + 1}
                </span>
                <span className="h-px w-10 bg-ink/20" />
                <span className="text-h3 leading-none text-muted">
                  0{items.length}
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Desktop: interactive expanding-panel accordion.
            Buttons are the DIRECT flex children so flex-grow drives the expand. */}
        <Reveal
          direction="up"
          delay={0.1}
          className="mt-14 hidden h-[64vh] min-h-[480px] gap-2.5 lg:flex"
        >
          {items.map((it, i) => {
            const isActive = active === i;
            return (
                <button
                  key={it.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={it.title}
                  style={{ flexGrow: isActive ? 5 : 1, flexBasis: 0 }}
                  className="group relative h-full min-w-0 overflow-hidden rounded-[3px] text-left outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-brand-sky"
                >
                  <Image
                    src={it.image}
                    alt={it.title}
                    fill
                    sizes="(max-width:1024px) 0vw, 50vw"
                    className={`object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? 'scale-100 grayscale-0' : 'scale-110 grayscale'
                    }`}
                  />
                  {/* dim + bottom gradient */}
                  <span
                    className={`absolute inset-0 transition-colors duration-500 ${
                      isActive ? 'bg-ink/15' : 'bg-ink/55'
                    }`}
                  />
                  <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />

                  <CornerTicks show={isActive} />

                  {/* index, top-left */}
                  <span className="absolute left-5 top-5 text-micro font-medium tracking-[0.1em] text-paper/80">
                    0{i + 1}
                  </span>

                  {/* collapsed: vertical label */}
                  <span
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-body font-normal uppercase tracking-[0.15em] text-paper transition-opacity duration-300 [writing-mode:vertical-rl] ${
                      isActive ? 'opacity-0' : 'opacity-90'
                    }`}
                    style={{ transform: 'translateX(-50%) rotate(180deg)' }}
                  >
                    {it.title}
                  </span>

                  {/* expanded: full caption block */}
                  <span
                    className={`absolute inset-x-0 bottom-0 block p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-5 opacity-0'
                    }`}
                  >
                    <span className="text-label font-medium uppercase tracking-[0.14em] text-brand-sky">
                      {it.tag}
                    </span>
                    <span className="mt-3 block t-h3 text-paper">
                      {it.title}
                    </span>
                    <span className="mt-3 block max-w-md text-body leading-relaxed text-paper/70">
                      {it.caption}
                    </span>
                    {/* animated underline accent */}
                    <span
                      className={`mt-5 block h-px bg-brand-sky transition-all duration-700 delay-150 ${
                        isActive ? 'w-24 opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </span>
                </button>
            );
          })}
        </Reveal>

        {/* Mobile: stacked cards */}
        <Reveal stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
          {items.map((it, i) => (
            <RevealItem key={it.title}>
              <div className="media relative aspect-[4/5] w-full overflow-hidden rounded-[3px]">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  sizes="(max-width:640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <span className="absolute left-4 top-4 text-micro font-medium tracking-[0.1em] text-paper/80">
                  0{i + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-label font-medium uppercase tracking-[0.14em] text-brand-sky">
                    {it.tag}
                  </span>
                  <h3 className="mt-2 t-h3">{it.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-paper/70">{it.caption}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
