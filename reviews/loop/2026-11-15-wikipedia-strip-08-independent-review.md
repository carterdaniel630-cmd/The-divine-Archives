Batch: Wikipedia strip part 7, era 08 Early Modern (PR #155, loop/wikipedia-strip-08)
Reviewed: 2026-11-15
Auto-pass: n/a (merge is per item on Carter's strip yes, decisions-2026-11-15-carter-a-prs-yes-wikipedia.md 2)
Covers: loop/wikipedia-strip-08@b80d7568 (one content commit on main 30f6de4b)
Reviewer session: ..01HFWzTkbWwaMQU3zC2StMsS (wrote none of #155; builder was ..01HFWzTsBp7DzsRa)
Summary: 7 passed, 0 fixed, 0 need you. Verdict: PASS, 0 open findings.

In plain words
Six Early Modern chapters lose their Wikipedia sources and nothing else. No chapter text changed. Three of
them (witch trials, African traditional religion, Sikhism) are left with five sources each, and some
contested claims there now have no source in the list; those are already on the re-sourcing list.

Automatic checks (run on b80d7568)
  - Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): no files changed.
  - review-checks --base origin/main --build: 9 pass / 0 fail / 1 warn (expected "sources only").
  - verify-*.js 18/18; node --test framework/test/*.test.js 51/51.
  - md-to-chapter output for all 8 era 08 chapters: every <li> present in content/chapters.js.
  - Headless Chromium, 6 changed pages x 360 and 390 px: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia links, no empty lists. ch82 has six body list items ending in ";" (the Ibadat Khana participant list), identical on main; not Sources.
  - Crawl: grep -ci wikipedia = 0 on all 8 era 08 markdown files and built pages.
  - GitHub on b80d7568 at ~17:45 UTC: 9/10 green; lighthouse in progress (started 17:34 UTC). A merge condition, not a finding.

Diff checks (scripted)
  - Markdown: 23 lines removed, 7 added → 16 bullets removed whole; 27 Wikipedia URLs removed (26 en.wikipedia.org + 1 www.wikipedia.org, Goindwal). Matches the builder (27 links, 16 whole).
  - Every removed line contains "wikipedia"; no added line does. Each added line keeps its claim text unchanged; only the trailing citation changed. All hunks below "## Sources". content/chapters.js: 23 removed / 7 added, only <li> lines.

PASSED (7)
  - ch31/1 Reformation: 3 links out, 2 whole; forerunners keep World History Encyclopedia. 10 bullets left.
  - ch32/1 Witch trials: 6 links out, 5 whole (Malleus, Bamberg/Junius, North Berwick, benandanti, Murray / "nine million"). 5 bullets left.
  - ch33/1 African traditional religion: 11 links out, 6 whole; Yoruba keeps Mythopedia, Akan keeps BlackPast, Azande keeps Evans-Pritchard (1937). 5 left.
  - ch34/1 Sikhism: 4 links out, 2 whole; Khalsa keeps Britannica. 5 left.
  - ch63/1 Oceania: 2 links out, 1 whole; Rapa Nui keeps Smarthistory.
  - ch82/1 Akbar: 1 link out; Goindwal keeps Sikh Missionary Society, The Guru's Way.
  - site:pr155: only Sources lists changed; ch73 and ch84 untouched.

FIXED (0)

NEEDS CARTER (0)

Notes (not findings)
  - Contested claims now without a listed source (flags 79–95, builder's reply): ch32 Murray thesis / "nine million" (flag 86), ch33 Dogon–Sirius (flag 89), ch32 Malleus. The chapter text is unchanged and still frames them with care ("nine million" called a myth, Dogon–Sirius a modern legend van Beek's fieldwork undercut); it is the list that thinned. Re-sourcing is item 5 of the order, and a content change reviewed on its own.
  - ch82 Goindwal: the dropped Wikipedia line was marked "pointer: no stronger source confirmed". The tradition now rests on one devotional source, which the body already presents as tradition, not fact.
  - Checklist items 2–6: no body text changed. Item 7 (games/3D): not touched.

Accuracy spot-checks
  - No claim text changed and no source was added, so no new claim to check. Kept sources unchanged from main.

Needs your decision
  - Nothing needed. Merge is covered by your strip yes once Lighthouse is green and the generated files are re-synced (after #153 and #154).
