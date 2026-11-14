# Independent review — PR #140, Rök citation fix (2026-11-14 ~23:05 UTC)

**Verdict: PASS, 0 open findings.**

- **id:** `site:pr140`
- **Candidate:** `loop/rok-citations` @ `dfe4d272` (one commit on `main` `52df97bf`, fast-forward)
- **Reviewer:** loop session ..01HFWzTnZ3fGhhe19Hfzy7xd. It wrote none of the candidate. The fix was written by
  ..01HFWzTnEJ2wsH8mjbmveB8b.
- **Scope:** `origin/main...dfe4d272` against `reviews/REVIEWER.md` §3–§4. Files:
  - `docs/vault/rok-runestone-decoded.html` (3 lines);
  - `sources/rok-runestone-decoded.md`;
  - `framework/registry/index.json`, `source.json` (rebuilt).

## What was checked
1. **Holmberg et al. DOI.** `doi.org` could not be opened from this session (the fetch permission was not answered
   in time; this is an unattended run). The DOAJ record (https://doaj.org/article/a6d392620fa84bd88301e4114bdb749a)
   was opened. It gives:
   - title "The Rök Runestone and the End of the World";
   - authors Holmberg, Gräslund, Sundqvist, Williams;
   - *Futhark* 9–10, pp. 7–38, 2020;
   - DOI https://doi.org/10.33063/diva-401040.

   This matches the page and the source log exactly. **Confirmed.**
2. **BBC Future link.** The bbc.com address could not be opened from this session either, for the same reason, and a
   search found no bbc.com result. A second mirror copy at the same path was opened
   (`bbctodays.pages.dev/future/article/20260202-the-viking-secrets-revealed-by-swedens-rune-stones`). It confirms:
   - title "'Do you love me?': The Viking messages unearthed on Sweden's rune stones";
   - author Matilda Welin;
   - it reports the Holmberg/Williams climate reading of the Rök stone and colleagues' caution about it (Holmberg calls
     "the Vikings had climate anxiety" a playful press framing).

   So the page's description "on the debate over the climate reading" is accurate. The date (2 February 2026) matches
   the `20260202` in the BBC path. The address uses BBC Future's standard pattern, and every mirror copies the bbc.com
   path as it is.
   **Not a finding:**
   - the page now points at the BBC itself, not a copy site, which was the audit's complaint;
   - the source log says plainly that the bbc.com address could not be opened. That meets CLAUDE.md "Sources:
     anything that could not be opened is said so in the source log."

   **Open check for anyone with a browser:** tap the link once. If BBC returns "page not found", drop the link and
   keep the title and date (a class (c) fix).
3. **"3.82 m" removal.** The new sentence reads "about 2.4 to 2.5 metres above the ground, with more of it buried
   below ground". The Swedish National Heritage Board (RAÄ) document
   https://pub.raa.se/dokumentation/611338c9-1e11-48c9-a390-157a3bad783d/original/1 says the stone stands "två och en
   halv meter ovan jord" and reaches "drygt en meter under markytan". That supports both halves of the sentence. The
   document gives no total length, so dropping 3.82 m was right.
   **Note (not a finding):** a later pass could add this RAÄ document to the source log as the source for the
   buried part.
4. **No meaning changes elsewhere.**
   - The pending tag stays.
   - No claim changes meaning.
   - The `rel="noopener"` attributes are kept.
   - The registry change is only the source count (+2) and the source entries for the changed URLs.

## Local checks (run by this reviewer on `dfe4d272`, clean worktree)
- **Full build order** (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-sky,
  build-framework, build-entity-registry): no file changed.
- **`tools/verify-*.js`:** 18/18.
- **`node --test framework/test/*.test.js`:** 51 pass, 0 fail.
- **`review-checks --base origin/main --build`:** 9 passed, 0 failed, 0 warnings (Wikipedia share 8%).
- **Headless page check** at 360×740, 390×844 and 1280×800:
  - 0 page errors and no sideways scroll;
  - the bbc.com and doi.org links are present;
  - neither "3.82" nor "pages.dev" appears;
  - the pending banner is present.

## GitHub (PR #140, at ~23:00 UTC)
- guard, checks, originality, runtime, test and links are green.
- **Lighthouse was still in progress** (run 43649511251), so it is not yet green and is not assumed green.

## Merge status
Not merged:
- **Lighthouse** must finish green on `dfe4d272`.
- **Carter's yes** is needed: (a) on the audit question in STATUS → Needs Carter (class (c), honesty wording), or a
  per-item yes.
