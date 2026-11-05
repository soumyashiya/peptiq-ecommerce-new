'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch, ApiError } from '@/lib/api';
import { brand } from '@/lib/content';

type ForgotResponse = { success: boolean; message?: string };

const featureBullets = [
  'A password reset link is sent to your registered email',
  'Links expire for security — request a new one if needed',
  'Only your email is required to begin',
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch<ForgotResponse>('/api/auth/forgot-password', {
        method: 'POST',
        json: { email: email.trim().toLowerCase() },
        auth: false,
      });
      if (res?.success) setSent(true);
      else setError(res?.message || 'Could not send reset email. Please try again.');
    } catch (e) {
      const err = e as ApiError;
      setError(err.message || 'Could not send reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ── Brand panel (hidden on mobile) ── */}
        <aside className="relative hidden overflow-hidden bg-[#462E6A] p-10 text-paper lg:flex lg:flex-col xl:p-14">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.18] mix-blend-luminosity"
            style={{ backgroundImage: "url('/images/lab-new.avif')" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#462E6A]/30 via-[#462E6A]/55 to-[#462E6A]/90"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-paper/15 blur-[100px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-brand-lime/20 blur-[120px]"
          />

          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-paper text-brand shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)]">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 19.8 7.5 19.8 16.5 12 21 4.2 16.5 4.2 7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="3" r="1.7" fill="currentColor" />
                <circle cx="19.8" cy="16.5" r="1.7" fill="currentColor" />
                <circle cx="4.2" cy="16.5" r="1.7" fill="currentColor" />
              </svg>
            </span>
            <span className="text-h3 font-semibold tracking-[-0.025em]">{brand.name}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 my-auto max-w-lg"
          >
            <p className="text-label font-medium uppercase tracking-[0.14em] text-paper/70">
              Account recovery
            </p>
            <h2 className="mt-5 t-h2 text-balance">
              Reset your password securely.
            </h2>
            <ul className="mt-10 space-y-4">
              {featureBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-body text-paper/85">
                  <span className="mt-1.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-paper/15">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <p className="relative z-10 text-micro uppercase tracking-[0.1em] text-paper/60">
            For laboratory research use only · Not for human consumption
          </p>
        </aside>

        {/* ── Form panel ── */}
        <section className="flex items-center justify-center px-6 py-14 sm:px-10 md:py-20 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[560px] rounded-[18px] bg-paper p-7 shadow-[0_24px_60px_-28px_rgba(70,46,106,0.45)] sm:p-9"
          >
            {/* mobile-only brand + back link */}
            <div className="flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-2 text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#462E6A] text-paper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3 19.8 7.5 19.8 16.5 12 21 4.2 16.5 4.2 7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-body font-semibold tracking-[-0.025em]">{brand.name}</span>
              </Link>
              <Link
                href="/login"
                className="text-micro font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-brand-teal"
              >
                ← Sign in
              </Link>
            </div>

            {/* desktop-only back link */}
            <Link
              href="/login"
              className="hidden text-micro font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-brand-teal lg:inline-block"
            >
              ← Back to sign in
            </Link>

            <div className="mt-10 lg:mt-8">
              <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
                Forgot password
              </p>
              <h1 className="mt-3 t-h2">
                {sent ? 'Check your inbox' : 'Reset your password'}
              </h1>
              <p className="mt-3 text-body text-muted">
                {sent
                  ? `We've sent a reset link to ${email}. Follow the instructions in the email to choose a new password.`
                  : 'Enter the email associated with your account and we will send a reset link.'}
              </p>
            </div>

            {!sent && (
              <form onSubmit={onSubmit} className="mt-10 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-micro font-medium text-ink">Email address</span>
                  <div className="group relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@lab.com"
                      className="h-12 w-full rounded-[10px] border border-line bg-paper pl-12 pr-4 text-body text-ink outline-none transition-all duration-200 focus:border-[#462E6A] focus:bg-paper focus:ring-4 focus:ring-brand-soft/60"
                    />
                  </div>
                </label>

                {error && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[8px] border border-brand/30 bg-brand/5 px-4 py-3 text-micro text-brand"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-lime text-body font-semibold uppercase tracking-[0.06em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-paper disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : 'Send reset link'}
                  {!submitting && (
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                </button>
              </form>
            )}

            {sent && (
              <div className="mt-10 space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="text-micro font-medium text-brand-teal hover:text-brand"
                >
                  Use a different email
                </button>
              </div>
            )}

            <p className="mt-8 text-center text-body text-muted">
              Remembered it?{' '}
              <Link href="/login" className="font-medium text-brand-teal link-underline">
                Back to sign in
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
