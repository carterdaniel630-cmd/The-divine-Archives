# 2026-11-15 ~02:35–03:20 UTC — Statues to their rooms: independent review — FIXED (1 finding, fixed), 0 open

Reviewer: session ..01HFWzToripQrLZoisLfu8ny (build loop). Wrote none of the candidate (builder was
..01HFWzTkZKyQtTHTy1kFpxN4). Scope: `origin/main...loop/statues-to-rooms` at **`b7a8afbd`** (from `main`
`dfe4d272`), against `reviews/REVIEWER.md` §3–§4 and the builder's notes in
`2026-11-15-run-0206-statues-to-rooms.md`.

## Verdict
**FIXED: 1 finding, fixed on the branch; 0 open findings.** New head **`e8807852`**
(`review fix:` commit, registry only). Merge stays **per item** on Carter's yes plus his room choice (sacred
figures, a new scanned model of a revered figure, new placement in the museum: §4 item 6 and §6, never by class).
Because the reviewer made the fix, the one-commit fix itself needs a **delta review** by a session that did not
write it (it is generated output only: `framework/registry/*.json`).

## §3 automatic checks
- `review-checks.js --base origin/main --build`: **9/0/0** (largest file zeus.glb 1.87 MB; Wikipedia share 0%).
- `tools/verify-*.js`: **18/18**.
- `node --test framework/test/*.test.js`: **50/51 on `b7a8afbd`**, failing "the committed registry matches a
  fresh build" (see F1). **51/51 after the fix** on `e8807852`.

### F1 (fixed) — stale build output: entity registry
The source-log commit (`b7a8afbd`) added `sources/museum-statues-in-rooms.md` after the registry was built, so
`framework/registry/source.json` and `index.json` lacked its SMK Sketchfab source
(`source:sketchfab-com/7aec9759f5`). `review-checks.js`' build-output check does not cover the registry, which is
why it read 9/0/0 while the test failed. Fixed by `node tools/build-entity-registry.js` (one entity added, count
2020 → 2021, nothing else changed): commit **`e8807852`** "review fix: rebuild entity registry…", on the §3/§5
self-fix list (stale build output). Suggestion for a later tooling item: add the registry to the build-output
check in `review-checks.js`.

## §4 checklist
1. **Accuracy — pass.** Checked the Zeus card against atlas's plaque (`handoff/rotunda/zeus/zeus-figure.html`,
   MD5 `598d6edabc0bf9e368535d18b9a6fc87`, matches the correction note): same facts, condensed; drape and bronze
   finish are said to be ours, as on the plaque. Sources fetched today:
   - SMK on Sketchfab, https://sketchfab.com/3d-models/zeus-or-poseidon-from-the-artemision-d4876aa609304682945145debedfc77e
     — publisher SMK, CC0 1.0, KAS2100, c. 460–450 BCE, "a 3D scan of a plaster cast", cast in the Royal Cast
     Collection. Supports every scan/licence claim on the card.
   - Hellenic Ministry of Culture, https://olympicgames.culture.gov.gr/en/mithologia/zevs/agalma.html — National
     Archaeological Museum, Athens (inv. X 15161), found in the sea off Cape Artemision, ca. 460 BC, and the
     Poseidon-with-trident vs Zeus-with-thunderbolt identification debate. Supports "now in the National
     Archaeological Museum, Athens" and the open question. (The source log says it did not re-open this; it could
     cite this page in a later class (c) touch. Not a finding: the claim is already on atlas's approved plaque.)
   - Shiva card text unchanged from `main`.
2. **Lenses — pass.** Not a chapter; the card keeps scan vs ours apart.
3. **Evidence tiers — pass.** No proof language; Zeus-or-Poseidon stated as open.
4. **Contested claims flagged — pass.** The identification is flagged, not resolved (subtitle "Zeus or Poseidon",
   and the "open" paragraph).
5. **Tone — pass.**
6. **Religious sensitivity — NEEDS CARTER by rule, already routed:** a new scanned model of a revered figure
   (Zeus) and a sacred statue (Shiva) moved into chapter rooms. Nothing breaks a listed rule (no Báb image, no
   secret-sacred object, no restricted site, no glyph figure given a face). This is the existing per-item gate, not
   a new finding.
7. **Games and 3D — pass.** Own headless probe (Chromium, SwiftShader), at 390×844 and 360×740:
   - **Rotunda:** no statue shown (`shown: []`), 131k triangles / 57 calls.
   - **Close and looking down** (the builder's sweep did not pitch down): 72 views per room, at 1.2, 2.0 and
     3.0 m from the statue, 8 directions, pitch −0.2, −0.5 and +0.2. **0 over** the 220k / 100-call budget. Worst
     Classical Greece **202.7k / 60** (2 m, pitch −0.2, full-detail level), Global Hinduism **166.4k / 41**.
     Margin in Classical Greece stays thin (~17k), as the builder said.
   - **No statue through walls:** from inside ch13, ch14, ch16, ch81, ch82, ch84 (and ch85's door, which locates
     as ch81), neither statue is shown.
   - **Wing drop/rebuild:** after standing in the Modern wing (Axial and High-Medieval wings dropped, `built`
     08/09 only), the statue exhibits stay (2, not duplicated); on return each statue shows from all 8 sides at
     3 m and a centre-screen tap opens the right card from both front and back: Zeus → "Classical Greece",
     "Zeus in the Pantheon" (`pantheon.html#zeus` exists); Shiva → "Turn it in 3D" (`rotunda/shiva.html`),
     "The Rotunda Circle". Room guide lists `statue:zeus` / `statue:shiva` first, nothing missing.
   - **Script errors: 0.** One console line, a Google Fonts load refused by this sandbox's network proxy (not the
     site).
   - Screens: `handoff/previews/statues-to-rooms-review/`.

## Notes (not findings; for Carter or a later class (c) touch)
- `docs/rotunda/index.html` still says "A ring of statues is being made for the Rotunda of the museum". Out of
  date after this change, but the order says the Tray 1 pages are not changed. Builder already put it to Carter.
- Shiva's card keeps "The Rotunda Circle" as its second button; it now stands in Global Hinduism. Accurate (her
  page lives in the Rotunda Circle) but may read oddly; Carter's call.
- Directory line links Shiva's page and Classical Greece, but not the Global Hinduism chapter (ch83). Cosmetic.
- Room choice (Classical Greece ch15, Global Hinduism ch83) is a judgment call; reviewer agrees with the
  by-date reasoning but it is Carter's.

## Still needed before merge
Delta review of `e8807852` by a session that did not write it; a PR so GitHub checks incl. Lighthouse run;
Carter's per-item yes and room choice.
