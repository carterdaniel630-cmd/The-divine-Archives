# Handoff prep — The arcade playability floor (all 12 games)

Status: PREPPED in chat, Carter approved the prep 2026-10-28. NOT staged to GitHub yet; ships only on Carter's go.
Audit measured from live main @ 68b7b03 (2026-10-28): every game's own code in `docs/assets/games/` plus the shared shell. Source copies in `./research/`. This is a bigger item — splitting it into parts (the way hit-feel shipped in parts 1–3) is expected and fine.

## The floor — three rules for every game
1. **The opening screen teaches the game.** Goal in one line, controls in one line, visible before play begins. Play never starts cold: the game waits for the player's start tap or first move.
2. **A difficulty choice wherever the game has an honest dial.** Three choices on the opening screen, in plain house words (e.g. Gentle / Standard / Hard), built in the style the arcade already uses (Excavation's level button, the Reliquary's setup choices). **Standard is always today's behaviour** — nobody's game changes under them; saved best scores carry over.
3. **Undo wherever a move can honestly be taken back.** Turn-based games only. A dig, a quiz answer, a rolled attack, and anything real-time stay final — that's their design, not a gap.

New buttons reuse the shared `.rq-btn` styling so they inherit the 44px touch height from tap-targets part 1. No new art. Reduced-motion respected, as always.

## Per-game audit — what each game has, and its gaps

**The Reliquary** (trivia) — How-to MET (setup screen + "Pick an answer — or press 1–4"). Difficulty MET in its own form: question set (Quick/Full bank), era, category, and Solo vs. the Archivist choices are its dials. Undo N/A.
**Ouroboros** (serpent) — How-to MET (goal + controls lines; waits for the first steer). Difficulty **GAP**: serpent speed is fixed — add the 3-choice as starting speed. Undo N/A.
**Ziggurat Builder** — How-to MET (full controls line). Difficulty **GAP**: the drop speeds up on its own schedule only — add the 3-choice as starting speed; the rise continues from there. Undo N/A (the Hold piece is its mercy mechanic, already present).
**Archive Chess** — How-to MET ("Tap a god, then tap where it moves…"). Difficulty **GAP**: the AI's search depth is hard-coded at 3 — expose it as Gentle 2 / Standard 3 / Hard 4. Undo **GAP**: add "Take back move" against the AI — take back the player's last move and the AI's reply. This is the clearest gap in the whole arcade.
**The Seeker's Path** — How-to MET (the intro explains the riddle path: read the chapter, answer to pass). Difficulty N/A — the riddles are the content. Undo N/A.
**Divine Casualties** (fighter) — How-to **PARTIAL**: the fighter-select screen says who the gods are; verify a controls/moves line is visible before the first bout (the moves data exists in `fighter-moves.js` — surface it on the select or opening screen if it isn't). Difficulty **GAP**: AI opponent strength is fixed — add the 3-choice. Undo N/A.
**Antithesis** (the contest) — How-to MET (controls + "First to N wins" on the opening screen; note the first serve fires on a short timer — the teaching lines are up before it, which satisfies the floor, but if the serve can cheaply wait for a first paddle move, prefer that). Difficulty **GAP**: opponent paddle speed fixed — add the 3-choice. Undo N/A.
**The Excavation** — How-to MET (full instruction line). Difficulty MET (Novice / Adept / Master). Undo N/A — a dig is final by design; flagging is already reversible. This game is the floor's model citizen; use its patterns for the others.
**The Labyrinth** — How-to MET ("Swipe or press an arrow to move…"). Difficulty **GAP**: shade speed fixed — add the 3-choice. Undo N/A.
**The Firmament** (pinball) — How-to MET (controls line). Difficulty N/A — pinball has no honest dial. Undo N/A.
**Dominion of the Ancients** — How-to MET (goal line + in-turn prompts like 'Tap "To attack"'). Difficulty **GAP**: both AI empires play at one fixed strength — add the 3-choice. Undo **PARTIAL GAP**: allow undoing placements during your own reinforce step, before you commit the phase; once an attack is rolled it stays final.
**The Unfinished Journal** (platformer) — How-to **PARTIAL**: verify the opening screen states the controls (run / leap / whip, and the touch pad on phones) rather than letting the player learn them by dying. Difficulty N/A — its checkpoints are its mercy; leave the design alone. Undo N/A.

## The build list that falls out of the audit
- **Undo (2):** Chess take-back (full), Dominion reinforce-step undo (limited).
- **Difficulty choices (7):** Chess (AI depth 2/3/4), Ouroboros (start speed), Ziggurat (start speed), Divine Casualties (AI strength), Antithesis (opponent speed), The Labyrinth (shade speed), Dominion (AI strength).
- **How-to fixes (2):** Divine Casualties moves/controls surfaced before the first bout; the Unfinished Journal's controls stated on its opening screen.
- **Cold-start check (all 12):** confirm every game waits for the player with its teaching lines up; fix any that start cold (Antithesis's serve timer is the known borderline case).

## Acceptance
- Headless phone run per game: opening screen shows goal + controls (+ difficulty choice where listed), game waits for the player, new controls measure at the 44px tap guide.
- Chess: play a move, AI replies, take back — board returns to the position before your move, and play continues cleanly. Dominion: place reinforcements, undo them, re-place differently, commit — no phantom armies.
- Standard difficulty reproduces today's behaviour exactly for every touched game (same speeds, same depth-3 chess AI).
- Fresh independent review, 0 findings, per part; Carter's yes before each merge, as always.
