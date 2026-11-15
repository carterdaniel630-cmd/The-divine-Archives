# 2026-11-15 ~13:30 UTC — PR #146 merged (Wikipedia strip part 1); #147 and #149 re-synced

Session ..01HFWzToHU52frgsDom5N2UW, acting on Carter's live "a. and yes" (`handoff/decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`).

## Merged: PR #146, per item
- **Candidate:** `loop/wikipedia-strip-01-02` @ `7b9ba66e`.
- **`main`:** fast-forwarded `f92ab8d7` → `7b9ba66e`.
- **Carter's yes:** recorded in the decisions file above. His 11-11 ruling is the yes for each strip part.

**LOOP.md "Merging" conditions:**
- (0) Listed in MERGEABLE, with Carter's per-item yes.
- (1) Independent review FIXABLE (F1). F1 was fixed in `7b9ba66e`, and the delta review passed with 0 findings (filed on review-log `473b18cc`).
- (2) GitHub checks all green on `7b9ba66e`: checks, guard, lighthouse, links, originality, runtime, test, verify.
- (3) Local checks re-run on `7b9ba66e` just before the push:
  - review-checks --build 9/0/1 (the expected "sources only" warning);
  - verify 18/18 and tests 51/51;
  - 0 Wikipedia on the 12 era 01–02 pages;
  - headless at 360 and 390: 9 pages × 2 widths, 0 script errors, no overflow.
- (4) No new content and no pending tag cleared. The 6 cleared chapters stay cleared, because only their sources changed.
- (5) No commits after the candidate.

**Deploy:** "Deploy to Cloudflare Pages" on `7b9ba66e` finished green (run 43717737055).

## Found: the graph workflow fails on every push to `main`, unrelated to this merge
- "Knowledge graph (graphify)" has failed on each `main` push since at least `b2b45e52` (2026-11-14 20:24), and again on `7b9ba66e`.
- The graph job builds `graph.json` and `GRAPH_REPORT.md`, labels 293 communities, then exits 1 at the end of the step.
- The published `graph` branch is therefore stale; the session hook reports graph main @ `a5256e3`.
- The site deploy is not affected. Queued as a Next item: find the failing command in `.github/workflows/graphify.yml`.

## Re-synced: #147 sources-wrap-fix → `d35f9115`
- I merged the new `main` into `loop/sources-wrap-fix`, with no rebase and no force-push. Conflicts were only in the ch03, ch04 and ch05 Sources blocks: `main` now carries the strip, the branch carries the full entries.
- **Resolution:** I regenerated those three Sources blocks from `main`'s already-stripped markdown with the branch's converter (`tools/md-to-chapter.js`). The original repair kept the `source-note` paragraphs off the page, and so does this one.
- **Result against `main`:** only `<li>` lines inside Sources blocks differ (92 lines), and no other kind of line changes. The era 01–02 chapter bodies and pages have 0 Wikipedia.
  - The 41 added lines that still contain Wikipedia are in later eras (ch06+). They are the links the repair brings back into view, which the strip removes era by era.
- **Checks:** full build order re-run (output current); review-checks --build 9/0/1; verify 18/18; tests 51/51; headless 360/390 on ch01, 03–10 and 13–18: 0 script errors, no overflow.
- **Needs a delta review** of `02a870b8..d35f9115` by a session that is NOT this one. Check that the ch03/04/05 `<li>` lines equal `main`'s markdown bullets and that nothing else changed. #147 still merges only on Carter's yes; his a/b on the merge class is open.

## Re-synced: #149 Wikipedia strip part 2 → `c4c6c77a`
- `loop/wikipedia-strip-03` was stacked on the old `loop/sources-wrap-fix`, so I merged the re-synced `d35f9115` into it.
- Only generated files conflicted (`content/dates.json`, `docs/sitemap.xml`). I resolved them by re-running the full build order.
- The era 03 strip diff over its base is unchanged (13 files, +46/−65 before and after).
- Checks: review-checks --build 9/0/1, verify 18/18, tests 51/51.
- It still needs its first **independent review**, by a session that wrote none of it. This session only re-synced it, so it may review it, but a different session is better.
- #149 contains #147, so #147 must merge first, or #149 waits.

## Cave 4 (#148)
- No conflict with the new `main`. Lighthouse was still running at ~13:15 UTC.
- It waits on Carter's per-item yes.
