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
     codex / timeline / cards / inscription — reusable forms for later entries.
     scales — the weighing of the heart (Book of the Dead, Spell 125).
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

  // square Hebrew -> palaeo-Hebrew (Unicode Phoenician block), final forms folded
  var PALEO = { "א": 0, "ב": 1, "ג": 2, "ד": 3, "ה": 4, "ו": 5, "ז": 6, "ח": 7, "ט": 8, "י": 9, "כ": 10, "ך": 10, "ל": 11, "מ": 12, "ם": 12, "נ": 13, "ן": 13, "ס": 14, "ע": 15, "פ": 16, "ף": 16, "צ": 17, "ץ": 17, "ק": 18, "ר": 19, "ש": 20, "ת": 21 };
  function toPaleo(str) {
    return Array.prototype.map.call(str, function (ch) { var k = PALEO[ch]; return k == null ? ch : String.fromCodePoint(0x10900 + k); }).join("");
  }

  // ---------------------------------------------------------------- scroll
  function scroll(root, item) {
    var cols = item && item.artifact && item.artifact.columns;
    if (!cols || !cols.length) return;

    var gloss = el("p", { class: "scroll-gloss", role: "status", "aria-live": "polite", text: "" });
    function word(w, lang, cjk) {
      // w: [word, gloss] or plain string
      if (typeof w === "string") return document.createTextNode(w + (cjk ? "" : " "));
      // vertical text: Chromium sizes <button> content as if horizontal, so vertical words are focusable spans
      var b = cjk ? el("span", { role: "button", tabindex: "0", class: "s-word" + (w[2] ? " " + w[2] : ""), "data-gloss": w[1], lang: lang, text: w[0] })
                  : el("button", { type: "button", class: "s-word" + (w[2] ? " " + w[2] : ""), "data-gloss": w[1], lang: lang, text: w[0] });
      if (cjk) b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); } });
      b.addEventListener("mouseenter", function () { gloss.textContent = w[0] + " — " + w[1]; });
      b.addEventListener("focus", function () { gloss.textContent = w[0] + " — " + w[1]; });
      b.addEventListener("click", function () { gloss.textContent = w[0] + " — " + w[1]; b.classList.add("is-read"); });
      return el("span", {}, [b, cjk ? "" : " "]);
    }

    var sheet = el("div", { class: "scroll-sheet", tabindex: "0", "aria-label": "Scroll columns — drag or use the arrow keys to move along the scroll" });
    cols.forEach(function (c, i) {
      var col = el("section", { class: "s-col s-" + c.kind, "aria-label": c.heading });
      col.appendChild(el("h4", { class: "s-head", text: c.heading }));
      var cjk = c.kind === "cjk", lang = c.lang || (c.kind === "hebrew" ? "he" : cjk ? "zh-Hant" : "en");
      var holder = cjk ? el("div", { class: "s-vert", lang: lang }) : col;
      (c.lines || []).forEach(function (ln) {
        var p = el("p", { class: "s-line", dir: c.kind === "hebrew" ? "rtl" : "ltr", lang: lang });
        ln.forEach(function (w) { p.appendChild(word(w, lang, cjk)); });
        holder.appendChild(p);
      });
      if (cjk) col.appendChild(holder);
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

    // columns ink in one after another as the scroll opens
    Array.prototype.forEach.call(sheet.querySelectorAll(".s-col"), function (c, i) { c.style.setProperty("--i", i); });

    var rollR = el("button", { type: "button", class: "scroll-roll roll-r", "aria-label": "Unroll the scroll", "aria-expanded": "false" },
      [el("span", { class: "scroll-tie", "aria-hidden": "true" }, [el("span", { class: "scroll-knot" })])]);
    var rollL = el("span", { class: "scroll-roll roll-l", "aria-hidden": "true" });
    var win = el("div", { class: "scroll-window" }, [sheet, el("span", { class: "scroll-spill", "aria-hidden": "true" })]);
    // decorative light: a slow aura and drifting motes (hidden for reduced motion)
    var motes = el("div", { class: "scroll-motes", "aria-hidden": "true" });
    for (var m = 0; m < 18; m++) {
      var mo = el("span", { class: "mote" });
      mo.style.setProperty("--x", (4 + Math.random() * 92).toFixed(1) + "%");
      mo.style.setProperty("--d", (7 + Math.random() * 8).toFixed(1) + "s");
      mo.style.setProperty("--w", (-Math.random() * 12).toFixed(1) + "s");
      mo.style.setProperty("--s", (2 + Math.random() * 3.5).toFixed(1) + "px");
      mo.style.setProperty("--dx", ((Math.random() - .5) * 60).toFixed(0) + "px");
      motes.appendChild(mo);
    }
    var body = el("div", { class: "scroll-body" }, [el("span", { class: "scroll-aura", "aria-hidden": "true" }), motes, rollR, win, rollL]);
    var trBtn = el("button", { type: "button", "aria-pressed": "false", text: "Show translation" });
    var toggle = el("button", { type: "button", text: "Unroll the scroll" });
    var ctrls = el("div", { class: "relic-ctrls" }, [toggle, trBtn]);
    var scrollEl = el("div", { class: "scroll theme-" + ((item.artifact && item.artifact.theme) || "parchment"), "data-open": "false", dir: "rtl" }, [body]);
    if (item.artifact && item.artifact.paleo) {
      var paleoB = el("button", { type: "button", "aria-pressed": "false", text: "Palaeo-Hebrew letters" });
      paleoB.addEventListener("click", function () {
        var on = paleoB.getAttribute("aria-pressed") !== "true"; paleoB.setAttribute("aria-pressed", String(on));
        Array.prototype.forEach.call(sheet.querySelectorAll(".s-line[lang=he] .s-word"), function (b) {
          if (!b.hasAttribute("data-sq")) b.setAttribute("data-sq", b.textContent);
          b.textContent = on ? toPaleo(b.getAttribute("data-sq")) : b.getAttribute("data-sq");
          b.classList.toggle("s-paleo", on);
        });
      });
      ctrls.appendChild(paleoB);
    }

    root.appendChild(el("div", { class: "relic-live" }, [ctrls, scrollEl, gloss,
      el("p", { class: "relic-hint", text: (item.artifact && item.artifact.hint) || "Hebrew scrolls open from the right. Drag the parchment to travel along it, and touch a word to read its meaning." })]));
    root.classList.add("is-live");

    function setOpen(open) {
      scrollEl.setAttribute("data-open", String(open));
      rollR.setAttribute("aria-expanded", String(open));
      rollR.setAttribute("aria-label", open ? "Roll the scroll up" : "Unroll the scroll");
      toggle.textContent = open ? "Roll it up" : "Unroll the scroll";
      if (open && !reduce) {
        scrollEl.classList.remove("is-opening"); void scrollEl.offsetWidth; scrollEl.classList.add("is-opening");
        clearTimeout(scrollEl._ot); scrollEl._ot = setTimeout(function () { scrollEl.classList.remove("is-opening"); }, 2200);
      }
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

  // ---------------------------------------------------------------- shared: flip-card grid
  function cardGrid(cards) {
    var grid = el("div", { class: "flip-cards" });
    cards.forEach(function (c) {
      var card = el("button", { type: "button", class: "flip", "aria-pressed": "false" }, [
        el("span", { class: "f-front" }, [el("strong", { text: c.t }), c.s ? el("em", { text: c.s }) : null]),
        el("span", { class: "f-back", text: c.d })
      ]);
      card.addEventListener("click", function () { card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true")); });
      grid.appendChild(card);
    });
    return grid;
  }

  // ---------------------------------------------------------------- cards (generic)
  function cards(root, item) {
    var A = item.artifact;
    root.appendChild(el("div", { class: "relic-live" }, [
      el("h4", { class: "relic-subhead", text: A.cardsTitle || "Turn each card" }), cardGrid(A.cards)
    ]));
    root.classList.add("is-live");
  }

  // ---------------------------------------------------------------- timeline (generic)
  function timeline(root, item) {
    var A = item.artifact, ev = A.events;
    var kids = [];
    var gstat = el("p", { class: "g-status", role: "status", "aria-live": "polite" });
    if (A.line) {
      kids.push(el("div", { class: "tl-line theme-" + (A.theme || "plain") }, [
        A.lineHead ? el("p", { class: "pap-head", text: A.lineHead }) : null,
        glossLine(A.line, A.lineLang || "en", A.lineDir || "ltr", gstat),
        A.lineTr ? el("p", { class: "pap-tr", text: A.lineTr }) : null
      ]));
      kids.push(gstat);
    }
    var yBig = el("p", { class: "tl-year" }), tBig = el("p", { class: "tl-title" }), dBig = el("p", { class: "tl-desc" });
    var plaque = el("div", { class: "tl-plaque theme-" + (A.theme || "plain"), role: "status", "aria-live": "polite" }, [yBig, tBig, dBig]);
    var slider = el("input", { type: "range", min: "0", max: String(ev.length - 1), value: "0", step: "1", "aria-label": "Move through the documented history" });
    var ticks = el("div", { class: "l-ticks", "aria-hidden": "true" });
    ev.forEach(function (e, i) {
      var b = el("button", { type: "button", tabindex: "-1", text: String(e.y), style: "left:" + (ev.length > 1 ? 100 * i / (ev.length - 1) : 50) + "%" });
      b.addEventListener("click", function () { slider.value = String(i); upd(); });
      ticks.appendChild(b);
    });
    var prev = el("button", { type: "button", text: "◀ Earlier" }), next = el("button", { type: "button", text: "Later ▶" });
    function upd() {
      var i = +slider.value, e = ev[i];
      plaque.classList.remove("tl-in"); void plaque.offsetWidth; plaque.classList.add("tl-in");
      yBig.textContent = e.y; tBig.textContent = e.t; dBig.textContent = e.d;
      Array.prototype.forEach.call(ticks.children, function (t, k) { t.classList.toggle("on", k === i); });
      prev.disabled = i === 0; next.disabled = i === ev.length - 1;
    }
    prev.addEventListener("click", function () { slider.value = String(Math.max(0, +slider.value - 1)); upd(); });
    next.addEventListener("click", function () { slider.value = String(Math.min(ev.length - 1, +slider.value + 1)); upd(); });
    slider.addEventListener("input", upd);
    kids.push(plaque, el("div", { class: "l-time" }, [slider, ticks]), el("div", { class: "relic-ctrls" }, [prev, next]));
    if (A.cards) kids.push(el("h4", { class: "relic-subhead", text: A.cardsTitle || "Turn each card" }), cardGrid(A.cards));
    root.appendChild(el("div", { class: "relic-live" }, kids));
    root.classList.add("is-live");
    upd();
  }

  // ---------------------------------------------------------------- codex (generic)
  function codex(root, item) {
    var A = item.artifact, pages = A.pages, at = 0;
    function pageEl(p, side) {
      if (!p) return el("div", { class: "cx-page cx-" + side + " cx-blank" });
      return el("div", { class: "cx-page cx-" + side }, [
        p.h ? el("p", { class: "cx-h", text: p.h }) : null,
        el("p", { class: "cx-t" + (p.big ? " cx-big" : "") + (p.u ? " cx-uncial" : ""), text: p.t }),
        p.n ? el("p", { class: "cx-n", text: p.n }) : null,
        el("span", { class: "cx-folio", text: String(pages.indexOf(p) + 1) })
      ]);
    }
    var spread = el("div", { class: "cx-spread" });
    var book = el("div", { class: "codex theme-" + (A.theme || "vellum") }, [spread]);
    var prev = el("button", { type: "button", text: "◀ Turn back" }), next = el("button", { type: "button", text: "Turn the page ▶" });
    var count = el("span", { class: "cx-count" });
    function show(dir) {
      spread.innerHTML = "";
      spread.appendChild(pageEl(pages[at], "l")); spread.appendChild(pageEl(pages[at + 1], "r"));
      if (dir && !reduce) { spread.classList.remove("cx-turn-f", "cx-turn-b"); void spread.offsetWidth; spread.classList.add(dir > 0 ? "cx-turn-f" : "cx-turn-b"); }
      prev.disabled = at === 0; next.disabled = at + 2 >= pages.length;
      count.textContent = "pages " + (at + 1) + (pages[at + 1] ? "–" + (at + 2) : "") + " of " + pages.length;
    }
    prev.addEventListener("click", function () { if (at > 0) { at -= 2; show(-1); } });
    next.addEventListener("click", function () { if (at + 2 < pages.length) { at += 2; show(1); } });
    book.addEventListener("click", function (e) {
      if (e.target.closest("button")) return;
      var r = book.getBoundingClientRect();
      if (e.clientX > r.left + r.width / 2) next.click(); else prev.click();
    });
    book.setAttribute("tabindex", "0"); book.setAttribute("aria-label", A.title + ": use the arrow keys to turn pages");
    book.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") next.click(); if (e.key === "ArrowLeft") prev.click(); });
    root.appendChild(el("div", { class: "relic-live" }, [book, el("div", { class: "relic-ctrls" }, [prev, count, next]),
      el("p", { class: "relic-hint", text: "Touch the right-hand page to turn forward, the left to turn back." })]));
    root.classList.add("is-live");
    show(0);
  }

  // ---------------------------------------------------------------- inscription (generic, carved)
  // bare consonant skeleton (rasm): strip vowel signs, fold dotted letters to their undotted shapes
  var RASM = { "ب": "ٮ", "ت": "ٮ", "ث": "ٮ", "ن": "ٮ", "ي": "ى", "ئ": "ى", "ج": "ح", "خ": "ح", "ذ": "د", "ز": "ر", "ش": "س", "ض": "ص", "ظ": "ط", "غ": "ع", "ف": "ڡ", "ق": "ٯ", "ة": "ه", "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ؤ": "و" };
  function toRasm(str) {
    var t = str.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
    return t.replace(/[\s\S]/g, function (ch, i) {
      // a final nun keeps its bowl: dotless ں
      if (ch === "ن" && (i === t.length - 1 || /\s/.test(t.charAt(i + 1)))) return "ں";
      return RASM[ch] || ch;
    });
  }
  // standard runological transliteration to short-twig younger futhark (as on the Rök stone)
  var RUNE = { f: "ᚠ", u: "ᚢ", þ: "ᚦ", "ą": "ᚭ", o: "ᚭ", r: "ᚱ", k: "ᚴ", h: "ᚽ", n: "ᚿ", i: "ᛁ", a: "ᛆ", s: "ᛌ", t: "ᛐ", b: "ᛓ", m: "ᛙ", l: "ᛚ", "ʀ": "ᛧ", R: "ᛧ" };
  function toRunes(str) { return str.replace(/[fuþąorkhniastbmlʀR]/g, function (ch) { return RUNE[ch]; }); }
  var ALT = { rasm: toRasm, runes: toRunes };

  function inscription(root, item) {
    var A = item.artifact;
    var gstat = el("p", { class: "g-status", role: "status", "aria-live": "polite" });
    var line = el("p", { class: "ins-line", lang: A.lang || "he", dir: A.dir || "rtl" });
    var btns = A.words.map(function (w, i) {
      var b = el("button", { type: "button", class: "g-word ins-word" + (A.disputed && A.disputed.indexOf(i) !== -1 ? " is-disp" : "") + (A.paleo ? " s-paleo" : ""), text: A.paleo ? toPaleo(w[0]) : w[0] });
      b.setAttribute("data-sq", w[0]);
      function show() { gstat.textContent = w[0] + " — " + w[1]; }
      b.addEventListener("mouseenter", show); b.addEventListener("focus", show); b.addEventListener("click", show);
      line.appendChild(b); line.appendChild(document.createTextNode(" "));
      return b;
    });
    var box = el("div", { class: "ins-box theme-" + (A.theme || "limestone") }, [line, A.translation ? el("p", { class: "ins-tr", text: A.translation }) : null]);
    var kids = [box, gstat];
    if (A.disputed) {
      var dB = el("button", { type: "button", "aria-pressed": "false", text: A.disputedLabel || "Show the disputed words" });
      dB.addEventListener("click", function () { var on = dB.getAttribute("aria-pressed") !== "true"; dB.setAttribute("aria-pressed", String(on)); box.classList.toggle("show-disp", on); if (on) gstat.textContent = A.disputedNote || ""; });
      kids.push(el("div", { class: "relic-ctrls" }, [dB]));
    }
    if (A.paleo) {
      var pB = el("button", { type: "button", "aria-pressed": "false", text: "Show in square Hebrew letters" });
      pB.addEventListener("click", function () {
        var sq = pB.getAttribute("aria-pressed") !== "true"; pB.setAttribute("aria-pressed", String(sq));
        btns.forEach(function (b) { b.textContent = sq ? b.getAttribute("data-sq") : toPaleo(b.getAttribute("data-sq")); b.classList.toggle("s-paleo", !sq); });
      });
      var row = kids[kids.length - 1];
      if (row.classList && row.classList.contains("relic-ctrls")) row.appendChild(pB); else kids.push(el("div", { class: "relic-ctrls" }, [pB]));
    }
    if (A.alt && ALT[A.alt]) {
      var f = ALT[A.alt], altOn = !!A.altStart;
      var aB = el("button", { type: "button", "aria-pressed": String(altOn), text: A.altLabel || "Show the other script" });
      var paint = function () { btns.forEach(function (b) { b.textContent = altOn ? f(b.getAttribute("data-sq")) : b.getAttribute("data-sq"); b.classList.toggle("is-alt", altOn); }); line.classList.toggle("alt-" + A.alt, altOn); };
      aB.addEventListener("click", function () { altOn = !altOn; aB.setAttribute("aria-pressed", String(altOn)); paint(); });
      paint();
      var row2 = kids[kids.length - 1];
      if (row2.classList && row2.classList.contains("relic-ctrls")) row2.appendChild(aB); else kids.push(el("div", { class: "relic-ctrls" }, [aB]));
    }
    root.appendChild(el("div", { class: "relic-live" }, kids));
    root.classList.add("is-live");
  }

  // ---------------------------------------------------------------- scales (weighing of the heart)
  function scales(root, item) {
    var A = item.artifact, decl = A.declarations, done = 0, MAX = 16;
    var svg = sv("svg", { viewBox: "0 0 420 250", class: "scales-svg", role: "img", "aria-label": "A balance: the heart on one pan, the feather of Ma'at on the other" });
    svg.appendChild(sv("rect", { x: 205, y: 60, width: 10, height: 170, class: "sc-post" }));
    svg.appendChild(sv("rect", { x: 170, y: 228, width: 80, height: 12, rx: 3, class: "sc-post" }));
    svg.appendChild(sv("circle", { cx: 210, cy: 60, r: 7, class: "sc-pivot" }));
    var beam = sv("g", { class: "sc-beam" });
    beam.appendChild(sv("rect", { x: 70, y: 56, width: 280, height: 8, rx: 4, class: "sc-bar" }));
    function pan(x, glyph, label) {
      return sv("g", { class: "sc-pan-g" }, [
        sv("line", { x1: x, y1: 60, x2: x - 30, y2: 130, class: "sc-cord" }), sv("line", { x1: x, y1: 60, x2: x + 30, y2: 130, class: "sc-cord" }),
        sv("path", { d: "M" + (x - 42) + " 130 Q " + x + " 158 " + (x + 42) + " 130 Z", class: "sc-pan" }),
        sv("text", { x: x, y: 124, "text-anchor": "middle", class: "sc-glyph", text: glyph }),
        sv("text", { x: x, y: 176, "text-anchor": "middle", class: "sc-label", text: label })
      ]);
    }
    var left = pan(90, "𓄣", "the heart (ib)"), right = pan(330, "𓆄", "the feather of Ma'at");
    beam.appendChild(left); beam.appendChild(right);
    svg.appendChild(beam);
    var verdict = el("p", { class: "sc-verdict", role: "status", "aria-live": "polite" });
    var list = el("div", { class: "sc-decl" });
    var btns = decl.map(function (d) {
      var b = el("button", { type: "button", class: "sc-line", "aria-pressed": "false", text: d });
      b.addEventListener("click", function () {
        if (b.getAttribute("aria-pressed") === "true") return;
        b.setAttribute("aria-pressed", "true"); done++; tilt();
      });
      list.appendChild(b); return b;
    });
    function tilt() {
      var a = MAX * (1 - done / decl.length);
      beam.style.transform = "rotate(" + (-a) + "deg)";
      // keep the pans hanging level while the beam turns
      left.style.transform = "rotate(" + a + "deg)"; right.style.transform = "rotate(" + a + "deg)";
      left.style.transformOrigin = "90px 60px"; right.style.transformOrigin = "330px 60px";
      verdict.textContent = done === decl.length ? A.verdict : (done ? "The balance steadies…" : A.prompt);
      root.classList.toggle("sc-true", done === decl.length);
    }
    var reset = el("button", { type: "button", text: "Begin again" });
    reset.addEventListener("click", function () { done = 0; btns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); }); tilt(); });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "scales-stage" }, [svg]), verdict, list, el("div", { class: "relic-ctrls" }, [reset]),
      el("p", { class: "relic-hint", text: A.hint || "" })
    ]));
    root.classList.add("is-live");
    tilt();
  }

  // shared: an annular sector (ring segment) as an SVG path, angles in degrees clockwise from 12 o'clock
  function arcPath(cx, cy, r0, r1, a0, a1) {
    function pt(r, a) { var t = (a - 90) * Math.PI / 180; return (cx + r * Math.cos(t)).toFixed(2) + " " + (cy + r * Math.sin(t)).toFixed(2); }
    var big = (a1 - a0) > 180 ? 1 : 0;
    return "M" + pt(r1, a0) + " A" + r1 + " " + r1 + " 0 " + big + " 1 " + pt(r1, a1) +
      " L" + pt(r0, a1) + " A" + r0 + " " + r0 + " 0 " + big + " 0 " + pt(r0, a0) + " Z";
  }
  // shared: a small seeded random generator, so schematic drawings are the same on every visit
  function seeded(seed) { var x = seed >>> 0; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }

  // ---------------------------------------------------------------- venus (Dresden Codex)
  // Maya bar-and-dot numerals. Places are written top (highest) to bottom (units).
  // Day counts use 20 in the second place and 18 in the third (a 360-day tun).
  function mayaDigits(n, dayCount) {
    var d = [n % 20]; n = Math.floor(n / 20);
    var base = dayCount ? [18, 20, 20] : [20, 20, 20], k = 0;
    while (n > 0) { d.push(n % base[k]); n = Math.floor(n / base[k]); k = Math.min(k + 1, 2); }
    return d.reverse();
  }
  function mayaNumeral(n, dayCount, scale) {
    var digits = mayaDigits(n, dayCount), S = scale || 1, rowH = 46, w = 64;
    var g = sv("svg", { viewBox: "0 0 " + w + " " + (digits.length * rowH), class: "maya-num", width: w * S, height: digits.length * rowH * S, "aria-hidden": "true" });
    digits.forEach(function (v, i) {
      var y0 = i * rowH + 4, bars = Math.floor(v / 5), dots = v % 5;
      if (v === 0) {
        // the shell sign for zero
        g.appendChild(sv("ellipse", { cx: 32, cy: y0 + 19, rx: 20, ry: 11, class: "mn-shell" }));
        g.appendChild(sv("path", { d: "M16 " + (y0 + 17) + " Q32 " + (y0 + 11) + " 48 " + (y0 + 17) + " M18 " + (y0 + 23) + " Q32 " + (y0 + 28) + " 46 " + (y0 + 23), class: "mn-shell-l" }));
        return;
      }
      var h = 7, gap = 3, stack = bars * (h + gap) + (dots ? 11 : 0), y = y0 + (38 - stack) / 2;
      if (dots) { for (var k = 0; k < dots; k++) g.appendChild(sv("circle", { cx: 32 - (dots - 1) * 6.5 + k * 13, cy: y + 4.5, r: 4.2, class: "mn-dot" })); y += 11; }
      for (var b = 0; b < bars; b++) { g.appendChild(sv("rect", { x: 8, y: y, width: 48, height: h, rx: 3, class: "mn-bar" })); y += h + gap; }
    });
    return g;
  }
  function venus(root, item) {
    var A = item.artifact, total = A.phases.reduce(function (s, p) { return s + p.days; }, 0);
    var W = 360, C = 180, svg = sv("svg", { viewBox: "0 0 " + W + " " + W, class: "venus-svg", role: "group", "aria-label": "The Venus cycle of " + total + " days, divided as the Dresden Codex divides it" });
    svg.appendChild(sv("circle", { cx: C, cy: C, r: 150, class: "vn-orbit" }));
    var pn = panel(), numBox = el("div", { class: "vn-num", "aria-hidden": "true" }), segs = [];
    function show(title, sub, body, n, dayCount) {
      setPanel(pn, title, sub, body);
      numBox.innerHTML = ""; numBox.appendChild(mayaNumeral(n, dayCount, 1));
      numBox.appendChild(el("span", { class: "vn-arabic", text: n.toLocaleString("en") }));
    }
    var a = 0;
    A.phases.forEach(function (p, i) {
      var span = p.days / total * 360, a0 = a, a1 = a + Math.max(span, 3);
      var path = sv("path", { d: arcPath(C, C, 112, 150, a0 + 0.6, a1 - 0.6), class: "vn-seg vn-" + p.kind, tabindex: "0", role: "button", "aria-label": p.name + ", " + p.days + " days" });
      function pick() { segs.forEach(function (s) { s.classList.remove("on"); }); path.classList.add("on"); show(p.name, p.days + " days", p.d, p.days, false); }
      path.addEventListener("click", pick);
      path.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      segs.push(path); svg.appendChild(path);
      var mid = (a0 + a1) / 2, t = (mid - 90) * Math.PI / 180, r = 170;
      svg.appendChild(sv("text", { x: (C + r * Math.cos(t)).toFixed(1), y: (C + r * Math.sin(t) + 4).toFixed(1), class: "vn-lab", "text-anchor": "middle", text: p.days }));
      a = a + span;
    });
    // the planet itself, drawn as a bright star at the centre
    svg.appendChild(sv("circle", { cx: C, cy: C, r: 70, class: "vn-core" }));
    svg.appendChild(sv("path", { d: "M180 138 L187 172 L221 180 L187 188 L180 222 L173 188 L139 180 L173 172 Z", class: "vn-star" }));
    svg.appendChild(sv("text", { x: C, y: C + 58, class: "vn-core-lab", "text-anchor": "middle", text: total + " days" }));
    var mult = el("div", { class: "relic-ctrls vn-mult" });
    (A.multiples || []).forEach(function (m) {
      var b = el("button", { type: "button", text: m.label });
      b.addEventListener("click", function () { segs.forEach(function (s) { s.classList.remove("on"); }); show(m.label, m.sub, m.d, m.n, true); });
      mult.appendChild(b);
    });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "venus-stage" }, [svg, numBox]), mult, pn,
      A.hint ? el("p", { class: "relic-hint", text: A.hint }) : null
    ]));
    root.classList.add("is-live");
    var p0 = A.phases[0]; segs[0].classList.add("on"); show(p0.name, p0.days + " days", p0.d, p0.days, false);
  }

  // ---------------------------------------------------------------- palimpsest (two texts on one leaf)
  function palimpsest(root, item) {
    var A = item.artifact, W = 520, H = 640, rnd = seeded(A.seed || 7);
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "pal-svg", role: "img", "aria-label": "Schematic of a palimpsest leaf: an upper text written over an erased lower text" });
    svg.appendChild(sv("defs", {}, [
      sv("filter", { id: "pal-glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, [sv("feGaussianBlur", { stdDeviation: "2.2", result: "b" }), sv("feMerge", {}, [sv("feMergeNode", { in: "b" }), sv("feMergeNode", { in: "SourceGraphic" })])])
    ]));
    svg.appendChild(sv("path", { d: "M18 22 Q120 8 260 16 T502 20 L506 330 Q512 470 500 620 Q300 634 150 626 T16 618 Q8 420 14 230 Z", class: "pal-leaf" }));
    var uv = sv("rect", { x: 0, y: 0, width: W, height: H, class: "pal-uv" });
    function rows(cls, y0, dy, n, tilt, x0, x1) {
      var g = sv("g", { class: cls, transform: "rotate(" + tilt + " " + W / 2 + " " + H / 2 + ")" });
      for (var r = 0; r < n; r++) {
        var x = x1, y = y0 + r * dy;
        while (x > x0) {
          var len = 8 + rnd() * 46; if (x - len < x0) break;
          g.appendChild(sv("rect", { x: (x - len).toFixed(1), y: (y + (rnd() - .5) * 3).toFixed(1), width: len.toFixed(1), height: (3 + rnd() * 2.5).toFixed(1), rx: 2 }));
          if (rnd() < .35) g.appendChild(sv("circle", { cx: (x - len * rnd()).toFixed(1), cy: (y - 6 - rnd() * 4).toFixed(1), r: 1.6 }));
          x -= len + 7 + rnd() * 12;
        }
      }
      return g;
    }
    var lower = rows("pal-lower", 70, 27, 20, -2.2, 46, 476);
    var upper = rows("pal-upper", 62, 30, 18, 0, 40, 482);
    svg.appendChild(lower); svg.appendChild(uv); svg.appendChild(upper);
    var pn = panel();
    var range = el("input", { type: "range", min: "0", max: "100", value: "0", "aria-label": "Ultraviolet light: reveal the erased lower text" });
    function setUV(v) {
      v = +v; range.value = v;
      upper.style.opacity = (1 - v * .0078).toFixed(3);
      lower.style.opacity = (.07 + v * .0088).toFixed(3);
      uv.style.opacity = (v * .0065).toFixed(3);
      stage.classList.toggle("is-uv", v > 45);
      var L = v > 55 ? A.layers[1] : A.layers[0];
      setPanel(pn, L.t, L.s, L.d);
    }
    range.addEventListener("input", function () { setUV(range.value); });
    var bU = el("button", { type: "button", text: A.layers[0].button || "Upper text" }), bL = el("button", { type: "button", text: A.layers[1].button || "Lower text" });
    function glide(to) {
      if (reduce) return setUV(to);
      var from = +range.value, t0 = null;
      function step(ts) { if (t0 === null) t0 = ts; var k = Math.min(1, (ts - t0) / 1400), e = k * k * (3 - 2 * k); setUV(Math.round(from + (to - from) * e)); if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    bU.addEventListener("click", function () { glide(0); }); bL.addEventListener("click", function () { glide(100); });
    var stage = el("div", { class: "pal-stage" }, [svg]);
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "relic-ctrls" }, [bU, bL]),
      stage, el("label", { class: "pal-slider" }, [el("span", { text: "Daylight" }), range, el("span", { text: "Ultraviolet" })]),
      pn, A.hint ? el("p", { class: "relic-hint", text: A.hint }) : null
    ]));
    root.classList.add("is-live");
    setUV(0);
  }

  // ---------------------------------------------------------------- cauldron (Gundestrup), seen from above
  function cauldron(root, item) {
    var A = item.artifact, C = 200, pn = panel(), parts = [];
    var svg = sv("svg", { viewBox: "0 0 400 400", class: "cauldron-svg", role: "group", "aria-label": "The Gundestrup cauldron seen from above: outer plates, inner plates and the base plate" });
    svg.appendChild(sv("circle", { cx: C, cy: C, r: 192, class: "cd-rim" }));
    function add(el0, p) {
      el0.setAttribute("tabindex", "0"); el0.setAttribute("role", "button"); el0.setAttribute("aria-label", p.t);
      function pick() { parts.forEach(function (x) { x.classList.remove("on"); }); el0.classList.add("on"); setPanel(pn, p.t, p.s, p.d); }
      el0.addEventListener("click", pick);
      el0.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      parts.push(el0); return el0;
    }
    var n = A.outer.length;
    A.outer.forEach(function (p, i) {
      var a0 = i * 360 / n, a1 = (i + 1) * 360 / n;
      var path = sv("path", { d: arcPath(C, C, 138, 184, a0 + 1.2, a1 - 1.2), class: "cd-plate cd-outer" + (p.missing ? " is-missing" : "") });
      svg.appendChild(add(path, p));
      var t = ((a0 + a1) / 2 - 90) * Math.PI / 180;
      svg.appendChild(sv("text", { x: (C + 161 * Math.cos(t)).toFixed(1), y: (C + 161 * Math.sin(t) + 4).toFixed(1), class: "cd-num" + (p.missing ? " cd-miss" : ""), "text-anchor": "middle", text: p.missing ? "?" : p.k }));
    });
    var m = A.inner.length;
    A.inner.forEach(function (p, i) {
      var a0 = i * 360 / m + 18, a1 = (i + 1) * 360 / m + 18;
      svg.appendChild(add(sv("path", { d: arcPath(C, C, 84, 128, a0 + 1.5, a1 - 1.5), class: "cd-plate cd-inner" }), p));
      var t = ((a0 + a1) / 2 - 90) * Math.PI / 180;
      svg.appendChild(sv("text", { x: (C + 106 * Math.cos(t)).toFixed(1), y: (C + 106 * Math.sin(t) + 4).toFixed(1), class: "cd-num", "text-anchor": "middle", text: p.k }));
    });
    svg.appendChild(add(sv("circle", { cx: C, cy: C, r: 72, class: "cd-plate cd-base" }), A.base));
    svg.appendChild(sv("text", { x: C, y: C + 5, class: "cd-num cd-base-lab", "text-anchor": "middle", text: A.base.k }));
    parts.forEach(function (x) { if (x.classList.contains("is-missing")) x.setAttribute("aria-label", "The missing eighth outer plate"); });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "cauldron-stage" }, [svg]), pn,
      el("p", { class: "relic-hint", text: A.hint || "Touch a plate. Outer ring: the outer plates; middle ring: the inner plates; centre: the base plate." })
    ]));
    root.classList.add("is-live");
    parts[parts.length - 1].classList.add("on"); setPanel(pn, A.base.t, A.base.s, A.base.d);
  }

  // ---------------------------------------------------------------- chamber (Pyramid Texts), a burial-chamber wall under a starry gable
  function chamber(root, item) {
    var A = item.artifact, W = 640, H = 430, rnd = seeded(5), pn = panel(), zones = [];
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "chamber-svg", role: "group", "aria-label": "Schematic of a Pyramid Texts wall: columns of spells beneath a gabled ceiling of stars" });
    svg.appendChild(sv("path", { d: "M20 150 L320 20 L620 150 Z", class: "ch-gable" }));
    for (var i = 0; i < 46; i++) {
      var x = 60 + rnd() * 520, y = 40 + rnd() * 100;
      if (y < 150 - Math.abs(x - 320) * 130 / 300 - 10 && y > 34) {
        var r = 5 + rnd() * 2, pts = [];
        for (var k = 0; k < 10; k++) { var ang = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .42 : r; pts.push((x + rr * Math.cos(ang)).toFixed(1) + "," + (y + rr * Math.sin(ang)).toFixed(1)); }
        svg.appendChild(sv("polygon", { points: pts.join(" "), class: "ch-star" }));
      }
    }
    svg.appendChild(sv("rect", { x: 20, y: 150, width: 600, height: 262, class: "ch-wall" }));
    // the king's name in a cartouche, in real hieroglyphs
    svg.appendChild(sv("rect", { x: 262, y: 160, width: 116, height: 40, rx: 20, class: "ch-cart" }));
    svg.appendChild(sv("line", { x1: 380, y1: 170, x2: 380, y2: 190, class: "ch-cart-tie" }));
    svg.appendChild(sv("text", { x: 320, y: 190, class: "ch-glyph", "text-anchor": "middle", text: A.cartouche || "" }));
    var n = A.spells.length, zw = 600 / n;
    A.spells.forEach(function (p, i) {
      var g = sv("g", { class: "ch-zone", tabindex: "0", role: "button", "aria-label": p.t });
      var x0 = 20 + i * zw;
      g.appendChild(sv("rect", { x: x0 + 3, y: 208, width: zw - 6, height: 198, class: "ch-hit" }));
      for (var c = 0; c < Math.floor(zw / 15); c++) {
        var cx = x0 + 9 + c * 15, yy = 214;
        g.appendChild(sv("line", { x1: cx - 2, y1: 210, x2: cx - 2, y2: 402, class: "ch-rule" }));
        while (yy < 396) { var h = 4 + rnd() * 9; g.appendChild(sv("rect", { x: cx + 1 + rnd() * 2, y: yy, width: 6 + rnd() * 3, height: h, rx: 1.5, class: "ch-sign" })); yy += h + 3 + rnd() * 4; }
      }
      g.appendChild(sv("text", { x: x0 + zw / 2, y: 425, class: "ch-lab", "text-anchor": "middle", text: p.k }));
      function pick() { zones.forEach(function (z) { z.classList.remove("on"); }); g.classList.add("on"); setPanel(pn, p.t, p.s, p.d); }
      g.addEventListener("click", pick);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      zones.push(g); svg.appendChild(g);
    });
    root.appendChild(el("div", { class: "relic-live" }, [
      el("div", { class: "chamber-stage" }, [svg]), pn,
      el("p", { class: "relic-hint", text: A.hint || "Touch a panel of the wall to read its spell." })
    ]));
    root.classList.add("is-live");
    zones[0].classList.add("on"); setPanel(pn, A.spells[0].t, A.spells[0].s, A.spells[0].d);
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
        else if (kind === "timeline") timeline(root, item);
        else if (kind === "codex") codex(root, item);
        else if (kind === "cards") cards(root, item);
        else if (kind === "inscription") inscription(root, item);
        else if (kind === "scales") scales(root, item);
        else if (kind === "venus") venus(root, item);
        else if (kind === "palimpsest") palimpsest(root, item);
        else if (kind === "cauldron") cauldron(root, item);
        else if (kind === "chamber") chamber(root, item);
      } catch (e) { /* leave the static fallback in place */ }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
