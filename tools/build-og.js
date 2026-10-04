#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — share images (Open Graph / Twitter cards)

   Renders one 1200×630 JPEG per page type into docs/assets/og/:
     site.jpg              the archive's compass emblem (home and listing pages)
     era-<slug>.jpg        each era's emblem (the per-era pages)
     <chapter id>.jpg      the chapter's own plate (its first one); era emblem if none
     <vault id>.jpg        the Vault object's era emblem and its title
   The art is the archive's existing interpretive SVG (plates.js, emblems.js), so
   no new imagery is introduced. Fonts: Cinzel and Cormorant Garamond (OFL),
   vendored in tools/data/fonts/ so every machine renders the same card.

   Each card's inputs are hashed into docs/assets/og/manifest.json, and only
   cards whose inputs changed are re-rendered, so the build is idempotent and
   needs a browser only when a title, summary label or plate changes:
       node tools/build-og.js            (render what changed)
       node tools/build-og.js --force    (render everything)
   Needs Playwright with Chromium (preinstalled in the cloud sessions). Run it
   before build-chapters / build-pages / build-vault, which add the og:image
   tags for every card that exists.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUTDIR = path.join(DOCS, "assets", "og");
const MANIFEST = path.join(OUTDIR, "manifest.json");
const FONTS = path.join(__dirname, "data", "fonts");
const FORCE = process.argv.includes("--force");
const W = 1200, H = 630;

