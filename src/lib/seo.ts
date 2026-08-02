import type { Locale } from './i18n/config';
import { text } from './i18n/utils';
import type { CmsImage, Seo } from './content/types';

export interface ResolvedSeo {
  title: string;
  description: string | undefined;
  ogImage: CmsImage | null;
  noindex: boolean;
}

/**
 * Resolve a page's search/social metadata.
 *
 * The CMS `seo` object is an override, not a requirement — staff fill it in
 * when they want a different search-result title from the on-page heading, and
 * leave it blank the rest of the time. This is the one place that precedence
 * is decided, so it cannot drift between page types.
 */
export function resolveSeo(
  seo: Seo | null | undefined,
  lang: Locale,
  fallback: { title: string; description?: string | null; image?: CmsImage | null },
): ResolvedSeo {
  const title = text(seo?.title, lang) || fallback.title;
  const description = text(seo?.description, lang) || fallback.description || '';

  return {
    title,
    description: description ? truncate(description, 300) : undefined,
    ogImage: seo?.image ?? fallback.image ?? null,
    noindex: seo?.noindex === true,
  };
}

function truncate(value: string, limit: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean;
}
