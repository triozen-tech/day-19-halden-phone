# DESIGN.md — Day 19 · Halden (smartphone launch)

**Mode: Pro (Claude Pro plan, now and in future).** LEAN rules apply: no reel recording, screenshots only in Round 1, `npm run build` + `npm run check` each round. Desktop 1440×900 only. Hand-recorded: every scroll motion is a pure function of scroll position (any speed, forward and back); every section also has a small idle motion so the page never looks frozen. **VIDEO-FIRST (Day 19 only):** each section's main move is a Veo clip, split into frames (`npm run film-frames` → `public/frames/<clip>`) and scrubbed by the scroll. Hand-written animation code is only for what a video can't show (counters, bars, labels, swatch swap).

**Status (Round 3):** film, cards, loader, footer word and price hold done; cover made (`recordings/day-19-cover.jpg`, copy in `covers/`). Filming: `http://localhost:3012/?record=1`, Chrome full screen 1440×900, ~32 s scroll (page 12,984 px). Ready to film.

Plan line: "An Apple-style launch page in one day." "Apple-style" = the page style, **not the product**.

## Direction

| Choice | Pick | Why |
|---|---|---|
| Brand | **Halden** | Fictional name, picked by the director after the plan's first name and one shortlist name clashed with real brands. |
| Look | Cool grey studio stage inside a rounded bezel frame (custom, from the keyboard screen-recording reference) | The 3D object lives on one grey stage and never leaves it; text sits small in the corners. |
| Palette | Studio grey `#B9BBC1` → `#8E9096` gradient stage · bezel `#2A2B2F` · text `#101114` · muted `#4A4C53` · accent **cobalt/indigo `#4B4DFF`** (fills, rings, bars; white text on it is 7:1; as text only at ≥ 24 px) | One accent; cool, not the warm/orange of earlier tech days. |
| Type pair | **Syne** (display, 700–800, wide) + Inter | New pair (not T31); Syne's wide caps match the giant HALDEN word. |
| Nav | NV15 large title condenses into the bar: giant HALDEN in the hero shrinks into the bar wordmark; 3 links + underlined "Where to buy?" | Ties hero and nav; matches the reference's slim bar. |
| Hero | HR04 giant wordmark behind a centred product | From the hero reference (smart lock → phone). Close to Day 3's word-behind-cone (**repeat noted in the sites log**). To keep it different, V1 is a slow camera orbit and push-in around the phone, not a swing behind and in front of the word. |
| Signature | Layers split and snap back (layout D) | Phone separates into layers and reassembles. Differs from Day 1's exploded watch: scroll-position-pure, both directions, no callout lines. |
| Chapter UI | Counter **001/005** left, "Share" bottom-left, "Scroll" bottom-centre (from the reference) | Five chapters on the stage. |
| Traveling object | — (Day 19 is not an F day) | |

**The phone must NOT look like an iPhone:** thin centred camera bar across the top of the back; flat uniform bezels; no logo; no Dynamic Island; no square or three-lens corner block; no Apple-style button layout. **No people, no hands, no faces.**

**Different from the last sites:** see `docs/SITES-LOG.md` (local) · layout codes below are all new for the last 3 days.

## References (from the user's picks, no pick letters; both are the user's own clips)

| Section | Reference | What we take |
|---|---|---|
| Hero | `refs/inbox/hero.mov` (smart-lock site) · mine | Giant word behind and in front of the product, product swings back → front, bottom-left tab row, mini price card. Phone replaces the lock. Tab row links to Layers · Camera · Display · Finishes (no FAQs tab: FAQ is cut). |
| Layers → Footer | `refs/inbox/Screen Recording…mov` (keyboard site) · mine | One grey stage in a bezel frame, tiny nav, chapter counter, "Share" / "Scroll", the object explodes, unfolds and dives into macro scenes, small corner text. |

Cut from the plan: Compare models, Reviews, FAQ. Spec rows live on the price cards.

