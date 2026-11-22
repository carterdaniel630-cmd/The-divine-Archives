# Loop run 2026-11-22 02:45 UTC — games placement fix, step 1 (PR #184)

Session ..01HFWzTknbShcVs1863TNtiD. No main LOCK was held at start (VR-LOCK is the VR loop's, separate). CLAIM-merge-144 untouched.

## Pickup
Next 0hc: (1) #182 delta check — skipped: the VR loop took VR-LOCK at 02:38Z to do exactly that (VR-STATUS Next 1), so
doing it here would duplicate it. (2) **Games placement fix** (resumption pack Item A) — done as this run's item.
(3) Weekly audit — still due.

## Done: PR #184 `loop/games-placement` `62862601` (on `main` `6871e3ca`)
- `tools/build-museum.js`: no chapter room carries a game any more (it no longer derives one from the catalog's
  `hiddenIn`). Comment records the rule and how a form-true game (Senet, Mehen, Ur …) is placed later, by its own change.
- Build order rebuilt: `museum.html` Directory loses its 11 "Game:" lines; wings 02/03/04/06/07/09 + manifest lose the
  room `game`; `framework/registry/room.json` loses the `game:*` room links. 3D room kiosks go (app.js draws one only when
  a room has a game). Arcade, home-page cards, Symbols page, `#play=` links unchanged.
- Checks: build order only the expected generated files; verify 18/18; tests 51/51; `review-checks --base origin/main
  --build` 9/0/0; headless iPhone 13 at `museum.html#ch02`: 0 script errors (2 external-font tunnel failures only),
  0 "Game:" lines, 84 Directory rooms; `symbols.html#play=chess` still opens the overlay. Screenshot looked right.
- graphify CLI not installed in this session (update returned 1); worked from searches. Frontend-design skill not
  installed in this session either.

## Not done (needs Carter — conflicts or open design calls in Item A)
1. **Tomb Robber "restore":** the pack calls it a distinct missing game, but the repo says Carter renamed it to The
   Unfinished Journal (`6b419fd`, `decisions-2026-10-17-tomb-robber-confirmed.md`, "a" = keep the rename). Not built.
2. **Symbols page "Playable" tags:** the pack names the Symbols page as a room-assignment surface. Removing the tags
   changes how the hidden games are found (3 games have no easter-egg pool). Not built until Carter picks.
3. **Archive Chess "re-home out of Egypt":** to where? (clear only, or an early-modern room by form ~1475).
4. **Arcade cabinets** stand on "a piece of their chapter" (Egypt limestone, etc.) — keep as decoration or neutralise?

## Merge
#184 is per item (live game placement). Needs: independent review by another session, GitHub green incl. Lighthouse,
Carter's yes. Nothing merged this run.
