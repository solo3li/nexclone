import requests

import subprocess

class ApiClient:
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.session = requests.Session()

    def register(self, email: str, password: str = "Test1234!") -> dict:
        response = self.session.post(f"{self.base_url}/api/auth/register", json={
            "email": email,
            "password": password,
            "fullName": "Test User"
        })
        response.raise_for_status()
        
        # Verify the user directly in the database so we can log in
        subprocess.run([
            "docker", "exec", "nexclone-postgres", "psql", 
            "-U", "nexclone", "-d", "nexclone_dev", 
            "-c", f"UPDATE \"AspNetUsers\" SET \"IsVerified\" = true WHERE \"Email\" = '{email}';"
        ], check=False)
        
        # Now login to get the JWT cookie in the session
        return self.login(email, password)

    def login(self, email: str, password: str = "Test1234!") -> dict:
        response = self.session.post(f"{self.base_url}/api/auth/login", json={
            "email": email,
            "password": password
        })
        response.raise_for_status()
        data = response.json()
        token = data.get("token")
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        return data

    def get_affiliate_settings(self):
        response = self.session.get(f"{self.base_url}/api/affiliate/settings")
        return response.json() if response.status_code == 200 else None

    def get_affiliate_profile(self):
        response = self.session.get(f"{self.base_url}/api/affiliate/profile")
        response.raise_for_status()
        return response.json()

    def get_affiliate_stats(self):
        response = self.session.get(f"{self.base_url}/api/affiliate/stats")
        response.raise_for_status()
        return response.json()
