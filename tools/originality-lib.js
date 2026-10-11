/* Shared parts of the originality check (tools/originality-check.js) and its
   baseline builder (tools/build-originality-baseline.js).

   The baseline is stored as hashed word 8-grams, one file per cited URL, in
   sources/baseline/shingles/<key>.txt. Only hashes are kept, never the text of
   anyone else's page, and the folder is not committed (CI caches it). */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const BASE = path.join(ROOT, "sources", "baseline");
const SHINGLES = process.env.ORIGINALITY_BASELINE || path.join(BASE, "shingles"); // the env override is for tests
const N = 8;

const urlKey = (url) => crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
const hash = (s) => crypto.createHash("md5").update(s).digest("hex").slice(0, 12);

function words(text) {
  return text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "")
    .split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function shingles(text) {
  const w = words(text), out = new Set();
  for (let i = 0; i + N <= w.length; i++) out.add(hash(w.slice(i, i + N).join(" ")));
  return out;
}

const URL_RE = /https?:\/\/[^\s)<>\]"'`]+/g;
const cleanUrl = (u) => u.replace(/[.,;:]+$/, "");

// The chapter's (or Vault entry's) own id: ch11, v04…
function ownerOf(file) {
  const m = path.basename(file).match(/^(ch\d+|v\d+)[-.]/);
  return m ? m[1] : null;
}

// Every URL the piece cites: its own Sources section plus its log in sources/.
function citedUrls(file) {
  const urls = new Set();
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(URL_RE)) urls.add(cleanUrl(m[0]));
  const owner = ownerOf(file);
  if (owner) {
    const dir = path.join(ROOT, "sources");
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md") || !f.startsWith(owner + "-")) continue;
      for (const m of fs.readFileSync(path.join(dir, f), "utf8").matchAll(URL_RE)) urls.add(cleanUrl(m[0]));
    }
  }
  return [...urls].sort();
}

// A citation near a quotation, i.e. something that names where the words come from:
// - a link or a bare URL, or a footnote marker [^n]
// - a parenthesis holding a reference: a page, line, verse, book, chapter, spell, tablet, folio or
//   translator/editor marker ("p. 12", "trans. Faulkner"), a chapter-and-verse number ("Genesis 1:1",
//   "Odyssey 11.489"), or a name followed by a number ("Smith 1872", "MN 118", "Spell 125")
// - an italic title followed by a reference number ("*Iliad* 6.146")
// Emphasis alone (bold or italics) and a bare date in brackets ("(c. 500 BCE)", "(1872)") are not citations.
// (A blockquote may also end with an attribution line starting with a dash; see ATTRIBUTION.)
const CITATION_PARTS = [
  /\[[^\]]+\]\([^)]+\)/,                       // [text](link)
  /https?:\/\//,                                // bare URL
  /\[\^[^\]]+\]/,                               // footnote
  /\((?=[^()]*(\b(p|pp|l|ll|v|vv|fol|ch|trans|tr|ed|eds)\.|\b(page|line|lines|verse|verses|book|chapter|spell|tablet|sura|surah)\s*\d))[^()]*\)/i,
  /\([^()]*\d+[:.]\d+[^()]*\)/,                  // (Genesis 1:1), (Odyssey 11.489)
  /\([^()]*\b(?!(?:CE|BCE|AD|BC|AH|BP|c)\b)[A-Z][A-Za-z'’-]+\.?\s+\d+[^()]*\)/, // (Smith 1872), (MN 118); case-sensitive
  /[*_][^*_\s][^*_]*[*_],?\s+(book\s+)?\d+/i        // *Iliad* 6.146
];
const CITATION = { test: (text) => CITATION_PARTS.some((re) => re.test(text)) };
const ATTRIBUTION = /^\s*(—|–|--)\s*\S/;

// The prose that is checked, with exempt material removed:
// - everything from a Sources / References / Bibliography heading onwards (to the next same-level heading)
// - blockquotes that carry a citation, in the quote or on the line right after it
// - inline quotations ("…" or “…”) whose sentence carries a citation
// - code, HTML tags, link targets (link text is kept), image syntax
function prose(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const kept = [];
  const exempt = { blockquotes: 0, quotes: 0, sourcesLines: 0 };
  let skipLevel = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      if (skipLevel && h[1].length <= skipLevel) skipLevel = 0;
      if (/^(sources|references|bibliography|works cited|further reading|sources cited)\b/i.test(h[2].trim())) { skipLevel = h[1].length; exempt.sourcesLines++; continue; }
    }
    if (skipLevel) { exempt.sourcesLines++; continue; }
    if (/^\s*>/.test(line)) {
      const block = [];
      let j = i;
      while (j < lines.length && /^\s*>/.test(lines[j])) block.push(lines[j++].replace(/^\s*>\s?/, ""));
      let after = j;
      while (after < lines.length && !lines[after].trim()) after++;
      const text = block.join("\n");
      const lastLine = block.filter((l) => l.trim()).pop() || "";
      const nextLine = after < lines.length && after - j <= 1 ? lines[after] : "";
      if (CITATION.test(text) || ATTRIBUTION.test(lastLine) || ATTRIBUTION.test(nextLine)) { exempt.blockquotes++; i = j - 1; continue; }
      kept.push(...block);
      i = j - 1;
      continue;
    }
    kept.push(line);
  }
  let text = kept.join("\n")
    .replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  // inline quotations, judged by the sentence they sit in (link targets still present, so links count as citations)
  text = text.split(/\n\s*\n/).map((para) =>
    para.split(/(?<=[.!?])(?<!\b(?:trans|tr|ed|eds|p|pp|l|ll|v|vv|c|ca|cf|vol|no|fol|ch|St|Dr|Mr|Mrs|Ms|e\.g|i\.e)\.)\s+(?=[A-Z“"*_(\[])/).map((sentence) => {
      if (!CITATION.test(sentence)) return sentence;
      return sentence.replace(/“[^”]{3,}”|"[^"\n]{3,}"/g, () => { exempt.quotes++; return " "; });
    }).join(" ")
  ).join("\n\n");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(URL_RE, " ");
  return { text, exempt };
}

function loadShingles(url) {
  const f = path.join(SHINGLES, urlKey(url) + ".txt");
  if (!fs.existsSync(f)) return null;
  const body = fs.readFileSync(f, "utf8").split("\n").filter(Boolean);
  if (body[0] && body[0].startsWith("#")) body.shift(); // header line: the URL
  return new Set(body);
}

function htmlToText(html) {
  return html
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(nav|header|footer|aside|form)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;|&ndash;/g, "-").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
    .replace(/&[a-z]+;/g, " ");
}

module.exports = { ROOT, BASE, SHINGLES, N, urlKey, words, shingles, citedUrls, ownerOf, prose, loadShingles, htmlToText, CITATION, ATTRIBUTION };
