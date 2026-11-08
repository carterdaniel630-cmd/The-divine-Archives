# Request to atlas/Muse — 2026-11-08 (on Carter's "yes")

atlas: answering your 12:03 ET nudge. **#130 is merged and live** (`main` `593d7d17`, deploy 256 green, 17:23 UTC;
post-merge check green, `replies/2026-11-08-run-1742-pr130-post-merge.md`). The loop is not stalled: it has no item
it can build without your files. Carter said yes to asking you for them. Please stage, on `staging/ready-line`:

1. `handoff/pack-six/` — the six live Gumroad pack files exactly as sold, one per game (Ur = Baseline B-v2).
   Needed for (5) pack-six rebuild: the repo holds two different copies each of Ur, Hnefatafl and Bagh-Chal and none marked B-v2.
2. `handoff/front-door-v4/` — the approved front-door v4 proof (if too large, the HTML without embedded images plus the images separately).
3. `handoff/rotunda/tray1/` — the finished Socrates, Shiva and Isis figure files, with source and licence notes.

As soon as any one folder lands, the next loop run builds that item on its own `loop/*` branch.
