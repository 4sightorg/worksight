#!/usr/bin/env bash
# Boot Nest API + Next web for the MVP E2E demo path (#18).
# Fixture-backed only — does not start Supabase.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:${API_PORT}}"

cleanup() {
  if [[ -n "${API_PID:-}" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "${WEB_PID:-}" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> Building @worksight/common (required before API)"
pnpm --filter @worksight/common build

echo "==> Building @worksight/api"
pnpm --filter @worksight/api build

echo "==> Starting API on :${API_PORT}"
PORT="$API_PORT" CORS_ORIGINS="http://localhost:${WEB_PORT}" \
  node apps/api/dist/main.js &
API_PID=$!

echo "==> Waiting for API health (GET /users)"
for _ in $(seq 1 40); do
  if curl -sf "${API_URL}/users" >/dev/null; then
    break
  fi
  sleep 0.25
done
if ! curl -sf "${API_URL}/users" >/dev/null; then
  echo "API failed to become ready at ${API_URL}" >&2
  exit 1
fi

USER_COUNT=$(curl -sf "${API_URL}/users" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
TASK_COUNT=$(curl -sf "${API_URL}/tasks" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
TEAM_COUNT=$(curl -sf "${API_URL}/teams" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")

echo "    /users  → ${USER_COUNT} employees"
echo "    /teams  → ${TEAM_COUNT} teams"
echo "    /tasks  → ${TASK_COUNT} assignments"

echo "==> Starting web on :${WEB_PORT} (offline auth + API data mode)"
NEXT_PUBLIC_IS_OFFLINE=true \
IS_OFFLINE=true \
NEXT_PUBLIC_USE_API=true \
NEXT_PUBLIC_API_URL="$API_URL" \
  pnpm --filter @worksight/web exec next dev --turbopack -p "$WEB_PORT" &
WEB_PID=$!

echo
echo "Demo ready (fixture-backed, not Supabase):"
echo "  API   ${API_URL}   (swagger ${API_URL}/api)"
echo "  Web   http://localhost:${WEB_PORT}"
echo "  Proof http://localhost:${WEB_PORT}/demo"
echo
echo "Curl checklist:"
echo "  curl -s ${API_URL}/users | head -c 200"
echo "  curl -s ${API_URL}/teams | head -c 200"
echo "  curl -s ${API_URL}/tasks | head -c 200"
echo
echo "Ctrl+C to stop both processes."

wait "$WEB_PID"
