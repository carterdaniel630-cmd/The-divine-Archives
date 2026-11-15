# PR #149 delta review — F1 fix (Wikipedia strip part 2, era 03)

**Verdict: PASS, 0 open findings.**
- **Candidate:** `loop/wikipedia-strip-03` @ `49357b31` (PR #149).
- **Delta reviewed:** `c4c6c77a..49357b31` (one commit, the F1 fix).
- **Reviewer:** session ..01HFWzTkzv79kvVpW89RF2Sa. It wrote none of the candidate: not the strip (builder ..01HFWzTkQDY1ZmPNWr39GST6), not the re-sync (..01HFWzToHU52frgsDom5N2UW), not the F1 fix (..01HFWzToRNp9TNsS7ch8jSAo).
- **Against:** `reviews/REVIEWER.md` §3–§4, F1 in `2026-11-15-pr149-wikipedia-strip-03-independent-review.md`, and `handoff/order-2026-11-11-wikipedia-strip.md`.

## What the delta changes (4 files, +8 / −7)
- `eras/03-early-iron-age/ch07-…md`, `## Sources` only:
  - *Origins and emergence*: `- The Merneptah Stele: [Biblical Archaeology Society: the first mention of Israel](…).` — exactly F1's wording, same URL.
  - Asherah bullet: the Kuntillet Ajrud link now ends `;` and is followed by `  Khirbet el-Qom.` — exactly F1's wording, URL unchanged.
- `content/chapters.js`: the same two `<li>`, nothing else in the block.
- `docs/chapters/ch07.html`: the same two `<li>`, nothing else.
- `content/dates.json`: ch07 hash only (modified date already 2026-11-15, so `docs/sitemap.xml` correctly unchanged).

No prose, claim, image, pending tag or other chapter changed. No link was added; the names are plain text, as with Tel Dan and Ketef Hinnom.

## Checks on `49357b31` (run by this reviewer in a clean worktree)
- `node tools/md-to-chapter.js ch07 <markdown>` prints the two `<li>` byte-for-byte as committed.
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework, build-entity-registry): all exit 0, tree clean after.
- `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 51 pass / 0 fail.
- `node tools/review-checks.js --base origin/main --build`: **9 pass / 0 fail / 1 warn** (the expected sources-only warning; `main` = `7b9ba66e`).
- Crawl: `grep -ci wikipedia` = 0 on all 7 era 03 markdown files and all 7 built pages (ch06, 07, 08, 09, 58, 68, 77).
- Headless Chromium, ch07 at 360 and 390: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia anchors, a Sources item starting "The Merneptah Stele:", one ending "Kuntillet Ajrud; Khirbet el-Qom.", 0 Sources items ending on a dangling mark. No pending banner — same as `main`.
- GitHub on PR #149 head (13:49 UTC): **9/10 completed green; Lighthouse in progress** (run 43720922345). Not waited for (lock not held while waiting).
- graphify CLI not used: the delta touches content and one built page only, no code.

## F1 status
**Closed.** Both object names are back as plain text; flag 3 (Khirbet el-Qom now unsourced) again points at a name the list shows.

## Note (not a finding, outside the delta)
- N1: the Baal Cycle bullet in the same ch07 block cites Grokipedia. Not touched by this PR and not part of the Wikipedia order; a later sourcing pass may want to judge it under the CLAUDE.md sourcing standard.

## Still missing before #149 can merge
1. Lighthouse completed green on `49357b31`.
2. #147 merged first (it is #149's base), which waits on Carter's yes (wrap-fix a/b).
3. Merge class: **per item**, on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`); the merging run re-runs local checks.

Nothing merged in this run.
