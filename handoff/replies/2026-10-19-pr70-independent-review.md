# PR #70 (hit-feel part 1) — independent review

**Run:** build loop, 2026-10-19 ~04:57–05:15 UTC. **Candidate:** `loop/hit-feel` @ `ea70b77` (one commit on `main` `77f6444`,
fast-forwards). **Reviewer independence:** this run wrote none of the candidate's site changes. Nothing merged.

## Verdict
**0 blocking findings.** One optional note (below). Lighthouse was still running when this run ended, so the item is not
yet listed "mergeable now": it needs Lighthouse green on `ea70b77`, then Carter's yes for this item.

## Automatic checks (REVIEWER §3), run on `ea70b77`
- Full build order (stamp-dates → build-og → build-vault → build-chapters → build-pages → build-museum → build-framework →
  build-entity-registry → build-sky): reproduces with **no generated changes**.
- `review-checks.js --base origin/main --build`: **9/9 passed, 0 warnings**.
- 17/17 `tools/verify-*.js` pass. `node --test framework/test/*.test.js`: **42/42**.
- ESLint 8 could not be fetched in this sandbox; the PR's `runtime` job (which runs ESLint 8 with
  `tools/eslint-games.json`) is green.
- GitHub checks on `ea70b77`: checks, guard, links, runtime ×2, test **green**; **lighthouse in progress** at 05:05 UTC.

## Checklist (REVIEWER §4)
1. Accuracy: no factual text changed. The only new words are code comments and the bumper names already in the game
   (Earth, Sun, Moon, Pole Star). **Pass.**
2–5. Lens balance, evidence tiers, contested claims, tone: no chapter, Vault or Pantheon content touched. **Pass (n/a).**
6. Religious sensitivity: no images, sacred objects or holy sites added; effects only. **Pass.**
7. Games: opened headless at phone size (390×844, touch) on `symbols.html#play=…`, played automatically ~25 s each,
   hit kit instrumented from outside (no code change):

| Game | Motion setting | Hits fired | Frozen frames | Shaken frames | Script errors |
|---|---|---|---|---|---|
| The Firmament | normal | sling 16, tick 27, thunk 11, bumper 11, big 3 | 60 | 805 | 0 |
| The Firmament | reduced | sling 13, tick 29, thunk 5, bumper 13, big 2, lose 1 | 73 | **0** | 0 |
| Antithesis | normal | paddle 7, tick 5, lose 5 | 51 | 323 | 0 |
| Antithesis | reduced | paddle 6, tick 6, lose 5 | 49 | **0** | 0 |

   Reduced motion is respected (Item 31 #6): no shake at all; the freeze stays (it is a pause, not motion). Screenshots
   show the "+100 / +500" numbers and a normal end screen; no black canvas. **Pass.**

Code read in full (`feel.js`, both game diffs, `symbols.html`, lint config). Also checked:
- Flash brightness: the cap (30% of a warm cream over the dark tables) raises screen brightness by well under the 10%
  luminance step that counts as a "flash" under the accessibility rule (WCAG 2.3.1), so fast bumper combos are not a
  seizure risk. Inferred by calculation from the colours in the code, not measured with an instrument.
- Freezes never chain (at least 0.15 s of play between them); repeats of the same hit are spaced; both games still
  load if `feel.js` is missing (guarded). Only `symbols.html` loads these two games, and its cache versions were bumped.

## Optional note (not blocking; left as is)
- On iPhones, if a visitor's sound setting is already "off" (set in The Unfinished Journal) at their first tap, and they
  turn it back on later in the same visit, the hit sounds stay silent until the page is reloaded (the kit only opens
  audio on the first tap). Narrow case; a reload fixes it. A two-line fix (resume audio on every tap) can ride hit-feel
  part 2. Not a §5 self-fix, so not changed here.

## To merge
- Lighthouse green on `ea70b77` (a later run re-checks; this run did not wait holding the lock).
- Carter's yes for **this item** (STATUS → Needs Carter 00).
