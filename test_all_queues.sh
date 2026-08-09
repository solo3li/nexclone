#!/bin/bash
API_URL="http://188.166.65.112:8080/api"
EMAIL="auth_tester_11973@test.com"
PASSWORD="Password123!"

echo "Logging in..."
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")
TOKEN=$(echo $LOGIN_RES | jq -r .token)

echo "1. Triggering Avatar Queue..."
curl -s -X POST "$API_URL/video/start-avatar" \
  -H "Authorization: Bearer $TOKEN" \
  -F "Image=@scratch/face.jpg;type=image/jpeg" \
  -F "Audio=@scratch/tiny.wav;type=audio/wav" \
  -F "prompt=Test Avatar" | jq .

echo "2. Triggering LipSync Queue..."
curl -s -X POST "$API_URL/video/start-lipsync" \
  -H "Authorization: Bearer $TOKEN" \
  -F "Video=@scratch/video.mp4;type=video/mp4" \
  -F "Audio=@scratch/tiny.wav;type=audio/wav" | jq .

echo "3. Triggering TTS Queue..."
curl -s -X POST "$API_URL/tts/start" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voiceId":1,"speed":1.0}' | jq .
