# 2026-11-01 ~19:55 UTC: museum fix batch item 2 built as PR #106 (room guide bound to the Directory)

Build loop run (fired with a stale chain note from 18:57: #104 and the #105 review were already done by the
previous run, so this run took the next item).

## PR #106 `loop/museum-guide-binding` `3fa0c96` (stacked on #105 `6ee2150`)
- **Cause:** the room guide chose Vault objects and Pantheon figures by position (`roomOfExhibit`: the exhibit's
  centre inside the room's area ±0.2 m). Neighbours' medallions near a shared wall counted; a room's own placed past
  its bounds did not.
- **Fix:** `guideItems(room)` lists the room's own exhibits (lectern, plate, boards, game) plus exactly the manifest's
  `homeVault` / `homeFigs`, the same lists `build-museum.js` prints in the Directory. A home item with no exhibit built
  yet is still named, linked to its Vault page / Pantheon entry (only once the room's own exhibits are in, so nothing
  shows as "missing" while loading). Test hook `__MU.guide(room)`. `app.js?v=42`.
- **Verified:** review-checks `--build` 9/9; verify 18/18; tests 42/42; museum loads `app.js?v=42` with 0 script
  errors. Logic test of the shipped function on the real manifest: walk cases rebuilt as stubs (Mesopotamia +Agni
  +Saraswati, Mahayana −Amitabha, Tantra +Padmasambhava −Durga): old rule reproduces the faults, new rule equals the
  Directory; all 84 rooms equal the Directory; link fallback and loading cases correct. Every Directory home item is
  present in `museum/wings/*.json` (0 missing).
- **NOT verified hands-on: do not call it fixed.** Inside any museum room the sandbox's software renderer crashes
  (ch03 teleport crashed at ~80 s, also at 160×160 px), so the in-room walk of Mesopotamia, Mahayana and Tantra (Wing
  VI) must be done on a phone or a real browser (atlas / Carter) or by a run whose browser survives it.
- Stacked on #105 because both bump `app.js?v=`; merge #105 first, then #106.
- Merge gate: independent review (non-builder run), GitHub green incl. Lighthouse, the hands-on room walk. Proposed
  class (b) (fix from the approved museum fix batch); reviewer decides, if in doubt per item.

## PR #105
GitHub 7/8 green on `6ee2150`; Lighthouse still running at ~19:55 UTC. Not merged yet (no waiting with the lock).
