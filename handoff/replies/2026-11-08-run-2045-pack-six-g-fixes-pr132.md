# Loop run 2026-11-08 20:45 UTC — pack-six G-1..G-5 fixes built as PR #132

Session 01HFWzTnBjWYHocgJKmWS943. Halt: none. Lock: none found; taken 20:45 UTC, released at the end of this run.

## Left alone
- **PR #131 merge:** Carter's yes is recorded. Lighthouse run 42520964176 was still in progress at 20:45 UTC, and
  session ..TpNfstcd2HdCkYSakz said it would do the merge when that run is green. This run did not touch #131.
  If `main` is still `593d7d17` when the next run starts, that run should check the Lighthouse result and do the
  merge as LOOP.md "Merging" says.

## Picked up: (5) pack-six rebuild, first bounded piece (the audit defect list G-1..G-5)
Atlas staged the inputs at `handoff/pack-six/`, and the MD5s match the manifest. This run did not build the whole
production rebuild (animation and staged story). That is several runs of work and is listed as its own item.
This run took only the verified defect list, as continue-order item 5 names it.

**PR #132**, `loop/pack-six-g-fixes` **`68e48e2e`**, off `main` `593d7d17`:
- `70b91549` adds the six files byte for byte as sold, under `products/games-of-the-ancients/` with a README.
  Commit 2 is therefore the whole diff to review (47+/2−).
- `68e48e2e` has the fixes:
  - G-1: all controls ≥ 44 px. Ur squares are 42–43 × 44. Hnefatafl's 11×11 squares stay 28 px: 44 px would need
    484 px of width, and 28 px is above the WCAG 2.2 AA minimum of 24 px.
  - G-2 Ur: the light colour scheme was the cause. Light-mode phones now get the night palette.
  - G-3 Hnefatafl: the wood-grain lines were opaque `#fff`; they are now 5% white. Checked by eye in both schemes.
  - G-4 Mancala: the rows are now labelled "Keeper's row" and "Your row — tap a pit to sow".
  - G-5 Ur: entry works by tapping the glowing square. The status line now says "piece or square".

Nothing under `docs/` changes, so the live site is not affected. After a merge, atlas does the Gumroad swap.

## Checks (local, on `68e48e2e`)
- Full build order: clean, `docs/` unchanged.
- verify: 18/18.
- tests: 42/42.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless at 390 px, light and dark: 0 script errors and 0 network calls over about 400 random taps per game,
  no sideways scroll. Screenshots before and after were compared by eye for Ur, Hnefatafl and Mancala.
- Frontend-design skill: not installed in this session (CLAUDE.md asks that this be said).

## Noticed, not fixed (pre-existing; outside G-1..G-5)
- Ur: the wooden ledge under the board covers the small "THE TURN" label.
- Mancala: thin light strips at the page edges at 390 px.

## Atlas inputs that landed during this run (`atlas-inputs-2026-11-08-folders.md`)
- Front-door v4: the page is in, but its four photographs are not. The build needs the image files themselves,
  because the page shows them.
- Rotunda Tray 1: the manifest is in, but the meshes are not. The integration needs the `.glb` files themselves.
- Possible route for the binary files: a normal git push, or GitHub's "Add file → Upload files" on
  `staging/ready-line`. Both carry binary files intact; the corruption came from the text channel. Suggested paths:
  `handoff/front-door-v4/images/` and `handoff/rotunda/tray1/`.

## Next
- (5r) Independent review of #132, by any session other than ..01HFWzTnBjWYHocgJKmWS943. Loop work.
- #131 merge, if it is still waiting.
- Then GitHub checks green, and Carter's per-item yes for #132.
- Chaining: yes.
