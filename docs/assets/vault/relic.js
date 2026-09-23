/* ==========================================================================
   THE DIVINE ARCHIVES — Vault "relic" renderers
   Presents an object's own words in a form that echoes the object:
     tablet — a carved emerald slab (Emerald Tablet). Reads the Latin/English
              pairs from the entry's own blockquote, so the text has ONE source.
     scroll — a parchment scroll you unroll and pan through, right to left as a
              Hebrew scroll reads (Dead Sea Scrolls). Columns come from
              window.VAULT item.artifact.columns.
     linen  — the Shroud as a to-scale schematic with a timeline of its scars.
     lance  — the Vienna spearhead, its turning inscribed band, John 19:34 on
              papyrus, and flip-cards for the four rival lances.
     crown  — a ring of rushes circled by John 19:2, gold bindings as stations.
     ark    — Exodus 25 as a to-scale blueprint with a cubit switch.
   Only primary text goes on the object; commentary stays in the entry.
   Mounts on <section data-vault-relic="vNN">. The static text inside the
   mount is the no-JS / print fallback and is hidden once the relic is live.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  // ---------------------------------------------------------------- tablet
  function tablet(root) {
    var src = root.querySelector("blockquote");
    if (!src) return;
    var pairs = [];
    Array.prototype.forEach.call(src.querySelectorAll("p"), function (p) {
      var la = p.querySelector("strong");
      if (!la) return;
      var en = p.innerHTML.split(/<br\s*\/?>/i).slice(1).join(" ");
      var tmp = el("div"); tmp.innerHTML = en;
      pairs.push({ la: la.textContent.trim(), en: tmp.textContent.trim() });
    });
    if (!pairs.length) return;

    var mode = "la";
    var face = el("div", { class: "tablet-face" });
    var lines = pairs.map(function (p, i) {
      var en = el("span", { class: "t-en", text: p.en });
      var b = el("button", { type: "button", class: "t-line", "aria-expanded": "false" }, [el("span", { class: "t-la", text: p.la }), en]);
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", String(open));
      });
      face.appendChild(b);
      return b;
    });
    var slab = el("div", { class: "tablet", role: "group", "aria-label": "The Emerald Tablet, carved in Latin. Select a line to reveal its translation." }, [
      el("div", { class: "tablet-shine", "aria-hidden": "true" }), face
    ]);
    var stage = el("div", { class: "tablet-stage" }, [slab]);

    function setMode(m) {
      mode = m; slab.setAttribute("data-mode", m);
      lines.forEach(function (b) { b.setAttribute("aria-expanded", m === "both" ? "true" : "false"); });
      Array.prototype.forEach.call(ctrls.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-m") === m)); });
    }
    var ctrls = el("div", { class: "relic-ctrls", role: "toolbar", "aria-label": "Tablet language" }, [
      el("button", { type: "button", "data-m": "la", text: "Latin" }),
      el("button", { type: "button", "data-m": "both", text: "Latin + English" }),
      el("button", { type: "button", "data-m": "en", text: "English" })
    ]);
    ctrls.addEventListener("click", function (e) { var m = e.target.getAttribute && e.target.getAttribute("data-m"); if (m) setMode(m); });
    var hint = el("p", { class: "relic-hint", text: "Touch or click any carved line to raise its meaning from the stone." });

    root.appendChild(el("div", { class: "relic-live" }, [ctrls, stage, hint]));
    root.classList.add("is-live");
    setMode("la");

    // light and tilt follow the reader's hand
    if (!reduce) {
      stage.addEventListener("pointermove", function (e) {
        var r = slab.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        slab.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        slab.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        slab.style.transform = "rotateY(" + ((x - 0.5) * 9).toFixed(2) + "deg) rotateX(" + ((0.5 - y) * 7).toFixed(2) + "deg)";
      });
      stage.addEventListener("pointerleave", function () { slab.style.transform = ""; });
    }
  }

  // ---------------------------------------------------------------- scroll
  function scroll(root, item) {
    var cols = item && item.artifact && item.artifact.columns;
    if (!cols || !cols.length) return;

    var gloss = el("p", { class: "scroll-gloss", role: "status", "aria-live": "polite", text: "" });
    function word(w) {
      // w: [hebrew, gloss] or plain string
      if (typeof w === "string") return document.createTextNode(w + " ");
      var b = el("button", { type: "button", class: "s-word" + (w[2] ? " " + w[2] : ""), "data-gloss": w[1], lang: "he" , text: w[0] });
      b.addEventListener("mouseenter", function () { gloss.textContent = w[0] + " — " + w[1]; });
      b.addEventListener("focus", function () { gloss.textContent = w[0] + " — " + w[1]; });
      b.addEventListener("click", function () { gloss.textContent = w[0] + " — " + w[1]; b.classList.add("is-read"); });
      return el("span", {}, [b, " "]);
    }

    var sheet = el("div", { class: "scroll-sheet", tabindex: "0", "aria-label": "Scroll columns — drag or use the arrow keys to move along the scroll" });
    cols.forEach(function (c, i) {
      var col = el("section", { class: "s-col s-" + c.kind, "aria-label": c.heading });
      col.appendChild(el("h4", { class: "s-head", text: c.heading }));
      (c.lines || []).forEach(function (ln) {
        var p = el("p", { class: "s-line", dir: c.kind === "hebrew" ? "rtl" : "ltr", lang: c.kind === "hebrew" ? "he" : "en" });
        ln.forEach(function (w) { p.appendChild(word(w)); });
        col.appendChild(p);
      });
      if (c.kind === "name") {
        col.appendChild(el("div", { class: "s-names" }, [
          el("div", {}, [el("span", { class: "s-big", lang: "he", text: c.square }), el("span", { class: "s-cap", text: "square script" })]),
          el("div", {}, [el("span", { class: "s-big s-paleo", lang: "phn", text: c.paleo }), el("span", { class: "s-cap", text: "palaeo-Hebrew" })])
        ]));
      }
      if (c.translation) col.appendChild(el("p", { class: "s-tr", text: c.translation }));
      if (c.note) col.appendChild(el("p", { class: "s-note", text: c.note }));
      sheet.appendChild(col);
      if (i < cols.length - 1) sheet.appendChild(el("span", { class: "s-seam", "aria-hidden": "true" }));
    });

    var rollR = el("button", { type: "button", class: "scroll-roll roll-r", "aria-label": "Unroll the scroll", "aria-expanded": "false" });
    var rollL = el("span", { class: "scroll-roll roll-l", "aria-hidden": "true" });
    var body = el("div", { class: "scroll-body" }, [rollR, el("div", { class: "scroll-window" }, [sheet]), rollL]);
    var trBtn = el("button", { type: "button", "aria-pressed": "false", text: "Show translation" });
    var toggle = el("button", { type: "button", text: "Unroll the scroll" });
    var ctrls = el("div", { class: "relic-ctrls" }, [toggle, trBtn]);
    var scrollEl = el("div", { class: "scroll", "data-open": "false", dir: "rtl" }, [body]);

    root.appendChild(el("div", { class: "relic-live" }, [ctrls, scrollEl, gloss,
      el("p", { class: "relic-hint", text: "Hebrew scrolls open from the right. Drag the parchment to travel along it, and touch a word to read its meaning." })]));
    root.classList.add("is-live");

    function setOpen(open) {
      scrollEl.setAttribute("data-open", String(open));
      rollR.setAttribute("aria-expanded", String(open));
      rollR.setAttribute("aria-label", open ? "Roll the scroll up" : "Unroll the scroll");
      toggle.textContent = open ? "Roll it up" : "Unroll the scroll";
      if (open) { sheet.scrollLeft = 0; setTimeout(function () { sheet.focus({ preventScroll: true }); }, reduce ? 0 : 900); }
    }
    toggle.addEventListener("click", function () { setOpen(scrollEl.getAttribute("data-open") !== "true"); });
    rollR.addEventListener("click", function () { setOpen(scrollEl.getAttribute("data-open") !== "true"); });
    trBtn.addEventListener("click", function () {
      var on = trBtn.getAttribute("aria-pressed") !== "true";
      trBtn.setAttribute("aria-pressed", String(on)); scrollEl.classList.toggle("show-tr", on);
      trBtn.textContent = on ? "Hide translation" : "Show translation";
    });

    // drag to pan; the rolled ends turn as you travel
    var drag = null;
    sheet.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest(".s-word")) return;
      drag = { x: e.clientX, s: sheet.scrollLeft }; sheet.setPointerCapture(e.pointerId); sheet.classList.add("is-drag");
    });
    sheet.addEventListener("pointermove", function (e) { if (drag) sheet.scrollLeft = drag.s - (e.clientX - drag.x); });
    function end() { drag = null; sheet.classList.remove("is-drag"); }
    sheet.addEventListener("pointerup", end); sheet.addEventListener("pointercancel", end);
    sheet.addEventListener("scroll", function () {
      var p = Math.abs(sheet.scrollLeft);
      rollR.style.backgroundPositionY = (p * 0.6) + "px";
      rollL.style.backgroundPositionY = (-p * 0.6) + "px";
    });
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { sheet.scrollBy({ left: -160, behavior: reduce ? "auto" : "smooth" }); e.preventDefault(); }
      if (e.key === "ArrowRight") { sheet.scrollBy({ left: 160, behavior: reduce ? "auto" : "smooth" }); e.preventDefault(); }
    });
  }


  // shared: an SVG element helper
  var SVGNS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, kids) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "text") n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  // shared: a line of clickable words that gloss into a status line
  function glossLine(words, lang, dir, status) {
    var p = el("p", { class: "g-line", lang: lang, dir: dir });
    words.forEach(function (w) {
      var b = el("button", { type: "button", class: "g-word", text: w[0] });
      function show() { status.textContent = w[0] + " — " + w[1]; }
      b.addEventListener("mouseenter", show); b.addEventListener("focus", show); b.addEventListener("click", show);
      p.appendChild(b); p.appendChild(document.createTextNode(" "));
    });
    return p;
  }
  function panel() { return el("div", { class: "relic-panel", role: "status", "aria-live": "polite" }); }
  function setPanel(pn, title, sub, body) {
    pn.innerHTML = "";
    pn.appendChild(el("p", { class: "rp-t" }, [el("strong", { text: title }), sub ? el("span", { class: "rp-s", text: " · " + sub }) : null]));
    pn.appendChild(el("p", { class: "rp-d", text: body }));
  }

  // ---------------------------------------------------------------- linen (Shroud)
  function linen(root, item) {
    var A = item.artifact, ev = A.events;
    var W = 1100, H = 275; // 4.4 m x 1.1 m at 250 px/m
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "linen-svg", role: "img", "aria-label": "Schematic of the Shroud of Turin, 4.4 by 1.1 metres" });
    var defs = sv("defs", {}, [
      sv("pattern", { id: "hb", width: "16", height: "16", patternUnits: "userSpaceOnUse" }, [
        sv("path", { d: "M0 0 L8 8 L0 16 M8 0 L16 8 L8 16", stroke: "rgba(120,95,55,.18)", "stroke-width": "1.2", fill: "none" })
      ]),
      sv("radialGradient", { id: "scorch" }, [
        sv("stop", { offset: "0", "stop-color": "#2b1406", "stop-opacity": ".95" }),
        sv("stop", { offset: ".45", "stop-color": "#6b3a14", "stop-opacity": ".75" }),
        sv("stop", { offset: "1", "stop-color": "#a26a2c", "stop-opacity": "0" })
      ]),
      sv("radialGradient", { id: "zone" }, [
        sv("stop", { offset: "0", "stop-color": "#b08850", "stop-opacity": ".32" }),
        sv("stop", { offset: "1", "stop-color": "#b08850", "stop-opacity": "0" })
      ])
    ]);
    svg.appendChild(defs);
    svg.appendChild(sv("rect", { x: 0, y: 0, width: W, height: H, fill: "#e6d8b8" }));
    svg.appendChild(sv("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#hb)" }));
    // side strip along the top edge, with its seam
    svg.appendChild(sv("line", { x1: 0, y1: 22, x2: W, y2: 22, stroke: "rgba(110,80,40,.45)", "stroke-dasharray": "3 4" }));
    // image zones (frontal left, dorsal right, heads meeting at the centre) — not a figure
    var zones = sv("g", { class: "l-zones" }, [
      sv("ellipse", { cx: 330, cy: 145, rx: 250, ry: 70, fill: "url(#zone)" }),
      sv("ellipse", { cx: 770, cy: 145, rx: 250, ry: 70, fill: "url(#zone)" }),
      sv("text", { x: 330, y: 150, class: "l-lab", "text-anchor": "middle", text: "frontal image" }),
      sv("text", { x: 770, y: 150, class: "l-lab", "text-anchor": "middle", text: "dorsal image" }),
      sv("text", { x: 550, y: 150, class: "l-lab l-small", "text-anchor": "middle", text: "heads meet" })
    ]);
    svg.appendChild(zones);
    // 1532 burns: two lines of scorches (folded cloth), schematic positions
    var burns = sv("g", { class: "l-burns" }), patches = sv("g", { class: "l-patches" }), water = sv("g", { class: "l-water" });
    [62, 213].forEach(function (y) {
      for (var i = 0; i < 8; i++) {
        var x = 70 + i * 137;
        burns.appendChild(sv("ellipse", { cx: x, cy: y, rx: 20, ry: 13, fill: "url(#scorch)" }));
        burns.appendChild(sv("path", { d: "M" + (x - 7) + " " + (y + 5) + " L" + x + " " + (y - 6) + " L" + (x + 7) + " " + (y + 5) + " Z", fill: "#1a0c04", opacity: ".85" }));
        patches.appendChild(sv("path", { d: "M" + (x - 17) + " " + (y + 11) + " L" + x + " " + (y - 14) + " L" + (x + 17) + " " + (y + 11) + " Z", fill: "#efe4c8", stroke: "rgba(90,65,30,.6)", "stroke-width": "1.2" }));
      }
    });
    for (var j = 0; j < 7; j++) water.appendChild(sv("path", { d: "M" + (140 + j * 137) + " 100 q 30 38 0 76 q -30 -38 0 -76 Z", fill: "rgba(120,90,50,.10)", stroke: "rgba(120,90,50,.22)" }));
    svg.appendChild(water); svg.appendChild(burns); svg.appendChild(patches);
    // 1988 sample corner (schematic)
    var sample = sv("g", { class: "l-sample" }, [
      sv("rect", { x: 0, y: H - 18, width: 40, height: 18, fill: "#1b120a" }),
      sv("text", { x: 46, y: H - 5, class: "l-lab l-small", text: "1988 sample" })
    ]);
    svg.appendChild(sample);
    svg.appendChild(sv("text", { x: W - 8, y: H - 6, class: "l-lab l-small", "text-anchor": "end", text: "schematic · 4.4 m × 1.1 m" }));

    var pn = panel();
    var slider = el("input", { type: "range", min: "0", max: String(ev.length - 1), value: "0", step: "1", "aria-label": "Year in the cloth's documented history" });
    var yearOut = el("output", { class: "l-year" });
    var ticks = el("div", { class: "l-ticks", "aria-hidden": "true" });
    ev.forEach(function (e, i) {
      var b = el("button", { type: "button", tabindex: "-1", text: String(e.y), style: "left:" + (100 * i / (ev.length - 1)) + "%" });
      b.addEventListener("click", function () { slider.value = String(i); update(); });
      ticks.appendChild(b);
    });
    var negB = el("button", { type: "button", "aria-pressed": "false", text: "Photographic negative (Pia, 1898)" });
    var wrap = el("div", { class: "linen-wrap" }, [svg]);
    function update() {
      var i = +slider.value, e = ev[i], y = e.y;
      yearOut.textContent = y;
      burns.style.opacity = y >= 1532 ? 1 : 0;
      water.style.opacity = y >= 1532 ? 1 : 0;
      patches.style.opacity = (y >= 1534 && y < 2002) ? 1 : 0;
      sample.style.opacity = y >= 1988 ? 1 : 0;
      setPanel(pn, e.t, String(y), e.d);
      Array.prototype.forEach.call(ticks.children, function (t, k) { t.classList.toggle("on", k === i); });
    }
    slider.addEventListener("input", update);
    negB.addEventListener("click", function () {
      var on = negB.getAttribute("aria-pressed") !== "true";
      negB.setAttribute("aria-pressed", String(on)); wrap.classList.toggle("is-neg", on);
    });
    root.appendChild(el("div", { class: "relic-live" }, [
      wrap,
      el("div", { class: "l-time" }, [el("label", { class: "l-slabel" }, ["Year ", yearOut]), slider, ticks]),
      el("div", { class: "relic-ctrls" }, [negB]),
      pn,
      el("p", { class: "relic-hint", text: "Burns, patches and the sample cut appear in the years they happened. Their positions are schematic." })
    ]));
    root.classList.add("is-live");
    update();
  }

  // ---------------------------------------------------------------- lance
  function lance(root, item) {
    var A = item.artifact;
    var svg = sv("svg", { viewBox: "0 0 760 190", class: "lance-svg", role: "img", "aria-label": "Schematic of the Vienna Holy Lance" });
    svg.appendChild(sv("defs", {}, [
      sv("linearGradient", { id: "iron", x1: "0", y1: "0", x2: "0", y2: "1" }, [
        sv("stop", { offset: "0", "stop-color": "#8d8a85" }), sv("stop", { offset: ".5", "stop-color": "#3a3835" }), sv("stop", { offset: "1", "stop-color": "#6d6964" })]),
      sv("linearGradient", { id: "gold", x1: "0", y1: "0", x2: "0", y2: "1" }, [
        sv("stop", { offset: "0", "stop-color": "#f6dc8f" }), sv("stop", { offset: ".45", "stop-color": "#b8862e" }), sv("stop", { offset: "1", "stop-color": "#e9c46a" })]),
      sv("linearGradient", { id: "silv", x1: "0", y1: "0", x2: "0", y2: "1" }, [
        sv("stop", { offset: "0", "stop-color": "#eceae4" }), sv("stop", { offset: ".5", "stop-color": "#8f8c86" }), sv("stop", { offset: "1", "stop-color": "#d7d4cd" })]),
      sv("path", { id: "bandpath", d: "M300 95 L470 95" })
    ]));
    var parts = {};
    // socket + blade (winged leaf), pointing right
    parts.blade = sv("g", { class: "lp", "data-part": "blade", tabindex: "0", role: "button", "aria-label": "The blade" }, [
      sv("path", { d: "M40 88 L150 84 L175 70 L200 86 L560 80 Q690 88 740 95 Q690 102 560 110 L200 104 L175 120 L150 106 L40 102 Z", fill: "url(#iron)", stroke: "#1d1c1a" }),
      sv("path", { d: "M330 91 L600 93 L600 97 L330 99 Z", fill: "#161514" })
    ]);
    parts.nail = sv("g", { class: "lp", "data-part": "nail", tabindex: "0", role: "button", "aria-label": "The nail-pin" }, [
      sv("rect", { x: 340, y: 92.5, width: 250, height: 5, rx: 2, fill: "#5b5752" }),
      sv("circle", { cx: 596, cy: 95, r: 5, fill: "#6d6964" })
    ]);
    parts.silver = sv("g", { class: "lp", "data-part": "silver", tabindex: "0", role: "button", "aria-label": "The silver sleeve" }, [
      sv("rect", { x: 280, y: 74, width: 210, height: 42, rx: 6, fill: "url(#silv)", stroke: "#6d6a64" })
    ]);
    var bandText = sv("text", { class: "band-text", dy: "4" }, [sv("textPath", { href: "#bandpath", startOffset: "0%", text: A.inscription + "  " + A.inscription })]);
    parts.gold = sv("g", { class: "lp", "data-part": "gold", tabindex: "0", role: "button", "aria-label": "The gold sleeve and its inscription" }, [
      sv("rect", { x: 300, y: 80, width: 170, height: 30, rx: 5, fill: "url(#gold)", stroke: "#7a5516" }),
      sv("clipPath", { id: "bandclip" }, [sv("rect", { x: 304, y: 80, width: 162, height: 30 })]),
      sv("g", { "clip-path": "url(#bandclip)" }, [bandText])
    ]);
    ["blade", "nail", "silver", "gold"].forEach(function (k) { svg.appendChild(parts[k]); });
    var pn = panel();
    A.parts.forEach(function (p) {
      var g = parts[p.id]; if (!g) return;
      function show() { setPanel(pn, p.t, "", p.d); Object.keys(parts).forEach(function (k) { parts[k].classList.toggle("on", k === p.id); }); }
      g.addEventListener("click", show); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
    });
    // the band "turns": slide the inscription along its path
    var off = 0, raf = null;
    function spin() { off = (off + 0.18) % 50; bandText.firstChild.setAttribute("startOffset", (-off) + "%"); raf = requestAnimationFrame(spin); }
    if (!reduce) {
      parts.gold.addEventListener("mouseenter", function () { if (!raf) spin(); });
      parts.gold.addEventListener("mouseleave", function () { cancelAnimationFrame(raf); raf = null; });
      parts.gold.addEventListener("focus", function () { if (!raf) spin(); });
      parts.gold.addEventListener("blur", function () { cancelAnimationFrame(raf); raf = null; });
    }
    var gstat = el("p", { class: "g-status", role: "status", "aria-live": "polite" });
    var papyrus = el("div", { class: "papyrus" }, [
      el("p", { class: "pap-head", text: "John 19:34" }),
      glossLine(A.greek, "grc", "ltr", gstat),
      el("p", { class: "pap-tr", text: A.translation })
    ]);
    var cards = el("div", { class: "flip-cards" });
    A.cards.forEach(function (c) {
      var card = el("button", { type: "button", class: "flip", "aria-pressed": "false" }, [
        el("span", { class: "f-front" }, [el("strong", { text: c.t }), el("em", { text: c.s })]),
        el("span", { class: "f-back", text: c.d })
      ]);
      card.addEventListener("click", function () { card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true")); });
      cards.appendChild(card);
    });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "lance-stage" }, [svg]), pn,
      el("p", { class: "relic-hint", text: "Touch the blade, the pin, or either sleeve. Hover the gold band to turn it." }),
      papyrus, gstat,
      el("h4", { class: "relic-subhead", text: "Four lances. Turn each card." }), cards
    ]));
    root.classList.add("is-live");
    setPanel(pn, "The Vienna lance", "schematic", "A spearhead that has been an imperial relic for a thousand years. Choose a part to read what it is and how it has been dated.");
  }

  // ---------------------------------------------------------------- crown
  function crown(root, item) {
    var A = item.artifact, C = 200;
    var svg = sv("svg", { viewBox: "0 0 400 400", class: "crown-svg", role: "img", "aria-label": "A ring of bundled rushes bound with gold thread, circled by the Greek text of John 19:2" });
    svg.appendChild(sv("defs", {}, [
      sv("path", { id: "textring", d: "M200 200 m -172 0 a 172 172 0 1 1 344 0 a 172 172 0 1 1 -344 0" }),
      sv("radialGradient", { id: "halo" }, [sv("stop", { offset: ".55", "stop-color": "rgba(231,198,128,0)" }), sv("stop", { offset: ".75", "stop-color": "rgba(231,198,128,.10)" }), sv("stop", { offset: "1", "stop-color": "rgba(231,198,128,0)" })])
    ]));
    svg.appendChild(sv("circle", { cx: C, cy: C, r: 196, fill: "url(#halo)" }));
    // bundled rushes: many slightly irregular strands around the ring
    var strands = sv("g", { class: "c-strands" });
    for (var i = 0; i < 26; i++) {
      var r = 104 + (i % 13) * 1.9, ph = i * 0.7, pts = [];
      for (var a = 0; a <= 72; a++) {
        var t = a / 72 * Math.PI * 2, rr = r + Math.sin(t * 9 + ph) * 2.2 + Math.sin(t * 23 + ph * 2) * 1.1;
        pts.push((C + rr * Math.cos(t)).toFixed(1) + "," + (C + rr * Math.sin(t)).toFixed(1));
      }
      var shade = 110 + (i * 37) % 70;
      strands.appendChild(sv("polyline", { points: pts.join(" "), fill: "none", stroke: "rgb(" + shade + "," + Math.round(shade * .78) + "," + Math.round(shade * .45) + ")", "stroke-width": "2.2", "stroke-linecap": "round", opacity: ".92" }));
    }
    svg.appendChild(strands);
    var ringText = sv("text", { class: "crown-greek" }, [sv("textPath", { href: "#textring", startOffset: "0", text: A.greek + " " })]);
    var rot = sv("g", { class: "crown-rot" }, [ringText]);
    svg.appendChild(rot);
    var pn = panel();
    var binds = sv("g", { class: "c-binds" });
    A.stops.forEach(function (s, k) {
      var t = -Math.PI / 2 + k / A.stops.length * Math.PI * 2, x = C + 116 * Math.cos(t), y = C + 116 * Math.sin(t);
      var g = sv("g", { class: "bind", tabindex: "0", role: "button", "aria-label": s.t + ", " + s.s, transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (t * 180 / Math.PI + 90).toFixed(1) + ")" }, [
        sv("rect", { x: -9, y: -16, width: 18, height: 32, rx: 3, class: "bind-gold" }),
        sv("line", { x1: -9, y1: -6, x2: 9, y2: -6, class: "bind-line" }), sv("line", { x1: -9, y1: 2, x2: 9, y2: 2, class: "bind-line" }), sv("line", { x1: -9, y1: 10, x2: 9, y2: 10, class: "bind-line" })
      ]);
      function show() { setPanel(pn, s.t, s.s, s.d); Array.prototype.forEach.call(binds.children, function (b, i) { b.classList.toggle("on", i === k); }); }
      g.addEventListener("click", show); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
      binds.appendChild(g);
    });
    svg.appendChild(binds);
    svg.appendChild(sv("text", { x: C, y: C - 6, class: "crown-mid", "text-anchor": "middle", text: "c. 21 cm" }));
    svg.appendChild(sv("text", { x: C, y: C + 14, class: "crown-mid crown-mid2", "text-anchor": "middle", text: "rushes · gold thread · no thorns" }));
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "crown-stage" }, [svg]),
      el("p", { class: "crown-tr", text: A.translation }),
      pn,
      el("p", { class: "relic-hint", text: "Touch a gold binding to follow the relic from Jerusalem to the fire, in order clockwise from the top." })
    ]));
    root.classList.add("is-live");
    setPanel(pn, "A ring of rushes", "", "The Paris relic has no thorns: individual thorns were given away over the centuries as separate relics. Start at the top binding.");
  }

  // ---------------------------------------------------------------- ark (blueprint)
  function ark(root, item) {
    var A = item.artifact, cubit = 44.5;
    var svg = sv("svg", { viewBox: "0 0 760 330", class: "ark-svg", role: "img", "aria-label": "Scale drawing of the Ark from Exodus 25 beside a person" });
    var draw = sv("g", {}), parts = {};
    svg.appendChild(draw);
    var pn = panel();
    var dimL = el("span"), dimW = el("span"), dimH = el("span");
    function render() {
      draw.innerHTML = "";
      var S = 1.35; // px per cm
      var L = 2.5 * cubit * S, Wd = 1.5 * cubit * S, Hh = 1.5 * cubit * S, base = 290, x0 = 70;
      // ground line and scale bar
      draw.appendChild(sv("line", { x1: 20, y1: base, x2: 740, y2: base, class: "bp-ground" }));
      draw.appendChild(sv("line", { x1: 30, y1: 24, x2: 30 + 100 * S, y2: 24, class: "bp-dim" }));
      draw.appendChild(sv("text", { x: 30 + 50 * S, y: 40, class: "bp-t", "text-anchor": "middle", text: "scale: 1 m" }));
      // side elevation
      parts.poles = sv("g", { class: "bp-part", "data-part": "poles" }, [sv("rect", { x: x0 - 40, y: base - Hh * 0.28 - 5, width: L + 80, height: 10, rx: 4, class: "bp-gold" })]);
      parts.chest = sv("g", { class: "bp-part", "data-part": "chest" }, [
        sv("rect", { x: x0, y: base - Hh, width: L, height: Hh, class: "bp-gold" }),
        sv("rect", { x: x0 + 6, y: base - Hh + 8, width: L - 12, height: 5, class: "bp-mould" })
      ]);
      parts.rings = sv("g", { class: "bp-part", "data-part": "rings" }, [
        sv("circle", { cx: x0 + 16, cy: base - Hh * 0.28, r: 7, class: "bp-ring" }), sv("circle", { cx: x0 + L - 16, cy: base - Hh * 0.28, r: 7, class: "bp-ring" })
      ]);
      parts.kapporet = sv("g", { class: "bp-part", "data-part": "kapporet" }, [sv("rect", { x: x0 - 2, y: base - Hh - 7, width: L + 4, height: 7, class: "bp-gold bp-bright" })]);
      var wy = base - Hh - 7;
      parts.cherubim = sv("g", { class: "bp-part", "data-part": "cherubim" }, [
        sv("path", { d: "M" + (x0 + 14) + " " + wy + " q 8 -46 " + (L * 0.42) + " -52 q -" + (L * 0.2) + " 30 -" + (L * 0.3) + " 52 Z", class: "bp-gold bp-bright" }),
        sv("path", { d: "M" + (x0 + L - 14) + " " + wy + " q -8 -46 -" + (L * 0.42) + " -52 q " + (L * 0.2) + " 30 " + (L * 0.3) + " 52 Z", class: "bp-gold bp-bright" })
      ]);
      ["poles", "chest", "rings", "kapporet", "cherubim"].forEach(function (k) { draw.appendChild(parts[k]); });
      // dimension lines
      draw.appendChild(sv("line", { x1: x0, y1: base + 8, x2: x0 + L, y2: base + 8, class: "bp-dim" }));
      draw.appendChild(sv("text", { x: x0 + L / 2, y: base + 22, class: "bp-t", "text-anchor": "middle", text: "2½ cubits ≈ " + Math.round(2.5 * cubit) + " cm" }));
      draw.appendChild(sv("line", { x1: x0 + L + 50, y1: base, x2: x0 + L + 50, y2: base - Hh, class: "bp-dim" }));
      draw.appendChild(sv("text", { x: x0 + L + 56, y: base - Hh / 2, class: "bp-t", text: "1½ ≈ " + Math.round(1.5 * cubit) + " cm" }));
      // end elevation (width)
      var ex = x0 + L + 150;
      draw.appendChild(sv("rect", { x: ex, y: base - Hh, width: Wd, height: Hh, class: "bp-gold bp-end" }));
      draw.appendChild(sv("text", { x: ex + Wd / 2, y: base + 22, class: "bp-t", "text-anchor": "middle", text: "end: 1½ ≈ " + Math.round(1.5 * cubit) + " cm" }));
      // person 170 cm
      var px = 700, ph = 170 * S;
      draw.appendChild(sv("g", { class: "bp-person" }, [
        sv("circle", { cx: px, cy: base - ph + 12, r: 12 }),
        sv("rect", { x: px - 15, y: base - ph + 27, width: 30, height: ph * 0.45, rx: 12 }),
        sv("rect", { x: px - 13, y: base - ph + 27 + ph * 0.43, width: 11, height: ph * 0.47, rx: 5 }),
        sv("rect", { x: px + 2, y: base - ph + 27 + ph * 0.43, width: 11, height: ph * 0.47, rx: 5 })
      ]));
      draw.appendChild(sv("text", { x: px, y: base + 22, class: "bp-t", "text-anchor": "middle", text: "1.70 m" }));
      dimL.textContent = Math.round(2.5 * cubit); dimW.textContent = Math.round(1.5 * cubit); dimH.textContent = Math.round(1.5 * cubit);
      A.parts.forEach(function (p) {
        var g = parts[p.id]; if (!g) return;
        g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", p.t);
        function show() { setPanel(pn, p.t, p.v, p.d); Object.keys(parts).forEach(function (k) { parts[k].classList.toggle("on", k === p.id); }); }
        g.addEventListener("click", show); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
      });
    }
    var bShort = el("button", { type: "button", "aria-pressed": "true", text: "Common cubit ≈ 44.5 cm" });
    var bLong = el("button", { type: "button", "aria-pressed": "false", text: "Royal cubit ≈ 52.5 cm" });
    function setC(c) { cubit = c; bShort.setAttribute("aria-pressed", String(c === 44.5)); bLong.setAttribute("aria-pressed", String(c === 52.5)); render(); }
    bShort.addEventListener("click", function () { setC(44.5); }); bLong.addEventListener("click", function () { setC(52.5); });
    var gstat = el("p", { class: "g-status", role: "status", "aria-live": "polite" });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "vellum" }, [
        el("p", { class: "pap-head", text: "Exodus 25:10" }),
        glossLine(A.hebrew, "he", "rtl", gstat),
        el("p", { class: "pap-tr", text: A.translation }),
        el("div", { class: "ark-stage" }, [svg]),
        el("p", { class: "bp-sum" }, ["About ", dimL, " × ", dimW, " × ", dimH, " cm (length × width × height). The cubit intended is uncertain."])
      ]),
      gstat,
      el("div", { class: "relic-ctrls" }, [bShort, bLong]),
      pn
    ]));
    root.classList.add("is-live");
    render();
    setPanel(pn, "A chest, not a monument", "", "Touch the chest, lid, cherubim, rings or poles for the verse that specifies it.");
  }

  function init() {
    var V = window.VAULT || { items: [] };
    Array.prototype.forEach.call(document.querySelectorAll("[data-vault-relic]"), function (root) {
      var item = V.items.filter(function (x) { return x.id === root.getAttribute("data-vault-relic"); })[0];
      var kind = root.getAttribute("data-relic-kind");
      try {
        if (kind === "tablet") tablet(root);
        else if (kind === "scroll") scroll(root, item);
        else if (kind === "linen") linen(root, item);
        else if (kind === "lance") lance(root, item);
        else if (kind === "crown") crown(root, item);
        else if (kind === "ark") ark(root, item);
      } catch (e) { /* leave the static fallback in place */ }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
