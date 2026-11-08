# Independent review — PR #131 relic-stills ruling wording

Reviewed: 2026-11-08 ~19:55 UTC, session ..01HFWzTpNfstcd2HdCkYSakz (wrote none of #131; builder was ..01HFWzTpF7x1ot1imVro7TC1).
Candidate: `loop/relic-stills-ruling-wording` @ `2c350132`, fast-forward from `main` `593d7d17`.
Scope: `origin/main...2c350132` against `reviews/REVIEWER.md` §3–§4.

**Verdict: PASS, 0 open findings.** Merge stays **per item** (Carter's yes needed): REVIEWER.md §6 sends anything touching sacred-object holds to Carter, and LOOP.md "Merging" says never by class for it.

## What changed (1 file, +3 / −3)
`tools/data/relic-stills.json`: the reason strings for V57 (Holy Mandylion), V25 (Veil of Veronica), V13 (Tilma of Guadalupe)
change from "Held for Carter … no ruling yet on such images on chapter pages" to "Kept off by Carter's ruling, 2026-11-08
(handoff/decisions-2026-11-08-carter-b-correct-yes.md 1) … no such image on chapter pages". Keys unchanged; 17 ids still excluded.

## Checked
- **Matches the ruling:** `handoff/decisions-2026-11-08-carter-b-correct-yes.md` item 1 is "(b) keep them off" for exactly these three ids, chapter pages only; the new text says no more than that. It does not touch the D2 holds (item 2) or any other id.
- **Only keys are load-bearing:** `tools/build-chapters.js` (`!NO_STILL[i.id]`), `tools/build-relic-stills.js` (`!EXCLUDE[i.id]`) and `tools/verify-relic-stills.js` read the ids; the strings appear only in console messages. No page shows them.
- **JSON valid**, `_about` untouched, no id removed (the `_about` rule "remove an id only on Carter's ruling" holds).
- **Note, not a finding:** the cited path lives on `staging/ready-line`, not on `main` (main's `handoff/` is an old snapshot). Existing reasons already cite staging-side handoff orders the same way.
- **Local checks on `2c350132`:** full build order (stamp-dates → og → vault → chapters → pages → museum → framework → entity-registry → sky) leaves the tree clean (no `docs/` change); verify 18/18; `node --test framework/test/*.test.js` 42/42; `review-checks.js --base origin/main --build` 9 passed / 0 failed / 0 warnings.
- **Headless:** not needed — no page output changes (byte-identical build).
- **Sensitivity (§4.6):** no image, model or page added; the three stills stay off. Recording a ruling, not changing what is shown.

## GitHub on `2c350132`
6/6 completed green (checks, guard, verify ×2, runtime ×2, 18:45–18:46 UTC). Lighthouse did not run: its workflow fires only on `docs/**`
and Lighthouse paths, which this PR does not touch. If Carter's yes comes, the merging run should either dispatch Lighthouse by hand or
record that no Lighthouse run exists for a no-`docs/` diff (as with #131's predecessor no-docs PRs) before merging.
