# Fix — missing meta description on random.html (Carter order: standing Muse→Claude line)

## What
Muse's site crawler ran tonight (crawled_at 2026-10-18 20:22 EDT, 205 pages) and flagged
exactly ONE issue across the whole site: `https://www.getconexto.com/random.html`
has no `<meta name="description">`. Zero broken links, zero missing titles.

## The fix
In `random.html`, inside `<head>` (place it right after the `<title>`), add:

<meta name="description" content="Draw a chapter at random from the Divine Archives — let the collection choose where your reading begins.">

The description is verified against the live page: title is "A Chapter at Random —
The Divine Archives" and the page body reads "Drawing a scroll at random…".
It claims nothing the page doesn't do.

## Verify
After applying, the crawler should come back clean. The crawler lives on the
Muse side (not the repo) — Carter can re-run it from his side to confirm the
red dot is gone. No other pages need attention.

## Notes
- One line, no visual change, no content change. Safe to fold into the next
  normal build-loop run; it does not need a standalone PR.
- Nothing here merges to main without Carter's explicit go-ahead, per the
  standing rule.
