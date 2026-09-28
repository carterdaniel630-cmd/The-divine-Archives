/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Ouroboros" (snake)

   The serpent grows toward the ouroboros. The symbols it swallows unlock
   facts — every fact drawn from a real chapter (docs/assets/games/data/
   ouroboros.json, checked by tools/verify-ouroboros.js). Mounts into the
   shared expand-in-place overlay. Keyboard + on-screen d-pad + swipe;
   scoring with local high scores; a recap of the facts you uncovered,
   each linking to its source chapter.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/ouroboros.json";
    return "assets/games/data/ouroboros.json";
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

  AG.register("ouroboros", {
    title: "Ouroboros",
    subtitle: "The serpent that devours its own tail. Swallow the symbols; uncover the archive.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch37) || "",
    sourceHref: "chapters/ch37.html", sourceLabel: "Read “Theosophy & the Occult Revival”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var GRID = 15, CELL = 20, W = GRID * CELL;
    var css = getComputedStyle(document.documentElement);
    var COL = {
      ground: (css.getPropertyValue("--panel") || "#1e150d").trim(),
      line: (css.getPropertyValue("--line-soft") || "#2a2013").trim(),
      gold: (css.getPropertyValue("--gold") || "#c79a54").trim(),
      goldB: (css.getPropertyValue("--gold-bright") || "#e7c680").trim(),
      ember: (css.getPropertyValue("--ember") || "#b26a34").trim()
    };
    var canvas, cxr, live, scoreEl, bestEl, levelEl, factToast;
    var st, timer = null, keyfn = null, touch = null, running = false, DPR = 1, bgCache = null, raf = 0;
    var best = AG.bestScore("ouroboros");

    // level-paced tempo: starts unhurried, quickens one step per level, never
    // punishingly fast. Level rises every PER_LEVEL symbols swallowed.
    var PER_LEVEL = 5, BASE_SPEED = 240, STEP_SPEED = 12, MIN_SPEED = 120;
    function levelFor(score) { return 1 + Math.floor(score / PER_LEVEL); }
    function speedFor(level) { return Math.max(MIN_SPEED, BASE_SPEED - (level - 1) * STEP_SPEED); }

    function newGame() {
      st = { snake: [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
        food: null, score: 0, level: 1, speed: speedFor(1), alive: true, paused: false, collected: [], seen: {} };
      placeFood();
    }
    function placeFood() {
      var free = [];
      for (var y = 0; y < GRID; y++) for (var x = 0; x < GRID; x++) {
        if (!st.snake.some(function (s) { return s.x === x && s.y === y; })) free.push({ x: x, y: y });
      }
      var cell = free[Math.floor(Math.random() * free.length)];
      // pick a fact not recently seen when possible
      var pool = facts.filter(function (f) { return !st.seen[f.label]; });
      if (!pool.length) { st.seen = {}; pool = facts; }
      var f = pool[Math.floor(Math.random() * pool.length)];
      st.food = { x: cell.x, y: cell.y, fact: f };
    }

    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.4rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">Ouroboros</h2>' +
          "<p>Guide the serpent to the symbols. Each one it swallows opens a fact from the archive.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="game-scorebar"><div class="stat"><b id="ouro-score">0</b><span>Length gained</span></div>' +
          '<div class="stat"><b id="ouro-level">1</b><span>Level</span></div>' +
          '<div class="stat"><b id="ouro-best">' + best + '</b><span>Your best</span></div></div>' +
        '<div class="ouro-stage"><canvas class="ouro-canvas" width="' + W + '" height="' + W + '" role="img" aria-label="Ouroboros snake board"></canvas></div>' +
        '<p class="ouro-toast" aria-live="polite"></p>' +
        '<div class="ouro-controls">' +
          '<div class="ouro-dpad" aria-hidden="false">' +
            '<button class="ouro-key up" data-d="up" aria-label="Move up">▲</button>' +
            '<button class="ouro-key left" data-d="left" aria-label="Move left">◀</button>' +
            '<button class="ouro-key pause" data-a="pause" aria-label="Pause">‖</button>' +
            '<button class="ouro-key right" data-d="right" aria-label="Move right">▶</button>' +
            '<button class="ouro-key down" data-d="down" aria-label="Move down">▼</button>' +
          "</div>" +
          '<p class="rq-note">Arrow keys / WASD, swipe, or the pad. P to pause.</p>' +
        "</div>";
      canvas = root.querySelector(".ouro-canvas");
      cxr = canvas.getContext("2d");
      // render at device resolution for crisp engraving, draw in logical W units
      // backing store matches the DISPLAYED size (the board is drawn larger on big screens)
      var shown = canvas.getBoundingClientRect().width || W;
      DPR = Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, shown / W);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(W * DPR);
      cxr.setTransform(DPR, 0, 0, DPR, 0, 0);
      bgCache = null;
      AG.onFit(canvas, function () { DPR = AG.scaleFor(canvas, W); canvas.width = Math.round(W * DPR); canvas.height = Math.round(W * DPR); cxr.setTransform(DPR, 0, 0, DPR, 0, 0); bgCache = null; draw(); });
      live = root.querySelector(".ouro-toast");
      scoreEl = root.querySelector("#ouro-score");
      levelEl = root.querySelector("#ouro-level");
      bestEl = root.querySelector("#ouro-best");
      wireControls();
    }

    // turns go into a short queue (up to 3), each checked against the one before it, so
    // two quick presses inside one step (a tight U-turn) both happen instead of the
    // second overwriting the first
    function setDir(dx, dy) {
      if (!st || !st.alive) return;
      if (!st.q) st.q = [];
      var ref = st.q.length ? st.q[st.q.length - 1] : st.dir;
      if ((dx === -ref.x && dy === -ref.y) || (dx === ref.x && dy === ref.y)) return; // no reversing, no repeats
      if (st.q.length < 3) st.q.push({ x: dx, y: dy });
      st.nextDir = st.q[0];
    }
    var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    function wireControls() {
      root.querySelectorAll(".ouro-key[data-d]").forEach(function (b) {
        b.addEventListener("click", function () { var d = DIRS[b.getAttribute("data-d")]; setDir(d[0], d[1]); });
      });
      root.querySelector('[data-a="pause"]').addEventListener("click", togglePause);
      keyfn = function (e) {
        var k = e.key.toLowerCase();
        if (k === "arrowup" || k === "w") { e.preventDefault(); setDir(0, -1); }
        else if (k === "arrowdown" || k === "s") { e.preventDefault(); setDir(0, 1); }
        else if (k === "arrowleft" || k === "a") { e.preventDefault(); setDir(-1, 0); }
        else if (k === "arrowright" || k === "d") { e.preventDefault(); setDir(1, 0); }
        else if (k === "p") { e.preventDefault(); togglePause(); }
      };
      document.addEventListener("keydown", keyfn);
      // swipe
      canvas.addEventListener("touchstart", function (e) { var t = e.changedTouches[0]; touch = { x: t.clientX, y: t.clientY }; }, { passive: true });
      canvas.addEventListener("touchend", function (e) {
        if (!touch) return; var t = e.changedTouches[0]; var dx = t.clientX - touch.x, dy = t.clientY - touch.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 18) setDir(dx > 0 ? 1 : -1, 0); }
        else { if (Math.abs(dy) > 18) setDir(0, dy > 0 ? 1 : -1); }
        touch = null;
      }, { passive: true });
    }

    function togglePause() { if (!st || !st.alive) return; st.paused = !st.paused; if (!st.paused) loop(); else if (timer) { clearTimeout(timer); timer = null; } }

    function step() {
      if (st.q && st.q.length) st.dir = st.q.shift(); else st.dir = st.nextDir;
      st.nextDir = (st.q && st.q[0]) || st.dir;
      var head = st.snake[0];
      var nx = (head.x + st.dir.x + GRID) % GRID;   // wrap around
      var ny = (head.y + st.dir.y + GRID) % GRID;
      // self collision
      if (st.snake.some(function (s, i) { return i < st.snake.length - 1 && s.x === nx && s.y === ny; })) { return gameOver(); }
      st.snake.unshift({ x: nx, y: ny });
      if (st.food && nx === st.food.x && ny === st.food.y) {
        st.score += 1;
        var lv = levelFor(st.score);
        var leveledUp = lv > st.level;
        st.level = lv;
        st.speed = speedFor(lv);
        var f = st.food.fact; st.seen[f.label] = 1;
        if (!st.collected.some(function (c) { return c.label === f.label; })) st.collected.push(f);
        scoreEl.textContent = st.score;
        if (levelEl) levelEl.textContent = st.level;
        showFact(f, leveledUp);
        placeFood();
      } else {
        st.snake.pop();
      }
      draw();
    }

    function showFact(f, leveledUp) {
      live.innerHTML = (leveledUp ? '<span class="ouro-level-up">Level ' + st.level + ' — the coil quickens.</span> ' : "") +
        '<span class="ouro-sym">✵</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    function draw() {
      var now = (window.performance ? performance.now() : Date.now()) / 1000;
      cxr.clearRect(0, 0, W, W);
      drawBoard();
      if (st.food) drawFood(st.food, now);
      drawSerpent(now);
    }

    // the board: a carved stone disc, cached once. Engraved coil with a mouth-gap, twelve
    // stations around it, a faint dotted grid at the cell centres, and a vignette.
    function drawBoard() {
      if (!bgCache) {
        bgCache = document.createElement("canvas"); bgCache.width = Math.round(W * DPR); bgCache.height = Math.round(W * DPR);
        var b = bgCache.getContext("2d"); b.setTransform(DPR, 0, 0, DPR, 0, 0);
        var g = b.createRadialGradient(W * 0.5, W * 0.44, W * 0.05, W / 2, W / 2, W * 0.75);
        g.addColorStop(0, "#33261a"); g.addColorStop(0.55, "#221810"); g.addColorStop(1, "#0f0a06");
        b.fillStyle = g; b.fillRect(0, 0, W, W);
        // stone grain
        for (var k = 0; k < 900; k++) { b.fillStyle = "rgba(" + (Math.random() < 0.5 ? "255,230,190" : "0,0,0") + "," + (Math.random() * 0.05).toFixed(3) + ")"; b.fillRect(Math.random() * W, Math.random() * W, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5); }
        var cx = W / 2, cy = W / 2, R = W * 0.42;
        // engraved coil: a dark cut with a lit lower lip, so it reads as carved
        b.lineCap = "round";
        b.strokeStyle = "rgba(0,0,0,0.45)"; b.lineWidth = 7; b.beginPath(); b.arc(cx, cy, R, -Math.PI * 0.40, Math.PI * 1.48); b.stroke();
        b.strokeStyle = "rgba(231,198,128,0.10)"; b.lineWidth = 2; b.beginPath(); b.arc(cx, cy + 1.5, R, -Math.PI * 0.40, Math.PI * 1.48); b.stroke();
        var ax = cx + R * Math.cos(-Math.PI * 0.40), ay = cy + R * Math.sin(-Math.PI * 0.40);
        b.fillStyle = "rgba(231,198,128,0.14)"; b.beginPath(); b.moveTo(ax + 9, ay - 2); b.lineTo(ax - 3, ay - 7); b.lineTo(ax - 1, ay + 6); b.closePath(); b.fill();
        // twelve stations
        for (var s2 = 0; s2 < 12; s2++) {
          var an = s2 * Math.PI / 6, r1 = R + 9, r2 = R + 15;
          b.strokeStyle = "rgba(231,198,128,0.13)"; b.lineWidth = s2 % 3 === 0 ? 2 : 1;
          b.beginPath(); b.moveTo(cx + r1 * Math.cos(an), cy + r1 * Math.sin(an)); b.lineTo(cx + r2 * Math.cos(an), cy + r2 * Math.sin(an)); b.stroke();
        }
        b.strokeStyle = "rgba(231,198,128,0.06)"; b.lineWidth = 1; b.beginPath(); b.arc(cx, cy, R + 19, 0, Math.PI * 2); b.stroke();
        // cell centres: tiny drilled points instead of ruled lines
        b.fillStyle = "rgba(0,0,0,0.35)";
        for (var y = 0; y < GRID; y++) for (var x = 0; x < GRID; x++) { b.beginPath(); b.arc(x * CELL + CELL / 2, y * CELL + CELL / 2 + 0.6, 0.9, 0, Math.PI * 2); b.fill(); }
        b.fillStyle = "rgba(231,198,128,0.07)";
        for (var y2 = 0; y2 < GRID; y2++) for (var x2 = 0; x2 < GRID; x2++) { b.beginPath(); b.arc(x2 * CELL + CELL / 2, y2 * CELL + CELL / 2, 0.8, 0, Math.PI * 2); b.fill(); }
        // vignette
        var v = b.createRadialGradient(W / 2, W / 2, W * 0.35, W / 2, W / 2, W * 0.74);
        v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.55)");
        b.fillStyle = v; b.fillRect(0, 0, W, W);
      }
      cxr.drawImage(bgCache, 0, 0, W, W);
    }

    // a symbol: a pulsing sigil — rays, a glowing ring and a four-point star
    function drawFood(food, now) {
      var fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2, pulse = 0.5 + 0.5 * Math.sin(now * 4), s = CELL * (0.22 + pulse * 0.03);
      cxr.save();
      var halo = cxr.createRadialGradient(fx, fy, 0, fx, fy, CELL * 1.1);
      halo.addColorStop(0, "rgba(231,198,128," + (0.30 + pulse * 0.2).toFixed(2) + ")"); halo.addColorStop(1, "rgba(231,198,128,0)");
      cxr.fillStyle = halo; cxr.beginPath(); cxr.arc(fx, fy, CELL * 1.1, 0, Math.PI * 2); cxr.fill();
      cxr.strokeStyle = "rgba(231,198,128,0.35)"; cxr.lineWidth = 1;
      for (var k = 0; k < 8; k++) { var an = k * Math.PI / 4 + now * 0.6, r1 = CELL * 0.46, r2 = CELL * (0.62 + pulse * 0.08); cxr.beginPath(); cxr.moveTo(fx + r1 * Math.cos(an), fy + r1 * Math.sin(an)); cxr.lineTo(fx + r2 * Math.cos(an), fy + r2 * Math.sin(an)); cxr.stroke(); }
      cxr.shadowColor = COL.goldB; cxr.shadowBlur = 10;
      cxr.strokeStyle = COL.goldB; cxr.lineWidth = 1.6;
      cxr.beginPath(); cxr.arc(fx, fy, CELL * 0.34, 0, Math.PI * 2); cxr.stroke();
      cxr.shadowBlur = 0; cxr.fillStyle = "#fff1c8";
      cxr.beginPath();
      cxr.moveTo(fx, fy - s); cxr.lineTo(fx + s * 0.3, fy - s * 0.3); cxr.lineTo(fx + s, fy);
      cxr.lineTo(fx + s * 0.3, fy + s * 0.3); cxr.lineTo(fx, fy + s); cxr.lineTo(fx - s * 0.3, fy + s * 0.3);
      cxr.lineTo(fx - s, fy); cxr.lineTo(fx - s * 0.3, fy - s * 0.3); cxr.closePath(); cxr.fill();
      cxr.restore();
    }

    // the serpent: one continuous scaled body (dark belly edge, gold back, a lit ridge and
    // chevron scales), tapering to the tail, with a wedge-shaped head and slit-pupilled eyes.
    function drawSerpent(now) {
      var n = st.snake.length, i;
      var ctr = function (p) { return [p.x * CELL + CELL / 2, p.y * CELL + CELL / 2]; };
      var adj = function (a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1; }; // not a wrap jump
      function widthAt(i) { var t = n > 1 ? i / (n - 1) : 0; return CELL * 0.78 * (1 - 0.55 * t * t); }
      function segs(fn) { for (var k = n - 1; k >= 1; k--) { var a = st.snake[k], b = st.snake[k - 1]; if (adj(a, b)) fn(ctr(a), ctr(b), widthAt(k), widthAt(k - 1), k); } }
      cxr.save(); cxr.lineCap = "round"; cxr.lineJoin = "round";
      // drop shadow
      segs(function (a, b, w0) { cxr.strokeStyle = "rgba(0,0,0,0.35)"; cxr.lineWidth = w0; cxr.beginPath(); cxr.moveTo(a[0] + 1.5, a[1] + 2.5); cxr.lineTo(b[0] + 1.5, b[1] + 2.5); cxr.stroke(); });
      // dark belly edge, then the gold body, then a lit ridge along the back
      segs(function (a, b, w0) { cxr.strokeStyle = "#4a2d10"; cxr.lineWidth = w0 + 2; cxr.beginPath(); cxr.moveTo(a[0], a[1]); cxr.lineTo(b[0], b[1]); cxr.stroke(); });
      segs(function (a, b, w0) { cxr.strokeStyle = COL.gold; cxr.lineWidth = w0; cxr.beginPath(); cxr.moveTo(a[0], a[1]); cxr.lineTo(b[0], b[1]); cxr.stroke(); });
      segs(function (a, b, w0) { cxr.strokeStyle = "rgba(255,236,190,0.55)"; cxr.lineWidth = w0 * 0.28; cxr.beginPath(); cxr.moveTo(a[0] - 1.2, a[1] - 1.2); cxr.lineTo(b[0] - 1.2, b[1] - 1.2); cxr.stroke(); });
      // chevron scales
      segs(function (a, b, w0, w1, k) {
        var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux, hw = w0 * 0.34;
        for (var q = 0.25; q < 1; q += 0.5) {
          var mx = a[0] + dx * q, my = a[1] + dy * q;
          cxr.strokeStyle = "rgba(60,34,10,0.55)"; cxr.lineWidth = 1;
          cxr.beginPath(); cxr.moveTo(mx - ux * 2 + px * hw, my - uy * 2 + py * hw); cxr.lineTo(mx + ux * 1.5, my + uy * 1.5); cxr.lineTo(mx - ux * 2 - px * hw, my - uy * 2 - py * hw); cxr.stroke();
        }
      });
      // tail tip
      var tl = ctr(st.snake[n - 1]); cxr.fillStyle = COL.gold; cxr.beginPath(); cxr.arc(tl[0], tl[1], widthAt(n - 1) / 2, 0, Math.PI * 2); cxr.fill();
      // head: a wedge pointed the way it travels
      var h = ctr(st.snake[0]), dx = st.dir.x, dy = st.dir.y, px = -dy, py = dx, hr = CELL * 0.56;
      var nose = [h[0] + dx * hr * 1.0, h[1] + dy * hr * 1.0], back = [h[0] - dx * hr * 0.55, h[1] - dy * hr * 0.55];
      cxr.shadowColor = COL.goldB; cxr.shadowBlur = 10;
      var hg = cxr.createRadialGradient(h[0] - 2, h[1] - 2, 1, h[0], h[1], hr * 1.1);
      hg.addColorStop(0, "#f7dfa0"); hg.addColorStop(1, COL.gold);
      cxr.fillStyle = hg; cxr.strokeStyle = "#4a2d10"; cxr.lineWidth = 1.4;
      cxr.beginPath();
      cxr.moveTo(nose[0], nose[1]);
      cxr.quadraticCurveTo(h[0] + dx * hr * 0.55 + px * hr * 0.95, h[1] + dy * hr * 0.55 + py * hr * 0.95, back[0] + px * hr * 0.62, back[1] + py * hr * 0.62);
      cxr.quadraticCurveTo(back[0] - dx * hr * 0.25, back[1] - dy * hr * 0.25, back[0] - px * hr * 0.62, back[1] - py * hr * 0.62);
      cxr.quadraticCurveTo(h[0] + dx * hr * 0.55 - px * hr * 0.95, h[1] + dy * hr * 0.55 - py * hr * 0.95, nose[0], nose[1]);
      cxr.closePath(); cxr.fill(); cxr.shadowBlur = 0; cxr.stroke();
      // eyes: amber with a slit pupil
      [1, -1].forEach(function (sg) {
        var ex = h[0] + dx * hr * 0.22 + px * hr * 0.42 * sg, ey = h[1] + dy * hr * 0.22 + py * hr * 0.42 * sg;
        cxr.fillStyle = "#e0701c"; cxr.beginPath(); cxr.arc(ex, ey, hr * 0.17, 0, Math.PI * 2); cxr.fill();
        cxr.fillStyle = "#140d07"; cxr.beginPath(); cxr.ellipse(ex, ey, hr * 0.05 + Math.abs(dy) * hr * 0.09, hr * 0.05 + Math.abs(dx) * hr * 0.09, 0, 0, Math.PI * 2); cxr.fill();
      });
      // forked tongue, flickering
      if (Math.sin(now * 9) > -0.2) {
        var mx = nose[0], my = nose[1], tx = mx + dx * hr * 0.55, ty = my + dy * hr * 0.55;
        cxr.strokeStyle = "#c2432a"; cxr.lineWidth = 1.3;
        cxr.beginPath(); cxr.moveTo(mx, my); cxr.lineTo(tx, ty);
        cxr.lineTo(tx + dx * 3 + px * 3, ty + dy * 3 + py * 3);
        cxr.moveTo(tx, ty); cxr.lineTo(tx + dx * 3 - px * 3, ty + dy * 3 - py * 3);
        cxr.stroke();
      }
      cxr.restore();
    }

    // ambient animation between steps (the sigil's pulse, the tongue); stops with the game
    function animate() {
      raf = 0;
      if (!st || !canvas || !canvas.isConnected) return;
      draw(); raf = requestAnimationFrame(animate);
    }

    function loop() {
      if (!st.alive || st.paused) return;
      timer = setTimeout(function () { if (st && st.alive && !st.paused) { step(); loop(); } }, st.speed);
    }

    function gameOver() {
      st.alive = false; if (timer) { clearTimeout(timer); timer = null; }
      var newBest = false;
      if (st.score > best) { best = st.score; newBest = true; }
      AG.addHighScore("ouroboros", { score: st.score });
      var facts = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Ouroboros · the coil closes</p>' +
          '<h2 id="' + ctx.titleId + '">' + st.score + " symbol" + (st.score === 1 ? "" : "s") + " swallowed</h2>" +
          (newBest ? '<p style="color:var(--gold-bright)">✵ A new personal best.</p>' : "<p>Your best: " + best + "</p>") + "</div>" +
        (facts ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">What you uncovered:</p><ul class="ouro-facts">' + facts + "</ul>"
               : '<p class="rq-note" style="text-align:center">The serpent went hungry — try again.</p>') +
        '<div class="rq-actions"><button class="rq-btn rq-primary" data-a="again" autofocus>Play again</button></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    /* ---------------- boot ---------------- */
    function boot() {
      if (timer) { clearTimeout(timer); timer = null; }
      shell();
      newGame();
      draw();
      if (!raf) raf = requestAnimationFrame(animate);
      st.alive = true;
      // brief "get ready" so the snake doesn't move before the player looks
      live.textContent = "Swipe or press an arrow key to steer the serpent…";
      loop();
    }

    root.innerHTML = '<div class="rq-loading">Rousing the serpent…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The symbols could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (st) st.alive = false;
    };
  }
})();
