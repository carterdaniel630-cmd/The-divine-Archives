Batch: Wikipedia strip part 6, era 07 High Medieval (PR #154, loop/wikipedia-strip-07)
Reviewed: 2026-11-15
Auto-pass: n/a (merge is per item on Carter's strip yes, decisions-2026-11-15-carter-a-prs-yes-wikipedia.md 2)
Covers: loop/wikipedia-strip-07@ce8f3575 (one content commit on main 30f6de4b)
Reviewer session: ..01HFWzTkbWwaMQU3zC2StMsS (wrote none of #154; builder was ..01HFWzTsBp7DzsRa)
Summary: 12 passed, 0 fixed, 0 need you. Verdict: PASS, 0 open findings.

In plain words
The change does what your Nov 11 ruling asked, in eleven High Medieval chapters: Wikipedia is gone from
their source lists and nothing else moved. No chapter text changed.

Automatic checks (run on ce8f3575)
  - Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): no files changed, so the committed output is current.
  - review-checks --base origin/main --build: 9 pass / 0 fail / 1 warn (the expected "sources only" warning).
  - verify-*.js 18/18; node --test framework/test/*.test.js 51/51.
  - md-to-chapter output for all 12 era 07 chapters: every Sources <li> is present in content/chapters.js. (One ch56 body <li>, "The darfash and the living water", differs between markdown and chapters.js; it differs the same way on main 30f6de4b, so it is not from this diff. Note below.)
  - Headless Chromium, 11 changed pages (plus ch81) x 360 and 390 px: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia links, no empty lists. ch72 has two list items ending in ";" — the same two body items on main (a semicolon-run list), not Sources.
  - Crawl: grep -ci wikipedia = 0 on all 11 changed markdown files and built pages.
  - GitHub on ce8f3575 at ~17:45 UTC: 9/10 green; lighthouse in progress (started 17:31 UTC). A merge condition, not a review finding.

Diff checks (scripted)
  - Markdown: 38 lines removed, 16 added → 22 bullets removed whole. 36 Wikipedia URLs removed. Matches the builder's corrected count (36 links, 22 whole bullets).
  - Every removed line contains "wikipedia" (0 exceptions, incl. the two "reference overviews" lines whose only link was Wikipedia: Tenochtitlan, Taki Unquy). No added line contains it.
  - Every added line keeps the claim text before " — " unchanged from the line it replaces; the only new tokens are end-of-line punctuation joins (e.g. "Britannica." / "</li>").
  - Every hunk sits below the chapter's "## Sources" heading (checked per file). content/chapters.js: 38 removed / 16 added, only <li> lines.

PASSED (12)
  - ch26/1 Kabbalah: 8 Wikipedia links out, 5 bullets whole; Luria keeps Britannica + My Jewish Learning, Gematria keeps Encyclopedia.com. Scholem keep: see note.
  - ch27/1 Sufism: 5 links out, 5 whole; Incoherence keeps SEP.
  - ch28/1 Scholasticism: 5 links out, 4 whole.
  - ch29/1 Maya: 4 links out, 1 whole; Hero Twins keeps EBSCO, ceiba keeps Mayan.org, Cenote keeps The Met.
  - ch30/1 Bhakti: 3 links out, 3 whole.
  - ch43/1 Aztec: 2 links out, 1 whole; Florentine Codex keeps Britannica.
  - ch44/1 Inca: 5 links out, 3 whole; deities keep Britannica, ceque keeps Bauer, Llullaillaco keeps PNAS.
  - ch56/1: 1 link out; Mandaeism keeps Montagna (Medium).
  - ch59/1: 1 link out; Romuva keeps Euronews.
  - ch62/1: 1 link out; Cahokia keeps Britannica.
  - ch72/1: 1 link out; Rahn line keeps Rahn's own book and UNESCO; the Wikipedia "pointer for his SS membership" is out.
  - site:pr154: only Sources lists changed; ch81 untouched (no Wikipedia on main).

FIXED (0)

NEEDS CARTER (0)

Notes (not findings)
  - ch26 Scholem keep: "…modern consensus (Moses de León / a circle, c. 1270–1330); Scholem." Scholem was already named, unlinked, on main; the order removes only Wikipedia, so keeping the name follows the rule (same call as the ch23 VikingRune keep in #153). It is now an author name with no title. Re-sourcing should give it a full citation (Scholem, Major Trends in Jewish Mysticism, 1941, lecture 5).
  - ch72 flag 76: the body still says Rahn joined the SS; with the pointer gone it has no source in the list. That is the order's item 5 re-sourcing list (priority), not a fault of this diff.
  - Several kept entries are named but unlinked (Sabbatai Zevi → My Jewish Learning; Popol Vuh → EBSCO; Florentine Codex → Britannica). They were unlinked on main too; re-sourcing can add the URLs.
  - ch56 darfash body item: markdown and chapters.js differ on main already. Pre-existing; worth a look when ch56 is next edited.
  - Checklist items 2–6 (lens balance, evidence tiers, contested flags, tone, sensitivity): no body text changed. Item 7 (games/3D): not touched.

Accuracy spot-checks
  - No claim text changed and no source was added, so no new claim to check. Kept sources are unchanged from main.

Needs your decision
  - Nothing needed. Merge is covered by your strip yes once Lighthouse is green and the generated files are re-synced onto main 2d3450cb (after #153).
