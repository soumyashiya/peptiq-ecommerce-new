'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { CallbackCard, CallbackFallback, type CallbackStatus } from '@/components/checkout/CallbackCard';

type VerifyResponse = {
  ok: boolean;
  session?: { uuid: string; status: 'success' | 'failed' | 'pending'; orderId: number };
  payment?: { status: string; finalStatus?: string; amount?: string; currency?: string } | null;
};

function KlymeCallback() {
  const params = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const uuid = params.get('uuid') || params.get('paymentUuid') || params.get('payment_uuid');
    if (!uuid) {
      setStatus('error');
      setMessage('Missing payment reference.');
      return;
    }

    let active = true;
    apiFetch<VerifyResponse>(`/api/klyme/verify-payment/${encodeURIComponent(uuid)}`, {
      method: 'GET',
      auth: false,
    })
      .then((res) => {
        if (!active) return;
        if (res?.session?.orderId) setOrderId(res.session.orderId);
        const s = res?.session?.status;
        if (s === 'success') setStatus('success');
        else if (s === 'pending') setStatus('pending');
        else setStatus('failed');
      })
      .catch((e) => {
        if (!active) return;
        const err = e as ApiError;
        setStatus('error');
        setMessage(err.message || 'Could not verify payment.');
      });

    return () => {
      active = false;
    };
  }, [params]);

  const c = {
    loading: { title: 'Verifying payment…', body: 'Just a moment.' },
    success: {
      title: 'Payment received',
      body: 'Thank you. Your order is confirmed and our research team will follow up shortly.',
    },
    pending: {
      title: 'Payment pending',
      body: 'Your payment is still being processed. We’ll email you as soon as it settles.',
    },
    failed: {
      title: 'Payment not completed',
      body: message ?? 'The payment could not be completed.',
    },
    error: {
      title: 'Could not verify payment',
      body: message ?? 'Please contact support with your order reference.',
    },
  }[status];

  return (
    <CallbackCard status={status} title={c.title} body={c.body}>
      <div className="mt-6 flex gap-3">
        {orderId && status === 'success' && (
          <Link
            href={`/order/${orderId}`}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-micro font-medium text-paper transition-colors hover:bg-brand"
          >
            View order
          </Link>
        )}
        {status !== 'success' && (
          <Link
            href="/checkout"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-micro font-medium text-paper transition-colors hover:bg-brand"
          >
            Try again
          </Link>
        )}
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-line bg-paper text-micro font-medium text-ink transition-colors hover:border-ink/40"
        >
          Back to home
        </Link>
      </div>
    </CallbackCard>
  );
}

export default function KlymeCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <KlymeCallback />
    </Suspense>
  );
}
