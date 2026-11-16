# PR #176 independent review — Pilate Stone museum model stood upright

- **Reviewer:** build loop session ..01HFWzTmak5vKWB5pEMzfN4q (scheduled). Wrote none of `loop/pilate-stone-upright`
  (builder's reply `2026-11-16-run-2150-pilate-upright-pr176.md` names itself builder and non-reviewer).
- **Candidate:** `loop/pilate-stone-upright` @ `2562211d`, one commit on `main` `2ceda1ec` (fast-forward possible).
- **Diff `origin/main...2562211d`:** `docs/museum/relics.js` (`CAT.v44` only, 6+/3−), the re-rendered Vault still
  `docs/assets/vault/stills/pilate-stone.webp`, one line in `sources/v44-pilate-stone.md`.
- **Verdict: PASS, 0 findings.** Merges **per item only** (relic): needs Carter's yes.

## Source re-opened
- CIIP II 1277, *Judaism and Rome* record, https://heurist.huma-num.fr/heurist/judaism_and_rome/view/288 (opened
  2026-11-17 by this reviewer): **Height 82 cm, Width 65 cm, Depth 20 cm; letters 6 cm.** The model is now 0.65 wide ×
  0.82 high × 0.20 deep. Correct.
- Cross-check: Wikipedia's Pilate stone infobox also gives height 82, width 65 (cross-check only, not a project source).
- The order (`order-2026-11-15-pilate-stone-orientation-fix.md`) labels 82 × 65 × 20 as width × height × depth and asks
  for "wider than tall". The source contradicts it; the builder followed the source and flagged it. Agreed: the order's
  reading would have left the model as it was, and Carter's 2026-11-14 answer was "turn it upright".
- No photograph of the real stone could be opened from this session either; the comparison is against the CIIP
  measurements, its description (left side broken, lines lose their starts) and the diplomatic text. Said plainly.

## Code
- Only `w`/`h` swapped and the letter fit moved from fractions of the texture to metres. Checked the arithmetic against
  the old values: old letter size `H·0.092` on a 0.65 m face = 6.0 cm → new `0.06·k` = 6 cm; old right margin `W·0.1` on
  0.82 m = 8.2 cm → new `0.082·k`; old baselines `H·{0.3,0.47,0.64,0.81}` on 0.65 m = 0.195/0.3055/0.416/0.5265 m → new
  values identical. So letters, gap, the line-4 stroke and reading direction (the 2026-11-08 fix) are unchanged in
  place; the taller block simply runs on below line 4.
- Observation, not a finding: `k = W / w` uses the nominal width while the texture spans the jagged outline's bounding
  box, so the letter size can differ from 6 cm by a few millimetres. The old code had the same property.
- Vault V44 page wording ("about 82 × 65 cm"; source line "82 cm high, 65 cm wide, 20 cm deep") already agrees with
  the upright model; nothing on any page says "wider than tall". Pending tag untouched; #142 wording untouched.

## Visual
- Re-rendered still (`pilate-stone.webp`) and builder previews (`handoff/previews/pilate-upright/`): upright block,
  inscription in the upper right, broken left edge, lines horizontal and reading left to right, the block stands inside
  its case with room above it from all four sides.
- Headless `museum.html#ch13` at 360 and 390 px on `2562211d`: 0 page errors, no sideways scroll.

## Local checks on `2562211d`
- Full build order: no diff. Verify 18/18. Tests 51/51. `review-checks.js --base origin/main --build`: 9 passed, 0 failed,
  1 warning (wikipedia-share on the V44 source log, pre-existing, not from this PR).
- GitHub: 10/10 green incl. both Lighthouse runs (22:15 and 22:33 UTC).
