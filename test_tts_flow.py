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
print("Register Response:", reg_res.status_code)

print("[*] Verifying user in database...")
subprocess.run([
    "docker", "exec", "nexclone-postgres", "psql", "-U", "postgres", "-d", "nexclonedb", "-c",
    f"UPDATE \"AspNetUsers\" SET \"IsVerified\" = true WHERE \"Email\" = '{email}';"
], capture_output=True)

print("[*] Logging in...")
login_res = requests.post(f"{BASE_URL}/auth/login", json={
    "email": email,
    "password": password
})
print("Login Response:", login_res.status_code)

session = requests.Session()
session.cookies.update(login_res.cookies)

print("[*] Adding phone number to trigger Default Plan assignment...")
phone_res = session.post(f"{BASE_URL}/auth/add-phone", json={
    "phoneNumber": "+2010" + random_string(8).replace('a','1').replace('b','2')[:8]
})
print("Add Phone Response:", phone_res.status_code, phone_res.text)

print("[*] Checking wallets to ensure credits were added...")
subprocess.run([
    "docker", "exec", "nexclone-postgres", "psql", "-U", "postgres", "-d", "nexclonedb", "-c",
    f"SELECT w.\"Balance\", wt.\"Name\" FROM \"UserWallets\" w JOIN \"WalletTypes\" wt ON w.\"WalletTypeId\" = wt.\"Id\" JOIN \"AspNetUsers\" u ON w.\"UserId\" = u.\"Id\" WHERE u.\"Email\" = '{email}';"
])

print("[*] Calling Text-to-Voice API...")
tts_res = session.post(f"{BASE_URL}/ai/text-to-voice/generate", json={
    "text": "Hello, this is a test of the text to voice system for a new user with the default plan.",
    "language": "en-US",
    "voiceName": "en-US-Journey-D",
    "styleInstruction": "",
    "quality": "Standard"
})
print("TTS Response:", tts_res.status_code)

if tts_res.status_code == 200:
    print("[+] SUCCESS! Flow completed perfectly.")
else:
    print("[-] FAILED to generate TTS.")
    print("Response Body:", tts_res.text)

