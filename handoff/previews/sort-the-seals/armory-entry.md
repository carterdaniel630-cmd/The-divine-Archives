# Sort the Seals — Armory Entry

**What it is:** A board/table sorting game for the Divine Archives. Small steatite stamp seals sit in an unsorted tray at the bottom of a candlelit archivist's table; the player drags each seal into one of five labeled trays by its carved animal. Scoring rewards correct sorts (+10), streaks (bonus every 5), and speed on timed levels; wrong drops cost points and the seal shakes and returns to the tray. Tap any seal to study it — site, animal, material, size — before sorting.

**What it's based on:** The Indus Valley chapter of the Divine Archives (ch04 — "The wall we cannot read", "The unicorn and the altar-object") plus the archaeological record: small square steatite seals (~2–4 cm) from Mohenjo-daro, Harappa, Dholavira, Lothal, Rakhigarhi and Chanhu-daro, carved intaglio with an animal below a line of script. The unicorn genuinely dominates the record (~60% of real seals), so the game weights unicorn seals at 55%. Unicorn seals include the little altar-object / "manger" the animal famously stands before.

**The five animals:** Unicorn (single bold horn, double neck-crease, altar-object), Humped Bull / zebu (shoulder hump, curved horns, dewlap), Elephant (domed body, fanned ear, curling trunk), Rhinoceros (plated hide folds, single nose horn), Tiger (sleek body, carved stripe ticks, curling tail). Each seal face carries a top band of decorative pseudo-glyphs in Indus-like shapes.

**The undeciphered-script honesty rule (binding, in the game itself):** The header plaque, the intro card, every seal study card, and the end screen all state: *"Script undeciphered. We sort by animal, not by meaning."* Study cards describe only what is actually known (site, animal, steatite, ~2–4 cm) and explicitly claim no meaning for the script line. There is no decode mechanic anywhere.

**Difficulty:** Apprentice (12 seals, untimed), Keeper (18 seals, 150 s), Keeper of Seals (24 seals, 100 s, −10 per miss).

**File:** `~/workspace/your_files/sort-the-seals/sort-the-seals.html` — self-contained, single file, vanilla JS + canvas 2D, zero CDN, pointer-event drag (mouse + touch), tiny WebAudio blips for correct/wrong/pickup, gold-burst particles on correct drops. Node syntax-checked and runtime smoke-tested (all five animal carvings, glyph strip, full round lifecycle: scoring, streaks, penalties, timer, grades S/A/B/C).
