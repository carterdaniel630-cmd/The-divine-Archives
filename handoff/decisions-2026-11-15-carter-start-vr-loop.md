# Carter's ruling — 2026-11-15 ~22:15 UTC: start the VR loop now

Given live in loop session ..01HFWzTnd3Wp3zC6oKDbU1aS.

1. Carter: **"Start the VR loop when that's done."** (after the #145/#143 merges).
2. Asked: the VR pilot's spec set is held atlas-side, not in the repo. Options: (a) atlas stages the specs first,
   then the loop starts / (b) start now with groundwork that does not depend on the specs, take the specs in when
   they land / (c) not yet. Carter: **"Start now from what's here"** = (b).

## What this changes
- The VR pilot (`order-2026-11-01-vr-pilot-queued.md`) no longer waits behind the Keeper production build. It runs
  as its own loop beside the build loop: procedure `handoff/VR-LOOP.md`, status `handoff/replies/VR-STATUS.md`.
- "VR" comes off STATUS → Parked for the pilot scope (Rotunda, ch02 Egypt, ch03 Mesopotamia). Later VR phases
  (all-rooms waves, Pilgrimage in VR, WebGPU tier) are not started by this.
- Atlas is asked to stage the spec set into `handoff/vr/` (`request-2026-11-15-atlas-vr-specs.md`).

## What this does not change
- Merging: every VR piece is a new build, merged only on Carter's per-item yes (LOOP.md Merging).
- His Nov 1 answers stand (OQ-1 performative copy of the Keeper's desk only; OQ-3 yes; OQ-4 curtained; DG-W1
  WebGPU after the waves; DG-6 deferred).
