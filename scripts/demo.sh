#!/usr/bin/env bash
# Boot Nest API + Next web for the MVP E2E demo path.
# Uses Postgres when DATABASE_URL is set (or DEMO_WITH_POSTGRES=1 starts local compose).
# Falls back to @worksight/common fixtures when DATABASE_URL is unset.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:${API_PORT}}"
DEMO_WITH_POSTGRES="${DEMO_WITH_POSTGRES:-0}"
STARTED_COMPOSE_PG=0

cleanup() {
  if [[ -n "${API_PID:-}" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "${WEB_PID:-}" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
  if [[ "$STARTED_COMPOSE_PG" -eq 1 ]]; then
    echo "==> Leaving local Postgres running (docker compose service postgres)"
  fi
}
trap cleanup EXIT INT TERM

if [[ -z "${DATABASE_URL:-}" && "$DEMO_WITH_POSTGRES" == "1" ]]; then
  echo "==> DEMO_WITH_POSTGRES=1 — starting local Postgres"
  docker compose up -d postgres
  STARTED_COMPOSE_PG=1
  export DATABASE_URL="${DATABASE_URL:-postgresql://worksight:worksight@localhost:5432/worksight}"
  echo "==> Waiting for Postgres"
  for _ in $(seq 1 40); do
    if docker exec worksight_postgres pg_isready -U worksight -d worksight >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

echo "==> Building @worksight/common (required before API)"
pnpm --filter @worksight/common build

echo "==> Building @worksight/api"
pnpm --filter @worksight/api build

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "==> Seeding Postgres from @worksight/common fixtures"
  pnpm --filter @worksight/api seed
fi

echo "==> Starting API on :${API_PORT}"
PORT="$API_PORT" CORS_ORIGINS="http://localhost:${WEB_PORT}" \
  DATABASE_URL="${DATABASE_URL:-}" \
  node apps/api/dist/main.js &
API_PID=$!

echo "==> Waiting for API health"
for _ in $(seq 1 60); do
  if curl -sf "${API_URL}/health" >/dev/null; then
    break
  fi
  sleep 0.25
done
if ! curl -sf "${API_URL}/health" >/dev/null; then
  echo "API failed to become ready at ${API_URL}" >&2
  exit 1
fi

HEALTH_JSON=$(curl -sf "${API_URL}/health")
USER_COUNT=$(curl -sf "${API_URL}/users" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
TASK_COUNT=$(curl -sf "${API_URL}/tasks" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
TEAM_COUNT=$(curl -sf "${API_URL}/teams" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")

echo "    /health → ${HEALTH_JSON}"
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
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "Demo ready (Postgres via DATABASE_URL):"
else
  echo "Demo ready (API fixture mode — set DATABASE_URL or DEMO_WITH_POSTGRES=1 for Neon/local PG):"
fi
echo "  API   ${API_URL}   (docs ${API_URL}/api)"
echo "  Web   http://localhost:${WEB_PORT}"
echo "  Proof http://localhost:${WEB_PORT}/demo"
echo
echo "Curl checklist:"
echo "  curl -s ${API_URL}/health"
echo "  curl -s ${API_URL}/users | head -c 200"
echo "  curl -s ${API_URL}/surveys | head -c 200"
echo
echo "Ctrl+C to stop API + web."

wait "$WEB_PID"
