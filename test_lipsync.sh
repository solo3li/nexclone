#!/bin/bash
set -e

echo "Logging in..."
LOGIN_RESP=$(curl -c cookies.txt -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser456@example.com","password":"Password123!"}')

IS_VERIFIED=$(echo $LOGIN_RESP | jq -r '.isVerified')
if [ "$IS_VERIFIED" != "true" ]; then
    echo "Login failed: $LOGIN_RESP"
    exit 1
fi
echo "Got token."

# Create dummy video and audio
dd if=/dev/urandom of=dummy.mp4 bs=1024 count=100
dd if=/dev/urandom of=dummy.mp3 bs=1024 count=100

echo "Starting Lip Sync..."
curl -v -b cookies.txt -X POST http://localhost:8080/api/video/start-lipsync \
  -F "video=@dummy.mp4" \
  -F "audio=@dummy.mp3"
echo ""
