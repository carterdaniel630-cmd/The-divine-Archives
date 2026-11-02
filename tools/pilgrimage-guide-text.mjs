#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage Guide's texts, for the text version

   Loads each named site's module (docs/pilgrimage/sites/<id>/site.js) the way
   the browser does, and prints, as JSON, what its Guide shows: the sections
   with their blurbs, every stop's title, flags, text, links and sources, and
   the "About this model" note. tools/build-pages.js renders this into each
   open site's text version (honesty completions bundle, item 3), so visitors
   without WebGL, screen readers and search engines get the tour, not a stub.

   The site modules import three.js through the page's import map; here the
   bare "three" is resolved to the same vendored file, so nothing is stubbed.

   Run: node tools/pilgrimage-guide-text.mjs <site-id> [<site-id> …]
   ========================================================================== */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREE = pathToFileURL(path.join(ROOT, "docs/assets/vendor/three/three.module.min.js")).href;
register("data:text/javascript," + encodeURIComponent(
  `export async function resolve(s, c, n) { if (s === "three") return { url: ${JSON.stringify(THREE)}, shortCircuit: true }; return n(s, c); }`));

const pickInfo = (i) => ({
  id: i.id, section: i.section, cat: i.cat || "", title: i.title, html: i.html || "",
  flags: (i.flags || []).map((f) => ({ t: f.t, soft: !!f.soft })),
  links: (i.links || []).map((l) => ({ href: l.href, label: l.label })),
  sources: i.sources || "",
  relic: i.relic ? { slug: i.relic.slug || "", title: i.relic.title, held: i.relic.held || "", dated: i.relic.dated || "" } : null
});

const out = {};
for (const id of process.argv.slice(2)) {
  const site = (await import(pathToFileURL(path.join(ROOT, "docs/pilgrimage/sites", id, "site.js")).href)).default;
  out[id] = {
    sections: site.sections.filter((s) => !s.hidden).map((s) => ({ id: s.id, name: s.name, blurb: s.blurb || "" })),
    info: site.info.map(pickInfo),
    about: site.about ? pickInfo(site.about) : null
  };
}
process.stdout.write(JSON.stringify(out));
