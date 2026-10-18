# Carter's decisions — 2026-10-17, 16:53 (second batch)

**Answers to:** the setup session's three questions (old commit note, Tomb Robber, compatibility table).
**Recorded by the build side, verbatim answer:** "a. a(claude picks). yes."

## 1. Old commit note: LEAVE IT
Commit `4cc478b` carries a line naming the model, against the CLAUDE.md rule. It stays: rewriting shared
history on `staging/ready-line` would tangle Muse's work. Every commit from now on leaves model names out.

## 2. "The Tomb Robber": RENAME (Carter: "Claude picks")
- **Done:** renamed to **The Unfinished Journal**. The game is framed by "the field journal of an expedition
  that never came home", and a win fills the journal.
- The homepage blurb no longer advertises the boulder, the whip and the tiger.
- The homepage button "Raid the temple" is now "Open the journal".
- The game id `treasure` is generic and stays.

**Still open, needs Carter:** the game's hero portrait is a bearded explorer in a brown fedora and leather jacket.
Together with the whip-swing and the rolling-boulder chase, that reads as the famous film hero, whatever the name.
Options:
- A) redesign the hero and rework those two set pieces (recommended);
- B) redesign the hero only;
- C) keep.

## 3. Compatibility table: DELETE AFTER 90 DAYS — YES
The four-line old-id table (`archive-games.js`, `framework/adapters/track.js`, arcade `site.js`, plus
`framework/test/renamed.test.js`) is removed **90 days after the rename goes live**.
- The go-live date is the day the merge carrying commit `2ab371d` lands on `main`. Whoever does that merge records the
  date and the due date (+90 days) in `handoff/CURRENT.md`.
- When the due date has passed, the build loop removes the table and its test on staging. Going live after that
  still needs a merge go-ahead.

## Effect on the PR #59 merge
The Tomb Robber hold in the independent review (`replies/2026-10-17-item21-merge-check-pr59.md`) is answered.
The site has changed since the reviewed candidate `2ab371d`, so a fresh independent review is needed. That run must
not be the setup session, which wrote these changes. The auto-pass hold still needs Carter's explicit yes.
