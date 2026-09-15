/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Dominion of the Ancients" (Risk)

   A campaign for the ancient world: hold your lands, mass your hosts, and
   conquer the kingdoms of the Bronze and Iron Ages against the rival Empire.
   Classic three-phase turns — reinforce, attack (dice combat), fortify —
   and every land you take reveals a real belief of the people who held it
   (data/risk.json, checked by tools/verify-risk.js). Tap to play; mobile-fit.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/risk.json";
    return "assets/games/data/risk.json";
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
  function rint(n) { return (Math.random() * n) | 0; }
  function roll() { return 1 + rint(6); }

  // map: territories (id, name, x, y, region), edges, region bonuses
  var TERR = [
    { id: "rome", name: "Rome", x: 40, y: 92, region: "aegean" },
    { id: "greece", name: "Greece", x: 82, y: 116, region: "aegean" },
    { id: "hatti", name: "Hatti", x: 120, y: 92, region: "aegean" },
    { id: "canaan", name: "Canaan", x: 132, y: 150, region: "meso" },
    { id: "egypt", name: "Egypt", x: 92, y: 186, region: "nile" },
    { id: "nubia", name: "Nubia", x: 92, y: 246, region: "nile" },
    { id: "arabia", name: "Arabia", x: 156, y: 214, region: "arabia" },
    { id: "assyria", name: "Assyria", x: 168, y: 118, region: "meso" },
    { id: "babylon", name: "Babylon", x: 182, y: 162, region: "meso" },
    { id: "persia", name: "Persia", x: 220, y: 138, region: "iran" },
    { id: "bactria", name: "Bactria", x: 258, y: 106, region: "iran" },
    { id: "indus", name: "Indus", x: 274, y: 176, region: "east" },
    { id: "china", name: "China", x: 312, y: 120, region: "east" }
  ];
  var EDGES = [
    ["rome", "greece"], ["greece", "hatti"], ["hatti", "canaan"], ["hatti", "assyria"], ["hatti", "persia"],
    ["canaan", "egypt"], ["canaan", "babylon"], ["canaan", "arabia"], ["egypt", "nubia"], ["egypt", "arabia"],
    ["nubia", "arabia"], ["arabia", "babylon"], ["arabia", "indus"], ["assyria", "babylon"], ["assyria", "persia"],
    ["babylon", "persia"], ["persia", "bactria"], ["persia", "indus"], ["bactria", "indus"], ["bactria", "china"], ["indus", "china"]
  ];
  var REGION = { nile: { name: "the Nile", bonus: 2, ids: ["egypt", "nubia"] }, meso: { name: "the Fertile Crescent", bonus: 3, ids: ["canaan", "assyria", "babylon"] }, aegean: { name: "the Aegean", bonus: 3, ids: ["rome", "greece", "hatti"] }, iran: { name: "Iran", bonus: 2, ids: ["persia", "bactria"] }, east: { name: "the East", bonus: 2, ids: ["indus", "china"] }, arabia: { name: "Arabia", bonus: 1, ids: ["arabia"] } };
  var ADJ = {}; TERR.forEach(function (t) { ADJ[t.id] = []; }); EDGES.forEach(function (e) { ADJ[e[0]].push(e[1]); ADJ[e[1]].push(e[0]); });
  var TMAP = {}; TERR.forEach(function (t) { TMAP[t.id] = t; });

  AG.register("risk", {
    title: "Dominion of the Ancients",
    subtitle: "A campaign for the ancient world — conquer the kingdoms, uncover their gods.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch03) || "",
    sourceHref: "chapters/ch03.html", sourceLabel: "Read “Mesopotamia”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var VW = 340, VH = 300;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ink: v("--ink", "#cdbb96") };
    var YOU = "#e2b04a", FOE = "#b45a8a", NEU = "#6a6152";

    var canvas, cx, hudEl, msgEl, btnEl, live, raf = null, DPR = 1, st = null;
    var factByTerr = {};

    function ownedBy(who) { return TERR.filter(function (t) { return st.own[t.id] === who; }); }
    function reinforcements(who) {
      var n = Math.max(3, Math.floor(ownedBy(who).length / 3));
      Object.keys(REGION).forEach(function (k) { if (REGION[k].ids.every(function (id) { return st.own[id] === who; })) n += REGION[k].bonus; });
      return n;
    }

    function newGame() {
      st = { own: {}, arm: {}, phase: "reinforce", pool: 0, sel: null, over: false, winner: null, seen: {}, collected: [], fortified: false, dice: null, flash: 0 };
      // deal territories alternately from a shuffled order
      var ids = TERR.map(function (t) { return t.id; });
      for (var i = ids.length - 1; i > 0; i--) { var j = rint(i + 1), t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
      ids.forEach(function (id, i) { st.own[id] = i % 2 === 0 ? "you" : "foe"; st.arm[id] = 2 + rint(2); });
      st.pool = reinforcements("you");
      st.msg = "Reinforce: tap your lands to place " + st.pool + " armies.";
    }

    /* ---------------- combat ---------------- */
    function battle(from, to) {
      var atk = Math.min(3, st.arm[from] - 1), def = Math.min(2, st.arm[to]);
      if (atk < 1) return;
      var ar = [], dr = [];
      for (var i = 0; i < atk; i++) ar.push(roll());
      for (var k = 0; k < def; k++) dr.push(roll());
      ar.sort(function (a, b) { return b - a; }); dr.sort(function (a, b) { return b - a; });
      var pairs = Math.min(ar.length, dr.length), al = 0, dl = 0;
      for (var p = 0; p < pairs; p++) { if (ar[p] > dr[p]) dl++; else al++; }
      st.arm[from] -= al; st.arm[to] -= dl;
      st.dice = { from: from, to: to, ar: ar, dr: dr, t: 1.4 };
      if (st.arm[to] <= 0) capture(from, to);
    }
    function capture(from, to) {
      var mover = Math.min(st.arm[from] - 1, Math.max(1, Math.min(3, st.arm[from] - 1)));
      st.own[to] = st.own[from]; st.arm[to] = mover; st.arm[from] -= mover;
      if (st.own[to] === "you") revealFact(to);
      checkWin();
    }
    function revealFact(id) {
      var f = factByTerr[id]; if (!f || st.seen[id]) return; st.seen[id] = 1; st.collected.push(f);
      live.innerHTML = '<span class="ouro-sym">⚑</span> <strong>' + esc(f.label) + " taken.</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }
    function checkWin() {
      var you = ownedBy("you").length, foe = ownedBy("foe").length;
      if (foe === 0) { st.over = true; st.winner = "you"; }
      else if (you === 0) { st.over = true; st.winner = "foe"; }
    }

    /* ---------------- player interaction ---------------- */
    function terrAt(mx, my) {
      var bestD = 1e9, best = null;
      TERR.forEach(function (t) { var d = Math.hypot(mx - t.x, my - t.y); if (d < 20 && d < bestD) { bestD = d; best = t.id; } });
      return best;
    }
    function onClick(id) {
      if (!id || st.over || st.aiThinking) return;
      if (st.phase === "reinforce") {
        if (st.own[id] === "you" && st.pool > 0) { st.arm[id]++; st.pool--; if (st.pool === 0) { st.phase = "attack"; st.msg = "Attack: tap a land of yours, then an enemy neighbour."; } else st.msg = "Reinforce: " + st.pool + " armies to place."; }
      } else if (st.phase === "attack") {
        if (st.own[id] === "you" && st.arm[id] > 1) { st.sel = id; st.msg = "Attack from " + TMAP[id].name + " — tap an enemy neighbour."; }
        else if (st.sel && st.own[id] === "foe" && ADJ[st.sel].indexOf(id) >= 0) { battle(st.sel, id); if (st.arm[st.sel] <= 1) st.sel = null; }
      } else if (st.phase === "fortify") {
        if (st.fortified) return;
        if (st.own[id] === "you" && st.arm[id] > 1 && !st.sel) { st.sel = id; st.msg = "Move armies from " + TMAP[id].name + " to a connected land."; }
        else if (st.sel && id !== st.sel && st.own[id] === "you" && ADJ[st.sel].indexOf(id) >= 0) { var mv = st.arm[st.sel] - 1; st.arm[id] += mv; st.arm[st.sel] = 1; st.fortified = true; st.sel = null; st.msg = "Fortified. End the turn when ready."; }
        else if (st.own[id] === "you") { st.sel = id; }
      }
      if (st.over) return finish();
      render();
    }
    function nextPhase() {
      if (st.over || st.aiThinking) return;
      if (st.phase === "reinforce") { st.phase = "attack"; st.sel = null; st.msg = "Attack: tap a land of yours, then an enemy neighbour."; }
      else if (st.phase === "attack") { st.phase = "fortify"; st.sel = null; st.msg = "Fortify: move armies once between two connected lands (optional)."; }
      else if (st.phase === "fortify") { endTurn(); }
      render();
    }
    function endTurn() { st.sel = null; st.fortified = false; aiTurn(); }

    /* ---------------- AI ---------------- */
    function aiTurn() {
      st.aiThinking = true; st.msg = "The Empire moves…"; render();
      setTimeout(function () {
        // reinforce onto the strongest border
        var pool = reinforcements("foe");
        var borders = ownedBy("foe").filter(function (t) { return ADJ[t.id].some(function (n) { return st.own[n] === "you"; }); });
        if (!borders.length) borders = ownedBy("foe");
        for (var i = 0; i < pool; i++) { var b = borders[rint(borders.length)]; st.arm[b.id]++; }
        // attacks: favourable adjacencies, capped
        var guard = 0;
        for (;;) {
          if (guard++ > 40 || st.over) break;
          var acted = false;
          var mine = ownedBy("foe").filter(function (t) { return st.arm[t.id] > 2; });
          for (var m = 0; m < mine.length && !acted; m++) {
            var f = mine[m].id;
            var targets = ADJ[f].filter(function (n) { return st.own[n] === "you" && st.arm[f] >= st.arm[n] + 2; });
            if (targets.length) { battle(f, targets[rint(targets.length)]); acted = true; }
          }
          if (!acted) break;
        }
        checkWin();
        if (st.over) { st.aiThinking = false; return finish(); }
        // begin player's turn
        st.aiThinking = false; st.phase = "reinforce"; st.sel = null; st.dice = null;
        st.pool = reinforcements("you"); st.msg = "Reinforce: place " + st.pool + " armies.";
        render();
      }, 700);
    }

    /* ---------------- render ---------------- */
    function colOf(id) { return st.own[id] === "you" ? YOU : st.own[id] === "foe" ? FOE : NEU; }
    function render() {
      if (!cx) return;
      cx.clearRect(0, 0, VW, VH);
      var g = cx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, "#1b1b26"); g.addColorStop(1, "#120d10"); cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
      // edges
      cx.strokeStyle = "rgba(199,154,84,.28)"; cx.lineWidth = 1;
      EDGES.forEach(function (e) { var a = TMAP[e[0]], b = TMAP[e[1]]; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); });
      // territories
      TERR.forEach(function (t) {
        var sel = st.sel === t.id, tgt = st.sel && st.own[t.id] === "foe" && ADJ[st.sel].indexOf(t.id) >= 0 && st.phase === "attack";
        cx.save();
        if (sel) { cx.shadowColor = colOf(t.id); cx.shadowBlur = 14; }
        cx.fillStyle = colOf(t.id); cx.beginPath(); cx.arc(t.x, t.y, 13, 0, 7); cx.fill(); cx.restore();
        cx.strokeStyle = tgt ? "#fff" : sel ? "#fff2cf" : "rgba(0,0,0,.5)"; cx.lineWidth = tgt ? 2.4 : 1.4; cx.beginPath(); cx.arc(t.x, t.y, 13, 0, 7); cx.stroke();
        cx.fillStyle = "#1a120a"; cx.font = "700 12px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(st.arm[t.id], t.x, t.y + 0.5);
        cx.fillStyle = "rgba(231,225,205,.82)"; cx.font = "600 8px Cinzel, Georgia, serif"; cx.textBaseline = "top"; cx.fillText(t.name, t.x, t.y + 15);
      });
      // dice popup
      if (st.dice && st.dice.t > 0) {
        var d = st.dice, mx = (TMAP[d.from].x + TMAP[d.to].x) / 2, my = (TMAP[d.from].y + TMAP[d.to].y) / 2 - 20;
        cx.fillStyle = "rgba(10,7,3,.85)"; cx.strokeStyle = COL.gold; cx.lineWidth = 1; roundRect(mx - 34, my - 10, 68, 22, 4); cx.fill(); cx.stroke();
        cx.font = "700 10px Cinzel, Georgia, serif"; cx.textBaseline = "middle";
        cx.fillStyle = YOU; cx.textAlign = "right"; cx.fillText(d.ar.join(" "), mx - 6, my + 1);
        cx.fillStyle = COL.ink; cx.textAlign = "center"; cx.fillText("⚔", mx, my + 1);
        cx.fillStyle = FOE; cx.textAlign = "left"; cx.fillText(d.dr.join(" "), mx + 6, my + 1);
      }
      updateHUD();
    }
    function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
    function updateHUD() {
      var you = ownedBy("you").length, foe = ownedBy("foe").length;
      hudEl.innerHTML = '<div class="rk-side rk-you"><b>' + you + '</b><span>Your lands</span></div>' +
        '<div class="rk-phase">' + (st.phase === "reinforce" ? "Reinforce" + (st.pool ? " · " + st.pool : "") : st.phase === "attack" ? "Attack" : "Fortify") + '</div>' +
        '<div class="rk-side rk-foe"><b>' + foe + '</b><span>The Empire</span></div>';
      msgEl.textContent = st.msg || "";
      btnEl.textContent = st.phase === "reinforce" ? (st.pool ? "Skip to attack" : "To attack →") : st.phase === "attack" ? "Done attacking →" : "End turn ⟳";
      btnEl.disabled = !!st.aiThinking;
    }

    /* ---------------- loop (for dice fade) ---------------- */
    function loop() {
      if (!st || st.over) return;
      if (st.dice && st.dice.t > 0) { st.dice.t -= 0.016; if (st.dice.t <= 0) st.dice = null; render(); }
      raf = requestAnimationFrame(loop);
    }

    /* ---------------- shell ---------------- */
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.2rem">Dominion of the Ancients</h2>' +
          "<p>Conquer the kingdoms of the ancient world. Reinforce, attack, fortify — every land taken reveals its gods.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="rk-hud"></div>' +
        '<div class="rk-stage"><canvas class="rk-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Ancient world map"></canvas></div>' +
        '<p class="rk-msg"></p>' +
        '<p class="ouro-toast rk-toast" aria-live="polite"></p>' +
        '<div class="rk-controls"><button class="rq-btn rk-next" data-a="next"></button></div>' +
        '<p class="rq-note">Tap a land, then a neighbour. Roll higher on the dice to win each clash. Take every land to win.</p>';
      canvas = root.querySelector(".rk-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".rk-hud"); msgEl = root.querySelector(".rk-msg"); live = root.querySelector(".rk-toast"); btnEl = root.querySelector(".rk-next");
      canvas.addEventListener("click", function (e) { var r = canvas.getBoundingClientRect(); onClick(terrAt((e.clientX - r.left) / r.width * VW, (e.clientY - r.top) / r.height * VH)); });
      btnEl.addEventListener("click", nextPhase);
    }

    function finish() {
      if (raf) cancelAnimationFrame(raf);
      var won = st.winner === "you";
      var recap = st.collected.map(function (f) { return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) + ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>"; }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Dominion · the campaign ends</p>' +
          '<h2 id="' + ctx.titleId + '">' + (won ? "The ancient world is yours" : "The Empire prevails") + '</h2>' +
          '<p>' + st.collected.length + ' land' + (st.collected.length === 1 ? "" : "s") + ' and their gods uncovered.</p></div>' +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The dominions you took:</p><ul class="ouro-facts">' + recap + "</ul>" : "") +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>New campaign</button>' +
          '<a class="game-source" href="chapters/ch03.html">› Read “Mesopotamia”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); render();
      live.textContent = "Divide of the ancient world drawn — place your first armies.";
      raf = requestAnimationFrame(loop);
    }

    root.innerHTML = '<div class="rq-loading">Drawing the borders of the ancient world…</div>';
    loadFacts().then(function (fs2) { fs2.forEach(function (f) { if (f.territory) factByTerr[f.territory] = f; }); boot(); }).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The campaign could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() { if (raf) cancelAnimationFrame(raf); if (st) st.over = true; };
  }
})();
