# Independent review — PR #152, Wikipedia strip part 4 (era 05)

**Reviewed:** 2026-11-15 ~16:55 UTC, session ..01HFWzTnRUzKUKAjrnCpGZCn (wrote none of `f7935176`; the builder was ..01HFWzTpAKV5PowLJFt5hPFh).
**Candidate:** `loop/wikipedia-strip-05` **`f7935176`**, diff `origin/main` `0c807f9c`..`f7935176` (one commit, fast-forwards; `main` unchanged at review time).
**Checklist:** `reviews/REVIEWER.md` §3–§4, against `handoff/order-2026-11-11-wikipedia-strip.md`.

## Verdict: PASS, 0 open findings

## §3 automatic checks (run on `f7935176` in a clean worktree)
- `node tools/review-checks.js --base origin/main --build`: **9 pass / 0 fail / 1 warn**. The warn is the expected one: the seven chapters are "sources only, so it stays cleared". Working tree clean after `--build`, so the committed build output is current.
- `tools/verify-*.js`: **18/18 pass**. `node --test framework/test/*.test.js`: **51/51 pass**.
- GitHub on PR #152: not read for this verdict (the merge gate checks it separately).

## Diff checks
- **26 Wikipedia anchors removed, 0 added**, matching the reply's corrected count. The commit message's "29" is wrong, as the reply already says.
- **No non-Wikipedia source was lost.** Every non-Wikipedia URL on a removed markdown line appears again on an added line (set difference empty).
- **0 wikipedia.org links** remain in any era 05 markdown file or on any built era 05 page (ch16–20, ch45, ch55, ch70, ch79).
- **Prose mentions (order item 2):** the "Note on sourcing" lines in ch16, ch17 and ch19 still say "Wikipedia's sourced overviews". The reply names all three and says only ch19's shows on its live page. That is prose, and the order says leave it, so it is correctly left. Whether to reword it is a later wording question, not a finding.
- **Whole-bullet removals (6) and empty-subsection removals (2):** each one checked against the diff. Each removed bullet named no source once its Wikipedia links were gone. The ch19 Merkabah phrase "standard reference overviews" names no work, so it counts as no source, the same rule parts 1–3 passed with. Both removed subsections (ch17 Abraxas, ch18 dying-and-rising god) would otherwise be empty. No Sources section is left empty.
- **Kept names:** ch18 "Apuleius, *The Golden Ass* Book XI", ch20 "the Avatamsaka Sutra" and ch20 "(Schopen)" are a primary text and a scholar, kept as plain text. That matches the part 2 F1 ruling and the part 3 Brunaux precedent.
- **The ch18 Julian join** now reads "Julian's revival and the anti-pagan laws — on the end of Eleusis (c. 396 CE), World History Encyclopedia: Eleusis." The word "on" limits the remaining source to Eleusis, so the line does not claim that source covers Julian. The Julian/Theodosius claim is flagged (flag 22). Acceptable as is. Dropping the lead is optional for the re-sourcing pass, not a finding.
- **Sole-source flags 13–30:** checked against the diff. Each removed entry that carried a claim is on the list, and nothing is missing. Flag 30 (ch70 moon-god) is correctly marked sensitive. Only its source went; the chapter text is unchanged, and the name's derivation stays sourced to Al-Jallad and Sidky in the same list.
- **Pending state unchanged** (ch19 and ch20 still show the pending tag; the others stay cleared). That is correct for a sources-only change.

## Headless check (this run)
Chromium at 360 and 390 px, the 7 touched pages: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia anchors. No Sources item ends on "—", ";", ",", " in" or " and". On ch70, six list items end in ";", but they are in the chapter body (the pre-Islamic practices list), are untouched by this PR, and the semicolons are correct punctuation.

## §4 checklist
1. **Accuracy:** a removal-only diff, so no new claims. Sample fetches of two "thinner but still sourced" entries (Britannica Perpetua, My Jewish Learning Bava Metzia 59) were **refused** in this unattended run, and no other route was used. Those two classifications are **not verified by this review**. They are not site changes; the re-sourcing pass can confirm them.
2–5. Lens balance, evidence tiers, contested flags and tone: no body text changed, so all pass as on `main`.
6. **Religious sensitivity:** no images, objects or sites are touched. ch70's sensitive moon-god topic loses only its Wikipedia citation and is flagged. Nothing is NEEDS CARTER.
7. Games and 3D: not touched.

## Merge status
Not merged. **Still missing:** GitHub green incl. Lighthouse on `f7935176`; #151 to merge first; then a re-sync of #152's `content/dates.json` / `docs/sitemap.xml` onto the new `main`. A re-sync is a mechanical merge, so the run that does it needs a delta review by a session that did not write it, or a stack as LOOP.md "Merging" describes. Merges **per item** on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`).
