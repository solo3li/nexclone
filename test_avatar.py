import requests
import string
import random
import os
import time

base_url = "http://188.166.65.112:8080"
email = ''.join(random.choices(string.ascii_lowercase, k=10)) + "@test.com"
password = "password123"

session = requests.Session()

print(f"Registering {email}...")
res = session.post(f"{base_url}/api/auth/register", json={"email": email, "password": password, "fullName": "Test User"})
print(res.status_code, res.text)

print("Confirming email in db...")
os.system(f'psql "postgresql://nexclone:devpassword123!@188.166.65.112:5432/nexclone_dev" -c "UPDATE \\"AspNetUsers\\" SET \\"EmailConfirmed\\" = true, \\"IsVerified\\" = true WHERE \\"Email\\" = \'{email}\';"')

print("Logging in...")
res = session.post(f"{base_url}/api/auth/login", json={"email": email, "password": password})
print(res.status_code, res.text)

token = res.json().get("token")
session.headers.update({"Authorization": f"Bearer {token}"})

# Add credits to Wallets via User ID
os.system(f'psql "postgresql://nexclone:devpassword123!@188.166.65.112:5432/nexclone_dev" -c "INSERT INTO \\"UserWallets\\" (\\"UserId\\", \\"WalletTypeId\\", \\"Balance\\") VALUES ((SELECT \\"Id\\" FROM \\"AspNetUsers\\" WHERE \\"Email\\" = \'{email}\'), 1, 100);" || true')

print("Testing start-avatar...")
with open('scratch/face.jpg', 'rb') as f_img, open('scratch/tiny.wav', 'rb') as f_audio:
    files = {
        'Image': ('face.jpg', f_img.read(), 'image/jpeg'),
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
