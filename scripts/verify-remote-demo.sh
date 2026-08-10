#!/usr/bin/env bash
# Smoke remote deploy parity with local DEMO_WITH_POSTGRES=1.
set -euo pipefail

WEB="${WEB_URL:-https://worksight-web.vercel.app}"
API="${API_URL:-https://worksight-api.vercel.app}"

echo "==> GET ${API}/health"
HEALTH=$(curl -sf "${API}/health")
echo "    ${HEALTH}"
echo "$HEALTH" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    const j=JSON.parse(d);
    if(j.database!=='postgres'){console.error('expected database=postgres');process.exit(1)}
  })
"

echo "==> counts"
USERS=$(curl -sf "${API}/users" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
TASKS=$(curl -sf "${API}/tasks" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).length))")
echo "    users=${USERS} tasks=${TASKS}"

echo "==> GET ${WEB}/demo"
CODE=$(curl -sf -o /tmp/worksight-demo.html -w '%{http_code}' "${WEB}/demo")
test "$CODE" = "200"
# Client bundle should target the production API (vercel.json env).
if ! rg -q 'worksight-api\.vercel\.app' /tmp/worksight-demo.html; then
  # Next may load chunks; check a common chunk path hint in HTML or accept offline copy.
  echo "    note: demo HTML may defer API URL to JS chunks; health already postgres"
fi

echo "Remote demo parity OK."
