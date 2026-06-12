#!/bin/bash
# DECKIO project bootstrap — runs once on postCreateCommand.
# Idempotent: safe to run multiple times; each step is guarded.
set -euo pipefail

WORKSPACE="$(pwd)"

echo "==> Configuring git safe directory..."
git config --global --add safe.directory "$WORKSPACE"

# ── Git initialisation ────────────────────────────────────────────────────────
if [ ! -d ".git" ]; then
  echo "==> Initialising git repository..."
  git init -b main
else
  echo "==> Git repository already initialised, skipping."
fi

# ── DECKIO scaffolding ────────────────────────────────────────────────────────
# Only scaffold when no DECKIO project is present yet (no deck-engine dependency).
if ! grep -q "deck-engine" package.json 2>/dev/null; then
  if [ "${DECKIO_INTERACTIVE:-}" = "true" ] || ([ "${CODESPACES:-}" != "true" ] && [ -t 0 ]); then
    echo "==> Scaffolding DECKIO project into current directory..."
    # `--yes` skips interactive prompts; `.` targets the current directory.
    npx --yes create-deckio@latest .
  else
    echo "==> Non-interactive or Codespaces environment detected, skipping scaffold."
    echo "    Run the 'Setup DECKIO' task or execute '.devcontainer/setup.sh' manually in the terminal to scaffold the project."
  fi
else
  echo "==> DECKIO project already present, skipping scaffold."
fi

# ── Node dependencies ─────────────────────────────────────────────────────────
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
  echo "==> Installing npm dependencies..."
  npm install
else
  echo "==> node_modules already present, skipping install."
fi

# ── Initial git commit ────────────────────────────────────────────────────────
if ! git log --oneline -1 &>/dev/null; then
  echo "==> Creating initial commit..."
  git add -A
  git commit -m "chore: bootstrap DECKIO presentation project"
  echo "==> Initial commit created on branch 'main'."
else
  echo "==> Git history already exists, skipping initial commit."
fi

echo ""
echo "================================================"
echo "  DECKIO project ready!"
echo "  Run the 'Start DECKIO' task to start the dev server."
echo "  Use GitHub Copilot Agent mode to build your deck."
echo "================================================"
