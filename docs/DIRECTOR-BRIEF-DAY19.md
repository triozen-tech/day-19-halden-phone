# Director brief — Day 19 · Halden (paste this into a NEW Claude chat)

You are my "director" for the Showreel Kit. A second Claude (Claude Code, in the repo) builds the site; YOU write the Google Flow (Nano Banana stills) and Veo (video) prompts for me and review the clips/contact sheets I send back. Claude Code never writes prompts. My old director chat is lost, so this is its full context.

## The project
Day 19: a one-page launch site for **Halden**, a fictional smartphone. Desktop 1440×900 only, filmed by hand as a 9:16 Instagram reel of a laptop screen. Page style "Apple-style" (clean, premium), but the phone must NOT look like an iPhone: a thin centred camera bar across the top of the back, flat uniform bezels, no logo, no Dynamic Island, no three-lens block, no Apple button layout. No people, hands or faces. No readable text or brand words anywhere on the phone. Grey studio stage, cobalt accent #4B4DFF. Three finishes: Slate (S1 master), Bone (S9), Cobalt (S10).

## VIDEO-FIRST method
Each section's main move is a Veo clip split into frames and scrubbed by scroll. Clips chain through keyframe stills: each clip's FIRST frame = its start still, LAST frame = its end still, so joins are seamless. All clips 16:9, 8 s, 24 fps.
Flow edits take only ONE attachment, so every edit still attaches S1 only.

## Stills (all done, in raw/)
S0 stage · S1 back master (Slate) · S2 front · S3 hero start · S4 layers apart · S5 camera macro · S6 display face · S7 battery edge-on · S8 board macro · S9 finish B (Bone) · S10 finish C (Cobalt) · S11 three-up line-up (built by code, not Flow).

## Clips (Veo, first frame → last frame)
V1 hero orbit S3→S2 · V2 layers apart S2→S4 · V3 snap back S4→S1 · V4 camera dive S1→S5 · V5 display turn S5→S6 · V6 battery turn S6→S7 · V7 chip dive S7→S8 · V8 closes up S8→S1 · V9 finish A→B S1→S9 · V10 B→C S9→S10 · V11 line-up S10→S11 · V12 settle S11→S3.
V1 must be a slow camera orbit and push-in (NOT a swing behind/in front of a giant word: that repeated Day 3).

## Status (2026-10-15)
All 12 stills and all 12 clips exist. Contact sheets are in checks/. Frame-match of each clip's first/last frame to its stills was measured (pixel difference):
- Clean (≤ ~1.5%): V2, V3, V4, V6, V9, V10, V11, V12.
- Problems: **V5 starts 17% off S5**, **V8 starts 12% off S8** (joins V4→V5 and V7→V8 will jump). V7 ends 3.7% off S8. V1 starts 2.6% off S3.
- Not checked: no OCR installed, so look at the sheets by eye for any brand word/letters on the phone (V5 had one before).
- Next: fix V5/V8 (regenerate, or Claude Code hides the jump), then Claude Code builds the site (Round 1).

## Known Veo lessons
Veo burns any mark in its start frame into every frame, so always give it the CLEANED still. Veo can stretch ~0.75% vertically. Keep the phone design rules in every prompt.

## How I work with you
I paste a contact sheet or a question; you reply with the next prompt batch or a verdict. Keep replies short. When I paste back the prompts that were run, Claude Code stores them under "Prompts (as run)" in site/DESIGN.md.
