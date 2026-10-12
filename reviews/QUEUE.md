# Review queue

Work that is on `main` (or headed there) and has no saved reviewer report yet. The reviewer takes items
from here before anything else, writes a normal report on `review-log`, and the builder ticks the item
off here (with the report path) in its next PR. Nothing in this file is an instruction to clear, list or
publish anything: those stay Carter's decisions.

## Open

### Pilgrimage previews from #51 (merged 2026-10-12 as 1658cf5): Stonehenge, Golgotha and the Tomb, Mount Ararat

Queued 2026-10-12 at Carter's request: these three went live as noindex previews with no independent review.
They stay `status: "preview"` and `pending: true` in `docs/assets/pilgrimage-data.js` (off the Pilgrimage
menu) until this review is saved and Carter lists them.

Files (all added by #51 unless marked):
- Pages: `docs/pilgrimage/stonehenge.html`, `docs/pilgrimage/golgotha-and-the-tomb.html`,
  `docs/pilgrimage/mount-ararat-the-ark-tradition.html`
- Site code: `docs/pilgrimage/sites/stonehenge/` (7 files), `docs/pilgrimage/sites/golgotha-and-the-tomb/`
  (6 files), `docs/pilgrimage/sites/mount-ararat-the-ark-tradition/` (7 files), `docs/pilgrimage/megalith.js`;
  modified: `docs/pilgrimage/engine.js`, `docs/pilgrimage/stone.js`, `docs/pilgrimage.html`
- Listing entries: `docs/assets/pilgrimage-data.js` (modified)
- Source logs: `sources/pilgrimage-stonehenge.md`, `sources/pilgrimage-golgotha-and-the-tomb.md`,
  `sources/pilgrimage-mount-ararat-the-ark-tradition.md`
- Registry: `framework/registry/{index,site,source,waypoint}.json` (modified); `tools/build-pages.js` (1 line)

What the review must cover (REVIEWER.md in full, plus these points):
- Every source in all three logs was confirmed only through search results ("could not be opened from the
  build environment"). Re-read each against the source itself, or mark it still unconfirmed.
- Golgotha and the Tomb: the location is contested (Church of the Holy Sepulchre vs the Garden Tomb, and the
  line of the city wall). Check every card keeps both views at comparable weight and picks no side;
  check the believer's lens and the evidence lens are both present; sensitivity tier for Carter's read.
- Mount Ararat: the Durupınar formation and other "Ark" claims must read as claims, with the geology and the
  state of scholarship stated plainly; no "proof" wording anywhere.
- Stonehenge: dimensions in `dims.js` each name a survey source; dates follow current English Heritage /
  published chronology.
- Walk each site end to end in a headless browser on a phone-sized screen: no script errors, phone budget met.

Outcome for Carter: one line per site, "ready to list" or "needs changes" (with what), plus anything on
sensitivity grounds he must read himself.
