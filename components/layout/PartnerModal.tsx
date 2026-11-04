'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { compliance, partnerModal } from '@/lib/content';
import { useModal } from '@/components/ui/useModal';

const KEY = 'peptiq-partner-modal';

/**
 * The partnership notice a visitor sees on arriving at the homepage. Session-scoped
 * so it doesn't nag, and homepage-only so it can't stack on the product page's lab
 * report modal or interrupt checkout and emailed payment links.
 */
export function PartnerModal() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const panelRef = useModal<HTMLDivElement>(open, close);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {
      /* private-mode / storage disabled — treat as unseen */
    }
    if (seen) return;

    // Opens once the photo is ready, so the panel never appears with an empty half.
    // A photo that fails to load still opens it, on the panel's own colour.
    let cancelled = false;
    const photo = new window.Image();
    photo.src = partnerModal.image;
    Promise.all([
      photo.decode().catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, 700)),
    ]).then(() => {
      if (cancelled) return;
      setOpen(true);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* ignore */
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={close}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-full w-full max-w-[60rem] overflow-y-auto rounded-[18px] bg-[#462E6A] md:grid-cols-2"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/50 text-paper transition-colors hover:bg-ink/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="relative h-56 md:h-auto">
              <Image
                src={partnerModal.image}
                alt={partnerModal.imageAlt}
                fill
                unoptimized
                style={{ objectPosition: partnerModal.imagePosition }}
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(70,46,106,0)_88%,#462E6A_100%)] md:bg-[linear-gradient(90deg,rgba(70,46,106,0)_86%,#462E6A_100%)]"
              />
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-label font-bold uppercase text-brand-lime">{partnerModal.eyebrow}</p>
              <p className="mt-4 font-display text-[2rem] leading-none text-paper">{partnerModal.logo}</p>
              <p className="mt-1 text-label font-bold uppercase text-paper/80">{partnerModal.logoSub}</p>
              <h2 id="partner-modal-title" className="mt-5 t-h2-sm text-paper">
                {partnerModal.title}
              </h2>
              <p className="mt-4 text-body text-paper/80">{partnerModal.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {partnerModal.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-paper/30 px-3.5 py-1.5 text-micro font-semibold text-paper">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={partnerModal.shopCta.href} onClick={close} className="btn-primary">
                  {partnerModal.shopCta.label}
                </Link>
                <a href={partnerModal.verifyCta.href} onClick={close} className="link-underline text-body font-semibold text-paper">
                  {partnerModal.verifyCta.label}
                </a>
              </div>
              <p className="mt-5 text-micro text-paper/70">{compliance.productDisclaimerShort}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
