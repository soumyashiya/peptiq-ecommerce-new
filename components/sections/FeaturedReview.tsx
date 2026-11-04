import Image from 'next/image';
import Link from 'next/link';
import { featuredReview, news, getProducts } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Featured review — oversized centred headline; below it, as a centred block, two product
 * thumbnails with the reviewer's name and stars, a tall lab photo, and the
 * quote set beside a large purple quote mark.
 *
 * The quote and its star count come from `news.items[featuredReview.reviewIndex]`,
 * so this band never states a review the testimonials section doesn't.
 */
function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" className={i < n ? 'fill-brand' : 'fill-line'}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function FeaturedReview() {
  const review = news.items[featuredReview.reviewIndex];
  const thumbs = getProducts(featuredReview.thumbs);
  if (!review) return null;

  return (
    <section id="featured-review" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        <Reveal>
          <h2 className="mx-auto max-w-[18ch] text-center font-display text-[clamp(2.5rem,5.5vw,5rem)] font-normal uppercase leading-[0.92] tracking-tight text-ink">
            {featuredReview.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[1100px] items-end gap-8 md:grid-cols-[1fr_minmax(0,24rem)_1fr] lg:gap-10">
          {/* Left — thumbnails, then the reviewer */}
          <Reveal className="flex h-full flex-col justify-between gap-8">
            <div className="grid grid-cols-2 gap-3">
              {thumbs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  aria-label={p.name}
                  className="group relative aspect-[4/5] overflow-hidden bg-brand-soft/40"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 768px) 14vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
                  />
                </Link>
              ))}
            </div>
            <div>
              <p className="text-body font-semibold text-ink">{review.name}</p>
              <div className="mt-2 flex items-center gap-2" aria-label={`${review.rating} out of 5`}>
                <Stars n={review.rating} />
                <span className="figures text-micro font-semibold text-ink">{review.rating.toFixed(1)}</span>
              </div>
              <p className="mt-1 text-micro text-muted">
                {review.role} · {review.org}
              </p>
            </div>
          </Reveal>

          {/* Centre — the photo */}
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-soft/40">
              <Image
                src={featuredReview.photo}
                alt={featuredReview.photoAlt}
                fill
                sizes="(min-width: 768px) 384px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Right — the quote */}
          <Reveal delay={0.14} className="pb-2">
            <svg width="64" height="48" viewBox="0 0 64 48" className="fill-brand" aria-hidden>
              <path d="M0 48V28C0 12.5 7.6 3.2 22.8 0l3 6.4C17.4 9 13.3 14 12.6 21.6H26V48H0Zm38 0V28C38 12.5 45.6 3.2 60.8 0l3 6.4C55.4 9 51.3 14 50.6 21.6H64V48H38Z" />
            </svg>
            <blockquote className="mt-5 max-w-[30ch] text-body leading-relaxed text-ink/80">
              “{review.quote}”
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
