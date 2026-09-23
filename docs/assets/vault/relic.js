/* ==========================================================================
   THE DIVINE ARCHIVES — Vault "relic" renderers
   Presents an object's own words in a form that echoes the object:
     tablet — a carved emerald slab (Emerald Tablet). Reads the Latin/English
              pairs from the entry's own blockquote, so the text has ONE source.
     scroll — a parchment scroll you unroll and pan through, right to left as a
              Hebrew scroll reads (Dead Sea Scrolls). Columns come from
              window.VAULT item.artifact.columns.
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

  function init() {
    var V = window.VAULT || { items: [] };
    Array.prototype.forEach.call(document.querySelectorAll("[data-vault-relic]"), function (root) {
      var item = V.items.filter(function (x) { return x.id === root.getAttribute("data-vault-relic"); })[0];
      var kind = root.getAttribute("data-relic-kind");
      try {
        if (kind === "tablet") tablet(root);
        else if (kind === "scroll") scroll(root, item);
      } catch (e) { /* leave the static fallback in place */ }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
