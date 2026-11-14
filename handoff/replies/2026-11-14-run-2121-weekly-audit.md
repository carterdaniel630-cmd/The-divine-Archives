# Loop run 2026-11-14 21:21 UTC — weekly audit (value 6)

Session ..01HFWzTnEJ2wsH8mjbmveB8b. Wrote none of the sampled items and none of the reviewer reports.

**What:** the weekly audit was overdue (the last one was 2026-11-07). This run did the `reviews/AUDITOR.md` weekly steps:
- blind re-review of every passed or fixed item in the 22 reviewer reports dated 2026-11-08 → 2026-11-14 (17 items, sample
  drawn by the AUDITOR.md sampler, seed `2026-11-14/<report>`);
- coverage of the PRs merged since the last audit: #120, #122–#127, #131–#133, #135–#138 and the #95/#128/#129 games
  reports.

Verdicts were committed to `review-log` (`1ededf4c`) before any reviewer note was read.

**Result:** 16 of 17 agreed. Accuracy this run 94%; rolling over the last 3 counted runs 91% (43/47). Auto-pass stays
**on**, with a thin margin. The full report is `reviews/2026-11-14-audit.md` on `review-log` (`1e1c1656`). Scorecard row,
`status.json` and `runs.md` are updated there.

**The one disagreement: site:pr127 (Rök Stone page, live, still pending).** The reviewer passed it; this audit says
fixable. Three problems:
1. The BBC Future citation links an unofficial mirror (`www-bbc-com.pages.dev`), not bbc.com. See vault page line 244 and
   item 11 of `sources/rok-runestone-decoded.md`.
2. The Holmberg et al. 2020 PDF is cited at an unconfirmed `/2020/06/` path. The copy that exists is at `/2020/04/`;
   the DOI is 10.33063/diva-401040.
3. "3.82 metres long in all" was not found in any source either session opened.

Cause: the reviewer checked these claims against the builder's own notes (`handoff/rok/report.md`), not against the
cited sources.

**Smaller notes** (no verdict change):
- The V44 Pilate Stone model is built wider than tall, but CIIP II 1277 gives height 82 cm and width 65 cm. This
  predates #125.
- The verdict-variants note says 26 variants; about 36 remain.
- The bull wording in the Ur production could not be read on the British Museum record by script; it fits Google Arts.

**Not done:** the monthly planted-error test. The loop never plants or scores, because that means opening KEY.md.
None has been planted for November.

**Checks:** on every sampled head, review-checks exits 0 and every verify-*.js exits 0. Headless 390x844 (games also
844x390), compared against base where a fix was claimed: 0 page errors, no sideways scroll.

**Merged:** nothing. **Next:** the Rök citation fix on a `loop/` branch, then independent review. If Carter answers (a),
it merges as class (c) honesty wording. After that, the 0ca items.
