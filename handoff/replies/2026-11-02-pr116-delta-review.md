# Delta review — PR #116 (ch01 Ark Tablet 1985/2009 note), fix for F1

**Id:** site:pr116 · **Candidate:** `loop/ch01-ark-dates` @ `5f41173` (delta `f7c7d79..5f41173`, parent `main` `cb8c52f`)
**Reviewer:** session ..01HFWzTjwXBago34nDXqR2sv, 2026-11-02 ~07:37–07:50 UTC. Wrote none of #116
(builder ..01HFWzTnn5yoLm3RF8BKRxrL; first reviewer and F1 fixer ..01HFWzTk9uK91ZXBirrhE5wt).
**Verdict: F1 closed; 1 new open finding F2 (fixable, honesty wording). Not mergeable yet.**

## §3 automatic checks (clean worktree at `5f41173`)
- `review-checks.js --base origin/main --build`: 9/9 PASS, 0 warnings; tree clean after the build.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42/42.
- Headless ch01 at 360×640 and 390×844 (touch): 200, 0 page errors, no sideways scroll, new wording present, pending tag present.
- GitHub on `5f41173`: 9/10 green; **Lighthouse in progress** (started 07:42:01 UTC).

## Scope
Delta touches only the one ch01 paragraph (theme md, `content/chapters.js`, `docs/chapters/ch01.html`), the ch01
Sources bullet, the source log and regenerated registry/dates (4 new source nodes). Matches the reply.

## F1 (first review) — closed
"many 2014 news reports give only 2009" is gone. Checked this run, all opened:
- historyofinformation.com (https://historyofinformation.com/detail.php?id=4060): "In 2009 … received"; cites the
  BM blog and the Guardian (24 Jan 2014). Supports "a later summary gives 2009 alone". ✔
- Times of Israel (AP, 24 Jan 2014) and CSM (25 Jan 2014): "Finkel got hold of it a few years ago"; no year. ✔
- NBC News: no year. ✔

## F2 — open (fixable, honesty wording)
New wording: "some later summaries give 2009 alone, while most 2014 news reports say only "a few years ago"."
Two over-statements:
1. **"some later summaries"** — plural; only one summary is cited (historyofinformation.com) and the source log names only that one.
2. **"most 2014 news reports say only 'a few years ago'"** — the quoted phrase is the Associated Press story's
   (Jill Lawless), which is one report syndicated many times: Times of Israel, CSM, Deseret News
   (https://www.deseret.com/2014/1/24/20461490/was-noah-s-ark-round-tablet-in-british-museum-contains-building-instructions,
   "By Associated Press"), Daily Star. The other 2014 reports opened this run give **no year and not that phrase**:
   PBS NewsHour 24 Jan 2014 (https://www.pbs.org/newshour/world/new-evidence-suggests-noahs-ark-may-have-been-round),
   Archaeology magazine 27 Jan 2014 (https://archaeology.org/news/2014/01/27/140127-ark-cuneiform-translation/),
   Christian Post ("years ago"), NBC. So "most … say only 'a few years ago'" counts one wire story as many reports;
   what the sources show is that the 2014 reports checked give no year.
   The source log entry also calls CSM and Times of Israel "both" as if separate; both carry the same AP text.

**Suggested wording (theme md + chapter, same spot):** "…and the *Jewish Chronicle* says the owner left it with him
only in 2009; one later summary gives 2009 alone, while the 2014 news reports checked give no year (the widely
reprinted Associated Press story says only "a few years ago")."
Source log: note CSM and Times of Israel carry the same AP story; optionally add PBS / Archaeology / Deseret as
"no year" checks. Same wording should then carry to V90 in (i5m).

## §4 checklist (delta)
1. Accuracy: F1 closed; **F2 open** (above). 2. Lens balance: n/a. 3. Evidence tiers: unchanged, no proof language.
4. Contested flagged, not resolved: yes. 5. Tone: descriptive. 6. Sensitivity: none; no tag cleared. 7. Games/3D: none.

## Class
Still (c) honesty wording on live text. After the F2 fix: delta review by a session other than the F2 fixer
(and not ..TnN5yo / ..TzTk9u unless they wrote none of that fix — independence is per diff), GitHub green incl.
Lighthouse, merge by class (c).

## Note on times
Run 0724/0733 files say "~07:45 UTC"; git shows the F1 fix pushed 07:35 UTC and its checks started 07:35 UTC.
