/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Dominion of the Ancients" (Risk)

   A three-way campaign for the ancient world: you against TWO rival powers —
   the Bronze Empire and the Iron Horde — on a drawn map of landmasses and
   causeways. Classic phases (reinforce, attack with dice, fortify), regional
   bonuses, capital cities, and conquest CARDS you trade in sets for fresh
   hosts. Every land you take reveals a real belief of the people who held it
   (data/risk.json, checked by tools/verify-risk.js). A battle log records the
   clashes. Tap to play; mobile-fit.
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
  // deterministic per-territory PRNG so each land keeps the same organic outline
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h; }
  function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // map: territories (id, name, x, y, region, cap?), edges (land vs sea), region bonuses
  var TERR = [
    { id: "rome", name: "Rome", x: 42, y: 96, region: "aegean" },
    { id: "greece", name: "Greece", x: 86, y: 120, region: "aegean", cap: 1 },
    { id: "hatti", name: "Hatti", x: 126, y: 92, region: "aegean" },
    { id: "canaan", name: "Canaan", x: 138, y: 152, region: "meso" },
    { id: "egypt", name: "Egypt", x: 96, y: 190, region: "nile", cap: 1 },
    { id: "nubia", name: "Nubia", x: 96, y: 250, region: "nile" },
    { id: "arabia", name: "Arabia", x: 162, y: 218, region: "arabia" },
    { id: "assyria", name: "Assyria", x: 174, y: 120, region: "meso" },
    { id: "babylon", name: "Babylon", x: 190, y: 166, region: "meso", cap: 1 },
    { id: "persia", name: "Persia", x: 228, y: 140, region: "iran", cap: 1 },
    { id: "bactria", name: "Bactria", x: 266, y: 106, region: "iran" },
    { id: "indus", name: "Indus", x: 282, y: 180, region: "east" },
    { id: "china", name: "China", x: 320, y: 122, region: "east", cap: 1 }
  ];
  var EDGES = [
    ["rome", "greece", "sea"], ["greece", "hatti", "sea"], ["hatti", "canaan", 0], ["hatti", "assyria", 0], ["hatti", "persia", 0],
    ["canaan", "egypt", 0], ["canaan", "babylon", 0], ["canaan", "arabia", 0], ["egypt", "nubia", 0], ["egypt", "arabia", "sea"],
    ["nubia", "arabia", "sea"], ["arabia", "babylon", 0], ["arabia", "indus", "sea"], ["assyria", "babylon", 0], ["assyria", "persia", 0],
    ["babylon", "persia", 0], ["persia", "bactria", 0], ["persia", "indus", 0], ["bactria", "indus", 0], ["bactria", "china", 0], ["indus", "china", 0]
  ];
  var REGION = {
    nile: { name: "the Nile", bonus: 2, ids: ["egypt", "nubia"], tint: "#3a4a2a" },
    meso: { name: "the Fertile Crescent", bonus: 3, ids: ["canaan", "assyria", "babylon"], tint: "#4a3a24" },
    aegean: { name: "the Aegean", bonus: 3, ids: ["rome", "greece", "hatti"], tint: "#2e3a48" },
    iran: { name: "Iran", bonus: 2, ids: ["persia", "bactria"], tint: "#43324a" },
    east: { name: "the East", bonus: 2, ids: ["indus", "china"], tint: "#4a3040" },
    arabia: { name: "Arabia", bonus: 1, ids: ["arabia"], tint: "#4a3e24" }
  };
  var ADJ = {}; TERR.forEach(function (t) { ADJ[t.id] = []; }); EDGES.forEach(function (e) { ADJ[e[0]].push(e[1]); ADJ[e[1]].push(e[0]); });
  var TMAP = {}; TERR.forEach(function (t) { TMAP[t.id] = t; });
  var SIDES = ["you", "empire", "horde"];
  var SIDE_NAME = { you: "You", empire: "the Bronze Empire", horde: "the Iron Horde" };
  var CARD_TYPES = ["inf", "cav", "art"], CARD_GLYPH = { inf: "⚔", cav: "⚑", art: "☉" };

  AG.register("risk", {
    title: "Dominion of the Ancients",
    subtitle: "A three-way war for the ancient world — outlast two empires, uncover their gods.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch03) || "",
    sourceHref: "chapters/ch03.html", sourceLabel: "Read “Mesopotamia”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var VW = 344, VH = 300;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ink: v("--ink", "#cdbb96") };
    var SIDE_COL = { you: "#e2b04a", empire: "#c65f9a", horde: "#4f97d6", neutral: "#6a6152" };

    var canvas, cx, hudEl, msgEl, btnEl, tradeEl, logEl, live, raf = null, DPR = 1, st = null;
    var factByTerr = {}, BLOB = {};

    // cache an organic outline for each land (province blob + larger landmass blob)
    function blobPts(id, cxp, cyp, r, n) {
      var rng = mulberry(hashStr(id) + Math.round(r)), pts = [];
      for (var i = 0; i < n; i++) { var a = (i / n) * Math.PI * 2, rr = r * (0.78 + rng() * 0.42); pts.push([cxp + Math.cos(a) * rr, cyp + Math.sin(a) * rr]); }
      return pts;
    }
    function pathBlob(pts) {
      cx.beginPath();
      for (var i = 0; i <= pts.length; i++) {
        var a = pts[i % pts.length], b = pts[(i + 1) % pts.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        if (i === 0) cx.moveTo(mx, my); else cx.quadraticCurveTo(a[0], a[1], mx, my);
      }
      cx.closePath();
    }

    function ownedBy(who) { return TERR.filter(function (t) { return st.own[t.id] === who; }); }
    function alive(who) { return ownedBy(who).length > 0; }
    function aliveSides() { return SIDES.filter(alive); }
    function reinforcements(who) {
      var lands = ownedBy(who); if (!lands.length) return 0;
      var n = Math.max(3, Math.floor(lands.length / 3));
      Object.keys(REGION).forEach(function (k) { if (REGION[k].ids.every(function (id) { return st.own[id] === who; })) n += REGION[k].bonus; });
      lands.forEach(function (t) { if (t.cap) n += 1; }); // each capital held = +1
      return n;
    }

    /* ---------------- cards ---------------- */
    function findSet(hand) {
      var c = { inf: 0, cav: 0, art: 0 }; hand.forEach(function (k) { c[k]++; });
      if (c.inf >= 3) return ["inf", "inf", "inf"]; if (c.cav >= 3) return ["cav", "cav", "cav"]; if (c.art >= 3) return ["art", "art", "art"];
      if (c.inf && c.cav && c.art) return ["inf", "cav", "art"];
      return null;
    }
    function removeSet(hand, set) { set.forEach(function (k) { var i = hand.indexOf(k); if (i >= 0) hand.splice(i, 1); }); }
    function tradeBonus() { var seq = [4, 6, 8, 10, 12, 15], n = st.trades; return n < seq.length ? seq[n] : 15 + (n - seq.length + 1) * 5; }
    function awardCard(who) { if (st.cards[who].length < 6) st.cards[who].push(CARD_TYPES[rint(3)]); }
    function tradeCards() {
      if (st.phase !== "reinforce" || st.aiThinking) return;
      var set = findSet(st.cards.you); if (!set) return;
      removeSet(st.cards.you, set); var b = tradeBonus(); st.trades++; st.pool += b;
      st.msg = "Traded a set for " + b + " armies — place " + st.pool + " in all.";
      render();
    }

    function newGame() {
      st = { own: {}, arm: {}, phase: "reinforce", pool: 0, sel: null, over: false, winner: null, seen: {}, collected: [],
        fortified: false, dice: null, aiThinking: false, cards: { you: [], empire: [], horde: [] }, trades: 0, took: false, log: [] };
      var ids = TERR.map(function (t) { return t.id; });
      for (var i = ids.length - 1; i > 0; i--) { var j = rint(i + 1), t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
      ids.forEach(function (id, i) { st.own[id] = SIDES[i % 3]; st.arm[id] = 2 + rint(2); });
      st.pool = reinforcements("you");
      st.msg = "Reinforce: tap your lands to place " + st.pool + " armies.";
      logLine("The world is divided three ways. Bronze Empire and Iron Horde both want it whole.");
    }
    function logLine(s) { st.log.unshift(s); if (st.log.length > 5) st.log.pop(); }

    /* ---------------- combat ---------------- */
    function battle(from, to, silent) {
      var atk = Math.min(3, st.arm[from] - 1), def = Math.min(2, st.arm[to]);
      if (atk < 1) return;
      var ar = [], dr = [], i, k;
      for (i = 0; i < atk; i++) ar.push(roll());
      for (k = 0; k < def; k++) dr.push(roll());
      ar.sort(function (a, b) { return b - a; }); dr.sort(function (a, b) { return b - a; });
      var pairs = Math.min(ar.length, dr.length), al = 0, dl = 0;
      for (var p = 0; p < pairs; p++) { if (ar[p] > dr[p]) dl++; else al++; }
      st.arm[from] -= al; st.arm[to] -= dl;
      if (!silent) st.dice = { from: from, to: to, ar: ar, dr: dr, t: 1.4 };
      var fell = st.arm[to] <= 0;
      logLine(TMAP[to].name + " ⚔ " + TMAP[from].name + ": " + ar.join(",") + " v " + dr.join(",") + (fell ? " — it falls" : " (−" + al + "/−" + dl + ")"));
      if (fell) capture(from, to);
    }
    function capture(from, to) {
      var mover = Math.max(1, Math.min(3, st.arm[from] - 1));
      var taker = st.own[from];
      st.own[to] = taker; st.arm[to] = mover; st.arm[from] -= mover;
      st.took = (taker === st.turnSide);
      if (taker === "you") revealFact(to);
    }
    function revealFact(id) {
      var f = factByTerr[id]; if (!f || st.seen[id]) return; st.seen[id] = 1; st.collected.push(f);
      live.innerHTML = '<span class="ouro-sym">⚑</span> <strong>' + esc(f.label) + " taken.</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>";
    }
    function settleIfOver() {
      var a = aliveSides();
      if (!alive("you")) { st.over = true; st.winner = a[0] || "empire"; return true; }
      if (a.length === 1) { st.over = true; st.winner = a[0]; return true; }
      return false;
    }

    /* ---------------- player interaction ---------------- */
    function terrAt(mx, my) {
      var bestD = 1e9, best = null;
      TERR.forEach(function (t) { var d = Math.hypot(mx - t.x, my - t.y); if (d < 18 && d < bestD) { bestD = d; best = t.id; } });
      return best;
    }
    function onClick(id) {
      if (!id || st.over || st.aiThinking) return;
      st.turnSide = "you";
      if (st.phase === "reinforce") {
        if (st.own[id] === "you" && st.pool > 0) { st.arm[id]++; st.pool--; st.msg = st.pool ? "Reinforce: " + st.pool + " armies to place." : "Reinforced. Tap “To attack”."; }
      } else if (st.phase === "attack") {
        if (st.own[id] === "you" && st.arm[id] > 1) { st.sel = id; st.msg = "Attack from " + TMAP[id].name + " — tap an enemy neighbour."; }
        else if (st.sel && st.own[id] !== "you" && ADJ[st.sel].indexOf(id) >= 0) { battle(st.sel, id); if (st.arm[st.sel] <= 1) st.sel = null; if (settleIfOver()) return finish(); }
      } else if (st.phase === "fortify") {
        if (st.fortified) return;
        if (st.own[id] === "you" && st.arm[id] > 1 && !st.sel) { st.sel = id; st.msg = "Move armies from " + TMAP[id].name + " to a connected land."; }
        else if (st.sel && id !== st.sel && st.own[id] === "you" && ADJ[st.sel].indexOf(id) >= 0) { var mv = st.arm[st.sel] - 1; st.arm[id] += mv; st.arm[st.sel] = 1; st.fortified = true; st.sel = null; st.msg = "Fortified. End the turn when ready."; }
        else if (st.own[id] === "you") { st.sel = id; }
      }
      render();
    }
    function nextPhase() {
      if (st.over || st.aiThinking) return;
      if (st.phase === "reinforce") { st.phase = "attack"; st.sel = null; st.msg = "Attack: tap a land of yours, then an enemy neighbour."; }
      else if (st.phase === "attack") { st.phase = "fortify"; st.sel = null; st.msg = "Fortify: move armies once between two connected lands (optional)."; }
      else if (st.phase === "fortify") { endTurn(); return; }
      render();
    }
    function endTurn() {
      if (st.took) { awardCard("you"); logLine("You seized new ground — a conquest card is yours."); }
      st.sel = null; st.fortified = false; st.took = false;
      aiSequence();
    }

    /* ---------------- AI (each rival empire takes a turn) ---------------- */
    function aiSequence() {
      var queue = SIDES.filter(function (s) { return s !== "you" && alive(s); });
      st.aiThinking = true;
      (function nextAI() {
        if (st.over) { st.aiThinking = false; return finish(); }
        if (!queue.length) { // back to the player
          st.aiThinking = false; st.turnSide = "you"; st.phase = "reinforce"; st.sel = null; st.dice = null;
          st.pool = reinforcements("you"); st.msg = "Your turn. Reinforce: place " + st.pool + " armies.";
          if (settleIfOver()) return finish();
          render(); return;
        }
        var side = queue.shift();
        st.turnSide = side; st.msg = SIDE_NAME[side] + " marches…"; render();
        setTimeout(function () { aiPlay(side); if (settleIfOver()) { st.aiThinking = false; return finish(); } render(); setTimeout(nextAI, 420); }, 560);
      })();
    }
    function aiPlay(side) {
      st.took = false;
      // trade a card set if held
      var set = findSet(st.cards[side]); var pool = reinforcements(side);
      if (set) { removeSet(st.cards[side], set); st.trades++; pool += tradeBonus(); logLine(SIDE_NAME[side] + " trades a set of cards for fresh hosts."); }
      // reinforce onto border lands
      var borders = ownedBy(side).filter(function (t) { return ADJ[t.id].some(function (n) { return st.own[n] !== side; }); });
      if (!borders.length) borders = ownedBy(side);
      for (var i = 0; i < pool; i++) { var b = borders[rint(borders.length)]; st.arm[b.id]++; }
      // attacks: favourable adjacencies, capped
      var guard = 0;
      for (; ;) {
        if (guard++ > 40 || st.over) break;
        var acted = false, mine = ownedBy(side).filter(function (t) { return st.arm[t.id] > 2; });
        for (var m = 0; m < mine.length && !acted; m++) {
          var f = mine[m].id;
          var targets = ADJ[f].filter(function (n) { return st.own[n] !== side && st.arm[f] >= st.arm[n] + 1; });
          if (targets.length) {
            // prefer the weakest neighbour
            targets.sort(function (a, b) { return st.arm[a] - st.arm[b]; });
            battle(f, targets[0], true); acted = true;
            if (settleIfOver()) return;
          }
        }
        if (!acted) break;
      }
      // fortify: shuffle from the safest interior land to a border
      var interior = ownedBy(side).filter(function (t) { return st.arm[t.id] > 1 && ADJ[t.id].every(function (n) { return st.own[n] === side; }); });
      if (interior.length) { var src = interior[0], dst = ADJ[src.id].find(function (n) { return st.own[n] === side; }); if (dst) { st.arm[dst] += st.arm[src.id] - 1; st.arm[src.id] = 1; } }
      if (st.took) awardCard(side);
    }

    /* ---------------- render ---------------- */
    function colOf(id) { return SIDE_COL[st.own[id]] || SIDE_COL.neutral; }
    function render() {
      if (!cx) return;
      cx.clearRect(0, 0, VW, VH);
      // sea
      var g = cx.createRadialGradient(VW * 0.5, VH * 0.42, 20, VW * 0.5, VH * 0.5, VW * 0.8);
      g.addColorStop(0, "#16283a"); g.addColorStop(1, "#0b1118"); cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
      // faint sea grid
      cx.strokeStyle = "rgba(120,160,190,.05)"; cx.lineWidth = 1;
      for (var gx = 0; gx < VW; gx += 24) { cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, VH); cx.stroke(); }
      for (var gy = 0; gy < VH; gy += 24) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(VW, gy); cx.stroke(); }
      // routes (sea = dashed, land drawn under the landmass)
      EDGES.forEach(function (e) {
        var a = TMAP[e[0]], b = TMAP[e[1]];
        cx.strokeStyle = e[2] === "sea" ? "rgba(180,205,225,.30)" : "rgba(120,90,50,.55)";
        cx.lineWidth = e[2] === "sea" ? 1 : 3; cx.setLineDash(e[2] === "sea" ? [3, 3] : []);
        cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
      });
      cx.setLineDash([]);
      // landmass underlayer — big overlapping blobs read as continents
      TERR.forEach(function (t) { var pts = BLOB[t.id + "L"] || (BLOB[t.id + "L"] = blobPts(t.id, t.x, t.y, 25, 9)); pathBlob(pts); cx.fillStyle = "#2c2416"; cx.fill(); });
      TERR.forEach(function (t) { var pts = BLOB[t.id + "L"]; pathBlob(pts); cx.strokeStyle = "rgba(210,180,120,.10)"; cx.lineWidth = 1; cx.stroke(); });
      // provinces — owner-coloured blob with region tint ring + border
      TERR.forEach(function (t) {
        var sel = st.sel === t.id, tgt = st.sel && st.own[t.id] !== st.own[st.sel] && ADJ[st.sel].indexOf(t.id) >= 0 && st.phase === "attack";
        var pts = BLOB[t.id] || (BLOB[t.id] = blobPts(t.id, t.x, t.y, 16, 8));
        cx.save();
        if (sel) { cx.shadowColor = colOf(t.id); cx.shadowBlur = 14; }
        pathBlob(pts); cx.fillStyle = colOf(t.id); cx.fill(); cx.restore();
        pathBlob(pts); cx.strokeStyle = tgt ? "#fff" : sel ? "#fff2cf" : "rgba(12,8,4,.7)"; cx.lineWidth = tgt ? 2.6 : 1.4; cx.stroke();
        // region tint wash on top for grouping
        cx.save(); pathBlob(pts); cx.clip(); cx.globalAlpha = 0.18; cx.fillStyle = REGION[t.region].tint; cx.fillRect(t.x - 20, t.y - 20, 40, 40); cx.restore();
        // capital star
        if (t.cap) { cx.fillStyle = "#fff3d0"; star(t.x, t.y - 15, 5, 5.2, 2.4); }
        // army count + label
        cx.fillStyle = "#160f06"; cx.font = "700 12px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(st.arm[t.id], t.x, t.y + 0.5);
        cx.fillStyle = "rgba(236,230,210,.9)"; cx.font = "600 8px Cinzel, Georgia, serif"; cx.textBaseline = "top";
        cx.strokeStyle = "rgba(0,0,0,.65)"; cx.lineWidth = 2.4; cx.strokeText(t.name, t.x, t.y + 16); cx.fillText(t.name, t.x, t.y + 16);
      });
      // dice popup
      if (st.dice && st.dice.t > 0) {
        var d = st.dice, mx = (TMAP[d.from].x + TMAP[d.to].x) / 2, my = (TMAP[d.from].y + TMAP[d.to].y) / 2 - 22;
        cx.fillStyle = "rgba(10,7,3,.88)"; cx.strokeStyle = COL.gold; cx.lineWidth = 1; roundRect(mx - 36, my - 10, 72, 22, 4); cx.fill(); cx.stroke();
        cx.font = "700 10px Cinzel, Georgia, serif"; cx.textBaseline = "middle";
        cx.fillStyle = colOf(d.from); cx.textAlign = "right"; cx.fillText(d.ar.join(" "), mx - 7, my + 1);
        cx.fillStyle = COL.ink; cx.textAlign = "center"; cx.fillText("⚔", mx, my + 1);
        cx.fillStyle = colOf(d.to); cx.textAlign = "left"; cx.fillText(d.dr.join(" "), mx + 7, my + 1);
      }
      updateHUD();
    }
    function star(x, y, spikes, ro, ri) {
      var rot = -Math.PI / 2, step = Math.PI / spikes; cx.beginPath(); cx.moveTo(x + Math.cos(rot) * ro, y + Math.sin(rot) * ro);
      for (var i = 0; i < spikes; i++) { rot += step; cx.lineTo(x + Math.cos(rot) * ri, y + Math.sin(rot) * ri); rot += step; cx.lineTo(x + Math.cos(rot) * ro, y + Math.sin(rot) * ro); }
      cx.closePath(); cx.fill();
    }
    function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }

    function updateHUD() {
      function side(who) { return '<div class="rk-side rk-' + who + '"><b>' + ownedBy(who).length + '</b><span>' + (who === "you" ? "You" : who === "empire" ? "Bronze" : "Iron") + '</span></div>'; }
      hudEl.innerHTML = side("you") + '<div class="rk-phase">' + (st.phase === "reinforce" ? "Reinforce" + (st.pool ? " · " + st.pool : "") : st.phase === "attack" ? "Attack" : "Fortify") + '</div>' + side("empire") + side("horde");
      msgEl.textContent = st.msg || "";
      // your cards
      var hand = st.cards.you, glyphs = hand.map(function (k) { return CARD_GLYPH[k]; }).join(" ");
      var setReady = st.phase === "reinforce" && !st.aiThinking && !!findSet(hand);
      tradeEl.style.display = hand.length ? "" : "none";
      tradeEl.innerHTML = 'Cards: <b>' + (glyphs || "—") + '</b>' + (setReady ? ' <button class="rq-btn rk-trade" data-a="trade">Trade set (+' + tradeBonus() + ')</button>' : "");
      var tb = tradeEl.querySelector('[data-a="trade"]'); if (tb) tb.addEventListener("click", tradeCards);
      btnEl.textContent = st.phase === "reinforce" ? (st.pool ? "To attack →" : "To attack →") : st.phase === "attack" ? "Done attacking →" : "End turn ⟳";
      btnEl.disabled = !!st.aiThinking || st.over;
      if (logEl) logEl.innerHTML = st.log.map(function (s, i) { return '<li style="opacity:' + (1 - i * 0.16).toFixed(2) + '">' + esc(s) + '</li>'; }).join("");
    }

    /* ---------------- loop (dice fade) ---------------- */
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
          "<p>Outlast the Bronze Empire and the Iron Horde. Reinforce, attack, fortify, trade conquest cards — every land taken reveals its gods.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="rk-hud"></div>' +
        '<div class="rk-stage"><canvas class="rk-canvas" width="' + VW + '" height="' + VH + '" role="img" aria-label="Ancient world map"></canvas></div>' +
        '<p class="rk-msg"></p>' +
        '<div class="rk-cards"></div>' +
        '<ul class="rk-log" aria-live="polite"></ul>' +
        '<p class="ouro-toast rk-toast" aria-live="polite"></p>' +
        '<div class="rk-controls"><button class="rq-btn rk-next" data-a="next"></button></div>' +
        '<p class="rq-note">Tap a land, then a neighbour to attack — the higher dice win. Hold a whole region or a ★capital for extra armies. Trade a set of three cards for a host. Be the last power standing.</p>';
      canvas = root.querySelector(".rk-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = VW * DPR; canvas.height = VH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".rk-hud"); msgEl = root.querySelector(".rk-msg"); live = root.querySelector(".rk-toast");
      btnEl = root.querySelector(".rk-next"); tradeEl = root.querySelector(".rk-cards"); logEl = root.querySelector(".rk-log");
      canvas.addEventListener("click", function (e) { var r = canvas.getBoundingClientRect(); onClick(terrAt((e.clientX - r.left) / r.width * VW, (e.clientY - r.top) / r.height * VH)); });
      btnEl.addEventListener("click", nextPhase);
    }

    function finish() {
      if (raf) cancelAnimationFrame(raf);
      var won = st.winner === "you";
      var recap = st.collected.map(function (f) { return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) + ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>"; }).join("");
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">Dominion · the campaign ends</p>' +
          '<h2 id="' + ctx.titleId + '">' + (won ? "The ancient world is yours" : SIDE_NAME[st.winner].replace(/^the /, "The ") + " prevails") + '</h2>' +
          '<p>' + st.collected.length + ' land' + (st.collected.length === 1 ? "" : "s") + ' and their gods uncovered.</p></div>' +
        (recap ? '<p class="rq-note" style="text-align:center;margin-bottom:.4rem">The dominions you took:</p><ul class="ouro-facts">' + recap + "</ul>" : '<p class="rq-note" style="text-align:center">You took no land this campaign — try holding a region for its bonus.</p>') +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>New campaign</button>' +
          '<a class="game-source" href="chapters/ch03.html">› Read “Mesopotamia”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", boot);
    }

    function boot() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      shell(); newGame(); render();
      live.textContent = "Three powers, one ancient world — place your first armies.";
      raf = requestAnimationFrame(loop);
    }

    // read-only introspection for automated tests (only when a test flag is set)
    if (window.__ARCHIVE_TEST__) window.__riskState = function () { return st ? { own: st.own, arm: st.arm, adj: ADJ, over: st.over, phase: st.phase, ai: st.aiThinking, winner: st.winner, pool: st.pool } : null; };

    root.innerHTML = '<div class="rq-loading">Drawing the borders of the ancient world…</div>';
    loadFacts().then(function (fs2) { fs2.forEach(function (f) { if (f.territory) factByTerr[f.territory] = f; }); boot(); }).catch(function () {
      root.innerHTML = '<p class="game-placeholder">The campaign could not be loaded. Please reload the page.</p>';
    });

    return function cleanup() { if (raf) cancelAnimationFrame(raf); if (st) st.over = true; };
  }
})();
