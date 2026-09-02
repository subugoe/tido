#!/usr/bin/env bash
#
# Run the Cypress E2E suite against the production examples build.
#
# Handles this environment's quirks so tests can be launched in one step:
#   - starts the mock API (:8181) if not already running
#   - builds the examples and serves them on :2222 (unless --no-serve)
#   - picks a Chromium binary (system, or the Playwright/Puppeteer cache) since
#     `cypress run --browser chrome` needs an actual Chrome install
#   - sets LD_LIBRARY_PATH to the locally-extracted NSS/NSPR libs when the
#     system libnss3/libnspr4 packages are missing (WSL/devcontainers)
#
# Usage:
#   tests/run-e2e.sh                 # full suite
#   tests/run-e2e.sh --spec "tests/cypress/e2e/config.cy.js"
#   tests/run-e2e.sh --no-serve      # reuse an already-running :2222 server
#
# Manual alternative after installing the real packages (see AGENTS.md):
#   npm run api & npm run test

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BROWSER_ARGS=()
NSS_DIRS=()

# 1. Optional local NSS/NSPR libs (from `npm run e2e:setup-libs` or manual extraction).
LOCAL_NSS_DIRS="$(find /tmp/opencode -type d -path '*/usr/lib/x86_64-linux-gnu' 2>/dev/null \
  | while read -r d; do if ls "$d"/libnss3.so >/dev/null 2>&1 || ls "$d"/libnspr4.so >/dev/null 2>&1; then echo "$d"; fi; done \
  | head -10 | tr '\n' ':')"
NSS_DIRS=()
if [[ -n "$LOCAL_NSS_DIRS" ]]; then
  NSS_DIRS+=("$LOCAL_NSS_DIRS")
fi

# 2. Pick a Chrome-family browser.
CHROMIUM="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser 2>/dev/null || true)"
if [[ -z "$CHROMIUM" ]]; then
  CHROMIUM="$(find "$HOME/.cache/ms-playwright" -maxdepth 4 -type f -name chrome 2>/dev/null | head -1 || true)"
fi
if [[ -z "$CHROMIUM" ]]; then
  CHROMIUM="$(find "$HOME/.cache/puppeteer" -maxdepth 6 -type f -name chrome 2>/dev/null | head -1 || true)"
fi
if [[ -n "$CHROMIUM" ]]; then
  BROWSER_ARGS=(--browser "$CHROMIUM")
else
  echo "warning: no Chrome/Chromium found - falling back to --browser chrome" >&2
  BROWSER_ARGS=(--browser chrome)
fi

# 3. LD_LIBRARY_PATH for Cypress' bundled Electron when NSS/NSPR are missing.
if [[ "${#NSS_DIRS[@]}" -gt 0 ]]; then
  export LD_LIBRARY_PATH="$(IFS=:; echo "${NSS_DIRS[*]}")${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
fi

# 4. Mock API on :8181.
if ! curl -sf -o /dev/null http://localhost:8181/example/collections/example.json; then
  (npm run api >/tmp/opencode/api.log 2>&1 &)
  for i in $(seq 1 30); do
    curl -sf -o /dev/null http://localhost:8181/example/collections/example.json && break
    sleep 1
  done
fi

# 5. Build + serve examples on :2222 unless asked to reuse an existing server.
if [[ "${1:-}" != "--no-serve" ]] && ! curl -sf -o /dev/null http://127.0.0.1:2222/e2e.html; then
  npm run build:test >/tmp/opencode/build-test.log 2>&1
  cp -r dist/. examples/dist/
  node .build/copy-api-mocks.js
  node .build/generate-config-html.js --fragment > examples/config-reference.html
  (setsid nohup npm run examples >/tmp/opencode/examples.log 2>&1 &)
  for i in $(seq 1 30); do
    curl -sf -o /dev/null http://127.0.0.1:2222/e2e.html && break
    sleep 1
  done
fi

if [[ "${1:-}" == "--no-serve" ]]; then
  shift
fi

CY_ARGS=("${BROWSER_ARGS[@]}" "$@")
echo "Running: npx cypress run ${CY_ARGS[*]}"
exec npx cypress run "${CY_ARGS[@]}"
