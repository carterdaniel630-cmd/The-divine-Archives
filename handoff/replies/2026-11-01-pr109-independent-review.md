# 2026-11-01 ~22:55 UTC — Independent review: PR #109 (museum fix batch item 6, state resets)

Reviewer: loop run, session ..WzTnptQAgwvXPPxpLPCu. It wrote none of #109 (builder: ..WzTpAhoVEY9mHq6DBzuy).
Candidate: `loop/state-resets` **`c4d1ce8`**, parent = `main` `8634b5e` (fast-forward). Reviewed `origin/main...c4d1ce8`
against `reviews/REVIEWER.md` §3–§4.

**Verdict: PASS, 0 findings.** Class (b): a fix from the museum fix batch Carter approved
(`order-2026-11-01-museum-fix-batch.md`, item 6). No content, no chapter, no pending tag, nothing sensitive.

## §3 automatic checks (run on `c4d1ce8`)
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings**; build left the tree clean (committed output current).
- every `tools/verify-*.js`: **18/18 OK**.
- `node --test framework/test/*.test.js`: **42 pass, 0 fail**.

## §4 checklist
1–5 (accuracy, lenses, tiers, contested, tone): **n/a** — no prose, chapter, Vault or Pantheon text changed.
6 (religious sensitivity): **pass** — no image, model or page added; the Qumran / Book of Enoch case is only which
   heading names the dialog.
7 (games and 3D): **pass** — headless (Chromium, swiftshader) at 360 and 390 px:
   - museum: a label card opened, then an object examined → the inspector panel is labelled by `mu-insp-h`, which
     is inside the panel and reads the examined object's heading; exactly 1 `#mu-card-h` and 1 `#mu-insp-h` on the
     page; hover tag hidden while examining; no sideways scroll (360 / 390); 0 page errors.
   - shared sound: `da-snd` = off set on the museum origin → Stonehenge opens with its sound button off; 0 page errors,
     no sideways scroll.
   - GitHub `runtime` ×2 green.

## Code read
- `inspect.js`: the panel's `aria-labelledby` is now its own id; `ownHeading()` runs after every `open()` and from a
  MutationObserver (childList) for later rewrites such as `ritual-player.js` walkthroughs. Renaming the id is an
  attribute change, so it cannot re-trigger the observer. No code looks the heading up by `#mu-card-h` after writing
  it (grep: only writers in `app.js`, `engine.js`, `ritual-player.js`).
- `app.js` / `engine.js`: `clearHover()` on card open and on the Directory fallback; the frame loop only re-shows the
  tag when the card is hidden, so it comes back after close, as described. `S.skyHover` exists and is reset in `closeCard` too.
- Sky: `sel.value` follows `S.sky.state.site.id` (option values are site ids); `autocomplete="off"` stops a restored
  form value; the guide's time line is tagged `data-sky-time` and kept in step.
- Sound: both players read `da-snd` first, then their old key; write only `da-snd`. Storage access stays in try/catch.
- Cache bumps consistent: no importer left on `inspect.js?v=9/10`, `engine.js?v=7`, `sound.js?v=1` or `app.js?v=45`;
  museum and Pilgrimage now import the same `inspect.js?v=11` URL (one module instance instead of two).
- Arcade page bumped by hand; the build check confirms the generated pages match `tools/build-pages.js`.

## GitHub at review time (`c4d1ce8`)
checks, guard, test, verify ×2, runtime ×2, links: **green**. **Lighthouse: in progress** (started 22:34 UTC).

## What's left before merge
Only Lighthouse green on `c4d1ce8`. Then fast-forward `main` `8634b5e` → `c4d1ce8` by class (b). If `main` moves
first: re-sync, re-run local checks and GitHub. Nothing for Carter.

Optional note (not a finding): the commit's co-author line is a plain "Claude" line, as the rule asks.
