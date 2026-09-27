/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Tomb Robber" (treasure-hunt expedition)

   A four-site run across the ancient world, framed by the field journal of an
   expedition that never came home: Egypt → Sumer → the Indus → the road east
   (Persia & China). Each site is a hand-built level with its own landscape,
   wildlife, traps and puzzles:

     Egypt      desert valley → torch-lit tomb, a rolling-boulder chase, falling
                spears, a hieroglyph floor puzzle, a whip-swing over a spike pit
     Sumer      reed marsh and rafts, a lion on the bank, a lever + crate gate,
                the climb up the ziggurat
     The Indus  monsoon jungle, a TIGER CHASE, gharials in the streams, a crate
                puzzle in the fired-brick city, a swing across the Great Bath
     Road East  a crumbling Persian mountain pass, a leopard, a rockfall; then
                a Shang oracle chamber whose floor answers in oracle-bone script

   Every relic you lift tells you what it meant to the people who made it, drawn
   from the real chapters (data/treasure.json, checked by tools/verify-treasure.js).
   The animals, symbols and buildings are ones documented for each place (tigers
   and gharials on Indus seals, lions in Mesopotamian art, the Shang court's
   rammed-earth halls and bronze cauldrons); the puzzles themselves are game.

   Controls: ←/→ or A/D run · ↑/W/Space jump (hold for height) · J/X/K whip.
   The whip kills snakes/scorpions/bats, staggers big cats, throws levers (it
   aims upward by itself at a lever overhead) and latches onto bronze rings to
   swing — jump to let go, ↓ to drop.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  var SCRIPT_DIR = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, "")) || "assets/games/";
  var DATA_URL = SCRIPT_DIR + "data/treasure.json";
  // the explorer: painted cut-out parts sliced from the character turnaround sheet
  // (art-source/tomb-robber/), hinged at hip and knee so the legs actually run and tuck.
  var ART_BASE = SCRIPT_DIR + "art/treasure/";
  var ART = { ready: false, man: null, img: {} };
  function loadArt() {
    if (ART.man) return;
    ART.man = {};
    fetch(ART_BASE + "manifest.json?v=1").then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
      if (!m) return; var names = ["body", "thigh", "shin"], left = names.length;
      names.forEach(function (n) { var im = new Image(); im.onload = function () { ART.img[n] = im; if (--left === 0) { ART.man = m; ART.ready = true; } }; im.src = ART_BASE + n + ".png?v=1"; });
    }).catch(function () {});
  }
  var DATA = null, loadingPromise = null;
  function loadData() {
    if (DATA) return Promise.resolve(DATA);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(DATA_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { DATA = { facts: (j && j.facts) || [], story: (j && j.story) || null }; return DATA; });
    return loadingPromise;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rng(seed) { var s = seed >>> 0; return function () { s += 0x6D2B79F5; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  AG.register("treasure", {
    title: "The Tomb Robber",
    subtitle: "An expedition across the ancient world — outrun the traps and the tigers, solve the old doors, finish the journal.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch02) || "",
    sourceHref: "chapters/ch02.html", sourceLabel: "Read “Egypt”",
    mount: mountGame
  });

  var TILE = 24, ROWS = 12;

  /* ---------------- puzzle symbol sets ----------------
     Egyptian: four of the commonest amuletic signs, with their standard glosses.
     Oracle: early (oracle-bone script) forms of four Shang-era characters. */
  var GLYPHS = {
    egypt: { gloss: ["ankh — “life”", "djed — “stability”", "was — “dominion”", "wedjat — the restored eye of Horus, “soundness”"] },
    oracle: { gloss: ["日 sun", "月 moon", "雨 rain", "人 person"] }
  };

  /* ---------------- biomes: palette + scenery per landscape ---------------- */
  var BIOMES = {
    egypt: { sky: ["#2a1838", "#9a3f3a", "#f2a257"], sun: "#ffd58a", far: "#6e3a3a", far2: "#8a4d3e", mid: "#4a2a26",
      soil: ["#d9a45a", "#a8703a", "#6e4424"], top: "#f0c47a", built: ["#c9a676", "#8e6c44"], back: "#3a2a1c", ledge: "#8a6238", weather: "dust" },
    sumer: { sky: ["#1b2844", "#6a78a0", "#f0b38a"], sun: "#ffe0b0", far: "#3a3c55", far2: "#55506a", mid: "#2c3a2c",
      soil: ["#6c5a3a", "#4e4028", "#2e2618"], top: "#6f9a3a", built: ["#b07c50", "#7a5234"], back: "#3a2a20", ledge: "#8a6a3a", weather: "fireflies", water: "#3c6c7c" },
    indus: { sky: ["#10261f", "#2c5040", "#7aa47a"], sun: null, far: "#27463a", far2: "#35594a", mid: "#16301f",
      soil: ["#5a4a2e", "#40331e", "#241c10"], top: "#4f9a3a", built: ["#b0562e", "#7a3418"], back: "#2e1a12", ledge: "#7a4a2a", weather: "rain", water: "#2f6a6a" },
    persia: { sky: ["#141836", "#454a7e", "#d7a4b6"], sun: "#fff0d8", far: "#3a3a5e", far2: "#56567a", mid: "#26283a",
      soil: ["#8a7a68", "#5e5246", "#3a322a"], top: "#9aa070", built: ["#9a8a78", "#6a5c4e"], back: "#2a2430", ledge: "#7a6a5a", weather: "snow" },
    china: { sky: ["#281628", "#7a3446", "#e98e62"], sun: "#ffcf9a", far: "#5a3040", far2: "#7a4650", mid: "#2e2030",
      soil: ["#b08a54", "#83643a", "#4e3a22"], top: "#8aa84a", built: ["#c09a64", "#8a6a40"], back: "#2e2020", ledge: "#7a5230", weather: "leaves" }
  };

  /* ---------------- the four sites, hand-built ----------------
     Rows 0..11, ground normally tops at row 10. `build(B)` lays terrain first,
     then things; see makeLevel for the builder. Each gate opens when every
     plate/lever/glyph-floor between it and the previous gate is satisfied. */
  var LEVELS = [
    { chapter: "ch02", name: "The Valley of the Kings", place: "Egypt", w: 124, zones: [[0, "egypt"]], seed: 11,
      build: function (B) {
        B.ground(0, 123);
        B.ceiling(30, 123, 3);                       // the tomb
        B.dark(30, 123);
        B.spikes(12, 14);
        B.ledge(8, 16, 18); B.ledge(6, 19, 22);
        B.block(60, 60, 9, 9); B.spikes(66, 67); B.block(72, 73, 9, 9);
        B.pit(78, 80);
        B.pit(101, 107); B.spikes(101, 107, 11);
        B.ledge(8, 111, 113);
        B.gate(98, 4, 9); B.gate(119, 4, 9);
        // --- things
        B.start(2);
        B.hint(2, "← → run · ↑ or Space jumps (hold for height) · J or X cracks the whip.");
        B.tree(1, 1.05); B.tree(8, 0.9); B.tree(15, 1.1); B.tree(24, 0.95); B.plant(5); B.plant(11); B.plant(21); B.plant(27);
        B.statue(26, "obelisk");
        B.gems(6, 8, 8); B.foe("cobra", 10); B.relic(21, 5); B.foe("scorpion", 24, { range: [23, 28] });
        B.check(28);
        B.hint(31, "The tomb. Watch the ceiling — the priests left spears for robbers.");
        B.torch(33, 5); B.torch(41, 5); B.torch(49, 5); B.torch(57, 5); B.torch(65, 5); B.torch(75, 5); B.torch(85, 5); B.torch(97, 5); B.torch(109, 5); B.torch(117, 5);
        B.trap(36, 1.7, 0); B.trap(39, 1.7, 0.55); B.trap(42, 1.7, 1.1);
        B.foe("bat", 45, { r: 4 }); B.ledge(8, 44, 46); B.relic(45, 7); B.foe("scorpion", 48, { range: [46, 52] });
        B.check(51);
        B.boulder(55);
        B.hint(55, "A rumble behind you — RUN!");
        B.gems(62, 64, 8); B.gems(69, 71, 7);
        B.check(83); B.canteen(84);
        B.mural(86, 5, "egypt"); B.glyphs([88, 90, 92, 94], [1, 3, 0, 2], [0, 1, 2, 3], "egypt");
        B.hint(86, "A painted wall. Step on the floor signs in the order it shows.");
        B.relic(91, 6);
        B.check(99); B.ring(104, 4);
        B.hint(99, "A bronze ring over the pit — face it and crack the whip to swing. Jump to let go.");
        B.gems(103, 105, 8);
        B.crate(109); B.plate(116); B.relic(112, 7);
        B.hint(108, "Push the crate onto the plate to lift the last door.");
        B.relic(121, 8); B.exit(122);
      } },
    { chapter: "ch03", name: "The Ziggurat of Ur", place: "Sumer", w: 118, zones: [[0, "sumer"]], seed: 23,
      build: function (B) {
        B.ground(0, 20); B.water(21, 34, 10); B.ground(35, 52); B.water(53, 56, 10); B.ground(57, 117);
        B.ledge(8, 44, 47);
        B.block(68, 69, 2, 6);                       // a raised mudbrick granary on timber stilts (lever on its face)
        B.block(74, 74, 0, 4); B.gate(74, 5, 9);
        B.block(80, 112, 8, 9); B.block(86, 106, 6, 7); B.block(92, 100, 4, 5);   // the ziggurat terraces
        B.crumble(113, 116, 8);
        // --- things
        B.start(2);
        B.hint(2, "The marsh between the rivers. Ride the reed raft across.");
        B.tree(3, 1.0); B.tree(10, 1.15); B.tree(17, 0.9); B.plant(6); B.plant(13); B.plant(19); B.plant(36); B.plant(58); B.plant(63);
        B.statue(15, "reedhut");
        B.gems(7, 9, 8);
        B.mover(22, 3, 10, 10, "x");
        B.check(37); B.foe("cobra", 40);
        B.foe("lion", 47, { range: [40, 51], r: 9 });
        B.hint(40, "A lion on the bank. Crack the whip to stagger it, or go over it on the ledge.");
        B.relic(46, 7);
        B.ring(55, 4);
        B.check(59); B.tree(60, 1.05); B.statue(62, "reedbundle"); B.statue(68, "stilts");
        B.crate(61); B.plate(71); B.lever(67, 6);
        B.hint(63, "This gate wants the plate weighted and the lever on the pier thrown — crack the whip at it.");
        B.check(76); B.foe("cobra", 83);
        B.relic(88, 5); B.foe("lion", 96, { range: [87, 104], r: 5 });
        B.gems(93, 99, 2);
        B.relic(99, 3); B.relic(114, 7);
        B.statue(96, "shrine");
        B.exit(96, 3);
        B.hint(80, "Climb the terraces. The shrine at the top was the god's house.");
      } },
    { chapter: "ch04", name: "Mohenjo-daro", place: "The Indus", w: 132, zones: [[0, "indus"]], seed: 37,
      build: function (B) {
        B.ground(0, 131);
        B.ledge(8, 16, 18); B.ledge(6, 19, 21);
        B.water(25, 27, 10);
        B.block(40, 40, 9, 9); B.water(46, 48, 10); B.block(53, 54, 9, 9); B.block(58, 64, 9, 9); B.pit(68, 70); B.block(74, 74, 9, 9);
        B.block(86, 90, 6, 6); B.ledge(8, 84, 85);          // a raised brick platform on piers
        B.block(96, 96, 0, 3); B.gate(96, 4, 9);
        B.water(99, 104, 10);
        B.crumble(111, 112, 8); B.block(115, 118, 6, 9);
        // --- things
        B.start(2);
        B.hint(2, "Monsoon jungle on the road to the brick city. Something is watching from the trees…");
        B.tree(4, 1.1); B.tree(12, 1.2); B.tree(22, 1.0); B.tree(31, 1.15); B.tree(44, 1.1); B.tree(57, 1.2); B.tree(66, 1.0); B.tree(77, 1.1);
        B.plant(7); B.plant(15); B.plant(29); B.plant(37); B.plant(50); B.plant(62); B.plant(72); B.plant(79);
        B.vine(10, 0, 5); B.vine(33, 0, 4); B.vine(52, 0, 6); B.vine(71, 0, 4);
        B.foe("cobra", 14); B.relic(20, 5); B.gems(8, 10, 8);
        B.foe("gharial", 26);
        B.check(30);
        B.chase(35, 80);
        B.hint(35, "A TIGER! Run for the city walls — crack the whip if it gets close.");
        B.gems(42, 44, 7); B.foe("gharial", 47); B.gems(59, 63, 7); B.ring(69, 5);
        B.hint(80, "Inside the walls. The tiger won't follow you here.");
        B.check(81); B.foe("peacock", 83, { deco: true }); B.statue(86, "piers");
        B.crate(82); B.crate(87, 5); B.plate(88, 9); B.plate(92);
        B.hint(84, "Two plates. One crate waits up on the platform — push it off the edge.");
        B.check(97); B.ring(102, 4); B.relic(103, 7);
        B.hint(97, "The Great Bath: a sealed brick tank, stairs at both ends. Swing across.");
        B.statue(98, "steps"); B.statue(105, "steps");
        B.check(108); B.relic(117, 5); B.foe("cobra", 116, { r: 5 });
        B.relic(124, 8); B.statue(121, "well"); B.foe("peacock", 126, { deco: true }); B.exit(129);
      } },
    { chapter: "ch06", name: "Behistun & the Oracle", place: "The Road East", w: 142, zones: [[0, "persia"], [88, "china"]], seed: 51,
      build: function (B) {
        B.ground(0, 14); B.ground(15, 22, 8); B.ground(30, 40, 8); B.pit(41, 48); B.ground(49, 75, 8);
        B.crumble(41, 48, 8);
        B.ledge(6, 51, 53); B.ledge(4, 55, 58);
        B.ground(76, 141); B.pit(84, 86);
        B.ceiling(98, 114, 3); B.dark(98, 114);
        B.gate(112, 4, 9);
        B.pit(118, 127);
        // --- things
        B.start(2);
        B.hint(2, "The Persian road. The pass ahead is failing — keep moving.");
        B.tree(4, 1.1); B.tree(9, 0.9); B.tree(33, 1.0); B.tree(38, 1.2); B.plant(12); B.plant(18); B.plant(36); B.plant(62); B.plant(70);
        B.check(17); B.ring(26, 3); B.gems(24, 28, 5);
        B.hint(20, "A chasm. Crack the whip at the ring and swing.");
        B.relic(45, 6);
        B.check(50);
        B.foe("leopard", 56, { range: [50, 62], r: 7 });
        B.relic(57, 3);
        B.statue(60, "firealtar"); B.check(66);
        B.boulder(68); B.hint(68, "Rockfall — run!");
        B.gems(78, 82, 8);
        B.check(89); B.tree(90, 1.1); B.tree(95, 1.0); B.statue(93, "ding"); B.plant(91); B.foe("crane", 92, { deco: true });
        B.hint(89, "The Shang court at Anyang: rammed-earth walls and bronze cauldrons. The oracle chamber lies ahead.");
        B.torch(99, 5); B.torch(106, 5); B.torch(111, 5);
        B.mural(101, 5, "oracle"); B.glyphs([103, 105, 107, 109], [2, 0, 3, 1], [0, 1, 2, 3], "oracle");
        B.hint(101, "A cracked ox bone, carved with questions. Step on the signs in the order the bone shows.");
        B.check(115); B.relic(116, 7);
        B.mover(118, 3, 8, 6, "x"); B.relic(122, 5); B.ring(126, 4);
        B.tree(130, 1.05); B.tree(136, 1.0); B.plant(133); B.foe("cobra", 132);
        B.relic(134, 8); B.exit(139);
      } }
  ];

  /* ---------------- level builder ---------------- */
  function makeLevel(def) {
    var W = def.w, grid = [], mat = [], r, c;
    for (r = 0; r < ROWS; r++) { grid.push([]); mat.push([]); for (c = 0; c < W; c++) { grid[r].push(0); mat[r].push(0); } }
    function set(rr, cc, v, m) { if (rr >= 0 && rr < ROWS && cc >= 0 && cc < W) { grid[rr][cc] = v; mat[rr][cc] = m || 0; } }
    var E = { gates: [], plates: [], levers: [], glyphsets: [], murals: [], crates: [], rings: [], traps: [], boulders: [], chases: [], foes: [], relics: [], canteens: [], gems: [], checks: [], dark: [], torches: [], trees: [], plants: [], vines: [], statues: [], crumbles: [], movers: [], hints: [], waters: [], start: 2, exit: null };
    var pending = [];
    function span(a, b, fn) { for (var x = a; x <= b; x++) fn(x); }
    function sr(cc, rr) { return rr == null ? standRow(cc) : rr; }
    var B = {
      ground: function (c0, c1, top) { span(c0, c1, function (cc) { for (var rr = (top == null ? 10 : top); rr < ROWS; rr++) set(rr, cc, 1, 0); }); },
      block: function (c0, c1, r0, r1) { span(c0, c1, function (cc) { for (var rr = r0; rr <= r1; rr++) set(rr, cc, 1, 1); }); },
      ceiling: function (c0, c1, r1) { span(c0, c1, function (cc) { for (var rr = 0; rr <= r1; rr++) set(rr, cc, 1, 1); }); },
      pit: function (c0, c1) { span(c0, c1, function (cc) { for (var rr = 5; rr < ROWS; rr++) set(rr, cc, 0); }); },
      ledge: function (rr, c0, c1) { span(c0, c1, function (cc) { set(rr, cc, 2); }); },
      spikes: function (c0, c1, rr) { pending.unshift(function () { span(c0, c1, function (cc) { set(sr(cc, rr), cc, 3); }); }); },
      water: function (c0, c1, top) { span(c0, c1, function (cc) { for (var rr = top; rr < ROWS; rr++) set(rr, cc, 4); }); E.waters.push({ c0: c0, c1: c1, top: top }); },
      crumble: function (c0, c1, rr) { span(c0, c1, function (cc) { set(rr, cc, 5); E.crumbles.push({ c: cc, r: rr, state: 0, t: 0 }); }); },
      gate: function (cc, r0, r1) { for (var rr = r0; rr <= r1; rr++) set(rr, cc, 6); E.gates.push({ c: cc, r0: r0, r1: r1, open: 0, want: false, trig: [] }); },
      dark: function (c0, c1) { E.dark.push([c0, c1]); },
      start: function (cc) { E.start = cc; },
      exit: function (cc, rr) { pending.push(function () { E.exit = { c: cc, r: sr(cc, rr) }; }); },
      hint: function (cc, text) { E.hints.push({ c: cc, text: text, shown: false }); },
      tree: function (cc, s) { E.trees.push({ c: cc, s: s || 1 }); },
      plant: function (cc) { E.plants.push({ c: cc }); },
      vine: function (cc, r0, len) { E.vines.push({ c: cc, r0: r0, len: len }); },
      statue: function (cc, kind) { pending.push(function () { E.statues.push({ c: cc, r: standRow(cc), kind: kind }); }); },
      torch: function (cc, rr) { E.torches.push({ c: cc, r: rr }); },
      gems: function (c0, c1, rr) { span(c0, c1, function (cc) { E.gems.push({ c: cc, r: rr }); }); },
      relic: function (cc, rr) { E.relics.push({ c: cc, r: rr }); },
      canteen: function (cc, rr) { pending.push(function () { E.canteens.push({ c: cc, r: sr(cc, rr) }); }); },
      check: function (cc) { pending.push(function () { E.checks.push({ c: cc, r: standRow(cc) }); }); },
      foe: function (type, cc, o) { o = o || {}; pending.push(function () { E.foes.push({ type: type, c: cc, r: sr(cc, o.r), range: o.range || null, deco: !!o.deco }); }); },
      chase: function (trig, end) { E.chases.push({ trig: trig, end: end }); },
      boulder: function (trig) { E.boulders.push({ trig: trig }); },
      trap: function (cc, period, phase) { E.traps.push({ c: cc, period: period, phase: phase || 0 }); },
      ring: function (cc, rr) { E.rings.push({ c: cc, r: rr }); },
      lever: function (cc, rr) { E.levers.push({ c: cc, r: rr, on: false }); },
      plate: function (cc, rr) { pending.push(function () { E.plates.push({ c: cc, r: sr(cc, rr), down: false }); }); },
      crate: function (cc, rr) { pending.push(function () { E.crates.push({ c: cc, r: sr(cc, rr) }); }); },
      mural: function (cc, rr, set) { E.murals.push({ c: cc, r: rr, set: set }); },
      glyphs: function (cols, syms, order, set) { pending.push(function () { E.glyphsets.push({ c: cols[0], tiles: cols.map(function (x, i) { return { c: x, r: standRow(x), sym: syms[i], lit: false }; }), order: order, set: set, prog: 0, solved: false }); }); },
      mover: function (cc, w, rr, range, axis) { E.movers.push({ c: cc, w: w, r: rr, range: range, axis: axis }); }
    };
    // the row a thing stands in at column cc: below any ceiling, on the first floor
    function standRow(cc) {
      var rr = 0; while (rr < ROWS && grid[rr][cc] === 1) rr++;
      for (; rr < ROWS - 1; rr++) { var b = grid[rr + 1][cc]; if (b === 1 || b === 2 || b === 5 || b === 4) return rr; }
      return ROWS - 2;
    }
    def.build(B);
    pending.forEach(function (fn) { fn(); });
    E.gates.sort(function (a, b) { return a.c - b.c; });
    var prev = -1;
    E.gates.forEach(function (g) {
      function inside(o) { return o.c > prev && o.c < g.c; }
      E.plates.filter(inside).forEach(function (o) { g.trig.push(o); });
      E.levers.filter(inside).forEach(function (o) { g.trig.push(o); });
      E.glyphsets.filter(inside).forEach(function (o) { g.trig.push(o); });
      prev = g.c;
    });
    return { W: W, grid: grid, mat: mat, E: E, def: def };
  }
  function biomeNameAt(def, c) { var b = def.zones[0][1]; for (var i = 0; i < def.zones.length; i++) if (c >= def.zones[i][0]) b = def.zones[i][1]; return b; }
  function biomeAt(def, c) { return BIOMES[biomeNameAt(def, c)]; }
  function trigOk(o) { return o.forced ? true : o.solved != null ? o.solved : o.on != null ? o.on : o.down; }

  function mountGame(root, ctx) {
    var VIEWW = 480, VIEWH = ROWS * TILE, LH = VIEWH, MAXHEARTS = 3, STEP = 1 / 60;
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var COL = { gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680") };

    var canvas, cx, hudEl, live, keyfn = null, keyup = null, raf = null, last = 0, running = false, DPR = 1, acc = 0;
    var keys = {}, press = {}, st = null, best = AG.bestScore("treasure");
    var run = null;
    function factsForLevel(i) { return (DATA.facts || []).filter(function (f) { return (f.level | 0) === i; }); }

    /* ================= level instance ================= */
    function newLevel(li) {
      var def = LEVELS[li], lv = makeLevel(def), E = lv.E;
      st = { li: li, def: def, lv: lv, W: lv.W, LW: lv.W * TILE, hearts: run.hearts, got: 0, over: false, t: 0, cam: 0, shake: 0,
        parts: [], weather: [], spears: [], flashT: 0, rnd: rng(def.seed) };
      var cmap = {}; E.crumbles.forEach(function (k) { cmap[k.r * lv.W + k.c] = k; }); st.cmap = cmap;
      var gmap = {}; E.gates.forEach(function (g) { gmap[g.c] = g; }); st.gmap = gmap;
      var facts = factsForLevel(li);
      st.relics = E.relics.slice(0, facts.length).map(function (o, i) { return { x: o.c * TILE + TILE / 2, y: o.r * TILE + TILE / 2, got: false, fact: facts[i], kind: (li + i) % 4 }; });
      st.gems = E.gems.map(function (o) { return { x: o.c * TILE + TILE / 2, y: o.r * TILE + TILE / 2, got: false }; });
      st.canteens = E.canteens.map(function (o) { return { x: o.c * TILE + TILE / 2, y: (o.r + 1) * TILE - 8, got: false }; });
      st.crates = E.crates.map(function (o) { var y = (o.r + 1) * TILE - 11; return { x: o.c * TILE + TILE / 2, y: y, hw: 11, hh: 11, vx: 0, vy: 0, onGround: false, x0: o.c * TILE + TILE / 2, y0: y }; });
      st.movers = E.movers.map(function (o) { return { x: o.c * TILE, y: o.r * TILE, w: o.w * TILE, h: 9, axis: o.axis, x0: o.c * TILE, y0: o.r * TILE, range: o.range * TILE, ph: 0, dx: 0, dy: 0, speed: 0.9 }; });
      st.rings = E.rings.map(function (o) { return { x: o.c * TILE + TILE / 2, y: o.r * TILE + TILE / 2 }; });
      st.foes = E.foes.map(spawnFoe);
      st.boulders = E.boulders.map(function (o) { return { trig: o.trig * TILE, state: "idle", x: 0, y: 0, R: 26, vx: 0, vy: 0, rot: 0 }; });
      st.chases = E.chases.map(function (o) { return { trig: o.trig * TILE, end: o.end * TILE, state: "idle", x: 0, y: 0, hw: 22, hh: 13, vx: 0, vy: 0, onGround: false, stun: 0, pause: 0, gait: 0, dir: 1, pounce: 0 }; });
      st.checks = E.checks.map(function (o) { return { x: o.c * TILE + TILE / 2, y: (o.r + 1) * TILE, on: false }; });
      st.exit = E.exit ? { x: E.exit.c * TILE + TILE / 2, y: (E.exit.r + 1) * TILE } : { x: st.LW - 3 * TILE, y: 10 * TILE };
      var sy = standRowAt(E.start);
      st.spawn = { x: E.start * TILE + TILE / 2, y: (sy + 1) * TILE - 12.01 };
      st.p = { x: st.spawn.x, y: st.spawn.y, vx: 0, vy: 0, hw: 7, hh: 12, onGround: false, face: 1, run: 0, inv: 0, coyote: 0, buffer: 0, whip: null, swing: null, mover: null, push: 0, land: 0, onTile: -1, knock: 0, hand: null };
      st.cam = clamp(st.p.x - VIEWW * 0.4, 0, st.LW - VIEWW);
      buildScenery();
      prerenderTiles();
    }
    function spawnFoe(o) {
      var f = { type: o.type, x: o.c * TILE + TILE / 2, y: (o.r + 1) * TILE, dir: -1, alive: true, deco: o.deco, t: Math.random() * 6, stun: 0, state: "idle", vx: 0,
        x0: o.range ? o.range[0] * TILE : o.c * TILE - 4 * TILE, x1: o.range ? o.range[1] * TILE + TILE : o.c * TILE + 4 * TILE, home: o.c * TILE + TILE / 2 };
      if (o.type === "bat") { f.y = o.r * TILE + 6; f.hang = f.y; }
      if (o.type === "gharial") { f.y = 10 * TILE + 4; f.lunge = 0; f.lungeT = 0; f.cool = 0; }
      return f;
    }
    function standRowAt(c) {
      var g = st.lv.grid, rr = 0; while (rr < ROWS && g[rr][c] === 1) rr++;
      for (; rr < ROWS - 1; rr++) { var b = g[rr + 1][c]; if (b === 1 || b === 2 || b === 5 || b === 4) return rr; }
      return ROWS - 2;
    }

    /* ================= collision ================= */
    function tileV(c, r) { if (c < 0 || c >= st.W || r < 0 || r >= ROWS) return 0; return st.lv.grid[r][c]; }
    function solidAt(c, r) {
      if (c < 0 || c >= st.W) return true; if (r < 0 || r >= ROWS) return false;
      var t = st.lv.grid[r][c];
      if (t === 1) return true;
      if (t === 5) { var k = st.cmap[r * st.W + c]; return !!k && k.state < 2; }
      if (t === 6) return st.gmap[c].open < 0.7;
      return false;
    }
    function ledgeAt(c, r) { return tileV(c, r) === 2; }
    function moveX(e, dx) {
      e.x += dx; var hit = false;
      var r0 = Math.floor((e.y - e.hh + 1) / TILE), r1 = Math.floor((e.y + e.hh - 1) / TILE), r;
      if (dx > 0) { var c = Math.floor((e.x + e.hw) / TILE); for (r = r0; r <= r1; r++) if (solidAt(c, r)) { e.x = c * TILE - e.hw - 0.01; hit = true; break; } }
      else if (dx < 0) { var c2 = Math.floor((e.x - e.hw) / TILE); for (r = r0; r <= r1; r++) if (solidAt(c2, r)) { e.x = (c2 + 1) * TILE + e.hw + 0.01; hit = true; break; } }
      if (hit) e.vx = 0;
      return hit;
    }
    function moveY(e, dy, isPlayer) {
      var prevB = e.y + e.hh; e.y += dy; e.onGround = false; if (isPlayer) e.mover = null;
      var c0 = Math.floor((e.x - e.hw + 1) / TILE), c1 = Math.floor((e.x + e.hw - 1) / TILE), c;
      if (dy >= 0) {
        var rb = Math.floor((e.y + e.hh) / TILE);
        for (c = c0; c <= c1; c++) {
          if (solidAt(c, rb) || (ledgeAt(c, rb) && prevB <= rb * TILE + 0.5)) { e.y = rb * TILE - e.hh - 0.01; e.vy = 0; e.onGround = true; if (isPlayer) landOn(c, rb); break; }
        }
        if (!e.onGround) {                                       // moving platforms are solid from the top
          for (var i = 0; i < st.movers.length; i++) {
            var m = st.movers[i];
            if (e.x + e.hw > m.x && e.x - e.hw < m.x + m.w && prevB <= m.y + 1 + Math.max(0, m.dy) && e.y + e.hh >= m.y) { e.y = m.y - e.hh - 0.01; e.vy = 0; e.onGround = true; if (isPlayer) e.mover = m; break; }
          }
        }
        if (!e.onGround) {                                       // ...and so are crates
          for (var j = 0; j < st.crates.length; j++) {
            var k = st.crates[j], top = k.y - k.hh; if (k === e) continue;
            if (Math.abs(e.x - k.x) < e.hw + k.hw - 1 && prevB <= top + 1 && e.y + e.hh >= top) { e.y = top - e.hh - 0.01; e.vy = 0; e.onGround = true; break; }
          }
        }
      } else {
        var rt = Math.floor((e.y - e.hh) / TILE);
        for (c = c0; c <= c1; c++) if (solidAt(c, rt)) { e.y = (rt + 1) * TILE + e.hh + 0.01; e.vy = 0; break; }
      }
    }
    // stepping onto a crumbling tile starts it going
    function landOn(c, r) { var k = st.cmap[r * st.W + c]; if (k && k.state === 0) { k.state = 1; k.t = 0; } }
    function boxHit(a, bx, by, bw, bh) { return Math.abs(a.x - bx) < a.hw + bw && Math.abs(a.y - by) < a.hh + bh; }
    function overlapSolid(e) {
      var c0 = Math.floor((e.x - e.hw) / TILE), c1 = Math.floor((e.x + e.hw) / TILE), r0 = Math.floor((e.y - e.hh) / TILE), r1 = Math.floor((e.y + e.hh) / TILE);
      for (var c = c0; c <= c1; c++) for (var r = r0; r <= r1; r++) if (solidAt(c, r)) return true;
      return false;
    }

    /* ================= damage / respawn ================= */
    function loseHeart() {
      st.hearts -= 1; run.hearts = st.hearts; st.shake = Math.max(st.shake, 7); st.flashT = 0.28;
      if (st.hearts <= 0) { st.over = true; setTimeout(function () { endScreen(false); }, 800); return true; }
      return false;
    }
    function hurt(fromX) {
      var p = st.p; if (p.inv > 0 || st.over) return false;
      p.inv = 1.4; p.swing = null;
      var d = p.x >= fromX ? 1 : -1; p.vx = d * 4; p.vy = -5.5; p.knock = 0.25;
      burst(p.x, p.y, "#e8d2a0", 8);
      loseHeart();
      return true;
    }
    function respawn(why) {
      var p = st.p; if (st.over) return;
      if (why === "water") splash(p.x, 10 * TILE + 6);
      if (loseHeart()) return;
      var cp = null; st.checks.forEach(function (k) { if (k.on) cp = k; });
      var sx = cp ? cp.x : st.spawn.x, sy = cp ? cp.y - 12.01 : st.spawn.y;
      p.x = sx; p.y = sy; p.vx = 0; p.vy = 0; p.inv = 1.6; p.swing = null; p.whip = null; p.knock = 0;
      st.cam = clamp(p.x - VIEWW * 0.45, 0, st.LW - VIEWW);
      // set-pieces the player is now behind get re-armed
      st.boulders.forEach(function (b) { if (b.state === "roll") b.state = "idle"; });
      st.chases.forEach(function (ch) { if (ch.state !== "done" && ch.trig > sx - TILE) ch.state = "idle"; });
      toast("<strong>Back to the last camp.</strong> " + (why === "water" ? "The water nearly had you." : why === "boulder" ? "Flattened — go again, faster." : why === "spikes" ? "The pit was lined with bronze." : "That was a long way down."));
    }

    /* ================= update ================= */
    function step() {
      var p = st.p, dt = STEP; st.t += dt;
      if (st.over) { updateParts(dt); press = {}; return; }
      updateWorld(dt);
      if (p.swing) swingStep(); else movePlayer(dt);
      if (p.inv > 0) p.inv -= dt; if (p.knock > 0) p.knock -= dt;
      updateWhip(dt);
      interact();
      if (st.over) { press = {}; return; }
      updateFoes(dt); updateBoulders(); updateChases(dt); updateTraps(dt);
      updateParts(dt);
      var look = p.swing ? p.vx * 14 : p.face * 46 + p.vx * 6;
      var tx = clamp(p.x - VIEWW * 0.45 + look, 0, st.LW - VIEWW);
      st.cam += (tx - st.cam) * 0.09;
      if (st.shake > 0) st.shake = Math.max(0, st.shake - dt * 22);
      if (st.flashT > 0) st.flashT -= dt;
      if (p.y > LH + 30) respawn("fall");
      press = {};
    }
    function movePlayer(dt) {
      var p = st.p, ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      if (p.knock > 0) ax = 0;
      var a = p.onGround ? 0.55 : 0.36;
      if (ax) { p.vx += ax * a; p.face = ax; } else p.vx *= p.onGround ? 0.72 : 0.97;
      if (Math.abs(p.vx) < 0.05) p.vx = 0;
      // top speed; a swing release keeps its extra speed in the air and bleeds it off
      var cap = p.onGround ? 3.3 : Math.max(3.3, p.airCap || 0); p.airCap = p.onGround ? 0 : Math.max(0, (p.airCap || 0) - 0.03);
      if (p.knock <= 0) p.vx = clamp(p.vx, -cap, cap);
      if (press.jump) p.buffer = 8; else if (p.buffer > 0) p.buffer--;       // jump buffer
      if (p.onGround) p.coyote = 7; else if (p.coyote > 0) p.coyote--;       // coyote time
      if (p.buffer > 0 && p.coyote > 0) { p.vy = -8.8; p.coyote = 0; p.buffer = 0; p.onGround = false; puff(p.x, p.y + p.hh, 4); }
      if (!keys.jump && p.vy < -3.6 && p.knock <= 0 && !(p.fling > 0)) p.vy = -3.6;   // tap = hop, hold = full leap
      if (p.fling > 0) p.fling = Math.max(0, p.fling - dt);
      p.vy = Math.min(10, p.vy + 0.5);
      if (p.mover && p.onGround) { p.x += p.mover.dx; p.y += p.mover.dy; }
      var wasAir = !p.onGround, vyBefore = p.vy;
      moveX(p, p.vx); pushCrates(p);
      moveY(p, p.vy, true);
      if (p.onGround && wasAir && vyBefore > 3) { p.land = 0.16; puff(p.x, p.y + p.hh, 3); }
      if (p.land > 0) p.land -= dt;
      p.run += Math.abs(p.vx) * 0.19;
      p.x = clamp(p.x, TILE + p.hw, st.LW - TILE - p.hw);
    }
    function pushCrates(p) {
      p.push = 0;
      for (var i = 0; i < st.crates.length; i++) {
        var k = st.crates[i];
        if (Math.abs(p.y - k.y) >= p.hh + k.hh - 3) continue;
        var ov = (p.hw + k.hw) - Math.abs(p.x - k.x); if (ov <= 0) continue;
        var d = p.x < k.x ? 1 : -1;
        if (p.onGround && ((d > 0 && p.vx > 0) || (d < 0 && p.vx < 0))) {
          var before = k.x; if (!k.locked) moveX(k, d * ov); p.vx *= 0.55;
          if (Math.abs(k.x - before) < ov - 0.1) p.x = k.x - d * (k.hw + p.hw + 0.01);
          p.push = d;
        } else p.x = k.x - d * (k.hw + p.hw + 0.01);
      }
    }
    function swingStep() {
      var p = st.p, s = p.swing, ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      s.om += -(0.5 / s.L) * Math.sin(s.th);
      if (ax && (s.om === 0 || (s.om > 0 ? 1 : -1) === ax)) s.om += ax * 0.0011;      // pump with the swing
      s.om *= 0.998; s.th += s.om;
      var nx = s.ax + s.L * Math.sin(s.th), ny = s.ay + s.L * Math.cos(s.th);
      var ox = p.x, oy = p.y; p.x = nx; p.y = ny;
      if (overlapSolid(p)) { p.x = ox; p.y = oy; s.th -= s.om; s.om *= -0.35; }
      p.vx = p.x - ox; p.vy = p.y - oy; if (Math.abs(p.vx) > 0.2) p.face = p.vx > 0 ? 1 : -1;
      if (press.jump || press.down) {
        p.swing = null; p.whip = null; if (press.jump) { p.vy = Math.min(p.vy, 0) - 4.4; p.fling = 0.35; }
        p.vx = clamp(p.vx * 1.1, -6, 6); p.airCap = Math.abs(p.vx); p.knock = 0;
      }
    }

    /* ---------------- the whip ---------------- */
    function whipOrigin() { var p = st.p; return { x: p.x + p.face * 5, y: p.y - 7 }; }
    function updateWhip(dt) {
      var p = st.p;
      if (press.whip && !p.whip && !p.swing) {
        var o = whipOrigin(), up = false;
        // aim up by itself at a lever overhead
        st.lv.E.levers.forEach(function (lv) { if (lv.on) return; var dx = (lv.c * TILE + 12 - o.x) * p.face, dy = lv.r * TILE + 12 - o.y; if (dx > -6 && dx < 100 && dy < -26 && dy > -110) up = true; });
        p.whip = { t: 0, up: up, done: false };
        // a ring within reach, above and ahead? latch and swing instead
        var bestR = null, bd = 1e9;
        st.rings.forEach(function (rg) { var dx = rg.x - o.x, dy = rg.y - o.y, d = Math.hypot(dx, dy); if (d < 160 && dy < -18 && dx * p.face > -26 && d < bd) { bd = d; bestR = rg; } });
        if (bestR) {
          var L = clamp(Math.hypot(p.x - bestR.x, p.y - bestR.y), 48, 104), th = Math.atan2(p.x - bestR.x, p.y - bestR.y);
          p.swing = { ax: bestR.x, ay: bestR.y, L: L, th: th, om: (p.vx * Math.cos(th) - p.vy * Math.sin(th)) / L };
          var ox = p.x, oy = p.y; p.x = bestR.x + L * Math.sin(th); p.y = bestR.y + L * Math.cos(th);
          if (overlapSolid(p)) { p.x = ox; p.y = oy; p.swing.L = Math.hypot(p.x - bestR.x, p.y - bestR.y); }
          p.onGround = false; p.whip = null;
          spark(bestR.x, bestR.y, 6);
        }
      }
      if (!p.whip) return;
      p.whip.t += dt;
      if (!p.whip.done && p.whip.t >= 0.1) { p.whip.done = true; whipHit(); }
      if (p.whip.t > 0.3) p.whip = null;
    }
    function whipDir() { var up = st.p.whip && st.p.whip.up; return { x: st.p.face * (up ? 0.62 : 0.97), y: up ? -0.78 : -0.22 }; }
    function whipHit() {
      var o = whipOrigin(), d = whipDir(), reach = st.p.whip.up ? 112 : 84, pts = [];
      for (var i = 2; i <= 8; i++) pts.push({ x: o.x + d.x * reach * i / 8, y: o.y + d.y * reach * i / 8 });
      var tip = pts[pts.length - 1]; spark(tip.x, tip.y, 5);
      function hits(x, y, hw, hh) { for (var j = 0; j < pts.length; j++) if (Math.abs(pts[j].x - x) < hw + 4 && Math.abs(pts[j].y - y) < hh + 4) return true; return false; }
      st.foes.forEach(function (f) {
        if (!f.alive || f.deco) return; var bb = foeBox(f); if (!hits(bb.x, bb.y, bb.hw, bb.hh)) return;
        if (f.type === "lion" || f.type === "leopard") { f.stun = 2.2; f.vx = st.p.face * 2.5; burst(bb.x, bb.y - 6, "#fff2c0", 6); toast("The " + f.type + " staggers back — go!"); }
        else if (f.type === "gharial") { f.lungeT = 0; f.lunge = 0; f.cool = 2.5; burst(bb.x, bb.y, "#bfe8ff", 6); }
        else { f.alive = false; run.score += 50; poof(bb.x, bb.y); }
      });
      st.chases.forEach(function (ch) {
        if (ch.state === "run" && hits(ch.x, ch.y, ch.hw, ch.hh)) { ch.stun = 1.3; ch.vx = st.p.face * 3; ch.vy = -2; burst(ch.x, ch.y - 8, "#fff2c0", 8); st.shake = 3; }
      });
      st.lv.E.levers.forEach(function (lv) {
        var lx = lv.c * TILE + TILE / 2, ly = lv.r * TILE + TILE / 2;
        if (!lv.on && hits(lx, ly, 10, 12)) { lv.on = true; spark(lx, ly, 10); st.shake = 3; toast("<strong>Clack.</strong> Something heavy shifts inside the wall."); }
      });
    }

    /* ---------------- world objects ---------------- */
    function updateWorld(dt) {
      var p = st.p;
      st.movers.forEach(function (m) {
        m.ph += dt * m.speed; var s = (1 - Math.cos(m.ph)) / 2, ox = m.x, oy = m.y;
        if (m.axis === "x") m.x = m.x0 + s * m.range; else m.y = m.y0 - s * m.range;
        m.dx = m.x - ox; m.dy = m.y - oy;
      });
      st.lv.E.crumbles.forEach(function (k) {
        if (k.state === 1) { k.t += dt; if (k.t > 0.42) { k.state = 2; k.t = 0; for (var i = 0; i < 4; i++) st.parts.push({ k: "rubble", x: k.c * TILE + 4 + i * 5, y: k.r * TILE + 6, vx: (Math.random() - 0.5) * 1.5, vy: -Math.random(), life: 1.4, col: "#7a6450" }); } }
        else if (k.state === 2) { k.t += dt; if (k.t > 3.2 && !boxHit(p, k.c * TILE + 12, k.r * TILE + 12, 12, 12)) { k.state = 0; k.t = 0; } }
      });
      st.crates.forEach(function (k) {
        k.vy = Math.min(9, k.vy + 0.5); moveY(k, k.vy, false); if (k.y > LH + 60) { k.x = k.x0; k.y = k.y0; k.vy = 0; }
      });
      st.lv.E.plates.forEach(function (pl) {
        var px = pl.c * TILE + TILE / 2, fy = (pl.r + 1) * TILE, was = pl.down;
        // a crate pushed over a plate drops into its socket and stays
        st.crates.forEach(function (k) { if (!k.locked && Math.abs(k.x - px) < 15 && Math.abs(k.y + k.hh - fy) < 3) { k.locked = true; k.x = px; spark(px, fy - 4, 6); } });
        pl.down = (p.onGround && Math.abs(p.x - px) < 12 && Math.abs(p.y + p.hh - fy) < 3) ||
          st.crates.some(function (k) { return Math.abs(k.x - px) < 2 && Math.abs(k.y + k.hh - fy) < 3; });
        if (pl.down && !was) { st.shake = Math.max(st.shake, 2); puff(px, fy, 3); }
      });
      st.lv.E.gates.forEach(function (g) {
        var want = g.trig.length > 0 && g.trig.every(trigOk);
        if (want && !g.want) { st.shake = Math.max(st.shake, 4); toast("<strong>A door grinds open.</strong>"); }
        g.want = want;
        g.open = clamp(g.open + (want ? dt * 0.9 : -dt * 1.4), 0, 1);
        if (g.open < 0.7 && Math.abs(p.x - (g.c * TILE + 12)) < 18 && overlapSolid(p)) p.x = g.c * TILE - p.hw - 0.5;
      });
    }
    function interact() {
      var p = st.p;
      st.relics.forEach(function (rl) { if (!rl.got && Math.abs(rl.x - p.x) < 16 && Math.abs(rl.y - p.y) < 20) { rl.got = true; st.got++; run.score += 100; run.collected.push(rl.fact); showFact(rl.fact); sparkle(rl.x, rl.y); } });
      st.gems.forEach(function (g) { if (!g.got && Math.abs(g.x - p.x) < 12 && Math.abs(g.y - p.y) < 16) { g.got = true; run.score += 10; spark(g.x, g.y, 3); } });
      st.canteens.forEach(function (k) { if (!k.got && Math.abs(k.x - p.x) < 12 && Math.abs(k.y - p.y) < 18) { k.got = true; st.hearts = Math.min(MAXHEARTS, st.hearts + 1); run.hearts = st.hearts; toast("<strong>Water.</strong> A canteen left by the last expedition — one heart back."); sparkle(k.x, k.y); } });
      st.checks.forEach(function (k) { if (!k.on && Math.abs(k.x - p.x) < 18 && Math.abs(k.y - (p.y + p.hh)) < 30) { st.checks.forEach(function (o) { if (o.x < k.x) o.on = true; }); k.on = true; sparkle(k.x, k.y - 20); } });
      st.lv.E.hints.forEach(function (h) { if (!h.shown && p.x > h.c * TILE) { h.shown = true; toast(h.text); } });
      st.lv.E.levers.forEach(function (lv) { if (!lv.on && Math.abs(p.x - (lv.c * TILE + 12)) < 14 && Math.abs(p.y - (lv.r * TILE + 12)) < 18) { lv.on = true; toast("<strong>Clack.</strong> The lever drops."); } });
      // glyph floors: register the sign you step onto
      var onT = -1, gs = null;
      if (p.onGround) st.lv.E.glyphsets.forEach(function (set) { set.tiles.forEach(function (tl, i) { if (Math.abs(p.x - (tl.c * TILE + 12)) < 10 && Math.abs(p.y + p.hh - (tl.r + 1) * TILE) < 3) { onT = tl.c; gs = { set: set, i: i }; } }); });
      if (onT !== p.onTile) { p.onTile = onT; if (gs) stepGlyph(gs.set, gs.i); }
      st.lv.E.murals.forEach(function (m) { if (!m.read && Math.abs(p.x - (m.c * TILE + 12)) < 30) { m.read = true; toast("<strong>The order:</strong> " + GLYPHS[m.set].gloss.join(" · ") + "."); } });
      // water + spikes
      var c0 = Math.floor((p.x - p.hw + 2) / TILE), c1 = Math.floor((p.x + p.hw - 2) / TILE), r0 = Math.floor((p.y - p.hh + 2) / TILE), r1 = Math.floor((p.y + p.hh + 1) / TILE);
      for (var c = c0; c <= c1; c++) for (var r = r0; r <= r1; r++) {
        var t = tileV(c, r);
        if (t === 4 && p.y + p.hh > r * TILE + 8) { respawn("water"); return; }
        if (t === 3 && p.y + p.hh > r * TILE + 12) { if (r >= ROWS - 1) { respawn("spikes"); return; } if (hurt(p.x - p.face * 10)) p.vy = -7; }
      }
      if (!st.over && Math.abs(st.exit.x - p.x) < 14 && Math.abs(st.exit.y - (p.y + p.hh)) < 10 && p.onGround) { st.over = true; st.won = true; sparkle(st.exit.x, st.exit.y - 20); setTimeout(clearedSite, 450); }
    }
    function stepGlyph(set, i) {
      if (set.solved) return;
      var need = set.order[set.prog], tl = set.tiles[i];
      if (tl.lit) return;
      if (tl.sym === need) {
        tl.lit = true; set.prog++; spark(tl.c * TILE + 12, (tl.r + 1) * TILE - 4, 6);
        if (set.prog >= set.order.length) { set.solved = true; toast("<strong>The floor answers.</strong> Deep in the wall, a bar slides back."); st.shake = 5; }
      } else {
        set.prog = 0; set.tiles.forEach(function (x) { x.lit = false; }); st.shake = 4;
        burst(tl.c * TILE + 12, (tl.r + 1) * TILE - 4, "#c86a4a", 6);
        toast("<strong>Wrong sign</strong> — the floor goes dark. Read the wall again.");
      }
    }

    /* ---------------- creatures ---------------- */
    function foeBox(f) {
      switch (f.type) {
        case "cobra": return { x: f.x, y: f.y - 9, hw: 8, hh: 9 };
        case "scorpion": return { x: f.x, y: f.y - 5, hw: 9, hh: 5 };
        case "bat": return { x: f.x, y: f.y, hw: 8, hh: 5 };
        case "lion": case "leopard": return { x: f.x, y: f.y - 13, hw: 20, hh: 12 };
        case "gharial": return { x: f.x, y: f.y - (f.lunge || 0) * 26, hw: 16, hh: 7 };
        default: return { x: f.x, y: f.y - 10, hw: 8, hh: 8 };
      }
    }
    function groundAhead(x, y, dir) { var c = Math.floor((x + dir * 12) / TILE), r = Math.floor((y + 2) / TILE); return solidAt(c, r) || ledgeAt(c, r); }
    function wallAhead(x, y, dir) { var c = Math.floor((x + dir * 12) / TILE), r = Math.floor((y - 6) / TILE); return solidAt(c, r); }
    function updateFoes(dt) {
      var p = st.p;
      st.foes.forEach(function (f) {
        f.t += dt;
        if (f.deco) { if (f.type === "peacock") { f.x = f.home + Math.sin(f.t * 0.3) * 20; f.dir = Math.cos(f.t * 0.3) > 0 ? 1 : -1; f.fan = Math.max(0, Math.sin(f.t * 0.5)); } else f.x = f.home + Math.sin(f.t * 0.2) * 10; return; }
        if (!f.alive || Math.abs(f.x - p.x) > VIEWW * 1.2) return;
        if (f.type === "cobra" || f.type === "scorpion") {
          var sp = f.type === "cobra" ? 0.45 : 0.7;
          if (f.type === "cobra" && Math.abs(p.x - f.x) < 60 && Math.abs(p.y - f.y) < 40) { f.dir = p.x < f.x ? -1 : 1; f.rear = Math.min(1, (f.rear || 0) + dt * 4); sp = 0; } else f.rear = Math.max(0, (f.rear || 0) - dt * 3);
          f.x += f.dir * sp; if (!groundAhead(f.x, f.y, f.dir) || wallAhead(f.x, f.y, f.dir) || f.x < f.x0 || f.x > f.x1) f.dir *= -1;
        } else if (f.type === "bat") {
          if (f.state === "idle" && Math.abs(p.x - f.x) < 90 && p.y > f.y) { f.state = "swoop"; f.st = 0; f.sx = f.x; f.tx = p.x; }
          if (f.state === "swoop") { f.st += dt; var u = f.st / 1.6; f.x = lerp(f.sx, f.tx + (f.tx - f.sx) * 0.8, u); f.y = f.hang + Math.sin(u * Math.PI) * 80; if (u >= 1) { f.state = "idle"; f.hang = f.y; } }
        } else if (f.type === "lion" || f.type === "leopard") {
          if (f.stun > 0) { f.stun -= dt; f.x += f.vx; f.vx *= 0.9; }
          else {
            var near = Math.abs(p.x - f.x) < 150 && Math.abs(p.y - (f.y - 12)) < 36;
            if (near) { f.dir = p.x < f.x ? -1 : 1; f.state = "charge"; } else f.state = "walk";
            var spd = f.state === "charge" ? (f.type === "leopard" ? 2.6 : 2.3) : 0.6, nx = f.x + f.dir * spd;
            if (nx < f.x0 + 20 || nx > f.x1 - 20 || !groundAhead(nx, f.y, f.dir)) { if (f.state !== "charge") f.dir *= -1; } else f.x = nx;
            f.gait = (f.gait || 0) + spd * 0.09;
          }
        } else if (f.type === "gharial") {
          f.cool = Math.max(0, f.cool - dt);
          var over = Math.abs(p.x - f.x) < 34 && p.y < f.y && p.y > f.y - 110;
          if (over && !f.cool && !f.lungeT) { f.lungeT = 0.001; f.dir = p.x < f.x ? -1 : 1; }
          if (f.lungeT) { f.lungeT += dt; f.lunge = Math.sin(Math.min(1, f.lungeT / 0.7) * Math.PI); if (f.lungeT > 0.7) { f.lungeT = 0; f.lunge = 0; f.cool = 1.4; } }
          else f.x = f.home + Math.sin(f.t * 0.6) * 12;
        }
        var bb = foeBox(f);
        if (!(f.stun > 0) && boxHit(p, bb.x, bb.y, bb.hw, bb.hh)) {
          var small = (f.type === "cobra" || f.type === "scorpion" || f.type === "bat");
          if (small && p.vy > 1 && p.y + p.hh < bb.y + 2) { f.alive = false; p.vy = -6.5; run.score += 50; poof(bb.x, bb.y); }
          else if ((f.type === "lion" || f.type === "leopard") && p.vy > 1 && p.y + p.hh < bb.y - 4) { f.stun = 1.6; f.vx = 0; p.vy = -7.5; burst(bb.x, bb.y - 10, "#fff2c0", 6); }
          else if (f.type !== "gharial" || f.lunge > 0.25) hurt(bb.x);
        }
      });
    }
    function updateBoulders() {
      var p = st.p;
      st.boulders.forEach(function (b) {
        if (b.state === "idle" && p.x > b.trig && p.x < b.trig + 3 * TILE) {
          var c0 = Math.max(2, Math.floor(b.trig / TILE) - 13);
          b.state = "roll"; b.x = c0 * TILE; b.y = (standRowAt(c0) + 1) * TILE - b.R; b.vx = 1.5; b.vy = 0; st.shake = 8;
        }
        if (b.state !== "roll") return;
        b.vx = Math.min(3.05, b.vx + 0.05); b.x += b.vx; b.rot += b.vx / b.R;
        st.shake = Math.max(st.shake, 2.4);
        var lead = Math.floor((b.x + b.R * 0.75) / TILE), bottomRow = Math.floor((b.y + b.R - 2) / TILE), wall = false;
        for (var r = Math.floor((b.y - b.R * 0.6) / TILE); r < bottomRow; r++) if (solidAt(lead, r)) wall = true;
        if (wall) { b.state = "done"; debris(b.x + b.R * 0.5, b.y); st.shake = 12; return; }
        var cc = Math.floor(b.x / TILE), rr = Math.floor(b.y / TILE), topY = null;
        for (var r2 = Math.max(0, rr); r2 < ROWS; r2++) if (solidAt(cc, r2)) { topY = r2 * TILE; break; }
        if (topY == null) { b.vy += 0.5; b.y += b.vy; if (b.y > LH + b.R * 2) { b.state = "done"; st.shake = 10; debris(b.x, LH - 10); } }
        else { var want = topY - b.R; if (b.y < want) { b.vy += 0.5; b.y = Math.min(want, b.y + b.vy); if (b.y === want) b.vy = 0; } else if (b.y - want < TILE + 2) b.y = want; }
        if (Math.hypot(clamp(b.x, p.x - p.hw, p.x + p.hw) - b.x, clamp(b.y, p.y - p.hh, p.y + p.hh) - b.y) < b.R - 3) { b.state = "idle"; respawn("boulder"); return; }
        if (Math.random() < 0.4) st.parts.push({ k: "dust", x: b.x - b.R * 0.6, y: b.y + b.R - 2, vx: -Math.random(), vy: -Math.random() * 0.8, life: 0.8, col: "rgba(200,170,120,.5)" });
      });
    }
    function updateChases(dt) {
      var p = st.p;
      st.chases.forEach(function (ch) {
        if (ch.state === "idle" && p.x > ch.trig && p.x < ch.end) { ch.state = "run"; ch.x = Math.max(TILE * 2, st.cam - 40); ch.y = (standRowAt(Math.floor(ch.x / TILE)) + 1) * TILE - ch.hh - 0.01; ch.vx = 2; ch.vy = 0; ch.pause = 0.4; st.shake = 5; }
        if (ch.state === "idle" || ch.state === "done") return;
        ch.gait += Math.abs(ch.vx) * 0.075;
        if (ch.state === "leave") { ch.dir = -1; ch.vx = -2.4; ch.vy = Math.min(10, ch.vy + 0.5); moveX(ch, ch.vx); moveY(ch, ch.vy, false); if (ch.x < st.cam - 80) ch.state = "done"; return; }
        if (p.x > ch.end) { ch.state = "leave"; toast("<strong>The tiger stops at the walls</strong>, tail lashing — and slips back into the trees."); return; }
        var dir = p.x > ch.x ? 1 : -1; ch.dir = dir;
        if (ch.stun > 0) { ch.stun -= dt; ch.vx *= 0.92; }
        else if (ch.pause > 0) { ch.pause -= dt; ch.vx *= 0.85; }
        else {
          var dist = Math.abs(p.x - ch.x), top = dist > 160 ? 3.35 : 3.05;
          ch.vx = clamp(ch.vx + dir * 0.14, -top, top);
          if (ch.onGround) {
            var aheadC = Math.floor((ch.x + dir * (ch.hw + 10)) / TILE), footR = Math.floor((ch.y + ch.hh + 4) / TILE), bodyR = Math.floor(ch.y / TILE);
            var gap = !solidAt(aheadC, footR) && !ledgeAt(aheadC, footR), wall = solidAt(aheadC, bodyR);
            if (gap || wall) { ch.vy = -8.6; ch.vx = dir * 3.6; }
            else if (dist < 64 && Math.abs(p.y - ch.y) < 30 && Math.random() < 0.05) { ch.vy = -5.5; ch.vx = dir * 5; ch.pounce = 0.5; }
          }
        }
        ch.vy = Math.min(10, ch.vy + 0.5);
        moveX(ch, ch.vx); moveY(ch, ch.vy, false);
        if (ch.pounce > 0) ch.pounce -= dt;
        if (ch.y > LH + 40) { ch.x = Math.max(TILE * 2, st.cam - 50); ch.y = 9 * TILE - ch.hh; ch.vy = 0; ch.pause = 0.8; }
        if (ch.stun <= 0 && ch.pause <= 0 && boxHit(p, ch.x, ch.y, ch.hw - 4, ch.hh)) { if (hurt(ch.x)) { ch.pause = 1.3; ch.vx = -dir * 1.5; p.vx = dir * 5.5; } }
      });
    }
    function updateTraps(dt) {
      var p = st.p;
      st.lv.E.traps.forEach(function (tr) {
        var ph = ((st.t + tr.phase) % tr.period) / tr.period, x = tr.c * TILE + TILE / 2;
        if (Math.abs(x - p.x) > VIEWW) return;
        tr.warn = ph > 0.62 && ph < 0.8;
        if (tr.warn && Math.random() < 0.3) st.parts.push({ k: "dust", x: x + (Math.random() - 0.5) * 10, y: 4 * TILE + 2, vx: 0, vy: 0.8, life: 0.7, col: "rgba(210,190,150,.6)" });
        if (ph >= 0.8 && !tr.fired) { tr.fired = true; st.spears.push({ x: x, y: 4 * TILE - 30, vy: 0 }); }
        if (ph < 0.8) tr.fired = false;
      });
      for (var i = st.spears.length - 1; i >= 0; i--) {
        var s = st.spears[i];
        if (!s.stuck) { s.vy = Math.min(12, s.vy + 1.1); s.y += s.vy; var r = Math.floor((s.y + 16) / TILE), c = Math.floor(s.x / TILE); if (solidAt(c, r) || tileV(c, r) === 2) { s.stuck = true; s.y = r * TILE - 16; s.st = 0; puff(s.x, r * TILE, 3); } }
        else { s.st += dt; if (s.st > 0.5) { st.spears.splice(i, 1); continue; } }
        if (!s.stuck && Math.abs(s.x - p.x) < p.hw + 2 && s.y + 16 > p.y - p.hh && s.y - 16 < p.y + p.hh) hurt(s.x);
      }
    }

    /* ---------------- particles ---------------- */
    function puff(x, y, n) { for (var i = 0; i < n; i++) st.parts.push({ k: "dust", x: x + (Math.random() - 0.5) * 8, y: y, vx: (Math.random() - 0.5) * 1.6, vy: -Math.random() * 1.2, life: 0.7, col: "rgba(214,190,146,.55)" }); }
    function spark(x, y, n) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 1 + Math.random() * 2.5; st.parts.push({ k: "spark", x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4, col: "#fff0b0" }); } }
    function sparkle(x, y) { for (var i = 0; i < 14; i++) { var a = i / 14 * 6.28; st.parts.push({ k: "spark", x: x, y: y, vx: Math.cos(a) * 2.2, vy: Math.sin(a) * 2.2, life: 0.8, col: COL.goldB }); } }
    function burst(x, y, col, n) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 1 + Math.random() * 2; st.parts.push({ k: "spark", x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 0.5, col: col }); } }
    function poof(x, y) { for (var i = 0; i < 8; i++) { var a = i / 8 * 6.28; st.parts.push({ k: "dust", x: x, y: y, vx: Math.cos(a) * 1.4, vy: Math.sin(a) * 1.4, life: 0.6, col: "rgba(236,226,200,.7)" }); } }
    function splash(x, y) { for (var i = 0; i < 16; i++) st.parts.push({ k: "drop", x: x + (Math.random() - 0.5) * 16, y: y, vx: (Math.random() - 0.5) * 3, vy: -2 - Math.random() * 4, life: 0.9, col: "rgba(190,230,240,.8)" }); }
    function debris(x, y) { for (var i = 0; i < 18; i++) st.parts.push({ k: "rubble", x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.3) * 5, vy: -Math.random() * 5, life: 1.6, col: i % 2 ? "#8a7458" : "#5e4c38" }); }
    function updateParts(dt) {
      for (var i = st.parts.length - 1; i >= 0; i--) {
        var q = st.parts[i]; q.x += q.vx; q.y += q.vy; q.life -= dt;
        if (q.k === "rubble" || q.k === "drop") q.vy += 0.3; else if (q.k === "dust") { q.vy *= 0.96; q.vx *= 0.96; } else q.vy += 0.05;
        if (q.life <= 0) st.parts.splice(i, 1);
      }
    }

    /* =================================================================
       RENDERING
       ================================================================= */
    var tileCv = null, TSC = 1;
    function isDark(c) { return st.lv.E.dark.some(function (d) { return c >= d[0] && c <= d[1]; }); }
    function prerenderTiles() {
      var lv = st.lv, W = lv.W, g = lv.grid, m = lv.mat, R = st.rnd;
      TSC = Math.min(2, DPR);
      tileCv = document.createElement("canvas"); tileCv.width = Math.ceil(W * TILE * TSC); tileCv.height = Math.ceil(LH * TSC);
      var t = tileCv.getContext("2d"); t.scale(TSC, TSC);
      // interior back walls behind the dark zones
      st.lv.E.dark.forEach(function (d) {
        var Bm = biomeAt(st.def, d[0]), x0 = d[0] * TILE, x1 = (d[1] + 1) * TILE;
        var gr = t.createLinearGradient(0, 0, 0, LH); gr.addColorStop(0, shade(Bm.back, -0.2)); gr.addColorStop(1, Bm.back);
        t.fillStyle = gr; t.fillRect(x0, 0, x1 - x0, LH);
        t.strokeStyle = "rgba(0,0,0,.28)"; t.lineWidth = 1;
        for (var yy = 0; yy < LH; yy += 12) { t.beginPath(); t.moveTo(x0, yy + 0.5); t.lineTo(x1, yy + 0.5); t.stroke(); for (var xx = x0 + ((yy / 12) % 2) * 12; xx < x1; xx += 24) { t.beginPath(); t.moveTo(xx + 0.5, yy); t.lineTo(xx + 0.5, yy + 12); t.stroke(); } }
        t.fillStyle = "rgba(160,110,60,.16)"; t.fillRect(x0, 5 * TILE - 6, x1 - x0, 4);
        for (var fx = x0 + 18; fx < x1; fx += 46) { t.fillStyle = "rgba(200,150,80,.10)"; t.fillRect(fx, 5 * TILE - 2, 8, 30); t.beginPath(); t.arc(fx + 4, 5 * TILE - 8, 4, 0, 7); t.fill(); }
      });
      for (var c = 0; c < W; c++) {
        var Bc = biomeAt(st.def, c), dk = isDark(c), bname = biomeNameAt(st.def, c);
        for (var r = 0; r < ROWS; r++) {
          var val = g[r][c], x = c * TILE, y = r * TILE;
          if (val === 1) {
            var above = r > 0 ? g[r - 1][c] : 1, exposed = above !== 1 && above !== 5;
            if (m[r][c] === 1 || dk) drawBrick(t, x, y, Bc, bname, R, dk, exposed, c, r);
            else drawSoil(t, x, y, Bc, R, exposed, r);
          } else if (val === 2) {
            t.fillStyle = shade(Bc.ledge, 0.1); t.fillRect(x, y, TILE, 6); t.fillStyle = shade(Bc.ledge, -0.35); t.fillRect(x, y + 6, TILE, 2);
            t.strokeStyle = "rgba(0,0,0,.35)"; t.beginPath(); t.moveTo(x + TILE - 0.5, y); t.lineTo(x + TILE - 0.5, y + 6); t.stroke();
            t.fillStyle = "rgba(255,255,255,.14)"; t.fillRect(x, y, TILE, 1);
            if (!dk && R() < 0.35) { t.fillStyle = shade(Bc.top, -0.1); t.fillRect(x + R() * 16, y - 2, 6, 2); }
          } else if (val === 3) {
            for (var s = 0; s < 4; s++) {
              var sx = x + s * 6 + 1, gy2 = y + TILE, sg = t.createLinearGradient(sx, 0, sx + 5, 0); sg.addColorStop(0, "#6a5a44"); sg.addColorStop(0.5, "#e0d4b4"); sg.addColorStop(1, "#6a5a44");
              t.fillStyle = sg; t.beginPath(); t.moveTo(sx, gy2); t.lineTo(sx + 2.5, y + 8 + (s % 2) * 3); t.lineTo(sx + 5, gy2); t.closePath(); t.fill();
            }
          }
        }
      }
    }
    function drawSoil(t, x, y, B, R, exposed, r) {
      var gr = t.createLinearGradient(0, y, 0, y + TILE);
      if (r > 10) { gr.addColorStop(0, B.soil[1]); gr.addColorStop(1, B.soil[2]); } else { gr.addColorStop(0, B.soil[0]); gr.addColorStop(1, B.soil[1]); }
      t.fillStyle = gr; t.fillRect(x, y, TILE, TILE);
      for (var i = 0; i < 5; i++) { t.fillStyle = R() < 0.5 ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.07)"; t.fillRect(x + R() * 22, y + R() * 22, 2 + R() * 3, 1.5 + R() * 2); }
      if (R() < 0.3) { t.fillStyle = "rgba(0,0,0,.18)"; t.beginPath(); t.ellipse(x + 6 + R() * 12, y + 8 + R() * 10, 4, 2.5, 0, 0, 7); t.fill(); }
      if (exposed) {
        t.fillStyle = B.top; t.fillRect(x, y, TILE, 4);
        t.fillStyle = shade(B.top, -0.28); t.fillRect(x, y + 4, TILE, 2);
        for (var b = 0; b < 6; b++) { var bx = x + R() * TILE, bh = 2 + R() * 4; t.fillStyle = R() < 0.5 ? shade(B.top, 0.18) : shade(B.top, -0.1); t.beginPath(); t.moveTo(bx - 1.2, y + 1); t.lineTo(bx + (R() - 0.5) * 2, y - bh); t.lineTo(bx + 1.2, y + 1); t.fill(); }
      }
    }
    function drawBrick(t, x, y, B, bname, R, dk, exposed, c, r) {
      var base = B.built[0], edge = B.built[1];
      if (bname === "egypt" && dk) { base = "#b89868"; edge = "#7a6040"; }
      t.fillStyle = base; t.fillRect(x, y, TILE, TILE);
      var rows = bname === "china" ? 4 : 2, h = TILE / rows;                 // Shang walls: rammed-earth layers
      for (var i = 0; i < rows; i++) {
        var yy = y + i * h;
        t.fillStyle = "rgba(255,255,255," + (0.04 + R() * 0.06) + ")"; t.fillRect(x, yy, TILE, 1);
        t.fillStyle = "rgba(0,0,0,.26)"; t.fillRect(x, yy + h - 1, TILE, 1);
        if (bname !== "china") { var off = ((i + r + c) % 2) * 12; t.fillRect(x + off, yy, 1, h); if (off === 0) t.fillRect(x + 12, yy, 1, h); }
        t.fillStyle = "rgba(0,0,0," + (R() * 0.12) + ")"; t.fillRect(x + 1, yy + 1, TILE - 2, h - 2);
      }
      if (bname === "egypt" && dk && R() < 0.12) { t.strokeStyle = "rgba(90,60,30,.5)"; t.lineWidth = 1; t.beginPath(); t.arc(x + 12, y + 9, 3, 0, 7); t.moveTo(x + 12, y + 12); t.lineTo(x + 12, y + 20); t.moveTo(x + 8, y + 14); t.lineTo(x + 16, y + 14); t.stroke(); }
      if (exposed && !dk) { t.fillStyle = shade(B.top, -0.05); t.fillRect(x, y, TILE, 2); if (R() < 0.5) { t.fillStyle = B.top; t.fillRect(x + R() * 16, y - 1, 5 + R() * 4, 2); } }
      t.strokeStyle = edge; t.globalAlpha = 0.35; t.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1); t.globalAlpha = 1;
    }
    function shade(hex, k) {
      var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      if (k >= 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
      return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
    }
    function hexA(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }

    function buildScenery() {
      var R = rng(st.def.seed * 7 + 3), sc = { mid: [], clouds: [], birds: [], fg: [] };
      for (var i = 0; i < 26; i++) sc.clouds.push({ x: R() * 1300, y: 20 + R() * 70, w: 50 + R() * 90, s: 0.04 + R() * 0.05 });
      for (var j = 0; j < 40; j++) sc.mid.push({ x: j * 90 + R() * 60, s: 0.7 + R() * 0.5 });
      for (var k = 0; k < 7; k++) sc.birds.push({ x: R() * 900, y: 30 + R() * 60, s: 0.3 + R() * 0.3, ph: R() * 6 });
      for (var f = 0; f < st.W / 6; f++) sc.fg.push({ x: f * 6 * TILE * 1.2 + R() * 80, h: 16 + R() * 18 });
      st.scene = sc;
      st.weather = [];
      for (var w = 0; w < 70; w++) st.weather.push({ x: Math.random() * VIEWW, y: Math.random() * VIEWH, s: Math.random() });
    }

    function draw() {
      var cam = Math.round((st.cam + (st.shake ? (Math.random() - 0.5) * st.shake : 0)) * 2) / 2, camY = st.shake ? (Math.random() - 0.5) * st.shake * 0.6 : 0;
      var cMid = Math.floor((cam + VIEWW / 2) / TILE), B = biomeAt(st.def, cMid), bname = biomeNameAt(st.def, cMid);
      st.drawCam = cam; st.drawCamY = camY;
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      drawSky(B, bname, cam);
      cx.save(); cx.translate(-cam, camY);
      st.lv.E.trees.forEach(function (tr) { var x = tr.c * TILE + 12; if (x > cam - 120 && x < cam + VIEWW + 120) drawTree(tr, biomeNameAt(st.def, tr.c)); });
      st.lv.E.statues.forEach(function (s) { var x = s.c * TILE; if (x > cam - 100 && x < cam + VIEWW + 100) drawStatue(s); });
      var sx0 = Math.max(0, Math.floor(cam * TSC)), sw = Math.min(tileCv.width - sx0, Math.ceil(VIEWW * TSC) + 2);
      cx.drawImage(tileCv, sx0, 0, sw, tileCv.height, sx0 / TSC, 0, sw / TSC, LH);
      st.lv.E.vines.forEach(function (vn) { var x = vn.c * TILE; if (x > cam - 40 && x < cam + VIEWW + 40) drawVine(vn); });
      drawWater(cam);
      drawDynamicTiles();
      st.lv.E.murals.forEach(drawMural);
      st.lv.E.glyphsets.forEach(function (gs) { gs.tiles.forEach(function (tl) { drawGlyphTile(gs, tl); }); });
      st.lv.E.plates.forEach(drawPlate);
      st.lv.E.levers.forEach(drawLever);
      st.rings.forEach(drawRing);
      st.lv.E.torches.forEach(function (tc) { drawTorch(tc.c * TILE + 12, tc.r * TILE + 12); });
      st.checks.forEach(drawCheck);
      drawExit();
      st.lv.E.plants.forEach(function (pl) { var x = pl.c * TILE; if (x > cam - 60 && x < cam + VIEWW + 60) drawPlant(pl, biomeNameAt(st.def, pl.c)); });
      st.crates.forEach(drawCrate);
      st.gems.forEach(function (g) { if (!g.got) drawGem(g.x, g.y + Math.sin(st.t * 3 + g.x) * 1.5); });
      st.canteens.forEach(function (k) { if (!k.got) drawCanteen(k.x, k.y); });
      st.relics.forEach(function (rl) { if (!rl.got) drawRelic(rl.x, rl.y + Math.sin(st.t * 2.4 + rl.x) * 2.5, rl.kind); });
      st.foes.forEach(function (f) { if (f.alive && f.x > cam - 80 && f.x < cam + VIEWW + 80) drawFoe(f); });
      st.spears.forEach(drawSpear);
      st.lv.E.traps.forEach(function (tr) { if (tr.warn) { cx.fillStyle = "rgba(255,200,120,.55)"; cx.fillRect(tr.c * TILE + 8, 4 * TILE - 3, 8, 3); } });
      st.boulders.forEach(function (b) { if (b.state === "roll") drawBoulder(b); });
      st.chases.forEach(function (ch) { if (ch.state === "run" || ch.state === "leave") drawBigCat(ch.x, ch.y + ch.hh, ch.dir, ch.gait, "tiger", ch.stun > 0, !ch.onGround); });
      drawPlayer(st.p);
      if (st.p.swing) drawRope();
      drawWhip();
      drawParts();
      drawForeground(cam, bname);
      cx.restore();
      drawLighting(cam);
      drawWeather(B, cam);
      var vg = cx.createRadialGradient(VIEWW / 2, VIEWH * 0.55, VIEWH * 0.35, VIEWW / 2, VIEWH / 2, VIEWW * 0.72);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.42)"); cx.fillStyle = vg; cx.fillRect(0, 0, VIEWW, VIEWH);
      if (st.flashT > 0) { cx.fillStyle = "rgba(200,40,20," + (st.flashT * 0.6) + ")"; cx.fillRect(0, 0, VIEWW, VIEWH); }
    }

    function drawSky(B, bname, cam) {
      var g = cx.createLinearGradient(0, 0, 0, VIEWH); g.addColorStop(0, B.sky[0]); g.addColorStop(0.55, B.sky[1]); g.addColorStop(1, B.sky[2]);
      cx.fillStyle = g; cx.fillRect(0, 0, VIEWW, VIEWH);
      if (B.sun) {
        var sx = VIEWW * 0.72 - cam * 0.02, sy = bname === "egypt" ? 150 : bname === "china" ? 140 : 60;
        var sg = cx.createRadialGradient(sx, sy, 4, sx, sy, 110); sg.addColorStop(0, "rgba(255,240,200,.95)"); sg.addColorStop(0.12, hexA(B.sun, 0.9)); sg.addColorStop(0.3, hexA(B.sun, 0.25)); sg.addColorStop(1, hexA(B.sun, 0));
        cx.fillStyle = sg; cx.fillRect(0, 0, VIEWW, VIEWH);
        cx.fillStyle = hexA(B.sun, 0.95); cx.beginPath(); cx.arc(sx, sy, bname === "persia" ? 9 : 22, 0, 7); cx.fill();
      }
      if (bname === "persia") { var R = rng(9); cx.fillStyle = "rgba(255,255,255,.8)"; for (var i = 0; i < 40; i++) { var x = R() * VIEWW, y = R() * 110; cx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(st.t * 1.5 + i)); cx.fillRect(x, y, 1.2, 1.2); } cx.globalAlpha = 1; }
      st.scene.clouds.forEach(function (c) {
        var x = ((c.x - cam * c.s - st.t * 3 * c.s) % 1300 + 1300) % 1300 - 200; if (x > VIEWW + 60) return;
        cx.fillStyle = bname === "indus" ? "rgba(60,80,72,.45)" : "rgba(255,230,210,.16)";
        cx.beginPath(); cx.ellipse(x, c.y, c.w * 0.5, 7, 0, 0, 7); cx.ellipse(x + c.w * 0.2, c.y - 5, c.w * 0.3, 8, 0, 0, 7); cx.fill();
      });
      drawFar(B, bname, cam);
      st.scene.birds.forEach(function (b) {
        var x = ((b.x + st.t * 18 * b.s - cam * 0.2) % 900 + 900) % 900 - 100, y = b.y + Math.sin(st.t + b.ph) * 4, fl = Math.sin(st.t * 8 + b.ph) * 3;
        cx.strokeStyle = "rgba(20,14,20,.55)"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x - 5, y - fl); cx.quadraticCurveTo(x - 2, y - 1, x, y); cx.quadraticCurveTo(x + 2, y - 1, x + 5, y - fl); cx.stroke();
      });
      st.scene.mid.forEach(function (m, i) {
        var x = m.x - cam * 0.4; x = ((x % 3600) + 3600) % 3600 - 100; if (x < -80 || x > VIEWW + 80) return;
        silhouetteTree(x, VIEWH - 40, m.s, bname, B.mid, i);
      });
      cx.fillStyle = B.mid; cx.fillRect(0, VIEWH - 42, VIEWW, 42);
    }
    function farH(bname, wx) {
      if (bname === "persia") return 70 + Math.abs(Math.sin(wx * 0.011)) * 60 + Math.sin(wx * 0.037) * 16;
      if (bname === "china") return 40 + Math.sin(wx * 0.008) * 22 + Math.sin(wx * 0.021) * 8;
      if (bname === "indus") return 46 + Math.sin(wx * 0.009) * 20;
      return 26 + Math.sin(wx * 0.006) * 12;
    }
    function drawFar(B, bname, cam) {
      var base = VIEWH - 60, x0 = -cam * 0.14, x;
      cx.fillStyle = B.far2; cx.beginPath(); cx.moveTo(0, VIEWH);
      for (x = 0; x <= VIEWW + 10; x += 10) cx.lineTo(x, base - farH(bname, x - x0));
      cx.lineTo(VIEWW, VIEWH); cx.fill();
      if (bname === "persia") { cx.fillStyle = "rgba(240,240,255,.55)"; for (x = 0; x <= VIEWW; x += 10) { var h2 = farH(bname, x - x0); if (h2 > 112) cx.fillRect(x, base - h2, 10, 5 + (h2 - 112) * 0.4); } }
      // a landmark per landscape, at fixed spots along the far layer
      var lm = bname === "egypt" ? [180, 420, 1100, 1500] : bname === "sumer" ? [520, 1400] : bname === "indus" ? [700, 1600] : bname === "persia" ? [320, 900] : [1500, 2100];
      lm.forEach(function (wx, i) {
        var X = wx + x0; if (X < -200 || X > VIEWW + 200) return;
        cx.fillStyle = B.far;
        if (bname === "egypt") {
          var h = 90 * (i % 2 ? 0.7 : 1); cx.beginPath(); cx.moveTo(X - h * 1.1, base); cx.lineTo(X, base - h); cx.lineTo(X + h * 1.1, base); cx.fill();
          cx.fillStyle = "rgba(255,190,120,.16)"; cx.beginPath(); cx.moveTo(X, base - h); cx.lineTo(X + h * 1.1, base); cx.lineTo(X + h * 0.25, base); cx.fill();
        } else if (bname === "sumer") {
          for (var k = 0; k < 4; k++) cx.fillRect(X - 80 + k * 18, base - 18 - k * 18, 160 - k * 36, 20);
          cx.fillRect(X - 6, base - 100, 12, 28); cx.fillRect(X - 2, base - 60, 4, 60);
        } else if (bname === "indus") {
          cx.fillRect(X - 120, base - 30, 240, 30); cx.fillRect(X - 80, base - 52, 150, 24); cx.fillRect(X - 40, base - 66, 30, 16); cx.fillRect(X + 20, base - 62, 40, 12);
        } else if (bname === "persia") {
          // the Behistun cliff: a sheer face with a carved panel of figures under a winged disc
          cx.fillStyle = shade(B.far, -0.1); cx.beginPath(); cx.moveTo(X - 90, base); cx.lineTo(X - 70, base - 150); cx.lineTo(X + 80, base - 160); cx.lineTo(X + 100, base); cx.fill();
          cx.fillStyle = "rgba(210,190,210,.25)"; cx.fillRect(X - 36, base - 110, 70, 30);
          cx.fillStyle = "rgba(40,30,50,.55)"; for (var q = 0; q < 8; q++) cx.fillRect(X - 32 + q * 8, base - 100, 3, 16);
          cx.beginPath(); cx.ellipse(X, base - 107, 10, 2, 0, 0, 7); cx.fill();
        } else {
          // a Shang hall: rammed-earth platform, timber posts, a thatched hip roof
          cx.fillRect(X - 90, base - 20, 180, 20);
          for (var pz = 0; pz < 7; pz++) cx.fillRect(X - 70 + pz * 23, base - 48, 4, 28);
          cx.beginPath(); cx.moveTo(X - 96, base - 46); cx.lineTo(X - 50, base - 74); cx.lineTo(X + 50, base - 74); cx.lineTo(X + 96, base - 46); cx.fill();
        }
      });
      cx.fillStyle = B.far; cx.beginPath(); cx.moveTo(0, VIEWH);
      for (x = 0; x <= VIEWW + 10; x += 12) { var wx3 = x + cam * 0.25; cx.lineTo(x, base + 24 - (bname === "egypt" ? 14 + Math.sin(wx3 * 0.01) * 10 : 18 + Math.sin(wx3 * 0.013) * 12 + Math.sin(wx3 * 0.05) * 4)); }
      cx.lineTo(VIEWW, VIEWH); cx.fill();
    }
    function silhouetteTree(x, gy, s, bname, col) {
      cx.fillStyle = col; cx.strokeStyle = col;
      if (bname === "egypt" || bname === "sumer") { cx.lineWidth = 3 * s; cx.beginPath(); cx.moveTo(x, gy); cx.quadraticCurveTo(x + 6 * s, gy - 30 * s, x + 2 * s, gy - 60 * s); cx.stroke(); for (var k = 0; k < 6; k++) { var a = -Math.PI / 2 + (k - 2.5) * 0.55; cx.beginPath(); cx.ellipse(x + 2 * s + Math.cos(a) * 14 * s, gy - 56 * s + Math.sin(a) * 6 * s, 16 * s, 3 * s, a * 0.8, 0, 7); cx.fill(); } }
      else if (bname === "indus") { cx.fillRect(x - 3 * s, gy - 50 * s, 6 * s, 50 * s); cx.beginPath(); cx.arc(x, gy - 60 * s, 26 * s, 0, 7); cx.arc(x - 20 * s, gy - 48 * s, 18 * s, 0, 7); cx.arc(x + 22 * s, gy - 50 * s, 20 * s, 0, 7); cx.fill(); }
      else if (bname === "persia") { cx.beginPath(); cx.moveTo(x, gy - 74 * s); cx.quadraticCurveTo(x + 11 * s, gy - 30 * s, x + 5 * s, gy); cx.lineTo(x - 5 * s, gy); cx.quadraticCurveTo(x - 11 * s, gy - 30 * s, x, gy - 74 * s); cx.fill(); }
      else { cx.lineWidth = 2 * s; for (var b = 0; b < 5; b++) { var bx = x + b * 4 * s, bh = (56 + (b % 3) * 12) * s, lean = (b - 2) * 3 * s; cx.beginPath(); cx.moveTo(bx, gy); cx.quadraticCurveTo(bx, gy - bh * 0.6, bx + lean, gy - bh); cx.stroke(); for (var lf = 0; lf < 3; lf++) { cx.beginPath(); cx.ellipse(bx + lean + (lf - 1) * 5 * s, gy - bh + lf * 9 * s, 7 * s, 1.6 * s, (lf - 1) * 0.6, 0, 7); cx.fill(); } } }
    }

    /* ---------- near scenery ---------- */
    function drawTree(tr, bname) {
      var x = tr.c * TILE + 12, gy = (standRowAt(tr.c) + 1) * TILE, s = tr.s, sw = Math.sin(st.t * 1.1 + tr.c) * 0.04;
      cx.save(); cx.translate(x, gy);
      if (bname === "egypt" || bname === "sumer") {                        // date palm
        cx.strokeStyle = "#5a3a22"; cx.lineWidth = 6 * s; cx.lineCap = "round";
        var tx = 10 * s + sw * 60, ty = -118 * s;
        cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(-4 * s, -60 * s, tx, ty); cx.stroke();
        cx.strokeStyle = "rgba(30,18,8,.45)"; cx.lineWidth = 1;
        for (var k = 1; k < 12; k++) { var u = k / 12, px = lerp(0, tx, u * u) - 2 * s * (1 - u), py = ty * u; cx.beginPath(); cx.moveTo(px - 3 * s, py); cx.lineTo(px + 3 * s, py - 2); cx.stroke(); }
        cx.fillStyle = "#6a3a20"; for (var d = 0; d < 5; d++) { cx.beginPath(); cx.arc(tx - 5 * s + d * 2.5 * s, ty + 6 * s + (d % 2) * 3, 2.6 * s, 0, 7); cx.fill(); }
        var fr = bname === "egypt" ? ["#3f6a2a", "#5a8a34", "#2e4e22"] : ["#34602e", "#4f8a3a", "#23421e"];
        for (var f = 0; f < 9; f++) {
          var a = -Math.PI + f / 8 * Math.PI + sw * 3 + Math.sin(st.t * 1.4 + f) * 0.03, len = (40 + (f % 3) * 6) * s;
          cx.save(); cx.translate(tx, ty); cx.rotate(a);
          cx.fillStyle = fr[f % 3]; cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(len * 0.5, -10 * s, len, 6 * s); cx.quadraticCurveTo(len * 0.5, 2 * s, 0, 3 * s); cx.fill();
          cx.strokeStyle = shade(fr[f % 3], -0.3); cx.lineWidth = 0.8; for (var l = 0.2; l < 1; l += 0.12) { cx.beginPath(); cx.moveTo(len * l, -4 * s * Math.sin(l * 3)); cx.lineTo(len * l + 4 * s, 5 * s); cx.stroke(); }
          cx.restore();
        }
      } else if (bname === "indus") {                                      // jungle tree: buttress roots, layered canopy, hanging roots
        cx.fillStyle = "#3a2a1a"; cx.beginPath(); cx.moveTo(-14 * s, 0); cx.quadraticCurveTo(-5 * s, -20 * s, -6 * s, -120 * s); cx.lineTo(6 * s, -120 * s); cx.quadraticCurveTo(5 * s, -20 * s, 16 * s, 0); cx.fill();
        cx.fillStyle = "rgba(255,255,255,.07)"; cx.fillRect(-4 * s, -110 * s, 3 * s, 105 * s);
        var cols = ["#1f4a22", "#2e6a2a", "#3f8a34", "#57a444"], blobs = [[0, -140, 40], [-34, -122, 30], [34, -126, 32], [-14, -160, 28], [20, -158, 26], [-46, -104, 20], [46, -108, 22]];
        cols.forEach(function (ccol, li) { cx.fillStyle = ccol; blobs.forEach(function (bl, bi) { cx.beginPath(); cx.arc((bl[0] + sw * 40 - li * 2 + li * (bi % 2) * 3) * s, (bl[1] - li * 3) * s, bl[2] * s * (1 - li * 0.16), 0, 7); cx.fill(); }); });
        cx.strokeStyle = "#3a5a2a"; cx.lineWidth = 1.2;
        for (var v2 = 0; v2 < 5; v2++) { var vx = (-36 + v2 * 18) * s, sway = Math.sin(st.t * 1.3 + v2) * 3; cx.beginPath(); cx.moveTo(vx, -110 * s); cx.quadraticCurveTo(vx + sway, -70 * s, vx + sway * 1.4, (-40 - v2 * 6) * s); cx.stroke(); }
      } else if (bname === "persia") {                                     // cypress
        cx.fillStyle = "#3a2a1c"; cx.fillRect(-2.5 * s, -12 * s, 5 * s, 12 * s);
        var cg = cx.createLinearGradient(-12 * s, 0, 12 * s, 0); cg.addColorStop(0, "#1c3424"); cg.addColorStop(0.6, "#2e5a3a"); cg.addColorStop(1, "#18301f");
        cx.fillStyle = cg; cx.beginPath(); cx.moveTo(sw * 30, -118 * s); cx.bezierCurveTo(14 * s, -80 * s, 14 * s, -30 * s, 7 * s, -10 * s); cx.lineTo(-7 * s, -10 * s); cx.bezierCurveTo(-14 * s, -30 * s, -14 * s, -80 * s, sw * 30, -118 * s); cx.fill();
        cx.strokeStyle = "rgba(0,0,0,.2)"; cx.lineWidth = 1; for (var q = 0; q < 8; q++) { cx.beginPath(); cx.arc(sw * 20, -20 * s - q * 12 * s, 7 * s, 0.3, 2.8); cx.stroke(); }
      } else {                                                             // bamboo clump
        for (var b = 0; b < 6; b++) {
          var bx = (-14 + b * 6) * s, h = (100 + (b % 3) * 22) * s, lean = sw * 40 + (b - 2.5) * 2;
          cx.strokeStyle = b % 2 ? "#6a8a34" : "#7ea03e"; cx.lineWidth = 3 * s; cx.beginPath(); cx.moveTo(bx, 0); cx.quadraticCurveTo(bx, -h * 0.6, bx + lean, -h); cx.stroke();
          cx.strokeStyle = "rgba(40,50,20,.6)"; cx.lineWidth = 1; for (var nd = 1; nd < 7; nd++) { var ny = -h * nd / 7; cx.beginPath(); cx.moveTo(bx - 2 * s + lean * nd / 7 * 0.4, ny); cx.lineTo(bx + 2 * s + lean * nd / 7 * 0.4, ny); cx.stroke(); }
          cx.fillStyle = "#5f8a34"; for (var lf = 0; lf < 4; lf++) { cx.save(); cx.translate(bx + lean * (0.6 + lf * 0.1), -h * (0.6 + lf * 0.1)); cx.rotate(-0.6 + lf * 0.4 + Math.sin(st.t * 2 + b + lf) * 0.1); cx.beginPath(); cx.ellipse(8 * s, 0, 9 * s, 2 * s, 0, 0, 7); cx.fill(); cx.restore(); }
        }
      }
      cx.restore();
    }
    function drawPlant(pl, bname) {
      var x = pl.c * TILE + 12, gy = (standRowAt(pl.c) + 1) * TILE, sw = Math.sin(st.t * 1.6 + pl.c) * 2;
      cx.save(); cx.translate(x, gy);
      if (bname === "egypt" || bname === "sumer") {                        // papyrus / reeds
        for (var i = 0; i < 7; i++) {
          var bx = (i - 3) * 3, h = 26 + (i % 3) * 7, tx = bx + sw * (h / 30);
          cx.strokeStyle = i % 2 ? "#5a7a2c" : "#6e8e34"; cx.lineWidth = 1.4; cx.beginPath(); cx.moveTo(bx, 0); cx.quadraticCurveTo(bx, -h * 0.6, tx, -h); cx.stroke();
          if (bname === "egypt") { cx.strokeStyle = "#8aa83e"; cx.lineWidth = 0.8; cx.beginPath(); for (var u2 = -3; u2 <= 3; u2++) { cx.moveTo(tx, -h); cx.lineTo(tx + u2 * 2.2, -h - 6 + Math.abs(u2) * 0.8); } cx.stroke(); }   // papyrus umbel: a spray of fine rays
          else { cx.fillStyle = "#8a6a3a"; cx.fillRect(tx - 1.2, -h - 6, 2.4, 7); }
        }
      } else if (bname === "indus") {                                      // fern
        for (var f = 0; f < 7; f++) {
          var a = -Math.PI / 2 + (f - 3) * 0.38 + sw * 0.02, L = 20 + (f % 2) * 6;
          cx.save(); cx.rotate(a + Math.PI / 2); cx.fillStyle = f % 2 ? "#3f8a34" : "#2e6a28";
          cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(-5, -L * 0.5, 0, -L); cx.quadraticCurveTo(5, -L * 0.5, 0, 0); cx.fill();
          cx.strokeStyle = "rgba(10,30,10,.5)"; cx.lineWidth = 0.6; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(0, -L); cx.stroke();
          cx.restore();
        }
        cx.fillStyle = "#c83a5a"; cx.beginPath(); cx.arc(4, -14, 2, 0, 7); cx.fill();
      } else if (bname === "persia") {                                     // thorn scrub
        cx.strokeStyle = "#6a5a3a"; cx.lineWidth = 1.2; for (var t = 0; t < 6; t++) { var a2 = -Math.PI / 2 + (t - 2.5) * 0.4; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(Math.cos(a2) * 16, Math.sin(a2) * 14 - 2); cx.stroke(); }
        cx.fillStyle = "#8a9a5a"; for (var d = 0; d < 6; d++) { cx.beginPath(); cx.arc(-8 + d * 3.4, -8 - (d % 3) * 3, 2.4, 0, 7); cx.fill(); }
      } else {                                                             // tall grass
        for (var gi = 0; gi < 9; gi++) { var gx = (gi - 4) * 2.4, gh = 12 + (gi % 3) * 5; cx.strokeStyle = gi % 2 ? "#8aa84a" : "#6e8e38"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(gx, 0); cx.quadraticCurveTo(gx, -gh * 0.6, gx + sw * 1.5, -gh); cx.stroke(); }
      }
      cx.restore();
    }
    function drawVine(vn) {
      var x = vn.c * TILE + 12, y0 = vn.r0 * TILE, L = vn.len * TILE, sw = Math.sin(st.t * 1.2 + vn.c) * 6;
      cx.strokeStyle = "#2f5a26"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x, y0); cx.quadraticCurveTo(x + sw, y0 + L * 0.6, x + sw * 1.3, y0 + L); cx.stroke();
      cx.fillStyle = "#3f8a34"; for (var i = 1; i < vn.len * 2; i++) { var u = i / (vn.len * 2), lx = x + sw * u * u * 1.3, ly = y0 + L * u; cx.beginPath(); cx.ellipse(lx + (i % 2 ? 4 : -4), ly, 4, 2, i % 2 ? 0.5 : -0.5, 0, 7); cx.fill(); }
    }
    function drawStatue(s) {
      var x = s.c * TILE + 12, gy = (s.r + 1) * TILE;
      cx.save(); cx.translate(x, gy);
      if (s.kind === "obelisk") {
        var og = cx.createLinearGradient(-8, 0, 8, 0); og.addColorStop(0, "#9a7a52"); og.addColorStop(0.5, "#d8b884"); og.addColorStop(1, "#7a5a38");
        cx.fillStyle = og; cx.beginPath(); cx.moveTo(-9, 0); cx.lineTo(-6, -92); cx.lineTo(0, -102); cx.lineTo(6, -92); cx.lineTo(9, 0); cx.fill();
        cx.fillStyle = "#f2d8a0"; cx.beginPath(); cx.moveTo(-6, -92); cx.lineTo(0, -102); cx.lineTo(6, -92); cx.fill();
        cx.fillStyle = "rgba(70,40,20,.5)"; for (var i = 0; i < 6; i++) cx.fillRect(-2, -84 + i * 12, 4, 6);
      } else if (s.kind === "reedhut") {                                  // a mudhif: an arched house of bundled reed
        cx.fillStyle = "#b09050"; cx.beginPath(); cx.moveTo(-34, 0); cx.lineTo(-34, -22); cx.quadraticCurveTo(0, -58, 34, -22); cx.lineTo(34, 0); cx.fill();
        cx.strokeStyle = "rgba(90,60,20,.6)"; cx.lineWidth = 1; for (var k = -30; k <= 30; k += 6) { cx.beginPath(); cx.moveTo(k, 0); cx.lineTo(k, -22 - (30 - Math.abs(k)) * 0.9); cx.stroke(); }
        cx.fillStyle = "#3a2410"; cx.beginPath(); cx.moveTo(-8, 0); cx.lineTo(-8, -14); cx.quadraticCurveTo(0, -24, 8, -14); cx.lineTo(8, 0); cx.fill();
      } else if (s.kind === "reedbundle") {                               // Inanna's ringed reed-bundle standard
        cx.fillStyle = "#c9a060"; cx.fillRect(-3, -64, 6, 64); cx.strokeStyle = "#c9a060"; cx.lineWidth = 5; cx.beginPath(); cx.arc(0, -70, 7, 0.3, Math.PI * 2 - 0.3); cx.stroke();
        cx.fillStyle = "#e0c080"; cx.beginPath(); cx.moveTo(4, -72); cx.quadraticCurveTo(18, -76, 16, -60); cx.quadraticCurveTo(12, -70, 4, -66); cx.fill();
      } else if (s.kind === "shrine") {
        cx.fillStyle = "#c08a5a"; cx.fillRect(-26, -40, 52, 40); cx.fillStyle = "#8a5a34"; cx.fillRect(-30, -44, 60, 6);
        cx.fillStyle = "#d6a15a"; for (var q = -24; q < 24; q += 6) cx.fillRect(q, -40, 3, 8);
      } else if (s.kind === "stilts" || s.kind === "piers") {         // supports under a raised block (behind, not solid)
        var top = 7 * TILE, span2 = s.kind === "stilts" ? 2 : 5;
        cx.translate(-12, -gy); gy = 10 * TILE;
        for (var pi = 0; pi <= 1; pi++) {
          var px2 = pi ? span2 * TILE - 5 : 1;
          if (s.kind === "stilts") { cx.fillStyle = "#5a3e22"; cx.fillRect(px2, top, 4, gy - top); cx.fillStyle = "rgba(255,255,255,.1)"; cx.fillRect(px2, top, 1, gy - top); }
          else { cx.fillStyle = "#8a3e20"; cx.fillRect(px2 - 1, top, 6, gy - top); cx.fillStyle = "rgba(0,0,0,.3)"; for (var yb = top; yb < gy; yb += 6) cx.fillRect(px2 - 1, yb, 6, 1); }
        }
        if (s.kind === "stilts") { cx.strokeStyle = "#5a3e22"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(3, top + 6); cx.lineTo(span2 * TILE - 3, gy - 20); cx.stroke(); }
      } else if (s.kind === "steps") {
        cx.fillStyle = "#9a4a26"; for (var s2 = 0; s2 < 3; s2++) cx.fillRect(-10 + s2 * 4, -s2 * 5 - 5, 20 - s2 * 8, 5);
      } else if (s.kind === "well") {
        cx.fillStyle = "#a4522a"; cx.beginPath(); cx.ellipse(0, -8, 16, 5, 0, 0, 7); cx.fill(); cx.fillRect(-16, -8, 32, 8); cx.fillStyle = "#1a2a2a"; cx.beginPath(); cx.ellipse(0, -8, 11, 3, 0, 0, 7); cx.fill();
      } else if (s.kind === "firealtar") {                                // a stepped fire altar, flame burning
        cx.fillStyle = "#9a8a78"; cx.fillRect(-12, -8, 24, 8); cx.fillRect(-8, -30, 16, 22); cx.fillRect(-13, -36, 26, 6);
        drawFlame(0, -38, 1.4);
      } else if (s.kind === "ding") {                                     // a Shang bronze cauldron (ding)
        var dg = cx.createLinearGradient(-14, 0, 14, 0); dg.addColorStop(0, "#3a5a4a"); dg.addColorStop(0.5, "#6a9a7a"); dg.addColorStop(1, "#2e4a3a");
        cx.fillStyle = dg; cx.fillRect(-12, -10, 3, 10); cx.fillRect(9, -10, 3, 10); cx.fillRect(-1.5, -10, 3, 10);
        cx.beginPath(); cx.moveTo(-16, -30); cx.lineTo(16, -30); cx.quadraticCurveTo(15, -8, 0, -9); cx.quadraticCurveTo(-15, -8, -16, -30); cx.fill();
        cx.fillRect(-12, -38, 4, 9); cx.fillRect(8, -38, 4, 9); cx.strokeStyle = "rgba(20,30,20,.6)"; cx.lineWidth = 1; cx.strokeRect(-11, -26, 22, 7);
        cx.beginPath(); cx.arc(-5, -22, 2, 0, 7); cx.arc(5, -22, 2, 0, 7); cx.stroke();
      }
      cx.restore();
    }
    function drawForeground(cam, bname) {
      // dark leaves along the bottom edge, in front of everything, drifting a little faster than the world
      var col = bname === "indus" ? "rgba(10,30,14,.85)" : bname === "egypt" ? "rgba(40,24,14,.8)" : bname === "china" ? "rgba(30,36,14,.8)" : "rgba(24,20,28,.8)";
      cx.fillStyle = col;
      st.scene.fg.forEach(function (f) {
        var x = f.x - cam * 0.15; if (x < cam - 60 || x > cam + VIEWW + 60) return;
        for (var i = 0; i < 5; i++) { var a = (i - 2) * 0.45 + Math.sin(st.t * 1.3 + f.x) * 0.05; cx.save(); cx.translate(x, LH + 4); cx.rotate(a); cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(-6, -f.h * 0.6, 0, -f.h); cx.quadraticCurveTo(6, -f.h * 0.6, 0, 0); cx.fill(); cx.restore(); }
      });
    }

    /* ---------- tiles that change: gates, crumbles, movers, water ---------- */
    function drawDynamicTiles() {
      st.lv.E.gates.forEach(function (g) {
        var x = g.c * TILE, y0 = g.r0 * TILE, h = (g.r1 - g.r0 + 1) * TILE, off = g.open * (h - 8);
        cx.save(); cx.beginPath(); cx.rect(x - 2, y0, TILE + 4, h); cx.clip();
        var gg = cx.createLinearGradient(x, 0, x + TILE, 0); gg.addColorStop(0, "#5a4632"); gg.addColorStop(0.5, "#8a6e4c"); gg.addColorStop(1, "#4a3826");
        cx.fillStyle = gg; cx.fillRect(x + 2, y0 - off, TILE - 4, h);
        cx.fillStyle = "rgba(0,0,0,.35)"; for (var k = 0; k < h; k += 12) cx.fillRect(x + 2, y0 - off + k, TILE - 4, 2);
        cx.fillStyle = COL.gold; cx.globalAlpha = 0.8; cx.fillRect(x + 10, y0 - off + h / 2 - 8, 4, 16); cx.globalAlpha = 1;
        cx.restore();
        // one lamp above the gate per trigger it's waiting on
        g.trig.forEach(function (o, i) { cx.fillStyle = trigOk(o) ? "#ffd070" : "rgba(80,60,40,.9)"; cx.beginPath(); cx.arc(x + 12 + (i - (g.trig.length - 1) / 2) * 7, y0 - 5, 2.5, 0, 7); cx.fill(); });
      });
      st.lv.E.crumbles.forEach(function (k) {
        if (k.state === 2) return; var x = k.c * TILE + (k.state === 1 ? (Math.random() - 0.5) * 2 : 0), y = k.r * TILE, Bc = biomeAt(st.def, k.c);
        cx.fillStyle = shade(Bc.built[0], -0.05); cx.fillRect(x, y, TILE, TILE * 0.7);
        cx.strokeStyle = "rgba(0,0,0,.45)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x + 4, y); cx.lineTo(x + 10, y + 8); cx.lineTo(x + 7, y + 16); cx.moveTo(x + 18, y + 2); cx.lineTo(x + 14, y + 12); cx.stroke();
        cx.fillStyle = "rgba(255,255,255,.14)"; cx.fillRect(x, y, TILE, 2);
      });
      st.movers.forEach(function (m) {
        var n = Math.round(m.w / 6), wet = !!biomeAt(st.def, Math.floor(m.x / TILE)).water;
        for (var i = 0; i < n; i++) { cx.fillStyle = i % 2 ? "#b8924e" : "#a07e40"; cx.fillRect(m.x + i * 6, m.y, 6, m.h); }
        cx.strokeStyle = "#5a3e1e"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(m.x, m.y + 3); cx.lineTo(m.x + m.w, m.y + 3); cx.moveTo(m.x, m.y + 7); cx.lineTo(m.x + m.w, m.y + 7); cx.stroke();
        cx.fillStyle = "rgba(255,255,255,.18)"; cx.fillRect(m.x, m.y, m.w, 1);
        if (wet) { cx.fillStyle = "rgba(255,255,255,.25)"; cx.fillRect(m.x - 4 + Math.sin(st.t * 3) * 2, m.y + m.h, m.w + 8, 1.5); }
      });
    }
    function drawWater(cam) {
      st.lv.E.waters.forEach(function (w) {
        var x0 = w.c0 * TILE, x1 = (w.c1 + 1) * TILE; if (x1 < cam || x0 > cam + VIEWW) return;
        var top = w.top * TILE + 6, col = biomeAt(st.def, w.c0).water || "#2f5a6a";
        var g = cx.createLinearGradient(0, top, 0, LH); g.addColorStop(0, hexA(col, 0.85)); g.addColorStop(1, "rgba(6,18,22,.95)");
        cx.fillStyle = g; cx.beginPath(); cx.moveTo(x0, LH);
        for (var x = x0; x <= x1; x += 4) cx.lineTo(x, top + Math.sin(x * 0.12 + st.t * 3) * 1.6);
        cx.lineTo(x1, LH); cx.fill();
        cx.strokeStyle = "rgba(220,245,255,.55)"; cx.lineWidth = 1.2; cx.beginPath();
        for (var x2 = x0; x2 <= x1; x2 += 4) { var yy = top + Math.sin(x2 * 0.12 + st.t * 3) * 1.6; if (x2 === x0) cx.moveTo(x2, yy); else cx.lineTo(x2, yy); }
        cx.stroke();
        cx.fillStyle = "rgba(255,255,255,.12)"; for (var k = 0; k < 4; k++) { var gx = x0 + ((st.t * 12 + k * 37) % (x1 - x0)); cx.fillRect(gx, top + 6 + k * 5, 10, 1); }
      });
    }

    /* ---------- puzzle pieces ---------- */
    function drawGlyph(set, id, x, y, s, col) {
      cx.save(); cx.translate(x, y); cx.strokeStyle = col; cx.fillStyle = col; cx.lineWidth = Math.max(1.2, s * 0.13); cx.lineCap = "round"; cx.lineJoin = "round";
      if (set === "egypt") {
        if (id === 0) { cx.beginPath(); cx.ellipse(0, -s * 0.42, s * 0.2, s * 0.26, 0, 0, 7); cx.moveTo(-s * 0.36, -s * 0.12); cx.lineTo(s * 0.36, -s * 0.12); cx.moveTo(0, -s * 0.14); cx.lineTo(0, s * 0.6); cx.stroke(); }
        else if (id === 1) { cx.fillRect(-s * 0.11, -s * 0.1, s * 0.22, s * 0.7); for (var i = 0; i < 4; i++) cx.fillRect(-s * 0.3, -s * 0.56 + i * s * 0.12, s * 0.6, s * 0.07); }
        else if (id === 2) { cx.beginPath(); cx.moveTo(0, s * 0.62); cx.lineTo(-s * 0.12, s * 0.5); cx.moveTo(0, s * 0.62); cx.lineTo(s * 0.12, s * 0.5); cx.moveTo(0, s * 0.62); cx.lineTo(0, -s * 0.4); cx.lineTo(s * 0.26, -s * 0.52); cx.moveTo(0, -s * 0.4); cx.lineTo(-s * 0.06, -s * 0.6); cx.stroke(); }
        else { cx.beginPath(); cx.moveTo(-s * 0.46, 0); cx.quadraticCurveTo(0, -s * 0.34, s * 0.46, 0); cx.quadraticCurveTo(0, s * 0.22, -s * 0.46, 0); cx.stroke(); cx.beginPath(); cx.arc(0, -s * 0.04, s * 0.11, 0, 7); cx.fill(); cx.beginPath(); cx.moveTo(-s * 0.44, -s * 0.3); cx.quadraticCurveTo(0, -s * 0.52, s * 0.46, -s * 0.3); cx.moveTo(-s * 0.08, s * 0.12); cx.lineTo(-s * 0.14, s * 0.5); cx.moveTo(s * 0.1, s * 0.12); cx.quadraticCurveTo(s * 0.3, s * 0.52, s * 0.44, s * 0.36); cx.stroke(); }
      } else {
        if (id === 0) { cx.beginPath(); cx.arc(0, 0, s * 0.4, 0, 7); cx.moveTo(-s * 0.14, 0); cx.lineTo(s * 0.14, 0); cx.stroke(); }
        else if (id === 1) { cx.beginPath(); cx.arc(s * 0.1, 0, s * 0.42, Math.PI * 0.6, Math.PI * 1.4); cx.quadraticCurveTo(-s * 0.02, 0, s * 0.1 + Math.cos(Math.PI * 0.6) * s * 0.42, Math.sin(Math.PI * 0.6) * s * 0.42); cx.moveTo(-s * 0.12, -s * 0.06); cx.lineTo(-s * 0.12, s * 0.12); cx.stroke(); }
        else if (id === 2) { cx.beginPath(); cx.moveTo(-s * 0.46, -s * 0.44); cx.lineTo(s * 0.46, -s * 0.44); cx.stroke(); for (var d = 0; d < 3; d++) for (var e = 0; e < 3; e++) { cx.beginPath(); cx.arc(-s * 0.3 + d * s * 0.3, -s * 0.18 + e * s * 0.26, s * 0.05, 0, 7); cx.fill(); } }
        else { cx.beginPath(); cx.moveTo(s * 0.08, -s * 0.56); cx.quadraticCurveTo(-s * 0.06, 0, -s * 0.28, s * 0.58); cx.moveTo(-s * 0.02, -s * 0.12); cx.lineTo(s * 0.3, s * 0.14); cx.stroke(); }
      }
      cx.restore();
    }
    function drawMural(m) {
      var x = m.c * TILE - 30, y = m.r * TILE - 18, w = 84, h = 40, eg = m.set === "egypt";
      var g = cx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, eg ? "#d8c29a" : "#e6dcc4"); g.addColorStop(1, eg ? "#b89c6c" : "#c8b894");
      cx.fillStyle = "rgba(0,0,0,.4)"; cx.fillRect(x + 3, y + 3, w, h);
      cx.fillStyle = g;
      if (!eg) { cx.beginPath(); cx.moveTo(x, y + 6); cx.quadraticCurveTo(x + w / 2, y - 6, x + w, y + 4); cx.lineTo(x + w - 4, y + h); cx.quadraticCurveTo(x + w / 2, y + h + 6, x + 4, y + h - 2); cx.closePath(); cx.fill(); cx.strokeStyle = "rgba(90,60,30,.5)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x + 6, y + 8); cx.lineTo(x + 12, y + 20); cx.lineTo(x + 9, y + 30); cx.stroke(); }
      else { cx.fillRect(x, y, w, h); cx.strokeStyle = "#2a5a8a"; cx.lineWidth = 2; cx.strokeRect(x + 2, y + 2, w - 4, h - 4); cx.fillStyle = "#b8442a"; cx.fillRect(x + 2, y + h - 6, w - 4, 3); }
      var set = st.lv.E.glyphsets.filter(function (gs) { return gs.set === m.set; })[0], order = set ? set.order : [0, 1, 2, 3];
      order.forEach(function (sym, i) { drawGlyph(m.set, sym, x + 13 + i * 19, y + h / 2, 15, eg ? "#1c3a6a" : "#4a2a1a"); });
    }
    function drawGlyphTile(gs, tl) {
      var x = tl.c * TILE, y = (tl.r + 1) * TILE - 5;
      cx.fillStyle = tl.lit ? "#ffd070" : "#5a4a34"; cx.fillRect(x + 2, y, TILE - 4, 5);
      if (tl.lit) { var gl = cx.createRadialGradient(x + 12, y, 1, x + 12, y, 26); gl.addColorStop(0, "rgba(255,210,120,.55)"); gl.addColorStop(1, "rgba(255,210,120,0)"); cx.fillStyle = gl; cx.fillRect(x - 14, y - 26, 52, 32); }
      drawGlyph(gs.set, tl.sym, x + 12, y - 12, 14, tl.lit ? "#fff0b0" : "rgba(232,210,160,.75)");
    }
    function drawPlate(pl) {
      var x = pl.c * TILE, y = (pl.r + 1) * TILE - (pl.down ? 2 : 4);
      cx.fillStyle = "#3a2c1e"; cx.fillRect(x + 1, (pl.r + 1) * TILE - 2, TILE - 2, 2);
      cx.fillStyle = pl.down ? "#c9a24a" : "#8a7a5a"; cx.fillRect(x + 3, y, TILE - 6, 3);
      if (!pl.down) { cx.fillStyle = "rgba(255,220,140," + (0.3 + 0.3 * Math.sin(st.t * 3)) + ")"; cx.fillRect(x + 6, y - 1, TILE - 12, 1); }
    }
    function drawLever(lv) {
      var x = lv.c * TILE + 12, y = lv.r * TILE + 12;
      cx.fillStyle = "#4a3a2a"; cx.fillRect(x - 5, y - 6, 10, 12); cx.fillStyle = "#8a6a3a"; cx.fillRect(x - 3, y - 4, 6, 8);
      var a = lv.on ? 0.9 : -0.9; cx.strokeStyle = "#b08a4a"; cx.lineWidth = 2.5; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + Math.sin(a) * 12, y - Math.cos(a) * 12); cx.stroke();
      cx.fillStyle = lv.on ? "#ffd070" : "#c83a2a"; cx.beginPath(); cx.arc(x + Math.sin(a) * 12, y - Math.cos(a) * 12, 3, 0, 7); cx.fill();
      if (!lv.on) { cx.strokeStyle = "rgba(255,210,120," + (0.25 + 0.25 * Math.sin(st.t * 4)) + ")"; cx.lineWidth = 1; cx.beginPath(); cx.arc(x, y, 14, 0, 7); cx.stroke(); }
    }
    function drawRing(rg) {
      cx.strokeStyle = "#3a2a1a"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(rg.x, rg.y - 18); cx.lineTo(rg.x, rg.y - 6); cx.stroke();
      var g = cx.createLinearGradient(rg.x - 6, rg.y - 6, rg.x + 6, rg.y + 6); g.addColorStop(0, "#f0d080"); g.addColorStop(1, "#8a6a2a");
      cx.strokeStyle = g; cx.lineWidth = 3; cx.beginPath(); cx.arc(rg.x, rg.y, 6, 0, 7); cx.stroke();
      var p = st.p, d = Math.hypot(rg.x - p.x, rg.y - p.y);
      if (!p.swing && d < 160 && rg.y < p.y) { cx.strokeStyle = "rgba(255,220,140," + (0.35 + 0.3 * Math.sin(st.t * 6)) + ")"; cx.lineWidth = 1; cx.beginPath(); cx.arc(rg.x, rg.y, 11, 0, 7); cx.stroke(); }
    }
    function drawCrate(k) {
      var x = k.x - k.hw, y = k.y - k.hh, w = k.hw * 2, h = k.hh * 2;
      cx.fillStyle = "#8a6034"; cx.fillRect(x, y, w, h); cx.fillStyle = "#a47642"; cx.fillRect(x + 2, y + 2, w - 4, h - 4);
      cx.strokeStyle = "#5a3a1a"; cx.lineWidth = 2; cx.strokeRect(x + 1, y + 1, w - 2, h - 2); cx.beginPath(); cx.moveTo(x + 2, y + 2); cx.lineTo(x + w - 2, y + h - 2); cx.moveTo(x + w - 2, y + 2); cx.lineTo(x + 2, y + h - 2); cx.stroke();
      cx.fillStyle = "rgba(255,255,255,.15)"; cx.fillRect(x, y, w, 2);
    }
    function drawCheck(k) {
      var x = k.x, y = k.y, wv = Math.sin(st.t * 4 + x) * 2;
      cx.strokeStyle = "#5a3a1e"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x - 7, y); cx.lineTo(x - 7, y - 30); cx.stroke();
      cx.fillStyle = k.on ? "#c8442a" : "#6a5a4a"; cx.beginPath(); cx.moveTo(x - 7, y - 30); cx.quadraticCurveTo(x + 2, y - 30 + wv, x + 9, y - 26); cx.lineTo(x - 7, y - 20); cx.fill();
      cx.fillStyle = "#6a5a4a"; for (var i = -1; i <= 1; i++) { cx.beginPath(); cx.arc(x + 4 + i * 5, y - 1.5, 2.4, 0, 7); cx.fill(); }
      if (k.on) drawFlame(x + 4, y - 3, 0.8);
    }
    function drawExit() {
      var e = st.exit, x = e.x, y = e.y;
      var gl = cx.createRadialGradient(x, y - 22, 4, x, y - 22, 44); gl.addColorStop(0, "rgba(255,220,150,.45)"); gl.addColorStop(1, "rgba(255,220,150,0)"); cx.fillStyle = gl; cx.fillRect(x - 50, y - 70, 100, 80);
      cx.fillStyle = "#6a5236"; cx.fillRect(x - 16, y - 46, 32, 46); cx.fillStyle = "#140c06"; cx.fillRect(x - 11, y - 40, 22, 40);
      cx.fillStyle = "#8a6a44"; cx.fillRect(x - 19, y - 50, 38, 6);
      var ig = cx.createLinearGradient(0, y - 40, 0, y); ig.addColorStop(0, "rgba(255,210,120,0)"); ig.addColorStop(1, "rgba(255,210,120," + (0.25 + 0.1 * Math.sin(st.t * 2)) + ")"); cx.fillStyle = ig; cx.fillRect(x - 11, y - 40, 22, 40);
      cx.fillStyle = COL.goldB; cx.beginPath(); cx.moveTo(x, y - 60); cx.lineTo(x + 4, y - 55); cx.lineTo(x, y - 50); cx.lineTo(x - 4, y - 55); cx.fill();
    }
    function drawTorch(x, y) {
      cx.fillStyle = "#3a2a1a"; cx.fillRect(x - 2, y, 4, 10); cx.fillStyle = "#6a4a2a"; cx.fillRect(x - 4, y - 2, 8, 3);
      drawFlame(x, y - 2, 1);
    }
    function drawFlame(x, y, s) {
      var f = Math.sin(st.t * 17 + x) * 0.15 + Math.sin(st.t * 9 + x * 0.3) * 0.1;
      cx.save(); cx.translate(x, y); cx.scale(s * (1 + f * 0.3), s * (1 + f));
      cx.globalCompositeOperation = "lighter";
      var g = cx.createRadialGradient(0, -3, 0, 0, -3, 12); g.addColorStop(0, "rgba(255,200,100,.5)"); g.addColorStop(1, "rgba(255,120,40,0)"); cx.fillStyle = g; cx.fillRect(-12, -16, 24, 24);
      cx.fillStyle = "#ff8a2a"; cx.beginPath(); cx.moveTo(-4, 0); cx.quadraticCurveTo(-4, -8, 0, -12 - f * 4); cx.quadraticCurveTo(4, -8, 4, 0); cx.fill();
      cx.fillStyle = "#ffe08a"; cx.beginPath(); cx.moveTo(-2, 0); cx.quadraticCurveTo(-2, -5, 0, -7 - f * 3); cx.quadraticCurveTo(2, -5, 2, 0); cx.fill();
      cx.restore();
    }
    function drawGem(x, y) {
      cx.save(); cx.translate(x, y); cx.fillStyle = "#3ac0a0"; cx.beginPath(); cx.moveTo(0, -5); cx.lineTo(4, 0); cx.lineTo(0, 5); cx.lineTo(-4, 0); cx.closePath(); cx.fill();
      cx.fillStyle = "rgba(255,255,255,.7)"; cx.beginPath(); cx.moveTo(0, -5); cx.lineTo(1.5, -1); cx.lineTo(-1.5, -1); cx.fill();
      if (Math.sin(st.t * 3 + x) > 0.92) { cx.fillStyle = "#fff"; cx.fillRect(-0.5, -8, 1, 16); cx.fillRect(-8, -0.5, 16, 1); }
      cx.restore();
    }
    function drawCanteen(x, y) {
      cx.save(); cx.translate(x, y); cx.fillStyle = "#6a7a5a"; cx.beginPath(); cx.arc(0, 0, 6, 0, 7); cx.fill(); cx.fillStyle = "#4a3a2a"; cx.fillRect(-1.5, -9, 3, 4);
      cx.strokeStyle = "#8a6a4a"; cx.lineWidth = 1; cx.beginPath(); cx.arc(0, -2, 8, Math.PI * 1.1, Math.PI * 1.9); cx.stroke();
      cx.fillStyle = "#e05050"; cx.beginPath(); cx.arc(-1.4, -0.8, 1.6, 0, 7); cx.arc(1.4, -0.8, 1.6, 0, 7); cx.fill(); cx.beginPath(); cx.moveTo(-3, -0.2); cx.lineTo(0, 3); cx.lineTo(3, -0.2); cx.fill();
      cx.restore();
    }
    function drawRelic(x, y, kind) {
      var gl = cx.createRadialGradient(x, y, 1, x, y, 20); gl.addColorStop(0, "rgba(255,220,130,.55)"); gl.addColorStop(1, "rgba(255,220,130,0)"); cx.fillStyle = gl; cx.fillRect(x - 20, y - 20, 40, 40);
      cx.save(); cx.translate(x, y); cx.fillStyle = COL.goldB;
      if (kind === 0) { cx.beginPath(); cx.arc(0, -4, 4, 0, 7); cx.fill(); cx.fillRect(-1.5, -1, 3, 9); cx.fillRect(-5, 1, 10, 2.4); }
      else if (kind === 1) { cx.beginPath(); cx.moveTo(-5, -6); cx.lineTo(5, -6); cx.lineTo(3, 1); cx.lineTo(-3, 1); cx.closePath(); cx.fill(); cx.fillRect(-1.5, 1, 3, 5); cx.fillRect(-4, 6, 8, 2); }
      else if (kind === 2) { cx.beginPath(); cx.ellipse(0, 0, 5, 6.5, 0, 0, 7); cx.fill(); cx.fillStyle = "#3a2a12"; cx.fillRect(-3, -2, 2, 3); cx.fillRect(1, -2, 2, 3); cx.fillRect(-1.5, 3, 3, 1); }
      else { cx.beginPath(); cx.moveTo(0, -7); cx.lineTo(6, 0); cx.lineTo(0, 7); cx.lineTo(-6, 0); cx.closePath(); cx.fill(); }
      cx.fillStyle = "rgba(255,255,255,.6)"; cx.fillRect(-2, -5, 1.5, 3);
      cx.restore();
    }
    function drawSpear(s) {
      cx.save(); cx.translate(s.x, s.y);
      cx.strokeStyle = "#6a4a2a"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(0, -30); cx.lineTo(0, 10); cx.stroke();
      cx.fillStyle = "#d8d0b8"; cx.beginPath(); cx.moveTo(-3, 8); cx.lineTo(0, 17); cx.lineTo(3, 8); cx.fill();
      cx.restore();
    }
    function drawBoulder(b) {
      cx.save(); cx.translate(b.x, b.y);
      cx.fillStyle = "rgba(0,0,0,.35)"; cx.beginPath(); cx.ellipse(0, b.R - 1, b.R * 0.9, 4, 0, 0, 7); cx.fill();
      cx.rotate(b.rot);
      var g = cx.createRadialGradient(-b.R * 0.35, -b.R * 0.4, 2, 0, 0, b.R); g.addColorStop(0, "#c8b090"); g.addColorStop(0.6, "#8a7458"); g.addColorStop(1, "#4a3c2c");
      cx.fillStyle = g; cx.beginPath(); for (var i = 0; i < 14; i++) { var a = i / 14 * 6.28, rr = b.R * (0.94 + ((i * 7) % 5) * 0.015); if (i) cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else cx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } cx.closePath(); cx.fill();
      cx.strokeStyle = "rgba(40,30,20,.5)"; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(-b.R * 0.5, -b.R * 0.2); cx.lineTo(b.R * 0.1, b.R * 0.1); cx.lineTo(b.R * 0.4, -b.R * 0.4); cx.moveTo(-b.R * 0.2, b.R * 0.5); cx.lineTo(0, b.R * 0.2); cx.stroke();
      cx.restore();
    }

    /* ---------- creatures ---------- */
    function drawFoe(f) {
      var d = f.dir, t = f.t;
      if (f.type === "lion" || f.type === "leopard") { drawBigCat(f.x, f.y, d, f.gait || 0, f.type, f.stun > 0, false); return; }
      cx.save(); cx.translate(f.x, f.y);
      if (f.type === "cobra") {
        cx.scale(d, 1); var rear = f.rear || 0, wig = Math.sin(t * 6) * 2;
        cx.strokeStyle = "#6a7a2a"; cx.lineWidth = 5; cx.lineCap = "round";
        cx.beginPath(); cx.moveTo(-12, -2); cx.quadraticCurveTo(-6, -6 + wig, 0, -2); cx.quadraticCurveTo(4, 0, 4, -6 - rear * 8); cx.stroke();
        cx.strokeStyle = "rgba(20,20,0,.4)"; cx.lineWidth = 1; for (var b = -10; b < 2; b += 4) { cx.beginPath(); cx.moveTo(b, -5); cx.lineTo(b + 1, 0); cx.stroke(); }
        var hy = -10 - rear * 8; cx.fillStyle = "#7e8e34"; cx.beginPath(); cx.ellipse(5, hy, 3 + rear * 3, 5 + rear, 0, 0, 7); cx.fill();
        cx.fillStyle = "#e8c04a"; cx.beginPath(); cx.arc(7, hy - 2, 1, 0, 7); cx.fill();
        if (Math.sin(t * 9) > 0.5) { cx.strokeStyle = "#c83a3a"; cx.lineWidth = 0.8; cx.beginPath(); cx.moveTo(8, hy + 1); cx.lineTo(12, hy + 1); cx.lineTo(13, hy); cx.moveTo(12, hy + 1); cx.lineTo(13, hy + 2); cx.stroke(); }
      } else if (f.type === "scorpion") {
        cx.scale(d, 1); var s2 = Math.sin(t * 5);
        cx.strokeStyle = "#4a2a14"; cx.lineWidth = 1;
        for (var l = 0; l < 4; l++) { var lx = -5 + l * 3.4, k = Math.sin(t * 14 + l * 1.5) * 1.5; cx.beginPath(); cx.moveTo(lx, -4); cx.lineTo(lx - 2 + k, -1); cx.lineTo(lx - 3 + k, 0); cx.stroke(); }
        cx.fillStyle = "#8a4a1e"; cx.beginPath(); cx.ellipse(0, -5, 8, 3.5, 0, 0, 7); cx.fill();
        cx.strokeStyle = "#8a4a1e"; cx.lineWidth = 2.2; cx.beginPath(); cx.moveTo(-7, -5); cx.quadraticCurveTo(-14, -10, -12, -16 - s2); cx.quadraticCurveTo(-8, -20, -5, -15); cx.stroke();
        cx.fillStyle = "#c83a2a"; cx.beginPath(); cx.arc(-5, -15, 1.4, 0, 7); cx.fill();
        cx.strokeStyle = "#8a4a1e"; cx.lineWidth = 1.6; cx.beginPath(); cx.moveTo(6, -5); cx.lineTo(11, -7); cx.moveTo(6, -4); cx.lineTo(11, -2); cx.stroke();
        cx.fillStyle = "#9a5a26"; cx.beginPath(); cx.ellipse(12, -7, 2.4, 1.6, -0.3, 0, 7); cx.ellipse(12, -2, 2.4, 1.6, 0.3, 0, 7); cx.fill();
      } else if (f.type === "bat") {
        var fl = f.state === "swoop" ? Math.sin(t * 22) : Math.sin(t * 2) * 0.2 - 0.8;
        cx.fillStyle = "#2a1e2a"; cx.beginPath(); cx.ellipse(0, 0, 3.5, 4.5, 0, 0, 7); cx.fill();
        cx.beginPath(); cx.moveTo(-2, -1); cx.quadraticCurveTo(-8, -6 * fl - 2, -13, -2 * fl); cx.lineTo(-9, 1); cx.lineTo(-6, -0.5); cx.lineTo(-3, 2); cx.fill();
        cx.beginPath(); cx.moveTo(2, -1); cx.quadraticCurveTo(8, -6 * fl - 2, 13, -2 * fl); cx.lineTo(9, 1); cx.lineTo(6, -0.5); cx.lineTo(3, 2); cx.fill();
        cx.fillStyle = "#ff5040"; cx.fillRect(-2, -2, 1, 1); cx.fillRect(1, -2, 1, 1);
      } else if (f.type === "gharial") {                                  // the long, thin-snouted Indus crocodilian
        var lu = f.lunge || 0; cx.scale(d, 1); cx.translate(0, -lu * 26);
        cx.fillStyle = "#4a6a3a"; cx.beginPath(); cx.ellipse(-4, 2, 12, 5, 0, 0, 7); cx.fill();
        cx.fillStyle = "#5a7a44"; var jaw = lu * 0.5;
        cx.save(); cx.translate(6, 0); cx.rotate(-jaw); cx.fillRect(0, -2, 20, 3); cx.restore();
        cx.save(); cx.translate(6, 1); cx.rotate(jaw * 0.6); cx.fillRect(0, 0, 18, 2.5); cx.restore();
        cx.fillStyle = "#e8e0c0"; for (var tt = 0; tt < 5; tt++) cx.fillRect(9 + tt * 3, 0, 1, 1.5);
        cx.fillStyle = "#e8c04a"; cx.beginPath(); cx.arc(1, -3, 1.4, 0, 7); cx.fill();
        cx.strokeStyle = "rgba(20,40,20,.6)"; cx.lineWidth = 1; for (var sc = -12; sc < 4; sc += 4) { cx.beginPath(); cx.moveTo(sc, -3); cx.lineTo(sc + 2, -5); cx.lineTo(sc + 4, -3); cx.stroke(); }
      } else if (f.type === "heron" || f.type === "crane") {
        var cr = f.type === "crane"; cx.scale(-1, 1);
        cx.strokeStyle = "#3a3a3a"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(-2, 0); cx.lineTo(-2, -14); cx.moveTo(2, 0); cx.lineTo(1, -14); cx.stroke();
        cx.fillStyle = cr ? "#f0f0ea" : "#9aa0aa"; cx.beginPath(); cx.ellipse(0, -18, 8, 5, -0.2, 0, 7); cx.fill();
        cx.strokeStyle = cr ? "#f0f0ea" : "#9aa0aa"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(5, -20); cx.quadraticCurveTo(10, -26 + Math.sin(t) * 2, 7, -32); cx.stroke();
        cx.fillStyle = cr ? "#c82a2a" : "#2a2a2a"; cx.beginPath(); cx.arc(7, -33, 2, 0, 7); cx.fill();
        cx.strokeStyle = "#c8a040"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(8, -33); cx.lineTo(15, -32); cx.stroke();
        if (cr) { cx.fillStyle = "#222"; cx.beginPath(); cx.moveTo(-6, -18); cx.lineTo(-11, -14); cx.lineTo(-4, -15); cx.fill(); }
      } else if (f.type === "peacock") {
        cx.scale(f.dir || 1, 1); var fan = f.fan || 0;
        if (fan > 0.2) { for (var e = 0; e < 11; e++) { var a = -Math.PI * 0.95 + e / 10 * Math.PI * 0.9, ex = -4 + Math.cos(a) * 24 * fan, ey = -8 + Math.sin(a) * 20 * fan; cx.strokeStyle = "#2a7a5a"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(-4, -8); cx.lineTo(-4 + Math.cos(a) * 26 * fan, -8 + Math.sin(a) * 22 * fan); cx.stroke(); cx.fillStyle = "#e8b83a"; cx.beginPath(); cx.arc(ex, ey, 2.4, 0, 7); cx.fill(); cx.fillStyle = "#1a3a8a"; cx.beginPath(); cx.arc(ex, ey, 1.1, 0, 7); cx.fill(); } }
        else { cx.fillStyle = "#2a6a4a"; cx.beginPath(); cx.moveTo(-4, -8); cx.lineTo(-24, -3); cx.lineTo(-22, 0); cx.lineTo(-4, -4); cx.fill(); }
        cx.strokeStyle = "#6a5a3a"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(-1, 0); cx.lineTo(-1, -6); cx.moveTo(2, 0); cx.lineTo(2, -6); cx.stroke();
        cx.fillStyle = "#1e4aa0"; cx.beginPath(); cx.ellipse(0, -9, 6, 4, 0, 0, 7); cx.fill();
        cx.strokeStyle = "#1e4aa0"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(3, -11); cx.quadraticCurveTo(6, -16, 4, -20); cx.stroke();
        cx.fillStyle = "#1e4aa0"; cx.beginPath(); cx.arc(4.5, -20, 2, 0, 7); cx.fill(); cx.lineWidth = 0.6; cx.beginPath(); cx.moveTo(4, -22); cx.lineTo(3, -26); cx.moveTo(5, -22); cx.lineTo(6, -26); cx.stroke();
      }
      cx.restore();
    }
    // a big cat: tiger (stripes), lion (mane), leopard (rosettes); x,y = feet
    function drawBigCat(x, y, dir, gait, kind, stunned, air) {
      var body = kind === "tiger" ? "#e08a2a" : kind === "lion" ? "#c9a060" : "#d8b060", belly = kind === "tiger" ? "#f4e2c4" : "#e8d4a8", dark = kind === "tiger" ? "#1e140c" : "#5a3a1a";
      cx.save(); cx.translate(x, y); cx.scale(dir, 1);
      var ph = gait * 2, gal = Math.sin(ph), gal2 = Math.cos(ph), bob = air ? -2 : Math.abs(gal) * 1.5;
      if (stunned) cx.rotate(Math.sin(st.t * 30) * 0.03);
      cx.fillStyle = "rgba(0,0,0,.28)"; cx.beginPath(); cx.ellipse(0, 0, 24, 3, 0, 0, 7); cx.fill();
      function leg(hx, hy, a, back) {
        var l1 = 10, l2 = 10, a2 = a + (back ? 0.6 : -0.5);
        var kx = hx + Math.sin(a) * l1, ky = hy + Math.cos(a) * l1, fx = kx + Math.sin(a2) * l2, fy = ky + Math.cos(a2) * l2;
        cx.strokeStyle = back ? shade(body, -0.25) : body; cx.lineWidth = 5; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(hx, hy); cx.lineTo(kx, ky); cx.lineTo(fx, Math.min(fy, 0)); cx.stroke();
      }
      var legA = air ? 0.9 : 0.75;
      leg(-14, -16 - bob, gal * legA, true); leg(12, -16 - bob, -gal2 * legA, true);
      cx.strokeStyle = body; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(-20, -18 - bob); cx.quadraticCurveTo(-32, -24 + gal * 4, -36, -14 + gal2 * 5); cx.stroke();
      if (kind === "lion") { cx.fillStyle = "#4a2a14"; cx.beginPath(); cx.arc(-36, -14 + gal2 * 5, 2.5, 0, 7); cx.fill(); }
      cx.fillStyle = body; cx.beginPath(); cx.ellipse(0, -19 - bob, 22, 9, air ? -0.1 : 0, 0, 7); cx.fill();
      cx.fillStyle = belly; cx.beginPath(); cx.ellipse(0, -14 - bob, 16, 4, 0, 0, 7); cx.fill();
      cx.save(); cx.beginPath(); cx.ellipse(0, -19 - bob, 22, 9, air ? -0.1 : 0, 0, 7); cx.clip();
      if (kind === "tiger") { cx.strokeStyle = dark; cx.lineWidth = 2; for (var s = -18; s < 20; s += 6) { cx.beginPath(); cx.moveTo(s, -29 - bob); cx.quadraticCurveTo(s + 3, -22 - bob, s - 1, -16 - bob); cx.stroke(); } }
      else if (kind === "leopard") { cx.strokeStyle = dark; cx.lineWidth = 1.2; for (var i = 0; i < 14; i++) { cx.beginPath(); cx.arc(-18 + (i * 37 % 36), -26 + (i * 13 % 12) - bob, 1.8, 0, 5.5); cx.stroke(); } }
      cx.fillStyle = "rgba(255,255,255,.12)"; cx.fillRect(-22, -28 - bob, 44, 3);
      cx.restore();
      leg(-12, -16 - bob, -gal * legA, false); leg(14, -16 - bob, gal2 * legA, false);
      var hx = 24, hy = -24 - bob + gal2 * 1.2;
      if (kind === "lion") { cx.fillStyle = "#7a4a1e"; cx.beginPath(); cx.arc(hx - 3, hy + 1, 11, 0, 7); cx.fill(); }
      cx.fillStyle = body; cx.beginPath(); cx.ellipse(hx, hy, 8, 7, 0, 0, 7); cx.fill();
      cx.beginPath(); cx.ellipse(hx + 7, hy + 2, 5, 4, 0, 0, 7); cx.fill();
      cx.fillStyle = belly; cx.beginPath(); cx.ellipse(hx + 8, hy + 4, 4, 2.5, 0, 0, 7); cx.fill();
      cx.fillStyle = body; cx.beginPath(); cx.moveTo(hx - 5, hy - 5); cx.lineTo(hx - 3, hy - 10); cx.lineTo(hx, hy - 6); cx.fill(); cx.beginPath(); cx.moveTo(hx + 1, hy - 6); cx.lineTo(hx + 3, hy - 10); cx.lineTo(hx + 5, hy - 5); cx.fill();
      if (kind === "tiger") { cx.strokeStyle = dark; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(hx - 2, hy - 6); cx.lineTo(hx, hy - 2); cx.moveTo(hx + 2, hy - 6); cx.lineTo(hx + 3, hy - 2); cx.stroke(); }
      cx.fillStyle = stunned ? "#fff" : "#f0d040"; cx.beginPath(); cx.arc(hx + 4, hy - 2, 1.4, 0, 7); cx.fill();
      cx.fillStyle = "#2a1a1a"; cx.beginPath(); cx.arc(hx + 11, hy + 1, 1.2, 0, 7); cx.fill();
      if (!stunned && Math.sin(st.t * 3 + x * 0.01) > 0.6) { cx.fillStyle = "#6a1a1a"; cx.beginPath(); cx.moveTo(hx + 5, hy + 4); cx.lineTo(hx + 12, hy + 4); cx.lineTo(hx + 9, hy + 8); cx.fill(); cx.fillStyle = "#fff"; cx.fillRect(hx + 6, hy + 4, 1, 2); cx.fillRect(hx + 10, hy + 4, 1, 2); }
      if (stunned) { for (var k = 0; k < 3; k++) { var a = st.t * 5 + k * 2.1; cx.fillStyle = "#ffe08a"; cx.beginPath(); cx.arc(hx + Math.cos(a) * 9, hy - 13 + Math.sin(a) * 3, 1.6, 0, 7); cx.fill(); } }
      cx.restore();
    }

    /* ---------- the explorer ---------- */
    function drawPlayer(p) {
      if (!ART.ready) return drawPlayerSimple(p);
      var M = ART.man, I = ART.img, H = 36, sc = H / M.figH;
      var moving = p.onGround && Math.abs(p.vx) > 0.4, ph = p.run, air = !p.onGround && !p.swing;
      var tF = 0, kF = 0.08, tB = 0, kB = 0.08, bob = 0, lean = 0;
      if (p.swing) { tF = -0.35 + Math.sin(st.t * 3) * 0.1; kF = 0.5; tB = 0.1; kB = 0.7; }
      else if (moving) {
        var sp = Math.min(1, Math.abs(p.vx) / 3.3);
        tF = -Math.sin(ph) * 0.62 * sp; tB = Math.sin(ph) * 0.62 * sp;
        kF = 0.1 + Math.max(0, Math.cos(ph)) * 0.95 * sp; kB = 0.1 + Math.max(0, -Math.cos(ph)) * 0.95 * sp;
        bob = -Math.abs(Math.cos(ph)) * 1.3 * sp; lean = 0.09 * sp + (p.push ? 0.22 : 0);
      } else if (air) {
        var up = clamp(-p.vy / 8.8, -1, 1);
        tF = -0.55 - 0.25 * up; kF = 0.95 + 0.35 * up; tB = 0.25; kB = 0.7 + 0.3 * up; lean = 0.06;
      } else bob = Math.sin(st.t * 2.4) * 0.35;
      if (p.land > 0) { bob += p.land * 12; kF += 0.5; kB += 0.5; tF -= 0.2; }
      if (p.inv > 1.1) lean = -0.3;
      var hipY = p.y + p.hh - M.footFromHip * sc + bob;
      cx.save(); cx.translate(p.x, hipY); cx.scale(p.face, 1);
      if (p.inv > 0 && Math.floor(p.inv * 12) % 2) cx.globalAlpha = 0.45;
      if (p.onGround) { cx.fillStyle = "rgba(0,0,0,.25)"; cx.beginPath(); cx.ellipse(0, M.footFromHip * sc - bob, 9, 2, 0, 0, 7); cx.fill(); }
      // hanging from the rope: the body tilts with it (rotate about the hands, not the hips)
      if (p.swing) { cx.translate(0, -24); cx.rotate(-p.swing.th * p.face * 0.9); cx.translate(0, 24); }
      cx.rotate(lean); cx.scale(sc, sc);
      function leg(t, k) {
        cx.save(); cx.rotate(t);
        cx.save(); cx.scale(0.8, 1); cx.drawImage(I.thigh, -M.thigh.pivotX, -M.thigh.pivotY); cx.restore();
        cx.translate(M.kneeFromHip[0] * 0.8, M.kneeFromHip[1]); cx.rotate(k);
        cx.save(); cx.scale(0.8, 1); cx.drawImage(I.shin, -M.shin.pivotX, -M.shin.pivotY); cx.restore();
        cx.restore();
      }
      cx.save(); cx.filter = "brightness(0.62)"; leg(tB, kB); cx.restore();   // back leg recedes (filter is a no-op where unsupported)
      leg(tF, kF);
      cx.drawImage(I.body, -M.body.pivotX, -M.body.pivotY);
      // the whip arm: a raised sleeve and fist while lashing or holding the rope
      var hand = null;
      if (p.whip || p.swing) {
        var sh = { x: 12, y: -228 }, a = p.swing ? -1.75 : (p.whip.up ? -1.35 : -0.25 - (p.whip.t < 0.1 ? 1.1 * (1 - p.whip.t / 0.1) : 0));
        var hx = sh.x + Math.cos(a) * 150, hy = sh.y + Math.sin(a) * 150;
        cx.strokeStyle = "#3e2616"; cx.lineWidth = 50; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(sh.x, sh.y); cx.lineTo(hx, hy); cx.stroke();
        cx.strokeStyle = "#6a4428"; cx.lineWidth = 32; cx.beginPath(); cx.moveTo(sh.x, sh.y - 8); cx.lineTo(hx, hy - 8); cx.stroke();
        cx.fillStyle = "#d9a57c"; cx.beginPath(); cx.arc(hx + Math.cos(a) * 20, hy + Math.sin(a) * 20, 24, 0, 7); cx.fill();
        var m = cx.getTransform(), hp = new DOMPoint(hx + Math.cos(a) * 24, hy + Math.sin(a) * 24).matrixTransform(m);
        hand = { x: hp.x / DPR + st.drawCam, y: hp.y / DPR - st.drawCamY };
      }
      p.hand = hand;
      cx.globalAlpha = 1; cx.restore();
    }
    function drawPlayerSimple(p) {
      cx.save(); cx.translate(p.x, p.y); cx.scale(p.face, 1);
      var leg = p.onGround && Math.abs(p.vx) > 0.4 ? Math.sin(p.run) * 4 : 0;
      cx.strokeStyle = "#2a1c10"; cx.lineWidth = 4; cx.lineCap = "round";
      cx.beginPath(); cx.moveTo(-1, 4); cx.lineTo(-3, 11 + leg); cx.moveTo(1, 4); cx.lineTo(3, 11 - leg); cx.stroke();
      cx.fillStyle = "#6a4428"; cx.fillRect(-6, -6, 12, 12);
      cx.fillStyle = "#d8ab6e"; cx.beginPath(); cx.arc(0, -11, 5, 0, 7); cx.fill();
      cx.fillStyle = "#5a3a1a"; cx.beginPath(); cx.ellipse(0, -14, 8, 3, 0, 0, 7); cx.fill(); cx.fillRect(-4, -16, 8, 3);
      cx.restore(); p.hand = null;
    }
    function drawWhip() {
      var p = st.p; if (!p.whip || p.swing) return;
      var o = p.hand || whipOrigin(), d = whipDir(), t = p.whip.t, reach = p.whip.up ? 112 : 84;
      var ext = t < 0.1 ? t / 0.1 : t < 0.16 ? 1 : Math.max(0, 1 - (t - 0.16) / 0.14);
      var tx = o.x + d.x * reach * ext, ty = o.y + d.y * reach * ext;
      var mx = (o.x + tx) / 2 - d.y * 14 * (1 - ext) * p.face, my = (o.y + ty) / 2 + d.x * 14 * (1 - ext) * p.face + 6 * (1 - ext);
      cx.strokeStyle = "#3a2412"; cx.lineWidth = 2.2; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(o.x, o.y); cx.quadraticCurveTo(mx, my, tx, ty); cx.stroke();
      cx.strokeStyle = "#7a5230"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(o.x, o.y); cx.quadraticCurveTo(mx, my - 0.6, tx, ty); cx.stroke();
      if (t > 0.09 && t < 0.15) { cx.fillStyle = "rgba(255,245,200,.9)"; cx.beginPath(); for (var i = 0; i < 8; i++) { var a = i / 8 * 6.28, r = i % 2 ? 3 : 8; cx.lineTo(tx + Math.cos(a) * r, ty + Math.sin(a) * r); } cx.fill(); }
    }
    function drawRope() {
      var p = st.p, s = p.swing, h = p.hand || { x: p.x, y: p.y - 12 };
      cx.strokeStyle = "#3a2412"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(s.ax, s.ay); cx.lineTo(h.x, h.y); cx.stroke();
      cx.strokeStyle = "rgba(150,110,70,.8)"; cx.lineWidth = 0.8; cx.beginPath(); cx.moveTo(s.ax, s.ay); cx.lineTo(h.x, h.y); cx.stroke();
    }
    function drawParts() {
      st.parts.forEach(function (q) {
        cx.globalAlpha = clamp(q.life * 1.6, 0, 1); cx.fillStyle = q.col;
        if (q.k === "spark") cx.fillRect(q.x - 1, q.y - 1, 2, 2);
        else if (q.k === "rubble") cx.fillRect(q.x - 2, q.y - 2, 4, 3);
        else if (q.k === "drop") cx.fillRect(q.x, q.y, 1.5, 3);
        else { cx.beginPath(); cx.arc(q.x, q.y, 2.2 + (1 - q.life) * 2, 0, 7); cx.fill(); }
      });
      cx.globalAlpha = 1;
    }

    /* ---------- light: dark tomb zones with torch and lantern light cut out ---------- */
    var lightCv = null, lx = null;
    function drawLighting(cam) {
      var zones = st.lv.E.dark; if (!zones.length) return;
      if (!zones.some(function (z) { return (z[1] + 1) * TILE > cam && z[0] * TILE < cam + VIEWW; })) return;
      if (!lightCv || lightCv.width !== Math.round(VIEWW * DPR)) { lightCv = document.createElement("canvas"); lightCv.width = Math.round(VIEWW * DPR); lightCv.height = Math.round(VIEWH * DPR); lx = lightCv.getContext("2d"); }
      lx.setTransform(DPR, 0, 0, DPR, 0, 0); lx.globalCompositeOperation = "source-over"; lx.clearRect(0, 0, VIEWW, VIEWH);
      zones.forEach(function (z) {
        var x0 = z[0] * TILE - cam, x1 = (z[1] + 1) * TILE - cam, ramp = 72;
        var g = lx.createLinearGradient(x0 - ramp * 0.3, 0, x0 + ramp, 0); g.addColorStop(0, "rgba(6,4,3,0)"); g.addColorStop(1, "rgba(6,4,3,.9)");
        lx.fillStyle = g; lx.fillRect(x0 - ramp * 0.3, 0, ramp * 1.3, VIEWH);
        lx.fillStyle = "rgba(6,4,3,.9)"; lx.fillRect(x0 + ramp, 0, Math.max(0, x1 - x0 - ramp), VIEWH);
      });
      lx.globalCompositeOperation = "destination-out";
      function hole(x, y, r, a) { var g = lx.createRadialGradient(x, y, r * 0.15, x, y, r); g.addColorStop(0, "rgba(0,0,0," + a + ")"); g.addColorStop(1, "rgba(0,0,0,0)"); lx.fillStyle = g; lx.beginPath(); lx.arc(x, y, r, 0, 7); lx.fill(); }
      st.lv.E.torches.forEach(function (tc) { var x = tc.c * TILE + 12 - cam, fl = 1 + Math.sin(st.t * 13 + tc.c) * 0.05 + Math.sin(st.t * 7.3 + tc.c * 2) * 0.04; if (x > -120 && x < VIEWW + 120) hole(x, tc.r * TILE + 6, 92 * fl, 0.95); });
      hole(st.p.x - cam, st.p.y - 4, 66, 0.82);
      st.boulders.forEach(function (b) { if (b.state === "roll") hole(b.x - cam, b.y, 58, 0.7); });
      st.spears.forEach(function (sp) { hole(sp.x - cam, sp.y, 22, 0.5); });
      st.relics.forEach(function (rl) { if (!rl.got) hole(rl.x - cam, rl.y, 30, 0.6); });
      st.lv.E.glyphsets.forEach(function (gs) { gs.tiles.forEach(function (tl) { if (tl.lit) hole(tl.c * TILE + 12 - cam, (tl.r + 1) * TILE - 10, 34, 0.7); }); });
      st.checks.forEach(function (k) { if (k.on) hole(k.x - cam, k.y - 8, 60, 0.8); });
      hole(st.exit.x - cam, st.exit.y - 22, 60, 0.7);
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(lightCv, 0, 0); cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx.globalCompositeOperation = "lighter";
      st.lv.E.torches.forEach(function (tc) { var x = tc.c * TILE + 12 - cam; if (x < -80 || x > VIEWW + 80) return; var g = cx.createRadialGradient(x, tc.r * TILE + 6, 2, x, tc.r * TILE + 6, 70); g.addColorStop(0, "rgba(255,150,60,.22)"); g.addColorStop(1, "rgba(255,120,40,0)"); cx.fillStyle = g; cx.fillRect(x - 70, tc.r * TILE - 64, 140, 140); });
      cx.globalCompositeOperation = "source-over";
    }
    function drawWeather(B, cam) {
      var m = cam + VIEWW / 2, inDark = st.lv.E.dark.some(function (z) { return m > z[0] * TILE && m < (z[1] + 1) * TILE; });
      var kind = inDark ? "motes" : B.weather;
      st.weather.forEach(function (w, i) {
        if (kind === "rain") { w.y += 7 + w.s * 4; w.x -= 1.5; if (w.y > VIEWH) { w.y = -10; w.x = Math.random() * (VIEWW + 40); } cx.strokeStyle = "rgba(180,210,230,.35)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(w.x, w.y); cx.lineTo(w.x - 2, w.y + 9); cx.stroke(); }
        else if (kind === "snow") { w.y += 0.5 + w.s * 0.8; w.x += Math.sin(st.t + i) * 0.4 - 0.6; if (w.y > VIEWH) { w.y = -4; w.x = Math.random() * VIEWW; } if (w.x < -4) w.x = VIEWW; cx.fillStyle = "rgba(245,245,255,.7)"; cx.beginPath(); cx.arc(w.x, w.y, 0.8 + w.s, 0, 7); cx.fill(); }
        else if (kind === "dust") { w.x -= 0.8 + w.s; w.y += Math.sin(st.t * 2 + i) * 0.2; if (w.x < -4) { w.x = VIEWW + 4; w.y = Math.random() * VIEWH; } cx.fillStyle = "rgba(240,200,140," + (0.12 + w.s * 0.2) + ")"; cx.fillRect(w.x, w.y, 1.5, 1.5); }
        else if (kind === "fireflies") { if (i > 26) return; var fx = ((w.x + Math.sin(st.t * 0.7 + i) * 20) % VIEWW + VIEWW) % VIEWW, fy = VIEWH * 0.45 + w.y * 0.5 + Math.cos(st.t * 0.9 + i * 2) * 10; cx.fillStyle = "rgba(230,255,140," + (0.3 + 0.5 * Math.max(0, Math.sin(st.t * 2 + i * 3))) + ")"; cx.beginPath(); cx.arc(fx, fy, 1.4, 0, 7); cx.fill(); }
        else if (kind === "leaves") { if (i > 30) return; w.y += 0.5 + w.s * 0.5; w.x += Math.sin(st.t * 1.5 + i) * 0.8 - 0.3; if (w.y > VIEWH) { w.y = -6; w.x = Math.random() * VIEWW; } cx.save(); cx.translate(w.x, w.y); cx.rotate(st.t * 2 + i); cx.fillStyle = i % 3 ? "rgba(170,190,80,.7)" : "rgba(220,140,60,.7)"; cx.beginPath(); cx.ellipse(0, 0, 3, 1.3, 0, 0, 7); cx.fill(); cx.restore(); }
        else if (kind === "motes") { if (i > 30) return; var mx = ((w.x + st.t * 3 * (w.s - 0.5)) % VIEWW + VIEWW) % VIEWW, my = (w.y + Math.sin(st.t * 0.5 + i) * 6 + VIEWH) % VIEWH; cx.fillStyle = "rgba(255,220,160," + (0.1 + w.s * 0.2) + ")"; cx.fillRect(mx, my, 1.2, 1.2); }
      });
    }

    /* ---------------- HUD ---------------- */
    function updateHUD() {
      hudEl.innerHTML = '<div class="pm-stat"><b class="tr-hearts">' + "♥".repeat(Math.max(0, st.hearts)) + '<span class="tr-lost">' + "♥".repeat(Math.max(0, MAXHEARTS - Math.max(0, st.hearts))) + '</span></b><span>Life</span></div>' +
        '<div class="pm-stat"><b>' + st.got + '/' + st.relics.length + '</b><span>Relics</span></div>' +
        '<div class="pm-stat"><b>' + (st.li + 1) + '/4</b><span>Site</span></div>' +
        '<div class="pm-stat"><b>' + run.score + '</b><span>Plunder</span></div>';
    }
    function toast(html) { if (live) live.innerHTML = html; }
    function showFact(f) {
      toast('<span class="ouro-sym">𓋹</span> <strong>' + esc(f.label) + " recovered.</strong> " + esc(f.fact) +
        ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a>");
    }

    var hudCache = "";
    function loop(ts) {
      if (!running) return;
      var dt = Math.min(0.1, (ts - last) / 1000 || 0); last = ts; acc += dt;
      var n = 0; while (acc >= STEP && n < 6) { step(); acc -= STEP; n++; }
      if (n === 6) acc = 0;
      if (!running) return;
      draw();
      var h = st.hearts + "|" + st.got + "|" + run.score; if (h !== hudCache) { hudCache = h; updateHUD(); }
      if (running) raf = requestAnimationFrame(loop);
    }

    /* ---------------- story flow ---------------- */
    function stopLoop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function siteRecapList() {
      if (!run.collected.length) return '<p class="rq-note" style="text-align:center">No relics carried out yet.</p>';
      var items = run.collected.map(function (f) { return '<li><strong>' + esc(f.label) + ".</strong> " + esc(f.fact) + ' <a class="game-source" href="chapters/' + f.chapter + '.html">› ' + esc(chapterTitle(f.chapter)) + "</a></li>"; }).join("");
      return '<ul class="ouro-facts">' + items + "</ul>";
    }
    function portrait(smile) {
      return '<img class="tr-portrait" src="' + ART_BASE + (smile ? "portrait-smile" : "portrait") + '.png?v=1" alt="" width="220" height="273">';
    }
    function storyCard(opts) {
      stopLoop();
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.4rem"><p class="eyebrow">The Tomb Robber · ' + esc(opts.eyebrow) + '</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.25rem">' + esc(opts.title) + '</h2></div>' +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="tr-card">' + portrait(opts.smile) + opts.body + '</div>' +
        '<div class="rq-actions" style="gap:.5rem;margin-top:.6rem">' +
          '<button class="rq-btn rq-primary" data-a="go" autofocus>' + esc(opts.cta) + '</button>' +
          (opts.chapter ? '<a class="game-source" href="chapters/' + opts.chapter + '.html">› ' + esc(chapterTitle(opts.chapter)) + "</a>" : "") +
        "</div>";
      root.querySelector('[data-a="go"]').addEventListener("click", opts.onGo);
    }
    function startRun() {
      run = { score: 0, hearts: MAXHEARTS, collected: [] };
      var story = DATA.story || {};
      storyCard({
        eyebrow: "the field journal", title: (story.title || "The Expedition"),
        body: '<p>' + esc(story.intro || "") + '</p>' +
          '<p class="tr-route">Egypt&nbsp;→&nbsp;Sumer&nbsp;→&nbsp;the Indus&nbsp;→&nbsp;the road east. Four sites. Bring back what you can.</p>' +
          '<p class="rq-note" style="text-align:center">Run, leap and crack the whip — it drops snakes, staggers big cats, throws levers and swings you from bronze rings.</p>',
        cta: "Begin the expedition", onGo: function () { enterSite(0); }
      });
    }
    function enterSite(i) {
      run.hearts = MAXHEARTS;
      var L = LEVELS[i], site = ((DATA.story || {}).sites || [])[i] || {};
      storyCard({
        eyebrow: "site " + (i + 1) + " of 4 · " + L.place, title: L.name, chapter: L.chapter,
        body: '<p>' + esc(site.enter || "") + '</p>' +
          '<p class="rq-note" style="text-align:center;margin-top:.5rem">Reach the far door — lift every relic you can on the way. ' + factsForLevel(i).length + ' wait in the ruin.</p>',
        cta: "Enter " + L.place, onGo: function () { playSite(i); }
      });
    }
    function playSite(i) {
      shell(); newLevel(i); updateHUD(); acc = 0; hudCache = "";
      toast('<strong>' + esc(LEVELS[i].place) + ' — ' + esc(LEVELS[i].name) + '.</strong> Run for the far door.');
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }
    function clearedSite() {
      stopLoop();
      var i = st.li, site = ((DATA.story || {}).sites || [])[i] || {};
      if (i < LEVELS.length - 1) {
        storyCard({
          eyebrow: LEVELS[i].place + " cleared", title: "Onward", smile: true,
          body: '<p>' + esc(site.clear || "") + '</p>' +
            '<p class="rq-note" style="text-align:center">Plunder so far: <strong>' + run.score + '</strong> · relics carried: <strong>' + run.collected.length + '</strong></p>',
          cta: "To " + LEVELS[i + 1].place, onGo: function () { enterSite(i + 1); }
        });
      } else endScreen(true);
    }
    function endScreen(won) {
      stopLoop();
      var story = DATA.story || {};
      var nb = run.score > best; if (nb) best = run.score;
      AG.addHighScore("treasure", { score: run.score });
      root.innerHTML =
        '<div class="game-head"><p class="eyebrow">The Tomb Robber · ' + (won ? "the journal is full" : "the ruin claims you") + '</p>' +
          '<h2 id="' + ctx.titleId + '">' + (won ? "The expedition, finished" : "Lost on the " + LEVELS[st.li].place + " road") + '</h2>' +
          '<p>' + run.collected.length + ' relic' + (run.collected.length === 1 ? "" : "s") + ' · ' + run.score + ' in plunder' + (nb ? ' · <span style="color:var(--gold-bright)">a new best</span>' : "") + "</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="tr-card" style="margin-bottom:.5rem">' + portrait(won) + '<p>' + esc(won ? (story.outroWin || "") : (story.outroLose || "")) + '</p></div>' +
        '<p class="rq-note" style="text-align:center;margin-bottom:.3rem">' + (won ? "Everything the expedition was really after — the meaning, sourced:" : "What you did carry out:") + '</p>' +
        siteRecapList() +
        '<div class="rq-actions" style="gap:.5rem">' +
          (won ? "" : '<button class="rq-btn rq-primary" data-a="retry" autofocus>Retry ' + esc(LEVELS[st.li].place) + '</button>') +
          '<button class="rq-btn' + (won ? " rq-primary" : "") + '" data-a="again"' + (won ? " autofocus" : "") + '>' + (won ? "Run it again" : "Start over") + '</button>' +
          '<a class="game-source" href="chapters/ch02.html">› Read “Egypt”</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", startRun);
      var rt = root.querySelector('[data-a="retry"]');
      if (rt) rt.addEventListener("click", function () { var li = st.li; run.collected = run.collected.filter(function (f) { return (f.level | 0) !== li; }); enterSite(li); });
    }

    /* ---------------- shell / input ---------------- */
    function setKey(k, on) { if (on && !keys[k]) press[k] = true; keys[k] = on; }
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.2rem">The Tomb Robber</h2></div>' +
        '<div class="pm-hud tr-hud"></div>' +
        '<div class="tr-stage"><canvas class="tr-canvas" width="' + VIEWW + '" height="' + VIEWH + '" role="img" aria-label="Expedition platformer"></canvas></div>' +
        '<p class="ouro-toast tr-toast" aria-live="polite"></p>' +
        '<div class="tr-controls"><button class="ouro-key" data-k="left" aria-label="Left">◀</button>' +
          '<button class="ouro-key" data-k="right" aria-label="Right">▶</button>' +
          '<span class="tr-gap"></span>' +
          '<button class="ouro-key tr-whip" data-k="whip" aria-label="Crack the whip">Whip</button>' +
          '<button class="ouro-key tr-jump" data-k="jump" aria-label="Jump">⤒</button></div>' +
        '<p class="rq-note tr-keys">←/→ run · ↑ or Space jump (hold for height) · <b>J</b> or <b>X</b> whip · whip a bronze ring to swing, jump to let go, ↓ to drop.</p>';
      canvas = root.querySelector(".tr-canvas"); cx = canvas.getContext("2d");
      DPR = Math.min(2.5, Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, (canvas.getBoundingClientRect().width || VIEWW) / VIEWW)); canvas.width = Math.round(VIEWW * DPR); canvas.height = Math.round(VIEWH * DPR);
      hudEl = root.querySelector(".tr-hud"); live = root.querySelector(".tr-toast");
      root.querySelectorAll(".tr-controls .ouro-key").forEach(function (b) {
        var k = b.getAttribute("data-k");
        var dn = function (e) { e.preventDefault(); setKey(k, true); }, up = function () { setKey(k, false); };
        b.addEventListener("touchstart", dn, { passive: false }); b.addEventListener("touchend", up); b.addEventListener("touchcancel", up);
        b.addEventListener("mousedown", dn); b.addEventListener("mouseup", up); b.addEventListener("mouseleave", up);
      });
    }
    function mapKey(k) {
      if (k === "arrowleft" || k === "a") return "left";
      if (k === "arrowright" || k === "d") return "right";
      if (k === " " || k === "spacebar" || k === "w" || k === "arrowup") return "jump";
      if (k === "arrowdown" || k === "s") return "down";
      if (k === "j" || k === "x" || k === "k") return "whip";
      return null;
    }
    keyfn = function (e) { var m = mapKey(e.key.toLowerCase()); if (!m || !running) return; e.preventDefault(); if (!e.repeat) setKey(m, true); };
    keyup = function (e) { var m = mapKey(e.key.toLowerCase()); if (m) setKey(m, false); };
    document.addEventListener("keydown", keyfn); document.addEventListener("keyup", keyup);

    // test hooks (CI / capture only)
    if (window.__TR_TEST) {
      window.__tr = {
        state: function () { return st && { li: st.li, x: st.p.x, y: st.p.y, vx: st.p.vx, onGround: st.p.onGround, hearts: st.hearts, got: st.got, total: st.relics.length, over: st.over, won: !!st.won, gates: st.lv.E.gates.map(function (g) { return +g.open.toFixed(2); }), swing: !!st.p.swing, cam: st.cam, vy: st.p.vy, movers: st.movers.map(function (m) { return +(m.x / TILE).toFixed(1); }), trig: st.lv.E.gates.map(function (g) { return g.trig.map(trigOk); }), t: +st.t.toFixed(2) }; },
        warp: function (c, r) { st.p.x = c * TILE + 12; st.p.y = (r == null ? standRowAt(c) + 1 : r + 1) * TILE - 12.01; st.p.vx = st.p.vy = 0; st.p.swing = null; st.cam = clamp(st.p.x - VIEWW * 0.45, 0, st.LW - VIEWW); },
        play: function (i) { if (!run) run = { score: 0, hearts: MAXHEARTS, collected: [] }; if (!DATA) return false; playSite(i); return true; },
        god: function () { st.hearts = 99; run.hearts = 99; },
        solve: function () { st.lv.E.gates.forEach(function (g) { g.trig.forEach(function (o) { if (o.solved != null) o.solved = true; else if (o.on != null) o.on = true; else o.forced = true; }); }); }
      };
    }

    loadArt();
    root.innerHTML = '<div class="rq-loading">Lighting the torches…</div>';
    loadData().then(startRun).catch(function () { root.innerHTML = '<p class="game-placeholder">The expedition could not be loaded. Please reload the page.</p>'; });

    return function cleanup() { running = false; if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); if (keyup) document.removeEventListener("keyup", keyup); };
  }
})();
