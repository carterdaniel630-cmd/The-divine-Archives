# The originality check: what it does and does not tell the reviewer

`tools/originality-check.js` (run by `.github/workflows/originality.yml` on pull requests that
change chapters, themes, Vault entries or source logs; opt-in locally through
`tools/hooks/pre-commit`) measures how much of a piece's own prose repeats, word for word, the
pages it cites.

- **How:** it breaks the piece into runs of eight words (8-grams) and looks for each one in the
  baseline of its cited pages. The baseline holds hashes of the pages' 8-grams, never their
  text (`sources/baseline/README.md`).
- **Fails:** when more than 20% of the piece's 8-grams occur in its cited pages.
- **Exempt:** the Sources section; blockquotes carrying a citation (a link, a reference in
  brackets, an italic title, or a closing "— attribution" line); inline quotations whose
  sentence carries a citation.
- **Never a silent pass:** a piece whose cited pages could not be fetched is reported
  **UNVERIFIED** (none fetched) or **PARTIAL** (some missing), with the list of missing pages.
  The run summary lists every page that could not be fetched and the reason.

## What it catches

Copying: close paraphrase that keeps long runs of the source's wording, and pasted passages
that are not quoted and cited.

## What it does not catch, so the reviewer still checks by hand

- **Accuracy.** A piece can be entirely original and wrong. The check says nothing about
  whether a claim is true, whether its source supports it, or whether a contested point is
  flagged as contested. The reviewer's sourcing and accuracy checks in `REVIEWER.md` are
  unchanged.
- **Copying from pages the piece does not cite.** Only cited pages are in the comparison.
- **Loose paraphrase** that changes every few words, or translated copying.
- **Pages it could not read:** paywalled, script-rendered and PDF sources, and sites that
  block automated requests. Treat UNVERIFIED and PARTIAL as "not checked", not as "clean".

## For the reviewer

When a pull request's Originality run shows FAIL, open the closest source it names and
compare the flagged piece. Rewriting in the archive's own words, or quoting with a citation,
fixes it. When it shows UNVERIFIED or PARTIAL, check the missing pages by hand where a passage
reads as if lifted.

Proposed line for `reviews/REVIEWER.md` (held: Phase 1 adds new files only, so the line goes
in when Carter approves):

> The Originality check (`reviews/ORIGINALITY.md`) catches copying only, not inaccuracy. A pass
> is not a sourcing or accuracy pass, and UNVERIFIED or PARTIAL means "not checked".
