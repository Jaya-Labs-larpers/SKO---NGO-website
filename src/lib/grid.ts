/**
 * Card grid column classes that adapt to the number of items.
 *
 * Up to 5 cards sit on a single row on large screens so a 4th card never
 * wraps alone onto a second line. Larger sets fall back to even rows of
 * 3 (or 4 when that divides cleanly).
 *
 * Tailwind only generates classes it can see literally, so every variant
 * is spelled out here rather than built with template strings.
 */
const LG_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

export function cardGridCols(count: number): string {
  const n = Math.max(1, Math.floor(count));
  let cols: number;
  if (n <= 5) cols = n;
  else if (n % 3 === 0) cols = 3;
  else if (n % 4 === 0) cols = 4;
  else cols = 3;

  const sm = cols === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  return `grid gap-6 ${sm} ${LG_COLS[cols]}`;
}
