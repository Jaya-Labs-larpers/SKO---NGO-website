# SKO hero video

Renders the home-page butterfly swarm — the same simulation the website runs
live in `src/lib/butterflies/` — as a 12 second, 1920 × 1080 loop. A scripted
cursor comes through the frame so the video shows the gathering behaviour.

```bash
cd video
npm install
npx remotion studio          # preview and tune props in the sidebar
npx remotion render          # writes out/ButterflySwarm.mp4
```

Every knob (seed, density, size range, gather radius, background) is a prop
editable in the Studio sidebar.

## Loading intro

`LoadingIntro` is a 5 second, 1080 × 1080 render of the website's loading
screen (`src/components/layout/PageLoader.astro`): the logo butterfly beating
its wings above a progress bar, and a "Loading" label. On the website the bar
follows the page's real loading progress; here it fills over the five seconds. It reads
the website's fonts from `../public` (see `remotion.config.ts`).

```bash
npx remotion render LoadingIntro
```
