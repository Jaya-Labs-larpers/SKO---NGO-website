import { createClient, type SanityClient } from '@sanity/client';
import { hasSanity, sanityApiVersion, sanityDataset, sanityProjectId } from '../config';

/**
 * Read-only Sanity client used at build time only.
 *
 * There is no token. The `production` dataset is public by design (ADR-004) —
 * every document in it is content intended for publication. `perspective:
 * 'published'` keeps drafts out of the build.
 *
 * Null until a project id is configured; the content layer then serves fixtures.
 */
export const sanityClient: SanityClient | null = hasSanity
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: 'published',
      // Belt and braces: if a token ever leaks into the environment, ignore it.
      token: undefined,
    })
  : null;
