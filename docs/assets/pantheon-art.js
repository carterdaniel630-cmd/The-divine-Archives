/* ==========================================================================
   THE DIVINE ARCHIVES — Pantheon emblems

   Builds each figure's portrait as an inline SVG from its recipe in
   pantheon-data.js ("head crown item background extras"). Every emblem uses the
   same parts, drawn in the archive's gold line style on a dark roundel, tinted by
   the tradition's colour. The emblems are interpretive: they put a figure's
   traditional attributes together. They are not copies of any historical image.

   Used by the Pantheon page (in the browser) and by tools/build-chapters.js
   (in Node), so it touches no DOM.
   ========================================================================== */
(function () {
  "use strict";

  // class shorthands: s = silhouette (dark fill, gold edge), l = gold line,
  // a = tradition-coloured line, f = gold fill, d = dark fill only
  function P(d, c) { return '<path class="pt-' + (c || "l") + '" d="' + d + '"/>'; }
  function C(x, y, r, c) { return '<circle class="pt-' + (c || "l") + '" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; }
  function E(x, y, rx, ry, c, rot) { return '<ellipse class="pt-' + (c || "l") + '" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + " " + x + " " + y + ')"' : "") + "/>"; }
  function star4(x, y, r) { return P("M" + x + " " + (y - r) + " L" + (x + r * .28) + " " + (y - r * .28) + " L" + (x + r) + " " + y + " L" + (x + r * .28) + " " + (y + r * .28) + " L" + x + " " + (y + r) + " L" + (x - r * .28) + " " + (y + r * .28) + " L" + (x - r) + " " + y + " L" + (x - r * .28) + " " + (y - r * .28) + " Z", "af"); }

  // ---------------------------------------------------------------- backgrounds (tradition colour)
  var BG = {
    sun: function () { var s = C(50, 46, 17, "a"); for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r1 = 22, r2 = i % 2 ? 30 : 36; s += P("M" + (50 + r1 * Math.cos(a)).toFixed(1) + " " + (46 + r1 * Math.sin(a)).toFixed(1) + " L" + (50 + r2 * Math.cos(a)).toFixed(1) + " " + (46 + r2 * Math.sin(a)).toFixed(1), "a"); } return s; },
    moon: function () { return P("M30 16 A22 22 0 1 0 58 44 A17 17 0 1 1 30 16 Z", "a") + star4(74, 22, 3) + star4(80, 38, 2); },
    stars: function () { return star4(22, 26, 4) + star4(78, 20, 3) + star4(83, 44, 2.4) + star4(16, 50, 2.4) + star4(34, 12, 2) + star4(64, 12, 2) + star4(86, 64, 2); },
    waves: function () { var s = ""; for (var j = 0; j < 3; j++) { var y = 54 + j * 9; s += P("M4 " + y + " q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0", "a"); } return s; },
    flames: function () { return P("M14 92 C8 74 20 70 16 56 C26 64 28 76 24 92 M86 92 C92 74 80 70 84 56 C74 64 72 76 76 92 M26 92 C22 80 30 76 30 66 C36 74 36 84 34 92 M74 92 C78 80 70 76 70 66 C64 74 64 84 66 92", "a"); },
    tree: function () { return P("M50 60 L50 10 M50 30 L30 16 M50 30 L70 16 M50 22 L38 8 M50 22 L62 8 M30 16 L20 18 M70 16 L80 18 M36 24 L22 30 M64 24 L78 30", "a") + C(20, 18, 2, "af") + C(80, 18, 2, "af") + C(22, 30, 2, "af") + C(78, 30, 2, "af"); },
    storm: function () { return P("M14 30 q0 -10 10 -10 q4 -8 14 -4 q8 -6 14 2 q10 -2 10 8 q6 4 0 10 H18 q-6 -2 -4 -6 Z", "a") + P("M70 18 L62 34 L70 34 L60 52", "a") + P("M26 38 L22 48", "a") + P("M36 38 L32 48", "a"); },
    earth: function () { return P("M4 70 H96 M4 78 H96 M4 86 H96 M10 62 H90", "a") + C(16, 74, 1.4, "af") + C(84, 82, 1.4, "af") + C(28, 82, 1.2, "af") + C(72, 66, 1.2, "af"); },
    mountain: function () { return P("M2 78 L20 50 L30 62 L42 40 L50 52 L58 40 L70 62 L80 50 L98 78", "a") + P("M38 46 L42 40 L46 46 M54 46 L58 40 L62 46", "a"); },
    clouds: function () { return P("M8 34 q0 -8 8 -8 q2 -8 12 -6 q6 -6 12 2 q8 0 8 8 Z M60 22 q0 -7 7 -7 q2 -7 10 -5 q6 -4 10 2 q7 1 6 10 Z", "a"); }
  };

  // ---------------------------------------------------------------- crowns and headdresses (drawn over the head; head top ~y33)
  var HAT_BACK = {
    halo: function () { return C(50, 45, 19, "a") + C(50, 45, 22, "a"); },
    rays: function () { var s = ""; for (var i = 0; i < 13; i++) { var a = Math.PI + i * Math.PI / 12, r2 = i % 2 ? 24 : 29; s += P("M" + (50 + 15 * Math.cos(a)).toFixed(1) + " " + (46 + 15 * Math.sin(a)).toFixed(1) + " L" + (50 + r2 * Math.cos(a)).toFixed(1) + " " + (46 + r2 * Math.sin(a)).toFixed(1)); } return s; },
    hood: function () { var s = ""; for (var i = 0; i < 5; i++) { var a = Math.PI * (1.12 + i * .19), x = 50 + 19 * Math.cos(a), y = 44 + 19 * Math.sin(a); s += E(x.toFixed(1), y.toFixed(1), 4.2, 6, "s", (a * 180 / Math.PI + 90).toFixed(0)); } return P("M33 60 C28 40 36 24 50 22 C64 24 72 40 67 60", "s") + s; },
    veil: function () { return P("M36 44 C36 28 44 24 50 24 C56 24 64 28 64 44 L70 76 L60 70 L58 46 C58 38 54 34 50 34 C46 34 42 38 42 46 L40 70 L30 76 Z", "s"); },
    lionskin: function () { return P("M34 50 C30 36 36 24 50 22 C64 24 70 36 66 50 L70 70 L62 66 L60 48 L40 48 L38 66 L30 70 Z", "s") + P("M40 26 l-2 -4 M46 23 l-1 -4 M54 23 l1 -4 M60 26 l2 -4"); }
  };
  var HAT = {
    crown: function () { return P("M39 36 L39 26 L44 31 L47 23 L50 30 L53 23 L56 31 L61 26 L61 36 Z", "s") + C(50, 33, 1.3, "f"); },
    horns: function () { return P("M40 37 C40 22 45 17 50 17 C55 17 60 22 60 37 Z", "s") + P("M40.5 32 Q50 27 59.5 32 M41.5 26 Q50 21 58.5 26") + C(50, 17, 1.6, "f"); },
    hhelm: function () { return P("M40 37 C41 24 46 17 50 14 C54 17 59 24 60 37 Z", "s") + P("M41 32 C33 30 30 24 32 18 M59 32 C67 30 70 24 68 18"); },
    disk: function () { return C(50, 22, 9, "s") + C(50, 22, 5, "a") + P("M44 33 Q50 28 56 33") + P("M50 32 q-3 -4 0 -6 q3 2 0 6", "f"); },
    cowdisk: function () { return P("M38 36 C32 30 32 20 40 16 M62 36 C68 30 68 20 60 16") + C(50, 22, 8, "s") + C(50, 22, 4, "a"); },
    atef: function () { return P("M45 35 C44 24 46 16 50 10 C54 16 56 24 55 35 Z", "s") + P("M44 35 C40 26 40 18 42 10 M56 35 C60 26 60 18 58 10") + C(50, 9, 1.6, "f"); },
    double: function () { return P("M42 36 L42 26 L58 26 L58 36 Z M58 26 L58 12 L62 12 L62 26", "s") + P("M46 26 C45 20 47 14 50 10 C53 14 55 20 54 26 Z", "s") + P("M44 26 Q40 22 42 17"); },
    helmet: function () { return P("M38 44 C37 30 43 26 50 26 C57 26 63 30 62 44 L58 44 L58 38 L42 38 L42 44 Z", "s") + P("M40 30 C44 16 56 16 60 30 C56 22 44 22 40 30 Z", "s") + P("M42 26 L58 26"); },
    winged: function () { return P("M40 34 Q50 28 60 34 L60 32 Q50 24 40 32 Z", "s") + P("M40 32 C34 30 30 26 30 22 C34 26 38 26 41 28 M60 32 C66 30 70 26 70 22 C66 26 62 26 59 28"); },
    antlers: function () { return P("M44 34 C40 26 36 20 30 14 M38 22 L32 22 M35 18 L36 12 M56 34 C60 26 64 20 70 14 M62 22 L68 22 M65 18 L64 12"); },
    feathers: function () { var s = ""; for (var i = 0; i < 7; i++) { var a = Math.PI * (1.15 + i * .117), x = 50 + 20 * Math.cos(a), y = 38 + 20 * Math.sin(a); s += E(x.toFixed(1), y.toFixed(1), 3, 9, "s", (a * 180 / Math.PI + 90).toFixed(0)); } return s + P("M39 37 Q50 31 61 37"); },
    topknot: function () { return P("M44 34 C43 26 46 21 50 20 C54 21 57 26 56 34 Z", "s") + P("M55 23 A5 5 0 1 1 55 15 A3.6 3.6 0 1 0 55 23 Z", "f"); },
    throne: function () { return P("M43 34 L43 22 L50 22 L50 16 L57 16 L57 34 Z", "s") + P("M43 28 L57 28"); },
    feather: function () { return P("M52 34 C49 24 50 14 55 6 C60 14 58 26 54 34 Z", "s") + P("M54 34 C54 24 55 14 55 8") + P("M43 34 Q50 31 57 34"); },
    crescent: function () { return P("M40 28 A10 10 0 0 0 60 28 A8 7 0 0 1 40 28 Z", "f"); },
    wreath: function () { var s = P("M39 36 Q50 30 61 36"); for (var i = 0; i < 5; i++) { s += E(41 + i * 4.4, 34.2 - (i === 2 ? 1.6 : i % 4 ? 1 : 0), 1.6, 3, "s", i < 2 ? -40 : i > 2 ? 40 : 0); } return s; },
    cap: function () { return P("M40 37 C39 26 44 21 52 21 C60 21 64 26 62 30 C60 28 58 28 58 31 L60 37 Z", "s"); },
    hat: function () { return P("M32 36 C38 33 62 33 68 36 C62 38 38 38 32 36 Z", "s") + P("M41 35 C41 26 45 22 50 22 C55 22 59 26 59 35 Z", "s"); },
    tophat: function () { return P("M34 35 L66 35 L66 32 L34 32 Z", "s") + P("M41 32 L42 14 L58 14 L59 32 Z", "s") + P("M42 28 L58 28"); },
    mian: function () { return P("M34 26 L66 26 L64 30 L36 30 Z", "s") + P("M44 36 L44 30 L56 30 L56 36 Z", "s") + P("M36 30 v8 M40 30 v8 M60 30 v8 M64 30 v8"); },
    peacock: function () { return P("M54 34 C56 26 58 20 62 14") + E(63, 13, 3.4, 4.6, "s") + C(63, 13, 1.6, "a") + P("M42 34 Q50 30 58 34"); },
    mural: function () { return P("M39 36 L39 24 L43 24 L43 27 L47 27 L47 24 L53 24 L53 27 L57 27 L57 24 L61 24 L61 36 Z", "s"); },
    triplemoon: function () { return C(50, 24, 5.5, "s") + P("M40 20 A6 6 0 1 0 40 30 A5 5 0 1 1 40 20 Z", "f") + P("M60 20 A6 6 0 1 1 60 30 A5 5 0 1 0 60 20 Z", "f"); }
  };

  // ---------------------------------------------------------------- heads
  var HEAD = {
    human: function () { return E(50, 46, 10.5, 13, "s"); },
    half: function () { return E(50, 46, 10.5, 13, "s") + P("M50 33 A10.5 13 0 0 1 50 59 Z", "f"); },
    falcon: function () { return E(49, 46, 10, 12, "s") + P("M57 41 C64 42 66 47 62 53 C61 49 59 48 56 48", "s") + P("M46 44 q-4 6 -2 11") + C(52, 43, 1.3, "f"); },
    canine: function () { return P("M42 40 L40 22 L47 34 M53 34 L58 21 L58 38", "s") + P("M40 40 C40 34 46 32 52 34 C58 36 64 42 72 46 C70 50 62 52 56 52 C54 58 44 60 40 54 Z", "s") + C(52, 40, 1.3, "f"); },
    ibis: function () { return P("M44 70 C44 60 46 54 50 50 L55 52 C52 58 52 64 56 70 Z", "s") + E(51, 44, 8, 8.5, "s") + P("M44 44 C34 46 28 54 26 66", "sw2") + C(49, 42, 1.3, "f"); },
    elephant: function () { return E(37, 45, 7, 11, "s") + E(63, 45, 7, 11, "s") + E(50, 44, 10, 12, "s") + P("M47 52 C46 62 50 68 56 68 C54 66 52 62 53 54", "s") + P("M46 53 L42 56 M54 53 L58 56") + C(46, 42, 1.1, "f") + C(54, 42, 1.1, "f"); },
    monkey: function () { return C(39, 45, 4, "s") + C(61, 45, 4, "s") + E(50, 45, 10.5, 12, "s") + E(50, 51, 6.5, 5, "s") + C(46, 42, 1.1, "f") + C(54, 42, 1.1, "f"); },
    bird: function () { return E(49, 45, 10, 12, "s") + P("M58 42 L72 45 L58 49 Z", "s") + C(53, 42, 1.3, "f") + P("M44 36 l2 -5 l2 4 l2 -5 l2 5", "l"); },
    goat: function () { return P("M43 36 C36 30 34 22 40 16 C40 22 42 28 46 32 M57 36 C64 30 66 22 60 16 C60 22 58 28 54 32") + P("M42 38 C42 32 58 32 58 38 L56 54 C54 60 46 60 44 54 Z", "s") + P("M47 60 L50 66 L53 60") + C(46, 42, 1.1, "f") + C(54, 42, 1.1, "f") + P("M36 40 l6 2 M64 40 l-6 2"); },
    janus: function () { return P("M50 33 C44 33 40 38 40 42 L36 46 L40 48 C40 54 44 59 50 59 Z", "s") + P("M50 33 C56 33 60 38 60 42 L64 46 L60 48 C60 54 56 59 50 59 Z", "s") + P("M50 33 L50 59"); },
    sundisk: function () { var s = ""; for (var i = 0; i < 24; i++) { var a = i * Math.PI / 12, r2 = i % 2 ? 34 : 39; s += P("M" + (50 + 25 * Math.cos(a)).toFixed(1) + " " + (50 + 25 * Math.sin(a)).toFixed(1) + " L" + (50 + r2 * Math.cos(a)).toFixed(1) + " " + (50 + r2 * Math.sin(a)).toFixed(1)); } return s + C(50, 50, 23, "s") + C(50, 50, 19) + C(43, 46, 2, "f") + C(57, 46, 2, "f") + P("M44 57 Q50 61 56 57") + P("M50 48 L48 53 L51 53"); }
  };

  // ---------------------------------------------------------------- bodies
  function bust() { return P("M18 100 C20 80 32 70 50 70 C68 70 80 80 82 100 Z", "s") + P("M45 57 L45 70 M55 57 L55 70") + P("M36 78 Q50 86 64 78", "a"); }
  var BODY = {
    serpent: function (head) {
      var s = P("M14 96 C10 80 30 74 44 80 C60 86 78 80 76 64 C74 50 50 56 40 50 C28 42 36 30 50 30", "sw") + P("M14 96 C10 80 30 74 44 80 C60 86 78 80 76 64 C74 50 50 56 40 50 C28 42 36 30 50 30", "sin");
      if (head === "lion") s += C(54, 29, 12, "s") + E(56, 30, 7, 8, "s") + C(58, 28, 1.3, "f") + P("M42 24 l-4 -3 M44 18 l-3 -4 M50 16 l0 -5 M58 16 l2 -5 M64 20 l4 -3");
      else s += E(56, 30, 9, 6, "s", -12) + C(58, 28, 1.3, "f") + P("M64 32 l6 1 l-3 2 M70 33 l2 -2");
      return s;
    },
    flame: function () { return P("M50 12 C58 26 72 34 70 56 C69 74 60 84 50 86 C40 84 31 74 30 56 C28 40 42 34 44 22 C48 30 46 36 50 40 C52 32 48 22 50 12 Z", "s") + P("M50 44 C56 52 58 62 54 72 C52 78 48 78 46 72 C42 62 46 54 50 44 Z", "a") + C(45, 58, 1.4, "f") + C(55, 58, 1.4, "f"); },
    void: function () { return C(50, 50, 30) + C(50, 50, 22, "a") + C(50, 50, 14) + C(50, 50, 6, "a") + C(50, 50, 2, "f"); },
    peacock: function () {
      var s = "";
      for (var i = 0; i < 9; i++) { var a = Math.PI * (1.05 + i * .1125), x = 50 + 30 * Math.cos(a), y = 70 + 30 * Math.sin(a); s += P("M50 70 L" + x.toFixed(1) + " " + y.toFixed(1), "a") + E(x.toFixed(1), y.toFixed(1), 4, 5.5, "s") + C(x.toFixed(1), y.toFixed(1), 1.8, "af"); }
      return s + P("M42 96 C40 80 44 66 50 58 C56 66 60 80 58 96 Z", "s") + P("M50 58 C48 50 48 44 52 40 C56 38 60 40 60 44 C58 44 55 46 54 50 C53 54 52 56 50 58 Z", "s") + P("M60 44 L65 45 L60 46") + C(56, 42, 1, "f") + P("M52 38 l-2 -6 M54 38 l0 -6 M56 38 l2 -6") + C(50, 32, 1, "f") + C(54, 32, 1, "f") + C(58, 32, 1, "f");
    },
    glyph: function (ch) { return C(50, 50, 26, "s") + '<text class="pt-g" x="50" y="61" text-anchor="middle">' + ch + "</text>"; }
  };

  // ---------------------------------------------------------------- held items (right hand, around x 74)
  var ITEM = {
    thunderbolt: function () { return P("M78 26 L68 50 L76 50 L66 80 L82 46 L74 46 L82 26 Z", "s"); },
    trident: function () { return P("M74 96 L74 30") + P("M66 22 C66 32 68 36 74 36 C80 36 82 32 82 22 M74 36 L74 18") + P("M64 24 L66 20 L68 24 M72 20 L74 16 L76 20 M80 24 L82 20 L84 24"); },
    spear: function () { return P("M74 96 L74 32") + P("M74 14 C79 22 79 28 74 34 C69 28 69 22 74 14 Z", "s"); },
    hammer: function () { return P("M74 90 L74 56") + P("M64 44 L84 44 L84 58 L64 58 Z", "s") + P("M72 90 L76 90"); },
    lotus: function () { return P("M74 96 L74 50") + E(74, 44, 3.4, 8, "s") + E(69, 46, 3, 7, "s", -32) + E(79, 46, 3, 7, "s", 32) + E(65, 49, 2.4, 5.5, "s", -64) + E(83, 49, 2.4, 5.5, "s", 64); },
    ankh: function () { return E(74, 38, 5, 7, "s") + E(74, 38, 2.2, 4) + P("M66 47 L82 47 L82 51 L76 51 L76 76 L72 76 L72 51 L66 51 Z", "s"); },
    scales: function () { return P("M74 90 L74 30 M60 36 L88 36 M60 36 L55 50 M60 36 L65 50 M88 36 L83 50 M88 36 L93 50") + P("M54 50 Q60 56 66 50 Z", "s") + P("M82 50 Q88 56 94 50 Z", "s") + C(74, 29, 2, "f"); },
    scroll: function () { return P("M64 50 L84 50 L84 76 L64 76 Z", "s") + E(64, 63, 2.6, 13.5, "s") + E(84, 63, 2.6, 13.5, "s") + P("M68 56 H80 M68 61 H80 M68 66 H78 M68 71 H80"); },
    staff: function () { return P("M74 96 L74 26") + P("M74 26 C74 20 80 18 82 22"); },
    bow: function () { return P("M70 22 C86 36 86 72 70 86", "sw2") + P("M70 22 L70 86"); },
    sword: function () { return P("M72 76 L72 22 L74 16 L76 22 L76 76 Z", "s") + P("M66 76 L82 76 M74 76 L74 88") + C(74, 90, 2, "f"); },
    serpent: function () { return P("M74 94 C66 86 82 78 74 70 C66 62 82 54 74 46 C68 40 72 32 78 30", "sw2") + E(79, 29, 3.5, 2.4, "s", -20); },
    torch: function () { return P("M72 90 L70 52 L78 52 L76 90 Z", "s") + P("M74 50 C66 42 70 34 74 24 C78 34 82 42 74 50 Z", "af") + P("M74 48 C71 44 72 40 74 36 C76 40 77 44 74 48 Z", "f"); },
    drum: function () { return C(74, 58, 12, "s") + C(74, 58, 8) + C(74, 58, 1.6, "f"); },
    cup: function () { return P("M64 44 L84 44 C84 54 80 60 74 60 C68 60 64 54 64 44 Z", "s") + P("M74 60 L74 74 M66 76 L82 76"); },
    wheel: function () { var s = C(74, 44, 11, "s") + C(74, 44, 3, "f"); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += P("M" + (74 + 3 * Math.cos(a)).toFixed(1) + " " + (44 + 3 * Math.sin(a)).toFixed(1) + " L" + (74 + 11 * Math.cos(a)).toFixed(1) + " " + (44 + 11 * Math.sin(a)).toFixed(1)); } return s; },
    mirror: function () { return C(74, 44, 10, "s") + C(74, 44, 7, "a") + P("M74 54 L74 76"); },
    flail: function () { return P("M64 86 L80 30 M80 30 C84 26 86 30 84 34") + P("M84 86 L68 36 M68 36 L60 44 M68 36 L62 48 M68 36 L65 50"); },
    fruit: function () { return C(74, 56, 9, "s") + P("M70 47 L72 44 L74 47 L76 44 L78 47") + C(71, 55, 1, "af") + C(76, 58, 1, "af") + C(73, 60, 1, "af"); },
    wheat: function () { var s = P("M74 96 L74 30"); for (var i = 0; i < 5; i++) { s += E(70.5, 36 + i * 6, 2.2, 3.6, "s", -30) + E(77.5, 36 + i * 6, 2.2, 3.6, "s", 30); } return s + E(74, 29, 2, 3.6, "s"); },
    maize: function () { return P("M74 96 L74 60") + E(74, 44, 5, 14, "s") + P("M71 36 H77 M70 42 H78 M70 48 H78 M71 54 H77") + P("M74 60 C66 52 64 42 66 32 M74 60 C82 52 84 42 82 32"); },
    lyre: function () { return P("M64 76 C62 58 60 42 66 30 M84 76 C86 58 88 42 82 30", "sw2") + P("M64 34 L84 34 M64 76 L84 76") + P("M69 34 L69 76 M74 34 L74 76 M79 34 L79 76"); },
    caduceus: function () { return P("M74 96 L74 24") + C(74, 22, 2.4, "f") + P("M74 88 C64 82 84 74 74 68 C64 62 84 54 74 48 C66 44 70 36 74 34", "a") + P("M74 88 C84 82 64 74 74 68 C84 62 64 54 74 48 C82 44 78 36 74 34", "a") + P("M74 28 C68 22 62 24 60 28 C66 28 70 30 74 32 C78 30 82 28 88 28 C86 24 80 22 74 28", "s"); },
    axe: function () { return P("M72 96 L72 34") + P("M72 36 C80 32 86 36 86 44 C86 52 80 56 72 52 Z", "s"); },
    doubleaxe: function () { return P("M74 96 L74 24") + P("M74 30 C66 24 60 28 60 36 C60 44 66 48 74 42 C82 48 88 44 88 36 C88 28 82 24 74 30 Z", "s"); },
    club: function () { return P("M73 92 L70 56 L78 56 L75 92 Z", "s") + E(74, 46, 7, 12, "s") + C(71, 42, 1, "f") + C(77, 48, 1, "f") + C(74, 38, 1, "f"); },
    shield: function () { return C(74, 58, 14, "s") + C(74, 58, 9, "a") + C(74, 58, 2.6, "f"); },
    key: function () { return C(74, 32, 6, "s") + C(74, 32, 2.4) + P("M74 38 L74 82 M74 72 L80 72 M74 78 L82 78"); },
    noose: function () { return E(74, 44, 8, 11, "sw2") + P("M74 55 L74 92"); },
    flute: function () { return P("M58 62 L90 36", "sw2") + C(66, 55, .9, "f") + C(71, 51, .9, "f") + C(76, 47, .9, "f") + C(81, 43, .9, "f"); },
    vina: function () { return P("M66 88 L84 26", "sw2") + C(66, 82, 7, "s") + C(82, 32, 5, "s") + P("M68 76 L83 30"); },
    sistrum: function () { return P("M74 96 L74 60") + P("M66 60 C64 44 68 36 74 34 C80 36 84 44 82 60 Z", "s") + P("M66 46 L82 46 M66 52 L82 52") + C(74, 32, 2.4, "f"); },
    necklace: function () { var s = P("M62 30 Q74 56 86 30"); for (var i = 0; i < 7; i++) { var t = i / 6, x = 62 + 24 * t, y = 30 + 26 * 4 * t * (1 - t) * .5; s += C(x.toFixed(1), (y + 2).toFixed(1), 2, "af"); } return s + E(74, 46, 3, 4, "s"); },
    spindle: function () { return P("M74 94 L74 22") + E(74, 70, 7, 2.6, "s") + P("M70 40 C66 34 82 30 78 24 M70 48 C66 42 82 38 78 32") + E(74, 44, 4, 8, "s"); },
    tablet: function () { return P("M70 90 L72 30 L76 30 L78 90 Z", "s") + P("M72 36 L76 36"); },
    ball: function () { return C(74, 58, 9, "s") + P("M66 54 Q74 60 82 54 M66 62 Q74 56 82 62"); },
    hook: function () { return P("M74 22 L74 62 C74 74 62 74 62 64 L66 60", "sw2") + P("M62 64 L60 68"); },
    heart: function () { return P("M74 70 C62 60 62 46 68 44 C72 42 74 46 74 48 C74 46 76 42 80 44 C86 46 86 60 74 70 Z", "s") + P("M74 56 L74 64 M70 60 L78 60", "a"); },
    vase: function () { return P("M68 40 L80 40 L78 46 C86 50 86 68 78 72 L70 72 C62 68 62 50 70 46 Z", "s") + P("M70 40 C68 34 72 30 74 28 M78 40 C80 34 76 30 74 28", "a"); },
    ring: function () { return C(74, 50, 9, "sw2") + C(74, 50, 3, "f"); },
    blade: function () { return P("M72 90 L72 40 L76 40 L76 90 Z", "s") + P("M76 40 L84 44 L80 48 L86 52 L80 56 L86 60 L80 64 L86 68 L76 72 Z", "s"); },
    torc: function () { return P("M64 52 C64 38 84 38 84 52 C84 62 78 66 74 66 C70 66 64 62 64 52", "sw2") + C(71, 65, 2.4, "f") + C(77, 65, 2.4, "f"); },
    star: function () { var s = ""; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += P("M74 46 L" + (74 + 11 * Math.cos(a)).toFixed(1) + " " + (46 + 11 * Math.sin(a)).toFixed(1)); } return s + C(74, 46, 3.2, "f"); }
  };

  // ---------------------------------------------------------------- extras
  var EXTRA_BACK = {
    wings: function () { return P("M36 80 C20 76 8 60 6 40 C14 52 22 56 30 58 C22 50 18 42 18 32 C26 44 32 50 38 70 Z", "s") + P("M64 80 C80 76 92 60 94 40 C86 52 78 56 70 58 C78 50 82 42 82 32 C74 44 68 50 62 70 Z", "s"); },
    arms4: function () { return P("M30 82 C22 76 16 66 14 54", "sw2") + P("M70 82 C78 76 84 66 86 54", "sw2") + C(14, 51, 3, "s") + C(86, 51, 3, "s"); },
    ravens: function () { return P("M14 28 q6 -6 12 0 q-4 -1 -6 3 q-2 -4 -6 -3 Z M74 18 q6 -6 12 0 q-4 -1 -6 3 q-2 -4 -6 -3 Z", "s"); }
  };
  var EXTRA = {
    eye3: function () { return E(50, 39, 1.8, 3, "f"); },
    eye1: function () { return C(54.5, 44, 1.4, "f") + P("M42 42 L48 42 M42 40 L48 46"); },
    goggles: function () { return C(45.5, 44, 3.4) + C(54.5, 44, 3.4) + P("M44 54 L46 58 L48 54 M52 54 L54 58 L56 54"); },
    owl: function () { return E(24, 76, 6, 8, "s") + C(21.5, 73, 1.8) + C(26.5, 73, 1.8) + P("M19 68 l1 -3 l2 2 M29 68 l-1 -3 l-2 2"); },
    fox: function () { return P("M14 90 C14 80 20 74 26 74 L24 68 L28 72 L31 67 L31 74 C34 76 34 80 30 82 C34 86 36 92 32 96 L16 96 Z", "s") + C(28, 76, .9, "f"); }
  };

  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /** Render a figure's emblem. `fig` is a pantheon record; `acc` the tradition colour. */
  function svg(fig, acc, uid) {
    var p = String(fig.p || "human - - - -").split(" ");
    var headSpec = p[0].split(":"), head = headSpec[0], headArg = headSpec[1];
    var crown = p[1], item = p[2], bg = p[3], extras = p[4] === "-" ? [] : p[4].split(",");
    var id = "pt" + (uid || fig.id).replace(/[^a-z0-9]/gi, "");
    var out = '<svg class="pt-svg" viewBox="0 0 100 100" role="img" aria-label="' + (fig.n || "").replace(/"/g, "&quot;") + ': an emblem of traditional attributes" style="--acc:' + acc + '">' +
      '<defs><radialGradient id="' + id + 'g" cx="50%" cy="40%" r="62%"><stop offset="0" stop-color="' + acc + '" stop-opacity=".30"/><stop offset=".7" stop-color="' + acc + '" stop-opacity=".07"/><stop offset="1" stop-color="#0d0805" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="' + id + 'c"><circle cx="50" cy="50" r="45"/></clipPath></defs>' +
      '<circle cx="50" cy="50" r="48" class="pt-disc"/><circle cx="50" cy="50" r="48" fill="url(#' + id + 'g)"/>' +
      '<g clip-path="url(#' + id + 'c)">';
    if (has(BG, bg)) out += '<g class="pt-bg">' + BG[bg]() + "</g>";
    var body = head === "serpent" || head === "flame" || head === "void" || head === "peacock" || head === "glyph" || head === "sundisk";
    extras.forEach(function (x) { if (has(EXTRA_BACK, x)) out += EXTRA_BACK[x](); });
    if (!body) {
      if (has(HAT_BACK, crown)) out += HAT_BACK[crown]();
      out += bust();
      out += (has(HEAD, head) ? HEAD[head] : HEAD.human)();
      if (has(HAT, crown)) out += HAT[crown]();
    } else if (head === "sundisk") {
      out += HEAD.sundisk();
    } else {
      out += BODY[head](headArg);
      if (has(HAT, crown) && head === "serpent") out += '<g transform="translate(6 -14)">' + HAT[crown]() + "</g>";
    }
    extras.forEach(function (x) { if (has(EXTRA, x)) out += EXTRA[x](); });
    if (has(ITEM, item)) out += '<g class="pt-item">' + ITEM[item]() + "</g>";
    out += "</g>" +
      '<circle cx="50" cy="50" r="47" class="pt-ring"/><circle cx="50" cy="50" r="44.5" class="pt-ring2"/></svg>';
    return out;
  }

  // plain-language names of the emblem's parts, for the figure's detail view
  var WORDS = {
    falcon: "falcon head", canine: "canine head", ibis: "ibis head", elephant: "elephant head", monkey: "monkey face", bird: "bird head",
    goat: "goat head", janus: "two faces", half: "half-dark face", serpent: "serpent", flame: "figure of fire", void: "no image: rings of light",
    peacock: "peacock", glyph: "the written name", sundisk: "sun disk with a face",
    crown: "crown", horns: "horned crown", hhelm: "horned helmet", disk: "sun disk and cobra", cowdisk: "cow horns and sun disk", atef: "atef crown",
    double: "double crown of Egypt", helmet: "crested helmet", winged: "winged hat", antlers: "antlers", feathers: "feather headdress",
    topknot: "matted hair and crescent moon", throne: "throne sign", feather: "ostrich feather", crescent: "crescent moon", wreath: "wreath",
    cap: "cap", hat: "broad hat", tophat: "top hat", mian: "imperial crown with bead strings", peacock_c: "peacock feather", mural: "turreted crown",
    triplemoon: "triple moon", halo: "halo", rays: "rays of light", hood: "serpent hood", veil: "veil", lionskin: "lion skin",
    thunderbolt: "thunderbolt", trident: "trident", spear: "spear", hammer: "hammer", lotus: "lotus", ankh: "ankh", scales: "scales",
    scroll: "scroll", staff: "staff", bow: "bow", sword: "sword", serpent_i: "serpent", torch: "torch", drum: "hand drum", cup: "cup",
    wheel: "discus (chakra)", mirror: "mirror", flail: "crook and flail", fruit: "pomegranate or peach", wheat: "sheaf of grain", maize: "maize",
    lyre: "lyre", caduceus: "caduceus", axe: "axe", doubleaxe: "double axe", club: "mace", shield: "shield", key: "key", noose: "noose",
    flute: "flute", vina: "vina", sistrum: "sistrum rattle", necklace: "necklace", spindle: "spindle", tablet: "court tablet", ball: "ball",
    hook: "fish-hook", heart: "heart", vase: "vessel", ring: "ring", blade: "saw-toothed blade", torc: "torc", star: "eight-pointed star",
    sun: "the sun", moon: "the moon", stars: "stars", waves: "water", flames: "fire", tree: "a tree", storm: "storm cloud and lightning",
    earth: "the earth below", mountain: "mountains", clouds: "clouds",
    wings: "wings", arms4: "four arms", eye3: "third eye", eye1: "a single eye", goggles: "goggle eyes", owl: "owl", ravens: "two ravens", fox: "fox"
  };
  function parts(fig) {
    var p = String(fig.p).split(" "), out = [];
    var h = p[0].split(":")[0];
    if (h !== "human") out.push(WORDS[h] || h);
    if (p[1] !== "-") out.push(WORDS[p[1] === "peacock" ? "peacock_c" : p[1]] || p[1]);
    if (p[2] !== "-") out.push(WORDS[p[2] === "serpent" ? "serpent_i" : p[2]] || p[2]);
    if (p[4] !== "-") p[4].split(",").forEach(function (x) { out.push(WORDS[x] || x); });
    if (p[3] !== "-") out.push(WORDS[p[3]] || p[3]);
    return out;
  }

  window.PANTHEON_ART = { svg: svg, parts: parts };
})();
