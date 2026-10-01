/* The Divine Archives — site settings. One file, loaded by every page.

   cfAnalyticsToken — Cloudflare Web Analytics site token. Empty = analytics off (nothing loads).
   To turn it on: Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site
   (getconexto.com) → copy the token from the snippet it shows ({"token": "…"}) and paste it
   between the quotes below. Cloudflare Web Analytics sets no cookies and stores no personal data.
   This file lives at the site root, outside /assets/, so a change reaches visitors on their next
   page load rather than after the assets' one-day cache. */
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
