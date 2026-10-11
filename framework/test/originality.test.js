"use strict";
/* Tests for tools/originality-check.js against a throwaway baseline. */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "orig-"));
const base = path.join(tmp, "shingles");
process.env.ORIGINALITY_BASELINE = base;
const L = require("../../tools/originality-lib.js");

const SOURCE = "The temple stood on a low rise above the river and its walls were painted with scenes of the harvest festival in which the whole town took part every year after the floods receded from the fields and the priests carried the image of the god through the streets to the sound of drums and the people threw flowers before the procession as it passed";
const URL = "https://example.org/temple";
fs.mkdirSync(base, { recursive: true });
fs.writeFileSync(path.join(base, L.urlKey(URL) + ".txt"), "# " + URL + "\n" + [...L.shingles(SOURCE)].join("\n") + "\n");

function run(md, extra) {
  const f = path.join(tmp, "piece-" + Math.random().toString(36).slice(2) + ".md");
  fs.writeFileSync(f, md);
  const out = spawnSync(process.execPath, [path.join(ROOT, "tools", "originality-check.js"), f, "--json", f + ".json"].concat(extra || []), { env: Object.assign({}, process.env, { GITHUB_ACTIONS: "", GITHUB_STEP_SUMMARY: "" }), encoding: "utf8" });
  return { code: out.status, r: JSON.parse(fs.readFileSync(f + ".json", "utf8")).results[0], out: out.stdout };
}
const ORIGINAL = "Archaeologists working at the site in the last century found the remains of a shrine with painted plaster. The paintings show a procession, though scholars disagree about who is being honoured and why. Several later accounts describe a yearly festival, but none was written by an eyewitness, and the dates they give do not agree with one another.";
const sources = "\n\n## Sources\n- [Example: the temple](" + URL + ")\n";

test("original prose passes", () => {
  const { code, r } = run("# A piece\n\n" + ORIGINAL + sources);
  assert.strictEqual(r.status, "PASS"); assert.strictEqual(code, 0);
  assert.ok(r.overlap_pct < 1);
});

test("copied prose fails above 20%", () => {
  const { code, r } = run("# A piece\n\n" + ORIGINAL + "\n\n" + SOURCE + "." + sources);
  assert.strictEqual(r.status, "FAIL"); assert.strictEqual(code, 1);
  assert.ok(r.overlap_pct > 20);
  assert.strictEqual(r.worst.url, URL);
});

test("a blockquote with a citation is exempt; without one it counts", () => {
  const cited = run("# A piece\n\n" + ORIGINAL + "\n\n> " + SOURCE + "\n>\n> — [Example](" + URL + ")\n" + sources);
  assert.strictEqual(cited.r.status, "PASS");
  assert.strictEqual(cited.r.exempt.blockquotes, 1);
  const bare = run("# A piece\n\n" + ORIGINAL + "\n\n> " + SOURCE + "\n" + sources);
  assert.strictEqual(bare.r.status, "FAIL");
});

test("an inline quotation is exempt only when its sentence cites a source", () => {
  const cited = run("# A piece\n\n" + ORIGINAL + "\n\nOne account says “" + SOURCE + "” (Example, p. 12).\n" + sources);
  assert.strictEqual(cited.r.status, "PASS");
  const bare = run("# A piece\n\n" + ORIGINAL + "\n\nOne account says “" + SOURCE + ".”\n" + sources);
  assert.strictEqual(bare.r.status, "FAIL");
});

test("text inside the Sources section is not counted", () => {
  const { r } = run("# A piece\n\n" + ORIGINAL + "\n\n## Sources\n- " + SOURCE + " [Example](" + URL + ")\n");
  assert.strictEqual(r.status, "PASS");
});

test("a piece whose sources are not in the baseline is UNVERIFIED, never a silent pass", () => {
  const { code, r, out } = run("# A piece\n\n" + ORIGINAL + "\n\n## Sources\n- [Elsewhere](https://example.org/not-fetched)\n");
  assert.strictEqual(r.status, "UNVERIFIED"); assert.strictEqual(code, 0);
  assert.match(out, /UNVERIFIED/);
  assert.strictEqual(run("# A piece\n\n" + ORIGINAL + "\n\n## Sources\n- [Elsewhere](https://example.org/not-fetched)\n", ["--strict"]).code, 1);
});

test("some sources missing is PARTIAL, and lists them", () => {
  const { r } = run("# A piece\n\n" + ORIGINAL + sources + "- [Elsewhere](https://example.org/not-fetched)\n");
  assert.strictEqual(r.status, "PARTIAL");
  assert.deepStrictEqual(r.missing, ["https://example.org/not-fetched"]);
});

test("emphasis or a bare date is not a citation, so the quote still counts", () => {
  for (const wrap of ["**One account** says “" + SOURCE + ".”", "One account (c. 500 BCE) says “" + SOURCE + ".”", "In *the old story* it says “" + SOURCE + ".”"]) {
    const { r } = run("# A piece\n\n" + ORIGINAL + "\n\n" + wrap + "\n" + sources);
    assert.strictEqual(r.status, "FAIL", wrap.slice(0, 30));
  }
});

test("a reference that names the source does exempt the quote", () => {
  for (const ref of ["(Smith 1872)", "(trans. Faulkner, p. 12)", "(Genesis 1:1)", "*Iliad* 6.146"]) {
    const { r } = run("# A piece\n\n" + ORIGINAL + "\n\nOne account says “" + SOURCE + "” " + ref + ".\n" + sources);
    assert.strictEqual(r.status, "PASS", ref);
  }
});
