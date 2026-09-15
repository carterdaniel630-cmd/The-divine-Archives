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
  // strike timing with anticipation: pulls back (negative), snaps out to +1, then recovers to 0
  function strikeCurve(pr) {
    if (pr < 0.16) return -0.5 * ease(pr / 0.16);
    if (pr < 0.44) return -0.5 + 1.5 * ease((pr - 0.16) / 0.28);
    return 1 - ease((pr - 0.44) / 0.56);
  }

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
    var shots = [], debris = [], rain = [], groundItem = null, weather = null, debrisT = 0, itemT = 0, boltFlash = 0;
    var winner = null, resultShown = false, curG1 = "zeus", curG2 = "hades", curTwoP = false;
    var KM1 = { left: "a", right: "d", block: "s", jump: "w", light: "j", heavy: "k", special: "l", grab: "u" };
    var KM2 = { left: "arrowleft", right: "arrowright", block: "arrowdown", jump: "arrowup", light: ",", heavy: ".", special: "/", grab: "m" };
    // weather profiles — one picked per match; drives the stage mood + hazards
    var WEATHERS = [
      { id: "clear", name: "Clear night", rain: 0, storm: false, dust: 0, debris: 0.10 },
      { id: "rain", name: "Driving rain", rain: 90, storm: false, dust: 0, debris: 0.14 },
      { id: "storm", name: "Thunderstorm", rain: 130, storm: true, dust: 0, debris: 0.22 },
      { id: "embers", name: "Ashfall", rain: 0, storm: false, dust: 60, debris: 0.18 }
    ];
    // throwable relics that spawn on the ground mid-fight
    var ITEM_KINDS = [
      { id: "amphora", dmg: 14, r: 11, col: "#b8763a", colSh: "#7a4a20" },
      { id: "boulder", dmg: 18, r: 13, col: "#8a8072", colSh: "#4f4842" },
      { id: "spear", dmg: 16, r: 8, col: "#c9a24a", colSh: "#7a5a24" }
    ];
    // optional detailed hero art: a single 2x2 sheet (Zeus TL, Poseidon TR, Athena BL, Hades BR).
    // When present it replaces the procedural portraits on the select / VS / victory screens;
    // combat stays procedural. Set HERO_SHEET to the file (relative to this script) to enable.
    var HERO_SHEET = "art/heroes.jpg";
    var HERO_ORDER = ["zeus", "poseidon", "athena", "hades"], HERO_INSET = 0.015;
    // horizontal focus (0..1) of each god's face within its cell, so portrait crops frame the face
    var HERO_FOCUS = { zeus: 0.5, poseidon: 0.58, athena: 0.52, hades: 0.56 };
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
    function drawCover(pc, img, sx, sy, sw, sh, dw, dh, fx, fy) {
      fx = fx == null ? 0.5 : fx; fy = fy == null ? 0.42 : fy;
      var sr = sw / sh, dr = dw / dh, cw = sw, ch = sh;
      if (sr > dr) { cw = sh * dr; sx += (sw - cw) * fx; } else { ch = sw / dr; sy += (sh - ch) * fy; }
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
      } else if (st === "light") {
        // a sharp straight punch — winds the shoulder back, then snaps out
        var k = strikeCurve(pr);
        add(p, "hnF", 34 * k, 4 * k); add(p, "elF", 23 * k, 1 * k);
        add(p, "chest", 6 * k, 0); add(p, "head", 5 * k, 0); add(p, "hip", 3 * k, 0);
        add(p, "shF", 4 * k, 0); add(p, "footF", 9 * k, 0); add(p, "hnB", -9 * k, 0);
      } else if (st === "kick") {
        // a high roundhouse: chambers the knee, then whips the front leg up and out
        var kk = strikeCurve(pr);
        add(p, "footF", 48 * kk, -72 * kk); add(p, "kneeF", 31 * kk, -47 * kk);
        add(p, "chest", -6 * kk, 2 * kk); add(p, "head", -4 * kk, 0); add(p, "hip", -4 * kk, 4 * kk);
        add(p, "hnB", -14 * kk, -6 * kk); add(p, "hnF", -6 * kk, 4 * kk); add(p, "shB", -3 * kk, 0);
      } else if (st === "headbutt") {
        // a lunging headbutt — rocks back, then the whole torso snaps forward
        var hk = strikeCurve(pr);
        add(p, "head", 27 * hk, 8 * hk); add(p, "neck", 18 * hk, 5 * hk); add(p, "chest", 16 * hk, 4 * hk);
        add(p, "hip", 8 * hk, 0); add(p, "shF", 8 * hk, 0); add(p, "shB", 6 * hk, 0);
        add(p, "hnF", 4 * hk, 6 * hk); add(p, "footF", 12 * hk, 0);
      } else if (st === "throw") {
        // an overhand hurl
        var tk = strikeCurve(pr);
        add(p, "hnF", 22 * tk, -18 * tk); add(p, "elF", 15 * tk, -14 * tk); add(p, "shF", 4 * tk, -6 * tk);
        add(p, "chest", 8 * tk, 0); add(p, "head", 6 * tk, 0);
      } else if (st === "special") {
        var up = ease(clamp(pr * 1.5, 0, 1));
        add(p, "hnF", 2 * up, -54 * up); add(p, "elF", 0, -40 * up); add(p, "shF", 0, -10 * up);
        add(p, "hnB", -8 * up, -34 * up); add(p, "elB", -5, -24 * up); add(p, "head", 0, -4 * up); add(p, "chest", 0, -3 * up);
      } else if (st === "aerial") {
        // a flying strike: front leg/fist drives forward and down, back leg tucks up
        // behind — an unmistakable airborne silhouette, not the standing punch.
        var ak = ease(clamp(pr * 1.45, 0, 1)), dive = f.aerialKind === "dive";
        if (dive) {
          add(p, "footF", 46 * ak, 30 * ak); add(p, "kneeF", 26 * ak, 12 * ak);
          add(p, "footB", -20 * ak, -26 * ak); add(p, "kneeB", -12 * ak, -18 * ak);
          add(p, "hnF", 10 * ak, -16 * ak); add(p, "hnB", -24 * ak, -14 * ak);
          add(p, "chest", 6 * ak, 3 * ak); add(p, "head", 5 * ak, 1 * ak); add(p, "hip", 3 * ak, 2 * ak);
        } else {
          add(p, "hnF", 36 * ak, -6 * ak); add(p, "elF", 24 * ak, -3 * ak);
          add(p, "footF", 10 * ak, 16 * ak); add(p, "kneeF", 6 * ak, 10 * ak);
          add(p, "footB", -14 * ak, -22 * ak); add(p, "kneeB", -8 * ak, -14 * ak);
          add(p, "hnB", -18 * ak, -6 * ak); add(p, "chest", 5 * ak, 0); add(p, "head", 4 * ak, 0);
        }
      } else if (st === "hit") {
        var s = (1 - pr); add(p, "head", -10 * s, 0); add(p, "chest", -7 * s, 0); add(p, "neck", -8 * s, 0); add(p, "hnF", -8 * s, 4 * s); add(p, "hnB", -10 * s, 2 * s);
      } else if (st === "ko") {
        var kk = ease(pr);
        for (var j in p) { var pt = p[j], ang = -1.4 * kk, x = pt[0], y = pt[1]; p[j] = [x * Math.cos(ang) - y * Math.sin(ang) - 46 * kk, x * Math.sin(ang) + y * Math.cos(ang)]; }
      }
      // living idle: a slow weight-shift + breathing sway so a waiting fighter isn't a statue
      if (st === "idle") {
        var bob = Math.sin(t * 2.4 + f.phase) * 1.2, sway = Math.sin(t * 1.5 + f.phase) * 2.2;
        for (var q in p) p[q][1] += bob * 0.2;
        add(p, "hip", sway * 0.5, 0); add(p, "chest", sway * 0.7, 0); add(p, "neck", sway * 0.8, 0); add(p, "head", sway, 0);
        add(p, "hnF", sway * 0.6 + Math.sin(t * 2.4 + f.phase + 1) * 1.4, 0); add(p, "hnB", -sway * 0.5, 0);
        add(p, "shF", sway * 0.4, 0); add(p, "shB", sway * 0.3, 0);
      }
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
      var mw = Math.max.apply(null, ws), ow = opt.ow || 2.6;
      // FRONT limbs: a dark "separation moat" struck under the limb first — its outer
      // half survives as a halo once the fill covers the middle, so the limb visibly
      // lifts off the torso and the limb behind it instead of merging into one blob.
      if (!opt.back) { c.save(); c.lineJoin = "round"; c.lineCap = "round"; c.lineWidth = ow + 5; c.strokeStyle = "rgba(8,5,2,0.6)"; c.stroke(P); c.restore(); }
      cel(c, P, opt.back ? s.baseSh : s.base, s.shadow, opt.back ? null : s.light, s.outline, mw, ow, opt.k);
      if (opt.back) {
        // back limbs get a heavier dark wash so they clearly recede; outline re-struck on top
        c.save(); c.fillStyle = "rgba(6,4,2,0.46)"; c.fill(P); c.restore();
        c.lineWidth = 2.4; c.strokeStyle = s.outline; c.lineJoin = "round"; c.stroke(P);
      } else if (s.light) {
        // front limbs get a bright rim along the lit edge so they read as rounded, near forms
        c.save(); c.clip(P);
        var Pr = new Path2D(); Pr.addPath(P, new DOMMatrix([1, 0, 0, 1, LX * mw * 1.5, LY * mw * 1.5]));
        c.lineWidth = 2.2; c.strokeStyle = hexA(s.light, 0.55); c.lineJoin = "round"; c.stroke(Pr);
        c.restore();
      }
    }

    /* ===================== the figure ===================== */
    function drawFighter(c, f, t) {
      var target = poseFor(f, t), s = f.skin, dmg = 1 - clamp(f.hp, 0, 100) / 100;
      // blend the displayed skeleton toward the target pose so transitions ease in
      // instead of snapping (strikes blend faster to stay crisp).
      if (!f.dpose) f.dpose = clonePose(target);
      var bf = (f.state === "light" || f.state === "kick" || f.state === "headbutt" || f.state === "special" || f.state === "throw" || f.state === "hit" || f.state === "aerial") ? 0.55 : 0.3;
      for (var jk in target) { var dj = f.dpose[jk], gj = target[jk]; if (dj) { dj[0] += (gj[0] - dj[0]) * bf; dj[1] += (gj[1] - dj[1]) * bf; } }
      var p = f.dpose;
      // ease facing turns so the character flips smoothly rather than mirroring instantly
      if (f.face == null) f.face = f.facing;
      f.face += (f.facing - f.face) * 0.3;
      var sfx = Math.abs(f.face) < 0.08 ? (f.face < 0 ? -0.08 : 0.08) : f.face;
      c.save();
      c.translate(f.x, GROUND - (f.y || 0));
      c.scale(sfx, 1);
      // ground shadow — shrinks and fades as the god leaps, so height reads clearly
      var yh = f.y || 0, sr = 32 * (1 - Math.min(yh, 150) / 320);
      c.save(); c.scale(1, 0.28); c.globalAlpha = 0.42 * (1 - Math.min(yh, 150) / 260); c.fillStyle = "#000";
      c.beginPath(); c.arc(2, yh * 3.4 + 8, sr, 0, 7); c.fill(); c.restore();

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
      return { skin: skin, x: x, facing: facing, face: facing, isAI: isAI, km: km || null, vx: 0, mvx: 0, vy: 0, y: 0, onGround: true,
        hp: 100, energy: 0, guard: 100, state: "idle", stTime: 0, stDur: 1, phase: Math.random() * 6, dpose: null,
        aura: 0, cooldown: 0, hitLock: 0, combo: 0, wounds: makeWounds() };
    }
    function setState(f, st, dur) { if (f.state === st) return; f.state = st; f.stTime = 0; f.stDur = dur || 0.4; }

    /* ===================== stage ===================== */
    function drawStage(c, t) {
      var wet = weather && weather.rain, storm = weather && weather.storm, ash = weather && weather.dust;
      var sky = c.createLinearGradient(0, 0, 0, VH);
      if (storm) { sky.addColorStop(0, "#141420"); sky.addColorStop(0.5, "#1e2230"); sky.addColorStop(0.78, "#33303a"); sky.addColorStop(1, "#161018"); }
      else if (wet) { sky.addColorStop(0, "#1a2030"); sky.addColorStop(0.5, "#243040"); sky.addColorStop(0.78, "#3a3a44"); sky.addColorStop(1, "#1a1a22"); }
      else if (ash) { sky.addColorStop(0, "#2a1810"); sky.addColorStop(0.5, "#4a2410"); sky.addColorStop(0.78, UI.ember); sky.addColorStop(1, "#1a0e07"); }
      else { sky.addColorStop(0, "#241a2e"); sky.addColorStop(0.45, "#3a2740"); sky.addColorStop(0.72, UI.ember); sky.addColorStop(1, "#2a1a0e"); }
      c.fillStyle = sky; c.fillRect(0, 0, VW, VH);
      // storm lightning bolt across the sky
      if (storm && boltFlash > 0.3) {
        c.save(); c.globalAlpha = boltFlash; c.strokeStyle = "#eaf5ff"; c.lineWidth = 2.4; c.shadowColor = "#bfe3ff"; c.shadowBlur = 16;
        var bx = VW * rnd(0.3, 0.7); c.beginPath(); c.moveTo(bx, 0);
        for (var by = 0; by < VH * 0.6; by += 22) c.lineTo(bx + rnd(-14, 14), by);
        c.stroke(); c.restore();
      }
      if (flash > 0) { c.fillStyle = "rgba(220,235,255," + (flash * 0.5) + ")"; c.fillRect(0, 0, VW, VH); }
      // distant mountains — depth behind the temple
      c.fillStyle = storm ? "rgba(24,26,40,.6)" : wet ? "rgba(30,38,52,.5)" : "rgba(40,26,44,.5)";
      c.beginPath(); c.moveTo(0, GROUND);
      for (var dm = 0; dm <= VW; dm += 46) c.lineTo(dm, GROUND - 96 - Math.sin(dm * 0.018 + 2) * 34 - (dm % 210 < 46 ? 46 : 0));
      c.lineTo(VW, GROUND); c.closePath(); c.fill();
      // moon (dimmed / veiled when it storms or rains)
      c.save(); c.globalAlpha = storm ? .16 : wet ? .28 : .5; c.fillStyle = ash ? "#e7c680" : UI.goldB; c.beginPath(); c.arc(VW * 0.5, VH * 0.3, 40, 0, 7); c.fill(); c.restore();
      // nearer hills
      c.fillStyle = "rgba(20,13,7,.6)"; c.beginPath(); c.moveTo(0, GROUND);
      for (var m = 0; m <= VW; m += 60) c.lineTo(m, GROUND - 60 - Math.sin(m * 0.03) * 42 - (m % 120 ? 0 : 30));
      c.lineTo(VW, GROUND); c.closePath(); c.fill();
      // colonnade with capitals
      for (var i = 0; i < 6; i++) {
        var colx = 40 + i * 120, cw = 22, top = GROUND - 154;
        var g = c.createLinearGradient(colx, 0, colx + cw, 0); g.addColorStop(0, "#1a130c"); g.addColorStop(0.45, "#33270f"); g.addColorStop(0.55, "#3a2c14"); g.addColorStop(1, "#120c07");
        c.fillStyle = g; c.fillRect(colx, top, cw, 154); c.strokeStyle = "rgba(199,154,84,.35)"; c.lineWidth = 1; c.strokeRect(colx, top, cw, 154);
        c.fillStyle = "#3a2c15"; c.fillRect(colx - 6, top - 10, cw + 12, 10); c.fillRect(colx - 3, top - 16, cw + 6, 6); // capital
        c.fillStyle = "#241a10"; c.fillRect(colx - 6, GROUND - 8, cw + 12, 8); // base
        c.strokeStyle = "rgba(20,13,7,.5)"; for (var fl = 1; fl < 5; fl++) { c.beginPath(); c.moveTo(colx + fl * cw / 5, top); c.lineTo(colx + fl * cw / 5, GROUND); c.stroke(); } // fluting
      }
      // marble floor with receding tiles
      var fl2 = c.createLinearGradient(0, GROUND, 0, VH); fl2.addColorStop(0, "#2f2416"); fl2.addColorStop(1, "#0d0906");
      c.fillStyle = fl2; c.fillRect(0, GROUND, VW, VH - GROUND);
      c.strokeStyle = "rgba(199,154,84,.10)"; c.lineWidth = 1;
      for (var tx = 0; tx <= VW; tx += 55) { c.beginPath(); c.moveTo(tx, GROUND); c.lineTo(VW / 2 + (tx - VW / 2) * 2.1, VH); c.stroke(); }
      for (var ty = GROUND + 12; ty < VH; ty += 15) { c.beginPath(); c.moveTo(0, ty); c.lineTo(VW, ty); c.stroke(); }
      // blood decals on the marble
      for (var d = 0; d < blood.length; d++) { var bd = blood[d]; c.globalAlpha = clamp(bd.life, 0, .8); c.fillStyle = bd.col; c.beginPath(); c.arc(bd.x, bd.y, bd.r, 0, 7); c.fill(); }
      c.globalAlpha = 1;
      c.strokeStyle = "rgba(199,154,84,.3)"; c.beginPath(); c.moveTo(0, GROUND); c.lineTo(VW, GROUND); c.stroke();
      // foreground braziers — flickering fire lights the arena
      brazier(c, 24, t); brazier(c, VW - 24, t + 1.7);
      for (var k = 0; k < motes.length; k++) { var mo = motes[k]; c.globalAlpha = mo.a; c.fillStyle = UI.goldB; c.beginPath(); c.arc(mo.x, mo.y, mo.r, 0, 7); c.fill(); }
      c.globalAlpha = 1;
    }
    function brazier(c, x, t) {
      var yb = GROUND - 4;
      // stand + bowl
      c.fillStyle = "#2a2013"; c.strokeStyle = "#120c07"; c.lineWidth = 1;
      c.fillRect(x - 3, yb, 6, 30); c.beginPath(); c.moveTo(x - 12, yb); c.lineTo(x + 12, yb); c.lineTo(x + 8, yb - 8); c.lineTo(x - 8, yb - 8); c.closePath(); c.fill(); c.stroke();
      // flame
      c.save(); c.globalCompositeOperation = "lighter";
      var fh = 22 + Math.sin(t * 9 + x) * 5;
      var fg = c.createRadialGradient(x, yb - 12, 2, x, yb - 12, fh);
      fg.addColorStop(0, "rgba(255,240,180,.95)"); fg.addColorStop(0.4, "rgba(230,140,50,.7)"); fg.addColorStop(1, "rgba(120,40,10,0)");
      c.fillStyle = fg; c.beginPath();
      c.moveTo(x - 7, yb - 8);
      c.quadraticCurveTo(x - 5, yb - 12 - fh * 0.5, x + Math.sin(t * 12 + x) * 3, yb - 10 - fh);
      c.quadraticCurveTo(x + 5, yb - 12 - fh * 0.5, x + 7, yb - 8);
      c.closePath(); c.fill();
      // warm glow pool on the floor
      c.globalAlpha = 0.25 + Math.sin(t * 9 + x) * 0.05;
      var pg = c.createRadialGradient(x, yb, 2, x, yb, 60); pg.addColorStop(0, "rgba(230,150,60,.5)"); pg.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = pg; c.beginPath(); c.arc(x, yb, 60, 0, 7); c.fill();
      c.restore();
    }

    /* ===================== combat + FX ===================== */
    // MELEE: light = punch; heavy = kick, but a headbutt at grappling range.
    function tryAttack(f, other, kind) {
      if (f.cooldown > 0 || f.state === "hit" || f.state === "ko") return;
      if (kind === "special") return trySpecial(f, other);
      // holding a relic? a strike hurls it instead of swinging.
      if (f.holding && (kind === "light" || kind === "heavy")) { throwItem(f, other); return; }
      // AIRBORNE: a committed aerial strike — light = a flying punch, heavy = a diving
      // kick that drives the god down and forward onto the foe. Distinct pose, generous
      // reach, and it lands whether the enemy is level or below.
      if (!f.onGround) {
        var dive = kind === "heavy";
        setState(f, "aerial", dive ? 0.5 : 0.42); f.cooldown = dive ? 0.5 : 0.4;
        f.aerialKind = dive ? "dive" : "punch";
        f.vx = f.facing * (dive ? 3.6 : 2.6);
        if (dive && f.vy > -2) f.vy = -6;            // heavy = commit downward into the dive
        f._hit = { kind: "aerial", at: 0.22, done: false, fin: false, dive: dive };
        return;
      }
      var adx = Math.abs(other.x - f.x), move = kind, dur = 0.32, cd = 0.36;
      if (kind === "heavy") {
        if (adx < 48) { move = "headbutt"; dur = 0.34; cd = 0.5; }
        else { move = "kick"; dur = 0.46; cd = 0.55; }
      }
      setState(f, move, dur); f.cooldown = cd;
      f._hit = { kind: move, at: move === "kick" ? 0.42 : move === "headbutt" ? 0.3 : 0.24, done: false, fin: false };
    }
    // SPECIAL: a travelling energy blast (blockable). Charged + weakened foe = FINISH.
    function trySpecial(f, other) {
      if (f.energy < 40) return;
      var fin = f.energy >= 100 && other.hp <= 30 && other.state !== "ko";
      setState(f, "special", 0.9); f.cooldown = 1.0;
      f.energy -= fin ? 100 : 40; f.aura = fin ? 1.9 : 1.2; flash = fin ? 0.6 : 0.35;
      f._cast = { done: false, at: 0.42, fin: fin };
    }
    function spawnShot(f, fin) {
      var y = GROUND - 92 - (f.y || 0);
      shots.push({ x: f.x + f.facing * 34, y: y, vx: f.facing * (fin ? 8.2 : 6.4), owner: f, other: (f === p1 ? p2 : p1),
        r: fin ? 20 : 12, dmg: fin ? 100 : 20, fin: !!fin, col: f.skin.eye, life: 1.6, t: 0 });
      burst(f.x + f.facing * 30, y, fin ? "special" : "heavy"); shake = Math.max(shake, fin ? 10 : 5);
    }
    // THROW a held relic as a projectile
    function throwItem(f, other) {
      if (!f.holding) return;
      setState(f, "throw", 0.3); f.cooldown = 0.4;
      var it = f.holding; f.holding = null;
      var y = GROUND - 96 - (f.y || 0);
      shots.push({ x: f.x + f.facing * 26, y: y, vx: f.facing * 7.5, vy: -1.2, grav: 0.28, owner: f, other: other,
        r: it.r, dmg: it.dmg, item: it, col: it.col, colSh: it.colSh, spin: 0, life: 2.2, t: 0 });
    }
    // pick up a relic you're standing over, or drop the one you hold
    function tryGrab(f) {
      if (f.state === "hit" || f.state === "ko" || !f.onGround) return;
      if (f.holding) { // set it back down
        groundItem = { kind: f.holding, x: clamp(f.x, 40, VW - 40), y: GROUND }; f.holding = null; return;
      }
      if (groundItem && Math.abs(groundItem.x - f.x) < 34) { f.holding = groundItem.kind; groundItem = null; }
    }
    function updateShots(dt) {
      for (var i = shots.length - 1; i >= 0; i--) {
        var sh = shots[i]; sh.t += dt; sh.life -= dt;
        sh.x += sh.vx; if (sh.grav != null) { sh.vy = (sh.vy || 0) + sh.grav; sh.y += sh.vy; }
        if (sh.spin != null) sh.spin += 0.4 * (sh.vx > 0 ? 1 : -1);
        var o = sh.other, hit = false;
        if (o && o.state !== "ko" && Math.abs(sh.x - o.x) < 26 && Math.abs(sh.y - (GROUND - 72 - (o.y || 0))) < 60) {
          applyDamage(sh.owner, o, sh.dmg, sh.item ? "heavy" : (sh.fin ? "special" : "heavy"), sh.fin, sh.x, sh.y);
          hit = true;
        }
        if (hit || sh.life <= 0 || sh.x < -30 || sh.x > VW + 30 || (sh.grav != null && sh.y > GROUND + 6)) {
          if (sh.item && !hit) { groundItem = { kind: sh.item, x: clamp(sh.x, 40, VW - 40), y: GROUND }; }
          shots.splice(i, 1);
        }
      }
    }
    function resolveHit(f, other, kind, fin) {
      // aerial strike: a fat hitbox around the god that reaches DOWN, so a leap onto a
      // grounded foe connects (no strict horizontal-only gate like the ground strikes).
      if (kind === "aerial") {
        var axd = Math.abs(other.x - f.x), ayd = Math.abs((f.y || 0) - (other.y || 0));
        if (axd > 78 || ayd > 130 || other.state === "ko") return;
        var hy = GROUND - 72 - Math.min(f.y || 0, other.y || 0) * 0.5;
        applyDamage(f, other, 15, "aerial", fin, (f.x + other.x) / 2, hy);
        return;
      }
      var reach = kind === "kick" ? 100 : kind === "headbutt" ? 50 : 62;
      var dx = (other.x - f.x) * f.facing;
      if (dx <= 4 || dx >= reach || other.state === "ko") return;
      var dmg = kind === "kick" ? 13 : kind === "headbutt" ? 16 : 6;
      applyDamage(f, other, dmg, kind, fin, (f.x + other.x) / 2, GROUND - 72);
    }
    // ONE damage path for punches, kicks, headbutts, blasts, thrown relics, debris.
    function applyDamage(f, other, dmg, kind, fin, hx, hy) {
      if (other.state === "ko") return;
      var heavy = kind === "kick" || kind === "heavy" || kind === "headbutt" || kind === "special" || kind === "aerial";
      var blocked = other.state === "block" && other.facing !== (f ? f.facing : other.facing) && kind !== "debris";
      if (fin) { dmg = 100; blocked = false; }
      var raw = dmg;
      if (blocked) dmg = Math.round(dmg * 0.25);
      other.hp = clamp(other.hp - dmg, 0, 100);
      if (f) { f.energy = clamp(f.energy + (heavy ? 8 : 10), 0, 100); }
      other.energy = clamp(other.energy + 6, 0, 100);
      if (!blocked) {
        setState(other, "hit", kind === "headbutt" ? 0.42 : 0.34); other.hitLock = 0.34; other.combo = 0;
        var dir = f ? f.facing : (other.x > VW / 2 ? -1 : 1);
        other.vx = dir * (fin ? 6 : kind === "kick" || kind === "headbutt" || kind === "aerial" ? 4.2 : kind === "special" ? 5 : 2);
        if (f) f.combo++;
        burst(hx, hy, fin ? "special" : heavy ? "heavy" : "light"); spray(hx, hy, other.skin.blood, fin ? "special" : heavy ? "heavy" : "light");
        shake = Math.max(shake, fin ? 18 : heavy ? 9 : 4);
        hitStop = Math.max(hitStop, fin ? 0.25 : heavy ? 0.12 : 0.06);
        var pools = fin ? 6 : heavy ? 4 : 2;   // more blood than before
        for (var pj = 0; pj < pools; pj++) blood.push({ x: other.x + rnd(-18, 18), y: GROUND + rnd(0, 8), r: rnd(3, 9), col: other.skin.blood, life: 1 });
      } else {
        other.vx = (f ? f.facing : 1) * 1.2; burst(hx, hy, "block"); shake = Math.max(shake, 2); hitStop = Math.max(hitStop, 0.04);
        // guard absorbs the blow but the meter erodes; empty it and the guard breaks
        other.guard = clamp(other.guard - (raw * 1.8 + 6), 0, 100);
        if (other.guard <= 0) {
          setState(other, "hit", 0.42); other.hitLock = 0.42; other.combo = 0;
          other.vx = (f ? f.facing : 1) * 3.4; other.guard = 45;
          other.hp = clamp(other.hp - 4, 0, 100); shake = Math.max(shake, 9);
          banner = { txt: "GUARD BROKEN", t: 1.1, fin: false };
        }
      }
      if (fin) { flash = 1; spray(hx, hy, other.skin.blood, "special"); spray(hx, hy, other.skin.blood, "special"); burst(hx, hy, "special"); }
      if (other.hp <= 0 && other.state !== "ko") {
        setState(other, "ko", 1.2); other.combo = 0;
        var name = f ? f.skin.name : "The arena";
        banner = { txt: (fin ? "FINISH — " : "") + name + (fin ? " triumphant" : " prevails"), t: 3, fin: !!fin };
        shake = Math.max(shake, 12); winner = f || (other === p1 ? p2 : p1);
        for (var i = 0; i < (fin ? 18 : 10); i++) blood.push({ x: other.x + rnd(-24, 24), y: GROUND + rnd(-2, 8), r: rnd(3, 10), col: other.skin.blood, life: 1 });
      }
    }
    function burst(x, y, kind) {
      var col = kind === "special" ? "#bfe3ff" : kind === "block" ? "#cbb78a" : UI.goldB, n = kind === "light" ? 10 : kind === "special" ? 22 : 16;
      fx.push({ t: "flash", x: x, y: y, r: kind === "special" ? 40 : kind === "heavy" ? 30 : 18, life: 1, col: col });
      if (kind === "heavy" || kind === "special") fx.push({ t: "ring", x: x, y: y, r: kind === "special" ? 12 : 9, life: 1, col: col });
      for (var i = 0; i < n; i++) { var a = (i / n) * 6.28; fx.push({ t: "line", x: x, y: y, a: a, len: rnd(12, kind === "special" ? 48 : 28), life: 1, col: col }); }
      // flying sparks (gold, reusing the blood renderer with a bright colour)
      if (kind !== "block") for (var sp = 0; sp < (kind === "light" ? 4 : 9); sp++) fx.push({ t: "blood", x: x, y: y, vx: rnd(-1, 1) * 8, vy: rnd(-7, -1), life: 1, r: rnd(1, 2.6), col: col });
    }
    function spray(x, y, col, kind) { var n = kind === "special" ? 26 : kind === "heavy" ? 18 : 9; for (var i = 0; i < n; i++) fx.push({ t: "blood", x: x, y: y, vx: rnd(-1, 1) * 9, vy: rnd(-7, 1.5), life: 1, r: rnd(1.6, 4), col: col }); }
    function drawFX(c) {
      for (var i = fx.length - 1; i >= 0; i--) {
        var e = fx[i];
        if (e.t === "flash") { c.save(); c.globalCompositeOperation = "lighter"; var g = c.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * (1.4 - e.life * 0.4)); g.addColorStop(0, hexA(e.col, e.life)); g.addColorStop(0.5, hexA(e.col, e.life * 0.5)); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.beginPath(); c.arc(e.x, e.y, e.r * (1.4 - e.life * 0.4), 0, 7); c.fill();
          // impact star
          c.strokeStyle = hexA("#ffffff", e.life); c.lineWidth = 2; for (var k = 0; k < 4; k++) { var aa = k * 0.785; c.beginPath(); c.moveTo(e.x - Math.cos(aa) * e.r, e.y - Math.sin(aa) * e.r); c.lineTo(e.x + Math.cos(aa) * e.r, e.y + Math.sin(aa) * e.r); c.stroke(); } c.restore(); }
        else if (e.t === "line") { c.strokeStyle = hexA(e.col, e.life); c.lineWidth = 2; c.beginPath(); var r0 = (1 - e.life) * 8; c.moveTo(e.x + Math.cos(e.a) * r0, e.y + Math.sin(e.a) * r0); c.lineTo(e.x + Math.cos(e.a) * (r0 + e.len), e.y + Math.sin(e.a) * (r0 + e.len)); c.stroke(); }
        else if (e.t === "ring") { c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = hexA(e.col, e.life * 0.85); c.lineWidth = 3.5 * e.life + 0.5; c.beginPath(); c.arc(e.x, e.y, e.r + (1 - e.life) * 46, 0, 7); c.stroke(); c.restore(); }
        else if (e.t === "blood") { c.fillStyle = hexA(e.col, clamp(e.life, 0, 1)); c.beginPath(); c.arc(e.x, e.y, e.r, 0, 7); c.fill(); }
      }
    }

    /* ===================== projectiles, relics, debris ===================== */
    function drawShots(c) {
      for (var i = 0; i < shots.length; i++) {
        var sh = shots[i];
        if (sh.item) { drawItemAt(c, sh.item, sh.x, sh.y, sh.spin || 0); continue; }
        // energy orb: bright core, colored halo, motion trail
        c.save(); c.globalCompositeOperation = "lighter";
        var g = c.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, sh.r * 2.2);
        g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.4, hexA(sh.col, 0.8)); g.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = g; c.beginPath(); c.arc(sh.x, sh.y, sh.r * 2.2, 0, 7); c.fill();
        // comet tail
        for (var k = 1; k <= 5; k++) { c.globalAlpha = 0.4 - k * 0.06; c.fillStyle = sh.col; c.beginPath(); c.arc(sh.x - sh.vx * k * 1.4, sh.y, sh.r * (1 - k * 0.13), 0, 7); c.fill(); }
        c.restore();
      }
    }
    function drawItemAt(c, it, x, y, spin) {
      c.save(); c.translate(x, y); c.rotate(spin);
      c.strokeStyle = "#1a1109"; c.lineWidth = 1.5;
      if (it.id === "amphora") {
        c.fillStyle = it.col; c.beginPath(); c.ellipse(0, 0, it.r * 0.7, it.r, 0, 0, 7); c.fill(); c.stroke();
        c.strokeStyle = it.colSh; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-it.r * 0.6, -it.r * 0.5); c.quadraticCurveTo(-it.r * 1.1, 0, -it.r * 0.6, it.r * 0.4); c.stroke();
        c.beginPath(); c.moveTo(it.r * 0.6, -it.r * 0.5); c.quadraticCurveTo(it.r * 1.1, 0, it.r * 0.6, it.r * 0.4); c.stroke();
      } else if (it.id === "boulder") {
        c.fillStyle = it.col; c.beginPath(); c.moveTo(-it.r, 2); c.lineTo(-it.r * 0.5, -it.r); c.lineTo(it.r * 0.6, -it.r * 0.7); c.lineTo(it.r, it.r * 0.4); c.lineTo(0, it.r); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = it.colSh; c.beginPath(); c.moveTo(-it.r * 0.4, -it.r * 0.4); c.lineTo(it.r * 0.3, it.r * 0.2); c.stroke();
      } else { // spear
        c.strokeStyle = it.colSh; c.lineWidth = 3; c.beginPath(); c.moveTo(-it.r * 1.6, 0); c.lineTo(it.r * 1.2, 0); c.stroke();
        c.fillStyle = it.col; c.beginPath(); c.moveTo(it.r * 1.2, -3.5); c.lineTo(it.r * 2, 0); c.lineTo(it.r * 1.2, 3.5); c.closePath(); c.fill();
      }
      c.restore();
    }
    function drawGroundItem(c, t) {
      if (!groundItem) return;
      var bob = Math.sin(t * 3) * 2;
      c.save(); c.globalAlpha = 0.5; c.fillStyle = UI.goldB;
      c.beginPath(); c.ellipse(groundItem.x, GROUND + 2, 12, 3, 0, 0, 7); c.fill(); c.restore();
      // a soft "take me" glow
      c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = 0.3 + Math.sin(t * 4) * 0.12;
      var g = c.createRadialGradient(groundItem.x, GROUND - 12 + bob, 2, groundItem.x, GROUND - 12 + bob, 22);
      g.addColorStop(0, hexA(UI.goldB, 0.8)); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g;
      c.beginPath(); c.arc(groundItem.x, GROUND - 12 + bob, 22, 0, 7); c.fill(); c.restore();
      drawItemAt(c, groundItem.kind, groundItem.x, GROUND - 12 + bob, 0);
    }
    function drawHeld(c, f) {
      if (!f.holding) return;
      var hx = f.x + f.facing * 26, hy = GROUND - 108 - (f.y || 0);
      drawItemAt(c, f.holding, hx, hy, 0);
    }
    function landDust(f) { for (var i = 0; i < 5; i++) fx.push({ t: "line", x: f.x + rnd(-11, 11), y: GROUND, a: rnd(3.4, 6), len: rnd(4, 12), life: 1, col: "#6a5a42" }); }
    function spawnDebris() {
      var x = rnd(60, VW - 60);
      debris.push({ x: x, y: -20, vy: rnd(2.6, 4.6), r: rnd(7, 14), spin: 0, vs: rnd(-0.25, 0.25), col: Math.random() < 0.5 ? "#5a4a34" : "#4a4038" });
    }
    function updateDebris(dt) {
      for (var i = debris.length - 1; i >= 0; i--) {
        var d = debris[i]; d.y += d.vy; d.spin += d.vs;
        // hit a fighter?
        [p1, p2].forEach(function (f) {
          if (!f || d.hit || f.state === "ko") return;
          if (Math.abs(d.x - f.x) < 22 && d.y > GROUND - 150 - (f.y || 0) && d.y < GROUND - 40 - (f.y || 0)) {
            d.hit = true; applyDamage(null, f, 10, "debris", false, d.x, d.y);
          }
        });
        if (d.hit || d.y > GROUND + 4) {
          if (!d.hit) { for (var s = 0; s < 5; s++) fx.push({ t: "line", x: d.x, y: GROUND, a: rnd(3.4, 6), len: rnd(6, 16), life: 1, col: "#6a5a42" }); shake = Math.max(shake, 3); }
          debris.splice(i, 1);
        }
      }
    }
    function drawDebris(c) {
      for (var i = 0; i < debris.length; i++) {
        var d = debris[i]; c.save(); c.translate(d.x, d.y); c.rotate(d.spin);
        c.fillStyle = d.col; c.strokeStyle = "#160f08"; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(-d.r, 2); c.lineTo(-d.r * 0.4, -d.r); c.lineTo(d.r * 0.7, -d.r * 0.6); c.lineTo(d.r, d.r * 0.5); c.lineTo(-d.r * 0.2, d.r); c.closePath(); c.fill(); c.stroke();
        c.restore();
      }
    }
    /* ---- weather ---- */
    function initWeather(w) {
      weather = w; rain = [];
      var n = w.rain || w.dust;
      for (var i = 0; i < n; i++) rain.push({ x: Math.random() * (VW + 60) - 30, y: Math.random() * VH, v: (w.rain ? rnd(8, 14) : rnd(0.6, 1.6)), len: w.rain ? rnd(9, 16) : 0, r: w.dust ? rnd(1, 2.4) : 0, drift: rnd(-0.4, 0.4) });
    }
    function updateWeather(dt, t) {
      if (!weather) return;
      for (var i = 0; i < rain.length; i++) {
        var p = rain[i];
        if (weather.rain) { p.y += p.v; p.x += 1.4; if (p.y > VH) { p.y = -10; p.x = Math.random() * (VW + 60) - 30; } }
        else { p.y += p.v; p.x += Math.sin(t + i) * 0.4 + p.drift; if (p.y > VH) { p.y = -6; p.x = Math.random() * VW; } }
      }
      if (weather.storm) { boltFlash = Math.max(0, boltFlash - dt * 3); if (Math.random() < 0.006) { boltFlash = 1; flash = Math.max(flash, 0.5); } }
    }
    function drawWeather(c) {
      if (!weather) return;
      if (weather.rain) {
        c.save(); c.strokeStyle = "rgba(180,205,230,.35)"; c.lineWidth = 1.2; c.lineCap = "round";
        for (var i = 0; i < rain.length; i++) { var p = rain[i]; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - 2, p.y + p.len); c.stroke(); }
        c.restore();
      } else if (weather.dust) {
        c.save(); c.globalCompositeOperation = "lighter";
        for (var k = 0; k < rain.length; k++) { var d = rain[k]; c.globalAlpha = 0.4; c.fillStyle = k % 3 ? "#c9782e" : "#e7c680"; c.beginPath(); c.arc(d.x, d.y, d.r, 0, 7); c.fill(); }
        c.restore();
      }
    }

    /* ===================== AI ===================== */
    function think(f, other, dt) {
      if (f.state === "hit" || f.state === "ko") return;
      var dx = other.x - f.x, adx = Math.abs(dx), dir = dx > 0 ? 1 : -1; f.facing = dir; f.aiT = (f.aiT || 0) - dt;
      // airborne: drift toward the foe and sometimes throw an aerial strike
      if (!f.onGround) { f.vx = dir * 2.2; if (f.cooldown <= 0 && adx < 90 && Math.random() < 0.08) tryAttack(f, other, Math.random() < 0.5 ? "heavy" : "light"); return; }
      // occasionally leap — to close distance or dodge, and to bring the fight into the air
      if (f.onGround && f.cooldown <= 0 && Math.random() < 0.012 && (adx < 60 || adx > 150)) { f.vy = 12.5; f.onGround = false; setState(f, "jump", 0.9); landDust(f); return; }
      // holding a relic: close a little, then hurl it
      if (f.holding) { if (adx > 180) { f.vx = dir * 1.6; if (f.onGround && f.state !== "walk") setState(f, "walk", 1); return; } if (f.aiT <= 0) { tryAttack(f, other, "light"); f.aiT = 0.6; } return; }
      // a relic lies nearby and I'm free — go grab it sometimes
      if (groundItem && Math.abs(groundItem.x - f.x) < 30 && Math.random() < 0.04) { tryGrab(f); return; }
      var wantItem = groundItem && Math.abs(groundItem.x - f.x) < 120 && adx > 130 && Math.random() < 0.5;
      if (wantItem) { var gd = groundItem.x > f.x ? 1 : -1; f.facing = gd; f.vx = gd * 1.7; if (f.onGround && f.state !== "walk") setState(f, "walk", 1); if (Math.abs(groundItem.x - f.x) < 30) tryGrab(f); return; }
      if (adx > 74) {
        // at range, sometimes throw an energy blast instead of closing
        if (adx > 150 && f.energy >= 40 && f.aiT <= 0 && Math.random() < 0.5) { tryAttack(f, other, "special"); f.aiT = 1.0 + Math.random(); return; }
        f.intent = "advance";
      }
      else if (f.aiT <= 0) { var r = Math.random(); f.intent = r < 0.42 ? "light" : r < 0.66 ? "heavy" : r < 0.82 ? "block" : (f.energy >= 40 ? "special" : "light"); f.aiT = 0.45 + Math.random() * 0.6; }
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
          '<div class="fg-en"><i style="width:' + clamp(f.energy, 0, 100) + '%"></i></div>' +
          '<div class="fg-gd"' + (f.guard < 100 ? ' data-low="1"' : '') + '><i style="width:' + clamp(f.guard, 0, 100) + '%"></i></div></div>';
      }
      hudEl.innerHTML = bar(p1, "l") + '<div class="fg-mid"><span class="fg-vs">✦</span>' + (weather ? '<span class="fg-weather">' + weather.name + '</span>' : '') + '</div>' + bar(p2, "r");
    }

    /* ===================== loop ===================== */
    function frame(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; var t = ts / 1000;
      for (var i = 0; i < motes.length; i++) { var mo = motes[i]; mo.y -= mo.v * dt * 30; mo.x += Math.sin(t + i) * 0.2; if (mo.y < 0) { mo.y = VH; mo.x = Math.random() * VW; } }
      flash = Math.max(0, flash - dt * 2); shake = Math.max(0, shake - dt * 32);
      updateWeather(dt, t);
      if (hitStop > 0) { hitStop -= dt; } else {
        gameT += dt; [p1, p2].forEach(function (f) { update(f, f === p1 ? p2 : p1, dt); });
        // keep the fighters from overlapping so you can always tell them apart
        var sepdx = p2.x - p1.x, ad = Math.abs(sepdx);
        if (ad < 46 && p1.state !== "ko" && p2.state !== "ko") { var push = (46 - ad) / 2, sgn = sepdx >= 0 ? 1 : -1; p1.x = clamp(p1.x - sgn * push, 40, VW - 40); p2.x = clamp(p2.x + sgn * push, 40, VW - 40); }
        updateShots(dt); updateDebris(dt);
        // falling debris — frequent enough to matter, in every weather (storms rain more)
        debrisT -= dt; if (debrisT <= 0 && winner == null) { debrisT = rnd(1.1, 2.4); if (Math.random() < (weather ? weather.debris : 0.14) + 0.55) { spawnDebris(); if (Math.random() < 0.4) spawnDebris(); } }
        itemT -= dt; if (itemT <= 0 && winner == null) { itemT = rnd(6, 9); if (!groundItem && !p1.holding && !p2.holding) groundItem = { kind: ITEM_KINDS[(Math.random() * ITEM_KINDS.length) | 0], x: rnd(150, VW - 150), y: GROUND }; }
      }
      for (var s = fx.length - 1; s >= 0; s--) { var e = fx[s]; if (e.t === "blood") { e.x += e.vx; e.y += e.vy; e.vy += 0.4; } e.life -= dt * (e.t === "flash" ? 3.2 : e.t === "line" ? 4 : e.t === "ring" ? 3.4 : 1.6); if (e.life <= 0) fx.splice(s, 1); }
      for (var b = blood.length - 1; b >= 0; b--) { blood[b].life -= dt * 0.045; if (blood[b].life <= 0) blood.splice(b, 1); }
      if (blood.length > 60) blood.splice(0, blood.length - 60);
      cx.clearRect(0, 0, VW, VH);
      cx.save();
      if (shake > 0.3) cx.translate(rnd(-shake, shake), rnd(-shake, shake));
      drawStage(cx, t);
      drawGroundItem(cx, t);
      drawDebris(cx);
      var order = p1.x < p2.x ? [p1, p2] : [p2, p1];
      drawFighter(cx, order[0], gameT); drawHeld(cx, order[0]);
      drawFighter(cx, order[1], gameT); drawHeld(cx, order[1]);
      drawShots(cx);
      drawWeather(cx);
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
      // guard meter: erodes while you hold block, recovers while you don't; hold too long and it breaks
      if (f.state === "block") { f.guard = clamp(f.guard - dt * 7, 0, 100); if (f.guard <= 0) { setState(f, "hit", 0.4); f.hitLock = 0.4; f.guard = 45; shake = Math.max(shake, 6); } }
      else if (f.guard < 100) { f.guard = clamp(f.guard + dt * 16, 0, 100); }
      if (f._hit && !f._hit.done && f.stTime >= f._hit.at * f.stDur) { f._hit.done = true; resolveHit(f, other, f._hit.kind, f._hit.fin); }
      if (f._cast && !f._cast.done && f.stTime >= f._cast.at * f.stDur) { f._cast.done = true; spawnShot(f, f._cast.fin); }
      if (f.isAI) think(f, other, dt); else humanControl(f, other);
      // weighty locomotion: ease the ACTUAL velocity toward the control's desired
      // velocity so starts and stops carry momentum instead of snapping. Knockback
      // (hit/ko) keeps its own impulse and just decays.
      if (f.state === "hit" || f.state === "ko") { f.x += f.vx; f.vx *= 0.82; f.mvx = f.vx; }
      else {
        var accel = f.vx !== 0 ? 0.24 : 0.32;
        f.mvx += (f.vx - f.mvx) * accel;
        if (Math.abs(f.mvx) < 0.04) f.mvx = 0;
        f.x += f.mvx;
      }
      f.x = clamp(f.x, 40, VW - 40);
      // vertical: jump arc + gravity (f.y is height above the ground)
      if (!f.onGround || f.y > 0 || f.vy !== 0) {
        f.y += f.vy; f.vy -= 0.56;
        if (f.y <= 0) { f.y = 0; f.vy = 0; if (!f.onGround) { f.onGround = true; landDust(f); if (f.state === "jump") setState(f, "idle", 1); } }
        else f.onGround = false;
      }
      var acting = { light: 1, kick: 1, headbutt: 1, throw: 1, special: 1, hit: 1, aerial: 1 };
      if (acting[f.state] && f.stTime >= f.stDur) { var was = f.state; setState(f, f.onGround ? "idle" : "jump", 1); f._hit = null; f._cast = null; if (was !== "hit") f.combo = 0; }
      if (f.state === "walk" && Math.abs(f.vx) < 0.1 && f.onGround) setState(f, "idle", 1);
      if ((f.state === "idle" || f.state === "walk" || f.state === "jump") && !f.isAI) f.facing = (other.x > f.x) ? 1 : -1;
    }
    function humanControl(f, other) {
      var km = f.km || {};
      if (f.state === "hit" || f.state === "ko") { if (f.onGround) f.vx = 0; return; }
      // leap out of idle/walk
      if (keys[km.jump] && f.onGround && f.state !== "block" && f.cooldown <= 0) { f.vy = 12.5; f.onGround = false; setState(f, "jump", 0.9); keys[km.jump] = false; landDust(f); }
      if (!f.onGround) { // air control: drift, keep the current attack/jump pose
        if (keys[km.left]) { f.vx = -2.4; f.facing = -1; } else if (keys[km.right]) { f.vx = 2.4; f.facing = 1; } else f.vx *= 0.9;
        return;
      }
      if (f.cooldown > 0) { f.vx = 0; return; }
      f.vx = 0;
      if (keys[km.block]) { setState(f, "block", 0.4); return; }
      if (keys[km.left]) { f.vx = -3.1; f.facing = -1; if (f.state !== "walk") setState(f, "walk", 1); }
      else if (keys[km.right]) { f.vx = 3.1; f.facing = 1; if (f.state !== "walk") setState(f, "walk", 1); }
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
      if (HERO.ready) { var cr = heroCrop(id); drawCover(pc, HERO.img, cr.sx, cr.sy, cr.sw, cr.sh, W, H, HERO_FOCUS[id], 0.36); return; }
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
          '<p class="rq-note">P1: A/D move · S guard · J punch · K kick (headbutt up close) · L energy blast · U grab/throw a relic.' + (sel.twoP ? " P2: ←/→ · ↓ guard · , punch · . kick · / blast · M grab." : " On touch, use the on-screen pads.") + " The stage turns: rain, storms with falling debris, ashfall. Snatch a fallen amphora, boulder or spear and hurl it. Fill the energy bar and land a blast on a weakened foe for a FINISH.</p>";
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
          '<div class="fg-dpad">' +
            '<button class="ouro-key fg-jump" data-k="' + KM1.jump + '" aria-label="Jump">⤒</button>' +
            '<button class="ouro-key fg-left" data-k="' + KM1.left + '" aria-label="Move left">◀</button>' +
            '<button class="ouro-key fg-guard" data-k="' + KM1.block + '" aria-label="Guard">🛡</button>' +
            '<button class="ouro-key fg-right" data-k="' + KM1.right + '" aria-label="Move right">▶</button></div>' +
          '<div class="fg-actions">' +
            '<button class="ouro-key fg-atk-l" data-atk="light" aria-label="Punch">👊</button>' +
            '<button class="ouro-key fg-atk-h" data-atk="heavy" aria-label="Kick">🦶</button>' +
            '<button class="ouro-key fg-atk-s" data-atk="special" aria-label="Energy blast">⚡</button>' +
            '<button class="ouro-key fg-atk-g" data-act="grab" aria-label="Grab / throw">✋</button></div>' +
        "</div>" +
        '<div class="rq-actions" style="margin-top:.4rem"><button class="rq-btn" data-a="back">‹ Choose fighters</button></div>';
      canvas = root.querySelector(".fg-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".fg-hud");
      // movement: hold to move (touch + mouse)
      root.querySelectorAll(".fg-dpad .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k"), dn = function (e) { e.preventDefault(); keys[k] = true; }, up = function (e) { if (e) e.preventDefault(); keys[k] = false; };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up, { passive: false }); b.addEventListener("touchcancel", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
      // attacks: fire instantly on press (touchstart/pointerdown), so they work mid-air and don't wait for a click
      root.querySelectorAll(".fg-actions .ouro-key").forEach(function (b) {
        var fire = function (e) { if (e) e.preventDefault(); if (!p1) return; if (b.getAttribute("data-act") === "grab") tryGrab(p1); else tryAttack(p1, p2, b.getAttribute("data-atk")); };
        b.addEventListener("touchstart", fire, { passive: false }); b.addEventListener("mousedown", fire);
      });
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
      fx = []; blood = []; shots = []; debris = []; groundItem = null; banner = null; flash = 0; shake = 0; hitStop = 0; gameT = 0; winner = null; resultShown = false;
      debrisT = rnd(2, 4); itemT = rnd(4, 7); boltFlash = 0;
      initWeather(WEATHERS[(Math.random() * WEATHERS.length) | 0]);
      if (HERO.ready) vsSplash(function () { running = true; last = performance.now(); raf = requestAnimationFrame(frame); });
      else { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    }
    // brief cinematic VS card using the two hero portraits
    function vsSplash(cb) {
      var t0 = performance.now();
      (function anim() {
        var e = (performance.now() - t0) / 1000; drawSplash(e);
        if (e < 1.5) raf = requestAnimationFrame(anim); else cb();
      })();
    }
    function drawSplash(e) {
      var t = Math.min(1, e / 0.42), pop = Math.min(1, Math.max(0, (e - 0.3) / 0.3)), pw = 250, ph = VH;
      cx.clearRect(0, 0, VW, VH);
      var sky = cx.createLinearGradient(0, 0, 0, VH); sky.addColorStop(0, "#241a2e"); sky.addColorStop(0.7, UI.ember); sky.addColorStop(1, "#140d07"); cx.fillStyle = sky; cx.fillRect(0, 0, VW, VH);
      var ease = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      drawHeroPanel(curG1, -pw + ease * (30 + pw), 0, pw, ph);
      drawHeroPanel(curG2, VW - 30 - pw + (1 - ease) * pw, 0, pw, ph);
      // clash flash
      if (pop > 0) { cx.save(); cx.globalCompositeOperation = "lighter"; cx.globalAlpha = 0.3 * (1 - Math.abs(pop - 0.5) * 2); cx.fillStyle = UI.goldB; cx.fillRect(VW / 2 - 60, 0, 120, VH); cx.restore(); }
      cx.save(); cx.globalAlpha = pop; cx.translate(VW / 2, VH / 2); cx.scale(0.5 + pop * 0.6, 0.5 + pop * 0.6);
      cx.font = "700 56px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillStyle = UI.goldB; cx.strokeStyle = "#20160a"; cx.lineWidth = 4; cx.strokeText("VS", 0, 18); cx.fillText("VS", 0, 18); cx.restore();
    }
    function drawHeroPanel(id, x, y, w, h) {
      cx.save();
      var P = new Path2D(); P.rect(x + 4, y + 18, w - 8, h - 36); cx.clip(P);
      if (HERO.ready) { var cr = heroCrop(id); cx.save(); cx.translate(x + 4, y + 18); drawCover(cx, HERO.img, cr.sx, cr.sy, cr.sw, cr.sh, w - 8, h - 36, HERO_FOCUS[id], 0.28); cx.restore(); }
      cx.restore();
      cx.strokeStyle = "rgba(199,154,84,.5)"; cx.lineWidth = 1.5; cx.strokeRect(x + 4, y + 18, w - 8, h - 36);
      cx.fillStyle = UI.goldB; cx.font = "700 17px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.shadowColor = "#000"; cx.shadowBlur = 6;
      cx.fillText((ROSTER[id] || ZEUS).name.toUpperCase(), x + w / 2, y + h - 4); cx.shadowBlur = 0;
    }
    function attachKeys() {
      keyfn = function (e) {
        var k = e.key.toLowerCase();
        var moveKeys = [KM1.left, KM1.right, KM1.block, KM1.jump, KM2.left, KM2.right, KM2.block, KM2.jump];
        if (moveKeys.indexOf(k) >= 0) { keys[k] = true; if (k.indexOf("arrow") === 0) e.preventDefault(); }
        if (!running) return;
        [p1, p2].forEach(function (f) {
          if (!f || !f.km) return; var o = (f === p1) ? p2 : p1;
          if (k === f.km.light) { tryAttack(f, o, "light"); e.preventDefault(); }
          else if (k === f.km.heavy) { tryAttack(f, o, "heavy"); e.preventDefault(); }
          else if (k === f.km.special) { tryAttack(f, o, "special"); e.preventDefault(); }
          else if (k === f.km.grab) { tryGrab(f); e.preventDefault(); }
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
