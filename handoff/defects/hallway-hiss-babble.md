# Defect: Fax-Machine Hiss in the Code Hallway
**Reported by Carter, 2026-10-13. REMOVAL ORDERED by Carter 2026-10-13 23:44.**

## Carter's directive (final)
REMOVE the hiss. Carter: "I don't want to hear it when I go through there. I
don't want the user to hear it when they go through there." The hallway
soundscape technique inside `brook()` in `docs/museum/sound.js` is to be
removed from the code hallway — replaced with near-silence (faint stone
resonance at most), or simply silence. No replacement soundscape is
required; the absence of the hiss IS the fix. Removal, NOT replacement.

## The problem
The hallway where codes scroll down the walls plays a horrible computer-like
hissing — Carter describes it as "almost like a fax machine." It ruins the
hallway.

## Root cause (atlas, read-only repo inspection 2026-10-13; attribution corrected 2026-10-16)
`docs/museum/sound.js` — the soundscape technique inside the `brook()`
generator. (This file previously mislabeled it `babble()` — no such
function exists. The technique lives in `brook()`.)

> "noise through narrow band-passes whose centres jump about, over a low rush"

White noise is pushed through 4 narrow band-pass filters (Q 7–12) whose
center frequencies jump randomly across 380–3000 Hz roughly 9 times per
second, with random gain jumps on each band. That is, acoustically, a modem/
fax handshake — exactly what Carter hears. No `blur`-style code bug; the
generator is working as written, but what it generates is wrong for the space.

## Carter's directive
REMOVE it. No replacement soundscape. Near-silence (faint stone resonance
at most); the absence of the hiss IS the fix. (This corrects an earlier
"Replace it" line in this file that contradicted Carter's removal order.)

## Fix guidance for Claude
- Remove the technique from `brook()` in `docs/museum/sound.js`, or remove
  its assignment to the code hallway. Do NOT add a replacement soundscape.
- Keep the fix inside the existing soundscape framework (same `tick`/`stop`
  interface).
