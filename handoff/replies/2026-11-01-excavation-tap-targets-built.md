# 2026-11-01 ~17:30 UTC — Excavation tap targets built: PR #104

**What:** tap targets part 2, Excavation half (`prep-2026-10-28/tap-targets-part2/SPEC.md` §2), plus the Pilgrimage
list's 32 px "Enter the site" button (STATUS Next 6). Branch `loop/excavation-tap-targets` `662bf97`, PR #104.

**Changes**
- Phones (≤520 px): the board's frame is slimmer (padding 10 → 4 px). The gaps stay 2 px.
- Touch screens where squares come out under 44 px get a **Zoom** button beside Flag mode. Zoom makes squares 46 px
  and the board pans inside its frame. The choice is kept across levels for the visit, and the view opens on the middle.
  It is hidden on desktop and mouse.
- Long-press: a move of more than 10 px is a pan and never digs or flags. A smaller wobble still counts as the tap.
  Before, any movement swallowed the tap.
- No overlapping hit layers.
- `.pg-go` is 44 px tall on touch screens and looks the same.
- Cache keys: games.css v19, excavation.js v6, pilgrimage.css v2. The pilgrimage pages were rebuilt for the new key.

**Verified**
- Full build order, all 18 verify scripts, tests 42/42 and `review-checks --base origin/main --build` 9/9 all pass.
- Headless phone runs at 320×568, 360×640 and 412×915, on Novice, Adept and Master with zoom off and on:
  - every square hit-tested at its centre and 6 edge/corner points: 0 misses;
  - 72–84 real flag taps per configuration, near corners: each landed only on the intended square;
  - a swipe on the zoomed board scrolled it and changed 0 squares;
  - a zoomed dig opened squares;
  - the page is never wider than the screen;
  - no script errors.
- Desktop: no Zoom button, and the board is unchanged.
- Measured unzoomed squares: Novice 27.5 / 31.6 / 37.0 px at the three widths (the height limits Novice on short phones),
  Adept 22.4–27.3 px, Master 22.4–23.1 px. Zoomed, every level is 46 px.

**Not available this run:** the frontend-design skill is not installed in this session. The look is kept: the Zoom
button reuses the Flag button's style. The graphify CLI is not installed, so the code map was not refreshed.

**Gate:** independent review by a run that wrote none of it, GitHub green (Lighthouse included), then Carter's per-item
yes. This adds a control to a game, so it is not merged by class.

**Atlas questions from `order-2026-11-01-vr-pilot-queued.md`, answered:**
1. Ziggurat #100 landed on the **arcade game** (The Ziggurat on the Games page, `docs/assets/games/games.css`,
   `.zig-pad` at 2.75rem = 44 px on phones; on `main` line 353). It never touched the museum's Mesopotamia kiosk.
   If that kiosk has a small tap box, it is a separate defect and has been added to Next.
2. Newgrange: confirmed. On `main`, `docs/pilgrimage.html` line 81 still lists Newgrange as "Coming", although
   `docs/pilgrimage/newgrange.html` is built. The flip is owed and has been added to Next.
