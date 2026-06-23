import requests
import re
import uuid

BASE_URL = "http://localhost:8080/api"
session = requests.Session()

def print_result(name, res):
    if res.status_code in [200, 201]:
        print(f"✅ {name}: SUCCESS ({res.status_code})")
        try:
            print("   ->", str(res.json())[:150] + "...")
        except:
            pass
    else:
        print(f"❌ {name}: FAILED ({res.status_code})")
        print("   ->", res.text[:200])

def test_uploads():
    print("🚀 Starting Media Uploads Test (Profile & Tickets)...")

    # Login
    email = "test_e2e_user@example.com"
    password = "Password123!"
    
    res = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password}, timeout=10)
    set_cookie = res.headers.get("Set-Cookie", "")
    match = re.search(r"jwt=([^;]+)", set_cookie)
    if match:
        session.headers.update({"Authorization": f"Bearer {match.group(1)}"})
        print("✅ Logged in")
    else:
        print("❌ Failed to login")
        return

    # A valid tiny transparent GIF
    dummy_image = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"

    print("\n[1. Profile Picture Upload]")
    files = {"ProfileImage": ("profile.gif", dummy_image, "image/gif")}
    data = {"FullName": "Updated Test User"}
    res = session.put(f"{BASE_URL}/profile", data=data, files=files, timeout=10)
    print_result("Profile Upload", res)

    print("\n[2. Create Support Ticket]")
    res = session.post(f"{BASE_URL}/tickets", json={"subject": "Test Issue", "message": "Help me!"}, timeout=10)
    print_result("Create Ticket", res)
    
    if res.status_code == 200:
        ticket_id = res.json().get("id")
        
        print("\n[3. Support Ticket Image Upload]")
        files = {"attachment": ("screenshot.gif", dummy_image, "image/gif")}
        data = {"content": "Here is the screenshot."}
        res = session.post(f"{BASE_URL}/tickets/{ticket_id}/message", data=data, files=files, timeout=10)
        print_result("Ticket Message with Attachment", res)

if __name__ == "__main__":
    test_uploads()
