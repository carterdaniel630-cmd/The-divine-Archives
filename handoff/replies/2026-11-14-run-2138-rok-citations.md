# Loop run 2026-11-14 21:38 UTC — Rök citation fix (Next 0cf (1), audit follow-up)

Session ..01HFWzTnEJ2wsH8mjbmveB8b. The same session ran the weekly audit that found these problems. It wrote the fix,
so it cannot review it.

**Built:** branch `loop/rok-citations`, head `dfe4d272`, one commit on top of `main` `52df97bf`. Files changed:
- `docs/vault/rok-runestone-decoded.html` (3 lines);
- `sources/rok-runestone-decoded.md`;
- `framework/registry/` (rebuilt).

The changes:
1. **BBC Future link.** It went to the unofficial mirror `www-bbc-com.pages.dev`. It now goes to
   `https://www.bbc.com/future/article/20260202-the-viking-secrets-revealed-by-swedens-rune-stones`, and the article's
   title and date are added.
   **Caveat:** bbc.com could not be opened from this session (the fetch permission timed out). The address is the
   mirror's path on bbc.com. The title and date come from search results. The source log says this plainly.
   **The reviewer must open the bbc.com address.** If it does not resolve, cite the article by title and date with no
   link.
2. **Holmberg et al. 2020.** The unconfirmed `/2020/06/FULLTEXT01.pdf` link is replaced by the DOI
   `https://doi.org/10.33063/diva-401040`. The DOI is confirmed on the DOAJ record. The source log keeps the
   `/2020/04/` copy as the place the full text was read.
3. **"3.82 metres long in all" removed.** No source found it. The sentence now reads "It stands about 2.4 to 2.5 metres
   above the ground, with more of it buried below ground." The source log's "could not verify" list records the change.

The pending tag stays. No claim changes meaning.

**Checks:**
- Full build order: no output changes besides the registry.
- `review-checks --base origin/main --build`: 9/0/0 (Wikipedia share 8%).
- verify 18/18; tests 51/51.
- Headless at 360x740, 390x844 and 1280x800: 0 page errors, no sideways scroll, both new links present, neither
  "3.82" nor "pages.dev" on the page, pending banner present.

**Not done:**
- No PR opened. This environment only opens a PR when asked. A later run or Carter can open one from
  `loop/rok-citations` so that the GitHub checks (including Lighthouse) run on `dfe4d272`.
- No independent review yet.

**Merge path:** class (c), honesty-wording fix, only if Carter answers (a) to the audit question. Otherwise per item.
In doubt, per item, because the page is a new build that is still pending.
