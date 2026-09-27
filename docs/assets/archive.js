/* ==========================================================================
   THE DIVINE ARCHIVES — shared page behaviour
   Vanilla JS. Every listing, era and chapter page is prerendered to static HTML
   by tools/build-pages.js and tools/build-chapters.js, so this file only wires
   the site search forms (form[data-search] → search.html?q=…).
   (The old client-side renderers — renderEra / renderTraditions / renderChapter —
   were retired once prerendering shipped; the build tools keep their logic.)
   ========================================================================== */
(function () {
  "use strict";

  function wireSearch() {
    document.querySelectorAll("form[data-search]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        var q = input ? input.value.trim() : "";
        window.location.href = "search.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", wireSearch);
})();
