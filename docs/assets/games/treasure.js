/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Tomb Robber" (treasure-hunt platformer)

   An Indiana-Jones run through an ancient temple: sprint and leap across
   pits and spike-traps, stomp the serpents, and recover the relics scattered
   through the ruin — every relic you lift tells you what it meant to the
   people who made it (data/treasure.json, checked by tools/verify-treasure.js).
   Reach the far door to escape with your haul. Arrows/WASD move, Up/Space/tap
   jumps; three on-screen pads on touch. Tile collision, scrolling camera.
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

  AG.register("treasure", {
    title: "The Tomb Robber",
    subtitle: "Run the ancient temple, dodge the traps, and carry out the relics.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch02) || "",
    sourceHref: "chapters/ch02.html", sourceLabel: "Read “Egypt”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var TILE = 26, ROWS = 10, COLS = 58, VIEWW = 364, VIEWH = ROWS * TILE; // camera view
    var LW = COLS * TILE, LH = ROWS * TILE;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34") };

    var canvas, cx, hudEl, live, keyfn = null, keyup = null, raf = null, last = 0, running = false, DPR = 1;
    var keys = {}, st = null, best = AG.bestScore("treasure");

    // build the level grid in code (guaranteed dimensions & reachability)
    function buildLevel() {
      var g = []; for (var r = 0; r < ROWS; r++) { g[r] = []; for (var c = 0; c < COLS; c++) g[r][c] = 0; }
      // ground: rows 8,9 solid, minus pits
      var pits = { 15: 1, 16: 1, 28: 1, 29: 1, 30: 1, 42: 1, 43: 1 };
      for (var c2 = 0; c2 < COLS; c2++) { if (!pits[c2]) { g[8][c2] = 1; g[9][c2] = 1; } }
      // border walls
      for (var r2 = 0; r2 < ROWS; r2++) { g[r2][0] = 1; g[r2][COLS - 1] = 1; }
      // floating one-way ledges (type 2)
      function ledge(row, c0, c1) { for (var c = c0; c <= c1; c++) g[row][c] = 2; }
      ledge(6, 9, 12); ledge(5, 20, 23); ledge(6, 33, 36); ledge(5, 45, 47); ledge(4, 24, 26);
      // spikes (type 3) sitting on the ground (row 7)
      [18, 24, 38, 50].forEach(function (c) { if (g[8][c] === 1) g[7][c] = 3; });
      st.grid = g;
      // objects
      var relicSpots = [[7, 7], [5, 11], [4, 25], [5, 34], [4, 46], [7, 33], [7, 52], [3, 25]];
      st.relics = [];
      (facts || []).slice(0, relicSpots.length).forEach(function (f, i) { var s = relicSpots[i]; st.relics.push({ x: s[1] * TILE + TILE / 2, y: s[0] * TILE + TILE / 2, got: false, fact: f, kind: i % 4 }); });
      // snakes patrol on flat ground
      st.foes = [{ x: 10 * TILE, y: 8 * TILE, dir: 1, alive: true }, { x: 35 * TILE, y: 8 * TILE, dir: -1, alive: true }, { x: 48 * TILE, y: 8 * TILE, dir: 1, alive: true }];
      st.exit = { x: (COLS - 3) * TILE, y: 8 * TILE };
      st.player = { x: 2.5 * TILE, y: 7 * TILE, vx: 0, vy: 0, hw: 8, hh: 11, onGround: false, face: 1, run: 0, inv: 0 };
    }

    function newGame(keepScore) {
      st = { hearts: 3, score: keepScore || 0, got: 0, collected: [], over: false, won: false, cam: 0, t: 0, dust: [] };
      buildLevel();
    }

    function tileAt(r, c) { return (st.grid[r] && st.grid[r][c]) || 0; }
    function solidPix(px, py, forX) {
      var r = Math.floor(py / TILE), c = Math.floor(px / TILE), t = tileAt(r, c);
      if (t === 1) return true;
      return false; // one-way (2) handled in Y; spikes (3) non-solid
    }

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
      st.hearts--; st.player.inv = 1.2; st.player.vy = -5; st.player.vx = -st.player.face * 3;
      if (st.hearts <= 0) { st.over = true; endScreen(); }
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
      if (hazardHit(p)) hurt();
      // relics
      st.relics.forEach(function (rl) { if (!rl.got && Math.abs(rl.x - p.x) < 16 && Math.abs(rl.y - p.y) < 18) { rl.got = true; st.got++; st.score += 100; st.collected.push(rl.fact); showFact(rl.fact); puff(rl.x, rl.y); } });
      // foes
      st.foes.forEach(function (f) {
        if (!f.alive) return;
        f.x += f.dir * 0.7;
        // turn at wall or ledge edge
        var aheadC = Math.floor((f.x + f.dir * 12) / TILE), footR = Math.floor((f.y + 14) / TILE), midR = Math.floor(f.y / TILE);
        if (tileAt(midR, aheadC) === 1 || tileAt(footR, aheadC) !== 1) f.dir *= -1;
        if (Math.abs(f.x - p.x) < 15 && Math.abs(f.y - p.y) < 18) {
          if (p.vy > 1 && p.y < f.y - 4) { f.alive = false; p.vy = -6; st.score += 50; puff(f.x, f.y); } // stomp
          else hurt();
        }
      });
      // exit
      if (Math.abs(st.exit.x - p.x) < 18 && Math.abs(st.exit.y - p.y) < 22) { st.won = true; st.over = true; endScreen(); return; }
      // camera
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
      cx.clearRect(0, 0, VIEWW, VIEWH);
      // sky + parallax temple silhouettes
      var g = cx.createLinearGradient(0, 0, 0, VIEWH); g.addColorStop(0, "#3a2418"); g.addColorStop(0.5, "#241a12"); g.addColorStop(1, "#140d08"); cx.fillStyle = g; cx.fillRect(0, 0, VIEWW, VIEWH);
      parallax(0.25, "#2a1c10", 150); parallax(0.5, "#20140b", 190);
      cx.save(); cx.translate(-st.cam, 0);
      // tiles
      var c0 = Math.floor(st.cam / TILE), c1 = Math.min(COLS - 1, c0 + Math.ceil(VIEWW / TILE) + 1);
      for (var c = c0; c <= c1; c++) for (var r = 0; r < ROWS; r++) {
        var t = st.grid[r][c]; if (!t) continue; var x = c * TILE, y = r * TILE;
        if (t === 1) { var lg = cx.createLinearGradient(x, y, x, y + TILE); lg.addColorStop(0, "#6a5230"); lg.addColorStop(1, "#3e2e18"); cx.fillStyle = lg; cx.fillRect(x, y, TILE, TILE); cx.strokeStyle = "rgba(20,13,7,.5)"; cx.lineWidth = 1; cx.strokeRect(x + .5, y + .5, TILE - 1, TILE - 1); cx.strokeStyle = "rgba(231,198,128,.12)"; cx.beginPath(); cx.moveTo(x + 2, y + 2); cx.lineTo(x + TILE - 2, y + 2); cx.stroke(); }
        else if (t === 2) { cx.fillStyle = "#7a5a30"; cx.fillRect(x, y, TILE, 7); cx.strokeStyle = "rgba(231,198,128,.3)"; cx.strokeRect(x + .5, y + .5, TILE - 1, 6); }
        else if (t === 3) { cx.fillStyle = "#c9c2ad"; for (var s = 0; s < 3; s++) { cx.beginPath(); cx.moveTo(x + s * 9 + 1, y + TILE); cx.lineTo(x + s * 9 + 5, y + 6); cx.lineTo(x + s * 9 + 9, y + TILE); cx.closePath(); cx.fill(); } cx.strokeStyle = "#5a5344"; cx.stroke(); }
      }
      // exit door
      var e = st.exit; cx.save(); cx.shadowColor = COL.goldB; cx.shadowBlur = 14; cx.fillStyle = "#241a10"; cx.fillRect(e.x - 12, e.y - 34, 24, 60); cx.restore();
      cx.strokeStyle = COL.goldB; cx.lineWidth = 2; cx.strokeRect(e.x - 12, e.y - 34, 24, 60);
      cx.fillStyle = COL.goldB; cx.font = "700 18px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText("𓉔", e.x, e.y - 2);
      // relics
      st.relics.forEach(function (rl) { if (rl.got) return; var bob = Math.sin(st.t * 4 + rl.x) * 2; drawRelic(rl.x, rl.y + bob, rl.kind); });
      // foes
      st.foes.forEach(function (f) { if (f.alive) drawSnake(f); });
      // player
      drawPlayer(st.player);
      // dust
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
      else if (kind === 2) { cx.beginPath(); cx.ellipse(0, 0, 5, 6, 0, 0, 7); cx.fill(); cx.fillStyle = "#3a2a12"; cx.fillRect(-3, -1, 2, 3); cx.fillRect(1, -1, 2, 3); } // mask
      else { cx.beginPath(); cx.moveTo(0, -6); cx.lineTo(6, 0); cx.lineTo(0, 6); cx.lineTo(-6, 0); cx.closePath(); cx.fill(); } // gem
      cx.restore();
    }
    function drawSnake(f) {
      cx.save(); cx.translate(f.x, f.y + 6); cx.scale(f.dir, 1);
      cx.fillStyle = "#5aa06a"; cx.strokeStyle = "#123018"; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(-10, 6); cx.quadraticCurveTo(-4, -2 + Math.sin(st.t * 8) * 2, 2, 2); cx.quadraticCurveTo(8, 4, 10, -3); cx.lineWidth = 5; cx.strokeStyle = "#5aa06a"; cx.stroke();
      cx.fillStyle = "#5aa06a"; cx.beginPath(); cx.arc(10, -3, 4, 0, 7); cx.fill();
      cx.fillStyle = "#e2c04a"; cx.beginPath(); cx.arc(11, -4, 1.1, 0, 7); cx.fill();
      cx.restore();
    }
    function drawPlayer(p) {
      cx.save(); cx.translate(p.x, p.y); cx.scale(p.face, 1);
      if (p.inv > 0 && Math.floor(p.inv * 12) % 2) cx.globalAlpha = 0.4;
      var leg = p.onGround && Math.abs(p.vx) > 0.4 ? Math.sin(p.run) * 4 : 0;
      cx.strokeStyle = "#2a1c10"; cx.lineWidth = 4; cx.lineCap = "round";
      cx.beginPath(); cx.moveTo(-1, 4); cx.lineTo(-3, 11 + leg); cx.moveTo(1, 4); cx.lineTo(3, 11 - leg); cx.stroke(); // legs
      cx.fillStyle = "#8a6a3a"; cx.strokeStyle = "#3a2a14"; cx.lineWidth = 1; cx.beginPath(); cx.roundRect ? cx.roundRect(-6, -6, 12, 12, 3) : cx.rect(-6, -6, 12, 12); cx.fill(); cx.stroke(); // torso
      cx.strokeStyle = "#6a4a24"; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(3, -3); cx.lineTo(8, 2 + (Math.abs(p.vx) > 0.4 ? Math.sin(p.run) * 3 : 0)); cx.stroke(); // arm/whip hint
      cx.fillStyle = "#d8ab6e"; cx.beginPath(); cx.arc(0, -11, 5, 0, 7); cx.fill(); cx.strokeStyle = "#3a2a14"; cx.stroke(); // head
      cx.fillStyle = "#5a3a1a"; cx.beginPath(); cx.ellipse(0, -14, 8, 3, 0, 0, 7); cx.fill(); cx.fillRect(-4, -16, 8, 3); // fedora
      cx.globalAlpha = 1; cx.restore();
    }

    function updateHUD() {
      hudEl.innerHTML = '<div class="pm-stat"><b>' + "♥".repeat(Math.max(0, st.hearts)) + '</b><span>Life</span></div>' +
        '<div class="pm-stat"><b>' + st.got + '/' + st.relics.length + '</b><span>Relics</span></div>' +
        '<div class="pm-stat"><b>' + st.score + '</b><span>Score</span></div>';
    }

    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.033, (ts - last) / 1000 || 0); last = ts;
      if (!st.over) step(dt);
      draw(); updateHUD();
      if (!st.over) raf = requestAnimationFrame(loop);
    }

    function endScreen() {
      running = false; if (raf) cancelAnimationFrame(raf);
      var nb = st.score > best; if (nb) best = st.score;
      AG.addHighScore("treasure", { score: st.score });
      var recap = st.collected.map(function (f) { return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) + ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>"; }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">The Tomb Robber · ' + (st.won ? "you reach the door" : "the temple claims you") + '</p>' +
          '<h2 id="' + ctx.titleId + '">' + (st.won ? "Escaped with " + st.got + " relic" + (st.got === 1 ? "" : "s") : "Lost in the ruin") + '</h2>' +
          '<p>' + st.score + ' in plunder' + (nb ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p></div>" +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The relics you lifted:</p><ul class="ouro-facts">' + recap + "</ul>" : '<p class="rq-note" style="text-align:center">Lift a relic to learn what it meant.</p>') +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>Raid again</button>' +
          '<a class="game-source" href="chapters/ch02.html">› Read “Egypt”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    function setKey(k, on) { keys[k] = on; }
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.2rem">The Tomb Robber</h2>' +
          "<p>Run the temple, leap the pits and spikes, stomp the serpents, and carry out the relics to the far door.</p></div>" +
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

    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); updateHUD(); draw();
      live.textContent = "Run for the far door — lift every relic you can on the way.";
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
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
    loadFacts().then(boot).catch(function () { root.innerHTML = '<p class="game-placeholder">The temple could not be loaded. Please reload the page.</p>'; });

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); if (keyup) document.removeEventListener("keyup", keyup); };
  }
})();
