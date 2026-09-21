/**
 * Deferring work and bytes that the first screen does not need.
 *
 * `loading="lazy"` covers most images on this site and nothing here replaces
 * it: the browser's own heuristics beat any scroll handler. It does not help
 * in two cases, and those are what this module is for.
 *
 * The first is an image that is inside the viewport but not yet meant to be
 * seen — the hero slideshow's second, third and fourth photos sit on top of
 * the first, so `lazy` loads them immediately and they compete with the LCP
 * over the same 4G connection. The second is an image that may never be seen
 * at all, like the full-resolution org chart inside a closed dialog, which
 * downloads on page load because display:none does not stop an <img>.
 *
 * Both are served by the same shape: render the URLs in data attributes and
 * move them onto the element once the moment is right.
 */

/** How a deferred image decides when to load. See ResponsiveImage's `defer`. */
export type DeferStrategy = "idle" | "visible" | "manual";

/**
 * Run at the browser's next spare moment, or on the next tick where
 * requestIdleCallback is missing.
 *
 * The timeout matters on a slow phone, where idle may never arrive on its own.
 */
export function whenIdle(work: () => void, timeout = 500): void {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(work, { timeout });
  } else {
    setTimeout(work, 1);
  }
}

/**
 * Run once the page has finished loading and then gone idle.
 *
 * This is the right moment for extra bytes and the wrong one for anything the
 * visitor can see: waiting on `load` means waiting on every image already in
 * flight, including the LCP, which is exactly the point here and exactly what
 * an animation must not do.
 */
export function whenSettled(work: () => void): void {
  const idle = () => whenIdle(work);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/**
 * Run once the element is near the viewport, then stop watching.
 *
 * `rootMargin` is generous on purpose: loading starts before the element is on
 * screen so the visitor meets a picture rather than a gap. Without
 * IntersectionObserver the work simply happens now.
 */
export function whenVisible(
  element: Element,
  work: () => void,
  rootMargin = "256px",
): void {
  if (typeof IntersectionObserver !== "function") {
    work();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      work();
    },
    { rootMargin },
  );
  observer.observe(element);
}

/**
 * Move a deferred image's URLs into place. Safe to call twice — the second
 * call finds nothing left to move.
 *
 * srcset is set before src so a browser that supports it never starts the
 * single-candidate request first.
 */
export function loadDeferredImage(image: HTMLImageElement): void {
  const src = image.dataset.lazySrc;
  if (!src) return;
  const srcset = image.dataset.lazySrcset;
  if (srcset) {
    image.srcset = srcset;
    delete image.dataset.lazySrcset;
  }
  image.src = src;
  delete image.dataset.lazySrc;
  delete image.dataset.lazy;
}

/** Every image still waiting on JavaScript, under `root`. */
export function deferredImages(
  root: ParentNode = document,
): HTMLImageElement[] {
  return Array.from(
    root.querySelectorAll<HTMLImageElement>("img[data-lazy-src]"),
  );
}

/**
 * Wire up the images that load on their own — idle ones after the page has
 * settled, visible ones as they come up. Images marked `manual` are left for
 * the component that owns them, which knows the moment (a dialog opening, a
 * tab being picked) better than a scroll position does.
 */
export function hydrateDeferredImages(root: ParentNode = document): void {
  for (const image of deferredImages(root)) {
    const strategy = image.dataset.lazy as DeferStrategy | undefined;
    if (strategy === "idle") whenSettled(() => loadDeferredImage(image));
    else if (strategy === "visible")
      whenVisible(image, () => loadDeferredImage(image));
  }
}
