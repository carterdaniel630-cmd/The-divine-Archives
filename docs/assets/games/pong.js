/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Antithesis — The Eternal Contest" (Pong)

   The oldest religious pattern set to the oldest video game: two paired
   cosmic principles — order and the Lie, yang and yin, Ma'at and Isfet —
   volley a blazing orb between them. Every point won uncovers a fact about
   that dualism, drawn from a real chapter (data/pong.json, checked by
   tools/verify-pong.js). Keyboard + touch-drag + on-screen pads; vs an AI
   of three tempers, or a friend across the same keyboard.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/pong.json";
    return "assets/games/data/pong.json";
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
  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

  AG.register("pong", {
    title: "Antithesis",
    subtitle: "The Eternal Contest — two cosmic principles volley the sacred orb.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch06) || "",
    sourceHref: "chapters/ch06.html", sourceLabel: "Read “Zoroaster”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var VW = 640, VH = 400, WIN = 5;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = {
      gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"),
      ink: v("--ink", "#cdbb96"), line: v("--line-soft", "#2a2013")
    };
    var LIGHT = "#e7c680", DARK = "#b98cff"; // Order (gold) vs Chaos (violet)

    var canvas, cx, hudEl, live, raf = null, keyfn = null, keyup = null, last = 0, running = false, DPR = 1;
    var keys = {}, st = null, twoP = false, temper = 1; // 0 mild, 1 even, 2 fierce
    var best = AG.bestScore("pong");

    function newRally(dir) {
      st.ball = { x: VW / 2, y: VH / 2, vx: (dir || (Math.random() < 0.5 ? -1 : 1)) * 4.4, vy: rnd(-2.4, 2.4), r: 8, spin: 0 };
      st.serveT = 0.9;
    }
    function newGame() {
      st = {
        pl: { y: VH / 2, h: 74, x: 26, score: 0, vy: 0 },
        pr: { y: VH / 2, h: 74, x: VW - 26, score: 0, vy: 0 },
        ball: null, serveT: 1.2, collected: [], seen: {}, over: false, motes: [], sparks: []
      };
      for (var i = 0; i < 30; i++) st.motes.push({ x: Math.random() * VW, y: Math.random() * VH, r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.4 + 0.08, v: Math.random() * 0.5 + 0.15 });
      newRally();
    }

    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">Antithesis — The Eternal Contest</h2>' +
          "<p>Order and its opposite volley the sacred orb. Win a point to uncover the dualism behind it.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="pg-hud"></div>' +
        '<div class="pg-stage"><canvas class="pg-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Antithesis pong board"></canvas></div>' +
        '<p class="ouro-toast pg-toast" aria-live="polite"></p>' +
        '<div class="pg-controls">' +
          '<div class="pg-pad"><button class="ouro-key" data-k="up1" aria-label="Move up">▲</button>' +
            '<button class="ouro-key" data-k="down1" aria-label="Move down">▼</button></div>' +
          '<button class="rq-btn pg-mode" data-a="mode">Rival: ' + tName() + '</button>' +
          (twoP ? '<div class="pg-pad pg-pad-r"><button class="ouro-key" data-k="up2" aria-label="P2 up">▲</button>' +
            '<button class="ouro-key" data-k="down2" aria-label="P2 down">▼</button></div>' : "") +
        "</div>" +
        '<p class="rq-note">Your paddle (gold, left): W/S or ↑/↓, drag, or the pad.' + (twoP ? " Player 2 (violet, right): the right pad." : "") + ' First to ' + WIN + ' wins the contest.</p>';
      canvas = root.querySelector(".pg-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".pg-hud"); live = root.querySelector(".pg-toast");
      wireControls();
    }
    function tName() { return temper === 0 ? "a mild echo" : temper === 2 ? "a fierce adversary" : (twoP ? "Player 2 (human)" : "an even rival"); }

    function wireControls() {
      root.querySelectorAll(".pg-pad .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k");
        var dn = function (e) { e.preventDefault(); keys[k] = true; }, up = function () { keys[k] = false; };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
      root.querySelector('[data-a="mode"]').addEventListener("click", function () {
        // cycle: mild → even(AI) → fierce → 2-player → mild …
        if (!twoP && temper < 2) { temper++; }
        else if (!twoP && temper === 2) { twoP = true; }
        else { twoP = false; temper = 0; }
        boot();
      });
      // drag anywhere on the canvas to steer the left paddle (and, if 2P, the nearer half steers each)
      var dragging = null;
      function at(e) { var t = e.touches ? e.touches[0] : e, r = canvas.getBoundingClientRect(); return { x: (t.clientX - r.left) / r.width * VW, y: (t.clientY - r.top) / r.height * VH }; }
      canvas.addEventListener("touchstart", function (e) { e.preventDefault(); var p = at(e); dragging = (twoP && p.x > VW / 2) ? "pr" : "pl"; st[dragging].y = clamp(p.y, st[dragging].h / 2, VH - st[dragging].h / 2); }, { passive: false });
      canvas.addEventListener("touchmove", function (e) { e.preventDefault(); if (!dragging) return; var p = at(e); st[dragging].y = clamp(p.y, st[dragging].h / 2, VH - st[dragging].h / 2); }, { passive: false });
      canvas.addEventListener("touchend", function () { dragging = null; });
      canvas.addEventListener("mousemove", function (e) { if (!st || st.over) return; var p = at(e); if (!twoP) st.pl.y = clamp(p.y, st.pl.h / 2, VH - st.pl.h / 2); });
    }

    function setPaddleFromKeys(pad, upK, downK, dt) {
      var sp = 6.4;
      if (keys[upK]) pad.y -= sp; if (keys[downK]) pad.y += sp;
      pad.y = clamp(pad.y, pad.h / 2, VH - pad.h / 2);
    }

    function aiMove(pad, ball) {
      var reach = temper === 0 ? 3.2 : temper === 2 ? 6.6 : 4.8;
      var err = temper === 0 ? 46 : temper === 2 ? 8 : 24;
      // only track when the ball approaches this side
      var target = (ball.vx > 0) ? ball.y + Math.sin(performance.now() / 400) * err : VH / 2 + Math.sin(performance.now() / 600) * 20;
      if (pad.y < target - 6) pad.y += reach; else if (pad.y > target + 6) pad.y -= reach;
      pad.y = clamp(pad.y, pad.h / 2, VH - pad.h / 2);
    }

    function step(dt) {
      if (st.serveT > 0) { st.serveT -= dt; }
      // paddles
      if (!twoP) { setPaddleFromKeys(st.pl, "up1", "down1", dt); if (keys.w) st.pl.y -= 6.4; if (keys.s) st.pl.y += 6.4; if (keys.arrowup) st.pl.y -= 6.4; if (keys.arrowdown) st.pl.y += 6.4; st.pl.y = clamp(st.pl.y, st.pl.h / 2, VH - st.pl.h / 2); aiMove(st.pr, st.ball); }
      else { if (keys.w) st.pl.y -= 6.4; if (keys.s) st.pl.y += 6.4; setPaddleFromKeys(st.pl, "up1", "down1", dt); if (keys.arrowup) st.pr.y -= 6.4; if (keys.arrowdown) st.pr.y += 6.4; setPaddleFromKeys(st.pr, "up2", "down2", dt); st.pl.y = clamp(st.pl.y, st.pl.h / 2, VH - st.pl.h / 2); st.pr.y = clamp(st.pr.y, st.pr.h / 2, VH - st.pr.h / 2); }
      if (st.serveT > 0) return;
      var b = st.ball;
      b.x += b.vx; b.y += b.vy; b.spin += 0.3;
      if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy); sparkAt(b.x, b.y, LIGHT); }
      if (b.y > VH - b.r) { b.y = VH - b.r; b.vy = -Math.abs(b.vy); sparkAt(b.x, b.y, DARK); }
      // paddle collisions
      hitPaddle(st.pl, 1); hitPaddle(st.pr, -1);
      if (b.x < -14) return point(st.pr, 1);
      if (b.x > VW + 14) return point(st.pl, -1);
    }
    function hitPaddle(pad, dir) {
      var b = st.ball;
      var near = dir > 0 ? (b.x - b.r <= pad.x + 7 && b.x > pad.x - 10) : (b.x + b.r >= pad.x - 7 && b.x < pad.x + 10);
      if (!near) return;
      if (Math.abs(b.y - pad.y) <= pad.h / 2 + b.r && b.vx * dir < 0) {
        var rel = clamp((b.y - pad.y) / (pad.h / 2), -1, 1);
        var speed = Math.min(11, Math.hypot(b.vx, b.vy) * 1.06 + 0.3);
        var ang = rel * 0.9;
        b.vx = dir * Math.abs(Math.cos(ang) * speed); b.vy = Math.sin(ang) * speed;
        b.x = pad.x + dir * (7 + b.r);
        sparkAt(b.x, b.y, dir > 0 ? LIGHT : DARK, 12);
      }
    }
    function sparkAt(x, y, col, n) { n = n || 5; for (var i = 0; i < n; i++) st.sparks.push({ x: x, y: y, vx: rnd(-3, 3), vy: rnd(-3, 3), life: 1, r: rnd(1, 2.6), col: col }); }

    function point(winner, serveDir) {
      winner.score++;
      var f = pickFact();
      if (f) { st.seen[f.label] = 1; if (!st.collected.some(function (c) { return c.label === f.label; })) st.collected.push(f); showFact(f, winner === st.pl); }
      renderHUD();
      if (winner.score >= WIN) return gameOver();
      newRally(serveDir);
    }
    function pickFact() {
      if (!facts || !facts.length) return null;
      var pool = facts.filter(function (f) { return !st.seen[f.label]; });
      if (!pool.length) { st.seen = {}; pool = facts; }
      return pool[Math.floor(Math.random() * pool.length)];
    }
    function showFact(f, mine) {
      live.innerHTML = '<span class="ouro-sym">' + (mine ? "◆" : "◇") + '</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    /* ---------------- draw ---------------- */
    function draw() {
      cx.clearRect(0, 0, VW, VH);
      // field
      var g = cx.createLinearGradient(0, 0, VW, 0);
      g.addColorStop(0, "#241a2e"); g.addColorStop(0.5, "#171019"); g.addColorStop(1, "#1a1226");
      cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
      // drifting motes
      for (var i = 0; i < st.motes.length; i++) { var mo = st.motes[i]; cx.globalAlpha = mo.a; cx.fillStyle = COL.goldB; cx.beginPath(); cx.arc(mo.x, mo.y, mo.r, 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
      // central divider — a column of sacred sigils
      cx.strokeStyle = "rgba(199,154,84,.22)"; cx.setLineDash([2, 12]); cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(VW / 2, 0); cx.lineTo(VW / 2, VH); cx.stroke(); cx.setLineDash([]);
      cx.save(); cx.globalAlpha = 0.5; cx.strokeStyle = COL.gold; cx.lineWidth = 1.4;
      cx.beginPath(); cx.arc(VW / 2, VH / 2, 34, 0, 7); cx.stroke();
      cx.beginPath(); cx.moveTo(VW / 2 - 10, VH / 2); cx.lineTo(VW / 2 + 10, VH / 2); cx.moveTo(VW / 2, VH / 2 - 10); cx.lineTo(VW / 2, VH / 2 + 10); cx.stroke();
      cx.restore();
      // side glows
      sideGlow(0, LIGHT); sideGlow(VW, DARK);
      // paddles
      paddle(st.pl, LIGHT, "#8a6428"); paddle(st.pr, DARK, "#3a2a5a");
      // ball
      if (st.serveT <= 0 || Math.floor(st.serveT * 8) % 2 === 0) drawBall(st.ball);
      // sparks
      for (var s = st.sparks.length - 1; s >= 0; s--) { var sp = st.sparks[s]; cx.globalAlpha = clamp(sp.life, 0, 1); cx.fillStyle = sp.col; cx.beginPath(); cx.arc(sp.x, sp.y, sp.r, 0, 7); cx.fill(); }
      cx.globalAlpha = 1;
      if (st.serveT > 0 && !st.over) { cx.fillStyle = "rgba(231,198,128,.85)"; cx.font = "600 15px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText("The orb is cast…", VW / 2, VH / 2 - 54); }
    }
    function sideGlow(x, col) {
      var g = cx.createLinearGradient(x === 0 ? 0 : VW, 0, x === 0 ? 60 : VW - 60, 0);
      g.addColorStop(0, hexA(col, 0.16)); g.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = g; cx.fillRect(x === 0 ? 0 : VW - 60, 0, 60, VH);
    }
    function paddle(pad, col, sh) {
      var w = 11, x = pad.x - w / 2, y = pad.y - pad.h / 2;
      var g = cx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, sh); g.addColorStop(0.5, col); g.addColorStop(1, sh);
      cx.save(); cx.shadowColor = col; cx.shadowBlur = 12; cx.fillStyle = g;
      roundRect(x, y, w, pad.h, 5); cx.fill(); cx.restore();
      // engraved caps
      cx.fillStyle = hexA(col, 0.9); roundRect(x - 1, y - 4, w + 2, 5, 2); cx.fill(); roundRect(x - 1, y + pad.h - 1, w + 2, 5, 2); cx.fill();
      // center rune
      cx.strokeStyle = "rgba(20,13,7,.5)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(pad.x, y + 12); cx.lineTo(pad.x, y + pad.h - 12); cx.stroke();
    }
    function drawBall(b) {
      cx.save(); cx.globalCompositeOperation = "lighter";
      // trail
      for (var k = 1; k <= 6; k++) { cx.globalAlpha = 0.32 - k * 0.045; cx.fillStyle = b.vx > 0 ? DARK : LIGHT; cx.beginPath(); cx.arc(b.x - b.vx * k * 0.9, b.y - b.vy * k * 0.9, b.r * (1 - k * 0.1), 0, 7); cx.fill(); }
      var g = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.4);
      g.addColorStop(0, "rgba(255,255,255,.98)"); g.addColorStop(0.4, hexA(COL.goldB, 0.85)); g.addColorStop(1, "rgba(0,0,0,0)");
      cx.globalAlpha = 1; cx.fillStyle = g; cx.beginPath(); cx.arc(b.x, b.y, b.r * 2.4, 0, 7); cx.fill();
      cx.restore();
      cx.fillStyle = "#fff8e6"; cx.beginPath(); cx.arc(b.x, b.y, b.r * 0.6, 0, 7); cx.fill();
    }
    function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
    function hexA(hex, a) { var n = hex.replace("#", ""); if (n.length === 3) n = n.replace(/./g, "$&$&"); return "rgba(" + parseInt(n.slice(0, 2), 16) + "," + parseInt(n.slice(2, 4), 16) + "," + parseInt(n.slice(4, 6), 16) + "," + a + ")"; }

    function renderHUD() {
      hudEl.innerHTML =
        '<div class="pg-score pg-l"><b>' + (ROMAN[st.pl.score] || st.pl.score) + '</b><span>Order</span></div>' +
        '<div class="pg-mid">✦</div>' +
        '<div class="pg-score pg-r"><b>' + (ROMAN[st.pr.score] || st.pr.score) + '</b><span>' + (twoP ? "Player II" : "Antithesis") + '</span></div>';
    }

    /* ---------------- loop ---------------- */
    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
      for (var i = 0; i < st.motes.length; i++) { var mo = st.motes[i]; mo.y -= mo.v * dt * 26; if (mo.y < 0) { mo.y = VH; mo.x = Math.random() * VW; } }
      for (var s = st.sparks.length - 1; s >= 0; s--) { var sp = st.sparks[s]; sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.12; sp.life -= dt * 2.2; if (sp.life <= 0) st.sparks.splice(s, 1); }
      if (!st.over) step(dt);
      draw();
      if (!st.over) raf = requestAnimationFrame(loop);
    }

    function gameOver() {
      st.over = true; running = false; if (raf) cancelAnimationFrame(raf);
      var youWon = st.pl.score > st.pr.score;
      var newBest = false, tally = st.pl.score;
      if (tally > best) { best = tally; newBest = true; }
      AG.addHighScore("pong", { score: tally });
      var recap = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Antithesis · the contest is decided</p>' +
          '<h2 id="' + ctx.titleId + '">' + (twoP ? (youWon ? "Order" : "Player II") + " prevails" : youWon ? "Order holds the field" : "The Antithesis prevails") + "</h2>" +
          '<p>' + (ROMAN[st.pl.score] || st.pl.score) + " — " + (ROMAN[st.pr.score] || st.pr.score) + (newBest ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p></div>" +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The dualisms you uncovered:</p><ul class="ouro-facts">' + recap + "</ul>" : "") +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>Contest again</button>' +
          '<a class="game-source" href="chapters/ch06.html">› Read “Zoroaster”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    /* ---------------- boot ---------------- */
    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); renderHUD(); draw();
      live.textContent = "Steer with W/S or ↑/↓ — first to " + WIN + " points takes the contest.";
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }

    keyfn = function (e) {
      var k = e.key.toLowerCase();
      if (["w", "s", "arrowup", "arrowdown"].indexOf(k) >= 0) { keys[k] = true; e.preventDefault(); }
    };
    keyup = function (e) { keys[e.key.toLowerCase()] = false; };
    document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);

    root.innerHTML = '<div class="rq-loading">Casting the orb…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The contest could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() {
      running = false; if (raf) cancelAnimationFrame(raf);
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (keyup) document.removeEventListener("keyup", keyup);
    };
  }
})();
