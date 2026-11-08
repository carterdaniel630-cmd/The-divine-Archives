# Delta review — PR #127 "The Rök Stone, Decoded" (`d56e7b70..e3580f47`, re-synced as `09a91489`)

- **Reviewer run:** build loop, 2026-11-08 ~12:42–12:46 UTC, session ..01HFWzTp138J8Mesib7KWxUk. Wrote none of the page (builder ..01HFWzTovazLUaNgT45KnyVv) and none of the F1–F3 fix (..01HFWzToDbeCsTjAxH4V2v4M); was not the first reviewer (..01HFWzTk1pee9maQ9EiUJWJN).
- **Diff reviewed:** `d56e7b70..e3580f47`: `docs/vault/rok-runestone-decoded.html` (3 lines), `sources/rok-runestone-decoded.md` (+5 lines, new "Corrections after independent review" section). Nothing else changed.
- **Verdict: PASS — 0 open findings.** F1, F2, F3 all closed. The page is still per item to merge (new page), and still lacks photographs (order item 7) and the V36 back-link (order item 8) by design.

## Findings re-checked
- **F1 closed.** §6 now reads "counted three weighty new interpretations: a further article by Holmberg, a book by Williams, and a two-volume alternative by Bo Ralph that reads the stone differently again." This is the first review's suggested wording word for word; no longer implies all three oppose the 2020 reading. The source log says Källström's post was still read only through the report.
- **F2 closed — re-checked against Wikipedia directly by this run** (en.wikipedia.org/wiki/Rök_runestone, fetched 2026-11-08 ~12:43 UTC). The Unicode transcription prints the group as `[2:5 = ᛌ] [2:3 = ᛁ]ᛓᛁ`, transliterated "sibi". The table row now reads "2:5, 2:3 + *bi* → *sibi*". Match. The other cross groups in the same line were re-read at the same time and still match the page: `[3:2][1:4]` ul, `[2:2][2:3]` ni, `[3:5][3:2]ᚦᛧ` ruþR, `[3:2][2:3]ᛆ` uia, `[3:2][2:4]ᚱᛁ` uari. The source log keeps the poster's "first class" *i* as an open conflict, which is the honest handling.
- **F3 closed.** §4b now says the family numbers are as printed and are not counted in the row's left-to-right order (*f u þ a r k* family 3, *t b m l R* family 1). Checked against every pair printed on the page: 3:2 u, 3:3 þ, 3:5 r, 3:6 k; 1:1 t, 1:3 m, 1:4 l; 2:2 n, 2:3 i, 2:4 a, 2:5 s. Consistent.
- No new claims introduced by the fix; no wording outside the three spots changed.

## Re-sync onto `main`
- Merged `main` `e407fa98` (PRs #123–#126, all already reviewed and live) into `loop/rok-stone-page` as **`09a91489`**. Two generated-file conflicts (`framework/registry/index.json`, `source.json`) resolved by taking `main`'s copy and re-running the full build order; the rebuild re-added only the Rök source entry. `origin/main...09a91489` is now the same six files as the reviewed PR: the page, its source log, sitemap line, `build-pages.js` (2 lines), registry index/source.

## Local checks on `09a91489`
- Full build order (stamp-dates, build-og [0 re-rendered], vault, chapters, pages, museum, framework, entity-registry): tree clean afterwards.
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings** (Wikipedia share 1/11).
- `tools/verify-*.js`: **17/17 ok** (was 18: `verify-pinball.js` left with #124).
- `node --test framework/test/*.test.js`: **42/42 pass**.
- Headless 360 / 390 / 1280: 0 page errors, no sideways page scroll, pending banner shown, all three corrected texts present.

## Still missing before merge (not findings)
1. GitHub checks incl. the hard Lighthouse gate green on `09a91489` (started by this push).
2. Photographs (order item 7) from atlas — or Carter says the page may go live without them.
3. **Carter's per-item yes** (new page; never by class).
4. V36 back-link needs Carter's re-clear of V36 (separate question).

## Sources fetched by this run
- https://en.wikipedia.org/wiki/R%C3%B6k_runestone (Unicode transcription, cross-cipher line)
