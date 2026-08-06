#!/bin/bash
API_KEY="paat-Y4nYo17Q8XXODMS7gsxOsqD8Ka7"

echo "=== Testing Kling Avatar (Image to Video) ==="
curl -s -X POST "https://api.picsart.com/gw-v2/workflows/kling-avatar/submit" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "params": {
        "prompt": "The speaker talks naturally to camera",
        "imageUrls": ["https://picsum.photos/512"],
        "audioUrl": "https://www.w3schools.com/html/horse.mp3",
        "renderingSpeed": "std"
    }
  }'

echo -e "\n\n=== Testing Kling Motion Control (Motion Transfer) ==="
curl -s -X POST "https://api.picsart.com/gw-v2/workflows/kling-motion-control/submit" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "params": {
        "prompt": "",
        "imageUrls": ["https://picsum.photos/512"],
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "resolution": "720p",
        "renderingSpeed": "std",
        "orientation": "front",
        "keepOriginalSound": false
    }
  }'
echo ""
