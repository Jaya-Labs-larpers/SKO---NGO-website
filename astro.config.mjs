// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import {
  deploymentEnvironment,
  validateBuildConfig,
} from "./scripts/readiness.mjs";

const env = {
  ...loadEnv(process.env.NODE_ENV || "production", process.cwd(), ""),
  ...process.env,
};
const failures = validateBuildConfig(env);
if (failures.length) throw new Error(`[readiness]\n${failures.join("\n")}`);
process.env.PUBLIC_DEPLOYMENT_ENV = deploymentEnvironment(env);
const SITE = (
  env.PUBLIC_SITE_URL?.trim() ||
  (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:4321")
).replace(/\/+$/, "");
process.env.PUBLIC_SITE_URL = SITE;

export default defineConfig({
  site: SITE,

  output: "static",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "km"],
    routing: {
      // English lives at the root (/about/), Khmer under /km/about/.
      // ADR in docs/01-sitemap-and-urls.md.
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  build: {
    // Directory-style URLs: /about/ not /about.html
    format: "directory",
    inlineStylesheets: "auto",
  },

  vite: {
    define: {
      "import.meta.env.PUBLIC_DEPLOYMENT_ENV": JSON.stringify(
        process.env.PUBLIC_DEPLOYMENT_ENV,
      ),
    },
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US", km: "km-KH" },
      },
      filter: (page) => !page.includes("/404"),
    }),
  ],
});
