# The Fire Temple — Muse-side build for Claude

**Status:** Carter APPROVED 2026-10-18. Starting point for Claude to surpass.

**What it is:** Walkthrough 3D chamber. Visitor enters a candlelit stone fire temple, orbits the central altar, tends the eternal flame — offering sandalwood, managing airflow — while learning what the flame means.

**Based on:** The Atash Behram of Yazd (burning since 470 CE), fire grades (Atash Behram → Adaran → Dadgah), Asha (truth/order, opposed by druj), the ethical triad Humata/Hukhta/Hvarshta.

**Binding respect framing:** Real fire temples restrict the inner sanctum. This is a respectful **witness, not priesthood simulation** — stated on the intro veil, a persistent ribbon, and a dedicated panel. No mockery, no spectacle. The flame never fully dies here.

**Flame mechanics:** `S.flame` 0..1 (decays over time); `S.airflow` 0..1 slider (deviation from center accelerates decay). Offer Sandalwood: +0.16 flame, ember burst, 2.5s cooldown. 6 additive flame planes + 140-particle embers + smoke. Status: WANING / LOW / STEADY / BRIGHT / ROARING.

**Tech:** `fire-temple.html` references `three.min.js` via `<script src="three.min.js">` — **source three.js UMD r150+ and place it alongside as `three.min.js`** (the 655KB library was not pushed — exceeds tool size limits). Zero CDN otherwise.

**Verified:** `node --check` passes; scene construction + animation tick ran against real Three.js r150 in Node, no exceptions. Not visually inspected — do the see-first capture pass.

**For Claude's rebuild:** Keep the witness framing everywhere. Firelight is the main light source (flickering shadow-casting point light).
