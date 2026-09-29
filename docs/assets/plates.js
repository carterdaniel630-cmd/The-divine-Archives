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

    /* Ch46 — Creation: the first light, the dividing of the waters, the first mound */
    "ch46": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        '<ellipse cx="100" cy="100" rx="58" ry="80" stroke="currentColor" stroke-width="0.7" opacity="0.35"/>' +
        '<g stroke="currentColor" stroke-width="0.9" opacity="0.7">' +
          '<line x1="100" y1="30" x2="100" y2="40"/><line x1="84" y1="36" x2="90" y2="44"/><line x1="116" y1="36" x2="110" y2="44"/>' +
          '<line x1="74" y1="52" x2="84" y2="52"/><line x1="126" y1="52" x2="116" y2="52"/></g>' +
        '<circle cx="100" cy="52" r="4.5" fill="currentColor"/>' +
        '<line x1="100" y1="58" x2="100" y2="104" stroke="currentColor" stroke-width="0.7" stroke-dasharray="2 4" opacity="0.45"/>' +
        '<path d="M52 88 Q66 82 80 88 T108 88 T136 88 T150 88" stroke="currentColor" stroke-width="1" opacity="0.6"/>' +
        '<path d="M52 120 Q66 114 80 120 T108 120 T136 120 T150 120" stroke="currentColor" stroke-width="1" opacity="0.6"/>' +
        '<path d="M72 120 Q100 90 128 120" stroke="currentColor" stroke-width="1.4"/>' +
        '<line x1="100" y1="104" x2="100" y2="120" stroke="currentColor" stroke-width="1" opacity="0.5"/>' +
      '</svg>',
      "Interpretive diagram",
      "The first light above, the dividing of the waters, and the first mound rising from the deep. An original schematic of the creation motif, not a historical illustration."
    ),

    /* Ch45 — Pistis Sophia: the thirteen aeons, the fall into Chaos, and the ascent */
    "ch45": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.55">' +   /* radiant apex — the Light of the height */
          '<line x1="100" y1="6" x2="100" y2="20"/><line x1="88" y1="10" x2="94" y2="20"/><line x1="112" y1="10" x2="106" y2="20"/>' +
          '<line x1="80" y1="16" x2="90" y2="24"/><line x1="120" y1="16" x2="110" y2="24"/></g>' +
        '<circle cx="100" cy="22" r="3.2" fill="currentColor"/>' +
        '<g stroke="currentColor" stroke-linecap="round">' +   /* thirteen aeon-rungs, widening as they descend */
          '<line x1="90" y1="34" x2="110" y2="34" stroke-width="1.2" opacity="0.9"/>' +
          '<line x1="88" y1="43" x2="112" y2="43" stroke-width="1.1" opacity="0.85"/>' +
          '<line x1="86" y1="52" x2="114" y2="52" stroke-width="1.1" opacity="0.8"/>' +
          '<line x1="83" y1="61" x2="117" y2="61" stroke-width="1" opacity="0.76"/>' +
          '<line x1="80" y1="70" x2="120" y2="70" stroke-width="1" opacity="0.72"/>' +
          '<line x1="77" y1="79" x2="123" y2="79" stroke-width="1" opacity="0.68"/>' +
          '<line x1="74" y1="88" x2="126" y2="88" stroke-width="0.9" opacity="0.64"/>' +
          '<line x1="71" y1="97" x2="129" y2="97" stroke-width="0.9" opacity="0.6"/>' +
          '<line x1="68" y1="106" x2="132" y2="106" stroke-width="0.9" opacity="0.56"/>' +
          '<line x1="65" y1="115" x2="135" y2="115" stroke-width="0.8" opacity="0.52"/>' +
          '<line x1="62" y1="124" x2="138" y2="124" stroke-width="0.8" opacity="0.48"/>' +
          '<line x1="59" y1="133" x2="141" y2="133" stroke-width="0.8" opacity="0.44"/>' +
          '<line x1="56" y1="142" x2="144" y2="142" stroke-width="0.8" opacity="0.4"/></g>' +
        '<path d="M100 26 C64 60 60 120 92 150" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" opacity="0.75"/>' +   /* the fall */
        '<path d="M108 150 C140 120 136 60 100 26" stroke="currentColor" stroke-width="1" opacity="0.5"/>' +   /* the ascent */
        '<circle cx="100" cy="160" r="14" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>' +   /* Chaos */
        '<circle cx="100" cy="160" r="4" fill="currentColor" opacity="0.85"/>' +
      '</svg>',
      "Interpretive diagram",
      "The thirteen aeons above, the fall of Pistis Sophia into Chaos (dashed) and her ascent back toward the Light (solid). An original schematic of the myth, not a historical illustration."
    ),

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
    ),

    /* Ch25 — Shinto: a torii gate, the threshold to the dwelling of the kami */
    "ch25": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
        '<g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
          // kasagi — the curved top lintel
          '<path d="M36 60 Q100 44 164 60" stroke-width="5.5"/>' +
          // shimaki — straight beam just below the kasagi
          '<path d="M52 70 L148 70" stroke-width="3"/>' +
          // pillars, leaning slightly outward at the base
          '<path d="M72 60 L67 178" stroke-width="5"/>' +
          '<path d="M128 60 L133 178" stroke-width="5"/>' +
          // nuki — the lower tie beam, protruding past the pillars
          '<path d="M56 100 L144 100" stroke-width="4"/>' +
          // gakuzuka — central strut between nuki and shimaki
          '<path d="M100 70 L100 100" stroke-width="3"/></g>' +
        // base stones
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="60" y1="178" x2="74" y2="178"/><line x1="126" y1="178" x2="140" y2="178"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A torii &mdash; the gateway that marks the threshold between the ordinary world and the dwelling of the kami; to pass through it is already a small purification. An original geometric rendering, not a specific shrine."
    ),

    /* Ch26 — Kabbalah: the Tree of Life, ten sefirot joined by twenty-two paths */
    "ch26": fig(
      '<svg class="plate-art" viewBox="0 0 200 210" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="105" r="99" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // 22 paths
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.42">' +
          '<line x1="100" y1="24" x2="140" y2="52"/><line x1="100" y1="24" x2="60" y2="52"/><line x1="100" y1="24" x2="100" y2="112"/>' +
          '<line x1="140" y1="52" x2="60" y2="52"/><line x1="140" y1="52" x2="140" y2="94"/><line x1="140" y1="52" x2="100" y2="112"/>' +
          '<line x1="60" y1="52" x2="60" y2="94"/><line x1="60" y1="52" x2="100" y2="112"/>' +
          '<line x1="140" y1="94" x2="60" y2="94"/><line x1="140" y1="94" x2="100" y2="112"/><line x1="140" y1="94" x2="140" y2="136"/>' +
          '<line x1="60" y1="94" x2="100" y2="112"/><line x1="60" y1="94" x2="60" y2="136"/>' +
          '<line x1="100" y1="112" x2="140" y2="136"/><line x1="100" y1="112" x2="60" y2="136"/><line x1="100" y1="112" x2="100" y2="158"/>' +
          '<line x1="140" y1="136" x2="60" y2="136"/><line x1="140" y1="136" x2="100" y2="158"/><line x1="140" y1="136" x2="100" y2="186"/>' +
          '<line x1="60" y1="136" x2="100" y2="158"/><line x1="60" y1="136" x2="100" y2="186"/>' +
          '<line x1="100" y1="158" x2="100" y2="186"/></g>' +
        // 10 sefirot
        '<g stroke="currentColor" stroke-width="1.2" fill="none">' +
          '<circle cx="100" cy="24" r="9"/><circle cx="140" cy="52" r="9"/><circle cx="60" cy="52" r="9"/>' +
          '<circle cx="140" cy="94" r="9"/><circle cx="60" cy="94" r="9"/><circle cx="100" cy="112" r="9"/>' +
          '<circle cx="140" cy="136" r="9"/><circle cx="60" cy="136" r="9"/><circle cx="100" cy="158" r="9"/>' +
          '<circle cx="100" cy="186" r="9"/></g>' +
        '<g fill="currentColor" opacity="0.75">' +
          '<circle cx="100" cy="24" r="1.6"/><circle cx="140" cy="52" r="1.6"/><circle cx="60" cy="52" r="1.6"/>' +
          '<circle cx="140" cy="94" r="1.6"/><circle cx="60" cy="94" r="1.6"/><circle cx="100" cy="112" r="1.6"/>' +
          '<circle cx="140" cy="136" r="1.6"/><circle cx="60" cy="136" r="1.6"/><circle cx="100" cy="158" r="1.6"/>' +
          '<circle cx="100" cy="186" r="1.6"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The Tree of Life (Etz Chaim) &mdash; the ten sefirot through which the hidden Ein Sof emanates into creation, joined by the twenty-two paths of the Hebrew letters. An original geometric rendering of the traditional figure."
    ),

    /* Ch27 — Sufism: a whirling dervish of the sema, one hand to heaven, one to earth */
    "ch27": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.35"/>' +
        // motion arcs suggesting the turn
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.4" stroke-linecap="round" stroke-dasharray="2 6">' +
          '<path d="M40 150 A 60 26 0 0 0 160 150"/>' +
          '<path d="M48 158 A 52 20 0 0 0 152 158"/></g>' +
        '<g stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">' +
          // sikke (the tall hat)
          '<path d="M94 60 L97 30 L103 30 L106 60 Z" stroke-width="1.4"/>' +
          // head
          '<circle cx="100" cy="66" r="6" stroke-width="1.4"/>' +
          // arms: right up to heaven, left down to earth
          '<path d="M100 80 L140 58" stroke-width="1.8"/>' +
          '<path d="M100 80 L64 98" stroke-width="1.8"/>' +
          '<circle cx="141" cy="57" r="1.7" fill="currentColor"/><circle cx="63" cy="99" r="1.7" fill="currentColor"/>' +
          // the flaring white skirt (tennure)
          '<path d="M100 78 C82 84 60 116 52 156 L148 156 C140 116 118 84 100 78 Z" stroke-width="1.6"/>' +
          // pleats
          '<g stroke-width="0.7" opacity="0.5">' +
            '<line x1="100" y1="86" x2="100" y2="156"/><line x1="84" y1="110" x2="76" y2="156"/>' +
            '<line x1="116" y1="110" x2="124" y2="156"/></g></g>' +
      '</svg>',
      "Interpretive illustration",
      "A dervish of the sema &mdash; the whirling ceremony of the Mevlevi &mdash; the right hand lifted to receive grace from heaven, the left turned down to pass it to the earth, the robe flaring as the soul turns toward union. An original geometric rendering, not a specific image."
    ),

    /* Ch28 — Scholasticism: a Gothic rose window, order made visible ("summa in stone") */
    "ch28": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<g stroke="currentColor">' +
          '<circle cx="100" cy="100" r="92" stroke-width="1.4"/>' +
          '<circle cx="100" cy="100" r="82" stroke-width="0.9" opacity="0.6"/>' +
          // eight radial spokes
          '<g stroke-width="0.8" opacity="0.55">' +
            '<line x1="100" y1="100" x2="182" y2="100"/><line x1="100" y1="100" x2="18" y2="100"/>' +
            '<line x1="100" y1="100" x2="100" y2="182"/><line x1="100" y1="100" x2="100" y2="18"/>' +
            '<line x1="100" y1="100" x2="158" y2="158"/><line x1="100" y1="100" x2="42" y2="42"/>' +
            '<line x1="100" y1="100" x2="158" y2="42"/><line x1="100" y1="100" x2="42" y2="158"/></g>' +
          // ring the foils sit on
          '<circle cx="100" cy="100" r="50" stroke-width="0.7" opacity="0.4"/>' +
          // eight foils (petal lights)
          '<g stroke-width="1">' +
            '<circle cx="150" cy="100" r="10"/><circle cx="50" cy="100" r="10"/>' +
            '<circle cx="100" cy="150" r="10"/><circle cx="100" cy="50" r="10"/>' +
            '<circle cx="135.4" cy="135.4" r="10"/><circle cx="64.6" cy="64.6" r="10"/>' +
            '<circle cx="135.4" cy="64.6" r="10"/><circle cx="64.6" cy="135.4" r="10"/></g>' +
          // central rosette
          '<circle cx="100" cy="100" r="20" stroke-width="1.2"/>' +
          '<circle cx="100" cy="100" r="11" stroke-width="0.8" opacity="0.7"/></g>' +
        '<g fill="currentColor">' +
          '<circle cx="100" cy="100" r="3.5"/>' +
          '<g opacity="0.7"><circle cx="150" cy="100" r="1.5"/><circle cx="50" cy="100" r="1.5"/>' +
            '<circle cx="100" cy="150" r="1.5"/><circle cx="100" cy="50" r="1.5"/>' +
            '<circle cx="135.4" cy="135.4" r="1.5"/><circle cx="64.6" cy="64.6" r="1.5"/>' +
            '<circle cx="135.4" cy="64.6" r="1.5"/><circle cx="64.6" cy="135.4" r="1.5"/></g></g>' +
      '</svg>',
      "Interpretive illustration",
      "A Gothic rose window &mdash; order made visible, the &ldquo;summa in stone&rdquo;: a single figure in which every part is articulated and reconciled into a stable whole, as the schoolmen built their arguments. An original geometric rendering, not a specific window."
    ),

    /* Ch29 — Aztec/Maya/Inca: a stepped temple-pyramid beneath the sun */
    "ch29": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // the sun (solar/divine kingship shared across all three)
        '<g stroke="currentColor">' +
          '<circle cx="100" cy="46" r="16" stroke-width="1.3"/>' +
          '<circle cx="100" cy="46" r="8" stroke-width="0.8" opacity="0.7"/></g>' +
        '<g stroke="currentColor" stroke-width="1" stroke-linecap="round">' +
          '<line x1="100" y1="22" x2="100" y2="14"/><line x1="100" y1="78" x2="100" y2="70"/>' +
          '<line x1="76" y1="46" x2="68" y2="46"/><line x1="132" y1="46" x2="124" y2="46"/>' +
          '<line x1="83" y1="29" x2="77" y2="23"/><line x1="117" y1="29" x2="123" y2="23"/>' +
          '<line x1="83" y1="63" x2="77" y2="69"/><line x1="117" y1="63" x2="123" y2="69"/></g>' +
        '<circle cx="100" cy="46" r="2.4" fill="currentColor"/>' +
        // the stepped temple-pyramid (temple-mountain)
        '<g stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">' +
          '<rect x="34" y="152" width="132" height="16"/>' +
          '<rect x="48" y="138" width="104" height="14"/>' +
          '<rect x="62" y="125" width="76" height="13"/>' +
          '<rect x="76" y="113" width="48" height="12"/>' +
          // shrine on the summit
          '<rect x="88" y="98" width="24" height="15"/></g>' +
        // central staircase up the front
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.65">' +
          '<line x1="91" y1="113" x2="91" y2="168"/><line x1="109" y1="113" x2="109" y2="168"/>' +
          '<line x1="91" y1="124" x2="109" y2="124"/><line x1="91" y1="136" x2="109" y2="136"/>' +
          '<line x1="91" y1="147" x2="109" y2="147"/><line x1="91" y1="158" x2="109" y2="158"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A stepped temple-pyramid beneath the sun &mdash; the temple-mountain and solar kingship shared, independently, by the Maya, the Aztec, and the Inca. An original geometric rendering, not a specific monument."
    ),

    /* Ch30 — Bhakti: a lotus in bloom, the flower of devotion */
    "ch30": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // outer petals (broader, paler), fanning widest
        '<g stroke="currentColor" stroke-width="1" opacity="0.5">' +
          '<path d="M100 150 C 84 120 84 92 100 74 C 116 92 116 120 100 150 Z" transform="rotate(-72 100 150)"/>' +
          '<path d="M100 150 C 84 120 84 92 100 74 C 116 92 116 120 100 150 Z" transform="rotate(72 100 150)"/></g>' +
        // main petals
        '<g stroke="currentColor" stroke-width="1.3">' +
          '<path d="M100 150 C 90 118 94 82 100 58 C 106 82 110 118 100 150 Z" transform="rotate(-48 100 150)"/>' +
          '<path d="M100 150 C 90 118 94 82 100 58 C 106 82 110 118 100 150 Z" transform="rotate(-24 100 150)"/>' +
          '<path d="M100 150 C 90 118 94 82 100 58 C 106 82 110 118 100 150 Z"/>' +
          '<path d="M100 150 C 90 118 94 82 100 58 C 106 82 110 118 100 150 Z" transform="rotate(24 100 150)"/>' +
          '<path d="M100 150 C 90 118 94 82 100 58 C 106 82 110 118 100 150 Z" transform="rotate(48 100 150)"/></g>' +
        // calyx / base and stem
        '<g stroke="currentColor" stroke-width="1" opacity="0.7">' +
          '<path d="M74 150 Q100 162 126 150"/>' +
          '<line x1="100" y1="152" x2="100" y2="176"/></g>' +
        '<circle cx="100" cy="150" r="2.6" fill="currentColor"/>' +
      '</svg>',
      "Interpretive illustration",
      "A lotus in bloom &mdash; the flower of devotion, rising from the water unstained: an emblem for a religion of love open to all. An original geometric rendering, not a specific image."
    ),

    /* Ch31 — Reformation: a rose enclosing a heart and cross (after the Luther seal) */
    "ch31": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="1.3"/>' +
        '<circle cx="100" cy="100" r="82" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>' +
        // five rose petals
        '<g stroke="currentColor" stroke-width="1.1" opacity="0.85">' +
          '<path d="M100 100 C 78 74 82 44 100 30 C 118 44 122 74 100 100 Z"/>' +
          '<path d="M100 100 C 78 74 82 44 100 30 C 118 44 122 74 100 100 Z" transform="rotate(72 100 100)"/>' +
          '<path d="M100 100 C 78 74 82 44 100 30 C 118 44 122 74 100 100 Z" transform="rotate(144 100 100)"/>' +
          '<path d="M100 100 C 78 74 82 44 100 30 C 118 44 122 74 100 100 Z" transform="rotate(216 100 100)"/>' +
          '<path d="M100 100 C 78 74 82 44 100 30 C 118 44 122 74 100 100 Z" transform="rotate(288 100 100)"/></g>' +
        // heart + cross at the center
        '<path d="M100 128 C 82 112 78 98 90 92 C 96 89 100 94 100 98 C 100 94 104 89 110 92 C 122 98 118 112 100 128 Z" stroke="currentColor" stroke-width="1.3"/>' +
        '<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="100" y1="96" x2="100" y2="118"/><line x1="92" y1="104" x2="108" y2="104"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A rose enclosing a heart and cross, after the seal Luther chose &mdash; the living faith of the believer at the center of a movement that put the Word above all. An original geometric rendering, not a facsimile of the seal."
    ),

    /* Ch32 — Witch Trials: the scales of justice, unbalanced */
    "ch32": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        '<g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
          // stand
          '<line x1="100" y1="44" x2="100" y2="150" stroke-width="1.6"/>' +
          '<path d="M78 158 L122 158 L112 150 L88 150 Z" stroke-width="1.4"/>' +
          '<circle cx="100" cy="44" r="3.4" fill="currentColor"/>' +
          // tilted beam
          '<line x1="42" y1="60" x2="158" y2="80" stroke-width="1.6"/>' +
          // left pan (raised)
          '<line x1="42" y1="60" x2="42" y2="70" stroke-width="0.9"/>' +
          '<path d="M26 70 Q42 88 58 70" stroke-width="1.3"/>' +
          '<line x1="26" y1="70" x2="42" y2="60" stroke-width="0.7" opacity="0.6"/><line x1="58" y1="70" x2="42" y2="60" stroke-width="0.7" opacity="0.6"/>' +
          // right pan (lowered)
          '<line x1="158" y1="80" x2="158" y2="100" stroke-width="0.9"/>' +
          '<path d="M142 100 Q158 118 174 100" stroke-width="1.3"/>' +
          '<line x1="142" y1="100" x2="158" y2="80" stroke-width="0.7" opacity="0.6"/><line x1="174" y1="100" x2="158" y2="80" stroke-width="0.7" opacity="0.6"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The scales of justice, thrown out of balance &mdash; a persecution that wore the robes of law to punish an imaginary crime. An original figure, chosen to mark the trials as a miscarriage of justice, not to depict their victims."
    ),

    /* Ch33 — African Traditional Religion: an Ifa divination motif with binary odu marks */
    "ch33": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="1.3"/>' +
        '<circle cx="100" cy="100" r="78" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>' +
        // eight rim marks (the cast positions)
        '<g stroke="currentColor" stroke-width="1.2">' +
          '<line x1="100" y1="12" x2="100" y2="22"/><line x1="100" y1="178" x2="100" y2="188"/>' +
          '<line x1="12" y1="100" x2="22" y2="100"/><line x1="178" y1="100" x2="188" y2="100"/>' +
          '<line x1="38" y1="38" x2="45" y2="45"/><line x1="162" y1="38" x2="155" y2="45"/>' +
          '<line x1="38" y1="162" x2="45" y2="155"/><line x1="162" y1="162" x2="155" y2="155"/></g>' +
        // a central odu figure: two columns of four marks (single = one stroke, double = two)
        '<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
          '<line x1="84" y1="70" x2="84" y2="82"/>' +                         // I
          '<line x1="80" y1="94" x2="80" y2="106"/><line x1="88" y1="94" x2="88" y2="106"/>' + // II
          '<line x1="84" y1="118" x2="84" y2="130"/>' +                       // I
          '<line x1="80" y1="142" x2="80" y2="154"/><line x1="88" y1="142" x2="88" y2="154"/>' + // II
          '<line x1="112" y1="70" x2="112" y2="82"/><line x1="120" y1="70" x2="120" y2="82"/>' + // II
          '<line x1="116" y1="94" x2="116" y2="106"/>' +                      // I
          '<line x1="112" y1="118" x2="112" y2="130"/><line x1="120" y1="118" x2="120" y2="130"/>' + // II
          '<line x1="116" y1="142" x2="116" y2="154"/></g>' +                 // I
      '</svg>',
      "Interpretive illustration",
      "An Ifa divination motif &mdash; the diviner&rsquo;s marks that record one of the 256 odu, a sacred binary read from palm nuts. An original geometric rendering in the tradition&rsquo;s idiom, not a specific tray."
    ),

    /* Ch34 — Sikhism: the Khanda (double-edged sword, chakkar, two kirpans) */
    "ch34": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // chakkar (the ring)
        '<circle cx="100" cy="104" r="40" stroke="currentColor" stroke-width="2.4"/>' +
        // two kirpans, curving up and out, crossing below
        '<g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">' +
          '<path d="M92 168 C 58 150 46 108 60 66"/>' +
          '<path d="M108 168 C 142 150 154 108 140 66"/></g>' +
        // central double-edged khanda blade
        '<g stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">' +
          '<path d="M100 26 L107 46 L104 150 L96 150 L93 46 Z" fill="currentColor" opacity="0.15"/>' +
          '<path d="M100 26 L107 46 L104 150 L96 150 L93 46 Z"/>' +
          '<line x1="100" y1="30" x2="100" y2="150" stroke-width="0.7" opacity="0.6"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The Khanda &mdash; the double-edged sword of divine truth within the chakkar of God&rsquo;s oneness, flanked by the two kirpans of spiritual and temporal power. An original geometric rendering of the Sikh emblem."
    ),

    /* Ch35 — New Religious Movements: a new scripture beneath a rising star */
    "ch35": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // radiant star (new revelation)
        '<g stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7">' +
          '<line x1="100" y1="28" x2="100" y2="12"/><line x1="100" y1="76" x2="100" y2="86"/>' +
          '<line x1="76" y1="52" x2="62" y2="52"/><line x1="124" y1="52" x2="138" y2="52"/>' +
          '<line x1="83" y1="35" x2="73" y2="25"/><line x1="117" y1="35" x2="127" y2="25"/>' +
          '<line x1="83" y1="69" x2="73" y2="79"/><line x1="117" y1="69" x2="127" y2="79"/></g>' +
        '<path d="M100 36 L106 48 L119 50 L109 59 L112 72 L100 65 L88 72 L91 59 L81 50 L94 48 Z" stroke="currentColor" stroke-width="1.2"/>' +
        // open book (new scripture)
        '<g stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">' +
          '<path d="M100 112 C 80 100 56 100 40 108 L40 158 C 56 150 80 150 100 162 Z"/>' +
          '<path d="M100 112 C 120 100 144 100 160 108 L160 158 C 144 150 120 150 100 162 Z"/>' +
          '<line x1="100" y1="112" x2="100" y2="162"/></g>' +
        '<g stroke="currentColor" stroke-width="0.7" opacity="0.5">' +
          '<line x1="52" y1="118" x2="90" y2="116"/><line x1="52" y1="128" x2="90" y2="126"/>' +
          '<line x1="110" y1="116" x2="148" y2="118"/><line x1="110" y1="126" x2="148" y2="128"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A new scripture beneath a rising star &mdash; the fresh revelations and founders&rsquo; books of the modern religions. An original emblem for the phenomenon, not any one movement."
    ),

    /* Ch36 — Spiritualism: a planchette (the talking-board pointer) */
    "ch36": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // planchette body (rounded shield / heart-triangle pointing down)
        '<path d="M60 74 Q100 58 140 74 Q150 112 100 150 Q50 112 60 74 Z" stroke="currentColor" stroke-width="1.6"/>' +
        // viewing hole
        '<circle cx="100" cy="98" r="13" stroke="currentColor" stroke-width="1.2"/>' +
        '<circle cx="100" cy="98" r="2.2" fill="currentColor" opacity="0.7"/>' +
        // three small casters/feet
        '<g stroke="currentColor" stroke-width="1"><circle cx="64" cy="78" r="3.4"/><circle cx="136" cy="78" r="3.4"/><circle cx="100" cy="146" r="3.4"/></g>' +
        // faint alphabet arc below (the board)
        '<path d="M40 170 Q100 150 160 170" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
      '</svg>',
      "Interpretive illustration",
      "A planchette &mdash; the pointer of the talking board, through which the séance spelled its messages letter by letter. An original geometric rendering, not a specific board."
    ),

    /* Ch37 — Theosophy / occult revival: interlaced triangles and ankh within an ouroboros */
    "ch37": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        // ouroboros ring (serpent) with a small head
        '<circle cx="100" cy="100" r="84" stroke="currentColor" stroke-width="2" stroke-dasharray="255 20"/>' +
        '<path d="M100 12 l6 -8 l-12 0 z" fill="currentColor"/>' +
        // hexagram (as above, so below)
        '<g stroke="currentColor" stroke-width="1.2">' +
          '<path d="M100 50 L142 122 L58 122 Z"/>' +
          '<path d="M100 150 L142 78 L58 78 Z"/></g>' +
        // ankh at the center
        '<g stroke="currentColor" stroke-width="1.6"><circle cx="100" cy="92" r="9"/><line x1="100" y1="101" x2="100" y2="126"/><line x1="88" y1="112" x2="112" y2="112"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A synthesis emblem &mdash; the ouroboros of eternity, the interlaced triangles of &ldquo;as above, so below,&rdquo; and the ankh of life &mdash; in the manner of Theosophy&rsquo;s joining of all sacred signs. An original composite, not a facsimile of any seal."
    ),

    /* Ch38 — Wicca: the pentacle (upright, in a circle) with a triple moon */
    "ch38": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // triple moon
        '<g stroke="currentColor" stroke-width="1.4">' +
          '<circle cx="100" cy="40" r="11"/>' +
          '<path d="M84 30 A 14 14 0 0 0 84 50"/>' +
          '<path d="M116 30 A 14 14 0 0 1 116 50"/></g>' +
        // pentacle
        '<circle cx="100" cy="118" r="52" stroke="currentColor" stroke-width="1.4"/>' +
        '<path d="M100 68 L135 176 L44 109 L156 109 L65 176 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>',
      "Interpretive illustration",
      "The pentacle &mdash; the five-pointed star of the four elements crowned by spirit, bound in the circle of unity &mdash; beneath the triple moon of the Goddess. An original geometric rendering of the Wiccan emblem."
    ),

    /* Ch39 — Satanism: the inverted pentagram (reclaimed), in a circle */
    "ch39": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        '<circle cx="100" cy="100" r="66" stroke="currentColor" stroke-width="1.6"/>' +
        // inverted pentagram (point down)
        '<path d="M100 160 L135 51 L43 119 L157 119 L65 51 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '</svg>',
      "Interpretive illustration",
      "The inverted pentagram &mdash; the symbol modern self-identified Satanists reclaim as an emblem of the carnal and the self, spirit turned toward matter. An original geometric rendering; a reclaimed sign, described, not endorsed."
    ),

    /* Ch40 — African Diaspora Religions: a vèvè-style crossroads (Legba opens the way) */
    "ch40": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        '<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          // the crossroads
          '<line x1="100" y1="30" x2="100" y2="170"/><line x1="30" y1="100" x2="170" y2="100"/>' +
          // central diamond
          '<path d="M100 82 L118 100 L100 118 L82 100 Z"/>' +
          // curls at the four ends
          '<path d="M100 30 q -12 -6 -12 -16 M100 30 q 12 -6 12 -16"/>' +
          '<path d="M100 170 q -12 6 -12 16 M100 170 q 12 6 12 16"/>' +
          '<path d="M30 100 q -6 -12 -16 -12 M30 100 q -6 12 -16 12"/>' +
          '<path d="M170 100 q 6 -12 16 -12 M170 100 q 6 12 16 12"/></g>' +
        // small hearts/dots along the arms
        '<g fill="currentColor" opacity="0.7"><circle cx="100" cy="56" r="2.4"/><circle cx="100" cy="144" r="2.4"/><circle cx="56" cy="100" r="2.4"/><circle cx="144" cy="100" r="2.4"/><circle cx="100" cy="100" r="2.6"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A vèvè-style crossroads &mdash; the sign of the gatekeeper who must open the way before any spirit can be reached, the ground-drawn sigils at the heart of Vodou and its kin. An original rendering in the tradition&rsquo;s idiom, not a specific vèvè."
    ),

    /* Ch41 — Paleolithic: a stenciled hand-print beside a therianthrope, on the cave wall */
    "ch41": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // the negative hand-print (palm + five fingers)
        '<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M56 150 L56 108 Q56 100 62 100 Q68 100 68 108 L68 92 Q68 84 74 84 Q80 84 80 92 L80 96 Q80 86 86 86 Q92 86 92 96 L92 100 Q92 90 98 90 Q104 90 104 100 L104 118 Q104 108 110 108 Q116 108 114 120 L108 138 Q104 150 92 150 Z"/></g>' +
        // a therianthrope: human body, antlered/animal head (the "sorcerer")
        '<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="140" cy="70" r="8"/>' +
          '<path d="M134 64 Q128 54 124 58 M146 64 Q152 54 156 58"/>' +          // antlers
          '<line x1="140" y1="78" x2="140" y2="118"/>' +                          // torso
          '<path d="M140 88 L126 102 M140 88 L154 102"/>' +                       // arms
          '<path d="M140 118 L130 150 M140 118 L152 150"/>' +                     // legs
          '<line x1="140" y1="150" x2="126" y2="150" opacity="0.6"/></g>' +       // ground line
      '</svg>',
      "Interpretive illustration",
      "A stenciled hand-print beside an antlered therianthrope &mdash; the two oldest gestures of the sacred imagination, the pressed palm that says &ldquo;I was here&rdquo; and the human-animal being who crosses into the spirit world. An original rendering in the idiom of cave art, not a copy of any panel."
    ),

    /* Ch42 — Neolithic: a Göbekli Tepe T-pillar with carved arm, and a sun over the horizon */
    "ch42": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // solstice sun over the horizon (sky-alignment)
        '<circle cx="100" cy="46" r="13" stroke="currentColor" stroke-width="1.2"/>' +
        '<g stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.6">' +
          '<line x1="100" y1="24" x2="100" y2="16"/><line x1="78" y1="46" x2="70" y2="46"/><line x1="122" y1="46" x2="130" y2="46"/>' +
          '<line x1="84" y1="30" x2="78" y2="24"/><line x1="116" y1="30" x2="122" y2="24"/></g>' +
        '<line x1="34" y1="70" x2="166" y2="70" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
        // the T-pillar (a faceless standing being)
        '<g stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">' +
          '<path d="M74 78 L126 78 L126 96 L112 96 L112 168 L88 168 L88 96 L74 96 Z"/>' +
          // carved arm bending to hands at the front (as at Göbekli Tepe)
          '<path d="M112 108 Q120 130 108 150" stroke-width="1" opacity="0.7"/>' +
          '<path d="M100 150 L108 150 M100 156 L108 156 M100 162 L108 162" stroke-width="0.8" opacity="0.7"/>' +
          // a small carved animal (a fox/snake mark)
          '<path d="M90 116 q 6 -6 12 0 q -3 5 -6 5 q -4 0 -6 -5 Z" stroke-width="0.9" opacity="0.6"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "A T-pillar of the kind raised at Göbekli Tepe &mdash; a faceless standing being with a carved arm and hands, beneath the solstice sun the Neolithic learned to build into stone. An original geometric rendering, not a specific pillar."
    ),

    /* Ch43 — The Aztec: the Sun Stone (Piedra del Sol) as a cosmogram of the Five Suns */
    "ch43": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // concentric calendar rings
        '<circle cx="100" cy="100" r="82" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>' +
        '<circle cx="100" cy="100" r="64" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="46" stroke="currentColor" stroke-width="1"/>' +
        // ring of day-sign ticks
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<line x1="100" y1="18" x2="100" y2="30"/><line x1="100" y1="170" x2="100" y2="182"/>' +
          '<line x1="18" y1="100" x2="30" y2="100"/><line x1="170" y1="100" x2="182" y2="100"/>' +
          '<line x1="42" y1="42" x2="50" y2="50"/><line x1="158" y1="42" x2="150" y2="50"/>' +
          '<line x1="42" y1="158" x2="50" y2="150"/><line x1="158" y1="158" x2="150" y2="150"/></g>' +
        // nahui-ollin ("four-motion"): the sign of the Fifth Sun, a rotated square with four points
        '<g stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">' +
          '<path d="M100 58 L142 100 L100 142 L58 100 Z"/>' +
          '<path d="M100 70 L130 100 L100 130 L70 100 Z" stroke-width="0.7" opacity="0.6"/></g>' +
        // Tonatiuh, the sun-face at the center, with the sacrificial knife-tongue
        '<g stroke="currentColor" stroke-linecap="round">' +
          '<circle cx="100" cy="100" r="20" stroke-width="1.2"/>' +
          '<circle cx="92" cy="96" r="2.4" stroke-width="1"/><circle cx="108" cy="96" r="2.4" stroke-width="1"/>' +
          '<path d="M92 108 q8 7 16 0" stroke-width="1"/>' +
          '<path d="M96 112 L100 122 L104 112 Z" stroke-width="0.9" opacity="0.8"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "The Aztec Sun Stone (Piedra del Sol) read as a cosmogram: concentric calendar rings, the day-sign ticks, the <em>nahui-ollin</em> &ldquo;four-motion&rdquo; glyph of the Fifth Sun, and the face of Tonatiuh with its knife-tongue at the center. An original geometric rendering, not a copy of the monument."
    ),

    /* Ch44 — The Inca: Inti, the sun, over the stepped terraces of the Andes */
    "ch44": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="94" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>' +
        // Inti, the sun-disk with a face
        '<circle cx="100" cy="84" r="30" stroke="currentColor" stroke-width="1.3"/>' +
        '<g stroke="currentColor" stroke-linecap="round">' +
          '<circle cx="90" cy="80" r="2.6" stroke-width="1"/><circle cx="110" cy="80" r="2.6" stroke-width="1"/>' +
          '<line x1="100" y1="82" x2="100" y2="90" stroke-width="0.9"/>' +
          '<path d="M90 94 q10 8 20 0" stroke-width="1"/></g>' +
        // rays: alternating straight and stepped/triangular
        '<g stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.85">' +
          '<line x1="100" y1="48" x2="100" y2="36"/><line x1="70" y1="84" x2="56" y2="84"/><line x1="130" y1="84" x2="144" y2="84"/>' +
          '<line x1="79" y1="63" x2="69" y2="53"/><line x1="121" y1="63" x2="131" y2="53"/>' +
          '<line x1="79" y1="105" x2="69" y2="115"/><line x1="121" y1="105" x2="131" y2="115"/></g>' +
        '<g stroke="currentColor" stroke-width="0.8" opacity="0.5">' +
          '<path d="M100 30 l4 6 -8 0 Z"/><path d="M52 84 l6 -4 0 8 Z"/><path d="M148 84 l-6 -4 0 8 Z"/></g>' +
        // the stepped terraces (andenes) of the sacred mountain
        '<g stroke="currentColor" stroke-width="1.1" stroke-linejoin="round">' +
          '<path d="M40 170 L40 156 L64 156 L64 142 L88 142 L88 130 L112 130 L112 142 L136 142 L136 156 L160 156 L160 170"/>' +
          '<path d="M56 170 L56 162 L144 162 L144 170" stroke-width="0.7" opacity="0.5"/></g>' +
      '</svg>',
      "Interpretive illustration",
      "Inti, the Inca sun, his face ringed by straight and stepped rays, rising over the terraced andenes of the sacred mountain &mdash; the sun-emperor&rsquo;s divine ancestor above the worked Andean earth. An original geometric rendering, not a copy of any object."
    ),
    /* Ch47 — Journeys to the Underworld: a gate, the stair down, and the river with its ferry */
    "ch47": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M52 150 V70 A48 48 0 0 1 148 70 V150" stroke="currentColor" stroke-width="1.6"/><path d="M64 150 V74 A36 36 0 0 1 136 74 V150" stroke="currentColor" stroke-width="0.9" opacity="0.6"/><g stroke="currentColor" stroke-width="1.1" opacity="0.85"><line x1="74" y1="88" x2="126" y2="88"/><line x1="76" y1="97" x2="124" y2="97"/><line x1="78" y1="106" x2="122" y2="106"/><line x1="80" y1="115" x2="120" y2="115"/><line x1="82" y1="124" x2="118" y2="124"/><line x1="84" y1="133" x2="116" y2="133"/><line x1="86" y1="142" x2="114" y2="142"/></g><path d="M20 168 C45 162 70 174 100 168 C130 162 155 174 180 168" stroke="currentColor" stroke-width="1" opacity="0.7"/><path d="M20 180 C45 174 70 186 100 180 C130 174 155 186 180 180" stroke="currentColor" stroke-width="0.8" opacity="0.45"/><path d="M78 164 L122 164 L114 172 L86 172 Z" stroke="currentColor" stroke-width="1.2"/><line x1="112" y1="164" x2="126" y2="146" stroke="currentColor" stroke-width="1"/></svg>',
      "Interpretive illustration",
      "A gate at the top of a stair leading down, and below it the river with a ferryman&rsquo;s boat: the threshold, the descent and the crossing that recur in the underworld journeys of many traditions. An original composite, not a copy of any single tradition&rsquo;s image."
    ),

    /* Ch48 — The Great Goddess: the triple moon above a schematic figurine */
    "ch48": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M50 34 A16 16 0 1 0 50 66 A12 16 0 1 1 50 34 Z" stroke="currentColor" stroke-width="1.3"/><circle cx="100" cy="50" r="17" stroke="currentColor" stroke-width="1.4"/><path d="M150 34 A16 16 0 1 1 150 66 A12 16 0 1 0 150 34 Z" stroke="currentColor" stroke-width="1.3"/><circle cx="100" cy="92" r="9" stroke="currentColor" stroke-width="1.3"/><path d="M100 101 C84 104 78 118 80 132 C70 140 70 160 84 168 L116 168 C130 160 130 140 120 132 C122 118 116 104 100 101 Z" stroke="currentColor" stroke-width="1.4"/><path d="M84 124 C92 130 108 130 116 124" stroke="currentColor" stroke-width="0.9" opacity="0.7"/><line x1="60" y1="176" x2="140" y2="176" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>',
      "Interpretive illustration",
      "The waxing, full and waning moon, the &ldquo;triple form&rdquo; linked with some goddesses, above a schematic seated figurine. An interpretive drawing, not a copy of any particular figurine; what prehistoric figurines meant is unknown."
    ),

    /* Ch49 — Sacred Kingship: a crown above the anointing horn */
    "ch49": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M58 88 L66 50 L83 72 L100 40 L117 72 L134 50 L142 88 Z" stroke="currentColor" stroke-width="1.6"/><line x1="58" y1="96" x2="142" y2="96" stroke="currentColor" stroke-width="1.6"/><g fill="currentColor"><circle cx="66" cy="48" r="3"/><circle cx="100" cy="37" r="3.4"/><circle cx="134" cy="48" r="3"/><circle cx="100" cy="80" r="3"/></g><path d="M70 150 C80 118 112 110 136 118 L132 128 C114 124 92 132 84 154 Z" stroke="currentColor" stroke-width="1.4"/><g fill="currentColor" opacity="0.8"><circle cx="76" cy="162" r="2"/><circle cx="73" cy="172" r="1.8"/><circle cx="75" cy="182" r="1.5"/></g></svg>',
      "Interpretive illustration",
      "A crown above a horn of anointing oil: the two great signs of sacred kingship, the ruler crowned and the ruler anointed. An interpretive composite, not any particular regalia."
    ),

    /* Ch50 — The End of Days: the line and the wheel */
    "ch50": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><line x1="18" y1="66" x2="150" y2="66" stroke="currentColor" stroke-width="1.5"/><g fill="currentColor"><circle cx="28" cy="66" r="2.2"/><circle cx="46" cy="66" r="2.2"/><circle cx="64" cy="66" r="2.2"/><circle cx="82" cy="66" r="2.2"/><circle cx="100" cy="66" r="2.2"/><circle cx="118" cy="66" r="2.2"/><circle cx="136" cy="66" r="2.2"/></g><g stroke="currentColor" stroke-width="1.2"><line x1="176.0" y1="66.0" x2="186.0" y2="66.0"/><line x1="174.7" y1="71.0" x2="183.3" y2="76.0"/><line x1="171.0" y1="74.7" x2="176.0" y2="83.3"/><line x1="166.0" y1="76.0" x2="166.0" y2="86.0"/><line x1="161.0" y1="74.7" x2="156.0" y2="83.3"/><line x1="157.3" y1="71.0" x2="148.7" y2="76.0"/><line x1="156.0" y1="66.0" x2="146.0" y2="66.0"/><line x1="157.3" y1="61.0" x2="148.7" y2="56.0"/><line x1="161.0" y1="57.3" x2="156.0" y2="48.7"/><line x1="166.0" y1="56.0" x2="166.0" y2="46.0"/><line x1="171.0" y1="57.3" x2="176.0" y2="48.7"/><line x1="174.7" y1="61.0" x2="183.3" y2="56.0"/></g><circle cx="166" cy="66" r="6" stroke="currentColor" stroke-width="1.3"/><circle cx="100" cy="140" r="38" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="140" r="8" stroke="currentColor" stroke-width="1.2"/><g stroke="currentColor" stroke-width="1.1"><line x1="108.0" y1="140.0" x2="138.0" y2="140.0"/><line x1="105.7" y1="145.7" x2="126.9" y2="166.9"/><line x1="100.0" y1="148.0" x2="100.0" y2="178.0"/><line x1="94.3" y1="145.7" x2="73.1" y2="166.9"/><line x1="92.0" y1="140.0" x2="62.0" y2="140.0"/><line x1="94.3" y1="134.3" x2="73.1" y2="113.1"/><line x1="100.0" y1="132.0" x2="100.0" y2="102.0"/><line x1="105.7" y1="134.3" x2="126.9" y2="113.1"/></g><path d="M146 118 A50 50 0 0 1 146 162" stroke="currentColor" stroke-width="0.9" opacity="0.6"/><path d="M146 162 l-6 -2 l4 -5" stroke="currentColor" stroke-width="0.9" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "Above, history as a line with seven stations, running to a final burst of light; below, time as a wheel that turns without end. The two visions of the end compared in the chapter, drawn as an original diagram."
    ),

    /* Ch51 — Sacrifice & the Scapegoat: the horned altar, the rising smoke and the scarlet thread */
    "ch51": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M62 120 H138 V176 H62 Z" stroke="currentColor" stroke-width="1.6"/><path d="M62 120 L58 108 L68 114 M138 120 L142 108 L132 114" stroke="currentColor" stroke-width="1.4"/><line x1="62" y1="134" x2="138" y2="134" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><line x1="62" y1="162" x2="138" y2="162" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><path d="M92 118 C86 104 98 96 92 84 M104 118 C112 100 96 92 106 76 C112 66 104 56 108 44 M116 118 C120 106 112 98 118 88" stroke="currentColor" stroke-width="1.2" opacity="0.8"/><path d="M150 60 C152 80 146 96 150 116 C154 132 148 146 150 160" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 3"/></svg>',
      "Interpretive illustration",
      "A horned altar with smoke rising, and a scarlet thread: the gift that goes up to the gods, and the Day of Atonement rite of Leviticus 16. An original rendering, not a specific altar."
    ),

    /* Ch52 — Jainism: the open hand with the wheel, the three dots and the crescent */
    "ch52": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M72 22 H128 L112 70 L150 120 L132 182 H68 L50 120 L88 70 Z" stroke="currentColor" stroke-width="1" opacity="0.5"/><path d="M80 176 V132 C80 126 88 126 88 132 V102 C88 96 96 96 96 102 V96 C96 90 104 90 104 96 V102 C104 96 112 96 112 102 V132 C112 126 120 126 120 132 V150 C120 166 112 176 100 176 Z" stroke="currentColor" stroke-width="1.4"/><circle cx="100" cy="146" r="11" stroke="currentColor" stroke-width="1.1"/><g stroke="currentColor" stroke-width="0.8"><line x1="102.0" y1="146.0" x2="111.0" y2="146.0"/><line x1="101.4" y1="147.4" x2="107.8" y2="153.8"/><line x1="100.0" y1="148.0" x2="100.0" y2="157.0"/><line x1="98.6" y1="147.4" x2="92.2" y2="153.8"/><line x1="98.0" y1="146.0" x2="89.0" y2="146.0"/><line x1="98.6" y1="144.6" x2="92.2" y2="138.2"/><line x1="100.0" y1="144.0" x2="100.0" y2="135.0"/><line x1="101.4" y1="144.6" x2="107.8" y2="138.2"/></g><g fill="currentColor"><circle cx="88" cy="74" r="2.8"/><circle cx="100" cy="74" r="2.8"/><circle cx="112" cy="74" r="2.8"/></g><path d="M88 52 A12 12 0 0 0 112 52" stroke="currentColor" stroke-width="1.4"/><circle cx="100" cy="40" r="2.8" fill="currentColor"/></svg>',
      "Interpretive illustration",
      "Elements of the Jain emblem: the outline of the universe (<em>loka</em>), the raised open hand inscribed with <em>ahiṃsā</em>, with the wheel, the three dots of the Three Jewels, and the crescent and dot of the liberated souls. The emblem also carries a swastika, discussed in the chapter, which is not drawn here. An original rendering."
    ),

    /* Ch53 — Tibetan & Vajrayana Buddhism: the vajra and the bell */
    "ch53": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="62" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M94 62 C80 50 60 50 44 62 C60 74 80 74 94 62 Z M106 62 C120 50 140 50 156 62 C140 74 120 74 106 62 Z" stroke="currentColor" stroke-width="1.4"/><path d="M94 62 C78 44 58 42 44 62 M94 62 C78 80 58 82 44 62 M106 62 C122 44 142 42 156 62 M106 62 C122 80 142 82 156 62" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><line x1="36" y1="62" x2="44" y2="62" stroke="currentColor" stroke-width="1.4"/><line x1="156" y1="62" x2="164" y2="62" stroke="currentColor" stroke-width="1.4"/><line x1="100" y1="96" x2="100" y2="112" stroke="currentColor" stroke-width="1.6"/><circle cx="100" cy="94" r="3.4" stroke="currentColor" stroke-width="1.2"/><path d="M100 112 C84 112 78 124 76 150 C74 162 68 166 64 170 H136 C132 166 126 162 124 150 C122 124 116 112 100 112 Z" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="178" r="3" fill="currentColor"/></svg>',
      "Interpretive illustration",
      "The vajra (&ldquo;thunderbolt&rdquo; or &ldquo;diamond&rdquo;), for method and compassion, above the bell, for wisdom: the paired ritual implements of Vajrayana practice. An original rendering, not a copy of particular objects."
    ),

    /* Ch54 — Zen & Pure Land Buddhism: the ensō above a lotus */
    "ch54": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M146 66 C150 36 118 16 90 22 C58 30 42 62 52 92 C62 120 96 132 124 118 C140 110 148 94 148 82" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.9"/><path d="M100 170 C88 160 84 146 100 132 C116 146 112 160 100 170 Z" stroke="currentColor" stroke-width="1.4"/><path d="M100 170 C80 168 66 156 70 142 C84 144 94 154 100 170 Z M100 170 C120 168 134 156 130 142 C116 144 106 154 100 170 Z" stroke="currentColor" stroke-width="1.3"/><path d="M100 172 C76 176 56 168 48 156 C66 152 86 160 100 172 Z M100 172 C124 176 144 168 152 156 C134 152 114 160 100 172 Z" stroke="currentColor" stroke-width="1.1" opacity="0.75"/></svg>',
      "Interpretive illustration",
      "The <em>ensō</em>, the circle drawn in one brushstroke, for Zen; below it the lotus, the flower of the Pure Land. An original rendering, not a copy of any calligrapher&rsquo;s work."
    ),

    /* Ch55 — Manichaeism: the sun and moon as vessels of light */
    "ch55": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="64" cy="62" r="22" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="1"><line x1="91.0" y1="62.0" x2="98.0" y2="62.0"/><line x1="83.1" y1="81.1" x2="88.0" y2="86.0"/><line x1="64.0" y1="89.0" x2="64.0" y2="96.0"/><line x1="44.9" y1="81.1" x2="40.0" y2="86.0"/><line x1="37.0" y1="62.0" x2="30.0" y2="62.0"/><line x1="44.9" y1="42.9" x2="40.0" y2="38.0"/><line x1="64.0" y1="35.0" x2="64.0" y2="28.0"/><line x1="83.1" y1="42.9" x2="88.0" y2="38.0"/></g><path d="M120 48 A26 26 0 1 0 162 78 A20 20 0 1 1 120 48 Z" stroke="currentColor" stroke-width="1.5"/><g fill="currentColor"><circle cx="100" cy="170" r="2.4"/><circle cx="96" cy="150" r="2"/><circle cx="104" cy="132" r="2.2"/><circle cx="98" cy="114" r="1.8"/><circle cx="106" cy="98" r="2"/><circle cx="112" cy="84" r="1.6"/><circle cx="92" cy="96" r="1.5"/><circle cx="88" cy="122" r="1.7"/><circle cx="110" cy="150" r="1.6"/><circle cx="82" cy="80" r="1.5"/><circle cx="76" cy="94" r="1.4"/></g><line x1="40" y1="182" x2="160" y2="182" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>',
      "Interpretive illustration",
      "Particles of light rising from the world to the moon and the sun, which Manichaean teaching pictured as vessels carrying freed light back to its source. An original diagram, not a copy of a Manichaean painting."
    ),

    /* Ch56 — Mandaeans, Yazidis & Druze: the five-pointed star, the darfash and the peacock feather */
    "ch56": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M44.0 84.0 L50.2 101.5 L68.7 102.0 L54.0 113.2 L59.3 131.0 L44.0 120.5 L28.7 131.0 L34.0 113.2 L19.3 102.0 L37.8 101.5 Z" stroke="currentColor" stroke-width="1.4"/><line x1="100" y1="40" x2="100" y2="176" stroke="currentColor" stroke-width="1.7"/><line x1="82" y1="58" x2="118" y2="58" stroke="currentColor" stroke-width="1.7"/><path d="M82 58 C84 76 80 96 84 112 L116 112 C120 96 116 76 118 58" stroke="currentColor" stroke-width="1.1" opacity="0.8"/><path d="M96 40 C90 32 92 24 100 20 C108 24 110 32 104 40" stroke="currentColor" stroke-width="1" opacity="0.8"/><path d="M156 176 C150 140 152 108 158 80" stroke="currentColor" stroke-width="1.2"/><path d="M158 80 C140 70 138 48 158 38 C176 48 176 70 158 80 Z" stroke="currentColor" stroke-width="1.3"/><path d="M158 70 C150 64 150 54 158 50 C166 54 166 64 158 70 Z" stroke="currentColor" stroke-width="1"/><circle cx="158" cy="60" r="3" fill="currentColor"/><line x1="20" y1="182" x2="180" y2="182" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>',
      "Interpretive illustration",
      "Three emblems side by side: the five-pointed star of the Druze, whose five colours stand for five cosmic principles; the Mandaean <em>darfash</em>, a wooden cross-shaped standard draped in white silk and hung with myrtle (not a Christian cross); and a peacock feather for Tawûsî Melek, the Peacock Angel of the Yazidis. An original rendering, not a copy of any community&rsquo;s objects."
    ),

    /* Ch57 — Hittite & Anatolian: the winged sun-disk above two converging processions */
    "ch57": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="60" r="14" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="60" r="6" stroke="currentColor" stroke-width="1"/><g stroke="currentColor" stroke-width="1.2"><path d="M86 58 C66 50 42 50 24 56"/><path d="M114 58 C134 50 158 50 176 56"/><path d="M84 62 C62 54 38 55 30 62"/><path d="M116 62 C138 54 162 55 170 62"/><path d="M82 66 C58 58 34 60 36 68"/><path d="M118 66 C142 58 166 60 164 68"/><path d="M80 70 C54 62 30 65 42 74"/><path d="M120 70 C146 62 170 65 158 74"/></g><path d="M92 76 L88 92 M108 76 L112 92" stroke="currentColor" stroke-width="1"/><g stroke="currentColor" stroke-width="1.2"><path d="M30 170 V140 M24 148 L30 136 L36 148"/><path d="M170 170 V140 M164 148 L170 136 L176 148"/><path d="M46 170 V142 M40 150 L46 138 L52 150"/><path d="M154 170 V142 M148 150 L154 138 L160 150"/><path d="M62 170 V144 M56 152 L62 140 L68 152"/><path d="M138 170 V144 M132 152 L138 140 L144 152"/><path d="M78 170 V146 M72 154 L78 142 L84 154"/><path d="M122 170 V146 M116 154 L122 142 L128 154"/></g><line x1="18" y1="172" x2="182" y2="172" stroke="currentColor" stroke-width="0.9" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "The winged sun-disk, emblem of Hittite kingship, above two schematic processions converging from left and right as the gods and goddesses do in the rock sanctuary of Yazılıkaya. An original diagram, not a copy of the reliefs."
    ),

    /* Ch58 — Canaanite & Phoenician: the standing stone and the sign of Tanit */
    "ch58": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M44 176 V70 C44 56 72 56 72 70 V176" stroke="currentColor" stroke-width="1.6"/><circle cx="130" cy="58" r="14" stroke="currentColor" stroke-width="1.6"/><line x1="96" y1="84" x2="164" y2="84" stroke="currentColor" stroke-width="1.6"/><path d="M104 84 C100 80 98 76 100 72 M156 84 C160 80 162 76 160 72" stroke="currentColor" stroke-width="1.3"/><path d="M130 76 L100 176 H160 Z" stroke="currentColor" stroke-width="1.6"/><line x1="24" y1="178" x2="176" y2="178" stroke="currentColor" stroke-width="0.9" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "An aniconic standing stone (<em>massebah</em>) and the &ldquo;sign of Tanit&rdquo;: a triangle, a crossbar and a disc, the emblem of Carthage&rsquo;s great goddess. An original rendering, not a copy of a particular stele."
    ),

    /* Ch59 — Slavic & Baltic Paganism: the oak, the thunder-mark and the eternal fire */
    "ch59": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="152" cy="42" r="18" stroke="currentColor" stroke-width="1.2"/><g stroke="currentColor" stroke-width="1.1"><path d="M152 42 Q161.0 50.0 170.0 42.0"/><path d="M152 42 Q149.6 53.8 161.0 57.6"/><path d="M152 42 Q140.6 45.8 143.0 57.6"/><path d="M152 42 Q143.0 34.0 134.0 42.0"/><path d="M152 42 Q154.4 30.2 143.0 26.4"/><path d="M152 42 Q163.4 38.2 161.0 26.4"/></g><path d="M76 176 C80 150 78 128 74 112 M84 176 C86 150 90 128 96 110" stroke="currentColor" stroke-width="1.6"/><path d="M74 112 C50 116 34 98 42 80 C30 66 44 44 62 50 C66 32 92 30 98 46 C116 40 128 58 118 72 C130 86 118 108 96 110 C90 118 80 118 74 112 Z" stroke="currentColor" stroke-width="1.4"/><path d="M140 176 C130 166 132 152 142 142 C142 152 150 152 148 140 C158 150 160 166 150 176 Z" stroke="currentColor" stroke-width="1.3"/><line x1="24" y1="178" x2="176" y2="178" stroke="currentColor" stroke-width="0.9" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "The sacred oak of the thunder-god, a six-petalled &ldquo;thunder-mark&rdquo; of the kind carved on buildings as protection, and the eternal fire. An original composite; the pre-Christian meaning of such marks is partly reconstructed."
    ),

    /* Ch60 — Eastern Orthodoxy & Byzantium: the dome above the iconostasis */
    "ch60": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><line x1="100" y1="20" x2="100" y2="40" stroke="currentColor" stroke-width="1.4"/><line x1="92" y1="28" x2="108" y2="28" stroke="currentColor" stroke-width="1.4"/><path d="M62 80 A38 38 0 0 1 138 80" stroke="currentColor" stroke-width="1.6"/><line x1="56" y1="80" x2="144" y2="80" stroke="currentColor" stroke-width="1.4"/><g stroke="currentColor" stroke-width="0.9" opacity="0.7"><line x1="72" y1="80" x2="72" y2="70"/><line x1="86" y1="80" x2="86" y2="70"/><line x1="100" y1="80" x2="100" y2="70"/><line x1="114" y1="80" x2="114" y2="70"/><line x1="128" y1="80" x2="128" y2="70"/></g><path d="M40 176 V92 H160 V176" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="1.1"><rect x="48" y="100" width="20" height="28" rx="1"/><rect x="76" y="100" width="20" height="28" rx="1"/><rect x="104" y="100" width="20" height="28" rx="1"/><rect x="132" y="100" width="20" height="28" rx="1"/></g><path d="M88 176 V144 A12 12 0 0 1 112 144 V176" stroke="currentColor" stroke-width="1.4"/><g stroke="currentColor" stroke-width="1"><rect x="52" y="140" width="24" height="32"/><rect x="124" y="140" width="24" height="32"/></g><circle cx="100" cy="114" r="6" stroke="currentColor" stroke-width="0.8" opacity="0.7"/></svg>',
      "Interpretive illustration",
      "A domed church in section, the dome as heaven above, and before the sanctuary the iconostasis, the screen of icons with its central doors. An original diagram, not a particular church."
    ),

    /* Ch61 — Aboriginal Australian Dreaming: waterholes joined by a travelling path */
    "ch61": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="52" cy="52" r="13" stroke="currentColor" stroke-width="1.3"/><circle cx="52" cy="52" r="6" stroke="currentColor" stroke-width="1"/><circle cx="138" cy="70" r="13" stroke="currentColor" stroke-width="1.3"/><circle cx="138" cy="70" r="6" stroke="currentColor" stroke-width="1"/><circle cx="80" cy="128" r="13" stroke="currentColor" stroke-width="1.3"/><circle cx="80" cy="128" r="6" stroke="currentColor" stroke-width="1"/><circle cx="150" cy="150" r="13" stroke="currentColor" stroke-width="1.3"/><circle cx="150" cy="150" r="6" stroke="currentColor" stroke-width="1"/><path d="M65 54 C92 58 110 62 125 68 M132 82 C120 100 104 112 92 122 M93 130 C112 138 124 144 137 148" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.5 4" stroke-linecap="round"/><path d="M40 40 C30 30 22 26 14 26 M160 162 C168 172 176 176 186 178" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.5 4" stroke-linecap="round" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "Waterholes joined by a travelling path, in the public convention of desert painting (concentric circles for waterholes, lines for paths): a simple schematic of a songline as a route across Country. It copies no artwork and uses no restricted design."
    ),

    /* Ch62 — Native North American: the great mound and the timber circle at Cahokia */
    "ch62": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M22 150 L62 110 H118 L126 118 H140 L178 150 Z" stroke="currentColor" stroke-width="1.6"/><line x1="62" y1="110" x2="118" y2="110" stroke="currentColor" stroke-width="1.6"/><rect x="80" y="96" width="22" height="14" stroke="currentColor" stroke-width="1.2"/><path d="M78 96 L91 86 L104 96" stroke="currentColor" stroke-width="1.2"/><ellipse cx="100" cy="176" rx="70" ry="10" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><g stroke="currentColor" stroke-width="1.2"><line x1="30.0" y1="176.0" x2="30.0" y2="162.0"/><line x1="32.4" y1="173.4" x2="32.4" y2="159.4"/><line x1="39.4" y1="171.0" x2="39.4" y2="157.0"/><line x1="50.5" y1="168.9" x2="50.5" y2="154.9"/><line x1="65.0" y1="167.3" x2="65.0" y2="153.3"/><line x1="81.9" y1="166.3" x2="81.9" y2="152.3"/><line x1="100.0" y1="166.0" x2="100.0" y2="152.0"/><line x1="118.1" y1="166.3" x2="118.1" y2="152.3"/><line x1="135.0" y1="167.3" x2="135.0" y2="153.3"/><line x1="149.5" y1="168.9" x2="149.5" y2="154.9"/><line x1="160.6" y1="171.0" x2="160.6" y2="157.0"/><line x1="167.6" y1="173.4" x2="167.6" y2="159.4"/><line x1="170.0" y1="176.0" x2="170.0" y2="162.0"/></g><circle cx="150" cy="44" r="12" stroke="currentColor" stroke-width="1.2"/></svg>',
      "Interpretive illustration",
      "A flat-topped earthen mound crowned by a building, after Monks Mound at Cahokia, with a circle of timber posts like the site&rsquo;s &ldquo;Woodhenge&rdquo; and the sun above. A schematic drawing of archaeological monuments, not a sacred design."
    ),

    /* Ch63 — Oceania: moai on their platform, backs to the sea, under the stars */
    "ch63": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><g fill="currentColor" opacity="0.8"><circle cx="30" cy="30" r="1.6"/><circle cx="60" cy="22" r="1.6"/><circle cx="96" cy="34" r="1.6"/><circle cx="132" cy="20" r="1.6"/><circle cx="168" cy="32" r="1.6"/><circle cx="48" cy="54" r="1.6"/><circle cx="150" cy="58" r="1.6"/></g><path d="M30 30 L60 22 L96 34 L132 20 L168 32" stroke="currentColor" stroke-width="0.6" opacity="0.4"/><path d="M42 150 V104 C40 94 40 86 46 80 H58 C64 86 64 94 62 104 V150" stroke="currentColor" stroke-width="1.5"/><path d="M42 76 H62 V70 H42 Z" stroke="currentColor" stroke-width="1.1"/><line x1="48" y1="100" x2="56" y2="100" stroke="currentColor" stroke-width="1"/><path d="M90 150 V104 C88 94 88 86 94 80 H106 C112 86 112 94 110 104 V150" stroke="currentColor" stroke-width="1.5"/><path d="M90 76 H110 V70 H90 Z" stroke="currentColor" stroke-width="1.1"/><line x1="96" y1="100" x2="104" y2="100" stroke="currentColor" stroke-width="1"/><path d="M138 150 V104 C136 94 136 86 142 80 H154 C160 86 160 94 158 104 V150" stroke="currentColor" stroke-width="1.5"/><path d="M138 76 H158 V70 H138 Z" stroke="currentColor" stroke-width="1.1"/><line x1="144" y1="100" x2="152" y2="100" stroke="currentColor" stroke-width="1"/><path d="M28 150 H172 V162 H28 Z" stroke="currentColor" stroke-width="1.4"/><path d="M14 176 C34 170 54 182 74 176 C94 170 114 182 134 176 C154 170 174 182 190 176" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>',
      "Interpretive illustration",
      "Moai standing on their <em>ahu</em>, facing inland with their backs to the sea, beneath a path of stars such as Pacific navigators steered by. A schematic drawing, not a copy of particular statues."
    ),

    /* Ch64 — Pentecostalism & Global Christianity: tongues of fire above raised open hands */
    "ch64": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M64 70 C52 58 58 40 64 30 C70 40 76 58 64 70 Z" stroke="currentColor" stroke-width="1.4"/><path d="M100 62 C88 50 94 32 100 22 C106 32 112 50 100 62 Z" stroke="currentColor" stroke-width="1.4"/><path d="M136 70 C124 58 130 40 136 30 C142 40 148 58 136 70 Z" stroke="currentColor" stroke-width="1.4"/><path d="M86 186 L82 140 C88 128 90 112 84 104 C80 100 76 104 76 110 V96 C76 90 70 90 70 96 V92 C70 86 64 86 64 92 V98 C64 92 58 92 58 98 V106 C58 100 52 100 52 106 V130 C52 142 58 150 60 156 L58 186" stroke="currentColor" stroke-width="1.3"/><path d="M114 186 L118 140 C112 128 110 112 116 104 C120 100 124 104 124 110 V96 C124 90 130 90 130 96 V92 C130 86 136 86 136 92 V98 C136 92 142 92 142 98 V106 C142 100 148 100 148 106 V130 C148 142 142 150 140 156 L142 186" stroke="currentColor" stroke-width="1.3"/></svg>',
      "Interpretive illustration",
      "Tongues of fire, from the Pentecost story of Acts 2, above two raised open hands, the posture of Pentecostal and charismatic worship. The movement uses few images; this is an original, interpretive drawing."
    ),

    /* Ch65 — Bahá'í & New Faiths: the nine-pointed star */
    "ch65": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M100.0 30.0 L115.0 58.7 L145.0 46.4 L138.1 78.0 L168.9 87.8 L143.3 107.6 L160.6 135.0 L128.3 133.7 L123.9 165.8 L100.0 144.0 L76.1 165.8 L71.7 133.7 L39.4 135.0 L56.7 107.6 L31.1 87.8 L61.9 78.0 L55.0 46.4 L85.0 58.7 Z" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="100" r="34" stroke="currentColor" stroke-width="1" opacity="0.7"/><circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="0.7" opacity="0.35"/><g fill="currentColor"><circle cx="100.0" cy="78.0" r="1.8"/><circle cx="114.1" cy="83.1" r="1.8"/><circle cx="121.7" cy="96.2" r="1.8"/><circle cx="119.1" cy="111.0" r="1.8"/><circle cx="107.5" cy="120.7" r="1.8"/><circle cx="92.5" cy="120.7" r="1.8"/><circle cx="80.9" cy="111.0" r="1.8"/><circle cx="78.3" cy="96.2" r="1.8"/><circle cx="85.9" cy="83.1" r="1.8"/></g></svg>',
      "Interpretive illustration",
      "The nine-pointed star, used by Bahá&rsquo;ís as a symbol of completeness and unity, nine being the highest single digit. An original rendering."
    ),

    /* Ch67 — Minoan Crete: the double axe between horns of consecration */
    "ch67": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><path d="M38 150 L162 150 L162 158 L38 158 Z" stroke="currentColor" stroke-width="1.2"/><path d="M44 150 C40 118 44 92 56 72 C58 96 60 118 70 136 L130 136 C140 118 142 96 144 72 C156 92 160 118 156 150" stroke="currentColor" stroke-width="1.4"/><line x1="100" y1="150" x2="100" y2="40" stroke="currentColor" stroke-width="2"/><path d="M100 58 C88 50 78 44 66 46 C70 58 70 70 66 82 C78 84 88 78 100 70 C112 78 122 84 134 82 C130 70 130 58 134 46 C122 44 112 50 100 58 Z" stroke="currentColor" stroke-width="1.3"/><path d="M100 96 C92 91 85 87 77 88 C80 96 80 104 77 112 C85 113 92 109 100 104 C108 109 115 113 123 112 C120 104 120 96 123 88 C115 87 108 91 100 96 Z" stroke="currentColor" stroke-width="1" opacity="0.8"/><path d="M20 176 C40 170 60 182 80 176 C100 170 120 182 140 176 C160 170 176 180 186 176" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>',
      "Interpretive illustration",
      "A double axe (labrys) on its shaft, set between a pair of horns of consecration, as on Minoan altars and seals. Both are recurring sacred signs whose exact meaning is inferred, not recorded. An original, interpretive drawing, not a copy of any object."
    ),

    /* Ch68 — Nubia & Kush: the Pure Mountain and the pyramids of Napata */
    "ch68": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><circle cx="150" cy="52" r="11" stroke="currentColor" stroke-width="1" opacity="0.7"/><path d="M22 132 L34 92 L96 88 L108 96 L110 132" stroke="currentColor" stroke-width="1.4"/><path d="M110 132 L112 104 C113 92 116 80 114 68 C118 64 124 66 124 72 C122 82 120 96 121 112 L122 132" stroke="currentColor" stroke-width="1.4"/><path d="M114 68 C112 62 116 58 120 60" stroke="currentColor" stroke-width="1"/><path d="M132 132 L144 100 L156 132 Z M150 132 L160 108 L170 132 Z M60 150 L70 124 L80 150 Z" stroke="currentColor" stroke-width="1.1"/><path d="M18 132 L184 132" stroke="currentColor" stroke-width="1"/><path d="M20 164 C44 158 66 170 90 164 C114 158 136 170 160 164 C170 161 178 162 184 164 M28 176 C52 170 74 182 98 176 C122 170 144 182 172 176" stroke="currentColor" stroke-width="0.8" opacity="0.55"/></svg>',
      "Interpretive illustration",
      "The flat-topped mountain of Jebel Barkal with its free-standing pinnacle, read in antiquity as a rearing royal cobra, above the Nile, with the steep pyramids of the Kushite kings. An original, interpretive drawing, not a survey of the site."
    ),

    /* Ch69 — The Upanishads: the syllable Om and the four states */
    "ch69": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><circle cx="100" cy="100" r="70" stroke="currentColor" stroke-width="0.6" opacity="0.25" stroke-dasharray="2 4"/><circle cx="100" cy="100" r="48" stroke="currentColor" stroke-width="0.6" opacity="0.4"/><circle cx="100" cy="100" r="26" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><circle cx="100" cy="100" r="3" fill="currentColor"/><path d="M100 8 L100 30 M100 170 L100 192 M8 100 L30 100 M170 100 L192 100" stroke="currentColor" stroke-width="0.8" opacity="0.5"/><text x="100" y="37" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8" font-family="serif">A · waking</text><text x="100" y="60" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.75" font-family="serif">U · dream</text><text x="100" y="82" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7" font-family="serif">M · deep sleep</text><text x="100" y="118" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.8" font-family="serif">the fourth</text></svg>',
      "Interpretive illustration",
      "The analysis of the syllable Om in the Mandukya Upanishad: A, U and M as waking, dream and dreamless sleep, and the silence after them as turiya, the fourth, the self beyond the three. A diagram of the text's own scheme, drawn for this archive."
    ),

    /* Ch70 — Pre-Islamic Arabia: an eye-betyl under the crescent and disc */
    "ch70": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><path d="M84 34 A18 18 0 1 0 116 34 A14 14 0 1 1 84 34 Z" stroke="currentColor" stroke-width="1.2"/><circle cx="100" cy="38" r="7" stroke="currentColor" stroke-width="1"/><rect x="70" y="66" width="60" height="86" rx="3" stroke="currentColor" stroke-width="1.5"/><rect x="60" y="152" width="80" height="10" stroke="currentColor" stroke-width="1.2"/><path d="M82 96 L96 96 M104 96 L118 96" stroke="currentColor" stroke-width="2.4"/><path d="M100 102 L100 124" stroke="currentColor" stroke-width="2"/><g fill="currentColor" opacity="0.7"><circle cx="40" cy="60" r="1.2"/><circle cx="156" cy="52" r="1.6"/><circle cx="30" cy="104" r="1"/><circle cx="166" cy="96" r="1.1"/><circle cx="48" cy="140" r="0.9"/><circle cx="150" cy="132" r="1.2"/></g><path d="M20 176 C50 168 80 180 110 172 C140 164 164 176 184 170" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>',
      "Interpretive illustration",
      "A Nabataean-style betyl, an upright stone marked only with stylized eyes and nose as a sign of the god's presence, beneath the crescent and disc of South Arabian altars. A composite, interpretive drawing, not a copy of a particular stone."
    ),

    /* Ch71 — Korea: the taegeuk, the three strokes of Hangul, and the mountain god's tiger */
    "ch71": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><circle cx="100" cy="92" r="40" stroke="currentColor" stroke-width="1.4"/><path d="M60 92 A20 20 0 0 1 100 92 A20 20 0 0 0 140 92" stroke="currentColor" stroke-width="1.4"/><path d="M60 92 A40 40 0 0 0 140 92" fill="currentColor" opacity="0.16"/><g stroke="currentColor" stroke-width="3"><path d="M34 38 L52 56 M30 42 L48 60 M26 46 L44 64"/><path d="M148 56 L156 48 M160 44 L168 36 M152 60 L170 42 M156 64 L164 56 M168 52 L174 46"/><path d="M26 138 L34 146 M38 150 L44 156 M30 134 L48 152 M34 130 L42 138 M46 142 L52 148"/><path d="M148 152 L166 134 M152 156 L160 148 M164 144 L170 138 M156 160 L174 142"/></g><circle cx="78" cy="170" r="3" fill="currentColor"/><path d="M92 170 L112 170 M126 160 L126 180" stroke="currentColor" stroke-width="2.2"/></svg>',
      "Interpretive illustration",
      "The taegeuk, the yin–yang circle at the centre of the South Korean flag, with the four trigrams for heaven, earth, water and fire, above the three basic vowel strokes of Hangul, which its 1446 commentary explains as heaven (a dot), earth (a horizontal line) and humanity (a vertical line). An original, interpretive drawing."
    ),

    /* Ch72 — The Cathars: the book on the head, and the peak of Montségur */
    "ch72": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><path d="M22 160 L60 118 L78 128 L100 70 L122 128 L140 116 L178 160 Z" stroke="currentColor" stroke-width="1.3"/><path d="M92 74 L92 62 L96 62 L96 58 L104 58 L104 62 L108 62 L108 74" stroke="currentColor" stroke-width="1.1"/><rect x="76" y="26" width="48" height="30" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M100 26 L100 56 M82 34 L96 34 M82 40 L96 40 M82 46 L96 46 M104 34 L118 34 M104 40 L118 40 M104 46 L118 46" stroke="currentColor" stroke-width="0.8" opacity="0.7"/><g stroke="currentColor" stroke-width="1" opacity="0.6"><path d="M40 178 C44 170 48 170 52 178 M60 178 C64 168 68 168 72 178 M128 178 C132 168 136 168 140 178 M148 178 C152 170 156 170 160 178"/></g></svg>',
      "Interpretive illustration",
      "An open book, the Gospel of John laid on the head in the consolamentum, above the peak of Montségur, where some two hundred good men and women were burned in 1244. An original, interpretive drawing; the Cathars left no emblem of their own."
    ),

    /* Ch73 — Sabbateans and Hasidim: the shattered vessels and the rising sparks */
    "ch73": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><path d="M74 128 C70 110 74 96 84 88 L116 88 C126 96 130 110 126 128 Z" stroke="currentColor" stroke-width="1.2" opacity="0.35" stroke-dasharray="3 3"/><path d="M52 150 L66 138 L72 152 Z M132 146 L146 136 L150 154 Z M88 164 L104 158 L100 172 Z M60 116 L70 104 L78 118 Z M124 112 L136 102 L140 118 Z" stroke="currentColor" stroke-width="1.1"/><g fill="currentColor"><circle cx="100" cy="30" r="3"/><circle cx="86" cy="46" r="2"/><circle cx="114" cy="44" r="2.2"/><circle cx="96" cy="62" r="1.6"/><circle cx="108" cy="70" r="1.4"/><circle cx="78" cy="66" r="1.3"/><circle cx="124" cy="62" r="1.3"/></g><path d="M100 36 L100 80 M86 50 L92 78 M114 48 L108 78" stroke="currentColor" stroke-width="0.6" opacity="0.45" stroke-dasharray="1 3"/></svg>',
      "Interpretive illustration",
      "The image at the heart of Lurianic Kabbalah and the movements that grew from it: the vessels that could not hold the divine light shattered, and sparks of holiness, scattered among the fragments, rise again through repair (tikkun). An original, interpretive drawing."
    ),

    /* Ch74 — Secularism: the temple to Philosophy and the Happy Human */
    "ch74": fig(
      '<svg class="plate-art" viewBox="0 0 200 200" fill="none" aria-hidden="true"><circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="0.7" opacity="0.3"/><path d="M30 160 C50 120 70 104 100 98 C130 104 150 120 170 160 Z" stroke="currentColor" stroke-width="1.1" opacity="0.6"/><path d="M72 98 L100 80 L128 98 Z" stroke="currentColor" stroke-width="1.3"/><path d="M76 98 L76 120 M88 98 L88 120 M100 98 L100 120 M112 98 L112 120 M124 98 L124 120 M72 120 L128 120" stroke="currentColor" stroke-width="1.1"/><circle cx="100" cy="34" r="7" stroke="currentColor" stroke-width="1.3"/><path d="M100 41 L100 66 M100 66 L88 78 M100 66 L112 78 M100 48 C92 44 86 36 82 28 M100 48 C108 44 114 36 118 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      "Interpretive illustration",
      "A small classical temple on an artificial mountain, after the Temple of Philosophy built in Notre-Dame for the Festival of Reason in 1793, beneath a figure with raised arms in the manner of the Happy Human, the humanist emblem designed in 1965. An original, interpretive drawing."
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
