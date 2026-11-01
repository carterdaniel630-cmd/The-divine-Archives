# 2026-11-01 ~18:55 UTC: Yoruba ch84 (PR #102) live; museum Wing IV/VI/VIII button fix built (PR #105)

Session ..WzTkijWpXHy48tH7tkJt, build loop (second firing in this session; the first did the #104 review,
`2026-11-01-pr104-independent-review.md`).

## 1. PR #102 merged (Yoruba ch84, pending tag kept)
- Lighthouse finished green on `7afab76` at 18:09 UTC; all 10 GitHub checks green.
- Local re-check on `7afab76` this run: full build order reproduces the committed files; verify 18/18; tests 42/42;
  review-checks 9 PASS, 1 WARN (Pantheon figures' chapter lists changed: expected, same as the delta review noted).
- Gate: delta review PASS 0 findings (`2026-11-01-pr102-delta-review.md`, by a session that wrote none of it);
  Carter's per-item yes on file (`decisions-2026-11-01-yoruba.md` 3). No commits after the candidate.
- `main` fast-forwarded `162f1d2` → `7afab76` at 18:53 UTC. Deploy run 231 green (18:53:53 UTC).
- The chapter goes live with its "Recently added — pending full review" tag. Atlas verifies it live (Yoruba order).

## 2. PR #105 built: museum fix batch item 1 (wing guide buttons IV / VI / VIII)
- **Cause found:** the hidden Arcade archway (`docs/museum/secret.js`) took a visitor through from anywhere at its x
  on the far side of the Wing II hallway wall's line (the test had a near limit but no far one). The Room guide lands
  every east wing at x 5.5, and Wings IV, VI and VIII are on that line. So once a visitor had found the archway (on
  the hallway's north wall near the spine), those three buttons sent them to the Arcade. Wing II and the Rotunda were
  fine, as the walk found. Visitors who never found the archway were never affected.
- **Fix:** two-sided test, only from just in front of the archway in its own hallway. `secret.js?v=4`, `app.js?v=41`.
  Branch `loop/museum-wing-buttons` `e151079`, PR #105.
- **Verified:**
  - In a headless browser on `main` (before the fix), with an archway remembered on the Wing II north wall:
    Wing II, then the Wing IV guide button → arrived in Wing IV, gold fade, went to `/pilgrimage/arcade.html`.
    Reproduced.
  - Direct test of the archway code, old vs new. Old: Wing IV, VI and VIII arrivals go to the Arcade. New: they stay.
    Both: walking into the archway from 0.5 or 0.7 m out still takes the visitor through. 1.1 m out, or 1 m along the
    wall, does not.
  - The fixed build loads in a headless phone-size browser: new modules served, no script errors, Wing IV button
    lands in Wing IV.
  - Full build order: no diff. Verify 18/18, tests 42/42, review-checks 9/9.
- **NOT yet verified hands-on: do not call it fixed.** The order requires a browser check of the fix. The full walk
  on the fixed build (find the archway, go to Wing II, tap Wing IV) kept crashing the headless renderer in this
  sandbox, on the old code too, so it was not completed. The next run, or atlas, or Carter's phone must do that walk
  before this is reported fixed.
- **Merge class:** a fix from the museum fix list Carter approved (12:51 ET), so possibly class (b). It touches the
  hidden Arcade (a feature), so the reviewer decides. If in doubt, per item.
