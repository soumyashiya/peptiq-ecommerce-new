import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brand, policies, getPolicy } from '@/lib/content';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return policies.items.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const policy = getPolicy(params.slug);
  if (!policy) return { title: 'Policy not found' };
  return {
    title: policy.title,
    description: policy.summary,
    alternates: { canonical: `/policies/${policy.slug}` },
    openGraph: {
      type: 'article',
      url: `/policies/${policy.slug}`,
      title: `${policy.title} — ${brand.name}`,
      description: policy.summary,
    },
  };
}

export default function PolicyPage({ params }: Params) {
  const policy = getPolicy(params.slug);
  if (!policy) notFound();

  return (
    <main className="pt-28 md:pt-32">
      <div className="frame pb-section-sm md:pb-section">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-micro text-muted">
          <Link href="/" className="transition-colors hover:text-brand-teal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{policy.title}</span>
        </nav>

        {/* Header */}
        <header className="mt-10 max-w-prose lg:mt-14">
          <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
            Legal
          </p>
          <h1 className="mt-4 t-h1">{policy.title}</h1>
          <p className="mt-4 t-lead text-muted">{policy.summary}</p>
          <p className="mt-4 text-micro uppercase tracking-[0.08em] text-muted">
            Last updated {policy.updated}
          </p>
        </header>

        {/* Sections */}
        <div className="mt-12 max-w-prose space-y-10 border-t border-line pt-10">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="t-h3">{section.heading}</h2>
              {section.body.map((para, i) => (
                <p key={i} className="mt-4 text-body text-muted">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Research-use disclaimer */}
        <p className="mt-12 max-w-prose text-micro leading-relaxed text-muted/80">
          All {brand.name} products are supplied for laboratory research and development use only.
          Not for human or veterinary consumption. Questions? Email{' '}
          <a
            href={`mailto:${brand.email}`}
            className="text-brand-teal underline underline-offset-2"
          >
            {brand.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
