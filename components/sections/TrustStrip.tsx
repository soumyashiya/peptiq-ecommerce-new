import { brand, trustStrip } from '@/lib/content';

/**
 * Trust strip — the first thing under the hero: a brand chip, then four
 * assurance badges.
 *
 * It previously opened with a brand stamp and a line of context *above* the
 * row. Both were removed deliberately — directly under the hero the badges
 * carry themselves, and a heading there pushed the first product further down
 * the page for no gain. The brand is back, but as the row's first chip rather
 * than as a heading, so the section names itself at no cost in height. The
 * context line stayed cut.
 *
 * The chip is lime on ink, the only inverted pill in the row, so it reads as
 * the mark the other four belong to instead of a fifth claim.
 *
 * Each badge's longer description is kept as its `title` tooltip; the list is
 * `role="list"` content and the icons are decorative.
 */
const ICONS: Record<string, React.ReactNode> = {
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3ZM9 12l2.2 2.2L15.5 10" />,
  flask: <path d="M10 3h4M11 3v6.2L5.8 18A2 2 0 0 0 7.5 21h9a2 2 0 0 0 1.7-3L13 9.2V3M8.5 15h7" />,
  snow: <path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4 12 6.5 14.5 4M9.5 20 12 17.5l2.5 2.5" />,
  chat: <path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" />,
};

export function TrustStrip() {
  return (
    <section aria-label="What every Peptiq order carries" className="py-section-sm">
      <div className="frame">
        <ul className="flex flex-wrap items-center justify-center gap-2.5 lg:gap-3">
          <li className="flex items-center rounded-full bg-ink py-2 pl-4 pr-4">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-brand-lime" aria-hidden />
            <span className="font-display text-[0.9375rem] font-extrabold uppercase leading-none tracking-[0.12em] text-paper">
              {brand.name}
            </span>
          </li>

          {trustStrip.items.map((item) => (
            <li
              key={item.label}
              title={item.body}
              className="group flex items-center gap-2.5 rounded-full border border-paper/60 bg-paper/40 py-2 pl-2 pr-4 backdrop-blur-md transition-colors duration-300 hover:border-paper hover:bg-paper"
            >
              <span aria-hidden className="icon-chip h-7 w-7 rounded-[8px]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[item.icon]}
                </svg>
              </span>
              <span className="text-micro font-semibold uppercase leading-tight tracking-[0.04em] text-ink">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
