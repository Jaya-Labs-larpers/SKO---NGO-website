import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  createSwarm,
  drawSwarm,
  stepSwarm,
  DEFAULT_SWARM_OPTIONS,
  type Swarm,
} from "../../src/lib/butterflies/swarm";
import { pointerAt } from "./pointer-path";

/**
 * Every knob is a prop so it can be tuned in the Remotion Studio sidebar. The
 * defaults are the ones the website uses; `areaPerButterfly` is scaled up
 * because a 1920 × 1080 frame is larger than most hero sections.
 */
export const butterflySwarmSchema = z.object({
  seed: z.number().int().min(0).default(DEFAULT_SWARM_OPTIONS.seed),
  areaPerButterfly: z.number().min(2000).max(60000).default(20000),
  minSize: z.number().min(6).max(60).default(16),
  maxSize: z.number().min(6).max(80).default(30),
  gatherRadius: z.number().min(40).max(800).default(360),
  releaseRadius: z.number().min(40).max(1000).default(480),
  background: z.string().default("#f5f7fd"),
  showPointer: z.boolean().default(true),
});

export type ButterflySwarmProps = z.infer<typeof butterflySwarmSchema>;

interface Cache {
  key: string;
  swarm: Swarm;
  frame: number;
}

export const ButterflySwarm: React.FC<ButterflySwarmProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef<Cache | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // The swarm is deterministic, so any frame is "simulate from zero". Cache
    // the last state and step forward when scrubbing ahead; rebuild otherwise.
    const key = JSON.stringify([props, width, height, fps]);
    let state = cache.current;
    if (!state || state.key !== key || state.frame > frame) {
      state = {
        key,
        swarm: createSwarm(width, height, {
          seed: props.seed,
          areaPerButterfly: props.areaPerButterfly,
          minSize: props.minSize,
          maxSize: props.maxSize,
          gatherRadius: props.gatherRadius,
          releaseRadius: props.releaseRadius,
          minCount: 24,
          maxCount: 140,
        }),
        frame: -1,
      };
      cache.current = state;
    }
    const dt = 1 / fps;
    while (state.frame < frame) {
      state.frame += 1;
      stepSwarm(state.swarm, dt, pointerAt(state.frame / fps, width, height));
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = props.background;
    ctx.fillRect(0, 0, width, height);
    drawSwarm(ctx, state.swarm);

    const pointer = pointerAt(frame / fps, width, height);
    if (props.showPointer && pointer) {
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "#2fc4e8";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [frame, fps, width, height, props]);

  return (
    <AbsoluteFill style={{ backgroundColor: props.background }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width, height }}
      />
    </AbsoluteFill>
  );
};
