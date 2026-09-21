import "./index.css";
import { Composition } from "remotion";
import { ButterflySwarm, butterflySwarmSchema } from "./ButterflySwarm";

/**
 * ButterflySwarm — the SKO home-page hero background as a 12 s loop at 1080p.
 * The same simulation runs live on the website; this render is for places that
 * need a file (social posts, presentations, a reduced-motion poster).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ButterflySwarm"
        component={ButterflySwarm}
        schema={butterflySwarmSchema}
        defaultProps={butterflySwarmSchema.parse({})}
        durationInFrames={12 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
