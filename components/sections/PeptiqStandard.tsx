import { peptiqStandard } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { StandardExplorer } from './StandardStory';

/**
 * "The Peptiq standard" — the brand band between the About section and the
 * assurance grid, on the page lavender inside the header's gutters: one large photo
 * with a product on it, beside the heading and the batch's three stages.
 */
export function PeptiqStandard() {
  return (
    <section id="standard" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        <StandardExplorer>
          <Reveal>
            <span className="pill-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              {peptiqStandard.label}
            </span>
            <h2 className="mt-5 t-h1 text-ink">
              {peptiqStandard.headlineA}
              <br />
              {peptiqStandard.headlineB}
            </h2>
            <p className="mt-5 max-w-[46ch] text-body text-ink/70">{peptiqStandard.body}</p>
          </Reveal>
        </StandardExplorer>
      </div>
    </section>
  );
}
