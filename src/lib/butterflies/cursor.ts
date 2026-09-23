/**
 * The butterfly that flies ahead of the mouse pointer. Pure motion maths, so
 * it can be tested without a DOM; ButterflyCursor.astro owns the element.
 *
 * The system pointer stays visible and does the aiming. The butterfly keeps a
 * little way out in front of it: ahead along the direction the pointer is
 * travelling, and, once the pointer rests, just past the tip of the arrow. It
 * banks into sideways movement and beats its wings faster the quicker it flies
 * or while the pointer is over something clickable.
 */

export interface Point {
  x: number;
  y: number;
}

export interface CursorFlight {
  x: number;
  y: number;
  /** Bank angle in radians; negative leans left. */
  tilt: number;
  /** Flap phase in radians. */
  phase: number;
  /** Seconds since the butterfly last moved noticeably. */
  still: number;
  /** Unit vector the butterfly keeps ahead along. */
  heading: Point;
  /** Smoothed pointer velocity in px/s. */
  pointerVelocity: Point;
  /** Seconds since the pointer last moved. */
  pointerIdle: number;
}

/** Exponential follow rate per second. */
export const FOLLOW_RATE = 12;
/** How far ahead of the pointer tip the butterfly flies. */
export const LEAD_DISTANCE = 34;
/**
 * The system arrow points up and to the left, so a resting butterfly waits
 * there, just past the tip. Kept in step with the inline restore script in
 * ButterflyCursor.astro.
 */
export const REST_HEADING: Point = normalize({ x: -1, y: -0.85 });
/** After the pointer has been still this long, the butterfly turns back to REST_HEADING. */
const REST_AFTER_S = 0.45;
const REST_TURN_RATE = 4;
export const MAX_TILT = 0.45;
const TILT_RATE = 10;
/** Horizontal speed (px/s) at which the bank reaches MAX_TILT. */
const FULL_TILT_SPEED = 1400;
const IDLE_FLAP_HZ = 1.6;
const FLIGHT_FLAP_HZ = 4.5;
const HOVER_FLAP_HZ = 2.5;
/** Speed (px/s) that earns the full extra flap rate. */
const FULL_EFFORT_SPEED = 900;
/** Movement below this many px per frame counts as resting. */
const REST_EPSILON = 0.15;
/** After this long at rest the wings open and the loop can stop. */
export const SETTLE_AFTER_S = 1.2;

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function normalize(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

/** Where a butterfly resting beside a pointer at `pointer` sits. */
export function restingPoint(pointer: Point): Point {
  return {
    x: pointer.x + REST_HEADING.x * LEAD_DISTANCE,
    y: pointer.y + REST_HEADING.y * LEAD_DISTANCE,
  };
}

export function createCursorFlight(pointer: Point): CursorFlight {
  const at = restingPoint(pointer);
  return {
    x: at.x,
    y: at.y,
    tilt: 0,
    phase: 0,
    still: 0,
    heading: { ...REST_HEADING },
    pointerVelocity: { x: 0, y: 0 },
    pointerIdle: SETTLE_AFTER_S,
  };
}

/** Feed every pointer move in: `dx`/`dy` in px since the last one, `dt` in seconds. */
export function notePointerMove(flight: CursorFlight, dx: number, dy: number, dt: number): void {
  const distance = Math.hypot(dx, dy);
  if (distance < 0.5) return;
  flight.pointerIdle = 0;

  const weight = Math.min(distance / 30, 1) * 0.6;
  flight.heading = normalize({
    x: flight.heading.x + (dx / distance - flight.heading.x) * weight,
    y: flight.heading.y + (dy / distance - flight.heading.y) * weight,
  });

  const seconds = Math.max(dt, 0.004);
  flight.pointerVelocity.x += (dx / seconds - flight.pointerVelocity.x) * 0.35;
  flight.pointerVelocity.y += (dy / seconds - flight.pointerVelocity.y) * 0.35;
}

export function stepCursorFlight(flight: CursorFlight, pointer: Point, dt: number, hovering: boolean): void {
  if (dt <= 0) return;
  flight.pointerIdle += dt;

  if (flight.pointerIdle > 1 / 30) {
    const decay = Math.exp(-10 * dt);
    flight.pointerVelocity.x *= decay;
    flight.pointerVelocity.y *= decay;
  }
  if (flight.pointerIdle > REST_AFTER_S) {
    const turn = 1 - Math.exp(-REST_TURN_RATE * dt);
    flight.heading = normalize({
      x: flight.heading.x + (REST_HEADING.x - flight.heading.x) * turn,
      y: flight.heading.y + (REST_HEADING.y - flight.heading.y) * turn,
    });
  }

  // An exponential follower trails a steadily moving target by velocity/rate;
  // aiming that far further on cancels the trail, so the butterfly holds its
  // lead while the pointer is moving instead of dropping behind it.
  const target = {
    x: pointer.x + flight.heading.x * LEAD_DISTANCE + flight.pointerVelocity.x / FOLLOW_RATE,
    y: pointer.y + flight.heading.y * LEAD_DISTANCE + flight.pointerVelocity.y / FOLLOW_RATE,
  };

  const t = 1 - Math.exp(-FOLLOW_RATE * dt);
  const dx = (target.x - flight.x) * t;
  const dy = (target.y - flight.y) * t;
  flight.x += dx;
  flight.y += dy;

  const vx = dx / dt;
  const speed = Math.hypot(dx, dy) / dt;
  const lean = clamp(vx / FULL_TILT_SPEED, -1, 1) * MAX_TILT;
  flight.tilt += (lean - flight.tilt) * (1 - Math.exp(-TILT_RATE * dt));

  const moving = Math.hypot(dx, dy) > REST_EPSILON;
  flight.still = moving ? 0 : flight.still + dt;

  const effort = Math.min(speed / FULL_EFFORT_SPEED, 1);
  const hz = IDLE_FLAP_HZ + effort * FLIGHT_FLAP_HZ + (hovering ? HOVER_FLAP_HZ : 0);
  flight.phase = (flight.phase + TAU * hz * dt) % TAU;
}

/** True once the butterfly has come to rest beside a still pointer and can stop animating. */
export function isSettled(flight: CursorFlight): boolean {
  return (
    flight.still >= SETTLE_AFTER_S &&
    Math.abs(flight.tilt) < 0.01 &&
    Math.hypot(flight.heading.x - REST_HEADING.x, flight.heading.y - REST_HEADING.y) < 0.02
  );
}

/** Wing span fraction at the current phase; 1 is fully open. A settled butterfly rests open. */
export function cursorWingSpan(flight: CursorFlight, closed = 0.35): number {
  if (isSettled(flight)) return 1;
  return 1 - (1 - closed) * (0.5 - 0.5 * Math.cos(flight.phase));
}

export const CURSOR_STORAGE_KEY = "sko-cursor";

/** Where the pointer was when the last page unloaded, so the next page can draw it there before first paint. */
export function parseSavedCursor(raw: string | null, viewport: { width: number; height: number }): Point | null {
  if (!raw) return null;
  try {
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return null;
    const { x, y } = saved as Record<string, unknown>;
    if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (x < 0 || y < 0 || x > viewport.width || y > viewport.height) return null;
    return { x, y };
  } catch {
    return null;
  }
}
