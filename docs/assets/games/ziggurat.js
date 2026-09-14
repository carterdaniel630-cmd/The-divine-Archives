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
    var COLS = 10, ROWS = 18, CELL = 22, W = COLS * CELL, H = ROWS * CELL;
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

    var well, wctx, mon, mctx, nextCv, nctx, live, scoreEl, courseEl, levelEl, bestEl;
    var st, timer = null, keyfn = null, touch = null, DPR = 1;
    var best = AG.bestScore("ziggurat");

    /* ---------------- state ---------------- */
    function emptyBoard() { var b = []; for (var y = 0; y < ROWS; y++) { b.push(new Array(COLS).fill(0)); } return b; }
    function newBag() { var a = BAG.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function newGame() {
      st = { board: emptyBoard(), bag: newBag(), piece: null, next: null,
        score: 0, lines: 0, level: 1, alive: true, paused: false, revealed: 0, collected: [] };
      st.next = fromBag();
      spawn();
    }
    function fromBag() { if (!st.bag.length) st.bag = newBag(); var k = st.bag.pop(); var s = SHAPES[k]; return { m: s.m.map(function (r) { return r.slice(); }), c: s.c }; }
    function spawn() {
      st.piece = st.next; st.next = fromBag();
      st.piece.x = Math.floor((COLS - st.piece.m[0].length) / 2); st.piece.y = -topGap(st.piece.m);
      if (collides(st.piece, 0, 0)) { st.alive = false; return gameOver(); }
      drawNext();
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
    function rot(m) { var n = m.length, out = []; for (var i = 0; i < n; i++) { out.push([]); for (var j = 0; j < n; j++) out[i].push(m[n - 1 - j][i]); } return out; }
    function tryRotate() {
      var m = rotate(st.piece.m);
      var kicks = [0, -1, 1, -2, 2];
      for (var i = 0; i < kicks.length; i++) { if (!collides(st.piece, kicks[i], 0, m)) { st.piece.m = m; st.piece.x += kicks[i]; return true; } }
      return false;
    }
    function rotate(m) { return rot(m); }

    function move(dx) { if (!active()) return; if (!collides(st.piece, dx, 0)) { st.piece.x += dx; draw(); } }
    function softDrop() { if (!active()) return; if (!collides(st.piece, 0, 1)) { st.piece.y += 1; st.score += 1; scoreEl.textContent = st.score; draw(); resetTimer(); } else lock(); }
    function hardDrop() { if (!active()) return; var d = 0; while (!collides(st.piece, 0, d + 1)) d++; st.piece.y += d; st.score += d * 2; lock(); }
    function doRotate() { if (!active()) return; if (tryRotate()) draw(); }
    function active() { return st && st.alive && !st.paused && st.piece; }

    function lock() {
      var m = st.piece.m, col = st.piece.c;
      for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
        if (m[r][c] && st.piece.y + r >= 0) st.board[st.piece.y + r][st.piece.x + c] = col;
      }
      clearLines();
      spawn();
      draw(); drawMonument();
      resetTimer();
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
            '<div class="zig-next"><span class="zig-next-label">Next</span><canvas class="zig-next-cv" width="80" height="80" aria-hidden="true"></canvas></div>' +
            '<div class="zig-mon-wrap"><canvas class="zig-mon" width="' + ZW + '" height="' + ZH + '" role="img" aria-label="The rising ziggurat"></canvas></div>' +
          "</div>" +
        "</div>" +
        '<p class="ouro-toast zig-toast" aria-live="polite"></p>' +
        '<div class="ouro-controls">' +
          '<div class="zig-pad">' +
            '<button class="ouro-key zig-rot" data-a="rotate" aria-label="Rotate">⟳</button>' +
            '<button class="ouro-key zig-left" data-a="left" aria-label="Move left">◀</button>' +
            '<button class="ouro-key zig-pause" data-a="pause" aria-label="Pause">‖</button>' +
            '<button class="ouro-key zig-right" data-a="right" aria-label="Move right">▶</button>' +
            '<button class="ouro-key zig-down" data-a="soft" aria-label="Soft drop">▼</button>' +
            '<button class="ouro-key zig-drop" data-a="hard" aria-label="Hard drop">⤓</button>' +
          "</div>" +
          '<p class="rq-note">← → move · ↑/X rotate · ↓ soft drop · space hard drop · P pause</p>' +
        "</div>";
      well = root.querySelector(".zig-well"); wctx = well.getContext("2d");
      mon = root.querySelector(".zig-mon"); mctx = mon.getContext("2d");
      nextCv = root.querySelector(".zig-next-cv"); nctx = nextCv.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      [[well, W, H], [mon, ZW, ZH]].forEach(function (p) { p[0].width = p[1] * DPR; p[0].height = p[2] * DPR; p[0].getContext("2d").setTransform(DPR, 0, 0, DPR, 0, 0); });
      live = root.querySelector(".zig-toast");
      scoreEl = root.querySelector("#zig-score"); courseEl = root.querySelector("#zig-courses");
      levelEl = root.querySelector("#zig-level"); bestEl = root.querySelector("#zig-best");
      wireControls();
    }

    function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    // an inscribed clay tile: mortar border, lit top edge, a small wedge mark
    function tile(c, px, py, size, colIdx) {
      var col = TILE[colIdx];
      c.fillStyle = col; roundRect(c, px + 1, py + 1, size - 2, size - 2, 3); c.fill();
      // top highlight / bottom shade for relief
      c.fillStyle = "rgba(255,241,214,.14)"; roundRect(c, px + 2, py + 2, size - 4, (size - 4) * 0.42, 2); c.fill();
      c.fillStyle = "rgba(20,13,7,.20)"; c.fillRect(px + 2, py + size - Math.max(3, size * 0.22), size - 4, size * 0.18);
      // mortar border
      c.strokeStyle = "rgba(20,13,7,.55)"; c.lineWidth = 1; roundRect(c, px + 1, py + 1, size - 2, size - 2, 3); c.stroke();
      // engraved wedge (cuneiform mark)
      c.strokeStyle = "rgba(20,13,7,.32)"; c.lineWidth = 1;
      var cx = px + size * 0.5, cy = py + size * 0.52;
      c.beginPath(); c.moveTo(cx - size * 0.14, cy - size * 0.12); c.lineTo(cx + size * 0.14, cy - size * 0.12);
      c.moveTo(cx, cy - size * 0.04); c.lineTo(cx, cy + size * 0.16); c.stroke();
    }

    function draw() {
      wctx.clearRect(0, 0, W, H);
      wctx.fillStyle = COL.ground; wctx.fillRect(0, 0, W, H);
      // faint grid
      wctx.strokeStyle = COL.line; wctx.lineWidth = 1; wctx.globalAlpha = .5;
      for (var x = 1; x < COLS; x++) { wctx.beginPath(); wctx.moveTo(x * CELL, 0); wctx.lineTo(x * CELL, H); wctx.stroke(); }
      for (var y = 1; y < ROWS; y++) { wctx.beginPath(); wctx.moveTo(0, y * CELL); wctx.lineTo(W, y * CELL); wctx.stroke(); }
      wctx.globalAlpha = 1;
      // settled board
      for (y = 0; y < ROWS; y++) for (x = 0; x < COLS; x++) if (st.board[y][x]) tile(wctx, x * CELL, y * CELL, CELL, st.board[y][x]);
      // ghost + active piece
      if (st.piece) {
        var d = 0; while (!collides(st.piece, 0, d + 1)) d++;
        var m = st.piece.m;
        for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
          if (!m[r][c]) continue;
          var gx = (st.piece.x + c) * CELL, gy = (st.piece.y + r + d) * CELL;
          if (st.piece.y + r + d >= 0) { wctx.strokeStyle = TILE[st.piece.c]; wctx.globalAlpha = .28; wctx.lineWidth = 1.5; roundRect(wctx, gx + 2, gy + 2, CELL - 4, CELL - 4, 3); wctx.stroke(); wctx.globalAlpha = 1; }
        }
        for (r = 0; r < m.length; r++) for (c = 0; c < m[r].length; c++) {
          if (m[r][c] && st.piece.y + r >= 0) tile(wctx, (st.piece.x + c) * CELL, (st.piece.y + r) * CELL, CELL, st.piece.c);
        }
      }
    }

    function drawNext() {
      if (!nctx) return;
      nctx.clearRect(0, 0, 80, 80);
      var m = st.next.m, n = m.length, sz = 16, offx = (80 - m[0].length * sz) / 2, offy = (80 - n * sz) / 2;
      for (var r = 0; r < n; r++) for (var c = 0; c < m[r].length; c++) if (m[r][c]) tile(nctx, offx + c * sz, offy + r * sz, sz, st.next.c);
    }

    // the rising monument: cleared courses build a broad stepped ziggurat.
    // A tier is added every PER_TIER courses (capped), and the current tier
    // grows in height as its courses are laid — so the silhouette always reads
    // as a temple-mountain rather than a thinning spire.
    function drawMonument() {
      mctx.clearRect(0, 0, ZW, ZH);
      var courses = st.lines, cx = ZW / 2, groundY = ZH - 14;
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
    var DIRS = { left: function () { move(-1); }, right: function () { move(1); }, rotate: doRotate, soft: softDrop, hard: hardDrop, pause: togglePause };
    function wireControls() {
      root.querySelectorAll(".zig-pad .ouro-key").forEach(function (b) {
        b.addEventListener("click", function () { var a = b.getAttribute("data-a"); if (DIRS[a]) DIRS[a](); });
      });
      keyfn = function (e) {
        var k = e.key.toLowerCase();
        if (k === "arrowleft" || k === "a") { e.preventDefault(); move(-1); }
        else if (k === "arrowright" || k === "d") { e.preventDefault(); move(1); }
        else if (k === "arrowup" || k === "x" || k === "w") { e.preventDefault(); doRotate(); }
        else if (k === "z") { e.preventDefault(); doRotate(); }
        else if (k === "arrowdown" || k === "s") { e.preventDefault(); softDrop(); }
        else if (k === " " || k === "spacebar") { e.preventDefault(); hardDrop(); }
        else if (k === "p") { e.preventDefault(); togglePause(); }
      };
      document.addEventListener("keydown", keyfn);
      // touch: horizontal swipe = move, down swipe = hard drop, tap = rotate
      well.addEventListener("touchstart", function (e) { var t = e.changedTouches[0]; touch = { x: t.clientX, y: t.clientY, t: Date.now() }; }, { passive: true });
      well.addEventListener("touchend", function (e) {
        if (!touch) return; var t = e.changedTouches[0]; var dx = t.clientX - touch.x, dy = t.clientY - touch.y;
        if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && Date.now() - touch.t < 300) { doRotate(); }
        else if (Math.abs(dx) > Math.abs(dy)) { move(dx > 0 ? 1 : -1); }
        else if (dy > 24) { hardDrop(); } else if (dy < -14) { doRotate(); }
        touch = null;
      }, { passive: true });
    }

    function togglePause() { if (!st || !st.alive) return; st.paused = !st.paused; live.textContent = st.paused ? "Paused." : ""; if (!st.paused) loop(); else if (timer) { clearTimeout(timer); timer = null; } }

    /* ---------------- loop ---------------- */
    function dropMs() { return Math.max(120, 820 - (st.level - 1) * 70); }
    function resetTimer() { if (timer) { clearTimeout(timer); timer = null; } if (st && st.alive && !st.paused) loop(); }
    function loop() {
      if (!st.alive || st.paused) return;
      timer = setTimeout(function () {
        if (!st || !st.alive || st.paused) return;
        if (!collides(st.piece, 0, 1)) { st.piece.y += 1; draw(); loop(); }
        else { lock(); }
      }, dropMs());
    }

    function gameOver() {
      st.alive = false; if (timer) { clearTimeout(timer); timer = null; }
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
      if (timer) { clearTimeout(timer); timer = null; }
      shell(); newGame(); draw(); drawMonument(); drawNext();
      live.textContent = "Complete a row to lay the first course of the temple-mountain.";
      loop();
    }

    root.innerHTML = '<div class="rq-loading">Wetting the clay…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The courses could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (st) st.alive = false;
    };
  }
})();
