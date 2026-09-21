/* ==========================================================================
   THEOMACHY — POSE-BASED FIGHTER SPRITES (pilot)

   Rebuild direction: DROP the skeletal cutout / mesh-warped rig. Fighters are
   now built from RIGID whole-body poses.

   How "no warping" is guaranteed structurally:
     * Every limb segment has a CONSTANT length (see LEN). Nothing is ever
       stretched, skinned to a mesh, or IK-solved. A pose only chooses ANGLES
       for rigid segments + a whole-body offset/rotation.
     * Animation is DISCRETE FRAME-SWAPPING between authored poses (see CLIPS in
       the engine). There is no spring/interpolation between an action's key
       poses — the crisp snap is the point.
     * Each pose here is a COMPLETE, self-contained stance (not an additive
       offset on a moving skeleton), so the same pose reads identically in the
       pose sheet and in-game. That is what keeps pose-to-pose consistency.

   This file is the SINGLE SOURCE OF TRUTH for both the pose sheet and the game.
   Zeus and (placeholder) Hades share the same rigid body geometry — Hades is a
   recolor of the same kit, deliberately, until his own pass is approved.

   Angle convention (authoring): degrees, 0 = straight UP, positive = clockwise
   toward +x (the "front", i.e. toward the opponent when facing right). The
   engine mirrors the whole figure for left-facing fighters.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- constant segment lengths: the anti-warp guarantee ---- */
  var LEN = {
    torso: 52, neck: 12, headR: 15,
    uArm: 30, fArm: 27, fist: 6,
    thigh: 40, shin: 39, foot: 19,
    shoulderHalf: 15, hipHalf: 9,
    pelvisY: -76            // pelvis height above the feet baseline (y=0), grounded stance
  };

  var D2R = Math.PI / 180;
  // point from (ox,oy) at authored angle a (0=up, +cw toward +x), length L, in
  // screen space (y grows downward)
  function pt(ox, oy, a, L) {
    var r = a * D2R;
    return [ox + Math.sin(r) * L, oy - Math.cos(r) * L];
  }

  /* ---- forward kinematics: pose (angles) -> rigid joint positions ---- */
  // Returns every joint in the fighter's local space (feet baseline at y=0,
  // +x = front). Used to draw AND to anchor hitboxes to the visible fist/foot.
  function skeleton(P) {
    var rx = (P.r && P.r[0]) || 0, ry = (P.r && P.r[1]) || 0;
    var pelvis = [rx, LEN.pelvisY + ry];
    // torso up-vector and a perpendicular "front" vector, from the torso lean
    var neck = pt(pelvis[0], pelvis[1], P.to, LEN.torso);
    var chest = [(pelvis[0] + neck[0]) / 2, (pelvis[1] + neck[1]) / 2];
    // perpendicular to torso, pointing front(+x): rotate torso-up by +90
    var perp = pt(0, 0, P.to + 90, 1);
    var shF = [neck[0] + perp[0] * LEN.shoulderHalf, neck[1] + perp[1] * LEN.shoulderHalf];
    var shB = [neck[0] - perp[0] * LEN.shoulderHalf, neck[1] - perp[1] * LEN.shoulderHalf];
    var head = pt(neck[0], neck[1], P.to + P.hd, LEN.neck + LEN.headR);
    var hipF = [pelvis[0] + perp[0] * LEN.hipHalf, pelvis[1] + perp[1] * LEN.hipHalf];
    var hipB = [pelvis[0] - perp[0] * LEN.hipHalf, pelvis[1] - perp[1] * LEN.hipHalf];
    var elF = pt(shF[0], shF[1], P.fs, LEN.uArm), hnF = pt(elF[0], elF[1], P.fe, LEN.fArm);
    var elB = pt(shB[0], shB[1], P.bs, LEN.uArm), hnB = pt(elB[0], elB[1], P.be, LEN.fArm);
    var knF = pt(hipF[0], hipF[1], P.fh, LEN.thigh), ftF = pt(knF[0], knF[1], P.fk, LEN.shin);
    var knB = pt(hipB[0], hipB[1], P.bh, LEN.thigh), ftB = pt(knB[0], knB[1], P.bk, LEN.shin);
    return {
      pelvis: pelvis, chest: chest, neck: neck, head: head,
      shF: shF, elF: elF, hnF: hnF, shB: shB, elB: elB, hnB: hnB,
      hipF: hipF, knF: knF, ftF: ftF, hipB: hipB, knB: knB, ftB: ftB
    };
  }

  /* ===================== cel-shaded rigid primitives ===================== */
  var LX = 0.55, LY = -0.83;                        // global light dir (upper-right)
  function capsule(ax, ay, bx, by, w1, w2) {
    var dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    var p = new Path2D();
    p.moveTo(ax + nx * w1, ay + ny * w1);
    p.lineTo(bx + nx * w2, by + ny * w2);
    p.arc(bx, by, w2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
    p.lineTo(ax - nx * w1, ay - ny * w1);
    p.arc(ax, ay, w1, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
    p.closePath();
    return { path: p, w: Math.max(w1, w2) };
  }
  // 3-tone cel fill + bold outline. back=true drops the highlight so a limb
  // reads as behind the torso.
  function cel(c, path, base, shadow, light, outline, w, ow) {
    c.fillStyle = base; c.fill(path);
    c.save(); c.clip(path);
    var ps = new Path2D(); ps.addPath(path, new DOMMatrix([1, 0, 0, 1, -LX * w * 0.9, -LY * w * 0.9]));
    c.fillStyle = shadow; c.fill(ps);
    if (light) { var ph = new Path2D(); ph.addPath(path, new DOMMatrix([1, 0, 0, 1, LX * w * 0.8, LY * w * 0.8])); c.fillStyle = light; c.fill(ph); }
    c.restore();
    c.lineWidth = ow || 2.4; c.strokeStyle = outline; c.lineJoin = "round"; c.stroke(path);
  }
  function limb(c, a, b, w1, w2, pal, back) {
    var cap = capsule(a[0], a[1], b[0], b[1], w1, w2);
    cel(c, cap.path, back ? pal.skinSh : pal.skin, pal.skinSh, back ? null : pal.skinLi, pal.outline, cap.w, 2.2);
  }
  // A whole limb as ONE smooth tapered outline through its joints — no beaded
  // seam circles at the elbow/knee. The bend at the mid joint is the rigid
  // segment angle (constant lengths, still no warp), just drawn as one piece.
  function chain(c, pts, ws, pal, back) {
    var n = pts.length, Lp = [], Rp = [], i;
    for (i = 0; i < n; i++) {
      var a = i > 0 ? pts[i - 1] : pts[i], b = i < n - 1 ? pts[i + 1] : pts[i];
      var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      Lp.push([pts[i][0] + nx * ws[i], pts[i][1] + ny * ws[i]]);
      Rp.push([pts[i][0] - nx * ws[i], pts[i][1] - ny * ws[i]]);
    }
    var p = new Path2D(); p.moveTo(Lp[0][0], Lp[0][1]);
    for (i = 1; i < n; i++) p.lineTo(Lp[i][0], Lp[i][1]);
    var e = pts[n - 1]; p.arc(e[0], e[1], ws[n - 1], Math.atan2(Lp[n - 1][1] - e[1], Lp[n - 1][0] - e[0]), Math.atan2(Rp[n - 1][1] - e[1], Rp[n - 1][0] - e[0]), false);
    for (i = n - 1; i >= 0; i--) p.lineTo(Rp[i][0], Rp[i][1]);
    var s = pts[0]; p.arc(s[0], s[1], ws[0], Math.atan2(Rp[0][1] - s[1], Rp[0][0] - s[0]), Math.atan2(Lp[0][1] - s[1], Lp[0][0] - s[0]), false);
    p.closePath();
    cel(c, p, back ? pal.skinSh : pal.skin, pal.skinSh, back ? null : pal.skinLi, pal.outline, ws[0], 2.4);
  }

  function drawHead(c, S, pal, look) {
    var h = S.head, n = S.neck;
    // neck
    limb(c, [n[0], n[1] + 1], [h[0], h[1] + LEN.headR * 0.5], 5.5, 6.5, pal, false);
    var ang = Math.atan2(h[1] - n[1], h[0] - n[0]) + Math.PI / 2; // head tilt from neck
    c.save(); c.translate(h[0], h[1]); c.rotate(ang);
    var R = LEN.headR;
    // local frame: +x = front (face side)
    // 1) hair BACK mass — fills top + back (-x), leaves the forehead/face open
    var HB = new Path2D();
    HB.moveTo(R * 0.4, -R * 0.7);
    HB.quadraticCurveTo(-R * 0.2, -R * 1.28, -R * 0.95, -R * 0.7);
    HB.quadraticCurveTo(-R * 1.22, -R * 0.05, -R * 0.85, R * 0.64);
    HB.quadraticCurveTo(-R * 0.5, R * 0.2, -R * 0.35, -R * 0.2);
    HB.quadraticCurveTo(-R * 0.15, -R * 0.78, R * 0.5, -R * 0.5);
    HB.closePath();
    cel(c, HB, pal.hair, pal.hairSh, null, pal.outline, R, 2.2);
    // 2) face
    var F = new Path2D(); F.arc(0, 0, R, 0, 7);
    cel(c, F, pal.skin, pal.skinSh, pal.skinLi, pal.outline, R, 2.2);
    // form shadow on the back cheek so the face isn't flat
    c.save(); c.clip(F); c.fillStyle = pal.skinSh; c.globalAlpha = 0.5;
    c.beginPath(); c.moveTo(-R, -R); c.lineTo(-R * 0.15, -R); c.quadraticCurveTo(-R * 0.5, 0, -R * 0.15, R); c.lineTo(-R, R); c.closePath(); c.fill();
    c.globalAlpha = 1; c.restore();
    // 3) brow ridge (front upper)
    c.strokeStyle = pal.outline; c.lineWidth = 2.2; c.lineCap = "round";
    c.beginPath(); c.moveTo(R * 0.1, -R * 0.3); c.lineTo(R * 0.82, -R * 0.16); c.stroke();
    // 4) deep-set eye
    c.fillStyle = pal.outline;
    c.beginPath(); c.ellipse(R * 0.52, -R * 0.02, 2.4, 1.7, 0, 0, 7); c.fill();
    c.fillStyle = pal.eye; c.beginPath(); c.arc(R * 0.6, -R * 0.05, 1.0, 0, 7); c.fill();
    // 5) nose ridge down the front edge
    c.strokeStyle = pal.skinSh; c.lineWidth = 1.6; c.lineCap = "round";
    c.beginPath(); c.moveTo(R * 0.8, -R * 0.16); c.lineTo(R * 0.92, R * 0.26); c.stroke();
    // 6) beard — a tapered lock coming to a chin point, hugging the jaw. No
    // straight mouth line / vertical grid (that read as teeth) — soft locks only.
    var BD = new Path2D();
    BD.moveTo(-R * 0.72, R * 0.12);                                 // back jaw
    BD.quadraticCurveTo(-R * 0.6, R * 1.02, R * 0.12, R * 1.64);    // sweep to chin point
    BD.quadraticCurveTo(R * 0.86, R * 1.0, R * 0.88, R * 0.28);     // up the front side
    BD.quadraticCurveTo(R * 0.52, R * 0.46, R * 0.12, R * 0.5);     // gentle dip under the mouth
    BD.quadraticCurveTo(-R * 0.34, R * 0.5, -R * 0.72, R * 0.12);
    BD.closePath();
    cel(c, BD, pal.hair, pal.hairSh, null, pal.outline, R, 2.2);
    // two soft curved locks flowing to the chin (not straight — no tooth grid)
    c.save(); c.clip(BD); c.strokeStyle = pal.hairSh; c.globalAlpha = 0.5; c.lineWidth = 1.3; c.lineCap = "round";
    c.beginPath(); c.moveTo(-R * 0.12, R * 0.62); c.quadraticCurveTo(0, R * 1.1, R * 0.12, R * 1.5); c.stroke();
    c.beginPath(); c.moveTo(R * 0.46, R * 0.56); c.quadraticCurveTo(R * 0.4, R * 1.02, R * 0.2, R * 1.44); c.stroke();
    c.globalAlpha = 1; c.restore();
    // a soft drooping mustache over the mouth (curves down, doesn't cross like teeth)
    c.strokeStyle = pal.hairSh; c.lineWidth = 2.4; c.lineCap = "round";
    c.beginPath(); c.moveTo(R * 0.28, R * 0.4); c.quadraticCurveTo(R * 0.55, R * 0.5, R * 0.5, R * 0.56); c.stroke();
    c.restore();
  }

  function drawTorso(c, S, pal) {
    var sB = S.shB, sF = S.shF, p = S.pelvis, ch = S.chest;
    var T = new Path2D();
    T.moveTo(sB[0], sB[1]);
    T.quadraticCurveTo(ch[0] - 20, ch[1], p[0] - 12, p[1]);
    T.quadraticCurveTo(p[0], p[1] + 8, p[0] + 13, p[1]);
    T.quadraticCurveTo(ch[0] + 22, ch[1], sF[0], sF[1]);
    T.quadraticCurveTo((sF[0] + sB[0]) / 2, (sF[1] + sB[1]) / 2 - 6, sB[0], sB[1]);
    T.closePath();
    cel(c, T, pal.skin, pal.skinSh, pal.skinLi, pal.outline, 20, 2.6);
    // engraved chest/abs
    c.save(); c.clip(T); c.strokeStyle = pal.outline; c.globalAlpha = 0.38; c.lineWidth = 1.4; c.lineCap = "round";
    var mx = ch[0], my = ch[1];
    c.beginPath(); c.moveTo(mx, my - 4); c.lineTo(mx, my + 10); c.stroke();
    c.beginPath(); c.moveTo(mx - 11, my - 2); c.quadraticCurveTo(mx - 5, my + 7, mx - 1, my + 7); c.stroke();
    c.beginPath(); c.moveTo(mx + 12, my - 2); c.quadraticCurveTo(mx + 6, my + 7, mx + 2, my + 7); c.stroke();
    c.globalAlpha = 1; c.restore();
    // himation sash (god's cloth colour) across one shoulder
    var H = new Path2D();
    H.moveTo(sF[0] + 3, sF[1] - 2);
    H.quadraticCurveTo(ch[0] + 6, ch[1] + 12, p[0] - 13, p[1] + 3);
    H.lineTo(p[0] - 5, p[1] + 8);
    H.quadraticCurveTo(ch[0] + 13, ch[1] + 15, sF[0] + 11, sF[1] + 1);
    H.closePath();
    cel(c, H, pal.cloth, pal.clothSh, null, pal.outline, 12, 2);
    // belt
    var G = new Path2D(); G.rect(p[0] - 13, p[1] - 3, 26, 6);
    cel(c, G, pal.metal, pal.metalSh, pal.rim, pal.outline, 6, 1.6);
    c.beginPath(); c.arc(p[0], p[1], 3, 0, 7); c.fillStyle = pal.rim; c.fill(); c.strokeStyle = pal.outline; c.lineWidth = 1; c.stroke();
  }

  function drawFist(c, h, pal, back) {
    var cap = capsule(h[0], h[1], h[0] + 3, h[1] + 1, LEN.fist, LEN.fist * 0.8);
    cel(c, cap.path, back ? pal.skinSh : pal.skin, pal.skinSh, back ? null : pal.skinLi, pal.outline, LEN.fist, 2);
  }
  function drawFoot(c, k, f, pal, back) {
    var dx = f[0] - k[0], dy = f[1] - k[1], L = Math.hypot(dx, dy) || 1;
    var toe = [f[0] + (dx / L) * 2 + LEN.foot * 0.8, f[1] + 2];
    var cap = capsule(f[0] - 4, f[1], toe[0], toe[1], 5.5, 4.5);
    cel(c, cap.path, back ? pal.metalSh : pal.metal, pal.metalSh, back ? null : pal.rim, pal.outline, 5.5, 1.8);
  }

  /* ---- energy / weapon FX layer, keyed by a pose's `fx` tag ---- */
  function jag(c, x0, y0, x1, y1, seg, amp, col, w) {
    c.strokeStyle = col; c.lineWidth = w; c.lineJoin = "round"; c.lineCap = "round";
    c.beginPath(); c.moveTo(x0, y0);
    for (var i = 1; i < seg; i++) {
      var tt = i / seg, mx = x0 + (x1 - x0) * tt + (Math.random() - 0.5) * amp, my = y0 + (y1 - y0) * tt + (Math.random() - 0.5) * amp;
      c.lineTo(mx, my);
    }
    c.lineTo(x1, y1); c.stroke();
  }
  function spark(c, x, y, R, pal, t) {
    c.save(); c.globalCompositeOperation = "lighter";
    var g = c.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, pal.energyCore); g.addColorStop(0.4, pal.energy); g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 7); c.fill();
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * 6.28 + t * 6;
      jag(c, x, y, x + Math.cos(a) * R, y + Math.sin(a) * R, 4, R * 0.4, pal.energyCore, 1.6);
    }
    c.restore();
  }
  function drawFx(c, S, pal, tag, t) {
    if (!tag) return;
    var hF = S.hnF, hB = S.hnB;
    if (tag === "boltCharge") { spark(c, hF[0], hF[1], 13, pal, t); }
    else if (tag === "boltRelease") {
      spark(c, hF[0], hF[1], 10, pal, t);
      c.save(); c.globalCompositeOperation = "lighter";
      jag(c, hF[0], hF[1], hF[0] + 30, hF[1] - 4, 6, 10, pal.energy, 3); c.restore();
    }
    else if (tag === "uppercutArc") {
      c.save(); c.globalCompositeOperation = "lighter";
      // an electric arc sweeping up the fist's path
      jag(c, S.hipF[0], S.hipF[1] + 6, hF[0], hF[1], 8, 16, pal.energy, 3);
      spark(c, hF[0], hF[1], 15, pal, t); c.restore();
    }
    else if (tag === "clapCharge") {
      c.save(); c.globalCompositeOperation = "lighter";
      jag(c, hF[0], hF[1], hB[0], hB[1], 7, 14, pal.energy, 2.4);
      spark(c, (hF[0] + hB[0]) / 2, (hF[1] + hB[1]) / 2, 14, pal, t); c.restore();
    }
    else if (tag === "clapSlam") {
      c.save(); c.globalCompositeOperation = "lighter";
      spark(c, hF[0], hF[1], 16, pal, t);
      for (var i = 0; i < 4; i++) jag(c, hF[0], hF[1] + 2, hF[0] + (i - 1.5) * 22, hF[1] + 8, 4, 8, pal.energy, 2.4);
      c.restore();
    }
  }

  /* ===================== the whole rigid figure ===================== */
  // Caller has already translated to the fighter's feet point and scaled x by
  // facing. We draw the rigid pose, apply the pose's optional whole-figure
  // rotation (KO topple — a rigid rotation, NOT a warp), and return the joint
  // set for hitbox anchoring + smear trails.
  function draw(c, pose, pal, t) {
    var S = skeleton(pose);
    c.save();
    if (pose.rot) { var pv = [0, -2]; c.translate(pv[0], pv[1]); c.rotate(pose.rot * D2R); c.translate(-pv[0], -pv[1]); }
    // BACK leg + arm (recede)
    chain(c, [S.hipB, S.knB, S.ftB], [8, 6, 4.6], pal, true); drawFoot(c, S.knB, S.ftB, pal, true);
    chain(c, [S.shB, S.elB, S.hnB], [6.5, 5, 4.2], pal, true); drawFist(c, S.hnB, pal, true);
    // TORSO
    drawTorso(c, S, pal);
    // FRONT leg
    chain(c, [S.hipF, S.knF, S.ftF], [9, 6.4, 4.8], pal, false); drawFoot(c, S.knF, S.ftF, pal, false);
    // HEAD
    drawHead(c, S, pal);
    // FRONT arm
    chain(c, [S.shF, S.elF, S.hnF], [7.5, 5.6, 4.6], pal, false); drawFist(c, S.hnF, pal, false);
    // FX
    drawFx(c, S, pal, pose.fx, t || 0);
    c.restore();
    return S;
  }

  /* ===================== PALETTES ===================== */
  var ZEUS = {
    skin: "#d8a15e", skinSh: "#a2702c", skinLi: "#f2c98c",
    hair: "#eef1f6", hairSh: "#b7bfcc",
    cloth: "#2f5fb0", clothSh: "#1b3c78",
    metal: "#f0c24a", metalSh: "#a9781c", rim: "#ffe9a8",
    outline: "#1c1409",
    energy: "#8fd0ff", energyCore: "#ffffff", energyGlow: "#3f7fff",
    eye: "#bfe3ff"
  };
  // Placeholder: deliberately the same body, recoloured to a desaturated
  // underworld palette so it reads as "not the finished god yet".
  var HADES = {
    placeholder: true,
    skin: "#9aa6ad", skinSh: "#5c686f", skinLi: "#c6cfd4",
    hair: "#26232c", hairSh: "#100e14",
    cloth: "#3c2c54", clothSh: "#241635",
    metal: "#6d5c88", metalSh: "#3d3056", rim: "#bda6e2",
    outline: "#0b0810",
    energy: "#b483ff", energyCore: "#efe6ff", energyGlow: "#6a3fd0",
    eye: "#caa9ff"
  };

  /* ===================== POSES (complete rigid stances) =====================
     Field key: r=[dx,dy] root offset (dy+ = lower/crouch), to=torso lean,
     hd=head tilt, fs/fe=front arm shoulder/forearm, bs/be=back arm,
     fh/fk=front leg hip/knee, bh/bk=back leg, rot=whole-figure rotation (KO),
     fx=energy tag. Front = toward the opponent. */
  var IDLE = { r: [0, 0], to: 9, hd: -3, fs: 120, fe: 44, bs: 150, be: 60, fh: 172, fk: 188, bh: 196, bk: 180 };
  function P(o) { var q = {}; for (var k in IDLE) q[k] = IDLE[k]; for (var j in o) q[j] = o[j]; return q; }

  var POSES = {
    idle:  P({}),
    idle2: P({ r: [0, -1], to: 8, fs: 122, fe: 46, bs: 151, be: 61, hd: -4 }),   // subtle breath

    // stance-locked advancing footwork (4-frame loop), guard maintained
    walkA: P({ to: 13, fh: 166, fk: 186, bh: 203, bk: 190, fs: 128, bs: 156 }),
    walkB: P({ r: [0, -3], to: 11, fh: 178, fk: 184, bh: 186, bk: 182, fs: 118, bs: 148 }),
    walkC: P({ to: 13, fh: 172, fk: 187, bh: 197, bk: 187, fs: 124, bs: 152 }),
    walkD: P({ r: [0, -3], to: 11, fh: 182, fk: 184, bh: 181, bk: 182, fs: 116, bs: 146 }),

    // PUNCH (light): coil -> full extension (held) -> retract
    punchWind: P({ to: 3, fs: 152, fe: 138, bs: 158, be: 84, fh: 174, fk: 190 }),
    punchHit:  P({ r: [7, 0], to: 15, hd: 2, fs: 90, fe: 84, bs: 172, be: 118, fh: 168, fk: 192, bh: 188, bk: 182 }),
    punchRec:  P({ r: [2, 0], to: 12, fs: 118, fe: 66, bs: 156, be: 66 }),

    // KICK: chamber (knee up) -> extend forward-high (held) -> retract
    kickWind: P({ r: [-3, 2], to: 2, fs: 122, fe: 44, bs: 150, be: 60, fh: 70, fk: 150, bh: 188, bk: 184 }),
    kickHit:  P({ r: [2, 1], to: -10, hd: 4, fs: 150, fe: 120, bs: 205, be: 150, fh: 80, fk: 78, bh: 190, bk: 185 }),
    kickRec:  P({ to: 6, fh: 120, fk: 150, bh: 190, bk: 184 }),

    // BLOCK: braced crouch, both forearms up in front
    block: P({ r: [-2, 4], to: 14, hd: -8, fs: 112, fe: 22, bs: 132, be: 34, fh: 176, fk: 196, bh: 198, bk: 184 }),

    // HIT-REACT: head/torso whip back, arms fly, stagger
    hit: P({ r: [-6, 0], to: -16, hd: -26, fs: 150, fe: 172, bs: 206, be: 190, fh: 168, fk: 176, bh: 202, bk: 190 }),

    // KO: recoil-fall, then a rigid backward topple to the ground
    ko1: P({ r: [-8, 2], to: -34, hd: -46, fs: 158, fe: 186, bs: 210, be: 196, fh: 150, fk: 170, bh: 208, bk: 196 }),
    ko2: P({ r: [-16, 44], to: -44, hd: -40, fs: 200, fe: 210, bs: 214, be: 208, fh: 128, fk: 150, bh: 118, bk: 150, rot: -78 }),

    // SIGNATURE 1 — KERAUNOS (thunderbolt throw): cock overhead -> hurl (spawn) -> settle
    boltWind:    P({ r: [-3, 0], to: -6, hd: -6, fs: -18, fe: -8, bs: 122, be: 80, fx: "boltCharge" }),
    boltRelease: P({ r: [7, 0], to: 18, hd: 2, fs: 70, fe: 80, bs: 182, be: 130, fx: "boltRelease" }),
    boltRec:     P({ r: [2, 0], to: 8, fs: 110, fe: 70, bs: 150, be: 66 }),

    // SIGNATURE 2 — ANABASIS (rising bolt-uppercut): coil low -> explode up (held) -> land
    upperWind: P({ r: [2, 12], to: 12, hd: 2, fs: 170, fe: 178, bs: 158, be: 120, fh: 176, fk: 204, bh: 200, bk: 206 }),
    upperHit:  P({ r: [0, -10], to: 6, hd: -10, fs: 10, fe: 5, bs: 190, be: 178, fh: 184, fk: 182, bh: 178, bk: 182, fx: "uppercutArc" }),
    upperRec:  P({ r: [0, 2], to: 10, fs: 62, fe: 40, bs: 150, be: 66 }),

    // SIGNATURE 3 — BRONTE (thunderclap overhead slam): raise both -> slam (shock) -> rise
    clapWind: P({ r: [0, -2], to: 2, hd: -6, fs: 6, fe: 4, bs: -6, be: -4, fh: 176, fk: 184, bh: 190, bk: 182, fx: "clapCharge" }),
    clapHit:  P({ r: [3, 8], to: 30, hd: 8, fs: 150, fe: 170, bs: 160, be: 174, fh: 172, fk: 200, bh: 196, bk: 200, fx: "clapSlam" }),
    clapRec:  P({ r: [1, 3], to: 14, fs: 120, fe: 60, bs: 130, be: 60 }),

    // VICTORY
    victory: P({ to: -2, hd: -6, fs: 18, fe: 2, bs: 150, be: 70, fh: 182, fk: 182, bh: 190, bk: 184, fx: "boltCharge" })
  };

  window.THEO = {
    LEN: LEN, skeleton: skeleton, draw: draw,
    POSES: POSES, ZEUS: ZEUS, HADES: HADES,
    pt: pt
  };
})();
