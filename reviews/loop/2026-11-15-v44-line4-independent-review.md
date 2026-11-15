# Independent review — V44 Pilate Stone line-4 honesty fix

- **Candidate:** `loop/v44-line4` **`d2b2a589`** (one commit on `origin/main` `dfe4d272`; `main` has not moved).
- **Reviewer:** build loop, session ..01HFWzTko2z1CJJmwhmVzyRw, 2026-11-15 ~01:50 UTC. Wrote none of the candidate
  (builder ..01HFWzTkMGvxnMv4aarLmkzX; research ..01HFWzTjyNoEN5pLRCegiguU).
- **Against:** `reviews/REVIEWER.md` §3–§4, `CLAUDE.md` sourcing standard.
- **Verdict: PASS, 0 findings.** One note for Carter (not a finding), below.

## What changed (11 files, +23 / −19)
- Source: `vault/v44-pilate-stone.md` (line 4 `[ . . . ]E[ . . . ]`, one new bullet on the two readings, "built,
  restored or dedicated", CIIP II 1277 under "The stone"), `sources/v44-pilate-stone.md` (CIIP entry with the old
  wording recorded), `docs/assets/vault-data.js` (V44 relic word 4, gloss, translation, disputed note; `pending: true`).
- Rebuilt outputs only: `docs/vault/pilate-stone.html`, `docs/vault.html` (badge), museum wings 04/05 (word-diff:
  only `"pending":false` → `true` on V44), search index, sitemap lastmod, `content/dates.json`,
  `framework/registry/relic.json` (status → pending).
- Model geometry (F1) not touched. Nothing deleted.

## Source check (done again by this reviewer)
- *Judaism and Rome* record 288 (CIIP II 1277), XML view `heurist.huma-num.fr/heurist/judaism_and_rome/hml/288`,
  opened 2026-11-15: diplomatic line 4 `[-----]E[-------]`, "only visible letter is an E" (apex over a vertical);
  82 h × 65 w × 20 d cm; Alföldy (1999) `[ref]eci[t]`, widely accepted (Eck, Demandt); Taylor: E may be part of
  *dedicavit*. Every sentence the branch adds matches this record. (The `/view/288` page itself was not openable from
  this session; the XML record of the same entry was. EDH HD004074 was blocked by bot protection; not relied on.)
- Contested point is flagged, not resolved: the page gives both readings and says the end is uncertain.

## Site-wide check
- No other page on the branch still prints `FE]CIT`, `CIT D[` or `FECIT D`; no other Pilate "dedicated/made" claim
  found outside V44.

## Local checks (on `d2b2a589`)
- `node tools/review-checks.js --base origin/main --build`: **9 pass, 0 fail, 1 warning** (Wikipedia share 25% in
  `sources/v44-pilate-stone.md`, 1 of 4: pre-existing line, covered by the Wikipedia-strip order). The build
  reproduced the committed outputs exactly (tree clean after the build).
- `tools/verify-*.js`: **18/18 pass**. `node --test framework/test/*.test.js`: **51/51 pass**.
- Headless Chromium, `vault/pilate-stone.html` at 360×740, 390×844, 1280×800: 0 page errors, 0 failed local
  requests (only console noise: Google Fonts blocked by this sandbox's proxy), no sideways scroll; old line absent;
  new note, pending badge + banner, CIIP source and relic `[…]E[…]` all present.

## Not checked here
- **GitHub checks incl. Lighthouse: none have run**, because no PR is open from `loop/v44-line4` (this environment
  opens PRs only when asked). Merge condition 2 is still unmet.

## Note for Carter (not a finding)
Alföldy's restoration is printed in its scholarly form *[ref]eci[t]*, where by convention the unbracketed "eci" would
mean letters he read on the stone, while CIIP's own transcription sees only the E. The page states CIIP's view ("only
one letter survives") and quotes Alföldy exactly as CIIP does. Accurate as is; could be smoothed later to
"restored it as *refecit*" if Carter prefers plainer wording.

## Merge path (unchanged)
Per item, never by class (re-opens a cleared entry and re-tags it): needs a PR so GitHub incl. Lighthouse runs green,
then Carter's V44 (2) **a** plus **a1** (re-clear V44 at merge) or **a2** (keep pending).
