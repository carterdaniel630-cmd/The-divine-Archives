# PR #82 built — ch02 "second death" framed as belief and sourced (2026-10-25, build loop)

**Item:** STATUS Next 10, the weekly audit's note (2026-10-25): ch02 lines 26–27 said, unhedged and unsourced, that a
condemned soul "simply ceases — the second death, annihilation". Live chapter wording, so value 1 (over-claim on the
live site). Picked over Next 4i–style items because everything above it waits on Carter, Muse or a review by another run.

**Change** (`loop/ch02-second-death` @ `82441ce`, PR #82, off `main` `c957af5`):
> If it does not, Ammit strikes — and in Egyptian belief that was an ending, not an eternity of torment: the texts speak
> of the condemned being consigned to "non-existence," and spells such as the Book of the Dead's "formula for not dying
> again" were written to escape that second death.

Plus one Sources line in the chapter and a dated entry in `sources/ch02-egypt.md`. Both authoring copies edited
(`eras/…/ch02-egypt-bronze-age.md` and `content/chapters.js`, which is what the build renders).

**Sources opened:** Roberson, "A Season in Hell", *Expedition* 57:2 (Penn Museum, 2015) — "a complete unmaking of the
individual"; Amduat/Book of Caverns "condemned you to non-existence"; not "an ongoing or otherwise eternal process".
UCL Digital Egypt, Book of the Dead ch. 44, "Formula for not dying again" (Coffin Texts 786–7). Also opened, not cited:
British Museum EA 9901,3 (names Ammit "Devourer of the Damned", doesn't state the fate). Not opened: Wikipedia "Ammut".

**Checks:** full build order; second pass 0 changes. 17/17 verify, 42/42 tests, `review-checks --base origin/main
--build` 9/9 (0 warnings). Headless phone (390) and desktop 1280: new text and link present, old text gone, pending
banner still shown, 0 script errors, page no wider than the screen. Screenshot `handoff/previews/ch02-second-death/phone.png`.

**Not done:** independent review (must be another run), GitHub checks (just started, not waited on with the lock),
Carter's yes. **Slip:** this run's lock commit `3167e21` carried an attribution line naming a model; not rewritten.
