/* ==========================================================================
   THE DIVINE ARCHIVES — Theomachy move data (F2: data-driven move system)

   One record per move. The move-runner in fighter.js reads these to drive
   BOTH combat (timeline, joint-tied hitbox, hitstop, knockback, cancels,
   root-motion lunge) AND animation (poseKeys interpolated over the skeleton),
   so the two can never drift apart. Timeline is in ticks at the fixed 60 Hz
   logic step (see F1). This first pass migrates the shared ground normals;
   per-god movesets (F3) will extend the table with distinct kits.

     startup   : ticks before the hitbox goes live
     active    : [firstTick, lastTick] the hitbox is live
     recovery  : ticks after `active` before the move ends
     total     : whole move length in ticks (active[1] + recovery)
     hitbox    : { joint, ox, oy, r } — anchored to a skeleton joint, so the
                 hit tracks the drawn limb (reach = joint.x + ox + r)
     onHit     : { damage, hitstop(s), knockback:{x,y} px/tick }
     lunge     : forward px added to the body at contact (root motion — the
                 "step into the strike" the audit found missing)
     cancelInto/cancelWindow : which moves may interrupt recovery, and when
     poseKeys  : [{ at(0..1), d:{ joint:[dx,dy], ... } }] additive offsets over
                 BASE, interpolated with easing → the animation
   ========================================================================== */
(function () {
  "use strict";
  window.FIGHTER_MOVES = {

    light: {
      id: "light", kind: "light",
      startup: 4, active: [4, 6], recovery: 10, total: 16,
      hitbox: { joint: "hnF", ox: 6, oy: 0, r: 14 },
      onHit: { damage: 6, hitstop: 0.06, knockback: { x: 2, y: 0 } },
      lunge: 6,
      cancelInto: ["kick", "headbutt"], cancelWindow: [3, 15],
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.18, d: { hnF: [-17, -2], elF: [-11, 0], chest: [-3, 0], hnB: [4, 0] } },
        { at: 0.30, d: { hnF: [34, 4], elF: [23, 1], chest: [6, 0], head: [5, 0], hip: [3, 0], shF: [4, 0], footF: [9, 0], hnB: [-9, 0] } },
        { at: 0.55, d: { hnF: [10, 2], elF: [7, 0], chest: [2, 0] } },
        { at: 1.00, d: {} }
      ]
    },

    kick: {
      id: "kick", kind: "heavy",
      startup: 12, active: [12, 15], recovery: 13, total: 28,
      hitbox: { joint: "footF", ox: 4, oy: 0, r: 16 },
      onHit: { damage: 13, hitstop: 0.12, knockback: { x: 4.2, y: 0 } },
      lunge: 10,
      cancelInto: [], cancelWindow: [0, 0],
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.22, d: { footF: [-8, 0], kneeF: [-6, 0], hnB: [6, 0] } },
        { at: 0.48, d: { footF: [48, -72], kneeF: [31, -47], chest: [-6, 2], head: [-4, 0], hip: [-4, 4], hnB: [-14, -6], hnF: [-6, 4], shB: [-3, 0] } },
        { at: 0.70, d: { footF: [20, -30], kneeF: [14, -20] } },
        { at: 1.00, d: {} }
      ]
    },

    headbutt: {
      id: "headbutt", kind: "heavy",
      startup: 6, active: [6, 8], recovery: 12, total: 20,
      hitbox: { joint: "head", ox: 6, oy: 0, r: 12 },
      onHit: { damage: 16, hitstop: 0.12, knockback: { x: 4.2, y: 0 } },
      lunge: 16,
      cancelInto: [], cancelWindow: [0, 0],
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.20, d: { head: [-10, 0], neck: [-6, 0], chest: [-6, 0], hip: [-3, 0] } },
        { at: 0.35, d: { head: [27, 8], neck: [18, 5], chest: [16, 4], hip: [8, 0], shF: [8, 0], shB: [6, 0], hnF: [4, 6], footF: [12, 0] } },
        { at: 0.60, d: { head: [10, 3], chest: [6, 2] } },
        { at: 1.00, d: {} }
      ]
    }

  };
})();
