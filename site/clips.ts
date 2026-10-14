// Data only: frame folders (play order), frame counts after the Round 2 trims, and the clips of each section.
// Every clip starts and ends on a shared keyframe (S1..S11), so no Veo dissolve is baked into any clip: no `join` ranges.
// Every join uses the kit default crossfade (8 scroll units).
export const CLIP_NAMES = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12"] as const;
export const CLIPS = CLIP_NAMES.map((n) => `/frames/halden-${n}`);
export const COUNTS: Record<string, number> = { v1: 169, v2: 176, v3: 161, v4: 173, v5: 165, v6: 165, v7: 192, v8: 173, v9: 155, v10: 165, v11: 151, v12: 185 };
/** Scroll px per timeline unit (one frame). */
export const PX_PER_FRAME = 6;
export const clip = (n: string) => ({ clip: `/frames/halden-${n}` });
export const SECTION_CLIPS = {
  hero: ["v1"], layers: ["v2", "v3"], camera: ["v4"], display: ["v5", "v6"], chip: ["v7"], finishes: ["v8", "v9", "v10"], prices: ["v11"], footer: ["v12"],
} as const;
const SEGS = Object.fromEntries(Object.entries(SECTION_CLIPS).map(([k, v]) => [k, v.map(clip)])) as Record<keyof typeof SECTION_CLIPS, { clip: string }[]>;
export const segsOf = (k: keyof typeof SECTION_CLIPS) => SEGS[k];
export const runOf = (k: keyof typeof SECTION_CLIPS) => SECTION_CLIPS[k].reduce((s, n) => s + COUNTS[n], 0) * PX_PER_FRAME;

/* ---- ONE film for the whole page (Round 2c): V1..V12 on one scroll ---- */
export const ORDER = Object.keys(SECTION_CLIPS) as (keyof typeof SECTION_CLIPS)[];
export type SecKey = (typeof ORDER)[number];
/** Price hold (Round 2e): the settled lineup (S11 still = V11 last frame = V12 first frame) held for HOLD_W units between V11 and V12 (about 6% of the page). */
export const HOLD_W = 130;
export const HOLD_IMG = "/images/halden/s11-lineup.jpg";
export const ALL_SEGS: ({ clip: string } | { img: string; w: number })[] = CLIP_NAMES.flatMap((n) => (n === "v11" ? [clip(n), { img: HOLD_IMG, w: HOLD_W }] : [clip(n)]));
const spanOf = (n: string) => COUNTS[n] + (n === "v11" ? HOLD_W : 0);
export const TOTAL = CLIP_NAMES.reduce((s, n) => s + spanOf(n), 0);
export const FILM_RUN = TOTAL * PX_PER_FRAME;
/** First timeline unit of clip n. */
export const startOf = (n: string) => CLIP_NAMES.slice(0, CLIP_NAMES.indexOf(n as never)).reduce((s, m) => s + spanOf(m), 0);
/** Timeline unit where frame g (0-based) of clip n is shown. */
export const unitAt = (n: string, g: number) => startOf(n) + (g * COUNTS[n]) / (COUNTS[n] - 1);
/** [from, to] units of each section. */
export const RANGE = Object.fromEntries(ORDER.map((k) => {
  const names = SECTION_CLIPS[k];
  const a = startOf(names[0]);
  return [k, [a, a + names.reduce((s, n) => s + spanOf(n), 0)]];
})) as Record<SecKey, [number, number]>;
/** Finishes: the new colour covers more than half of the phone (measured on the frames: V9 frame 64, V10 frame 60, 1-based). */
export const FINISH_AT = [0, unitAt("v9", 63), unitAt("v10", 59)];

/* ---- Card timing (Round 2d): when each card group fades in / out, chosen by looking at the clip frames ----
 * [fade-in start, fade-in end, fade-out start, fade-out end] in timeline units; frames are 1-based clip frame numbers. */
const fr = (n: string, frame: number) => unitAt(n, frame - 1);
export const CARD: Record<string, [number, number, number, number]> = {
  layers: [fr("v2", 113), fr("v2", 127), fr("v3", 60), fr("v3", 74)],       // exploded stack with all 5 layers on screen
  camera: [fr("v4", 100), fr("v4", 116), RANGE.camera[1] - 14, RANGE.camera[1] - 2], // the camera bar is large (dive)
  display: [fr("v5", 122), fr("v5", 140), fr("v6", 40), fr("v6", 56)],       // lit front visible, until the phone splits into its stack
  battery: [fr("v6", 100), fr("v6", 118), RANGE.display[1] - 14, RANGE.display[1] - 2], // the glowing battery layer in the stack
  chip: [fr("v7", 64), fr("v7", 80), RANGE.chip[1] - 14, RANGE.chip[1] - 2],  // board close-up, not the dive from the stack
  prices: [fr("v11", 135), fr("v11", 148), fr("v12", 18), fr("v12", 30)],     // in at the settled lineup, full for the whole hold, out as the V12 orbit moves the phones
  footer: [fr("v12", 165), fr("v12", 183), Infinity, Infinity],              // slate phone alone and nearly still
};
/** Hero: the word + cut-out finish fading by this unit (V1 frame 6), before the phone has turned enough to show a mismatch. */
export const HERO_WORD_END = 5;
/** Footer: the HALDEN word + the slate cut-out fade in together over the last frames of V12 (0-based 178..184), where the phone stands alone and nearly still. */
export const FOOTER_WORD: [number, number] = [unitAt("v12", 178), unitAt("v12", 184)];
