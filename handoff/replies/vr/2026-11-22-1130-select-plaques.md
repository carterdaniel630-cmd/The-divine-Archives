# VR loop run, 2026-11-22 ~11:13–12:10 UTC: controllers + select → plaques (VR-STATUS Next 2) — PR #188

**Lock:** the 08:10Z VR-LOCK, taken by a run that left no branch and no note, was stale (more than 3 hours old). It
was overwritten at 11:13Z.
**Next 1 skipped:** the #187 re-sync waits on #185 reaching `main`. It had not when this run started: `main` = `fa9e526d`.

## Built: PR #188, `loop/vr-controllers` `1fef4276` (from `origin/main` `fa9e526d`)
In the headset, point at a relic in the Rotunda, Egypt or Mesopotamia and tap the trigger. A label plaque opens
beside the relic. This answers field-report item 5, "relics not clickable".

- **One source of text.**
  - `app.js` now builds the card HTML once (`cardHTML`), and the inspector note once (`inspectNote`).
  - The flat card (`openCard`) and the VR plaque both read from these, so every honesty flag carries over: rendition, stand-in, forgery, contested, dated and held lines.
  - `openCard`'s behaviour is unchanged. The checks open the ch03 lectern card and run the existing flat sections.
- **Tap and hold.**
  - A tap (under 200 ms) selects.
  - A press held longer is the teleport arc, as before, and never opens a reading (interaction spec §1 row 4).
- **Closing.**
  - Tapping the plaque turns its pages, and on the last page closes it.
  - Tapping at nothing, pressing B (right hand, §1 row 9) or walking more than 3.5 m away also closes it.
  - Y is left alone: it is reserved for the return to the Rotunda.
- **The ray.** A plain gold ray, shown only while the hand is raised above the waist (§3). The "shaft of light" look is left for the artistry pass.
- **Comfort.**
  - Distance: 1.4 m from the eyes, nearest edge 1.41 m.
  - Text size: body 1.43°, title 1.9°.
  - Height when standing: centre 1.4 m, tilted back.
  - Seated: re-anchors to 1.0 m while open (§d.15 / pilot §15). The posture and walking plaques already re-anchor.
- **Pending (OQ-4).** Outside Egypt, a pending element's plaque gives only its name and "pending review".
  - Its text stays veiled until its walkthrough.
  - This covers 12 elements: the lectern, symbol and see-also boards of ch01, ch47, ch50 and ch51 in the Rotunda.
  - Egypt reads in full (ruling of 2026-11-16).
  - This follows Carter's standing OQ-4 rule. It does not decide anything new.
- **Scope.**
  - Readings work in the three pilot rooms only. Elsewhere nothing opens (checked on ch04).
  - Found and fixed while building: the museum's room finder has a 0.2 m margin. That margin claimed two ch04 figures (Agni, Saraswati) hung just across ch03's shared wall. `xrRoomOf` checks strictly inside the walls first.
- **Performance (order of 2026-11-22).**
  - `xr-read.js` (18 KB) is fetched only on a device that offers VR. Phones and desktops never download it (checked).

## Checked
- **Build:** full build order, no generated diff.
- **verify:** every `tools/verify-*.js` passes.
- **Framework tests:** 51/51.
- **review-checks:** `review-checks.js --base origin/main --build` gives 9 passed, 0 failed.
- **`tools/xr-entry-check.js`, all sections:** 135 ok, 0 fail.
  - Section 1 (phones 360/390 and desktop, no VR): no button, 0 errors, the reading module not downloaded.
  - New section 9: 51 readable exhibits, all in the pilot rooms. None was claimed through a shared wall.
  - Parity: 39 open readings carry every title, flag and contested line of their flat card. 12 are veiled.
  - Interaction: ray hidden or shown with the hand, hold → arc and no reading, tap opens it, distance, sizes, height, flags on page 1.
  - Seated and standing re-anchor. Paging: the Ishtar Gate takes 3 pages and closes after 3 taps.
  - Closing: tap-away closes it, B closes it, walking away closes it.
  - Exit leaves nothing on the camera. The flat card still opens. 0 errors.
- **`museum-baseline.js`, PR against `main`** (DPR 1, no throttle):
  - Draw calls and triangles are identical at the hall, the corridor and Egypt.
  - Page bytes are +5.7 KB.
  - 0 errors.
- **GPU (stand-in Quest 2, ch03 view, stereo calls):**
  - 118 with the hand down, 124 pointing, 128 with the reading open.
  - That is +10 in all: the plaque is 4, the ray and bead 4.
  - The remaining +2 is *inferred* to be the hand's rod coming into view as it rises. This was not isolated.
- **`vr-frame-budget.js` with the reading closed:** the same as `main`. On today's `main`, ch02 is 214 and ch03 220; #185 and #187 bring those down.
  - With #185 and #187, the worst view in Egypt is 128–148, so 158 with a reading open.
  - That is under the 160 line, with little room to spare.
- **Visual:** the plaque, and the two-eye view with the plaque beside the Ishtar Gate case and the ray:
  `vr/2026-11-22-read-plaque.png`, `vr/2026-11-22-read-view.png`.
- **frontend-design skill:** not installed in this session. The plaque reuses the posture and walking plaques' look.

## Not done (for later pieces)
- Near-field poke and magnification.
- Grabbing a facsimile.
- Gaze + dwell.
- The shaft-of-light beam.
- The A button as a select.
- The pilot spec's verbatim era plaques (Ishtar Gate §4.3 etc.): the reading shows the vault card's text, not that plaque text.
- A headset check of how readable the plaque is and how far you need to reach: this is Carter's.

Merged nothing. #188 is a new build: Carter's per-item yes, then an independent review by a run that wrote none of it.
