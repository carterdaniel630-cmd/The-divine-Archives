# PR #106 independent review + in-room walk — museum room guide bound to the Directory (fix batch item 2)

**Verdict: FIXED — 1 finding (cosmetic), fixed on the branch; merge HELD for a delta review.**
id `site:pr106`, `loop/museum-guide-binding` reviewed at `3fa0c96` (parent = `main` `6ee2150`, fast-forwardable).
Reviewer: build loop run 2026-11-01 ~20:42–21:30 UTC. This run wrote none of `3fa0c96`'s site changes (built by
session ..WzTm32bq25X2BmA9mPJZ). Carter's go: `order-2026-11-01-106-review-walk-merge.md` ("reviews pass do the walk
through and merge"; a clean pass, not a forced one).

## What changed (2 files)
- `docs/museum/app.js`: new `guideItems(room)`. The guide's vault objects and figures now come from the room's
  `homeVault` / `homeFigs` in the manifest (the lists the Directory prints), not from what stands inside the room's
  floor box. A listed item with no exhibit standing yet is shown as a plain link to its Vault / Pantheon page, but only
  once the room's own exhibits have loaded (so nothing shows as "missing" while loading). Test hooks `__MU.guide`,
  `__MU.zones` added.
- `docs/museum.html`: `app.js?v=41` → `?v=42` (cache-bust; no other file imports `app.js`).

## Correctness (REVIEWER.md §3)
- Same source as the Directory: the in-3D cases (`app.js` ~814) and medallions (~821) are built from the same
  `homeVault` / `homeFigs`, so the binding cannot drift from what the room shows.
- `all.find(inRoom) || all[0]` picks the room's own copy if an id stands in more than one place.
- Output escaped with `esc()`; link targets come from the manifest; the guide's click handler only acts on
  `<button>`s, so the links navigate normally.

## The in-room walk (order item 2)
Real Chromium (software WebGL), phone size 390×700, `node tools/serve.js`, PR build and `main` side by side. Route a
visitor would take: Directory → "walk there" → Room guide.

| Room | `main` `6ee2150` (before) | PR #106 |
|---|---|---|
| Mesopotamia | lists **Agni** and **Saraswati** | gone; Ishtar Gate, Cyrus Cylinder + 8 figures = Directory |
| Tantra (Wing VI) | **Padmasambhava** listed, **Durga missing** | Shiva, **Durga**, Kali = Directory |
| Mahayana | **Amitābha missing** | Avalokiteśvara, **Amitābha**, Mañjuśrī = Directory |

**All 84 rooms** walked the same way and compared with the manifest: 84/84 match the Directory, no extras, nothing
lost. Three Rotunda theme rooms (The Flood: Noah; Creation: Adam, Eve; Sacred Kingship: the Holy Grail) have no case
or medallion standing; the guide now names them as links, the same as the Directory. Page errors: 0.

## Finding (fixed)
1. **Link rows' label sat outside the link** (`app.js` guide markup): for the Rotunda link rows the divider fell between
   the name and its "Vault object" / "Pantheon figure" label, and the label lost its indent (seen on Sacred Kingship,
   screenshot in the run). **Fixed** in `412684a`: label moved inside the link, same as the button rows; `app.js?v=43`.
   Re-walked Sacred Kingship + Tantra: row now matches the others, 0 page errors.

Because this run wrote the fix, it may not pass its own change: **a non-builder run reviews the `3fa0c96..412684a`
delta**, then merge on Carter's go.

## Checks (on `412684a`)
- `review-checks.js --base origin/main --build` 9/9 PASS (all 7 build steps; output matches).
- Every `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 42/42.
- GitHub on `3fa0c96`: 7/7 green incl. Lighthouse. On `412684a`: started on push, not yet complete.

## Merge class
Carter's **per-item go** is on file (the order above). Also fits class (b) (fix from the approved museum fix batch);
no new content, nothing religiously sensitive, no pending tag.

## Not covered
A real phone's touch walk (Carter's or atlas's eye is the final live check).
