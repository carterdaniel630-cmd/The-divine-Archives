/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Ziggurat Builder" (falling blocks)

   Hidden inside the ch03 ziggurat sigil. Inscribed clay-tablet tetrominoes
   fall into a temple well; every line you complete is laid as a course of a
   stepped ziggurat that rises beside the well, and each new course uncovers a
   fact about Mesopotamian temple-building — every fact drawn from real chapter
   text (docs/assets/games/data/ziggurat.json, checked by
   tools/verify-ziggurat.js). Keyboard + on-screen pad + swipe; scoring with
   local high scores; a recap of the courses (and their facts) you raised.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/ziggurat.json";
    return "assets/games/data/ziggurat.json";
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

  // tetromino matrices + palette index
  var SHAPES = {
    I: { m: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], c: 1 },
    O: { m: [[2,2],[2,2]], c: 2 },
    T: { m: [[0,3,0],[3,3,3],[0,0,0]], c: 3 },
    S: { m: [[0,4,4],[4,4,0],[0,0,0]], c: 4 },
    Z: { m: [[5,5,0],[0,5,5],[0,0,0]], c: 5 },
    J: { m: [[6,0,0],[6,6,6],[0,0,0]], c: 6 },
    L: { m: [[0,0,7],[7,7,7],[0,0,0]], c: 7 }
  };
  var BAG = ["I","O","T","S","Z","J","L"];

  AG.register("ziggurat", {
    title: "Ziggurat Builder",
    subtitle: "Lay the courses of a temple-mountain. Every course you raise uncovers the archive.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch03) || "",
    sourceHref: "chapters/ch03.html", sourceLabel: "Read “Mesopotamia”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var COLS = 10, ROWS = 20, CELL = 22, W = COLS * CELL, H = ROWS * CELL;
    var ZW = 150, ZH = 300;                 // monument canvas (logical)
    var css = getComputedStyle(document.documentElement);
    function v(name, fb) { return (css.getPropertyValue(name) || fb).trim(); }
    var COL = {
      ground: v("--panel", "#1e150d"), line: v("--line-soft", "#2a2013"),
      gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"),
      ink: v("--ink", "#cdbb96"), parch: v("--parchment", "#e6dabf")
    };
    // piece palette (earthen clay/brick tones, on-theme)
    var TILE = [null, COL.goldB, COL.gold, COL.ember, v("--good", "#7e9e5c"), "#9c5a44", COL.ink, COL.parch];

    var well, wctx, mon, mctx, nextCv, nctx, holdCv, hctx, live, scoreEl, courseEl, levelEl, bestEl;
    var st, raf = null, keyfn = null, keyupfn = null, touch = null, DPR = 1, tileCache = {}, wellBg = null;
    var best = AG.bestScore("ziggurat");

    /* ---------------- state ----------------
       Guideline mechanics: 7-bag, SRS rotation with wall kicks (separate I table),
       rotate both ways, hold (once per piece), 3-piece preview, 0.5 s lock delay that
       resets on a successful move/rotate (up to 15 times), DAS/ARR auto-shift, and the
       guideline gravity curve. Everything runs off one rAF clock. */
    var DAS = 0.167, ARR = 0.033, SOFT = 0.03, LOCK = 0.5, MAX_RESETS = 15;
    function emptyBoard() { var b = []; for (var y = 0; y < ROWS; y++) { b.push(new Array(COLS).fill(0)); } return b; }
    function newBag() { var a = BAG.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function newGame() {
      st = { board: emptyBoard(), bag: newBag(), piece: null, queue: [], hold: null, canHold: true,
        score: 0, lines: 0, level: 1, alive: true, paused: false, revealed: 0, collected: [],
        grav: 0, lockT: 0, resets: 0, das: { dir: 0, t: 0, arr: 0 }, softT: 0, dirty: true };
      while (st.queue.length < 5) st.queue.push(fromBag());
      spawn();
    }
    function makePiece(k) { var s0 = SHAPES[k]; return { k: k, m: s0.m.map(function (r) { return r.slice(); }), c: s0.c, r: 0 }; }
    function fromBag() { if (!st.bag.length) st.bag = newBag(); return makePiece(st.bag.pop()); }
    function spawn(piece) {
      st.piece = piece || st.queue.shift(); if (!piece) st.queue.push(fromBag());
      st.piece.x = Math.floor((COLS - st.piece.m[0].length) / 2); st.piece.y = -topGap(st.piece.m);
      st.grav = 0; st.lockT = 0; st.resets = 0; st.dirty = true;
      if (collides(st.piece, 0, 0)) { st.alive = false; return gameOver(); }
      if (!collides(st.piece, 0, 1)) st.piece.y += 1;     // guideline: drop one row immediately on spawn
      drawNext(); drawHold();
    }
    function topGap(m) { for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) if (m[r][c]) return r; return 0; }

    function collides(p, dx, dy, mm) {
      var m = mm || p.m;
      for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        var x = p.x + c + dx, y = p.y + r + dy;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && st.board[y][x]) return true;
      }
      return false;
    }
    function rotCW(m) { var n = m.length, out = []; for (var i = 0; i < n; i++) { out.push([]); for (var j = 0; j < n; j++) out[i].push(m[n - 1 - j][i]); } return out; }
    // SRS kick tables, (x, y) with +y UP as published; applied as (x, -y) here
    var KICK_JLSTZ = { "0>1": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]], "1>0": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
      "1>2": [[0,0],[1,0],[1,-1],[0,2],[1,2]], "2>1": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
      "2>3": [[0,0],[1,0],[1,1],[0,-2],[1,-2]], "3>2": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
      "3>0": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]], "0>3": [[0,0],[1,0],[1,1],[0,-2],[1,-2]] };
    var KICK_I = { "0>1": [[0,0],[-2,0],[1,0],[-2,-1],[1,2]], "1>0": [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
      "1>2": [[0,0],[-1,0],[2,0],[-1,2],[2,-1]], "2>1": [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
      "2>3": [[0,0],[2,0],[-1,0],[2,1],[-1,-2]], "3>2": [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
      "3>0": [[0,0],[1,0],[-2,0],[1,-2],[-2,1]], "0>3": [[0,0],[-1,0],[2,0],[-1,2],[2,-1]] };
    function tryRotate(dir) {
      var p = st.piece; if (p.k === "O") return false;
      var m = dir > 0 ? rotCW(p.m) : rotCW(rotCW(rotCW(p.m))), to = (p.r + (dir > 0 ? 1 : 3)) % 4;
      var kicks = (p.k === "I" ? KICK_I : KICK_JLSTZ)[p.r + ">" + to];
      for (var i = 0; i < kicks.length; i++) {
        var dx = kicks[i][0], dy = -kicks[i][1];
        if (!collides(p, dx, dy, m)) { p.m = m; p.x += dx; p.y += dy; p.r = to; return true; }
      }
      return false;
    }
    function grounded() { return collides(st.piece, 0, 1); }
    // a successful move/rotate while resting on the stack buys more lock time (capped)
    function moved() { st.dirty = true; if (grounded() && st.resets < MAX_RESETS) { st.lockT = 0; st.resets++; } }
    function move(dx) { if (!active()) return false; if (!collides(st.piece, dx, 0)) { st.piece.x += dx; moved(); return true; } return false; }
    function softStep() { if (!active()) return; if (!collides(st.piece, 0, 1)) { st.piece.y += 1; st.score += 1; scoreEl.textContent = st.score; st.grav = 0; st.dirty = true; } }
    function hardDrop() { if (!active()) return; var d = 0; while (!collides(st.piece, 0, d + 1)) d++; st.piece.y += d; st.score += d * 2; lock(); }
    function doRotate(dir) { if (!active()) return; if (tryRotate(dir || 1)) moved(); }
    function doHold() {
      if (!active() || !st.canHold) return;
      var cur = makePiece(st.piece.k), prev = st.hold; st.hold = cur; st.canHold = false;
      if (prev) spawn(makePiece(prev.k)); else spawn();
      st.canHold = false; drawHold();
    }
    function active() { return st && st.alive && !st.paused && st.piece; }

    function lock() {
      var m = st.piece.m, col = st.piece.c, above = true;
      for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        if (st.piece.y + r >= 0) { st.board[st.piece.y + r][st.piece.x + c] = col; above = false; }
      }
      if (above) { st.alive = false; return gameOver(); }       // lock out: the whole piece settled above the well
      clearLines();
      st.canHold = true;
      spawn();
      if (!st.alive) return;
      draw(); drawMonument();
    }

    function clearLines() {
      var cleared = 0;
      for (var y = ROWS - 1; y >= 0; y--) {
        if (st.board[y].every(function (v2) { return v2 !== 0; })) {
          st.board.splice(y, 1); st.board.unshift(new Array(COLS).fill(0));
          cleared++; y++;
        }
      }
      if (!cleared) return;
      st.lines += cleared;
      var pts = [0, 100, 300, 500, 800][cleared] || 800;
      st.score += pts * st.level;
      var newLevel = 1 + Math.floor(st.lines / 10);
      if (newLevel !== st.level) { st.level = newLevel; }
      scoreEl.textContent = st.score; courseEl.textContent = st.lines; levelEl.textContent = st.level;
      // reveal one fact per new course, in order
      revealCourses(cleared);
    }

    function revealCourses(n) {
      var shown = null;
      for (var i = 0; i < n && st.revealed < facts.length; i++) {
        var f = facts[st.revealed++];
        st.collected.push(f); shown = f;
      }
      if (shown) {
        live.innerHTML = '<span class="zig-sym">◆</span> <strong>' + esc(shown.label) + ".</strong> " + esc(shown.fact) +
          ' <a class="game-source" href="chapters/' + shown.chapter + '.html">› ' + esc(chapterTitle(shown.chapter)) + "</a>";
      } else if (st.revealed >= facts.length) {
        live.innerHTML = '<span class="zig-sym">✵</span> The full course of facts is laid — keep raising the tower for the record.';
      }
    }

    /* ---------------- rendering ---------------- */
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.4rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">Ziggurat Builder</h2>' +
          "<p>Lay the clay courses. Each line you complete raises the temple-mountain and opens a fact.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="game-scorebar">' +
          '<div class="stat"><b id="zig-score">0</b><span>Score</span></div>' +
          '<div class="stat"><b id="zig-courses">0</b><span>Courses</span></div>' +
          '<div class="stat"><b id="zig-level">1</b><span>Tier</span></div>' +
          '<div class="stat"><b id="zig-best">' + best + '</b><span>Your best</span></div></div>' +
        '<div class="zig-stage">' +
          '<div class="zig-well-wrap"><canvas class="zig-well" width="' + W + '" height="' + H + '" role="img" aria-label="Ziggurat builder well"></canvas></div>' +
          '<div class="zig-side">' +
            '<div class="zig-queues"><div class="zig-next zig-hold"><span class="zig-next-label">Hold</span><canvas class="zig-hold-cv" width="80" height="80" aria-hidden="true"></canvas></div>' +
            '<div class="zig-next"><span class="zig-next-label">Next</span><canvas class="zig-next-cv" width="80" height="200" aria-hidden="true"></canvas></div></div>' +
            '<div class="zig-mon-wrap"><canvas class="zig-mon" width="' + ZW + '" height="' + ZH + '" role="img" aria-label="The rising ziggurat"></canvas></div>' +
          "</div>" +
        "</div>" +
        '<p class="ouro-toast zig-toast" aria-live="polite"></p>' +
        '<div class="ouro-controls">' +
          '<div class="zig-pad">' +
            '<button class="ouro-key zig-rot" data-a="rotate" aria-label="Rotate clockwise">⟳</button>' +
            '<button class="ouro-key zig-ccw" data-a="ccw" aria-label="Rotate counter-clockwise">⟲</button>' +
            '<button class="ouro-key zig-hold-btn" data-a="hold" aria-label="Hold piece">Hold</button>' +
            '<button class="ouro-key zig-left" data-a="left" aria-label="Move left">◀</button>' +
            '<button class="ouro-key zig-pause" data-a="pause" aria-label="Pause">‖</button>' +
            '<button class="ouro-key zig-right" data-a="right" aria-label="Move right">▶</button>' +
            '<button class="ouro-key zig-down" data-a="soft" aria-label="Soft drop">▼</button>' +
            '<button class="ouro-key zig-drop" data-a="hard" aria-label="Hard drop">⤓</button>' +
          "</div>" +
          '<p class="rq-note">← → move (hold to slide) · ↑/X rotate · Z rotate back · ↓ soft drop · space hard drop · C/Shift hold · P pause</p>' +
        "</div>";
      well = root.querySelector(".zig-well"); wctx = well.getContext("2d");
      mon = root.querySelector(".zig-mon"); mctx = mon.getContext("2d");
      nextCv = root.querySelector(".zig-next-cv"); nctx = nextCv.getContext("2d");
      holdCv = root.querySelector(".zig-hold-cv"); hctx = holdCv.getContext("2d");
      // backing store matches the displayed size, so the larger board stays crisp
      var shownW = well.getBoundingClientRect().width || W;
      DPR = Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, shownW / W);
      [[well, W, H], [mon, ZW, ZH]].forEach(function (p) { p[0].width = Math.round(p[1] * DPR); p[0].height = Math.round(p[2] * DPR); p[0].getContext("2d").setTransform(DPR, 0, 0, DPR, 0, 0); });
      tileCache = {}; wellBg = null;
      AG.onFit(well, function () { DPR = AG.scaleFor(well, W); [[well, W, H], [mon, ZW, ZH]].forEach(function (p) { p[0].width = Math.round(p[1] * DPR); p[0].height = Math.round(p[2] * DPR); p[0].getContext("2d").setTransform(DPR, 0, 0, DPR, 0, 0); }); tileCache = {}; wellBg = null; draw(); });
      live = root.querySelector(".zig-toast");
      scoreEl = root.querySelector("#zig-score"); courseEl = root.querySelector("#zig-courses");
      levelEl = root.querySelector("#zig-level"); bestEl = root.querySelector("#zig-best");
      wireControls();
    }

    function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    // a fired mud-brick: grained clay, a bevelled edge lit from the upper left, and two
    // pressed cuneiform wedges. Each colour/size is rendered once and reused.
    function brickImage(size, colIdx) {
      var key = colIdx + "@" + size;
      if (tileCache[key]) return tileCache[key];
      var cv = document.createElement("canvas"), sc = DPR; cv.width = Math.ceil(size * sc); cv.height = Math.ceil(size * sc);
      var c = cv.getContext("2d"); c.setTransform(sc, 0, 0, sc, 0, 0);
      var col = TILE[colIdx], s = size;
      roundRect(c, 1, 1, s - 2, s - 2, 2.5); c.fillStyle = col; c.fill();
      c.save(); roundRect(c, 1, 1, s - 2, s - 2, 2.5); c.clip();
      // grain: a seeded speckle so every brick of a colour matches
      var seed = colIdx * 97 + 13; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var k = 0; k < s * 2.2; k++) { c.fillStyle = rnd() < 0.5 ? "rgba(255,240,210,0.10)" : "rgba(30,15,5,0.14)"; c.fillRect(rnd() * s, rnd() * s, 1 + rnd(), 1 + rnd()); }
      // bevel
      var g = c.createLinearGradient(0, 0, s, s); g.addColorStop(0, "rgba(255,244,220,0.30)"); g.addColorStop(0.45, "rgba(255,244,220,0)"); g.addColorStop(0.6, "rgba(20,10,4,0)"); g.addColorStop(1, "rgba(20,10,4,0.38)");
      c.fillStyle = g; c.fillRect(0, 0, s, s);
      c.restore();
      c.strokeStyle = "rgba(20,12,5,0.7)"; c.lineWidth = 1; roundRect(c, 1, 1, s - 2, s - 2, 2.5); c.stroke();
      c.strokeStyle = "rgba(255,240,210,0.22)"; c.beginPath(); c.moveTo(2.5, s - 3); c.lineTo(2.5, 2.5); c.lineTo(s - 3, 2.5); c.stroke();
      // pressed wedges: a horizontal and a vertical stroke with triangular heads
      function wedge(x, y, dx, dy, L) {
        var px = -dy, py = dx, hw = s * 0.07;
        c.fillStyle = "rgba(25,12,4,0.42)"; c.beginPath(); c.moveTo(x - px * hw, y - py * hw); c.lineTo(x + px * hw, y + py * hw); c.lineTo(x + dx * L, y + dy * L); c.closePath(); c.fill();
        c.fillStyle = "rgba(255,240,210,0.16)"; c.beginPath(); c.moveTo(x + px * hw, y + py * hw); c.lineTo(x + dx * L, y + dy * L); c.lineTo(x + px * hw * 0.4 + dx * L * 0.4, y + py * hw * 0.4 + dy * L * 0.4); c.closePath(); c.fill();
      }
      wedge(s * 0.28, s * 0.36, 1, 0, s * 0.42); wedge(s * 0.52, s * 0.5, 0, 1, s * 0.3);
      tileCache[key] = cv;
      return cv;
    }
    function tile(c, px, py, size, colIdx) { c.drawImage(brickImage(size, colIdx), px, py, size, size); }

    // the well: a dusk sky behind a faint mud-brick wall, so the board reads as a building site
    function drawWellBg() {
      if (!wellBg) {
        wellBg = document.createElement("canvas"); wellBg.width = Math.round(W * DPR); wellBg.height = Math.round(H * DPR);
        var b = wellBg.getContext("2d"); b.setTransform(DPR, 0, 0, DPR, 0, 0);
        var g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#121629"); g.addColorStop(0.55, "#2a1f2a"); g.addColorStop(0.85, "#4a2c1c"); g.addColorStop(1, "#5c361e");
        b.fillStyle = g; b.fillRect(0, 0, W, H);
        for (var k = 0; k < 40; k++) { var y = Math.random() * H * 0.5; b.fillStyle = "rgba(255,240,210," + (0.25 + Math.random() * 0.5) * (1 - y / (H * 0.5)) + ")"; b.fillRect(Math.random() * W, y, 1, 1); }
        b.beginPath(); b.arc(W * 0.78, H * 0.12, 9, 0, Math.PI * 2); b.fillStyle = "rgba(231,198,128,0.55)"; b.fill();
        b.beginPath(); b.arc(W * 0.78 + 3.5, H * 0.12 - 2, 8, 0, Math.PI * 2); b.fillStyle = "#141729"; b.fill();
        // faint coursed brickwork
        b.strokeStyle = "rgba(231,198,128,0.05)"; b.lineWidth = 1;
        for (var r = 0; r < ROWS; r++) {
          b.beginPath(); b.moveTo(0, r * CELL + 0.5); b.lineTo(W, r * CELL + 0.5); b.stroke();
          for (var x = (r % 2 ? CELL : CELL / 2); x < W; x += CELL * 2) { b.beginPath(); b.moveTo(x + 0.5, r * CELL); b.lineTo(x + 0.5, (r + 1) * CELL); b.stroke(); }
        }
        var v = b.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.7); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.45)");
        b.fillStyle = v; b.fillRect(0, 0, W, H);
      }
      wctx.drawImage(wellBg, 0, 0, W, H);
    }

    function draw() {
      wctx.clearRect(0, 0, W, H);
      drawWellBg();
      // settled board, with a soft shadow under the stack
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (st.board[y][x]) {
        wctx.fillStyle = "rgba(0,0,0,0.28)"; wctx.fillRect(x * CELL + 2, y * CELL + 3, CELL - 2, CELL - 2);
      }
      for (y = 0; y < ROWS; y++) for (x = 0; x < COLS; x++) if (st.board[y][x]) tile(wctx, x * CELL, y * CELL, CELL, st.board[y][x]);
      // ghost + active piece
      if (st.piece) {
        var d = 0; while (!collides(st.piece, 0, d + 1)) d++;
        var m = st.piece.m;
        wctx.save(); wctx.setLineDash([3, 3]); wctx.strokeStyle = COL.goldB; wctx.globalAlpha = .45; wctx.lineWidth = 1.2;
        for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
          if (!m[r][c]) continue;
          var gx = (st.piece.x + c) * CELL, gy = (st.piece.y + r + d) * CELL;
          if (st.piece.y + r + d >= 0) { roundRect(wctx, gx + 2.5, gy + 2.5, CELL - 5, CELL - 5, 3); wctx.stroke(); }
        }
        wctx.restore();
        wctx.save(); wctx.shadowColor = "rgba(231,198,128,0.45)"; wctx.shadowBlur = 8;
        for (r = 0; r < m.length; r++) for (c = 0; c < m[r].length; c++) {
          if (m[r][c] && st.piece.y + r >= 0) tile(wctx, (st.piece.x + c) * CELL, (st.piece.y + r) * CELL, CELL, st.piece.c);
        }
        wctx.restore();
      }
    }

    function drawMini(c, pc, cx0, cy0, sz, dim) {
      var m = pc.m, rows = [], r, cc;
      for (r = 0; r < m.length; r++) if (m[r].some(function (v2) { return v2; })) rows.push(r);
      var minC = 9, maxC = 0; for (r = 0; r < m.length; r++) for (cc = 0; cc < m[r].length; cc++) if (m[r][cc]) { minC = Math.min(minC, cc); maxC = Math.max(maxC, cc); }
      var w = (maxC - minC + 1) * sz, h = rows.length * sz, ox = cx0 - w / 2, oy = cy0 - h / 2;
      c.globalAlpha = dim ? 0.35 : 1;
      rows.forEach(function (rr, i) { for (var k = minC; k <= maxC; k++) if (m[rr][k]) tile(c, ox + (k - minC) * sz, oy + i * sz, sz, pc.c); });
      c.globalAlpha = 1;
    }
    function drawNext() {
      if (!nctx) return;
      nctx.clearRect(0, 0, 80, 200);
      st.queue.slice(0, 3).forEach(function (pc, i) { drawMini(nctx, pc, 40, 36 + i * 64, i === 0 ? 16 : 13); });
    }
    function drawHold() {
      if (!hctx) return;
      hctx.clearRect(0, 0, 80, 80);
      if (st.hold) drawMini(hctx, st.hold, 40, 40, 15, !st.canHold);
    }
    // the rising monument: cleared courses build a broad stepped ziggurat.
    // A tier is added every PER_TIER courses (capped), and the current tier
    // grows in height as its courses are laid — so the silhouette always reads
    // as a temple-mountain rather than a thinning spire.
    function drawMonument() {
      mctx.clearRect(0, 0, ZW, ZH);
      var courses = st.lines, cx = ZW / 2, groundY = ZH - 14;
      var sky = mctx.createLinearGradient(0, 0, 0, ZH); sky.addColorStop(0, "#121629"); sky.addColorStop(0.7, "#3a2620"); sky.addColorStop(1, "#6a4022");
      mctx.fillStyle = sky; roundRect(mctx, 0, 0, ZW, ZH, 8); mctx.fill();
      mctx.fillStyle = "#3b2616"; mctx.beginPath(); mctx.moveTo(0, groundY + 2); mctx.quadraticCurveTo(ZW * 0.3, groundY - 6, ZW * 0.6, groundY); mctx.quadraticCurveTo(ZW * 0.85, groundY + 5, ZW, groundY - 2); mctx.lineTo(ZW, ZH); mctx.lineTo(0, ZH); mctx.closePath(); mctx.fill();
      mctx.strokeStyle = COL.line; mctx.lineWidth = 1;
      mctx.beginPath(); mctx.moveTo(8, groundY + 2); mctx.lineTo(ZW - 8, groundY + 2); mctx.stroke();
      if (courses <= 0) {
        mctx.fillStyle = COL.ink; mctx.globalAlpha = .5; mctx.font = "11px Georgia, serif"; mctx.textAlign = "center";
        mctx.fillText("no courses laid yet", cx, groundY - 8); mctx.globalAlpha = 1; mctx.textAlign = "left";
        return;
      }
      var PER_TIER = 3, MAX_TIERS = 6, baseHalf = 58, stepIn = 8, minHalf = 14;
      var tiersExact = courses / PER_TIER;
      var tiers = Math.min(MAX_TIERS, Math.max(1, Math.ceil(tiersExact)));
      var tierH = Math.min(34, (groundY - 34) / tiers);
      var topY = groundY;
      for (var t = 0; t < tiers; t++) {
        var half = Math.max(minHalf, baseHalf - t * stepIn);
        var frac = (t === tiers - 1) ? Math.min(1, tiersExact - (tiers - 1) || 1) : 1;
        if (frac <= 0) frac = 1 / PER_TIER;
        var yBot = groundY - t * tierH, yTop = yBot - tierH * frac;
        topY = yTop;
        var g = mctx.createLinearGradient(0, yTop, 0, yBot);
        g.addColorStop(0, COL.goldB); g.addColorStop(0.5, COL.gold); g.addColorStop(1, COL.ember);
        mctx.fillStyle = g; mctx.fillRect(cx - half, yTop, half * 2, yBot - yTop - 1);
        mctx.fillStyle = "rgba(255,241,214,.14)"; mctx.fillRect(cx - half, yTop, half * 2, 2); // lit terrace edge
        // horizontal brick courses + vertical joints
        mctx.strokeStyle = "rgba(20,13,7,.26)"; mctx.lineWidth = 1;
        for (var yy = yTop + 8; yy < yBot - 2; yy += 8) { mctx.beginPath(); mctx.moveTo(cx - half, yy); mctx.lineTo(cx + half, yy); mctx.stroke(); }
        for (var jx = cx - half + 13; jx < cx + half - 2; jx += 15) { mctx.beginPath(); mctx.moveTo(jx, yTop + 1); mctx.lineTo(jx, yBot - 1); mctx.stroke(); }
        mctx.strokeStyle = "rgba(20,13,7,.4)"; mctx.strokeRect(cx - half, yTop, half * 2, yBot - yTop - 1);
      }
      // ceremonial stair up the near face
      mctx.strokeStyle = "rgba(20,13,7,.45)"; mctx.lineWidth = 3;
      mctx.beginPath(); mctx.moveTo(cx, groundY); mctx.lineTo(cx, topY); mctx.stroke();
      // shrine at the summit once the mountain stands
      if (courses >= PER_TIER * 2) {
        var sw = 22, sh = 15;
        mctx.save(); mctx.shadowColor = COL.goldB; mctx.shadowBlur = 13;
        mctx.fillStyle = COL.goldB; mctx.fillRect(cx - sw / 2, topY - sh, sw, sh);
        mctx.restore();
        mctx.fillStyle = COL.ground; mctx.fillRect(cx - 3.5, topY - sh + 5, 7, sh - 5); // doorway
        mctx.strokeStyle = COL.ember; mctx.lineWidth = 1.4;
        mctx.beginPath(); mctx.moveTo(cx, topY - sh); mctx.lineTo(cx, topY - sh - 9); mctx.stroke();
        mctx.fillStyle = COL.goldB; mctx.beginPath(); mctx.arc(cx, topY - sh - 11, 2.6, 0, Math.PI * 2); mctx.fill();
      }
    }

    /* ---------------- input ---------------- */
    var held = { soft: false };
    function press(dir) { if (!active()) return; move(dir); st.das = { dir: dir, t: 0, arr: 0 }; }
    function release(dir) { if (st && st.das.dir === dir) st.das = { dir: 0, t: 0, arr: 0 }; }
    var DIRS = { left: function () { move(-1); }, right: function () { move(1); }, rotate: function () { doRotate(1); }, ccw: function () { doRotate(-1); },
      soft: function () { softStep(); }, hard: hardDrop, hold: doHold, pause: togglePause };
    function wireControls() {
      root.querySelectorAll(".zig-pad .ouro-key").forEach(function (b) {
        var a = b.getAttribute("data-a");
        if (a === "left" || a === "right") {           // held pad buttons auto-shift like the keys
          var dir = a === "left" ? -1 : 1;
          var dn = function (e) { e.preventDefault(); press(dir); }, up = function () { release(dir); };
          b.addEventListener("pointerdown", dn); b.addEventListener("pointerup", up); b.addEventListener("pointerleave", up); b.addEventListener("pointercancel", up);
        } else if (a === "soft") {
          b.addEventListener("pointerdown", function (e) { e.preventDefault(); softStep(); held.soft = true; });
          ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { b.addEventListener(ev, function () { held.soft = false; }); });
        } else b.addEventListener("click", function () { if (DIRS[a]) DIRS[a](); });
      });
      keyfn = function (e) {
        var k = e.key.toLowerCase(), code = e.code;
        var mapped = true;
        if (k === "arrowleft" || k === "a") { if (!e.repeat) press(-1); }
        else if (k === "arrowright" || k === "d") { if (!e.repeat) press(1); }
        else if (k === "arrowup" || k === "x" || k === "w") { if (!e.repeat) doRotate(1); }
        else if (k === "z" || k === "control" || k === "q") { if (!e.repeat) doRotate(-1); }
        else if (k === "arrowdown" || k === "s") { if (!e.repeat) { softStep(); held.soft = true; } }
        else if (k === " " || k === "spacebar") { if (!e.repeat) hardDrop(); }
        else if (k === "c" || k === "shift" || code === "ShiftLeft") { if (!e.repeat) doHold(); }
        else if (k === "p") { if (!e.repeat) togglePause(); }
        else mapped = false;
        if (mapped) e.preventDefault();
      };
      keyupfn = function (e) {
        var k = e.key.toLowerCase();
        if (k === "arrowleft" || k === "a") release(-1);
        else if (k === "arrowright" || k === "d") release(1);
        else if (k === "arrowdown" || k === "s") held.soft = false;
      };
      document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyupfn);
      // touch: horizontal swipe = move, down swipe = hard drop, tap = rotate
      well.addEventListener("touchstart", function (e) { var t = e.changedTouches[0]; touch = { x: t.clientX, y: t.clientY, t: Date.now() }; }, { passive: true });
      well.addEventListener("touchend", function (e) {
        if (!touch) return; var t = e.changedTouches[0]; var dx = t.clientX - touch.x, dy = t.clientY - touch.y;
        if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && Date.now() - touch.t < 300) { doRotate(1); }
        else if (Math.abs(dx) > Math.abs(dy)) { var n = Math.max(1, Math.round(Math.abs(dx) / 26)); for (var i = 0; i < n; i++) move(dx > 0 ? 1 : -1); }
        else if (dy > 24) { hardDrop(); } else if (dy < -14) { doHold(); }
        touch = null;
      }, { passive: true });
    }
    function togglePause() { if (!st || !st.alive) return; st.paused = !st.paused; live.textContent = st.paused ? "Paused." : ""; if (!st.paused) loop(); }

    /* ---------------- loop ---------------- */
    // guideline gravity: seconds per row = (0.8 - (level-1)*0.007)^(level-1)
    function gravSec() { var L = Math.min(st.level, 20) - 1; return Math.max(0.017, Math.pow(0.8 - L * 0.007, L)); }
    var lastT = 0;
    function loop() { lastT = performance.now(); if (!raf) raf = requestAnimationFrame(tick); }
    function tick(ts) {
      raf = null;
      if (!st || !st.alive) return;
      var dt = Math.min(0.1, (ts - lastT) / 1000 || 0); lastT = ts;
      if (!st.paused) {
        // auto-shift: one step on press, then after DAS repeat every ARR
        var d = st.das;
        if (d.dir) { d.t += dt; if (d.t >= DAS) { d.arr += dt; while (d.arr >= ARR) { d.arr -= ARR; if (!move(d.dir)) { d.arr = 0; break; } } } }
        if (held.soft) { st.softT += dt; while (st.softT >= SOFT) { st.softT -= SOFT; softStep(); } } else st.softT = 0;
        if (grounded()) {
          st.lockT += dt; if (st.lockT >= LOCK) lock();
        } else {
          st.grav += dt; var g = gravSec();
          while (st.grav >= g && !grounded()) { st.grav -= g; st.piece.y += 1; st.dirty = true; if (grounded() && st.resets > 0) break; }
          if (grounded()) st.grav = 0;
        }
      }
      if (st.alive && st.dirty) { st.dirty = false; draw(); }
      if (st.alive) raf = requestAnimationFrame(tick);
    }
    function gameOver() {
      st.alive = false; if (raf) { cancelAnimationFrame(raf); raf = null; }
      var newBest = false; if (st.score > best) { best = st.score; newBest = true; }
      AG.addHighScore("ziggurat", { score: st.score, lines: st.lines });
      var list = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Ziggurat Builder · the tower stands</p>' +
          '<h2 id="' + ctx.titleId + '">' + st.lines + " course" + (st.lines === 1 ? "" : "s") + " raised</h2>" +
          (newBest ? '<p style="color:var(--gold-bright)">✵ A new personal best — ' + st.score + " points.</p>" : "<p>Score " + st.score + " · your best: " + best + "</p>") + "</div>" +
        '<div class="game-rule" role="presentation"></div>' +
        (list ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The courses you laid:</p><ul class="ouro-facts">' + list + "</ul>"
              : '<p class="rq-note" style="text-align:center">No full course was laid — the clay awaits. Try again.</p>') +
        '<div class="rq-actions"><button class="rq-btn rq-primary" data-a="again" autofocus>Build again</button></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    /* ---------------- boot ---------------- */
    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); draw(); drawMonument(); drawNext();
      live.textContent = "Complete a row to lay the first course of the temple-mountain.";
      loop();
    }

    if (window.__ZIG_TEST) window.__zig = function () { return st && { x: st.piece && st.piece.x, y: st.piece && st.piece.y, k: st.piece && st.piece.k, r: st.piece && st.piece.r, hold: st.hold && st.hold.k, queue: st.queue.slice(0, 3).map(function (q) { return q.k; }), alive: st.alive, lines: st.lines, filled: st.board.reduce(function (a, row) { return a + row.filter(Boolean).length; }, 0) }; };
    root.innerHTML = '<div class="rq-loading">Wetting the clay…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The courses could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (keyupfn) document.removeEventListener("keyup", keyupfn);
      if (st) st.alive = false;
    };
  }
})();
