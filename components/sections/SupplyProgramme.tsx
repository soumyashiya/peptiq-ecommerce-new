import Image from 'next/image';
import Link from 'next/link';
import { supply, SUPPLY_DISCOUNT, compliance } from '@/lib/content';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

/**
 * Recurring-supply banner. The card is the colour of the photo's own backdrop,
 * so the still life dissolves into it with no visible seam: pitch on the left,
 * product on the right, and the programme perks in a darker strip underneath.
 *
 * From `xl` the photo shows whole at its native ratio and the upper panel keeps
 * a fixed ratio with it, so the carton always starts just right of the copy
 * column. Below `xl` the photo stacks on top and fades down into the card.
 *
 * Perks are short labels only — the longer `benefits[].body` copy is kept in
 * `lib/content.ts` for the product pages and is not rendered here.
 */
const PERK_ICONS = [
  // tag — discount
  <path key="a" d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-9 9-9-9ZM8 8h.01" />,
  // snowflake — cold chain
  <path key="b" d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5" />,
  // star — priority allocation
  <path key="c" d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
  // document — reports on dispatch
  <path key="d" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h4" />,
];

export function SupplyProgramme() {
  const discountPct = Math.round(SUPPLY_DISCOUNT * 100);

  return (
    <section id="supply" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        {/* #462E6A is sampled from the left of `supply.image` — change them together. */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-[#462E6A] text-paper shadow-[0_40px_80px_-40px_rgba(70,46,106,0.75)]">
          <div className="relative xl:flex xl:aspect-[1600/550] xl:items-center">
            <div className="relative aspect-[16/10] overflow-hidden xl:absolute xl:inset-y-0 xl:right-0 xl:aspect-[1600/711] xl:h-full">
              <Image
                src={supply.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 75vw, 100vw"
                className="origin-right object-cover object-[95%_center] transition-transform duration-[1400ms] ease-smooth [mask-image:linear-gradient(180deg,#000_62%,transparent_100%)] group-hover:scale-[1.03] xl:[mask-image:linear-gradient(90deg,transparent_4%,#000_32%)]"
              />
            </div>

            <Reveal className="relative px-6 pb-10 pt-2 sm:px-10 xl:w-[48%] xl:py-8 xl:pl-14 xl:pr-0">
              <h2 className="max-w-[16ch] text-balance t-h1">{supply.bannerTitle}</h2>
              <p className="mt-4 max-w-[38ch] text-body leading-relaxed text-paper/80">{supply.tagline}</p>
              <Link href={supply.secondaryCta.href} className="btn-primary mt-7 border-transparent">
                Subscribe &amp; save {discountPct}%
              </Link>
            </Reveal>
          </div>

          <Reveal stagger={0.07} className="relative border-t border-paper/15 bg-[#3A2559]">
            <ul className="grid divide-y divide-paper/10 sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4 xl:divide-x">
              {supply.benefits.map((b, i) => (
                <li key={b.title}>
                  <RevealItem className="flex items-center gap-3 px-6 py-4 text-body font-semibold leading-snug sm:px-10 xl:justify-center xl:px-3 xl:py-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-brand-soft" aria-hidden>
                      {PERK_ICONS[i]}
                    </svg>
                    {b.title}
                  </RevealItem>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <p className="mt-6 text-micro font-normal leading-relaxed text-ink/70">
          {compliance.productDisclaimer}
        </p>
      </div>
    </section>
  );
}
