Batch: Wikipedia strip part 5, era 06 Early Medieval (PR #153, loop/wikipedia-strip-06)
Reviewed: 2026-11-15
Auto-pass: n/a (merge is per item on Carter's strip yes, decisions-2026-11-15-carter-a-prs-yes-wikipedia.md)
Covers: loop/wikipedia-strip-06@2d3450cb (content commit 4ffa9446, re-synced onto main 30f6de4b)
Reviewer session: ..01HFWzTpYUEnxe1rHUcvk6U3 (wrote none of #153; builder was ..01HFWzTpAKV5PowLJFt5hPFh)
Summary: 9 passed, 0 fixed, 0 need you. Verdict: PASS, 0 open findings.

In plain words
The change does exactly what your Nov 11 ruling asked for in eight Early Medieval chapters: it takes
Wikipedia out of their source lists and touches nothing else. No chapter text changed.

Automatic checks (run on 2d3450cb)
  - Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): no files changed, so the committed output is current.
  - review-checks --base origin/main --build: 9 pass / 0 fail / 1 warn (expected: "sources only, so it stays cleared").
  - verify-*.js 18/18; node --test framework/test/*.test.js 51/51.
  - md-to-chapter regenerated for all 10 era 06 chapters: content/chapters.js unchanged, so it matches the markdown.
  - Headless Chromium, 8 changed pages x 360 and 390 px: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia links, no empty lists, no list item ending on a dangling "—", ";", ",", "in" or "and".
  - Crawl: grep -ci wikipedia = 0 on all 10 era 06 built pages and all 10 era 06 markdown files.
  - Re-sync: changed lines vs main (excluding generated dates.json, sitemap.xml and docs/) are byte-identical to the original 0c807f9c..4ffa9446 diff.
  - GitHub on 2d3450cb at 17:25 UTC: 9/10 green; lighthouse in progress (started 17:19 UTC). Not a review finding; it is a merge condition.

PASSED (9)
  - ch21/1: 11 Wikipedia entries removed (Uthmanic codex, Sanaa manuscript, Isra' and Mi'raj, Mu'tazilism, Ash'arism, Major Occultation, Battle of the Camel, Zaynab bint Jahsh, Kharijites, Battle of Nahrawan, Islamic ornament); 3 bullets removed whole; 4 bullets keep Britannica / The Met with clean joins.
  - ch22/1: 7 removed, 7 bullets removed whole (each had only Wikipedia).
  - ch23/1: 6 removed, 4 bullets whole; Uppsala keeps World History Encyclopedia. VikingRune keep: see note.
  - ch24/1: 8 removed, 7 bullets whole; 3 sources left (thinnest list in the era; flags 49-55).
  - ch25/1: 4 removed, 4 bullets whole.
  - ch53/1: 3 removed, 1 bullet whole; four schools keeps Lion's Roar, Bardo keeps Britannica.
  - ch54/1: 2 removed, 1 bullet whole; Jodo Shinshu keeps Encyclopedia.com.
  - ch60/1: 2 removed, 0 bullets whole; theosis and hesychasm keep Britannica.
  - site:pr153: only Sources lists changed. Every removed line in content/chapters.js (49 changed lines) contained "Wikipedia"; no added line does. Totals match the builder's report: 43 entries, 27 whole bullets, 8 pages touched, ch71 and ch80 untouched.

FIXED (0)

NEEDS CARTER (0)

Notes (not findings)
  - ch23 VikingRune keep: "Elder and Younger Futhark; runic magical function — Futhark overviews (VikingRune)." It was already named, unlinked, on main; the order removes only Wikipedia, so keeping it follows the rule. It is weak and is already sole-source flag 46 for re-sourcing. Agree with the keep.
  - Checklist items 2-6 (lens balance, evidence tiers, contested flags, tone, sensitivity): no body text changed, so nothing moved. The removals do leave contested or sensitive claims unsourced (flags 31, 52, 58, 59); those are the order's item 5 re-sourcing list, not a fault of this diff. Re-sourcing them will be a content change and goes through review on its own.
  - Item 7 (games/3D): not touched.

Accuracy spot-checks
  - No claim text changed, and no source was added, so there is no new claim to check against a source. Kept sources are unchanged from main.

Needs your decision
  - Nothing needed. (Merge is already covered by your strip yes once Lighthouse is green.)
