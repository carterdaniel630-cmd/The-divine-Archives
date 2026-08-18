/* ==========================================================================
   THE DIVINE ARCHIVES — era emblems

   One hand-drawn inline-SVG emblem per era, keyed by era slug. Kept in this
   single module so the artwork can be restyled without touching page markup or
   render code. Each SVG uses currentColor (so it inherits the site's gold) and
   carries class="era-emblem"; sizing per context is injected below.

   Consumed by: index.html (home spine), eras.html (age list), and
   archive.js renderEra() (era-page header).
   ========================================================================== */
(function () {
  "use strict";

  window.EMBLEMS = {
    // I — Prehistory: kindling flame + spark over the horizon
    "01-prehistory":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<line x1="30" y1="90" x2="90" y2="90" stroke="currentColor" stroke-width="1" opacity="0.7"/>' +
      '<path d="M60 88 C49 76 53 64 60 52 C67 64 71 76 60 88 Z" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M60 84 C55 78 56 71 60 65 C64 71 65 78 60 84 Z" stroke="currentColor" stroke-width="1" opacity="0.7"/>' +
      '<line x1="60" y1="26" x2="60" y2="40" stroke="currentColor" stroke-width="1.1" opacity="0.9"/>' +
      '<line x1="53" y1="33" x2="67" y2="33" stroke="currentColor" stroke-width="1.1" opacity="0.9"/></svg>',

    // II — Bronze Age: sun disk over a ziggurat
    "02-bronze-age":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="60" cy="42" r="11" stroke="currentColor" stroke-width="1.3"/>' +
      '<g opacity="0.85" stroke="currentColor" stroke-width="1">' +
      '<line x1="60" y1="24" x2="60" y2="29"/><line x1="60" y1="55" x2="60" y2="60"/>' +
      '<line x1="42" y1="42" x2="47" y2="42"/><line x1="73" y1="42" x2="78" y2="42"/>' +
      '<line x1="47.5" y1="29.5" x2="51" y2="33"/><line x1="69" y1="51" x2="72.5" y2="54.5"/>' +
      '<line x1="72.5" y1="29.5" x2="69" y2="33"/><line x1="51" y1="51" x2="47.5" y2="54.5"/></g>' +
      '<path d="M40 92 H80 M45 92 V82 H75 V92 M51 82 V73 H69 V82 M57 73 V66 H63 V73" ' +
      'stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',

    // III — Early Iron Age: the fire altar
    "03-early-iron-age":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<path d="M60 66 C53 58 55 50 60 42 C65 50 67 58 60 66 Z" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M44 70 H76 L70 78 H50 Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<line x1="56" y1="78" x2="56" y2="90" stroke="currentColor" stroke-width="1.3"/>' +
      '<line x1="64" y1="78" x2="64" y2="90" stroke="currentColor" stroke-width="1.3"/>' +
      '<path d="M46 90 H74" stroke="currentColor" stroke-width="1.3"/>' +
      '<path d="M42 96 H78" stroke="currentColor" stroke-width="1.3"/></svg>',

    // IV — Axial Age: the eight-spoked wheel
    "04-axial-age":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="60" cy="60" r="28" stroke="currentColor" stroke-width="1.4"/>' +
      '<circle cx="60" cy="60" r="6" stroke="currentColor" stroke-width="1.3"/>' +
      '<g stroke="currentColor" stroke-width="1.1" opacity="0.9">' +
      '<line x1="60" y1="34" x2="60" y2="86"/><line x1="34" y1="60" x2="86" y2="60"/>' +
      '<line x1="41.6" y1="41.6" x2="78.4" y2="78.4"/><line x1="78.4" y1="41.6" x2="41.6" y2="78.4"/></g></svg>',

    // V — Late Antiquity: the ouroboros
    "05-late-antiquity":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<path d="M74 40 A28 28 0 1 1 70 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M70 30 L80 37 L69 43 Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<circle cx="74" cy="37" r="1.4" fill="currentColor"/></svg>',

    // VI — Early Medieval: pointed arch + eight-point star
    "06-early-medieval":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<path d="M42 92 V64 C42 46 60 40 60 30 C60 40 78 46 78 64 V92" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<line x1="42" y1="92" x2="78" y2="92" stroke="currentColor" stroke-width="1.4"/>' +
      '<g stroke="currentColor" stroke-width="1" opacity="0.9">' +
      '<line x1="60" y1="56" x2="60" y2="76"/><line x1="50" y1="66" x2="70" y2="66"/>' +
      '<line x1="53" y1="59" x2="67" y2="73"/><line x1="67" y1="59" x2="53" y2="73"/></g></svg>',

    // VII — High Medieval: the rose window
    "07-high-medieval":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="60" cy="60" r="30" stroke="currentColor" stroke-width="1.4"/>' +
      '<circle cx="60" cy="60" r="9" stroke="currentColor" stroke-width="1.2"/>' +
      '<g stroke="currentColor" stroke-width="1" opacity="0.9">' +
      '<circle cx="60" cy="39" r="6"/><circle cx="60" cy="81" r="6"/>' +
      '<circle cx="39" cy="60" r="6"/><circle cx="81" cy="60" r="6"/>' +
      '<circle cx="45" cy="45" r="6"/><circle cx="75" cy="45" r="6"/>' +
      '<circle cx="45" cy="75" r="6"/><circle cx="75" cy="75" r="6"/></g></svg>',

    // VIII — Early Modern: the open book, rayed
    "08-early-modern":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<g opacity="0.85" stroke="currentColor" stroke-width="1">' +
      '<line x1="60" y1="26" x2="60" y2="34"/><line x1="44" y1="30" x2="48" y2="37"/>' +
      '<line x1="76" y1="30" x2="72" y2="37"/></g>' +
      '<path d="M60 50 C51 44 40 44 33 47 V82 C40 79 51 79 60 85" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M60 50 C69 44 80 44 87 47 V82 C80 79 69 79 60 85" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<line x1="60" y1="50" x2="60" y2="85" stroke="currentColor" stroke-width="1.2"/></svg>',

    // IX — Modern: the radiant star
    "09-modern":
      '<svg class="era-emblem" viewBox="0 0 120 120" fill="none" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
      '<circle cx="60" cy="60" r="8" stroke="currentColor" stroke-width="1.3"/>' +
      '<g stroke="currentColor" stroke-width="1.3">' +
      '<line x1="60" y1="24" x2="60" y2="44"/><line x1="60" y1="76" x2="60" y2="96"/>' +
      '<line x1="24" y1="60" x2="44" y2="60"/><line x1="76" y1="60" x2="96" y2="60"/></g>' +
      '<g stroke="currentColor" stroke-width="0.9" opacity="0.8">' +
      '<line x1="35" y1="35" x2="49" y2="49"/><line x1="85" y1="35" x2="71" y2="49"/>' +
      '<line x1="35" y1="85" x2="49" y2="71"/><line x1="85" y1="85" x2="71" y2="71"/></g></svg>'
  };

  // sizing per context — kept here so markup/CSS files stay untouched
  var css =
    ".era-emblem{display:block;color:var(--gold,#b98f4e);transition:color .3s ease}" +
    ".spine .era .era-emblem{width:76px;height:76px;margin:0 auto}" +
    ".age .num .era-emblem{width:46px;height:46px;margin:0 auto .3rem}" +
    ".page-head .era-emblem{width:78px;height:78px;margin:0 auto .55rem}" +
    ".era:hover .era-emblem,.age:hover .era-emblem{color:var(--gold-bright,#d9b06a)}";
  var s = document.createElement("style");
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
