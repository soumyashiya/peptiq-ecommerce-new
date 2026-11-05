'use client';

import { useEffect, useState } from 'react';
import type { ProductJanoshik } from '@/lib/content';
import { JanoshikPhotos } from './JanoshikPhotos';

/**
 * Auto-opening modal that surfaces the batch's Janoshik third-party lab
 * report the first time a visitor lands on a product detail page. Session-
 * scoped so it does not nag on subsequent navigations. Styled to peptiq's
 * light theme (paper/ink/muted/brand-teal) rather than the dark reference.
 */
export function JanoshikModal({
  slug,
  productName,
  janoshik,
  photos,
  labTestUrl,
}: {
  slug: string;
  productName: string;
  janoshik: ProductJanoshik;
  photos: string[];
  labTestUrl?: string;
}) {
  const [open, setOpen] = useState(false);

  // Auto-open once per product per session, ~700ms after landing.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `janoshik_lab_popup_${slug}`;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(key);
    } catch {
      /* private-mode / storage disabled — treat as unseen */
    }
    if (seen) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(key, '1');
      } catch {
        /* ignore */
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [slug]);

  // Close on ESC + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} — Janoshik lab analysis`}
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 px-4 py-8 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[12px] border border-line bg-paper shadow-[0_30px_80px_-20px_rgba(10,11,13,0.35)]"
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-muted transition-colors hover:border-brand-teal hover:text-brand-teal"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] bg-brand-teal/10 text-brand-teal">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 2v6.34a2 2 0 0 1-.34 1.11L4.2 16.1A2 2 0 0 0 5.87 19h12.26a2 2 0 0 0 1.67-2.9l-4.46-6.65A2 2 0 0 1 15 8.34V2" />
              <path d="M7 2h10" />
              <path d="M7.5 13h9" />
            </svg>
          </div>

          <h2 className="mt-4 text-center text-h3 font-medium text-ink">
            Janoshik Third-Party Lab Analysis
          </h2>
          <p className="mt-2 text-center text-micro text-muted">
            Independently tested and verified by Janoshik Analytical.
          </p>

          {/* Batch meta */}
          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-line bg-line sm:grid-cols-3">
            <div className="bg-paper px-4 py-3 text-center sm:text-left">
              <dt className="text-label font-medium uppercase tracking-[0.12em] text-muted">
                Batch number
              </dt>
              <dd className="mt-1.5 text-body font-medium text-ink">
                {janoshik.batchNumber}
              </dd>
            </div>
            <div className="bg-paper px-4 py-3 text-center sm:text-left">
              <dt className="text-label font-medium uppercase tracking-[0.12em] text-muted">
                Fill volume
              </dt>
              <dd className="mt-1.5 text-body font-medium text-ink">
                {janoshik.fillVolume}
              </dd>
            </div>
            {janoshik.purity && (
              <div className="bg-paper px-4 py-3 text-center sm:text-left">
                <dt className="text-label font-medium uppercase tracking-[0.12em] text-muted">
                  Purity
                </dt>
                <dd className="mt-1.5 text-body font-semibold text-brand-teal">
                  {janoshik.purity}
                </dd>
              </div>
            )}
          </dl>

          {/* Compounds table */}
          <div className="mt-4 overflow-hidden rounded-[8px] border border-line">
            <table className="w-full text-left text-micro">
              <thead className="bg-mist text-label font-medium uppercase tracking-[0.1em] text-muted">
                <tr>
                  <th className="px-3 py-2.5">Compound</th>
                  <th className="px-3 py-2.5">Concentration</th>
                  <th className="px-3 py-2.5">Verified content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {janoshik.compounds.map((c) => (
                  <tr key={c.name} className="bg-paper">
                    <td className="px-3 py-3 font-medium text-ink">{c.name}</td>
                    <td className="px-3 py-3 text-muted">{c.concentration}</td>
                    <td className="px-3 py-3 font-semibold text-brand-teal">
                      {c.content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-micro leading-relaxed text-muted">
            Concentration is measured per mL; verified content reflects the total assayed
            mass across the stated fill volume.
          </p>
          <JanoshikPhotos images={photos} productName={productName} />
        </div>

        {/* Footer CTA */}
        {labTestUrl && (
          <div className="flex flex-none justify-center border-t border-line px-6 pb-8 pt-5 sm:px-8">
            <a
              href={labTestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[8px] bg-brand-teal px-6 py-3 text-micro font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal/90"
            >
              View full Janoshik report
              <span aria-hidden>↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
