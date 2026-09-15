/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Labyrinth" (Pac-Man)

   The soul's passage through the maze of the dead: thread the labyrinth
   gathering the offerings scattered along it while the shades of the dead
   pursue you. Light one of the four sacred lamps and the shades flee — catch
   them then and they scatter back to the dark. Each lamp lit uncovers a real
   underworld belief (data/pacman.json, checked by tools/verify-pacman.js).
   The maze is generated fresh each game (always fully solvable), with a
   centre spine and a side tunnel. Arrows / WASD / swipe / on-screen pad.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/pacman.json";
    return "assets/games/data/pacman.json";
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

  AG.register("pacman", {
    title: "The Labyrinth",
    subtitle: "Thread the maze of the dead — gather the offerings, outrun the shades.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch47) || (window.PLATE_ART && window.PLATE_ART.ch02) || "",
    sourceHref: "chapters/ch47.html", sourceLabel: "Read “Journeys to the Underworld”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var CW = 9, CH = 10;                 // maze cells
    var COLS = CW * 2 + 1, ROWS = CH * 2 + 1;  // 19 x 21 tiles
    var CELL = 20, VW = COLS * CELL, VH = ROWS * CELL;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"), panel: v("--panel", "#1e150d") };
    var SHADE_COLS = ["#b98cff", "#7fe3ff", "#e58ab0", "#8ad0a0"];

    var canvas, cx, hudEl, live, raf = null, keyfn = null, keyup = null, last = 0, running = false, DPR = 1;
    var st = null, best = AG.bestScore("pacman"), touch = null;

    /* ---------------- maze generation (recursive backtracker + braid) ---------------- */
    function genMaze() {
      var g = []; for (var r = 0; r < ROWS; r++) { g[r] = []; for (var c = 0; c < COLS; c++) g[r][c] = 0; } // 0 = wall
      var vis = []; for (var i = 0; i < CH; i++) { vis[i] = []; for (var j = 0; j < CW; j++) vis[i][j] = false; }
      function carve(ci, cj) {
        vis[ci][cj] = true; g[ci * 2 + 1][cj * 2 + 1] = 1;
        var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (var k = dirs.length - 1; k > 0; k--) { var m = (Math.random() * (k + 1)) | 0, t = dirs[k]; dirs[k] = dirs[m]; dirs[m] = t; }
        for (var d = 0; d < 4; d++) {
          var ni = ci + dirs[d][0], nj = cj + dirs[d][1];
          if (ni >= 0 && nj >= 0 && ni < CH && nj < CW && !vis[ni][nj]) {
            g[ci * 2 + 1 + dirs[d][0]][cj * 2 + 1 + dirs[d][1]] = 1; // knock wall between
            carve(ni, nj);
          }
        }
      }
      carve(0, 0);
      // braid: open some dead-ends into loops for better chases
      for (var ci = 0; ci < CH; ci++) for (var cj = 0; cj < CW; cj++) {
        var r = ci * 2 + 1, c = cj * 2 + 1, open = 0, walls = [];
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(function (dd) { var rr = r + dd[0], cc = c + dd[1]; if (g[rr] && g[rr][cc]) open++; else walls.push(dd); });
        if (open <= 1 && walls.length && Math.random() < 0.6) {
          var w = walls.filter(function (dd) { return (r + dd[0] * 2) > 0 && (r + dd[0] * 2) < ROWS - 1 && (c + dd[1] * 2) > 0 && (c + dd[1] * 2) < COLS - 1; });
          if (w.length) { var pick = w[(Math.random() * w.length) | 0]; g[r + pick[0]][c + pick[1]] = 1; }
        }
      }
      // guaranteed spines: centre column + a side-tunnel row (keeps everything connected & classic)
      var midC = COLS >> 1, tunR = ROWS >> 1;
      for (var rr = 1; rr < ROWS - 1; rr++) g[rr][midC] = 1;
      for (var cc = 1; cc < COLS - 1; cc++) g[tunR][cc] = 1;
      g[tunR][0] = 2; g[tunR][COLS - 1] = 2; // 2 = tunnel (path, no dot)
      st = st || {};
      st.tunRow = tunR; st.midC = midC;
      return g;
    }

    function newGame(keepLives) {
      var g = genMaze();
      // dots on every path tile; carve a pen at centre; player start bottom-centre
      var midC = st.midC, midR = ROWS >> 1;
      var penTiles = [[midR, midC], [midR - 1, midC], [midR, midC - 1], [midR, midC + 1]];
      var dots = 0;
      var TILE = []; for (var r = 0; r < ROWS; r++) { TILE[r] = []; for (var c = 0; c < COLS; c++) TILE[r][c] = g[r][c]; }
      // TILE codes now: 0 wall, 1 path→will hold dot, 2 tunnel(no dot)
      for (var r2 = 0; r2 < ROWS; r2++) for (var c2 = 0; c2 < COLS; c2++) {
        if (TILE[r2][c2] === 1) { TILE[r2][c2] = 3; dots++; } // 3 = dot
      }
      function clearDot(r, c) { if (TILE[r] && (TILE[r][c] === 3)) { TILE[r][c] = 1; dots--; } } // 1 = empty path
      // pen (no dots, ghosts live here)
      penTiles.forEach(function (p) { if (TILE[p[0]] && TILE[p[0]][p[1]] !== 0) clearDot(p[0], p[1]); });
      // player start
      var pR = ROWS - 2, pC = midC; if (TILE[pR][pC] === 0) pR = midR + 2; clearDot(pR, pC);
      // four sacred lamps (power pellets) near corners
      var corners = [[2, 2], [2, COLS - 3], [ROWS - 3, 2], [ROWS - 3, COLS - 3]];
      corners.forEach(function (co) {
        var t = nearestPath(TILE, co[0], co[1]);
        if (t) { if (TILE[t[0]][t[1]] === 3) dots--; TILE[t[0]][t[1]] = 4; } // 4 = power lamp
      });

      var lives = keepLives != null ? keepLives : 3;
      st.grid = TILE; st.dots = dots; st.midR = midR; st.penC = midC;
      st.player = mkEnt(pC, pR, 0.115);
      st.player.mouth = 0;
      st.ghosts = [];
      for (var i = 0; i < 4; i++) st.ghosts.push(mkGhost(midC + (i % 2 ? 1 : -1) * ((i >> 1) + 0), midR, i));
      st.score = st.score || 0; st.lives = lives; st.level = st.level || 1;
      st.fright = 0; st.collected = st.collected || []; st.seen = st.seen || {};
      st.over = false; st.won = false; st.ready = 1.2; st.dnotice = "";
      st.motes = st.motes || [];
    }
    function nearestPath(T, r, c) {
      for (var rad = 0; rad < 6; rad++) for (var dr = -rad; dr <= rad; dr++) for (var dc = -rad; dc <= rad; dc++) {
        var rr = r + dr, cc = c + dc; if (T[rr] && (T[rr][cc] === 3 || T[rr][cc] === 1)) return [rr, cc];
      }
      return null;
    }
    function mkEnt(c, r, sp) { return { tx: c, ty: r, dir: { x: 0, y: 0 }, want: { x: 0, y: 0 }, moving: false, prog: 0, speed: sp }; }
    function mkGhost(c, r, idx) { var e = mkEnt(c, r, 0.10); e.col = SHADE_COLS[idx % SHADE_COLS.length]; e.idx = idx; e.eaten = false; e.penT = 0.6 + idx * 0.5; return e; }

    function isWall(r, c) {
      if (c < 0 || c >= COLS) return false; // tunnel columns handled by wrap
      if (r < 0 || r >= ROWS) return true;
      return st.grid[r][c] === 0;
    }
    function wrapC(c) { return c < 0 ? COLS - 1 : c >= COLS ? 0 : c; }

    /* ---------------- movement ---------------- */
    function stepEnt(e, dt, chooser) {
      if (!e.moving) {
        // apply queued/AI direction at the tile centre
        var want = chooser ? chooser(e) : e.want;
        if (want && (want.x || want.y) && !isWall(e.ty + want.y, wrapC(e.tx + want.x))) e.dir = { x: want.x, y: want.y };
        if (e.dir && (e.dir.x || e.dir.y) && !isWall(e.ty + e.dir.y, wrapC(e.tx + e.dir.x))) {
          e.target = { x: wrapC(e.tx + e.dir.x), y: e.ty + e.dir.y };
          e.wrap = (e.dir.x !== 0 && Math.abs(e.target.x - e.tx) > 1);
          e.moving = true; e.prog = 0;
        }
      }
      if (e.moving) {
        e.prog += e.speed * dt * 60;
        if (e.prog >= 1) { e.tx = e.target.x; e.ty = e.target.y; e.moving = false; e.prog = 0; return true; } // arrived
      }
      return false;
    }
    function entPix(e) {
      var cx0 = e.tx * CELL + CELL / 2, cy0 = e.ty * CELL + CELL / 2;
      if (!e.moving || e.wrap) return { x: cx0, y: cy0 };
      var tx0 = e.target.x * CELL + CELL / 2, ty0 = e.target.y * CELL + CELL / 2;
      return { x: cx0 + (tx0 - cx0) * e.prog, y: cy0 + (ty0 - cy0) * e.prog };
    }

    function ghostChoose(g) {
      var opts = [], dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (var i = 0; i < 4; i++) {
        var d = dirs[i]; if (d[0] === -g.dir.x && d[1] === -g.dir.y) continue; // no reversing
        if (!isWall(g.ty + d[1], wrapC(g.tx + d[0]))) opts.push(d);
      }
      if (!opts.length) return { x: -g.dir.x, y: -g.dir.y };
      if (st.fright > 0 && !g.eaten) { return vecOf(opts[(Math.random() * opts.length) | 0]); }
      var target = g.eaten ? { x: st.penC, y: st.midR } : { x: st.player.tx, y: st.player.ty };
      // a little scatter randomness so they don't move as one
      if (!g.eaten && Math.random() < 0.18) return vecOf(opts[(Math.random() * opts.length) | 0]);
      var bestO = opts[0], bestD = 1e9;
      opts.forEach(function (d) { var nx = wrapC(g.tx + d[0]), ny = g.ty + d[1], dd = Math.abs(nx - target.x) + Math.abs(ny - target.y); if (dd < bestD) { bestD = dd; bestO = d; } });
      return vecOf(bestO);
    }
    function vecOf(a) { return { x: a[0], y: a[1] }; }

    /* ---------------- game step ---------------- */
    function tick(dt) {
      if (st.ready > 0) { st.ready -= dt; return; }
      st.player.mouth = (st.player.mouth + dt * 10) % (Math.PI * 2);
      if (stepEnt(st.player, dt, null)) onPlayerArrive();
      st.ghosts.forEach(function (g) {
        if (g.penT > 0) { g.penT -= dt; return; }
        var sp = g.eaten ? 0.19 : st.fright > 0 ? 0.066 : (0.09 + st.level * 0.006);
        g.speed = sp;
        stepEnt(g, dt, ghostChoose);
        if (g.eaten && g.tx === st.penC && g.ty === st.midR && !g.moving) { g.eaten = false; g.penT = 0.4; }
      });
      if (st.fright > 0) st.fright = Math.max(0, st.fright - dt);
      checkCollisions();
      if (st.dots <= 0 && !st.over) nextLevel();
    }
    function onPlayerArrive() {
      var t = st.grid[st.player.ty][st.player.tx];
      if (t === 3) { st.grid[st.player.ty][st.player.tx] = 1; st.dots--; st.score += 10; }
      else if (t === 4) { st.grid[st.player.ty][st.player.tx] = 1; st.dots--; st.score += 50; st.fright = 7; st.ghosts.forEach(function (g) { if (!g.eaten) g.dir = { x: -g.dir.x, y: -g.dir.y }; }); revealFact(); }
    }
    function checkCollisions() {
      var p = st.player;
      st.ghosts.forEach(function (g) {
        if (g.tx === p.tx && g.ty === p.ty) {
          if (g.eaten) return;
          if (st.fright > 0) { g.eaten = true; g.penT = 0; st.score += 200; sparkle(g); }
          else loseLife();
        }
      });
    }
    function sparkle(g) { st.dnotice = ""; }
    function revealFact() {
      if (!facts || !facts.length) return;
      var pool = facts.filter(function (f) { return !st.seen[f.label]; });
      if (!pool.length) return;
      var f = pool[(Math.random() * pool.length) | 0];
      st.seen[f.label] = 1; st.collected.push(f);
      live.innerHTML = '<span class="ouro-sym">☥</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }
    function loseLife() {
      st.lives--;
      if (st.lives <= 0) { st.over = true; endScreen(); return; }
      // reset positions
      st.player.tx = ROWS ? st.player.tx : 0;
      var midC = st.midC, midR = ROWS >> 1;
      st.player = mkEnt(midC, ROWS - 2, 0.115); if (isWall(ROWS - 2, midC)) st.player = mkEnt(midC, midR + 2, 0.115);
      st.player.mouth = 0;
      st.ghosts.forEach(function (g, i) { g.tx = midC + (i % 2 ? 1 : -1); g.ty = midR; g.moving = false; g.dir = { x: 0, y: 0 }; g.eaten = false; g.penT = 0.4 + i * 0.4; });
      st.fright = 0; st.ready = 1.0; updateHUD();
    }
    function nextLevel() {
      st.level++; var lives = st.lives;
      newGame(lives);
      st.dnotice = "Level " + st.level;
      updateHUD();
    }

    /* ---------------- render ---------------- */
    function draw() {
      cx.clearRect(0, 0, VW, VH);
      cx.fillStyle = "#0d0906"; cx.fillRect(0, 0, VW, VH);
      // walls
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        var tv = st.grid[r][c];
        if (tv === 0) drawWall(r, c);
      }
      // dots + lamps
      for (var r2 = 0; r2 < ROWS; r2++) for (var c2 = 0; c2 < COLS; c2++) {
        var t = st.grid[r2][c2], x = c2 * CELL + CELL / 2, y = r2 * CELL + CELL / 2;
        if (t === 3) { cx.fillStyle = COL.gold; cx.beginPath(); cx.arc(x, y, 2.1, 0, 7); cx.fill(); }
        else if (t === 4) { var pulse = 2.6 + Math.sin(performance.now() / 180) * 1.4; cx.save(); cx.shadowColor = COL.goldB; cx.shadowBlur = 10; cx.fillStyle = COL.goldB; cx.beginPath(); cx.arc(x, y, pulse + 2.4, 0, 7); cx.fill(); cx.restore(); }
      }
      st.ghosts.forEach(drawGhost);
      drawSeeker();
      if (st.ready > 0) { cx.fillStyle = "rgba(231,198,128,.9)"; cx.font = "600 16px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.fillText(st.dnotice || "Enter the labyrinth…", VW / 2, VH / 2 - 6); }
    }
    function drawWall(r, c) {
      var x = c * CELL, y = r * CELL;
      var g = cx.createLinearGradient(x, y, x, y + CELL); g.addColorStop(0, "#2a2013"); g.addColorStop(1, "#160f08");
      cx.fillStyle = g; roundRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3, 5); cx.fill();
      cx.strokeStyle = "rgba(199,154,84,.34)"; cx.lineWidth = 1; cx.stroke();
    }
    function drawSeeker() {
      var p = entPix(st.player), a = Math.abs(Math.sin(st.player.mouth)) * 0.5 + 0.06;
      var ang = Math.atan2(st.player.dir.y, st.player.dir.x); if (!st.player.dir.x && !st.player.dir.y) ang = 0;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(ang);
      cx.save(); cx.shadowColor = COL.goldB; cx.shadowBlur = 12;
      var g = cx.createRadialGradient(-2, -2, 1, 0, 0, CELL * 0.5);
      g.addColorStop(0, "#fff2cf"); g.addColorStop(1, COL.gold);
      cx.fillStyle = g; cx.beginPath(); cx.moveTo(0, 0); cx.arc(0, 0, CELL * 0.46, a, Math.PI * 2 - a); cx.closePath(); cx.fill(); cx.restore();
      cx.restore();
    }
    function drawGhost(g) {
      if (g.penT > 0 && !g.eaten && g.ty === st.midR) { /* still draw in pen */ }
      var p = entPix(g), rr = CELL * 0.46, fr = st.fright > 0 && !g.eaten;
      var col = g.eaten ? null : fr ? (st.fright < 2 && Math.floor(performance.now() / 200) % 2 ? "#e7e0ff" : "#5b6cc9") : g.col;
      cx.save(); cx.translate(p.x, p.y);
      if (!g.eaten) {
        cx.save(); cx.shadowColor = col; cx.shadowBlur = 8; cx.fillStyle = col;
        cx.beginPath(); cx.arc(0, -1, rr, Math.PI, 0); // domed head
        cx.lineTo(rr, rr * 0.7);
        for (var k = 0; k < 4; k++) { var xx = rr - (k + 0.5) * (rr * 2 / 4); cx.lineTo(xx, rr * 0.7 + (k % 2 ? 4 : -1)); }
        cx.lineTo(-rr, rr * 0.7); cx.closePath(); cx.globalAlpha = 0.92; cx.fill(); cx.restore();
      }
      // eyes
      var ex = g.dir.x * 2, ey = g.dir.y * 2;
      [-4, 4].forEach(function (o) {
        cx.fillStyle = "#f4efdd"; cx.beginPath(); cx.arc(o, -2, 3, 0, 7); cx.fill();
        cx.fillStyle = fr ? "#3a3057" : "#241a44"; cx.beginPath(); cx.arc(o + ex, -2 + ey, 1.5, 0, 7); cx.fill();
      });
      cx.restore();
    }
    function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }

    function updateHUD() {
      hudEl.innerHTML =
        '<div class="pm-stat"><b>' + st.score + '</b><span>Offerings</span></div>' +
        '<div class="pm-stat"><b>' + "✦".repeat(Math.max(0, st.lives)) + '</b><span>Souls</span></div>' +
        '<div class="pm-stat"><b>' + st.level + '</b><span>Depth</span></div>';
    }

    /* ---------------- loop ---------------- */
    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
      if (!st.over) tick(dt);
      draw(); updateHUD();
      if (!st.over) raf = requestAnimationFrame(loop);
    }

    function endScreen() {
      running = false; if (raf) cancelAnimationFrame(raf);
      var nb = st.score > best; if (nb) best = st.score;
      AG.addHighScore("pacman", { score: st.score });
      var recap = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">The Labyrinth · the shades close in</p>' +
          '<h2 id="' + ctx.titleId + '">The dark takes you at depth ' + st.level + '</h2>' +
          '<p>' + st.score + ' offerings gathered' + (nb ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p></div>" +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">What the lamps revealed:</p><ul class="ouro-facts">' + recap + "</ul>"
               : '<p class="rq-note" style="text-align:center">Light a sacred lamp to reveal the beliefs of the dead.</p>') +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>Descend again</button>' +
          '<a class="game-source" href="chapters/ch47.html">› Read “Journeys to the Underworld”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    /* ---------------- shell + controls ---------------- */
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">The Labyrinth</h2>' +
          "<p>Gather every offering in the maze of the dead. Light a lamp and the shades flee — catch them for the dark.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="pm-hud"></div>' +
        '<div class="pm-stage"><canvas class="pm-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="The Labyrinth maze"></canvas></div>' +
        '<p class="ouro-toast pm-toast" aria-live="polite"></p>' +
        '<div class="ouro-controls"><div class="ouro-dpad">' +
          '<button class="ouro-key up" data-d="up" aria-label="Up">▲</button>' +
          '<button class="ouro-key left" data-d="left" aria-label="Left">◀</button>' +
          '<button class="ouro-key pause" data-d="none" aria-label="Wait">·</button>' +
          '<button class="ouro-key right" data-d="right" aria-label="Right">▶</button>' +
          '<button class="ouro-key down" data-d="down" aria-label="Down">▼</button>' +
        "</div><p class=\"rq-note\">Arrow keys / WASD, swipe, or the pad. Light the four lamps; each reveals a belief of the dead.</p></div>";
      canvas = root.querySelector(".pm-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".pm-hud"); live = root.querySelector(".pm-toast");
      wire();
    }
    var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], none: [0, 0] };
    function setWant(dx, dy) { if (st && st.player) st.player.want = { x: dx, y: dy }; }
    function wire() {
      root.querySelectorAll(".ouro-dpad .ouro-key").forEach(function (b) {
        b.addEventListener("click", function () { var d = DIRS[b.getAttribute("data-d")]; setWant(d[0], d[1]); });
      });
      canvas.addEventListener("touchstart", function (e) { var t = e.changedTouches[0]; touch = { x: t.clientX, y: t.clientY }; }, { passive: true });
      canvas.addEventListener("touchend", function (e) {
        if (!touch) return; var t = e.changedTouches[0], dx = t.clientX - touch.x, dy = t.clientY - touch.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 16) setWant(dx > 0 ? 1 : -1, 0); }
        else { if (Math.abs(dy) > 16) setWant(0, dy > 0 ? 1 : -1); } touch = null;
      }, { passive: true });
    }

    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      st = { score: 0, level: 1, collected: [], seen: {} };
      shell(); newGame(3); updateHUD(); draw();
      live.textContent = "Swipe or press an arrow to move through the labyrinth…";
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }

    keyfn = function (e) {
      var k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { setWant(0, -1); e.preventDefault(); }
      else if (k === "arrowdown" || k === "s") { setWant(0, 1); e.preventDefault(); }
      else if (k === "arrowleft" || k === "a") { setWant(-1, 0); e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { setWant(1, 0); e.preventDefault(); }
    };
    document.addEventListener("keydown", keyfn);

    root.innerHTML = '<div class="rq-loading">Opening the labyrinth…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The labyrinth could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); };
  }
})();
