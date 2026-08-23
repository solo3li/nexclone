#!/bin/bash
API_KEY=$(docker exec nexclone-postgres psql -U nexclone -d nexclone_dev -t -c "SELECT \"ApiKey\" FROM \"ApiConfigurations\" WHERE \"ProviderName\" = 'Gemini' LIMIT 1" | xargs)
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}" \
-H 'Content-Type: application/json' \
-d '{
  "contents": [
    { "parts": [ { "text": "Hello world" } ] }
  ],
  "generationConfig": {
    "responseModalities": [ "AUDIO" ]
  }
}'
