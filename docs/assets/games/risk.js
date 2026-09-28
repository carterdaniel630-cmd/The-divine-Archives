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
  // the seas and rivers in schematic position (map units; edge points sit past the frame)
  var SEAS = [
    [[-24, 116], [28, 121], [50, 111], [66, 117], [72, 134], [100, 137], [108, 127], [122, 121], [133, 131], [129, 166], [110, 171], [80, 167], [50, 172], [20, 167], [-24, 164]], // Mediterranean
    [[100, 124], [98, 112], [104, 102], [112, 100], [117, 108], [114, 118], [110, 130], [104, 134]],                                                                          // Aegean
    [[92, 48], [112, 40], [146, 42], [160, 54], [146, 66], [118, 70], [96, 62]],                                                                                              // Black Sea
    [[208, 70], [220, 66], [228, 82], [226, 110], [214, 118], [208, 100]],                                                                                                     // Caspian
    [[118, 176], [127, 174], [146, 214], [158, 262], [150, 266], [138, 222]],                                                                                                  // Red Sea
    [[198, 184], [208, 180], [228, 198], [240, 214], [232, 220], [214, 204]],                                                                                                  // Persian Gulf
    [[150, 324], [166, 276], [190, 262], [214, 244], [236, 226], [252, 222], [270, 214], [288, 226], [312, 214], [368, 206], [368, 324]]                                         // Arabian Sea
  ];
  // the Nile, the Tigris and Euphrates, the Indus, the Yellow River
  var RIV = [[[102, 300], [98, 262], [94, 226], [98, 196], [104, 172]], [[150, 104], [168, 128], [186, 158], [204, 184]], [[176, 98], [196, 128], [206, 160], [208, 182]],
    [[300, 100], [292, 140], [286, 184], [282, 216]], [[344, 86], [326, 96], [314, 104]]];
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
    var factByTerr = {};

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
      var fell = st.arm[to] <= 0;
      if (!silent) st.dice = { from: from, to: to, ar: ar, dr: dr, t: 1.6, atkCol: colOf(from), defCol: colOf(to) };
      logLine(TMAP[to].name + " ⚔ " + TMAP[from].name + ": " + ar.join(",") + " v " + dr.join(",") + (fell ? " — it falls" : " (−" + al + "/−" + dl + ")"));
      if (fell) capture(from, to);
    }
    function capture(from, to) {
      var mover = Math.max(1, Math.min(3, st.arm[from] - 1));
      var taker = st.own[from];
      st.own[to] = taker; st.arm[to] = mover; st.arm[from] -= mover;
      (st.flash || (st.flash = {}))[to] = 1;
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
      // a tap anywhere inside a province picks it; near a token out at sea, the nearest one
      if (IDG) { var gx = Math.round(mx * G), gy = Math.round(my * G); if (gx >= 0 && gy >= 0 && gx < GW && gy < GH && IDG[gy * GW + gx] >= 0) return TERR[IDG[gy * GW + gx]].id; }
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

    /* ---------------- render ----------------
       An engraved, hand-coloured atlas: a territory grid (every land cell belongs to its
       nearest province, with noisy borders), a wash of the owner's colour that deepens along
       each frontier, heavy lines where two lands touch but do not connect, roads and
       sea-lanes, shield tokens, walled capitals, pip dice and an attack arrow. */
    var G = 2, GW = VW * G, GH = VH * G;       // territory grid: two cells per map unit
    var IDG = null, BOX = [], mapBg = null, polLines = null, routesCv = null, fillCv = null, fillSig = "", TINT = {};
    var ROUTE = [], last = 0, frameN = 0;
    function h2(i, j, seed) { var n = (i * 374761393 + j * 668265263 + seed * 1442695041) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
    function noise(x, y, s, seed) {
      var fx = x / s, fy = y / s, i = Math.floor(fx), j = Math.floor(fy), u = fx - i, w = fy - j; u = u * u * (3 - 2 * u); w = w * w * (3 - 2 * w);
      var a = h2(i, j, seed), b = h2(i + 1, j, seed), c = h2(i, j + 1, seed), d = h2(i + 1, j + 1, seed);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    }
    function polyOn(m, pts) { m.beginPath(); m.moveTo(pts[0][0], pts[0][1]); for (var j = 1; j < pts.length; j++) { var a = pts[j - 1], b = pts[j]; m.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } m.closePath(); }
    function mk(w, h) { var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
    function isSea(x, y) { var gx = Math.round(x * G), gy = Math.round(y * G); if (gx < 0 || gy < 0 || gx >= GW || gy >= GH) return true; return IDG[gy * GW + gx] === -1; }

    // -1 sea, -2 unclaimed land, otherwise the index of the province in TERR
    function buildGrid() {
      var sc = mk(GW, GH), sm = sc.getContext("2d"); sm.scale(G, G); sm.fillStyle = "#000";
      SEAS.forEach(function (p) { polyOn(sm, p); sm.fill(); });
      var sea = sm.getImageData(0, 0, GW, GH).data, n = GW * GH, id = new Int8Array(n), x, y, i, k;
      var WGT = { arabia: 0.86, nubia: 0.92, china: 0.9, rome: 0.95 };
      for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) {
        i = y * GW + x;
        if (sea[i * 4 + 3] > 127) { id[i] = -1; continue; }
        // warp the sample point so borders wander like rivers and ridges, not straight lines
        var ux = x / G, uy = y / G, best = -2, bd = 1e9;
        var wx = ux + (noise(ux, uy, 20, 5) - 0.5) * 16 + (noise(ux, uy, 6, 7) - 0.5) * 5, wy = uy + (noise(ux, uy, 20, 9) - 0.5) * 16 + (noise(ux, uy, 6, 11) - 0.5) * 5;
        for (k = 0; k < TERR.length; k++) {
          var raw = Math.hypot(wx - TERR[k].x, wy - TERR[k].y); if (raw > 64) continue;
          var d = raw * (WGT[TERR[k].id] || 1); if (d < bd) { bd = d; best = k; }
        }
        id[i] = best;
      }
      // keep only the part of each province joined to its own centre (no enclaves across water)
      var keep = new Uint8Array(n), q = new Int32Array(n);
      TERR.forEach(function (t, ti) {
        var s0 = Math.round(t.y * G) * GW + Math.round(t.x * G), h = 0, tl = 0;
        if (id[s0] !== ti) return;
        q[tl++] = s0; keep[s0] = 1;
        while (h < tl) {
          var c = q[h++], cx0 = c % GW;
          [c - 1, c + 1, c - GW, c + GW].forEach(function (nb, ni) {
            if (nb < 0 || nb >= n || (ni === 0 && cx0 === 0) || (ni === 1 && cx0 === GW - 1)) return;
            if (!keep[nb] && id[nb] === ti) { keep[nb] = 1; q[tl++] = nb; }
          });
        }
      });
      for (i = 0; i < n; i++) if (id[i] >= 0 && !keep[i]) id[i] = -2;
      IDG = id;
      // per-province bounding boxes and white masks (fill + rim) for highlights
      BOX = TERR.map(function () { return { x0: GW, y0: GH, x1: 0, y1: 0 }; });
      for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) { k = id[y * GW + x]; if (k >= 0) { var b = BOX[k]; if (x < b.x0) b.x0 = x; if (y < b.y0) b.y0 = y; if (x > b.x1) b.x1 = x; if (y > b.y1) b.y1 = y; } }
      BOX.forEach(function (b, ti) {
        b.x0 -= 2; b.y0 -= 2; b.x1 += 2; b.y1 += 2; b.w = b.x1 - b.x0 + 1; b.h = b.y1 - b.y0 + 1;
        var f = mk(b.w, b.h), e = mk(b.w, b.h), fd = f.getContext("2d").createImageData(b.w, b.h), ed = e.getContext("2d").createImageData(b.w, b.h);
        for (var yy = 0; yy < b.h; yy++) for (var xx = 0; xx < b.w; xx++) {
          var gx = b.x0 + xx, gy = b.y0 + yy; if (gx < 0 || gy < 0 || gx >= GW || gy >= GH || id[gy * GW + gx] !== ti) continue;
          var o = (yy * b.w + xx) * 4; fd.data[o] = fd.data[o + 1] = fd.data[o + 2] = 255; fd.data[o + 3] = 255;
          var rim = false;
          for (var dy = -2; dy <= 2 && !rim; dy++) for (var dx = -2; dx <= 2 && !rim; dx++) { var nx = gx + dx, ny = gy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH || id[ny * GW + nx] !== ti) rim = true; }
          if (rim) { ed.data[o] = ed.data[o + 1] = ed.data[o + 2] = 255; ed.data[o + 3] = 255; }
        }
        f.getContext("2d").putImageData(fd, 0, 0); e.getContext("2d").putImageData(ed, 0, 0); b.fill = f; b.edge = e;
      });
    }
    function tinted(ti, which, col) {
      var key = ti + which + col; if (TINT[key]) return TINT[key];
      var b = BOX[ti], c = mk(b.w, b.h), m = c.getContext("2d");
      m.drawImage(b[which], 0, 0); m.globalCompositeOperation = "source-in"; m.fillStyle = col; m.fillRect(0, 0, b.w, b.h);
      return (TINT[key] = c);
    }
    function drawMask(ti, which, col, alpha, glow) {
      var b = BOX[ti]; cx.save(); cx.globalAlpha = alpha;
      if (glow) { cx.shadowColor = col; cx.shadowBlur = glow; }
      cx.drawImage(tinted(ti, which, col), b.x0 / G, b.y0 / G, b.w / G, b.h / G); cx.restore();
    }
    function rgb(hex) { var v2 = parseInt(hex.slice(1), 16); return [v2 >> 16 & 255, v2 >> 8 & 255, v2 & 255]; }

    // frontier lines, unclaimed-land hatching (static)
    function buildLines() {
      var c = mk(GW, GH), m = c.getContext("2d"), d = m.createImageData(GW, GH), px = d.data, id = IDG, x, y;
      function put(i, r, g, bl, a) { var o = i * 4; if (px[o + 3] >= a) return; px[o] = r; px[o + 1] = g; px[o + 2] = bl; px[o + 3] = a; }
      for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) {
        var i = y * GW + x, a = id[i];
        if (a === -2 && ((x + y) % 7 === 0)) put(i, 40, 26, 12, 70);          // terra incognita hatching
        [[1, 0], [0, 1]].forEach(function (dv) {
          var nx = x + dv[0], ny = y + dv[1]; if (nx >= GW || ny >= GH) return;
          var j = ny * GW + nx, b = id[j]; if (a === b || a === -1 || b === -1) return;
          if (a < 0 || b < 0) { put(i, 40, 26, 12, 120); put(j, 40, 26, 12, 120); return; }
          var ta = TERR[a], tb = TERR[b], joined = ADJ[ta.id].indexOf(tb.id) >= 0;
          if (!joined) {                                                         // they touch but do not connect: a closed frontier
            for (var s2 = -2; s2 <= 2; s2++) { var yy = y + (dv[0] ? s2 : 0), xx = x + (dv[1] ? s2 : 0); if (xx < 0 || yy < 0 || xx >= GW || yy >= GH) continue; var z = yy * GW + xx; put(z, 22, 13, 6, 235); if (dv[0]) { put(z + 1 < GW * GH ? z + 1 : z, 22, 13, 6, 235); } else if (z + GW < GW * GH) put(z + GW, 22, 13, 6, 235); }
          } else if (ta.region !== tb.region) { put(i, 30, 18, 8, 215); put(j, 30, 18, 8, 215); if (dv[0] && x > 0) put(i - 1, 30, 18, 8, 120); if (dv[1] && y > 0) put(i - GW, 30, 18, 8, 120); }
          else if (((x + y) >> 2) % 2 === 0) { put(i, 36, 22, 10, 170); put(j, 36, 22, 10, 170); }  // dotted: same region
        });
      }
      m.putImageData(d, 0, 0); return c;
    }

    // the owners' wash: pale inside, deep along each frontier between different powers
    function buildFill() {
      var c = fillCv || mk(GW, GH), m = c.getContext("2d"), d = m.createImageData(GW, GH), px = d.data, id = IDG, n = GW * GH;
      var grp = new Int8Array(n), D = new Float32Array(n), i, x, y, cols = TERR.map(function (t) { return rgb(colOf(t.id)); });
      var own = TERR.map(function (t) { return SIDES.indexOf(st.own[t.id]); });
      for (i = 0; i < n; i++) grp[i] = id[i] >= 0 ? own[id[i]] : -1;
      for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) {
        i = y * GW + x; var g = grp[i];
        D[i] = g < 0 ? 0 : ((x > 0 && grp[i - 1] !== g) || (x < GW - 1 && grp[i + 1] !== g) || (y > 0 && grp[i - GW] !== g) || (y < GH - 1 && grp[i + GW] !== g)) ? 0 : 1e6;
      }
      for (y = 0; y < GH; y++) for (x = 0; x < GW; x++) { i = y * GW + x; if (x > 0) D[i] = Math.min(D[i], D[i - 1] + 1); if (y > 0) D[i] = Math.min(D[i], D[i - GW] + 1); if (x > 0 && y > 0) D[i] = Math.min(D[i], D[i - GW - 1] + 1.41); if (x < GW - 1 && y > 0) D[i] = Math.min(D[i], D[i - GW + 1] + 1.41); }
      for (y = GH - 1; y >= 0; y--) for (x = GW - 1; x >= 0; x--) { i = y * GW + x; if (x < GW - 1) D[i] = Math.min(D[i], D[i + 1] + 1); if (y < GH - 1) D[i] = Math.min(D[i], D[i + GW] + 1); if (x < GW - 1 && y < GH - 1) D[i] = Math.min(D[i], D[i + GW + 1] + 1.41); if (x > 0 && y < GH - 1) D[i] = Math.min(D[i], D[i + GW - 1] + 1.41); }
      for (i = 0; i < n; i++) {
        if (id[i] < 0) continue; var col = cols[id[i]], o = i * 4, band = Math.max(0, 1 - D[i] / 9);
        px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2]; px[o + 3] = Math.round(255 * (0.3 + 0.44 * band * band + (D[i] < 1.5 ? 0.12 : 0)));
      }
      m.putImageData(d, 0, 0); fillCv = c;
    }

    // the engraved map itself (cached per pixel ratio)
    function buildMapBg() {
      var cv = mk(VW * DPR, VH * DPR); cv.dpr = DPR;
      var m = cv.getContext("2d"); m.setTransform(DPR, 0, 0, DPR, 0, 0);
      var R = mulberry(77), i, k;
      // parchment
      var lg = m.createRadialGradient(VW * 0.45, VH * 0.4, 30, VW * 0.5, VH * 0.5, VW * 0.8);
      lg.addColorStop(0, "#8a7550"); lg.addColorStop(0.65, "#6b5738"); lg.addColorStop(1, "#453523");
      m.fillStyle = lg; m.fillRect(0, 0, VW, VH);
      for (i = 0; i < 1400; i++) { m.fillStyle = R() < 0.5 ? "rgba(255,240,200,.05)" : "rgba(40,25,10,.07)"; m.fillRect(R() * VW, R() * VH, 0.6 + R() * 1.8, 0.6 + R() * 1.8); }
      for (i = 0; i < 14; i++) { var sx = R() * VW, sy = R() * VH, sg0 = m.createRadialGradient(sx, sy, 0, sx, sy, 10 + R() * 24); sg0.addColorStop(0, "rgba(60,38,16,.16)"); sg0.addColorStop(1, "rgba(60,38,16,0)"); m.fillStyle = sg0; m.fillRect(sx - 40, sy - 40, 80, 80); } // age stains
      function land(x, y) { return !isSea(x, y); }
      // deserts: dune strokes (the Sahara, Arabia, the Iranian plateau, the Thar, the Gobi)
      m.strokeStyle = "rgba(236,208,150,.32)"; m.lineWidth = 0.6;
      [[8, 186, 82, 110], [150, 214, 56, 50], [232, 150, 44, 30], [292, 190, 26, 22], [284, 36, 60, 40]].forEach(function (d) {
        for (k = 0; k < d[2] * d[3] / 60; k++) { var x = d[0] + R() * d[2], y = d[1] + R() * d[3]; if (!land(x, y)) continue; m.beginPath(); m.arc(x, y + 2.2, 2.6, Math.PI * 1.15, Math.PI * 1.85); m.stroke(); m.beginPath(); m.arc(x + 1.6, y + 3.4, 2, Math.PI * 1.2, Math.PI * 1.8); m.stroke(); }
      });
      // forests: Europe, the Pontic steppe edge, the Ganges and northern China
      function tree(x, y, s2) { m.fillStyle = "rgba(34,44,20,.55)"; m.fillRect(x - 0.3, y, 0.6, s2 * 0.7); m.beginPath(); m.arc(x, y - s2 * 0.2, s2 * 0.62, 0, 7); m.fill(); m.fillStyle = "rgba(170,190,110,.22)"; m.beginPath(); m.arc(x - s2 * 0.2, y - s2 * 0.38, s2 * 0.25, 0, 7); m.fill(); }
      [[8, 40, 78, 54], [70, 72, 40, 24], [100, 10, 90, 26], [300, 44, 44, 60], [312, 186, 32, 22]].forEach(function (d) {
        for (k = 0; k < d[2] * d[3] / 70; k++) { var x = d[0] + R() * d[2], y = d[1] + R() * d[3]; if (land(x, y) && land(x, y + 3)) tree(x, y, 2.4 + R() * 1.2); }
      });
      // the seas: deep water, engraved swell, coastal ripple lines
      SEAS.forEach(function (pts) { polyOn(m, pts); m.save(); m.shadowColor = "rgba(20,12,4,.8)"; m.shadowBlur = 6; m.fillStyle = "#1b3446"; m.fill(); m.restore(); });
      m.save(); m.beginPath(); SEAS.forEach(function (pts) { polyOn(m, pts); }); m.clip();
      var sgr = m.createLinearGradient(0, 0, 0, VH); sgr.addColorStop(0, "#26495e"); sgr.addColorStop(1, "#142638"); m.fillStyle = sgr; m.fillRect(0, 0, VW, VH);
      m.strokeStyle = "rgba(200,225,235,.10)"; m.lineWidth = 0.6;
      for (var yy0 = 0; yy0 < VH; yy0 += 5) { m.beginPath(); for (var x0 = 0; x0 <= VW; x0 += 4) { var y2 = yy0 + Math.sin(x0 * 0.21 + yy0 * 1.7) * 1.1; if (x0) m.lineTo(x0, y2); else m.moveTo(x0, y2); } m.stroke(); }
      var rip = mk(VW * DPR, VH * DPR), rm = rip.getContext("2d"); rm.setTransform(DPR, 0, 0, DPR, 0, 0); rm.lineJoin = "round";
      [2.5, 5, 8, 12].forEach(function (d) {
        rm.globalCompositeOperation = "source-over"; rm.strokeStyle = "#fff"; rm.lineWidth = 2 * d + 0.7; SEAS.forEach(function (p) { polyOn(rm, p); rm.stroke(); });
        rm.globalCompositeOperation = "destination-out"; rm.lineWidth = 2 * d - 0.7; SEAS.forEach(function (p) { polyOn(rm, p); rm.stroke(); });
      });
      m.globalAlpha = 0.2; m.drawImage(rip, 0, 0, VW, VH); m.globalAlpha = 1;
      m.restore();
      SEAS.forEach(function (pts) { polyOn(m, pts); m.strokeStyle = "rgba(34,20,8,.9)"; m.lineWidth = 1.5; m.stroke(); polyOn(m, pts); m.strokeStyle = "rgba(220,200,160,.4)"; m.lineWidth = 0.5; m.stroke(); });
      // rivers, with a little meander
      RIV.forEach(function (rv) {
        m.beginPath(); m.moveTo(rv[0][0], rv[0][1]);
        for (var j = 1; j < rv.length; j++) { var a = rv[j - 1], b = rv[j]; m.quadraticCurveTo(a[0] + (R() - 0.5) * 6, a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
        m.lineTo(rv[rv.length - 1][0], rv[rv.length - 1][1]); m.lineCap = "round";
        m.strokeStyle = "rgba(20,12,4,.45)"; m.lineWidth = 2.8; m.stroke(); m.strokeStyle = "#3f7898"; m.lineWidth = 1.4; m.stroke(); m.strokeStyle = "rgba(190,225,240,.35)"; m.lineWidth = 0.4; m.stroke();
      });
      // mountain ranges, lit from the west: the Alps, Taurus, Caucasus, Zagros, Hindu Kush, Himalaya, the Ethiopian highlands
      function peak(x, y, s2) {
        m.fillStyle = "rgba(236,222,186,.5)"; m.beginPath(); m.moveTo(x - s2, y); m.lineTo(x, y - s2 * 1.25); m.lineTo(x + s2 * 0.1, y); m.fill();
        m.fillStyle = "rgba(40,26,12,.62)"; m.beginPath(); m.moveTo(x, y - s2 * 1.25); m.lineTo(x + s2, y); m.lineTo(x + s2 * 0.1, y); m.fill();
        m.strokeStyle = "rgba(30,18,8,.7)"; m.lineWidth = 0.5; m.beginPath(); m.moveTo(x - s2, y); m.lineTo(x, y - s2 * 1.25); m.lineTo(x + s2, y); m.stroke();
        for (var hh = 1; hh < 4; hh++) { m.beginPath(); m.moveTo(x + s2 * hh * 0.22, y - s2 * 1.25 * (1 - hh * 0.22)); m.lineTo(x + s2 * hh * 0.18, y); m.stroke(); }
      }
      [[[18, 74], [60, 66]], [[134, 104], [162, 102]], [[166, 64], [204, 66]], [[204, 150], [222, 178]], [[240, 120], [266, 118]], [[290, 150], [334, 146]], [[116, 280], [134, 292]]].forEach(function (rg) {
        var a = rg[0], b = rg[1], cnt = Math.max(3, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6));
        for (var q = 0; q < cnt; q++) { var t = q / (cnt - 1), x = a[0] + (b[0] - a[0]) * t + (R() - 0.5) * 3, y = a[1] + (b[1] - a[1]) * t + (R() - 0.5) * 4; if (land(x, y)) peak(x, y, 3.8 + R() * 2.4); }
      });
      // ornaments: a galley, a sea serpent, a compass rose
      m.save(); m.translate(30, 145); m.strokeStyle = "rgba(230,215,180,.7)"; m.fillStyle = "rgba(230,215,180,.55)"; m.lineWidth = 0.6;
      m.beginPath(); m.moveTo(-9, 0); m.quadraticCurveTo(0, 5, 10, -1); m.lineTo(8, 1.5); m.quadraticCurveTo(0, 6, -8, 1.5); m.closePath(); m.fill();
      m.beginPath(); m.moveTo(0, 0); m.lineTo(0, -12); m.stroke(); m.beginPath(); m.moveTo(-5, -11); m.quadraticCurveTo(0, -7, 5, -11); m.lineTo(5, -3); m.quadraticCurveTo(0, -1, -5, -3); m.closePath(); m.fill();
      for (i = -6; i <= 6; i += 3) { m.beginPath(); m.moveTo(i, 2.5); m.lineTo(i - 2, 6); m.stroke(); }
      m.restore();
      m.save(); m.translate(206, 288); m.strokeStyle = "rgba(210,230,236,.5)"; m.lineWidth = 1.1; m.lineCap = "round";
      for (i = 0; i < 3; i++) { m.beginPath(); m.arc(-10 + i * 7, 0, 3, Math.PI, 0); m.stroke(); }
      m.beginPath(); m.moveTo(11, 0); m.quadraticCurveTo(14, -7, 18, -5); m.stroke(); m.beginPath(); m.moveTo(-13, 0); m.quadraticCurveTo(-17, 2, -18, -2); m.stroke();
      m.fillStyle = "rgba(210,230,236,.6)"; m.beginPath(); m.arc(17.5, -5.2, 1.1, 0, 7); m.fill(); m.restore();
      m.save(); m.translate(320, 276); m.strokeStyle = "rgba(231,198,128,.75)"; m.lineWidth = 0.7;
      m.beginPath(); m.arc(0, 0, 12, 0, 7); m.stroke(); m.beginPath(); m.arc(0, 0, 9.5, 0, 7); m.stroke();
      for (i = 0; i < 32; i++) { var an = i / 32 * Math.PI * 2; m.beginPath(); m.moveTo(Math.cos(an) * 9.5, Math.sin(an) * 9.5); m.lineTo(Math.cos(an) * (i % 4 ? 10.6 : 12), Math.sin(an) * (i % 4 ? 10.6 : 12)); m.stroke(); }
      for (var qq = 0; qq < 8; qq++) {
        m.save(); m.rotate(qq * Math.PI / 4); var L = qq % 2 ? 9 : 16, W = qq % 2 ? 1.8 : 3;
        m.fillStyle = "rgba(240,214,150,.9)"; m.beginPath(); m.moveTo(0, -L); m.lineTo(W, 0); m.lineTo(0, 0); m.closePath(); m.fill();
        m.fillStyle = "rgba(110,80,36,.9)"; m.beginPath(); m.moveTo(0, -L); m.lineTo(-W, 0); m.lineTo(0, 0); m.closePath(); m.fill(); m.restore();
      }
      m.fillStyle = "rgba(240,214,150,.95)"; m.font = "700 7px Cinzel, Georgia, serif"; m.textAlign = "center"; m.textBaseline = "alphabetic"; m.fillText("N", 0, -18); m.restore();
      // sea names, as an old map lettered them
      m.fillStyle = "rgba(205,225,232,.5)"; m.font = "italic 6.5px Georgia, serif"; m.textAlign = "center";
      m.fillText("Mare Nostrum", 64, 156); m.fillText("Erythraean Sea", 256, 262); m.fillText("Pontus Euxinus", 126, 57);
      m.save(); m.translate(219, 96); m.rotate(Math.PI / 2 - 0.1); m.fillText("Mare Caspium", 0, 2); m.restore();
      // title cartouche (the positions are schematic, and it says so)
      m.save(); m.translate(10, 9);
      m.fillStyle = "rgba(24,16,8,.82)"; m.strokeStyle = "rgba(231,198,128,.8)"; m.lineWidth = 0.8;
      m.beginPath(); m.moveTo(4, 0); m.lineTo(98, 0); m.quadraticCurveTo(102, 0, 102, 4); m.lineTo(102, 25); m.quadraticCurveTo(102, 29, 98, 29); m.lineTo(4, 29); m.quadraticCurveTo(0, 29, 0, 25); m.lineTo(0, 4); m.quadraticCurveTo(0, 0, 4, 0); m.closePath(); m.fill(); m.stroke();
      m.strokeStyle = "rgba(231,198,128,.35)"; m.strokeRect(2.5, 2.5, 97, 24);
      m.fillStyle = "#ecd08c"; m.font = "700 8.5px Cinzel, Georgia, serif"; m.textAlign = "center"; m.fillText("ORBIS ANTIQUUS", 51, 13);
      m.fillStyle = "rgba(230,215,180,.75)"; m.font = "italic 5.6px Georgia, serif"; m.fillText("a schematic map · not to scale", 51, 22.5);
      m.restore();
      // vignette + neatline frame with alternating graduation
      var vg = m.createRadialGradient(VW / 2, VH / 2, VH * 0.36, VW / 2, VH / 2, VW * 0.72); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(10,6,2,.5)");
      m.fillStyle = vg; m.fillRect(0, 0, VW, VH);
      m.fillStyle = "#1a120a"; m.fillRect(0, 0, VW, 4); m.fillRect(0, VH - 4, VW, 4); m.fillRect(0, 0, 4, VH); m.fillRect(VW - 4, 0, 4, VH);
      m.fillStyle = "rgba(231,198,128,.7)";
      for (i = 0; i * 12 < VW; i += 2) { m.fillRect(4 + i * 12, 1.2, 12, 1.6); m.fillRect(4 + i * 12, VH - 2.8, 12, 1.6); }
      for (i = 0; i * 12 < VH; i += 2) { m.fillRect(1.2, 4 + i * 12, 1.6, 12); m.fillRect(VW - 2.8, 4 + i * 12, 1.6, 12); }
      m.strokeStyle = "rgba(231,198,128,.55)"; m.lineWidth = 0.8; m.strokeRect(4.5, 4.5, VW - 9, VH - 9); m.strokeStyle = "rgba(231,198,128,.25)"; m.strokeRect(6.5, 6.5, VW - 13, VH - 13);
      return cv;
    }

    // roads over land and sea-lanes with a ship (static): each curve bends away from water or towards it
    function curveOf(a, b, k) { var dx = b.x - a.x, dy = b.y - a.y; return { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: (a.x + b.x) / 2 - dy * k, cy: (a.y + b.y) / 2 + dx * k }; }
    function qpt(c, t) { var u = 1 - t; return [u * u * c.ax + 2 * u * t * c.cx + t * t * c.bx, u * u * c.ay + 2 * u * t * c.cy + t * t * c.by]; }
    function buildRoutes() {
      ROUTE = EDGES.map(function (e) {
        var a = TMAP[e[0]], b = TMAP[e[1]], sea = e[2] === "sea", best = null, bs = 1e9;
        (sea ? [0.2, -0.2, 0.3, -0.3, 0.12, -0.12, 0.42, -0.42, 0.55, -0.55] : [0.04, -0.04, 0.1, -0.1, 0.17, -0.17, 0.24, -0.24]).forEach(function (k, ki) {
          var c = curveOf(a, b, k), s2 = 0;
          if (sea) { var mp = qpt(c, 0.5); s2 = isSea(mp[0], mp[1]) ? ki : 100 + ki; }
          else { for (var t = 0.15; t < 0.9; t += 0.07) { var p = qpt(c, t); if (isSea(p[0], p[1])) s2 += 10; } s2 += ki * 0.5; }
          if (s2 < bs) { bs = s2; best = c; }
        });
        best.sea = sea; best.a = e[0]; best.b = e[1]; return best;
      });
      var cv = mk(VW * DPR, VH * DPR), m = cv.getContext("2d"); m.setTransform(DPR, 0, 0, DPR, 0, 0); cv.dpr = DPR;
      ROUTE.forEach(function (c) {
        m.beginPath(); m.moveTo(c.ax, c.ay); m.quadraticCurveTo(c.cx, c.cy, c.bx, c.by);
        if (c.sea) {
          m.setLineDash([3.5, 2.5]); m.strokeStyle = "rgba(10,20,30,.55)"; m.lineWidth = 2; m.stroke(); m.strokeStyle = "rgba(215,235,245,.7)"; m.lineWidth = 0.9; m.stroke(); m.setLineDash([]);
          var p = qpt(c, 0.5), p2 = qpt(c, 0.52), ang = Math.atan2(p2[1] - p[1], p2[0] - p[0]); if (Math.abs(ang) > Math.PI / 2) ang += Math.PI;
          m.save(); m.translate(p[0], p[1]); m.rotate(ang);
          m.fillStyle = "#2a1a0c"; m.beginPath(); m.moveTo(-6, -0.5); m.quadraticCurveTo(0, 3.6, 6.5, -1.2); m.lineTo(5, 1.4); m.quadraticCurveTo(0, 4.4, -5, 1.2); m.closePath(); m.fill();
          m.strokeStyle = "#2a1a0c"; m.lineWidth = 0.6; m.beginPath(); m.moveTo(0, 0); m.lineTo(0, -8); m.stroke();
          m.fillStyle = "#efe2c0"; m.beginPath(); m.moveTo(-3.6, -7.4); m.quadraticCurveTo(0, -4.8, 3.6, -7.4); m.lineTo(3.4, -1.8); m.quadraticCurveTo(0, -0.6, -3.4, -1.8); m.closePath(); m.fill();
          m.strokeStyle = "rgba(42,26,12,.7)"; m.lineWidth = 0.35; m.stroke(); m.restore();
        } else {
          m.strokeStyle = "rgba(30,18,8,.5)"; m.lineWidth = 2.4; m.stroke();
          var len = Math.hypot(c.bx - c.ax, c.by - c.ay), nDots = Math.floor(len / 3.6);
          m.fillStyle = "rgba(240,226,190,.85)";
          for (var q = 1; q < nDots; q++) { var pp = qpt(c, q / nDots); m.beginPath(); m.arc(pp[0], pp[1], 0.62, 0, 7); m.fill(); }
        }
      });
      return cv;
    }

    function colOf(id) { return SIDE_COL[st.own[id]] || SIDE_COL.neutral; }
    function shade(hex, f) { var c = rgb(hex); return "rgb(" + c.map(function (v2) { return Math.max(0, Math.min(255, Math.round(f > 0 ? v2 + (255 - v2) * f : v2 * (1 + f)))); }).join(",") + ")"; }

    // a walled city for each capital
    function city(x, y) {
      cx.save(); cx.translate(x, y);
      cx.fillStyle = "rgba(10,6,2,.45)"; cx.beginPath(); cx.ellipse(0, 4.6, 9, 1.6, 0, 0, 7); cx.fill();
      var st1 = cx.createLinearGradient(0, -8, 0, 4); st1.addColorStop(0, "#f2e4c0"); st1.addColorStop(1, "#b39a6a"); cx.fillStyle = st1; cx.strokeStyle = "#2a1a0c"; cx.lineWidth = 0.55;
      cx.beginPath(); cx.rect(-7, -3, 14, 7); cx.fill(); cx.stroke();                                   // curtain wall
      [-7.5, 4.5].forEach(function (tx) { cx.beginPath(); cx.rect(tx, -7, 3, 11); cx.fill(); cx.stroke(); for (var b = 0; b < 2; b++) { cx.fillStyle = "#2a1a0c"; cx.fillRect(tx + b * 2 - 0.1, -7.9, 1.1, 0.9); } cx.fillStyle = st1; });
      cx.beginPath(); cx.rect(-2, -9, 4, 8); cx.fill(); cx.stroke();                                     // keep
      cx.fillStyle = "#b8434b"; cx.beginPath(); cx.moveTo(0, -9); cx.lineTo(0, -13); cx.lineTo(3.6, -12); cx.lineTo(0, -11); cx.fill();
      cx.strokeStyle = "#2a1a0c"; cx.beginPath(); cx.moveTo(0, -9); cx.lineTo(0, -13); cx.stroke();
      cx.fillStyle = "#2a1a0c"; cx.beginPath(); cx.moveTo(-1.6, 4); cx.lineTo(-1.6, 1); cx.arc(0, 1, 1.6, Math.PI, 0); cx.lineTo(1.6, 4); cx.fill(); // gate
      for (var bb = -5; bb <= 3; bb += 2) cx.fillRect(bb, -3.9, 1, 0.9);
      cx.restore();
    }
    // an embossed shield token with the army count; standards for large hosts
    function token(t) {
      var col = colOf(t.id), n = st.arm[t.id], x = t.x, y = t.y, r = 8.2;
      if (n >= 5) [[5.5, -1], [-5.5, 1]].slice(0, n >= 10 ? 2 : 1).forEach(function (sd) {
        var px = x + sd[0], top = y - 17;
        cx.strokeStyle = "#2a1a0c"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(px, y - 4); cx.lineTo(px, top); cx.stroke();
        cx.fillStyle = col; cx.beginPath(); cx.moveTo(px, top); cx.lineTo(px + 7 * sd[1], top + 2.2); cx.lineTo(px + 5 * sd[1], top + 3.4); cx.lineTo(px + 7 * sd[1], top + 4.8); cx.lineTo(px, top + 5.6); cx.closePath(); cx.fill();
        cx.strokeStyle = "rgba(20,12,4,.8)"; cx.lineWidth = 0.4; cx.stroke(); cx.fillStyle = "#e9c878"; cx.beginPath(); cx.arc(px, top - 0.6, 0.9, 0, 7); cx.fill();
      });
      cx.save(); cx.fillStyle = "rgba(10,6,2,.55)"; cx.beginPath(); cx.ellipse(x + 0.8, y + 2.6, r, r * 0.8, 0, 0, 7); cx.fill(); cx.restore();
      var g = cx.createRadialGradient(x - r * 0.35, y - r * 0.45, 1, x, y, r * 1.1); g.addColorStop(0, shade(col, 0.45)); g.addColorStop(0.55, col); g.addColorStop(1, shade(col, -0.45));
      cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
      var rim = cx.createLinearGradient(x, y - r, x, y + r); rim.addColorStop(0, "#fbe7b0"); rim.addColorStop(0.5, "#b8883a"); rim.addColorStop(1, "#5e3f14");
      cx.strokeStyle = rim; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, r - 0.4, 0, 7); cx.stroke();
      cx.strokeStyle = "rgba(20,12,4,.55)"; cx.lineWidth = 0.5; cx.beginPath(); cx.arc(x, y, r - 2, 0, 7); cx.stroke();
      cx.font = "700 " + (n > 99 ? 7 : n > 9 ? 8.5 : 10) + "px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.lineWidth = 2.2; cx.strokeStyle = "rgba(16,10,4,.75)"; cx.strokeText(n, x, y + 0.6); cx.fillStyle = "#fff8e6"; cx.fillText(n, x, y + 0.6);
    }
    function label(t) {
      cx.font = "700 7px Cinzel, Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "top";
      cx.lineJoin = "round"; cx.strokeStyle = "rgba(14,9,4,.85)"; cx.lineWidth = 2.4; cx.strokeText(t.name.toUpperCase(), t.x, t.y + 10);
      cx.fillStyle = "#f1e6c8"; cx.fillText(t.name.toUpperCase(), t.x, t.y + 10);
    }
    function die(x, y, s, v2, col, dim) {
      cx.save(); cx.globalAlpha = dim ? 0.62 : 1;
      cx.fillStyle = "rgba(0,0,0,.5)"; roundRect(x + 0.8, y + 1.2, s, s, 2.2); cx.fill();
      var g = cx.createLinearGradient(x, y, x + s, y + s); g.addColorStop(0, shade(col, 0.5)); g.addColorStop(1, shade(col, -0.25));
      cx.fillStyle = g; roundRect(x, y, s, s, 2.2); cx.fill(); cx.strokeStyle = "rgba(20,12,4,.8)"; cx.lineWidth = 0.6; cx.stroke();
      var P = { 1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]], 4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
        5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]], 6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]] }[v2];
      cx.fillStyle = "#1c1208"; P.forEach(function (p) { cx.beginPath(); cx.arc(x + p[0] * s, y + p[1] * s, s * 0.09, 0, 7); cx.fill(); });
      if (dim) { cx.globalAlpha = 1; cx.strokeStyle = "#e04a3a"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x + 2, y + 2); cx.lineTo(x + s - 2, y + s - 2); cx.moveTo(x + s - 2, y + 2); cx.lineTo(x + 2, y + s - 2); cx.stroke(); }
      cx.restore();
    }
    function arrow(from, to, col) {
      var a = TMAP[from], b = TMAP[to], c = curveOf(a, b, 0.22), tEnd = 1, tStart = 0;
      while (tEnd > 0.5) { var q = qpt(c, tEnd); if (Math.hypot(q[0] - b.x, q[1] - b.y) > 11) break; tEnd -= 0.02; }
      while (tStart < 0.5) { var q0 = qpt(c, tStart); if (Math.hypot(q0[0] - a.x, q0[1] - a.y) > 10) break; tStart += 0.02; }
      cx.save(); cx.lineCap = "round";
      [["rgba(12,8,4,.8)", 4.4], [col, 2.4]].forEach(function (sty) {
        cx.strokeStyle = sty[0]; cx.lineWidth = sty[1]; cx.beginPath();
        for (var s2 = tStart; s2 <= tEnd + 1e-6; s2 += 0.03) { var p = qpt(c, Math.min(s2, tEnd)); if (s2 === tStart) cx.moveTo(p[0], p[1]); else cx.lineTo(p[0], p[1]); }
        cx.stroke();
      });
      var e = qpt(c, tEnd), e0 = qpt(c, tEnd - 0.04), ang = Math.atan2(e[1] - e0[1], e[0] - e0[0]);
      cx.translate(e[0], e[1]); cx.rotate(ang); cx.fillStyle = col; cx.strokeStyle = "rgba(12,8,4,.9)"; cx.lineWidth = 0.8;
      cx.beginPath(); cx.moveTo(3.5, 0); cx.lineTo(-4, -4.2); cx.lineTo(-2.4, 0); cx.lineTo(-4, 4.2); cx.closePath(); cx.fill(); cx.stroke();
      cx.restore();
    }

    function render() {
      if (!cx || !st) return;
      if (!IDG) buildGrid();
      if (!mapBg || mapBg.dpr !== DPR) { mapBg = buildMapBg(); routesCv = null; }
      if (!polLines) polLines = buildLines();
      if (!routesCv || routesCv.dpr !== DPR) routesCv = buildRoutes();
      var sig = TERR.map(function (t) { return st.own[t.id]; }).join();
      if (sig !== fillSig) { buildFill(); fillSig = sig; }
      var now = performance.now() / 1000, pulse = 0.5 + 0.5 * Math.sin(now * 5);
      cx.clearRect(0, 0, VW, VH);
      cx.drawImage(mapBg, 0, 0, VW, VH);
      cx.imageSmoothingEnabled = true;
      cx.drawImage(fillCv, 0, 0, VW, VH);
      cx.drawImage(polLines, 0, 0, VW, VH);
      // highlights: your lands while placing armies; the chosen land; who it can reach
      if (!st.aiThinking && st.phase === "reinforce" && st.pool > 0 && !st.over) TERR.forEach(function (t, ti) { if (st.own[t.id] === "you") drawMask(ti, "edge", "#fff4d0", 0.25 + 0.35 * pulse); });
      if (st.sel) {
        var si = TERR.indexOf(TMAP[st.sel]);
        drawMask(si, "fill", "#fff4d0", 0.22); drawMask(si, "edge", "#fff4d0", 0.95, 6);
        ADJ[st.sel].forEach(function (nid) {
          var ok = st.phase === "attack" ? st.own[nid] !== st.own[st.sel] : st.phase === "fortify" && !st.fortified && st.own[nid] === st.own[st.sel];
          if (!ok) return; var ni = TERR.indexOf(TMAP[nid]), hc = st.phase === "attack" ? "#ff8a6a" : "#bfe3ff";
          drawMask(ni, "fill", hc, 0.1 + 0.2 * pulse); drawMask(ni, "edge", hc, 0.55 + 0.4 * pulse);
        });
      }
      if (st.flash) Object.keys(st.flash).forEach(function (fid) { var fi = TERR.indexOf(TMAP[fid]), f = st.flash[fid]; drawMask(fi, "fill", "#fff0c8", 0.5 * f); drawMask(fi, "edge", colOf(fid), f, 8); });
      cx.drawImage(routesCv, 0, 0, VW, VH);
      if (st.sel) ROUTE.forEach(function (c) {
        if (c.a !== st.sel && c.b !== st.sel) return; var o = c.a === st.sel ? c.b : c.a;
        var ok = st.phase === "attack" ? st.own[o] !== st.own[st.sel] : st.own[o] === st.own[st.sel]; if (!ok) return;
        cx.save(); cx.setLineDash([4, 3]); cx.lineDashOffset = -now * 14; cx.strokeStyle = st.phase === "attack" ? "rgba(255,160,130,.95)" : "rgba(200,232,255,.95)"; cx.lineWidth = 1.3;
        cx.beginPath(); cx.moveTo(c.ax, c.ay); cx.quadraticCurveTo(c.cx, c.cy, c.bx, c.by); cx.stroke(); cx.restore();
      });
      TERR.forEach(function (t) { if (t.cap) city(t.x, t.y - 13); });
      TERR.forEach(function (t) { token(t); label(t); });
      // the battle just fought: an arrow and the dice, losers struck through
      if (st.dice && st.dice.t > 0) {
        var d = st.dice, fa = Math.min(1, d.t / 0.35);
        cx.save(); cx.globalAlpha = fa; arrow(d.from, d.to, d.atkCol);
        var mx = (TMAP[d.from].x + TMAP[d.to].x) / 2, my = (TMAP[d.from].y + TMAP[d.to].y) / 2 - 30, s = 11, gap = 2.5;
        var wA = d.ar.length * (s + gap), wD = d.dr.length * (s + gap), W = wA + wD + 16, H = s + 12;
        // put the dice where they hide the fewest tokens and labels
        var bestP = null, bestC = 1e9, baseY = my + 30;
        [-34, 18, -52, 36, -70, 54].forEach(function (off, oi) {
          var px = Math.max(W / 2 + 8, Math.min(VW - W / 2 - 8, mx)), py = Math.max(10, Math.min(VH - H - 8, baseY + off)), cost = oi * 0.3;
          TERR.forEach(function (t) { if (t.x + 20 > px - W / 2 && t.x - 20 < px + W / 2 && t.y + 18 > py && t.y - 10 < py + H) cost += 4; });
          if (cost < bestC) { bestC = cost; bestP = [px, py]; }
        });
        mx = bestP[0]; my = bestP[1];
        var x0 = mx - W / 2;
        cx.fillStyle = "rgba(14,9,4,.9)"; cx.strokeStyle = COL.gold; cx.lineWidth = 0.8; roundRect(x0, my, W, H, 4); cx.fill(); cx.stroke();
        var pairs = Math.min(d.ar.length, d.dr.length);
        d.ar.forEach(function (v2, i) { die(x0 + 5 + i * (s + gap), my + 6, s, v2, d.atkCol, i < pairs && !(v2 > d.dr[i])); });
        cx.fillStyle = COL.goldB; cx.font = "700 9px Georgia, serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("⚔", x0 + 5 + wA + 3, my + H / 2);
        d.dr.forEach(function (v2, i) { die(x0 + 11 + wA + i * (s + gap), my + 6, s, v2, d.defCol, i < pairs && d.ar[i] > v2); });
        cx.restore();
      }
      updateHUD();
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
    // dice and conquest flashes fade in real time; highlights pulse at half rate
    function loop(ts) {
      if (!st || st.over) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts; frameN++;
      var need = false;
      if (st.dice && st.dice.t > 0) { st.dice.t -= dt; if (st.dice.t <= 0) st.dice = null; need = true; }
      if (st.flash) Object.keys(st.flash).forEach(function (k) { st.flash[k] -= dt / 1.1; if (st.flash[k] <= 0) delete st.flash[k]; need = true; });
      if (!need && (st.sel || (st.phase === "reinforce" && st.pool > 0 && !st.aiThinking)) && frameN % 2 === 0) need = true;
      if (need) render();
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
        '<p class="rq-note">Tap a land, then a neighbour to attack — the higher dice win. Lands border each other only along the drawn roads and sea-lanes. Hold a whole region or a walled capital for extra armies. Trade a set of three cards for a host. Be the last power standing.</p>';
      canvas = root.querySelector(".rk-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, (canvas.getBoundingClientRect().width || VW) / VW); canvas.width = Math.round(VW * DPR); canvas.height = Math.round(VH * DPR); cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      hudEl = root.querySelector(".rk-hud"); msgEl = root.querySelector(".rk-msg"); live = root.querySelector(".rk-toast");
      btnEl = root.querySelector(".rk-next"); tradeEl = root.querySelector(".rk-cards"); logEl = root.querySelector(".rk-log");
      canvas.addEventListener("click", function (e) { var r = canvas.getBoundingClientRect(); onClick(terrAt((e.clientX - r.left) / r.width * VW, (e.clientY - r.top) / r.height * VH)); });
      btnEl.addEventListener("click", nextPhase);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { mapBg = null; if (st && !st.over) render(); });
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
