import imageUrlBuilder from '@sanity/image-url';
import { hasSanity, sanityDataset, sanityProjectId } from '../config';
import type { CmsImage } from '../content/types';

const builder = hasSanity
  ? imageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset })
  : null;

/** Widths emitted in every srcset. Tuned for phone-first traffic on 4G. */
export const DEFAULT_WIDTHS = [400, 640, 828, 1200, 1600] as const;

export function hasImage(image: CmsImage | null | undefined): boolean {
  return Boolean(builder && image?.asset);
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
