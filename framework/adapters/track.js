/* ==========================================================================
   The archive framework — page tracker (Phase 2)

   Bundled after framework/ledger.js into docs/assets/framework/archive-ledger.js
   by tools/build-framework.js. It is the one place where the site's pages meet
   the ledger; pages and games never call the ledger directly.

   - Anything on the page can record an event by dispatching
       window.dispatchEvent(new CustomEvent("archive:event", { detail: { entity, verb, payload } }))
     Events dispatched before this script has loaded are left in window.__archiveQ
     (the games' shared code does this) and are recorded when it loads.
   - <script ... data-entity="chapter:ch02"> records one "viewed" for that page.
   - The Pantheon's own script reports each figure it opens (figure:<id>).
   - Once per browser, the games' old high-score lists (da.games.score.<id>) are
     copied in as "scored" events marked {via: "import"}: only scores set before the
     tracker first ran here (da.ledger.since), since later ones were recorded live.
     The old lists are left as they are; the games still read them.

   Everything stays in this browser's localStorage. Nothing is sent anywhere.
   ========================================================================== */

(function () {
  "use strict";
  if (typeof window === "undefined" || !window.ArchiveLedger || window.__archiveTrack) return;

  var L = window.ArchiveLedger.create();
  var script = document.currentScript;

  function record(d) {
    if (!d || typeof d !== "object") return;
    try { L.append({ entity: d.entity, verb: d.verb, payload: d.payload }); } catch (e) { /* malformed events are dropped, never thrown at the page */ }
  }

  window.__archiveTrack = { ledger: L, record: record };
  window.addEventListener("archive:event", function (e) { record(e.detail); });

  var q = window.__archiveQ;
  window.__archiveQ = [];
  if (q && q.length) q.forEach(record);

  // Old high scores, copied once per game. Only scores set before this browser first ran the
  // tracker count as old: later ones were already recorded live (as "scored"), so copying them
  // again would count them twice.
  try {
    var since = parseInt(localStorage.getItem("da.ledger.since") || "", 10);
    if (!(since > 0)) { since = Date.now(); localStorage.setItem("da.ledger.since", String(since)); }
    var imported = {};
    L.events().forEach(function (e) { if (e.payload && e.payload.via === "import") imported[e.entity] = 1; });
    var keys = []; // snapshot first: adding events to storage would shift the key order mid-loop
    for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    keys.forEach(function (k) {
      var m = /^da\.games\.score\.([a-z0-9-]+)$/.exec(k || "");
      if (!m || imported["game:" + m[1]]) return;
      var list = JSON.parse(localStorage.getItem(k) || "[]");
      if (!Array.isArray(list)) return;
      list.forEach(function (s) {
        if (s && typeof s.score === "number" && isFinite(s.score) && !(typeof s.at === "number" && s.at >= since)) {
          record({ entity: "game:" + m[1], verb: "scored", payload: { value: s.score, via: "import", at: typeof s.at === "number" ? s.at : undefined } });
        }
      });
    });
  } catch (e) { /* storage blocked: nothing to import */ }

  var ent = script && script.getAttribute("data-entity");
  if (ent) record({ entity: ent, verb: "viewed" });
})();