## Section plan, clips and scroll code

Keyframe stills (S-IDs, see Asset list) chain the clips: each Veo clip runs from one keyframe to the next, so clips join on identical frames. The kit's reusable scrub engine (`FrameScrub`, film-frames options, chain helper; being added to showreel-kit, pulled in with `npm run sync-kit` in this folder only once the director says "kit pushed") plays them. No custom scrub code in this site; a section's scroll code only maps the pin's progress to clip time. Everything shows its final state with `?static=1`.

| # | Section | Layout | Clip (what it shows) | Start → end keyframe | Hover | What the scroll code does |
|---|---|---|---|---|---|---|---|
| 0 | Loader | — | none | — | — | Bezel frame lights up, stage fades up (new I code, assigned in Round 1). |
| 1 | Nav | NV15 | none | — | link underline draws; "Where to buy?" fills indigo | HALDEN giant → bar wordmark by scroll position. |
| 2 | Hero | HR04 | **V1** slow camera orbit and push-in around the phone, back → front, screen waking | S3 → S2 | Cursor-follow edge glow on the stage; tab pills fill | Scrubs V1 over the hero pin (FrameScrub from the kit); headline M107 focus resolve; price mini-card slides in at the end. |
| 3 | Layers (001) | FT01 | **V2** phone separates into layers; **V3** layers snap back together | S2 → S4, S4 → S1 | Hovering a hairline layer row lights it and dims the others | One pin: first half scrubs V2, second half V3 (the snap). M385 layer names on depth planes. Counter ticks 001. |
| 4 | Camera (002) | FT20 | **V4** macro dive along the thin centred camera bar | S1 → S5 | Spec chip (aperture, sensor, zoom) expands its line | Scrubs V4; ledger lines appear at set progress points; M370 split-away headline. |
| 5 | Display & battery (003) | BN10 | **V5** phone turns to its bright face; **V6** turns edge-on with the battery layer glowing | S5 → S6, S6 → S7 | Display widget: indoor/outdoor toggle; battery widget: hover shows hours per use | Two separate widgets: nits count up (M347) with V5 only; battery bar fills to hours (M133) with V6 only. Never mixed. |
| 6 | Chip (004) | ST01 | **V7** dive onto the board, chip glowing | S7 → S8 | Number tile lifts, bar sheen | Scrubs V7; big numbers count, tiles snap in (M34). |
| 7 | Finishes (005) | PS19 | **V8** board closes back into the phone (finish A) · **V9** A → B · **V10** B → C | S8 → S1, S1 → S9, S9 → S10 | **Swatch hover swaps to that finish's still (S1 / S9 / S10); swatch click scrolls to its clip** | Scroll picks finish A → B → C by progress and back; swatch label and name change; M31 tilt-in for the name. 3 finishes only. |
| 8 | Models & prices | PR01 | **V11** the three finishes line up side by side | S10 → S11 | Card tilts, spec rows highlight, price slides up | Scrubs V11, cards rise in (M438). ₹ prices labelled "sample", 3–4 key specs per card (display, battery, camera, chip). |
| 9 | Footer | FO09 | **V12** phone settles back to the opening pose (closes the loop) | S11 → S3 | Link underline; wordmark letters nudge | Curtain reveal M220; "Concept website by Triozen Tech". |

Reviews and FAQ are cut (so no sample-review section). Transitions: none needed, clips join on shared keyframes. M27 (frame-scrub) is the one shared engine behind every clip; each section above names its own supporting code, none twice.

## Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | new I code (Round 1) | bezel lights up, stage fades up | fixed 2 s |
| 1 | Nav | NV15 | condense-on-scroll | giant word becomes the bar wordmark | scrub |
| 2 | Hero | HR04 | M107 + M27 | V1 scrubs, headline resolves | scrub |
| 3 | Layers | FT01 | M385 + M27 | V2 then V3, layer names on depth planes | scrub, hold at the split |
| 4 | Camera | FT20 | M370 + M27 | V4 dive, headline halves split | scrub |
| 5 | Display & battery | BN10 | M347 + M133 + M27 | nits count with V5, hours fill with V6 | scrub, two stops |
| 6 | Chip | ST01 | M34 + M27 | V7 dive, tiles snap in | scrub |
| 7 | Finishes | PS19 | M31 + M27 | V8 → V9 → V10 by scroll, swatches follow | scrub, 3 stops |
| 8 | Prices | PR01 | M438 + M27 | V11 line-up, cards fly in from depth | scrub, hover stop |
| 9 | Footer | FO09 | M220 + M27 | V12 settles, curtain lifts | scrub |

Idle motion (every section): slow stage-light drift and a very small breathing scale on the stage; nothing depends on the record cursor.

## Hover map

| Element | Where | Hover effect | Record cursor |
|---|---|---|---|
| Hero stage | Hero | edge glow follows the pointer | data-hover-demo |
| Tab pill | Hero | fills indigo | — |
| Layer row | Layers | row lights, others dim | data-hover-demo (2nd row) |
| Spec chip | Camera | line expands | data-hover-demo |
| Display toggle / battery bar | Display & battery | indoor/outdoor flip; hours tooltip | data-hover-demo="click" |
| Number tile | Chip | lifts, sheen | — |
| Finish swatch | Finishes | swaps to that finish's still, ring tightens | data-hover-demo="click" (swatches B, C) |
| Price card | Prices | tilt, spec rows highlight | data-hover-demo (1st card) |
| Buttons / links | everywhere | fill wipes left → right / underline draws | data-hover-demo (hero CTA) |

At least 3 record-cursor stops per reel.

## Product detail plan

| Interaction | Section | How it works here | From |
|---|---|---|---|
| Swatches swap the product | Finishes | hover swaps to the finish still, click scrolls to its clip | ours (keyboard reference stage) |
| Spec rows on the card | Prices | 3–4 key specs per model, highlight on hover | ours |
| Sticky buy box | — | not used (single page of three models) | — |

## Reel time table (34–38 s total)

| Part | Seconds |
|---|---|
| Loader | 2.0 |
| Hero V1 | 4.0 |
| Layers V2 + V3 (hold at the split 1 s) | 6.0 |
| Camera V4 | 3.5 |
| Display & battery V5 + V6 | 5.0 |
| Chip V7 | 3.0 |
| Finishes V8–V10 (3 swatch stops) | 5.5 |
| Prices V11 (hover stop 1.5 s) | 4.0 |
| Footer V12 | 3.0 |
| **Total** | **36.0** |

## Assets (specs only, no prompts)

