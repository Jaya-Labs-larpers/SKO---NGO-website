import imageUrlBuilder from '@sanity/image-url';
import { hasSanity, sanityDataset, sanityProjectId } from '../config';
import type { CmsImage } from '../content/types';
import localImages from '../content/local-images.json';

const builder = hasSanity
  ? imageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset })
  : null;

/** Widths emitted in every srcset. Tuned for phone-first traffic on 4G. */
export const DEFAULT_WIDTHS = [400, 640, 828, 1200, 1600] as const;

const LOCAL_PREFIX = 'local:';

type LocalImage = { width: number; height: number; widths: number[]; lqip: string };

/**
 * Photos committed to the repo (public/images, built by scripts/local-images.mjs)
 * for content that has no Sanity asset yet. Their widths are pre-rendered, so a
 * request is served by the smallest rendition at least as wide as asked for.
 */
function localImage(image: CmsImage | null | undefined): { name: string; meta: LocalImage } | null {
  const id = image?.asset?._id;
  if (!id?.startsWith(LOCAL_PREFIX)) return null;
  const name = id.slice(LOCAL_PREFIX.length);
  const meta = (localImages as Record<string, LocalImage>)[name];
  return meta ? { name, meta } : null;
}

const localUrl = (name: string, width: number) => `/images/${name}-${width}.webp`;

/** A CmsImage for a photo in public/images, by the name scripts/local-images.mjs gave it. */
export function localCmsImage(name: string, alt?: CmsImage['alt']): CmsImage {
  const meta = (localImages as Record<string, LocalImage>)[name];
  if (!meta) throw new Error(`[sko] No local image named "${name}" — run scripts/local-images.mjs`);
  return {
    asset: { _id: `${LOCAL_PREFIX}${name}`, url: localUrl(name, meta.widths.at(-1)!) },
    alt: alt ?? null,
    lqip: meta.lqip,
    dimensions: { width: meta.width, height: meta.height, aspectRatio: meta.width / meta.height },
  };
}

export function hasImage(image: CmsImage | null | undefined): boolean {
  return Boolean(localImage(image) || (builder && image?.asset));
}

/**
 * A single transformed URL from Sanity's image CDN.
 *
 * Transforms happen at the CDN, not at build time (ADR-003) — a staff member
 * uploading forty event photos must not push the build past ten minutes.
 */
export function imageUrl(
  image: CmsImage,
  options: { width: number; height?: number; quality?: number } = { width: 1200 },
): string | null {
  const local = localImage(image);
  if (local) {
    const width = local.meta.widths.find((w) => w >= options.width) ?? local.meta.widths.at(-1)!;
    return localUrl(local.name, width);
  }
  if (!builder || !image.asset) return null;
  let url = builder
    .image(image as Parameters<typeof builder.image>[0])
    .width(options.width)
    .quality(options.quality ?? 75)
    .auto('format')
    .fit('max');
  if (options.height) url = url.height(options.height);
  return url.url();
}

export function imageSrcSet(
  image: CmsImage,
  widths: readonly number[] = DEFAULT_WIDTHS,
): string | null {
  const local = localImage(image);
  if (local) return local.meta.widths.map((w) => `${localUrl(local.name, w)} ${w}w`).join(', ');
  if (!builder || !image.asset) return null;
  return widths
    .map((width) => {
      const url = imageUrl(image, { width });
      return url ? `${url} ${width}w` : null;
    })
    .filter((entry): entry is string => entry !== null)
    .join(', ');
}

/** Intrinsic dimensions, so every image reserves its box and CLS stays at zero. */
export function imageDimensions(
  image: CmsImage | null | undefined,
  fallbackAspect = 3 / 2,
): { width: number; height: number } {
  const dimensions = image?.dimensions;
  if (dimensions?.width && dimensions?.height) {
    return { width: dimensions.width, height: dimensions.height };
  }
  return { width: 1200, height: Math.round(1200 / fallbackAspect) };
}
