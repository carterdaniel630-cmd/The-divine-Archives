/* ==========================================================================
   The archive framework — neutral sequence engine (Phase 1)

   Plays an ordered list of steps. It knows nothing about what a step means:
   it reads exactly five fields from each step and ignores everything else.

     sequence_order            1, 2, 3… (no gaps, no repeats)
     pacing_duration_ms        how long the step holds
     input_trigger_type        "auto" | "tap" | "hold"
     historical_text_anchor_id passed through for the page to link (string or null)
     source_ids                passed through for the page to cite (array)

   auto  the step ends when its time runs out.
   tap   the step waits for a tap; the time is the minimum before a tap counts.
   hold  the step ends once the visitor has held for the whole duration;
         letting go early resets the hold.

   There are no scores, points, lives, timers to beat or win and lose states.
   The engine reports only which step is showing and when the sequence ends.
   Content words never appear in this folder (framework/test/engine-neutral.test.js
   fails if they do).

   Standalone: no imports. In a page, <script> it and use
   window.SequenceEngine.create(); in Node, require() it.
   ========================================================================== */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SequenceEngine = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var FIELDS = ["sequence_order", "pacing_duration_ms", "input_trigger_type", "historical_text_anchor_id", "source_ids"];
  var TRIGGERS = ["auto", "tap", "hold"];

  // Copy only the five engine fields, check them, and sort by sequence_order.
  function normalise(steps) {
    if (!Array.isArray(steps) || !steps.length) throw new TypeError("SequenceEngine: steps must be a non-empty array");
    var out = steps.map(function (s, i) {
      if (!s || typeof s !== "object") throw new TypeError("SequenceEngine: step " + i + " is not an object");
      var c = {};
      FIELDS.forEach(function (f) { c[f] = s[f]; });
      if (!Number.isInteger(c.sequence_order) || c.sequence_order < 1) throw new TypeError("SequenceEngine: step " + i + " sequence_order must be an integer from 1");
      if (!Number.isInteger(c.pacing_duration_ms) || c.pacing_duration_ms < 0) throw new TypeError("SequenceEngine: step " + i + " pacing_duration_ms must be a whole number of ms");
      if (TRIGGERS.indexOf(c.input_trigger_type) < 0) throw new TypeError("SequenceEngine: step " + i + " input_trigger_type must be one of " + TRIGGERS.join(", "));
      if (c.historical_text_anchor_id !== null && typeof c.historical_text_anchor_id !== "string") throw new TypeError("SequenceEngine: step " + i + " historical_text_anchor_id must be a string or null");
      if (!Array.isArray(c.source_ids) || !c.source_ids.length) throw new TypeError("SequenceEngine: step " + i + " needs at least one source id");
      c.source_ids = c.source_ids.slice();
      return Object.freeze(c);
    });
    out.sort(function (a, b) { return a.sequence_order - b.sequence_order; });
    out.forEach(function (s, i) {
      if (s.sequence_order !== i + 1) throw new TypeError("SequenceEngine: sequence_order must run 1.." + out.length + " with no gaps or repeats");
    });
    return out;
  }

  // opts.steps   the steps (any extra fields are dropped)
  // opts.on      function (event) called with {type:"step", index, step} | {type:"hold", index, held, need} | {type:"end"}
  // opts.clock   { now(), set(fn, ms) -> handle, clear(handle) }; defaults to Date.now/setTimeout
  function create(opts) {
    opts = opts || {};
    var steps = normalise(opts.steps);
    var on = typeof opts.on === "function" ? opts.on : function () {};
    var clock = opts.clock || {
      now: function () { return Date.now(); },
      set: function (fn, ms) { return setTimeout(fn, ms); },
      clear: function (h) { clearTimeout(h); }
    };

    var index = -1;        // -1 before start, steps.length once ended
    var shownAt = 0;       // when the current step appeared
    var holdFrom = null;   // when the current hold began
    var timer = null;
    var paused = false;
    var pausedLeft = 0;    // remaining ms of an auto step when paused

    function emit(e) { try { on(e); } catch (err) { /* a page's handler never stops the sequence */ } }
    function cancel() { if (timer !== null) { clock.clear(timer); timer = null; } }
    function current() { return index >= 0 && index < steps.length ? steps[index] : null; }

    function show(i) {
      cancel();
      holdFrom = null;
      index = i;
      if (index >= steps.length) { emit({ type: "end" }); return; }
      shownAt = clock.now();
      var s = steps[index];
      emit({ type: "step", index: index, step: s });
      if (s.input_trigger_type === "auto") timer = clock.set(next, s.pacing_duration_ms);
    }

    function next() { timer = null; show(index + 1); }

    function start() { if (index === -1) show(0); }

    function tap() {
      var s = current();
      if (!s || paused || s.input_trigger_type !== "tap") return false;
      if (clock.now() - shownAt < s.pacing_duration_ms) return false;
      show(index + 1);
      return true;
    }

    function holdStart() {
      var s = current();
      if (!s || paused || s.input_trigger_type !== "hold" || holdFrom !== null) return false;
      holdFrom = clock.now();
      timer = clock.set(function () { timer = null; holdFrom = null; show(index + 1); }, s.pacing_duration_ms);
      return true;
    }

    function holdEnd() {
      var s = current();
      if (!s || s.input_trigger_type !== "hold" || holdFrom === null) return false;
      var held = clock.now() - holdFrom;
      cancel();
      holdFrom = null;
      emit({ type: "hold", index: index, held: held, need: s.pacing_duration_ms });
      return true;
    }

    function pause() {
      var s = current();
      if (!s || paused) return false;
      paused = true;
      if (s.input_trigger_type === "auto" && timer !== null) {
        pausedLeft = Math.max(0, s.pacing_duration_ms - (clock.now() - shownAt));
      }
      if (holdFrom !== null) holdFrom = null; // a paused hold starts again
      cancel();
      return true;
    }

    function resume() {
      var s = current();
      if (!s || !paused) return false;
      paused = false;
      if (s.input_trigger_type === "auto") {
        shownAt = clock.now() - (s.pacing_duration_ms - pausedLeft);
        timer = clock.set(next, pausedLeft);
      }
      return true;
    }

    // Leave at any point; nothing is recorded as lost or failed.
    function stop() { cancel(); index = steps.length; paused = false; }

    function state() {
      return {
        index: index,
        total: steps.length,
        started: index >= 0,
        ended: index >= steps.length,
        paused: paused,
        holding: holdFrom !== null,
        step: current()
      };
    }

    return { start: start, tap: tap, holdStart: holdStart, holdEnd: holdEnd, pause: pause, resume: resume, stop: stop, state: state, steps: steps.slice() };
  }

  return { create: create, normalise: normalise, FIELDS: FIELDS.slice(), TRIGGERS: TRIGGERS.slice() };
});
