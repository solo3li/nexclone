#!/bin/bash
API_URL="http://188.166.65.112:8080"
EMAIL="tester_$RANDOM@test.com"
DB_URL="postgresql://nexclone:devpassword123!@188.166.65.112:5432/nexclone_dev"

echo "1. Registering $EMAIL..."
curl -s -X POST "$API_URL/api/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"Password123!\", \"fullName\":\"Test User\"}"

echo -e "\n\n2. Verifying user and adding balance in DB..."
psql "$DB_URL" -c "UPDATE \"AspNetUsers\" SET \"EmailConfirmed\" = true, \"IsVerified\" = true WHERE \"Email\" = '$EMAIL';"
psql "$DB_URL" -c "UPDATE \"UserWallets\" SET \"Balance\" = 100 WHERE \"UserId\" = (SELECT \"Id\" FROM \"AspNetUsers\" WHERE \"Email\" = '$EMAIL');"

echo -e "\n3. Logging in..."
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"Password123!\"}")
TOKEN=$(echo $RESPONSE | jq -r .token)
if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo "Failed to get token: $RESPONSE"
    exit 1
fi
echo "Login successful!"

echo -e "\n4. Testing LipSync Estimate (Duration: 12 seconds)..."
curl -s -X GET "$API_URL/api/video/estimate-lipsync?durationSeconds=12" -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n5. Testing Current Plan Details via Auth Controller..."
curl -s -X GET "$API_URL/api/auth/me" -H "Authorization: Bearer $TOKEN" | jq .
