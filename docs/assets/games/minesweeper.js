/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Excavation" (Minesweeper)

   A dig, not a minefield: clear the buried grid without striking a hazard
   (a collapse, a curse, a flooded chamber). Numbers count the dangers that
   border a square; flag each one you deduce, and every hazard correctly
   marked turns up a real archaeological find — each grounded in a chapter
   (data/minesweeper.json, checked by tools/verify-minesweeper.js).
   DOM grid: tap to dig, flag-mode or right-click / long-press to mark. It
   scales to the screen and zooms cleanly on mobile.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/minesweeper.json";
    return "assets/games/data/minesweeper.json";
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

  var LEVELS = {
    novice: { cols: 9, rows: 9, mines: 10, name: "Novice dig" },
    adept: { cols: 12, rows: 12, mines: 24, name: "Adept dig" },
    master: { cols: 14, rows: 14, mines: 40, name: "Master dig" }
  };

  AG.register("minesweeper", {
    title: "The Excavation",
    subtitle: "Clear the buried grid without striking a hazard — each mark you deduce turns up a find.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch03) || "",
    sourceHref: "chapters/ch03.html", sourceLabel: "Read “Mesopotamia”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var level = "novice", st = null, gridEl, hudEl, live, flagBtn, timerEl, mineEl;
    var flagMode = false, timer = null, seconds = 0, best = AG.bestScore("minesweeper");

    function conf() { return LEVELS[level]; }
    function newGame() {
      var c = conf();
      st = { cols: c.cols, rows: c.rows, mines: c.mines, cells: [], started: false, over: false, won: false,
        revealed: 0, flags: 0, collected: [], seen: {} };
      for (var i = 0; i < c.cols * c.rows; i++) st.cells.push({ mine: false, adj: 0, open: false, flag: false, found: false });
      seconds = 0; stopTimer();
    }
    function idx(x, y) { return y * st.cols + x; }
    function inb(x, y) { return x >= 0 && y >= 0 && x < st.cols && y < st.rows; }
    function neighbors(x, y) { var o = []; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if ((dx || dy) && inb(x + dx, y + dy)) o.push([x + dx, y + dy]); return o; }

    function placeMines(safeX, safeY) {
      var c = st, forbidden = {}; forbidden[idx(safeX, safeY)] = 1;
      neighbors(safeX, safeY).forEach(function (n) { forbidden[idx(n[0], n[1])] = 1; });
      var placed = 0, guard = 0;
      while (placed < c.mines && guard++ < 9999) {
        var p = Math.floor(Math.random() * c.cells.length);
        if (c.cells[p].mine || forbidden[p]) continue;
        c.cells[p].mine = true; placed++;
      }
      for (var y = 0; y < c.rows; y++) for (var x = 0; x < c.cols; x++) {
        if (c.cells[idx(x, y)].mine) continue;
        var n = 0; neighbors(x, y).forEach(function (nb) { if (c.cells[idx(nb[0], nb[1])].mine) n++; });
        c.cells[idx(x, y)].adj = n;
      }
      c.started = true; startTimer();
    }

    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">The Excavation</h2>' +
          "<p>Dig out the whole site without striking a hazard. Numbers count the dangers touching a square.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="ms-bar"><div class="ms-stat"><b id="ms-mines">0</b><span>Hazards left</span></div>' +
          '<button class="rq-btn ms-level" data-a="level">' + conf().name + '</button>' +
          '<div class="ms-stat"><b id="ms-timer">0</b><span>Seconds</span></div></div>' +
        '<button class="rq-btn ms-flag" data-a="flag" aria-pressed="false">⚑ Flag mode: off</button>' +
        '<div class="ms-grid-wrap"><div class="ms-grid" role="grid" aria-label="Excavation grid"></div></div>' +
        '<p class="ouro-toast ms-toast" aria-live="polite"></p>' +
        '<p class="rq-note">Tap to dig. Turn on flag mode (or right-click / long-press) to mark a hazard. Mark one correctly to turn up a find.</p>';
      gridEl = root.querySelector(".ms-grid"); live = root.querySelector(".ms-toast");
      flagBtn = root.querySelector('[data-a="flag"]'); timerEl = root.querySelector("#ms-timer"); mineEl = root.querySelector("#ms-mines");
      gridEl.style.setProperty("--cols", st.cols);
      root.querySelector('[data-a="level"]').addEventListener("click", cycleLevel);
      flagBtn.addEventListener("click", function () { flagMode = !flagMode; flagBtn.setAttribute("aria-pressed", flagMode ? "true" : "false"); flagBtn.textContent = "⚑ Flag mode: " + (flagMode ? "on" : "off"); flagBtn.classList.toggle("is-on", flagMode); });
      buildGrid();
      updateHUD();
    }
    function cycleLevel() { level = level === "novice" ? "adept" : level === "adept" ? "master" : "novice"; boot(); }

    function buildGrid() {
      gridEl.innerHTML = "";
      for (var y = 0; y < st.rows; y++) for (var x = 0; x < st.cols; x++) {
        var b = document.createElement("button");
        b.className = "ms-cell"; b.setAttribute("data-x", x); b.setAttribute("data-y", y);
        b.setAttribute("aria-label", "Row " + (y + 1) + " column " + (x + 1));
        b.addEventListener("click", onCell);
        b.addEventListener("contextmenu", function (e) { e.preventDefault(); toggleFlag(+this.getAttribute("data-x"), +this.getAttribute("data-y")); });
        attachLongPress(b);
        gridEl.appendChild(b);
      }
    }
    function attachLongPress(b) {
      var t = null;
      b.addEventListener("touchstart", function () { t = setTimeout(function () { t = null; toggleFlag(+b.getAttribute("data-x"), +b.getAttribute("data-y")); if (navigator.vibrate) navigator.vibrate(15); }, 380); }, { passive: true });
      b.addEventListener("touchend", function (e) { if (t) { clearTimeout(t); t = null; } else { e.preventDefault(); } });
      b.addEventListener("touchmove", function () { if (t) { clearTimeout(t); t = null; } });
    }

    function onCell(e) {
      var x = +this.getAttribute("data-x"), y = +this.getAttribute("data-y");
      if (flagMode) return toggleFlag(x, y);
      dig(x, y);
    }
    function toggleFlag(x, y) {
      if (st.over) return; var c = st.cells[idx(x, y)];
      if (c.open) return;
      c.flag = !c.flag; st.flags += c.flag ? 1 : -1;
      if (c.flag && c.mine && !c.found) { c.found = true; revealFact(); }
      paint(x, y); updateHUD();
    }
    function dig(x, y) {
      if (st.over) return; var c = st.cells[idx(x, y)];
      if (c.flag || c.open) return;
      if (!st.started) placeMines(x, y);
      if (c.mine) return loseAt(x, y);
      flood(x, y);
      updateHUD(); checkWin();
    }
    function flood(x, y) {
      var stack = [[x, y]];
      while (stack.length) {
        var p = stack.pop(), cx = p[0], cy = p[1], cell = st.cells[idx(cx, cy)];
        if (cell.open || cell.flag) continue;
        cell.open = true; st.revealed++; paint(cx, cy);
        if (cell.adj === 0) neighbors(cx, cy).forEach(function (n) { var nc = st.cells[idx(n[0], n[1])]; if (!nc.open && !nc.mine) stack.push(n); });
      }
    }

    function revealFact() {
      if (!facts || !facts.length) return;
      var pool = facts.filter(function (f) { return !st.seen[f.label]; });
      if (!pool.length) return; // one per distinct find
      var f = pool[Math.floor(Math.random() * pool.length)];
      st.seen[f.label] = 1; st.collected.push(f);
      live.innerHTML = '<span class="ouro-sym">⛏</span> <strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }

    function cellBtn(x, y) { return gridEl.children[idx(x, y)]; }
    function paint(x, y) {
      var c = st.cells[idx(x, y)], b = cellBtn(x, y);
      b.className = "ms-cell" + (c.open ? " is-open" : "") + (c.flag ? " is-flag" : "");
      if (c.open) {
        if (c.mine) { b.innerHTML = "✸"; b.classList.add("is-mine"); }
        else if (c.adj > 0) { b.innerHTML = c.adj; b.setAttribute("data-n", c.adj); }
        else b.innerHTML = "";
      } else { b.innerHTML = c.flag ? "⚑" : ""; }
    }
    function paintAll() { for (var y = 0; y < st.rows; y++) for (var x = 0; x < st.cols; x++) paint(x, y); }
    function updateHUD() { mineEl.textContent = Math.max(0, st.mines - st.flags); timerEl.textContent = seconds; }

    function startTimer() { stopTimer(); timer = setInterval(function () { seconds++; if (timerEl) timerEl.textContent = seconds; }, 1000); }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    function checkWin() {
      if (st.revealed >= st.cols * st.rows - st.mines) { st.over = true; st.won = true; stopTimer(); endScreen(); }
    }
    function loseAt(x, y) {
      st.over = true; stopTimer();
      // reveal all mines
      for (var i = 0; i < st.cells.length; i++) { var c = st.cells[i]; if (c.mine) { c.open = true; } }
      paintAll();
      cellBtn(x, y).classList.add("is-blast");
      endScreen();
    }

    function endScreen() {
      var recap = st.collected.map(function (f) {
        return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) +
          ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>";
      }).join("");
      var head;
      if (st.won) {
        var score = Math.max(1, st.mines * 100 - seconds);
        var nb = score > best; if (nb) { best = score; }
        AG.addHighScore("minesweeper", { score: score });
        head = '<p class="eyebrow">The Excavation · the site is cleared</p><h2 id="' + ctx.titleId + '">Site fully excavated</h2>' +
          '<p>' + conf().name + ' · ' + seconds + 's · ' + st.collected.length + ' find' + (st.collected.length === 1 ? "" : "s") + (nb ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p>";
      } else {
        head = '<p class="eyebrow">The Excavation · the dig collapsed</p><h2 id="' + ctx.titleId + '">You struck a hazard</h2>' +
          '<p>The trench caved in — but you still logged ' + st.collected.length + ' find' + (st.collected.length === 1 ? "" : "s") + ".</p>";
      }
      root.innerHTML =
        '<div class="game-head">' + head + "</div>" +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">What you unearthed:</p><ul class="ouro-facts">' + recap + "</ul>"
               : '<p class="rq-note" style="text-align:center">No finds logged this dig — mark a hazard correctly to turn one up.</p>') +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>New dig</button>' +
          '<a class="game-source" href="chapters/ch03.html">› Read “Mesopotamia”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    function boot() { stopTimer(); newGame(); shell(); }

    root.innerHTML = '<div class="rq-loading">Clearing the topsoil…</div>';
    loadFacts().then(boot).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The dig could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() { stopTimer(); };
  }
})();
