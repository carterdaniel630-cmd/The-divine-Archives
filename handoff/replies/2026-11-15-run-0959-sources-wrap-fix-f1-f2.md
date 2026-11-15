# Run 2026-11-15 ~09:59 UTC — sources-wrap-fix F1 + F2 fixed (built, not live)

**Session:** ..01HFWzTmcBeAjQtBQVQXVKVR (scheduled build loop). Lock taken 09:59 UTC, released at the end.
**Item:** STATUS 0cz (1), "Sources-wrap-fix F1/F2" from `2026-11-15-sources-wrap-fix-independent-review.md`.
This session wrote none of `b0c08fe5` and did not do the review; it wrote the fix, so it must not do the delta review.
**Branch:** `loop/sources-wrap-fix` **`02a870b8`** (one `review fix:` commit on `b0c08fe5`). No PR (runs don't open PRs unasked).

## In plain words
The first chapter on the site, The Flood, still showed 12 of its 16 sources cut off after the first line. They are now
complete (links to Atrahasis, Eridu Genesis, the Qur'an, Popol Vuh, Finkel's Ark Tablet, Berossus, George Smith, Woolley
and the Black Sea debate are back). Chapter 8's stray "&amp;amp;" is fixed. Nothing else on either page changes.

## What changed (`02a870b8`)
- `content/chapters.js`: 13 `<li>` lines, nothing else (checked: every `+`/`-` line in the diff is an `<li>`).
  - **F1 ch01:** 12 entries replaced by the converter's output for `themes/ch01-the-flood.md`
    (`node tools/md-to-chapter.js ch01 …`), matched one-for-one in order inside the same `<h4>` groups; each old line
    was checked to be the start of its new entry. The 4 entries already whole (Genesis 6–9, BioLogos, TheTorah.com,
    Big Think) are unchanged. The `<h4>` groups and the empty `<ul></ul>` after "Sources" are kept as they were. The
    converter's `source-note` paragraph is NOT added (keeps the change to source entries only, as for the 13 chapters).
  - **F2 ch08:** Eleusinian entry `F. Graf &amp;amp; S. I. Johnston` → `F. Graf &amp; S. I. Johnston` (the converter's output).
- `docs/chapters/ch01.html`, `docs/chapters/ch08.html` rebuilt.
- ch01 stays pending (Ark correction), ch08 unchanged in status; sources-only, so no tag change.

## Checks (all on `02a870b8`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): only ch01/ch08 pages change; committed; tree clean after.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (sources only ×15: the 13 + ch01 + ch08).
- verify **18/18**; `node --test framework/test/*.test.js` **51/51**.
- All-chapter comparison (own script: every chapter's converter Sources `<li>`, tags stripped, must appear in the page's
  Sources block): **835 bullets, 1 mismatch, ch61 only** (the Manne/Attwood bullet, note N1 — expected).
- Headless Chromium, ch01 and ch08 at 360 and 390: standards mode, 0 page script errors, no sideways overflow, 16 / 10
  entries, 0 ending on a dangling "—", ";", ",", ":", "See" or a raw `*`, 0 raw `&amp;`/`*`, pending banner present.
  The only failed request is Google Fonts (blocked in this sandbox). Screenshot: `handoff/previews/sources-wrap-fix/ch01-sources-390.png`
  (the floating site header over the middle is the element-screenshot scroll, not the layout).
- Restored links not opened (no web fetch in this unattended run). They are the markdown's own citations, restored verbatim.
- graphify not run: no code changed (content and built pages only).

## Merge
Not merged. Candidate: `02a870b8`. Still missing:
1. **Delta review** `b0c08fe5..02a870b8` by a session that wrote none of the fix (NOT ..01HFWzTmcBeAjQtBQVQXVKVR).
   The original reviewer ..01HFWzTmtMV8g9JUhd7ANvey may do it.
2. A **PR** so GitHub checks incl. Lighthouse run (Carter's PR question (a)/(b) still open).
3. **Carter's yes:** per item, or class (c) if he answers (a) to the Needs Carter question.
