# VR loop — 2026-11-21 ~22:45 UTC: independent review of PR #182 (light rig per tier)

**Run:** scheduled VR loop run. No HALT/VR-HALT. Took VR-LOCK at 22:12Z (the 20:12Z lock was stale; that run did a
review locally but could not commit it, so nothing of it is relied on here). **This run wrote none of #182** (built by
the 2026-11-17 ~05:47Z run). Built nothing new; merged nothing.

## Verdict: PASS, 0 open findings
`loop/vr-light-rig` `118abdcc`, on `main` `5570e888`. Reviewed `origin/main...118abdcc` against `reviews/REVIEWER.md`
§3–§4: 2 files, `docs/museum.html` (cache key `app.js?v=51` → `v=56`) and `docs/museum/app.js` (+45/−8). No chapter,
Vault, Pantheon or source change; nothing religiously sensitive (§4 item 6: no sacred object, site or person touched).
Carter's yes is on file (`decisions-2026-11-21-pr170-pr182-yes.md`); it does not skip this review.

### Code (read in full)
- Flat museum: `lightRig(null)` keeps all 4 pooled lights and the separate lightning hemisphere; `setFlash()` in flat
  mode sets `flashLight.intensity = f × 2.4`, exactly the old `S.world.flash * 2.4`. `updateLights()` now iterates
  `lit`, which is `pool` in flat mode, and `Math.min(3, lit.length)` equals the old 3. Flat behaviour unchanged.
- Headset: `lightRig(tier)` hides pooled lights beyond 2 (floor) / 3 (q3) with `visible = false`. three.js's renderer
  skips invisible objects when it collects lights, so hidden lights are not evaluated; the code comment is right that
  intensity 0 alone would not have saved them.
- Merged hemisphere: a hemisphere light contributes `mix(ground, sky, w) × intensity`, linear in the colours, so one
  light with `sky·1.3 + flashSky·f·2.4` (and the same for ground) at intensity 1 lights every surface as the two did.
  Colours are summed in three.js's linear working space after `Color.set` converts them. Correct.
- Tier source: `xr.js` sets `XRProbe.tier` (`tierOf(userAgent)`: Quest 3/Pro → `q3`, else `floor`) before
  `renderer.xr.setSession()`, which fires `onStart`, so `lightRig(XRProbe.tier || "floor")` reads the right tier.
- Exit: `lightRig(null)` → `setFlash(0)` sees `hemi.intensity (1) !== 1.3` and restores the flat colours and strength.
- Light-count change only at session start/end, so shaders rebuild once per entry, not per flash. Confirmed by the
  builder's programs figure and by the flash test below (no light count change during a bolt).

### Re-measured independently
- `tools/vr-frame-budget.js` (from `main`, run as a scratch copy against this branch's `docs/`): **5 lights (0 at 0)
  in all 7 places**; calls 148–268 and triangles 263k–712k, the same as the builder's "unchanged" column; 0 script errors.
- A scratch check of my own (stand-in headset from `tools/xr-standin.js`, ch17 storm room, both tiers):
  - flat before entry: 8 lights;
  - in VR: **5 on Quest 2, 6 on Quest 3**, one hemisphere, lightning light switched off;
  - merged hemisphere at rest equals the flat hemisphere (0.3304, 0.1874, 0.0751);
  - forced bolt: the merged hemisphere rises (blue peak 1.23 on Q2, 0.91 on Q3), as one colour scaled (channel ratios
    constant to 5×10⁻⁴, rounding), and no extra light switches on;
  - after exit: 8 lights, 4 pooled, lightning light back, flat hemisphere restored exactly;
  - a second entry gives the same rig; 0 script errors on both tiers.
- `tools/xr-entry-check.js`: all pass, including flat 360/390 px with no WebXR (VR entry hidden) and 0 errors.
- `tools/museum-baseline.js` (flat phone), this branch vs `main`: draw calls, triangles and geometries identical in
  every zone; JS +2,866 bytes; 0 errors.

### Local checks on `118abdcc`
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry → sky):
  tree clean after.
- `verify-*.js` 18/18 pass. Framework tests 51/51. `review-checks.js --base origin/main --build` (main now `66d6969b`):
  9 passed, 0 failed, 0 warnings.

### GitHub on `118abdcc`
7/7 completed and green: checks, guard, test, runtime ×2, links, **lighthouse** (06:32–06:49Z, 2026-11-17).

### Notes (not findings)
- **Re-sync needed before merge.** `main` has moved to `66d6969b` (#181) and the VR stack (#169→#178) goes first. A
  trial merge of #182 onto the stack head `d33e839d`: `app.js` merges cleanly; the only conflict is the expected
  `museum.html` cache key (55 vs 56): keep `v=56`. After re-sync: a delta check by a session that did not re-sync,
  GitHub green incl. Lighthouse on the new head, then merge per item.
- The v88 reliquary niche adds a shadowing SpotLight; in VR that room would read 6 lights on the floor tier. It is not
  a pilot room, and the builder's reply says so. Worth a later piece if VR reaches beyond the pilot.
- Visible trade-off already disclosed: only the 2 nearest lamps are real lights in the headset, so far cases are a
  little dimmer. Carter's headset walk is the real test.
