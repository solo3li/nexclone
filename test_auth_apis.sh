#!/bin/bash
API_URL="http://188.166.65.112:8080/api/auth"
EMAIL="auth_tester_$RANDOM@test.com"
DB_URL="postgresql://nexclone:devpassword123!@188.166.65.112:5432/nexclone_dev"

echo "=== 1. Register ==="
REGISTER_RES=$(curl -s -X POST "$API_URL/register" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"Password123!\", \"fullName\":\"Auth Tester\"}")
echo $REGISTER_RES | jq . || echo $REGISTER_RES

echo -e "\n=== 2. Verify User in DB ==="
psql "$DB_URL" -c "UPDATE \"AspNetUsers\" SET \"EmailConfirmed\" = true, \"IsVerified\" = true WHERE \"Email\" = '$EMAIL';"

echo -e "\n=== 3. Login ==="
LOGIN_RES=$(curl -s -X POST "$API_URL/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"Password123!\"}")
echo $LOGIN_RES | jq . || echo $LOGIN_RES
TOKEN=$(echo $LOGIN_RES | jq -r .token)

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo "Login failed. Exiting."
    exit 1
fi

echo -e "\n=== 4. Add Phone Number ==="
PHONE_RES=$(curl -s -X POST "$API_URL/add-phone" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"phoneNumber\":\"+1234567890\"}")
echo $PHONE_RES | jq . || echo $PHONE_RES

echo -e "\n=== 5. Get Profile (me) ==="
ME_RES=$(curl -s -X GET "$API_URL/me" -H "Authorization: Bearer $TOKEN")
echo $ME_RES | jq . || echo $ME_RES

echo -e "\n=== 6. Resend Cooldown ==="
COOLDOWN_RES=$(curl -s -X GET "$API_URL/resend-cooldown?email=$EMAIL")
echo $COOLDOWN_RES | jq . || echo $COOLDOWN_RES

echo -e "\n=== 7. Logout ==="
LOGOUT_RES=$(curl -s -X POST "$API_URL/logout" -H "Authorization: Bearer $TOKEN")
echo $LOGOUT_RES | jq . || echo $LOGOUT_RES
