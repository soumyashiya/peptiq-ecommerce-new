'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthProvider';

/**
 * Routes that can be reached without a session.
 * Exact matches for standalone pages; prefixes (ending in `/`) for
 * dynamic sections like `/products/[slug]` or `/policies/[slug]`.
 */
const PUBLIC_EXACT = [
  '/',
  '/about',
  '/shop',
  '/login',
  '/register',
  '/forgot-password',
  '/cart',
  '/checkout',
  '/track-order',
  '/wishlist',
];
// `/payment-capture/` is authorized by the opaque token in the emailed URL, not
// by a session — gating it behind login would make every payment link dead.
const PUBLIC_PREFIXES = [
  '/products/',
  '/policies/',
  '/checkout/',
  '/order/',
  '/payment-capture/',
];

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Redirects unauthenticated visitors to /login before any children render.
 * Children remain unmounted while the visitor is unauthenticated, so no
 * protected content is ever painted.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuth();

  const isPublic = isPublicPath(pathname);
  const showChildren = isPublic || (hydrated && !!user);

  useEffect(() => {
    if (!hydrated) return;
    if (isPublic) return;
    if (user) return;
    router.replace('/login');
  }, [hydrated, user, isPublic, pathname, router]);

  if (!showChildren) {
    // Minimal splash — avoids a flash of protected content before redirect.
    return (
      <div className="fixed inset-0 grid place-items-center bg-paper">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-sky" />
          <span className="text-micro font-medium uppercase tracking-[0.14em] text-muted">
            Loading
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
