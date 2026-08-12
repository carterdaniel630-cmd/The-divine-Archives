/* ==========================================================================
   THE DIVINE ARCHIVES — chapter plates (interpretive art)

   Original, hand-drawn inline-SVG "plates," one (or more) per chapter, keyed by
   chapter id. These are INTERPRETIVE illustrations and diagrams — geometry,
   schematic plans, script/pattern studies — NOT reproductions of specific
   historical artifacts. Every plate carries a caption that says so, to keep the
   archive's line between "sacred/interpretive" and "the documented object"
   clear (real artifact photography is sourced separately, with attribution).

   Kept in one module so art can be added or restyled without touching the
   generated chapter HTML. Consumed by archive.js renderChapter(), which injects
   PLATES[ch.id] at the head of the chapter body when present.
   ========================================================================== */
(function () {
  "use strict";

  function fig(art, tag, caption) {
    return '<figure class="plate">' + art +
      '<figcaption><span class="tag">' + tag + '</span>' + caption + '</figcaption></figure>';
  }

  window.PLATES = {

    /* Ch21 — Islam: an eight-fold geometric rosette (geometry only, no figural) */
    "ch21": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="86" stroke="currentColor" stroke-width="0.6" opacity="0.25"/>' +
        '<g fill="currentColor" opacity="0.55">' +
          '<circle cx="100" cy="10" r="1.6"/><circle cx="100" cy="190" r="1.6"/>' +
          '<circle cx="10" cy="100" r="1.6"/><circle cx="190" cy="100" r="1.6"/>' +
          '<circle cx="163.6" cy="36.4" r="1.6"/><circle cx="36.4" cy="36.4" r="1.6"/>' +
          '<circle cx="163.6" cy="163.6" r="1.6"/><circle cx="36.4" cy="163.6" r="1.6"/></g>' +
        '<g stroke="currentColor" stroke-width="0.7" opacity="0.45">' +
          '<line x1="100" y1="100" x2="46" y2="46"/><line x1="100" y1="100" x2="154" y2="46"/>' +
          '<line x1="100" y1="100" x2="154" y2="154"/><line x1="100" y1="100" x2="46" y2="154"/>' +
          '<line x1="100" y1="100" x2="100" y2="23.6"/><line x1="100" y1="100" x2="176.4" y2="100"/>' +
          '<line x1="100" y1="100" x2="100" y2="176.4"/><line x1="100" y1="100" x2="23.6" y2="100"/></g>' +
        '<rect x="46" y="46" width="108" height="108" stroke="currentColor" stroke-width="1.3"/>' +
        '<rect x="46" y="46" width="108" height="108" stroke="currentColor" stroke-width="1.3" transform="rotate(45 100 100)"/>' +
        '<circle cx="100" cy="100" r="30" stroke="currentColor" stroke-width="0.9" opacity="0.7"/>' +
        '<rect x="82" y="82" width="36" height="36" stroke="currentColor" stroke-width="1"/>' +
        '<rect x="82" y="82" width="36" height="36" stroke="currentColor" stroke-width="1" transform="rotate(45 100 100)"/>' +
        '<circle cx="100" cy="100" r="4.5" fill="currentColor"/>' +
      '</svg>',
      "Interpretive illustration",
      "An eight-fold geometric rosette (khatim) in the Islamic geometric tradition. " +
      "Original artwork built from compass-and-straightedge construction &mdash; not a photograph of a specific monument or manuscript."
    ),

    /* Ch05 — Early Vedic: schematic of the falcon-shaped fire altar (agnicayana) */
    "ch05": fig(
      '<svg class="plate-art" viewBox="0 0 240 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="0.6" opacity="0.32">' +
          // body brick grid
          '<line x1="104" y1="59" x2="136" y2="59"/><line x1="104" y1="72" x2="136" y2="72"/>' +
          '<line x1="104" y1="85" x2="136" y2="85"/><line x1="104" y1="98" x2="136" y2="98"/>' +
          '<line x1="104" y1="111" x2="136" y2="111"/><line x1="104" y1="124" x2="136" y2="124"/>' +
          '<line x1="104" y1="137" x2="136" y2="137"/><line x1="120" y1="46" x2="120" y2="150"/>' +
          // left wing grid
          '<line x1="49" y1="66" x2="49" y2="106"/><line x1="62" y1="66" x2="62" y2="106"/>' +
          '<line x1="75" y1="66" x2="75" y2="106"/><line x1="88" y1="66" x2="88" y2="106"/>' +
          '<line x1="36" y1="86" x2="104" y2="86"/>' +
          // right wing grid
          '<line x1="152" y1="66" x2="152" y2="106"/><line x1="165" y1="66" x2="165" y2="106"/>' +
          '<line x1="178" y1="66" x2="178" y2="106"/><line x1="191" y1="66" x2="191" y2="106"/>' +
          '<line x1="136" y1="86" x2="204" y2="86"/>' +
          // tail
          '<line x1="90" y1="166" x2="150" y2="166"/></g>' +
        // outlines
        '<g stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">' +
          '<rect x="112" y="30" width="16" height="16"/>' +                 // head
          '<rect x="104" y="46" width="32" height="104"/>' +                // body
          '<rect x="36" y="66" width="68" height="40"/>' +                  // left wing
          '<rect x="136" y="66" width="68" height="40"/>' +                 // right wing
          '<path d="M96 150 H144 L156 182 H84 Z"/>' +                       // tail
        '</g>' +
        // altar fire at the "navel"
        '<path d="M120 104 C114 98 116 92 120 85 C124 92 126 98 120 104 Z" stroke="currentColor" stroke-width="1.2"/>' +
      '</svg>',
      "Interpretive diagram",
      "Schematic plan of a falcon-shaped Vedic fire altar (<em>&#347;yena-citi</em>, agnicayana), " +
      "after the layered-brick descriptions in the &#346;rauta texts. A diagram of the form &mdash; not a photograph of an excavated altar."
    ),

    /* Ch07 — Pre-exilic Israel: the seven-branched menorah */
    "ch07": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>' +
        '<g stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
          '<path d="M40 48 Q40 96 100 120"/><path d="M60 48 Q60 104 100 120"/><path d="M80 48 Q80 112 100 120"/>' +
          '<path d="M160 48 Q160 96 100 120"/><path d="M140 48 Q140 104 100 120"/><path d="M120 48 Q120 112 100 120"/>' +
          '<line x1="100" y1="48" x2="100" y2="120"/><line x1="100" y1="120" x2="100" y2="150"/>' +
          '<path d="M78 150 H122 M84 158 H116 M92 166 H108"/></g>' +
        '<g stroke="currentColor" stroke-width="1.1" opacity="0.85">' +
          '<path d="M40 46 C36 40 37 35 40 30 C43 35 44 40 40 46 Z"/>' +
          '<path d="M60 46 C56 40 57 35 60 30 C63 35 64 40 60 46 Z"/>' +
          '<path d="M80 46 C76 40 77 35 80 30 C83 35 84 40 80 46 Z"/>' +
          '<path d="M100 46 C96 40 97 35 100 30 C103 35 104 40 100 46 Z"/>' +
          '<path d="M120 46 C116 40 117 35 120 30 C123 35 124 40 120 46 Z"/>' +
          '<path d="M140 46 C136 40 137 35 140 30 C143 35 144 40 140 46 Z"/>' +
          '<path d="M160 46 C156 40 157 35 160 30 C163 35 164 40 160 46 Z"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The seven-branched lampstand (menorah) described in Exodus. An original line drawing after the textual description &mdash; not a depiction of a specific object."
    ),

    /* Ch12 — Confucianism & Daoism: the eight trigrams and the taiji */
    "ch12": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="84" stroke="currentColor" stroke-width="0.6" opacity="0.25"/>' +
        '<g stroke="currentColor" stroke-width="1.3">' +
          // 8 trigrams; solid = one bar, broken = two segments; rotated around center
          '<g transform="rotate(0 100 100)"><line x1="84" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(45 100 100)"><line x1="84" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="95" y2="42"/><line x1="105" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(90 100 100)"><line x1="84" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="95" y2="34"/><line x1="105" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(135 100 100)"><line x1="84" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="95" y2="34"/><line x1="105" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="95" y2="42"/><line x1="105" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(180 100 100)"><line x1="84" y1="26" x2="95" y2="26"/><line x1="105" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="95" y2="34"/><line x1="105" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="95" y2="42"/><line x1="105" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(225 100 100)"><line x1="84" y1="26" x2="95" y2="26"/><line x1="105" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="95" y2="34"/><line x1="105" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(270 100 100)"><line x1="84" y1="26" x2="95" y2="26"/><line x1="105" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="95" y2="42"/><line x1="105" y1="42" x2="116" y2="42"/></g>' +
          '<g transform="rotate(315 100 100)"><line x1="84" y1="26" x2="116" y2="26"/><line x1="84" y1="34" x2="116" y2="34"/><line x1="84" y1="42" x2="116" y2="42"/></g></g>' +
        '<circle cx="100" cy="100" r="22" stroke="currentColor" stroke-width="1.2"/>' +
        '<path d="M100 78 A11 11 0 0 1 100 100 A11 11 0 0 0 100 122" stroke="currentColor" stroke-width="1.2"/>' +
        '<circle cx="100" cy="89" r="2.6" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="100" cy="111" r="2.6" fill="currentColor"/>' +
      '</svg>',
      "Interpretive diagram",
      "The eight trigrams (bagua) ringing the taiji, emblems of the <em>Yijing</em> and of Daoist cosmology. An original diagram of the symbols themselves."
    ),

    /* Ch16 — Early Christianity: the Chi-Rho monogram in a wreath */
    "ch16": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="70" stroke="currentColor" stroke-width="1" opacity="0.7"/>' +
        '<circle cx="100" cy="100" r="78" stroke="currentColor" stroke-width="0.7" opacity="0.35"/>' +
        '<g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
          '<line x1="62" y1="64" x2="138" y2="150"/><line x1="138" y1="64" x2="62" y2="150"/>' +
          '<line x1="100" y1="48" x2="100" y2="156"/></g>' +
        '<path d="M100 52 C130 52 130 90 100 90" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '</svg>',
      "Interpretive illustration",
      "The Chi-Rho (&#9767;), the monogram of Christ formed from the Greek letters <em>chi</em> and <em>rho</em>, within a victor&rsquo;s wreath. An original rendering of the symbol, not a specific inscription."
    ),

    /* Ch20 — Mahayana Buddhism: the mandala's circle-square-circle structure */
    "ch20": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="86" stroke="currentColor" stroke-width="0.6" opacity="0.25"/>' +
        '<g stroke="currentColor" stroke-width="1">' +
          '<g transform="rotate(0 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(45 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(90 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(135 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(180 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(225 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(270 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g>' +
          '<g transform="rotate(315 100 100)"><path d="M100 30 C108 44 108 56 100 66 C92 56 92 44 100 30 Z"/></g></g>' +
        '<rect x="54" y="54" width="92" height="92" stroke="currentColor" stroke-width="1.3"/>' +
        '<g stroke="currentColor" stroke-width="1.3">' +
          '<path d="M92 54 V44 H108 V54"/><path d="M92 146 V156 H108 V146"/>' +
          '<path d="M54 92 H44 V108 H54"/><path d="M146 92 H156 V108 H146"/></g>' +
        '<circle cx="100" cy="100" r="30" stroke="currentColor" stroke-width="1.1"/>' +
        '<circle cx="100" cy="100" r="14" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="100" cy="100" r="4" fill="currentColor"/>' +
      '</svg>',
      "Interpretive diagram",
      "A mandala&rsquo;s characteristic structure &mdash; outer ring, square palace with four gates, and central point. An original geometric diagram, not a particular painted mandala."
    )

  };

  // plate styling — kept in-module so page markup/CSS stay untouched
  var css =
    ".article .plate{margin:2.4rem auto 2.6rem;max-width:30rem;text-align:center}" +
    ".article .plate .plate-art{width:100%;max-width:300px;height:auto;color:var(--gold,#b98f4e);display:inline-block}" +
    ".article .plate figcaption{margin-top:0.85rem;font-size:0.8rem;line-height:1.55;color:var(--ink-faint,#6f624a);font-style:italic}" +
    ".article .plate .tag{display:inline-block;font-style:normal;text-transform:uppercase;letter-spacing:0.14em;" +
      "font-size:0.58rem;color:var(--ink-dim,#9a8a6b);border:1px solid var(--line,#37291a);" +
      "padding:0.18rem 0.5rem;border-radius:2px;margin-bottom:0.55rem}";
  var s = document.createElement("style");
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
