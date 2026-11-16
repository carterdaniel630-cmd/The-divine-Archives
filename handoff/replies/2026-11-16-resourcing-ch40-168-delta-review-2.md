# Delta review 2 — PR #168, ch40 re-sourcing (F5 fix) + re-sync onto main

**Reviewer:** build loop run ..01HFWzTmeoepqEnnikaro5fK (scheduled), 2026-11-16 ~14:55 UTC. Wrote none of the candidate
(not the builder, not the F1–F4 fixer ..01HFWzTm8prJe778rk7ohuDo, not the F5 fixer ..01HFWzTnPKGJknJ9jiRpR4Q7).
**Reviewed delta:** `54bdcf70..9883cb02` (F5 only), then the re-sync merge `9883cb02` + `main` `39a947b8` → **`9d35e620`**
(written by this run; merge commit only, generated files rebuilt).
**Verdict: PASS — 0 findings.**

## F5 against the source
| Source | What it says (re-opened this run) | Page now | Result |
|---|---|---|---|
| Roland Littlewood, "The plight of the living dead," *THE*, 28 Nov 1997 (canonical URL) | "DNA fingerprinting suggested Wilfred was not the son of his putative parents; Marie was related neither to Michel, nor to her brother in Cabaret"; "the mistaken identification of a wandering mentally ill stranger by bereaved relatives"; "I cannot exclude the possibility…" | "DNA tests suggesting the man was not the son of the parents who claimed him, and the woman was not related to the man and brother who claimed her" | ✔ "suggesting" matches; it governs both clauses, as the article's semicolon does. Quotations verbatim. |

The change is the same one word in all three page copies (markdown, `content/chapters.js`, `docs/chapters/ch40.html`), plus a
dated correction line in `sources/ch40-diaspora-religions.md`; `content/dates.json` carries the new ch40 hash. Nothing else moved.

## Re-sync check (`9d35e620`)
- Conflicts only in generated `content/dates.json` and `docs/sitemap.xml` (ch39 from `main`, ch40 from the branch); then the full build
  order was run (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry) and left **no further changes**.
- `origin/main...9d35e620` content diff for ch40 markdown, `chapters.js`, `ch40.html` and the source log is line-for-line the reviewed
  `56d7c9d6..9883cb02` diff.
- Pending-review tag state of ch40 is unchanged from `main` (this PR neither adds nor clears one).

## Local checks on `9d35e620`
- review-checks `--base origin/main --build`: **9 passed, 0 failed, 2 warnings** (wikipedia-share 80% on the ch40 source log — the
  log lists the removed Wikipedia entries by design; same as before).
- verify scripts **18/18**; framework tests **51/51**.
- Headless ch40 at 320 / 390 / 1280: 0 script errors, 0 horizontal overflow, F5 wording present. (One external-resource load failed
  through this sandbox's proxy at every width — a network-only error, not a page script error.)

**Still needed:** GitHub green incl. Lighthouse on `9d35e620`; Carter's per-item yes (Vodou content: religiously sensitive, never by class).
