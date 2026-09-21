/**
 * A scripted cursor for the video, standing in for a visitor's mouse: it comes
 * in from the top right, settles twice so the butterflies can gather, then
 * leaves so they drift home before the loop restarts.
 */
import type { Pointer } from "../../src/lib/butterflies/swarm";

interface Waypoint {
  /** Seconds. */
  at: number;
  /** Fractions of the frame. */
  x: number;
  y: number;
}

const PATH: Waypoint[] = [
  { at: 1.5, x: 0.86, y: 0.14 },
  { at: 3.5, x: 0.64, y: 0.44 },
  { at: 5.2, x: 0.64, y: 0.44 },
  { at: 7.2, x: 0.38, y: 0.66 },
  { at: 8.8, x: 0.38, y: 0.66 },
  { at: 10.2, x: 0.92, y: 0.92 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export function pointerAt(
  seconds: number,
  width: number,
  height: number,
): Pointer | null {
  const first = PATH[0]!;
  const last = PATH[PATH.length - 1]!;
  if (seconds < first.at || seconds > last.at) return null;
  for (let i = 1; i < PATH.length; i++) {
    const a = PATH[i - 1]!;
    const b = PATH[i]!;
    if (seconds > b.at) continue;
    const t = b.at === a.at ? 1 : smooth((seconds - a.at) / (b.at - a.at));
    return {
      x: (a.x + (b.x - a.x) * t) * width,
      y: (a.y + (b.y - a.y) * t) * height,
    };
  }
  return null;
}
