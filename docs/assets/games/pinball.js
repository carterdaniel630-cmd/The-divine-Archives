/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Firmament" (Pinball)

   Order struck out of chaos: launch the soul-spark up through the ordered
   heavens, ringing the celestial bumpers. Every bumper you strike enough
   times lights a star and reveals how a tradition drew the cosmos out of the
   primordial waters (data/pinball.json, checked by tools/verify-pinball.js).
   Real physics — substepped so nothing tunnels — with two flippers, angled
   slings, and a drain to guard. Left/Right (or A/D, or the two pads) flip;
   Space / tap / Launch fires the ball.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/pinball.json";
    return "assets/games/data/pinball.json";
  })();
  var facts = null, loadingPromise = null;
  function loadFacts() {
    if (facts) return Promise.resolve(facts);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(DATA_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { facts = (j && j.facts) || []; return facts; });
    return loadingPromise;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  AG.register("pinball", {
    title: "The Firmament",
    subtitle: "Launch the soul-spark through the ordered heavens; ring the celestial bumpers.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch46) || "",
    sourceHref: "chapters/ch46.html", sourceLabel: "Read “Creation & the First Order”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var VW = 320, VH = 460, GRAV = 0.2, REST = 0.58, MAXV = 10, SUB = 5;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34") };

    var canvas, cx, hudEl, live, raf = null, keyfn = null, keyup = null, last = 0, running = false, DPR = 1;
    var st = null, best = AG.bestScore("pinball");

    // static table walls (segments) + slings + bumpers
    var SEGS = [
      [16, 60, 16, 372], [304, 60, 304, 372],                 // 0,1 side walls
      [16, 60, 96, 28], [96, 28, 224, 22], [224, 28, 304, 60], // 2,3,4 top arc
      [16, 372, 120, 430], [304, 372, 200, 430],               // 5,6 bottom funnels
      [62, 330, 116, 380], [258, 330, 204, 380],               // 7,8 slingshots (kick)
      [270, 116, 270, 362]                                     // 9 launch-lane wall (ball shoots up the right lane)
    ];
    var SLING = [7, 8]; // indices of slingshot segments (extra kick)
    var BUMPERS = [
      { x: 96, y: 150, r: 20, hits: 0, lit: false, name: "Sun" },
      { x: 224, y: 150, r: 20, hits: 0, lit: false, name: "Moon" },
      { x: 160, y: 92, r: 22, hits: 0, lit: false, name: "Pole Star" },
      { x: 160, y: 230, r: 18, hits: 0, lit: false, name: "Earth" }
    ];
    var DRAIN = { x1: 120, x2: 200, y: 432 };

    function mkFlipper(px, py, sign) { return { px: px, py: py, len: 44, sign: sign, rest: 0.5, up: -0.55, ang: 0.5, av: 0, active: false }; }

    function newBall() { return { x: 287, y: 348, vx: 0, vy: 0, r: 7, launched: false }; } // rests in the right launch lane
    function newGame() {
      BUMPERS.forEach(function (b) { b.hits = 0; b.lit = false; });
      st = {
        ball: newBall(), balls: 3, score: 0, collected: [], seen: {},
        L: mkFlipper(112, 416, 1), R: mkFlipper(208, 416, -1),
        sparks: [], stars: [], over: false, msg: "Tap Launch (or Space) to cast the spark", charge: 0
      };
      for (var i = 0; i < 26; i++) st.stars.push({ x: Math.random() * VW, y: Math.random() * VH * 0.7, r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.1 });
    }

    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">The Firmament</h2>' +
          "<p>Fire the spark up through the heavens and ring the bumpers. Light each one to draw the cosmos out of chaos.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="pb-hud"></div>' +
        '<div class="pb-stage"><canvas class="pb-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Pinball table"></canvas></div>' +
        '<p class="ouro-toast pb-toast" aria-live="polite"></p>' +
        '<div class="pb-controls">' +
          '<button class="ouro-key pb-flip" data-f="L" aria-label="Left flipper">◣</button>' +
          '<button class="rq-btn pb-launch" data-a="launch">Launch ⤒</button>' +
          '<button class="ouro-key pb-flip" data-f="R" aria-label="Right flipper">◢</button>' +
        "</div><p class=\"rq-note\">Left/Right or A/D flip · Space or Launch fires the spark. Guard the drain between the flippers.</p>";
      canvas = root.querySelector(".pb-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".pb-hud"); live = root.querySelector(".pb-toast");
      wire();
    }
    function wire() {
      root.querySelectorAll(".pb-flip").forEach(function (b) {
        var f = b.getAttribute("data-f");
        var dn = function (e) { e.preventDefault(); setFlip(f, true); }, up = function () { setFlip(f, false); };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
      root.querySelector('[data-a="launch"]').addEventListener("click", launch);
    }
    function setFlip(which, on) { var f = which === "L" ? st.L : st.R; if (f) f.active = on; }
    function launch() {
      if (!st || st.over) return; var b = st.ball;
      if (!b.launched) { b.launched = true; b.vx = rnd(-0.4, 0.4); b.vy = -rnd(9.6, 10.2); st.msg = ""; live.textContent = ""; }
    }

    /* ---------------- physics ---------------- */
    function hitSeg(b, x1, y1, x2, y2, kick) {
      var dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1;
      var t = clamp(((b.x - x1) * dx + (b.y - y1) * dy) / L2, 0, 1);
      var cxp = x1 + dx * t, cyp = y1 + dy * t, nx = b.x - cxp, ny = b.y - cyp, d = Math.hypot(nx, ny);
      if (d < b.r && d > 0.0001) {
        nx /= d; ny /= d;
        b.x = cxp + nx * b.r; b.y = cyp + ny * b.r;
        var vn = b.vx * nx + b.vy * ny;
        if (vn < 0) { b.vx -= (1 + REST) * vn * nx; b.vy -= (1 + REST) * vn * ny; }
        if (kick) { b.vx += nx * kick; b.vy += ny * kick; addSpark(cxp, cyp, "#cbb78a"); }
        return true;
      }
      return false;
    }
    function hitFlipper(b, f) {
      var tx = f.px + Math.cos(f.ang) * f.len * f.sign, ty = f.py + Math.sin(f.ang) * f.len;
      var dx = tx - f.px, dy = ty - f.py, L2 = dx * dx + dy * dy || 1;
      var t = clamp(((b.x - f.px) * dx + (b.y - f.py) * dy) / L2, 0, 1);
      var cxp = f.px + dx * t, cyp = f.py + dy * t, nx = b.x - cxp, ny = b.y - cyp, d = Math.hypot(nx, ny);
      if (d < b.r + 3 && d > 0.0001) {
        nx /= d; ny /= d;
        b.x = cxp + nx * (b.r + 3); b.y = cyp + ny * (b.r + 3);
        var vn = b.vx * nx + b.vy * ny;
        if (vn < 0) { b.vx -= (1 + REST) * vn * nx; b.vy -= (1 + REST) * vn * ny; }
        // flipper drive: if swinging up, launch the ball
        if (f.av < -0.02) { var drive = Math.min(13, -f.av * f.len * t * 1.7); b.vx += nx * drive; b.vy += ny * drive; }
        return true;
      }
      return false;
    }
    function hitBumper(b, bm) {
      var nx = b.x - bm.x, ny = b.y - bm.y, d = Math.hypot(nx, ny);
      if (d < b.r + bm.r && d > 0.0001) {
        nx /= d; ny /= d; b.x = bm.x + nx * (b.r + bm.r); b.y = bm.y + ny * (b.r + bm.r);
        var vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= (1 + REST) * vn * nx; b.vy -= (1 + REST) * vn * ny; }
        b.vx += nx * 2.8; b.vy += ny * 2.8;
        bm.hits++; st.score += 100; addSpark(bm.x, bm.y, COL.goldB);
        if (!bm.lit && bm.hits >= 3) { bm.lit = true; st.score += 500; revealFact(); }
        return true;
      }
      return false;
    }
    function addSpark(x, y, col) { for (var i = 0; i < 6; i++) st.sparks.push({ x: x, y: y, vx: rnd(-3, 3), vy: rnd(-3, 3), life: 1, col: col }); }

    function stepFlipper(f, dt) {
      var target = f.active ? f.up : f.rest, prev = f.ang;
      f.ang += (target - f.ang) * Math.min(1, dt * 22);
      f.av = (f.ang - prev) / Math.max(dt, 0.001);
    }
    function physics(dt) {
      var b = st.ball;
      stepFlipper(st.L, dt); stepFlipper(st.R, dt);
      if (!b.launched) return;
      var steps = SUB;
      for (var s = 0; s < steps; s++) {
        b.vy += GRAV / steps;
        b.x += b.vx / steps; b.y += b.vy / steps;
        for (var i = 0; i < SEGS.length; i++) { var g = SEGS[i]; hitSeg(b, g[0], g[1], g[2], g[3], SLING.indexOf(i) >= 0 ? 3.6 : 0); }
        for (var k = 0; k < BUMPERS.length; k++) hitBumper(b, BUMPERS[k]);
        hitFlipper(b, st.L); hitFlipper(b, st.R);
      }
      var sp = Math.hypot(b.vx, b.vy); if (sp > MAXV) { b.vx *= MAXV / sp; b.vy *= MAXV / sp; }
      // failsafe: if the ball is barely moving and low on the table, it has settled
      // in a dead corner — nudge it once, and if it stays stuck, drain it (so you can lose).
      if (sp < 0.55) {
        b.stuck = (b.stuck || 0) + dt;
        if (b.stuck > 1.2 && b.stuck < 1.28) { b.vx += (b.x < VW / 2 ? 2.4 : -2.4); b.vy -= 3.2; } // one gentle nudge
        if (b.stuck > 3) return drain();
      } else b.stuck = 0;
      // drain (ball past the flippers, or off the bottom)
      if (b.y > DRAIN.y - 4 && b.x > DRAIN.x1 && b.x < DRAIN.x2) return drain();
      if (b.y > VH + 16) return drain();
    }
    function drain() {
      st.balls--;
      if (st.balls <= 0) { st.over = true; endScreen(); return; }
      st.ball = newBall(); st.msg = "Ball away — tap Launch for the next"; live.textContent = st.msg;
    }
    function revealFact() {
      if (!facts || !facts.length) return;
      var pool = facts.filter(function (f) { return !st.seen[f.label]; });
      if (!pool.length) return;
      var f = pool[(Math.random() * pool.length) | 0];
      st.seen[f.label] = 1; st.collected.push(f);
      live.innerHTML = '<span class="ouro-sym">✦</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    /* ---------------- render ---------------- */
    function draw() {
      var g = cx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, "#1a1226"); g.addColorStop(0.6, "#140d1c"); g.addColorStop(1, "#0d0906");
      cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
      for (var i = 0; i < st.stars.length; i++) { var s = st.stars[i]; cx.globalAlpha = s.a; cx.fillStyle = COL.goldB; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
      // walls
      cx.strokeStyle = "rgba(199,154,84,.55)"; cx.lineWidth = 3; cx.lineCap = "round";
      SEGS.forEach(function (sg, i) { cx.strokeStyle = SLING.indexOf(i) >= 0 ? COL.ember : "rgba(199,154,84,.5)"; cx.beginPath(); cx.moveTo(sg[0], sg[1]); cx.lineTo(sg[2], sg[3]); cx.stroke(); });
      // drain gap marker
      cx.strokeStyle = "rgba(180,60,60,.4)"; cx.setLineDash([3, 5]); cx.beginPath(); cx.moveTo(DRAIN.x1, DRAIN.y); cx.lineTo(DRAIN.x2, DRAIN.y); cx.stroke(); cx.setLineDash([]);
      // bumpers
      BUMPERS.forEach(function (bm) {
        cx.save();
        var rg = cx.createRadialGradient(bm.x - bm.r * 0.3, bm.y - bm.r * 0.3, 2, bm.x, bm.y, bm.r);
        rg.addColorStop(0, bm.lit ? "#fff2cf" : "#4a3a22"); rg.addColorStop(1, bm.lit ? COL.gold : "#2a2013");
        if (bm.lit) { cx.shadowColor = COL.goldB; cx.shadowBlur = 16; }
        cx.fillStyle = rg; cx.beginPath(); cx.arc(bm.x, bm.y, bm.r, 0, 7); cx.fill();
        cx.restore();
        cx.strokeStyle = bm.lit ? COL.goldB : "rgba(199,154,84,.4)"; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(bm.x, bm.y, bm.r, 0, 7); cx.stroke();
        cx.fillStyle = bm.lit ? "#2a1a0a" : "rgba(231,198,128,.5)"; cx.font = "600 8px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText(bm.name.toUpperCase(), bm.x, bm.y + 3);
      });
      // flippers
      [st.L, st.R].forEach(function (f) {
        var tx = f.px + Math.cos(f.ang) * f.len * f.sign, ty = f.py + Math.sin(f.ang) * f.len;
        cx.strokeStyle = COL.goldB; cx.lineWidth = 9; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(f.px, f.py); cx.lineTo(tx, ty); cx.stroke();
        cx.strokeStyle = "#7a5a2a"; cx.lineWidth = 3; cx.stroke();
        cx.fillStyle = COL.gold; cx.beginPath(); cx.arc(f.px, f.py, 4, 0, 7); cx.fill();
      });
      // ball
      var b = st.ball;
      cx.save(); cx.shadowColor = COL.goldB; cx.shadowBlur = 10;
      var bg = cx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, b.r);
      bg.addColorStop(0, "#fff8e6"); bg.addColorStop(1, COL.gold); cx.fillStyle = bg;
      cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 7); cx.fill(); cx.restore();
      // sparks
      for (var s2 = st.sparks.length - 1; s2 >= 0; s2--) { var sp = st.sparks[s2]; cx.globalAlpha = clamp(sp.life, 0, 1); cx.fillStyle = sp.col; cx.beginPath(); cx.arc(sp.x, sp.y, 2, 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
      if (!b.launched && st.msg) { cx.fillStyle = "rgba(231,198,128,.9)"; cx.font = "600 12px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText(st.msg, VW / 2, VH * 0.5); }
    }

    function updateHUD() {
      hudEl.innerHTML = '<div class="pm-stat"><b>' + st.score + '</b><span>Score</span></div>' +
        '<div class="pm-stat"><b>' + "●".repeat(Math.max(0, st.balls)) + '</b><span>Sparks</span></div>' +
        '<div class="pm-stat"><b>' + BUMPERS.filter(function (b) { return b.lit; }).length + '/' + BUMPERS.length + '</b><span>Lit</span></div>';
    }

    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.033, (ts - last) / 1000 || 0); last = ts;
      if (!st.over) physics(dt);
      for (var s = st.sparks.length - 1; s >= 0; s--) { var sp = st.sparks[s]; sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.15; sp.life -= dt * 2.4; if (sp.life <= 0) st.sparks.splice(s, 1); }
      draw(); updateHUD();
      if (!st.over) raf = requestAnimationFrame(loop);
    }

    function endScreen() {
      running = false; if (raf) cancelAnimationFrame(raf);
      var nb = st.score > best; if (nb) best = st.score;
      AG.addHighScore("pinball", { score: st.score });
      var recap = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">The Firmament · the spark goes out</p>' +
          '<h2 id="' + ctx.titleId + '">' + st.score + ' — ' + BUMPERS.filter(function (b) { return b.lit; }).length + ' of ' + BUMPERS.length + ' heavens lit</h2>' +
          (nb ? '<p style="color:var(--gold-bright)">✦ A new best.</p>' : "") + "</div>" +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The cosmogonies you kindled:</p><ul class="ouro-facts">' + recap + "</ul>" : '<p class="rq-note" style="text-align:center">Ring a bumper three times to light a heaven and reveal its creation.</p>') +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>Cast again</button>' +
          '<a class="game-source" href="chapters/ch46.html">› Read “Creation & the First Order”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); updateHUD(); draw();
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }

    keyfn = function (e) {
      var k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { setFlip("L", true); e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { setFlip("R", true); e.preventDefault(); }
      else if (k === " " || k === "spacebar") { launch(); e.preventDefault(); }
    };
    keyup = function (e) { var k = e.key.toLowerCase(); if (k === "arrowleft" || k === "a") setFlip("L", false); else if (k === "arrowright" || k === "d") setFlip("R", false); };
    document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);

    root.innerHTML = '<div class="rq-loading">Winding the heavens…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The table could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); if (keyup) document.removeEventListener("keyup", keyup); };
  }
})();
