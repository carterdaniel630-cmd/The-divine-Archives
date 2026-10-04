/* The Divine Archives — site settings. One file, loaded by every page.

   cfAnalyticsToken — Cloudflare Web Analytics site token. Empty = analytics off (nothing loads).
   To turn it on: Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site
   (getconexto.com) → copy the token from the snippet it shows ({"token": "…"}) and paste it
   between the quotes below. Cloudflare Web Analytics sets no cookies and stores no personal data.
   This file lives at the site root, outside /assets/, so a change reaches visitors on their next
   page load rather than after the assets' one-day cache.

   The visitor counter (bottom of every page's footer) comes from /api/visits (functions/api/visits.js):
   one browser counts once a day. It stays hidden until its database is connected (see that file), and
   never shows a number it did not get from the server. */
window.SITE_CONFIG = {
  cfAnalyticsToken: ""
};

(function () {
  var token = window.SITE_CONFIG && window.SITE_CONFIG.cfAnalyticsToken;
  if (!token) return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: token }));
  document.head.appendChild(s);
})();

// ---- the visitor counter in the footer
(function () {
  function show(d) {
    if (!d || !d.ok || !(d.total > 0)) return;
    var foot = document.querySelector(".site-footer .wrap") || document.querySelector(".site-footer");
    if (!foot || foot.querySelector(".visit-count")) return;
    var p = document.createElement("p"); p.className = "visit-count";
    p.style.cssText = "margin:.9rem 0 0;font-size:.78rem;letter-spacing:.08em;color:var(--ink-dim,#a8987c);opacity:.85";
    p.textContent = "Visits to the archive: " + Number(d.total).toLocaleString("en-US") + (d.today > 0 ? " · today: " + Number(d.today).toLocaleString("en-US") : "");
    foot.appendChild(p);
  }
  function run() {
    if (navigator.webdriver) return;                      // automated test browsers neither count nor show
    var day = new Date().toISOString().slice(0, 10), seen = null;
    try { seen = localStorage.getItem("da-visit"); } catch (e) { /* storage blocked: count as a GET only */ }
    var first = seen !== day;
    fetch("/api/visits", { method: first ? "POST" : "GET", headers: { "content-type": "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (first && d && d.ok) { try { localStorage.setItem("da-visit", day); } catch (e) { /* ignore */ } } show(d); })
      .catch(function () { /* no counter: say nothing */ });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
