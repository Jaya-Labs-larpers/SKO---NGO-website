/**
 * The site-wide flock: one larger logo butterfly and three smaller ones that
 * live in the viewport rather than on a page, so they stay put when the URL
 * changes and ride along when the page scrolls.
 *
 * Positions are viewport pixels. The big one keeps to the right-hand side;
 * the three small ones keep to the side edges and fly along them as the page
 * scrolls, slipping off one end and back in at the other. A pointer within
 * reach draws any of them into a loose ring around it.
 *
 * Framework-free and deterministic for a given input sequence, so it can be
 * unit-tested and its state serialised across page loads.
 */

export interface Viewport {
  width: number;
  height: number;
}

export interface Pointer {
  x: number;
  y: number;
}

export interface Flyer {
  big: boolean;
  /** Which edge a small one keeps to; the big one keeps to the right. */
  side: "left" | "right";
  /** Width in CSS px. */
  size: number;
  /** Resting spot. `hy` is carried along by scrolling for small ones. */
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Wing-flap phase, radians, and resting beats per second. */
  phase: number;
  flapHz: number;
  /** Lean into horizontal movement, radians. */
  tilt: number;
  /** Slot on the ring around the pointer, radians, and its radius. */
  ring: number;
  ringR: number;
  gathered: boolean;
  /** Two slow oscillators give each one its own wandering loop. */
  w1: number;
  w2: number;
  p1: number;
  p2: number;
}

export interface Flock {
  time: number;
  viewport: Viewport;
  flyers: Flyer[];
}

/** Phones and small tablets: tiny, edge-hugging, and not pointer-driven. */
export const COMPACT_BELOW = 768;

const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** How far the small ones travel, as a share of the scroll distance. */
const SCROLL_CARRY = 0.45;
/** Beyond this distance off-screen a small one wraps to the other end. */
const WRAP_MARGIN = 80;

interface Slot {
  big: boolean;
  side: "left" | "right";
  /** Resting height as a share of the viewport. */
  y: number;
  flapHz: number;
  ring: number;
  ringR: number;
  w1: number;
  w2: number;
  p1: number;
  p2: number;
}

/* Fixed rather than random: every visitor meets the same flock. */
const SLOTS: readonly Slot[] = [
  {
    big: true,
    side: "right",
    y: 0.3,
    flapHz: 1.0,
    ring: 0.4,
    ringR: 130,
    w1: 0.42,
    w2: 0.7,
    p1: 0.3,
    p2: 1.9,
  },
  {
    big: false,
    side: "left",
    y: 0.28,
    flapHz: 2.1,
    ring: 2.1,
    ringR: 70,
    w1: 0.55,
    w2: 0.9,
    p1: 2.2,
    p2: 0.8,
  },
  {
    big: false,
    side: "right",
    y: 0.66,
    flapHz: 2.4,
    ring: 4.2,
    ringR: 85,
    w1: 0.48,
    w2: 1.0,
    p1: 4.1,
    p2: 3.0,
  },
  {
    big: false,
    side: "left",
    y: 0.78,
    flapHz: 2.2,
    ring: 5.6,
    ringR: 60,
    w1: 0.6,
    w2: 0.8,
    p1: 5.0,
    p2: 5.3,
  },
];

export function isCompact(viewport: Viewport): boolean {
  return viewport.width < COMPACT_BELOW;
}

/** Widths in CSS px. The three small ones always share one size. */
export function sizes(viewport: Viewport): { big: number; small: number } {
  if (isCompact(viewport)) return { big: 44, small: 22 };
  return {
    big: clamp(viewport.width * 0.11, 120, 180),
    small: clamp(viewport.width * 0.03, 36, 48),
  };
}

/**
 * The resting x for a flyer. On phones they hug the very edge — mostly inside
 * the page gutter, the big one peeking in from the right — so they never sit
 * over running text.
 */
