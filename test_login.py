import requests

res = requests.post("http://localhost:8080/api/auth/register", json={
    "email": "test@test.com",
    "password": "Password123!",
    "fullName": "Test User"
})
print("Register:", res.text)

# We need to verify the user first
# Wait, let's just insert directly or use an existing user.
