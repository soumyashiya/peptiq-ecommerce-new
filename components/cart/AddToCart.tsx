'use client';

import { useState } from 'react';
import { useCart, type CartItem } from './CartProvider';

export function AddToCart({ product }: { product: Omit<CartItem, 'qty'> }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-row items-center gap-3 sm:gap-4">
      {/* qty stepper */}
      <div className="inline-flex h-14 w-36 items-center justify-between rounded-full border border-line px-2">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-mist hover:text-ink"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-body tabular-nums">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-mist hover:text-ink"
        >
          +
        </button>
      </div>

      <button
        onClick={() => add(product, qty)}
        className="group flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-brand px-9 text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors duration-300 hover:bg-brand-teal"
      >
        Add to cart
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </button>
    </div>
  );
}
