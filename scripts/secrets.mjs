/**
 * Secret detection for built output.
 *
 * Two independent checks, because each catches what the other cannot:
 *
 * 1. `findSecrets(text)` — well-known token shapes (Resend, Sanity, AWS,
 *    GitHub, Stripe, PEM private keys, JWTs). Catches a key pasted into a
 *    component or fixture even when no matching env var is set locally.
 *
 * 2. `findEnvLeaks(text, entries)` — the literal value of every secret-looking
 *    environment variable. Catches the case that matters most on Vercel: a
 *    server-only variable reaching the browser through `import.meta.env`,
 *    whatever its format. Runs against the real values during the hosted
 *    build, so it proves the deployed artifact is clean, not just a local one.
 *
 * Anything starting with `PUBLIC_` is meant for the browser and is skipped.
 */

const PATTERNS = [
  ["Resend API key", /\bre_[A-Za-z0-9]{20,}\b/g],
  ["Sanity token", /\bsk[A-Za-z0-9]{40,}\b/g],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/g],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g],
  ["Stripe key", /\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}\b/g],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  [
    "JWT",
    /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  ],
];

/** Env keys whose values must never appear in the build. */
const SECRET_KEY =
  /(?:SECRET|TOKEN|API_KEY|APIKEY|PASSWORD|PASSWD|PRIVATE|CREDENTIAL)/i;

/**
 * Turnstile's documented dummy keys (1x…, 2x…, 3x…) are public test values,
 * and anything this short is a flag or a placeholder, not a credential.
 */
const MIN_SECRET_LENGTH = 16;
const TEST_PLACEHOLDER = /^[123]x0{20,}[A-Z]{2}$/;

/** Show enough of a match to recognise it, never enough to use it. */
export function redact(value) {
  return `${value.slice(0, 4)}…(${value.length} chars)`;
}

/** @returns {Array<[string, string]>} `[key, value]` pairs worth scanning for */
export function secretEnvEntries(env) {
  const entries = [];
  for (const [key, raw] of Object.entries(env)) {
    const value = typeof raw === "string" ? raw.trim() : "";
    if (key.startsWith("PUBLIC_") || !SECRET_KEY.test(key)) continue;
    if (value.length < MIN_SECRET_LENGTH || TEST_PLACEHOLDER.test(value))
      continue;
    entries.push([key, value]);
  }
  return entries;
}

/** @returns {Array<{ rule: string, match: string }>} matches, already redacted */
export function findSecrets(text) {
  const found = [];
  for (const [rule, pattern] of PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      found.push({ rule, match: redact(match[0]) });
    }
  }
  return found;
}

/** @returns {string[]} names of env vars whose literal value appears in `text` */
export function findEnvLeaks(text, entries) {
  return entries
    .filter(([, value]) => text.includes(value))
    .map(([key]) => key);
}
