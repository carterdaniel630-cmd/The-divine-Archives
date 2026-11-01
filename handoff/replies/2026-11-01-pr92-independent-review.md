# 2026-11-01 ~02:10 UTC — build loop: independent review of PR #92 (ch19 audit Fixes 2+3)

**Reviewer:** a fresh loop run that wrote none of #92 (its site changes are commits `9f85206`, `fc0ad1a`, made by the
previous run). Reviewed `origin/main...loop/ch19-honesty-seder-karaite` at head **`fc0ad1a`** against
`reviews/REVIEWER.md` §3–§4.

**Verdict: 1 open finding (sourcing). Not mergeable yet.** Everything else passes.

## §3 automatic checks (clean copy of `fc0ad1a`)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-entity-registry):
  **0 changed files** — committed output is current.
- `tools/verify-*.js`: **17/17** pass. `node --test framework/test/*.test.js`: **42/42**.
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings** (ch19 Wikipedia share 18%).
- GitHub on `fc0ad1a`: **9 of 10 green** (originality, checks, test, guard, runtime ×2, verify ×2, links);
  **Lighthouse still running** at review time. Not waited for (lock not held while waiting).

## §4 checklist
1. **Accuracy against cited sources** — every new claim checked; sources fetched this run:
   - Mishnah Pesaḥim 10 (Sefaria API text): four cups, matzah, bitter herbs, the son's questions, "begins with … disgrace
     and concludes with … glory", Hallel — **all present**. Pass.
   - Jewish Virtual Library, "Amram Gaon": "oldest order of Jewish prayers extant"; "seemingly sent to the community of
     Barcelona"; "contains later interpolations"; mid-9th-century gaon. Pass.
   - Pew Research 2014: 70% took part in a Seder the previous year (2013 survey), more common than any other practice asked
     about; U.S. only, as the text says. Pass.
   - Cambridge Genizah Research Unit: *Refutation of Anan* written when Saadia was 23 (early 10th century); Anan
     "unhistorically adopted as the founder"; calendar by crescent sighting and barley (*aviv*). Pass.
   - TheTorah.com (Karaites): calendar by observation and barley; no blanket meat-and-milk separation; Karaism "seems to have
     emerged in the mid-ninth century"; Anan "later retroactively given a prominent role"; most Karaites today live in Israel.
     Pass.
   - Schechter Institute: Stein 1957; Bokser and Yuval adapt the thesis differently; Golinkin: form absorbed, content
     "drastically changed". Supports "adapted … in different ways, and others stress how unlike". Pass.
   - JPost review of Lasker (2022): rabbinic exilarch story; early Karaites attacked Anan, later adopted him; Sadducee theory
     as one of three. Pass.
   - OU Torah, "Black Sabbath": Karaites extinguished all fires before Sabbath; rabbinic-side source, labelled as such. Pass.
   - **FINDING 1 (fixable by a builder run; reviewer may not fix it, §5):** "Not supported" item, ch19 line ~275: *"the name
     'Karaite' is not attested before the ninth century"*. Neither source cited for the Karaite material (JPost review of
     Lasker; TheTorah.com) says this — both were checked for it and are silent. The claim itself is true and checkable
     elsewhere: the Jewish Encyclopedia (1906), "Karaites and Karaism"
     (https://jewishencyclopedia.com/articles/9211-karaites-and-karaism) says Anan's followers "were at first called
     Ananites" and that "Karaites" is "a term first used by Benjamin al-Nahawendi" (whom it places c. 830–850). The same
     sentence is already in the chapter **body** (line ~174, merged earlier), so the gap pre-dates #92; #92 repeats it in
     the honesty section. Fix options: (a) cite the Jewish Encyclopedia (or Lasker's book itself, if a run can check the
     page) for that clause in both places and log it in `sources/ch19-rabbinic-judaism.md`; or (b) drop the clause from the
     honesty item, leaving the body gap for a later pass. Option (a) fixes both and is the smaller honest change.
2. **Lens balance:** unchanged chapter body; the new honesty items describe the rabbinic and Karaite positions evenly
   (Anan story attributed to hostile rabbinic sources; OU source labelled rabbinic-side). Pass.
3. **Evidence-honesty tiers:** new items sit in the right tiers (Seder core/Karaite practice supported; Anan story as history
   not supported; symposium and Sadducee questions open). No "proof/proves/confirmed/settled" language. Pass.
4. **Contested claims flagged, not resolved:** symposium borrowing and Sadducee origin both left open with both sides. Pass.
5. **Tone:** descriptive. Pass.
6. **Religious sensitivity:** no images, no sacred objects, no restricted sites; living traditions (Karaites) described as
   surviving today. Nothing touches §4.6. Pass.
7. **Games/3D:** none changed. N/A.

## Headless phone check (390 × 844, own script)
`chapters/ch19.html`: pending banner present; all five new honesty items render; "cross- references" gone; the three new
source links (Pew, Cambridge, OU) present; no horizontal scroll; no script errors (one blocked external font request — the
sandbox has no route out).

## What #92 still needs before merge
1. Finding 1 fixed on `loop/ch19-honesty-seder-karaite` by a builder run, then a short independent review of that delta.
2. Lighthouse green on the final head.
3. Carter's per-item yes.

Filed on `review-log` as `reviews/2026-11-01-loop-pr92-ch19.md` + `reviews/loop/2026-11-01-pr92-independent-review.md`.
