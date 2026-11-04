import Link from 'next/link';
import { process } from '@/lib/content';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

/**
 * "How each pen is prepared" — a lavender band that lightens toward the bottom
 * and hands over to `News`. Left: pill eyebrow, heading, subtitle and
 * the lime CTA. Right: the three steps as frosted glass rows, each with a large
 * ghosted numeral beside its title and description.
 *
 * The steps are a real sequence (you cannot seal before you verify), so they
 * stay an ordered list; the numerals are the sequence.
 */
// Page colour through the middle, lightening only toward the bottom. It ends on
// pale lavender, and `News` starts on the same colour, so there is no seam.
const BAND = 'linear-gradient(180deg, #D2BFFC 0%, #D2BFFC 45%, #F1EBFC 100%)';

export function Process() {
  return (
    <section id="process" className="scroll-mt-28 py-section-sm md:py-section" style={{ backgroundImage: BAND }}>
      {/* Both columns capped and centred as a pair, so the rows don't stretch edge to edge. */}
      <div className="frame grid items-center gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,40rem)] lg:justify-center lg:gap-16">
        <Reveal>
          <span className="pill-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
            </svg>
            {process.eyebrow}
          </span>
          <h2 className="t-h1 mt-5 text-ink">{process.title}</h2>
          <p className="mt-5 max-w-[26rem] text-body text-muted">{process.subtitle}</p>
          <Link href={process.cta.href} className="btn-primary mt-8">
            {process.cta.label}
          </Link>
        </Reveal>

        <Reveal stagger={0.1} as="div">
          <ol className="space-y-3">
            {process.steps.map((s, i) => (
              <li key={s.title}>
                <RevealItem>
                  <div className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-[1.25rem] border border-paper/70 bg-paper/40 px-6 py-6 backdrop-blur-md transition-colors duration-500 hover:bg-paper/65 sm:grid-cols-[7rem_1fr] sm:px-8 md:py-7">
                    <span
                      aria-hidden
                      className="text-center font-display text-[clamp(3.25rem,5.6vw,5rem)] font-normal leading-none text-ink/10 transition-colors duration-500 group-hover:text-brand/30"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-h3 font-bold tracking-tight text-ink">{s.title}</h3>
                      <p className="mt-1 text-micro font-medium leading-relaxed text-muted">{s.body}</p>
                    </div>
                  </div>
                </RevealItem>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
