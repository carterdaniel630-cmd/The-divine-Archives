# Independent review — PR #127 "The Rök Stone, Decoded" (`loop/rok-stone-page` @ `d56e7b70`)

- **Reviewer run:** build loop, 2026-11-08 ~11:45–12:30 UTC, session ..01HFWzTk1pee9maQ9EiUJWJN. Wrote none of the candidate's site changes (builder: ..01HFWzTovazLUaNgT45KnyVv).
- **Diff reviewed:** `origin/main` (`e407fa98`) `...d56e7b70`: `docs/vault/rok-runestone-decoded.html` (new page), `sources/rok-runestone-decoded.md` (new source log), `docs/sitemap.xml`, `tools/build-pages.js`, `framework/registry/{index,source}.json`.
- **Checked against:** `handoff/rok-decoding-page-order.md`, `handoff/rok/report.md` (atlas, staged), `reviews/REVIEWER.md` §3–§4, and the live sources fetched below.
- **Verdict: FIXABLE — 3 open findings (F1–F3), all wording on the page.** Not mergeable until fixed and delta-reviewed by a session that wrote none of the fix. Merge is per item in any case (new page).

## §3 automatic checks (on `d56e7b70`)
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings**. Wikipedia share 1/11 (9%).
- `tools/verify-*.js`: 18/18 ok. `node --test framework/test/*.test.js`: 42/42 pass.
- Tree clean after the build (no stale output, no untracked files).
- Headless phone 390×844: no page errors, page width 390 (no sideways page scroll); pending banner shown at top. One external resource failed to load through the sandbox proxy (network, not the page).
- GitHub on `d56e7b70`: checks ✓, runtime ✓, guard skipped; **lighthouse in progress** (hand-started 11:39 UTC, advisory). The PR is still draft, so the pull-request checks (review, framework, originality, the hard Lighthouse gate) have not run — they start when it is marked ready or on the next push.

## Findings

