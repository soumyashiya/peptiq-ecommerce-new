'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Horizontal scroll-snap rail with arrow controls.
 *
 * Deliberately a real scroll container rather than a transform carousel, so
 * trackpad/touch swiping, keyboard scrolling and scroll-snap all work for free
 * and the arrows just nudge `scrollLeft`. The arrows disable at each end rather
 * than wrapping, so nothing moves when there is nowhere left to go.
 */
export function Rail({
  children,
  label,
  footnote,
}: {
  children: ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  footnote?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 1px of slack absorbs sub-pixel scroll positions at fractional zoom.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', sync);
      observer.disconnect();
    };
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by one card: measure the first child instead of hard-coding a
    // width, so the step stays correct across breakpoints.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/40 md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-between gap-6">
        <p className="text-micro font-normal uppercase tracking-[0.12em] text-muted">
          {footnote}
        </p>
        <div className="flex items-center gap-2">
          <RailButton label="Previous" disabled={atStart} onClick={() => nudge(-1)} flip />
          <RailButton label="Next" disabled={atEnd} onClick={() => nudge(1)} />
        </div>
      </div>
    </div>
  );
}

function RailButton({
  label,
  onClick,
  disabled,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-mist disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={flip ? 'rotate-180' : ''}
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </button>
  );
}
