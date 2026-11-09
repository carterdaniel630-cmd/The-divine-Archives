"use strict";
// The Lighthouse gate's verdict (tools/lighthouse-pages.js judge()): with 6+ runs a side a page fails only
// when its median drops more than the allowed points AND an exact one-sided Mann-Whitney rank test finds the
// head's runs lower beyond chance (p < 0.05). With fewer runs the plain median rule applies.
const test = require("node:test");
const assert = require("node:assert");
const { judge, quantile, rankTestP } = require("../../tools/lighthouse-pages.js");

test("quantile picks the nearest lower rank", () => {
  assert.strictEqual(quantile([3, 1, 2], 0.5), 2);
  assert.strictEqual(quantile([1, 2, 3, 4, 5, 6, 7, 8, 9], 0.5), 5);
  assert.strictEqual(quantile([9, 8, 7, 6, 5, 4, 3, 2, 1], 0.75), 7);
});

test("rank test: identical lists are not significant, fully separated ones are", () => {
  assert.ok(rankTestP([90, 90, 90, 90, 90, 90], [90, 90, 90, 90, 90, 90]) > 0.5);
  // 6 v 6 fully separated: 1 split in C(12,6) = 924
  assert.strictEqual(rankTestP([90, 91, 92, 93, 94, 95], [80, 81, 82, 83, 84, 85]), 1 / 924);
});

// Measured on GitHub's runner, PR #137 Lighthouse run 42611341873 (2026-11-09), a PR with no docs/ change:
// the same pages on both sides, median drops of 9-13 points by chance.
test("measured noise on an unchanged page does not fail (ch45, run 42611341873)", () => {
  const base = [81, 94, 71, 71, 81, 72, 93, 71, 99], head = [71, 72, 71, 86, 86, 73, 99, 72, 71];
  const v = judge(base, head, 5);
  assert.ok(v.medianDrop > 5, "the median alone would have failed");
  assert.ok(v.p > 0.05);
  assert.strictEqual(v.fail, false);
});

test("measured noise on an unchanged page does not fail (ch80, run 42611341873)", () => {
  const v = judge([85, 88, 88, 81, 75, 75, 75, 94, 75], [87, 75, 75, 75, 75, 100, 75, 75, 94], 5);
  assert.strictEqual(v.fail, false);
});

test("illustrative bimodal noise (#135 shape) does not fail", () => {
  assert.strictEqual(judge([90, 89, 91, 72, 90, 88, 71, 90, 84], [72, 71, 90, 70, 73, 89, 72, 91, 70], 5).fail, false);
});

test("a real regression that moves the whole spread fails", () => {
  assert.strictEqual(judge([90, 89, 91, 88, 90, 92, 89, 90, 91], [80, 79, 82, 78, 81, 80, 83, 79, 80], 5).fail, true);
});

test("a regression that makes most runs slow fails", () => {
  assert.strictEqual(judge([90, 89, 91, 88, 90, 92, 89, 90, 91], [70, 71, 72, 70, 90, 71, 73, 70, 72], 5).fail, true);
  assert.strictEqual(judge([90, 89, 91, 88, 90, 92, 89, 90, 91], [70, 71, 72, 70, 71, 90, 91, 89, 90], 5).fail, true);
});

test("small drops and gains pass", () => {
  assert.strictEqual(judge([90, 90, 90, 90, 90, 90], [86, 85, 87, 86, 85, 87], 5).fail, false);
  assert.strictEqual(judge([80, 80, 80], [95, 95, 95], 5).fail, false);
});

test("with 3 runs (no confirm round) the verdict is the plain median rule, as before", () => {
  assert.strictEqual(judge([90, 91, 89], [80, 81, 79], 5).fail, true);
  assert.strictEqual(judge([90, 91, 89], [86, 87, 85], 5).fail, false);
});
