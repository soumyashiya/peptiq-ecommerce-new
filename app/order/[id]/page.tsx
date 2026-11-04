'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch, ApiError } from '@/lib/api';
import { compliance } from '@/lib/content';

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const num = (v: unknown): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

const formatDate = (v: unknown) => {
  const raw = typeof v === 'string' || typeof v === 'number' ? v : Date.now();
  return new Date(raw).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type OrderRow = Record<string, unknown>;
type ItemRow = Record<string, unknown>;

type OrderResponse = {
  order?: OrderRow;
  items?: ItemRow[];
};

/** Read a value under several possible field names. */
const pick = <T,>(row: Record<string, unknown> | undefined, keys: string[], cast: (v: unknown) => T): T => {
  if (!row) return cast(undefined);
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return cast(row[k]);
  }
  return cast(undefined);
};

const statusStyles: Record<string, string> = {
  processing: 'bg-brand-sky/10 text-brand-sky',
  pending: 'bg-brand-sky/10 text-brand-sky',
  shipped: 'bg-brand-teal/10 text-brand-teal',
  delivered: 'bg-brand/10 text-brand',
  cancelled: 'bg-brand/10 text-brand',
};

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<OrderResponse | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(undefined);
    setError(null);
    apiFetch<OrderResponse>(`/api/user-orders/${encodeURIComponent(params.id)}`, {
      method: 'GET',
      auth: false,
    })
      .then((res) => {
        if (cancelled) return;
        if (res?.order) setData(res);
        else setData(null);
      })
      .catch((e) => {
        if (cancelled) return;
        const err = e as ApiError;
        if (err.status === 404) setData(null);
        else {
          setError(err.message || 'Could not load order.');
          setData(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (data === undefined) {
    return (
      <main className="pt-32 min-h-screen">
        <div className="frame flex min-h-[40vh] items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-sky" />
        </div>
      </main>
    );
  }

  if (data === null) {
    return (
      <main className="pt-28 md:pt-32">
        <div className="frame flex min-h-[60vh] flex-col items-center justify-center py-section-sm text-center">
          <h1 className="t-h2">Order not found</h1>
          <p className="mt-4 max-w-md t-lead text-muted">
            {error ?? "We couldn't find an order with that reference."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3 text-micro font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-brand-teal hover:text-brand-teal"
            >
              Track by ID
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-micro font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
            >
              Browse products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = data.order!;
  const items = data.items ?? [];

  const orderNumber = pick(order, ['order_number', 'orderNumber', 'id'], str);
  const customerName = pick(order, ['customer_name', 'customerName'], str) ||
    `${pick(order, ['first_name', 'firstName'], str)} ${pick(order, ['last_name', 'lastName'], str)}`.trim();
  const customerEmail = pick(order, ['customer_email', 'customerEmail', 'email'], str);
  const shipAddress = pick(order, ['shipping_address', 'shipping_line1', 'address', 'address_line1'], str);
  const shipCity = pick(order, ['shipping_city', 'city'], str);
  const shipPostcode = pick(order, ['shipping_postcode', 'shipping_zip', 'postcode', 'zip'], str);
  const shipCountry = pick(order, ['shipping_country', 'country'], str);
  const status = pick(order, ['status', 'order_status'], str).toLowerCase() || 'processing';
  const createdAt = pick(order, ['created_at', 'createdAt'], (v) => v);

  const subtotal = pick(order, ['subtotal'], num);
  const shipping = pick(order, ['shipping_fee', 'shipping'], num);
  const discount = pick(order, ['discount_amount', 'discount'], num);
  const total = pick(order, ['total'], num);
  const totalQty = items.reduce((n, it) => n + pick(it, ['quantity', 'qty'], num), 0);

  return (
    <main className="pt-28 md:pt-32">
      <div className="frame pb-section-sm md:pb-section">
        {/* Confirmation banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[10px] bg-paper p-8 md:p-12"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5 sm:items-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                className="mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-teal text-paper sm:mt-0 sm:h-14 sm:w-14"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </motion.span>
              <div className="min-w-0">
                <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
                  Order confirmed
                </p>
                <h1 className="mt-1 t-h2 break-all sm:break-normal">
                  {orderNumber}
                </h1>
                <p className="mt-1 text-micro text-muted">Placed {formatDate(createdAt)}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-micro uppercase tracking-[0.1em] text-muted">Order total</p>
              <p className="mt-1 t-h2 tabular-nums">
                {usd(total)}
              </p>
            </div>
          </div>

          {customerEmail && (
            <p className="mt-8 max-w-2xl text-body text-muted">
              Thank you. A confirmation has been sent to{' '}
              <span className="font-medium text-ink">{customerEmail}</span>. Our research
              team will follow up with next steps for your order.
            </p>
          )}
        </motion.div>

        {/* Details grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Items */}
          <section className="rounded-[10px] bg-paper p-6 md:p-8 lg:col-span-7">
            <h2 className="text-micro font-medium uppercase tracking-[0.1em] text-ink">
              Items ({totalQty})
            </h2>
            <ul className="mt-5 divide-y divide-line">
              {items.map((it, i) => {
                const name = pick(it, ['name', 'title', 'product_name'], str);
                const qty = pick(it, ['quantity', 'qty'], num);
                const price = pick(it, ['unit_price', 'price'], num);
                return (
                  <li key={`${name}-${i}`} className="flex items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="text-body font-medium leading-snug">{name}</p>
                      <p className="mt-0.5 text-micro text-muted">Qty {qty}</p>
                    </div>
                    <span className="flex-none text-body tabular-nums">
                      {usd(price * qty)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-2 border-t border-line pt-6 text-body">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="tabular-nums">{usd(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Discount</span>
                  <span className="tabular-nums text-brand-teal">−{usd(discount)}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Handling</span>
                  <span className="tabular-nums">{usd(shipping)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-h3 font-medium">
                <span>Total</span>
                <span className="tabular-nums">{usd(total)}</span>
              </div>
            </div>
          </section>

          {/* Shipping + status */}
          <div className="space-y-6 lg:col-span-5">
            {(customerName || shipAddress) && (
              <section className="rounded-[10px] bg-paper p-6 md:p-8">
                <h2 className="text-micro font-medium uppercase tracking-[0.1em] text-ink">
                  Contact address
                </h2>
                <address className="mt-4 not-italic text-body leading-relaxed text-ink">
                  {customerName && <span className="block font-medium">{customerName}</span>}
                  {shipAddress && <span className="mt-1 block">{shipAddress}</span>}
                  {(shipCity || shipPostcode) && (
                    <span className="block">
                      {[shipCity, shipPostcode].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {shipCountry && <span className="block">{shipCountry}</span>}
                </address>
              </section>
            )}

            <section className="rounded-[10px] bg-paper p-6 md:p-8">
              <h2 className="text-micro font-medium uppercase tracking-[0.1em] text-ink">Status</h2>
              <p
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-micro font-medium uppercase tracking-[0.08em] ${
                  statusStyles[status] ?? 'bg-brand-sky/10 text-brand-sky'
                }`}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                {status}
              </p>
              <p className="mt-4 text-micro text-muted">
                Our research team will follow up with next steps for your order.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-micro font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand-teal"
          >
            Continue browsing →
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-8 py-3 text-micro font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-brand-teal hover:text-brand-teal"
          >
            Track another order
          </Link>
        </div>

        {/* Mandatory research-use notice on the confirmed order page */}
        <aside
          role="note"
          aria-label="Research-use disclaimer"
          className="mx-auto mt-10 max-w-3xl rounded-[10px] bg-paper p-6 text-center"
        >
          <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
            Research-use notice
          </p>
          <p className="mt-3 text-micro leading-relaxed text-muted">
            {compliance.checkoutAcknowledgement} {compliance.checkoutMedical}
          </p>
        </aside>
      </div>
    </main>
  );
}
