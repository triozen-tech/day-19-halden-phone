"use client";
import type * as React from "react";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import FrameScrub from "@/components/video/FrameScrub";
import { prefersReducedMotion } from "@/lib/gsap";
import { ALL_SEGS, CARD, CLIPS, FILM_RUN, FOOTER_WORD, HERO_WORD_END, HOLD_IMG, ORDER, RANGE, TOTAL, segsOf, type SecKey } from "@/site/clips";

/** ONE fixed stage for the whole page: V1..V12 play as one scroll film; each section is a label + cards that fade (opacity only) at its part of it.
 *  ?static=1: every section gets its own still stage instead, no motion. */
const FADE = 12; // timeline units (frames) of a section's fade in / out

const store = { p: 0, subs: new Set<() => void>() };
const subscribe = (f: () => void) => { store.subs.add(f); return () => { store.subs.delete(f); }; };
/** Reads a value derived from the film's global timeline unit (0..TOTAL). */
export function useFilmUnit<T>(pick: (u: number) => T, still: T): T {
  const st = useContext(StaticCtx);
  return useSyncExternalStore(subscribe, () => pick(store.p), () => still) ?? (st ? still : still);
}
const StaticCtx = createContext(false);
export const useIsStatic = () => useContext(StaticCtx);

const ramp = (u: number, a: number, b: number) => (b <= a ? (u >= a ? 1 : 0) : ss((u - a) / (b - a)));
const ss = (x: number) => { const m = Math.min(1, Math.max(0, x)); return m * m * (3 - 2 * m); };
export const STILL: Record<SecKey, number> = { hero: 0, layers: 0.5, camera: 0.5, display: 0.5, chip: 0.5, finishes: 0.08, prices: 0.9, footer: 1 };
const IDS: Record<SecKey, string> = { hero: "top", layers: "layers", camera: "camera", display: "display", chip: "chip", finishes: "finishes", prices: "prices", footer: "footer" };

/** Between the film frame and the phone: the HALDEN word, then a transparent cut-out of the phone (fitted to the frames) on top. */
const Behind = ({ r, kind }: { r?: React.Ref<HTMLDivElement>; kind: "hero" | "footer" | "film" }) => (
  <div ref={r} className="behind" aria-hidden style={kind === "film" ? { ["--f" as string]: 0 } : undefined}>
    {kind !== "footer" && <div className="hw">HALDEN</div>}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {kind !== "footer" && <img className="hc" src="/images/halden/hero-cutout.png" alt="" draggable={false} />}
    {kind !== "hero" && <div className="fw">HALDEN</div>}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {kind !== "hero" && <img className="fc" src="/images/halden/footer-cutout.png" alt="" draggable={false} />}
  </div>
);

export default function Film({ secs }: { secs: Record<SecKey, ReactNode> }) {
  const [still, setStill] = useState(false);
  const ovl = useRef<HTMLDivElement>(null);
  useEffect(() => { setStill(prefersReducedMotion()); new Image().src = HOLD_IMG; }, []);

  const behind = useRef<HTMLDivElement>(null);
  const items = useRef<{ el: HTMLElement; w: [number, number, number, number] }[] | undefined>(undefined);

  const onProgress = (p: number) => {
    const u = p * TOTAL;
    if (Math.abs(u - store.p) > 1e-4) { store.p = u; store.subs.forEach((f) => f()); }
    const root = ovl.current;
    if (!root) return;
    if (!items.current) {
      // every direct child of a section is a fading piece: a card group (own window from CARD) or a label / default (the section's window)
      items.current = Array.from(root.children).flatMap((sec) => {
        const k = (sec as HTMLElement).dataset.sec as SecKey;
        const [a, b] = RANGE[k];
        const dflt: [number, number, number, number] = [k === "hero" ? -1 : a + 2, k === "hero" ? -1 : a + 2 + FADE, b - 2 - FADE, b - 2];
        return Array.from(sec.children).map((el) => ({ el: el as HTMLElement, w: CARD[(el as HTMLElement).dataset.card ?? ""] ?? dflt }));
      });
    }
    for (const { el, w } of items.current) {
      const o = ramp(u, w[0], w[1]) * (1 - ramp(u, w[2], w[3]));
      el.style.setProperty("--o", o.toFixed(3));
      el.style.visibility = o < 0.02 ? "hidden" : "visible";
    }
    const bh = behind.current;
    if (bh) { // the HALDEN word + the phone cut-out fade out together over the first frames of V1
      const wv = 1 - ramp(u, 0, HERO_WORD_END);
      const fv = ramp(u, FOOTER_WORD[0], FOOTER_WORD[1]); // ... and the footer word + slate cut-out fade in together at the end of V12
      bh.style.setProperty("--w", wv.toFixed(3));
      bh.style.setProperty("--f", fv.toFixed(3));
      bh.style.visibility = wv < 0.01 && fv < 0.01 ? "hidden" : "visible";
    }
  };

  if (still) {
    return (
      <StaticCtx.Provider value>
        {ORDER.map((k) => (
          <section key={k} id={IDS[k]} data-section={k} className="film-static">
            <div className="stage">
              <FrameScrub segs={segsOf(k)} clipOrder={CLIPS} stillAt={STILL[k]} className="absolute inset-0 z-0">{(k === "hero" || k === "footer") && <Behind kind={k} />}</FrameScrub>
              <div className="absolute inset-0"><div data-sec={k} className="sec">{secs[k]}</div></div>
            </div>
          </section>
        ))}
      </StaticCtx.Provider>
    );
  }
  return (
    <section id="film" data-section="film" className="film" style={{ ["--run" as string]: `${FILM_RUN}px` }}>
      <div className="stage">
        <FrameScrub segs={ALL_SEGS} clipOrder={CLIPS} onProgress={onProgress} className="absolute inset-0 z-0"><Behind r={behind} kind="film" /></FrameScrub>
        <div ref={ovl} className="absolute inset-0">
          {ORDER.map((k) => <div key={k} data-sec={k} className="sec" style={k === "hero" ? undefined : { visibility: "hidden" }}>{secs[k]}</div>)}
        </div>
      </div>
    </section>
  );
}
