#!/usr/bin/env node
// Review heartbeat: reads reviews/runs.md (from the review-log branch) and says whether the
// reviewer has logged a run recently. A scheduled run that cannot reach the repository writes
// nothing, so silence is the only sign of failure; this script turns silence into a finding.
//
// Usage: node tools/review-heartbeat.js <runs.md> [--now ISO] [--hours 26]
// Prints JSON: { ok, problems[], newestAny, newestScheduled, logLine }
//   ok          false when any problem was found
//   problems    plain-language reasons (empty when ok)
//   logLine     the line to append to runs.md, or null when nothing needs logging
// Exit code is 0 unless the file cannot be read; the workflow decides what to do with the result.
'use strict';
const fs = require('fs');

function parseArgs(argv) {
  const out = { file: null, now: new Date(), hours: 26 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--now') out.now = new Date(argv[++i]);
    else if (a === '--hours') out.hours = Number(argv[++i]);
    else if (!out.file) out.file = a;
  }
  if (!out.file) throw new Error('usage: review-heartbeat.js <runs.md> [--now ISO] [--hours N]');
  if (isNaN(out.now.getTime())) throw new Error('bad --now value');
  if (!(out.hours > 0)) throw new Error('bad --hours value');
  return out;
}

// A run line looks like: "2026-10-12 06:47 UTC reviewer 1 batch ..." (REVIEWER.md §9).
const LINE = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) UTC (\S+)(.*)$/;

function parseRuns(text) {
  const runs = [];
  for (const raw of text.split('\n')) {
    const m = LINE.exec(raw.trim());
    if (!m) continue;
    const when = new Date(`${m[1]}T${m[2]}:00Z`);
    if (isNaN(when.getTime())) continue;
    runs.push({ when, who: m[3], rest: m[4], line: raw.trim() });
  }
  return runs;
}

function check(text, now, hours) {
  const runs = parseRuns(text);
  const reviewer = runs.filter(r => r.who === 'reviewer');
  const scheduled = reviewer.filter(r => !/\bmanual\b/i.test(r.rest));
  const newest = list => list.reduce((a, r) => (!a || r.when > a.when ? r : a), null);
  const nAny = newest(reviewer);
  const nSch = newest(scheduled);
  const limit = hours * 3600e3;
  const age = r => (r ? (now - r.when) / 3600e3 : Infinity);
  const fmt = h => (h === Infinity ? 'never' : `${Math.round(h)}h ago`);
  const problems = [];
  if (age(nAny) * 3600e3 > limit) {
    problems.push(`no reviewer run of any kind logged in the last ${hours}h (newest: ${fmt(age(nAny))})`);
  }
  if (age(nSch) * 3600e3 > limit) {
    problems.push(`the scheduled reviewer has not logged a run in the last ${hours}h (newest scheduled: ${fmt(age(nSch))}); it may be failing before it can reach the repository`);
  }
  const day = now.toISOString().slice(0, 10);
  const alreadyToday = runs.some(r => r.who === 'heartbeat' && r.line.startsWith(day));
  const stamp = now.toISOString().slice(0, 16).replace('T', ' ');
  const logLine = problems.length && !alreadyToday
    ? `${stamp} UTC heartbeat MISSED: ${problems.join('; ')}`
    : null;
  return {
    ok: problems.length === 0,
    problems,
    newestAny: nAny ? nAny.line : null,
    newestScheduled: nSch ? nSch.line : null,
    logLine,
  };
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const text = fs.readFileSync(args.file, 'utf8');
  process.stdout.write(JSON.stringify(check(text, args.now, args.hours), null, 2) + '\n');
}

module.exports = { check, parseRuns };
