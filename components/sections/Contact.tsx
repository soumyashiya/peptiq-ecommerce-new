'use client';

import { useState } from 'react';
import Image from 'next/image';
import { contact, brand } from '@/lib/content';
import { apiFetch, ApiError } from '@/lib/api';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Contact — a short statement and a one-field email sign-up on the left, a
 * cut-out portrait anchored to the bottom-right.
 *
 * The form posts to the same newsletter endpoint as the footer form
 * (`/api/newsletter/subscribe`, source `peptiq_contact`), so a submission is
 * real rather than a decorative success state. Direct enquiries go to the
 * research email shown under the form.
 */
type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export function Contact() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });
  const busy = state.kind === 'submitting' || state.kind === 'success';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setState({ kind: 'submitting' });
    try {
      const res = await apiFetch<{ ok: boolean; already_subscribed?: boolean }>('/api/newsletter/subscribe', {
        method: 'POST',
        json: { email: email.trim(), consent: true, source: 'peptiq_contact', website: honeypot },
        auth: false,
      });
      if (res?.ok) {
        setState({
          kind: 'success',
          message: res.already_subscribed ? "You're already on the list — thank you." : contact.joinSuccess,
        });
        setEmail('');
      } else {
        setState({ kind: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setState({ kind: 'error', message: (err as ApiError).message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        <div className="relative grid items-end gap-6 overflow-hidden rounded-[2rem] bg-paper/70 ring-1 ring-line md:grid-cols-[1.05fr_1fr]">
          <Reveal className="relative z-10 self-center px-6 py-10 sm:px-10 md:py-12 lg:px-16">
            <h2 className="max-w-[30ch] text-balance t-h2-sm text-ink">
              {contact.statement}
            </h2>

            <form onSubmit={onSubmit} noValidate className="mt-9 max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={contact.emailPlaceholder}
                  aria-label="Email address"
                  disabled={busy}
                  className="h-[3.25rem] min-w-0 flex-1 rounded-full px-5 border border-line bg-paper px-4 text-body text-ink outline-none transition-colors placeholder:text-muted focus:border-brand disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={busy || !email.trim()}
                  className="btn-primary !px-7 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                >
                  {state.kind === 'submitting' ? 'Joining…' : contact.join}
                </button>
              </div>

              {/* honeypot — bots fill this, people leave it empty */}
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
                <p role="status" className="mt-3 text-micro font-medium text-brand-teal">{state.message}</p>
              )}
              {state.kind === 'error' && (
                <p role="alert" className="mt-3 text-micro font-medium text-brand">{state.message}</p>
              )}
            </form>

            <p className="mt-6 text-micro text-muted">
              {contact.direct}{' '}
              <a href={`mailto:${brand.email}`} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-brand">
                {brand.email}
              </a>
            </p>
            <p className="mt-2 text-micro font-normal text-muted">
              For laboratory research use only. Not for human or veterinary consumption.
            </p>
          </Reveal>

          <div className="relative w-full self-end" style={{ height: 'clamp(22rem, 32vw, 27rem)' }}>
            <span
              aria-hidden
              className="absolute inset-x-[10%] bottom-0 top-[18%] rounded-t-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.4)_0%,rgba(210,191,252,0.2)_50%,rgba(210,191,252,0)_75%)]"
            />
            <Image
              src={contact.image}
              alt={contact.imageAlt}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
