/**
 * POST /api/contact — the only runtime code on this site.
 *
 * Cloudflare Pages picks this up from the repo root independently of Astro
 * (ADR-001), so the site itself stays fully static.
 *
 * Order of checks is cheapest-rejection-first:
 *   1. honeypot            — no network calls, no email
 *   2. schema validation   — no network calls
 *   3. rate limit          — one KV read
 *   4. Turnstile verify    — one outbound request
 *   5. send                — one outbound request
 *
 * Nothing is persisted. The submission exists in the destination inbox and
 * nowhere else. The only thing stored is a counter keyed by a hash of the IP.
 */

import { z } from 'zod';

interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  CONTACT_TO_EMAIL?: string;
  PARTNER_TO_EMAIL?: string;
  RATE_LIMIT_KV?: KVNamespaceLike;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600;

/**
 * Hard cap on the request body, checked before the JSON is parsed.
 * The schema caps individual fields, but that only applies *after* parsing —
 * without this, an attacker could make the Worker parse an arbitrarily large
 * document just to have it rejected.
 */
const MAX_BODY_BYTES = 32 * 1024;

const schema = z.object({
  formType: z.enum(['general', 'partner', 'volunteer']).default('general'),
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(200),
  organization: z.string().trim().max(160).optional().default(''),
  country: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().min(20).max(5000),
  company_website: z.string().max(200).optional().default(''),
  'cf-turnstile-response': z.string().max(4096).optional().default(''),
});

/**
 * Field-error codes. The client maps these to localised text — the Function
 * never returns a user-facing sentence, because it does not know which of the
 * two languages the visitor is reading.
 */
type ErrorCode = 'required' | 'email' | 'too_short' | 'too_long' | 'invalid';

function codeFor(issue: {
  code: string;
  minimum?: unknown;
  origin?: unknown;
  format?: unknown;
}): ErrorCode {
  // zod v4 reports string formats as invalid_format with `format: 'email'`.
  if (issue.code === 'invalid_format' && (issue.format === 'email' || issue.origin === 'email')) {
    return 'email';
  }
  if (issue.code === 'too_small') return Number(issue.minimum) <= 1 ? 'required' : 'too_short';
  if (issue.code === 'too_big') return 'too_long';
  if (issue.code === 'invalid_type') return 'required';
  return 'invalid';
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/** Strip control characters and collapse runaway whitespace before templating. */
function clean(value: string, max = 5000): string {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Hash the IP so the rate-limit store never holds an identifiable address. */
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`sko:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  /**
   * Deliberately fail-open, unlike Turnstile.
   *
   * Rate limiting is a secondary control — Turnstile is the one that actually
   * stops abuse, and it fails closed. Blocking a genuine grant inquiry because
   * a KV namespace had a blip would be the worse outcome.
   *
   * A missing binding is a deployment mistake rather than a transient fault, so
   * it is logged: Cloudflare's Workers logs will show it on the first
   * submission after a bad deploy.
   */
  if (!env.RATE_LIMIT_KV) {
    console.warn('[contact] RATE_LIMIT_KV binding is not configured — rate limiting is disabled');
    return false;
  }
  try {
    const key = `rl:${await hashIp(ip)}`;
    const current = Number((await env.RATE_LIMIT_KV.get(key)) ?? '0');
    if (current >= RATE_LIMIT_MAX) return true;
    await env.RATE_LIMIT_KV.put(key, String(current + 1), {
      expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
    });
    return false;
  } catch {
    // Never let a storage hiccup block a genuine inquiry.
    return false;
  }
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function sendEmail(env: Env, to: string, subject: string, html: string, replyTo: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }
}

async function handlePost(context: FunctionContext): Promise<Response> {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  /**
   * Require a JSON content type.
   *
   * A cross-origin HTML form can POST as text/plain without triggering a CORS
   * preflight — a "simple request" — so the browser would send it even though
   * it could not read the reply. The side effect (an email landing in SKO's
   * inbox) would still happen. Demanding application/json forces a preflight,
   * which this endpoint answers with 405.
   */
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'payload_too_large' }, 413);
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'payload_too_large' }, 413);
    }
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    // Return codes, not sentences. The page renders the message in the
    // visitor's language; zod's built-in strings are English only.
    const fieldErrors: Record<string, ErrorCode> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !fieldErrors[field]) fieldErrors[field] = codeFor(issue);
    }
    return json({ ok: false, fieldErrors }, 400);
  }

  const data = parsed.data;

  // 1. Honeypot. Return success and send nothing — never teach the bot.
  if (data.company_website.trim() !== '') {
    return json({ ok: true });
  }

  // 2. Rate limit.
  if (await isRateLimited(env, ip)) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  /**
   * 3. Turnstile — FAIL CLOSED.
   *
   * This was previously written as `if (env.TURNSTILE_SECRET_KEY) { verify }`,
   * which meant a deployment that forgot the secret silently accepted every
   * unverified submission — the site's only spam control disabled by a missing
   * environment variable, with nothing to indicate it. A misconfiguration must
   * break the form loudly, not quietly switch the protection off.
   */
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }
  const token = data['cf-turnstile-response'];
  if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip))) {
    return json({ ok: false, error: 'verification_failed' }, 403);
  }

  // 4. Route to the right inbox.
  const to = data.formType === 'partner' ? (env.PARTNER_TO_EMAIL ?? env.CONTACT_TO_EMAIL) : env.CONTACT_TO_EMAIL;
  if (!to || !env.RESEND_API_KEY || !env.MAIL_FROM) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const organization = clean(data.organization, 160);
  const country = clean(data.country, 80);
  const message = clean(data.message, 5000);

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ...(organization ? ([['Organization', organization]] as [string, string][]) : []),
    ...(country ? ([['Country', country]] as [string, string][]) : []),
    ['Form', data.formType],
  ];

  const html =
    `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111a2b">` +
    `<h2 style="margin:0 0 16px">Website inquiry — ${escapeHtml(data.formType)}</h2>` +
    `<table style="border-collapse:collapse;margin-bottom:20px">` +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#5f6b82">${escapeHtml(label)}</td>` +
          `<td style="padding:4px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
      )
      .join('') +
    `</table>` +
    `<div style="border-left:3px solid #475d8c;padding-left:16px;white-space:pre-wrap">${escapeHtml(message)}</div>` +
    `<p style="margin-top:24px;color:#5f6b82;font-size:13px">Sent from the SKO website. Reply directly to answer the sender.</p>` +
    `</div>`;

  try {
    await sendEmail(env, to, `[SKO website] ${data.formType} inquiry from ${name}`, html, email);
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}

/** Anything other than POST gets a clean 405 rather than a framework error page. */
export async function onRequest(context: FunctionContext): Promise<Response> {
  if (context.request.method === 'POST') return handlePost(context);
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
