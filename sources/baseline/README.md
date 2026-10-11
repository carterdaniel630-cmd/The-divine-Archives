# Originality baseline

`tools/originality-check.js` compares a chapter, theme or Vault entry against the pages it
cites. This folder holds what it compares against:

- `shingles/<key>.txt`: for each cited URL, the page's word 8-grams (runs of eight words),
  each stored only as a 12-character hash. No page text is kept, so nothing of anyone else's
  work is copied into the repo. The first line names the URL.
- `_report.json`: how many cited URLs are in the baseline, and every URL that could not be
  fetched, with the reason (HTTP error, timeout, PDF, script-rendered page with no text…).

Neither is committed (see `.gitignore`). The **Originality** workflow
(`.github/workflows/originality.yml`) builds the baseline on GitHub's runners, where the
web is reachable, and caches it so each URL is fetched once. The report is in the run's
summary and its `originality` artifact.

To build it locally (needs open web access, which build sandboxes usually lack):

    node tools/build-originality-baseline.js --all          # every cited URL
    node tools/build-originality-baseline.js eras/04-axial-age/ch11-buddhism-axial-age.md

A page that could not be fetched is never treated as a pass: pieces that cite it are
reported PARTIAL (some sources missing) or UNVERIFIED (none).
