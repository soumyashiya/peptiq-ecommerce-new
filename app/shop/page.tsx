import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { brand, shop, products, compliance } from '@/lib/content';
import { ShopGrid } from '@/components/shop/ShopGrid';

const SITE_URL = 'https://peptiq.org';

export const metadata: Metadata = {
  title: 'Shop',
  description: `${shop.subtitle} ${compliance.productDisclaimerShort}`,
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    url: '/shop',
    title: `Shop — ${brand.name}`,
    description: shop.subtitle,
  },
};

export default function ShopPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Shop — ${brand.name}`,
    url: `${SITE_URL}/shop`,
    hasPart: products.items.map((item) => ({
      '@type': 'Product',
      name: item.name,
      url: `${SITE_URL}/products/${item.slug}`,
      image: `${SITE_URL}${item.image}`,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: item.price,
        availability: 'https://schema.org/InStock',
      },
    })),
  };

  return (
    <main className="pt-28 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="frame pb-section-sm md:pb-section">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-micro text-muted">
          <Link href="/" className="transition-colors hover:text-brand-teal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">Shop</span>
        </nav>

        {/* Hero */}
        <header className="mt-10 max-w-3xl lg:mt-14">
          <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
            {shop.label}
          </p>
          <h1 className="mt-4 t-h1">{shop.title}</h1>
          <p className="mt-4 t-lead text-muted">{shop.subtitle}</p>
        </header>

        {/* Grid — ShopGrid reads its filters from the URL via useSearchParams,
            which needs a Suspense boundary to keep this page statically rendered. */}
        <div className="mt-14 lg:mt-16">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-sky" />
              </div>
            }
          >
            <ShopGrid />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
