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
      // jabs chain into another jab (a rekka string), into the heavies, or into the
      // blast as a finisher — so a basic bread-and-butter combo is easy to find.
      cancelInto: ["light", "kick", "headbutt", "special"], cancelWindow: [3, 15],
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
      cancelInto: ["special"], cancelWindow: [12, 26],   // kick -> blast combo ender
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
      cancelInto: ["special"], cancelWindow: [6, 18],   // headbutt -> blast ender
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.20, d: { head: [-10, 0], neck: [-6, 0], chest: [-6, 0], hip: [-3, 0] } },
        { at: 0.35, d: { head: [27, 8], neck: [18, 5], chest: [16, 4], hip: [8, 0], shF: [8, 0], shB: [6, 0], hnF: [4, 6], footF: [12, 0] } },
        { at: 0.60, d: { head: [10, 3], chest: [6, 2] } },
        { at: 1.00, d: {} }
      ]
    },

    /* ---- F3.1: special / throw / aerial migrated into the same data model.
       These spawn a projectile or a thrown relic rather than a melee hitbox,
       so combat logic (energy cost, finisher, projectile) stays in fighter.js;
       the DATA supplies the timeline (ticks), cast frame, cooldown and pose. ---- */
    special: {
      id: "special", kind: "special",
      total: 54, cast: 23, cooldownTicks: 60,   // charge, then release the blast at `cast`
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.45, d: { hnF: [2, -54], elF: [0, -40], shF: [0, -10], hnB: [-8, -34], elB: [-5, -24], head: [0, -4], chest: [0, -3] } },
        { at: 0.85, d: { hnF: [2, -54], elF: [0, -40], shF: [0, -10], hnB: [-8, -34], elB: [-5, -24], head: [0, -4], chest: [0, -3] } },
        { at: 1.00, d: {} }
      ]
    },

    throw: {
      id: "throw", kind: "throw",
      total: 18, cooldownTicks: 24,             // the relic is released as the arm comes over
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.25, d: { hnF: [-11, 9], elF: [-7, 7] } },
        { at: 0.45, d: { hnF: [22, -18], elF: [15, -14], shF: [4, -6], chest: [8, 0], head: [6, 0] } },
        { at: 1.00, d: {} }
      ]
    },

    aerialPunch: {
      id: "aerialPunch", kind: "aerial",
      total: 25, cooldownTicks: 24, hitAt: 0.22, driveVx: 2.6,
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.45, d: { hnF: [36, -6], elF: [24, -3], footF: [10, 16], kneeF: [6, 10], footB: [-14, -22], kneeB: [-8, -14], hnB: [-18, -6], chest: [5, 0], head: [4, 0] } },
        { at: 1.00, d: { hnF: [36, -6], elF: [24, -3], footF: [10, 16], kneeF: [6, 10], footB: [-14, -22], kneeB: [-8, -14], hnB: [-18, -6], chest: [5, 0], head: [4, 0] } }
      ]
    },

    aerialDive: {
      id: "aerialDive", kind: "aerial",
      total: 30, cooldownTicks: 30, hitAt: 0.22, driveVx: 3.6, driveVy: -6,
      poseKeys: [
        { at: 0.00, d: {} },
        { at: 0.45, d: { footF: [46, 30], kneeF: [26, 12], footB: [-20, -26], kneeB: [-12, -18], hnF: [10, -16], hnB: [-24, -14], chest: [6, 3], head: [5, 1], hip: [3, 2] } },
        { at: 1.00, d: { footF: [46, 30], kneeF: [26, 12], footB: [-20, -26], kneeB: [-12, -18], hnF: [10, -16], hnB: [-24, -14], chest: [6, 3], head: [5, 1], hip: [3, 2] } }
      ]
    }

  };

  /* ==========================================================================
     F3.2 — per-god movesets (the four Greek gods are the proof set). Each god
     is the shared base move with its own overrides merged on top, plus
     locomotion stats and a factRef grounded in ch08 (checked by
     tools/verify-fighters.js). Cross-tradition gods can be added later as
     pure data entries here — no engine change.
     ========================================================================== */
  window.FIGHTER_CHARACTERS = {

    // Zeus — the balanced baseline zoner. Average speed, weight, and damage;
    // stats declared explicitly so the kit is self-describing.
    zeus: {
      id: "zeus",
      walkSpeed: 3.1, jumpVel: 12.5, weight: 1.0,
      factRef: { chapter: "ch08", basis: "Zeus became king of a new order" },
      // the keraunos — the thunderbolt forged by the Cyclopes: a fast, jagged bolt.
      special: { kind: "bolt", name: "KERAUNOS", col: "#eaf6ff", col2: "#7fb8ff", r: 12, speed: 7.6 },
      moves: {
        light: { onHit: { damage: 6 } },
        kick: { onHit: { damage: 13, knockback: { x: 4.2 } } },
        headbutt: { onHit: { damage: 16 } }
      }
    },

    // Poseidon — the long-reach spacer. Slower and heavier than Zeus, but his
    // trident sweep has the longest reach and the biggest pushback in the set.
    poseidon: {
      id: "poseidon",
      walkSpeed: 2.6, jumpVel: 11.5, weight: 1.2,
      factRef: { chapter: "ch08", basis: "po-se-da-o" },
      // the earth-shaker's surge — a rolling tidal wave, big and slow with heavy push.
      special: { kind: "wave", name: "SEISMOS", col: "#5fe0d6", col2: "#2b7fb0", r: 17, speed: 5.4 },
      moves: {
        light: { onHit: { damage: 7 } },                                  // trident poke
        kick: { hitbox: { joint: "footF", ox: 8, r: 22 }, onHit: { damage: 12, knockback: { x: 6.5 } } }, // long, wall-carrying sweep
        headbutt: { onHit: { damage: 15 } }
      }
    },

    // Athena — the technical fighter. Fastest on her feet and quickest to
    // recover; her spear jab is short and snappy but hits for less.
    athena: {
      id: "athena",
      walkSpeed: 3.6, jumpVel: 13.0, weight: 0.9,
      factRef: { chapter: "ch08", basis: "owl, aegis, and olive" },
      // her sacred owl (glaux) loosed as a bolt of gold — swift, precise, mid-weight.
      special: { kind: "owl", name: "GLAUX", col: "#ffe08a", col2: "#c79a54", r: 13, speed: 6.9 },
      moves: {
        light: { active: [3, 5], total: 13, cancelWindow: [2, 11], onHit: { damage: 5 } }, // fast jab, quick recovery
        kick: { onHit: { damage: 12 } },
        headbutt: { onHit: { damage: 14 } }
      }
    },

    // Hades — the bruiser. Slow and heavy, but hits hardest with the most
    // hitstop, and keeps his foe close (low knockback) to keep the pressure on.
    hades: {
      id: "hades",
      walkSpeed: 2.8, jumpVel: 12.0, weight: 1.15,
      factRef: { chapter: "ch08", basis: "realm of Hades" },
      // a loosed shade from the underworld — a slow, heavy soul-wraith wreathed in gloom.
      special: { kind: "soul", name: "PSYCHE", col: "#b483ff", col2: "#4a2d7a", r: 15, speed: 5.6 },
      moves: {
        light: { onHit: { damage: 8, hitstop: 0.09 } },
        kick: { onHit: { damage: 15, hitstop: 0.16, knockback: { x: 3.0 } } }, // hard, low pushback = stays in range
        headbutt: { onHit: { damage: 20, hitstop: 0.16 } }
      }
    }

  };
})();
