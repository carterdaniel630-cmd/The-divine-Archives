Batch: Excavation tap targets + Pilgrimage "Enter the site" button (PR #104)
Reviewed: 2026-11-01
Auto-pass: on (merge still needs Carter's per-item yes: it adds a game control)
Covers: loop/excavation-tap-targets@662bf97
Summary: 1 passed, 0 fixed, 0 need you (the merge itself needs your yes).

Reviewer: build-loop session ..WzTkijWpXHy48tH7tkJt. It wrote none of this PR (builder ..WzTpZWVqFo6nc6CJrJAw).
Reviewed `origin/main...662bf97` against reviews/REVIEWER.md §3–§4.

Automatic checks: pass.
  - Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry → sky)
    reproduces the committed files exactly (no changes in the working tree).
  - tools/verify-*.js 18/18 pass. node --test framework/test/*.test.js 42/42 pass.
  - review-checks.js --base origin/main --build: 9 passed, 0 failed, 0 warnings.
  - GitHub on 662bf97: 9/9 green incl. Lighthouse (17:09 UTC).

PASSED   (1)
  - site:pr104: the change does what it says, nothing else.
    * Excavation (docs/assets/games/excavation.js, games.css): on touch screens where the fitted squares are under
      44 px, a "Zoom" button appears; on, every square is 46 × 46 px with 2 px gaps and the board pans inside its frame.
      Squares are separate buttons, so hit areas never overlap. A finger that moves more than 10 px is a pan, never a
      dig or a flag; a small wobble still counts as a tap. The resize listener is removed on cleanup.
      Mouse / desktop: no Zoom button, board unchanged.
    * Pilgrimage (pilgrimage.css): on touch screens "Enter the site" is 44 px tall (was 32 px); same look elsewhere.
    * Cache numbers bumped where the files are loaded (games.css v19, excavation.js v6, pilgrimage.css v2, from
      tools/build-pages.js so the built pages match). No old version strings left on the branch.
    * No chapter, Vault entry, Pantheon figure, source log or game fact touched: §4 items 1–5 do not apply.
      Item 6 (sensitivity): nothing sensitive touched. Item 7 (games): checked headless, below.

FIXED    (0)

NEEDS CARTER (0)

Headless check (Chromium, touch phone profiles 320/360/412, desktop 1280)
  - Excavation, all three levels, every width: grid renders, no script errors, page never wider than the screen.
    Fitted squares on phones: Novice 27/32/37 px, Adept 22/23/27 px, Master 22/22/23 px → Zoom offered; on: 46 × 46 px,
    2 px gap, board scrolls, view starts centred. Desktop: Zoom hidden (squares 48/36/30 px, as before).
  - Zoomed Master at 360: a 120 px swipe panned the board (scroll 185 → 327 px) and changed no square;
    a tap on the centre of square (7,2) opened exactly that square.
  - Pilgrimage list: "Enter the site" 44 px tall on phones, 32 px on desktop (unchanged).
  - Only console errors: Google Fonts blocked by the sandbox network (not the site).

Notes (not findings)
  - The code comments say the Zoom button is for "Adept and Master on phones"; it also shows on Novice at phone widths,
    because Novice squares (27–37 px) are under 44 px too. The behaviour is right and matches the rule in the code
    ("shown where the squares come out under 44 px"); only the comment is narrower. Optional wording tidy, no effect.
  - A tap that lands exactly in a 2 px gap does nothing (no wrong square). Expected.
  - The branch is based on main before #103 (`162f1d2`). Before a merge it must be rebased onto main (and onto #102
    if that lands first) and checks re-run on the new head, as LOOP.md "Merging" says.

Accuracy spot-checks
  - none: no factual text changed.

Needs your decision
  - Merge PR #104 (bigger tap squares on phones in The Excavation via a Zoom button, and a taller "Enter the site"
    button on Pilgrimage)? It adds a game control, so it needs your yes for this item. Recommend: yes.
