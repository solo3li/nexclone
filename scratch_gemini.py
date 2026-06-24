import requests
import json
import os
import base64

api_key = os.environ.get("GEMINI_API_KEY", "")
# Read from .backend.env if available
with open('.backend.env', 'r') as f:
    for line in f:
        if "AWS_" in line: continue
        # Just grab the gemini api key if we had it, but wait, it's not in .backend.env!
