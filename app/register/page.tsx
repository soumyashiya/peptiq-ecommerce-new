'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { brand } from '@/lib/content';

/* ── shared field styling ── */
const inputBase =
  'h-[46px] w-full rounded-[11px] border border-line bg-paper pl-11 pr-4 text-body text-ink placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/12';
const labelClass = 'mb-1.5 block text-micro font-medium text-ink';

const COUNTRIES = [
  'United Kingdom',
  'Ireland',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'United States',
  'Canada',
  'Other',
];

/* ── icons ── */
const ic = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  ),
  flag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4a1 1 0 0 1 1-1h13l-2 5 2 5H5" />
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

/* labelled input with a leading icon */
function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-sky">
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}

const FEATURES = [
  {
    label: 'Research Grade\nQuality Assured',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-8V3" />
        <path d="M7.5 14h9" />
      </svg>
    ),
  },
  {
    label: 'Verified &\nTraceable',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Documented\nBatch Traceability',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const next = '/';
  const { user, hydrated, signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== repeat) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const res = await signup({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
      date_of_birth: dob,
      nationality,
      country_of_residence: country,
    });
    setSubmitting(false);
    if (res.ok) router.replace(next);
    else setError(res.error);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-sky via-brand to-brand-teal px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      {/* soft ambient glows */}
      <span aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-paper/15 blur-[130px]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-sky/40 blur-[150px]" />

      <div className="relative mx-auto w-full max-w-[1120px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] bg-paper shadow-[0_40px_100px_-40px_rgba(0,0,0,0.4)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]"
        >
          {/* ── Left: light brand panel ── */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-mist p-8 lg:flex xl:p-10">
            {/* full-cover background image */}
            {/*
              No `priority`: it emits a preload regardless of media, so phones were
              fetching this decorative 1.2 MB panel that only renders at lg and up.
            */}
            <Image
              src="/images/peptide-glass.png"
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 1024px) 0px, 45vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
            />
            {/* legibility overlays */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/90" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-sky/15 via-transparent to-transparent" />

            {/* brand lockup */}
            <div className="relative z-10">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-brand-sky to-brand text-paper shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3 19.8 7.5 19.8 16.5 12 21 4.2 16.5 4.2 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="12" cy="3" r="1.7" fill="currentColor" />
                    <circle cx="19.8" cy="16.5" r="1.7" fill="currentColor" />
                    <circle cx="4.2" cy="16.5" r="1.7" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-price font-semibold tracking-[-0.025em] text-brand">{brand.name}</span>
              </Link>
              <p className="mt-2.5 text-label font-semibold uppercase tracking-[0.18em] text-muted">
                Research supply, refined
              </p>
            </div>

            {/* editorial copy */}
            <div className="relative z-10">
              <p className="flex items-center gap-2 text-micro font-medium text-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Trusted by researchers worldwide
              </p>
              <h2 className="mt-4 t-h2 text-ink">
                Premium peptides.
                <br />
                <span className="text-brand-sky">Proven purity.</span>
              </h2>
              <p className="mt-4 max-w-sm text-body font-normal leading-relaxed text-muted">
                High-quality research peptides, verified, traceable and delivered with integrity.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
                {FEATURES.map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-2 text-center text-brand">
                    {f.icon}
                    <span className="whitespace-pre-line text-label font-medium leading-tight text-muted">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Right: form panel ── */}
          <section className="flex flex-col px-6 py-6 sm:px-9 sm:py-7 md:px-10 md:py-8 lg:px-10 lg:py-8 xl:px-12 xl:py-9">
            {/* mobile-only brand strip */}
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-brand-sky to-brand text-paper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 19.8 7.5 19.8 16.5 12 21 4.2 16.5 4.2 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-h3 font-semibold tracking-[-0.025em] text-brand">{brand.name}</span>
            </div>

            {/* header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-h2-sm font-medium tracking-tight text-ink sm:text-h2-sm">
                  Create account
                </h1>
                <p className="mt-2 text-body text-muted">
                  Join {brand.name} and access premium research peptides.
                </p>
              </div>
              <button
                type="button"
                aria-label="Language: English"
                className="flex flex-none items-center gap-2 rounded-[10px] border border-line px-3 py-2 text-micro font-medium text-brand transition-colors hover:bg-mist"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
                English
                <span className="text-muted">{ic.chevron}</span>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First Name" icon={ic.user}>
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Timothée"
                    className={inputBase}
                  />
                </Field>
                <Field label="Last Name" icon={ic.user}>
                  <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Chalamet"
                    className={inputBase}
                  />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email" icon={ic.mail}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="timotheechalamet@gmail.com"
                  className={inputBase}
                />
              </Field>

              {/* Password */}
              <Field label="Password" icon={ic.lock}>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${inputBase} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-micro font-semibold uppercase tracking-[0.08em] text-brand transition-colors hover:text-brand-teal"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </Field>

              {/* Repeat Password */}
              <Field label="Repeat Password" icon={ic.lock}>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputBase}
                />
              </Field>

              {/* Personal details row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Date of birth" icon={ic.calendar}>
                  <input
                    type="date"
                    required
                    autoComplete="bday"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className={inputBase}
                  />
                </Field>
                <Field label="Nationality" icon={ic.flag}>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="British"
                    className={inputBase}
                  />
                </Field>
                <Field label="Country of residence" icon={ic.globe}>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${inputBase} appearance-none pr-9`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
                    {ic.chevron}
                  </span>
                </Field>
              </div>

              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[10px] border border-brand/30 bg-brand/5 px-4 py-3 text-micro text-brand"
                >
                  {error}
                </motion.div>
              )}

              {/* CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="group mt-1 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[12px] bg-brand text-body font-semibold text-paper shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-brand-teal disabled:opacity-60"
              >
                {submitting ? 'Creating account…' : 'Create research account'}
                {!submitting && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                )}
              </button>

              <p className="text-center text-body text-muted">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand underline underline-offset-2">
                  Log in here
                </Link>
              </p>
            </form>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
