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
    var canvas, cxr, live, scoreEl, bestEl, factToast;
    var st, timer = null, keyfn = null, touch = null, running = false;
    var best = AG.bestScore("ouroboros");

    function newGame() {
      st = { snake: [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
        food: null, score: 0, speed: 160, alive: true, paused: false, collected: [], seen: {} };
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
        '<div class="game-scorebar"><div class="stat"><b id="ouro-score">0</b><span>Length gained</span></div>' +
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
      live = root.querySelector(".ouro-toast");
      scoreEl = root.querySelector("#ouro-score");
      bestEl = root.querySelector("#ouro-best");
      wireControls();
    }

    function setDir(dx, dy) {
      if (!st || !st.alive) return;
      if (dx === -st.dir.x && dy === -st.dir.y) return; // no reversing
      st.nextDir = { x: dx, y: dy };
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
      st.dir = st.nextDir;
      var head = st.snake[0];
      var nx = (head.x + st.dir.x + GRID) % GRID;   // wrap around
      var ny = (head.y + st.dir.y + GRID) % GRID;
      // self collision
      if (st.snake.some(function (s, i) { return i < st.snake.length - 1 && s.x === nx && s.y === ny; })) { return gameOver(); }
      st.snake.unshift({ x: nx, y: ny });
      if (st.food && nx === st.food.x && ny === st.food.y) {
        st.score += 1;
        st.speed = Math.max(80, st.speed - 5);
        var f = st.food.fact; st.seen[f.label] = 1;
        if (!st.collected.some(function (c) { return c.label === f.label; })) st.collected.push(f);
        scoreEl.textContent = st.score;
        showFact(f);
        placeFood();
      } else {
        st.snake.pop();
      }
      draw();
    }

    function showFact(f) {
      live.innerHTML = '<span class="ouro-sym">✵</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    function draw() {
      cxr.clearRect(0, 0, W, W);
      cxr.fillStyle = COL.ground; cxr.fillRect(0, 0, W, W);
      // subtle grid
      cxr.strokeStyle = COL.line; cxr.lineWidth = 1;
      for (var i = 1; i < GRID; i++) { cxr.beginPath(); cxr.moveTo(i * CELL, 0); cxr.lineTo(i * CELL, W); cxr.stroke(); cxr.beginPath(); cxr.moveTo(0, i * CELL); cxr.lineTo(W, i * CELL); cxr.stroke(); }
      // food: a ringed symbol token
      if (st.food) {
        var fx = st.food.x * CELL + CELL / 2, fy = st.food.y * CELL + CELL / 2;
        cxr.strokeStyle = COL.goldB; cxr.lineWidth = 2;
        cxr.beginPath(); cxr.arc(fx, fy, CELL * 0.32, 0, Math.PI * 2); cxr.stroke();
        cxr.fillStyle = COL.goldB; cxr.beginPath(); cxr.arc(fx, fy, CELL * 0.12, 0, Math.PI * 2); cxr.fill();
      }
      // snake
      st.snake.forEach(function (s, idx) {
        cxr.fillStyle = idx === 0 ? COL.goldB : COL.gold;
        var pad = idx === 0 ? 2 : 3;
        roundRect(cxr, s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
        cxr.fill();
      });
    }
    function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

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
      if (keyfn) document.removeEventListener("keydown", keyfn);
      if (st) st.alive = false;
    };
  }
})();
