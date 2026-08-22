#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:5000}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

failures=0
checks=0

check_header() {
  local header="$1"
  local url="$2"
  checks=$((checks + 1))
  local value
  value=$(curl -sI -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

  if curl -sI "$url" 2>/dev/null | grep -qi "^${header}:" ; then
    echo -e "  ${GREEN}PASS${NC} ${header} present on ${url}"
  else
    echo -e "  ${RED}FAIL${NC} ${header} missing on ${url}"
    failures=$((failures + 1))
  fi
}

check_no_header() {
  local header="$1"
  local url="$2"
  checks=$((checks + 1))

  if curl -sI "$url" 2>/dev/null | grep -qi "^${header}:" ; then
    echo -e "  ${RED}FAIL${NC} ${header} should NOT be present on ${url}"
    failures=$((failures + 1))
  else
    echo -e "  ${GREEN}PASS${NC} ${header} absent on ${url}"
  fi
}

check_status() {
  local expected="$1"
  local url="$2"
  checks=$((checks + 1))
  local actual
  actual=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

  if [ "$actual" = "$expected" ]; then
    echo -e "  ${GREEN}PASS${NC} ${url} returned ${actual}"
  else
    echo -e "  ${RED}FAIL${NC} ${url} returned ${actual}, expected ${expected}"
    failures=$((failures + 1))
  fi
}

check_sqli() {
  local url="$1"
  local payload="$2"
  checks=$((checks + 1))
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" -G --data-urlencode "$payload" "$url" 2>/dev/null)

  if [ "$status" = "400" ] || [ "$status" = "404" ] || [ "$status" = "422" ]; then
    echo -e "  ${GREEN}PASS${NC} SQLi payload rejected on ${url} (status ${status})"
  else
    echo -e "  ${YELLOW}WARN${NC} SQLi payload returned ${status} on ${url} (may be benign, verify)"
  fi
}

check_body_contains() {
  local pattern="$1"
  local url="$2"
  checks=$((checks + 1))
  local body
  body=$(curl -s "$url" 2>/dev/null)

  if echo "$body" | grep -q "$pattern"; then
    echo -e "  ${GREEN}PASS${NC} body contains '${pattern}' on ${url}"
  else
    echo -e "  ${RED}FAIL${NC} body missing '${pattern}' on ${url}"
    failures=$((failures + 1))
  fi
}

echo ""
echo "=== SECURITY AUDIT ==="
echo "Target: ${BASE_URL}"
echo ""

echo "[SEC-1] Security Headers"
check_header "X-Content-Type-Options" "${BASE_URL}/"
check_header "X-Frame-Options" "${BASE_URL}/" || echo -e "  ${YELLOW}WARN${NC} X-Frame-Options missing (add if needed)"
check_no_header "Server" "${BASE_URL}/"
check_no_header "X-Powered-By" "${BASE_URL}/"

echo ""
echo "[SEC-2] HTTPS & HSTS"
check_status "200" "${BASE_URL}/health"
# HSTS only applies in production with HTTPS
if echo "$BASE_URL" | grep -q "https"; then
  check_header "Strict-Transport-Security" "${BASE_URL}/"
fi

echo ""
echo "[SEC-3] CORS Configuration"
CORS_ORIGIN=$(curl -sI -X OPTIONS "${BASE_URL}/health" \
  -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: GET" 2>/dev/null \
  | grep -i "Access-Control-Allow-Origin" || echo "none")
if echo "$CORS_ORIGIN" | grep -q "evil.com"; then
  echo -e "  ${RED}FAIL${NC} CORS accepts evil.com origin"
  failures=$((failures + 1))
else
  echo -e "  ${GREEN}PASS${NC} CORS rejects evil.com origin"
fi

echo ""
echo "[SEC-4] SQL Injection Probe"
check_sqli "${BASE_URL}/api/auth/login" "email=' OR '1'='1"
check_sqli "${BASE_URL}/api/auth/login" "email=admin'--"

echo ""
echo "[SEC-5] Rate Limiting"
RATE_COUNT=0
for i in $(seq 1 35); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/auth/login" 2>/dev/null)
  if [ "$STATUS" = "429" ]; then
    RATE_COUNT=$((RATE_COUNT + 1))
  fi
done
echo -e "  Rate-limit responses received: ${RATE_COUNT}"
if [ "$RATE_COUNT" -gt 0 ]; then
  echo -e "  ${GREEN}PASS${NC} Rate limiting active"
else
  echo -e "  ${YELLOW}WARN${NC} No rate limit triggered after 35 requests (may need tuning)"
fi

echo ""
echo "[SEC-6] Metrics Endpoint (no auth bypass check)"
METRICS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/metrics" 2>/dev/null)
if [ "$METRICS_STATUS" = "200" ]; then
  echo -e "  ${YELLOW}WARN${NC} /metrics is publicly accessible (restrict in production)"
else
  echo -e "  ${GREEN}PASS${NC} /metrics is not publicly accessible"
fi

echo ""
echo "[SEC-7] Correlation ID"
check_header "X-Correlation-Id" "${BASE_URL}/health"

echo ""
echo "=== RESULTS ==="
echo "Checks: ${checks}, Failures: ${failures}"
if [ "$failures" -eq 0 ]; then
  echo -e "${GREEN}All security checks passed.${NC}"
  exit 0
else
  echo -e "${RED}${failures} security check(s) failed.${NC}"
  exit 1
fi