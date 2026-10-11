# Git hooks (opt-in)

`pre-commit` runs the originality check (`tools/originality-check.js`) on any chapter, theme
or Vault markdown you are about to commit, and stops the commit if more than 20% of a piece's
word 8-grams repeat the pages it cites. Quoted text with a citation, and the Sources section,
are not counted.

Install, once per clone:

    git config core.hooksPath tools/hooks

Remove with `git config --unset core.hooksPath`. Skip a single commit with
`git commit --no-verify`.

Without a local baseline the hook tries to build one for the staged files; where the web is
blocked it reports the pieces as UNVERIFIED and lets the commit through. CI runs the same
check with a full baseline on every pull request that changes content
(`.github/workflows/originality.yml`), so nothing is skipped silently.
