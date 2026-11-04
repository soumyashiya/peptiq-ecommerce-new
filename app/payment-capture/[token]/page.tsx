'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { paymentCapture, type CaptureValidateResponse, ApiError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { compliance } from '@/lib/content';

type UploadStatus = 'idle' | 'uploading' | 'received' | 'rejected' | 'pending';

export default function PaymentCapturePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [data, setData] = useState<CaptureValidateResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!token) return;
    paymentCapture
      .validate(token)
      .then((res) => setData(res))
      .catch((err) => {
        // Token failures arrive as 400 or 404 — both mean "bad link", not an outage.
        const msg =
          err instanceof ApiError && (err.status === 400 || err.status === 404)
            ? 'This payment link is invalid or has expired.'
            : err instanceof Error
              ? err.message
              : 'Failed to load payment details.';
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoLoading) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      await paymentCapture.applyPromo(token, code);
      // Re-validate rather than patching locally: the server recalculates the
      // discount and total, and also flips `allowPromo` to false.
      const fresh = await paymentCapture.validate(token);
      setData(fresh);
      setPromoInput('');
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Could not apply promo.');
    } finally {
      setPromoLoading(false);
    }
  };

  const uploadScreenshot = async () => {
    if (!file || uploadStatus === 'uploading') return;
    setUploadStatus('uploading');
    setUploadError('');
    try {
      const res = await paymentCapture.upload(token, file);
      // ok:true does not mean approved — payment_status carries the verdict.
      setUploadStatus(res.payment_status);
      if (res.verification_error) setUploadError(res.verification_error);
    } catch (err) {
      setUploadStatus('idle');
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  if (loading) {
    return (
      <div className="frame flex min-h-[60vh] items-center justify-center py-24">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-sky" />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="frame flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="t-h2">Link unavailable</h1>
        <p className="mt-4 max-w-md text-body font-normal text-muted">
          {loadError || 'Payment link not found.'}
        </p>
      </div>
    );
  }

  const order = data.order as Record<string, unknown>;
  const total = Number(order.total ?? 0);
  const orderNumber = String(order.order_number ?? '');

  return (
    <div className="frame max-w-3xl pb-section-sm pt-28 md:pt-32">
      <p className="text-label font-medium uppercase tracking-[0.12em] text-brand-teal">
        Complete payment
      </p>
      <h1 className="mt-4 t-h1">Order {orderNumber}</h1>
      <p className="mt-4 t-lead text-muted">
        Transfer the total below to the account shown, then upload a screenshot of your
        transfer to confirm.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <BankRow label="Payee" value={data.bank.payeeName} />
        <BankRow label="Reference" value={data.bank.reference} mono />
        <BankRow label="Sort code" value={data.bank.sortCode} mono />
        <BankRow label="Account number" value={data.bank.accountNumber} mono />
        <div className="sm:col-span-2">
          <BankRow label="Amount" value={formatPrice(total)} highlight />
        </div>
      </div>

      {data.allowPromo && (
        <div className="mt-12">
          <h2 className="text-label font-medium uppercase tracking-[0.12em] text-muted">
            Apply promo code
          </h2>
          <div className="mt-4 flex gap-2">
            <label htmlFor="promo" className="sr-only">
              Promo code
            </label>
            <input
              id="promo"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError('');
              }}
              placeholder="Promo code"
              className="min-w-0 flex-1 border border-line bg-paper px-4 py-3 text-body font-normal uppercase tracking-wide text-ink outline-none transition-colors focus:border-brand-sky"
            />
            <button
              type="button"
              onClick={applyPromo}
              disabled={promoLoading}
              className="shrink-0 border border-line px-6 text-micro font-medium text-ink transition-colors hover:border-ink disabled:opacity-60"
            >
              {promoLoading ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {promoError && (
            <p className="mt-2 text-micro font-normal text-red-600">{promoError}</p>
          )}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-label font-medium uppercase tracking-[0.12em] text-muted">
          Upload payment screenshot
        </h2>
        <p className="mt-3 text-body font-normal text-muted">PNG, JPG, or PDF · max 25 MB.</p>

        <label htmlFor="screenshot" className="sr-only">
          Payment screenshot
        </label>
        <input
          id="screenshot"
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-4 block w-full text-body font-normal text-muted file:mr-4 file:border-0 file:bg-ink file:px-5 file:py-2.5 file:text-micro file:font-medium file:text-paper hover:file:bg-brand"
        />

        {uploadError && (
          <p
            role="alert"
            className="mt-4 border border-red-600/25 bg-red-600/5 px-4 py-3 text-micro font-normal text-red-700"
          >
            {uploadError}
          </p>
        )}

        {uploadStatus === 'received' && (
          <p
            role="status"
            className="mt-4 border border-brand-sky/40 bg-brand-soft/30 px-4 py-3 text-micro font-medium text-brand-teal"
          >
            Payment confirmed. Thank you — your order is being prepared.
          </p>
        )}
        {uploadStatus === 'pending' && (
          <p
            role="status"
            className="mt-4 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-micro font-medium text-ink"
          >
            Screenshot received. Verification is queued; we’ll email you with the result.
          </p>
        )}
        {uploadStatus === 'rejected' && (
          <p
            role="alert"
            className="mt-4 border border-red-600/30 bg-red-600/5 px-4 py-3 text-micro font-medium text-red-700"
          >
            We couldn’t verify this screenshot. Please re-upload a clearer image of the transfer.
          </p>
        )}

        <button
          type="button"
          onClick={uploadScreenshot}
          disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'received'}
          className="mt-8 w-full bg-ink py-4 text-body font-medium text-paper transition-colors duration-500 hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-12"
        >
          {uploadStatus === 'uploading' ? 'Uploading…' : 'Submit screenshot'}
        </button>
      </div>

      <p className="mt-16 border-t border-line pt-6 text-micro font-normal leading-relaxed text-muted">
        {compliance.productDisclaimer}
      </p>
    </div>
  );
}

function BankRow({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="bg-mist px-5 py-4">
      <p className="text-label font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={`mt-1 ${mono ? 'font-mono tracking-wide' : ''} ${
          highlight ? 't-h3 text-ink' : 'text-body text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
