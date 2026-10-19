# Sort the Seals — Muse-side build for Claude

**Status:** Carter APPROVED 2026-10-18. Starting point for Claude to surpass.

**What it is:** A board/table sorting game. Small steatite stamp seals sit in an unsorted tray on a candlelit archivist's table; the player drags each seal into one of five labeled trays by its carved animal (unicorn, humped bull, elephant, rhinoceros, tiger). Scoring: +10 per correct sort, streak bonuses every 5, penalties for wrong drops. Tap any seal to study it (site, animal, material, size).

**Binding honesty rule:** The Indus script is undeciphered — stated in the header plaque, intro card, every study card, and the end screen: "Script undeciphered. We sort by animal, not by meaning." No decode mechanic anywhere.

**Tech:** `sort-the-seals.html` — self-contained single file, vanilla JS + canvas 2D, zero CDN, zero dependencies. Pointer-event drag (mouse + touch), WebAudio blips, gold-burst particles. No Three.js needed.

**Difficulty levels:** Apprentice (12 seals, untimed) → Keeper (18 seals, 150s) → Keeper of Seals (24 seals, 100s, −10/miss).

**Verified:** Node syntax-checked, runtime smoke-tested (all five animal carvings, glyph strip, full round lifecycle: scoring, streaks, penalties, timer, grades S/A/B/C).

**For Claude's rebuild:** Do the see-first capture pass. Keep the honesty rule everywhere. Unicorn weighted 55% per the real record (~60% of actual seals).
