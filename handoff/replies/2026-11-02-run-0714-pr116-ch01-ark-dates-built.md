# 2026-11-02 ~07:14–07:35 UTC — (i5e) ch01 Ark Tablet 1985/2009 note built as PR #116

**Run:** session ..01HFWzTnn5yoLm3RF8BKRxrL (same session as run 0658; this firing's payload, chained from run 0649,
was stale: #115 was already merged at ~07:12 UTC by run 0658).
**Branch:** `loop/ch01-ark-dates` `f7c7d79`, parent `main` `cb8c52f`. Draft PR #116.

## What changed
- `themes/ch01-the-flood.md` → `content/chapters.js` (that one paragraph only) → `docs/chapters/ch01.html`: the Ark
  Tablet paragraph no longer opens "In 2009 a member of the public brought Irving Finkel…". It now says accounts
  differ: the *Jewish Chronicle* and Wikipedia say Finkel first saw it in 1985; the *Jewish Chronicle* says the owner
  left it with him only in 2009; many 2014 news reports give only 2009. Not resolved; points to Vault V90.
- `themes/ch01-the-flood.md` Sources: *Jewish Chronicle* link + quotes; Wikipedia line notes 1985/2009.
- `sources/ch01-the-flood.md`: new dated entry with the verbatim quotes re-read this run.
- Rebuild: `content/dates.json`, `framework/registry/index.json`, `framework/registry/source.json`.

## Sources opened this run (fetch tool, verbatim)
- Jewish Chronicle: "Finkel first came across the tablet in 1985, when a man called Douglas Simmonds walked into the
  British Museum"; "only managed to convince Simmonds to leave it with him in 2009."
- Wikipedia, Finkel's replica of Babylonian ark: "Dr. Finkel first encountered … in 1985"; "He was unable to gain
  access to translate the whole tablet until 2009."
- *Historia*: permission timed out, not opened. The chapter cites it for nothing (V90 carries that detail, read by
  the three #115 reviews).

## Checks (builder run, so NOT the independent review)
- Full build order: clean after commit. verify 18/18. tests 42/42. review-checks --base origin/main --build 9/9.
- Headless ch01 at 360×640 and 390×844 (touch): 200, 0 page errors, no sideways scroll; pending tag present.

## Class
(c) honesty wording on live text. ch01 stays pending; no tag cleared; nothing sensitive.

## New finding (not fixed here; logged as a Next item)
`content/chapters.js` (the source the chapter pages are built from) keeps only the FIRST line of each multi-line
Sources bullet, so the links on wrapped lines are missing on the live pages. Example, ch01: "Irving Finkel, *The Ark
Before Noah* … (2014);" shows with no links, while `themes/ch01-the-flood.md` has BAS, Wikipedia, PBS NOVA, Channel 4.
`node tools/md-to-chapter.js ch01 themes/ch01-the-flood.md` renders them correctly (it also adds the source-note), so
the stored blocks predate the current converter. A rough grep finds ~119 likely-cut items across 24 chapters
(ch01, 03–07, 09, 10, 13–18, 66, 69, 70, 72, 75–77, 81–83); needs a per-chapter check, as some may be real dashes.
CLAUDE.md requires each chapter page to show its sourcing, so this is high value. Merge class to be decided at review
(likely class (c) label/honesty-display fix; per item if it touches cleared chapters' text beyond the source list).

## Next
(i5k) independent review of #116 by a session other than ..01HFWzTnn5yoLm3RF8BKRxrL; GitHub green incl. Lighthouse;
merge by class (c). (i6) chapter Sources-list cut lines (above). Then (i3) fix batch item 7, (i4) presence pass.
