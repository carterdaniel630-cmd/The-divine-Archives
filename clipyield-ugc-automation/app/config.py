"""
ClipYield — central configuration.

Baseline configuration for the UGC automation engine. All secrets and
service endpoints are read from environment variables so nothing sensitive
is committed to the repository. Copy `.env.example` to `.env` (or export the
variables in your shell) before running any stage.

Required environment variables
------------------------------
  SELLVIA_API_KEY    - auth key for the Sellvia product catalog API (ingestion)
  OLLAMA_HOST        - base URL of the local LLM inference engine (script engine)
  ELEVENLABS_API_KEY - auth key for ElevenLabs text-to-speech (production)
  ANIMAKER_API_KEY   - auth key for the video assembly engine (production)
  DATABASE_URL       - connection string for the central cloud database
"""

import os


def _get(name: str, default: str = "") -> str:
    """Read an environment variable, falling back to a placeholder default."""
    return os.environ.get(name, default)


# ---------------------------------------------------------------------------
# Stage 1 — Ingestion (Sellvia)
# ---------------------------------------------------------------------------
SELLVIA_API_KEY: str = _get("SELLVIA_API_KEY", "your-sellvia-api-key-here")
SELLVIA_BASE_URL: str = _get("SELLVIA_BASE_URL", "https://api.sellvia.com")

# ---------------------------------------------------------------------------
# Stage 2 — Script Engine (local LLM via Ollama / vLLM, orchestrated by Polsia)
# ---------------------------------------------------------------------------
OLLAMA_HOST: str = _get("OLLAMA_HOST", "http://localhost:11434")
LLM_MODEL: str = _get("LLM_MODEL", "llama3")

# ---------------------------------------------------------------------------
# Stage 3 — Production Pipeline (ElevenLabs TTS + video assembly)
# ---------------------------------------------------------------------------
ELEVENLABS_API_KEY: str = _get("ELEVENLABS_API_KEY", "your-elevenlabs-api-key-here")
ELEVENLABS_VOICE_ID: str = _get("ELEVENLABS_VOICE_ID", "")

ANIMAKER_API_KEY: str = _get("ANIMAKER_API_KEY", "your-animaker-api-key-here")

# ---------------------------------------------------------------------------
# Central database (single source of truth for all stages)
# ---------------------------------------------------------------------------
DATABASE_URL: str = _get(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/clipyield",
)


# ---------------------------------------------------------------------------
# Validation helper
# ---------------------------------------------------------------------------
REQUIRED_VARS = (
    "SELLVIA_API_KEY",
    "OLLAMA_HOST",
    "ELEVENLABS_API_KEY",
    "ANIMAKER_API_KEY",
    "DATABASE_URL",
)


def validate_config() -> list[str]:
    """
    Return a list of required variables that are missing or still set to a
    placeholder value. An empty list means the environment is ready.
    """
    missing: list[str] = []
    for name in REQUIRED_VARS:
        value = os.environ.get(name, "")
        if not value or value.endswith("-here") or "user:password" in value:
            missing.append(name)
    return missing


if __name__ == "__main__":
    problems = validate_config()
    if problems:
        print("Configuration incomplete. Set these environment variables:")
        for name in problems:
            print(f"  - {name}")
    else:
        print("Configuration OK — all required variables are set.")
