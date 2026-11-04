'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter an order reference.');
      return;
    }
    router.push(`/order/${trimmed}`);
  };

  return (
    <main className="pt-24 md:pt-32">
      <div className="frame grid min-h-[70vh] place-items-center pb-section-sm md:pb-section">
        <div className="w-full max-w-[460px]">
          <Link
            href="/"
            className="text-micro font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-brand-teal"
          >
            ← Back to home
          </Link>

          <div className="mt-8">
            <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
              Support
            </p>
            <h1 className="mt-3 t-h1">Track your order</h1>
            <p className="mt-3 text-body text-muted">
              Enter the reference number from your confirmation email (starts with{' '}
              <span className="font-medium text-ink">PQ-</span>).
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-micro font-medium uppercase tracking-[0.06em] text-muted">
                Order reference
              </span>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setError(null);
                }}
                placeholder="PQ-A1B2C3-456"
                className="h-12 w-full rounded-[6px] border border-line bg-mist/40 px-4 text-body uppercase tracking-wider text-ink outline-none transition-all duration-200 focus:border-brand-sky focus:bg-paper focus:ring-4 focus:ring-brand-sky/10"
              />
            </label>

            {error && (
              <div className="rounded-[6px] border border-brand/30 bg-brand/5 px-4 py-3 text-micro text-brand">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-brand text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
            >
              Track order
            </button>
          </form>

          <p className="mt-10 rounded-[8px] border border-line bg-mist/40 p-5 text-micro leading-relaxed text-muted">
            The reference is included in the confirmation email sent after every order.
          </p>
        </div>
      </div>
    </main>
  );
}
