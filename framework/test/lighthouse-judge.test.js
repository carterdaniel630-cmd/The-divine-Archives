"use strict";
// The Lighthouse gate's verdict (tools/lighthouse-pages.js judge()): a page fails only when its median
// AND its upper quartile both drop more than the allowed points, so bimodal game pages (~70 or ~90 on
// the same build) do not fail by chance while a real regression still does.
const test = require("node:test");
const assert = require("node:assert");
const { judge, quantile } = require("../../tools/lighthouse-pages.js");

test("quantile picks the nearest lower rank", () => {
  assert.strictEqual(quantile([3, 1, 2], 0.5), 2);
  assert.strictEqual(quantile([3, 1, 2], 0.75), 2);            // 3 runs: upper quartile = median
  assert.strictEqual(quantile([1, 2, 3, 4, 5, 6, 7, 8, 9], 0.5), 5);
  assert.strictEqual(quantile([9, 8, 7, 6, 5, 4, 3, 2, 1], 0.75), 7);
});

test("bimodal noise on an unchanged page does not fail", () => {
  // Illustrative scores in the shape seen on #135 (treasure 84 -> 72, same page on both sides):
  // 9 runs each, base fell mostly on the fast mode, head mostly on the slow one.
  const base = [90, 89, 91, 72, 90, 88, 71, 90, 84];
  const head = [72, 71, 90, 70, 73, 89, 72, 91, 70];
  const v = judge(base, head, 5);
  assert.ok(v.medianDrop > 5, "median alone would have failed");
  assert.strictEqual(v.fail, false);
});

test("a real regression that moves the whole spread fails", () => {
  const base = [90, 89, 91, 88, 90, 92, 89, 90, 91];
  const head = [80, 79, 82, 78, 81, 80, 83, 79, 80];
  assert.strictEqual(judge(base, head, 5).fail, true);
});

test("a regression that makes most runs slow fails", () => {
  const base = [90, 89, 91, 88, 90, 92, 89, 90, 91];
  const head = [70, 71, 72, 70, 90, 71, 73, 70, 72];             // 8 of 9 slow
  assert.strictEqual(judge(base, head, 5).fail, true);
});

test("small drops and gains pass", () => {
  assert.strictEqual(judge([90, 90, 90], [86, 85, 87], 5).fail, false);
  assert.strictEqual(judge([80, 80, 80], [95, 95, 95], 5).fail, false);
});

test("with 3 runs the verdict is the plain median rule, as before", () => {
  assert.strictEqual(judge([90, 91, 89], [80, 81, 79], 5).fail, true);
  assert.strictEqual(judge([90, 91, 89], [86, 87, 85], 5).fail, false);
});
