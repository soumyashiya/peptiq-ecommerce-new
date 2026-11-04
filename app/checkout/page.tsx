'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiFetch, ApiError } from '@/lib/api';
import { useModal } from '@/components/ui/useModal';
import { compliance } from '@/lib/content';

const NOOP = () => {};

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Field({
  name,
  label,
  type = 'text',
  required,
  autoComplete,
  defaultValue,
  placeholder,
  optional,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  optional?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-2 block text-micro text-ink">
        {label}
        {optional && <span className="ml-1 text-muted">(optional)</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-transparent bg-paper px-5 text-body text-ink placeholder:text-muted/70 outline-none transition-all duration-200 focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
      />
    </label>
  );
}

type Confirmed = { orderNumber: string; total: number; email: string };

type PromoResponse = { ok: boolean; valid: boolean; percent: number };
type ConfirmedOrderItem = {
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};
type UserOrderResponse = {
  success: boolean;
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  currency: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  items: ConfirmedOrderItem[];
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const [promo, setPromo] = useState('');
  const [promoPercent, setPromoPercent] = useState(0);
  const [promoAppliedCode, setPromoAppliedCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // The order is already placed by the time this dialog shows, so there is nothing
  // to dismiss — no-op the close and use the hook purely for focus + scroll lock.
  const confirmRef = useModal<HTMLDivElement>(Boolean(confirmed), NOOP);

  // Shipping is not currently offered. Kept as a variable so the total logic
  // continues to compose cleanly if fulfilment is re-introduced later.
  const shipping = 0;
  const discount = Math.round(subtotal * (promoPercent / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyPromo = async () => {
    const code = promo.trim();
    if (!code) return;
    setPromoError(null);
    setPromoLoading(true);
    try {
      const res = await apiFetch<PromoResponse>('/api/promos/validate', {
        method: 'POST',
        json: { code },
        auth: false,
      });
      if (res?.valid && res.percent > 0) {
        setPromoPercent(res.percent);
        setPromoAppliedCode(code.toUpperCase());
      } else {
        setPromoPercent(0);
        setPromoAppliedCode('');
        setPromoError('Promo code not valid.');
      }
    } catch (e) {
      const err = e as ApiError;
      setPromoPercent(0);
      setPromoAppliedCode('');
      setPromoError(err.status === 404 ? 'Promo code not found.' : err.message || 'Could not validate.');
    } finally {
      setPromoLoading(false);
    }
  };

  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitError(null);
    setSubmitting(true);

    const raw = new FormData(e.currentTarget);
    const val = (k: string) => (raw.get(k) as string | null)?.trim() ?? '';

    const email = val('email');
    const address1 = val('address');
    const address2 = val('address2');
    const combinedAddress = [address1, address2].filter(Boolean).join(', ');

    const itemsArray = items.map((it) => ({
      name: it.name,
      quantity: it.qty,
      unitPrice: it.price,
      sku: it.slug,
    }));

    const firstName = val('firstName');
    const lastName = val('lastName');

    const body = {
      email,
      customerName: [firstName, lastName].filter(Boolean).join(' '),
      firstName,
      lastName,
      phone: val('phone'),
      address: combinedAddress,
      city: val('city'),
      postcode: val('postcode'),
      country: val('country') || 'United Kingdom',
      itemsArray,
      subtotal,
      discountAmount: discount,
      total,
      promoCode: promoAppliedCode || null,
      promoDiscount: promoAppliedCode ? promoPercent : 0,
      payment_method: 'manual' as const,
    };

    try {
      const res = await apiFetch<UserOrderResponse>('/api/user-orders', {
        method: 'POST',
        json: body,
        auth: false,
      });
      if (!res?.orderNumber) throw new Error('Missing order number in response');

      // Fires the shared-email order confirmation using the order details
      // the backend echoes back — not the raw form fields — so the email
      // always reflects what was actually persisted. Best-effort: a failure
      // here must never surface as a checkout error.
      fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: res.customerName, email: res.customerEmail },
          order: {
            orderNumber: res.orderNumber,
            currency: res.currency,
            items: res.items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
              price: it.unitPrice,
            })),
            subtotal: res.subtotal,
            shipping,
            tax: 0,
            discount: res.discountAmount,
            total: res.total,
            shippingAddress: [res.shippingAddress, res.shippingCity, res.shippingPostcode, res.shippingCountry]
              .filter(Boolean)
              .join(', '),
          },
        }),
      }).catch((err) => console.error('[checkout] order confirmation email failed:', err));

      setConfirmed({
        orderNumber: res.orderNumber,
        total: res.total,
        email: res.customerEmail,
      });
      clear();
    } catch (e) {
      const err = e as ApiError;
      setSubmitError(err.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Empty cart ── */
  if (items.length === 0 && !confirmed) {
    return (
      <main className="pt-28 md:pt-32">
        <div className="frame flex min-h-[60vh] flex-col items-center justify-center py-section-sm text-center">
          <h1 className="t-h2">Your cart is empty</h1>
          <p className="mt-4 t-lead text-muted">
            Add a research compound before checking out. Products are supplied strictly for
            laboratory research — not for human or veterinary use.
          </p>
          <Link
            href="/#products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-body font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-brand"
          >
            Browse products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-28">
      <div className="frame pb-section-sm md:pb-section">
        <div className="flex items-center gap-4 text-micro">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-ink transition-colors hover:text-brand-teal"
          >
            <span aria-hidden>←</span> Back to cart
          </Link>
          <span className="font-medium uppercase tracking-[0.14em] text-brand-teal">Final step</span>
        </div>

        <h1 className="mt-4 t-display">Checkout</h1>

        <form
          onSubmit={placeOrder}
          className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
        >
          {/* Details */}
          <div className="lg:col-span-7">
            {/* Contact */}
            <section>
              <h2 className="text-micro font-medium uppercase tracking-[0.14em] text-muted">
                Contact
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  name="firstName"
                  label="First name"
                  required
                  autoComplete="given-name"
                  defaultValue={user?.name.split(' ')[0]}
                />
                <Field
                  name="lastName"
                  label="Last name"
                  required
                  autoComplete="family-name"
                  defaultValue={user?.name.split(' ').slice(1).join(' ')}
                />
                <Field
                  name="email"
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={user?.email}
                  className="sm:col-span-2"
                />
                <Field
                  name="phone"
                  label="Mobile"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+44 7700 900000"
                  defaultValue={user?.phone ?? undefined}
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* Contact address */}
            <section className="mt-10">
              <h2 className="text-micro font-medium uppercase tracking-[0.14em] text-muted">
                Contact address
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  name="address"
                  label="Address line 1"
                  required
                  autoComplete="address-line1"
                  placeholder="123 Research Park"
                  className="sm:col-span-2"
                />
                <Field
                  name="address2"
                  label="Address line 2"
                  optional
                  autoComplete="address-line2"
                  placeholder="Unit 4B"
                  className="sm:col-span-2"
                />
                <Field
                  name="city"
                  label="City"
                  required
                  autoComplete="address-level2"
                  placeholder="London"
                />
                <Field
                  name="postcode"
                  label="Postcode"
                  required
                  autoComplete="postal-code"
                  placeholder="NW1 6XE"
                />
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-micro text-ink">Country</span>
                  <select
                    name="country"
                    required
                    defaultValue={user?.country_of_residence || 'United Kingdom'}
                    className="h-12 w-full rounded-full border border-transparent bg-paper px-5 text-body text-ink outline-none transition-all duration-200 focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
                  >
                    {[
                      'United Kingdom',
                      'Ireland',
                      'Germany',
                      'France',
                      'Netherlands',
                      'Spain',
                      'Italy',
                      'Other (EU)',
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

          </div>

          {/* Order summary */}
          <div className="lg:col-span-5">
            <div className="rounded-[18px] bg-paper p-6 md:p-8 lg:sticky lg:top-28">
              <h2 className="text-micro font-medium uppercase tracking-[0.14em] text-muted">
                Order summary
              </h2>

              <ul className="mt-5 space-y-4">
                {items.map((it) => (
                  <li key={it.slug} className="flex items-center gap-4">
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-[8px] bg-mist">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-body font-medium leading-snug text-ink">
                        {it.name}
                      </span>
                      <span className="mt-0.5 text-micro text-muted">
                        Qty {it.qty}
                      </span>
                    </div>
                    <span className="flex-none text-body tabular-nums">
                      {usd(it.price * it.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-6">
                {/* Promo code */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder="Promo code"
                    aria-label="Promo code"
                    aria-invalid={promoError ? true : undefined}
                    aria-describedby={promoError ? 'promo-error' : undefined}
                    className="h-11 flex-1 rounded-full border border-transparent bg-mist/60 px-4 text-body text-ink placeholder:text-muted outline-none transition-all duration-200 focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={
                      !promo.trim() || promoLoading || promo.trim().toUpperCase() === promoAppliedCode
                    }
                    className="h-11 rounded-full border border-line bg-paper px-5 text-micro font-medium text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {promoLoading
                      ? '…'
                      : promo.trim().toUpperCase() === promoAppliedCode && promoAppliedCode
                        ? 'Applied'
                        : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p id="promo-error" role="alert" className="mt-2 text-micro text-brand">
                    {promoError}
                  </p>
                )}
                {promoAppliedCode && (
                  <p className="mt-2 text-micro text-brand-teal">
                    <span className="font-medium">{promoAppliedCode}</span> applied — {promoPercent}% off
                  </p>
                )}

                <dl className="mt-6 space-y-2 text-body">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="tabular-nums text-ink">{usd(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Discount</dt>
                      <dd className="tabular-nums text-brand-teal">−{usd(discount)}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                  <span className="text-lead font-medium">Total</span>
                  <span className="text-price font-normal tabular-nums">{usd(total)}</span>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 rounded-[8px] border border-brand/30 bg-brand/5 px-4 py-3 text-micro text-brand">
                  {submitError}
                </div>
              )}

              {/* Mandatory research-use acknowledgement — shown above the place-order
                  action so it is unambiguously part of the customer's consent. */}
              <div
                role="note"
                aria-label="Research-use acknowledgement"
                className="mt-6 space-y-2 rounded-[10px] border border-line bg-mist/60 p-4 text-micro leading-relaxed text-muted"
              >
                <p>
                  <span className="font-medium text-ink">Research-use acknowledgement.</span>{' '}
                  {compliance.checkoutAcknowledgement}
                </p>
                <p>{compliance.checkoutMedical}</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-ink text-body font-medium text-paper transition-colors hover:bg-brand disabled:opacity-60"
              >
                {submitting ? 'Placing order…' : `Place order · ${usd(total)}`}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Order-placed modal */}
      <AnimatePresence>
        {confirmed && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm"
              aria-hidden
            />
            <div
              ref={confirmRef}
              className="fixed inset-0 z-[71] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-placed-title"
              tabIndex={-1}
            >
              <motion.div
                key="dialog"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[440px] rounded-[18px] bg-mist p-8 text-center shadow-[0_30px_80px_-30px_rgba(10,11,13,0.35)]"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paper text-ink"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </motion.span>

                <h2 id="order-placed-title" className="mt-6 t-h2">
                  Order placed
                </h2>
                <p className="mt-3 mx-auto max-w-[36ch] text-body text-muted">
                  Thank you. A confirmation has been sent to{' '}
                  <span className="font-medium text-ink">{confirmed.email}</span>. Our research
                  team will follow up with next steps for your order.
                </p>

                <div className="mt-6 flex items-center justify-between rounded-[12px] bg-paper px-5 py-4 text-left">
                  <div>
                    <p className="text-label font-medium uppercase tracking-[0.1em] text-muted">
                      Order reference
                    </p>
                    <p className="mt-1 text-body font-medium tabular-nums">
                      {confirmed.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-label font-medium uppercase tracking-[0.1em] text-muted">
                      Total
                    </p>
                    <p className="mt-1 text-body font-medium tabular-nums">
                      {usd(confirmed.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/order/${confirmed.orderNumber}`}
                    className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-micro font-medium text-paper transition-colors hover:bg-brand"
                  >
                    Track order
                  </Link>
                  <Link
                    href="/"
                    className="flex h-12 flex-1 items-center justify-center rounded-full border border-line bg-paper text-micro font-medium text-ink transition-colors hover:border-ink/40"
                  >
                    Back to home
                  </Link>
                </div>

                <p className="mt-5 text-label leading-relaxed text-muted">
                  {compliance.productDisclaimerShort} {compliance.checkoutMedical}
                </p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
