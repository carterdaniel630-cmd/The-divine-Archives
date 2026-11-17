# VR loop reply — 2026-11-17 01:00 UTC: Day and weather, first piece (PR #178)

**Built:** PR #178, `loop/vr-daylight` `dc1f1f75`, stacked on #174 (→ #170 → #169). **VR, per item**: merges only
on Carter's yes. Run 2026-11-16 23:49Z → 2026-11-17 ~01:00Z (VR-LOCK taken 23:49Z).

## What it does (Carter's "Day and weather", built light first per `order-2026-11-15-vr-buildout.md` 5)
- In the three pilot areas (ch02 Egypt, ch03 Mesopotamia, Bronze Age corridor; `world.js` ENV `day`, table `DAY`)
  the hour drifts between the room's own sky and a second hour and back, over 8 minutes, eased at both ends:
  Egypt and corridor golden → high clear day (sun 54.5° → 72° / 68°); Mesopotamia haze → **dusk** (sun → 20°; dusk
  is the pilot spec's hour for this room). What follows the hour is only what is already drawn live: the skylight's
  sky, cloud and sun, and the light the ground, water, plants and creatures take from it.
- Wind: the plants' sway comes in slow gusts (0.45–1.55 of calm).
- Not touched: baked light, lamps, cloud speed, every other room, the Rotunda (no open sky in it; its oculus shaft
  is a later piece). No light, draw call or texture added. Rain not built (the expert walkthrough: skip it in the pilot).
- Each visit starts at the room's own hour, so a first look is unchanged.
- Screenshots (flat, 960 px, same view): `2026-11-17-day-ch03-own-hour.png` → `2026-11-17-day-ch03-dusk.png`;
  `2026-11-17-day-ch02-clear.png`.

## Checks (local, on `dc1f1f75`)
- `tools/day-check.js` (new): all pass at 960 px (ch02, ch03, corridor; ch05 shows no drift) and 390/360 px (ch02,
  ch03); 0 script errors. Steepest second: light 0.78 % (ch03), sun 0.249° (bounds 1 % / 0.25°). No draw call added.
- `xr-entry-check.js`: all pass (no VR button without WebXR; height plaque checks unchanged).
- Phone baseline (412 px): hall 39 / corridor 85 / ch02 68 calls — identical to #174's reviewed head; 0 errors.
- `ground-check.js`: all pass (960/390/360).
- `react-check.js`: ch03 at 960 px all pass (16 ok); the ch02 lines were cut from this run's log (only its tail was
  kept), so ch02 is **not re-confirmed** here; the corridor crashed the headless browser (out of memory), the same
  sandbox crash already seen on #170's and #174's heads. The reviewer should re-run react-check ch02.
- Full build order: no diff. `verify-*.js` 18/18. Framework tests 51/51. `review-checks.js --base origin/main --build` 9/9.
- GitHub at write-back: checks, test, runtime, links green; guard skipped; **Lighthouse running** (not waited for,
  per the never-hold-the-lock rule).
- graphify CLI installed and updated at run start.

## For the reviewer
- Only judgment call: the second hours (clear day for Egypt/corridor, dusk for Mesopotamia) and the 8-minute cycle.
  Atmosphere only, nothing religiously sensitive. Carter can change either in one line (`ENV` `day`, `DAY.PERIOD`).
- Main has moved (#176 merged, `cf718704`); the stack #169 → #178 re-syncs at merge time as before.

## Next
Independent review of #178 by a run that wrote none of it, then Lighthouse green. Then G3 frame budget.
