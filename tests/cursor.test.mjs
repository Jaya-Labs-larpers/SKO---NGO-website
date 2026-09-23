import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/butterflies/cursor.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports });
const cursor = module.exports;

const FRAME = 1 / 60;

/** Moves the pointer in a straight line at `velocity` px/s, stepping the flight each frame. */
function glide(flight, pointer, velocity, seconds, hovering = false) {
  for (let t = 0; t < seconds; t += FRAME) {
    const dx = velocity.x * FRAME;
    const dy = velocity.y * FRAME;
    cursor.notePointerMove(flight, dx, dy, FRAME);
    pointer.x += dx;
    pointer.y += dy;
    cursor.stepCursorFlight(flight, pointer, FRAME, hovering);
  }
}

function rest(flight, pointer, seconds, hovering = false) {
  for (let t = 0; t < seconds; t += FRAME) {
    cursor.stepCursorFlight(flight, pointer, FRAME, hovering);
  }
}

test("a resting butterfly waits just past the arrow's tip, up and to the left", () => {
  const pointer = { x: 500, y: 400 };
  const flight = cursor.createCursorFlight(pointer);
  rest(flight, pointer, 0.5);
  assert.ok(flight.x < pointer.x);
  assert.ok(flight.y < pointer.y);
  assert.ok(Math.abs(Math.hypot(flight.x - pointer.x, flight.y - pointer.y) - cursor.LEAD_DISTANCE) < 1);
});

test("while the pointer moves, the butterfly flies ahead of it, not behind", () => {
  for (const velocity of [
    { x: 600, y: 0 },
    { x: -600, y: 0 },
    { x: 0, y: 500 },
    { x: 400, y: -400 },
  ]) {
    const pointer = { x: 1000, y: 1000 };
    const flight = cursor.createCursorFlight(pointer);
    glide(flight, pointer, velocity, 0.6);
    const ahead =
      ((flight.x - pointer.x) * velocity.x + (flight.y - pointer.y) * velocity.y) / Math.hypot(velocity.x, velocity.y);
    assert.ok(ahead > cursor.LEAD_DISTANCE * 0.7, `ahead by ${ahead.toFixed(1)}px for ${JSON.stringify(velocity)}`);
  }
});

test("after the pointer stops it turns back to rest beside the arrow's tip", () => {
  const pointer = { x: 500, y: 500 };
  const flight = cursor.createCursorFlight(pointer);
  glide(flight, pointer, { x: 600, y: 0 }, 0.4);
  assert.ok(flight.x > pointer.x);
  rest(flight, pointer, 4);
  assert.ok(flight.x < pointer.x && flight.y < pointer.y);
  assert.equal(cursor.isSettled(flight), true);
});

test("it banks into sideways movement and never past the limit", () => {
  const right = cursor.createCursorFlight({ x: 0, y: 0 });
  glide(right, { x: 0, y: 0 }, { x: 3000, y: 0 }, 0.08);
  assert.ok(right.tilt > 0);
  assert.ok(right.tilt <= cursor.MAX_TILT);

  const left = cursor.createCursorFlight({ x: 5000, y: 0 });
  glide(left, { x: 5000, y: 0 }, { x: -3000, y: 0 }, 0.08);
  assert.ok(left.tilt < 0);
});

test("it flaps faster while flying than while resting, and faster again over a link", () => {
  const resting = cursor.createCursorFlight({ x: 0, y: 0 });
  rest(resting, { x: 0, y: 0 }, FRAME);

  const flying = cursor.createCursorFlight({ x: 0, y: 0 });
  glide(flying, { x: 0, y: 0 }, { x: 900, y: 0 }, FRAME);

  const hovering = cursor.createCursorFlight({ x: 0, y: 0 });
  rest(hovering, { x: 0, y: 0 }, FRAME, true);

  assert.ok(flying.phase > resting.phase);
  assert.ok(hovering.phase > resting.phase);
});

test("a settled butterfly rests with its wings open and wakes when the pointer moves", () => {
  const pointer = { x: 10, y: 10 };
  const flight = cursor.createCursorFlight(pointer);
  rest(flight, pointer, cursor.SETTLE_AFTER_S + 0.1);
  assert.equal(cursor.isSettled(flight), true);
  assert.equal(cursor.cursorWingSpan(flight), 1);

  glide(flight, pointer, { x: 600, y: 0 }, FRAME * 2);
  assert.equal(cursor.isSettled(flight), false);
});

test("wing span stays between the closed fraction and fully open", () => {
  const pointer = { x: 0, y: 0 };
  const flight = cursor.createCursorFlight(pointer);
  for (let i = 0; i < 200; i++) {
    glide(flight, pointer, { x: 600, y: 0 }, FRAME);
    const span = cursor.cursorWingSpan(flight);
    assert.ok(span >= 0.35 - 1e-9 && span <= 1 + 1e-9);
  }
});

test("a saved position is only trusted when it fits the new viewport", () => {
  const viewport = { width: 1280, height: 800 };
  assert.deepEqual({ ...cursor.parseSavedCursor('{"x":100,"y":200}', viewport) }, { x: 100, y: 200 });
  assert.equal(cursor.parseSavedCursor('{"x":2000,"y":200}', viewport), null);
  assert.equal(cursor.parseSavedCursor('{"x":"1","y":2}', viewport), null);
  assert.equal(cursor.parseSavedCursor("not json", viewport), null);
  assert.equal(cursor.parseSavedCursor(null, viewport), null);
});
