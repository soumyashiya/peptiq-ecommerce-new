'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart/CartProvider';
import { compliance } from '@/lib/content';

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CartPage() {
  const { items, subtotal, count, setQty, remove } = useCart();

  // Shipping is not currently offered. Kept as a variable so the total logic
  // continues to compose cleanly if fulfilment is re-introduced later.
  const shipping = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="pt-28 md:pt-32">
        <div className="frame flex min-h-[60vh] flex-col items-center justify-center py-section-sm text-center">
          <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">Cart</p>
          <h1 className="mt-3 t-h1">Your cart is empty</h1>
          <p className="mt-4 max-w-md t-lead text-muted">
            Add a research compound before proceeding to checkout. Products are supplied
            strictly for laboratory research — not for human or veterinary use.
          </p>
          <Link
            href="/#products"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-9 py-4 text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
          >
            Browse the catalogue →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 md:pt-32">
      <div className="frame pb-section-sm md:pb-section">
        <nav className="flex items-center gap-2 text-micro text-muted">
          <Link href="/" className="transition-colors hover:text-brand-teal">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">Cart</span>
        </nav>
        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="t-h1">Your cart</h1>
          <span className="text-body text-muted">
            {count} item{count === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          {/* Line items */}
          <ul className="divide-y divide-line lg:col-span-7">
            {items.map((it) => (
              <motion.li
                key={it.slug}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5 py-6"
              >
                <Link
                  href={`/products/${it.slug}`}
                  className="relative h-24 w-24 flex-none overflow-hidden rounded-[6px] bg-mist sm:h-28 sm:w-28"
                >
                  <Image src={it.image} alt={it.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${it.slug}`}
                        className="text-body font-medium leading-snug transition-colors hover:text-brand-teal"
                      >
                        {it.name}
                      </Link>
                      <p className="mt-1 text-micro text-muted tabular-nums">{usd(it.price)} each</p>
                    </div>
                    <span className="text-body font-medium tabular-nums">
                      {usd(it.price * it.qty)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button
                        onClick={() => setQty(it.slug, it.qty - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-body tabular-nums">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.slug, it.qty + 1)}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.slug)}
                      className="text-micro font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-brand"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="rounded-[8px] border border-line bg-mist/40 p-6 md:p-8 lg:sticky lg:top-28">
              <h2 className="text-micro font-medium uppercase tracking-[0.1em] text-ink">
                Order summary
              </h2>

              <div className="mt-6 space-y-2 text-body">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="tabular-nums">{usd(subtotal)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-h3 font-medium">
                  <span>Total</span>
                  <span className="tabular-nums">{usd(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-brand text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
              >
                Proceed to checkout →
              </Link>
              <Link
                href="/#products"
                className="mt-3 flex h-11 w-full items-center justify-center text-micro font-medium uppercase tracking-[0.08em] text-brand-teal link-underline"
              >
                Continue browsing
              </Link>

              <div className="mt-6 space-y-2 text-label leading-relaxed text-muted">
                <p>{compliance.checkoutAcknowledgement}</p>
                <p>{compliance.checkoutMedical}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
