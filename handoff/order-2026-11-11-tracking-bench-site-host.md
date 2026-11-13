# Order — host the tracking-proof bench on the real site (Carter's okay, 2026-11-11)

Atlas staged this on Carter's go ("Okay, that's fine," 2026-11-11) after the phone evidence below. It rides the Saturday queue **in order** — after the merges and the statue moves; no rush past them.

## What to build

Host the tracking-proof bench as a page on the real site, at a quiet bench path under the loop's own conventions — e.g. `getconexto.com/bench/tracking-proof/` (loop chooses the exact path). One page, nothing linked from the site's navigation; it exists so Carter can open it on his Galaxy, tap START CAMERA, and read one word: **LOCKED** or **LOST**.

## The canonical file — build from this, byte for byte

- **Canonical source:** `~/workspace/your_files/tracking-proof-bench/tracking-proof-bench.html` (atlas's machine; ride it to the loop through the staging channel the same way the Zeus figure file rode — atlas supplies it if it is not already in the channel).
- **Size:** 12,265,059 bytes · **MD5:** `31991c33bd36c2436aae6b66f6788cc3` · **SHA-256:** `d99f7d17e83152c01f6f987df6047f7ec9f0c6f301e7368d84375258c6e9daf7`
- This file **is** the Library artifact `tracking-proof-bench` **v2** (the fully self-contained rebuild, live 2026-11-10 21:29 ET) — the tracker engine (MediaPipe bundle + both WASM variants) and the face model are embedded inside the single page, gzip-compressed and inflated in memory at start.
- Not this file, do not use: `named-versions/index.html` in the same folder is the older CDN-fetching version (15,117 B) — superseded. `reference/selfcontained-prototype.html` (30,725,295 B) is the raw-base64 prototype the compressed page was made from — not the deliverable.

## HARD requirement — the test is void without it

The hosted page must remain **fully self-contained: zero external fetches at runtime** — no CDN bundle, no WASM download, no model download, no `vendor/` path, nothing fetched when START CAMERA is tapped. Verified on the canonical file: it contains **no** `cdn.jsdelivr.net`, **no** `storage.googleapis.com`, **no** `http://` or `https://` references at all. If the loop's hosting route would split the page, wrap it, or re-introduce any external load, **stop and report that instead of shipping it** — a page that fetches its engine is the exact failure this order exists to get away from. Serve the file as-is at the bench path.

## Why — the phone evidence (2026-11-10/11)

The bench's only job is Carter's open question from the X-ray-mirror idea: does face tracking hold a lock on his Galaxy? That verdict — LOCKED or LOST — is **still open**, because the test has never once been allowed to run:

- The **engine is proven on his actual phone**: his 2026-11-11 10:35 screenshot shows the self-contained version loaded, tracker initialised, advanced all the way to the camera request.
- Every consumer-browser door failed before or at that request: the downloaded **file copy** (`content://` — a phone never grants a camera to a file), the **app viewer** (refused the camera: `NotAllowedError`), the **Library card** (his app kept serving last night's stale CDN version even from a fresh card), and **Chrome on the muse.ai share address** (never asked; refused silently).
- The remaining route is the one his phone already trusts: a real page on **getconexto.com**, like every Archives page he opens daily.

## Acceptance

- Page live at the bench path on getconexto.com; opening it and tapping START CAMERA triggers **no network fetch** for the engine (loop verifies, e.g. with network blocked, the same offline proof used on the artifact).
- Report back the exact live URL in the loop's run notes so atlas can hand it to Carter for the one test: open, START CAMERA, allow, move head — LOCKED or LOST is the verdict the whole exercise exists for.
