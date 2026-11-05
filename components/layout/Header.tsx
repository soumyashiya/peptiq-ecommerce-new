'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { brand, nav } from '@/lib/content';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { TrustTicker } from '@/components/layout/TrustTicker';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { Wordmark } from '@/components/layout/Wordmark';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const hideChrome = pathname === '/login';
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, logout } = useAuth();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click-outside + Escape closes the account dropdown.
  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAccountOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  // Never leave the panel or search open behind a route change.
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;
  // Transparent header sits on the hero photo, which is dark lavender — the
  // default ink-on-light chrome is unreadable there, so flip it to paper.
  const onHero = !solid;
  const linkHref = (href: string) => (isHome ? href : `/${href.replace(/^#/, '#')}`.replace('//', '/'));

  const handleSignOut = () => {
    logout();
    setAccountOpen(false);
    router.replace('/login');
  };

  if (hideChrome) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ease-smooth ${
        solid
          ? 'bg-paper/[0.72] shadow-[0_1px_0_0_rgba(0,0,0,0.06)] [backdrop-filter:saturate(1.8)_blur(20px)]'
          : 'bg-transparent'
      }`}
    >
      <TrustTicker />

      {/*
        Three-column bar: menu left · wordmark centred · utilities right.
        The outer columns are `flex-1 basis-0 min-w-0` so both sides share the
        leftover width equally and the wordmark stays dead centre.
      */}
      <div className="frame flex h-[72px] items-center gap-4 md:h-[84px]">
        {/* ── Left: burger + label, at every width ── */}
        <div className="flex min-w-0 flex-1 basis-0 items-center">
          <button
            ref={burgerRef}
            // Open-only: the overlay covers this button and carries its own Close.
            onClick={() => setOpen(true)}
            // Hover opens it too, but only for real pointers — touch fires a
            // synthetic mouseenter before click, which would open-then-close.
            onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`group flex items-center gap-4 transition-colors ${onHero ? 'text-paper' : 'text-ink'}`}
          >
            <span className="relative flex h-10 w-7 flex-col items-start justify-center gap-[6px]">
              <span className={`h-px w-7 bg-current transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`h-px bg-current transition-all duration-300 ${open ? 'w-7 opacity-0' : 'w-5 group-hover:w-7'}`} />
              <span className={`h-px w-7 bg-current transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
            <span className="hidden text-label font-bold uppercase sm:inline">
              {nav.menuLabel}
            </span>
          </button>
        </div>

        {/* ── Centre: the shared wordmark (see Wordmark.tsx) ── */}
        <Link
          href={isHome ? '#top' : '/'}
          // On the hero photo a soft shadow keeps the wordmark legible over faces and hair.
          className={`shrink-0 transition-colors ${onHero ? 'text-paper [text-shadow:0_1px_14px_rgba(0,0,0,0.35)]' : 'text-ink'}`}
          aria-label={brand.name}
        >
          <Wordmark />
        </Link>

        {/* ── Right: utilities ── */}
        <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-1 sm:gap-2">

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className={`flex h-10 w-10 items-center justify-center transition-colors ${onHero ? 'text-paper hover:text-brand-lime' : 'text-ink hover:text-brand-teal'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishCount} item${wishCount === 1 ? '' : 's'}`}
            className={`relative hidden h-10 w-10 items-center justify-center transition-colors sm:flex ${onHero ? 'text-paper hover:text-brand-lime' : 'text-ink hover:text-brand-teal'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.3 4.9 13.2a4.5 4.5 0 0 1 6.4-6.3l.7.7.7-.7a4.5 4.5 0 0 1 6.4 6.3Z" />
            </svg>
            <AnimatePresence>
              {wishCount > 0 && (
                <motion.span
                  key={wishCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  aria-hidden
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-lime ring-2 ring-ink/10"
                />
              )}
            </AnimatePresence>
          </Link>

          {/* Account: icon-only, opens dropdown on click when signed in */}
          <div ref={accountRef} className="relative">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-label={`Account, ${user.name}`}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-sky/40"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-sky to-brand text-micro font-semibold text-paper">
                    {user.name.trim().charAt(0).toUpperCase() || 'P'}
                  </span>
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      role="menu"
                      className="absolute right-0 top-12 w-64 origin-top-right overflow-hidden rounded-[12px] border border-line bg-paper shadow-[0_20px_50px_-20px_rgba(10,11,13,0.25)]"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b border-line px-4 py-4">
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-sky to-brand text-body font-semibold text-paper">
                          {user.name.trim().charAt(0).toUpperCase() || 'P'}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-body font-medium text-ink">{user.name}</p>
                          <p className="truncate text-micro text-muted">{user.email}</p>
                        </div>
                      </div>

                      {/* Sign out */}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        role="menuitem"
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-body text-ink transition-colors hover:bg-mist"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                          <path d="M10 17l-5-5 5-5" />
                          <path d="M15 12H5" />
                        </svg>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className={`flex h-10 w-10 items-center justify-center transition-colors ${onHero ? 'text-paper hover:text-brand-lime' : 'text-ink hover:text-brand-teal'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              </Link>
            )}
          </div>

          {/* Cart icon */}
          <button
            onClick={openCart}
            aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
            className={`relative flex h-10 w-10 items-center justify-center transition-colors ${onHero ? 'text-paper hover:text-brand-lime' : 'text-ink hover:text-brand-teal'}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1.2 12.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-label font-semibold tabular-nums text-paper"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>
      </div>

      {/* Scroll progress line */}
      <motion.div style={{ scaleX: progress }} className="h-px w-full origin-left bg-brand-sky" />

      <MenuOverlay open={open} onClose={() => setOpen(false)} linkHref={linkHref} />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
}
