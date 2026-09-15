/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Tomb Robber" (treasure-hunt expedition)

   A four-site run across the ancient world, framed by the field journal of an
   expedition that never came home: Egypt → Sumer → the Indus → the road east
   (Persia & China). Each site is its own themed level — sprint and leap across
   pits and spike-traps, stomp the serpents, and recover the relics scattered
   through the ruin. Every relic you lift tells you what it meant to the people
   who made it, drawn from the real chapters (data/treasure.json, checked by
   tools/verify-treasure.js). Reach the far door of each site to press on;
   clear all four to finish the journal. Story cards carry the tale between
   sites, and a finale closes it with an evidence-honesty note.
   Arrows/WASD move, Up/Space/tap jumps; three on-screen pads on touch.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/treasure.json";
    return "assets/games/data/treasure.json";
  })();
  var DATA = null, loadingPromise = null;
  function loadData() {
    if (DATA) return Promise.resolve(DATA);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(DATA_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { DATA = { facts: (j && j.facts) || [], story: (j && j.story) || null }; return DATA; });
    return loadingPromise;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  AG.register("treasure", {
    title: "The Tomb Robber",
    subtitle: "An expedition across the ancient world — dodge the traps, carry out the relics, finish the journal.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch02) || "",
    sourceHref: "chapters/ch02.html", sourceLabel: "Read “Egypt”",
    mount: mountGame
  });

  /* Four sites of the expedition. Each has its own palette + hand-authored layout,
     and pulls its relics from the facts whose `level` matches its index. */
  var LEVELS = [
    { chapter: "ch02", name: "The Valley of the Kings", place: "Egypt", glyph: "𓉔",
      pal: { s0: "#3a2418", s1: "#241a12", s2: "#140d08", b0: "#6a5230", b1: "#3e2e18", back: "#2a1c10", back2: "#20140b", accent: "#e7c680" },
      pits: [15, 16, 28, 29, 30, 42, 43],
      ledges: [[6, 9, 12], [5, 20, 23], [4, 24, 26], [6, 33, 36], [5, 45, 47]],
      spikes: [18, 24, 38, 50], snakes: [10, 35, 48],
      relics: [[7, 7], [5, 10], [4, 21], [3, 25], [5, 34]] },
    { chapter: "ch03", name: "The Ziggurat of Ur", place: "Sumer", glyph: "𒂍",
      pal: { s0: "#4a3320", s1: "#2e2012", s2: "#160f07", b0: "#8a6a3a", b1: "#4e3a1c", back: "#3a2814", back2: "#291c0e", accent: "#e0b25a" },
      pits: [12, 13, 22, 23, 33, 34, 35, 44, 45],
      ledges: [[6, 8, 11], [5, 18, 21], [6, 28, 31], [5, 38, 41]],
      spikes: [16, 26, 37, 48], snakes: [9, 27, 46],
      relics: [[7, 9], [5, 9], [4, 19], [4, 39]] },
    { chapter: "ch04", name: "Mohenjo-daro", place: "The Indus", glyph: "◫",
      pal: { s0: "#28323a", s1: "#1a2228", s2: "#0e1418", b0: "#7a7566", b1: "#463f34", back: "#2a3138", back2: "#1c2228", accent: "#7fd8c8" },
      pits: [10, 11, 20, 21, 31, 32, 41, 42, 50],
      ledges: [[6, 6, 9], [5, 15, 18], [6, 25, 28], [5, 35, 38], [6, 45, 48]],
      spikes: [14, 24, 29, 39, 47], snakes: [8, 26, 44],
      relics: [[7, 7], [4, 16], [5, 26], [5, 46]] },
    { chapter: "ch06", name: "Behistun & the Oracle", place: "The Road East", glyph: "𐎠",
      pal: { s0: "#2e2440", s1: "#1e1830", s2: "#100b1a", b0: "#5a4a64", b1: "#342838", back: "#2a2038", back2: "#1c1628", accent: "#b98cff" },
      pits: [9, 10, 18, 19, 20, 29, 30, 38, 39, 40, 49],
      ledges: [[6, 5, 8], [5, 13, 16], [4, 22, 24], [6, 26, 29], [5, 34, 37], [6, 44, 47]],
      spikes: [12, 17, 27, 33, 42, 48], snakes: [7, 24, 36, 46],
      relics: [[3, 23], [4, 35], [5, 45], [7, 6]] }
  ];

  function mountGame(root, ctx) {
    var TILE = 26, ROWS = 10, COLS = 58, VIEWW = 364, VIEWH = ROWS * TILE; // camera view
    var LW = COLS * TILE, LH = ROWS * TILE, MAXHEARTS = 3;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34") };

    var canvas, cx, hudEl, live, keyfn = null, keyup = null, raf = null, last = 0, running = false, DPR = 1;
    var keys = {}, st = null, best = AG.bestScore("treasure");
    // run-level totals that persist across the four sites
    var run = null;
    function factsForLevel(i) { return (DATA.facts || []).filter(function (f) { return (f.level | 0) === i; }); }

    function buildLevel(levelIdx) {
      var L = LEVELS[levelIdx], g = [], r, c;
      for (r = 0; r < ROWS; r++) { g[r] = []; for (c = 0; c < COLS; c++) g[r][c] = 0; }
      var pit = {}; L.pits.forEach(function (p) { pit[p] = 1; });
      for (c = 0; c < COLS; c++) { if (!pit[c]) { g[8][c] = 1; g[9][c] = 1; } }
      for (r = 0; r < ROWS; r++) { g[r][0] = 1; g[r][COLS - 1] = 1; }
      L.ledges.forEach(function (ld) { for (var cc = ld[1]; cc <= ld[2]; cc++) g[ld[0]][cc] = 2; }); // one-way ledges
      L.spikes.forEach(function (cc) { if (g[8][cc] === 1) g[7][cc] = 3; });
      st.grid = g;
      // relics from THIS site's facts, placed at the site's authored spots
      var f = factsForLevel(levelIdx);
      st.relics = [];
      L.relics.slice(0, f.length).forEach(function (spot, i) {
        st.relics.push({ x: spot[1] * TILE + TILE / 2, y: spot[0] * TILE + TILE / 2, got: false, fact: f[i], kind: (levelIdx + i) % 4 });
      });
      st.foes = L.snakes.map(function (cc, i) { return { x: cc * TILE, y: 8 * TILE, dir: i % 2 ? -1 : 1, alive: true }; });
      st.exit = { x: (COLS - 3) * TILE, y: 8 * TILE };
      st.player = { x: 2.5 * TILE, y: 7 * TILE, vx: 0, vy: 0, hw: 8, hh: 11, onGround: false, face: 1, run: 0, inv: 0 };
    }

    function newLevel(levelIdx) {
      st = { level: levelIdx, hearts: run.hearts, got: 0, over: false, won: false, cam: 0, t: 0, dust: [], pal: LEVELS[levelIdx].pal };
      buildLevel(levelIdx);
    }

    function tileAt(r, c) { return (st.grid[r] && st.grid[r][c]) || 0; }

    /* ---------------- physics ---------------- */
    function pbox(p) { return { l: p.x - p.hw, r: p.x + p.hw, t: p.y - p.hh, b: p.y + p.hh }; }
    function collideX(p) {
      var b = pbox(p), r0 = Math.floor(b.t / TILE), r1 = Math.floor((b.b - 0.1) / TILE);
      for (var r = r0; r <= r1; r++) {
        if (p.vx > 0) { var c = Math.floor(b.r / TILE); if (tileAt(r, c) === 1) { p.x = c * TILE - p.hw - 0.01; p.vx = 0; b = pbox(p); } }
        else if (p.vx < 0) { var c2 = Math.floor(b.l / TILE); if (tileAt(r, c2) === 1) { p.x = (c2 + 1) * TILE + p.hw + 0.01; p.vx = 0; b = pbox(p); } }
      }
    }
    function collideY(p, prevB) {
      var b = pbox(p), c0 = Math.floor(b.l / TILE), c1 = Math.floor((b.r - 0.1) / TILE);
      p.onGround = false;
      for (var c = c0; c <= c1; c++) {
        if (p.vy > 0) {
          var rb = Math.floor(b.b / TILE), t = tileAt(rb, c);
          if (t === 1 || (t === 2 && prevB <= rb * TILE + 2)) { p.y = rb * TILE - p.hh - 0.01; p.vy = 0; p.onGround = true; b = pbox(p); }
        } else if (p.vy < 0) {
          var rt = Math.floor(b.t / TILE); if (tileAt(rt, c) === 1) { p.y = (rt + 1) * TILE + p.hh + 0.01; p.vy = 0; b = pbox(p); }
        }
      }
    }
    function hazardHit(p) {
      var b = pbox(p);
      for (var r = Math.floor(b.t / TILE); r <= Math.floor(b.b / TILE); r++)
        for (var c = Math.floor(b.l / TILE); c <= Math.floor(b.r / TILE); c++)
          if (tileAt(r, c) === 3) return true;
      return false;
    }

    function hurt() {
      if (st.player.inv > 0) return;
      st.hearts--; run.hearts = st.hearts; st.player.inv = 1.2; st.player.vy = -5; st.player.vx = -st.player.face * 3;
      if (st.hearts <= 0) { st.over = true; endScreen(false); }
    }
    function respawnFall() { st.player.x = clamp(st.player.x, TILE, LW - TILE); st.player.y = 6 * TILE; st.player.vy = 0; hurt(); }

    function step(dt) {
      var p = st.player; st.t += dt;
      var ax = 0; if (keys.left) ax = -1; if (keys.right) ax = 1;
      if (ax) { p.vx += ax * 0.6; p.face = ax; p.run += dt * 10; } else { p.vx *= 0.8; }
      p.vx = clamp(p.vx, -3.4, 3.4);
      if (keys.jump && p.onGround) { p.vy = -8.6; p.onGround = false; keys.jump = false; puff(p.x, p.y + p.hh); }
      p.vy = Math.min(11, p.vy + 0.5);
      var prevB = p.y + p.hh;
      p.x += p.vx; collideX(p);
      p.y += p.vy; collideY(p, prevB);
      p.x = clamp(p.x, TILE + p.hw, LW - TILE - p.hw);
      if (p.inv > 0) p.inv -= dt;
      if (p.y > LH + 40) respawnFall();
      if (st.over) return;
      if (hazardHit(p)) hurt();
      st.relics.forEach(function (rl) { if (!rl.got && Math.abs(rl.x - p.x) < 16 && Math.abs(rl.y - p.y) < 18) { rl.got = true; st.got++; run.score += 100; run.collected.push(rl.fact); showFact(rl.fact); puff(rl.x, rl.y); } });
      st.foes.forEach(function (f) {
        if (!f.alive) return;
        f.x += f.dir * 0.7;
        var aheadC = Math.floor((f.x + f.dir * 12) / TILE), footR = Math.floor((f.y + 14) / TILE), midR = Math.floor(f.y / TILE);
        if (tileAt(midR, aheadC) === 1 || tileAt(footR, aheadC) !== 1) f.dir *= -1;
        if (Math.abs(f.x - p.x) < 15 && Math.abs(f.y - p.y) < 18) {
          if (p.vy > 1 && p.y < f.y - 4) { f.alive = false; p.vy = -6; run.score += 50; puff(f.x, f.y); } // stomp
          else hurt();
        }
      });
      if (!st.over && Math.abs(st.exit.x - p.x) < 18 && Math.abs(st.exit.y - p.y) < 22) { st.won = true; st.over = true; clearedSite(); return; }
      st.cam = clamp(p.x - VIEWW / 2, 0, LW - VIEWW);
      for (var d = st.dust.length - 1; d >= 0; d--) { var du = st.dust[d]; du.x += du.vx; du.y += du.vy; du.vy += 0.12; du.life -= dt * 2; if (du.life <= 0) st.dust.splice(d, 1); }
    }
    function puff(x, y) { for (var i = 0; i < 5; i++) st.dust.push({ x: x, y: y, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 1.5, life: 1 }); }
    function showFact(f) {
      live.innerHTML = '<span class="ouro-sym">𓋹</span> <strong>' + esc(f.label) + " recovered.</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    /* ---------------- render ---------------- */
    function draw() {
      var P = st.pal;
      cx.clearRect(0, 0, VIEWW, VIEWH);
      var g = cx.createLinearGradient(0, 0, 0, VIEWH); g.addColorStop(0, P.s0); g.addColorStop(0.5, P.s1); g.addColorStop(1, P.s2); cx.fillStyle = g; cx.fillRect(0, 0, VIEWW, VIEWH);
      parallax(0.25, P.back, 150); parallax(0.5, P.back2, 190);
      cx.save(); cx.translate(-st.cam, 0);
      var c0 = Math.floor(st.cam / TILE), c1 = Math.min(COLS - 1, c0 + Math.ceil(VIEWW / TILE) + 1);
      for (var c = c0; c <= c1; c++) for (var r = 0; r < ROWS; r++) {
        var t = st.grid[r][c]; if (!t) continue; var x = c * TILE, y = r * TILE;
        if (t === 1) { var lg = cx.createLinearGradient(x, y, x, y + TILE); lg.addColorStop(0, P.b0); lg.addColorStop(1, P.b1); cx.fillStyle = lg; cx.fillRect(x, y, TILE, TILE); cx.strokeStyle = "rgba(20,13,7,.5)"; cx.lineWidth = 1; cx.strokeRect(x + .5, y + .5, TILE - 1, TILE - 1); cx.strokeStyle = "rgba(255,255,255,.08)"; cx.beginPath(); cx.moveTo(x + 2, y + 2); cx.lineTo(x + TILE - 2, y + 2); cx.stroke(); }
        else if (t === 2) { cx.fillStyle = P.b0; cx.fillRect(x, y, TILE, 7); cx.strokeStyle = "rgba(255,255,255,.22)"; cx.strokeRect(x + .5, y + .5, TILE - 1, 6); }
        else if (t === 3) { cx.fillStyle = "#c9c2ad"; for (var s = 0; s < 3; s++) { cx.beginPath(); cx.moveTo(x + s * 9 + 1, y + TILE); cx.lineTo(x + s * 9 + 5, y + 6); cx.lineTo(x + s * 9 + 9, y + TILE); cx.closePath(); cx.fill(); } cx.strokeStyle = "#5a5344"; cx.stroke(); }
      }
      var e = st.exit; cx.save(); cx.shadowColor = P.accent; cx.shadowBlur = 14; cx.fillStyle = "#160f08"; cx.fillRect(e.x - 12, e.y - 34, 24, 60); cx.restore();
      cx.strokeStyle = P.accent; cx.lineWidth = 2; cx.strokeRect(e.x - 12, e.y - 34, 24, 60);
      cx.fillStyle = P.accent; cx.font = "700 18px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText(LEVELS[st.level].glyph, e.x, e.y - 2);
      st.relics.forEach(function (rl) { if (rl.got) return; var bob = Math.sin(st.t * 4 + rl.x) * 2; drawRelic(rl.x, rl.y + bob, rl.kind); });
      st.foes.forEach(function (f) { if (f.alive) drawSnake(f); });
      drawPlayer(st.player);
      cx.fillStyle = "rgba(210,190,150,.6)"; st.dust.forEach(function (d) { cx.globalAlpha = clamp(d.life, 0, .6); cx.beginPath(); cx.arc(d.x, d.y, 2, 0, 7); cx.fill(); }); cx.globalAlpha = 1;
      cx.restore();
    }
    function parallax(f, col, base) {
      cx.fillStyle = col; var off = (st.cam * f) % 120;
      for (var x = -off - 120; x < VIEWW + 120; x += 120) { cx.beginPath(); cx.moveTo(x, VIEWH); cx.lineTo(x + 20, base); cx.lineTo(x + 40, base - 24); cx.lineTo(x + 60, base); cx.lineTo(x + 80, base - 14); cx.lineTo(x + 100, base); cx.lineTo(x + 120, VIEWH); cx.closePath(); cx.fill(); }
    }
    function drawRelic(x, y, kind) {
      cx.save(); cx.translate(x, y); cx.shadowColor = COL.goldB; cx.shadowBlur = 12; cx.fillStyle = COL.goldB; cx.strokeStyle = "#7a5a24"; cx.lineWidth = 1;
      if (kind === 0) { cx.beginPath(); cx.arc(0, -3, 4, 0, 7); cx.fill(); cx.fillRect(-1.5, -1, 3, 9); cx.fillRect(-5, 2, 10, 2.4); } // ankh
      else if (kind === 1) { cx.beginPath(); cx.moveTo(-5, -5); cx.lineTo(5, -5); cx.lineTo(3, 2); cx.lineTo(-3, 2); cx.closePath(); cx.fill(); cx.fillRect(-1.5, 2, 3, 5); cx.fillRect(-4, 7, 8, 2); } // chalice
      else if (kind === 2) { cx.beginPath(); cx.ellipse(0, 0, 5, 6, 0, 0, 7); cx.fill(); cx.fillStyle = "#3a2a12"; cx.fillRect(-3, -1, 2, 3); cx.fillRect(1, -1, 2, 3); } // mask/seal
      else { cx.beginPath(); cx.moveTo(0, -6); cx.lineTo(6, 0); cx.lineTo(0, 6); cx.lineTo(-6, 0); cx.closePath(); cx.fill(); } // gem/tablet
      cx.restore();
    }
    function drawSnake(f) {
      cx.save(); cx.translate(f.x, f.y + 6); cx.scale(f.dir, 1);
      cx.strokeStyle = "#5aa06a"; cx.lineWidth = 5; cx.lineCap = "round";
      cx.beginPath(); cx.moveTo(-10, 6); cx.quadraticCurveTo(-4, -2 + Math.sin(st.t * 8) * 2, 2, 2); cx.quadraticCurveTo(8, 4, 10, -3); cx.stroke();
      cx.fillStyle = "#5aa06a"; cx.beginPath(); cx.arc(10, -3, 4, 0, 7); cx.fill();
      cx.fillStyle = "#e2c04a"; cx.beginPath(); cx.arc(11, -4, 1.1, 0, 7); cx.fill();
      cx.restore();
    }
    function drawPlayer(p) {
      cx.save(); cx.translate(p.x, p.y); cx.scale(p.face, 1);
      if (p.inv > 0 && Math.floor(p.inv * 12) % 2) cx.globalAlpha = 0.4;
      var leg = p.onGround && Math.abs(p.vx) > 0.4 ? Math.sin(p.run) * 4 : 0;
      cx.strokeStyle = "#2a1c10"; cx.lineWidth = 4; cx.lineCap = "round";
      cx.beginPath(); cx.moveTo(-1, 4); cx.lineTo(-3, 11 + leg); cx.moveTo(1, 4); cx.lineTo(3, 11 - leg); cx.stroke();
      cx.fillStyle = "#8a6a3a"; cx.strokeStyle = "#3a2a14"; cx.lineWidth = 1; cx.beginPath(); cx.roundRect ? cx.roundRect(-6, -6, 12, 12, 3) : cx.rect(-6, -6, 12, 12); cx.fill(); cx.stroke();
      cx.strokeStyle = "#6a4a24"; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(3, -3); cx.lineTo(8, 2 + (Math.abs(p.vx) > 0.4 ? Math.sin(p.run) * 3 : 0)); cx.stroke();
      cx.fillStyle = "#d8ab6e"; cx.beginPath(); cx.arc(0, -11, 5, 0, 7); cx.fill(); cx.strokeStyle = "#3a2a14"; cx.stroke();
      cx.fillStyle = "#5a3a1a"; cx.beginPath(); cx.ellipse(0, -14, 8, 3, 0, 0, 7); cx.fill(); cx.fillRect(-4, -16, 8, 3);
      cx.globalAlpha = 1; cx.restore();
    }

    function updateHUD() {
      var total = st.relics.length;
      hudEl.innerHTML = '<div class="pm-stat"><b>' + "♥".repeat(Math.max(0, st.hearts)) + '</b><span>Life</span></div>' +
        '<div class="pm-stat"><b>' + st.got + '/' + total + '</b><span>Relics</span></div>' +
        '<div class="pm-stat"><b>' + (st.level + 1) + '/4</b><span>Site</span></div>' +
        '<div class="pm-stat"><b>' + run.score + '</b><span>Plunder</span></div>';
    }

    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.033, (ts - last) / 1000 || 0); last = ts;
      if (!st.over) step(dt);
      draw(); updateHUD();
      if (running && !st.over) raf = requestAnimationFrame(loop);
    }

    /* ---------------- story flow ---------------- */
    function stopLoop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function siteRecapList() {
      if (!run.collected.length) return '<p class="rq-note" style="text-align:center">No relics carried out yet.</p>';
      var items = run.collected.map(function (f) { return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) + ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>"; }).join("");
      return '<ul class="ouro-facts">' + items + "</ul>";
    }
    // a full-panel narrative card between sites
    function storyCard(opts) {
      stopLoop();
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.4rem"><p class="eyebrow">The Tomb Robber · ' + esc(opts.eyebrow) + '</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">' + esc(opts.title) + '</h2></div>' +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="tr-card">' + opts.body + '</div>' +
        '<div class="rq-actions" style="gap:.5rem;margin-top:.6rem">' +
          '<button class="rq-btn rq-primary" data-a="go" autofocus>' + esc(opts.cta) + '</button>' +
          (opts.chapter ? '<a class="game-source" href="chapters/' + opts.chapter + '.html">› ' + esc(chapterTitle(opts.chapter)) + "</a>" : "") +
        "</div>";
      root.querySelector('[data-a="go"]').addEventListener("click", opts.onGo);
    }

    function startRun() {
      run = { score: 0, hearts: MAXHEARTS, collected: [] };
      var story = DATA.story || {};
      storyCard({
        eyebrow: "the field journal", title: (story.title || "The Expedition"),
        body: '<p>' + esc(story.intro || "") + '</p>' +
          '<p class="tr-route">Egypt&nbsp;→&nbsp;Sumer&nbsp;→&nbsp;the Indus&nbsp;→&nbsp;the road east. Four sites. Bring back what you can.</p>',
        cta: "Begin the expedition", onGo: function () { enterSite(0); }
      });
    }
    function enterSite(i) {
      run.hearts = MAXHEARTS; // fresh breath at each site so the run stays beatable
      var L = LEVELS[i], site = ((DATA.story || {}).sites || [])[i] || {};
      storyCard({
        eyebrow: "site " + (i + 1) + " of 4 · " + esc(L.place), title: L.name, chapter: L.chapter,
        body: '<p>' + esc(site.enter || "") + '</p>' +
          '<p class="rq-note" style="text-align:center;margin-top:.5rem">Reach the far door — lift every relic you can on the way. ' + factsForLevel(i).length + ' wait in the ruin.</p>',
        cta: "Enter " + L.place, onGo: function () { playSite(i); }
      });
    }
    function playSite(i) {
      shell(); newLevel(i); updateHUD(); draw();
      live.innerHTML = '<strong>' + esc(LEVELS[i].place) + ' — ' + esc(LEVELS[i].name) + '.</strong> Run for the far door.';
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }
    function clearedSite() {
      stopLoop();
      var i = st.level, site = ((DATA.story || {}).sites || [])[i] || {};
      if (i < LEVELS.length - 1) {
        storyCard({
          eyebrow: esc(LEVELS[i].place) + " cleared", title: "Onward",
          body: '<p>' + esc(site.clear || "") + '</p>' +
            '<p class="rq-note" style="text-align:center">Plunder so far: <strong>' + run.score + '</strong> · relics carried: <strong>' + run.collected.length + '</strong></p>',
          cta: "To " + LEVELS[i + 1].place, onGo: function () { enterSite(i + 1); }
        });
      } else {
        endScreen(true);
      }
    }

    function endScreen(won) {
      stopLoop();
      var story = DATA.story || {};
      var nb = run.score > best; if (nb) best = run.score;
      AG.addHighScore("treasure", { score: run.score });
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">The Tomb Robber · ' + (won ? "the journal is full" : "the ruin claims you") + '</p>' +
          '<h2 id="' + ctx.titleId + '">' + (won ? "The expedition, finished" : "Lost on the " + LEVELS[st.level].place + " road") + '</h2>' +
          '<p>' + run.collected.length + ' relic' + (run.collected.length === 1 ? "" : "s") + ' · ' + run.score + ' in plunder' + (nb ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<p class="tr-card" style="margin-bottom:.5rem">' + esc(won ? (story.outroWin || "") : (story.outroLose || "")) + '</p>' +
        '<p class="rq-note" style="text-align:center;margin-bottom:.3rem">' + (won ? "Everything the expedition was really after — the meaning, sourced:" : "What you did carry out:") + '</p>' +
        siteRecapList() +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>' + (won ? "Run it again" : "Try again") + '</button>' +
          '<a class="game-source" href="chapters/ch02.html">› Read “Egypt”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", startRun);
    }

    /* ---------------- shell / input ---------------- */
    function setKey(k, on) { keys[k] = on; }
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.2rem">The Tomb Robber</h2>' +
          "<p>Run the site, leap the pits and spikes, stomp the serpents, and carry out the relics to the far door.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="pm-hud tr-hud"></div>' +
        '<div class="tr-stage"><canvas class="tr-canvas" width="' + VIEWW + '" height="' + VIEWH + '" role="img" aria-label="Temple platformer"></canvas></div>' +
        '<p class="ouro-toast tr-toast" aria-live="polite"></p>' +
        '<div class="tr-controls"><button class="ouro-key" data-k="left" aria-label="Left">◀</button>' +
          '<button class="ouro-key tr-jump" data-k="jump" aria-label="Jump">⤒</button>' +
          '<button class="ouro-key" data-k="right" aria-label="Right">▶</button></div>' +
        '<p class="rq-note">←/→ or A/D run · ↑ / Space / the ⤒ pad to jump. Stomp serpents from above; touching a spike or serpent costs a life.</p>';
      canvas = root.querySelector(".tr-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VIEWW * DPR; canvas.height = VIEWH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".tr-hud"); live = root.querySelector(".tr-toast");
      root.querySelectorAll(".tr-controls .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k");
        var dn = function (e) { e.preventDefault(); setKey(k, true); }, up = function () { setKey(k, false); };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
    }

    keyfn = function (e) {
      var k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { setKey("left", true); e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { setKey("right", true); e.preventDefault(); }
      else if (k === "arrowup" || k === "w" || k === " " || k === "spacebar") { setKey("jump", true); e.preventDefault(); }
    };
    keyup = function (e) { var k = e.key.toLowerCase(); if (k === "arrowleft" || k === "a") setKey("left", false); else if (k === "arrowright" || k === "d") setKey("right", false); else if (k === "arrowup" || k === "w" || k === " " || k === "spacebar") setKey("jump", false); };
    document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);

    root.innerHTML = '<div class="rq-loading">Lighting the torches…</div>';
    loadData().then(startRun).catch(function () { root.innerHTML = '<p class="game-placeholder">The temple could not be loaded. Please reload the page.</p>'; });

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); if (keyup) document.removeEventListener("keyup", keyup); };
  }
})();
