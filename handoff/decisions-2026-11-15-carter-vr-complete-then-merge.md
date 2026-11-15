# Carter's ruling, 2026-11-15 ~23:20 UTC: finish the VR pilot, then merge it so he can test it live

Given live in session ..01HFWzTpTaZS132Vycb42g63, in answer to "what's going on with the VR flow". Carter's words:
"make sure the vr run follows through to completion and is then merged so i can judge it. seeing it live is the only
way for me to test it. bring it to completion so we can do so"

## What this approves (per item: the VR pilot)
- **Carter's per-item yes to merge the VR pilot** once it is complete. The pilot means the groundwork in `VR-LOOP.md`:
  G1 Entry, G2 Comfort, G3 Budget, G4 Curtain, G5 Pilot rooms (the Rotunda, the Wing II atrium, ch02 Egypt and ch03 Mesopotamia,
  as in `vr-pilot-spec.md` §1). This yes names one specific item, the VR pilot, so it is not a general "merge as we go".
- **When to merge:** once all of G1–G5 are built, stacked in build order, and each piece qualifies. Carter said
  "completion … then merged", so the pieces go live together, not one by one. The build loop fast-forwards the stack
  back to back (LOOP.md "Merging", stacking rule).
- **Why live:** Carter can only test the pilot by opening the live museum in a headset. Build sessions cannot wear one.

## Conditions that still apply (this yes does not lift them)
Every LOOP.md "Merging" condition still holds for each piece in the stack:
- an independent review with 0 open findings, by a session that wrote none of that piece;
- every GitHub check green on the head, Lighthouse included;
- local checks: full build order, every verify script, the framework tests and `review-checks --base origin/main --build`.

VR-LOOP.md step 6 also still holds:
- with no headset, the flat museum is unchanged (headless 360/390 px, 0 script errors, `museum-baseline.js` inside budget);
- "Enter VR" stays hidden where WebXR is missing;
- rooms that are pending review stay curtained in VR (OQ-4).

## What this does not cover
- Clearing any pending tag.
- Anything a review sends to Carter, or anything religiously sensitive. Those come back to him per item, as before.
- Anything beyond the pilot: the Keeper's Study, the WebGPU tier and DG-6 radiance (DG-6 is deferred by Carter). Each of those needs its own yes.
- Calling VR "done". It is done only after Carter has checked it in a headset on the live site
  (`vr-pilot-spec.md` "Owner-witness").

## Notes for the loops
- **VR loop:** keep chaining until G1–G5 are built, reviewed and green (`decisions-2026-11-15-carter-vr-to-completion.md`).
  Then list the whole stack in MERGEABLE as "VR pilot, per item: `decisions-2026-11-15-carter-vr-complete-then-merge.md`".
- **Spec set location:** atlas's spec set is staged in `handoff/vr-*.md` (vr-pilot-spec, vr-architecture,
  vr-interaction-spec, vr-comfort-brief, vr-performance-budget, vr-benchmark-brief, vr-audio-brief,
  vr-artistry-addendum, vr-webgpu-brief, vr-roadmap, vr-decisions-2026-11-01), not in a `handoff/vr/` folder.
  VR-STATUS's "when `handoff/vr/` appears, re-plan" means these files.
- **Build loop:** once MERGEABLE shows the complete pilot stack qualified, merging it comes first in Next. After the deploy is green:
  - notify Carter in plain words, with phone/headset steps: open the live museum in the headset's browser, then tap "Enter VR";
  - put his headset check in Needs Carter.

Recorded without either lock (the build loop and the VR loop each hold their own). Only this file was added.
Each loop folds it into its own STATUS.
