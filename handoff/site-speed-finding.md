# Site speed finding — for Claude (from the Muse-side spider, measured 2026-10-18)

The site's pages are heavier to reach than they should be, and the bottleneck is **server response time**, not page weight.

Measured across the whole site (205 pages):
- Average load: **3.67s**
- **42 pages take over 5s**
- Slowest: **/vault/codex-mendoza.html at 9.32s**

The pattern points at how long the server takes to answer, page after page — worth a look at the hosting/response side rather than trimming page content. Flagged by Muse; diagnosis and fix are Claude's, inside Carter's normal approval rules (nothing goes live without his go on the specific change).
