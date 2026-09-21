/* ==========================================================================
   THEOMACHY — pose-based fighter PILOT engine (Zeus vs. placeholder Hades)

   Compact self-contained match engine that proves the pose-based sprite rebuild.
   The VISUAL layer is 100% rigid poses from poses.js (window.THEO). The FEEL is
   all timing, exactly as the brief asks:
     * anticipation frame  — every strike opens on a wind-up pose held a few ticks
     * held impact frame    — the contact pose is held (and frozen by hit-stop)
     * hit-stop             — both fighters freeze for N ticks on a confirmed hit
     * screen shake         — decaying camera kick on impact
     * smear / trail         — a motion streak + ghost limbs across the strike swing
   Animation is DISCRETE frame-swapping between authored poses — no interpolation,
   no springs, no IK, no mesh. That is the whole point of the rebuild.
   ========================================================================== */
(function () {
  "use strict";
  var T = window.THEO;
  var VW = 760, VH = 360, GROUND = VH - 40, TICK = 1 / 60, GRAV = 0.9, MINSEP = 66;

  /* ---- clips: ordered discrete pose frames. dur in ticks (60/s). ---------
     hit  = this frame's melee attack key (checked against ATK)
     spawn= this frame spawns a projectile / shock
     The first frame of every strike is the anticipation; the `hit`/`spawn`
     frame is the held impact. */
  var CLIPS = {
    punch: [["punchWind", 6], ["punchHit", 8, { hit: "punch", smear: "hand" }], ["punchRec", 8]],
    kick:  [["kickWind", 9], ["kickHit", 11, { hit: "kick", smear: "foot" }], ["kickRec", 11]],
    bolt:  [["boltWind", 13], ["boltRelease", 8, { spawn: "bolt", smear: "hand" }], ["boltRec", 13]],
    upper: [["upperWind", 9], ["upperHit", 12, { hit: "upper", smear: "hand" }], ["upperRec", 15]],
    clap:  [["clapWind", 13], ["clapHit", 11, { hit: "clap", spawn: "shock", smear: "hand" }], ["clapRec", 15]],
    hit:   [["hit", 16]],
    ko:    [["ko1", 24], ["ko2", 100000]],
    victory: [["victory", 100000]]
  };
  // melee attack stats. reach = px in front of the fighter's centre the blow
  // covers; consistent with how far the pose actually extends the fist/foot.
  var ATK = {
    punch: { dmg: 6,  reach: 60, kb: 3.2, up: 0,   hitstop: 5,  shake: 5,  blockable: true },
    kick:  { dmg: 13, reach: 76, kb: 6.5, up: 0,   hitstop: 8,  shake: 8,  blockable: true },
    upper: { dmg: 15, reach: 54, kb: 3.0, up: 11,  hitstop: 9,  shake: 10, blockable: true },   // launcher
    clap:  { dmg: 18, reach: 64, kb: 2.0, up: 0,   hitstop: 11, shake: 14, blockable: true }     // heavy, keeps them close
  };
  var COOLDOWN = { punch: 4, kick: 8, bolt: 16, upper: 18, clap: 22 };
  var SPECIALS = { bolt: 22, upper: 26, clap: 34 };   // energy cost

  /* ---- characters --------------------------------------------------------- */
  var CHARS = {
    zeus: {
      id: "zeus", name: "ZEUS", pal: T.ZEUS, walk: 3.0, jump: 13,
      moves: { punch: "punch", kick: "kick", bolt: "bolt", upper: "upper", clap: "clap" },
      boltCol: T.ZEUS
    },
    // Placeholder: real fighter to spar against, but deliberately unfinished —
    // shared rigid kit, recoloured, and only the shared normals + one recoloured
    // special. No Hades-specific signature moves until his pass is approved.
    hades: {
      id: "hades", name: "HADES", tag: "placeholder", pal: T.HADES, walk: 2.7, jump: 12,
      moves: { punch: "punch", kick: "kick", bolt: "bolt" },   // "bolt" recoloured = shade-bolt
      boltCol: T.HADES
    }
  };

  /* ---- state -------------------------------------------------------------- */
  var cv, c, p1, p2, keys = {}, projectiles = [], particles = [], smears = [];
  var hitStop = 0, shake = 0, gameOver = false, winner = null, p2ai = true, running = false, acc = 0, last = 0;

  function makeFighter(char, x, facing, human) {
    return {
      char: char, pal: char.pal, x: x, y: 0, vx: 0, vy: 0, facing: facing, onGround: true,
      hp: 100, energy: 0, human: human,
      state: "idle", act: null, clip: null, frame: 0, frameT: 0, cooldown: 0, hitLanded: false, stun: 0,
      phase: Math.random() * 6, breath: 0,
      smearT: 0, smearFrom: null, smearTo: null, smearKind: "hand"
    };
  }

  /* ---- action control ----------------------------------------------------- */
  function busy(f) { return f.state === "act" || f.state === "hit" || f.state === "ko"; }
  function canAct(f) { return !gameOver && f.state !== "ko" && f.state !== "hit" && f.state !== "act" && f.cooldown <= 0 && f.stun <= 0; }

  function start(f, actName) {
    f.state = "act"; f.act = actName; f.clip = CLIPS[actName]; f.frame = 0; f.frameT = 0; f.hitLanded = false; f.vx = 0;
  }
  function tryMove(f, key) {
    if (!canAct(f)) return;
    var mv = f.char.moves;
    if (key === "punch" && mv.punch) return start(f, mv.punch);
    if (key === "kick" && mv.kick) return start(f, mv.kick);
    if (key === "bolt" && mv.bolt && f.energy >= SPECIALS.bolt) { f.energy -= SPECIALS.bolt; return start(f, "bolt"); }
    if (key === "upper" && mv.upper && f.energy >= SPECIALS.upper) { f.energy -= SPECIALS.upper; return start(f, "upper"); }
    if (key === "clap" && mv.clap && f.energy >= SPECIALS.clap) { f.energy -= SPECIALS.clap; return start(f, "clap"); }
  }

  /* ---- current pose for a fighter (drives draw AND the front-extremity FX) - */
  function poseOf(f, t) {
    if (f.state === "act") { var fr = f.clip[f.frame]; return T.POSES[fr[0]]; }
    if (f.state === "hit") return T.POSES.hit;
    if (f.state === "ko") return T.POSES[f.clip[f.frame][0]];
    if (f.state === "block") return T.POSES.block;
    if (f.state === "walk") { var seq = ["walkA", "walkB", "walkC", "walkD"]; return T.POSES[seq[Math.floor(Math.abs(f.x) * 0.09 + f.phase) % 4]]; }
    // idle: slow breath swap
    return (Math.floor(t * 1.6 + f.phase) % 2) ? T.POSES.idle2 : T.POSES.idle;
  }

  /* ---- simulation step ---------------------------------------------------- */
  function opp(f) { return f === p1 ? p2 : p1; }

  function step(t) {
    if (hitStop > 0) { hitStop--; return; }                 // freeze the world = held impact
    handleInput(p1);
    if (p2.human) handleInput(p2); else aiControl(p2, t);
    simFighter(p1, t); simFighter(p2, t);
    separate();
    stepProjectiles();
    stepParticles();
    if (shake > 0) shake = Math.max(0, shake - 0.6);
  }

  function faceOpponent(f) { var o = opp(f); if (o.x !== f.x) f.facing = o.x > f.x ? 1 : -1; }

  function handleInput(f) {
    if (!canAct(f) && f.state !== "walk" && f.state !== "idle" && f.state !== "block") { return; }
    var k = f.human ? f.keymap : f.keymap;
    // resolve pressed set
    var m = f.keymap;
    if (canAct(f)) {
      if (keys[m.punch]) return tryMove(f, "punch");
      if (keys[m.kick]) return tryMove(f, "kick");
      if (m.bolt && keys[m.bolt]) return tryMove(f, "bolt");
      if (m.upper && keys[m.upper]) return tryMove(f, "upper");
      if (m.clap && keys[m.clap]) return tryMove(f, "clap");
      if (keys[m.block]) { f.state = "block"; f.vx = 0; return; }
    }
    // movement (only when free)
    if (f.state === "act" || f.state === "hit" || f.state === "ko") return;
    faceOpponent(f);
    var mvSpd = f.char.walk, moving = false;
    if (keys[m.left]) { f.vx = -mvSpd; moving = true; }
    else if (keys[m.right]) { f.vx = mvSpd; moving = true; }
    else f.vx = 0;
    if (keys[m.up] && f.onGround) { f.vy = f.char.jump; f.onGround = false; }
    if (keys[m.block]) { f.state = "block"; f.vx = 0; return; }
    f.state = moving ? "walk" : "idle";
  }

  function simFighter(f, t) {
    f.cooldown = Math.max(0, f.cooldown - 1);
    f.stun = Math.max(0, f.stun - 1);
    f.energy = Math.min(100, f.energy + 0.14);              // slow passive meter gain
    // physics
    f.x += f.vx;
    if (!f.onGround) { f.y += f.vy; f.vy -= GRAV; if (f.y <= 0) { f.y = 0; f.vy = 0; f.onGround = true; } }
    if (f.state !== "act" && f.state !== "ko") f.vx *= 0.6;  // ground friction on knockback
    else if (f.state === "ko") f.vx *= 0.85;
    f.x = Math.max(30, Math.min(VW - 30, f.x));
    // advance the current clip (discrete frames)
    if (f.state === "act") {
      var fr = f.clip[f.frame], data = fr[2] || {};
      // on entering the impact frame, arm the smear + resolve the hit/spawn once
      if (f.frameT === 0) {
        if (data.smear) armSmear(f, fr[0], data.smear);
        if (data.spawn === "bolt") spawnBolt(f);
        if (data.spawn === "shock") spawnShock(f);
      }
      if (data.hit && !f.hitLanded) tryHit(f, data.hit);
      f.frameT++;
      if (f.frameT >= fr[1]) { f.frame++; f.frameT = 0; if (f.frame >= f.clip.length) endAction(f); }
    } else if (f.state === "hit") {
      f.frameT++; if (f.frameT >= f.clip[0][1]) { f.state = "idle"; }
    } else if (f.state === "ko") {
      if (f.frame < f.clip.length - 1) { f.frameT++; if (f.frameT >= f.clip[f.frame][1]) { f.frame++; f.frameT = 0; } }
    }
    if (f.smearT > 0) f.smearT--;
  }

  function endAction(f) {
    f.cooldown = COOLDOWN[f.act] || 6; f.state = "idle"; f.act = null; f.clip = null;
  }

  function tryHit(f, key) {
    var o = opp(f), atk = ATK[key];
    var d = (o.x - f.x) * f.facing;                          // opponent distance in FRONT
    if (o.state === "ko" || d <= 6 || d >= atk.reach) return;
    if (Math.abs((o.y || 0) - (f.y || 0)) > 78) return;      // rough vertical gate
    f.hitLanded = true;
    var facingEachOther = (o.x - f.x) * o.facing < 0;         // o.facing points back toward f
    var blocked = atk.blockable && o.state === "block" && facingEachOther;
    applyHit(f, o, key, atk, blocked);
  }

  function applyHit(f, o, key, atk, blocked) {
    var cx = f.x + f.facing * (atk.reach - 14), cy = GROUND - (o.y || 0) - 78;
    if (blocked) {
      o.hp = Math.max(0, o.hp - atk.dmg * 0.14);
      o.vx = f.facing * 2.2; hitStop = Math.max(hitStop, 3); shake = Math.max(shake, 3);
      burst(cx, cy, o.pal.metal, 8, 2.2); f.energy = Math.min(100, f.energy + 2);
      return;
    }
    o.hp = Math.max(0, o.hp - atk.dmg);
    o.vx = f.facing * atk.kb;
    if (atk.up) { o.vy = atk.up; o.onGround = false; }
    hitStop = Math.max(hitStop, atk.hitstop); shake = Math.max(shake, atk.shake);
    f.energy = Math.min(100, f.energy + 6); o.energy = Math.min(100, o.energy + 3);
    burst(cx, cy, "#fff3c0", 14, 3.4); burst(cx, cy, o.pal.energy, 10, 2.6);
    if (o.hp <= 0) { koFighter(o); } else { o.state = "hit"; o.frame = 0; o.frameT = 0; o.stun = 12; o.clip = CLIPS.hit; }
  }

  function koFighter(o) {
    o.state = "ko"; o.frame = 0; o.frameT = 0; o.clip = CLIPS.ko; o.vx = o.facing * -2;
    gameOver = true; winner = opp(o);
    winner.state = "victory"; winner.clip = CLIPS.victory; winner.frame = 0; winner.act = null;
    shake = Math.max(shake, 14); hitStop = Math.max(hitStop, 12);
  }

  /* ---- smear / trail ------------------------------------------------------- */
  // Capture the fist/foot local position at the wind-up pose and at the impact
  // pose; the draw layer streaks between them + drops ghost limbs across the swing.
  function armSmear(f, impactPoseName, kind) {
    var windName = f.clip[Math.max(0, f.frame - 1)][0];
    var a = T.skeleton(T.POSES[windName]), b = T.skeleton(T.POSES[impactPoseName]);
    var jf = kind === "foot" ? "ftF" : "hnF", js = kind === "foot" ? "hipF" : "shF";
    f.smearFrom = a[jf].slice(); f.smearTo = b[jf].slice();
    f.smearRoot = b[js].slice(); f.smearKind = kind; f.smearT = 6;
  }

  /* ---- projectiles: Keraunos bolt + Bronte ground shock ------------------- */
  function spawnBolt(f) {
    var sk = T.skeleton(T.POSES.boltRelease), wx = f.x + f.facing * sk.hnF[0], wy = GROUND - (f.y || 0) + sk.hnF[1];
    projectiles.push({ x: wx, y: wy, vx: f.facing * 8.2, owner: f, pal: f.char.boltCol, life: 90, r: 12, kind: "bolt", seed: Math.random() * 99 });
  }
  function spawnShock(f) {
    // a short-range ground shock ring (visual + a light secondary hit if adjacent)
    projectiles.push({ x: f.x + f.facing * 22, y: GROUND, owner: f, pal: f.pal, life: 18, r: 6, grow: 5, kind: "shock" });
  }
  function stepProjectiles() {
    for (var i = projectiles.length - 1; i >= 0; i--) {
      var pr = projectiles[i];
      if (pr.kind === "bolt") {
        pr.x += pr.vx; pr.life--;
        var o = opp(pr.owner);
        if (o.state !== "ko" && Math.abs(o.x - pr.x) < 26 && Math.abs((GROUND - (o.y || 0) - 74) - pr.y) < 60) {
          o.hp = Math.max(0, o.hp - 11); o.vx = (pr.vx > 0 ? 1 : -1) * 4.5; o.energy = Math.min(100, o.energy + 3);
          hitStop = Math.max(hitStop, 7); shake = Math.max(shake, 8);
          burst(pr.x, pr.y, "#fff3c0", 16, 3.6); burst(pr.x, pr.y, pr.pal.energy, 12, 2.8);
          if (o.hp <= 0) koFighter(o); else if (o.state !== "ko") { o.state = "hit"; o.frame = 0; o.frameT = 0; o.stun = 10; o.clip = CLIPS.hit; }
          projectiles.splice(i, 1); continue;
        }
        if (pr.x < -30 || pr.x > VW + 30 || pr.life <= 0) projectiles.splice(i, 1);
      } else if (pr.kind === "shock") {
        pr.r += pr.grow; pr.life--; if (pr.life <= 0) projectiles.splice(i, 1);
      }
    }
  }

  /* ---- particles ---------------------------------------------------------- */
  function burst(x, y, col, n, spd) {
    for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = spd * (0.4 + Math.random()); particles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 16 + Math.random() * 10, col: col, r: 1.5 + Math.random() * 2.5 }); }
  }
  function stepParticles() {
    for (var i = particles.length - 1; i >= 0; i--) { var p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.life--; if (p.life <= 0) particles.splice(i, 1); }
  }

  function separate() {
    var d = p2.x - p1.x;
    if (Math.abs(d) < MINSEP && p1.state !== "ko" && p2.state !== "ko") {
      var push = (MINSEP - Math.abs(d)) / 2 * (d >= 0 ? 1 : -1);
      p1.x -= push; p2.x += push;
      p1.x = Math.max(30, Math.min(VW - 30, p1.x)); p2.x = Math.max(30, Math.min(VW - 30, p2.x));
    }
  }

  /* ---- simple placeholder AI for Hades ------------------------------------ */
  function aiControl(f, t) {
    if (gameOver) return;
    var o = opp(f), d = Math.abs(o.x - f.x); faceOpponent(f);
    f._ai = f._ai || { next: 0, mode: "approach" };
    if (!canAct(f)) { if (f.state === "act" || f.state === "hit" || f.state === "ko") return; }
    // block a bit when the foe is attacking in range
    if (o.state === "act" && d < 90 && Math.random() < 0.16) { f.state = "block"; f.vx = 0; return; }
    if (f.aiTimer == null) f.aiTimer = 0;
    f.aiTimer--;
    if (canAct(f) && d < 70 && f.aiTimer <= 0) {
      var r = Math.random();
      if (r < 0.5) tryMove(f, "punch"); else if (r < 0.8) tryMove(f, "kick");
      else if (f.energy >= SPECIALS.bolt) tryMove(f, "bolt"); else tryMove(f, "punch");
      f.aiTimer = 24 + Math.random() * 30; return;
    }
    if (canAct(f) && d > 260 && f.energy >= SPECIALS.bolt && Math.random() < 0.02) { tryMove(f, "bolt"); return; }
    // walk toward / keep spacing
    if (f.state !== "act" && f.state !== "hit") {
      if (d > 62) { f.vx = (o.x > f.x ? 1 : -1) * f.char.walk; f.state = "walk"; }
      else { f.vx = 0; f.state = "idle"; }
    }
  }

  /* ======================= RENDER ======================= */
  function drawBG() {
    var g = c.createLinearGradient(0, 0, 0, VH);
    g.addColorStop(0, "#243a63"); g.addColorStop(0.55, "#182238"); g.addColorStop(0.551, "#241a10"); g.addColorStop(1, "#120c07");
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    // distant columns
    c.fillStyle = "rgba(20,14,8,.5)";
    for (var i = 0; i < 6; i++) { var x = 50 + i * 140; c.fillRect(x, GROUND - 150, 26, 150); }
    c.strokeStyle = "rgba(199,154,84,.25)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, GROUND); c.lineTo(VW, GROUND); c.stroke();
    // floor sheen
    c.fillStyle = "rgba(255,240,200,.03)"; c.fillRect(0, GROUND, VW, VH - GROUND);
  }

  function drawShadow(f) {
    var yh = f.y || 0, sr = 30 * (1 - Math.min(yh, 160) / 340), sa = 0.42 * (1 - Math.min(yh, 160) / 280);
    c.save(); c.translate(f.x, GROUND); c.scale(1, 0.26); c.globalAlpha = sa; c.fillStyle = "#000";
    c.beginPath(); c.arc(0, yh * 2.6, sr, 0, 7); c.fill();
    c.globalAlpha = Math.min(1, sa * 1.4); c.lineWidth = 3; c.strokeStyle = f.pal.energy;
    c.beginPath(); c.arc(0, yh * 2.6, sr + 1.5, 0, 7); c.stroke(); c.restore();
  }

  function drawSmear(f) {
    if (f.smearT <= 0 || !f.smearFrom) return;
    var a = f.smearT / 6, from = f.smearFrom, to = f.smearTo, root = f.smearRoot;
    c.save();
    c.translate(f.x, GROUND - (f.y || 0)); c.scale(f.facing < 0 ? -1 : 1, 1);
    c.globalCompositeOperation = "lighter";
    // streak wedge from wind-up extremity to impact extremity
    c.globalAlpha = 0.35 * a; c.fillStyle = f.pal.energy;
    c.beginPath(); c.moveTo(root[0], root[1]); c.lineTo(from[0], from[1]);
    c.lineTo(to[0], to[1]); c.closePath(); c.fill();
    // ghost extremities across the swing
    for (var g = 1; g <= 3; g++) {
      var tt = g / 4, gx = from[0] + (to[0] - from[0]) * tt, gy = from[1] + (to[1] - from[1]) * tt;
      c.globalAlpha = 0.22 * a * (1 - tt * 0.4);
      c.beginPath(); c.moveTo(root[0], root[1]); c.lineTo(gx, gy); c.lineWidth = 6; c.strokeStyle = f.pal.energy; c.stroke();
      c.beginPath(); c.arc(gx, gy, 5, 0, 7); c.fillStyle = f.pal.energyCore; c.fill();
    }
    c.restore();
  }

  function drawFighter(f, t) {
    drawShadow(f);
    drawSmear(f);
    c.save();
    c.translate(f.x, GROUND - (f.y || 0));
    c.scale(f.facing < 0 ? -1 : 1, 1);
    // whole-body breath bob for idle/walk (rigid translation, not a warp)
    var bob = 0;
    if (f.state === "idle") bob = Math.sin(t * 2.2 + f.phase) * 1.6;
    else if (f.state === "walk") bob = -Math.abs(Math.sin(Math.abs(f.x) * 0.18 + f.phase)) * 2.2;
    c.translate(0, -bob);
    T.draw(c, poseOf(f, t), f.pal, t);
    c.restore();
  }

  function drawProjectiles(t) {
    projectiles.forEach(function (pr) {
      c.save();
      if (pr.kind === "bolt") {
        c.globalCompositeOperation = "lighter";
        var g = c.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, pr.r * 1.6);
        g.addColorStop(0, pr.pal.energyCore); g.addColorStop(0.5, pr.pal.energy); g.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = g; c.beginPath(); c.arc(pr.x, pr.y, pr.r * 1.6, 0, 7); c.fill();
        // jagged bolt body trailing behind
        c.strokeStyle = pr.pal.energyCore; c.lineWidth = 3; c.lineJoin = "round";
        c.beginPath(); c.moveTo(pr.x, pr.y);
        for (var i = 1; i <= 5; i++) { c.lineTo(pr.x - pr.vx * i * 1.4, pr.y + (Math.random() - 0.5) * 12); }
        c.stroke();
      } else if (pr.kind === "shock") {
        c.globalCompositeOperation = "lighter"; c.globalAlpha = pr.life / 18;
        c.strokeStyle = pr.pal.energy; c.lineWidth = 4;
        c.beginPath(); c.ellipse(pr.x, pr.y, pr.r, pr.r * 0.4, 0, Math.PI, 0); c.stroke();
      }
      c.restore();
    });
  }
  function drawParticles() {
    particles.forEach(function (p) { c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = Math.min(1, p.life / 16); c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); c.restore(); });
  }

  function render(t) {
    var sx = shake ? (Math.random() - 0.5) * shake : 0, sy = shake ? (Math.random() - 0.5) * shake : 0;
    c.save(); c.translate(sx, sy);
    drawBG();
    // draw the back fighter first (further from camera = higher x-overlap handled by z simply by hp order; use x)
    var order = p1.x <= p2.x ? [p1, p2] : [p2, p1];
    drawFighter(order[0], t); drawFighter(order[1], t);
    drawProjectiles(t); drawParticles();
    c.restore();
    drawHUD();
  }

  /* ---- HUD ---------------------------------------------------------------- */
  function bar(x, y, w, val, col, right) {
    c.fillStyle = "rgba(0,0,0,.5)"; c.fillRect(x - 2, y - 2, w + 4, 16);
    c.fillStyle = "#2a2016"; c.fillRect(x, y, w, 12);
    var fw = Math.max(0, w * val / 100);
    c.fillStyle = col; if (right) c.fillRect(x + w - fw, y, fw, 12); else c.fillRect(x, y, fw, 12);
    c.strokeStyle = "rgba(255,233,168,.6)"; c.lineWidth = 1; c.strokeRect(x, y, w, 12);
  }
  function drawHUD() {
    c.font = "bold 15px Georgia, serif"; c.textBaseline = "alphabetic";
    // P1
    bar(24, 22, 300, p1.hp, "#e8c24a", false);
    bar(24, 38, 200, p1.energy, "#8fd0ff", false);
    c.fillStyle = "#ffe9a8"; c.textAlign = "left"; c.fillText(p1.char.name, 24, 16);
    // P2
    bar(VW - 324, 22, 300, p2.hp, "#b483ff", true);
    bar(VW - 224, 38, 200, p2.energy, "#caa9ff", true);
    c.textAlign = "right"; c.fillStyle = "#e6d6ff";
    c.fillText(p2.char.name + (p2.char.tag ? " · " + p2.char.tag : ""), VW - 24, 16);
    if (gameOver && winner) {
      c.textAlign = "center"; c.fillStyle = "rgba(0,0,0,.45)"; c.fillRect(0, VH / 2 - 40, VW, 80);
      c.fillStyle = "#ffe9a8"; c.font = "bold 40px Georgia, serif"; c.fillText("K.O.", VW / 2, VH / 2 - 2);
      c.font = "bold 18px Georgia, serif"; c.fillText(winner.char.name + " wins  —  press R to rematch", VW / 2, VH / 2 + 26);
    }
  }

  /* ---- loop --------------------------------------------------------------- */
  var gt = 0;
  function frame(now) {
    if (!running) return;
    if (!last) last = now; var dt = Math.min(0.05, (now - last) / 1000); last = now; acc += dt;
    var steps = 0;
    while (acc >= TICK && steps < 5) { gt += TICK; step(gt); acc -= TICK; steps++; }
    render(gt);
    requestAnimationFrame(frame);
  }

  /* ---- setup -------------------------------------------------------------- */
  function reset() {
    projectiles = []; particles = []; hitStop = 0; shake = 0; gameOver = false; winner = null;
    p1 = makeFighter(CHARS.zeus, 250, 1, true);
    p2 = makeFighter(CHARS.hades, VW - 250, -1, !p2ai);
    p1.keymap = { left: "a", right: "d", up: "w", block: "l", punch: "j", kick: "k", bolt: "u", upper: "i", clap: "o" };
    p2.keymap = { left: "ArrowLeft", right: "ArrowRight", up: "ArrowUp", block: "ArrowDown", punch: "1", kick: "2", bolt: "3", upper: "4", clap: "5" };
  }

  window.THEO_PILOT = {
    mount: function (canvas, opts) {
      cv = canvas; c = cv.getContext("2d"); cv.width = VW; cv.height = VH;
      reset();
      window.addEventListener("keydown", function (e) {
        var kk = e.key.length === 1 ? e.key.toLowerCase() : e.key; keys[kk] = true;
        if (kk === "r") reset();
        if (["a", "d", "w", "l", "j", "k", "u", "i", "o", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].indexOf(kk) >= 0) e.preventDefault();
      });
      window.addEventListener("keyup", function (e) { var kk = e.key.length === 1 ? e.key.toLowerCase() : e.key; keys[kk] = false; });
      running = true; last = 0; requestAnimationFrame(frame);
      return {
        setP2AI: function (v) { p2ai = v; p2.human = !v; },
        reset: reset,
        state: function () { return { p1: p1, p2: p2, projectiles: projectiles, gameOver: gameOver, winner: winner && winner.char.name }; },
        // test hook: force an action (used by the screenshot harness)
        force: function (who, act) { var f = who === 1 ? p1 : p2; start(f, act); }
      };
    }
  };
})();
