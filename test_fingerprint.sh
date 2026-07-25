#!/bin/bash
echo "Testing end to end fingerprint feature..."

# 1. Enable fingerprint in DB
echo "Setting Global Settings to enable fingerprint limit = 1"
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "INSERT INTO \"AppSettings\" (\"Key\", \"Value\") VALUES ('FreePlan.FingerprintCheck', 'true') ON CONFLICT (\"Key\") DO UPDATE SET \"Value\" = 'true';"
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "INSERT INTO \"AppSettings\" (\"Key\", \"Value\") VALUES ('FreePlan.MaxUsesPerDevice', '1') ON CONFLICT (\"Key\") DO UPDATE SET \"Value\" = '1';"

# 2. Register first user
echo "Registering first user test_fp7@example.com..."
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"Email": "test_fp7@example.com", "Password": "Password123!", "FullName": "Test One", "Country": "Egypt", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

echo -e "\nVerifying email for test_fp7..."
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "UPDATE \"AspNetUsers\" SET \"EmailConfirmed\" = true, \"IsVerified\" = true WHERE \"Email\" = 'test_fp7@example.com';" > /dev/null

echo "Logging in as test_fp7..."
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies1.txt \
  -d '{"Email": "test_fp7@example.com", "Password": "Password123!", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

echo "Adding phone for test_fp7 to claim free plan..."
curl -s -X POST http://localhost:8080/api/auth/add-phone \
  -H "Content-Type: application/json" \
  -b cookies1.txt \
  -d '{"PhoneNumber": "+202222222222", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

# Check if test_fp7 got the subscription
echo -e "\nChecking subscriptions for test_fp7..."
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "SELECT \"PlanId\", \"Status\" FROM \"Subscriptions\" s JOIN \"AspNetUsers\" u ON s.\"UserId\" = u.\"Id\" WHERE u.\"Email\" = 'test_fp7@example.com';"


# 3. Register second user with SAME fingerprint
echo -e "\n\nRegistering second user test_fp8@example.com..."
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"Email": "test_fp8@example.com", "Password": "Password123!", "FullName": "Test Two", "Country": "Egypt", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

echo -e "\nVerifying email for test_fp8..."
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "UPDATE \"AspNetUsers\" SET \"EmailConfirmed\" = true, \"IsVerified\" = true WHERE \"Email\" = 'test_fp8@example.com';" > /dev/null

echo "Logging in as test_fp8..."
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies2.txt \
  -d '{"Email": "test_fp8@example.com", "Password": "Password123!", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

echo "Adding phone for test_fp8..."
curl -s -X POST http://localhost:8080/api/auth/add-phone \
  -H "Content-Type: application/json" \
  -b cookies2.txt \
  -d '{"PhoneNumber": "+202222222223", "DeviceFingerprint": "fingerprint_888"}' > /dev/null

# Check if test_fp8 got the subscription
echo -e "\nChecking subscriptions for test_fp8 (Should be NONE)..."
docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "SELECT \"PlanId\", \"Status\" FROM \"Subscriptions\" s JOIN \"AspNetUsers\" u ON s.\"UserId\" = u.\"Id\" WHERE u.\"Email\" = 'test_fp8@example.com';"
