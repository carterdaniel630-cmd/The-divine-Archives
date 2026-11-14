# PR #138 — independent review (2026-11-14 ~21:00 UTC)

**Verdict: PASS, 0 open findings.**
- PR: #138 (#128 + #129 re-synced and stacked onto `main` `b2b45e52`), branch `loop/games-128-129-resync` @ `bd8bbd81`.
- Reviewed: `origin/main...bd8bbd81` against `reviews/REVIEWER.md` §3–§4.
- Reviewer: loop run, session ..01HFWzTkvpo734GmyALhY5cs. **Independent:** this session wrote none of #128, #129 or the
  #138 re-sync (builders ..01SC4kUKEy8YwVAdEAzfD3Jn and ..01HFWzTog8q4XPvrCMhponie).

## What the diff is
Site files only in `docs/` (plus `handoff/CURRENT.md`):
- `games.css` (+111/−1): on phone-width screens (≤520 px) the game window hangs from the top instead of centred
  (#129's layout-shift fix); a new sideways-phone full-screen layout (three columns, board as tall as the screen) for
  Ouroboros, the Labyrinth, Ziggurat, Antithesis, Dominion, Archive Chess, the Excavation, the Reliquary and the
  Divine Casualties / Chess choosing screens; the tilted Pause pill moved up 8 px.
- `archive-games.js` (+6/−2): the script stops resizing the board in that mode for the newly laid-out games, only
  where the browser supports `:has()` (older browsers keep the old fitting — no regression there).
- `excavation.js` (+2/−1): re-measures on the `archive:fit` event; listener removed in cleanup (no leak).
- `symbols.html`: cache-version bumps (games.css v25, archive-games.js v13, excavation.js v7). These are the only
  references in `docs/` to the three files, so no page is left on a stale version.

## §3 automatic checks (run by this session on `bd8bbd81`)
- `review-checks.js --base origin/main --build`: **9 PASS, 0 FAIL, 0 WARN**; build left the tree clean (output current).
- `tools/verify-*.js`: **18/18 pass**. `node --test framework/test/*.test.js`: **51 pass, 0 fail**.
- GitHub at review time: runtime ×2, guard, checks, test, links, verify **green**; **Lighthouse still running**
  (started 20:46 UTC) — the merge waits on it.

## §4 checklist
1–5 (accuracy, lenses, evidence tiers, contested claims, tone): **pass — not applicable.** No chapter, Vault entry,
Pantheon figure, source log or visible wording changed; CSS comments and layout only.
6 (religious sensitivity): **pass.** No image, model, sacred object, holy site or revered person added or changed.
7 (games): **pass.** Own headless probe (Playwright, touch + mobile, local server), all 11 games opened by
`symbols.html#play=<id>`:
- 844×390 and 667×375, put into full screen with the game's own button: all 22 cases open, full screen, dialog scroll
  height = screen height (nothing scrolls), no page sideways scroll, **no button/canvas/score/message outside the
  screen**, 0 script errors.
- Same probe on `main` for comparison: Divine Casualties and Archive Chess choosing screens and Dominion overflowed
  the screen sideways (Dominion's map 31 px above the top, its button 113 px below) — **#138 fixes all three.**
- 390×844 (portrait): all 11 open, 0 errors. Divine Casualties' choosing screen scrolls inside its window
  (scroll 1470 vs 818) — **identical on `main`**, not introduced here (note only, not a finding).
- Looked at screenshots of Dominion, Chess, Ziggurat, Antithesis, Excavation, Reliquary, Divine Casualties and the
  Labyrinth sideways: boards centred and full height, scores left, controls right, corner buttons clear, the
  cathedral-archive look unchanged.

## Notes (not findings)
- Frontend-design skill is not installed in this session; the visual pass was by screenshot against the site's
  existing look.
- Divine Casualties' portrait choosing screen scrolling inside its window is pre-existing; could be a later small
  polish item if Carter wants.

## Merge conditions (LOOP.md "Merging")
0 Carter's per-item yes: `decisions-2026-11-09-merges-yes.md` 3–4 ✔ · 1 independent review 0 findings ✔ ·
2 GitHub green incl. Lighthouse — **waiting on Lighthouse** · 3 local checks ✔ · 4 nothing needing separate
approval (no new game/feature/page, no pending tag, nothing sensitive; a layout fix to existing games) ✔ ·
5 commits after candidate touch only `handoff/` — to check at merge.
