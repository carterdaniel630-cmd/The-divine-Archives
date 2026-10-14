# Defect: Fax-Machine Hiss in the Code Hallway
**Reported by Carter, 2026-10-13. REMOVAL ORDERED by Carter 2026-10-13 23:44.**

## Carter's directive (final)
REMOVE the hiss. Carter: "I don't want to hear it when I go through there. I
don't want the user to hear it when they go through there." The `babble`
soundscape is to be removed from the code hallway — replaced with near-
silence (faint stone resonance at most), or simply silence. No replacement
soundscape is required; the absence of the hiss IS the fix.

## The problem
The hallway where codes scroll down the walls plays a horrible computer-like
hissing — Carter describes it as "almost like a fax machine." It ruins the
hallway.

## Root cause (atlas, read-only repo inspection 2026-10-13)
`docs/museum/sound.js` — the `babble` soundscape generator:

> "noise through narrow band-passes whose centres jump about, over a low rush"

White noise is pushed through 4 narrow band-pass filters (Q 7–12) whose
center frequencies jump randomly across 380–3000 Hz roughly 9 times per
second, with random gain jumps on each band. That is, acoustically, a modem/
fax handshake — exactly what Carter hears. No `blur`-style code bug; the
generator is working as written, but what it generates is wrong for the space.

## Carter's directive
Replace it. The code hallway needs a soundscape that fits — or at minimum,
not this. (The per-room birds/water/wind soundscapes are working and stay;
this is specifically the code hallway's `babble`.)

## Fix guidance for Claude
- Trace which hallway/room requests the `babble` soundscape and swap its
  assignment.
- Replacement should feel like a hall of inscribed codes: near-silent air,
  faint stone resonance, perhaps very soft low pulses — never narrowband
  random squawking.
- Keep the fix inside the existing soundscape framework (same `tick`/`stop`
  interface).
