#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — The Vault prerenderer
   Bakes the Vault section (manuscripts, relics & contested objects) into
   static, crawlable HTML:
     docs/vault.html                 — the section index (published + queued)
     docs/vault/<slug>.html          — one page per published item
   Sources: docs/assets/vault-data.js (registry) + /vault/*.md (entries, same
   evidence-honesty template as the chapters). Each item page carries the study
   viewer mount (docs/assets/vault/study.js), with a static fallback listing the
   holding institution's own viewers so the page is useful without JavaScript.

   Re-run whenever an entry or the registry changes:
       node tools/build-vault.js
   then `node tools/build-pages.js` to refresh the sitemap. Idempotent.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUTDIR = path.join(DOCS, "vault");
const SITE = "https://getconexto.com";

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(DOCS, "assets/vault-data.js"), "utf8"), sandbox, { filename: "vault-data.js" });
const V = sandbox.window.VAULT;

// ---------- helpers --------------------------------------------------------
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n) => {
  s = String(s || "").replace(/\s+/g, " ").trim();
  return s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)).replace(/[,;:]$/, "") + "…";
};
function inline(s) {
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`);
  // bold first (allowing *italic* nested inside, e.g. **a *b***), then italic
  s = s.replace(/\*\*(.+?)\*\*(?!\*)/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;])/g, (m, pre, u) => `${pre}<a href="${u}" rel="noopener">${u}</a>`);
  return s;
}

// ---------- markdown -> html (the subset the entries use) ------------------
function renderBlocks(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (!ln.trim()) { i++; continue; }
    if (/^###\s+/.test(ln)) { out.push(`<h3>${inline(ln.replace(/^###\s+/, ""))}</h3>`); i++; continue; }
    if (/^---\s*$/.test(ln)) { i++; continue; }
    if (/^>/.test(ln)) { // blockquote; "> " blank lines split stanzas
      const q = [];
      while (i < lines.length && /^>/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      const stanzas = q.join("\n").split(/\n\s*\n/).map((st) => st.split("\n").map(inline).join("<br />"));
      out.push(`<blockquote class="vault-text">${stanzas.map((s) => `<p>${s}</p>`).join("")}</blockquote>`);
      continue;
    }
    if (/^\d+\.\s+/.test(ln)) { // numbered list
      const items = [];
      while (i < lines.length && (/^\d+\.\s+/.test(lines[i]) || (/^\s+\S/.test(lines[i]) && items.length))) {
        if (/^\d+\.\s+/.test(lines[i])) items.push(lines[i].replace(/^\d+\.\s+/, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push("<ol>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ol>");
      continue;
    }
    if (/^-\s+/.test(ln)) { // bullet list with indented continuation lines
      const items = [];
      while (i < lines.length && (/^-\s+/.test(lines[i]) || (/^\s+\S/.test(lines[i]) && items.length))) {
        if (/^-\s+/.test(lines[i])) items.push(lines[i].replace(/^-\s+/, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push("<ul>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ul>");
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(-\s+|\d+\.\s+|>|###\s)/.test(lines[i])) { para.push(lines[i].trim()); i++; }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

function renderEvidence(content) {
  // bold-only lines open the three boxes: supported / not supported / open
  const classes = ["supported", "unsupported", "open"];
  const groups = [];
  content.split("\n").forEach((ln) => {
    const m = ln.match(/^\*\*([^*]+)\*\*\s*$/);
    if (m) groups.push({ head: m[1], body: [] });
    else if (groups.length) groups[groups.length - 1].body.push(ln);
  });
  let h = '<div class="evidence">\n  <div class="evidence-head">&#10022; The evidence, honestly</div>';
  groups.forEach((g, idx) => {
    h += `\n  <div class="ev ${classes[idx] || "open"}"><h4>${inline(g.head)}</h4>${renderBlocks(g.body.join("\n"))}</div>`;
  });
  return h + "\n</div>";
}

function renderSources(content) {
  let h = '<div class="sources">\n  <h3>Sources</h3>';
  let items = [];
  const flush = () => { if (items.length) { h += "<ul>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ul>"; items = []; } };
  content.split("\n").forEach((ln) => {
    if (/^\*[^*].*\*\s*$/.test(ln.trim())) { flush(); h += `<h4>${inline(ln.trim().replace(/^\*|\*$/g, ""))}</h4>`; }
    else if (/^-\s+/.test(ln)) items.push(ln.replace(/^-\s+/, ""));
    else if (/^\s+\S/.test(ln) && items.length) items[items.length - 1] += " " + ln.trim();
  });
  flush();
  return h + "\n</div>";
}

// returns { title, lead: [html paragraphs], sections: [{heading, html}] }
function renderEntry(mdPath) {
  const raw = fs.readFileSync(path.join(ROOT, mdPath), "utf8").replace(/\r\n/g, "\n");
  const title = (raw.match(/^#\s+(.+)$/m) || [, ""])[1].trim();
  const body = raw.split("\n").filter((ln) => !/^#\s+/.test(ln) && !/^\*Vault entry.*\*\s*$/.test(ln)).join("\n");
  const parts = body.split(/\n##\s+/);
  const lead = parts[0].trim().split(/\n\s*\n/).filter(Boolean).map((p, i) =>
    `<p${i === 0 ? ' class="lead"' : ""}>${inline(p.replace(/\n/g, " "))}</p>`);
  const sections = parts.slice(1).map((seg) => {
    const nl = seg.indexOf("\n");
    const heading = (nl === -1 ? seg : seg.slice(0, nl)).trim();
    const content = nl === -1 ? "" : seg.slice(nl + 1).trim();
    const hl = heading.toLowerCase();
    if (hl.startsWith("the evidence")) return { heading, html: renderEvidence(content) };
    if (hl === "sources") return { heading, html: renderSources(content) };
    return { heading, html: `<h2>${inline(heading)}</h2>\n${renderBlocks(content)}` };
  });
  return { title, lead, sections };
}

// ---------- shared chrome ---------------------------------------------------
function header(rel) {
  return `  <header class="site-header">
    <div class="wrap bar">
      <a class="brand" href="${rel}index.html">
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
        <a href="${rel}eras.html">Eras</a>
        <a href="${rel}traditions.html">Traditions</a>
        <a href="${rel}themes.html">Themes</a>
        <a href="${rel}symbols.html">Symbols</a>
        <a href="${rel}vault.html" aria-current="page">Vault</a>
        <a href="${rel}methodology.html">Methodology</a>
        <a href="${rel}about.html">About</a>
      </nav>
    </div>
  </header>`;
}
function footer(rel) {
  return `  <footer class="site-footer">
    <div class="wrap">
      <p class="mark">The Divine Archives</p>
      <nav>
        <a href="${rel}eras.html">Browse by Era</a>
        <a href="${rel}traditions.html">Browse by Tradition</a>
        <a href="${rel}vault.html">The Vault</a>
        <a href="${rel}compare.html">Compare Themes</a>
        <a href="${rel}methodology.html">Methodology</a>
        <a href="${rel}about.html">About</a>
        <a href="https://ko-fi.com/divinearchives" target="_blank" rel="noopener">Support the Archive</a>
      </nav>
      <p class="tiny">A comparative library of the sacred</p>
    </div>
  </footer>`;
}
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%9C%3C/text%3E%3C/svg%3E";

function head(title, desc, url, rel, type, extra) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="stylesheet" href="${rel}assets/archive.css" />
  <link rel="stylesheet" href="${rel}assets/vault/vault.css?v=3" />
  <link rel="stylesheet" href="${rel}assets/vault/relic.css?v=6" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="The Divine Archives" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
${extra || ""}</head>`;
}

// ---------- item page -------------------------------------------------------
function studyBlock(item) {
  const s = item.study || {};
  const ext = (s.external || []).map((e) => `<li><a href="${esc(e.href)}" target="_blank" rel="noopener">${esc(e.label)}</a></li>`).join("");
  return `<section class="study" id="study" data-vault-study="${esc(item.id)}" aria-labelledby="study-h">
  <h2 id="study-h">Study the object</h2>
  <p class="study-rights">${esc(s.rights || "")}</p>
  ${ext ? `<p class="eyebrow">The holding institution's own viewers</p><ul class="study-external">${ext}</ul>` : ""}
  <p class="study-noscript">${s.manifest
    ? "The interactive viewer (deep zoom, loupe, ink enhancement, region capture and the AI study packet) needs JavaScript. The scans themselves are always available from the institution linked above."
    : "Paste any IIIF manifest into the viewer to study published images; it needs JavaScript."}</p>
</section>`;
}

function itemPage(item) {
  const e = renderEntry(item.source);
  const cat = V.categories[item.category] || "The Vault";
  const url = `${SITE}/vault/${item.slug}.html`;
  const fullTitle = `${item.title} — The Vault · The Divine Archives`;
  const desc = clip(item.summary, 155);
  const jsonld = JSON.stringify({
    "@context": "https://schema.org", "@type": "Article", headline: e.title || item.title,
    description: desc, url, inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "The Divine Archives", url: SITE + "/" }
  });
  const crumbld = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Archive", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "The Vault", item: SITE + "/vault.html" },
      { "@type": "ListItem", position: 3, name: item.title, item: url }
    ]
  });
  // the object's own words (scroll) and the viewer sit right after the opening scene
  let sectionsHtml = e.sections.map((s) => s.html).join("\n\n");
  const art = item.artifact;
  let relicTop = "";
  if (art && art.type === "tablet") {
    // the entry's Latin/English blockquote becomes the carved tablet (one source for the text)
    sectionsHtml = sectionsHtml.replace(/<blockquote class="vault-text">[\s\S]*?<\/blockquote>/, (bq) =>
      `<section class="relic relic-tablet" data-vault-relic="${esc(item.id)}" data-relic-kind="tablet">\n` +
      `<h3 class="relic-title">${esc(art.title)}</h3><p class="relic-sub">${esc(art.sub)}</p>\n${bq}\n</section>`);
  } else if (art && ["linen", "lance", "crown", "ark", "timeline", "codex", "cards", "inscription"].indexOf(art.type) !== -1) {
    // static fallback: the object's own words (if any) and its documented stations
    const bits = [];
    if (art.words) bits.push(`<p class="s-static-he" lang="${esc(art.lang || "he")}">${esc(art.words.map((w) => w[0]).join(" "))}</p>`);
    if (art.line) bits.push(`<p lang="${esc(art.lineLang || "en")}"><strong>${esc(art.line.map((w) => w[0]).join(" "))}</strong></p>`);
    if (art.pages) bits.push(art.pages.map((pg) => `<p>${pg.h ? `<strong>${esc(pg.h)}.</strong> ` : ""}${esc(pg.t)}${pg.n ? ` <em>${esc(pg.n)}</em>` : ""}</p>`).join(""));
    if (art.hebrew) bits.push(`<p class="s-static-he" lang="he">${esc(art.hebrew.map((w) => w[0]).join(" "))}</p>`);
    if (art.greek) bits.push(`<p lang="grc">${esc(Array.isArray(art.greek) ? art.greek.map((w) => w[0]).join(" ") : art.greek)}</p>`);
    if (art.inscription) bits.push(`<p><strong>${esc(art.inscription)}</strong></p>`);
    if (art.translation) bits.push(`<p><em>${esc(art.translation)}</em></p>`);
    const list = (art.events || art.stops || art.parts || []).concat(art.cards || []).map((x) =>
      `<li><strong>${esc(x.y || x.t)}</strong>${x.s ? " (" + esc(x.s) + ")" : ""}${x.y ? " " + esc(x.t) : ""}: ${esc(x.d)}</li>`).join("");
    relicTop = `<section class="relic relic-${art.type}" data-vault-relic="${esc(item.id)}" data-relic-kind="${art.type}">\n` +
      `<h2 class="relic-title">${esc(art.title)}</h2><p class="relic-sub">${esc(art.sub)}</p>\n<div class="relic-static">${bits.join("")}<ul>${list}</ul></div>\n</section>\n`;
  } else if (art && art.type === "scroll") {
    const txt = (w) => (typeof w === "string" ? w : w[0]);
    const cols = art.columns.map((c) => {
      const lines = (c.lines || []).map((ln) => `<p class="${c.kind === "hebrew" ? "s-static-he" : ""}"${c.kind === "hebrew" ? ' lang="he"' : ""}>${esc(ln.map(txt).join(" "))}</p>`).join("");
      const names = c.kind === "name" ? `<p class="s-static-he" lang="he">${esc(c.square)} &middot; <span lang="phn">${esc(c.paleo)}</span></p>` : "";
      return `<div class="s-static-col"><h4>${esc(c.heading)}</h4>${lines}${names}${c.translation ? `<p><em>${esc(c.translation)}</em></p>` : ""}${c.note ? `<p class="tiny">${esc(c.note)}</p>` : ""}</div>`;
    }).join("\n");
    relicTop = `<section class="relic relic-scroll" data-vault-relic="${esc(item.id)}" data-relic-kind="scroll">\n` +
      `<h2 class="relic-title">${esc(art.title)}</h2><p class="relic-sub">${esc(art.sub)}</p>\n<div class="relic-static">\n${cols}\n</div>\n</section>\n`;
  }
  const body = e.lead.join("\n") + "\n" + relicTop + studyBlock(item) + "\n" + sectionsHtml;
  const fonts = art && (["scroll", "ark", "inscription"].indexOf(art.type) !== -1 || art.lineLang === "he")
    ? '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Hebrew:wght@400;600&family=Noto+Sans+Phoenician&display=swap" />\n'
    : "";
  return `${head(fullTitle, desc, url, "../", "article",
    fonts + `  <script type="application/ld+json">${jsonld}</script>\n  <script type="application/ld+json">${crumbld}</script>\n`)}
<body>
<a class="skip-link" href="#vault-mount">Skip to content</a>
<div class="page">
${header("../")}

  <main id="vault-mount">
    <div class="page-head">
      <p class="crumb" style="justify-content:center">
        <a href="../index.html">Archive</a><span class="sep">/</span>
        <a href="../vault.html">The Vault</a><span class="sep">/</span><span>${esc(item.title)}</span>
      </p>
      <p class="eyebrow">The Vault &middot; ${esc(cat)}</p>
      <h1>${esc(e.title || item.title)}</h1>
      <p style="margin-top:0.6rem"><span class="badge ${item.pending ? "is-pending" : "is-published"}">${item.pending ? "Recently added &middot; pending review" : "In the archive"}</span>
        <button type="button" class="print-btn" onclick="window.print()" title="Save this entry as a PDF">Save as PDF</button></p>
      <dl class="vault-facts">
        <dt>Held</dt><dd>${esc(item.held)}</dd>
        <dt>Date evidence</dt><dd>${esc(item.dated)}</dd>
      </dl>
    </div>
    <section class="wrap article">
${item.pending ? `      <div class="pending-banner"><strong>Recently added &middot; pending full review.</strong> This entry is live but has not yet completed the keeper&rsquo;s review pass. It is sourced to the project&rsquo;s standard, but wording and detail may still change. The tag is removed once the entry is cleared.</div>\n` : ""}${body}
      <p class="print-only">From <strong>The Divine Archives</strong> &middot; ${url}</p>
      <div class="chapter-nav"><a href="../vault.html">&larr; The Vault</a><a href="../eras.html">Browse the ages &rarr;</a></div>
    </section>
  </main>

${footer("../")}
</div>
<script src="../assets/vendor/openseadragon/openseadragon.min.js" defer></script>
<script src="../assets/vault-data.js?v=4" defer></script>
<script src="../assets/vault/study.js?v=3" defer></script>
<script src="../assets/vault/relic.js?v=4" defer></script>
<script src="../assets/ambient.js" defer></script>
</body>
</html>
`;
}

// ---------- index -------------------------------------------------------------
function indexPage() {
  const url = `${SITE}/vault.html`;
  const title = "The Vault — The Divine Archives";
  const desc = "Manuscripts, relics and contested objects — the Voynich Manuscript, the Dead Sea Scrolls, the Emerald Tablet and more — studied from the holding institutions' own scans under the archive's evidence standard.";
  const byCat = {};
  Object.keys(V.categories).forEach((k) => { byCat[k] = []; });
  V.items.filter((i) => i.status === "published").forEach((i) => byCat[i.category].push(
    `<a class="vault-card" href="vault/${i.slug}.html"><p class="eyebrow">${esc(i.id.toUpperCase())}</p><h3>${esc(i.title)}</h3>` +
    `<p class="meta">${esc(i.held)} &middot; ${esc(i.dated)}</p><p>${esc(clip(i.summary, 220))}</p>` +
    (i.pending ? `<span class="badge is-pending">Recently added &middot; pending review</span>` : "") + `</a>`));
  (V.queue || []).forEach((q) => byCat[q.category].push(
    `<div class="vault-card is-queued"><p class="eyebrow">In preparation</p><h3>${esc(q.title)}</h3><p>${esc(q.note)}</p></div>`));
  const sections = Object.keys(V.categories).filter((k) => byCat[k].length).map((k) =>
    `<h2 class="vault-cat">${esc(V.categories[k])}</h2>\n<div class="vault-grid">\n${byCat[k].join("\n")}\n</div>`).join("\n");
  return `${head(title, desc, url, "", "website")}
<body>
<a class="skip-link" href="#maincontent">Skip to content</a>
<div class="page">
${header("")}

  <main id="maincontent">
    <div class="page-head">
      <p class="eyebrow">Manuscripts &middot; Texts &middot; Relics</p>
      <h1>The Vault</h1>
    </div>
    <section class="wrap">
      <div class="vault-intro">
        <p class="lead">Some things in the history of the sacred are not traditions but <em>objects</em>: a book in an unknown script, a library sealed in desert caves, a tablet that exists only as a text, a cloth or a spear claimed to have touched the divine. The Vault gathers them.</p>
        <p>Every entry holds these objects to the same standard as the rest of the archive. It separates what the physical evidence shows (materials, dating, ownership, testing) from what has been <em>claimed</em>, and it ends with the same three-part honesty section: what is well supported, what is not, and what is genuinely open. Where the holding institution publishes its scans openly, the entry has a <strong>study viewer</strong>. You can magnify any page, enhance faded ink, cut out a region at full resolution, and copy a study packet with image links and scrutiny rules for your own AI or human analysis. The images always load from the institution itself and are never copied here. Where images are copyrighted, the entry links to the official viewer instead.</p>
        <p class="tiny">Attempts at decipherment and translation are labelled as attempts. A reading counts only when it holds up on text it was not built from.</p>
      </div>
${sections}
      <p class="tiny" style="margin-top:2.5rem">See the <a href="methodology.html">methodology</a> for the sourcing standard and the meaning of the pending-review tag.</p>
    </section>
  </main>

${footer("")}
</div>
<script src="assets/ambient.js" defer></script>
</body>
</html>
`;
}

// ---------- write ---------------------------------------------------------------
function writeIfChanged(p, s) {
  if (fs.existsSync(p) && fs.readFileSync(p, "utf8") === s) return false;
  fs.writeFileSync(p, s, "utf8"); return true;
}
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
let n = 0;
for (const item of V.items) {
  if (item.status !== "published") continue;
  if (writeIfChanged(path.join(OUTDIR, item.slug + ".html"), itemPage(item))) n++;
}
const ix = writeIfChanged(path.join(DOCS, "vault.html"), indexPage());
console.log(`build-vault: ${n} item page(s) written; vault.html ${ix ? "updated" : "unchanged"} (${V.items.filter((i) => i.status === "published").length} published, ${(V.queue || []).length} queued)`);
