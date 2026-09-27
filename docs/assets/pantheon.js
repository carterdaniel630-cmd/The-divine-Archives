/* ==========================================================================
   THE DIVINE ARCHIVES — the Pantheon page

   Search box, kind pills and a tradition filter over a dense grid of square
   figure cards. A card opens the figure's detail view (also reachable at
   pantheon.html#id), which links back to its home chapters and Vault entries.
   Data: pantheon-data.js; emblems: pantheon-art.js.
   ========================================================================== */
(function () {
  "use strict";
  var P = window.PANTHEON, ART = window.PANTHEON_ART, A = window.ARCHIVE || { chapters: [], themes: [] }, V = window.VAULT || { items: [] };
  var mount = document.getElementById("pantheon-mount");
  if (!P || !ART || !mount) return;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, attrs, html) { var n = document.createElement(tag); for (var k in attrs || {}) n.setAttribute(k, attrs[k]); if (html != null) n.innerHTML = html; return n; }
  var chapters = {}; (A.chapters || []).concat(A.themes || []).forEach(function (c) { chapters[c.id] = c; });
  var vault = {}; (V.items || []).forEach(function (i) { vault[i.id] = i; });
  var figs = P.figures.slice().sort(function (a, b) { return a.n.localeCompare(b.n); });
  function fold(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  figs.forEach(function (f) { f._s = fold([f.n, f.e, f.d, P.traditions[f.t].name, P.kinds[f.k]].join(" ")); });

  var state = { q: "", kind: "all", trad: "all" };
  try { var saved = JSON.parse(sessionStorage.getItem("pantheon-filter") || "null"); if (saved) { state.kind = saved.kind || "all"; state.trad = saved.trad || "all"; } } catch (e) { /* storage unavailable */ }

  // ---------------------------------------------------------------- toolbar
  var bar = el("div", { class: "pn-bar" });
  var search = el("label", { class: "pn-search" }, '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>');
  var input = el("input", { type: "search", placeholder: "Search Characters...", "aria-label": "Search characters", autocomplete: "off", spellcheck: "false" });
  search.appendChild(input);
  var pills = el("div", { class: "pn-pills", role: "group", "aria-label": "Filter by kind" });
  var kinds = [["all", "All"]].concat(Object.keys(P.kinds).map(function (k) { return [k, P.kinds[k]]; }));
  kinds.forEach(function (k) {
    var b = el("button", { type: "button", class: "pn-pill", "data-k": k[0], "aria-pressed": String(state.kind === k[0]) }, esc(k[1]));
    b.addEventListener("click", function () { state.kind = k[0]; render(); });
    pills.appendChild(b);
  });
  var sel = el("select", { class: "pn-trad", "aria-label": "Filter by tradition" });
  sel.appendChild(el("option", { value: "all" }, "Every tradition"));
  Object.keys(P.traditions).sort(function (a, b) { return P.traditions[a].name.localeCompare(P.traditions[b].name); }).forEach(function (t) {
    var o = el("option", { value: t }, esc(P.traditions[t].name)); sel.appendChild(o);
  });
  sel.value = state.trad;
  sel.addEventListener("change", function () { state.trad = sel.value; render(); });
  bar.appendChild(search); bar.appendChild(pills); bar.appendChild(sel);
  var count = el("p", { class: "pn-count", role: "status", "aria-live": "polite" });
  var grid = el("ul", { class: "pn-grid" });
  var empty = el("p", { class: "pn-empty", hidden: "" }, "No figure matches that search. Try another name, a tradition, or a word such as <em>sun</em> or <em>underworld</em>.");
  mount.appendChild(bar); mount.appendChild(count); mount.appendChild(grid); mount.appendChild(empty);

  // ---------------------------------------------------------------- cards
  var cards = figs.map(function (f) {
    var tr = P.traditions[f.t];
    var li = el("li", { class: "pn-cell" });
    var a = el("a", { class: "pn-card", href: "#" + f.id, "data-id": f.id, style: "--acc:" + tr.color },
      '<span class="pn-art">' + ART.svg(f, tr.color, "c" + f.id) + "</span>" +
      '<span class="pn-name">' + esc(f.n) + "</span>" +
      '<span class="pn-badge">' + esc(tr.name) + "</span>" +
      (f.c ? '<span class="pn-flag" title="Something about this figure is contested">contested</span>' : ""));
    a.addEventListener("click", function (e) { e.preventDefault(); open(f.id, true); });
    li.appendChild(a); grid.appendChild(li);
    return { f: f, li: li };
  });

  var shown = [];
  function render() {
    var q = fold(state.q.trim());
    Array.prototype.forEach.call(pills.children, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-k") === state.kind)); });
    shown = [];
    cards.forEach(function (c) {
      var ok = (state.kind === "all" || c.f.k === state.kind) && (state.trad === "all" || c.f.t === state.trad) && (!q || c.f._s.indexOf(q) !== -1);
      c.li.hidden = !ok; if (ok) shown.push(c.f);
    });
    count.textContent = shown.length === figs.length ? figs.length + " figures from " + Object.keys(P.traditions).length + " traditions" : shown.length + " of " + figs.length + " figures";
    empty.hidden = shown.length !== 0;
    try { sessionStorage.setItem("pantheon-filter", JSON.stringify({ kind: state.kind, trad: state.trad })); } catch (e) { /* storage unavailable */ }
  }
  var t;
  input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { state.q = input.value; render(); }, 60); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input && !dlg.open && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); input.focus(); }
  });

  // ---------------------------------------------------------------- detail view
  var dlg = el("dialog", { class: "pn-dialog", "aria-labelledby": "pn-d-name" });
  document.body.appendChild(dlg);
  var current = null, opener = null;
  function linkList(title, items) { return items.length ? '<p class="pn-d-h">' + title + "</p><ul class=\"pn-d-links\">" + items.join("") + "</ul>" : ""; }
  function open(id, push) {
    var f = null; for (var i = 0; i < figs.length; i++) if (figs[i].id === id) f = figs[i];
    if (!f) return;
    current = f; if (!dlg.open) opener = document.activeElement;
    var tr = P.traditions[f.t];
    var chs = f.ch.filter(function (c) { return chapters[c]; }).map(function (c) { var ch = chapters[c]; return '<li><a href="chapters/' + c + '.html">' + esc(ch.title) + '</a> <span class="pn-d-meta">' + esc(String(ch.eraLabel || "").split(" · ")[0]) + "</span></li>"; });
    var vs = (f.v || []).filter(function (v) { return vault[v] && vault[v].status === "published"; }).map(function (v) { var it = vault[v]; return '<li><a href="vault/' + it.slug + '.html">' + esc(it.title) + '</a> <span class="pn-d-meta">' + esc(it.dated) + "</span></li>"; });
    dlg.setAttribute("style", "--acc:" + tr.color);
    dlg.innerHTML =
      '<div class="pn-d">' +
      '<button type="button" class="pn-d-x" aria-label="Close">&times;</button>' +
      '<div class="pn-d-art">' + ART.svg(f, tr.color, "d" + f.id) + '<p class="pn-d-cap">Emblem: ' + esc(ART.parts(f).join(" · ")) + "</p></div>" +
      '<div class="pn-d-body">' +
      '<p class="pn-d-kicker"><span class="pn-badge">' + esc(tr.name) + '</span> <span class="pn-kind">' + esc(P.kinds[f.k]) + "</span></p>" +
      '<h2 id="pn-d-name">' + esc(f.n) + "</h2>" +
      '<p class="pn-d-ep">' + esc(f.e) + "</p>" +
      '<p class="pn-d-desc">' + esc(f.d) + "</p>" +
      (f.c ? '<p class="pn-d-contest"><strong>Contested.</strong> ' + esc(f.c) + "</p>" : "") +
      linkList("Read in the archive", chs) + linkList("In the Vault", vs) +
      '<div class="pn-d-nav"><button type="button" data-step="-1">&larr; Previous</button><button type="button" data-step="1">Next &rarr;</button></div>' +
      "</div></div>";
    dlg.querySelector(".pn-d-x").addEventListener("click", close);
    Array.prototype.forEach.call(dlg.querySelectorAll("[data-step]"), function (b) {
      b.addEventListener("click", function () {
        var list = shown.length ? shown : figs, i = list.indexOf(current);
        var n = list[(i + Number(b.getAttribute("data-step")) + list.length) % list.length];
        open(n.id, true);
      });
    });
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    dlg.querySelector(".pn-d-x").focus();
    if (push && location.hash !== "#" + f.id) history.replaceState(null, "", "#" + f.id);
  }
  function close() {
    if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  }
  dlg.addEventListener("close", function () {
    current = null;
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (opener && opener.focus) opener.focus();
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var b = dlg.querySelector('[data-step="' + (e.key === "ArrowRight" ? 1 : -1) + '"]'); if (b) b.click(); }
  });
  function fromHash() { var id = decodeURIComponent(location.hash.slice(1)); if (id) open(id, false); else close(); }
  window.addEventListener("hashchange", fromHash);

  render();
  fromHash();
})();
