import Image from 'next/image';
import Link from 'next/link';
import { assurances } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * "Why Peptiq" — six assurance cards flanking a centred portrait.
 *
 * Every card is left-aligned on both sides (the copy reads as a list, not a
 * mirrored pair). Below `lg` the portrait moves above the cards and the cards
 * stack as a two-up grid.
 *
 * Sits directly on the lavender page, which is the saturated surface the
 * frosted panels need in order to read as glass.
 */

const ICONS = [
  // Verified sourcing — shield with check
  <path key="a" d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3ZM9 12l2.2 2.2L15.5 10" />,
  // Lab-tested purity — flask
  <path key="b" d="M10 3h4M11 3v6.2L5.8 18A2 2 0 0 0 7.5 21h9a2 2 0 0 0 1.7-3L13 9.2V3M8.5 15h7" />,
  // Pre-filled pens — pen
  <path key="c" d="m14.5 4.5 5 5M17 7 7.5 16.5 4 20l3.5-3.5M12 7.5l4.5 4.5M9.5 10l4.5 4.5" />,
  // Sealed cold packaging — snowflake
  <path key="d" d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4 12 6.5 14.5 4M9.5 20 12 17.5l2.5 2.5M4.6 10.4l3.3.9-.9 3.3M19.4 13.6l-3.3-.9.9-3.3" />,
  // Documentation included — document
  <path key="e" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h4" />,
  // Batch traceability — barcode
  <path key="f" d="M4 6v12M7 6v12M10.5 6v12M13 6v12M16.5 6v12M20 6v12" />,
];

type Item = (typeof assurances.items)[number];

/**
 * One frosted card. `side` mirrors it: the left column is right-aligned with
 * its icon on the inner edge, the right column is left-aligned with its icon
 * on its own inner edge, so both columns point in toward the portrait between
 * them. Aligning both columns left — as this did — left a ragged gutter down
 * the middle of the section and made the two sides look unrelated.
 */
function Card({
  item,
  icon,
  delay,
  side,
}: {
  item: Item;
  icon: React.ReactNode;
  delay: number;
  side: 'left' | 'right';
}) {
  /*
   * Mirroring is desktop-only. Below `lg` the portrait moves above the cards
   * and both columns stack into one two-up grid — with nothing between them to
   * point at, right-aligned copy would just read as a mistake.
   */
  const inner =
    side === 'left' ? 'items-start text-left lg:items-end lg:text-right' : 'items-start text-left';

  return (
    <Reveal delay={delay} className="glass p-6 lg:p-7">
      <div className={`flex flex-col ${inner}`}>
        <span aria-hidden className="icon-chip">
          <Icon>{icon}</Icon>
        </span>
        <h3 className="mt-4 t-h3 text-ink">{item.title}</h3>
        <p className="mt-2 text-micro font-medium leading-relaxed text-ink/65">{item.body}</p>
      </div>
    </Reveal>
  );
}

export function Assurances() {
  const left = assurances.items.slice(0, 3);
  const right = assurances.items.slice(3, 6);

  return (
    <section
      id="assurances"
      className="relative scroll-mt-28 overflow-hidden py-section-sm"
    >
      <div className="frame">
        <div className="text-center">
          <span className="pill-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal" aria-hidden>
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
            </svg>
            {assurances.label}
          </span>
          {/*
            On the band, support copy is `ink` at reduced opacity rather than
            `muted` (#6E6880), which only reaches ~4:1 against #D2BFFC. The
            accent is `brand.teal` for the same reason — `brand` purple drops
            to ~4:1 here, where it clears 6:1 on white.
          */}
          <h2 className="mt-5 text-balance t-h1 text-ink">
            {assurances.title} <span className="font-bold text-brand-teal">{assurances.titleAccent}</span>
          </h2>
          <p className="mt-4 t-lead text-ink/70">
            {assurances.subtitle}
          </p>
        </div>

        {/* Full frame width, so the card columns line up with the header's gutters. */}
        <div className="mt-12 grid items-center gap-5 lg:mt-14 lg:grid-cols-[1fr_minmax(380px,620px)_1fr] lg:gap-6">
          {/*
           * Centre portrait — first on mobile, middle column on desktop.
           *
           * The box matches the cut-out's own ratio (1328×1760 ≈ 3:4), so
           * `object-contain` fills it with no dead space above the figure.
           */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[440px] lg:order-2 lg:max-w-[520px]">
            {/* Soft lavender disc and a thin orbit line behind the portrait. */}
            <span
              aria-hidden
              className="absolute left-[8%] top-[22%] h-[62%] w-[84%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,rgba(210,191,252,0.22)_50%,rgba(210,191,252,0)_72%)]"
            />
            <span
              aria-hidden
              className="absolute left-[-6%] top-[24%] h-[56%] w-[112%] -rotate-[28deg] rounded-[50%] border border-brand/30"
            />
            <Image
              src={assurances.image}
              alt={assurances.imageAlt}
              fill
              sizes="(min-width: 1024px) 620px, 500px"
              className="object-contain object-bottom"
              // The portrait is cropped at the waist; fade that hard edge out.
              style={{
                maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              }}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
            {left.map((item, i) => (
              <Card key={item.title} item={item} icon={ICONS[i]} delay={i * 0.08} side="left" />
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:order-3 lg:grid-cols-1">
            {right.map((item, i) => (
              <Card key={item.title} item={item} icon={ICONS[i + 3]} delay={i * 0.08} side="right" />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          {/* The lime `.btn-primary`. A purple pill on a purple band had almost
              no separation from its own background; lime with the 2px ink
              border is what the band is built to carry. */}
          <Link href={assurances.cta.href} className="btn-primary">
            {assurances.cta.label}
          </Link>
          <p className="mt-5 text-micro font-normal text-ink/70">{assurances.note}</p>
        </div>
      </div>
    </section>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
