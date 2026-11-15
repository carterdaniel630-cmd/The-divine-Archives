# The VR loop — groundwork first (Carter 2026-11-15)

Carter, live, 2026-11-15 ~22:15 UTC: "Start the VR loop", then, asked how, **"Start now from what's here"**:
the loop begins with groundwork that does not depend on the VR spec set, and takes in the full specs when atlas
stages them (`decisions-2026-11-15-carter-start-vr-loop.md`). His build yes for the pilot is
`order-2026-11-01-vr-pilot-queued.md`; his answers to the open questions are `decisions-2026-11-01-vr-questions.md`.

Every run of the scheduled task **Divine Archives — VR loop** follows this file. Each run is a fresh session; the
repo is the memory. It runs beside the build loop (`LOOP.md`), never instead of it.

## One run
1. Attach and clone `carterdaniel630-cmd/the-divine-archives` (push access), branch `staging/ready-line`. Read
   `CLAUDE.md`, `LOOP.md` (its Never list and Merging rules bind this loop too), then this file.
2. **Halt:** `handoff/HALT` or `handoff/VR-HALT` exists → stop, no writes.
3. **Lock:** this loop's own lock is `handoff/loop/VR-LOCK` (the build loop's `LOCK` is separate; neither blocks the
   other). Under 90 minutes old → stop. Older → stale, overwrite. Write it, commit, push. Never hold it while waiting.
4. **Read:** `handoff/replies/VR-STATUS.md` (Next), every `decisions-*` and `order-*` file mentioning VR, and
   `handoff/vr/` (atlas's spec set, once staged). Newest Carter ruling wins. Skip any `handoff/loop/CLAIM-*` item.
5. **Do ONE bounded piece** (about one PR) from the list below, in order, on a `loop/vr-<name>` branch from
   `origin/main`, and open its PR (Carter's "a", `decisions-2026-11-15-carter-a-prs-yes-wikipedia.md` 1).
   Run `graphify update .` first; work from the code map, not memory.
6. **Verify** to `CLAUDE.md` "Quality bar" (full build order, every `tools/verify-*.js`, the framework tests,
   `review-checks.js --base origin/main --build`) plus: the flat museum is unchanged with no headset (headless
   360/390 px, 0 script errors, `tools/museum-baseline.js` inside budget), and the VR entry stays hidden where WebXR
   is missing. Never push red.
7. **Write back:** a dated reply in `handoff/replies/vr/`, overwrite `handoff/replies/VR-STATUS.md` (done / in
   progress / next / needs Carter), add finished PRs to `handoff/replies/MERGEABLE.md` under "Waiting to qualify"
   marked **VR, per item**. Remove `VR-LOCK`; commit; push `staging/ready-line`.
8. **Review:** a VR loop run may do the independent review of a VR PR it wrote none of (LOOP.md Merging 1), filed
   on `review-log` as LOOP.md step 7 says.

## Groundwork, in order (needs no spec set)
Scope is the pilot only: **Rotunda, ch02 Egypt, ch03 Mesopotamia**. One build for flat screen and headset.
- **G1 Entry:** an "Enter VR" control in the museum shown only when `navigator.xr.isSessionSupported('immersive-vr')`
  is true; three.js's own XR support (already vendored), no new library; leaving VR returns to the same spot.
  Flat screen and phones exactly as today.
- **G2 Comfort:** teleport movement, snap turn (with smooth turn as an option), comfort vignette, seated/standing
  height. Defaults are the comfortable ones.
- **G3 Budget:** a headset frame budget harness beside `tools/museum-baseline.js` (Quest 2 is the floor device:
  72 fps; draw calls and triangles per view measured for the three pilot rooms), with a report. Measure, don't guess.
- **G4 Curtain (OQ-4):** a room or element pending review is behind a true curtain in VR (contents not displayed)
  until its walkthrough. The flat site's pending banners are unchanged.
- **G5 Pilot rooms in VR:** make the three pilot rooms walkable in the headset with G1–G4, nothing new in them.

## When the spec set lands (`handoff/vr/`)
Re-plan VR-STATUS → Next from it; spec wording beats this list where they differ, and say so in the reply.

## Stop and surface (never decide loop-side)
- Anything that needs the spec set before it is staged (interaction design, audio, artistry, benchmark targets).
- DG-6 radiance tiers (deferred by Carter); the WebGPU tier (after the all-rooms waves, DG-W1).
- The Keeper's Table: only the performative copy, and only if the spec reaches it. The Study is never built.
- Anything religiously sensitive or touching a sacred object or restricted site.

## Never
- Merge, or push to `main`. Every VR piece is a new build: per item, Carter's yes for that item, via LOOP.md Merging.
- Everything in LOOP.md "Never". Never open any file named `KEY.md`. Never write model names in files or commits.
- Build anything beyond the pilot rooms, or anything parked.
