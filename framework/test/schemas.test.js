"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { validate } = require("./mini-schema.js");

const ROOT = path.join(__dirname, "..", "..");
const load = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const ritualSchema = load("framework/schema/ritual.schema.json");
const entitySchema = load("framework/schema/entity.schema.json");

test("every ritual file matches the ritual schema and is internally consistent", () => {
  const dir = path.join(ROOT, "data", "rituals");
  const registry = new Set(load("framework/registry/section.json").entities.map((e) => e.id));
  const relics = new Set(load("framework/registry/relic.json").entities.map((e) => e.id));
  const tiers = fs.readFileSync(path.join(ROOT, "plans", "rituals-tiers.md"), "utf8");
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const r = load("data/rituals/" + f);
    assert.deepStrictEqual(validate(ritualSchema, r), [], f);
    assert.strictEqual(r.id, "ritual:" + f.slice(0, -5), f + ": id must match the file name");
    const ids = new Set(r.sources.map((s) => s.id));
    for (const s of r.steps) {
      for (const sid of s.source_ids) assert.ok(ids.has(sid), f + ": step " + s.sequence_order + " cites unknown source " + sid);
      if (s.historical_text_anchor_id) assert.ok(registry.has(s.historical_text_anchor_id), f + ": anchor " + s.historical_text_anchor_id + " is not a chapter section");
      else assert.ok(s.anchor_gap, f + ": step " + s.sequence_order + " has no anchor and no anchor_gap note");
    }
    // Tier 2 and 3 practices are never drafted here without Carter's approval. A tier-2 file carries his
    // recorded approval of the framing and is listed in plans/rituals-tiers.md; tier 3 is never drafted here.
    assert.notStrictEqual(r.sensitivity_tier, 3, f + ": tier-3 walkthroughs are never drafted without Carter's explicit approval");
    if (r.sensitivity_tier === 2) {
      assert.ok(r.framing_approval, f + ": a tier-2 walkthrough needs framing_approval (Carter's recorded approval)");
      assert.ok(tiers.includes("data/rituals/" + f), f + ": a tier-2 walkthrough must be listed in plans/rituals-tiers.md");
    } else assert.ok(!r.framing_approval, f + ": framing_approval is for tier-2 files only");
    if (r.museum_object) assert.ok(relics.has(r.museum_object), f + ": museum_object " + r.museum_object + " is not a Vault object");
    assert.doesNotMatch(JSON.stringify(r.steps), /score|points?\b|win|lose|level up/i, f + ": no scoring language");
  }
});

test("every registry entity matches the entity schema", () => {
  const idx = load("framework/registry/index.json");
  let n = 0;
  for (const shard of idx.shards) {
    for (const e of load("framework/registry/" + shard).entities) {
      const errs = validate(entitySchema, e);
      assert.deepStrictEqual(errs, [], e.id); n++;
    }
  }
  assert.strictEqual(n, idx.total);
  assert.deepStrictEqual(idx.dangling_links, []);
  assert.deepStrictEqual(idx.problems, []);
});

test("the committed registry matches a fresh build", () => {
  execFileSync(process.execPath, [path.join(ROOT, "tools", "build-entity-registry.js"), "--check"], { stdio: "pipe" });
});
