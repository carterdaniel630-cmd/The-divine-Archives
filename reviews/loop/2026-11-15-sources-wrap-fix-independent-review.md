# Independent review — cut-short source lists repair (`loop/sources-wrap-fix` @ `b0c08fe5`)

**Reviewer session:** ..01HFWzTmtMV8g9JUhd7ANvey (scheduled build loop, 2026-11-15 ~09:48 UTC). Wrote none of the branch
(builder: ..01HFWzTp48AUQGechKB5XUmZ).
**Scope:** `origin/main` (`f92ab8d7`) `...b0c08fe5`, against `reviews/REVIEWER.md` §3–§4.
**Verdict: FIXABLE — 2 open findings (F1, F2), both "not finished", not "wrong".** Everything the branch changes is
correct; it misses two live chapters with the same defect.

## In plain words
The repair is accurate: every one of the 82 restored source entries now matches the chapter file word for word, link
for link, and nothing else on the pages moved. But the first chapter on the site, **ch01 The Flood**, still shows 12 of
its 16 sources cut off after the first line, and **ch08** shows a stray "&amp;amp;" in one source. Both should go on
the same branch before it merges.

## Automatic checks (§3), on `b0c08fe5`
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (warn: sources-only change ×13, chapters stay
  cleared). Working tree clean after `--build`: committed build output is current.
- `tools/verify-*.js`: **18/18**. `node --test framework/test/*.test.js`: **51/51**.
- GitHub on push (no PR yet): Verify game sourcing, Link guard, Game runtime checks — all **success**. No Lighthouse
  or PR checks yet (they run on a PR).
- Headless Chromium, 13 changed pages at 360 and 390: standards mode, 0 script errors, no sideways overflow, 0 entries
  ending on a dangling "—", ";", ",", "in", "and", 0 raw markdown / double-escaped entities in the Sources lists.

## Checklist (§4)
Own script (`rv.py`, not the builder's repair or checker): each `+<li>` in `content/chapters.js`, tags stripped and
entities decoded, against the chapter's markdown Sources bullet with its indented continuation lines joined.

| Item | Result | Note |
|---|---|---|
| Diff shape | **pass** | 82 `-<li>` / 82 `+<li>`, 0 other lines in `content/chapters.js`; docs/chapters/ch*.html are the 13 rebuilt pages. |
| 1. Accuracy vs sources | **pass** (for the 82) | All 82 new entries equal their markdown bullet in text, and their hrefs equal the bullet's URLs in order. Every old cut-short line (raw `*`/`[` ignored) is the start of a new entry: no text lost. Per chapter: ch03 10, ch04 4, ch05 8, ch06 6, ch07 10, ch09 6, ch10 6, ch13 6, ch14 5, ch15 6, ch16 6, ch17 4, ch18 5. |
| 1. Links opened | **not done** | Web fetch was refused in this unattended run (permission prompt timed out); no curl workaround used. Link guard green. These are citations restored verbatim from the cleared chapter files, not new ones. A session with a browser may spot-check (sample listed below). |
| 2–4. Lenses, tiers, contested | **pass** | No body text changed. |
| 5. Tone | **pass** | No prose changed. |
| 6. Religious sensitivity | **pass** | No images, models or sacred-object content touched. ch07/ch10/ch16 change only their source lists. |
| 7. Games/3D | n/a | |
| `esc()` in `tools/md-to-chapter.js` | **pass** | Probed: `<script>`, `<img onerror>`, `<b onclick>`, `<em class>` all escaped; `&mdash;`, `&amp;`, `&#x27;` kept; bare `&` and `?a=1&b=2` → `&amp;`. Old vs new converter over all 84 chapter files: output differs only for ch03, ch04, ch05, ch08 (entities/inline tags no longer double-escaped). The tool is manual-only (no build step calls it), so no live page changes from this alone. Note N3 below. |

## Findings
- **F1 (fixable) — ch01 The Flood is still cut short.** `docs/chapters/ch01.html` Sources: 12 of 16 entries end at the
  first markdown line, e.g. "Andrew George, trans., \*The Epic of", "Overview:", "Eridu Genesis / Ziusudra (Sumerian) —",
  "and \*The Chaldean". The links for Atrahasis, Eridu Genesis, Shatapatha, Qur'an, Popol Vuh, Finkel, Berossus,
  George Smith are lost. ch01 uses italic sub-heads (`<h4>` groups), which is likely why the repair passed it over; the
  builder's "every chapter, 133 → 0" check did not catch it. **Fix:** on `loop/sources-wrap-fix`, replace ch01's
  cut-short `<li>` lines the same way (only `<li>` lines, keep the `<h4>` groups and the stray empty `<ul></ul>` as is
  unless the converter's output for that block is used whole), rebuild ch01. ch01 is currently pending (Ark correction);
  sources-only, so no tag change either way.
- **F2 (fixable) — ch08 shows "&amp;amp;".** `docs/chapters/ch08.html`, Eleusinian line: "F. Graf `&amp;amp;` S. I.
  Johnston" renders as "Graf &amp; S. I. Johnston". The new `esc()` produces the right `&amp;`. **Fix:** that one `<li>`
  from the converter, rebuild ch08 (sources-only).

After F1/F2: re-run review-checks, verify, tests, the headless check for ch01/ch08, and the all-chapter comparison
(`rv2.py` logic: every markdown Sources bullet must equal an `<li>`); the only expected remaining mismatch is ch61 (N1).
Then a delta review by a session that wrote none of the fix.

## Notes (not findings against this branch)
- **N1 — ch61 page is behind its markdown.** The markdown gained a Sources bullet on 2026-10-11 (`4d46b5e9`, "restore
  Manne's 20,000–25,000 estimate with a checkable source", Attwood, *Aboriginal History* 25) and its body cites the
  estimate; the live page has neither the bullet nor the figure. Separate item: page/markdown drift on ch61 (and a check
  for others). Body text change, so it is a content change on a sensitive chapter: per item.
- **N2 — Wikipedia/Grokipedia come back into view** (33 + 2 links), as the builder said. Not a defect of a restore; the
  era-by-era strip handles it. Grokipedia (ch07, ch09) should be replaced in the re-sourcing pass.
- **N3 — `esc()` edge:** `<em class="x">y</em>` gives an escaped opener and a raw `</em>`. Harmless (a stray close tag is
  ignored) and no chapter has it.

Links for a spot-check (not opened this run): louvre.fr/en/the-code-of-hammurabi; britannica.com/topic/Pazuzu;
iranicaonline.org/articles/eschatology-i/; encyclopedia.com …/cybele; sacred-texts.com/hin/sbe42/index.htm;
biblearchaeology.org …/king-saul-and-the-witch-of-endor…

## Merge
Not mergeable yet. Missing: F1 + F2 on the branch, delta review, a PR + GitHub green incl. Lighthouse, Carter's yes
(per item, or class (c) if he answers (a)).
