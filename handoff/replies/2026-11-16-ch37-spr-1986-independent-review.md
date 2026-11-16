# Independent review — ch37 SPR 1986 sentence (`loop/ch37-spr-1986` @ `4baaa131`)

Reviewed 2026-11-16 ~21:00 UTC by the scheduled build loop. This session wrote none of the branch (built by
..01HFWzTncDADrHfo8rBNEbpB from `d56cac1e`). Against `reviews/REVIEWER.md` §3–§4 and Carter's ruling
`handoff/decisions-2026-11-16-carter-a-a-a-172-171-ch37.md` 3.

## Diff (`d56cac1e..4baaa131`, 6 files)
- `eras/09-modern/ch37-theosophy-occult-revival-modern.md` ¶ 2 and its built copies (`content/chapters.js`,
  `docs/chapters/ch37.html`, `docs/assets/search-index.json`): the parenthesis only.
- `content/dates.json`: ch37 hash only (generated).
- `sources/ch37-theosophy-occult-revival.md`: a dated "Wording fix" note.

## Checks
1. **Wording = Carter's approved text.** New parenthesis: "(In 1986 a senior SPR member, Vernon Harrison, published in
   the Society's journal a sharp critique of Hodgson's handwriting evidence and method — but no positive proof of the
   Masters ever emerged.)" — word for word the ruling's text, with the "no positive proof of the Masters" clause kept.
   Nothing else in the sentence or paragraph changed (checked in all four built copies).
2. **Source re-opened this run:** L. Price, "The Hodgson Report on Theosophy", *Psi Encyclopedia* (SPR),
   https://psi-encyclopedia.spr.ac.uk/articles/hodgson-report-theosophy/ — "In 1986, Dr Vernon Harrison, a senior SPR
   member and expert in photography and handwriting, published a powerful critique of the handwriting evidence in the
   Hodgson report"; "He seriously criticised the procedure used by Hodgson"; works cited: Harrison, "J'Accuse", *JSPR* 53
   (1986), 286–310. The article does **not** say the SPR as a body withdrew or distanced itself. The new sentence claims
   no more than the source: "senior SPR member" ✓, "Society's journal" ✓, "handwriting evidence" ✓, "method" ≈
   "procedure" ✓, "sharp" ≈ "powerful" ✓ (Carter's own word).
3. The source is already in ch37's Sources list (added by #172), so no new citation is needed.
4. The old phrase "formally distanced" is now only in the source log's historical flag (correct as a record).
5. No new page, no pending tag change, nothing outside ch37.

## Findings
**0 content findings. Wording: PASS.**

## Merge gate that fails (not a wording finding — needs Carter)
Re-synced locally onto `main` `0232f129` (clean merge; full build order → no diff; verify 18/18; tests 51/51), but
`review-checks --base origin/main --build` = **8 passed / 1 FAILED / 1 warning**:
`pending-diff FAIL chapter ch37 (markdown changed, body changed): not pending and not newly cleared in reviews/cleared.json`.
ch37 is a **cleared** chapter and this changes its body text. Precedent: every body change to a cleared item has
needed either Carter's **re-clear for that change only** (ch07/15/16/45 line-wrap, V36, V44 line-4) or the item going
**back to pending** (ch01, ch42). Carter's "a" approved the wording, not a re-clear; clearing is never done by a run.
So the re-sync was **not pushed** (never push red) and no PR was opened.

**Verdict: NEEDS CARTER** — a) re-clear ch37 for this one sentence only (recommended), or b) ch37 back to pending.
