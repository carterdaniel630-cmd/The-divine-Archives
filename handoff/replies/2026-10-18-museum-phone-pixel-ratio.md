# Museum phone performance: pixel ratio 1.5 → 1.0 (build loop, 2026-10-18)

**Answer:** built and measured on its own branch, `loop/museum-phone-dpr` @ `0585c80` (one line in
`docs/museum/app.js`, from `main` @ `7b281cb`). Not merged, no pull request yet. Phones now draw the museum at one
pixel per screen point instead of 1.5, which is about half the pixels to fill each frame. Desktops are unchanged (2).

## Measured (tools/museum-baseline.js, 412×915 phone screen @2x, 20-second windows, software graphics)
Software graphics (no GPU here), so these are **relative, not phone numbers**.

| Spot | Before (1.5) | After (1.0) | Draw calls | Triangles |
|---|---|---|---|---|
| Entrance hall | 3.2 fps | **6.1 fps** | 36 → 37 | 26.7k (same) |
| Bronze Age corridor | 0.2 fps | 0.2 fps | 86 (same) | 205k (same) |
| Egypt room (ch02) | 0.6 fps | 0.6 fps | 68 → 67 | 121k → 120k |
| First zone ready | 17.9 s | 18.0 s | | |

- The hall nearly doubles. The corridor and the Egypt room do not move **in software graphics**, because there the
  cost is the shapes, not the pixels. On a real phone GPU, filling pixels is usually the bigger cost, so a gain is
  expected there too, but that is inferred, not measured. Only a real-phone check can confirm it.
- No script errors before or after. The canvas is 412 pixels wide after (618 before), as intended.
- Note: the corridor has 205k triangles now (budget ≤ 220k; 191k at the 2026-10-06 baseline). Under budget, but close.
  Not touched here.

## Looks
Side-by-side screenshots (left before, right after): `handoff/previews/museum-dpr/cmp-hall.jpg` and `cmp-ch02.jpg`.
Slightly softer; the hall title and room labels stay readable. Edges (ceiling grid, reeds) are a little more
stair-stepped, since phones already draw without smoothing. Raw numbers: `before-1.5.json`, `after-1.0.json`.

## Checks (on the branch)
Full build order: output matches what is committed. Every `tools/verify-*.js` (17): pass. `node --test
framework/test/*.test.js`: 42 pass, 0 fail. `node tools/review-checks.js --base origin/main --build`: 9 pass, 0 fail.
Headless phone-size check of the museum: no errors.

## To go live (Items 22/25)
1. Independent review by a run that did not write it.
2. A pull request so GitHub's checks (Lighthouse included) run, all green.
3. Best: Carter opens the museum on his phone before and after (the museum has no `?fps=1` overlay yet; the plan
   promised one). 4. Carter's yes for this item.

Also seen: `main` gained two handoff-only commits (`fd3a66e`, `7b281cb`, games Phase 1 record) after batch B was
brought current; batch B (`aeda5d4`) is now behind `main` by those two handoff files only, no site change.
