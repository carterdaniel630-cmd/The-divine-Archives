#!/usr/bin/env node
/* ==========================================================================
   md-to-chapter.js — convert a chapter markdown file into the chapters.js
   `chNN: { html: `...` }` block the site expects.

   Usage: node tools/md-to-chapter.js <id> <path-to-markdown>   (prints block)
   The markdown must follow the project chapter template:
     # Title
     *Recently added — pending full review.*   (optional; ignored)
     <dek paragraph>
     ## Section ...
     ## The evidence, honestly   -> 3 bold-led paragraphs (supported/…/open)
     ## Sources                  -> bullet list (optional *italic* subheads)
   ========================================================================== */
"use strict";
const fs = require("fs");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// inline markdown -> html (run AFTER esc)
function inline(s) {
  s = esc(s);
  // the URL may hold one level of balanced parentheses, e.g. wiki/Sin_(mythology)
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`);
  // bold first (allowing *italic* nested inside, e.g. **a *b***), then italic
  s = s.replace(/\*\*(.+?)\*\*(?!\*)/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return s;
}
// linkify a source line: bold lead stays, trailing bare URL(s) become links.
// Markdown links are already anchors after inline(), so only text outside an
// <a>…</a> is linkified (re-wrapping them garbled ch01–ch20's source lists).
function sourceLine(s) {
  s = inline(s);
  return s.split(/(<a\b[^>]*>.*?<\/a>)/).map((part, i) => i % 2 ? part :
    part.replace(/(https?:\/\/[^\s<]+)/g, (m, u) => `<a href="${u}">${u}</a>`)).join("");
}

function parseBlocks(text) {
  // split into blocks separated by blank lines
  return text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
}

// "## The evidence, honestly": three groups (supported / not supported / open). Each group opens
// with a bold lead, either on a line of its own followed by bullets or paragraphs
// ("**What's well supported**\n\n- …"), or as the start of a single paragraph ("**Supported.** text").
function evidenceHtml(content) {
  const classes = ["supported", "unsupported", "open"];
  const groups = [];
  for (const b of parseBlocks(content)) {
    const one = b.replace(/\n/g, " ").trim();
    const m = one.match(/^\*\*([^*]+)\*\*\s*(.*)$/);
    if (m && !/^-\s+/.test(b)) groups.push({ label: m[1].replace(/[.:]\s*$/, ""), blocks: m[2] ? [m[2]] : [] });
    else if (groups.length) groups[groups.length - 1].blocks.push(b);
    else groups.push({ label: "", blocks: [b] });
  }
  let ev = '    <div class="evidence" id="evidence">\n      <div class="evidence-head">&#10022; The evidence, honestly</div>';
  groups.forEach((g, idx) => {
    ev += `\n      <div class="ev ${classes[idx] || "open"}">\n        <h4>${inline(g.label)}</h4>`;
    for (const b of g.blocks) {
      const bl = b.split("\n");
      if (bl.every((l) => /^-\s+/.test(l.trim()) || /^\s+\S/.test(l) || !l.trim()) && /^-\s+/.test(bl[0].trim())) {
        // bullet list; indented lines continue the previous item
        const items = [];
        for (const l of bl) { if (/^-\s+/.test(l.trim())) items.push(l.trim().replace(/^-\s+/, "")); else if (l.trim()) items[items.length - 1] += " " + l.trim(); }
        ev += "\n        <ul>" + items.map((t) => `\n          <li>${inline(t)}</li>`).join("") + "\n        </ul>";
      } else {
        ev += `\n        <p>${inline(b.replace(/\n/g, " ").trim())}</p>`;
      }
    }
    ev += "\n      </div>";
  });
  return ev + "\n    </div>";
}

function convert(id, md) {
  const raw = fs.readFileSync(md, "utf8").replace(/\r\n/g, "\n");
  // strip H1 + pending line
  const lines = raw.split("\n");
  // Rebuild without the H1 and the pending italic line
  const kept = [];
  for (const ln of lines) {
    if (/^#\s+/.test(ln)) continue;
    if (/^\*Recently added.*\*\s*$/.test(ln)) continue;
    // internal workflow metadata and markdown rules never reach the public page
    if (/^\*(Tradition chapter|Comparative theme|Theme chapter).*\*\s*$/.test(ln)) continue;
    if (/^\s*-{3,}\s*$/.test(ln)) continue;
    kept.push(ln);
  }
  const body = kept.join("\n");
  // split into sections at "## "
  const parts = body.split(/\n##\s+/);
  // parts[0] = pre-section (the dek); rest are "Heading\n...content"
  let out = [];
  const dek = parts[0].trim();
  if (dek) out.push(`    <p class="lead">${inline(dek.replace(/\n/g, " "))}</p>`);

  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const nl = seg.indexOf("\n");
    const heading = (nl === -1 ? seg : seg.slice(0, nl)).trim();
    const content = (nl === -1 ? "" : seg.slice(nl + 1)).trim();
    const hlow = heading.toLowerCase();

    if (hlow.startsWith("the evidence")) {
      out.push(evidenceHtml(content));
    } else if (hlow === "sources") {
      let src = '    <div class="sources">\n      <h3>Sources</h3>\n      <ul>';
      // items: a "- " bullet (indented lines continue it), an italic subhead, or a
      // paragraph (unindented lines up to a blank line). "*Note on sourcing:*" paragraphs
      // become the source note; other paragraphs follow the list they sit under.
      const items = [];
      for (const raw of content.split("\n")) {
        const ln = raw.trim();
        const last = items[items.length - 1];
        if (!ln) { if (last && last.k === "p") last.done = true; continue; }
        if (/^-\s+/.test(ln)) items.push({ k: "li", t: ln.replace(/^-\s+/, "") });
        else if (/^\*[^*]+\*$/.test(ln)) items.push({ k: "h4", t: ln.replace(/^\*|\*$/g, "") });
        else if (last && last.k === "li" && /^\s/.test(raw)) last.t += " " + ln;
        else if (last && last.k === "p" && !last.done) last.t += " " + ln;
        else items.push({ k: "p", t: ln });
      }
      let openList = true, note = "";
      for (const it of items) {
        if (it.k === "h4") {
          if (openList) { src += "\n      </ul>"; openList = false; }
          src += `\n      <h4>${inline(it.t)}</h4>\n      <ul>`;
          openList = true;
        } else if (it.k === "li") {
          if (!openList) { src += "\n      <ul>"; openList = true; }
          src += `\n        <li>${sourceLine(it.t)}</li>`;
        } else if (/^\*Note on sourcing:\*\s*/.test(it.t)) {
          note = it.t.replace(/^\*Note on sourcing:\*\s*/, "");
        } else {
          if (openList) { src += "\n      </ul>"; openList = false; }
          src += `\n      <p>${sourceLine(it.t)}</p>`;
        }
      }
      if (openList) src += "\n      </ul>";
      if (note) src += `\n      <p class="source-note">${inline(note)}</p>`;
      src += "\n    </div>";
      out.push(src);
    } else {
      // normal section
      out.push(`    <h2>${inline(heading)}</h2>`);
      const blocks = parseBlocks(content);
      for (const b of blocks) {
        const bl = b.split("\n");
        if (bl.every((l) => /^-\s+/.test(l.trim()) || !l.trim())) {
          // bullet list
          let ul = "    <ul>";
          for (const l of bl) {
            const t = l.trim();
            if (/^-\s+/.test(t)) ul += `\n      <li>${inline(t.replace(/^-\s+/, ""))}</li>`;
          }
          ul += "\n    </ul>";
          out.push(ul);
        } else {
          out.push(`    <p>${inline(b.replace(/\n/g, " "))}</p>`);
        }
      }
    }
  }
  const html = out.join("\n\n");
  return `  /* ------------------------------------------------------------------ ${id} */\n  ${id}: { html: \`\n${html}\n  \` }`;
}

if (require.main === module) {
  const [, , id, mdPath] = process.argv;
  if (!id || !mdPath) { console.error("usage: md-to-chapter.js <id> <markdown>"); process.exit(1); }
  process.stdout.write(convert(id, mdPath));
} else {
  module.exports = { convert, evidenceHtml, inline };
}
