import requests
BASE_URL = "https://api-nexclone-dev.169.58.204.169.nip.io"
login_res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "hamed3alii.3@gmail.com", "password": "Password123!"})
token = login_res.json().get('token') or login_res.json().get('data', {}).get('token')
profile_res = requests.get(f"{BASE_URL}/api/affiliate/profile", headers={"Authorization": f"Bearer {token}"})
print(profile_res.json())
