import requests
import string
import random
import subprocess
import time
import json

BASE_URL = "http://localhost:8080/api"

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

email = f"testuser_{random_string(5)}@example.com".lower()
password = "Password123!"

print(f"[*] Registering new user: {email}...")
reg_res = requests.post(f"{BASE_URL}/auth/register", json={
    "email": email,
    "password": password,
    "fullName": "Test User",
    "country": "EG"
})

print("[*] Verifying user in database...")
subprocess.run([
    "docker", "exec", "nexclone-postgres", "psql", "-U", "postgres", "-d", "nexclonedb", "-c",
    f"UPDATE \"AspNetUsers\" SET \"IsVerified\" = true WHERE \"Email\" = '{email}';"
])

print("[*] Logging in...")
login_res = requests.post(f"{BASE_URL}/auth/login", json={
    "email": email,
    "password": password
})

# Extract the cookie header manually
cookies_str = login_res.headers.get('Set-Cookie', '')
jwt_cookie = None
for part in cookies_str.split(','):
    part = part.strip()
    if part.startswith('jwt='):
        jwt_cookie = part.split(';')[0]
        break

if not jwt_cookie:
    print("Failed to get JWT cookie.")
    exit(1)

headers = {
    'Cookie': jwt_cookie,
    'Content-Type': 'application/json'
}

print("[*] Adding phone number...")
phone_res = requests.post(f"{BASE_URL}/auth/add-phone", json={
    "phoneNumber": "+2010" + random_string(8).replace('a','1').replace('b','2')[:8]
}, headers=headers)
print("Add Phone Response:", phone_res.status_code)

print("[*] Calling Text-to-Voice API for Arabic...")
tts_res = requests.post(f"{BASE_URL}/ai/text-to-voice/generate", json={
    "text": "مرحبا، هذا اختبار لنظام تحويل النص إلى صوت.",
    "language": "arabic",
    "voiceName": "Aisha",
    "styleInstruction": "Accent: خليجي. Emotion: سعيد. Style: هادئ. Additional Context: تحدث بصوت عالي.",
    "quality": "High"
}, headers=headers)

print("TTS Response:", tts_res.status_code)
if tts_res.status_code == 200:
    print("[+] SUCCESS!")
    print("Response Body:", tts_res.text)
else:
    print("[-] FAILED.")
    print("Response Body:", tts_res.text)
