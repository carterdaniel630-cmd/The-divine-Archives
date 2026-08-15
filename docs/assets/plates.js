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
    ),

    /* Ch01 — The Flood (theme): a vessel on the waters, under rain */
    "ch01": fig(
      '<svg class="plate-art" viewBox="0 0 200 172" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1" opacity="0.55" stroke-linecap="round">' +
          '<line x1="40" y1="18" x2="35" y2="30"/><line x1="60" y1="14" x2="55" y2="26"/>' +
          '<line x1="80" y1="18" x2="75" y2="30"/><line x1="120" y1="18" x2="115" y2="30"/>' +
          '<line x1="140" y1="14" x2="135" y2="26"/><line x1="160" y1="18" x2="155" y2="30"/></g>' +
        '<g stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">' +
          '<rect x="86" y="66" width="28" height="20"/><path d="M82 66 h36 l-6 -8 h-24 z"/>' +
          '<path d="M68 90 h64 l-9 22 q-23 12 -46 0 z"/></g>' +
        '<g stroke="currentColor" stroke-width="1.2">' +
          '<path d="M8 122 q12 -10 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/>' +
          '<path d="M8 136 q12 -10 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" opacity="0.7"/>' +
          '<path d="M8 150 q12 -10 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" opacity="0.45"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The vessel upon the rising waters &mdash; the shared image of the flood myths compared in this chapter. An original illustration of the motif, not any one tradition&rsquo;s telling."
    ),

    /* Ch02 — Egypt: the ankh beneath the solar disk */
    "ch02": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="40" r="13" stroke="currentColor" stroke-width="1.3"/>' +
        '<g stroke="currentColor" stroke-width="1" opacity="0.85">' +
          '<line x1="100" y1="20" x2="100" y2="24"/><line x1="100" y1="56" x2="100" y2="60"/>' +
          '<line x1="80" y1="40" x2="84" y2="40"/><line x1="116" y1="40" x2="120" y2="40"/>' +
          '<line x1="86" y1="26" x2="89" y2="29"/><line x1="111" y1="51" x2="114" y2="54"/>' +
          '<line x1="114" y1="26" x2="111" y2="29"/><line x1="89" y1="51" x2="86" y2="54"/></g>' +
        '<ellipse cx="100" cy="86" rx="16" ry="21" stroke="currentColor" stroke-width="1.6"/>' +
        '<line x1="100" y1="107" x2="100" y2="160" stroke="currentColor" stroke-width="1.6"/>' +
        '<line x1="72" y1="118" x2="128" y2="118" stroke="currentColor" stroke-width="1.6"/>' +
      '</svg>',
      "Interpretive illustration",
      "The ankh, sign of life, beneath the solar disk. An original rendering of the symbols, not a copy of a particular relief."
    ),

    /* Ch03 — Mesopotamia: the eight-pointed star of Ishtar above a ziggurat */
    "ch03": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="82" r="62" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
          '<line x1="100" y1="22" x2="100" y2="142"/><line x1="40" y1="82" x2="160" y2="82"/>' +
          '<line x1="64" y1="46" x2="136" y2="118"/><line x1="136" y1="46" x2="64" y2="118"/></g>' +
        '<circle cx="100" cy="82" r="7" stroke="currentColor" stroke-width="1.3"/>' +
        '<path d="M58 176 H142 M66 176 V166 H134 V176 M74 166 V157 H126 V166 M84 157 V149 H116 V157" ' +
          'stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>' +
      '</svg>',
      "Interpretive illustration",
      "The eight-pointed star of Ishtar above a stepped ziggurat. An original rendering of the symbols, not a specific artifact."
    ),

    /* Ch04 — Indus Valley: schematic plan after the Great Bath at Mohenjo-daro */
    "ch04": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<rect x="40" y="40" width="120" height="120" stroke="currentColor" stroke-width="1.3"/>' +
        '<rect x="70" y="70" width="60" height="60" stroke="currentColor" stroke-width="1.3"/>' +
        '<g stroke="currentColor" stroke-width="1" opacity="0.8">' +
          '<line x1="70" y1="78" x2="130" y2="78"/><line x1="70" y1="86" x2="130" y2="86"/>' +
          '<line x1="70" y1="114" x2="130" y2="114"/><line x1="70" y1="122" x2="130" y2="122"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="40" y1="70" x2="70" y2="70"/><line x1="40" y1="130" x2="70" y2="130"/>' +
          '<line x1="130" y1="70" x2="160" y2="70"/><line x1="130" y1="130" x2="160" y2="130"/>' +
          '<line x1="70" y1="40" x2="70" y2="70"/><line x1="130" y1="40" x2="130" y2="70"/>' +
          '<line x1="70" y1="130" x2="70" y2="160"/><line x1="130" y1="130" x2="130" y2="160"/></g>' +
        '<circle cx="150" cy="52" r="4" stroke="currentColor" stroke-width="1"/>' +
      '</svg>',
      "Interpretive diagram",
      "A schematic plan after the Great Bath at Mohenjo-daro &mdash; sunken tank, steps, and surrounding rooms. A diagram of the form, not an archaeological survey."
    ),

    /* Ch06 — Zoroaster: the sacred fire in its vessel */
    "ch06": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
        '<g stroke="currentColor" stroke-width="1.4">' +
          '<path d="M100 96 C86 78 92 62 100 44 C108 62 114 78 100 96 Z"/>' +
          '<path d="M83 96 C75 84 79 74 87 63 C91 75 92 86 83 96 Z" opacity="0.8"/>' +
          '<path d="M117 96 C125 84 121 74 113 63 C109 75 108 86 117 96 Z" opacity="0.8"/></g>' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M74 100 H126 L118 118 H82 Z"/><line x1="100" y1="118" x2="100" y2="138"/>' +
          '<path d="M88 138 H112 L120 152 H80 Z"/><line x1="74" y1="152" x2="126" y2="152"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The sacred fire held in its vessel (<em>&#257;tash</em>), the living centre of Zoroastrian worship. An original rendering, not a specific fire-holder."
    ),

    /* Ch08 — Early Greece: the lyre within a Greek-key band */
    "ch08": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M78 128 q-16 -40 4 -70"/><path d="M122 128 q16 -40 -4 -70"/>' +
          '<line x1="82" y1="58" x2="118" y2="58"/><path d="M78 128 q22 14 44 0"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.65">' +
          '<line x1="90" y1="62" x2="90" y2="124"/><line x1="96" y1="60" x2="96" y2="126"/>' +
          '<line x1="102" y1="60" x2="102" y2="126"/><line x1="108" y1="62" x2="108" y2="124"/></g>' +
        '<path d="M36 150 v-12 h12 v12 h12 v-12 h12 v12 h12 v-12 h12 v12 h12 v-12 h12 v12 h12 v-12 h12 v12" ' +
          'stroke="currentColor" stroke-width="1" opacity="0.8"/>' +
      '</svg>',
      "Interpretive illustration",
      "The lyre, instrument of the poets, over a Greek-key frieze. An original rendering of the forms, not a copy of a painted vase."
    ),

    /* Ch09 — Early China: a ritual bronze ding (tripod cauldron) */
    "ch09": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M64 66 H136"/><path d="M74 66 q-4 -15 8 -15 q12 0 8 15"/>' +
          '<path d="M118 66 q-4 -15 8 -15 q12 0 8 15"/>' +
          '<path d="M64 66 q-3 44 36 47 q39 -3 36 -47"/>' +
          '<path d="M78 110 q-6 24 -11 40"/><path d="M122 110 q6 24 11 40"/>' +
          '<line x1="100" y1="113" x2="100" y2="152"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.6">' +
          '<line x1="66" y1="82" x2="134" y2="82"/><line x1="66" y1="92" x2="134" y2="92"/>' +
          '<circle cx="86" cy="87" r="3"/><circle cx="114" cy="87" r="3"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A Shang&ndash;Zhou ritual bronze (<em>ding</em>), with a suggestion of the taotie band. An original rendering, not a specific excavated vessel."
    ),

    /* Ch10 — Second Temple Judaism: the sanctuary and its veil */
    "ch10": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<line x1="56" y1="42" x2="56" y2="160"/><line x1="144" y1="42" x2="144" y2="160"/>' +
          '<line x1="48" y1="42" x2="152" y2="42"/><line x1="46" y1="160" x2="154" y2="160"/></g>' +
        '<g stroke="currentColor" stroke-width="1" opacity="0.7">' +
          '<path d="M64 48 q-3 54 0 108"/><path d="M74 48 q-3 54 0 108"/><path d="M84 48 q-2 54 0 108"/>' +
          '<path d="M136 48 q3 54 0 108"/><path d="M126 48 q3 54 0 108"/><path d="M116 48 q2 54 0 108"/></g>' +
        '<g stroke="currentColor" stroke-width="1.1">' +
          '<line x1="100" y1="70" x2="100" y2="118"/><circle cx="100" cy="66" r="4"/>' +
          '<path d="M92 118 h16"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The Temple sanctuary and its veil (<em>parochet</em>), with a hanging lamp. An original rendering after the textual descriptions, not a reconstruction drawing."
    ),

    /* Ch11 — Buddhism: elevation of a stupa */
    "ch11": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M50 168 H150 M58 168 V156 H142 V168 M66 156 V146 H134 V156"/>' +
          '<path d="M70 146 a30 30 0 0 1 60 0"/><line x1="70" y1="146" x2="130" y2="146"/>' +
          '<rect x="92" y="104" width="16" height="12"/>' +
          '<line x1="100" y1="104" x2="100" y2="60"/>' +
          '<line x1="88" y1="96" x2="112" y2="96"/><line x1="90" y1="86" x2="110" y2="86"/>' +
          '<line x1="92" y1="76" x2="108" y2="76"/><circle cx="100" cy="58" r="4"/></g>' +
      '</svg>',
      "Interpretive diagram",
      "Elevation of a stupa &mdash; dome, harmika, and tiered parasols over a stepped base. A diagram of the form, not a specific monument."
    ),

    /* Ch13 — Rome: a temple facade */
    "ch13": fig(
      '<svg class="plate-art" viewBox="0 0 200 190" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M40 80 L100 46 L160 80 Z"/><line x1="44" y1="90" x2="156" y2="90"/>' +
          '<line x1="52" y1="90" x2="52" y2="150"/><line x1="72" y1="90" x2="72" y2="150"/>' +
          '<line x1="92" y1="90" x2="92" y2="150"/><line x1="108" y1="90" x2="108" y2="150"/>' +
          '<line x1="128" y1="90" x2="128" y2="150"/><line x1="148" y1="90" x2="148" y2="150"/>' +
          '<line x1="40" y1="150" x2="160" y2="150"/><line x1="34" y1="162" x2="166" y2="162"/>' +
          '<line x1="28" y1="174" x2="172" y2="174"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A Roman temple facade &mdash; pediment, colonnade, and podium. An original rendering of the type, not a specific temple."
    ),

    /* Ch14 — Celtic & Germanic: a triquetra above a row of Elder Futhark runes */
    "ch14": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="78" r="48" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
        '<g stroke="currentColor" stroke-width="1.4">' +
          '<circle cx="100" cy="60" r="26"/><circle cx="79" cy="96" r="26"/><circle cx="121" cy="96" r="26"/></g>' +
        '<g stroke="currentColor" stroke-width="1.2" stroke-linecap="round">' +
          '<line x1="40" y1="142" x2="40" y2="166"/><line x1="40" y1="146" x2="48" y2="142"/><line x1="40" y1="154" x2="48" y2="150"/>' +
          '<line x1="58" y1="166" x2="58" y2="144"/><line x1="58" y1="144" x2="66" y2="144"/><line x1="66" y1="144" x2="66" y2="166"/>' +
          '<line x1="80" y1="142" x2="80" y2="166"/><path d="M80 150 l9 4 l-9 4"/>' +
          '<line x1="100" y1="142" x2="100" y2="166"/><line x1="100" y1="146" x2="108" y2="152"/><line x1="100" y1="154" x2="108" y2="160"/>' +
          '<line x1="120" y1="142" x2="120" y2="166"/><path d="M120 142 h7 v8 h-7"/><line x1="120" y1="150" x2="128" y2="166"/>' +
          '<path d="M148 142 l-8 12 l8 12"/>' +
          '<line x1="162" y1="142" x2="174" y2="166"/><line x1="174" y1="142" x2="162" y2="166"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A triquetra above a row of Elder Futhark runes, shown as a script sample. An original rendering, not a copy of a specific inscription or stone."
    ),

    /* Ch15 — Classical Greece: the pentagram within the pentagon */
    "ch15": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="78" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
        '<polygon points="100,30 166.6,78.4 141.2,156.6 58.8,156.6 33.4,78.4" ' +
          'stroke="currentColor" stroke-width="1" opacity="0.55" fill="none"/>' +
        '<polygon points="100,30 141.2,156.6 33.4,78.4 166.6,78.4 58.8,156.6" ' +
          'stroke="currentColor" stroke-width="1.4" fill="none"/>' +
      '</svg>',
      "Interpretive diagram",
      "The pentagram inscribed in the pentagon &mdash; the figure prized by the Pythagoreans. An original geometric diagram."
    ),

    /* Ch17 — Gnosticism: the emanation of the aeons from the Monad */
    "ch17": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="14" stroke="currentColor" stroke-width="1.3"/>' +
        '<circle cx="100" cy="100" r="32" stroke="currentColor" stroke-width="1" opacity="0.8"/>' +
        '<circle cx="100" cy="100" r="52" stroke="currentColor" stroke-width="0.9" opacity="0.6"/>' +
        '<circle cx="100" cy="100" r="72" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
        '<g stroke="currentColor" stroke-width="0.7" opacity="0.45">' +
          '<line x1="100" y1="100" x2="100" y2="28"/><line x1="100" y1="100" x2="100" y2="172"/>' +
          '<line x1="100" y1="100" x2="28" y2="100"/><line x1="100" y1="100" x2="172" y2="100"/>' +
          '<line x1="100" y1="100" x2="49" y2="49"/><line x1="100" y1="100" x2="151" y2="49"/>' +
          '<line x1="100" y1="100" x2="49" y2="151"/><line x1="100" y1="100" x2="151" y2="151"/></g>' +
        '<g fill="currentColor" opacity="0.7">' +
          '<circle cx="100" cy="48" r="2.6"/><circle cx="100" cy="152" r="2.6"/>' +
          '<circle cx="48" cy="100" r="2.6"/><circle cx="152" cy="100" r="2.6"/>' +
          '<circle cx="63.2" cy="63.2" r="2.6"/><circle cx="136.8" cy="63.2" r="2.6"/>' +
          '<circle cx="63.2" cy="136.8" r="2.6"/><circle cx="136.8" cy="136.8" r="2.6"/></g>' +
        '<circle cx="100" cy="100" r="4" fill="currentColor"/>' +
      '</svg>',
      "Interpretive diagram",
      "The emanation of the aeons from the Monad &mdash; the fullness (Pleroma) of Gnostic cosmology. An original schematic of the idea, not a historical illustration."
    ),

    /* Ch18 — Roman mystery cults: the crossed torches of the rites */
    "ch18": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="102" r="86" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>' +
        '<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
          '<line x1="66" y1="156" x2="120" y2="58"/><line x1="134" y1="156" x2="80" y2="58"/></g>' +
        '<g stroke="currentColor" stroke-width="1.3">' +
          '<path d="M120 58 C112 46 116 38 122 30 C128 38 130 48 120 58 Z"/>' +
          '<path d="M80 58 C72 46 76 38 82 30 C88 38 90 48 80 58 Z"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The crossed torches of the mystery rites &mdash; initiation, and the descent and return. An original rendering of the emblem, not a specific relief."
    ),

    /* Ch19 — Rabbinic Judaism: an open Torah scroll */
    "ch19": fig(
      '<svg class="plate-art" viewBox="0 0 200 176" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<line x1="54" y1="30" x2="54" y2="142"/><circle cx="54" cy="26" r="6"/><circle cx="54" cy="146" r="6"/>' +
          '<line x1="146" y1="30" x2="146" y2="142"/><circle cx="146" cy="26" r="6"/><circle cx="146" cy="146" r="6"/>' +
          '<path d="M54 42 q12 -6 26 0 v90 q-14 6 -26 0 z"/>' +
          '<path d="M146 42 q-12 -6 -26 0 v90 q14 6 26 0 z"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="84" y1="58" x2="116" y2="58"/><line x1="84" y1="70" x2="116" y2="70"/>' +
          '<line x1="84" y1="82" x2="116" y2="82"/><line x1="84" y1="94" x2="116" y2="94"/>' +
          '<line x1="84" y1="106" x2="116" y2="106"/><line x1="84" y1="118" x2="116" y2="118"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "An open Torah scroll on its two staves (<em>atzei chaim</em>); the text lines are indicative only. An original drawing, not a reproduction of a specific scroll."
    ),

    /* Ch22 — Patristic Christianity: the open codex beneath the cross, Alpha & Omega */
    "ch22": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
        '<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
          '<line x1="100" y1="42" x2="100" y2="80"/><line x1="88" y1="54" x2="112" y2="54"/></g>' +
        '<g stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">' +
          '<path d="M69 72 L74 58 L79 72"/><path d="M71 67 H77"/>' +
          '<path d="M121 72 Q120 56 126 56 Q132 56 131 72"/><path d="M117 72 H124"/><path d="M128 72 H135"/></g>' +
        '<g stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' +
          '<path d="M100 88 C82 80 58 80 40 86 L40 150 C58 145 82 145 100 152 Z"/>' +
          '<path d="M100 88 C118 80 142 80 160 86 L160 150 C142 145 118 145 100 152 Z"/>' +
          '<line x1="100" y1="88" x2="100" y2="152"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="52" y1="100" x2="90" y2="98"/><line x1="52" y1="112" x2="90" y2="110"/>' +
          '<line x1="52" y1="124" x2="90" y2="122"/><line x1="52" y1="136" x2="90" y2="134"/>' +
          '<line x1="110" y1="98" x2="148" y2="100"/><line x1="110" y1="110" x2="148" y2="112"/>' +
          '<line x1="110" y1="122" x2="148" y2="124"/><line x1="110" y1="134" x2="148" y2="136"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The open codex beneath the cross, flanked by Alpha and Omega &mdash; the canon, the creed, and Christ &ldquo;the beginning and the end.&rdquo; An original rendering of the symbols, not a specific manuscript."
    ),

    /* Ch23 — Norse Paganism: a Mjölnir (Thor's-hammer) pendant, worn point-down */
    "ch23": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
        // suspension loop
        '<circle cx="100" cy="26" r="9" stroke="currentColor" stroke-width="2"/>' +
        // handle / neck
        '<path d="M92 40 L92 74 L108 74 L108 40 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
        // hammer-head silhouette with a short central foot
        '<path d="M48 74 L152 74 L152 128 L128 128 L128 142 L118 142 L110 156 L90 156 L82 142 L72 142 L72 128 L48 128 Z" ' +
          'stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>' +
        // engraved decoration on the head
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="56" y1="86" x2="144" y2="86"/><line x1="56" y1="120" x2="144" y2="120"/>' +
          '<path d="M72 103 L100 92 L128 103 L100 114 Z"/>' +
          '<line x1="100" y1="92" x2="100" y2="114"/><line x1="72" y1="103" x2="128" y2="103"/></g>' +
        '<circle cx="100" cy="103" r="4" fill="currentColor" opacity="0.7"/>' +
      '</svg>',
      "Interpretive illustration",
      "A Mj&ouml;lnir &mdash; Thor&rsquo;s-hammer pendant &mdash; of the kind worn in silver and iron across the Viking world, worn point-down with an engraved knot at its heart. An original geometric rendering, not a photograph of a specific find."
    ),

    /* Ch24 — Tantra: an interpretive Sri Yantra (bhupura, lotus, interlocking triangles, bindu) */
    "ch24": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        // bhupura: three nested square frames with four gates
        '<g stroke="currentColor" stroke-width="1.1" opacity="0.7">' +
          '<rect x="24" y="24" width="152" height="152"/>' +
          '<rect x="30" y="30" width="140" height="140" opacity="0.6"/>' +
          '<rect x="36" y="36" width="128" height="128" opacity="0.4"/></g>' +
        '<g stroke="currentColor" stroke-width="1.1" opacity="0.7">' +
          '<path d="M92 24 v-8 h16 v8"/><path d="M92 176 v8 h16 v-8"/>' +
          '<path d="M24 92 h-8 v16 h8"/><path d="M176 92 h8 v16 h-8"/></g>' +
        // two lotus rings
        '<circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="52" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>' +
        // interlocking triangles (four apex-up, four apex-down)
        '<g stroke="currentColor" stroke-width="0.9" opacity="0.75">' +
          '<path d="M100 48 L54 138 L146 138 Z"/>' +
          '<path d="M100 62 L66 142 L134 142 Z"/>' +
          '<path d="M100 152 L54 62 L146 62 Z"/>' +
          '<path d="M100 138 L66 58 L134 58 Z"/></g>' +
        '<g stroke="currentColor" stroke-width="0.7" opacity="0.55">' +
          '<path d="M100 76 L74 128 L126 128 Z"/>' +
          '<path d="M100 124 L74 72 L126 72 Z"/></g>' +
        // bindu
        '<circle cx="100" cy="100" r="3.4" fill="currentColor"/>' +
      '</svg>',
      "Interpretive illustration",
      "An interpretive &#346;r&#299; Yantra &mdash; the square bh&#363;pura and its four gates, the lotus rings, the interlocking triangles of &#346;iva and &#346;akti, and the central bindu. An original geometric rendering in the tradition&rsquo;s idiom, not a ritually precise diagram."
    )

  };

  // expose just the artwork (no caption) so tiles/thumbnails can reuse a plate
  window.PLATE_ART = {};
  Object.keys(window.PLATES).forEach(function (id) {
    var m = window.PLATES[id].match(/<svg[\s\S]*?<\/svg>/);
    window.PLATE_ART[id] = m ? m[0] : "";
  });

  // plate styling — kept in-module so page markup/CSS stay untouched
  var css =
    // works whether the plate sits in the chapter head (frontispiece) or the article body
    ".page-head .plate,.article .plate{margin:1.7rem auto 0.4rem;max-width:24rem;text-align:center}" +
    ".plate .plate-art{width:100%;max-width:360px;height:auto;color:var(--gold-bright,#d9b06a);display:inline-block;" +
      "padding:1.35rem;border:1px solid var(--line,#37291a);border-radius:5px;" +
      "background:radial-gradient(120% 120% at 50% 32%,#1d150d 0%,rgba(16,12,9,0) 78%)}" +
    ".plate figcaption{margin:0.75rem auto 0;font-size:0.78rem;line-height:1.5;max-width:26rem;" +
      "color:var(--ink-faint,#6f624a);font-style:italic}" +
    ".plate .tag{display:inline-block;font-style:normal;text-transform:uppercase;letter-spacing:0.14em;" +
      "font-size:0.56rem;color:var(--ink-dim,#9a8a6b);border:1px solid var(--line,#37291a);" +
      "padding:0.16rem 0.5rem;border-radius:2px;margin-bottom:0.5rem}";
  var s = document.createElement("style");
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
