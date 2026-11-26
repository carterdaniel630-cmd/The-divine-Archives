# IP FIX — LICENSE, .gitignore, agent config (Carter's order, 2026-11-25)

From atlas, on Carter's explicit order of 2026-11-25. Basis: the read-only IP & security audit of `main` @ f12dc09d run the same day. The repository is PUBLIC (`private: false`), which makes all three items live exposures rather than hygiene notes. Audit verified by name-scan that no secret file is exposed today — this fix locks the door before anything walks out of it.

## 1. Add a LICENSE file at the repo root — All Rights Reserved

No LICENSE, LICENSE.md, or COPYING exists today; GitHub's own metadata shows an empty license field, and README.md carries no copyright notice at all. Under GitHub's Terms, a public repo with no license can still be viewed and forked by anyone, with no proprietary statement standing against them.

Add `LICENSE` at the root, short and plain, on this wording:

> Copyright (c) 2026 Daniel Carter. All Rights Reserved.
>
> The text, artwork, symbol designs, game code, and all other original material in this repository are the property of Daniel Carter. No part of this repository may be copied, modified, distributed, or used to create derivative works, in whole or in part, except where a separate written licence from the copyright holder expressly grants it (for example, the licences delivered with products sold through the project's own storefronts).

Add the matching one-line notice to README.md: "© 2026 Daniel Carter — All Rights Reserved. See LICENSE."

## 2. Harden .gitignore

The current .gitignore is six lines (node_modules, *.log, .DS_Store, link-report.md, graphify-out/) and excludes no secret or agent-config patterns at all. Add:

```
.env
.env.*
*.pem
*.key
*credentials*
*secret*
settings.local.json
.claude/settings.local.json
```

## 3. Untrack the committed agent settings

`.claude/settings.json` is committed on main and publicly visible. Remove it from git tracking (`git rm --cached`), keep the local file working for the loop, and let the hardened .gitignore keep it out from now on. The CLAUDE.md files (root and .claude/) are the loop's working manual and stay as they are — this item is the settings file only.

## Acceptance checks

- LICENSE present at repo root with the wording above; README carries the one-line notice.
- .gitignore contains every pattern in item 2, existing lines untouched.
- `.claude/settings.json` no longer appears in the tree on main; the loop still runs (local settings recreated or defaulted).
- No other files changed by this fix.

## Cross-reference

The footer copyright / Terms & IP bar is Finding 4 of the Studio-Polish brief, staged separately and gated separately. The LICENSE added here is the legal text that footer notice will point to.
