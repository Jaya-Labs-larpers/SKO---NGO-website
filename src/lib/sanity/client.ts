import { createClient, type SanityClient } from '@sanity/client';
import { hasSanity, sanityApiVersion, sanityDataset, sanityProjectId } from '../config';

/**
 * Read-only Sanity client used at build time only.
 *
 * There is no token. The `production` dataset is public by design (ADR-004) —
 * every document in it is content intended for publication. `perspective:
 * 'published'` keeps drafts out of the build.
 *
 * No CDN: a publish triggers the deploy within seconds, and the CDN can still
 * serve the version from before that publish, so the build would miss the very
 * edit that started it. A build makes only a handful of queries.
 *
 * Null until a project id is configured; the content layer then serves fixtures.
 */
export const sanityClient: SanityClient | null = hasSanity
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: false,
      perspective: 'published',
      // Belt and braces: if a token ever leaks into the environment, ignore it.
      token: undefined,
    })
  : null;
