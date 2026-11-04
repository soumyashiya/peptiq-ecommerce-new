'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const BARE_ROUTES = ['/login', '/register', '/forgot-password'];

export function ChromeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const bare = BARE_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  return (
    <>
      {/*
        Bare routes are a single form with no nav to skip past, so the link would
        only add a stop for the keyboard users it's meant to help.
      */}
      {!bare && (
        <a
          href="#main-content"
          className="sr-only rounded-full bg-ink px-5 py-3 text-micro font-medium text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:outline-none focus:ring-4 focus:ring-brand-sky/40"
        >
          Skip to content
        </a>
      )}
      {!bare && <Header />}
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      {!bare && <Footer />}
    </>
  );
}
