'use client';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api';

type State = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success'; message: string } | { kind: 'error'; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;
    if (!consent) {
      setState({ kind: 'error', message: 'Please tick the consent box to continue.' });
      return;
    }
    setState({ kind: 'submitting' });
    try {
      const res = await apiFetch<{ ok: boolean; already_subscribed?: boolean }>(
        '/api/newsletter/subscribe',
        {
          method: 'POST',
          json: { email: email.trim(), consent: true, source: 'peptiq_footer', website: honeypot },
          auth: false,
        }
      );
      if (res?.ok) {
        setState({
          kind: 'success',
          message: res.already_subscribed
            ? "You're already on the list — thank you."
            : 'Subscribed. Watch your inbox for the next batch drop.',
        });
        setEmail('');
      } else {
        setState({ kind: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (e) {
      const err = e as ApiError;
      setState({
        kind: 'error',
        message: err.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 max-w-sm">
      <p className="text-micro font-semibold text-ink">Newsletter</p>
      <p className="mt-1.5 text-micro font-normal text-muted">
        Batch drops, storage tips, sourcing notes. No spam.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@lab.com"
          aria-label="Email address for newsletter"
          disabled={state.kind === 'submitting' || state.kind === 'success'}
          className="h-11 flex-1 rounded-full border border-line bg-mist px-4 text-body text-ink outline-none transition-colors placeholder:text-muted focus:border-brand disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state.kind === 'submitting' || state.kind === 'success' || !email.trim()}
          className="h-11 rounded-full bg-brand-lime px-5 text-body font-semibold text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.kind === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {/* The checkbox is styled globally in globals.css — it used to render as
          a raw OS widget in system blue, the only off-palette colour on the page. */}
      <label className="mt-3.5 flex cursor-pointer items-start gap-2.5 text-micro font-normal text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-px"
        />
        I agree to receive research updates by email.
      </label>

      {/* honeypot — bots love to fill this, real users leave it empty */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {state.kind === 'success' && (
        <p role="status" className="mt-3 text-micro font-medium text-brand-teal">
          {state.message}
        </p>
      )}
      {state.kind === 'error' && (
        <p role="alert" className="mt-3 text-micro font-medium text-brand">
          {state.message}
        </p>
      )}
    </form>
  );
}
