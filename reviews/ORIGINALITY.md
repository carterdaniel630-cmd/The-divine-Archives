# The originality check: what it does and does not tell the reviewer

`tools/originality-check.js` (run by `.github/workflows/originality.yml` on pull requests that
change chapters, themes, Vault entries or source logs; opt-in locally through
`tools/hooks/pre-commit`) measures how much of a piece's own prose repeats, word for word, the
pages it cites.

- **How:** it breaks the piece into runs of eight words (8-grams) and looks for each one in the
  baseline of its cited pages. The baseline holds hashes of the pages' 8-grams, never their
  text (`sources/baseline/README.md`).
- **Fails:** when more than 20% of the piece's 8-grams occur in its cited pages.
- **Exempt:** the Sources section; blockquotes carrying a citation; inline quotations whose
  sentence carries a citation. A citation must name where the words come from: a link, a
  footnote, a reference in brackets ("(Smith 1872)", "(trans. Faulkner, p. 12)", "(Genesis 1:1)"),
  an italic title with a reference number ("*Iliad* 6.146"), or, for a blockquote, a closing
  "— attribution" line. Bold or italic emphasis and a bare date in brackets ("(c. 500 BCE)") are
  not citations (tightened 2026-10-11 after the reviewer found them letting quotes through).
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
  A green tick means "nothing copied among the pages that could be read". Rate-limited and
  timed-out pages are retried on every run; pages that refuse (403), are gone (404), are PDFs or
  show no text are tried twice and then listed as not fetched.

## For the reviewer

When a pull request's Originality run shows FAIL, open the closest source it names and
compare the flagged piece. Rewriting in the archive's own words, or quoting with a citation,
fixes it. When it shows UNVERIFIED or PARTIAL, check the missing pages by hand where a passage
reads as if lifted.

`reviews/REVIEWER.md` §3 carries the same rule (added 2026-10-11, approved by Carter).
