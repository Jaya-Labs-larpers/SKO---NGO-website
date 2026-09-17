export function deploymentEnvironment(env) {
  const requested = env.PUBLIC_DEPLOYMENT_ENV?.trim();
  const hosted =
    env.VERCEL_ENV ||
    (env.CF_PAGES === "1"
      ? env.CF_PAGES_BRANCH === "main"
        ? "production"
        : "preview"
      : undefined);
  if (hosted && requested && requested !== hosted) {
    throw new Error(
      "[readiness] PUBLIC_DEPLOYMENT_ENV conflicts with the hosting environment",
    );
  }
  const mode = hosted || requested || "development";
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
      failures.push("PUBLIC_CONTACT_ENABLED must be false for local content in production");
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

export function contentFailures(html, page) {
  const failures = [];
  if (/\[(?:NEEDS SKO|PLACEHOLDER)[^\]]*\]/i.test(html))
    failures.push("unfinished content marker");
  const content = html.replace(/<a\b(?=[^>]*\bhreflang="en")[^>]*>/g, "");
  if (page.startsWith("/km/") && /\blang="en"/.test(content))
    failures.push("English fallback in Khmer content");
  return failures;
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
  const donation = settings.donation || {};
  if (
    !donation.qrCodes?.length ||
    donation.qrCodes.some(
      (qr) =>
        !(
          qr.image?.asset?.url ||
          qr.image?.asset?._ref ||
          qr.image?.asset?._id
        ),
    )
  )
    failures.push("Donation QR images must be published");
  if (
    !donation.bankAccounts?.length ||
    donation.bankAccounts.some((account) =>
      ["bankName", "accountName", "accountNumber", "currency"].some(
        (field) => !usable(account[field]),
      ),
    )
  )
    failures.push("Donation bank details must be approved and complete");
  return failures;
}