function restingX(
  flyer: Pick<Flyer, "big" | "side" | "size">,
  viewport: Viewport,
): number {
  const { width } = viewport;
  if (isCompact(viewport)) {
    const inset = flyer.big ? flyer.size * 0.35 : flyer.size * 0.55;
    return flyer.side === "left" ? inset : width - inset;
  }
  const inset = (flyer.big ? 32 : 28) + flyer.size / 2;
  return flyer.side === "left" ? inset : width - inset;
}

export function createFlock(viewport: Viewport): Flock {
  const { big, small } = sizes(viewport);
  const flyers = SLOTS.map((slot): Flyer => {
    const size = slot.big ? big : small;
    const hx = restingX({ big: slot.big, side: slot.side, size }, viewport);
    const hy = slot.y * viewport.height;
    return {
      big: slot.big,
      side: slot.side,
      size,
      hx,
      hy,
      x: hx,
      y: hy,
      vx: 0,
      vy: 0,
      phase: slot.p1,
      flapHz: slot.flapHz,
      tilt: 0,
      ring: slot.ring,
      ringR: slot.ringR,
      gathered: false,
      w1: slot.w1,
      w2: slot.w2,
      p1: slot.p1,
      p2: slot.p2,
    };
  });
  return { time: 0, viewport: { ...viewport }, flyers };
}

/** Fit the flock to a new viewport, keeping each flyer where it was, proportionally. */
export function resizeFlock(flock: Flock, viewport: Viewport): void {
  const sx = viewport.width / (flock.viewport.width || viewport.width);
  const sy = viewport.height / (flock.viewport.height || viewport.height);
  const { big, small } = sizes(viewport);
  for (const flyer of flock.flyers) {
    flyer.size = flyer.big ? big : small;
    flyer.hx = restingX(flyer, viewport);
    flyer.hy *= sy;
    flyer.x *= sx;
    flyer.y *= sy;
  }
  flock.viewport = { ...viewport };
}

export interface StepInput {
  /** Pointer in viewport px, or null when there is none to follow. */
  pointer: Pointer | null;
  /** Page scroll since the last step, px; positive is down. */
  scrolled: number;
}

export function stepFlock(flock: Flock, dt: number, input: StepInput): void {
  flock.time += dt;
  const t = flock.time;
  const { width, height } = flock.viewport;
  const compact = isCompact(flock.viewport);
  const pointer = compact ? null : input.pointer;

  for (const f of flock.flyers) {
    if (!f.big && input.scrolled !== 0) {
      f.hy += input.scrolled * SCROLL_CARRY;
      const span = height + WRAP_MARGIN * 2;
      // Off one end, back in at the other; the flyer jumps with its home so
      // the wrap happens out of sight.
      if (f.hy > height + WRAP_MARGIN) {
        f.hy -= span;
        f.y -= span;
      } else if (f.hy < -WRAP_MARGIN) {
        f.hy += span;
        f.y += span;
      }
    }

    const reach = f.big ? 260 : 360;
    if (pointer) {
      const d = Math.hypot(pointer.x - f.x, pointer.y - f.y);
      if (!f.gathered && d < reach) f.gathered = true;
      else if (f.gathered && d > reach + 140) f.gathered = false;
    } else {
      f.gathered = false;
    }

    let tx: number;
    let ty: number;
    if (pointer && f.gathered) {
      const a = f.ring + t * 0.6;
      tx = pointer.x + Math.cos(a) * f.ringR;
      ty = pointer.y + Math.sin(a) * f.ringR * 0.8;
    } else {
      // Small ones wander along their edge more than away from it.
      const across = compact ? 3 : f.big ? 22 : 12;
      const along = compact ? 18 : f.big ? 26 : 40;
      tx = f.hx + Math.sin(t * f.w1 + f.p1) * across;
      ty = f.hy + Math.cos(t * f.w2 + f.p2) * along;
    }

    const maxSpeed = f.gathered ? 340 : 160;
    const maxForce = f.gathered ? 1200 : 420;
    const dx = tx - f.x;
    const dy = ty - f.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = Math.min(maxSpeed, dist * 2.4);
    let ax = (dx / dist) * speed - f.vx;
    let ay = (dy / dist) * speed - f.vy;
    const a = Math.hypot(ax, ay);
    if (a > maxForce) {
      ax = (ax / a) * maxForce;
      ay = (ay / a) * maxForce;
    }
    f.vx += ax * dt;
    f.vy += ay * dt;
  }

  // Keep them from stacking on one another around the pointer.
  const flyers = flock.flyers;
  for (let i = 0; i < flyers.length; i++) {
    for (let j = i + 1; j < flyers.length; j++) {
      const a = flyers[i]!;
      const b = flyers[j]!;
      const gap = (a.size + b.size) * 0.4;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d >= gap || d === 0) continue;
      const push = ((gap - d) / gap) * 240 * dt;
      a.vx -= (dx / d) * push;
      a.vy -= (dy / d) * push;
      b.vx += (dx / d) * push;
      b.vy += (dy / d) * push;
    }
  }

  for (const f of flyers) {
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    // Never lost off the sides; top and bottom are how small ones wrap.
    f.x = clamp(f.x, -f.size * 0.4, width + f.size * 0.4);
    const lean = clamp(f.vx * 0.003, -0.3, 0.3);
    f.tilt += (lean - f.tilt) * Math.min(1, dt * 4);
    const effort = Math.hypot(f.vx, f.vy) / 340;
    f.phase += TAU * f.flapHz * (1 + effort) * dt;
  }
}

