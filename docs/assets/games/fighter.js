/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Theomachy — War of the Gods" (1v1 fighter)

   Hidden inside the ch08 (Early Greece) sigil. A duel of the Olympians, each
   god fought with the weapon myth actually gives them (Zeus's thunderbolt,
   Poseidon's trident, Athena's aegis-spear, Hades' bident) — every fighter's
   arms and epithet grounded in the Early Greece chapter.

   This is the ART-FIRST slice: one god (Zeus) rendered to a high finish with a
   skeletal pose rig (idle / advance / strike / channel), an Olympus stage, a
   full HP + energy HUD, and a playable loop against a training Shade, so the
   look can be judged before the rest of the roster, the character-select, the
   finishers, and full AI + local two-player are built out.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  AG.register("fighter", {
    title: "Theomachy",
    subtitle: "War of the Gods — a duel of the Olympians, drawn from real myth.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch08) || "",
    sourceHref: "chapters/ch08.html", sourceLabel: "Read “Early Greece”",
    mount: mountGame
  });

  // ---- small helpers ----
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function mountGame(root, ctx) {
    var VW = 660, VH = 330, GROUND = VH - 34, DPR = 1;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var C = {
      ground: v("--ground", "#140d07"), panel: v("--panel", "#1e150d"),
      gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"),
      ink: v("--ink", "#cdbb96"), parch: v("--parchment", "#e6dabf"), line: v("--line", "#3a2c1a"),
      good: v("--good", "#7e9e5c"), warn: v("--warn", "#c2954e")
    };

    var canvas, cx, hudEl, raf = null, keyfn = null, keyup = null, last = 0, running = false;
    var keys = {};
    var p1, p2, stage, banner, flash = 0, motes = [];

    /* ======================= the figure rig ======================= */
    // Base idle pose: joints in local space, feet baseline at y=0, up is -y,
    // facing +x. Each fighter is drawn from this rig, re-skinned per god.
    var BASE = {
      footB: [-12, 0], kneeB: [-9, -42], footF: [17, 0], kneeF: [15, -42],
      hip: [3, -80], chest: [5, -122], neck: [6, -134], head: [7, -152],
      shF: [12, -128], elF: [28, -112], hnF: [42, -98],
      shB: [-1, -128], elB: [-15, -110], hnB: [-24, -94]
    };
    function clonePose(p) { var o = {}; for (var k in p) o[k] = [p[k][0], p[k][1]]; return o; }
    function add(p, k, dx, dy) { p[k][0] += dx; p[k][1] += dy; }

    // Build the animated pose for a fighter from its state + time.
    function poseFor(f, t) {
      var p = clonePose(BASE);
      var br = Math.sin(t * 2.2 + f.phase) * 1.6;          // breathing
      add(p, "chest", 0, -br * 0.5); add(p, "neck", 0, -br * 0.6); add(p, "head", 0, -br * 0.7);
      add(p, "shF", 0, -br * 0.4); add(p, "shB", 0, -br * 0.4);
      var st = f.state, pr = clamp(f.stTime / f.stDur, 0, 1);
      if (st === "walk") {
        var w = Math.sin(t * 8 + f.phase) * 10;
        add(p, "footF", w, -Math.max(0, w) * 0.6); add(p, "kneeF", w * 0.6, 0);
        add(p, "footB", -w, -Math.max(0, -w) * 0.6); add(p, "kneeB", -w * 0.6, 0);
        add(p, "hnF", 0, w * 0.3); add(p, "hnB", 0, -w * 0.3);
      } else if (st === "jump") {
        add(p, "footF", 4, 8); add(p, "footB", -6, 6); add(p, "kneeF", 2, 6); add(p, "kneeB", -2, 6);
        add(p, "hnF", 6, -14); add(p, "hnB", -6, -16);
      } else if (st === "block") {
        add(p, "hnF", -18, 6); add(p, "elF", -14, 4); add(p, "hnB", -4, 2); add(p, "chest", -4, 0); add(p, "head", -3, 0);
      } else if (st === "light" || st === "heavy") {
        var big = st === "heavy" ? 1 : 0.66, k = ease(pr < 0.4 ? pr / 0.4 : 1 - (pr - 0.4) / 0.6);
        add(p, "hnF", 26 * big * k, -10 * big * k); add(p, "elF", 16 * big * k, -4 * big * k);
        add(p, "chest", 6 * big * k, 0); add(p, "head", 5 * big * k, 0); add(p, "hip", 3 * big * k, 0);
        add(p, "footF", 8 * big * k, 0);
      } else if (st === "special") {
        var up = ease(clamp(pr * 1.6, 0, 1));
        add(p, "hnF", 4 * up, -46 * up); add(p, "elF", 2 * up, -34 * up); add(p, "shF", 0, -8 * up);
        add(p, "hnB", -6 * up, -30 * up); add(p, "elB", -4 * up, -22 * up);
        add(p, "head", 0, -3 * up); add(p, "chest", 0, -2 * up);
      } else if (st === "hit") {
        var s = (1 - pr); add(p, "head", -8 * s, 0); add(p, "chest", -6 * s, 0); add(p, "hnF", -6 * s, 4 * s); add(p, "hnB", -8 * s, 2 * s);
      } else if (st === "ko") {
        // topple backward
        var kk = ease(pr);
        for (var j in p) { var pt = p[j]; var ang = -1.35 * kk; var x = pt[0], y = pt[1]; p[j] = [x * Math.cos(ang) - y * Math.sin(ang) - 40 * kk, x * Math.sin(ang) + y * Math.cos(ang)]; }
      }
      return p;
    }

    /* --------- drawing primitives (sculpted, rim-lit gilded limbs) --------- */
    // A muscled bone: a tapered shape with a bulge on the outer edge, filled with
    // a bronze gradient, dark contour, and a gold rim-light along the lit edge.
    function bone(c, ax, ay, bx, by, w1, w2, skin, opt) {
      opt = opt || {};
      var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      var bulge = (opt.bulge == null ? 1.18 : opt.bulge);
      var mx = (ax + bx) / 2 + nx * Math.max(w1, w2) * bulge, my = (ay + by) / 2 + ny * Math.max(w1, w2) * bulge;
      var mx2 = (ax + bx) / 2 - nx * Math.max(w1, w2) * (bulge * 0.72), my2 = (ay + by) / 2 - ny * Math.max(w1, w2) * (bulge * 0.72);
      c.beginPath();
      c.moveTo(ax + nx * w1, ay + ny * w1);
      c.quadraticCurveTo(mx, my, bx + nx * w2, by + ny * w2);
      c.arc(bx, by, w2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
      c.quadraticCurveTo(mx2, my2, ax - nx * w1, ay - ny * w1);
      c.arc(ax, ay, w1, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
      c.closePath();
      var g = c.createLinearGradient(ax + nx * w1, ay + ny * w1, ax - nx * w1, ay - ny * w1);
      g.addColorStop(0, opt.back ? skin.back : skin.lit); g.addColorStop(0.55, skin.mid); g.addColorStop(1, skin.dark);
      c.fillStyle = g; c.fill();
      c.strokeStyle = skin.edge; c.lineWidth = 1.1; c.stroke();
      if (!opt.back) {
        c.beginPath(); c.moveTo(ax + nx * (w1 - 1), ay + ny * (w1 - 1)); c.quadraticCurveTo(mx, my, bx + nx * (w2 - 1), by + ny * (w2 - 1));
        c.strokeStyle = skin.rim; c.lineWidth = 1.3; c.globalAlpha = .85; c.stroke(); c.globalAlpha = 1;
      }
    }
    // legacy name kept for the shade/opponent calls
    function limb(c, ax, ay, bx, by, w1, w2, skinOrFill, outline) {
      if (typeof skinOrFill === "object") return bone(c, ax, ay, bx, by, w1, w2, skinOrFill, {});
      var dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      c.beginPath(); c.moveTo(ax + nx * w1, ay + ny * w1); c.lineTo(bx + nx * w2, by + ny * w2);
      c.lineTo(bx - nx * w2, by - ny * w2); c.lineTo(ax - nx * w1, ay - ny * w1); c.closePath();
      c.fillStyle = skinOrFill; c.fill();
      c.beginPath(); c.arc(ax, ay, w1, 0, 7); c.arc(bx, by, w2, 0, 7); c.fillStyle = skinOrFill; c.fill();
      if (outline) { c.strokeStyle = outline; c.lineWidth = 1; c.stroke(); }
    }

    // Draw a fighter at world x, facing dir (+1 right / -1 left)
    function drawFighter(c, f, t) {
      var p = poseFor(f, t), skin = f.skin;
      c.save();
      c.translate(f.x, GROUND - (f.y || 0));
      c.scale(f.facing, 1);
      // ground shadow
      c.save(); c.scale(1, 0.30); c.globalAlpha = 0.42; c.fillStyle = "#000";
      c.beginPath(); c.arc(2, (f.y || 0) * 0.9 + 6, 30, 0, 7); c.fill(); c.restore();

      // cape / mantle behind
      drawCape(c, p, t, f, skin);
      // back leg + back arm (depth-dimmed)
      bone(c, p.hip[0] - 6, p.hip[1], p.kneeB[0], p.kneeB[1], 8, 6, skin, { back: true });
      bone(c, p.kneeB[0], p.kneeB[1], p.footB[0], p.footB[1], 6, 4.5, skin, { back: true });
      drawSandal(c, p.footB, skin, true);
      bone(c, p.shB[0], p.shB[1], p.elB[0], p.elB[1], 6.5, 5, skin, { back: true });
      bone(c, p.elB[0], p.elB[1], p.hnB[0], p.hnB[1], 5, 4, skin, { back: true });

      // torso + himation
      drawTorso(c, p, skin);

      // front leg
      bone(c, p.hip[0] + 4, p.hip[1], p.kneeF[0], p.kneeF[1], 9.5, 7, skin, { bulge: 1.32 });
      bone(c, p.kneeF[0], p.kneeF[1], p.footF[0], p.footF[1], 7, 4.6, skin, { bulge: 1.35 });
      drawSandal(c, p.footF, skin, false);

      // head
      drawHead(c, p, skin, t, f);

      // front arm + weapon
      bone(c, p.shF[0], p.shF[1], p.elF[0], p.elF[1], 7.5, 6, skin, { bulge: 1.3 });
      drawPauldron(c, p.shF, skin);
      bone(c, p.elF[0], p.elF[1], p.hnF[0], p.hnF[1], 6, 4.4, skin, { bulge: 1.28 });
      skin.weapon(c, p, t, f, skin);

      c.restore();
    }

    function drawPauldron(c, sh, skin) {
      c.beginPath(); c.ellipse(sh[0] + 1, sh[1] - 1, 9, 7, -0.3, 0, 7);
      var g = c.createLinearGradient(sh[0] - 8, sh[1] - 8, sh[0] + 8, sh[1] + 6);
      g.addColorStop(0, skin.rim); g.addColorStop(0.5, skin.goldTrim); g.addColorStop(1, skin.dark);
      c.fillStyle = g; c.fill(); c.strokeStyle = skin.edge; c.lineWidth = 1; c.stroke();
      c.beginPath(); c.arc(sh[0] + 1, sh[1] - 1, 2, 0, 7); c.fillStyle = skin.edge; c.fill();
    }

    function drawTorso(c, p, skin) {
      // sculpted torso silhouette (broad chest tapering to waist)
      c.beginPath();
      c.moveTo(p.shB[0] - 3, p.shB[1] + 1);
      c.quadraticCurveTo(p.chest[0] - 20, p.chest[1] + 4, p.hip[0] - 12, p.hip[1] + 2);
      c.quadraticCurveTo(p.hip[0] - 2, p.hip[1] + 8, p.hip[0] + 13, p.hip[1] + 2);
      c.quadraticCurveTo(p.chest[0] + 24, p.chest[1] + 2, p.shF[0] + 5, p.shF[1]);
      c.quadraticCurveTo(p.neck[0] + 6, p.neck[1] + 3, p.neck[0] - 5, p.neck[1] + 3);
      c.closePath();
      var g = c.createLinearGradient(p.shB[0] - 10, p.chest[1], p.shF[0] + 12, p.chest[1]);
      g.addColorStop(0, skin.back); g.addColorStop(0.5, skin.mid); g.addColorStop(0.85, skin.lit); g.addColorStop(1, skin.rim);
      c.fillStyle = g; c.fill(); c.strokeStyle = skin.edge; c.lineWidth = 1.2; c.stroke();
      // engraved musculature
      c.strokeStyle = "rgba(20,13,7,.42)"; c.lineWidth = 1;
      c.beginPath(); c.moveTo(p.chest[0] - 13, p.chest[1] + 1); c.quadraticCurveTo(p.chest[0] - 1, p.chest[1] + 12, p.chest[0] + 15, p.chest[1] + 1); c.stroke(); // pecs
      c.beginPath(); c.moveTo(p.chest[0] + 2, p.chest[1] + 13); c.lineTo(p.hip[0] + 1, p.hip[1] - 5); c.stroke(); // linea alba
      for (var a = 0; a < 3; a++) { var yy = p.chest[1] + 16 + a * 7; c.beginPath(); c.moveTo(p.chest[0] - 8, yy); c.lineTo(p.chest[0] + 10, yy); c.stroke(); } // abs
      // rim light on the lit contour
      c.beginPath(); c.moveTo(p.shF[0] + 5, p.shF[1]); c.quadraticCurveTo(p.chest[0] + 22, p.chest[1] + 2, p.hip[0] + 12, p.hip[1] + 2);
      c.strokeStyle = skin.rim; c.lineWidth = 1.4; c.globalAlpha = .8; c.stroke(); c.globalAlpha = 1;
      // himation drape (folded cloth over shoulder & waist)
      c.beginPath();
      c.moveTo(p.shF[0] + 6, p.shF[1] - 3);
      c.quadraticCurveTo(p.chest[0] + 6, p.chest[1] + 14, p.hip[0] - 14, p.hip[1] + 4);
      c.lineTo(p.hip[0] - 6, p.hip[1] + 8);
      c.quadraticCurveTo(p.chest[0] + 14, p.chest[1] + 16, p.shF[0] + 13, p.shF[1] - 1);
      c.closePath();
      var cg = c.createLinearGradient(p.shF[0], p.shF[1], p.hip[0] - 10, p.hip[1]);
      cg.addColorStop(0, skin.cloth); cg.addColorStop(1, skin.clothShade || skin.dark);
      c.fillStyle = cg; c.globalAlpha = .95; c.fill(); c.globalAlpha = 1;
      c.strokeStyle = skin.edge; c.lineWidth = .8; c.stroke();
      // cloth folds
      c.strokeStyle = "rgba(20,13,7,.35)"; c.lineWidth = .8;
      c.beginPath(); c.moveTo(p.shF[0] + 9, p.shF[1] + 2); c.quadraticCurveTo(p.chest[0] + 8, p.chest[1] + 14, p.hip[0] - 8, p.hip[1] + 4); c.stroke();
      // belt (girdle)
      c.fillStyle = skin.dark; c.fillRect(p.hip[0] - 13, p.hip[1] - 3, 26, 5);
      c.strokeStyle = skin.edge; c.strokeRect(p.hip[0] - 13, p.hip[1] - 3, 26, 5);
      c.fillStyle = skin.goldTrim; c.beginPath(); c.arc(p.hip[0], p.hip[1] - 0.5, 3.2, 0, 7); c.fill();
      c.strokeStyle = skin.edge; c.lineWidth = .8; c.stroke();
    }

    function drawSandal(c, foot, skin, back) {
      c.fillStyle = back ? skin.back : skin.dark; c.strokeStyle = skin.edge; c.lineWidth = 1;
      c.beginPath(); c.ellipse(foot[0] + 4, foot[1] - 1, 10, 4.2, 0, 0, 7); c.fill(); c.stroke();
      if (!back) { c.strokeStyle = skin.goldTrim; c.lineWidth = 1; c.beginPath(); c.moveTo(foot[0] - 2, foot[1] - 3); c.lineTo(foot[0] + 4, foot[1] - 6); c.stroke(); }
    }

    function drawHead(c, p, skin, t, f) {
      var hx = p.head[0], hy = p.head[1];
      // neck
      bone(c, p.neck[0], p.neck[1], hx - 1, hy + 8, 5.5, 6.5, skin, { bulge: 1.05 });
      // hair mane behind
      c.beginPath(); c.moveTo(hx - 12, hy - 6);
      c.quadraticCurveTo(hx - 16, hy + 10, hx - 8, hy + 16); c.quadraticCurveTo(hx - 14, hy + 2, hx - 11, hy - 10);
      c.quadraticCurveTo(hx - 4, hy - 18, hx + 4, hy - 14); c.closePath();
      c.fillStyle = skin.hair; c.fill(); c.strokeStyle = skin.edge; c.lineWidth = .8; c.stroke();
      // face (Greek profile: brow, straight nose, jaw)
      c.beginPath();
      c.moveTo(hx - 6, hy - 11);
      c.quadraticCurveTo(hx + 9, hy - 12, hx + 11, hy - 3);   // brow to bridge
      c.lineTo(hx + 15, hy + 1);                              // straight nose
      c.lineTo(hx + 10, hy + 3);                              // under nose
      c.quadraticCurveTo(hx + 12, hy + 6, hx + 8, hy + 9);    // lips/chin
      c.quadraticCurveTo(hx + 2, hy + 12, hx - 6, hy + 8);    // jaw
      c.quadraticCurveTo(hx - 11, hy - 2, hx - 6, hy - 11);   // back of head
      c.closePath();
      var fg = c.createLinearGradient(hx - 8, hy, hx + 14, hy);
      fg.addColorStop(0, skin.mid); fg.addColorStop(0.7, skin.lit); fg.addColorStop(1, skin.rim);
      c.fillStyle = fg; c.fill(); c.strokeStyle = skin.edge; c.lineWidth = 1.1; c.stroke();
      // brow + eye
      c.strokeStyle = "rgba(20,13,7,.5)"; c.lineWidth = 1; c.beginPath(); c.moveTo(hx + 2, hy - 4); c.lineTo(hx + 9, hy - 3); c.stroke();
      c.save(); c.shadowColor = skin.aura; c.shadowBlur = 6; c.fillStyle = skin.aura;
      c.beginPath(); c.arc(hx + 6, hy - 1, 1.5, 0, 7); c.fill(); c.restore();
      // flowing beard in locks
      c.beginPath();
      c.moveTo(hx - 7, hy + 7);
      c.quadraticCurveTo(hx + 6, hy + 12, hx + 9, hy + 8);
      c.quadraticCurveTo(hx + 12, hy + 22, hx + 3, hy + 30);
      c.quadraticCurveTo(hx - 2, hy + 33, hx - 6, hy + 28);
      c.quadraticCurveTo(hx - 13, hy + 20, hx - 7, hy + 7);
      c.closePath();
      var bg = c.createLinearGradient(hx - 8, hy + 8, hx + 8, hy + 28);
      bg.addColorStop(0, skin.hair); bg.addColorStop(1, skin.hairShade || skin.dark);
      c.fillStyle = bg; c.fill(); c.strokeStyle = skin.edge; c.lineWidth = .8; c.stroke();
      c.strokeStyle = "rgba(20,13,7,.3)"; c.lineWidth = .7;
      c.beginPath(); c.moveTo(hx - 2, hy + 12); c.quadraticCurveTo(hx, hy + 22, hx - 2, hy + 28); c.stroke();
      c.beginPath(); c.moveTo(hx + 4, hy + 12); c.quadraticCurveTo(hx + 6, hy + 20, hx + 2, hy + 27); c.stroke();
      // crown / laurel
      skin.crown(c, hx, hy, skin);
    }

    function drawCape(c, p, t, f, skin) {
      if (!skin.cape) return;
      var sway = Math.sin(t * 1.8 + f.phase) * 9 + (f.vx || 0) * -7;
      c.beginPath();
      c.moveTo(p.shB[0] + 2, p.shB[1] - 2);
      c.quadraticCurveTo(-46 + sway, -78, -40 + sway * 1.5, 6);
      c.quadraticCurveTo(-30 + sway, 2, -18, -2);
      c.quadraticCurveTo(-6, -8, p.hip[0] - 8, p.hip[1] + 2);
      c.closePath();
      var g = c.createLinearGradient(-46, -128, 4, 0);
      g.addColorStop(0, skin.cape); g.addColorStop(1, skin.capeDark || skin.dark);
      c.fillStyle = g; c.globalAlpha = .96; c.fill(); c.globalAlpha = 1;
      c.strokeStyle = skin.edge; c.lineWidth = 1; c.stroke();
      // fold lines
      c.strokeStyle = "rgba(20,13,7,.35)"; c.lineWidth = .8;
      c.beginPath(); c.moveTo(p.shB[0], p.shB[1]); c.quadraticCurveTo(-30 + sway, -50, -24 + sway, 4); c.stroke();
    }

    /* ======================= god skins ======================= */
    function laurel(c, hx, hy, skin) {
      c.save(); c.shadowColor = skin.goldTrim; c.shadowBlur = 4;
      c.strokeStyle = skin.goldTrim; c.lineWidth = 1.6;
      c.beginPath(); c.arc(hx - 1, hy - 4, 14, Math.PI * 0.92, Math.PI * 2.02); c.stroke();
      for (var i = 0; i < 7; i++) {
        var a = Math.PI * 0.98 + i * 0.15, lx = hx - 1 + Math.cos(a) * 14, ly = hy - 4 + Math.sin(a) * 14;
        c.beginPath(); c.ellipse(lx, ly - 1, 3.6, 1.5, a + 1.3, 0, 7); c.fillStyle = skin.goldTrim; c.fill();
      }
      c.restore();
    }

    function zeusBolt(c, p, t, f, skin) {
      var hx = p.hnF[0], hy = p.hnF[1];
      var charging = (f.state === "special");
      var glow = charging ? 16 : 8;
      // grip
      c.strokeStyle = skin.goldTrim; c.lineWidth = 3; c.beginPath(); c.moveTo(hx - 3, hy + 4); c.lineTo(hx + 3, hy - 4); c.stroke();
      // the keraunos — a double zig-zag lightning bundle
      c.save(); c.translate(hx, hy);
      var pulse = 0.7 + Math.sin(t * 22) * 0.3;
      c.shadowColor = "#bfe3ff"; c.shadowBlur = glow * pulse;
      function bolt(dir) {
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(6 * dir, -10 * dir); c.lineTo(-2 * dir, -12 * dir); c.lineTo(8 * dir, -26 * dir);
        c.lineTo(1 * dir, -24 * dir); c.lineTo(7 * dir, -40 * dir);
        c.lineWidth = 2.4; c.strokeStyle = "#eaf5ff"; c.stroke();
        c.lineWidth = 1; c.strokeStyle = skin.goldTrim; c.stroke();
      }
      bolt(1); bolt(-1);
      c.restore();
      // channelled aura: arcs around Zeus
      if (charging || f.aura > 0) {
        var n = 5, R = 40;
        c.save(); c.strokeStyle = "rgba(191,227,255,.8)"; c.lineWidth = 1.4; c.shadowColor = "#bfe3ff"; c.shadowBlur = 10;
        for (var i = 0; i < n; i++) {
          var a0 = t * 3 + i * (6.28 / n), a1 = a0 + 0.5;
          c.beginPath();
          c.moveTo(Math.cos(a0) * R, -70 + Math.sin(a0) * R * 0.5);
          c.lineTo(Math.cos((a0 + a1) / 2) * (R - 8), -70 + Math.sin((a0 + a1) / 2) * R * 0.5);
          c.lineTo(Math.cos(a1) * R, -70 + Math.sin(a1) * R * 0.5);
          c.stroke();
        }
        c.restore();
      }
    }

    var ZEUS = {
      id: "zeus", name: "Zeus", epithet: "King of the Olympians",
      lit: "#d9b06a", mid: "#a87c40", dark: "#5a3f1f", back: "#4a3319", edge: "#241a0e", rim: "#f2d999",
      hair: "#efe3c4", hairShade: "#bfae86", cloth: "#e6dabf", clothShade: "#b3a37e",
      cape: "#8a5426", capeDark: "#331f0c",
      goldTrim: "#e7c680", aura: "#bfe3ff",
      crown: laurel, weapon: zeusBolt
    };
    // training Shade — a dark echo, so two figures are on screen to judge scale
    function shadeBlade(c, p, t, f, skin) {
      var hx = p.hnF[0], hy = p.hnF[1];
      c.save(); c.shadowColor = skin.aura; c.shadowBlur = 8;
      c.strokeStyle = "#c9b7e6"; c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + 4, hy - 34); c.stroke();
      c.strokeStyle = skin.goldTrim; c.lineWidth = 1; c.stroke();
      c.restore();
    }
    function noCrown(c, hx, hy, skin) {
      c.strokeStyle = skin.edge; c.lineWidth = 1.2;
      c.beginPath(); c.arc(hx - 1, hy - 6, 12, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    }
    var SHADE = {
      id: "shade", name: "Shade of the Styx", epithet: "a training echo",
      lit: "#3a3157", mid: "#2b2440", dark: "#14101f", back: "#100c1a", edge: "#5a4a7a", rim: "#7c66a8",
      hair: "#241d38", hairShade: "#100c1a", cloth: "#3a3152", clothShade: "#221c34",
      cape: "#241d38", capeDark: "#0c0814",
      goldTrim: "#8f79c0", aura: "#9c7ad0",
      crown: noCrown, weapon: shadeBlade
    };

    /* ======================= fighter entities ======================= */
    function Fighter(skin, x, facing, isAI) {
      return {
        skin: skin, x: x, facing: facing, isAI: isAI, vx: 0, vy: 0, y: 0, onGround: true,
        hp: 100, energy: 0, state: "idle", stTime: 0, stDur: 1, phase: Math.random() * 6,
        aura: 0, cooldown: 0, hitLock: 0, combo: 0
      };
    }
    function setState(f, s, dur) { if (f.state === s) return; f.state = s; f.stTime = 0; f.stDur = dur || 0.4; }

    /* ======================= stage ======================= */
    function drawStage(c, t) {
      // twilight Olympus sky
      var sky = c.createLinearGradient(0, 0, 0, VH);
      sky.addColorStop(0, "#241a2e"); sky.addColorStop(0.45, "#3a2740"); sky.addColorStop(0.7, C.ember); sky.addColorStop(1, "#2a1a0e");
      c.fillStyle = sky; c.fillRect(0, 0, VW, VH);
      if (flash > 0) { c.fillStyle = "rgba(210,230,255," + (flash * 0.5) + ")"; c.fillRect(0, 0, VW, VH); }
      // sun/moon disc
      c.save(); c.globalAlpha = .5; c.fillStyle = C.goldB; c.beginPath(); c.arc(VW * 0.5, VH * 0.36, 40, 0, 7); c.fill(); c.restore();
      // distant mountains
      c.fillStyle = "rgba(20,13,7,.55)";
      c.beginPath(); c.moveTo(0, GROUND);
      for (var m = 0; m <= VW; m += 60) c.lineTo(m, GROUND - 60 - Math.sin(m * 0.03) * 40 - (m % 120 ? 0 : 30));
      c.lineTo(VW, GROUND); c.closePath(); c.fill();
      // classical colonnade (silhouette with gold rims)
      for (var i = 0; i < 6; i++) {
        var colx = 40 + i * 120, cw = 22, top = GROUND - 150;
        var g = c.createLinearGradient(colx, 0, colx + cw, 0);
        g.addColorStop(0, "#1a130c"); g.addColorStop(0.5, "#2a2013"); g.addColorStop(1, "#120c07");
        c.fillStyle = g; c.fillRect(colx, top, cw, 150);
        c.strokeStyle = "rgba(199,154,84,.35)"; c.lineWidth = 1; c.strokeRect(colx, top, cw, 150);
        c.fillStyle = "#241a10"; c.fillRect(colx - 5, top - 8, cw + 10, 8); c.fillRect(colx - 5, GROUND - 6, cw + 10, 6);
        // fluting
        c.strokeStyle = "rgba(20,13,7,.5)"; for (var fl = 1; fl < 4; fl++) { c.beginPath(); c.moveTo(colx + fl * cw / 4, top); c.lineTo(colx + fl * cw / 4, GROUND); c.stroke(); }
      }
      // marble floor
      var fl2 = c.createLinearGradient(0, GROUND, 0, VH);
      fl2.addColorStop(0, "#2a2013"); fl2.addColorStop(1, "#0d0906");
      c.fillStyle = fl2; c.fillRect(0, GROUND, VW, VH - GROUND);
      c.strokeStyle = "rgba(199,154,84,.25)"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, GROUND); c.lineTo(VW, GROUND); c.stroke();
      // drifting gold motes
      for (var k = 0; k < motes.length; k++) {
        var mo = motes[k]; c.globalAlpha = mo.a; c.fillStyle = C.goldB;
        c.beginPath(); c.arc(mo.x, mo.y, mo.r, 0, 7); c.fill();
      }
      c.globalAlpha = 1;
    }

    /* ======================= combat ======================= */
    function tryAttack(f, other, kind) {
      if (f.cooldown > 0 || f.state === "hit" || f.state === "ko" || !f.onGround) return;
      if (kind === "special" && f.energy < 50) return;
      setState(f, kind === "special" ? "special" : kind, kind === "heavy" ? 0.5 : kind === "special" ? 0.85 : 0.34);
      f.cooldown = kind === "heavy" ? 0.55 : kind === "special" ? 0.95 : 0.38;
      if (kind === "special") { f.energy -= 50; f.aura = 1; flash = 0.6; }
      f._hitPending = { kind: kind, at: kind === "special" ? 0.35 : 0.18, done: false };
    }
    function resolveHit(f, other, kind) {
      var reach = kind === "special" ? 150 : kind === "heavy" ? 74 : 58;
      var dx = (other.x - f.x) * f.facing;
      if (dx > 0 && dx < reach && Math.abs(other.hp) > 0 && other.state !== "ko") {
        var dmg = kind === "special" ? 22 : kind === "heavy" ? 12 : 6;
        var blocked = other.state === "block" && (other.facing !== f.facing);
        if (blocked) dmg = Math.round(dmg * 0.25);
        other.hp = clamp(other.hp - dmg, 0, 100);
        f.energy = clamp(f.energy + (kind === "special" ? 4 : 9), 0, 100);
        other.energy = clamp(other.energy + 5, 0, 100);
        if (!blocked) { setState(other, "hit", 0.32); other.hitLock = 0.32; other.vx = f.facing * (kind === "heavy" ? 3.2 : kind === "special" ? 5 : 1.8); f.combo++; }
        else { other.vx = f.facing * 1.2; }
        if (kind === "special") { flash = 0.7; }
        if (other.hp <= 0) { setState(other, "ko", 1.1); banner = { txt: f.skin.name + " prevails", t: 2.4 }; }
        spark(other.x, GROUND - 70, kind === "special" ? "#bfe3ff" : C.goldB);
      }
    }
    var sparks = [];
    function spark(x, y, col) { for (var i = 0; i < 10; i++) sparks.push({ x: x, y: y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1, life: 1, col: col }); }

    /* ======================= AI ======================= */
    function think(f, other, dt) {
      if (f.state === "hit" || f.state === "ko") return;
      var dx = (other.x - f.x), adx = Math.abs(dx), dir = dx > 0 ? 1 : -1;
      f.facing = dir;
      f.aiT = (f.aiT || 0) - dt;
      if (adx > 70) { f.intent = "advance"; }
      else if (f.aiT <= 0) {
        var r = Math.random();
        f.intent = r < 0.5 ? "light" : r < 0.72 ? "heavy" : r < 0.86 ? "block" : (f.energy >= 50 ? "special" : "light");
        f.aiT = 0.4 + Math.random() * 0.6;
      }
      if (f.intent === "advance") { f.vx = dir * 1.5; if (f.onGround && f.state !== "walk") setState(f, "walk", 1); }
      else if (f.intent === "block") { if (f.state === "idle" || f.state === "walk") setState(f, "block", 0.5); f.vx = 0; }
      else if (f.intent === "light" || f.intent === "heavy" || f.intent === "special") { tryAttack(f, other, f.intent); f.intent = "wait"; }
      else { f.vx = 0; if (f.state === "walk") setState(f, "idle", 1); }
    }

    /* ======================= HUD ======================= */
    function renderHUD() {
      function bar(f, side) {
        var hpPct = clamp(f.hp, 0, 100), enPct = clamp(f.energy, 0, 100);
        return '<div class="fg-side fg-' + side + '">' +
          '<div class="fg-name">' + f.skin.name + ' <span>' + f.skin.epithet + '</span></div>' +
          '<div class="fg-hp"><i style="width:' + hpPct + '%"></i></div>' +
          '<div class="fg-en"><i style="width:' + enPct + '%"></i></div></div>';
      }
      hudEl.innerHTML = bar(p1, "l") + '<div class="fg-mid"><span class="fg-vs">✦</span></div>' + bar(p2, "r");
    }

    /* ======================= loop ======================= */
    function frame(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
      var t = ts / 1000;
      // update motes
      for (var i = 0; i < motes.length; i++) { var mo = motes[i]; mo.y -= mo.v * dt * 30; mo.x += Math.sin(t + i) * 0.2; if (mo.y < 0) { mo.y = VH; mo.x = Math.random() * VW; } }
      flash = Math.max(0, flash - dt * 2);
      [p1, p2].forEach(function (f) { update(f, f === p1 ? p2 : p1, dt, t); });
      // sparks
      for (var s = sparks.length - 1; s >= 0; s--) { var sp = sparks[s]; sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.3; sp.life -= dt * 2; if (sp.life <= 0) sparks.splice(s, 1); }
      // draw
      cx.clearRect(0, 0, VW, VH);
      drawStage(cx, t);
      var order = p1.x < p2.x ? [p1, p2] : [p2, p1];
      drawFighter(cx, order[0], t); drawFighter(cx, order[1], t);
      for (var k = 0; k < sparks.length; k++) { var q = sparks[k]; cx.globalAlpha = clamp(q.life, 0, 1); cx.fillStyle = q.col; cx.beginPath(); cx.arc(q.x, q.y, 2, 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
      if (p1.combo > 1 && p1.state !== "ko") comboText(cx, p1.combo);
      if (banner) { drawBanner(cx, t); banner.t -= dt; if (banner.t <= 0) banner = null; }
      renderHUD();
      raf = requestAnimationFrame(frame);
    }

    function update(f, other, dt, t) {
      f.stTime += dt; f.cooldown = Math.max(0, f.cooldown - dt); f.hitLock = Math.max(0, f.hitLock - dt); f.aura = Math.max(0, f.aura - dt * 0.7);
      f.energy = clamp(f.energy + dt * 3, 0, 100); // slow passive charge
      // pending hit windows
      if (f._hitPending && !f._hitPending.done && f.stTime >= f._hitPending.at * f.stDur) { f._hitPending.done = true; resolveHit(f, other, f._hitPending.kind); }
      // AI or human input already set intents; apply physics
      if (f.isAI) think(f, other, dt);
      else humanControl(f, other);
      // movement
      if (f.hitLock <= 0 && f.state !== "ko") { f.x += f.vx; }
      else { f.x += f.vx; f.vx *= 0.8; }
      f.x = clamp(f.x, 40, VW - 40);
      // transient states auto-return
      if ((f.state === "light" || f.state === "heavy" || f.state === "special" || f.state === "hit") && f.stTime >= f.stDur) { setState(f, "idle", 1); f._hitPending = null; if (f.state !== "hit") f.combo = 0; }
      if (f.state === "walk" && Math.abs(f.vx) < 0.1) setState(f, "idle", 1);
      if (f.state !== "hit" && f.state !== "walk") f.combo = f.combo; // keep
      // face opponent when idle
      if ((f.state === "idle" || f.state === "walk") && !f.isAI) f.facing = (other.x > f.x) ? 1 : -1;
    }

    function humanControl(f, other) {
      if (f.state === "hit" || f.state === "ko" || f.cooldown > 0) { if (f.state === "walk") setState(f, "idle", 1); f.vx = f.state === "walk" ? f.vx : 0; return; }
      var left = keys["a"], right = keys["d"], block = keys["s"];
      f.vx = 0;
      if (block) { setState(f, "block", 0.4); return; }
      if (left) { f.vx = -2.4; if (f.state !== "walk") setState(f, "walk", 1); }
      else if (right) { f.vx = 2.4; if (f.state !== "walk") setState(f, "walk", 1); }
      else if (f.state === "walk" || f.state === "block") setState(f, "idle", 1);
    }

    function comboText(c, n) {
      c.save(); c.font = "700 20px Cinzel, Georgia, serif"; c.fillStyle = C.goldB; c.textAlign = "center";
      c.shadowColor = "#000"; c.shadowBlur = 6; c.fillText(n + " HIT", VW * 0.28, 60); c.restore();
    }
    function drawBanner(c, t) {
      c.save(); c.textAlign = "center"; c.globalAlpha = clamp(banner.t, 0, 1);
      c.font = "700 30px Cinzel, Georgia, serif"; c.fillStyle = C.goldB; c.shadowColor = "#000"; c.shadowBlur = 10;
      c.fillText(banner.txt, VW / 2, VH / 2); c.restore();
    }

    /* ======================= shell + input ======================= */
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">Theomachy — War of the Gods</h2>' +
          "<p>An art preview: Zeus, King of the Olympians, sparring on the heights. React to the look before the roster is raised.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="fg-hud"></div>' +
        '<div class="fg-stage"><canvas class="fg-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Theomachy fighting stage"></canvas></div>' +
        '<div class="fg-controls">' +
          '<div class="fg-pad fg-move">' +
            '<button class="ouro-key" data-k="a" aria-label="Move left">◀</button>' +
            '<button class="ouro-key" data-k="s" aria-label="Guard">🛡</button>' +
            '<button class="ouro-key" data-k="d" aria-label="Move right">▶</button>' +
          "</div>" +
          '<div class="fg-pad fg-atk">' +
            '<button class="ouro-key fg-atk-l" data-atk="light" aria-label="Light strike">✦</button>' +
            '<button class="ouro-key fg-atk-h" data-atk="heavy" aria-label="Heavy strike">✸</button>' +
            '<button class="ouro-key fg-atk-s" data-atk="special" aria-label="Thunderbolt (special)">⚡</button>' +
          "</div>" +
        "</div>" +
        '<p class="rq-note">Move A/D · Guard S · Strike J (light) · K (heavy) · Thunderbolt L (needs energy). Touch pads below.</p>';
      canvas = root.querySelector(".fg-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".fg-hud");
      wireInput();
    }
    function wireInput() {
      keyfn = function (e) {
        var k = e.key.toLowerCase();
        if (["a", "d", "s", "w"].indexOf(k) >= 0) { keys[k] = true; e.preventDefault(); }
        if (k === "j") { tryAttack(p1, p2, "light"); e.preventDefault(); }
        if (k === "k") { tryAttack(p1, p2, "heavy"); e.preventDefault(); }
        if (k === "l") { tryAttack(p1, p2, "special"); e.preventDefault(); }
      };
      keyup = function (e) { keys[e.key.toLowerCase()] = false; };
      document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);
      root.querySelectorAll(".fg-move .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k");
        var dn = function (e) { e.preventDefault(); keys[k] = true; }, up = function () { keys[k] = false; };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
      root.querySelectorAll(".fg-atk .ouro-key").forEach(function (b) {
        b.addEventListener("click", function () { tryAttack(p1, p2, b.getAttribute("data-atk")); });
      });
    }

    function boot() {
      shell();
      p1 = Fighter(ZEUS, VW * 0.32, 1, false);
      p2 = Fighter(SHADE, VW * 0.68, -1, true);
      motes = []; for (var i = 0; i < 26; i++) motes.push({ x: Math.random() * VW, y: Math.random() * VH, r: Math.random() * 1.6 + 0.4, a: Math.random() * 0.4 + 0.1, v: Math.random() * 0.6 + 0.2 });
      sparks = []; banner = null; flash = 0;
      running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    }

    boot();

    return function cleanup() {
      running = false; if (raf) cancelAnimationFrame(raf);
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (keyup) document.removeEventListener("keyup", keyup);
    };
  }
})();
