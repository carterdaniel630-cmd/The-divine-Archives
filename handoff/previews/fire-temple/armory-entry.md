# ARMORY ENTRY — The Fire Temple

**What it is:** A walkthrough 3D chamber (walkthrough space #9) built on the Muse side as the starting point for Claude Code to surpass. The visitor enters a candlelit stone fire temple, orbits the central altar, and tends the eternal flame — offering sandalwood and managing airflow — while learning what the flame means. File: `fire-temple.html` (self-contained; `three.min.js` vendored alongside, zero CDN, zero external fonts).

**What it's based on:** The Divine Archives' Zoroaster chapter (ch06) plus fire-temple research:
- The **Atash Behram of Yazd** — the "Fire of Victory," burning by tradition since 470 CE, fed by hand behind glass, tended by priests wearing cloth masks (padan) so breath never defiles it.
- Fire grades: **Atash Behram** (16 consecrated fires) → **Adaran** → **Dadgah**; the five-daily *boi* offering of sandalwood with the Atash Niyayesh prayer.
- **Asha** — truth, rightness, cosmic/moral order (the Vedic *rta*'s Iranian sibling), opposed by *druj*, the Lie. The flame is the *visible sign* of Asha, never an idol — the chapter's "fire-worshipper" correction is stated outright.
- The ethical triad **Humata, Hukhta, Hvarshta** (good thoughts, good words, good deeds), on a wall plaque.
- Art direction per brief: firelight as the main light source (flickering shadow-casting point light), stone drum chamber with dome and oculus, brass vessel/railings/collars, near-black warm browns with antique gold `#b98f4e`–`#c9a24b` and `#e6c27a` highlights; Cinzel / Cormorant Garamond / EB Garamond stacks (system serif fallback, no webfont CDN).

**Respect framing (binding):** Real fire temples restrict the inner sanctum — non-Zoroastrians are not admitted, and only trained mobeds tend the consecrated flame. This space is a respectful **witness, not a simulation of priesthood**: the intro veil, a persistent ribbon, and a dedicated "A WITNESS" panel all state that the visitor is a guest keeping a quiet vigil, tending as an act of care and learning. No mockery, no spectacle. The flame is also coded to never fully die here — neglect only lets it gutter low.

**Flame mechanics (for Claude's rebuild):**
- `S.flame` 0..1 (starts 0.78), decays over time; `S.airflow` 0..1 (starts 0.5) from the slider — deviation from center accelerates decay and adds guttering wobble; too still = smoky/starved, too fierce = wild/white-hot.
- **Offer Sandalwood**: +0.16 flame, ember burst, light pulse, 2.5s cooldown; an actual stick mesh arcs from the offering cup into the bowl (cup quietly replenishes).
- Flame = 6 additive cross-planes with procedural teardrop texture + bright core + halo sprite + 140-particle shader embers + smoke wisps; point-light intensity/color flicker with layered sine noise, ember-bed emissive follows flame health.
- Status words: WANING / LOW / STEADY / BRIGHT / ROARING; the offer button gently pulses only when the flame drops below 0.3.
- Optional generated fire-crackle (WebAudio brown noise, off by default, gain follows flame); intro veil + slow dolly-in for solemn pacing; drag-orbit / wheel-zoom camera.

**Verification:** `node --check` passes on the inline script; full scene construction plus one animation tick executed against real Three.js r150 in Node with a DOM shim — no exceptions. Not visually inspected (no browser in this environment) — Claude should do the see-first capture pass.
