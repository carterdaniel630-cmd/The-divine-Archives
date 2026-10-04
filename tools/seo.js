/* ==========================================================================
   THE DIVINE ARCHIVES — shared SEO helpers for the page builders

   - dates(key):     { published, modified } for a chapter or Vault entry, from
                     content/dates.json (kept by tools/stamp-dates.js), or null.
   - shareTags(key, alt): the og:image / twitter:image tags for the card
                     docs/assets/og/<key>.jpg (made by tools/build-og.js), or ""
                     when that card doesn't exist yet.
   - twitterCard(key): "summary_large_image" when the card exists, else "summary".
   - imageUrl(key):  the card's absolute URL, or null.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://getconexto.com";
const OG_DIR = path.join(ROOT, "docs", "assets", "og");
const DATES_FILE = path.join(ROOT, "content", "dates.json");

let DATES = null;
function dates(key) {
  if (DATES === null) DATES = fs.existsSync(DATES_FILE) ? JSON.parse(fs.readFileSync(DATES_FILE, "utf8")) : {};
  const d = DATES[key];
  return d ? { published: d.published, modified: d.modified } : null;
}

const hasCard = (key) => fs.existsSync(path.join(OG_DIR, key + ".jpg"));
const imageUrl = (key) => (hasCard(key) ? `${SITE}/assets/og/${key}.jpg` : null);
const twitterCard = (key) => (hasCard(key) ? "summary_large_image" : "summary");

const escAttr = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

function shareTags(key, alt) {
  const url = imageUrl(key);
  if (!url) return "";
  return (
    `  <meta property="og:image" content="${url}" />\n` +
    `  <meta property="og:image:width" content="1200" />\n` +
    `  <meta property="og:image:height" content="630" />\n` +
    `  <meta property="og:image:alt" content="${escAttr(alt)}" />\n` +
    `  <meta name="twitter:image" content="${url}" />\n`
  );
}

module.exports = { SITE, dates, shareTags, twitterCard, imageUrl };
