# ClipYield — Build Roadmap

Actionable roadmap for standing up the UGC automation engine. Work the phases
in order; each phase leaves the system in a runnable state.

---

## Phase 1 — Database Foundation
Set up the central store that every stage reads from and writes to.

- [ ] Provision the central cloud database and wire `DATABASE_URL`.
- [ ] Choose the DB layer (raw SQL / SQLAlchemy) and add it to dependencies.
- [ ] Create table: **`products`**
  - `id`, `sellvia_id`, `title`, `description`, `price`, `category`,
    `created_at`, `updated_at`
- [ ] Create table: **`product_assets`** (media)
  - `id`, `product_id` (FK), `asset_type` (image/video), `source_url`,
    `local_path`, `created_at`
- [ ] Create table: **`scripts`**
  - `id`, `product_id` (FK), `hook`, `problem`, `solution`, `cta`,
    `model_name`, `created_at`
- [ ] Create table: **`audio_assets`**
  - `id`, `script_id` (FK), `voice_id`, `audio_path`, `duration_sec`,
    `created_at`
- [ ] Create table: **`video_outputs`**
  - `id`, `product_id` (FK), `script_id` (FK), `audio_id` (FK), `video_url`,
    `status`, `created_at`
- [ ] Write a migration / init script (`init_db.py`) that creates all tables.
- [ ] Add unique constraints for idempotent upserts (e.g. `products.sellvia_id`).

**Done when:** running the init script against `DATABASE_URL` creates all five
tables cleanly.

---

## Phase 2 — Local LLM Script Generation (test harness)
Prove the script engine end-to-end against a local model before wiring it in.

- [ ] Stand up a local model with **Ollama** at `OLLAMA_HOST`
      (e.g. `ollama pull llama3`).
- [ ] Write `scripts/test_generate.py`:
  - Takes a sample product record (title + description).
  - Builds the four-beat prompt (Hook / Problem / Solution / CTA).
  - Calls the local Ollama endpoint and requests **JSON output**.
  - Parses and validates the four fields are present and non-empty.
  - Prints the resulting script.
- [ ] Confirm reproducible, well-formed JSON across a few sample products.
- [ ] Note the throughput; flag whether **vLLM** (via Polsia) is needed for batch.

**Done when:** `python scripts/test_generate.py` returns a valid 4-beat script
from the local model.

---

## Phase 3 — Production API Skeletons
Stub the external integrations behind clean interfaces so they can be filled in
and tested independently.

- [ ] **ElevenLabs TTS** (`clients/elevenlabs.py`)
  - `synthesize(text, voice_id) -> audio_path`
  - Reads `ELEVENLABS_API_KEY`; handles auth + basic request/response.
  - Saves audio and returns its path (to be recorded in `audio_assets`).
- [ ] **Video assembly** (`clients/animaker.py`)
  - `assemble(script, audio_path, media_urls) -> video_url`
  - Reads `ANIMAKER_API_KEY`; submits a render job and polls for completion.
  - Returns the exported HD MP4 URL (to be recorded in `video_outputs`).
- [ ] **Sellvia ingestion** (`clients/sellvia.py`)
  - `fetch_products() -> [product records]`
  - Reads `SELLVIA_API_KEY`; normalizes records to the `products` schema.
- [ ] Keep each client behind a small interface + a mock so the pipeline can be
      tested without live API calls.

**Done when:** each client can be imported and called with mocked responses,
and the interfaces match the DB schema fields.

---

## Phase 4 — Verification Loops & Error Handling
Make the pipeline robust enough to run unattended.

- [ ] Build the orchestrator that walks products through all stages, reading and
      writing state in the database.
- [ ] Add per-stage **status tracking** (`pending / running / done / failed`)
      so runs are resumable from the last good step.
- [ ] Add **retry with backoff** around every external call (Sellvia,
      ElevenLabs, Animaker) and the local inference endpoint.
- [ ] Validate outputs between stages:
  - Script has all four beats.
  - Audio file exists and has non-zero duration.
  - Video URL resolves and reports a completed render.
- [ ] Centralized **logging** (structured) and a failure summary per run.
- [ ] A `--dry-run` mode using mock clients for full-loop verification without
      spending API credits.
- [ ] Basic **smoke test**: one product all the way to an MP4 URL.

**Done when:** a single command runs a product through ingestion → script →
audio → video, records every step, and recovers gracefully from an injected
failure at any stage.

---

## Backlog / Later
- Batch orchestration and concurrency limits.
- Metrics dashboard (videos/day, cost/video, failure rate).
- A/B testing of hooks and CTAs.
- Webhook/scheduler to run ingestion on a cadence.
