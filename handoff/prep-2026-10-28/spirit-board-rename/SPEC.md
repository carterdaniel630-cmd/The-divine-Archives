# Handoff prep — Spirit Board rename (the "Ouija" title cleanup)

Status: PREPPED in chat, Carter approved the prep 2026-10-28. The naming ruling is Carter's, 2026-10-17 (evening decisions batch, item 4): use a generic name like "Spirit Board" — "Ouija" is trademarked and must not brand the piece (Naming & IP Policy). NOT staged to GitHub yet; ships only on Carter's go.

## What the inventory found (verified 2026-10-28)
- The exhibit itself is **already correctly named "Spirit Board"** on the live site, and the preview's body text already says "Spirit Board" throughout.
- Exactly **one leftover per copy**: the HTML `<title>Ouija Board</title>` tag. It was present in every copy checked — the staging preview and all local copies, even the copies whose filenames already say spirit-board.
- The staging preview also still carries the old **filename**: `handoff/previews/ouija-board.html` (886 KB, on staging/ready-line).

## Already done in this prep (local copies, fixed 2026-10-28)
The `<title>` now reads "Spirit Board" in every local copy, verified by re-grep (0 remaining):
- `~/workspace/your_files/staging-push-saturday-2026-10-31/05-ouija-board/ouija-board.html` (the Saturday push payload)
- `~/workspace/your_files/staging-push/armory-batch-01-push/handoff/armory/batch-01/builds/spirit-board-v3.html`
- `~/workspace/your_files/ouija-board/spirit-board-v3.html`
- `~/workspace/goals/ouija-board/files/ouija-board/ouija-board.html`
- `~/workspace/goals/ouija-board/files/ouija-board/spirit-board-v2.html`

## What remains for the ship / for Claude on pickup
1. **Staging preview**: retitle `handoff/previews/ouija-board.html` the same way (title → "Spirit Board") and **rename the file to `handoff/previews/spirit-board.html`** when this prep ships, so the old name never travels further. Any handoff file that references the preview by its old path gets its reference updated in the same change.
2. **Saturday payload**: when the Saturday package is pushed, the `05-ouija-board/ouija-board.html` payload lands under the name **spirit-board** (folder and file), not the old name. Its title is already fixed.
3. **The rebuild**: when Claude rebuilds the piece for the site (it is parked for that rebuild), every public-facing name is "Spirit Board" — page title, headings, catalogue/armory entries, file names. Verification before merge: grep the shipped build for "ouija" — the only acceptable hits are historical-reference sentences of the kind below; zero in any title, heading, label, or filename.

## Explicitly NOT in scope — leave alone
- The two live historical mentions: `docs/eras/09-modern.html` and `docs/chapters/ch36.html` use the phrase "the Ouija board, patented in 1890" as a plain historical reference. The site crawler flags them on every sweep; they are **verified false alarms** (confirmed again in the 2026-10-27 fix sweep). Naming the historical product while writing its history is not branding our exhibit with it. Do not scrub them.
- Internal names (the Muse-side goal slug "ouija-board", working folder names) are internal only and do not ship; renaming them is optional housekeeping, not part of this item.

## Acceptance
- No copy of the piece — staging, payload, or shipped build — carries the old name in a title or filename.
- The two historical mentions untouched.
- Fresh independent review, 0 findings; Carter's yes before any merge, as always.
