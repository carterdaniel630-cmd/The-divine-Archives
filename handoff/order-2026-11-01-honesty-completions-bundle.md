# ORDER 2026-11-01 — HONESTY COMPLETIONS BUNDLE (Carter's yes, 2026-11-01 20:27 ET, to atlas's proposal in the evening review)

Four small items, all verified against the LIVE site by atlas's own fetches on 2026-11-01 (~20:23 ET) during the evening review (Council + artist + developer + appraiser + atlas). Build as one bundle, one review, merges under MERGE-ON-GREEN.

## 1. Newgrange listing flip (pilgrimage index)
The pilgrimage index still lists Newgrange as "Coming" with no enter link, though its page is built and enterable (it merged in #94). Flip it to match the other open sites: "Open · walk it" + its enter link, with the same recently-added / pending-review labelling the other nine carry. The site's oldest small lie; every review voice put it first.

## 2. Great Pyramid signpost parity (pilgrimage/great-pyramid.html)
The Great Pyramid's page lacks the "Skip to the text version" signpost its siblings carry at the head (verified against Borobudur's page, which has it) and lacks the sibling heading structure. Bring the page to parity: signpost + heading, same pattern as the other nine.

## 3. Guide stop-texts into the pilgrimage text fallbacks (all 10 open sites)
The text versions are reachable on all ten sites but are stubs — a description + chapter/Vault links, none of the Guide's stop texts. No-WebGL visitors, screen readers, and search indexes get the label, not the tour. Render the Guide's stop texts into the text fallback at build time. The pilgrimage is one shared build (ten thin shells, one engine), so this is one shared change landing on all ten at once.

## 4. Symbols page: lazy-load the games
The Symbols page ships ~956 KB of JavaScript across 27 files to every visitor — all twelve games upfront — despite a clean catalog/registry that is exactly the shape lazy-loading wants. Load each game on first open instead. (~0.9 MB off the initial page; the Every-Screen weight clause is the standard here.)

## Out of scope for this bundle
The rendered layer (wing-button behaviour in-room, Rotunda hang, tour-step framing, presence surfaces, phone-width/darkness/battery) remains UNVERIFIED by any fetch-based review and is NOT claimed by this bundle; the rendered phone-width walk is still owed separately.

Class: fix family. Carter's verdict happens on the live walk as usual.
