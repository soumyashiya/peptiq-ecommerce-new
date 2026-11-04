import Image from 'next/image';
import { story } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

function Stat({ fact, className }: { fact: (typeof story.facts)[number]; className: string }) {
  return (
    <Reveal className={`glass absolute z-10 flex h-[7.25rem] w-44 flex-col justify-center bg-paper/85 px-4 ${className}`}>
      <p className="figures text-[clamp(1.375rem,2vw,1.875rem)] font-medium leading-none text-ink">{fact.value}</p>
      <p className="mt-1.5 text-micro font-medium leading-snug text-muted">{fact.label}</p>
    </Reveal>
  );
}

function Panel({ panel, sizes, className }: { panel: (typeof story.bannerPanels)[number]; sizes: string; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] ${className}`}>
      <Image
        src={story.bannerImage}
        alt={panel.alt}
        fill
        sizes={sizes}
        style={{ objectPosition: panel.position }}
        className="object-cover"
      />
    </div>
  );
}

/**
 * About — the heading across the top left, then a photo, the founding paragraph
 * with its CTA, and a taller photo that rises to the top of the section. The photos
 * are the two halves of the client's banner, one model each, and `story.facts` sit
 * on them as floating cards. Phones stack it in reading order.
 *
 * `object-cover` scales these crops by height, so the image renders far wider than
 * its box: `sizes` has to allow for that, or the browser picks a blurry file.
 *
 * The figures are `story.facts` — keep them to numbers the business can back.
 */
export function Story() {
  const [formulations, units, purity] = story.facts;
  const [first, second] = story.bannerPanels;

  return (
    <section id="story" className="relative scroll-mt-28 py-section-sm">
      <div className="frame grid gap-y-12 lg:grid-cols-[1fr_1fr_1.1fr] lg:gap-x-10">
        <Reveal className="lg:col-span-2">
          <span className="pill-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            {story.eyebrow}
          </span>
          <h2 className="t-h1 mt-6 text-ink">
            {story.headlineA}
            <br />
            <span className="text-brand">{story.headlineB}</span>
          </h2>
        </Reveal>

        <div className="relative">
          <Panel panel={first} sizes="(min-width: 1024px) 75vw, 250vw" className="aspect-[4/5]" />
          <Stat fact={formulations} className="-top-5 left-4" />
        </div>

        <Reveal className="lg:self-center">
          <p className="text-body font-medium text-ink/80 xl:text-lead">{story.founding}</p>
          <a href={story.cta.href} className="btn-primary group mt-8">
            {story.cta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
        </Reveal>

        <div className="relative lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-end">
          <Panel panel={second} sizes="(min-width: 1024px) 90vw, 300vw" className="aspect-[2/3]" />
          <Stat fact={units} className="-top-8 left-4 lg:-left-6 lg:-top-10" />
          <Stat fact={purity} className="-bottom-5 right-4 lg:-bottom-6 lg:right-6" />
        </div>
      </div>
    </section>
  );
}
