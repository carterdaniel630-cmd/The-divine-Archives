# PR #133 front-door v4 — independent review

**Verdict: PASS, 0 open findings.** Reviewer: session ..01HFWzToHt8256shdsp7mQn1 (wrote none of #133; builder was
..01HFWzTkrJw8NStBm2wJ7Dyv). Candidate `loop/front-door-v4` `a5256e38`, fast-forward from `main` `77d006e6`.
Reviewed `origin/main...a5256e38` against `reviews/REVIEWER.md` §3–§4. Class: **per item** (new build of the homepage).

## §3 automatic checks (on `a5256e38`)
- `review-checks.js --base origin/main --build`: 9 pass, 0 fail, 0 warn; tree clean after the build (committed output current).
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42/42.
- GitHub at review time: checks, guard, runtime ×2, links green; **Lighthouse in progress** (started 22:31 UTC).

## §4 checklist
1. **Accuracy.** Every factual line new to the page was checked against the Vault entry it summarises:
   - Plaque counts: 84 chapters (all `published` in data.js), 89 Vault objects (89 published + 1 withdrawn), 199
     Pantheon figures. Counted by `build-pages` (`home-counts`), so they cannot drift by hand. Pass.
   - V90 copy (sixty lines, Old Babylonian, Enki → Atrahasis, round like a giant coracle, "two by two" in Finkel's
     reading) matches `vault/v90-ark-tablet.md` lines 5, 15–19, 43–44. Pass.
   - V89 copy (Tablet XI, Utnapishtim, 7th-c. BCE copy for Ashurbanipal, George Smith 1872, Genesis) matches
     `vault/v89-flood-tablet.md` line 5. Pass.
   - V58 copy (31 cm, mammoth ivory, cave lion head, upright, found a week before WWII, pieced together over seventy
     years) matches `vault/v58-lion-man.md` lines 5, 9–10, 14–16. Pass.
   No new external claims; no new sources needed.
2. **Lenses balance.** n/a (homepage, no chapter content).
3. **Evidence tiers / no "proof" language.** None introduced; the "Told well, told honestly" block is kept from main. Pass.
4. **Contested claims.** None stated on the page. Pass.
5. **Tone.** Descriptive. Pass.
6. **Sensitivity.** No Báb image, no secret-sacred object, no restricted site, no revered person depicted. Carousel
   objects (V90, V89, V58) are CSS-drawn shapes each labelled "a drawn sketch, not a photograph"; V89/V90 correctly say
   "pending full review" and V58 (not pending) correctly does not. The four photographs (door, hall, parchment, stage)
   are generic architecture/texture, and decode to exactly the MD5s in `handoff/front-door-v4/IMAGES.md`. Pass.
7. **Pages.** Headless Chromium on the served `docs/`:
   - 360, 390 (iPhone 13), 412, 1280, and 390 reduced-motion: standards mode, 0 script errors (only the sandbox's
     blocked Google Fonts request), `scrollX` stays 0 (no sideways scroll). Before it is revealed, the carousel's
     fold-in transform reaches 5–7 px past the edge, but `body` clips it and the page cannot scroll sideways; gone once revealed.
   - Every `.rv` section is visible after a slow scroll at 360/390/412.
   - Carousel Next/Back cycles V90 → V89 → V58 with the right text, honesty line and "Read the Vault entry" link.
   - Door: the closed "Enter the Museum" link is `visibility:hidden` (not focusable); once opened it is visible and focusable.
   - Simple version: the toggle sets `simple`, is remembered per device across reload, and is on by default under reduced motion.
   - Links: 35 unique; the only new targets are `vault/ark-tablet.html` and the parchment image, both present. All 11
     games present (`verify-games-catalog` pass); The Firmament not shown; Ko-fi, methodology, about kept.
   - `build-og`: `tools/data/site-emblem.svg` is byte-identical to the emblem SVG in `main`'s `index.html`, so the
     share card is unchanged.
   - Against the bench proof: the only text dropped is the bench banner, "relics" → "objects in the Vault", the retired
     Firmament card and the shortened proof blurbs, all deliberate honesty fixes the builder listed.

## Notes (not findings)
- `IMAGES.md` records fingerprints, not where the four photographs came from or their licence. Carter approved them
  inside proof v4; atlas may want to note provenance in the repo for the record.
- graphify CLI not installed this session; review touched no code, so no map was needed.

Screenshots: `handoff/previews/pr133-review/`.
