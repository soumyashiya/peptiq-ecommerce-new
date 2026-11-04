'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand, footer } from '@/lib/content';
import { NewsletterForm } from './NewsletterForm';
import { Wordmark } from './Wordmark';

/** Route or in-page anchor → correct link element. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:');
  const className = 'text-nav font-semibold text-muted transition-colors hover:text-ink';
  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <footer className="bg-paper">
      <div className="frame py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            {/*
              The shared lockup. This column used to carry a completely
              different mark — a purple hexagon chip beside a two-tone
              `Pept<span>iq</span>` — so the header and the footer advertised
              two different companies on the same page.
            */}
            <Link href="/" className="inline-block text-ink">
              <Wordmark align="start" size="sm" />
            </Link>
            {/* `brand.tagline` is stored uppercase; sentence-case it here so the
                footer doesn't shout. */}
            <p className="mt-6 max-w-xs text-body font-normal text-muted first-letter:uppercase">
              {brand.tagline.toLowerCase()}
            </p>
            <div className="mt-7 space-y-1.5 text-body text-muted">
              <p>
                <a href={`mailto:${brand.email}`} className="transition-colors hover:text-ink">
                  {brand.email}
                </a>
              </p>
              <p>{brand.address}</p>
            </div>
            <NewsletterForm />

            <p className="section-meta mt-8">Est. {brand.established}</p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              {/* Sentence case. Four tracked-out uppercase column heads above
                  four lists of sentence-case links made the heads read as the
                  louder content. */}
              <h3 className="text-label font-bold uppercase text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label + l.href}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-micro font-medium text-muted md:flex-row md:items-center">
          {/*
            `brand.suffix` is an empty string, so interpolating it with spaces
            around it rendered "Peptiq . All rights reserved." — join the parts
            and drop the blanks instead of hard-coding a space.
          */}
          <p>
            © {brand.established}–2026 {[brand.name, brand.suffix].filter(Boolean).join(' ')}. All
            rights reserved. For laboratory research use only.
          </p>
          <ul className="flex flex-wrap gap-6">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
