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
    autoUpdates: false,
  },
});
