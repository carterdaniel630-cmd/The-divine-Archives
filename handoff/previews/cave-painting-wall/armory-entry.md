# Armory Entry — The Cave Wall

**What it is:** Hands-on experience #11 for the Divine Archives. A 3D cave chamber where the
visitor paints on an uneven rock wall by firelight, using the same families of technique as the
Paleolithic painters: fingertip daubs, hand stencils, and pigment blown as a spray. The wall
keeps the visitor's work for the session; a "wash" restores the wall to its seeded ancient
state. Quiet, awed pacing — a slow intro, flickering fire, rising embers, idle camera breath.

**What it's based on:** The Divine Archives Paleolithic chapter (ch41) + Chauvet / Lascaux /
Altamira painting traditions (web research 2026-10-18): iron-oxide ochre (red/yellow) and
charcoal pigments; fingers, hair brushes, and pigment blown through hollow bone; negative
hand stencils made by spraying around a pressed palm; natural rock contours incorporated
into the art; work done by firelight deep underground. Blombos cross-hatch and Sulawesi
context from the chapter inform the honesty framing.

**The painting tools:**
- **FINGER** — grainy ochre brush stroke (layered jittered dabs, no flat fills), size slider.
- **HAND** — toggles BLOW (negative stencil: pigment sprayed around a hand mask, the hand
  shields the rock) / PRESS (positive pigment print with grain). Sized by the same slider.
- **BLOW** — fine pigment mist as if through a hollow bone.
- Pigments: red ochre, yellow ochre, charcoal. LOOK/PAINT mode toggle for orbiting the
  chamber. LORE panel with technique notes. WASH clears only the visitor's marks.

**Honesty labels (binding, displayed in-experience):**
- "Painted in the *style* of Paleolithic cave art — an original rendering, not a copy of
  any famous panel."
- "What these paintings meant to the people who made them is unknown. The caves keep
  their secret." (matches the chapter: "we possess the artifacts; we do not possess its
  meaning")
- The seeded "ancient" marks (dot row, faded hand stencil, original bison-form outline)
  are faint and original-in-the-idiom, not copies; no interpretation or invented meaning
  is attached to any mark.

**Build notes for Claude:** Self-contained HTML, Three.js vendored locally (`three.min.js`,
zero CDN). Paint lives on a 2048×1024 canvas texture over a noise-displaced concave wall
mesh; firelight is an animated flickering point light + ember particles. Fonts fall back
gracefully if Google Fonts is unreachable. `node --check` clean; full runtime smoke-tested
with stubbed DOM/THREE (scene build, painting, animation frames — no exceptions).

**Files:** `cave-painting-wall.html`, `three.min.js` (vendored), this entry.
