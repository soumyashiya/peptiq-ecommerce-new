'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from './CartProvider';
import { useModal } from '@/components/ui/useModal';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export function CartDrawer() {
  const { items, subtotal, count, isOpen, closeCart, setQty, remove } = useCart();
  const panelRef = useModal<HTMLElement>(isOpen, closeCart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* scrim — decorative; Escape and the close button are the accessible paths out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
          />

          {/* panel */}
          <motion.aside
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[440px] flex-col bg-paper shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="cart-drawer-title" className="text-body font-medium uppercase tracking-[0.1em]">
                Cart <span className="text-muted">({count})</span>
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-mist hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="t-lead text-muted">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="text-body font-medium uppercase tracking-[0.08em] text-brand-teal link-underline"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-line overflow-y-auto px-6">
                {items.map((it) => (
                  <div key={it.slug} className="flex gap-4 py-5">
                    <Link
                      href={`/products/${it.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 flex-none overflow-hidden rounded-[4px] bg-mist"
                    >
                      <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/products/${it.slug}`}
                          onClick={closeCart}
                          className="text-body font-medium leading-snug hover:text-brand-teal"
                        >
                          {it.name}
                        </Link>
                        <button
                          onClick={() => remove(it.slug)}
                          aria-label={`Remove ${it.name}`}
                          className="flex-none text-micro text-muted transition-colors hover:text-brand"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        {/* qty stepper */}
                        <div className="inline-flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(it.slug, it.qty - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-body tabular-nums">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.slug, it.qty + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-body font-medium tabular-nums">
                          {usd(it.price * it.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* footer */}
            {items.length > 0 && (
              <div className="border-t border-line px-6 py-6">
                <div className="flex items-center justify-between text-body">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium tabular-nums">{usd(subtotal)}</span>
                </div>
                <p className="mt-1.5 text-micro text-muted">
                  Totals calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-brand py-4 text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
                >
                  Checkout
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-3 flex w-full items-center justify-center py-3 text-micro font-medium uppercase tracking-[0.08em] text-brand-teal link-underline"
                >
                  View full cart
                </Link>
                <p className="mt-4 text-center text-label leading-relaxed text-muted">
                  For laboratory research use only. Not for human or veterinary consumption.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
