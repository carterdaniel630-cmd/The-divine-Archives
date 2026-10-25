# PR #68 independent review — Pilgrimage wording fixes (Stonehenge, Golgotha, Ararat) and guided walks

**Reviewed:** 2026-10-25 ~10:05–10:50 UTC by a build-loop run that wrote none of #68 (it was written by a chat session
on 2026-10-18). **Candidate:** `claude/pilgrimage-51-fixes` @ `c4e5141` (base `77f6444`, an older `main`).
Reviewed as `origin/main...c4e5141` against `reviews/REVIEWER.md` §3–§4, and checked on a local merge with today's
`main` `c957af5` (merges cleanly, no conflict; nothing pushed to the PR branch).

**Verdict: 0 open findings on #68's own changes.** One pre-existing live defect found on the side (Qumran guided
walk, below), not caused by #68 and not fixed here. Two optional notes.

## Step one: automatic checks (on the local merge with `main`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no output changes.
- Every `tools/verify-*.js`: all pass. `node --test framework/test/*.test.js`: 42/42.
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings. Wikipedia share 0% on all
  three changed source logs.
- GitHub on `c4e5141`: 9/9 checks green incl. Lighthouse and originality (2026-10-18). These ran on the old base; a
  merge would need the branch brought up to `main` and a fresh green round.

## Step two: checklist (§4)
1. **Accuracy (every changed claim, sources opened 2026-10-25):**
   - Ararat 1840 shown as disputed, "obscure and ambiguous": **pass.** Azzoni et al., *Geomorphology* 332 (2019) 10–21,
     abstract at https://air.unimi.it/handle/2434/625867 says "obscure and ambiguous" and argues an
     earthquake-triggered eruption and lahar. Authors and pages match the card and log.
   - Ararat massif "35 to 40 km": **pass.** Britannica student edition, https://kids.britannica.com/students/article/Mount-Ararat/272931
     ("extends for about 25 miles (40 kilometers)"); other summaries give 35 km.
   - Ararat glaciers ">60% of the glacier area": **pass**, wording now matches the logged inventory (unchanged source).
   - Ararat summit card (no verified ancient find; Genesis names a region): **pass**; sources already logged
     (Iranica, Navarra dates, 2010 claim doubted); no verdict language.
   - Golgotha, Cyril's letter about 351 ties the finding of the cross to Constantine's time; Helena story later:
     **pass.** Newman's essay (https://newmanreader.org/works/miracles/essay2/chapter5-5.html) quotes the letter ("the
     salutary Wood of the Cross was found in Jerusalem", in Constantine's time) and puts the Helena accounts at the end
     of the century (Ambrose, 395). The Turin article logged (https://iris.unito.it/handle/2318/1715890) confirms the
     351 letter; its abstract does not itself discuss the finding, which the log already says ("as summarised").
   - Stonehenge, Stone 56 tallest, 8.71 m long with 2.13 m buried (about 6.6 m above ground): **pass.** English Heritage
     "Discover more about the Stones" (tallest sarsen, only upright of the tallest trilithon) and English Heritage blog
     "30 things you might not know about Stonehenge" (8.71 m, 2.13 m buried).
   - Great Trilithon "about 7.3 m with its lintel", flagged in the log as secondary, not found on English Heritage:
     **pass** (honestly labelled).
   - Heel Stone "about 4.5 to 4.7 m above ground": **pass.** Stetson University Neolithic studies page gives "16 feet
     (4.5m)"; Wikipedia (logged as a pointer only) 4.7 m. The old 4.9 m was indeed unsourced.
2. **Lenses:** pass. The Masis and True Cross cards keep the believer's reading; the summit card states what is and
   isn't verified without dismissing the tradition.
3. **Evidence tiers / no "proof" language:** pass. The 1840 card gains a Contested flag.
4. **Contested flagged, not resolved:** pass. The eruption question is laid out both ways.
5. **Tone:** pass.
6. **Religious sensitivity:** pass. Wording only; no new image, model or object; Golgotha is not a restricted site;
   the True Cross card stays "Not part of the reconstruction".
7. **3D / guided walk:** pass. My own headless script (phone 390×844, touch, reduced motion on), pressing "Walk on"
   until it stops, on `main` and on #68 for all six sites:

   | Site | `main` | #68 |
   |---|---|---|
   | Stonehenge | reaches last stop | same |
   | Golgotha | reaches last stop | same |
   | Mount Ararat | **stuck at Durupınar** (3,073 m from the end) | **reaches the summit** (0.16 m from the end) |
   | Great Pyramid | reaches last stop | same |
   | Qumran | **stuck in Chamber 4b** | **same (pre-existing, see below)** |
   | Library of Alexandria | **stuck in the court at stop 2** | **reaches the last stop** |

   Script errors: none from the pages (the only error was Google Fonts, blocked from this session). Screenshots
   checked at Stonehenge (inner horseshoe) and the Ararat summit: both draw.

## Found on the side (pre-existing, not #68's)
- **Qumran guided walk stops in Cave 4's Chamber 4b**, on the live site and on #68, in both motion modes (normal
  motion re-checked on #68). The next route point ("out again", in the `c4-out` portal) is a straight line from 4b
  through rock, so the walker can't get there. Likely fix: route points back through the `c4-through` passage. The PR
  description says Qumran reaches its last stop; that did not reproduce. Added to Next as a small live defect.

## Optional notes (not blocking)
- The model draws the Great Trilithon at about 7.6 m (6.6 m upright + 1.0 m lintel block) against the card's "about
  7.3 m"; the lintel thickness is already marked APPROX.
- Some older scholarship questioned the Cyril letter's authenticity (Newman mentions it); current consensus accepts it.
  The card could say "a letter attributed to Cyril" if Carter prefers caution. Not required.

## What #68 still needs to go live
Carter's yes for this item (it changes live Pilgrimage wording), then: bring it up to `main` (clean), all GitHub
checks green on the new head incl. Lighthouse, local checks again, and a merge by a run that wrote none of it.
