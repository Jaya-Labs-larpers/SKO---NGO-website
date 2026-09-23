/**
 * Content boxes (.reveal) fade up out of a soft blur the first time they come
 * into view.
 *
 * Time-based rather than scroll-linked: a mouse wheel scrolls in steps, and an
 * animation tied to scroll position steps with it. A fixed-length transition
 * started on entry is smooth whatever the input.
 *
 * Nothing is ever hidden that the visitor could already see. Only boxes still
 * below the fold when this runs are set aside, and setting them aside is
 * invisible because they are off screen. Boxes already in view, or above it on
 * a restored scroll position, are left alone. Without IntersectionObserver, or
 * under reduced motion, nothing is touched at all.
 */

/** Must match the transition length in global.css (.reveal[data-reveal]). */
export const REVEAL_MS = 900;
/** Boxes arriving together are staggered by this much, up to STAGGER_CAP of them. */
export const STAGGER_MS = 90;
const STAGGER_CAP = 4;

interface Options {
  root?: ParentNode;
  viewportHeight?: number;
  reducedMotion?: boolean;
}

export function revealOnEntry({
  root = document,
  viewportHeight = window.innerHeight,
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
}: Options = {}): void {
  if (reducedMotion || typeof IntersectionObserver !== "function") return;

  const waiting = Array.from(
    root.querySelectorAll<HTMLElement>(".reveal"),
  ).filter((box) => box.getBoundingClientRect().top > viewportHeight);
  if (waiting.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const arriving = entries.filter((entry) => entry.isIntersecting);
      arriving.forEach((entry, index) => {
        const box = entry.target as HTMLElement;
        observer.unobserve(box);
        const delay = Math.min(index, STAGGER_CAP) * STAGGER_MS;
        box.style.setProperty("--reveal-delay", `${delay}ms`);
        box.dataset.reveal = "shown";
        // Hand the box back to its own styles afterwards, so a card's hover
        // transitions are not overridden by the reveal's.
        setTimeout(
          () => {
            delete box.dataset.reveal;
            box.style.removeProperty("--reveal-delay");
          },
          delay + REVEAL_MS + 50,
        );
      });
    },
    // Starts once a box is properly on screen, not while it is still hidden
    // behind the bottom edge, so the visitor actually sees it arrive.
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );

  for (const box of waiting) {
    box.dataset.reveal = "pending";
    observer.observe(box);
  }
}