**F1 — Reception paragraph overstates the opposition (fixable, honesty wording).**
Page §6 "How it has been received": "In 2021 alone the National Heritage Board's runologist Magnus Källström noted three weighty rival reinterpretations, including a two-volume alternative by Bo Ralph." In a paragraph about how the 2020 reading was received, this reads as three readings *against* it. The report (§4a, from Källström's K-blogg post) names the three: **a new Holmberg article in *Maal og Minne*, Henrik Williams's popular book *Rökstenen och världens undergång* (both by members of the 2020 team), and Bo Ralph's two-volume *Fadern, sonen och världsalltet***. Suggested wording: "In 2021 alone, the National Heritage Board's runologist Magnus Källström counted three weighty new interpretations: a further article by Holmberg, a book by Williams, and a two-volume alternative by Bo Ralph that reads the stone differently again." (K-blogg itself did not load from this run either; the report is the only reading of it, which the page already says.)

**F2 — First cross-cipher row does not match the printed source (fixable, accuracy).**
Page §4c table, row 1: "2:5 + ibi → sibi". The Wikipedia Unicode transcription, fetched 2026-11-08 by this run, prints that group as **`[2:5 = ᛌ] [2:3 = ᛁ]ᛓᛁ`**, i.e. two cipher signs (s, i) plus plain *bi*. The on-site poster as transcribed by Schmeh/Ekhall (report §2c) agrees there are two coded signs plus "bi" ("Rune 5 of the second class: S; Rune 3 of the first class: i; … 'bi'"; it gives the *i* as first class, which conflicts with Wikipedia's 2:3). The report's copy (line 162) has `[2:5 = ᛌ]ᛁᛓᛁ`, which is where the page's "+ ibi" comes from. Fix: row 1 → "2:5, 2:3 + bi → sibi", and in the source log note that the poster transcription prints the *i* as "first class". The rule "only pairs the sources print" still holds: 2:3 = i is printed elsewhere on the page already.

**F3 — Family numbers don't match the row as shown (fixable, clarity).**
§4a prints the row "f u þ a r k · h n i a s · t b m l R", and §4b says each sign is "family:place". A reader who counts the families in that left-to-right order gets 3:3 = **m**, but the page (correctly, as the sources print it) says 3:3 = **þ**. In every printed pair, *f u þ a r k* is family 3 and *t b m l R* is family 1 (3:2 u, 3:3 þ, 3:5 r, 3:6 k; 1:1 t, 1:3 m, 1:4 l). The Holmberg paper uses a different notation again (it writes þ as "4:4"). Fix: one sentence in §4b, e.g. "The family numbers are as the sources print them, and they are not counted in the left-to-right order of the row above: in these pairs *f u þ a r k* is family 3 and *t b m l R* is family 1." This reads off the printed pairs; it is not a full table.

## §4 checklist
1. **Accuracy (claims checked against sources fetched by this run):**
   - c. 760 characters, 2.4 m above ground — Wikipedia ("around 760 characters", "8 feet (2.4 m)"). Pass.
   - Statue moved to Aachen by Charlemagne in 801 — Wikipedia. Pass.
   - Ohlmarks: *husl* = baptism — Wikipedia. Pass.
   - Opening in *ljóðaháttr*, Theodoric stanza in *fornyrðislag* — Wikipedia. Pass.
   - Vigfússon first proposed Theodoric, 1879 — Holmberg et al. 2020 (bibliography: Vigfússon & Powell, *An Icelandic Prose Reader*, Oxford 1879, p. 452). Pass.
   - Holmberg quotes ("anxiety triggered by a son's death and the fear of a new climate crisis…", "not so arrogant…", "admittedly a weaker link…", "just one possibility, we hope better than previous ones", "never interpreted satisfactorily") — all found in the paper (archaeology.org copy). Pass.
   - Five questions about the sun, four about Odin — the abstract says "Five of the questions concern the sun, and four of them, it is argued, ask about issues related to the god Odin". The page's reading (five + four of nine) is the natural one. Pass (note the abstract's wording is slightly ambiguous).
   - Side D pairs (2:5 2:4 3:6 3:2 1:3 | 3:2 3:6 1:3 2:3 2:2 2:3 | 3:3 3:2 3:5), cross pairs ul/ni/ruþR/uia/uari, *nit* = 2:2 2:3 1:1, Elder passage 3:3 = þ — all match the Wikipedia transcription. Pass, except **F2**.
   - Källström 2021 — not reachable from this run; checked against the report only → **F1**.
   - Everything else checked line by line against `handoff/rok/report.md`: dimensions, find history, Bugge/von Friesen, 2-vs-4 cipher count, Lindqvist/Brávellir, Harris, Sjólund, Ralph 2007, BBC presentism quote. Pass. No claim on the page was found without a report source; the low-authority 2025 *Futhark* item is correctly left off.
2. **Believer's / skeptical balance:** traditional (Rundata/Theodoric) and 2020 readings each get full, fair statements; caveats and reception both given. Pass.
3. **Evidence-honesty tiers:** supported / not supported / genuinely open kept apart; no "proof/settled" language; "Answer carved / Contested / Unsolved" tags are accurate. Pass.
4. **Contested claims flagged, not resolved:** Theodoric shown as "traditional reading, now challenged"; reading order "not agreed"; the 2020 reading appears only in its labelled box (checked: no Yggr/sun/climate/"Clash" wording outside §6 except the evidence section's "open" line naming it). Pass.
5. **Tone:** descriptive. Pass.
6. **Religious sensitivity:** a Viking-Age memorial stone; not a secret-sacred object, restricted site or revered person; no images yet. Nothing on the sensitivity list. It is a new page, so merge is per item regardless.
7. **Games/3D:** none touched.

## Order compliance (`rok-decoding-page-order.md`)
Items 1–6 present. **Item 7 (photographs) not yet** — the page says so plainly; waits on atlas. **Item 8 (V36 back-link) not yet** — needs Carter's re-clear of V36. Both are known gaps, not findings; Carter decides whether the page may go live before them.

## Notes (not findings)
- N1: The 11-column shift-cipher table needs a sideways swipe at 390 px (inside a scroll box; the page itself does not scroll sideways). Acceptable; a stacked layout would read better on phones.
- N2: Before merge, mark #127 ready for review so the hard Lighthouse gate and the pull-request checks run.

## Sources fetched by this run (2026-11-08)
- https://en.wikipedia.org/wiki/R%C3%B6k_runestone
- https://archaeology.org/wp-content/uploads/2020/04/FULLTEXT01.pdf (Holmberg et al. 2020)
- https://k-blogg.se/2021/12/31/att-tolka-rokstenen/ — not reachable (permission not granted to this run; not in search results)
