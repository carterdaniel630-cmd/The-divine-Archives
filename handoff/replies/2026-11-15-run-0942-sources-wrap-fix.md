# Run 2026-11-15 ~09:42 UTC — cut-short source lists repaired (built, not live)

**Session:** ..01HFWzTp48AUQGechKB5XUmZ (scheduled build loop). Lock taken 09:42 UTC, released at the end.
**Item:** STATUS 0cx (1), "Truncated source lists repair". Highest value in Next that needs no Carter approval to build
(live citation honesty, a bug fix).
**Branch:** `loop/sources-wrap-fix` **`b0c08fe5`**, one commit on `main` `f92ab8d7`. No PR (runs don't open PRs unasked).

## In plain words
On 13 live chapter pages, any source whose line in the chapter file wrapped onto a second line showed only its first
line on the site. Usually the lost part was the links. This branch puts the missing text back: **82 source entries are
complete again, with 94 links restored.** Nothing else on the pages changes.

## What changed
1. `content/chapters.js`: in the Sources block of ch03, ch04, ch05, ch06, ch07, ch09, ch10, ch13, ch14, ch15, ch16,
   ch17 and ch18, each cut-short `<li>` was replaced by the full entry the converter makes from the chapter's markdown.
   A line is replaced only when the live text is the start of the converter's entry (or, for an entry that began with a
   link, the link's text). 82 `<li>` lines replaced, 0 other lines touched (checked: every `+`/`-` line in the diff is an
   `<li>`). Rebuilt `docs/chapters/ch*.html` for the 13 pages.
2. `tools/md-to-chapter.js`: `esc()` now leaves alone entities (`&mdash;`, `&ldquo;`, `&#8212;`, `&amp;` …) and plain
   inline tags with no attributes (`<em>`, `<strong>`, `<i>`, `<b>`, `<sup>`, `<sub>`) that a chapter's markdown already
   writes as HTML. Before, they were escaped a second time (`&amp;mdash;`, `&lt;em&gt;`), which is why these chapters were
   never re-converted. Everything else is still escaped (`<script>` → `&lt;script&gt;`, bare `&` → `&amp;`).

**ch20** was listed as affected but its live block already matches the markdown: no change. The earlier count of 121 came
from a looser text match; this run's independent check (below) finds 133 continuation lines missing before, 0 after.

**Deliberately not added:** the converter also makes a `source-note` paragraph from each chapter's "*Note on sourcing:*"
line. For these 13 chapters those notes are internal drafting text ("Reviewer note: … I'll revise in place"), so they stay
off the public page, as they are today.

## Checks (all on `b0c08fe5`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): only the 13 chapter
  pages change; committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn**; the warning is the expected "sources only,
  so it stays cleared" for each of the 13 chapters.
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Independent continuation check (a separate script, not the repair script): every indented continuation line under a
  Sources bullet in every chapter's markdown, as plain text, against the built Sources block. Before: 138 not found
  (133 real, 5 checker artefacts from links that wrap mid-text). After: 5, all the same artefacts, each confirmed present
  by hand (`Zoroastrian Influence"</a>`, `Lemuria (festival)</a>`, `Phoebe (biblical figure)</a>`,
  `Founding of Hermeticism</a>`, ch20 `Bodhisattva to Goddess</a>`).
- Headless Chromium at 360 and 390, all 13 pages: standards mode, 0 script errors, no sideways overflow, 0 Sources
  entries ending on a dangling "—", ";", "," "in" or "and", 0 raw markdown or double-escaped entities in the list.
- graphify CLI not installed in this session; the only code change is one function in `tools/md-to-chapter.js`.

## Things the reviewer and Carter should know
- **Wikipedia comes back into view.** 33 of the 94 restored links are Wikipedia links that were already in the files but
  hidden by the cut. Carter's 11-11 ruling strips Wikipedia from every list; that work goes by era
  (`loop/wikipedia-strip-01-02` covers ch03–ch05 here). This fix restores the markdown exactly and does not strip, so the
  two stay separable. **Overlap:** both branches change ch03, ch04, ch05. Whichever merges second needs a re-sync, and the
  strip parts for eras 03–05 should start from this branch's blocks, not the cut-short ones.
- **Two Grokipedia links** come back (ch07 Baal Cycle, ch09 Chinese shamanism). Grokipedia is an AI-written encyclopedia,
  which is a weak source by the project's sourcing bar. Not removed here (outside a pure restore); flagged for the
  re-sourcing pass.
- No link in the restored text was opened by this run. They were cited when the chapters were drafted; the reviewer
  should spot-check a sample.

## Merge
Not merged. Candidate: `b0c08fe5`.
- Class: reads as **(c) honesty fix** (restores citations already approved in substance; no tag cleared; chapters stay
  cleared as "sources only"). But it touches 13 pages including sensitive-topic chapters (ch07, ch10, ch16) and brings
  Wikipedia links back into view against a Carter ruling, so **per item unless Carter answers (a) to the Needs Carter
  question** "merge it by class once reviewed and green".
- Still missing: an **independent review** by a session other than ..01HFWzTp48AUQGechKB5XUmZ (check each replaced `<li>`
  against the markdown bullet, nothing outside the 82 lines changed, the esc() change against the other 71 chapters'
  markdown, a sample of the restored links); a **PR** so GitHub checks incl. Lighthouse run; Carter's yes.
