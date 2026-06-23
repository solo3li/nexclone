import requests
import re
import os
import uuid

BASE_URL = "http://localhost:8080/api"
session = requests.Session()

def print_result(name, res):
    if res.status_code in [200, 201]:
        print(f"✅ {name}: SUCCESS ({res.status_code})")
        try:
            print("   ->", str(res.json())[:100] + "...")
        except:
            pass
    else:
        print(f"❌ {name}: FAILED ({res.status_code})")
        try:
            print("   ->", res.json())
        except:
            print("   ->", res.text[:200])

def test_media_pipeline():
    print("🚀 Starting Media & AI Tools Test...")

    # 1. Register/Login a new unique user to avoid IP limit issues, or login as existing
    email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    password = "Password123!"
    
    print("\n[Auth]")
    res = session.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password, "fullName": "Test User"})
    
    # If failed due to IP trial limit, let's just login as the standard user
    if res.status_code != 200:
        email = "test_e2e_user@example.com"
        res = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    
    set_cookie = res.headers.get("Set-Cookie", "")
    match = re.search(r"jwt=([^;]+)", set_cookie)
    if match:
        token = match.group(1)
        session.headers.update({"Authorization": f"Bearer {token}"})
        print("✅ Logged in and Token extracted.")
    else:
        print("❌ Login failed: JWT cookie not found.")
        return

    # 2. Get Presigned URL
    print("\n[Media Upload - S3/Railway]")
    res = session.post(f"{BASE_URL}/Media/upload-url", json={
        "fileName": "test_audio.wav",
        "contentType": "audio/wav",
        "toolName": "voice-to-text"
    })
    print_result("Get Presigned URL", res)
    
    if res.status_code != 200:
        return
        
    data = res.json()
    upload_url = data.get("url")
    object_name = data.get("objectName")
    
    # 3. Upload File to the Bucket
    dummy_audio = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    upload_res = requests.put(upload_url, data=dummy_audio, headers={"Content-Type": "audio/wav"})
    
    if upload_res.status_code == 200:
        print("✅ Upload to Bucket: SUCCESS (200)")
    else:
        print(f"❌ Upload to Bucket: FAILED ({upload_res.status_code})")
        print("   ->", upload_res.text)
        return

    # 4. Transcribe using the backend tool
    print("\n[AI Tool: Voice-to-Text]")
    res = session.post(f"{BASE_URL}/ai/voice-to-text/transcribe", json={
        "fileId": object_name,
        "translate": False,
        "targetLanguage": "en"
    })
    print_result("Voice-to-Text Transcribe", res)

    # 5. Text to Voice using the backend tool
    print("\n[AI Tool: Text-to-Voice]")
    res = session.post(f"{BASE_URL}/ai/text-to-voice/generate", json={
        "text": "Hello World. This is a test of the text to voice system.",
        "language": "other",
        "voiceName": "alloy",
        "styleInstruction": ""
    })
    print_result("Text-to-Voice Generate", res)

if __name__ == "__main__":
    test_media_pipeline()
