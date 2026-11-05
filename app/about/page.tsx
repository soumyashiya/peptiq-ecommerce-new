import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { aboutPage, compliance } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: '/about',
    title: aboutPage.metaTitle,
    description: aboutPage.metaDescription,
  },
};

function Photo({ photo }: { photo: { image: string; alt: string; position: string } }) {
  return (
    <Reveal className="relative aspect-[3/2] overflow-hidden rounded-card shadow-[0_18px_40px_rgba(70,46,106,0.22)]">
      <Image
        src={photo.image}
        alt={photo.alt}
        fill
        sizes="(min-width: 700px) 40rem, 100vw"
        style={{ objectPosition: photo.position }}
        // The source shots carry a pale strip down each side edge; a slight zoom
        // crops it off so the photo meets the rounded frame on both sides.
        className="scale-[1.06] object-cover"
      />
    </Reveal>
  );
}

/**
 * About — a full-width banner dissolving into the page lavender, then one narrow
 * column: title, pull quote, photo, the story, a closing statement and photo. The
 * banner is cropped from its top and fades across the upper part of the cartons, so
 * the people come first with just the top of the product showing. From `xl` it runs
 * up behind the fixed header, so no strip of page colour can open above it. Narrower
 * screens keep top padding: the photo is short enough there for the header to cover faces.
 */
export default function AboutPage() {
  return (
    <main className="pb-section-sm pt-24 md:pb-section md:pt-28 xl:pt-0">
      <div className="relative h-[min(38vw,46rem)] w-full overflow-hidden">
        <Image
          src={aboutPage.banner.image}
          alt={aboutPage.banner.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(210,191,252,0)_84%,#D2BFFC_100%)]"
        />
      </div>

      <div className="frame relative mt-4 md:mt-6">
        <div className="mx-auto max-w-[40rem]">
          <Reveal className="text-center">
            <h1 className="t-h1 text-balance text-ink">{aboutPage.title}</h1>
            <p className="mx-auto mt-6 max-w-[34rem] text-lead font-medium italic text-ink/70">{aboutPage.quote}</p>
          </Reveal>

          <div className="mt-10 md:mt-14">
            <Photo photo={aboutPage.photo} />
          </div>

          <Reveal className="mt-12 md:mt-16">
            <p className="text-label font-bold uppercase text-ink/60">{aboutPage.eyebrow}</p>
            <h2 className="mt-3 t-h2 text-ink">{aboutPage.heading}</h2>
          </Reveal>

          <Reveal className="mt-8 space-y-5">
            {aboutPage.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-ink/70">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal className="mt-12 md:mt-16">
            <h2 className="t-h2 text-ink">{aboutPage.statement}</h2>
          </Reveal>

          <div className="mt-8 md:mt-10">
            <Photo photo={aboutPage.closingPhoto} />
          </div>

          <Reveal className="mt-10 text-center">
            <Link href={aboutPage.cta.href} className="btn-primary">
              {aboutPage.cta.label}
            </Link>
            <p className="mt-6 text-micro font-medium text-muted">{compliance.productDisclaimerShort}</p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
