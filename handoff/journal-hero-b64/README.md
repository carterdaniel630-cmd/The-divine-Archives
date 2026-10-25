# Journal Hero images — text-carrier copies (for PR #60)

The staging write path only accepts UTF-8 text, so the three reference images
for the Journal hero redesign ride here as base64 text. All three were
verified to round-trip byte-identical (2026-10-22).

## What each file is

- `carter-selfie-reference.jpg.b64` — Carter's own selfie. The hero's FACE is
  based on this and stays based on it (Item 27 ruling): change costume, props,
  and setting — never the face or the person.
- `original-character-sheet.jpg.b64` — the first character sheet rendered from
  that selfie. The face/rendering is right; the outfit is NOT usable (it copies
  a trademarked film adventurer's kit — fedora, leather jacket, whip).
- `character-sheet-archivist-hooded.webp.b64` — the APPROVED redesign:
  "The Archivist." Same face and build, hood UP (Carter, 2026-10-21: "put the
  hood on. I don't want to see my bald head"), long charcoal-and-olive waxed
  coat, brass lantern, scroll/document case on the back, clasped leather-bound
  journal, plain belt. No hat, no whip, nothing trademarked.

Job: rebuild the Journal hero from exactly these references (Option A —
redesign hero + rework set pieces), per the standing rules and Carter's merge
approval for PR #60 itself.

## Restoring the images

Each `.b64` file decodes to the image with the same name minus the `.b64`:

```sh
for f in *.b64; do base64 -d "$f" > "${f%.b64}"; done
```

After decoding, verify: the three images are
- `carter-selfie-reference.jpg` (~66 KB, JPEG)
- `original-character-sheet.jpg` (~213 KB, JPEG)
- `character-sheet-archivist-hooded.webp` (~427 KB, WebP)