const noopNode = { textContent: "", appendChild() {}, setAttribute() {} };
const sandbox = {
  window: {},
  document: { createElement: () => Object.assign({}, noopNode), head: noopNode, documentElement: noopNode },
  console
};
vm.createContext(sandbox);
for (const f of ["assets/data.js", "assets/plates.js", "assets/emblems.js", "assets/vault-data.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE || { eras: [], chapters: [] };
const PLATES = sandbox.window.PLATES || {};
const EMBLEMS = sandbox.window.EMBLEMS || {};
const VAULT = sandbox.window.VAULT || { items: [] };

const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const firstSvg = (html) => {
  const m = String(html || "").match(/<svg[\s\S]*?<\/svg>/);
  return m ? m[0] : "";
};
const eraBySlug = (slug) => A.eras.find((e) => e.slug === slug) || null;

// The home page's compass emblem, taken from index.html so the two never drift.
function siteEmblem() {
  const html = fs.readFileSync(path.join(DOCS, "index.html"), "utf8");
  const m = html.match(/<svg class="emblem"[\s\S]*?<\/svg>/);
  return m ? m[0] : "";
}

// ---- the cards ------------------------------------------------------------
const cards = [];
cards.push({
  key: "site",
  art: siteEmblem(),
  eyebrow: "A comparative library of the sacred",
  title: "The Divine Archives",
  sub: "World religion and mythology, era by era, with the evidence kept honest"
});
for (const era of A.eras) {
  cards.push({
    key: "era-" + era.slug,
    art: EMBLEMS[era.slug] || "",
    eyebrow: "The Nine Ages",
    title: era.name,
    sub: era.dates || ""
  });
}
for (const ch of A.chapters.filter((c) => c.status === "published")) {
  const era = ch.era ? eraBySlug(ch.era) : null;
  cards.push({
    key: ch.id,
    art: firstSvg(PLATES[ch.id]) || (era && EMBLEMS[era.slug]) || siteEmblem(),
    eyebrow: era ? era.name : "Comparative theme",
    title: ch.title,
    sub: ""
  });
}
for (const v of VAULT.items.filter((x) => x.status === "published")) {
  const era = eraBySlug(v.era);
  cards.push({
    key: v.id,
    art: (era && EMBLEMS[era.slug]) || siteEmblem(),
    eyebrow: "The Vault" + (era ? " · " + era.name : ""),
    title: v.title,
    sub: v.dated || ""
  });
}

const fontFace = (family, file, style, range) =>
  `@font-face{font-family:"${family}";font-style:${style};font-weight:500;` +
  `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, file)).toString("base64")}) format("woff2");` +
  `unicode-range:${range};}`;
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
const FONT_CSS = [
  fontFace("Cinzel", "cinzel-latin-500-normal.woff2", "normal", LATIN),
  fontFace("Cinzel", "cinzel-latin-ext-500-normal.woff2", "normal", LATIN_EXT),
  fontFace("Cormorant Garamond", "cormorant-garamond-latin-500-normal.woff2", "normal", LATIN),
  fontFace("Cormorant Garamond", "cormorant-garamond-latin-ext-500-normal.woff2", "normal", LATIN_EXT),
  fontFace("Cormorant Garamond", "cormorant-garamond-latin-500-italic.woff2", "italic", LATIN),
  fontFace("Cormorant Garamond", "cormorant-garamond-latin-ext-500-italic.woff2", "italic", LATIN_EXT)
].join("\n");

// Bump when the layout below changes, so every card re-renders.
const TEMPLATE_VERSION = "1";
function cardHtml(c) {
  const long = c.title.length > 34;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${FONT_CSS}
*{margin:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:radial-gradient(110% 120% at 26% 45%,#2a1c10 0%,#170f08 55%,#0e0905 100%);color:#e6dabf;
  font-family:"Cormorant Garamond",Georgia,serif;display:flex;align-items:center;padding:0 72px 0 64px;gap:56px;position:relative}
body::after{content:"";position:absolute;inset:22px;border:1px solid rgba(199,154,84,.35);border-radius:6px;pointer-events:none}
.art{flex:0 0 380px;height:380px;display:flex;align-items:center;justify-content:center;color:#e7c680;
  border:1px solid rgba(199,154,84,.28);border-radius:8px;background:radial-gradient(120% 120% at 50% 32%,#2a1d11 0%,rgba(16,12,9,0) 78%)}
.art svg{width:300px;height:300px}
.text{flex:1;min-width:0}
.eyebrow{font-family:"Cinzel",serif;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#c79a54;margin-bottom:22px}
h1{font-family:"Cinzel",serif;font-weight:500;font-size:${long ? 54 : 66}px;line-height:1.12;color:#f0e4c8;letter-spacing:.01em}
.sub{font-style:italic;font-size:32px;line-height:1.3;color:#cdbb96;margin-top:22px}
.foot{position:absolute;left:64px;right:72px;bottom:52px;display:flex;justify-content:space-between;
  font-family:"Cinzel",serif;font-size:20px;letter-spacing:.16em;color:#9c8a68;text-transform:uppercase}
.foot b{font-weight:500;color:#c79a54}
</style></head><body>
<div class="art">${c.art}</div>
<div class="text">
  <p class="eyebrow">${esc(c.eyebrow)}</p>
  <h1>${esc(c.title)}</h1>
  ${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ""}
</div>
<div class="foot"><b>The Divine Archives</b><span>getconexto.com</span></div>
</body></html>`;
}

const hashCard = (c) =>
  crypto.createHash("sha1").update(TEMPLATE_VERSION + "\0" + JSON.stringify(c)).digest("hex").slice(0, 16);

(async () => {
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
  const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  const next = {};
  const todo = [];
  for (const c of cards) {
    const h = hashCard(c);
    next[c.key] = h;
    if (FORCE || old[c.key] !== h || !fs.existsSync(path.join(OUTDIR, c.key + ".jpg"))) todo.push(c);
  }
  // drop cards whose page no longer exists
  let removed = 0;
  for (const f of fs.readdirSync(OUTDIR)) {
    if (f.endsWith(".jpg") && !(f.slice(0, -4) in next)) { fs.unlinkSync(path.join(OUTDIR, f)); removed++; }
  }

  if (todo.length) {
    let chromium;
    try { ({ chromium } = require("playwright")); }
    catch (e) {
      console.error("build-og: " + todo.length + " card(s) need rendering but Playwright is not installed.");
      process.exit(1);
    }
    const launch = {};
    if (fs.existsSync("/opt/pw-browsers/chromium")) {
      // use whichever Chromium build is installed, whatever Playwright version is present
      const dir = fs.readdirSync("/opt/pw-browsers").find((d) => /^chromium-\d+$/.test(d));
      const exe = dir && path.join("/opt/pw-browsers", dir, "chrome-linux", "chrome");
      if (exe && fs.existsSync(exe)) launch.executablePath = exe;
    }
    const browser = await chromium.launch(launch);
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    for (const c of todo) {
      await page.setContent(cardHtml(c), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(OUTDIR, c.key + ".jpg"), type: "jpeg", quality: 82 });
    }
    await browser.close();
  }

  const text = JSON.stringify(next, null, 1) + "\n";
  if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== text) fs.writeFileSync(MANIFEST, text, "utf8");
  console.log(`build-og: ${cards.length} cards; rendered ${todo.length}` + (removed ? `; removed ${removed}` : "") + " -> docs/assets/og/");
})();
