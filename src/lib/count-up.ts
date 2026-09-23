/**
 * Figures marked [data-count-to] roll up from zero when they come into view,
 * and roll up again each time the visitor scrolls back down to them. A figure
 * is only reset to zero once it is fully below the bottom edge of the window.
 */

export const COUNT_UP_MS = 2000;

const DIGITS = /\d[\d,]*/;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function countUpOnEntry(root: ParentNode = document): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof IntersectionObserver !== "function") return;

  const frames = new Map<HTMLElement, number>();
  const armed = new Set<HTMLElement>();

  const reset = (figure: HTMLElement) => {
    cancelAnimationFrame(frames.get(figure) ?? 0);
    frames.delete(figure);
    const template = figure.dataset.countTemplate ?? "";
    figure.textContent = template.replace(DIGITS, "0");
    armed.add(figure);
  };

  const run = (figure: HTMLElement) => {
    armed.delete(figure);
    const target = Number(figure.dataset.countTo);
    const template = figure.dataset.countTemplate ?? "";
    const final = template.match(DIGITS)?.[0] ?? String(target);
    const grouped = final.includes(",");
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min((now - start) / COUNT_UP_MS, 1);
      const current =
        progress === 1
          ? final
          : Math.round(target * easeOutCubic(progress)).toLocaleString("en-US", { useGrouping: grouped });
      figure.textContent = template.replace(DIGITS, current);
      if (progress < 1) frames.set(figure, requestAnimationFrame(frame));
      else frames.delete(figure);
    };
    frames.set(figure, requestAnimationFrame(frame));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const figure = entry.target as HTMLElement;
        if (entry.intersectionRatio >= 0.6) {
          if (armed.has(figure)) run(figure);
          continue;
        }
        const bottom = entry.rootBounds?.bottom ?? window.innerHeight;
        if (!entry.isIntersecting && entry.boundingClientRect.top >= bottom) reset(figure);
      }
    },
    { threshold: [0, 0.6] },
  );

  for (const figure of root.querySelectorAll<HTMLElement>("[data-count-to]")) {
    const template = figure.textContent ?? "";
    if (!Number.isFinite(Number(figure.dataset.countTo)) || !DIGITS.test(template)) continue;
    figure.dataset.countTemplate = template;
    reset(figure);
    observer.observe(figure);
  }
}
