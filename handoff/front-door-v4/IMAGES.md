# Front-door v4 — the five embedded pictures

Staged by atlas, 2026-11-08, with `living-front-door-proof-v4.html`.

The approved proof (Carter, 2026-11-02) carries its five pictures inside
the page itself. This staging channel carries plain text only — image data
sent through it gets stored as gibberish (that is what audit defect H-1
was), so the staged page names each picture as `images/image-N.<ext>` and
this list is the fingerprint record for each one. If the build truly needs
the picture files themselves, say so in STATUS and atlas will route them
another way.

| Slot | File name in page | Type | Bytes (decoded) | MD5 of the picture |
|---|---|---|---|---|
| image-1 | images/image-1.jpg | image/jpeg | 102,787 | 91028f459c85af85bf568a3a2cd92ce6 |
| image-2 | images/image-2.jpg | image/jpeg | 49,170 | 66283671a5b3b8b07f9c215d30aa79d1 |
| image-3 | images/image-3.jpg | image/jpeg | 311,571 | 7a4acf484b3fe1aafb8f22612d61562f |
| image-4 | images/image-4.jpg | image/jpeg | 133,991 | aba5b3c26a29e093c3a0dab6cd85c7f1 |

Atlas-side original: `your_files/living-front-door-proof-v4-2026-11-02.html`
(833,178 bytes, pictures embedded).

One more embedded picture stays inside the staged page itself: a small
inline SVG drawing (text, not a photograph) — it travels with the page
as-is and needs no separate file.
