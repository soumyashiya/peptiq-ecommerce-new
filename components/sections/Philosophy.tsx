import Image from 'next/image';
import Link from 'next/link';
import { philosophy } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Philosophy — a full-width soft lavender band: a large heading, two
 * short paragraphs and a pill button on the left, a transparent product
 * cut-out on the right. Stacks text-first on mobile.
 *
 * Site palette: a soft `brand.soft` lavender band that ramps in from and out to
 * the page colour (`brand.wash`) at its top and bottom edges, so neither
 * neighbour meets it on a hard seam; deep-purple heading, ink body copy and
 * the purple primary button.
 */
const BAND =
  'linear-gradient(180deg, #D2BFFC 0%, #E8DDF5 25%, #FAF8F5 50%, #E4D8F0 75%, #D2BFFC 100%)';

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="scroll-mt-28 py-section-sm md:py-section"
      style={{ backgroundImage: BAND }}
    >
      <div className="frame grid items-center gap-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-16">
        <Reveal>
          <h2 className="t-h2 text-balance text-brand-teal">{philosophy.title}</h2>
          <div className="mt-6 space-y-3 text-body text-ink/70">
            {philosophy.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <Link
            href={philosophy.cta.href}
            className="btn-primary mt-8"
          >
            {philosophy.cta.label}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          {/* 3:2 — the exact aspect of the cut-out (1536×1024). */}
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={philosophy.image}
              alt={philosophy.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain drop-shadow-[0_30px_40px_rgba(60,30,120,0.22)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
