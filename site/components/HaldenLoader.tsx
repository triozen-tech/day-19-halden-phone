"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ensureClip, frameUrl, getManifest } from "@/lib/frames";
import { nav } from "@/site/content";

/** Minimal loader: film-grey screen, small wordmark, a thin line that grows with the real load (first 60 frames of V1 + the font + the cut-out), a percent number.
 *  Opacity-only exit; scroll is locked while it shows. Off in ?static=1 and ?record=1 (add `&loader=1` to see it in a reel; `?loader=0` turns it off anywhere). */
const FOLDER = "/frames/halden-v1";
const FIRST = 60;      // frames that must be in before it ends
const MIN_MS = 550;    // the line takes at least this long, so the percent is readable even on a fast local load
const LIMIT_MS = 6000; // never longer than this

export default function HaldenLoader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const q = location.search;
    if (/loader=0/.test(q) || /static/.test(q) || (/record/.test(q) && !/loader=1/.test(q))) { setGone(true); return; }
    setLive(true);
    const html = document.documentElement;
    html.style.setProperty("--wi", "0"); // the hero word + cut-out fade in after the loader

    // scroll lock (wheel, touch, scroll keys, and Lenis if it is up already)
    const stop = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation(); };
    const keys = (e: KeyboardEvent) => { if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "End", "Home"].includes(e.key)) stop(e); };
    window.addEventListener("wheel", stop, { passive: false, capture: true });
    window.addEventListener("touchmove", stop, { passive: false, capture: true });
    window.addEventListener("keydown", keys, { capture: true });
    const lenis = () => (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;

    let frames = 0, font = 0, cut = 0, ended = false, raf = 0, shown = 0;
    const t0 = performance.now();
    const target = () => 0.88 * (frames / FIRST) + 0.07 * font + 0.05 * cut;

    const fontP = Promise.race([
      Promise.all([document.fonts.load('800 20px "Inter Variable"'), document.fonts.load('600 14px "Inter Variable"')]),
      new Promise((r) => setTimeout(r, 2500)),
    ]).catch(() => {}).then(() => { font = 1; });
    const cutImg = new Image(); cutImg.onload = cutImg.onerror = () => { cut = 1; }; cutImg.src = "/images/halden/hero-cutout.png";
    getManifest(FOLDER).then((m) => {
      let next = 0;
      const pump = () => {
        if (next >= FIRST) return;
        const i = next++;
        const im = new Image();
        im.onload = im.onerror = () => { frames++; pump(); };
        im.src = frameUrl(FOLDER, m, i);
      };
      for (let k = 0; k < 6; k++) pump();
    }).catch(() => { frames = FIRST; });
    void fontP;

    const end = () => {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      ensureClip(FOLDER); // hand the rest of V1 to the film
      window.removeEventListener("wheel", stop, { capture: true });
      window.removeEventListener("touchmove", stop, { capture: true });
      window.removeEventListener("keydown", keys, { capture: true });
      lenis()?.start();
      gsap.to(root.current, { opacity: 0, duration: 0.35, ease: "power1.out", onComplete: () => setGone(true) });
      gsap.fromTo(html, { "--wi": 0 }, { "--wi": 1, duration: 0.9, delay: 0.2, ease: "power1.out" });
    };

    const tick = () => {
      lenis()?.stop();
      const el = performance.now() - t0;
      const want = Math.min(target(), el / MIN_MS);
      shown += (want - shown) * 0.3;
      if (want - shown < 0.002) shown = want;
      if (bar.current) bar.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (pct.current) pct.current.textContent = `${Math.round(shown * 100)}`;
      if (shown >= 0.999 || el > LIMIT_MS) { if (bar.current) bar.current.style.transform = "scaleX(1)"; if (pct.current) pct.current.textContent = "100"; setTimeout(end, 80); cancelAnimationFrame(raf); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { ended = true; cancelAnimationFrame(raf); window.removeEventListener("wheel", stop, { capture: true }); window.removeEventListener("touchmove", stop, { capture: true }); window.removeEventListener("keydown", keys, { capture: true }); };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="ld" aria-hidden>
      {live && (
        <div className="ld-in">
          <div className="ld-word">{nav.brand}</div>
          <div className="ld-line"><div ref={bar} className="ld-bar" /></div>
          <div className="ld-pct"><span ref={pct}>0</span>%</div>
        </div>
      )}
    </div>
  );
}
