import path from 'node:path';
import { pathToFileURL } from 'node:url';

/*
 * The email sender lives in a shared package OUTSIDE this repo, at
 * /var/www/shared-email/ on the VPS (the project root there is
 * /var/www/peptiq/app/, so it sits two levels above the working directory).
 *
 * It used to be a static `import '../../../../../shared-email/order-email.js'`,
 * which webpack tries to resolve at BUILD time — so every build anywhere but
 * the VPS (local machines, hosted CI) failed with "Module not found".
 *
 * It is now loaded at REQUEST time instead. `webpackIgnore` keeps the bundler
 * from touching the path, so the build always succeeds; on the VPS the file is
 * found exactly where it was before. Set SHARED_EMAIL_PATH to override the
 * location. If the package is missing, the route answers 503 — checkout treats
 * the confirmation email as best-effort, so an order is never failed by this.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SendOrderConfirmationBody = {
  customer: { name: string; email: string };
  order: Record<string, unknown>;
};

type Sender = (args: {
  domain: string;
  customer: SendOrderConfirmationBody['customer'];
  order: SendOrderConfirmationBody['order'];
}) => Promise<{ success: boolean } & Record<string, unknown>>;

const SHARED_EMAIL_PATH =
  process.env.SHARED_EMAIL_PATH ?? path.resolve(process.cwd(), '../../shared-email/order-email.js');

let senderPromise: Promise<Sender | null> | null = null;

function loadSender(): Promise<Sender | null> {
  if (!senderPromise) {
    senderPromise = import(/* webpackIgnore: true */ pathToFileURL(SHARED_EMAIL_PATH).href)
      .then((mod) => (mod.sendOrderConfirmationEmail as Sender) ?? null)
      .catch((err) => {
        console.error(`[send-order-confirmation] shared-email not found at ${SHARED_EMAIL_PATH}:`, err);
        senderPromise = null; // retry on the next request
        return null;
      });
  }
  return senderPromise;
}

export async function POST(request: Request) {
  const { customer, order } = (await request.json()) as SendOrderConfirmationBody;

  const sendOrderConfirmationEmail = await loadSender();
  if (!sendOrderConfirmationEmail) {
    return Response.json({ success: false, error: 'Email service unavailable' }, { status: 503 });
  }

  const result = await sendOrderConfirmationEmail({
    domain: request.headers.get('host') ?? '',
    customer,
    order,
  });

  return Response.json(result, { status: result.success ? 200 : 502 });
}
