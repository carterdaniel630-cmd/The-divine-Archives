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
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}
// linkify a source line: bold lead stays, trailing bare URL(s) become links
function sourceLine(s) {
  s = inline(s);
  s = s.replace(/(https?:\/\/[^\s<]+)/g, (m, u) => `<a href="${u}">${u}</a>`);
  return s;
}

function parseBlocks(text) {
  // split into blocks separated by blank lines
  return text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
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
      const blocks = parseBlocks(content); // 3 bold-led paragraphs
      const classes = ["supported", "unsupported", "open"];
      let ev = '    <div class="evidence">\n      <div class="evidence-head">&#10022; The evidence, honestly</div>';
      blocks.forEach((b, idx) => {
        const one = b.replace(/\n/g, " ").trim();
        const m = one.match(/^\*\*([^*]+)\*\*\s*(.*)$/);
        const label = m ? m[1].replace(/[.:]\s*$/, "") : "";
        const rest = m ? m[2] : one;
        const cls = classes[idx] || "open";
        ev += `\n      <div class="ev ${cls}">\n        <h4>${inline(label)}</h4>\n        <p>${inline(rest)}</p>\n      </div>`;
      });
      ev += "\n    </div>";
      out.push(ev);
    } else if (hlow === "sources") {
      let src = '    <div class="sources">\n      <h3>Sources</h3>\n      <ul>';
      const clines = content.split("\n");
      let openList = true;
      for (let ln of clines) {
        ln = ln.trim();
        if (!ln) continue;
        if (/^\*[^*].*\*$/.test(ln)) {
          // italic subhead
          if (openList) { src += "\n      </ul>"; openList = false; }
          src += `\n      <h4>${inline(ln.replace(/^\*|\*$/g, ""))}</h4>\n      <ul>`;
          openList = true;
        } else if (/^-\s+/.test(ln)) {
          src += `\n        <li>${sourceLine(ln.replace(/^-\s+/, ""))}</li>`;
        }
      }
      if (openList) src += "\n      </ul>";
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

const [, , id, mdPath] = process.argv;
if (!id || !mdPath) { console.error("usage: md-to-chapter.js <id> <markdown>"); process.exit(1); }
process.stdout.write(convert(id, mdPath));
