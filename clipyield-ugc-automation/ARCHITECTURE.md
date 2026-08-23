# ClipYield — UGC Automation Engine

## Overview
ClipYield is a fully automated User-Generated Content (UGC) engine that links
e-commerce product catalogs to an AI video production pipeline. It sources
product data, generates high-conversion ad scripts with a locally hosted LLM,
turns those scripts into human-like voiceover, and assembles the audio with
product media into finished HD MP4 videos — with no manual editing step in the
middle.

The system is built as three sequential stages: **Ingestion → Script Engine →
Production Pipeline**, backed by a central database that records state at every
step so runs are resumable and auditable.

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────────┐
│  INGESTION  │ ──▶ │ SCRIPT ENGINE│ ──▶ │  PRODUCTION PIPELINE │
│  (Sellvia)  │     │ (Ollama/vLLM │     │ (ElevenLabs + video  │
│             │     │  via Polsia) │     │  assembly → MP4)     │
└──────┬──────┘     └──────┬───────┘     └──────────┬───────────┘
       │                   │                        │
       ▼                   ▼                        ▼
   ┌───────────────────────────────────────────────────────┐
   │        Central Cloud Database (DATABASE_URL)           │
   │  products · scripts · audio_assets · video_outputs     │
   └───────────────────────────────────────────────────────┘
```

---

## Stage 1 — Ingestion

**Goal:** pull product assets and structured data records into the system.

- **Source:** Sellvia product catalog, accessed via the Sellvia API
  (`SELLVIA_API_KEY`).
- **What is pulled per product:**
  - Identifiers (SKU, product ID, title)
  - Marketing copy (description, features, benefits)
  - Pricing and category metadata
  - Media assets (product images, existing clips) — downloaded and their
    stable URLs/paths recorded
- **Landing zone:** every record is written to the central cloud database
  (`DATABASE_URL`). The database is the single source of truth; downstream
  stages read from it rather than re-calling Sellvia.
- **Idempotency:** ingestion upserts on product ID so re-runs refresh data
  without creating duplicate rows.

**Output of this stage:** a populated `products` table with associated media
asset references, ready for scripting.

---

## Stage 2 — Script Engine

**Goal:** generate high-conversion short-form video scripts from product data.

- **Inference host:** a **local** LLM inference engine — **Ollama** for
  development / single-node, **vLLM** for higher-throughput batched serving.
  Running inference locally keeps per-video cost near zero and keeps product
  data in-house.
- **Orchestration:** **Polsia** manages the inference layer — model lifecycle,
  routing prompts to the running engine, batching, and ret/health checks — so
  the rest of the pipeline talks to one stable endpoint (`OLLAMA_HOST`) instead
  of the raw engine.
- **Prompt contract:** each product record is rendered into a prompt that asks
  the model for a script in a fixed **four-beat UGC structure**:
  1. **Hook** — a scroll-stopping opening line (first 2–3 seconds).
  2. **Problem** — the pain point the product addresses.
  3. **Solution** — the product as the fix, with its key benefit.
  4. **CTA** — a direct call to action (shop / link in bio / limited offer).
- **Output format:** structured JSON (one field per beat) so the Production
  Pipeline can consume beats independently and the full narration can be
  concatenated deterministically.
- **Persistence:** generated scripts are written back to the `scripts` table,
  linked to their product row, with the model name and generation timestamp for
  reproducibility.

**Output of this stage:** a `scripts` row per product containing the four
beats as clean, TTS-ready text.

---

## Stage 3 — Production Pipeline

**Goal:** turn a script into a finished HD MP4.

### 3a. Text-to-Speech (ElevenLabs)
- The concatenated script (Hook → Problem → Solution → CTA) is sent to
  **ElevenLabs** (`ELEVENLABS_API_KEY`) for human-like narration.
- A configured voice ID and voice settings (stability / similarity) are applied
  for a consistent brand voice.
- The returned audio (MP3/WAV) is stored and its path recorded in the
  `audio_assets` table, linked to the script.

### 3b. Video Assembly
- Generated audio + the product's media assets (from Stage 1) are handed to a
  **video assembly engine** (e.g. the **Animaker API**, `ANIMAKER_API_KEY`).
- The assembler:
  - Times product shots / b-roll to the narration beats.
  - Overlays captions and CTA text where configured.
  - Renders and exports a clean **HD MP4**.
- The final video URL/path is written to the `video_outputs` table, closing the
  loop for that product.

**Output of this stage:** an exported HD MP4 per product, with its URL recorded
in the database.

---

## Data Flow Summary

| Stage      | Reads from        | Writes to        | Key dependency        |
|------------|-------------------|------------------|-----------------------|
| Ingestion  | Sellvia API       | `products`, media | `SELLVIA_API_KEY`     |
| Script     | `products`        | `scripts`         | `OLLAMA_HOST` (Polsia)|
| TTS        | `scripts`         | `audio_assets`    | `ELEVENLABS_API_KEY`  |
| Assembly   | `scripts`, `audio_assets`, media | `video_outputs` | `ANIMAKER_API_KEY` |

All stages read and write through the central database (`DATABASE_URL`),
which lets any stage run, retry, or resume independently.

---

## Design Principles
- **Database-centric state:** every stage records its output; the pipeline is
  resumable and each run is auditable.
- **Local-first inference:** scripting runs on self-hosted Ollama/vLLM (via
  Polsia) to control cost and keep catalog data in-house.
- **Loose coupling:** stages communicate only through database rows, so any
  stage can be swapped (e.g. a different TTS or video vendor) without touching
  the others.
- **Idempotent runs:** upserts keyed on product/script IDs make re-runs safe.
