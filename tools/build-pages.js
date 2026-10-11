#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — static listing/era/sitemap prerenderer
   (Stage 1 of the site overhaul.)

   Companion to tools/build-chapters.js. Where that tool bakes each chapter
   into a crawlable static page, THIS tool bakes the listing pages and the
   per-era pages that were previously mounted only by client-side JS (and so
   rendered empty to a plain HTTP fetch / to crawlers and social unfurlers).

   It reads the SAME single source of truth the JS uses — docs/assets/data.js
   (+ emblems.js, plates.js) — so the static output can never drift from the
   data. No framework, no bundler; same window-shim + template pattern as
   build-chapters.js.

   What it does, idempotently (safe to re-run; overwrites from source):
     1. Injects baked HTML between <!--build:NAME:start/end--> markers in
        index.html (#spine), eras.html (#ages), themes.html (#themes-list),
        and traditions.html (#trad-list).
     2. Writes one static page per era to docs/eras/<slug>.html, with per-era
        <title>/description/canonical/OG/Twitter + BreadcrumbList JSON-LD.
     3. Regenerates docs/sitemap.xml from data.js (home, listings, every era,
        every published chapter) so it can never go stale by hand again.

   Run after any data.js/emblems.js/plates.js change (and after
   build-chapters.js):
       node tools/build-pages.js
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const SEO = require("./seo");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const SITE = "https://getconexto.com";

// --- load the browser authoring files in a window-shim sandbox ------------
const noopNode = { textContent: "", appendChild() {}, setAttribute() {} };
const sandbox = {
  window: {},
  document: {
    createElement: () => Object.assign({}, noopNode),
    head: noopNode,
    documentElement: noopNode
  },
  console
};
vm.createContext(sandbox);
for (const f of ["assets/data.js", "assets/emblems.js", "assets/plates.js", "assets/vault-data.js", "assets/pantheon-data.js", "assets/pantheon-art.js", "assets/pilgrimage-data.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
// the chapter bodies live outside the deployed folder (no page loads them; only these tools do)
vm.runInContext(fs.readFileSync(path.join(DOCS, "..", "content", "chapters.js"), "utf8"), sandbox, { filename: "content/chapters.js" });
const A = sandbox.window.ARCHIVE || { eras: [], chapters: [], themes: [] };
const EMBLEMS = sandbox.window.EMBLEMS || {};
const PLATE_ART = sandbox.window.PLATE_ART || {};
const CHAPTERS = sandbox.window.CHAPTERS || {};
const VAULT = sandbox.window.VAULT || { items: [], categories: {} };

// --- helpers (mirroring the retired client-side renderers of archive.js) --
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const clip = (s, n) => {
  s = String(s || "").replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:]$/, "") + "…";
};
const eraBySlug = (slug) => A.eras.find((e) => e.slug === slug) || null;
const chapterFor = (name) =>
  A.chapters.find((c) => c.title.toLowerCase() === String(name).toLowerCase()) || null;

const STATUS = {
  published: { label: "In the archive", cls: "is-published" },
  review: { label: "Awaiting review", cls: "is-review" },
  draft: { label: "In draft", cls: "is-review" },
  planned: { label: "In preparation", cls: "is-planned" }
};
function badge(status, pending) {
  if (pending) return '<span class="badge is-pending">Recently added &middot; pending review</span>';
  const s = STATUS[status] || STATUS.planned;
  return '<span class="badge ' + s.cls + '">' + s.label + "</span>";
}
// tile thumbnail: chapter plate art, else era emblem (same rule the retired archive.js artFor used)
function artFor(ch, era) {
  if (ch && PLATE_ART[ch.id]) return PLATE_ART[ch.id];
  if (era && EMBLEMS[era.slug]) return EMBLEMS[era.slug];
  return "";
}

// replace content between <!--build:NAME:start--> and <!--build:NAME:end-->
function injectBetween(html, name, fragment) {
  const re = new RegExp("(<!--build:" + name + ":start-->)[\\s\\S]*?(<!--build:" + name + ":end-->)");
  if (!re.test(html)) throw new Error("markers for '" + name + "' not found");
  return html.replace(re, "$1\n" + fragment + "\n      $2");
}
function writeIfChanged(file, next) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (prev === next) return false;
  fs.writeFileSync(file, next, "utf8");
  return true;
}

// ---------- 1. fragments for the listing pages ----------------------------

// homepage "Nine Ages" — a chronological timeline (Stage 2; replaces the emblem grid)
function spineFragment() {
  const nodes = A.eras.map((e) =>
    '          <li class="tl-node"><a href="eras/' + encodeURIComponent(e.slug) + '.html">' +
      '<span class="tl-dot" aria-hidden="true"></span>' +
      '<span class="tl-emblem">' + (EMBLEMS[e.slug] || "") + "</span>" +
      '<span class="tl-roman">Era ' + esc(e.num) + "</span>" +
      '<span class="tl-name">' + esc(e.name) + "</span>" +
      '<span class="tl-dates">' + esc(e.dates) + "</span>" +
    "</a></li>"
  ).join("\n");
  return '        <ol class="timeline">\n' + nodes + "\n        </ol>";
}

// eras.html .age list (mirrors the eras.html inline script output)
function agesFragment() {
  return A.eras.map((e) => {
    const tags = e.traditions.map((t) => '<span class="tag">' + esc(t) + "</span>").join("");
    return '      <a class="age" href="eras/' + encodeURIComponent(e.slug) + '.html">' +
      '<div class="num">' + (EMBLEMS[e.slug] || "") + '<span class="numeral">' + esc(e.num) + "</span></div>" +
      "<div><h2>" + esc(e.name) + ' <span class="dates">' + esc(e.dates) + "</span></h2>" +
      '<p class="blurb">' + esc(e.blurb) + "</p>" +
      '<div class="tags">' + tags + "</div></div></a>";
  }).join("\n");
}

// themes.html cards (mirrors the themes.html inline script output)
function themesFragment() {
  return (A.themes || []).map((t) => {
    const ch = t.chapter ? A.chapters.find((c) => c.id === t.chapter) : null;
    const status = ch ? ch.status : "planned";
    const head =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">' +
        '<span style="font-family:var(--font-display);letter-spacing:0.05em;color:var(--parchment);font-size:1.2rem">' + esc(t.name) + "</span>" +
        badge(status, ch && ch.pending) + "</div>";
    // every theme has a side-by-side comparison view (compare.html?theme=<slug>)
    const compareLink = '\n      <p style="margin:0.1rem 0 0.4rem;text-align:right"><a href="compare.html?theme=' + encodeURIComponent(t.slug) + '" style="font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.16em;font-size:0.62rem">&#8646; Compare side by side &rarr;</a></p>';
    if (ch) {
      return '      <a class="card" href="chapters/' + encodeURIComponent(ch.id) + '.html">' + head +
        '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem">' + esc(ch.summary) + "</p></a>" + compareLink;
    }
    return '      <div class="card" style="opacity:0.85;cursor:default">' + head +
      '<p class="muted" style="margin:0.7rem 0 0;font-size:0.95rem;font-style:italic">A dedicated chapter is planned &mdash; but you can already see it compared side by side.</p></div>' + compareLink;
  }).join("\n");
}

// traditions.html tiles (what the retired archive.js renderTraditions drew, unfiltered)
function traditionsRows() {
  const rows = [];
  A.eras.forEach((era) => {
    era.traditions.forEach((name) => {
      const ch = chapterFor(name);
      rows.push({ name, era, status: ch ? ch.status : "planned", chapter: ch });
    });
  });
  rows.sort((a, b) => a.name.localeCompare(b.name));
  return rows;
}
function traditionsFragment() {
  return traditionsRows().map((r) => {
    const href = r.chapter
      ? "chapters/" + encodeURIComponent(r.chapter.id) + ".html"
      : "eras/" + encodeURIComponent(r.era.slug) + ".html";
    return '        <a class="tile" href="' + href + '" data-name="' + esc(r.name) + '" data-era="' + esc(r.era.name) + '">' +
      '<span class="tile-art">' + artFor(r.chapter, r.era) + "</span>" +
      '<span class="tile-name">' + esc(r.name) + "</span>" +
      '<span class="tile-era">Era ' + esc(r.era.num) + " &middot; " + esc(r.era.name) + "</span>" +
      badge(r.status, r.chapter && r.chapter.pending) + "</a>";
  }).join("\n");
}

// ---------- 2. per-era static pages (docs/eras/<slug>.html) ----------------
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%9C%3C/text%3E%3C/svg%3E";
const HEADER = `  <header class="site-header">
    <div class="wrap bar">
      <a class="brand" href="../index.html">
        <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="52" stroke="currentColor" stroke-width="2" opacity="0.5"/>
          <circle cx="60" cy="60" r="40" stroke="currentColor" stroke-width="1.4" stroke-dasharray="1 5"/>
          <path d="M60 24 L64 56 L60 60 L56 56 Z" fill="currentColor"/><path d="M60 96 L56 64 L60 60 L64 64 Z" fill="currentColor"/>
          <path d="M24 60 L56 56 L60 60 L56 64 Z" fill="currentColor"/><path d="M96 60 L64 64 L60 60 L64 56 Z" fill="currentColor"/>
          <circle cx="60" cy="60" r="3" fill="currentColor"/>
        </svg>
        The Divine Archives
      </a>
      <nav>
        <a href="../eras.html" aria-current="page">Eras</a>
        <a href="../traditions.html">Traditions</a>
        <a href="../themes.html">Themes</a>
        <a href="../symbols.html">Symbols</a>
        <a href="../pantheon.html">Pantheon</a>
        <a href="../vault.html">Vault</a>
        <a href="../pilgrimage.html">Pilgrimage</a>
        <a href="../methodology.html">Methodology</a>
        <a href="../about.html">About</a>
      </nav>
    </div>
  </header>`;
const FOOTER = `  <footer class="site-footer">
    <div class="wrap">
      <p class="mark">The Divine Archives</p>
      <nav>
        <a href="../eras.html">Browse by Era</a>
        <a href="../traditions.html">Browse by Tradition</a>
        <a href="../compare.html">Compare Themes</a>
        <a href="../random.html" rel="nofollow">Random Chapter</a>
        <a href="../methodology.html">Methodology</a>
        <a href="../about.html">About</a>
        <a href="https://ko-fi.com/divinearchives" target="_blank" rel="noopener">Support the Archive</a>
      </nav>
      <p class="tiny">A comparative library of the sacred</p>
    </div>
  </footer>`;

function tradTile(name, era) {
  const ch = chapterFor(name);
  const status = ch ? ch.status : "planned";
  const head =
    '<span class="tile-art">' + artFor(ch, era) + "</span>" +
    '<span class="tile-name">' + esc(name) + "</span>" +
    badge(status, ch && ch.pending);
  if (ch) {
    return '        <a class="tile" href="../chapters/' + encodeURIComponent(ch.id) + '.html">' +
      head + '<p class="tile-sum">' + esc(ch.summary) + "</p></a>";
  }
  return '        <div class="tile is-planned">' + head +
    '<p class="tile-sum" style="font-style:italic">A chapter for this tradition is planned but not yet written.</p></div>';
}
function themeTileForEra(ch) {
  return '        <a class="tile" href="../chapters/' + encodeURIComponent(ch.id) + '.html">' +
    '<span class="tile-art">' + artFor(ch, null) + "</span>" +
    '<span class="tile-name">' + esc(ch.title) + "</span>" +
    badge(ch.status, ch.pending) +
    '<p class="tile-sum">' + esc(ch.summary) + "</p></a>";
}
function pageForEra(era) {
  const url = SITE + "/eras/" + era.slug + ".html";
  const fullTitle = era.name + " — The Divine Archives";
  const desc = clip(era.blurb, 155);
  const tiles = era.traditions.map((name) => tradTile(name, era)).join("\n");
  const themeChapters = A.chapters.filter((c) => c.kind === "theme");
  const themeBlock = themeChapters.length
    ? '\n      <p class="eyebrow center" style="margin:2.6rem 0 1.4rem">Comparative themes across this age</p>\n' +
      '      <div class="tiles">\n' + themeChapters.map(themeTileForEra).join("\n") + "\n      </div>"
    : "";
  const objs = VAULT.items.filter((i) => i.status === "published" && i.era === era.slug).sort((a, b) => (a.year || 0) - (b.year || 0));
  const vaultBlock = objs.length
    ? '\n      <div class="vault-links" id="in-the-vault">\n      <p class="eyebrow center" style="margin:2.6rem 0 .6rem">From the Vault &middot; objects of this age</p>\n' +
      '      <p class="tiny center" style="margin:0 0 1.2rem">Manuscripts, inscriptions and relics made in this age, in date order. Each is also listed on the chapters it belongs to. <a href="../vault.html#era-' + esc(era.slug) + '">See them in the Vault &rarr;</a></p>\n' +
      '      <div class="vl-list">\n' + objs.map((i) => {
        const chs = (i.chapters || []).map((id) => A.chapters.find((c) => c.id === id && c.status === "published")).filter(Boolean);
        return '        <a class="vl-item" href="../vault/' + i.slug + '.html"><span class="vl-t">' + esc(i.title) + "</span>" +
          '<span class="vl-m">' + esc(VAULT.categories[i.category] || "") + " &middot; " + esc(i.dated) + "</span>" +
          '<span class="vl-s">' + esc(clip(i.summary, 150)) + "</span>" +
          (chs.length ? '<span class="vl-m" style="margin-top:.4rem">Chapters: ' + chs.map((c) => esc(c.title)).join(", ") + "</span>" : "") + "</a>";
      }).join("\n") + "\n      </div></div>"
    : "";
  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Archive", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "The Nine Ages", item: SITE + "/eras.html" },
      { "@type": "ListItem", position: 3, name: era.name, item: url }
    ]
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="../assets/archive.css" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Divine Archives" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
${SEO.shareTags("era-" + era.slug, era.name + " — The Divine Archives")}  <meta name="twitter:card" content="${SEO.twitterCard("era-" + era.slug)}" />
  <meta name="twitter:title" content="${esc(fullTitle)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <script type="application/ld+json">${jsonld}</script>
</head>
<body>
<a class="skip-link" href="#era-mount">Skip to content</a>
<div class="page">
${HEADER}

  <main id="era-mount">
    <div class="page-head">
      <p class="crumb" style="justify-content:center">
        <a href="../index.html">Archive</a><span class="sep">/</span>
        <a href="../eras.html">The Nine Ages</a>
        <span class="sep">/</span><span>${esc(era.name)}</span>
      </p>
      ${EMBLEMS[era.slug] || ""}
      <p class="eyebrow">Era ${esc(era.num)} &middot; ${esc(era.dates)}</p>
      <h1>${esc(era.name)}</h1>
      <p class="lede">${esc(era.blurb)}</p>
    </div>
    <section class="wrap" style="max-width:52rem;padding-block:2rem 1rem">
      <div class="ornament" style="margin-bottom:2rem"><span>&#10022;</span></div>
      <p class="eyebrow center" style="margin-bottom:1.4rem">Traditions of this age</p>
      <div class="tiles">
${tiles}
      </div>${vaultBlock}${themeBlock}
    </section>
  </main>

${FOOTER}
</div>
<script src="../assets/ambient.js?v=2" defer></script>
<script src="../site-config.js" defer></script>
</body>
</html>
`;
}

// ---------- 2b. content search: index + search page -----------------------
function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&hellip;/g, "…").replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}
function buildSearchIndex() {
  const docs = A.chapters.filter((c) => c.status === "published").map((c) => ({
    id: c.id,
    title: c.title,
    era: c.eraLabel || "",
    summary: c.summary || "",
    text: clip(stripHtml((CHAPTERS[c.id] && CHAPTERS[c.id].html) || ""), 3200)
  }));
  VAULT.items.filter((i) => i.status === "published").forEach((i) => {
    const era = eraBySlug(i.era);
    let md = "";
    try { md = fs.readFileSync(path.join(ROOT, i.source), "utf8"); } catch (e) { md = ""; }
    docs.push({
      id: i.id, url: "vault/" + i.slug + ".html", title: i.title,
      era: "The Vault" + (era ? " · " + era.name : ""),
      summary: i.summary || "",
      text: clip(md.replace(/^#.*$/gm, " ").replace(/[*_>`#]/g, "").replace(/https?:\/\/\S+/g, " "), 3200)
    });
  });
  // The Pantheon: one entry per figure, opening its detail view
  const PANTHEON = sandbox.window.PANTHEON || { figures: [], traditions: {}, kinds: {} };
  PANTHEON.figures.forEach((f) => {
    docs.push({
      id: "fig-" + f.id, url: "pantheon.html#" + f.id, title: f.n,
      era: "The Pantheon · " + ((PANTHEON.traditions[f.t] || {}).name || ""),
      summary: f.e + ". " + f.d,
      text: [f.d, f.c || "", PANTHEON.kinds[f.k] || ""].join(" ")
    });
  });
  return JSON.stringify(docs);
}
// root-level header/footer (root-relative links) for search.html
const HEADER_ROOT = HEADER.replace(/\.\.\//g, "").replace('aria-current="page"', "");
const FOOTER_ROOT = FOOTER.replace(/\.\.\//g, "");
function searchPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Search — The Divine Archives</title>
  <meta name="description" content="Search the full text of every chapter in The Divine Archives." />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="assets/archive.css" />
</head>
<body>
<a class="skip-link" href="#search-mount">Skip to content</a>
<div class="page">
${HEADER_ROOT}

  <div class="page-head">
    <p class="crumb" style="justify-content:center"><a href="index.html">Archive</a><span class="sep">/</span><span>Search</span></p>
    <p class="eyebrow">Seek and find</p>
    <h1>Search the Archive</h1>
    <p class="lede">Every chapter, searched by title and full text.</p>
  </div>

  <main id="search-mount" class="wrap" style="max-width:52rem;padding-top:1rem">
    <div class="search center" style="margin:0 auto 2rem"><form onsubmit="return false" role="search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <input id="q" type="search" placeholder="Search the archives&hellip;" aria-label="Search the archives" autofocus /></form></div>
    <p id="search-status" class="eyebrow center" style="margin-bottom:1.4rem"></p>
    <div id="results" style="display:flex;flex-direction:column;gap:0.9rem"></div>
  </main>

${FOOTER_ROOT}
</div>
<script>
  (function () {
    var input = document.getElementById("q");
    var results = document.getElementById("results");
    var statusEl = document.getElementById("search-status");
    var INDEX = [];
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
    function snippet(d, term) {
      var body = d.text || d.summary || "";
      var i = term ? body.toLowerCase().indexOf(term) : -1;
      var s = i < 0 ? (d.summary || body).slice(0, 180) : body.slice(Math.max(0, i - 70), i + 110);
      s = esc(s.trim());
      if (term) s = s.replace(new RegExp("(" + term.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") + ")", "ig"), "<mark>$1</mark>");
      return (i > 70 ? "&hellip;" : "") + s + "&hellip;";
    }
    function draw(q) {
      q = (q || "").trim();
      results.innerHTML = "";
      if (!q) { statusEl.textContent = ""; return; }
      var terms = q.toLowerCase().split(/\\s+/);
      var hits = INDEX.map(function (d) {
        var t = d.title.toLowerCase(), sm = d.summary.toLowerCase(), tx = d.text.toLowerCase();
        var score = 0;
        terms.forEach(function (w) {
          if (t.indexOf(w) !== -1) score += 10;
          if (sm.indexOf(w) !== -1) score += 4;
          if (tx.indexOf(w) !== -1) score += 1;
        });
        return { d: d, score: score };
      }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
      statusEl.textContent = hits.length + (hits.length === 1 ? " result" : " results") + " found";
      hits.forEach(function (x) {
        var d = x.d, a = document.createElement("a");
        a.className = "card"; a.href = d.url || ("chapters/" + encodeURIComponent(d.id) + ".html");
        a.innerHTML = '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap">' +
          '<span style="font-family:var(--font-display);letter-spacing:0.05em;color:var(--parchment);font-size:1.15rem">' + esc(d.title) + "</span>" +
          '<span class="eyebrow" style="margin:0">' + esc(d.era) + "</span></div>" +
          '<p class="muted" style="margin:0.6rem 0 0;font-size:0.92rem;line-height:1.6">' + snippet(d, terms[0]) + "</p>";
        results.appendChild(a);
      });
      if (!hits.length) results.innerHTML = '<p class="notice">Nothing matches &ldquo;' + esc(q) + '&rdquo;.</p>';
    }
    fetch("assets/search-index.json").then(function (r) { return r.json(); }).then(function (data) {
      INDEX = data;
      var pre = new URLSearchParams(location.search).get("q") || "";
      if (pre) { input.value = pre; draw(pre); }
    }).catch(function () { statusEl.textContent = "Search index could not be loaded."; });
    input.addEventListener("input", function () { draw(input.value); });
  })();
</script>
<script src="assets/ambient.js?v=2" defer></script>
<script src="site-config.js" defer></script>
</body>
</html>
`;
}

// ---------- 2c. the Pilgrimage: the list of sites, and one page per live site ----------
// Data: docs/assets/pilgrimage-data.js. A "live" site gets docs/pilgrimage/<id>.html, a shell that
// loads docs/pilgrimage/engine.js with the site's module (docs/pilgrimage/sites/<id>/site.js).
// A "preview" site gets the same page (noindex) but stays off the menu: the list below shows it as
// coming, unlinked, and the museum's gate (docs/museum/app.js) lists only "live" sites.
const PILG = sandbox.window.PILGRIMAGE || { sites: [] };
const LABELS = { R: ["Reconstruction", "Lost or destroyed: what you walk is a labelled reconstruction."], C: ["Claimed site", "A claimed or traditional site: the dispute over it is shown on site."], S: ["Exterior only", "Religiously restricted or sensitive: shown from outside only."] };
function pilgrimageListPage() {
  const chTitle = (id) => { const c = A.chapters.find((x) => x.id === id); return c ? c.title : id; };
  const vTitle = (id) => { const v = (VAULT.items || []).find((x) => x.id === id); return v ? v.title : id; };
  const groups = [{ slug: null, title: "The Rotunda", sub: "comparative themes" }].concat(A.eras.map((e) => ({ slug: e.slug, title: "Era " + e.num + " · " + e.name, sub: e.dates })));
  const card = (s) => {
    const live = s.status === "live";
    const tags = (live ? '<span class="pg-tag live">Open · walk it</span>' : '<span class="pg-tag">Coming</span>') +
      (s.label ? `<span class="pg-tag ${esc(s.label)}" title="${esc(LABELS[s.label][1])}">${esc(LABELS[s.label][0])}</span>` : "") +
      (live && s.pending ? '<span class="pg-tag" style="border-color:var(--warn);color:var(--warn)">Recently added · pending review</span>' : "");
    const chs = (s.chapters || []).map((id) => `<a href="chapters/${esc(id)}.html">${esc(chTitle(id))}</a>`).join(", ");
    const vs = (s.vault || []).map((id) => { const v = (VAULT.items || []).find((x) => x.id === id); return v ? `<a href="vault/${esc(v.slug)}.html">${esc(v.title)}</a>` : ""; }).filter(Boolean).join(", ");
    return `        <li class="pg-site${live ? " is-live" : ""}">${tags}<h3>${live ? `<a href="pilgrimage/${esc(s.id)}.html">${esc(s.name)}</a>` : esc(s.name)}</h3>` +
      (s.blurb && live ? `<p>${esc(s.blurb)}</p>` : "") +
      (chs ? `<p class="pg-meta">Chapters: ${chs}</p>` : "") + (vs ? `<p class="pg-meta">Vault: ${vs}</p>` : "") +
      (live ? `<a class="pg-go" href="pilgrimage/${esc(s.id)}.html">Enter the site</a>` : "") + "</li>";
  };
  const sections = groups.map((g) => {
    const list = PILG.sites.filter((s) => (s.era || null) === g.slug);
    if (!list.length) return "";
    return `    <section class="pg-era"><h2>${esc(g.title)}<span>${esc(g.sub)}</span></h2>\n      <ul class="pg-sites">\n${list.map(card).join("\n")}\n      </ul>\n    </section>`;
  }).join("\n");
  const nLive = PILG.sites.filter((s) => s.status === "live").length;
  const url = SITE + "/pilgrimage.html", title = "The Pilgrimage — The Divine Archives";
  const desc = "Walk inside the world's sacred sites, modelled from published surveys and linked to the archive's chapters and Vault objects. " + nLive + " open, " + (PILG.sites.length - nLive) + " in preparation.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="assets/archive.css" />
  <link rel="stylesheet" href="pilgrimage/pilgrimage.css?v=1" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="The Divine Archives" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary" />
</head>
<body>
<a class="skip-link" href="#pg-list">Skip to content</a>
<div class="page">
${HEADER_ROOT.replace('<a href="pilgrimage.html">', '<a href="pilgrimage.html" aria-current="page">')}

  <main id="pg-list">
    <div class="page-head">
      <p class="crumb" style="justify-content:center"><a href="index.html">Archive</a><span class="sep">/</span><span>The Pilgrimage</span></p>
      <p class="eyebrow">Walkable sacred sites</p>
      <h1>The Pilgrimage</h1>
      <p class="lede">Step through the golden portal in the museumStep through a portal from the museum&rsquo;s Rotunda and walkrsquo;s entrance hall and walk inside the places themselves, modelled from published surveys. Each holds copies of its relics, linked to the Vault and to the chapters. Sites open one or two at a time.</p>
    </div>
    <section class="wrap" style="max-width:64rem;padding-block:1rem 2rem">
      <p class="tiny center" style="margin:0 auto;max-width:44rem">Every site is our own model. No one else&rsquo;s photographs or 3D scans are used; published plans and measurements are references only. What is measured, what is approximate and what is unknown is said on site, by the same evidence standard as the chapters.</p>
      <ul class="pg-key">
        <li><span class="pg-tag R">Reconstruction</span> ${esc(LABELS.R[1])}</li>
        <li><span class="pg-tag C">Claimed site</span> ${esc(LABELS.C[1])}</li>
        <li><span class="pg-tag S">Exterior only</span> ${esc(LABELS.S[1])}</li>
      </ul>
${sections}
      <p class="tiny center" style="margin-top:2.4rem">The way in: <a href="museum.html">the museum</a>, through the golden portal in its entrance hall. See the <a href="methodology.html">methodology</a> for the sourcing standard.</p>
    </section>
  </main>

${FOOTER_ROOT}
</div>
<script src="assets/ambient.js?v=2" defer></script>
<script src="site-config.js" defer></script>
</body>
</html>
`;
}
function pilgrimageSitePage(s) {
  const title = s.name + " — The Pilgrimage · The Divine Archives";
  const chs = (s.chapters || []).map((id) => { const c = A.chapters.find((x) => x.id === id); return c ? `<li><a href="../chapters/${esc(id)}.html">${esc(c.title)}</a></li>` : ""; }).join("");
  const vs = (s.vault || []).map((id) => { const v = (VAULT.items || []).find((x) => x.id === id); return v ? `<li><a href="../vault/${esc(v.slug)}.html">${esc(v.title)}</a></li>` : ""; }).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(s.blurb || s.name)}" />
  <!-- A walkable model is an entry point, like the museum: the chapter and Vault pages are canonical. -->
  <meta name="robots" content="noindex, follow" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="../assets/archive.css" />
  <link rel="stylesheet" href="../museum/museum.css?v=7" />
  <link rel="stylesheet" href="pilgrimage.css?v=1" />
  <script type="importmap">{ "imports": { "three": "../assets/vendor/three/three.module.min.js" } }</script>
</head>
<body class="museum-page pilgrimage-page">
<a class="skip-link" href="#pg-fallback">Skip to the text version</a>
<div id="mu-stage" aria-hidden="true"></div>
<header class="mu-bar" id="mu-bar" hidden>
  <a class="mu-brand" href="../pilgrimage.html" aria-label="Back to the list of Pilgrimage sites">
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="52" stroke="currentColor" stroke-width="2" opacity="0.5"/><path d="M60 24 L64 56 L60 60 L56 56 Z M60 96 L56 64 L60 60 L64 64 Z M24 60 L56 56 L60 60 L56 64 Z M96 60 L64 64 L60 60 L64 56 Z" fill="currentColor"/></svg>
    <span>The Pilgrimage</span>
  </a>
  <p class="mu-where" id="mu-where" aria-live="polite"></p>
  <nav class="mu-tools" aria-label="Site tools">
    <button type="button" id="mu-guide-btn" aria-controls="mu-guide" aria-expanded="false"><span class="mu-l">Guide</span><span class="mu-s">Guide</span></button>
    <button type="button" id="mu-help-btn">Help</button>
    <button type="button" id="mu-sound-btn" aria-pressed="true"><span class="mu-l">Sound on</span><span class="mu-s">Sound</span></button>
    <button type="button" id="mu-motion-btn" aria-pressed="false"><span class="mu-l">Reduce view motion</span><span class="mu-s">View motion</span></button>
  </nav>
</header>
<div class="mu-intro" id="mu-intro" hidden>
  <div class="mu-intro-card" role="dialog" aria-modal="true" aria-labelledby="mu-intro-h">
    <p class="mu-kicker">The Pilgrimage · ${esc(s.place || "")}</p>
    ${s.pending ? '<p class="pg-pending">Recently added · pending full review</p>' : ""}
    <h1 id="mu-intro-h">${esc(s.name)}</h1>
    <p>${esc(s.blurb || "")}</p>
    <p class="mu-note">Sizes, slopes and proportions come from published survey measurements; the stone is drawn in code, not photographed. Gold markers open notes on what you see, including <strong>what is measured, what is approximate and what is unknown</strong>. Objects in the cases are renditions, not replicas.</p>
    <div class="mu-keys" id="mu-keys"></div>
    <div class="mu-intro-actions">
      <button type="button" class="mu-enter" id="mu-enter">Enter</button>
    </div>
    <p class="mu-small" id="mu-status" aria-live="polite">Preparing the site&hellip;</p>
  </div>
</div>
<div class="mu-reticle" id="mu-reticle" hidden aria-hidden="true"></div>
<p class="mu-tag" id="mu-tag" hidden aria-hidden="true"></p>
<div class="mu-fade" id="mu-fade" aria-hidden="true"></div>
<div class="pg-nav" id="pg-nav" hidden><button type="button" id="pg-back">&lsaquo; Walk back</button><button type="button" id="pg-walk" aria-pressed="false">Walk on &rsaquo;</button></div>
<p class="pg-busy" id="pg-busy" hidden>Building the next section&hellip;</p>
<aside class="mu-guide" id="mu-guide" hidden aria-label="Guide">
  <div class="mu-guide-head"><h2 id="mu-guide-h">Guide</h2><button type="button" class="mu-x" id="mu-guide-x" aria-label="Close the guide">&times;</button></div>
  <div id="mu-guide-body"></div>
</aside>
<div class="mu-card-wrap" id="mu-card-wrap" hidden>
  <div class="mu-card" id="mu-card" role="dialog" aria-modal="true" aria-labelledby="mu-card-h" tabindex="-1">
    <button type="button" class="mu-x" id="mu-card-x" aria-label="Close">&times;</button>
    <div id="mu-card-body"></div>
    <p class="mu-card-foot">A model, not a photograph. The linked chapter and Vault pages carry the full sources and the evidence verdict.</p>
  </div>
</div>
<main class="pg-fallback" id="pg-fallback">
  <div class="wrap">
    <p class="eyebrow">The Pilgrimage${s.pending ? " · recently added, pending full review" : ""}</p>
    <h1>${esc(s.name)}</h1>
    <p class="lede">${esc(s.blurb || "")}</p>
    <p>This site is a walkable 3D model and needs a browser with WebGL. Its notes draw on these pages of the archive:</p>
    ${chs ? `<h3>Chapters</h3><ul>${chs}</ul>` : ""}${vs ? `<h3>Vault</h3><ul>${vs}</ul>` : ""}
    <p class="tiny"><a href="../pilgrimage.html">All Pilgrimage sites</a> · <a href="../museum.html">The museum</a></p>
  </div>
</main>
<script type="module">import { start } from "./engine.js?v=7"; start(${JSON.stringify(s.id)});</script>
<script src="../site-config.js" defer></script>
</body>
</html>
`;
}

// ---------- 2b. the Pantheon ------------------------------------------------
// Prerenders the directory that docs/assets/pantheon.js used to build in the
// browser: the toolbar, the count line and every figure card (emblem, name,
// tradition, contested flag), so the 199 figures are in the page itself.
// pantheon.js now attaches to this markup instead of creating it; the page
// looks and behaves the same. Each figure's epithet and description also go
// into an ItemList JSON-LD block (the detail view itself stays a dialog).
const PANTHEON = sandbox.window.PANTHEON || { figures: [], traditions: {}, kinds: {} };
const PANTHEON_ART = sandbox.window.PANTHEON_ART;
const pantheonFigures = () => PANTHEON.figures.slice().sort((a, b) => a.n.localeCompare(b.n, "en"));
function pantheonFragment() {
  const P = PANTHEON;
  const kinds = [["all", "All"]].concat(Object.keys(P.kinds).map((k) => [k, P.kinds[k]]));
  const trads = Object.keys(P.traditions).sort((a, b) => P.traditions[a].name.localeCompare(P.traditions[b].name, "en"));
  const figs = pantheonFigures();
  const bar =
    '      <div class="pn-bar">' +
    '<label class="pn-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>' +
    '<input type="search" placeholder="Search Characters..." aria-label="Search characters" autocomplete="off" spellcheck="false"></label>' +
    '<div class="pn-pills" role="group" aria-label="Filter by kind">' +
    kinds.map((k) => `<button type="button" class="pn-pill" data-k="${esc(k[0])}" aria-pressed="${k[0] === "all"}">${esc(k[1])}</button>`).join("") +
    "</div>" +
    '<select class="pn-trad" aria-label="Filter by tradition"><option value="all">Every tradition</option>' +
    trads.map((t) => `<option value="${esc(t)}">${esc(P.traditions[t].name)}</option>`).join("") +
    "</select></div>";
  const count = `      <p class="pn-count" role="status" aria-live="polite">${figs.length} figures from ${Object.keys(P.traditions).length} traditions</p>`;
  const cards = figs.map((f) => {
    const tr = P.traditions[f.t];
    return `        <li class="pn-cell"><a class="pn-card" href="#${esc(f.id)}" data-id="${esc(f.id)}" style="--acc:${tr.color}">` +
      `<span class="pn-art">${PANTHEON_ART.svg(f, tr.color, "c" + f.id)}</span>` +
      `<span class="pn-name">${esc(f.n)}</span>` +
      `<span class="pn-badge">${esc(tr.name)}</span>` +
      (f.c ? '<span class="pn-flag" title="Something about this figure is contested">contested</span>' : "") +
      "</a></li>";
  }).join("\n");
  const empty = '      <p class="pn-empty" hidden="">No figure matches that search. Try another name, a tradition, or a word such as <em>sun</em> or <em>underworld</em>.</p>';
  return bar + "\n" + count + "\n      <ul class=\"pn-grid\">\n" + cards + "\n      </ul>\n" + empty;
}
function pantheonJsonLd() {
  const P = PANTHEON;
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Pantheon — gods, spirits and mythic figures",
    url: SITE + "/pantheon.html",
    numberOfItems: P.figures.length,
    itemListElement: pantheonFigures().map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: SITE + "/pantheon.html#" + f.id,
      name: f.n,
      description: P.traditions[f.t].name + " · " + f.e + " — " + f.d
    }))
  };
  // keep "</" out of the inline script
  return '  <script type="application/ld+json">' + JSON.stringify(ld).replace(/<\//g, "<\\/") + "</script>";
}

// ---------- 3. sitemap ----------------------------------------------------
function buildSitemap() {
  // [url, lastmod or null]. lastmod comes from content/dates.json (tools/stamp-dates.js):
  // a chapter's or Vault entry's own date; an era page takes its newest chapter's.
  const urls = [
    "/", "/eras.html", "/themes.html", "/traditions.html", "/about.html",
    "/methodology.html", "/compare.html", "/symbols.html", "/pilgrimage.html"
  ].map((u) => [SITE + u, null]);
  const pub = A.chapters.filter((c) => c.status === "published");
  const mod = (key) => (SEO.dates(key) || {}).modified || null;
  A.eras.forEach((e) => {
    const latest = pub.filter((c) => c.era === e.slug).map((c) => mod(c.id)).filter(Boolean).sort().pop() || null;
    urls.push([SITE + "/eras/" + e.slug + ".html", latest]);
  });
  pub.forEach((c) => urls.push([SITE + "/chapters/" + c.id + ".html", mod(c.id)]));
  // The Vault (manuscripts, relics & contested objects) — see tools/build-vault.js
  const VAULT = sandbox.window.VAULT || { items: [] };
  urls.push([SITE + "/vault.html", null]);
  urls.push([SITE + "/pantheon.html", null]);
  VAULT.items.filter((v) => v.status === "published").forEach((v) => urls.push([SITE + "/vault/" + v.slug + ".html", mod(v.id)]));
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(([u, d]) => "  <url><loc>" + u + "</loc>" + (d ? "<lastmod>" + d + "</lastmod>" : "") + "</url>").join("\n") +
    "\n</urlset>\n";
}

// ============================ run =========================================
const changed = [];

// listing pages
const injections = [
  ["index.html", "spine", spineFragment()],
  ["eras.html", "ages", agesFragment()],
  ["themes.html", "themes", themesFragment()],
  ["traditions.html", "traditions", traditionsFragment()],
  ["pantheon.html", "pantheon", pantheonFragment()],
  ["pantheon.html", "pantheon-ld", pantheonJsonLd()]
];
for (const [file, name, frag] of injections) {
  const p = path.join(DOCS, file);
  const out = injectBetween(fs.readFileSync(p, "utf8"), name, frag);
  if (writeIfChanged(p, out)) changed.push(file);
}

// per-era pages
const eraDir = path.join(DOCS, "eras");
if (!fs.existsSync(eraDir)) fs.mkdirSync(eraDir, { recursive: true });
let eraN = 0;
for (const era of A.eras) {
  if (writeIfChanged(path.join(eraDir, era.slug + ".html"), pageForEra(era))) eraN++;
}

// content search: index + page
const siChanged = writeIfChanged(path.join(DOCS, "assets", "search-index.json"), buildSearchIndex());
const spChanged = writeIfChanged(path.join(DOCS, "search.html"), searchPage());

// the Pilgrimage
const pgChanged = writeIfChanged(path.join(DOCS, "pilgrimage.html"), pilgrimageListPage());
let pgN = 0;
for (const s of PILG.sites.filter((x) => x.status === "live" || x.status === "preview")) { if (writeIfChanged(path.join(DOCS, "pilgrimage", s.id + ".html"), pilgrimageSitePage(s))) pgN++; }
if (pgChanged || pgN) changed.push("pilgrimage (" + PILG.sites.filter((x) => x.status === "live").length + " live)");

// sitemap
const sm = writeIfChanged(path.join(DOCS, "sitemap.xml"), buildSitemap());

console.log(
  "build-pages: listing pages updated [" + (changed.join(", ") || "none") + "]; " +
  "era pages written " + eraN + "/" + A.eras.length + "; " +
  "search-index " + (siChanged ? "updated" : "unchanged") + ", search.html " + (spChanged ? "updated" : "unchanged") + "; " +
  "sitemap " + (sm ? "updated" : "unchanged") +
  " (" + A.eras.length + " eras + " + A.chapters.filter((c) => c.status === "published").length + " chapters)"
);
