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
