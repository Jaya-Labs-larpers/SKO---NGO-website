// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE,

  // Fully static. The only runtime code is functions/api/contact.ts, which
  // Cloudflare Pages picks up from the repo root independently of Astro.
  // See docs/04-tech-decisions.md ADR-001.
  output: 'static',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'km'],
    routing: {
      // English lives at the root (/about/), Khmer under /km/about/.
      // ADR in docs/01-sitemap-and-urls.md.
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  build: {
    // Directory-style URLs: /about/ not /about.html
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', km: 'km-KH' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
