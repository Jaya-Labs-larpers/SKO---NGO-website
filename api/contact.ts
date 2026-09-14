import { isIP } from "node:net";
import { onRequest } from "../functions/api/contact.js";

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
    const candidate =
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "";
    return onRequest({
      request,
      clientIp: isIP(candidate) ? candidate : "",
      env: {
        PUBLIC_DEPLOYMENT_ENV:
          process.env.VERCEL_ENV || process.env.PUBLIC_DEPLOYMENT_ENV,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        MAIL_FROM: process.env.MAIL_FROM,
        CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
        PARTNER_TO_EMAIL: process.env.PARTNER_TO_EMAIL,
        RATE_LIMIT_WAF_ENABLED: process.env.CONTACT_WAF_RATE_LIMIT_ENABLED,
      },
    });
  },
};
