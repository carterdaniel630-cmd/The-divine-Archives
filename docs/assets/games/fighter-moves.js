/* ==========================================================================
   THE DIVINE ARCHIVES — Divine Casualties move data (F2: data-driven move system)

   One record per move. The move-runner in fighter.js reads these to drive
   BOTH combat (timeline, joint-tied hitbox, hitstop, knockback, cancels,
   root-motion lunge) AND animation (poseKeys interpolated over the skeleton),
   so the two can never drift apart. Timeline is in ticks at the fixed 60 Hz
   logic step (see F1). These are the shared base moves; each god's own kit
   (FIGHTER_CHARACTERS below, games-modern §2) is merged on top of them.

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
     F3.2 / games-modern §2 — the four Greek gods, each with a distinct moveset.

     Every god is the shared base move with its own overrides merged on top
     (deep-merged for onHit / hitbox / knockback), plus locomotion stats, an
     idle/walk style and a factRef grounded in ch08 (checked by
     tools/verify-fighters.js). The frame data is the table in
     plans/games-modern.md §2.2, in ticks at 60 Hz; tools/ci-play-fighter.js
     holds its own copy of that table and fails if the two drift apart.

     Move ids per god:
       light, kick (far heavy), headbutt (close heavy), aerialPunch (air light),
       aerialDive (air heavy), special (neutral special: a projectile, 40 meter),
       fspecial (toward + special, 0 meter), bspecial (away + special, 0 meter),
       super (special at 100 meter), grab (the throw).

     Extra fields used by the new moves:
       name, input   : shown in callouts and the move list
       block         : frame advantage on block; the engine sets the blockstun
                       to block + (total - startup) ticks, so the table's
                       number is what a blocked hit really leaves
       kind          : what the engine does on the live ticks —
                       projectile | rush | column | quake | step | parry |
                       cmdgrab | fade | grab | skybolts | tide | flurry | darkness
       cast          : the tick a projectile (or a super's effect) is released
       travel/travelTicks : px moved (+ toward the foe, − away) over those ticks
       armor, invuln : tick windows (Riptide's armour; Shade step's fade)
       basis         : { chapter, text } — words that appear verbatim in that
                       chapter's text, the grounding for every special and super
     ========================================================================== */

  // poses are additive joint offsets over the base stance (x toward the foe, y up = negative)
  var Z_WIND = { hnF: [-60, -101], elF: [-31, -53], hnB: [51, -35], elB: [19, -11], chest: [-5, 0], neck: [-6, 0], head: [-7, -2], hip: [-3, 0], footF: [6, 0] };
  var Z_RELEASE = { hnF: [24, -54], elF: [14, -23], hnB: [-4, -15], chest: [8, 0], neck: [9, 0], head: [10, 0], hip: [4, 0], footB: [-4, 0] };
  var Z_WINGS = { hnF: [-70, -74], elF: [-40, -44], hnB: [-30, -68], elB: [-14, -40], chest: [12, 4], neck: [16, 6], head: [20, 8], hip: [4, 0], footB: [-24, -30], kneeB: [-16, -20], footF: [-4, -12], kneeF: [2, -10] };
  var Z_STOOP = { hnF: [20, -20], elF: [8, -30], hnB: [50, -20], elB: [30, -20], chest: [14, 6], neck: [18, 8], head: [22, 10], footB: [-26, -28], kneeB: [-16, -20], footF: [-6, -10] };
  var Z_SKYARM = { hnF: [6, -104], elF: [4, -58], shF: [2, -6], chest: [2, -4], neck: [2, -5], head: [0, -6], hnB: [10, -10], footF: [4, 0] };
  var Z_CALL = { hnF: [-28, -104], elF: [-20, -58], hnB: [26, -100], elB: [12, -58], chest: [-2, -4], neck: [-3, -5], head: [-4, -8], hip: [0, -2] };
  var CROUCH = { hip: [0, 10], chest: [0, 10], neck: [0, 10], head: [0, 10] };
  var LIFT = { hnF: [-24, -100], elF: [-16, -52], hnB: [10, -96], elB: [8, -50], chest: [-6, -2], head: [-6, -2], hip: [-2, 0] };
  var REACH = { hnF: [18, -12], elF: [10, -6], hnB: [66, -20], elB: [36, -10], chest: [6, 0], head: [6, 0] };

  var P_RAISE = { hnF: [-22, -96], elF: [-14, -50], hnB: [44, -90], elB: [24, -48], chest: [-4, -2], head: [-4, -2] };
  var P_SLAM = { hnF: [26, 44], elF: [14, 26], hnB: [64, 40], elB: [34, 24], chest: [10, 12], neck: [12, 14], head: [14, 16], hip: [2, 10], kneeF: [6, 4], kneeB: [-4, 4] };
  var P_CHARGE = { hnF: [40, -18], elF: [22, -10], hnB: [56, -26], elB: [30, -12], chest: [14, 8], neck: [18, 10], head: [20, 12], hip: [6, 6], footB: [-18, 0], kneeF: [10, 4] };
  var P_FOOT = { footF: [4, -48], kneeF: [12, -36], hnF: [-6, -26], hnB: [40, -30], chest: [-4, -2], head: [-4, -2], hip: [-2, -2] };
  var P_STAMP = { footF: [6, 0], kneeF: [8, 4], hip: [0, 10], chest: [4, 10], neck: [4, 10], head: [4, 10], hnF: [6, 10], hnB: [20, 10] };
  var P_LOW = { hnF: [-12, 54], elF: [-6, 30], hnB: [36, 50], elB: [20, 28], hip: [0, 10], chest: [2, 12], head: [2, 12] };
  var P_HIGH = { hnF: [-30, -106], elF: [-18, -56], hnB: [8, -104], elB: [4, -56], chest: [-2, -4], neck: [-2, -5], head: [-3, -8] };

  var A_DRAW = { hnF: [-30, -30], elF: [-14, -6], chest: [-3, 0], head: [-2, 0] };
  var A_LOOSE = { hnF: [24, -60], elF: [14, -34], chest: [6, -2], head: [6, -2], hnB: [10, -6] };
  var A_STEP = { hip: [10, 6], chest: [14, 6], neck: [14, 6], head: [14, 6], hnB: [64, -38], elB: [36, -18], footF: [14, -6], kneeF: [12, -4], hnF: [-6, -20] };
  var A_SHIELD = { hnB: [78, -60], elB: [44, -34], shB: [6, 0], chest: [-3, 0], head: [-5, 0], hnF: [-14, -20], hip: [-2, 0] };
  var A_BASH = { hnB: [82, -56], elB: [46, -32], chest: [8, 0], head: [6, 0] };
  var A_THRUST = { hnF: [42, -26], elF: [24, -12], chest: [8, 0], head: [6, 0] };
  var A_BACK = { hnF: [-12, -18], elF: [-8, -4] };
  var A_OLIVE = { hnB: [30, -104], elB: [16, -56], hnF: [-6, 10], chest: [0, -3], head: [0, -4] };

  var H_CLOAK = { hnF: [-70, -10], elF: [-40, -6], chest: [-6, 0], head: [-6, 0], hnB: [-10, -10] };
  var H_SWEEP = { hnF: [30, -14], elF: [18, -8], chest: [8, 2], head: [8, 2], hnB: [20, -10] };
  var H_DOWN = { hnF: [34, 66], elF: [20, 40], hnB: [10, 40], chest: [16, 18], neck: [20, 22], head: [22, 24], hip: [2, 12], kneeF: [8, 6], kneeB: [-2, 6] };
  var H_FADE = { hnF: [-30, -40], elF: [-16, -20], hnB: [-30, -30], chest: [-8, 0], neck: [-10, 0], head: [-12, 0], hip: [-4, 0], footF: [-8, 0] };
  var H_SPREAD = { hnF: [30, 30], elF: [16, 10], hnB: [-30, 30], elB: [-16, 10], chest: [0, -4], head: [0, -6] };

  // a held relic is thrown with the shared "throw" move; the god's own grab is "grab"
  function grabPose(lift, finish) {
    return [{ at: 0.00, d: {} }, { at: 0.19, d: REACH }, { at: 0.45, d: lift }, { at: 0.66, d: finish }, { at: 1.00, d: {} }];
  }

  window.FIGHTER_CHARACTERS = {

    // ---------------------------------------------------------------- Zeus
    // The king (all-rounder, zoner). ch08: king of a new order after the Titans;
    // thunderbolt and eagle; the sky.
    zeus: {
      id: "zeus",
      walkSpeed: 3.1, jumpVel: 12.5, weight: 1.0,
      style: { idle: "regal", victory: "throne" },
      factRef: { chapter: "ch08", basis: "Zeus became king of a new order" },
      // the keraunos — the thunderbolt: a fast, jagged bolt.
      special: { kind: "bolt", name: "KERAUNOS", col: "#eaf6ff", col2: "#7fb8ff", r: 12, speed: 7.6 },
      moves: {
        light: { name: "Sceptre jab", startup: 4, active: [4, 6], recovery: 10, total: 16, block: 1, chainMax: 2, onHit: { damage: 6, hitstop: 0.06, knockback: { x: 2 } } },
        kick: { name: "Storm kick", startup: 12, active: [12, 15], recovery: 13, total: 28, block: -3, onHit: { damage: 13, hitstop: 0.12, knockback: { x: 4.2 } } },
        headbutt: { name: "King's brow", startup: 6, active: [6, 8], recovery: 12, total: 20, block: -2, onHit: { damage: 16, hitstop: 0.12, knockback: { x: 4.2 } } },
        aerialPunch: { name: "Eagle stoop", startup: 6, active: [6, 12], recovery: 13, total: 25, cooldownTicks: 25, onHit: { damage: 9, hitstop: 0.07, knockback: { x: 2.5 } } },
        aerialDive: { name: "Falling sky", startup: 9, active: [9, 20], recovery: 16, total: 36, cooldownTicks: 36, block: -6, onHit: { damage: 12, hitstop: 0.10, knockback: { x: 3.5 } } },
        special: {
          name: "Keraunos", input: "special", kind: "projectile", startup: 23, cast: 23, active: [23, 23], recovery: 31, total: 54, cooldownTicks: 54, block: -8,
          onHit: { damage: 20, hitstop: 0.10, knockback: { x: 3.0 } },
          basis: { chapter: "ch08", text: "thunderbolt and eagle" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.30, d: Z_WIND }, { at: 0.42, d: Z_RELEASE }, { at: 0.62, d: { hnF: [16, -30], elF: [10, -14], chest: [4, 0], head: [5, 0] } }, { at: 1.00, d: {} }]
        },
        fspecial: {
          name: "Eagle's dive", input: "toward + special", kind: "rush", startup: 14, active: [14, 22], recovery: 18, total: 40, block: -10, meter: 0,
          travel: 220, travelTicks: [6, 22], hop: 5.5, hitbox: { ox: 26, r: 34, h: 150 },
          onHit: { damage: 11, hitstop: 0.10, knockback: { x: 5.0 } },
          basis: { chapter: "ch08", text: "thunderbolt and eagle" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.12, d: { hip: [0, 10], chest: [2, 10], neck: [2, 10], head: [2, 10], kneeF: [4, 6], kneeB: [-2, 6], hnF: [-20, 8], hnB: [-6, 10] } }, { at: 0.30, d: Z_WINGS }, { at: 0.50, d: Z_STOOP }, { at: 0.62, d: Z_STOOP }, { at: 1.00, d: {} }]
        },
        bspecial: {
          name: "Sky-split", input: "away + special", kind: "column", startup: 9, active: [9, 15], recovery: 20, total: 35, block: -12, meter: 0,
          column: { x0: 34, x1: 104, h: 230 },
          onHit: { damage: 12, hitstop: 0.12, knockback: { x: 1.2, y: 9.5 } },
          basis: { chapter: "ch08", text: "zeus (sky, king)" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.14, d: { hnF: [-20, 0], elF: [-10, 0], hip: [0, 6], chest: [0, 6], head: [0, 6] } }, { at: 0.26, d: Z_SKYARM }, { at: 0.45, d: Z_SKYARM }, { at: 1.00, d: {} }]
        },
        super: {
          name: "Titanomachy", input: "special at 100 meter", kind: "skybolts", startup: 30, cast: 30, active: [30, 60], recovery: 24, total: 84, meter: 100,
          strikes: [30, 45, 60], damages: [17, 17, 16], strikeR: 30,
          onHit: { damage: 50, hitstop: 0.25, knockback: { x: 4.0 } },
          basis: { chapter: "ch08", text: "titanomachy" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.20, d: { hip: [0, 10], chest: [0, 10], neck: [0, 10], head: [0, 10], hnF: [-26, 6], hnB: [20, 6] } }, { at: 0.36, d: Z_CALL }, { at: 0.71, d: Z_CALL }, { at: 1.00, d: {} }]
        },
        grab: {
          name: "Throw", input: "grab", kind: "grab", startup: 5, active: [5, 6], recovery: 20, total: 26,
          onHit: { damage: 14, hitstop: 0.12, knockback: { x: 6.0 } },
          poseKeys: grabPose(LIFT, { hnF: [30, -40], hnB: [60, -40], chest: [10, 0], head: [10, 2] })
        }
      }
    },

    // ------------------------------------------------------------ Poseidon
    // The sea and the earthquake (long-range spacer, heavy). ch08: sea and
    // earthquakes; the trident; po-se-da-o in Linear B.
    poseidon: {
      id: "poseidon",
      walkSpeed: 2.6, jumpVel: 11.5, weight: 1.2,
      style: { idle: "twirl", walk: "planted", victory: "raise" },
      factRef: { chapter: "ch08", basis: "po-se-da-o" },
      // the earth-shaker's surge — a wave that rolls along the floor.
      special: { kind: "wave", name: "SEISMOS", col: "#5fe0d6", col2: "#2b7fb0", r: 17, speed: 5.4 },
      moves: {
        light: { name: "Trident poke", startup: 6, active: [6, 8], recovery: 12, total: 20, block: -1, cancelWindow: [5, 19], hitbox: { ox: 14, r: 16 }, onHit: { damage: 7, hitstop: 0.07, knockback: { x: 2.5 } } },
        kick: { name: "Trident sweep", startup: 14, active: [14, 18], recovery: 14, total: 32, block: -4, cancelWindow: [14, 30], hitbox: { joint: "footF", ox: 8, r: 22 }, onHit: { damage: 12, hitstop: 0.12, knockback: { x: 6.5 } } },
        headbutt: { name: "Shoulder of the deep", startup: 7, active: [7, 9], recovery: 13, total: 22, block: -3, cancelWindow: [7, 20], onHit: { damage: 15, hitstop: 0.13, knockback: { x: 5.0 } } },
        aerialPunch: {
          name: "Breaker", startup: 8, active: [8, 13], recovery: 14, total: 27, cooldownTicks: 27, onHit: { damage: 9, hitstop: 0.08, knockback: { x: 3.0 } },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.30, d: { hnF: [10, 40], elF: [6, 20], chest: [6, 4], head: [6, 4], footF: [6, 10], footB: [-10, -10] } }, { at: 1.00, d: { hnF: [10, 40], elF: [6, 20], chest: [6, 4], head: [6, 4], footF: [6, 10], footB: [-10, -10] } }]
        },
        aerialDive: { name: "Undertow", startup: 10, active: [10, 22], recovery: 18, total: 40, cooldownTicks: 40, block: -7, onHit: { damage: 13, hitstop: 0.11, knockback: { x: 4.0 } } },
        special: {
          name: "Seismos", input: "special", kind: "projectile", startup: 26, cast: 26, active: [26, 26], recovery: 30, total: 56, cooldownTicks: 56, block: -6,
          ground: true,
          onHit: { damage: 20, hitstop: 0.10, knockback: { x: 5.5 } },
          basis: { chapter: "ch08", text: "sea, earthquakes" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.30, d: P_RAISE }, { at: 0.46, d: P_SLAM }, { at: 0.70, d: { hnF: [20, 30], hnB: [50, 28], chest: [8, 8], head: [10, 10], hip: [0, 6] } }, { at: 1.00, d: {} }]
        },
        fspecial: {
          name: "Riptide", input: "toward + special", kind: "rush", startup: 12, active: [12, 20], recovery: 22, total: 42, block: -12, meter: 0,
          travel: 130, travelTicks: [4, 20], armor: [6, 14], hitbox: { ox: 40, r: 30, h: 90 },
          onHit: { damage: 13, hitstop: 0.12, knockback: { x: 6.0 } },
          basis: { chapter: "ch08", text: "poseidon's trident" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.10, d: { hip: [0, 6], chest: [-4, 4], hnF: [-16, 6] } }, { at: 0.28, d: P_CHARGE }, { at: 0.50, d: P_CHARGE }, { at: 1.00, d: {} }]
        },
        bspecial: {
          name: "Earthquake", input: "away + special", kind: "quake", startup: 16, active: [16, 20], recovery: 22, total: 42, block: -8, meter: 0,
          radius: 118, knockdown: true,
          onHit: { damage: 10, hitstop: 0.10, knockback: { x: 0.8 } },
          basis: { chapter: "ch08", text: "sea, earthquakes" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.24, d: P_FOOT }, { at: 0.38, d: P_STAMP }, { at: 0.55, d: P_STAMP }, { at: 1.00, d: {} }]
        },
        super: {
          name: "The sea rises", input: "special at 100 meter", kind: "tide", startup: 28, cast: 28, active: [28, 70], recovery: 26, total: 96, meter: 100,
          onHit: { damage: 50, hitstop: 0.25, knockback: { x: 4.0 } },
          basis: { chapter: "ch08", text: "sea, earthquakes" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.12, d: P_LOW }, { at: 0.29, d: P_HIGH }, { at: 0.73, d: P_HIGH }, { at: 1.00, d: {} }]
        },
        grab: {
          name: "Throw", input: "grab", kind: "grab", startup: 6, active: [6, 7], recovery: 22, total: 29,
          onHit: { damage: 15, hitstop: 0.13, knockback: { x: 7.0 } },
          poseKeys: grabPose({ hnF: [-10, -96], elF: [-8, -50], hnB: [20, -96], elB: [12, -50], chest: [-4, -2] }, { hnF: [34, 30], hnB: [60, 30], chest: [12, 12], head: [14, 14], hip: [2, 8] })
        }
      }
    },

    // -------------------------------------------------------------- Athena
    // Owl, aegis and olive (technical, rushdown, parry). ch08: wisdom,
    // war-craft, the city; owl, aegis and olive.
    athena: {
      id: "athena",
      walkSpeed: 3.6, jumpVel: 13.0, weight: 0.9,
      style: { idle: "guard", victory: "olive" },
      factRef: { chapter: "ch08", basis: "owl, aegis, and olive" },
      // her owl, loosed as a bolt of gold.
      special: { kind: "owl", name: "GLAUX", col: "#ffe08a", col2: "#c79a54", r: 13, speed: 6.9 },
      moves: {
        light: { name: "Spear jab", startup: 3, active: [3, 5], recovery: 8, total: 13, block: 2, chainMax: 3, cancelWindow: [2, 11], onHit: { damage: 5, hitstop: 0.05, knockback: { x: 2.0 } } },
        kick: { name: "Hoplite thrust", startup: 10, active: [10, 12], recovery: 12, total: 24, block: -1, cancelWindow: [10, 22], onHit: { damage: 12, hitstop: 0.11, knockback: { x: 4.0 } } },
        headbutt: { name: "Aegis bash", startup: 5, active: [5, 7], recovery: 11, total: 18, block: 1, guardBreak: 33, cancelWindow: [5, 16], onHit: { damage: 13, hitstop: 0.12, knockback: { x: 3.5 } } },
        aerialPunch: { name: "Owl's stoop", startup: 5, active: [5, 11], recovery: 11, total: 22, cooldownTicks: 22, onHit: { damage: 8, hitstop: 0.06, knockback: { x: 2.5 } } },
        aerialDive: { name: "Spear dive", startup: 8, active: [8, 18], recovery: 14, total: 32, cooldownTicks: 32, block: -4, onHit: { damage: 11, hitstop: 0.10, knockback: { x: 3.0 } } },
        special: {
          name: "Glaux", input: "special", kind: "projectile", startup: 20, cast: 20, active: [20, 20], recovery: 26, total: 46, cooldownTicks: 46, block: -5,
          homing: 0.06,
          onHit: { damage: 18, hitstop: 0.09, knockback: { x: 3.0 } },
          basis: { chapter: "ch08", text: "owl, aegis, and olive" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.25, d: A_DRAW }, { at: 0.43, d: A_LOOSE }, { at: 0.70, d: { hnF: [12, -30], elF: [6, -16] } }, { at: 1.00, d: {} }]
        },
        fspecial: {
          name: "Phalanx step", input: "toward + special", kind: "step", startup: 4, active: null, recovery: 8, total: 12, meter: 0,
          travel: 64, travelTicks: [1, 6], cancelInto: ["light", "kick", "headbutt"], cancelWindow: [4, 8],
          basis: { chapter: "ch08", text: "wisdom, war-craft" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.25, d: A_STEP }, { at: 0.60, d: { hip: [8, 4], chest: [10, 4], head: [10, 4], hnB: [60, -36], elB: [34, -16], footF: [18, 0], footB: [6, 0] } }, { at: 1.00, d: {} }]
        },
        bspecial: {
          name: "Aegis", input: "away + special", kind: "parry", startup: 2, active: [2, 7], recovery: 18, total: 25, meter: 0,
          riposte: { damage: 10, hitstop: 0.20, knockback: { x: 3.5 }, reach: 120, ticks: 10 },
          onHit: { damage: 10, hitstop: 0.20, knockback: { x: 3.5 } },
          basis: { chapter: "ch08", text: "owl, aegis, and olive" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.08, d: A_SHIELD }, { at: 0.30, d: A_SHIELD }, { at: 1.00, d: {} }]
        },
        super: {
          name: "Owl, aegis and olive", input: "special at 100 meter", kind: "flurry", startup: 18, cast: 18, active: [18, 60], recovery: 22, total: 82, meter: 100,
          flashReach: 160, stun: 0.5, strikes: [28, 36, 44, 52, 60], damages: [10, 10, 10, 10, 10],
          onHit: { damage: 50, hitstop: 0.25, knockback: { x: 4.0 } },
          basis: { chapter: "ch08", text: "owl, aegis, and olive" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.20, d: A_BASH }, { at: 0.30, d: { hnB: [60, -40], hnF: [-16, -20] } }, { at: 0.34, d: A_THRUST }, { at: 0.40, d: A_BACK }, { at: 0.44, d: A_THRUST }, { at: 0.50, d: A_BACK }, { at: 0.54, d: A_THRUST }, { at: 0.60, d: A_BACK }, { at: 0.64, d: A_THRUST }, { at: 0.70, d: A_BACK }, { at: 0.73, d: { hnF: [38, -50], elF: [22, -28], chest: [8, -2] } }, { at: 0.86, d: A_OLIVE }, { at: 0.95, d: A_OLIVE }, { at: 1.00, d: {} }]
        },
        grab: {
          name: "Throw", input: "grab", kind: "grab", startup: 4, active: [4, 5], recovery: 18, total: 23,
          onHit: { damage: 12, hitstop: 0.10, knockback: { x: 5.0 } },
          poseKeys: grabPose({ hnF: [10, -60], hnB: [70, -40], chest: [-2, 0] }, { hnF: [40, -20], hnB: [80, -30], chest: [10, 0], head: [8, 0] })
        }
      }
    },

    // --------------------------------------------------------------- Hades
    // The realm of the dead (bruiser, grappler). ch08: the realm of Hades, the
    // shades, the Styx; Persephone. ch47: Cerberus, Charon.
    hades: {
      id: "hades",
      walkSpeed: 2.8, jumpVel: 12.0, weight: 1.15,
      style: { idle: "brood", walk: "heavy", victory: "cloak" },
      factRef: { chapter: "ch08", basis: "realm of Hades" },
      // a loosed shade from the underworld — a slow soul that lingers.
      special: { kind: "soul", name: "PSYCHE", col: "#b483ff", col2: "#4a2d7a", r: 15, speed: 5.6 },
      moves: {
        light: { name: "Grasp of the shades", startup: 5, active: [5, 7], recovery: 11, total: 18, block: 0, cancelWindow: [4, 17], onHit: { damage: 8, hitstop: 0.09, knockback: { x: 1.5 } } },
        kick: { name: "Gate strike", startup: 14, active: [14, 17], recovery: 15, total: 32, block: -2, cancelWindow: [14, 30], onHit: { damage: 15, hitstop: 0.16, knockback: { x: 3.0 } } },
        headbutt: { name: "Brow of the deep", startup: 7, active: [7, 9], recovery: 13, total: 22, block: -1, cancelWindow: [7, 20], onHit: { damage: 20, hitstop: 0.16, knockback: { x: 2.5 } } },
        aerialPunch: { name: "Falling shade", startup: 7, active: [7, 12], recovery: 13, total: 25, cooldownTicks: 25, onHit: { damage: 10, hitstop: 0.09, knockback: { x: 2.0 } } },
        aerialDive: {
          name: "Katabasis", startup: 11, active: [11, 24], recovery: 20, total: 44, cooldownTicks: 44, block: -8, driveVx: 0.6, driveVy: -9,
          onHit: { damage: 15, hitstop: 0.14, knockback: { x: 3.0 } },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.25, d: { footF: [4, 26], kneeF: [6, 10], footB: [-6, 22], kneeB: [-4, 8], hnF: [-10, -30], hnB: [10, -30], chest: [0, 4] } }, { at: 1.00, d: { footF: [4, 26], kneeF: [6, 10], footB: [-6, 22], kneeB: [-4, 8], hnF: [-10, -30], hnB: [10, -30], chest: [0, 4] } }]
        },
        special: {
          name: "Psyche", input: "special", kind: "projectile", startup: 24, cast: 24, active: [24, 24], recovery: 32, total: 56, cooldownTicks: 56, block: -9,
          life: 2.8,
          onHit: { damage: 20, hitstop: 0.12, knockback: { x: 3.0 } },
          basis: { chapter: "ch08", text: "the shades went down to the realm of hades" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.25, d: H_CLOAK }, { at: 0.43, d: H_SWEEP }, { at: 0.70, d: { hnF: [16, -6] } }, { at: 1.00, d: {} }]
        },
        fspecial: {
          name: "Charon's toll", input: "toward + special", kind: "cmdgrab", startup: 8, active: [8, 10], recovery: 30, total: 40, meter: 0,
          reach: 50, bodyHalf: 22,
          onHit: { damage: 18, hitstop: 0.16, knockback: { x: 1.5 } },
          basis: { chapter: "ch47", text: "ferryman charon" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.12, d: { hip: [0, 8], chest: [6, 8], head: [6, 8] } }, { at: 0.22, d: H_DOWN }, { at: 0.40, d: H_DOWN }, { at: 1.00, d: {} }]
        },
        bspecial: {
          name: "Shade step", input: "away + special", kind: "fade", startup: 2, active: [2, 12], recovery: 14, total: 26, meter: 0,
          travel: -74, travelTicks: [2, 12], invuln: [2, 12],
          basis: { chapter: "ch08", text: "the shades went down" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.10, d: H_FADE }, { at: 0.45, d: { hnF: [10, -50], elF: [4, -26], chest: [-6, 2], head: [-8, 2] } }, { at: 1.00, d: {} }]
        },
        super: {
          name: "The house of Hades", input: "special at 100 meter", kind: "darkness", startup: 24, cast: 24, active: [24, 204], recovery: 20, total: 44, meter: 100,
          slow: 0.7, grabDamage: 50,
          onHit: { damage: 50, hitstop: 0.25 },
          basis: { chapter: "ch47", text: "hound cerberus" },
          poseKeys: [{ at: 0.00, d: {} }, { at: 0.30, d: { hnF: [-10, -40], hnB: [10, -40], hip: [0, 8], chest: [0, 8], head: [0, 10] } }, { at: 0.55, d: H_SPREAD }, { at: 0.80, d: H_SPREAD }, { at: 1.00, d: {} }]
        },
        grab: {
          name: "Throw", input: "grab", kind: "grab", startup: 6, active: [6, 7], recovery: 20, total: 27,
          onHit: { damage: 16, hitstop: 0.14, knockback: { x: 4.0 } },
          poseKeys: grabPose({ hnF: [-4, -80], hnB: [30, -80], chest: [-2, 0] }, { hnF: [30, 40], hnB: [50, 40], chest: [12, 14], head: [14, 16], hip: [2, 10] })
        }
      }
    }

  };

  /* Resolve a god's move: the shared base move with that god's override merged
     on top (onHit, its knockback, and hitbox are merged key by key). fighter.js
     and the tests both call this, so the game and the frame-data check read the
     same numbers. */
  function mergeMove(base, ov) {
    if (!ov) return base; if (!base) return ov;
    var m = {}, k;
    for (k in base) m[k] = base[k];
    for (k in ov) m[k] = ov[k];
    if (base.onHit || ov.onHit) {
      var bo = base.onHit || {}, oo = ov.onHit || {}; m.onHit = {};
      for (k in bo) m.onHit[k] = bo[k];
      for (k in oo) m.onHit[k] = oo[k];
      if (bo.knockback || oo.knockback) m.onHit.knockback = Object.assign({}, bo.knockback, oo.knockback);
    }
    if (base.hitbox || ov.hitbox) m.hitbox = Object.assign({}, base.hitbox, ov.hitbox);
    return m;
  }
  window.FIGHTER_RESOLVE = function (godId, id) {
    var ch = window.FIGHTER_CHARACTERS[godId] || {}, base = window.FIGHTER_MOVES[id], ov = (ch.moves || {})[id];
    var m = ov ? mergeMove(base, ov) : base;
    if (m && !m.id) { m = mergeMove(m, { id: id }); }
    return m;
  };
})();
