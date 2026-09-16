import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // `npx sanity deploy` publishes to <hostname>.sanity.studio — free, and one
  // less thing for SKO to host or keep patched.
  studioHost: process.env.SANITY_STUDIO_HOSTNAME ?? undefined,
  deployment: {
    appId: 'ml5mtibpsoqkczq7kkn03a9u',
    autoUpdates: false,
  },
  // Pin Vite to the studio's own tsconfig. Without this it scans every
  // tsconfig.json up to the repo root, and the root one extends
  // `astro/tsconfigs/strict`, which is not installed when only `studio/`
  // is installed (as in CI).
  vite: (viteConfig) => ({
    ...viteConfig,
    tsconfig: 'tsconfig.json',
  }),
});
