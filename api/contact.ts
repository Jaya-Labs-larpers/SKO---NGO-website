import { isIP } from "node:net";
import { onRequest } from "../functions/api/contact.js";

/**
 * Best-effort quota store for the Vercel runtime.
 *
 * The shared handler was written against a Cloudflare KV binding. Vercel has no
 * equivalent binding, so this module keeps the counters in memory instead. It
 * is a secondary control only: module state survives while a function
 * instance stays warm and is not shared between instances, so a determined
 * sender can exceed the limit by landing on fresh instances. The primary
 * limit on production is the Vercel WAF rule that
 * CONTACT_WAF_RATE_LIMIT_ENABLED attests to; this store just makes a naive
 * burst against one warm instance stop at the same five-per-window the
 * Cloudflare deployment enforces.
 */
const MEMORY_STORE_MAX_KEYS = 10_000;
const memoryStore = new Map<string, { value: string; expires: number }>();

function pruneMemoryStore(now: number): void {
  for (const [key, entry] of memoryStore) {
    if (entry.expires <= now) memoryStore.delete(key);
  }
  // Still over the cap after expiry? Drop the oldest insertions rather than
  // let a flood of distinct IPs grow the map without bound.
  if (memoryStore.size > MEMORY_STORE_MAX_KEYS) {
    const excess = memoryStore.size - MEMORY_STORE_MAX_KEYS;
    let dropped = 0;
    for (const key of memoryStore.keys()) {
      if (dropped++ >= excess) break;
      memoryStore.delete(key);
    }
  }
}

const RATE_LIMIT_KV = {
  async get(key: string): Promise<string | null> {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expires <= Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  },
  async put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void> {
    const now = Date.now();
    pruneMemoryStore(now);
    const ttlSeconds = options?.expirationTtl ?? 600;
    memoryStore.set(key, { value, expires: now + ttlSeconds * 1000 });
  },
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return Response.json(
        { ok: false, error: "method_not_allowed" },
        {
          status: 405,
          headers: { Allow: "POST", "Cache-Control": "no-store" },
        },
      );
    }
    if (process.env.CONTACT_ENABLED !== "true") {
      return Response.json(
        { ok: false, error: "preview_disabled" },
        {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    const deploymentEnv =
      process.env.VERCEL_ENV || process.env.PUBLIC_DEPLOYMENT_ENV;
    /**
     * Production must have the upstream WAF rule. The in-memory store above
     * satisfies the shared handler's "some rate limiter exists" check, which
     * would otherwise let a production deploy run with only best-effort,
     * per-instance limiting and no signal that the real one is missing.
     */
    if (
      deploymentEnv === "production" &&
      process.env.CONTACT_WAF_RATE_LIMIT_ENABLED !== "true"
    ) {
      console.warn(
        "[contact] CONTACT_WAF_RATE_LIMIT_ENABLED is not true — refusing production submissions until the Vercel WAF rule is attested",
      );
      return Response.json(
        { ok: false, error: "not_configured" },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }
    const candidate =
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "";
    return onRequest({
      request,
      clientIp: isIP(candidate) ? candidate : "",
      env: {
        PUBLIC_DEPLOYMENT_ENV: deploymentEnv,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        MAIL_FROM: process.env.MAIL_FROM,
        CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
        PARTNER_TO_EMAIL: process.env.PARTNER_TO_EMAIL,
        RATE_LIMIT_KV,
        RATE_LIMIT_WAF_ENABLED: process.env.CONTACT_WAF_RATE_LIMIT_ENABLED,
      },
    });
  },
};
