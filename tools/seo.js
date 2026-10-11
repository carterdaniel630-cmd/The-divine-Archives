/* ==========================================================================
   THE DIVINE ARCHIVES — shared SEO helpers for the page builders

   - dates(key):     { published, modified } for a chapter or Vault entry, from
                     content/dates.json (kept by tools/stamp-dates.js), or null.
   - shareTags(key, alt): the og:image / twitter:image tags for the card
                     docs/assets/og/<key>.jpg (made by tools/build-og.js), or ""
                     when that card doesn't exist yet.
   - twitterCard(key): "summary_large_image" when the card exists, else "summary".
   - imageUrl(key):  the card's absolute URL, or null.
   - fontTags():     the <head> tags that load the site's web fonts (Cinzel,
                     Cormorant Garamond, EB Garamond), right after archive.css.
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

// The fonts used to be pulled in by an @import at the top of archive.css, which
// made the browser fetch archive.css, then the font stylesheet, before it could
// paint anything. Linking it from the page instead lets both start at once.
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap";
// The stylesheet stays render-blocking on purpose: loading it asynchronously was measured
// (Lighthouse, mobile) and made long chapters lay out twice when the fonts swapped in.
function fontTags() {
  return (
    `  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
    `  <link rel="stylesheet" href="${FONT_CSS}" />\n`
  );
}

module.exports = { SITE, dates, shareTags, twitterCard, imageUrl, fontTags, FONT_CSS };
