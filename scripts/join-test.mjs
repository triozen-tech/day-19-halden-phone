// Join pixel test (Halden, ONE film: V1..V12 on one scroll, 11 crossfade joins). Old per-section notes below are historical.
// Join pixel test (Halden). No Halden clip has a baked Veo dissolve (each clip starts/ends on a shared keyframe S1..S11), so there are
// no skip zones; a "join" is the kit's 8-unit crossfade where clip N hands over to clip N+1 on one scroll.
//  - Joins inside a section (same canvas): V2>V3, V5>V6, V8>V9, V9>V10. The test stops at every 2nd scroll px across the crossfade,
//    both directions, waits 700 ms and reads the picture (canvas data-frames = [clip, frame, alpha] per layer). A stop RESTS ON A
//    JOIN when two layers are still blended (a ghost) after the scroll has stopped.
//  - Joins between sections (V1|V2, V3|V4, V4|V5, V6|V7, V7|V8, V10|V11, V11|V12): a hard cut between two pinned stages on the same
//    keyframe; no blend exists, so they are listed as "cut" with the frame difference measured from the frame files (see report).
// Needs `npm start -- -p 3012`. Usage: node scripts/join-test.mjs [port]
import { chromium } from "playwright-core";

const PORT = process.argv[2] || "3012";
const COUNTS = [169, 176, 161, 173, 165, 165, 192, 173, 155, 165, 151, 185]; // V1..V12 (site/clips.ts)
const W = COUNTS.reduce((x, c) => x + c, 0);
const JOINS = COUNTS.slice(0, -1).map((_, k) => [`V${k + 1}>V${k + 2}`, COUNTS.slice(0, k + 1).reduce((x, c) => x + c, 0)]);
const PX = 6, HALF = 4 * PX + 2; // PX_PER_FRAME in site/clips.ts; the crossfade is 8 units centred on the join

const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
p.on("pageerror", (e) => errs.push(String(e)));
await p.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
await p.waitForFunction(() => !document.querySelector("[data-loader]"), null, { timeout: 30000 });
await p.waitForTimeout(800);

const stop = (y, ci) => p.evaluate(async ({ y, ci }) => {
  const lenis = window.__lenis;
  lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y);
  const cv = document.querySelectorAll("section canvas, footer canvas")[ci];
  const t0 = performance.now();
  let last = "", settle = 0, at = null;
  while (performance.now() - t0 < 700) {
    await new Promise((r) => requestAnimationFrame(r));
    const key = cv.dataset.frames || "";
    if (key !== last) { last = key; settle = performance.now() - t0; }
  }
  at = JSON.parse(cv.dataset.frames || "[]");
  return { at, settle: Math.round(settle) };
}, { y, ci });
const secTop = () => p.evaluate(() => {
  const s = document.getElementById("film");
  return { top: s.getBoundingClientRect().top + window.scrollY, run: s.offsetHeight - window.innerHeight };
});

let bad = 0, total = 0;
const report = [];
const ci = 0;
for (const [name, cum] of JOINS) {
  const { top, run } = await secTop();
  const yJoin = top + run * (cum / W);
  const ys = []; for (let y = Math.round(yJoin - HALF); y <= yJoin + HALF; y += 2) ys.push(y);
  let rest = 0, n = 0, worst = 0, maxA = 0;
  for (const order of [ys, [...ys].reverse()]) {
    await stop(order[0] + (order[0] === ys[0] ? -80 : 80), ci);
    for (const y of order) {
      const r = await stop(y, ci);
      n++; total++; worst = Math.max(worst, r.settle);
      if (r.at.length > 1) { rest++; bad++; maxA = Math.max(maxA, Math.min(...r.at.map((l) => l[2]))); console.log(`  REST ON JOIN ${name} y=${y} layers=${JSON.stringify(r.at)}`); }
    }
  }
  report.push(`${name}: join at y ${yJoin.toFixed(0)}, crossfade ${(8 * PX)} px wide, ${n} stops, ${rest} rested on a blend, worst settle ${worst} ms`);
}
console.log(report.join("\n"));
console.log(`TOTAL ${total} stops, ${bad} resting on a join (must be 0). console errors: ${errs.length}`);
await b.close();
process.exit(bad ? 1 : 0);
