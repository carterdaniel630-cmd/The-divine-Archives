#!/usr/bin/env bash
# Runs at the start of every Claude Code session on this repo (.claude/settings.json, SessionStart).
# 1. Installs the graphify CLI (pinned to the version of the skill in .claude/skills/graphify) if missing.
# 2. Puts the latest published knowledge graph (branch `graph`, built by .github/workflows/graphify.yml
#    from main) into graphify-out/, unless this session already has a newer local one.
# It never fails the session: every step is time-limited and errors are reported, not raised.
set -u
GRAPHIFY_VERSION="0.9.85"
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}" || exit 0

cli="missing"
if command -v graphify >/dev/null 2>&1; then
  cli="present"
else
  if timeout 150 python3 -m pip install -q --disable-pip-version-check --break-system-packages "graphifyy==$GRAPHIFY_VERSION" >/dev/null 2>&1 \
     || timeout 150 python3 -m pip install -q --disable-pip-version-check --user "graphifyy==$GRAPHIFY_VERSION" >/dev/null 2>&1; then
    hash -r; command -v graphify >/dev/null 2>&1 && cli="installed"
  fi
fi

graph="none"
if timeout 90 git fetch -q --depth 1 origin '+refs/heads/graph:refs/remotes/origin/graph' >/dev/null 2>&1; then
  if [ ! -f graphify-out/graph.json ] || [ ! -f graphify-out/.local ]; then
    rm -rf graphify-out && git archive origin/graph graphify-out | tar -x && graph="$(cat graphify-out/SOURCE 2>/dev/null || echo published)"
  else
    graph="local (kept; published copy not pulled)"
  fi
fi

if command -v graphify >/dev/null 2>&1 && [ -f graphify-out/graph.json ]; then
  python3 -c "import sys; open('graphify-out/.graphify_python','w').write(sys.executable)" 2>/dev/null || true
fi

echo "graphify: CLI ${cli}; graph ${graph}."
if [ "$cli" = "missing" ] && [ -f graphify-out/GRAPH_REPORT.md ]; then
  echo "graphify: the CLI could not be installed in this session (package index blocked?). Read graphify-out/GRAPH_REPORT.md for the code map; graphify query/path/explain are unavailable."
fi
exit 0
