"use strict";
const test = require("node:test");
const assert = require("node:assert");
const Engine = require("../engine/sequence-engine.js");

// A fake clock so timing is exact.
function fakeClock() {
  let t = 0, id = 0; const timers = new Map();
  return {
    now: () => t,
    set: (fn, ms) => { timers.set(++id, { fn, at: t + ms }); return id; },
    clear: (h) => timers.delete(h),
    advance(ms) {
      const end = t + ms;
      for (;;) {
        let next = null;
        for (const [h, x] of timers) if (x.at <= end && (!next || x.at < next[1].at)) next = [h, x];
        if (!next) break;
        timers.delete(next[0]); t = next[1].at; next[1].fn();
      }
      t = end;
    }
  };
}
const step = (n, ms, trig, extra) => Object.assign({ sequence_order: n, pacing_duration_ms: ms, input_trigger_type: trig, historical_text_anchor_id: null, source_ids: ["s"] }, extra || {});

test("reads only the five engine fields", () => {
  const e = Engine.create({ steps: [step(1, 10, "auto", { text: "x", tradition: "y", score: 5 })] });
  assert.deepStrictEqual(Object.keys(e.steps[0]).sort(), Engine.FIELDS.slice().sort());
});

test("rejects gaps, repeats and bad fields", () => {
  assert.throws(() => Engine.create({ steps: [step(1, 0, "auto"), step(3, 0, "auto")] }), /no gaps/);
  assert.throws(() => Engine.create({ steps: [step(1, 0, "auto"), step(1, 0, "auto")] }), /no gaps/);
  assert.throws(() => Engine.create({ steps: [step(1, 0, "swipe")] }), /input_trigger_type/);
  assert.throws(() => Engine.create({ steps: [step(1, -1, "auto")] }), /pacing/);
  assert.throws(() => Engine.create({ steps: [Object.assign(step(1, 0, "auto"), { source_ids: [] })] }), /source/);
  assert.throws(() => Engine.create({ steps: [] }), /non-empty/);
});

test("orders by sequence_order and plays auto, tap and hold steps", () => {
  const clock = fakeClock(), seen = [];
  const e = Engine.create({ clock, steps: [step(3, 500, "hold"), step(1, 1000, "auto"), step(2, 300, "tap")], on: (ev) => seen.push(ev.type + (ev.index !== undefined ? ev.index : "")) });
  e.start();
  assert.strictEqual(e.state().step.sequence_order, 1);
  clock.advance(999); assert.strictEqual(e.state().index, 0);
  clock.advance(1); assert.strictEqual(e.state().index, 1);
  assert.strictEqual(e.tap(), false, "a tap before the minimum time does not count");
  clock.advance(300); assert.strictEqual(e.tap(), true);
  assert.strictEqual(e.state().index, 2);
  e.holdStart(); clock.advance(200); e.holdEnd();
  assert.strictEqual(e.state().index, 2, "letting go early resets the hold");
  e.holdStart(); clock.advance(500);
  assert.ok(e.state().ended);
  assert.deepStrictEqual(seen, ["step0", "step1", "step2", "hold2", "end"]);
});

test("pause and resume keep the remaining time; stop ends quietly", () => {
  const clock = fakeClock();
  const e = Engine.create({ clock, steps: [step(1, 1000, "auto"), step(2, 1000, "auto")] });
  e.start(); clock.advance(400); e.pause(); clock.advance(5000);
  assert.strictEqual(e.state().index, 0);
  e.resume(); clock.advance(599); assert.strictEqual(e.state().index, 0);
  clock.advance(1); assert.strictEqual(e.state().index, 1);
  e.stop(); assert.ok(e.state().ended);
});

test("has no scoring or win/lose surface", () => {
  const e = Engine.create({ steps: [step(1, 0, "tap")] });
  const words = JSON.stringify(Object.keys(e)) + JSON.stringify(Object.keys(e.state()));
  assert.doesNotMatch(words, /score|point|win|lose|fail|life|lives|rank/i);
});

test("every ritual in data/rituals plays through the engine", () => {
  const fs = require("fs"), path = require("path");
  const dir = path.join(__dirname, "..", "..", "data", "rituals");
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const clock = fakeClock();
    const e = Engine.create({ clock, steps: r.steps });
    e.start();
    for (let i = 0; i < 100 && !e.state().ended; i++) {
      const s = e.state().step;
      if (s.input_trigger_type === "tap") { clock.advance(s.pacing_duration_ms); e.tap(); }
      else if (s.input_trigger_type === "hold") { e.holdStart(); clock.advance(s.pacing_duration_ms); }
      else clock.advance(s.pacing_duration_ms);
    }
    assert.ok(e.state().ended, f + " did not reach the end");
  }
});
