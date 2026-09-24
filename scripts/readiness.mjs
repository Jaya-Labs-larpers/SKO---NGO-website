export function deploymentEnvironment(env) {
  // Set explicitly wherever the site is built: `preview` for the workers.dev
  // rehearsal and pull requests, `production` in the deploy workflow. There is
  // no host-supplied value to fall back on, so a missing value means a
  // developer machine.
  const mode = env.PUBLIC_DEPLOYMENT_ENV?.trim() || "development";
  if (!["production", "preview", "development"].includes(mode)) {
    throw new Error("[readiness] Invalid PUBLIC_DEPLOYMENT_ENV");
  }
  return mode;
}

export function validateBuildConfig(env) {
  const failures = [];
  if (deploymentEnvironment(env) !== "production") return failures;
  try {
    const url = new URL(env.PUBLIC_SITE_URL || "");
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      !host.includes(".") ||
      /(^|\.)(localhost|example\.(com|org|net)|pages\.dev|test|invalid|local)$/.test(
        host,
      ) ||
      /^[\d.]+$/.test(host) ||
      host.includes(":")
    )
      throw new Error();
  } catch {
    failures.push("PUBLIC_SITE_URL must be a real HTTPS production origin");
  }
  if (env.PUBLIC_CONTENT_SOURCE === "fixtures") {
    if (env.PUBLIC_CONTACT_ENABLED !== "false")
      failures.push(
        "PUBLIC_CONTACT_ENABLED must be false for local content in production",
      );
    return failures;
  }
  if (env.PUBLIC_CONTENT_SOURCE !== "sanity")
    failures.push("PUBLIC_CONTENT_SOURCE must be sanity in production");
  if (
    !/^[a-z0-9]{8}$/.test(env.PUBLIC_SANITY_PROJECT_ID || "") ||
    /^example|^placeholder/.test(env.PUBLIC_SANITY_PROJECT_ID || "")
  ) {
    failures.push("PUBLIC_SANITY_PROJECT_ID must identify the real project");
  }
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(env.PUBLIC_SANITY_DATASET || ""))
    failures.push("PUBLIC_SANITY_DATASET is required");
  const key = env.PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  if (!/^0x[\w-]{10,}$/.test(key))
    failures.push(
      "PUBLIC_TURNSTILE_SITE_KEY must be a real key, not a test key",
    );
  return failures;
}

/**
 * Internal content markers, in step with src/lib/content/placeholders.ts and
 * scripts/content-review.mjs. The content layer strips these before render, so
 * one reaching the HTML means something bypassed that seam — a hardcoded string
 * in a component, or a new marker word nobody taught the stripper.
 */
const CONTENT_MARKER =
  /\[(?:NEEDS SKO|NEEDS [A-Z][A-Z ]*|PLACEHOLDER|EXAMPLE|SAMPLE|DRAFT|TODO|TBD|LOGO|STATIC MAP|KHMER REVIEW)\b[^\]]*\]/i;

/**
 * Checked on every build, not only production ones: a marker in the HTML is a
 * leak whatever the environment, and catching it in a preview is the whole
 * point of catching it.
 */
export function markerFailures(html) {
  const found = CONTENT_MARKER.exec(html);
  return found ? [`unfinished content marker ${found[0]}`] : [];
}

/**
 * English standing in for missing Khmer. Reported on production Sanity builds
 * so staff can see what is left to translate, but it does not block a deploy:
 * the page still works, and every fallback carries lang="en" for screen
 * readers. English language-switch links are not fallbacks.
 */
export function khmerFallbacks(html, page) {
  const content = html.replace(/<a\b(?=[^>]*\bhreflang="en")[^>]*>/g, "");
  return page.startsWith("/km/") && /\blang="en"/.test(content)
    ? ["English fallback in Khmer content"]
    : [];
}

export function siteSettingsFailures(settings) {
  const failures = [];
  const usable = (value) =>
    typeof value === "string" &&
    value.trim() &&
    !/^(N\/A|TBD|TODO)$/i.test(value.trim()) &&
    !/\[(NEEDS SKO|PLACEHOLDER)/i.test(value);
  for (const field of ["email", "partnerEmail"]) {
    if (
      !usable(settings[field]) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings[field]) ||
      /@example\.(com|org|net)$/i.test(settings[field])
    )
      failures.push(`${field} must be an approved contact inbox`);
  }
  return failures;
}
