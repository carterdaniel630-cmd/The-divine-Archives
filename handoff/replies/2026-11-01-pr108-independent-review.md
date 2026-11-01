# 2026-11-01 ~22:20 UTC — Independent review: PR #108 (museum fix batch item 5, Directory honesty)

**Candidate:** `loop/directory-honesty` @ **`8634b5e`** (on top of #107 `4bb3d40`, which is now `main`, so it
fast-forwards). Reviewed diff: `4bb3d40..8634b5e` (3 files: `tools/build-museum.js`, `docs/museum.html`,
`docs/museum/app.js`).
**Reviewer:** loop run, session ..WzTpAhoVEY9mHq6DBzuy. Wrote none of the candidate (builder: ..WzTnSRoVWhWeqdGS4iCw).
**Verdict: PASS, 0 findings.** Merge class: (b) fix from Carter's approved museum fix batch (item 5) and (c)
honesty wording. Not new content, nothing religiously sensitive.

## What the order asked (`order-2026-11-01-museum-fix-batch.md` item 5)
"Its 'Every room' claim is itself the fault — it omits rooms it doesn't name. It also never names the pilgrimage
portal. (The Keeper's Study is by design unlisted.)"

| Point | Result |
|---|---|
| False completeness claim removed | **pass.** Lead now "The museum's halls and its chapter rooms, by wing, with their exhibits." In-world plaque "every room, every exhibit" → "the halls and the rooms". No "every room" left in any page text (remaining hits are code comments in `world.js`, `sound.js`, `app.js`, `mogao-caves/dims.js`). |
| Rooms it didn't name | **pass.** Every named region in `app.js` (`region(...)`: hall, rotunda, spine, wings, rooms) is now covered: entrance hall, planetarium (Rotunda dome), Spine gallery listed; the Rotunda and the 9 wings already headed sections; 84/84 chapter rooms listed. |
| Pilgrimage portal named | **pass.** "Portal: The Pilgrimage: walk the sacred sites" → `pilgrimage.html` (exists). |
| Keeper's Study / hidden Arcade | **pass.** Still unlisted, as ordered. |
| Hall descriptions true to the museum | **pass.** Portal against the entrance hall's north wall (`app.js` 616/632); "the planetarium's star projector at the centre of the Rotunda" (`app.js` 608, exhibit name "The planetarium"); "one banner per Age" in the Spine (`app.js` 589–596); 9 eras in `data.js`; `eras.html` exists. |
| Walk-there buttons | **pass.** Hall items carry no `dir-` id, so the `li[id^='dir-']` selector (`app.js` 1455) skips them. |
| Cache bump | `app.js?v=44` → `45`, matches the plaque change. |

## Checks (run by this reviewer on `8634b5e`)
- `node tools/review-checks.js --base origin/main --build` (full build order): **9/9 PASS, 0 warnings**; tree clean after build.
- Every `tools/verify-*.js`: **18/18 pass.** `node --test framework/test/*.test.js`: **42/42.**
- Headless Chromium (WebGL), phone 320 px and 390 px, Directory opened from the 3D museum: **0 page errors**, no sideways
  scroll (scrollWidth = viewport), 3 hall items with **0** buttons, **84/84** rooms with "walk there"; tapping a
  room's "walk there" re-enters 3D with 0 errors. Screenshot at 320 px checked: halls section reads cleanly in the
  site's look, label "PORTAL:" matches the existing "PANTHEON:" style.
- REVIEWER.md §4: items 1–5 not applicable (no chapter, Vault or Pantheon text); §6 sensitivity: nothing touched; §7
  museum renders, no script errors.

## Optional note (not a finding)
"The planetarium" sits under "The halls" though it is the Rotunda's dome; the line under it says so ("at the centre of
the Rotunda"), so it reads correctly.

## Still needed before merge
GitHub green on `8634b5e` incl. Lighthouse (in progress at 22:20 UTC). Then fast-forward `main` `4bb3d40` → `8634b5e`.
