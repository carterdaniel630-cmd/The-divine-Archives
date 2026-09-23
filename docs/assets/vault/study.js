/* ==========================================================================
   THE DIVINE ARCHIVES — Vault study viewer
   Deep-zoom viewer for manuscript/relic images published by their holding
   institutions over IIIF. Nothing is copied into this site: pages are loaded
   live, in the reader's browser, from the institution's own image server.

   Tools: page navigation + deep links (#folio=f68r3), zoom/rotate/fullscreen,
   a magnifying loupe, ink-enhancement filters (brightness / contrast /
   saturation / invert / grey), region capture (full-resolution IIIF crop URL),
   an "AI study packet" (copyable brief with image links + text + scrutiny
   rules), and — for items with a machine-readable transliteration — a text
   panel with statistics and a substitution-key decipherment workbench.

   Requires OpenSeadragon (vendored at assets/vendor/openseadragon/) and
   window.VAULT (assets/vault-data.js). Mounts on <section data-vault-study>.
   ========================================================================== */
(function () {
  "use strict";

  var OSD = window.OpenSeadragon;

  // ---------- small helpers ----------------------------------------------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function label(x) {
    if (x == null) return "";
    if (typeof x === "string") return x;
    if (Array.isArray(x)) return label(x[0]);
    if (typeof x === "object") {
      if ("@value" in x) return String(x["@value"]);
      var k = Object.keys(x)[0];
      return k ? label(x[k]) : "";
    }
    return String(x);
  }
  // "f68r3", "Folio 1r", "1 recto" -> canonical "f68r3" / "f1r" (or "" if none)
  function folioKey(s) {
    var m = String(s || "").match(/(\d+)\s*(r|v|recto|verso)\s*(\d*)/i);
    if (!m) return "";
    return "f" + parseInt(m[1], 10) + m[2].charAt(0).toLowerCase() + (m[3] || "");
  }
  function copyText(t, done) {
    function fallback() {
      var ta = el("textarea", { style: "position:fixed;left:-9999px;top:0" });
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(true); } catch (e) { done(false); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () { done(true); }, fallback);
    } else fallback();
  }

  // ---------- IIIF manifest parsing (Presentation 2 and 3) ----------------
  function parseManifest(m) {
    var pages = [];
    function svcOf(res) {
      var s = arr(res && res.service)[0];
      if (!s) return null;
      var id = (s.id || s["@id"] || "").replace(/\/info\.json$/, "").replace(/\/$/, "");
      var type = String(s.type || s["@type"] || "") + " " + String(s.profile || "") + " " + String(s["@context"] || "");
      return id ? { id: id, v3: /ImageService3|image\/3/.test(type) } : null;
    }
    if (Array.isArray(m.items)) { // v3
      m.items.forEach(function (c) {
        if (c.type && c.type !== "Canvas") return;
        var anno = c.items && c.items[0] && c.items[0].items && c.items[0].items[0];
        var body = anno && anno.body;
        if (body && body.type === "Choice") body = arr(body.items)[0];
        if (!body) return;
        pages.push({ label: label(c.label), service: svcOf(body), image: body.id || body["@id"] || "", w: c.width, h: c.height });
      });
    } else if (m.sequences) { // v2
      arr(m.sequences[0] && m.sequences[0].canvases).forEach(function (c) {
        var res = c.images && c.images[0] && c.images[0].resource;
        if (!res) return;
        if (res["@type"] === "oa:Choice") res = res["default"] || res;
        pages.push({ label: label(c.label), service: svcOf(res), image: res["@id"] || "", w: c.width, h: c.height });
      });
    }
    pages.forEach(function (p, i) { p.key = folioKey(p.label); p.index = i; if (!p.label) p.label = "Image " + (i + 1); });
    return { title: label(m.label), pages: pages };
  }

  // ---------- IVTFF transliteration parsing ------------------------------
  // Zandbergen's Intermediate Voynich Transliteration File Format.
  function parseIVTFF(text) {
    var pages = {}, order = [];
    text.split(/\r?\n/).forEach(function (ln) {
      if (!ln || ln.charAt(0) === "#") return;
      var ph = ln.match(/^<(f\d+[rv]\d*)>\s*(?:<!([^>]*)>)?/); // page header, e.g. <f1r>  <! $I=H $L=A>
      if (ph) {
        var key = ph[1];
        if (!pages[key]) { pages[key] = { key: key, vars: {}, lines: [] }; order.push(key); }
        (ph[2] || "").replace(/\$(\w)=(\w+)/g, function (_, k, v) { pages[key].vars[k] = v; });
        return;
      }
      var lm = ln.match(/^<(f\d+[rv]\d*)\.([^,;>]+)(?:,([^;>]*))?(?:;(\w+))?>\s*(.*)$/);
      if (!lm) return;
      var k2 = lm[1];
      if (!pages[k2]) { pages[k2] = { key: k2, vars: {}, lines: [] }; order.push(k2); }
      var raw = lm[5];
      var clean = raw
        .replace(/<![^>]*>/g, "")          // inline comments
        .replace(/\{[^}]*\}/g, "")        // editorial braces
        .replace(/<[^>]*>/g, " ")          // markers (<->, <$>, <%> …)
        .replace(/\[([^:\]]*):[^\]]*\]/g, "$1") // [a:b] alternatives -> first reading
        .replace(/@\d+;?/g, "?")           // rare glyph codes
        .replace(/[!]/g, "")               // filler
        .replace(/\*/g, "?")               // illegible
        .replace(/[-=]/g, ".");            // line/drawing breaks
      var words = clean.split(/[.,\s]+/).filter(Boolean);
      pages[k2].lines.push({ locus: lm[2], unit: lm[3] || "", raw: raw, words: words });
    });
    return { pages: pages, order: order };
  }

  // ---------- statistics --------------------------------------------------
  function statsFor(lines) {
    var words = [], lineFirst = {}, allFirst = {}, freq = {}, rep = 0, prev = null;
    lines.forEach(function (l) {
      l.words.forEach(function (w, i) {
        words.push(w);
        freq[w] = (freq[w] || 0) + 1;
        var g = w.charAt(0);
        allFirst[g] = (allFirst[g] || 0) + 1;
        if (i === 0) lineFirst[g] = (lineFirst[g] || 0) + 1;
        if (prev === w) rep++;
        prev = w;
      });
      prev = null;
    });
    // character entropies over the glyph stream (EVA letters + word space)
    var stream = words.join(" ").replace(/\?/g, "");
    var c1 = {}, c2 = {}, n1 = 0, n2 = 0;
    for (var i = 0; i < stream.length; i++) {
      var a = stream.charAt(i);
      c1[a] = (c1[a] || 0) + 1; n1++;
      if (i > 0) { var d = stream.charAt(i - 1) + a; c2[d] = (c2[d] || 0) + 1; n2++; }
    }
    function H(c, n) { var h = 0; Object.keys(c).forEach(function (k) { var p = c[k] / n; h -= p * Math.log2(p); }); return h; }
    var h1 = n1 ? H(c1, n1) : 0, h12 = n2 ? H(c2, n2) : 0;
    var types = Object.keys(freq).length;
    var top = Object.keys(freq).sort(function (x, y) { return freq[y] - freq[x]; }).slice(0, 15).map(function (w) { return [w, freq[w]]; });
    function topOf(o, n) { var t = 0; Object.keys(o).forEach(function (k) { t += o[k]; }); return Object.keys(o).sort(function (x, y) { return o[y] - o[x]; }).slice(0, n).map(function (k) { return k + " " + Math.round(100 * o[k] / t) + "%"; }); }
    var len = 0; words.forEach(function (w) { len += w.length; });
    return {
      tokens: words.length, types: types,
      meanLen: words.length ? (len / words.length) : 0,
      h1: h1, h2: n2 ? (h12 - h1) : 0, // conditional entropy H(X_n | X_n-1) ≈ H(pairs) − H(singles)
      repeats: rep, top: top,
      lineFirst: topOf(lineFirst, 5), allFirst: topOf(allFirst, 5),
      qShare: words.length ? words.filter(function (w) { return w.charAt(0) === "q"; }).length / words.length : 0
    };
  }

  // ---------- substitution key --------------------------------------------
  function parseKey(txt) {
    var rules = [];
    String(txt || "").split(/[\n,;]+/).forEach(function (r) {
      var m = r.match(/^\s*([a-z?]+)\s*(?:=|->|→)\s*(.*?)\s*$/i);
      if (m) rules.push([m[1].toLowerCase(), m[2]]);
    });
    rules.sort(function (a, b) { return b[0].length - a[0].length; }); // longest match first
    return rules;
  }
  function applyKey(word, rules) {
    if (!rules.length) return word;
    var out = "", i = 0;
    while (i < word.length) {
      var hit = null;
      for (var r = 0; r < rules.length; r++) if (word.substr(i, rules[r][0].length) === rules[r][0]) { hit = rules[r]; break; }
      if (hit) { out += hit[1]; i += hit[0].length; } else { out += "·"; i++; }
    }
    return out;
  }

  // ======================================================================
  function mount(root) {
    var V = window.VAULT || { items: [] };
    var item = V.items.filter(function (x) { return x.id === root.getAttribute("data-vault-study"); })[0];
    if (!item || !OSD) return;
    var study = item.study || {};
    root.classList.add("is-live");

    var state = { pages: [], idx: 0, svc: null, text: null, filter: { b: 100, c: 100, s: 100, inv: 0, g: 0 }, region: null };

    // ---- layout ---------------------------------------------------------
    var status = el("p", { class: "study-status", role: "status", "aria-live": "polite" });
    var sel = el("select", { class: "study-folio", "aria-label": "Choose a page" });
    var prevB = el("button", { type: "button", title: "Previous page", "aria-label": "Previous page", text: "◀" });
    var nextB = el("button", { type: "button", title: "Next page", "aria-label": "Next page", text: "▶" });
    var zin = el("button", { type: "button", title: "Zoom in", "aria-label": "Zoom in", text: "+" });
    var zout = el("button", { type: "button", title: "Zoom out", "aria-label": "Zoom out", text: "−" });
    var home = el("button", { type: "button", title: "Fit page", "aria-label": "Fit page", text: "⤢" });
    var rot = el("button", { type: "button", title: "Rotate 90°", "aria-label": "Rotate 90 degrees", text: "⟳" });
    var loupeB = el("button", { type: "button", "aria-pressed": "false", title: "Magnifying loupe", text: "Loupe" });
    var regionB = el("button", { type: "button", "aria-pressed": "false", title: "Drag a box to capture a region at full resolution", text: "Capture region" });
    var fullB = el("button", { type: "button", title: "Full screen", text: "Full screen" });
    var bar = el("div", { class: "study-bar" }, [prevB, sel, nextB, el("span", { class: "sep" }), zout, zin, home, rot, el("span", { class: "sep" }), loupeB, regionB, fullB]);

    var stage = el("div", { class: "study-stage" });
    var osdEl = el("div", { class: "study-osd", id: "osd-" + item.id });
    var loupe = el("canvas", { class: "study-loupe", width: "220", height: "220", "aria-hidden": "true" });
    var sel_rect = el("div", { class: "study-rect", "aria-hidden": "true" });
    var catcher = el("div", { class: "study-catch", "aria-hidden": "true" });
    stage.appendChild(osdEl); stage.appendChild(catcher); stage.appendChild(sel_rect); stage.appendChild(loupe);

    function slider(name, key, min, max) {
      var i = el("input", { type: "range", min: String(min), max: String(max), value: String(state.filter[key]), "aria-label": name });
      i.addEventListener("input", function () { state.filter[key] = +i.value; applyFilter(); });
      return el("label", {}, [name + " ", i]);
    }
    var invC = el("input", { type: "checkbox", "aria-label": "Invert" });
    invC.addEventListener("change", function () { state.filter.inv = invC.checked ? 100 : 0; applyFilter(); });
    var greyC = el("input", { type: "checkbox", "aria-label": "Greyscale" });
    greyC.addEventListener("change", function () { state.filter.g = greyC.checked ? 100 : 0; applyFilter(); });
    var resetF = el("button", { type: "button", text: "Reset" });
    var sB = slider("Brightness", "b", 30, 250), sC = slider("Contrast", "c", 30, 400), sS = slider("Colour", "s", 0, 300);
    resetF.addEventListener("click", function () {
      state.filter = { b: 100, c: 100, s: 100, inv: 0, g: 0 }; invC.checked = false; greyC.checked = false;
      [sB, sC, sS].forEach(function (l, i) { l.querySelector("input").value = "100"; });
      applyFilter();
    });
    var enhance = el("div", { class: "study-enhance" }, [
      el("span", { class: "eyebrow", text: "Enhance ink" }), sB, sC, sS,
      el("label", {}, [invC, " Invert"]), el("label", {}, [greyC, " Greyscale"]), resetF
    ]);

    var out = el("div", { class: "study-out" });
    var pageLinks = el("p", { class: "study-pagelinks" });

    var custom = el("input", { type: "url", placeholder: "Paste any IIIF manifest URL…", "aria-label": "IIIF manifest URL" });
    var customB = el("button", { type: "button", text: "Open" });
    customB.addEventListener("click", function () { if (custom.value.trim()) load(custom.value.trim()); });
    custom.addEventListener("keydown", function (e) { if (e.key === "Enter") customB.click(); });
    var customRow = el("div", { class: "study-custom" }, [custom, customB]);

    root.appendChild(el("div", { class: "study-live" }, [bar, stage, status, enhance, pageLinks, out, customRow]));

    // ---- viewer ---------------------------------------------------------
    var viewer = OSD({
      element: osdEl,
      showNavigationControl: false,
      showNavigator: true,
      navigatorPosition: "BOTTOM_RIGHT",
      crossOriginPolicy: "Anonymous",
      maxZoomPixelRatio: 6,
      visibilityRatio: 0.6,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
      animationTime: 0.6
    });
    root.__osd = viewer; // handy for debugging from the console
    viewer.addHandler("open-failed", function (e) {
      setStatus("This page's image could not be loaded from the holding institution" + (e && e.message ? " (" + e.message + ")" : "") + ". Use the institution's own viewer linked above.");
    });
    viewer.addHandler("open", function () { setStatus(""); applyFilter(); });

    zin.onclick = function () { viewer.viewport.zoomBy(1.6); viewer.viewport.applyConstraints(); };
    zout.onclick = function () { viewer.viewport.zoomBy(1 / 1.6); viewer.viewport.applyConstraints(); };
    home.onclick = function () { viewer.viewport.goHome(); };
    rot.onclick = function () { viewer.viewport.setRotation((viewer.viewport.getRotation() + 90) % 360); };
    fullB.onclick = function () { viewer.setFullScreen(!viewer.isFullPage()); };
    prevB.onclick = function () { go(state.idx - 1); };
    nextB.onclick = function () { go(state.idx + 1); };
    sel.onchange = function () { go(+sel.value); };

    function setStatus(t) { status.textContent = t; }

    function filterCSS() {
      var f = state.filter;
      return "brightness(" + f.b + "%) contrast(" + f.c + "%) saturate(" + f.s + "%) invert(" + f.inv + "%) grayscale(" + f.g + "%)";
    }
    function applyFilter() {
      var c = viewer.canvas; if (c) c.style.filter = filterCSS();
    }

    // ---- loupe ----------------------------------------------------------
    var loupeOn = false;
    loupeB.onclick = function () {
      loupeOn = !loupeOn; loupeB.setAttribute("aria-pressed", String(loupeOn));
      loupe.style.display = loupeOn ? "block" : "none";
      if (loupeOn && regionOn) regionB.click();
    };
    stage.addEventListener("mousemove", function (e) {
      if (!loupeOn) return;
      var src = viewer.drawer && viewer.drawer.canvas;
      if (!src || !src.getContext) return;
      var r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      var pd = src.width / (src.clientWidth || src.width), Z = 2.8, S = loupe.width;
      var ctx = loupe.getContext("2d");
      ctx.save(); ctx.clearRect(0, 0, S, S);
      ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2); ctx.clip();
      try { ctx.filter = filterCSS(); } catch (err) {}
      var sw = S / Z;
      ctx.drawImage(src, (x - sw / 2) * pd, (y - sw / 2) * pd, sw * pd, sw * pd, 0, 0, S, S);
      ctx.restore();
      loupe.style.left = (x - S / 2) + "px"; loupe.style.top = (y - S / 2) + "px";
    });
    stage.addEventListener("mouseleave", function () { if (loupeOn) loupe.getContext("2d").clearRect(0, 0, loupe.width, loupe.height); });

    // ---- region capture -------------------------------------------------
    var regionOn = false, drag = null;
    regionB.onclick = function () {
      regionOn = !regionOn; regionB.setAttribute("aria-pressed", String(regionOn));
      catcher.style.display = regionOn ? "block" : "none";
      viewer.setMouseNavEnabled(!regionOn);
      if (regionOn && loupeOn) loupeB.click();
      setStatus(regionOn ? "Drag a box over the part of the page you want to capture." : "");
    };
    function pt(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    catcher.addEventListener("pointerdown", function (e) { drag = { a: pt(e) }; catcher.setPointerCapture(e.pointerId); sel_rect.style.display = "block"; draw(drag.a, drag.a); });
    catcher.addEventListener("pointermove", function (e) { if (drag) draw(drag.a, pt(e)); });
    catcher.addEventListener("pointerup", function (e) {
      if (!drag) return; var b = pt(e), a = drag.a; drag = null;
      if (Math.abs(b.x - a.x) < 6 || Math.abs(b.y - a.y) < 6) { sel_rect.style.display = "none"; return; }
      capture(a, b);
    });
    function draw(a, b) {
      sel_rect.style.left = Math.min(a.x, b.x) + "px"; sel_rect.style.top = Math.min(a.y, b.y) + "px";
      sel_rect.style.width = Math.abs(b.x - a.x) + "px"; sel_rect.style.height = Math.abs(b.y - a.y) + "px";
    }
    function capture(a, b) {
      var ti = viewer.world.getItemAt(0); if (!ti) return;
      var size = ti.getContentSize();
      var cs = [[a.x, a.y], [b.x, a.y], [a.x, b.y], [b.x, b.y]].map(function (p) {
        return viewer.viewport.viewerElementToImageCoordinates(new OSD.Point(p[0], p[1]));
      });
      var x0 = Math.max(0, Math.floor(Math.min.apply(null, cs.map(function (p) { return p.x; }))));
      var y0 = Math.max(0, Math.floor(Math.min.apply(null, cs.map(function (p) { return p.y; }))));
      var x1 = Math.min(size.x, Math.ceil(Math.max.apply(null, cs.map(function (p) { return p.x; }))));
      var y1 = Math.min(size.y, Math.ceil(Math.max.apply(null, cs.map(function (p) { return p.y; }))));
      if (x1 - x0 < 2 || y1 - y0 < 2) { setStatus("That box is outside the page."); return; }
      state.region = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      renderOut();
    }

    function iiif(region, size) {
      if (!state.svc) return "";
      return state.svc.id + "/" + region + "/" + size + "/0/default.jpg";
    }
    function fullSize() { return state.svc && state.svc.v3 ? "max" : "full"; }

    function currentPage() { return state.pages[state.idx] || null; }

    function renderPageLinks() {
      var p = currentPage(); pageLinks.innerHTML = "";
      if (!p) return;
      var full = state.svc ? iiif("full", fullSize()) : p.image;
      if (full) pageLinks.appendChild(el("a", { href: full, target: "_blank", rel: "noopener", text: "Open this page at full resolution ↗" }));
      if (state.svc) {
        pageLinks.appendChild(document.createTextNode(" · "));
        pageLinks.appendChild(el("a", { href: iiif("full", "!2000,2000"), target: "_blank", rel: "noopener", text: "2000px version ↗" }));
      }
      pageLinks.appendChild(document.createTextNode(" · "));
      pageLinks.appendChild(el("button", { type: "button", class: "linkish", text: "Copy AI study packet (whole page)", onclick: function (e) { packet(null, e.currentTarget); } }));
    }

    function renderOut() {
      out.innerHTML = "";
      var r = state.region; if (!r) return;
      var reg = r.x + "," + r.y + "," + r.w + "," + r.h;
      if (!state.svc) { out.appendChild(el("p", { text: "Region capture needs a IIIF image service; this image has none." })); return; }
      var big = iiif(reg, fullSize()), mid = iiif(reg, "!1600,1600"), thumb = iiif(reg, "!480,480");
      out.appendChild(el("div", { class: "study-region" }, [
        el("img", { src: thumb, alt: "Captured region of " + (currentPage() ? currentPage().label : "the page"), loading: "lazy" }),
        el("div", {}, [
          el("p", { class: "eyebrow", text: "Captured region · " + r.w + " × " + r.h + " px of the original" }),
          el("p", {}, [
            el("a", { href: big, target: "_blank", rel: "noopener", text: "Full-resolution crop ↗" }), " · ",
            el("a", { href: mid, target: "_blank", rel: "noopener", text: "1600px crop ↗" })
          ]),
          el("p", {}, [
            el("button", { type: "button", text: "Copy crop link", onclick: function (e) { var b = e.currentTarget; copyText(big, function (ok) { b.textContent = ok ? "Copied" : "Copy failed"; }); } }), " ",
            el("button", { type: "button", text: "Copy AI study packet", onclick: function (e) { packet(big, e.currentTarget); } })
          ])
        ])
      ]));
    }

    // ---- AI study packet ------------------------------------------------
    function packet(regionUrl, btn) {
      var p = currentPage();
      var lines = [
        "STUDY PACKET — The Divine Archives · The Vault",
        "Object: " + item.title + " — " + (item.held || ""),
        "Date evidence: " + (item.dated || "see entry"),
        "Page: " + (p ? p.label : "") + (p && p.key ? " (" + p.key + ")" : ""),
        "Page image (full resolution): " + (state.svc ? iiif("full", fullSize()) : (p ? p.image : "")),
        regionUrl ? "Region image (full resolution): " + regionUrl : "",
        "Image rights: " + (study.rights || "see the holding institution"),
        "Entry: " + location.href.split("#")[0]
      ];
      var tl = textLinesFor(p && p.key);
      if (tl && tl.length) {
        lines.push("", "Transliteration of this page (" + ((study.transcription && study.transcription.label) || "") + "):");
        tl.forEach(function (l) { lines.push(l.locus + "  " + l.words.join(".")); });
      }
      lines.push("",
        "INSTRUCTIONS FOR ANALYSIS — apply the archive's evidence standard:",
        "1. Describe only what is visible in the image(s); mark every inference as an inference.",
        "2. Keep three columns: well supported by evidence / not supported / genuinely open.",
        "3. Do not claim a decipherment or translation unless ONE fixed key yields grammatical, connected text on other pages you have not tuned it on — and show those pages.",
        "4. Name real, checkable sources for any factual claim; if you cannot, say so instead of inventing one.",
        "5. Flag contested scholarly questions as contested; do not resolve them by picking a side."
      );
      copyText(lines.filter(function (x) { return x !== ""; }).join("\n").replace(/\n(INSTRUCTIONS|Transliteration)/g, "\n\n$1"), function (ok) {
        if (btn) btn.textContent = ok ? "Packet copied — paste it into your AI tool" : "Copy failed";
      });
    }

    // ---- navigation -----------------------------------------------------
    function go(i) {
      if (!state.pages.length) return;
      i = Math.max(0, Math.min(state.pages.length - 1, i));
      state.idx = i; sel.value = String(i);
      prevB.disabled = i === 0; nextB.disabled = i === state.pages.length - 1;
      var p = state.pages[i];
      state.svc = p.service; state.region = null; out.innerHTML = ""; sel_rect.style.display = "none";
      if (p.service) viewer.open(p.service.id + "/info.json");
      else if (p.image) viewer.open({ type: "image", url: p.image, crossOriginPolicy: "Anonymous" });
      setStatus("Loading " + p.label + "…");
      renderPageLinks();
      try { history.replaceState(null, "", "#folio=" + encodeURIComponent(p.key || String(i + 1))); } catch (e) {}
      if (textPanel) textPanel.show(p.key);
    }

    function load(url) {
      setStatus("Loading the image list from the holding institution…");
      fetch(url, { mode: "cors" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (m) {
        var parsed = parseManifest(m);
        if (!parsed.pages.length) throw new Error("no images in manifest");
        state.pages = parsed.pages;
        sel.innerHTML = "";
        parsed.pages.forEach(function (p, i) { sel.appendChild(el("option", { value: String(i), text: p.label })); });
        var want = (location.hash.match(/folio=([^&]+)/) || [])[1];
        want = want ? decodeURIComponent(want) : (study.start || "");
        var start = 0;
        if (want) parsed.pages.some(function (p, i) { if (p.key === want || p.label === want || String(i + 1) === want) { start = i; return true; } return false; });
        go(start);
      }).catch(function (e) {
        setStatus("Could not load the image list (" + e.message + "). The holding institution's server may be unreachable, or it may not allow other sites to load its images. Use the official viewer linked above.");
      });
    }

    // ---- text panel (IVTFF) ---------------------------------------------
    var textPanel = null;
    function textLinesFor(key) {
      if (!state.text || !key) return null;
      var pg = state.text.pages[key];
      return pg ? pg.lines : null;
    }
    if (study.transcription && study.transcription.kind === "ivtff") textPanel = buildTextPanel();

    function buildTextPanel() {
      var T = study.transcription;
      var wrap = el("div", { class: "study-text" });
      var head = el("div", { class: "study-text-head" }, [
        el("p", { class: "eyebrow", text: "Text & decipherment workbench" }),
        el("p", { class: "tiny", html: "Source: " + T.label + " — <a href=\"" + T.about + "\" target=\"_blank\" rel=\"noopener\">about this transliteration</a>. EVA letters record glyph <em>shapes</em>, not sounds." })
      ]);
      var loadB = el("button", { type: "button", text: "Load the transliteration" });
      var file = el("input", { type: "file", accept: ".txt,text/plain", "aria-label": "Choose an IVTFF transliteration file" });
      var loadMsg = el("p", { class: "tiny", role: "status" });
      var loader = el("div", { class: "study-loader" }, [loadB, el("span", { class: "tiny", text: " or open a copy you've downloaded: " }), file, loadMsg]);
      var body = el("div", { class: "study-text-body", hidden: "hidden" });
      var folioText = el("pre", { class: "study-eva", tabindex: "0", "aria-label": "Transliteration of this page" });
      var scopeSel = el("select", { "aria-label": "Statistics scope" }, [
        el("option", { value: "page", text: "this page" }),
        el("option", { value: "lang", text: "all pages in this page's Currier language" }),
        el("option", { value: "all", text: "the whole manuscript" })
      ]);
      var statsBox = el("div", { class: "study-stats" });
      var keyTA = el("textarea", { rows: "4", placeholder: "Your substitution key, one rule per line, e.g.\nch = e\no = a\nqo = co\n(longest glyph-groups are matched first; unmapped glyphs show as ·)", "aria-label": "Substitution key" });
      var dictTA = el("textarea", { rows: "3", placeholder: "Optional: paste a word list for your target language (one per line) to measure how many words your key produces.", "aria-label": "Target-language word list" });
      var applyB = el("button", { type: "button", text: "Apply key" });
      var keyOut = el("div", { class: "study-keyout" });
      body.appendChild(el("h4", { text: "This page, as transliterated" }));
      body.appendChild(folioText);
      body.appendChild(el("h4", {}, ["Statistics for ", scopeSel]));
      body.appendChild(statsBox);
      body.appendChild(el("h4", { text: "Test a decipherment" }));
      body.appendChild(el("p", { class: "tiny", text: "A real decipherment must work with ONE fixed key across pages it was not tuned on. Build a key on this page, then step to other pages and watch whether it still makes words." }));
      body.appendChild(keyTA); body.appendChild(dictTA); body.appendChild(applyB); body.appendChild(keyOut);
      wrap.appendChild(head); wrap.appendChild(loader); wrap.appendChild(body);
      root.querySelector(".study-live").appendChild(wrap);

      function ingest(txt, from) {
        var t = parseIVTFF(txt);
        if (!t.order.length) { loadMsg.textContent = "That file doesn't look like an IVTFF transliteration."; return; }
        state.text = t; loader.hidden = true; body.hidden = false;
        head.appendChild(el("p", { class: "tiny", text: "Loaded " + t.order.length + " pages from " + from + "." }));
        api.show(currentPage() && currentPage().key);
      }
      loadB.onclick = function () {
        loadMsg.textContent = "Trying the published source…";
        var urls = (T.urls || []).slice();
        (function next() {
          var u = urls.shift();
          if (!u) { loadMsg.innerHTML = "The source site does not allow direct loading from other websites. <a href=\"" + T.about + "\" target=\"_blank\" rel=\"noopener\">Download the file from its publisher</a>, then open it with the file button — it stays in your browser."; return; }
          fetch(u, { mode: "cors" }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (x) { ingest(x, u); }).catch(next);
        })();
      };
      file.onchange = function () {
        var f = file.files && file.files[0]; if (!f) return;
        var rd = new FileReader(); rd.onload = function () { ingest(String(rd.result), f.name); }; rd.readAsText(f);
      };
      scopeSel.onchange = function () { api.show(currentPage() && currentPage().key); };
      applyB.onclick = function () { api.show(currentPage() && currentPage().key); };

      var api = {
        show: function (key) {
          if (!state.text) return;
          var pg = key && state.text.pages[key];
          folioText.textContent = pg && pg.lines.length
            ? pg.lines.map(function (l) { return l.locus + "  " + l.words.join("."); }).join("\n")
            : "No transliterated text for this page (" + (key || "unlabelled") + ").";
          var lines = [];
          var scope = scopeSel.value, lang = pg && pg.vars.L;
          state.text.order.forEach(function (k) {
            var p = state.text.pages[k];
            if (scope === "page" ? k === key : scope === "lang" ? (lang && p.vars.L === lang) : true) lines = lines.concat(p.lines);
          });
          var s = statsFor(lines);
          statsBox.innerHTML = "";
          if (!s.tokens) { statsBox.textContent = "No text in this scope."; }
          else {
            statsBox.appendChild(el("dl", {}, [
              el("dt", { text: "Words (tokens / distinct)" }), el("dd", { text: s.tokens + " / " + s.types }),
              el("dt", { text: "Mean word length" }), el("dd", { text: s.meanLen.toFixed(2) + " EVA glyphs" }),
              el("dt", { text: "Glyph entropy h1" }), el("dd", { text: s.h1.toFixed(2) + " bits" }),
              el("dt", { text: "Conditional entropy h2" }), el("dd", { text: s.h2.toFixed(2) + " bits (lower = more predictable next glyph)" }),
              el("dt", { text: "Immediate word repeats" }), el("dd", { text: String(s.repeats) }),
              el("dt", { text: "Words starting with q" }), el("dd", { text: (100 * s.qShare).toFixed(1) + "%" }),
              el("dt", { text: "Line-initial first glyphs" }), el("dd", { text: s.lineFirst.join(", ") }),
              el("dt", { text: "All word-initial glyphs" }), el("dd", { text: s.allFirst.join(", ") }),
              el("dt", { text: "Commonest words" }), el("dd", { text: s.top.map(function (t) { return t[0] + " (" + t[1] + ")"; }).join(", ") })
            ]));
            if (pg && pg.vars) statsBox.appendChild(el("p", { class: "tiny", text: "Page metadata from the file: " + Object.keys(pg.vars).map(function (k) { return "$" + k + "=" + pg.vars[k]; }).join(" ") + "  ($L = Currier language, $I = illustration type, $H = hand)." }));
            statsBox.appendChild(el("p", { class: "tiny", text: "Values depend on how glyphs are split into EVA letters; compare like with like. Entropies are computed over EVA letters plus the word space." }));
          }
          // key
          var rules = parseKey(keyTA.value);
          keyOut.innerHTML = "";
          if (rules.length && pg) {
            var dict = {}; dictTA.value.split(/\s+/).forEach(function (w) { if (w) dict[w.toLowerCase()] = 1; });
            var useDict = Object.keys(dict).length > 0;
            var hit = 0, tot = 0;
            var rendered = pg.lines.map(function (l) {
              return l.locus + "  " + l.words.map(function (w) { var m = applyKey(w, rules); tot++; if (useDict && dict[m.toLowerCase()]) hit++; return m; }).join(" ");
            }).join("\n");
            keyOut.appendChild(el("pre", { class: "study-eva", text: rendered }));
            if (useDict) {
              // same key over the whole manuscript, to expose over-fitting
              var H2 = 0, T2 = 0;
              state.text.order.forEach(function (k) { state.text.pages[k].lines.forEach(function (l) { l.words.forEach(function (w) { T2++; if (dict[applyKey(w, rules).toLowerCase()]) H2++; }); }); });
              keyOut.appendChild(el("p", { class: "tiny", text: "Dictionary hits — this page: " + (tot ? (100 * hit / tot).toFixed(1) : 0) + "% · whole manuscript with the same key: " + (T2 ? (100 * H2 / T2).toFixed(1) : 0) + "%. A key tuned to one page usually collapses across the rest — that collapse is the test most published 'solutions' fail." }));
            }
          }
        }
      };
      return api;
    }

    // ---- start ----------------------------------------------------------
    if (study.manifest) load(study.manifest);
    else {
      stage.classList.add("is-empty");
      setStatus("This object has no scans that can be embedded here — use the official viewers above, or paste a IIIF manifest URL below to study any published images.");
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-vault-study]"), mount);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // exposed for tests / tools
  window.VaultStudy = { parseManifest: parseManifest, parseIVTFF: parseIVTFF, statsFor: statsFor, parseKey: parseKey, applyKey: applyKey, folioKey: folioKey };
})();
