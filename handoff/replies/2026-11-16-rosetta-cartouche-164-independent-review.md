Batch: independent review, PR #164 (Rosetta Stone cartouche fits 320-360 px phones)
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/rosetta-cartouche-360@bcd6f517 (diff origin/main...bcd6f517, merge base 4cb77979)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: this review was done by build loop run ..01HFWzTjwFohEu93vmfkepVG, which wrote none of #164
(builder: ..01HFWzTmh84LoDvb6ru8pbwy) and did not re-sync it.

Automatic checks (on bcd6f517): review-checks.js --base origin/main --build 9 passed, 0 failed, 0 warnings
(build: all 7 steps, output matches what is committed); all 18 verify-*.js pass; framework tests 51/51.
GitHub on bcd6f517 at 03:00 UTC: runtime x2, guard, checks, links green; Lighthouse still in progress.

PASSED   (1)
  - site:pr164 rosetta cartouche
    - Scope: 93 files. relic.css (the cartouche block only), tools/build-vault.js (cache-bust v19 -> v20), and
      the 90 Vault pages + vault.html, where the only changed line is that stylesheet link (91 "-v=19" / 91 "+v=20"
      lines, counted with uniq). No text, source, pending or sensitive content changes.
    - CSS: .ct-stage becomes an inline-size container. The ring's base font is min(1rem, 5cqi - 1px); signs, gap,
      padding and the end bar are in em off that base and equal the old rem/px values at a 16 px base (end bar
      -12 px / 6 px, sign padding 1.6 px / 2.4 px), so desktop is unchanged apart from the 24 px minimum width on
      the two narrow signs (ring 320 -> 327 px). Each property is declared twice (plain value first), so a browser
      without container units keeps the old sizes. All four .ct-* elements are built inside .ct-stage by relic.js,
      so cqi resolves against the stage.
    - Headless (Chromium, own static server, Google Fonts blocked to test the self-hosted glyph font), candidate
      vs main at 320 / 360 / 375 / 390 / 414 / 768 / 1280:
      - main: page scrollWidth 371 at 320 and 360 (sideways scroll), Greek line overflows 18 px at 320.
      - #164: scrollWidth = clientWidth at every width; Greek line 0 overflow; ring 229 / 255 / 267 / 280 / 300 /
        327 / 327 px and its end bar stays inside the stage; all 7 signs at least 24.0 px wide and 33 px tall
        (WCAG 2.5.8); tapping a sign at 360 still lights the sign and its Greek letter; 0 script errors.
      - Screenshots at 320 and 1280 looked at: the cartouche reads correctly, signs legible.
    - Trial merge onto main aec1d958 (git merge-tree): clean. #164 shares no file with main's newer commits
      (#162 touched content/chapters.js, content/dates.json, docs/chapters/ch19.html, the ch19 markdown).
    - Checklist 1-5 (accuracy, lenses, tiers, contested claims, tone): not applicable, no text changed.
      6 (sensitivity): the Rosetta Stone is not a sacred object or restricted site; nothing new is shown.
      7 (3D/games): none touched.

FIXED    (0)

NEEDS CARTER (0)
  - The merge itself is per item (layout fix, not class a/b/c): Carter's yes is still needed.

Observation (not a finding)
  - The sound row under the ring (.ct-sounds, aria-hidden) keeps its fixed 1.35rem gaps, so at 320 px it lines up
    with the signs only roughly. It lined up only roughly on main too (worse at 320, where the ring overflowed).
    A later polish could size it off the same base; not needed for this fix.

Not run: the frontend-design skill is not installed in this session (CLAUDE.md asks that this be said).
