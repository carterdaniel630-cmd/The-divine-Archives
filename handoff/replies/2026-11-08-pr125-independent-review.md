# Independent review — PR #125 Pilate Stone inscription texture

Reviewer session: ..01HFWzTmZRCps7D6cCq2KqWc (wrote none of #125; builder was ..01HFWzToLMx8pHYm56xpYrUQ).
Reviewed: `origin/main` `3025139b` ... `loop/pilate-stone-texture` `5d519eeb` (3 commits, 4 files), against `reviews/REVIEWER.md` §3–§4.
Order: `handoff/pilate-stone-texture-fix-order.md` (Carter's ruling 2026-11-07 = the per-item yes for this fix).

## Verdict: PASS, 0 open findings

## What the diff does
- `docs/museum/relics.js`: `CAT.v44` paint function now draws four lines of real letters instead of eight rows of random marks; header comment records this one exception to the "illustrative marks, never the text" rule, on Carter's ruling.
- `sources/v44-pilate-stone.md`: one new source line (CIIP II 1277 via the Judaism and Rome database; EDH access-denied, said so).
- `framework/registry/{source,index}.json`: regenerated for that new source line.
- Geometry (`w 0.82, h 0.65`, outline, jag), material (`limestone`, relief 5) and placement are unchanged. Confirmed by reading the diff.

## Named-detail check against the source (opened by this reviewer, 2026-11-08)
CIIP II 1277 (heurist.huma-num.fr/heurist/judaism_and_rome/view/288), diplomatic text:
`[---]S TIBERIEVM / [----]NTIVS PILATVS / [-----]ECTVS IVDA[--]E / [-----]E[-------]`; left side damaged, starts of lines 1–3 lost; line 4's only visible letter "an apex above a vertical line, indicating the letter 'E'"; 82 × 65 × 20 cm; letters 6 cm.
Cross-check: Livius (Pontius Pilate 8) prints the same surviving letters (`S TIBERIEVM / [PO]NTIVS PILATVS / [PRAE]CTVS IVDA[EA]E / [REF]ECI[T]`), restored differently in line 4. EDH HD004074: access denied to this reviewer too.

| Detail | Source | Render of `5d519eeb` |
|---|---|---|
| Line count | 4 | 4 |
| Line 1 | `S TIBERIEVM` | `S TIBERIEVM`, left to right |
| Line 2 | `NTIVS PILATVS` | `NTIVS PILATVS`, left to right |
| Line 3 | `ECTVS IVDA[--]E` | `ECTVS IVDA`, worn two-letter gap, `E` |
| Line 4 | one stroke + apex (E) | one stroke with apex, nothing else |
| Nothing restored | yes | yes (no restored letters drawn) |
| Mirroring | n/a | none: every line reads left to right on the front face (front UVs are planar, not flipped; CanvasTexture default flipY keeps the top at the top) |

Headless renders by this reviewer (isolated `buildRelic("v44")`, swiftshader WebGL) at 1200×900 and 390×844: letters legible, correctly ordered, 0 page errors. `museum.html#ch13` at 390 and 1280: 0 page errors, no sideways scroll.

## Local checks on `5d519eeb`
- `node tools/review-checks.js --base origin/main --build`: 9 PASS, 0 failed, 1 WARN (wikipedia-share 25% on the V44 source log; pre-existing, lowered by this PR).
- every `tools/verify-*.js` (17): ok.
- `node --test framework/test/*.test.js`: 42/42.
- working tree clean after the build (build reproduces committed outputs).

## Finding raised and already closed (F1)
On `1ca6fe46` (the head named in STATUS), `framework/test/schemas.test.js` "the committed registry matches a fresh build" FAILED (41/42): the new source-log line was not in `framework/registry/`. The builder's reply said 42/42. The builder pushed `5d519eeb` ("Rebuild entity registry …") at 07:51:36 UTC, which this reviewer verified is byte-identical to a fresh `node tools/build-entity-registry.js` (this reviewer's own rebuild produced the same tree and was not pushed). Closed; the reviewed head is `5d519eeb`. Note: GitHub's "test" job did not catch this on `1ca6fe46`-era checks; the loop's local framework tests did.

## Advisory (not findings, no action required for merge)
- Line 4's stroke sits at about 62% of line 3's width from the right; CIIP gives no position. Acceptable under the museum's "renditions, not replicas" rule.
- The builder's two notes stand for Carter later: the block is portrait (82 high × 65 wide) but modelled landscape; Vault V44 prints line 4 as `[ . . . FE]CIT D[E . . . ]` while CIIP sees only one E.

## GitHub
On `5d519eeb`: guard, originality, checks, test, runtime ×2 all green. Lighthouse had not run (PR was draft); this run marked #125 ready for review at ~08:05 UTC to start it. **Merge waits only on Lighthouse green on `5d519eeb`**, then fast-forward per item (`main` `3025139b` is its parent's base; fast-forward confirmed possible).

## Merge class
Per item, not by class: it changes a relic's inscription. Carter's per-item yes: `pilate-stone-texture-fix-order.md` ("fix the site build", rides merge-on-green). Nothing religiously sensitive or sacred: a Roman building dedication.
