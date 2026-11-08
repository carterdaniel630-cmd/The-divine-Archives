# Independent review — PR #126 records corrections

Reviewed: 2026-11-08 ~09:48 UTC, session ..01HFWzTmXjFfdWYKSz1g1Ped (wrote none of #126; builder was ..01HFWzTkuPE8ddzEQWGqvoGB).
Candidate: `loop/records-corrections` @ `e407fa98`, fast-forward from `main` `5d519eeb`.
Scope: `origin/main...e407fa98` against `reviews/REVIEWER.md` §3–§4.

**Verdict: PASS, 0 open findings.**

## What changed (3 files, +13 / −4)
- `README.md`: "twelve / 12 games" → "eleven / 11 games" (Symbols table row); lighthouse workflow row now names the Pantheon and "the eleven games".
- `.github/workflows/lighthouse.yml`: header comment only, same wording. No step, trigger or config changed.
- `handoff/exhibits/the-royal-game-of-ur.html`: an HTML comment after the doctype labelling the file SUPERSEDED v1 / audit reference only, pointing to v2; `<title>` prefixed "SUPERSEDED v1 (audit reference only) —". No script or style touched.

## Checked
- **11 games is true:** `docs/assets/games/catalog.js` on the candidate has 11 entries; `docs/index.html` already says "These eleven games"; `tools/perf-pages.json` measures exactly 11 game pages. (The Firmament retired in #124.)
- **Pantheon named correctly:** `tools/perf-pages.json` lists `/pantheon.html`, so the workflow comment and README now match what Lighthouse measures.
- **Other README counts untouched** and still as the order gives them (84 chapters, 89 Vault + V68 withdrawn, 11 Pilgrimage open).
- **v1 Ur label matches the order** (`records-corrections-2026-11-07.md` item 2): both P0 defects named as in the order; v2 path exists (`handoff/armory/batch-01/builds/the-royal-game-of-ur-v2.html` on `staging/ready-line`); nothing deleted, file kept in place.
- **No other "twelve games" left in README/workflows/site pages.** One historical code comment in `docs/symbols.html` ("the twelve games were ~0.9 MB sent to every visitor") describes the state at the time of the lazy-load fix; it is history, not a current count. Not a finding.
- **Local checks on `e407fa98`:** verify 17/17; `node --test framework/test/*.test.js` 42/42; `review-checks.js --base origin/main --build` 9 PASS / 0 fail / 0 warn; build leaves the tree clean.
- **Headless:** v1 exhibit at 390 px: standards mode (`CSS1Compat`, the comment after the doctype does not trigger quirks), new title shows, no horizontal overflow (scrollWidth 390), 0 console/page errors. No `docs/` page changed, so no site page walk is needed.
- **Merge class:** (c) label / honesty wording. No new build, nothing religiously sensitive, no pending tag touched, not an armory round. Class yes (`decisions-2026-11-01-carter-b-a-a.md`) not revoked in any `handoff/` file.

## GitHub on `e407fa98` at review time
guard, checks, runtime ×2 green; **Lighthouse in progress** (started 09:45 UTC). Not mergeable until it completes green.
