/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Theomachy — War of the Gods" (1v1 fighter)

   A duel of the Olympians, each god fought with the weapon myth actually gives
   them — every fighter's arms and epithet grounded in the Early Greece chapter
   (ch08). Anime/DBZ-flavoured: cel-shaded heroic gods, energy auras, battle
   damage (bruises, blood, torn cloth), and heavy hit effects (impact bursts,
   blood spray, speed lines, screen shake, hit-stop).

   ART-FIRST slice: Zeus rendered to a high finish, sparring a training Shade,
   so the look is judged before the roster / select / finishers / 2P are built.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;
  // resolve paths relative to THIS script (so optional hero art loads from anywhere)
  var SCRIPT_BASE = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, "")) || "assets/games/";

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  AG.register("fighter", {
    title: "Theomachy",
    subtitle: "War of the Gods — a duel of the Olympians, drawn from real myth.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch08) || "",
    sourceHref: "chapters/ch08.html", sourceLabel: "Read “Early Greece”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var VW = 660, VH = 330, GROUND = VH - 30, DPR = 1;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var UI = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"), ink: v("--ink", "#cdbb96") };

    var canvas, cx, hudEl, raf = null, keyfn = null, keyup = null, last = 0, running = false;
    var keys = {}, p1, p2, motes = [], fx = [], blood = [], shake = 0, hitStop = 0, flash = 0, banner = null, gameT = 0;
    var winner = null, resultShown = false, curG1 = "zeus", curG2 = "hades", curTwoP = false;
    var KM1 = { left: "a", right: "d", block: "s", light: "j", heavy: "k", special: "l" };
    var KM2 = { left: "arrowleft", right: "arrowright", block: "arrowdown", light: ",", heavy: ".", special: "/" };
    // optional detailed hero art: a single 2x2 sheet (Zeus TL, Poseidon TR, Athena BL, Hades BR).
    // When present it replaces the procedural portraits on the select / VS / victory screens;
    // combat stays procedural. Set HERO_SHEET to the file (relative to this script) to enable.
    var HERO_SHEET = null; // e.g. "art/heroes.png"
    var HERO_ORDER = ["zeus", "poseidon", "athena", "hades"], HERO_INSET = 0.02;
    var HERO = { img: null, ready: false };
    function loadHeroes() {
      if (!HERO_SHEET) return;
      var img = new Image();
      img.onload = function () { HERO.img = img; HERO.ready = true; try { root.querySelectorAll(".fg-portrait").forEach(function (cv) { drawFace(cv, cv.getAttribute("data-god")); }); } catch (e) { } };
      img.src = SCRIPT_BASE + HERO_SHEET;
    }
    function heroCrop(id) {
      var i = HERO_ORDER.indexOf(id); if (i < 0) i = 0;
      var col = i % 2, row = (i / 2) | 0, iw = HERO.img.width / 2, ih = HERO.img.height / 2, mx = iw * HERO_INSET, my = ih * HERO_INSET;
      return { sx: col * iw + mx, sy: row * ih + my, sw: iw - 2 * mx, sh: ih - 2 * my };
    }
    function drawCover(pc, img, sx, sy, sw, sh, dw, dh) {
      var sr = sw / sh, dr = dw / dh, cw = sw, ch = sh;
      if (sr > dr) { cw = sh * dr; sx += (sw - cw) / 2; } else { ch = sw / dr; sy += (sh - ch) / 2; }
      pc.drawImage(img, sx, sy, cw, ch, 0, 0, dw, dh);
    }
    // global light direction (upper-right), for coherent cel shading
    var LX = 0.55, LY = -0.83;

    /* ===================== rig: a ready fighting stance ===================== */
    var BASE = {
      footB: [-20, 0], kneeB: [-15, -40], footF: [21, 0], kneeF: [15, -40],
      hip: [0, -74], chest: [3, -116], neck: [4, -128], head: [7, -148],
      shF: [12, -122], elF: [27, -116], hnF: [38, -110],
      shB: [-4, -122], elB: [-17, -108], hnB: [-22, -116]
    };
    function clonePose(p) { var o = {}; for (var k in p) o[k] = [p[k][0], p[k][1]]; return o; }
    function add(p, k, dx, dy) { p[k][0] += dx; p[k][1] += dy; }

    function poseFor(f, t) {
      var p = clonePose(BASE);
      var br = Math.sin(t * 2.4 + f.phase) * 1.7;
      add(p, "chest", 0, -br * 0.5); add(p, "neck", 0, -br * 0.6); add(p, "head", 0, -br * 0.7);
      add(p, "shF", 0, -br * 0.4); add(p, "shB", 0, -br * 0.4); add(p, "hnF", br * 0.4, -br * 0.4);
      var st = f.state, pr = clamp(f.stTime / f.stDur, 0, 1);
      if (st === "walk") {
        var w = Math.sin(t * 9 + f.phase) * 11;
        add(p, "footF", w, -Math.max(0, w) * 0.7); add(p, "kneeF", w * 0.6, 0);
        add(p, "footB", -w, -Math.max(0, -w) * 0.7); add(p, "kneeB", -w * 0.6, 0);
        add(p, "hnF", 0, w * 0.3); add(p, "hnB", 0, -w * 0.3); add(p, "hip", 0, -Math.abs(w) * 0.1);
      } else if (st === "jump") {
        add(p, "footF", 4, 10); add(p, "footB", -6, 8); add(p, "kneeF", 2, 8); add(p, "kneeB", -2, 8); add(p, "hnF", 6, -14);
      } else if (st === "block") {
        add(p, "hnF", -22, -2); add(p, "elF", -16, 2); add(p, "hnB", -6, 0); add(p, "chest", -5, 0); add(p, "head", -4, 0);
      } else if (st === "light" || st === "heavy") {
        var big = st === "heavy" ? 1.25 : 0.8, k = ease(pr < 0.35 ? pr / 0.35 : 1 - (pr - 0.35) / 0.65);
        add(p, "hnF", 30 * big * k, 6 * big * k); add(p, "elF", 20 * big * k, 2 * big * k);
        add(p, "chest", 7 * big * k, 0); add(p, "head", 6 * big * k, 0); add(p, "hip", 4 * big * k, 0);
        add(p, "shF", 3 * big * k, 0); add(p, "footF", 10 * big * k, 0); add(p, "hnB", -8 * big * k, 0);
      } else if (st === "special") {
        var up = ease(clamp(pr * 1.5, 0, 1));
        add(p, "hnF", 2 * up, -54 * up); add(p, "elF", 0, -40 * up); add(p, "shF", 0, -10 * up);
        add(p, "hnB", -8 * up, -34 * up); add(p, "elB", -5, -24 * up); add(p, "head", 0, -4 * up); add(p, "chest", 0, -3 * up);
      } else if (st === "hit") {
        var s = (1 - pr); add(p, "head", -10 * s, 0); add(p, "chest", -7 * s, 0); add(p, "neck", -8 * s, 0); add(p, "hnF", -8 * s, 4 * s); add(p, "hnB", -10 * s, 2 * s);
      } else if (st === "ko") {
        var kk = ease(pr);
        for (var j in p) { var pt = p[j], ang = -1.4 * kk, x = pt[0], y = pt[1]; p[j] = [x * Math.cos(ang) - y * Math.sin(ang) - 46 * kk, x * Math.sin(ang) + y * Math.cos(ang)]; }
      }
      // subtle ready-bob
      if (st === "idle") { var bob = Math.sin(t * 2.4 + f.phase) * 1.2; for (var q in p) p[q][1] += bob * 0.2; }
      return p;
    }

    /* ===================== cel-shaded primitives ===================== */
    function capsule(ax, ay, bx, by, w1, w2, bulge) {
      bulge = bulge == null ? 1.15 : bulge;
      var dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      var W = Math.max(w1, w2);
      var mx = (ax + bx) / 2 + nx * W * bulge, my = (ay + by) / 2 + ny * W * bulge;
      var mx2 = (ax + bx) / 2 - nx * W * (bulge * 0.7), my2 = (ay + by) / 2 - ny * W * (bulge * 0.7);
      var p = new Path2D();
      p.moveTo(ax + nx * w1, ay + ny * w1);
      p.quadraticCurveTo(mx, my, bx + nx * w2, by + ny * w2);
      p.arc(bx, by, w2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
      p.quadraticCurveTo(mx2, my2, ax - nx * w1, ay - ny * w1);
      p.arc(ax, ay, w1, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
      p.closePath();
      return { path: p, w: W };
    }
    // 3-tone cel fill of a Path2D with a bold outline. k scales the shadow /
    // highlight offset (smaller k = flatter, subtler shading — used on the torso
    // so the crescents don't read as odd anatomy).
    function cel(c, P, base, shadow, light, outline, w, ow, k) {
      k = k == null ? 1 : k;
      c.fillStyle = base; c.fill(P);
      c.save(); c.clip(P);
      var Ps = new Path2D(); Ps.addPath(P, new DOMMatrix([1, 0, 0, 1, -LX * w * 0.95 * k, -LY * w * 0.95 * k]));
      c.fillStyle = shadow; c.fill(Ps);
      if (light) { var Ph = new Path2D(); Ph.addPath(P, new DOMMatrix([1, 0, 0, 1, LX * w * 0.85 * k, LY * w * 0.85 * k])); c.fillStyle = light; c.fill(Ph); }
      c.restore();
      c.lineWidth = ow || 2; c.strokeStyle = outline; c.lineJoin = "round"; c.stroke(P);
    }
    function bone(c, ax, ay, bx, by, w1, w2, s, opt) {
      opt = opt || {}; var cap = capsule(ax, ay, bx, by, w1, w2, opt.bulge);
      cel(c, cap.path, opt.back ? s.baseSh : s.base, s.shadow, opt.back ? null : s.light, s.outline, cap.w, opt.ow || 2);
    }
    // A whole limb as ONE smooth outline through several joints (no beaded joints)
    function boneChain(c, pts, ws, s, opt) {
      opt = opt || {}; var n = pts.length, norms = [], i;
      for (i = 0; i < n; i++) {
        var a = i > 0 ? pts[i - 1] : pts[i], b = i < n - 1 ? pts[i + 1] : pts[i];
        var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
        norms.push([-dy / L, dx / L]);
      }
      var P = new Path2D();
      P.moveTo(pts[0][0] + norms[0][0] * ws[0], pts[0][1] + norms[0][1] * ws[0]);
      for (i = 1; i < n; i++) P.lineTo(pts[i][0] + norms[i][0] * ws[i], pts[i][1] + norms[i][1] * ws[i]);
      var e = pts[n - 1]; P.arc(e[0], e[1], ws[n - 1], Math.atan2(norms[n - 1][1], norms[n - 1][0]), Math.atan2(-norms[n - 1][1], -norms[n - 1][0]), false);
      for (i = n - 2; i >= 0; i--) P.lineTo(pts[i][0] - norms[i][0] * ws[i], pts[i][1] - norms[i][1] * ws[i]);
      var s0 = pts[0]; P.arc(s0[0], s0[1], ws[0], Math.atan2(-norms[0][1], -norms[0][0]), Math.atan2(norms[0][1], norms[0][0]), false);
      P.closePath();
      cel(c, P, opt.back ? s.baseSh : s.base, s.shadow, opt.back ? null : s.light, s.outline, Math.max.apply(null, ws), opt.ow || 2, opt.k);
    }

    /* ===================== the figure ===================== */
    function drawFighter(c, f, t) {
      var p = poseFor(f, t), s = f.skin, dmg = 1 - clamp(f.hp, 0, 100) / 100;
      c.save();
      c.translate(f.x, GROUND - (f.y || 0));
      c.scale(f.facing, 1);
      // ground shadow
      c.save(); c.scale(1, 0.28); c.globalAlpha = 0.42; c.fillStyle = "#000";
      c.beginPath(); c.arc(2, (f.y || 0) * 0.9 + 8, 32, 0, 7); c.fill(); c.restore();

      drawAura(c, f, t);
      drawCape(c, p, t, f, s, dmg);
      // back limbs (single smooth outline each)
      boneChain(c, [[p.hip[0] - 6, p.hip[1]], p.kneeB, p.footB], [8.5, 6.2, 4.6], s, { back: true });
      drawSandal(c, p.footB, s, true);
      boneChain(c, [p.shB, p.elB, p.hnB], [6.8, 5.2, 4.2], s, { back: true });
      drawFist(c, p.hnB, s, true);

      drawTorso(c, p, s);
      // front leg
      boneChain(c, [[p.hip[0] + 4, p.hip[1]], p.kneeF, p.footF], [10, 7, 4.8], s, {});
      drawGreave(c, p.kneeF, p.footF, s);
      drawSandal(c, p.footF, s, false);

      drawHead(c, p, s, t, f);

      // front arm + weapon
      boneChain(c, [p.shF, p.elF, p.hnF], [8, 6.2, 4.8], s, {});
      drawPauldron(c, p.shF, s);
      drawFist(c, p.hnF, s, false);
      s.weapon(c, p, t, f, s);

      drawWounds(c, f, p);
      c.restore();
    }

    function drawFist(c, h, s, back) {
      var cap = capsule(h[0], h[1], h[0] + 4, h[1] + 2, 5.2, 4.4, 1.1);
      cel(c, cap.path, back ? s.baseSh : s.base, s.shadow, back ? null : s.light, s.outline, cap.w, 1.6);
    }
    function drawGreave(c, knee, foot, s) {
      var cap = capsule(knee[0], knee[1] + 2, foot[0], foot[1], 7.4, 5, 1.2);
      cel(c, cap.path, s.metal, s.metalSh, s.rim, s.outline, cap.w, 1.4);
    }
    function drawPauldron(c, sh, s) {
      // a shoulder cap that hugs the top of the deltoid (not a chest medallion)
      var P = new Path2D();
      P.moveTo(sh[0] - 8, sh[1] + 3);
      P.quadraticCurveTo(sh[0] - 9, sh[1] - 9, sh[0] + 2, sh[1] - 9);
      P.quadraticCurveTo(sh[0] + 11, sh[1] - 8, sh[0] + 10, sh[1] + 4);
      P.quadraticCurveTo(sh[0] + 1, sh[1] + 1, sh[0] - 8, sh[1] + 3);
      P.closePath();
      cel(c, P, s.metal, s.metalSh, s.rim, s.outline, 9, 1.6, 0.7);
      // two small ridge studs along the cap
      c.fillStyle = s.rim; c.strokeStyle = s.outline; c.lineWidth = .8;
      c.beginPath(); c.arc(sh[0] - 2, sh[1] - 4, 1.4, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.arc(sh[0] + 4, sh[1] - 3, 1.4, 0, 7); c.fill(); c.stroke();
    }
    function drawSandal(c, foot, s, back) {
      var P = new Path2D(); P.ellipse(foot[0] + 4, foot[1] - 1, 11, 4.4, 0, 0, 7);
      cel(c, P, back ? s.baseSh : s.metal, s.metalSh, back ? null : s.rim, s.outline, 6, 1.4);
    }

    function drawTorso(c, p, s) {
      var P = new Path2D();
      P.moveTo(p.shB[0] - 4, p.shB[1] + 1);
      P.quadraticCurveTo(p.chest[0] - 22, p.chest[1] + 2, p.hip[0] - 13, p.hip[1] + 2);
      P.quadraticCurveTo(p.hip[0] - 1, p.hip[1] + 9, p.hip[0] + 14, p.hip[1] + 2);
      P.quadraticCurveTo(p.chest[0] + 26, p.chest[1], p.shF[0] + 6, p.shF[1]);
      P.quadraticCurveTo(p.neck[0] + 7, p.neck[1] + 3, p.neck[0] - 6, p.neck[1] + 3);
      P.closePath();
      cel(c, P, s.base, s.shadow, s.light, s.outline, 22, 2, 0.5);
      // engraved musculature (bold, anime-style) — two symmetric pecs + abs
      c.save(); c.clip(P);
      var mcx = p.chest[0] + 1;
      c.strokeStyle = s.outline; c.globalAlpha = .42; c.lineWidth = 1.5; c.lineCap = "round";
      // pec division + two under-pec curves
      c.beginPath(); c.moveTo(mcx, p.chest[1] - 1); c.lineTo(mcx + 1, p.chest[1] + 12); c.stroke();
      c.beginPath(); c.moveTo(mcx - 13, p.chest[1] + 3); c.quadraticCurveTo(mcx - 6, p.chest[1] + 11, mcx - 1, p.chest[1] + 10); c.stroke();
      c.beginPath(); c.moveTo(mcx + 15, p.chest[1] + 3); c.quadraticCurveTo(mcx + 7, p.chest[1] + 11, mcx + 2, p.chest[1] + 10); c.stroke();
      // linea alba + abs
      c.beginPath(); c.moveTo(mcx + 1, p.chest[1] + 13); c.lineTo(mcx, p.hip[1] - 6); c.stroke();
      for (var a = 0; a < 3; a++) { var yy = p.chest[1] + 17 + a * 6.5; c.beginPath(); c.moveTo(mcx - 8, yy); c.lineTo(mcx - 1, yy); c.moveTo(mcx + 3, yy); c.lineTo(mcx + 10, yy); c.stroke(); }
      c.globalAlpha = 1; c.restore();
      // himation drape
      var H = new Path2D();
      H.moveTo(p.shF[0] + 7, p.shF[1] - 3);
      H.quadraticCurveTo(p.chest[0] + 8, p.chest[1] + 16, p.hip[0] - 16, p.hip[1] + 5);
      H.lineTo(p.hip[0] - 7, p.hip[1] + 10);
      H.quadraticCurveTo(p.chest[0] + 16, p.chest[1] + 18, p.shF[0] + 15, p.shF[1] - 1);
      H.closePath();
      cel(c, H, s.cloth, s.clothSh, null, s.outline, 12, 1.4);
      c.save(); c.clip(H); c.strokeStyle = s.clothSh; c.lineWidth = 1;
      c.beginPath(); c.moveTo(p.shF[0] + 10, p.shF[1] + 2); c.quadraticCurveTo(p.chest[0] + 9, p.chest[1] + 14, p.hip[0] - 9, p.hip[1] + 5); c.stroke(); c.restore();
      // girdle
      var G = new Path2D(); G.rect(p.hip[0] - 14, p.hip[1] - 4, 28, 6);
      cel(c, G, s.metal, s.metalSh, s.rim, s.outline, 6, 1.4);
      c.beginPath(); c.arc(p.hip[0], p.hip[1] - 1, 3.4, 0, 7); c.fillStyle = s.rim; c.fill(); c.strokeStyle = s.outline; c.lineWidth = 1; c.stroke();
    }

    function drawHead(c, p, s, t, f) {
      var hx = p.head[0], hy = p.head[1], st = f.state;
      var angry = (st === "light" || st === "heavy" || st === "special"), pain = (st === "hit" || st === "ko");
      var hasBeard = s.beard !== false;
      boneChain(c, [[p.neck[0], p.neck[1]], [hx - 3, hy + 12]], [6.5, 7.5], s, {});
      // big swept-back hair mass
      var HB = new Path2D();
      HB.moveTo(hx - 15, hy + 8);
      HB.quadraticCurveTo(hx - 26, hy - 14, hx - 11, hy - 25);
      HB.quadraticCurveTo(hx - 17, hy - 32, hx - 4, hy - 27);
      HB.quadraticCurveTo(hx + 3, hy - 36, hx + 11, hy - 27);
      HB.quadraticCurveTo(hx + 22, hy - 29, hx + 16, hy - 13);
      HB.quadraticCurveTo(hx + 24, hy - 15, hx + 17, hy - 1);
      HB.quadraticCurveTo(hx + 7, hy - 19, hx - 4, hy - 15);
      HB.quadraticCurveTo(hx - 13, hy - 17, hx - 15, hy + 8);
      HB.closePath();
      cel(c, HB, s.hair, s.hairSh, null, s.outline, 18, 2.2);
      c.save(); c.clip(HB); c.strokeStyle = s.hairSh; c.lineWidth = 1.2;
      for (var hs = 0; hs < 4; hs++) { c.beginPath(); c.moveTo(hx - 12 + hs * 7, hy - 24); c.quadraticCurveTo(hx - 4 + hs * 6, hy - 14, hx + 2 + hs * 5, hy - 2); c.stroke(); } c.restore();
      // face profile (forehead → brow → straight nose → lips → chin → jaw)
      var F = new Path2D();
      F.moveTo(hx - 9, hy - 15);
      F.quadraticCurveTo(hx + 9, hy - 17, hx + 13, hy - 5);
      F.lineTo(hx + 21, hy + 3);
      F.lineTo(hx + 12, hy + 6.5);
      F.quadraticCurveTo(hx + 16, hy + 10, hx + 11, hy + 15);
      F.quadraticCurveTo(hx + 4, hy + 19, hx - 7, hy + 13);
      F.quadraticCurveTo(hx - 15, hy - 2, hx - 9, hy - 15);
      F.closePath();
      cel(c, F, s.skin, s.skinSh, s.skinLit, s.outline, 15, 1.9);
      // ear
      var E = new Path2D(); E.ellipse(hx - 4, hy + 1, 2.6, 3.6, 0.2, 0, 7);
      cel(c, E, s.skin, s.skinSh, null, s.outline, 3, 1.2);
      // cheekbone shading
      c.save(); c.clip(F); c.strokeStyle = s.skinSh; c.globalAlpha = .6; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(hx + 3, hy + 3); c.quadraticCurveTo(hx + 8, hy + 6, hx + 6, hy + 10); c.stroke(); c.globalAlpha = 1; c.restore();
      // thick brow
      c.strokeStyle = s.outline; c.lineWidth = 2.6; c.lineCap = "round";
      c.beginPath();
      if (angry) { c.moveTo(hx + 2, hy - 9); c.lineTo(hx + 13, hy - 4); }
      else if (pain) { c.moveTo(hx + 2, hy - 4); c.lineTo(hx + 13, hy - 9); }
      else { c.moveTo(hx + 2, hy - 8); c.lineTo(hx + 13, hy - 6); }
      c.stroke();
      // deep-set almond eye
      c.fillStyle = "#f4efdd";
      c.beginPath(); c.moveTo(hx + 4, hy - 2); c.quadraticCurveTo(hx + 8, hy - 5.5, hx + 12.5, hy - 1.5); c.quadraticCurveTo(hx + 8, hy + 1.5, hx + 4, hy - 2); c.closePath(); c.fill();
      c.save(); c.shadowColor = s.eye; c.shadowBlur = 8; c.fillStyle = s.eye; c.beginPath(); c.arc(hx + 9, hy - 2, 2.3, 0, 7); c.fill(); c.restore();
      c.fillStyle = s.outline; c.beginPath(); c.arc(hx + 9.7, hy - 2, 1.2, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.globalAlpha = .8; c.beginPath(); c.arc(hx + 8.2, hy - 2.8, 0.7, 0, 7); c.fill(); c.globalAlpha = 1;
      c.strokeStyle = s.outline; c.lineWidth = 1.6; c.beginPath(); c.moveTo(hx + 4, hy - 2.5); c.quadraticCurveTo(hx + 8, hy - 6, hx + 12.5, hy - 1.8); c.stroke();
      // nostril + nose base
      c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx + 13, hy + 3.4); c.lineTo(hx + 18, hy + 3.8); c.stroke();
      // mustache
      if (hasBeard) {
        c.fillStyle = s.hair; c.beginPath(); c.moveTo(hx + 2, hy + 6); c.quadraticCurveTo(hx + 9, hy + 5, hx + 13, hy + 7); c.quadraticCurveTo(hx + 9, hy + 9, hx + 2, hy + 8.5); c.closePath(); c.fill();
        c.strokeStyle = s.outline; c.lineWidth = .8; c.stroke();
      }
      // mouth
      if (angry || pain) {
        c.fillStyle = "#26120a"; c.beginPath(); c.moveTo(hx + 2, hy + 9); c.quadraticCurveTo(hx + 6, hy + 12.5, hx + 11, hy + 9.5); c.quadraticCurveTo(hx + 6, hy + 10.5, hx + 2, hy + 9); c.closePath(); c.fill();
        c.fillStyle = "#efe6cf"; c.beginPath(); c.moveTo(hx + 3, hy + 9); c.lineTo(hx + 10, hy + 9.3); c.lineTo(hx + 9.5, hy + 10.1); c.lineTo(hx + 3.5, hy + 9.9); c.closePath(); c.fill();
      } else { c.strokeStyle = s.outline; c.lineWidth = 1.5; c.beginPath(); c.moveTo(hx + 3, hy + 10); c.quadraticCurveTo(hx + 6, hy + 10.6, hx + 10, hy + 9.6); c.stroke(); }
      // full beard in locks
      if (hasBeard) {
        var B = new Path2D();
        B.moveTo(hx - 8, hy + 9);
        B.quadraticCurveTo(hx + 8, hy + 15, hx + 12, hy + 9);
        B.quadraticCurveTo(hx + 17, hy + 27, hx + 5, hy + 39);
        B.quadraticCurveTo(hx - 2, hy + 43, hx - 8, hy + 35);
        B.quadraticCurveTo(hx - 17, hy + 25, hx - 8, hy + 9);
        B.closePath();
        cel(c, B, s.hair, s.hairSh, null, s.outline, 16, 2);
        c.save(); c.clip(B); c.strokeStyle = s.hairSh; c.lineWidth = 1.1;
        c.beginPath(); c.moveTo(hx - 2, hy + 14); c.quadraticCurveTo(hx, hy + 30, hx - 3, hy + 37); c.stroke();
        c.beginPath(); c.moveTo(hx + 5, hy + 14); c.quadraticCurveTo(hx + 8, hy + 26, hx + 3, hy + 36); c.stroke();
        c.beginPath(); c.moveTo(hx + 10, hy + 12); c.quadraticCurveTo(hx + 12, hy + 22, hx + 7, hy + 32); c.stroke(); c.restore();
      }
      s.crown(c, hx, hy, s, f);
    }

    function drawCape(c, p, t, f, s, dmg) {
      if (!s.cape) return;
      var sway = Math.sin(t * 1.9 + f.phase) * 10 + (f.vx || 0) * -7;
      var P = new Path2D();
      P.moveTo(p.shB[0] + 2, p.shB[1] - 2);
      P.quadraticCurveTo(-50 + sway, -82, -44 + sway * 1.5, 8);
      // torn ragged hem grows with damage
      var teeth = 5, baseY = 8, x0 = -44 + sway * 1.5, x1 = p.hip[0] - 6;
      for (var i = 1; i <= teeth; i++) { var xx = lerp(x0, x1, i / teeth); var notch = (i % 2 && dmg > 0.3) ? 8 * dmg : 2; P.lineTo(xx, baseY - notch); P.lineTo(xx + 3, baseY); }
      P.quadraticCurveTo(-6, -8, p.hip[0] - 8, p.hip[1] + 2);
      P.closePath();
      cel(c, P, s.cape, s.capeSh, null, s.outline, 16, 2);
      c.save(); c.clip(P); c.strokeStyle = s.capeSh; c.lineWidth = 1;
      c.beginPath(); c.moveTo(p.shB[0], p.shB[1]); c.quadraticCurveTo(-32 + sway, -52, -26 + sway, 4); c.stroke(); c.restore();
    }

    /* ---- battle damage (deterministic wounds revealed as HP drops) ---- */
    function drawWounds(c, f, p) {
      var dmg = 1 - clamp(f.hp, 0, 100) / 100; if (dmg <= 0.02) return;
      for (var i = 0; i < f.wounds.length; i++) {
        var w = f.wounds[i]; if (dmg < w.thr) continue;
        var x = w.x, y = w.y;
        if (w.type === "bruise") { var g = c.createRadialGradient(x, y, 0, x, y, w.r * 1.8); g.addColorStop(0, "rgba(126,54,132,.72)"); g.addColorStop(0.6, "rgba(90,40,110,.4)"); g.addColorStop(1, "rgba(90,40,110,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, w.r * 1.8, 0, 7); c.fill(); }
        else if (w.type === "cut") { c.strokeStyle = f.skin.blood; c.lineWidth = 2.1; c.lineCap = "round"; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w.dx, y + w.dy); c.stroke(); c.strokeStyle = "rgba(255,120,110,.5)"; c.lineWidth = .8; c.stroke(); }
        else if (w.type === "blood") { c.fillStyle = f.skin.blood; c.beginPath(); c.arc(x, y, w.r * 1.3, 0, 7); c.fill(); for (var k = 0; k < 4; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.7) * w.r * 2, y + Math.sin(k * 1.7) * w.r * 2, w.r * 0.5, 0, 7); c.fill(); } var dr = new Path2D(); c.beginPath(); c.moveTo(x, y); c.lineTo(x - .6, y + w.r * 3); c.lineTo(x + 1.2, y + w.r * 2.4); c.closePath(); c.fill(); }
      }
      // a bloodied lip + sweat when badly hurt
      if (dmg > 0.45) {
        c.fillStyle = f.skin.blood; c.beginPath(); c.arc(p.head[0] + 8, p.head[1] + 7, 1.4, 0, 7); c.fill();
        c.fillStyle = "rgba(205,228,255,.7)"; c.beginPath(); c.arc(p.head[0] + 10, p.head[1] + 1, 1.3, 0, 7); c.fill();
        c.beginPath(); c.arc(p.chest[0] + 12, p.chest[1] + 4, 1.1, 0, 7); c.fill();
      }
    }

    /* ---- energy aura (DBZ flame) ---- */
    function drawAura(c, f, t) {
      var lvl = clamp(f.aura, 0, 1) * 0.7 + (f.state === "special" ? 0.5 : 0) + clamp(f.energy / 100, 0, 1) * 0.25;
      if (lvl < 0.12) return;
      c.save(); c.globalCompositeOperation = "lighter";
      var cxp = 0, cyp = -70, R = 46 + lvl * 20;
      var g = c.createRadialGradient(cxp, cyp, 6, cxp, cyp, R);
      g.addColorStop(0, "rgba(255,255,255," + (0.18 * lvl) + ")"); g.addColorStop(0.5, hexA(f.skin.eye, 0.16 * lvl)); g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g; c.beginPath(); c.arc(cxp, cyp, R, 0, 7); c.fill();
      // licking flames
      c.strokeStyle = hexA(f.skin.eye, 0.8 * lvl); c.lineWidth = 2; c.shadowColor = f.skin.eye; c.shadowBlur = 8;
      var n = 9;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * 6.28, wob = Math.sin(t * 14 + i) * 5, r0 = 30, r1 = 44 + wob + lvl * 22;
        var x0 = Math.cos(a) * r0, y0 = cyp + Math.sin(a) * r0 * 0.9, x1 = Math.cos(a) * r1, y1 = cyp + Math.sin(a) * r1 * 0.9 - 6;
        c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + wob, (y0 + y1) / 2, x1, y1); c.stroke();
      }
      c.restore();
    }
    function hexA(hex, a) { var n = hex.replace("#", ""); if (n.length === 3) n = n.replace(/./g, "$&$&"); var r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16); return "rgba(" + r + "," + g + "," + b + "," + a + ")"; }

    /* ===================== god skins ===================== */
    function laurel(c, hx, hy, s) {
      c.save(); c.shadowColor = s.rim; c.shadowBlur = 4; c.strokeStyle = s.rim; c.lineWidth = 1.7;
      c.beginPath(); c.arc(hx - 1, hy - 6, 15, Math.PI * 0.9, Math.PI * 2.05); c.stroke();
      for (var i = 0; i < 7; i++) { var a = Math.PI * 0.96 + i * 0.16, lx = hx - 1 + Math.cos(a) * 15, ly = hy - 6 + Math.sin(a) * 15; c.beginPath(); c.ellipse(lx, ly - 1, 3.8, 1.6, a + 1.3, 0, 7); c.fillStyle = s.rim; c.fill(); }
      c.restore();
    }
    function noCrown(c, hx, hy, s) { c.strokeStyle = s.outline; c.lineWidth = 1.4; c.beginPath(); c.arc(hx - 1, hy - 8, 13, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }

    function zeusBolt(c, p, t, f, s) {
      var hx = p.hnF[0], hy = p.hnF[1], charging = (f.state === "special");
      c.save(); c.translate(hx, hy);
      // haft
      c.strokeStyle = s.rim; c.lineWidth = 3; c.beginPath(); c.moveTo(-3, 5); c.lineTo(3, -5); c.stroke();
      var pulse = 0.7 + Math.sin(t * 24) * 0.3;
      c.shadowColor = "#bfe3ff"; c.shadowBlur = (charging ? 20 : 10) * pulse;
      function b(dir) {
        c.beginPath(); c.moveTo(0, 0);
        c.lineTo(7 * dir, -11 * dir); c.lineTo(-2 * dir, -13 * dir); c.lineTo(9 * dir, -28 * dir);
        c.lineTo(1 * dir, -26 * dir); c.lineTo(8 * dir, -44 * dir);
        c.lineWidth = 2.6; c.strokeStyle = "#eaf5ff"; c.stroke();
        c.lineWidth = 1; c.strokeStyle = s.rim; c.stroke();
      }
      b(1); b(-1); c.restore();
    }
    function shadeBlade(c, p, t, f, s) {
      var hx = p.hnF[0], hy = p.hnF[1];
      c.save(); c.shadowColor = s.eye; c.shadowBlur = 8; c.strokeStyle = "#c9b7e6"; c.lineWidth = 2.6;
      c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + 5, hy - 36); c.stroke();
      c.lineWidth = 1; c.strokeStyle = s.rim; c.stroke(); c.restore();
    }

    var ZEUS = {
      name: "Zeus", epithet: "King of the Olympians",
      base: "#c79a54", baseSh: "#8a6428", shadow: "#7c5528", light: "#f0d38a", outline: "#20160a", rim: "#ffe9b0",
      skin: "#d8ab6e", skinSh: "#9c6e3c", skinLit: "#f2d4a0",
      hair: "#f2ead0", hairSh: "#b6a578", cloth: "#efe6cf", clothSh: "#b0a07b",
      cape: "#9a5824", capeSh: "#3a2410", metal: "#e7c680", metalSh: "#9a7433",
      eye: "#bfe3ff", blood: "#8a1a1a", weapon: zeusBolt, crown: laurel
    };
    var SHADE = {
      name: "Shade of the Styx", epithet: "a training echo",
      base: "#39315a", baseSh: "#241d3c", shadow: "#1c1730", light: "#5a4f86", outline: "#0c0814", rim: "#8f79c0",
      skin: "#3f3660", skinSh: "#241d3c", skinLit: "#5f5488",
      hair: "#241d38", hairSh: "#120d22", cloth: "#3a3152", clothSh: "#221c34",
      cape: "#241d38", capeSh: "#0c0814", metal: "#6a5a92", metalSh: "#3a3057",
      eye: "#9c7ad0", blood: "#3a1a4a", weapon: shadeBlade, crown: noCrown
    };

    /* ---- the other three Olympians ---- */
    function haft(c, x0, y0, x1, y1, s) { c.strokeStyle = s.metal; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.strokeStyle = s.outline; c.lineWidth = 1; c.stroke(); }
    function poseidonTrident(c, p, t, f, s) {
      var hx = p.hnF[0], hy = p.hnF[1], ch = (f.state === "special");
      c.save(); c.translate(hx, hy); c.shadowColor = s.eye; c.shadowBlur = ch ? 16 : 7;
      haft(c, -2, 15, 5, -46, s);
      c.save(); c.translate(5, -46); c.strokeStyle = s.metal; c.lineWidth = 3; c.lineCap = "round";
      [[-9, -15], [0, -22], [9, -15]].forEach(function (pr) { c.beginPath(); c.moveTo(0, -2); c.lineTo(pr[0], pr[1]); c.stroke(); });
      c.strokeStyle = s.rim; c.lineWidth = 1; [[-9, -15], [0, -22], [9, -15]].forEach(function (pr) { c.beginPath(); c.moveTo(0, -2); c.lineTo(pr[0], pr[1]); c.stroke(); });
      c.beginPath(); c.moveTo(-9, -8); c.lineTo(9, -8); c.stroke(); c.restore(); c.restore();
    }
    function hadesBident(c, p, t, f, s) {
      var hx = p.hnF[0], hy = p.hnF[1], ch = (f.state === "special");
      c.save(); c.translate(hx, hy); c.shadowColor = s.eye; c.shadowBlur = ch ? 18 : 9;
      haft(c, -2, 15, 5, -46, s);
      c.save(); c.translate(5, -46); c.strokeStyle = s.metal; c.lineWidth = 3.4; c.lineCap = "round";
      [[-8, -17], [8, -17]].forEach(function (pr) { c.beginPath(); c.moveTo(0, -2); c.lineTo(pr[0], pr[1]); c.stroke(); });
      c.strokeStyle = s.rim; c.lineWidth = 1; [[-8, -17], [8, -17]].forEach(function (pr) { c.beginPath(); c.moveTo(0, -2); c.lineTo(pr[0], pr[1]); c.stroke(); }); c.restore(); c.restore();
    }
    function athenaSpear(c, p, t, f, s) {
      var bx = p.hnB[0], by = p.hnB[1];
      var Sh = new Path2D(); Sh.arc(bx - 5, by - 6, 13, 0, 7);
      cel(c, Sh, s.metal, s.metalSh, s.rim, s.outline, 13, 1.8, 0.6);
      c.strokeStyle = s.rim; c.lineWidth = 1; c.beginPath(); c.arc(bx - 5, by - 6, 9, 0, 7); c.stroke();
      c.fillStyle = s.outline; c.beginPath(); c.arc(bx - 5, by - 6, 3.4, 0, 7); c.fill();
      var hx = p.hnF[0], hy = p.hnF[1]; c.save(); c.translate(hx, hy);
      haft(c, -4, 18, 6, -50, s);
      c.beginPath(); c.moveTo(6, -50); c.lineTo(1, -60); c.lineTo(6, -74); c.lineTo(11, -60); c.closePath();
      c.fillStyle = s.metal; c.fill(); c.strokeStyle = s.outline; c.lineWidth = 1; c.stroke();
      c.strokeStyle = s.rim; c.beginPath(); c.moveTo(6, -52); c.lineTo(6, -72); c.stroke(); c.restore();
    }
    function coralCrown(c, hx, hy, s) {
      c.save(); c.shadowColor = s.eye; c.shadowBlur = 4; c.strokeStyle = s.rim; c.lineWidth = 2.2; c.lineCap = "round";
      var pts = [[-11, -17], [-5, -27], [1, -20], [7, -29], [13, -18]];
      c.beginPath(); pts.forEach(function (pp, i) { var x = hx + pp[0], y = hy + pp[1]; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore();
    }
    function darkHelm(c, hx, hy, s) {
      var D = new Path2D(); D.moveTo(hx - 15, hy - 1); D.quadraticCurveTo(hx - 17, hy - 26, hx + 1, hy - 29); D.quadraticCurveTo(hx + 19, hy - 26, hx + 17, hy - 1); D.quadraticCurveTo(hx + 2, hy - 9, hx - 15, hy - 1); D.closePath();
      cel(c, D, s.metal, s.metalSh, null, s.outline, 16, 1.8, 0.55);
      c.fillStyle = s.metal; c.strokeStyle = s.outline; c.lineWidth = 1;
      [[-11, -25], [11, -25]].forEach(function (h) { c.beginPath(); c.moveTo(hx + h[0], hy + h[1]); c.lineTo(hx + h[0] * 1.35, hy + h[1] - 13); c.lineTo(hx + h[0] + 4, hy + h[1]); c.closePath(); c.fill(); c.stroke(); });
    }
    function warHelm(c, hx, hy, s) {
      c.save(); c.shadowColor = s.rim; c.shadowBlur = 4;
      var g = c.createLinearGradient(hx - 20, hy - 34, hx + 4, hy - 14); g.addColorStop(0, s.plume || "#b23a2a"); g.addColorStop(1, s.rim);
      c.fillStyle = g; c.beginPath(); c.moveTo(hx + 3, hy - 18); c.quadraticCurveTo(hx - 4, hy - 36, hx - 22, hy - 30); c.quadraticCurveTo(hx - 10, hy - 22, hx - 6, hy - 12); c.quadraticCurveTo(hx - 2, hy - 15, hx + 3, hy - 18); c.closePath(); c.fill(); c.restore();
      var D = new Path2D(); D.arc(hx + 1, hy - 7, 15, Math.PI, 0, false); D.lineTo(hx + 16, hy - 3); D.quadraticCurveTo(hx + 1, hy - 9, hx - 14, hy - 3); D.closePath();
      cel(c, D, s.metal, s.metalSh, s.rim, s.outline, 15, 1.8, 0.7);
      c.fillStyle = s.metal; c.strokeStyle = s.outline; c.lineWidth = 1; c.beginPath(); c.moveTo(hx + 13, hy - 5); c.lineTo(hx + 18, hy + 4); c.lineTo(hx + 13, hy + 5); c.closePath(); c.fill(); c.stroke();
    }

    var POSEIDON = {
      name: "Poseidon", epithet: "Lord of the Sea",
      base: "#4f9a86", baseSh: "#356b5d", shadow: "#264f45", light: "#83c9b3", outline: "#0e211c", rim: "#bfeadd",
      skin: "#6fb39c", skinSh: "#3f7566", skinLit: "#a6d8c8",
      hair: "#22403f", hairSh: "#122423", cloth: "#cfe7de", clothSh: "#7fa89e",
      cape: "#2a6f6a", capeSh: "#0f2f2c", metal: "#c9a24a", metalSh: "#8a6a2e",
      eye: "#7fe3ff", blood: "#7a1a2a", weapon: poseidonTrident, crown: coralCrown, beard: true
    };
    var HADES = {
      name: "Hades", epithet: "Lord of the Dead",
      base: "#4a4460", baseSh: "#2e2942", shadow: "#221d34", light: "#6c6390", outline: "#0c0914", rim: "#9a86c8",
      skin: "#8f8798", skinSh: "#585165", skinLit: "#b6aec2",
      hair: "#191524", hairSh: "#0a0713", cloth: "#2b2740", clothSh: "#151228",
      cape: "#211d38", capeSh: "#090613", metal: "#6a5a92", metalSh: "#3a3057",
      eye: "#b98cff", blood: "#5a1030", weapon: hadesBident, crown: darkHelm, beard: true
    };
    var ATHENA = {
      name: "Athena", epithet: "Goddess of Wisdom and War",
      base: "#c9a24a", baseSh: "#8a6a2e", shadow: "#6e5324", light: "#ecd08a", outline: "#1c1408", rim: "#ffe9b0",
      skin: "#e6c79a", skinSh: "#ad8c5e", skinLit: "#f6e2bf",
      hair: "#5a3b22", hairSh: "#33210f", cloth: "#e6dabf", clothSh: "#ac9c77",
      cape: "#8a3a2a", capeSh: "#3a140e", metal: "#d9b25a", metalSh: "#9a7433",
      eye: "#e7c680", blood: "#8a1a1a", plume: "#b23a2a", weapon: athenaSpear, crown: warHelm, beard: false
    };
    var ROSTER = { zeus: ZEUS, poseidon: POSEIDON, athena: ATHENA, hades: HADES };
    var ROSTER_IDS = ["zeus", "poseidon", "athena", "hades"];

    /* ===================== fighters ===================== */
    function makeWounds() {
      var out = [], types = ["bruise", "cut", "blood"];
      for (var i = 0; i < 11; i++) {
        var side = Math.random() < 0.5 ? -1 : 1;
        out.push({ type: types[i % 3], x: rnd(-14, 16), y: rnd(-140, -70), r: rnd(1.6, 3.2), dx: rnd(-6, 6) * side, dy: rnd(4, 9), thr: 0.12 + (i / 11) * 0.8 });
      }
      return out;
    }
    function Fighter(skin, x, facing, isAI, km) {
      return { skin: skin, x: x, facing: facing, isAI: isAI, km: km || null, vx: 0, vy: 0, y: 0, onGround: true,
        hp: 100, energy: 0, state: "idle", stTime: 0, stDur: 1, phase: Math.random() * 6,
        aura: 0, cooldown: 0, hitLock: 0, combo: 0, wounds: makeWounds() };
    }
    function setState(f, st, dur) { if (f.state === st) return; f.state = st; f.stTime = 0; f.stDur = dur || 0.4; }

    /* ===================== stage ===================== */
    function drawStage(c, t) {
      var sky = c.createLinearGradient(0, 0, 0, VH);
      sky.addColorStop(0, "#241a2e"); sky.addColorStop(0.45, "#3a2740"); sky.addColorStop(0.72, UI.ember); sky.addColorStop(1, "#2a1a0e");
      c.fillStyle = sky; c.fillRect(0, 0, VW, VH);
      if (flash > 0) { c.fillStyle = "rgba(220,235,255," + (flash * 0.5) + ")"; c.fillRect(0, 0, VW, VH); }
      c.save(); c.globalAlpha = .5; c.fillStyle = UI.goldB; c.beginPath(); c.arc(VW * 0.5, VH * 0.34, 42, 0, 7); c.fill(); c.restore();
      c.fillStyle = "rgba(20,13,7,.55)"; c.beginPath(); c.moveTo(0, GROUND);
      for (var m = 0; m <= VW; m += 60) c.lineTo(m, GROUND - 60 - Math.sin(m * 0.03) * 42 - (m % 120 ? 0 : 30));
      c.lineTo(VW, GROUND); c.closePath(); c.fill();
      for (var i = 0; i < 6; i++) {
        var colx = 40 + i * 120, cw = 22, top = GROUND - 150;
        var g = c.createLinearGradient(colx, 0, colx + cw, 0); g.addColorStop(0, "#1a130c"); g.addColorStop(0.5, "#2a2013"); g.addColorStop(1, "#120c07");
        c.fillStyle = g; c.fillRect(colx, top, cw, 150); c.strokeStyle = "rgba(199,154,84,.35)"; c.lineWidth = 1; c.strokeRect(colx, top, cw, 150);
        c.fillStyle = "#241a10"; c.fillRect(colx - 5, top - 8, cw + 10, 8); c.fillRect(colx - 5, GROUND - 6, cw + 10, 6);
        c.strokeStyle = "rgba(20,13,7,.5)"; for (var fl = 1; fl < 4; fl++) { c.beginPath(); c.moveTo(colx + fl * cw / 4, top); c.lineTo(colx + fl * cw / 4, GROUND); c.stroke(); }
      }
      var fl2 = c.createLinearGradient(0, GROUND, 0, VH); fl2.addColorStop(0, "#2a2013"); fl2.addColorStop(1, "#0d0906");
      c.fillStyle = fl2; c.fillRect(0, GROUND, VW, VH - GROUND);
      // blood decals on the marble
      for (var d = 0; d < blood.length; d++) { var bd = blood[d]; c.globalAlpha = clamp(bd.life, 0, .8); c.fillStyle = bd.col; c.beginPath(); c.arc(bd.x, bd.y, bd.r, 0, 7); c.fill(); }
      c.globalAlpha = 1;
      c.strokeStyle = "rgba(199,154,84,.25)"; c.beginPath(); c.moveTo(0, GROUND); c.lineTo(VW, GROUND); c.stroke();
      for (var k = 0; k < motes.length; k++) { var mo = motes[k]; c.globalAlpha = mo.a; c.fillStyle = UI.goldB; c.beginPath(); c.arc(mo.x, mo.y, mo.r, 0, 7); c.fill(); }
      c.globalAlpha = 1;
    }

    /* ===================== combat + FX ===================== */
    function tryAttack(f, other, kind) {
      if (f.cooldown > 0 || f.state === "hit" || f.state === "ko" || !f.onGround) return;
      if (kind === "special" && f.energy < 50) return;
      var fin = kind === "special" && f.energy >= 100 && other.hp <= 30 && other.state !== "ko";
      setState(f, kind === "special" ? "special" : kind, kind === "heavy" ? 0.5 : kind === "special" ? 0.9 : 0.32);
      f.cooldown = kind === "heavy" ? 0.55 : kind === "special" ? 1.0 : 0.36;
      if (kind === "special") { f.energy -= fin ? 100 : 50; f.aura = fin ? 1.9 : 1.2; flash = fin ? 0.9 : 0.5; }
      f._hit = { kind: kind, at: kind === "special" ? 0.4 : 0.2, done: false, fin: fin };
    }
    function resolveHit(f, other, kind, fin) {
      var reach = kind === "special" ? 170 : kind === "heavy" ? 78 : 60;
      var dx = (other.x - f.x) * f.facing;
      if (dx <= 4 || dx >= reach || other.state === "ko") return;
      var dmg = fin ? 100 : kind === "special" ? 22 : kind === "heavy" ? 13 : 6;
      var blocked = other.state === "block" && other.facing !== f.facing;
      if (blocked) dmg = Math.round(dmg * 0.25);
      other.hp = clamp(other.hp - dmg, 0, 100);
      f.energy = clamp(f.energy + (kind === "special" ? 5 : 10), 0, 100);
      other.energy = clamp(other.energy + 6, 0, 100);
      var hx = (f.x + other.x) / 2, hy = GROUND - 72;
      if (!blocked) {
        setState(other, "hit", 0.34); other.hitLock = 0.34; other.combo = 0;
        other.vx = f.facing * (kind === "heavy" ? 3.6 : kind === "special" ? 5.5 : 2);
        f.combo++;
        burst(hx, hy, kind); spray(hx, hy, other.skin.blood, kind);
        shake = Math.max(shake, kind === "special" ? 13 : kind === "heavy" ? 8 : 4);
        hitStop = Math.max(hitStop, kind === "special" ? 0.16 : kind === "heavy" ? 0.11 : 0.06);
        var pools = kind === "special" ? 5 : kind === "heavy" ? 3 : 1;
        for (var pj = 0; pj < pools; pj++) blood.push({ x: other.x + rnd(-16, 16), y: GROUND + rnd(0, 8), r: rnd(3, 8), col: other.skin.blood, life: 1 });
      } else { other.vx = f.facing * 1.2; burst(hx, hy, "block"); shake = Math.max(shake, 2); hitStop = Math.max(hitStop, 0.04); }
      if (kind === "special") flash = 0.7;
      if (fin) { flash = 1; shake = 18; hitStop = Math.max(hitStop, 0.25); spray(hx, hy, other.skin.blood, "special"); spray(hx, hy, other.skin.blood, "special"); burst(hx, hy, "special"); }
      if (other.hp <= 0 && other.state !== "ko") {
        setState(other, "ko", 1.2); other.combo = 0;
        banner = { txt: (fin ? "FINISH — " : "") + f.skin.name + (fin ? " triumphant" : " prevails"), t: 3, fin: !!fin };
        shake = Math.max(shake, 12); winner = f;
        for (var i = 0; i < (fin ? 16 : 8); i++) blood.push({ x: other.x + rnd(-24, 24), y: GROUND + rnd(-2, 8), r: rnd(3, 9), col: other.skin.blood, life: 1 });
      }
    }
    function burst(x, y, kind) {
      var col = kind === "special" ? "#bfe3ff" : kind === "block" ? "#cbb78a" : UI.goldB, n = kind === "light" ? 8 : 14;
      fx.push({ t: "flash", x: x, y: y, r: kind === "special" ? 34 : kind === "heavy" ? 24 : 16, life: 1, col: col });
      for (var i = 0; i < n; i++) { var a = (i / n) * 6.28; fx.push({ t: "line", x: x, y: y, a: a, len: rnd(10, kind === "special" ? 40 : 24), life: 1, col: col }); }
    }
    function spray(x, y, col, kind) { var n = kind === "special" ? 26 : kind === "heavy" ? 18 : 9; for (var i = 0; i < n; i++) fx.push({ t: "blood", x: x, y: y, vx: rnd(-1, 1) * 9, vy: rnd(-7, 1.5), life: 1, r: rnd(1.6, 4), col: col }); }
    function drawFX(c) {
      for (var i = fx.length - 1; i >= 0; i--) {
        var e = fx[i];
        if (e.t === "flash") { c.save(); c.globalCompositeOperation = "lighter"; var g = c.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * (1.4 - e.life * 0.4)); g.addColorStop(0, hexA(e.col, e.life)); g.addColorStop(0.5, hexA(e.col, e.life * 0.5)); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.beginPath(); c.arc(e.x, e.y, e.r * (1.4 - e.life * 0.4), 0, 7); c.fill();
          // impact star
          c.strokeStyle = hexA("#ffffff", e.life); c.lineWidth = 2; for (var k = 0; k < 4; k++) { var aa = k * 0.785; c.beginPath(); c.moveTo(e.x - Math.cos(aa) * e.r, e.y - Math.sin(aa) * e.r); c.lineTo(e.x + Math.cos(aa) * e.r, e.y + Math.sin(aa) * e.r); c.stroke(); } c.restore(); }
        else if (e.t === "line") { c.strokeStyle = hexA(e.col, e.life); c.lineWidth = 2; c.beginPath(); var r0 = (1 - e.life) * 8; c.moveTo(e.x + Math.cos(e.a) * r0, e.y + Math.sin(e.a) * r0); c.lineTo(e.x + Math.cos(e.a) * (r0 + e.len), e.y + Math.sin(e.a) * (r0 + e.len)); c.stroke(); }
        else if (e.t === "blood") { c.fillStyle = hexA(e.col, clamp(e.life, 0, 1)); c.beginPath(); c.arc(e.x, e.y, e.r, 0, 7); c.fill(); }
      }
    }

    /* ===================== AI ===================== */
    function think(f, other, dt) {
      if (f.state === "hit" || f.state === "ko") return;
      var dx = other.x - f.x, adx = Math.abs(dx), dir = dx > 0 ? 1 : -1; f.facing = dir; f.aiT = (f.aiT || 0) - dt;
      if (adx > 74) f.intent = "advance";
      else if (f.aiT <= 0) { var r = Math.random(); f.intent = r < 0.48 ? "light" : r < 0.7 ? "heavy" : r < 0.85 ? "block" : (f.energy >= 50 ? "special" : "light"); f.aiT = 0.45 + Math.random() * 0.6; }
      if (f.intent === "advance") { f.vx = dir * 1.6; if (f.onGround && f.state !== "walk") setState(f, "walk", 1); }
      else if (f.intent === "block") { if (f.state === "idle" || f.state === "walk") setState(f, "block", 0.5); f.vx = 0; }
      else if (f.intent === "light" || f.intent === "heavy" || f.intent === "special") { tryAttack(f, other, f.intent); f.intent = "wait"; }
      else { f.vx = 0; if (f.state === "walk") setState(f, "idle", 1); }
    }

    /* ===================== HUD ===================== */
    function renderHUD() {
      function bar(f, side) {
        return '<div class="fg-side fg-' + side + '"><div class="fg-name">' + f.skin.name + ' <span>' + f.skin.epithet + '</span></div>' +
          '<div class="fg-hp"><i style="width:' + clamp(f.hp, 0, 100) + '%"></i></div>' +
          '<div class="fg-en"><i style="width:' + clamp(f.energy, 0, 100) + '%"></i></div></div>';
      }
      hudEl.innerHTML = bar(p1, "l") + '<div class="fg-mid"><span class="fg-vs">✦</span></div>' + bar(p2, "r");
    }

    /* ===================== loop ===================== */
    function frame(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; var t = ts / 1000;
      for (var i = 0; i < motes.length; i++) { var mo = motes[i]; mo.y -= mo.v * dt * 30; mo.x += Math.sin(t + i) * 0.2; if (mo.y < 0) { mo.y = VH; mo.x = Math.random() * VW; } }
      flash = Math.max(0, flash - dt * 2); shake = Math.max(0, shake - dt * 32);
      if (hitStop > 0) { hitStop -= dt; } else { gameT += dt; [p1, p2].forEach(function (f) { update(f, f === p1 ? p2 : p1, dt); }); }
      for (var s = fx.length - 1; s >= 0; s--) { var e = fx[s]; if (e.t === "blood") { e.x += e.vx; e.y += e.vy; e.vy += 0.4; } e.life -= dt * (e.t === "flash" ? 3.2 : e.t === "line" ? 4 : 1.6); if (e.life <= 0) fx.splice(s, 1); }
      for (var b = blood.length - 1; b >= 0; b--) { blood[b].life -= dt * 0.045; if (blood[b].life <= 0) blood.splice(b, 1); }
      if (blood.length > 60) blood.splice(0, blood.length - 60);
      cx.clearRect(0, 0, VW, VH);
      cx.save();
      if (shake > 0.3) cx.translate(rnd(-shake, shake), rnd(-shake, shake));
      drawStage(cx, t);
      var order = p1.x < p2.x ? [p1, p2] : [p2, p1];
      drawFighter(cx, order[0], gameT); drawFighter(cx, order[1], gameT);
      drawFX(cx);
      if (p1.combo > 1 && p1.state !== "ko") comboText(cx, p1.combo);
      if (banner) { drawBanner(cx); banner.t -= dt; if (banner.t <= 0) banner = null; }
      cx.restore();
      renderHUD();
      if (winner && !banner && !resultShown) { resultShown = true; showResult(); return; }
      raf = requestAnimationFrame(frame);
    }
    function update(f, other, dt) {
      f.stTime += dt; f.cooldown = Math.max(0, f.cooldown - dt); f.hitLock = Math.max(0, f.hitLock - dt); f.aura = Math.max(0, f.aura - dt * 0.8);
      f.energy = clamp(f.energy + dt * 3, 0, 100);
      if (f._hit && !f._hit.done && f.stTime >= f._hit.at * f.stDur) { f._hit.done = true; resolveHit(f, other, f._hit.kind, f._hit.fin); }
      if (f.isAI) think(f, other, dt); else humanControl(f, other);
      f.x += f.vx; if (f.hitLock > 0 || f.state === "ko") f.vx *= 0.82;
      f.x = clamp(f.x, 40, VW - 40);
      if ((f.state === "light" || f.state === "heavy" || f.state === "special" || f.state === "hit") && f.stTime >= f.stDur) { var was = f.state; setState(f, "idle", 1); f._hit = null; if (was !== "hit") f.combo = 0; }
      if (f.state === "walk" && Math.abs(f.vx) < 0.1) setState(f, "idle", 1);
      if ((f.state === "idle" || f.state === "walk") && !f.isAI) f.facing = (other.x > f.x) ? 1 : -1;
    }
    function humanControl(f, other) {
      var km = f.km || {};
      if (f.state === "hit" || f.state === "ko" || f.cooldown > 0) { f.vx = 0; return; }
      f.vx = 0;
      if (keys[km.block]) { setState(f, "block", 0.4); return; }
      if (keys[km.left]) { f.vx = -2.5; f.facing = -1; if (f.state !== "walk") setState(f, "walk", 1); }
      else if (keys[km.right]) { f.vx = 2.5; f.facing = 1; if (f.state !== "walk") setState(f, "walk", 1); }
      else if (f.state === "walk" || f.state === "block") setState(f, "idle", 1);
    }
    function comboText(c, n) { c.save(); c.font = "700 22px Cinzel, Georgia, serif"; c.fillStyle = UI.goldB; c.textAlign = "center"; c.shadowColor = "#000"; c.shadowBlur = 6; c.fillText(n + " HIT", VW * 0.26, 54); c.restore(); }
    function drawBanner(c) { c.save(); c.textAlign = "center"; c.globalAlpha = clamp(banner.t, 0, 1); c.font = "700 32px Cinzel, Georgia, serif"; c.fillStyle = UI.goldB; c.shadowColor = "#000"; c.shadowBlur = 12; c.fillText(banner.txt, VW / 2, VH / 2); c.restore(); }

    /* ===================== portraits ===================== */
    function drawFace(cvEl, id) {
      var s = ROSTER[id], pc = cvEl.getContext("2d"), d = Math.min(window.devicePixelRatio || 1, 2);
      var W = cvEl.clientWidth || 74, H = cvEl.clientHeight || 88;
      cvEl.width = W * d; cvEl.height = H * d; pc.setTransform(d, 0, 0, d, 0, 0);
      pc.clearRect(0, 0, W, H);
      if (HERO.ready) { var cr = heroCrop(id); drawCover(pc, HERO.img, cr.sx, cr.sy, cr.sw, cr.sh, W, H); return; }
      var cxL = W / 2 - 2, hy = H * 0.46;
      // shoulders
      pc.fillStyle = s.base; pc.strokeStyle = s.outline; pc.lineWidth = 2;
      pc.beginPath(); pc.moveTo(cxL - 20, H); pc.quadraticCurveTo(cxL - 22, H - 18, cxL - 6, H - 22); pc.lineTo(cxL + 10, H - 22); pc.quadraticCurveTo(cxL + 24, H - 18, cxL + 22, H); pc.closePath(); pc.fill(); pc.stroke();
      var pose = { neck: [cxL, hy + 15], head: [cxL, hy - 3] };
      drawHead(pc, pose, s, 0, { state: "idle", skin: s });
    }

    /* ===================== character select ===================== */
    function godCard(role, id, sel) {
      var s = ROSTER[id];
      return '<button class="fg-card' + (sel ? " is-sel" : "") + '" data-role="' + role + '" data-god="' + id + '" aria-pressed="' + (sel ? "true" : "false") + '">' +
        '<canvas class="fg-portrait" data-god="' + id + '" width="74" height="88"></canvas>' +
        '<span class="fg-card-name">' + s.name + '</span><span class="fg-card-ep">' + s.epithet + '</span></button>';
    }
    function selectScreen() {
      running = false; if (raf) cancelAnimationFrame(raf); winner = null; resultShown = false; banner = null;
      var sel = { p1: curG1, p2: curG2, twoP: curTwoP };
      function render() {
        root.innerHTML =
          '<div class="game-head" style="margin-bottom:.3rem"><p class="eyebrow">The Divine Archives · Games</p>' +
            '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">Theomachy — War of the Gods</h2>' +
            "<p>Choose your Olympian. Each god fights with the weapon myth gives them.</p></div>" +
          '<div class="game-rule" role="presentation"></div>' +
          '<p class="fg-sel-row-label">' + (sel.twoP ? "Player 1" : "You") + '</p><div class="fg-cards">' + ROSTER_IDS.map(function (id) { return godCard("p1", id, sel.p1 === id); }).join("") + "</div>" +
          '<div class="fg-sel-mode"><button class="rq-btn" data-a="mode">Opponent: ' + (sel.twoP ? "Player 2 (human)" : "the AI") + "</button></div>" +
          '<p class="fg-sel-row-label">' + (sel.twoP ? "Player 2" : "Opponent") + '</p><div class="fg-cards">' + ROSTER_IDS.map(function (id) { return godCard("p2", id, sel.p2 === id); }).join("") + "</div>" +
          '<div class="rq-actions"><button class="rq-btn rq-primary" data-a="fight" autofocus>To the arena ⚔</button></div>' +
          '<p class="rq-note">P1: A/D move · S guard · J/K light/heavy · L thunderbolt.' + (sel.twoP ? " P2: ←/→ · ↓ guard · , . / strike." : " On touch, use the on-screen pads.") + " Fill the energy bar and land a special on a weakened foe for a FINISH.</p>";
        root.querySelectorAll(".fg-portrait").forEach(function (cv) { drawFace(cv, cv.getAttribute("data-god")); });
        root.querySelectorAll(".fg-card").forEach(function (b) {
          b.addEventListener("click", function () { sel[b.getAttribute("data-role")] = b.getAttribute("data-god"); render(); });
        });
        root.querySelector('[data-a="mode"]').addEventListener("click", function () { sel.twoP = !sel.twoP; render(); });
        root.querySelector('[data-a="fight"]').addEventListener("click", function () { startFight(sel.p1, sel.p2, sel.twoP); });
      }
      render();
    }

    /* ===================== fight shell + result ===================== */
    function shell(twoP) {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.3rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.2rem">Theomachy</h2></div>' +
        '<div class="fg-hud"></div>' +
        '<div class="fg-stage"><canvas class="fg-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Theomachy fighting stage"></canvas></div>' +
        '<div class="fg-controls">' +
          '<div class="fg-pad fg-move"><button class="ouro-key" data-k="' + KM1.left + '" aria-label="Move left">◀</button>' +
            '<button class="ouro-key" data-k="' + KM1.block + '" aria-label="Guard">🛡</button><button class="ouro-key" data-k="' + KM1.right + '" aria-label="Move right">▶</button></div>' +
          '<div class="fg-pad fg-atk"><button class="ouro-key fg-atk-l" data-atk="light" aria-label="Light strike">✦</button>' +
            '<button class="ouro-key fg-atk-h" data-atk="heavy" aria-label="Heavy strike">✸</button>' +
            '<button class="ouro-key fg-atk-s" data-atk="special" aria-label="Special">⚡</button></div>' +
        "</div>" +
        '<div class="rq-actions" style="margin-top:.4rem"><button class="rq-btn" data-a="back">‹ Choose fighters</button></div>';
      canvas = root.querySelector(".fg-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".fg-hud");
      root.querySelectorAll(".fg-move .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k"), dn = function (e) { e.preventDefault(); keys[k] = true; }, up = function () { keys[k] = false; };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up); b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
      root.querySelectorAll(".fg-atk .ouro-key").forEach(function (b) { b.addEventListener("click", function () { tryAttack(p1, p2, b.getAttribute("data-atk")); }); });
      root.querySelector('[data-a="back"]').addEventListener("click", selectScreen);
    }
    function showResult() {
      running = false; if (raf) cancelAnimationFrame(raf);
      var w = winner, l = (w === p1) ? p2 : p1;
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Theomachy · the dust settles</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.35rem">' + w.skin.name + ' is victorious</h2></div>' +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="fg-result"><canvas class="fg-portrait fg-portrait-lg" data-god="' + (w === p1 ? curG1 : curG2) + '" width="120" height="140"></canvas>' +
          '<p class="rq-note">' + w.skin.name + ' — ' + w.skin.epithet + ' — stands over ' + l.skin.name + '.</p></div>' +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="rematch" autofocus>Rematch</button>' +
          '<button class="rq-btn" data-a="choose">Choose fighters</button>' +
          '<a class="game-source" href="chapters/ch08.html">› Read “Early Greece”</a></div>';
      root.querySelectorAll(".fg-portrait").forEach(function (cv) { drawFace(cv, cv.getAttribute("data-god")); });
      root.querySelector('[data-a="rematch"]').addEventListener("click", function () { startFight(curG1, curG2, curTwoP); });
      root.querySelector('[data-a="choose"]').addEventListener("click", selectScreen);
    }
    function startFight(g1, g2, twoP) {
      curG1 = g1; curG2 = g2; curTwoP = twoP;
      shell(twoP);
      p1 = Fighter(ROSTER[g1] || ZEUS, VW * 0.30, 1, false, KM1);
      p2 = Fighter(ROSTER[g2] || HADES, VW * 0.70, -1, !twoP, twoP ? KM2 : null);
      motes = []; for (var i = 0; i < 26; i++) motes.push({ x: Math.random() * VW, y: Math.random() * VH, r: Math.random() * 1.6 + 0.4, a: Math.random() * 0.4 + 0.1, v: Math.random() * 0.6 + 0.2 });
      fx = []; blood = []; banner = null; flash = 0; shake = 0; hitStop = 0; gameT = 0; winner = null; resultShown = false;
      running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    }
    function attachKeys() {
      keyfn = function (e) {
        var k = e.key.toLowerCase();
        var moveKeys = [KM1.left, KM1.right, KM1.block, KM2.left, KM2.right, KM2.block];
        if (moveKeys.indexOf(k) >= 0) { keys[k] = true; if (k.indexOf("arrow") === 0) e.preventDefault(); }
        if (!running) return;
        [p1, p2].forEach(function (f) {
          if (!f || !f.km) return; var o = (f === p1) ? p2 : p1;
          if (k === f.km.light) { tryAttack(f, o, "light"); e.preventDefault(); }
          else if (k === f.km.heavy) { tryAttack(f, o, "heavy"); e.preventDefault(); }
          else if (k === f.km.special) { tryAttack(f, o, "special"); e.preventDefault(); }
        });
      };
      keyup = function (e) { keys[e.key.toLowerCase()] = false; };
      document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);
    }
    attachKeys();
    loadHeroes();
    selectScreen();

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); if (keyup) document.removeEventListener("keyup", keyup); };
  }
})();
