/* ==========================================================================
   THEOMACHY — painted Zeus rig (rigid cut-out, NO mesh warp)

   Uses Carter's painted Zeus parts. Each part is a RIGID image: placed with its
   proximal pivot on a skeleton joint and rotated so its own axis points down the
   bone. Uniform scale only — parts are never stretched, skewed, or mesh-skinned
   (that rubber-limb warp is exactly what we dropped). The smoothness/"Tekken
   movement" comes from the ENGINE interpolating these joint angles between key
   poses + secondary motion — not from deforming any part.

   Driven by the SAME pose angle fields as poses.js (to/hd/fs/fe/bs/be/fh/fk/bh/bk
   + r[]), so every authored Zeus pose composites the painted art with no re-authoring.
   ========================================================================== */
(function () {
  "use strict";
  var D2R = Math.PI / 180;
  function pt(ox, oy, a, L) { var r = a * D2R; return [ox + Math.sin(r) * L, oy - Math.cos(r) * L]; }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

  // proximal (P0, attaches to parent / rotation pivot) and distal (P1, child joint),
  // in each trimmed part's own pixel space. Tuned against the extracted art.
  var MAN = {
    head:      { P0: [205, 284] },                        // neck point at base of head
    torso:     { P0: [250, 470], P1: [246, 60] },         // hip(bottom) -> neck(top)
    upperArm:  { P0: [150, 55],  P1: [120, 420] },        // shoulder -> elbow
    foreArm:   { P0: [96, 26],   P1: [104, 250] },        // elbow -> wrist (hand hangs below)
    foreArmLit:{ P0: [150, 40],  P1: [176, 300] },
    thigh:     { P0: [150, 40],  P1: [124, 590] },        // hip -> knee
    thighBare: { P0: [138, 30],  P1: [120, 580] },
    shin:      { P0: [150, 40],  P1: [150, 470] },        // knee -> ankle (foot below)
    shinBare:  { P0: [118, 30],  P1: [110, 470] }
  };

  var IMG = {}, READY = false, PENDING = 0;
  var BASE = "art/zeus/";
  function load(scriptBase, cb) {
    var names = Object.keys(MAN); PENDING = names.length;
    names.forEach(function (n) {
      var im = new Image();
      im.onload = function () { if (--PENDING <= 0) { READY = true; cb && cb(); } };
      im.onerror = function () { if (--PENDING <= 0) { READY = (Object.keys(IMG).length > 6); cb && cb(); } };
      im.src = (scriptBase || "") + BASE + n + ".png";
      IMG[n] = im;
    });
  }

  // scale of the art in game space, and the derived rigid bone lengths
  var S = 0.125;
  var L = {
    torso: dist(MAN.torso.P0, MAN.torso.P1) * S,
    uArm: dist(MAN.upperArm.P0, MAN.upperArm.P1) * S,
    fArm: dist(MAN.foreArm.P0, MAN.foreArm.P1) * S,
    thigh: dist(MAN.thigh.P0, MAN.thigh.P1) * S,
    shin: dist(MAN.shin.P0, MAN.shin.P1) * S,
    shoulderHalf: 122 * S, hipHalf: 72 * S
  };

  // joint positions from a pose's angles (art proportions). Screen space, feet
  // baseline ~ y=0, +x = front. Same angle convention as poses.js.
  function skeleton(P) {
    var rx = (P.r && P.r[0]) || 0, ry = (P.r && P.r[1]) || 0;
    var pelvisY = -(L.thigh + L.shin) * 0.96;
    var pelvis = [rx, pelvisY + ry];
    var neck = pt(pelvis[0], pelvis[1], P.to, L.torso);
    var perp = pt(0, 0, P.to + 90, 1);
    var shF = [neck[0] + perp[0] * L.shoulderHalf, neck[1] + perp[1] * L.shoulderHalf - 2 * S * 0];
    var shB = [neck[0] - perp[0] * L.shoulderHalf, neck[1] - perp[1] * L.shoulderHalf];
    var hipF = [pelvis[0] + perp[0] * L.hipHalf, pelvis[1] + perp[1] * L.hipHalf];
    var hipB = [pelvis[0] - perp[0] * L.hipHalf, pelvis[1] - perp[1] * L.hipHalf];
    var elF = pt(shF[0], shF[1], P.fs, L.uArm), hnF = pt(elF[0], elF[1], P.fe, L.fArm);
    var elB = pt(shB[0], shB[1], P.bs, L.uArm), hnB = pt(elB[0], elB[1], P.be, L.fArm);
    var knF = pt(hipF[0], hipF[1], P.fh, L.thigh), ftF = pt(knF[0], knF[1], P.fk, L.shin);
    var knB = pt(hipB[0], hipB[1], P.bh, L.thigh), ftB = pt(knB[0], knB[1], P.bk, L.shin);
    return { pelvis: pelvis, neck: neck, shF: shF, shB: shB, hipF: hipF, hipB: hipB,
      elF: elF, hnF: hnF, elB: elB, hnB: hnB, knF: knF, ftF: ftF, knB: knB, ftB: ftB };
  }

  // draw one rigid part: proximal pivot -> J0, art axis rotated onto (J1-J0)
  function part(c, name, J0, J1, dark) {
    var im = IMG[name], m = MAN[name]; if (!im || !m || !m.P1) return;
    var artAxis = Math.atan2(m.P1[1] - m.P0[1], m.P1[0] - m.P0[0]);
    var bone = Math.atan2(J1[1] - J0[1], J1[0] - J0[0]);
    c.save();
    c.translate(J0[0], J0[1]); c.rotate(bone - artAxis); c.scale(S, S);
    c.drawImage(im, -m.P0[0], -m.P0[1]);
    if (dark) { c.globalCompositeOperation = "source-atop"; c.fillStyle = "rgba(10,8,26," + dark + ")"; c.fillRect(-m.P0[0], -m.P0[1], im.width, im.height); }
    c.restore();
  }
  function headPart(c, J0, angleDeg) {
    var im = IMG.head, m = MAN.head; if (!im) return;
    c.save(); c.translate(J0[0], J0[1]); c.rotate(angleDeg * D2R); c.scale(S, S);
    c.drawImage(im, -m.P0[0], -m.P0[1]); c.restore();
  }

  // draw the whole painted Zeus. Caller has translated to feet + scaled by facing.
  // `charged` swaps in the lightning torso/forearm for signature moves.
  function draw(c, P, opts) {
    opts = opts || {};
    var K = skeleton(P), DK = 0.42, charged = opts.charged;
    if (P.rot) { c.save(); c.rotate(P.rot * D2R); }
    // BACK leg (bare, darkened)
    part(c, "thighBare", K.hipB, K.knB, DK); part(c, "shinBare", K.knB, K.ftB, DK);
    // BACK arm (upper + fore, darkened)
    part(c, "upperArm", K.shB, K.elB, DK); part(c, "foreArm", K.elB, K.hnB, DK);
    // TORSO
    part(c, charged ? "torso" : "torso", K.pelvis, K.neck, 0);
    // FRONT leg (armored)
    part(c, "thigh", K.hipF, K.knF, 0); part(c, "shin", K.knF, K.ftF, 0);
    // HEAD (tilts with torso + head angle)
    headPart(c, K.neck, P.to + P.hd);
    // FRONT arm (armored, or lightning forearm when charged)
    part(c, "upperArm", K.shF, K.elF, 0);
    part(c, charged ? "foreArmLit" : "foreArm", K.elF, K.hnF, 0);
    if (P.rot) c.restore();
    return K;
  }

  window.THEO_PAINT = {
    load: load, draw: draw, skeleton: skeleton, ready: function () { return READY; },
    setScale: function (s) { S = s; L.torso = dist(MAN.torso.P0, MAN.torso.P1) * S; L.uArm = dist(MAN.upperArm.P0, MAN.upperArm.P1) * S; L.fArm = dist(MAN.foreArm.P0, MAN.foreArm.P1) * S; L.thigh = dist(MAN.thigh.P0, MAN.thigh.P1) * S; L.shin = dist(MAN.shin.P0, MAN.shin.P1) * S; L.shoulderHalf = 122 * S; L.hipHalf = 72 * S; },
    MAN: MAN
  };
})();
