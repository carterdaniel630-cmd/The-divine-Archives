# Reply — Next item 1: small defects (hiss, "199 gods", V72 citations)

**Date:** 2026-10-17 (build loop run). **Branch:** `loop/small-defects-2026-10-17` (commit `ce31f9f`), NOT
`staging/ready-line`. Nothing merged. Nothing live.

**Why a side branch:** while this run worked, Carter ruled (17:06, `decisions-2026-10-17-priority-by-value.md`) that the top
value is getting site batch A (on `staging/ready-line`) reviewed and live. LOOP.md's merge condition 5 says commits after a
candidate may touch only `handoff/`. Putting these site changes on `staging/ready-line` would have forced batch A into a
bigger candidate, including an edit to a religious entry's sources (V72), which could hold it up. So the site changes sit on
their own branch, built from the batch A head, and become batch B once batch A is merged.

## Done
1. **Hallway hiss removed** (Carter's order of 2026-10-13; `handoff/defects/hallway-hiss-babble.md`).
   `docs/museum/sound.js`: the `brook()` generator (noise through jumping narrow band-passes, the "fax machine")
   and `fountain()` (which reused it) are deleted, and `recipe()` no longer assigns them. Removal, not replacement:
   the nine Age corridors and the two forest-brook rooms now carry only their existing faint wind (corridor wind
   0.09); the four garden rooms keep wind and their birds, with no fountain layer. Checked in a headless browser:
   `recipe({ground:"brook"},"corridor")` gives `{wind: 0.09}` only. Not listen-verified (no speakers here).
2. **"199 gods" → "199 figures"**: Pantheon meta description and OG description (`docs/pantheon.html`), and the
   founder guide (`00-audit/founder-guide.md:156`).
3. **V72 Book of Shadows: the 4 Wikipedia citations replaced** with sources opened and checked today (World
   Religions and Spirituality Project profile by V. Crowley; Open University OpenLearn course §3.1; Doreen Valiente
   Foundation "About" page) plus E. Doyle White's historical article on the Wiccan Rede (Project MUSE). Honest limits,
   written in `sources/v72-book-of-shadows.md`: none of the three opened pages mentions the Rede; the 1964 Rede line
   rests on Hutton (1999, already cited, not re-opened) and Doyle White, whose page could not be opened from here
   (access check), so no volume/pages are given. Re-check both at review.
   - **V72 is tagged "pending review" again.** It was cleared; changing a cleared entry's text requires the pending
     tag back (`review-checks` pending-diff rule). This is the opposite of clearing. Carter re-clears it in a batch pass.

## Checked
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): clean.
- Every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- `node tools/review-checks.js --base origin/main --build`: 9/9 pass (V72 pending, 0% Wikipedia in its log).
- Headless phone-size (390×844): pantheon, vault, V72 page (pending banner shown, 0 Wikipedia links), museum
  (no script errors; the only console errors are blocked Google Fonts requests in the sandbox).

## Not done here
- No PR #59 merge (still waits on Carter's auto-pass yes; a fresh independent review is due after that).
