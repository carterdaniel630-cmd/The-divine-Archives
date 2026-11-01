# ORDER — Divine Casualties: upgrade the LIVE game in place (Carter approved 2026-10-31 23:48 ET, via atlas)

Carter's ruling: improve the game we HAVE — mechanically and visually — in place. NO new game, NO replacement prototype. The characters' look stays THE SAME. What rises: movement, hit weight, weapon-craft, ceremony. Source: full plan read from main's actual code by atlas (UPGRADE-PLAN-live-game.md, atlas workspace). Everything below names real files in this repo.

## What the game actually is (verified from main)
- Code: docs/assets/games/fighter.js (183.5 KB) + fighter-moves.js (30.8 KB); roster Zeus/Poseidon/Athena/Hades (+ Shade of the Styx skin in code); 1P-vs-AI and local 2P; one stage (temple colonnade) with 4 weathers; NO rounds, NO timer (one bout to KO).
- Fighters are painted body-part cut-outs (10-13 WebP parts per god) skinned onto a 15-joint skeleton (skin() in drawCutout). Moves are poseKeys lists in fighter-moves.js — only 3-6 keys per move (aerials 3; richest = Athena super, 15) — blended by per-joint damped springs (springPose). CARTER'S EYE CALLS THIS THE PUPPET: rigid parts on pivots, joints arriving one by one on their own springs. The upgrade kills that read.
- Hits: single path applyDamage() in fighter.js. Hitstop EXISTS but timid (lights 0.05-0.09s, heavies 0.10-0.16s, super/FINISH 0.25s); shake/flash exist. THE FIGHTER HAS NO SOUND: feel.js (window.ArchiveFeel, synthesized hit sounds) is loaded on the page and never called by fighter.js.
- Weapons: Athena's spear+shield are real parts; Hades's bident is baked into his forearm part; the procedural weapon drawings for Zeus's bolt / Poseidon's trident are BYPASSED in cut-out mode (drawCutout returns before they run) — unverified whether their forearm part images contain the weapons (atlas read code, not pixels; check the images first in step 4).

## The 12 steps — in order, each its own PR, each verified before the next
Verification tools already in the repo: tools/ci-play-fighter.js (frame data + headless play), tools/verify-fighters.js (facts vs ch08), window.__FIGHT_TEST__ hooks (__frameProbe, __rig for spring overshoot).

1. SOUND — call ArchiveFeel from applyDamage() (heavy=clash/big, light=thunk, block=place, KO=lose). Zero new assets.
2. HITSTOP/SHAKE RETUNE — heavies/headbutt ~0.15-0.18s in fighter-moves.js onHit values; add a 2-3 tick slow-motion tail after the freeze on heavies (a slowMo countdown in stepSim beside hitStop).
3. BUTTON VERBS — Punch -> Strike, Kick -> Heavy in bindPads caps + select-screen controls text. Strings only.
4. WEAPONS IN HAND — draw Zeus's bolt + Poseidon's trident in drawCutout, following the existing Athena spear code (grip point + hold angle from the front-hand joint). FIRST look at their forearm part images (see unverified note above).
5. STRIKE SPRINGS — state-dependent settings in springPose: stiff, near-critically-damped during attack/hit states; loose in idle/walk. Verify via __rig overshoot before/after.
6. MORE POSE KEYS — re-author normals + specials in fighter-moves.js from 3-6 keys to 8-10 (anticipation / contact / overshoot shapes). FRAME DATA MUST NOT MOVE (ci-play-fighter checks timing, not keys).
7. ARC-SMEARS — weapon-path smear during active ticks, drawn in drawCutout from the hitbox joint's recent positions, FX style of burst().
8. KEYED FLINCHES — victim reaction strength by hit kind in poseFor (light=head snap, heavy=torso fold + stagger, launcher=existing knockdown).
9. THE WEAVE — new state cloned from startDash (i-frames) + Hades's Shade-step fade: depth scale + y-offset in drawCutout, intangibility via the existing other.intang check in applyDamage, shadow stays at true position. Input: dash+guard or double-tap guard. AI uses it occasionally (think() reaction table).
10. CEREMONY — extend the vsSplash/startFight flow: fighters start at stage edges, walk to marks (existing walk cycle), drawBanner/callout names each god + epithet (data/fighters.json), one weapon-raise idle-variant pose per god, then fight. Skippable by any button.
11. STAGE DEPTH — parallax colonnade + nearer floor band + brazier light pools in drawStage (code-drawn, near-zero weight). Cinematic Floor applies: mood light, shadows lifted.
12. TIER-B POSE FRAMES (LAST, the big one) — art-source/fighter/SPRITE-ART-SPEC.md already specifies 7 full-body painted poses per god (320x512, shared feet pivot); placeholder PNGs for all 28 sit in art-source/fighter/sprites/; the sprite renderer was retired 2026-09-27. Reinstate a sprite branch in drawFighter cross-fading poses keyed to the EXISTING state machine + tick timing, as the HIGH capability tier only; the cut-out rig remains the phone/weak tier and the fallback (never a black screen). Pose SETS THEMSELVES need Carter's per-god desk verdict on the art before they ship — build the branch, hold the art at his gate.

Steps 1-3 change how the game feels more than anything else here and are small. Steps 4-8 kill the puppet. 9-11 give space + ceremony. 12 is the ceiling-raise and deliberately last.

## Queue placement + gates
- Queued AFTER the standing night order's committed items (six share images -> takeover batch -> armory batch 1) and after reconciling #95 + the lock from the capped 23:42 run. This order does not jump that queue; take the steps in order as the games lane opens.
- Per-item merge gates unchanged: every step's PR comes to Carter as usual. Step 12's art additionally needs his per-god verdict.
- Characters' LOOK does not change at any step. If a step seems to require a look change, stop and surface it — do not improvise one.
