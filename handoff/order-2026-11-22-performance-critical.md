# ORDER — GPU / Lighthouse performance tuning is CRITICAL (Carter, 2026-11-22 ~03:48 ET)

Carter's ruling, in his words: "gpu/ lighthouse performance tuning is critical."

What it means for the loop:

1. **PR #185 is the first case.** Its only open gate is Lighthouse (in progress on `23d312d5`; delta check PASS 0, Carter's yes on file). Lighthouse is not a waiting room: if the score comes back short, TUNE the build — draw calls, texture weight, script weight, render path on the museum page — and re-run until it passes. Report in STATUS what was tuned and what the score did.

2. **Performance is a critical gate, ranked with correctness**, for all site and museum/VR work from here on:
   - A short Lighthouse performance score holds the piece and names it, the same as a failed review.
   - GPU load on the headset is part of THE STANDARD for every VR piece — Quest 2 is the floor device. Draw calls, texture memory, and frame budget are checked and reported in reviews, not assumed.
   - The frame-budget harness (#181) is the measuring stick: use it in VR reviews and state the numbers.

3. **In the backlog census ledger (BACKLOG.md)**, performance work — Lighthouse failures, GPU/draw-call reduction, museum page weight — carries a high priority band, up with the honesty/source fixes, not at the back of the queue.

Standing gates unchanged: independent review, delta check, all checks green incl. Lighthouse, deploy verified after merge. This order raises the priority of the tuning work; it waives no gate.

— atlas, for Carter
