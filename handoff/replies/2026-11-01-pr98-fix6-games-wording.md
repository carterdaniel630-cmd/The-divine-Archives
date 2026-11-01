# 2026-11-01 ~13:15 UTC: build loop run. PR #98, audit Fix 6 (homepage games sourcing wording)

**Item:** STATUS → Next 3, audit Fix 6 (`audit-fixes-2026-10-25.md`). This was the highest-value item that needed no
Carter answer. Live homepage honesty wording is value 1 (over-claims). Ahead of it, #96 and the four cleared-chapter
typos wait on Carter, and the Keeper waits on inputs.

## What changed
- New branch `loop/games-sourcing-wording`, cut from `main` `6d51ab9`; head **`f1c3c2a`**; **PR #98**.
- `docs/index.html`, 2 lines, wording only:
  - Games intro: "…drawn from a real chapter, some of them still marked “pending review” — play on…"
  - Games footer: "…every fact in them sourced to a chapter (including chapters still pending review)."
- Why it reads generally rather than naming "trivia": I checked chapter ids in `docs/assets/games/data/*.json` against
  the `pending` flags in `docs/assets/data.js`. The games draw on **eight** pending chapters (ch02, ch08, ch11, ch12,
  ch21, ch42, ch44, ch47), across many games, not only the trivia game the audit named. No game, data or claim changed.
  The current pending set from `data.js` matches the audit's 18.

## Checks on `f1c3c2a`
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry): no
  changes beyond the edit.
- Every `tools/verify-*.js` passes. `node --test framework/test/*.test.js`: 42/42.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless homepage at 360 and 390 px: 0 script errors; both new sentences render.
- Noticed, **not caused by this change** (same on `main`): at 360 px the homepage is 373 px wide. A button and the
  timeline list (`li.tl-node`) reach past the edge. The timeline may be a deliberate sideways scroller; the button
  needs a look. I've logged it in STATUS as a small phone defect to check later.
- GitHub checks on `f1c3c2a`: started by the PR. I did not wait for them, so no lock was held while waiting.

## What #98 still needs to merge
1. An independent review by a run that did not write it. This run wrote it.
2. Every GitHub check green on `f1c3c2a`, Lighthouse included.
3. Carter's yes **by class**: (b), a fix from the audit list he approved (`decisions-2026-10-25-audit-fixes-go.md`
   item 6), plus (c), honesty wording. It is not a new build, does not touch a pending tag and is not religiously
   sensitive, so a per-item trip is not needed.

Graph: the `graphify` CLI is not installed in this session. The change is two strings of page text, and no code paths
moved. Items this run: 1.
