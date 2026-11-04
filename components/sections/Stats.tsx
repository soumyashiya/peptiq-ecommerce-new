'use client';

import { stats } from '@/lib/content';
import { Counter } from '@/components/ui/Counter';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

/**
 * Four figures as a ruled measurement strip.
 *
 * They were four white rounded tiles — the same box as the assurances, the
 * supply benefits and the process steps, three of which appear within a screen
 * of this one. Numbers do not need a container; they need alignment and a
 * baseline, which is what the rules and the mono face give them.
 *
 * The figures are set in the mono face so the digits line up column to column
 * — that is the whole reason the face is loaded, and a row of measurements is
 * exactly the case it exists for.
 */

/** The one figure a third party actually measured — see the lime rule. */
const isVerified = (caption: string) => /janoshik/i.test(caption);

export function Stats() {
  return (
    <section className="py-section-sm">
      <div className="frame">
        <Reveal>
          <p className="text-micro font-normal text-muted">{stats.label}</p>
        </Reveal>

        <Reveal
          stagger={0.08}
          className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.items.map((s) => (
            <RevealItem
              key={s.caption}
              className="border-b border-line px-0 py-7 sm:px-6 sm:first:pl-0 lg:border-l lg:first:border-l-0 lg:px-8"
            >
              <div
                className={`figures text-figure font-semibold ${
                  isVerified(s.caption) ? 'text-brand-teal' : 'text-ink'
                }`}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 max-w-[22ch] text-micro font-normal leading-relaxed text-muted">
                {s.caption}
              </p>
              {isVerified(s.caption) && (
                <span aria-hidden className="mt-3 block h-1 w-10 rounded-full bg-brand-lime" />
              )}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
