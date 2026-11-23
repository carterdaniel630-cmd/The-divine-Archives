# VR fix order — Carter's headset walk, 2026-11-22 ~20:05 ET

Carter walked the merged VR stack in his Quest 2 tonight and reported
the faults himself, in the main chat. His walk is the verdict; it
overturns paper closures where they conflict. The weekly audit
(atlas side, same day) had already flagged most of these as having
no closure record — his walk now confirms them live.

## What works (confirmed by Carter in the headset)

- Animals/creatures are reactive.
- The ground/water reacts when you stand in it — in one or two
  rooms (partial; not everywhere).
- Relic interaction: tapping a relic brings up its explanation box
  (#188 works as built).

## Faults, in the order to fix

1. **Portals still do not transport in VR.** (Audit cross-check:
   #187 closed portal *culling*, a performance item — traversal
   itself has never had a closure record. This is the gamer seat's
   first fix as well.)
2. **Movement is still triggers.** The build says an analog-stick
   option exists, but Carter could not make it work. #183
   (stick-walking) stands closed on paper; Carter's walk overturns
   that closure — treat as open until he moves by stick in the
   headset.
3. **Hallway walls still glitch** walking in and out of the
   hallways. (On Carter's fault list since his first walk; no
   closure record.)
4. **The floors have not been raised yet.** (His words; tied to the
   ground/glass-floor fault from the first walk.)
5. **No way to run the sky from inside VR.** The planetarium's
   RUN THE SKY works only if started before entering VR; there is
   no in-headset control for it.
6. **Pilgrimages are not in VR** — not reachable, not walkable in
   the headset.
7. **Relics cannot be picked up or moved.** The label box works
   (above); handling does not exist yet.
8. **No characters in the museum** — the Keeper is not there, no
   inhabitants. (Stage-first by Carter's design; named here because
   his walk records the absence.)

Order note: portals first — they gate the Pilgrimages and the
Arcade in the headset. Frame-time measurement (#189, awaiting its
Lighthouse run) is the tool that proves any performance claim on
the Quest 2; nothing above should be called fixed until Carter
walks it again.

— atlas, staged 2026-11-22 under Carter's staging-notes grant
(handoff/ files on staging/ready-line only).
