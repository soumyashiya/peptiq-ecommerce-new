'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Modal behaviour shared by the cart drawer, mobile menu, and checkout dialog:
 * Escape to close, focus trap, focus restore, and background scroll lock.
 *
 * Returns a ref to attach to the dialog element. Attach it to the panel, not the
 * scrim, so the trap only cycles the panel's own controls.
 */
export function useModal<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const ref = useRef<T>(null);

  // Kept in a ref so an inline arrow for onClose doesn't re-run the effect
  // (which would re-lock scroll and steal focus back on every parent render).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const node = ref.current;
    const restoreTo = document.activeElement as HTMLElement | null;

    // Lock scroll, compensating for the scrollbar so the page doesn't shift (CLS).
    // `html` has to be locked too: its `overflow-x: clip` stops `overflow` on `body`
    // from reaching the viewport, so the body alone leaves the page scrollable.
    const prevRootOverflow = document.documentElement.style.overflow;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusable = () =>
      Array.from(node?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0
      );

    // Move focus into the panel; fall back to the panel itself when it has no controls.
    const first = focusable()[0];
    if (first) first.focus();
    else node?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;

      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const head = items[0];
      const tail = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === head || active === node)) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && active === tail) {
        e.preventDefault();
        head.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.overflow = prevRootOverflow;
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      // Return focus to whatever opened the modal (the cart button, the burger…).
      restoreTo?.focus?.();
    };
  }, [isOpen]);

  return ref;
}
