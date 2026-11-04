import Link from 'next/link';
import { merch, getProducts } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { ProductCard } from '@/components/products/ProductCard';

/** "New arrivals" — a static grid rather than a rail, since it holds few items. */
export function NewArrivals() {
  const items = getProducts(merch.newArrivals.slugs);

  return (
    <section className="py-section-sm">
      <div className="frame">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.5 13.7 9l6.3 1.5-6.3 1.6L12 21.5 10.3 12.1 4 10.5 10.3 9Z" />
            </svg>
            {merch.newArrivals.label}
          </span>
          <h2 className="mt-5 t-h2">
            {merch.newArrivals.title}
          </h2>
          <p className="mt-5 t-lead text-muted">
            {merch.newArrivals.subtitle}
          </p>
        </div>

        {/* Three cards only, under a centred heading, so it holds at three
            tracks rather than taking `.product-grid`'s fourth — the cap is what
            brings each card down to the ~350px the rest of the site sets. */}
        <div className="product-grid mx-auto mt-14 max-w-[1130px] xl:grid-cols-3">
          {items.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href={merch.newArrivals.ctaHref} className="btn-primary">
            {merch.newArrivals.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
