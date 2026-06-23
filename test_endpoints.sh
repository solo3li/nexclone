#!/bin/bash

# Configuration
API_URL="http://localhost:8080/api"
echo "======================================"
echo "   Testing NexClone API Endpoints     "
echo "   Target: $API_URL                   "
echo "======================================"
echo ""

# Helper function to test an endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local expected_status=$3
    local payload=$4

    echo -n "Testing $method $path ... "
    
    # Use curl to get the HTTP status code
    if [ "$method" == "GET" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$path")
    elif [ "$method" == "POST" ]; then
        if [ -n "$payload" ]; then
            status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$payload" "$API_URL$path")
        else
            status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL$path")
        fi
    fi

    # Check if the status matches what we roughly expect (200 OK, or 401 Unauthorized for protected routes)
    if [ "$status_code" == "$expected_status" ]; then
        echo -e "\e[32m[PASS]\e[0m (Status: $status_code)"
    else
        echo -e "\e[31m[FAIL]\e[0m (Status: $status_code, Expected: $expected_status)"
    fi
}

echo "--- Public Endpoints (Expected 200 OK) ---"
test_endpoint "GET" "/settings/public" "200"
test_endpoint "GET" "/platform/stats" "200"
test_endpoint "GET" "/platform/plans" "200"
test_endpoint "GET" "/platform/voices" "200"
test_endpoint "GET" "/platform/tts-config" "200"
echo ""

echo "--- Protected Endpoints (Expected 401 Unauthorized without Token) ---"
test_endpoint "GET" "/auth/me" "401"
test_endpoint "GET" "/history" "401"
test_endpoint "GET" "/profile" "401"
test_endpoint "GET" "/manualpayments/methods" "401"
test_endpoint "POST" "/ai/text-to-voice/estimate" "401" '{"text": "test"}'
echo ""

echo "--- Invalid Endpoints (Expected 404 Not Found) ---"
test_endpoint "GET" "/this/does/not/exist" "404"

echo ""
echo "Done testing endpoints."