/** Wing span fraction at the flyer's flap phase; 1 is fully open. */
export function wingSpan(flyer: Flyer, closed = 0.4): number {
  return 1 - (1 - closed) * (0.5 - 0.5 * Math.cos(flyer.phase));
}

/* ---------------------------------------------------------------------------
   Carrying the flock from one page to the next
   ------------------------------------------------------------------------- */

export const STORAGE_KEY = "sko-flock";

/**
 * What the next page needs to draw the flock exactly where this one left it.
 * `s`, `x`, `y`, `r` and `k` are read by the inline restore script in
 * ButterflyField before first paint, so they stay short and flat.
 */
export interface SavedFlock {
  w: number;
  h: number;
  t: number;
  f: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    hy: number;
    phase: number;
    /** Size, tilt and wing span, for the restore script. */
    s: number;
    r: number;
    k: number;
  }[];
}

export function saveFlock(flock: Flock): SavedFlock {
  return {
    w: flock.viewport.width,
    h: flock.viewport.height,
    t: flock.time,
    f: flock.flyers.map((f) => ({
      x: f.x,
      y: f.y,
      vx: f.vx,
      vy: f.vy,
      hy: f.hy,
      phase: f.phase,
      s: f.size,
      r: f.tilt,
      k: wingSpan(f),
    })),
  };
}

/** Rebuild a flock from a saved one, rescaled if the viewport changed size. */
export function restoreFlock(saved: SavedFlock, viewport: Viewport): Flock {
  const flock = createFlock({ width: saved.w, height: saved.h });
  flock.time = saved.t;
  flock.flyers.forEach((f, i) => {
    const s = saved.f[i];
    if (!s) return;
    f.x = s.x;
    f.y = s.y;
    f.vx = s.vx;
    f.vy = s.vy;
    if (!f.big) f.hy = s.hy;
    f.phase = s.phase;
    f.tilt = s.r;
  });
  resizeFlock(flock, viewport);
  return flock;
}

export function parseSavedFlock(raw: string | null): SavedFlock | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as SavedFlock;
    const valid =
      Number.isFinite(value.w) &&
      Number.isFinite(value.h) &&
      Array.isArray(value.f) &&
      value.f.length === SLOTS.length &&
      value.f.every((f) => Number.isFinite(f.x) && Number.isFinite(f.y));
    return valid ? value : null;
  } catch {
    return null;
  }
}