Source for everything: **Flow (stills) + Veo (clips)**. No Blender: a phone is a complex gadget (lesson 113). Credits and repo size are not a limit for Day 19 (director's call), so more clips are fine. Stills `.jpg`; `.png` only for transparent cut-outs; clips `.mp4`, 16:9. Each clip's first and last frame must be the pixel-identical keyframe (lessons 116, 117: check Veo stretch and burned marks; give Veo the cleaned still). Frames by video time: `npm run film-frames` → `public/frames/<clip>`, every frame a keyframe (lesson 102).

Batch 1 (independent) → Batch 2 (Flow edits, ONE attachment only: S1 for every edit) → **Batch 2b (code, no Flow: S11 from cut-outs of S1, S9, S10 on S0)** → Batch 3 (all Veo clips together).

| Batch | ID | Name | What it is | Ratio | Save as | Attach | Code fallback |
|---|---|---|---|---|---|---|---|
| 1  S0 | Empty stage | The grey studio stage alone, no phone | 16:9 | raw/s0-stage.jpg | nothing | CSS gradient stage |
| 1  S1 | Back master (finish A) | Halden phone, back, upright, centred: thin centred camera bar across the top, flat uniform bezels, no logo | 16:9 | raw/s1-back-master.jpg | nothing | none (the master) |
| 2  S2 | Front, screen on | Same phone upright, front, screen lit | 16:9 | raw/s2-front.jpg | S1 | S1 flipped + code screen |
| 2  S3 | Hero start | Same phone, back, tilted 3/4, as the opening pose | 16:9 | raw/s3-hero-start.jpg | S1 | S1 + CSS 3D tilt |
| 2  S4 | Layers apart | Same phone separated into stacked layers (glass, display, board, battery, back plate) floating on the stage | 16:9 | raw/s4-layers.jpg | S1 | stacked S1 slices with parallax |
| 2  S5 | Camera macro | Extreme close-up along the thin camera bar | 16:9 | raw/s5-camera-macro.jpg | S1 | S1 crop + scale |
| 2  S6 | Display face | Front straight-on, bright screen filling the frame | 16:9 | raw/s6-display.jpg | S1 | S2 scaled |
| 2  S7 | Battery edge-on | Phone on its edge with the battery layer glowing | 16:9 | raw/s7-battery-edge.jpg | S1 | S4 crop of the battery layer |
| 2  S8 | Board macro | Close-up of the board and chip, glowing | 16:9 | raw/s8-board-macro.jpg | S1 | S4 crop of the board layer |
| 2  S9 | Finish B | Same pose as S1, second finish | 16:9 | raw/s9-finish-b.jpg | S1 | S1 colour-graded in code |
| 2  S10 | Finish C | Same pose as S1, third finish | 16:9 | raw/s10-finish-c.jpg | S1 | S1 colour-graded in code |
| 2b  S11 | Three-up line-up | **Built by code, not Flow:** `npm run cutout` on S1, S9, S10, then the three phones side by side on the S0 stage with soft contact shadows (`python3 scripts/lineup.py`, done) | 16:9 | raw/s11-lineup.jpg | — (code, Batch 2b) | itself |
| 3  V1 | Hero orbit | Slow camera orbit and push-in, back → front, screen wakes | 16:9 | raw/v1-hero.mp4 | start S3, end S2 | S3 → S2 crossfade + tilt |
| 3  V2 | Layers apart | Phone separates into layers | 16:9 | raw/v2-layers-apart.mp4 | start S2, end S4 | S2 → S4 crossfade |
| 3  V3 | Snap back | Layers reassemble into the phone | 16:9 | raw/v3-snap-back.mp4 | start S4, end S1 | V2 reversed |
| 3  V4 | Camera dive | Macro dive along the camera bar | 16:9 | raw/v4-camera-dive.mp4 | start S1, end S5 | S1 → S5 zoom |
| 3  V5 | Display turn | Turns to the bright face | 16:9 | raw/v5-display.mp4 | start S5, end S6 | S5 → S6 crossfade |
| 3  V6 | Battery turn | Turns edge-on, battery glows | 16:9 | raw/v6-battery.mp4 | start S6, end S7 | S6 → S7 crossfade |
| 3  V7 | Chip dive | Dive onto the board and chip | 16:9 | raw/v7-chip.mp4 | start S7, end S8 | S7 → S8 crossfade |
| 3  V8 | Closes up | Board layers close back into the finished phone | 16:9 | raw/v8-close.mp4 | start S8, end S1 | S8 → S1 crossfade |
| 3  V9 | Finish A → B | The phone changes finish | 16:9 | raw/v9-a-to-b.mp4 | start S1, end S9 | S1 → S9 crossfade |
| 3  V10 | Finish B → C | The phone changes finish | 16:9 | raw/v10-b-to-c.mp4 | start S9, end S10 | S9 → S10 crossfade |
| 3  V11 | Line-up | The three finishes line up | 16:9 | raw/v11-lineup.mp4 | start S10, end S11 | S10 → S11 crossfade |
| 3  V12 | Settle | Phone settles back to the opening pose | 16:9 | raw/v12-settle.mp4 | start S11, end S3 | S11 → S3 crossfade |

## Prompts (as run)

Pasted by the user from the lost director chat, word for word. Date: 2026-10-14/15 (exact day per prompt not recorded). Takes = how many Flow/Veo outputs were generated. Wave A attached S1 to every edit; Wave B attached the still named.

### Stills (Flow)

**S0 · Empty stage** · 16:9 · raw/s0-stage.jpg · Attach: nothing
> An empty seamless product-photography studio. Smooth light-grey backdrop (cool neutral grey, about #C9CCD1) that curves down into a matching floor with no visible horizon line. Soft, even studio light from the upper left, very gentle falloff toward the corners, a faint soft shadow area in the centre of the floor. Completely empty: no objects, no phone, no props, no text, no logos, no people. Clean, minimal, high-end commercial look, sharp, 16:9 landscape.

**S1 · Back master (finish A, "Slate")** · 16:9 · raw/s1-back-master.jpg · Attach: nothing
> A single modern smartphone seen from the BACK, standing upright and perfectly centred on a seamless light-grey studio floor, straight-on view, portrait orientation, the phone filling about 70% of the frame height. Finish: deep slate graphite, matte frosted-glass back with a thin brushed-aluminium frame and softly rounded corners. The back is completely plain and uniform. The only feature is ONE thin horizontal camera bar, centred near the top of the back, a slim glass capsule sitting flush with the surface and holding two small round lenses and one tiny flash dot. No logo, no text, no markings, no printed words. Do NOT make it look like an iPhone or any known brand: no three-lens square block, no apple shape, no Dynamic Island. Smooth cool-grey studio backdrop (about #C9CCD1) that curves into the floor, soft even light from the upper left, a soft contact shadow under the phone. Sharp commercial product photo, 16:9 landscape, no people, no hands.

**Wave A: attach S1 (raw/s1-back-master.jpg) to every one**

**S2 · Front, screen on** → raw/s2-front.jpg (x4) · Attach: S1
> Show this exact same phone from the FRONT instead of the back, same upright position, same size, same studio stage, same light and soft contact shadow. Screen is on with a smooth abstract wallpaper of soft cobalt-blue and violet gradient shapes. Thin flat equal bezels all round, a single tiny round front-camera dot centred at the top of the screen. No text, no icons, no clock, no status bar, no notch, no logo. Keep the slate graphite aluminium frame. 16:9 landscape, no people, no hands.

**S3 · Hero start (back, 3/4 tilt)** → raw/s3-hero-start.jpg (x4) · Attach: S1
> The same phone, same slate finish, same camera pill, still seen from the back, but rotated about 35 degrees on the spot so we see the back and the right edge, camera slightly low. Same studio stage, light and soft contact shadow. Phone about 70% of the frame height, centred. No logo, no text, no people, no hands. 16:9 landscape.

**S4 · Layers apart** → raw/s4-layers.jpg (x4) · Attach: S1
> An exploded view of this same phone: the phone is separated into five thin flat layers floating in the air one above the other with even gaps, seen from a slight 3/4 angle, all centred. From top to bottom: the slate matte back glass with the camera pill, a thin flat battery layer with a faint soft cobalt glow along its edges, a dark circuit board with fine gold traces and one small square chip, the display layer with a lit abstract cobalt screen, and the thin aluminium frame. Same grey studio stage and light, soft shadow far below. No text, no logos, no markings. 16:9 landscape, no people, no hands.

**S5 · Camera macro** → raw/s5-camera-macro.jpg (x4) · Attach: S1
> Extreme macro close-up of the camera pill on the back of this same phone, filling the frame, centred. Two round lenses with deep blue-violet glass reflections, a small sensor and a tiny flash, crisp edges, the surrounding slate back glass softly out of focus, shallow depth of field, the same cool grey studio light. No logo, no text. 16:9 landscape.

**S9 · Finish B (Bone)** → raw/s9-finish-b.jpg (x2) · Attach: S1
> Keep this image exactly the same (same pose, same camera pill, same stage, same light and shadow). Change ONLY the phone's colour to a warm bone ivory off-white, matte, with a pale silver frame. Nothing else changes. 16:9 landscape.

**S10 · Finish C (Cobalt)** → raw/s10-finish-c.jpg (x2) · Attach: S1
> Keep this image exactly the same (same pose, same camera pill, same stage, same light and shadow). Change ONLY the phone's colour to a deep saturated cobalt blue (#4B4DFF), matte, with a darker blue frame. Nothing else changes. 16:9 landscape.

**Wave B: after wave A is saved**

**S6 · Display face** · Attach S2 (raw/s2-front.jpg) → raw/s6-display.jpg (x2)
> Same phone, same front view, straight-on and centred, a little closer so it fills about 85% of the frame height. The screen is brighter and glowing, the bright abstract cobalt-violet wallpaper unchanged, and a soft cool glow spills onto the studio floor. Same stage and light. No text, no icons, no logo. 16:9 landscape.

**S7 · Battery edge-on** · Attach S4 (raw/s4-layers.jpg) → raw/s7-battery-edge.jpg (x4)
> The same five floating layers, now viewed exactly edge-on from the side, so they look like five thin horizontal slabs stacked with gaps, centred. The battery layer glows softly in cobalt blue along its edge. Same grey studio stage and light. No text, no logos. 16:9 landscape.

**S8 · Board macro** · Attach S4 (raw/s4-layers.jpg) → raw/s8-board-macro.jpg (x4)
> Extreme macro close-up of the circuit board layer of this exploded phone, seen from above at a slight angle, a small square chip centred, fine gold traces around it, shallow depth of field, cool grey studio light. No text, no logos, no markings on the chip. 16:9 landscape.

**S11** has no prompt: built by code (`python3 scripts/lineup.py`).

### Clips (Veo)

| Clip | Start frame | End frame | Save as |
|---|---|---|---|
| V1 | s3-hero-start.jpg | s2-front.jpg | raw/v1-hero.mp4 |
| V2 | s2-front.jpg | s4-layers.jpg | raw/v2-layers-apart.mp4 |
| V3 | s4-layers.jpg | s1-back-master.jpg | raw/v3-snap-back.mp4 |
| V4 | s1-back-master.jpg | s5-camera-macro.jpg | raw/v4-camera-dive.mp4 |
| V5 | s5-camera-macro.jpg | s6-display.jpg | raw/v5-display.mp4 |
| V6 | s6-display.jpg | s7-battery-edge.jpg | raw/v6-battery.mp4 |
| V7 | s7-battery-edge.jpg | s8-board-macro.jpg | raw/v7-chip.mp4 |
| V8 | s8-board-macro.jpg | s1-back-master.jpg | raw/v8-close.mp4 |
| V9 | s1-back-master.jpg | s9-finish-b.jpg | raw/v9-a-to-b.mp4 |
| V10 | s9-finish-b.jpg | s10-finish-c.jpg | raw/v10-b-to-c.mp4 |

**V1 · Hero orbit**
> The camera glides slowly in an arc around the standing phone while pushing in gently. The phone starts seen from the back at a three-quarter angle and, as the camera moves around it, ends facing the front, upright and centred, with the screen waking up in a soft glow at the very end.

**V2 · Layers apart**
> The upright front-facing phone calmly comes apart: the back glass, battery, circuit board, display and frame lift and separate vertically, floating into five thin layers with even gaps, while the camera rises slightly to a gentle high three-quarter angle. Smooth, slow, precise.

**V3 · Snap back**
> The five floating layers glide back together, align, and snap into one finished phone while the camera moves around it, ending on the phone seen from the back, standing upright and centred.

**V4 · Camera dive**
> The camera glides smoothly toward the camera pill on the back of the phone and dives in, the phone leaving the frame, until the pill fills the whole picture straight-on, lenses catching soft blue-violet reflections. Slow and steady.

**V5 · Display turn (first run; replaced by the re-run below)**
> The camera pulls back from the camera macro to reveal the phone, which turns on the spot to show its front, ending upright and centred, straight-on, with the screen glowing bright and soft light spreading onto the floor.

**V6 · Battery turn**
> The glowing-screen phone calmly separates into five thin layers while it turns edge-on, so the layers read as five slim horizontal slabs with even gaps; the battery layer glows softly in cobalt blue along its edge.

**V7 · Chip dive**
> From the edge-on stack of layers, the camera moves down into the circuit board layer and tilts to a close macro view over the board, ending centred on the square chip with fine gold traces fanning out around it, shallow depth of field.

**V8 · Closes up (first run; replaced by the re-run below)**
> The camera pulls back from the circuit board as the layers float back together and close up into the finished phone, which turns to show its back, ending upright and centred.

**V9 · Finish A to B**
> A smooth wave of colour sweeps over the standing back-facing phone from top to bottom, changing the matte slate graphite finish into a warm bone ivory finish. The phone's pose, shape, camera pill and position do not move at all.

**V10 · Finish B to C**
> A smooth wave of colour sweeps over the standing back-facing phone from top to bottom, changing the warm bone ivory finish into a deep saturated cobalt blue finish. The phone's pose, shape, camera pill and position do not move at all.

### Re-runs

**V5, re-run x4 takes.** Start s5-camera-macro.jpg, end s6-display.jpg, save as raw/v5-display.mp4:
> Start exactly on the straight-on macro of the camera pill, then the camera slowly pulls back to reveal the whole phone, which turns on the spot to show its front, ending upright and centred, straight-on, with the screen glowing bright and soft light on the floor. The back of the phone is completely plain at every moment: absolutely no text, no letters, no brand name, no logo, no printing anywhere on the phone. The phone stays deep slate graphite throughout. Smooth continuous camera, no cuts. The grey studio stage and light never change. No people, no hands, no propellers, no mist, no extra objects.

**V8, re-run x2 takes.** Start s8-board-macro.jpg, end s1-back-master.jpg, save as raw/v8-close.mp4:
> The camera pulls back from the circuit board macro. The board is one of five thin flat layers (back glass, battery, circuit board, display, thin frame) that float together and close up into the finished phone. Only these five layers: no copper parts, no camera modules, no extra components, no extra internals. The finished phone turns to show its back and ends upright and centred, in deep dark slate graphite, never silver or light grey, with the thin camera pill. No text, no logos. Smooth continuous camera, no cuts. The grey studio stage and light never change. No people, no hands, no propellers, no mist, no extra objects.

### V11 and V12 (need S11 = raw/s11-lineup.jpg first; bone left, slate centre slightly larger, cobalt right)

**V11 · Line-up.** Start s10-finish-c.jpg, end s11-lineup.jpg, save as raw/v11-lineup.mp4 (x2):
> The single cobalt blue back-facing phone glides smoothly to the right while two more identical phones glide in from the left and settle next to it: a warm bone ivory one on the left and a deep slate graphite one in the centre, slightly larger and a little in front. They end as a neat line-up of three upright back-facing phones with soft contact shadows. Each phone keeps exactly the same design with a thin camera pill on the back. No text, no logos, no people, no hands, no extra objects. Smooth continuous camera, no cuts. The grey studio stage and light never change.

**V12 · Settle.** Start s11-lineup.jpg, end s3-hero-start.jpg, save as raw/v12-settle.mp4 (x2):
> The bone phone on the left and the cobalt phone on the right glide out of the frame to the sides, while the slate graphite phone in the centre turns slowly on the spot to a three-quarter back angle and settles alone in the centre. Same phone design throughout, thin camera pill on the back. No text, no logos, no people, no hands, no extra objects. Smooth continuous camera, no cuts. The grey studio stage and light never change.
