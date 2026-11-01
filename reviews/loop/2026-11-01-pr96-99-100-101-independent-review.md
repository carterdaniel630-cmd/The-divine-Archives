# 2026-11-01 ~14:05 UTC — independent review: PR #101, #99, #100, #96 (delta)

**Reviewer:** the 13:42 UTC scheduled loop run (session `…WzTmenfdGN4FsVHCdZKg`). It wrote none of these four PRs:
all were built in session `…pNYSq7BmWdg5BE1NX` (`2026-11-01-carter-yes-x4-acted.md`, `2026-11-01-pr99-home-search-360.md`,
`2026-11-01-pr100-zig-pad-44.md`, `2026-11-01-share-images-pr96-and-pr93-resync.md`).
**Base:** `origin/main` = `f1c3c2a`. Every candidate has `f1c3c2a` as an ancestor.
**Verdict: all four PASS, 0 findings.**

| PR | Candidate | Site diff vs `main` | Verdict |
|---|---|---|---|
| #101 line-wrap typos ch07/15/16/45 | `loop/line-wrap-typos-cleared-2` `bb241e5` | `content/chapters.js` 4 lines, 4 chapter pages 1 line each, `reviews/cleared.json` +4 entries | PASS, 0 |
| #99 homepage search box at 360 px | `loop/home-search-360` `d5815c6` | `docs/assets/archive.css` 1 line | PASS, 0 |
| #100 Ziggurat pad 44 px | `loop/zig-pad-44` `62a2124` | `docs/assets/games/games.css` +9/−4 | PASS, 0 |
| #96 share images, five pages (delta) | `loop/share-images-six` `c5ecb5a..8c18b18` | museum image tags + `PAGE_SHARE.museum` removed, garbled card moved to `_to_delete/`, plus `main`'s #98 (already live) | PASS, 0 |

## §3 automatic checks (this run, each candidate in its own worktree)
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework,
  build-entity-registry, build-sky): clean on all four, **no working-tree diff** (committed output is current).
- Every `tools/verify-*.js` (17, incl. the new `verify-share-images.js` on #96): pass on all four.
- `node --test framework/test/*.test.js`: 42 pass, 0 fail on all four.
- `review-checks.js --base origin/main --build`: **PASSED 9, 0 failed, 0 warnings** on all four.

## §4 checklist
**#101.** Word-diff shows exactly five removals of a stray space after a hyphen: "free- standing" (ch07), "number- mysticism"
(ch15), "relic- veneration" (ch16), "ascent-and- initiation" (ch45, in `chapters.js` and the page). No other character changed.
A scan of the four built pages for `[a-z]- [a-z]` finds none left. The `cleared.json` entries cite Carter's re-clear
(`decisions-2026-11-01-carter-yes-x4.md` 3) and are limited to this typo change, matching his ruling.
1 accuracy, 2 lens, 3 evidence tiers, 4 contested: unchanged text, n/a. 5 tone: pass. 6 sensitivity: no new image or claim; pass.

**#99.** `min-width: 0` on the search input lets the flex item shrink below its intrinsic width; it is the real cause, not
a mask. Headless homepage: page width **360 at 360×740 and 320 at 320×568** (main: 373 at both), 390 unchanged; 0 script
errors. The era timeline's own horizontal scroller is untouched. 1–6: n/a (CSS only).

**#100.** 7 games: headless Ziggurat (`symbols.html#play=ziggurat`, touch, DPR 2), 0 script errors, no black canvas:
- 320×568: all 8 pad keys **44×44**, pad bottom at 541 px (fits; main 35×35);
- 360×640: 44×44, bottom 599 px (main 35×35);
- 390×844: 44×44 (main 40×40).
Hidden on short screens: `.game-rule` (a `role="presentation"` divider) and, on touch only, the keyboard-shortcut line
inside the controls; the end-of-game notes have no `.zig-pad` next to them, so `:has(> .zig-pad)` cannot hide them.
The board's `min(33vw, calc((100dvh − 376px)/2))` only shrinks it below ~620 px tall. 1–6: n/a.
Screenshot: `2026-11-01-review-pr100-zig-320x568.png`.

**#96 delta.** Matches Carter's ruling (yes ×4, 4a): museum `og:image`/`twitter:image` and its `PAGE_SHARE` entry are gone;
museum keeps title/description tags and `twitter:card=summary`; the garbled card is moved to `_to_delete/` (not deleted).
`verify-share-images.js` no longer lists the museum among checked pages (the `PAGE` map key for it is now unused, harmless).
Served from the site root, all five images return 200 with the sizes the tags announce; `museum.jpg` is absent (404).
Headless at 360: Pilgrimage list and the three site pages carry the right tags, page width 360, 0 script errors.
6 sensitivity: the five images were reviewed in substance at `842b51e`/`c5ecb5a`; the delta adds none. Pass.

Only console error anywhere: the web-font request blocked by this sandbox's network (`ERR_TUNNEL_CONNECTION_FAILED`), not the site.

## GitHub (at ~14:00 UTC)
- #101 `bb241e5`: 9/9 success incl. Lighthouse (13:37).
- #99 `d5815c6`: 6/6 success incl. Lighthouse (13:39); `test`/`verify` are path-filtered and do not run for CSS.
- #96 `8c18b18`: 8/8 success incl. Lighthouse (13:33).
- #100 `62a2124`: 6 success, **Lighthouse in progress** (started 13:23). Not waited for with the lock held.
