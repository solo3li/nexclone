import requests
import string
import random
import os
import time

base_url = "http://localhost:8080"
email = ''.join(random.choices(string.ascii_lowercase, k=10)) + "@test.com"
password = "password123"

session = requests.Session()

print(f"Registering {email}...")
res = session.post(f"{base_url}/api/auth/register", json={"email": email, "password": password, "fullName": "Test User"})
print(res.status_code, res.text)

print("Confirming email in db...")
os.system(f'docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "UPDATE \\"AspNetUsers\\" SET \\"EmailConfirmed\\" = true, \\"IsVerified\\" = true WHERE \\"Email\\" = \'{email}\';"')

print("Logging in...")
res = session.post(f"{base_url}/api/auth/login", json={"email": email, "password": password})
print(res.status_code, res.text)

# Add credits to Wallets via User ID
os.system(f'docker exec nexclone-postgres psql -U postgres -d nexclonedb -c "UPDATE \\"Wallets\\" SET \\"Balance\\" = 100 WHERE \\"UserId\\" = (SELECT \\"Id\\" FROM \\"AspNetUsers\\" WHERE \\"Email\\" = \'{email}\');"')

print("Testing start-avatar...")
with open('scratch/lenna.png', 'rb') as f_img, open('scratch/tiny.wav', 'rb') as f_audio:
    files = {
        'Image': ('lenna.png', f_img.read(), 'image/png'),
        'Audio': ('tiny.wav', f_audio.read(), 'audio/wav')
    }
    data = {'prompt': 'Testing E2E avatar'}

    res = session.post(f"{base_url}/api/video/start-avatar", files=files, data=data)
print("Status Code:", res.status_code)
print("Response:", res.text)

if res.status_code == 200:
    task_id = res.json().get('taskId')
    print("Got taskId:", task_id)
    print("Checking status...")
    for _ in range(300):
        time.sleep(10)
        res = session.get(f"{base_url}/api/video/status/{task_id}")
        print("Status:", res.text)
        if "succeeded" in res.text or "failed" in res.text:
            break
