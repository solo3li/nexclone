import os
import urllib.request
from urllib.error import URLError

base_url = "https://nexmediaai.com"

assets = [
    "/static/home/css/home.css",
    "/static/home/css/lang-switcher.css",
    "/static/home/img/logo.png",
    "/static/home/img/home11.gif",
    "/static/home/img/robot.png",
    "/static/img/avatar.jpg",
    "/static/home/img/convertTxt.png",
    "/static/home/img/convertSpeech.png",
    "/static/home/img/unnamed.png",
    "/static/home/img/videoCaption.jpeg",
    "/static/home/img/removeImg.png"
]

public_dir = os.path.join(os.path.dirname(__file__), "public")

for asset in assets:
    url = base_url + asset
    # Handle /static/img vs /static/home/img
    local_path = os.path.join(public_dir, asset.lstrip("/"))
    
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    print(f"Downloading {url} to {local_path}...")
    try:
        urllib.request.urlretrieve(url, local_path)
        print(f"Success: {asset}")
    except URLError as e:
        print(f"Failed to download {asset}: {e}")

print("Done downloading assets.")
