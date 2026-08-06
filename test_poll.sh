#!/bin/bash
INFERENCE_ID="2e0f912a-1409-4a12-9870-82e334ac19b7"
API_KEY="paat-Y4nYo17Q8XXODMS7gsxOsqD8Ka7"

URLS=(
    "https://genai-api.picsart.io/v1/inferences/$INFERENCE_ID"
    "https://genai-api.picsart.io/v1/image2video/inferences/$INFERENCE_ID"
    "https://api.picsart.com/v1/image2video/inferences/$INFERENCE_ID"
    "https://api.picsart.com/v1/inferences/$INFERENCE_ID"
)

for URL in "${URLS[@]}"; do
    echo "Testing: $URL"
    curl -s -X GET "$URL" -H "X-Picsart-API-Key: $API_KEY" | jq .
    echo ""
done
