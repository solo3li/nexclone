import requests
import uuid
import re

BASE_URL = "http://localhost:8080/api"
session = requests.Session()

def print_result(name, res):
    if res.status_code in [200, 201]:
        print(f"✅ {name}: SUCCESS ({res.status_code})")
        try:
            print("   ->", str(res.json())[:150] + "...")
        except:
            pass
    elif res.status_code in [400, 401, 403, 404]:
        print(f"⚠️ {name}: EXPECTED ERROR ({res.status_code})")
        print("   ->", res.text[:150])
    else:
        print(f"❌ {name}: FAILED ({res.status_code})")
        print("   ->", res.text[:200])

def test_all():
    print("🚀 Starting Comprehensive Backend API Tests...")

    # 1. AUTHENTICATION
    print("\n--- 1. Authentication ---")
    random_id = str(uuid.uuid4())[:8]
    email = f"test_all_{random_id}@example.com"
    password = "Password123!"

    res = session.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password, "fullName": "Test All User"}, timeout=10)
    print_result("Register", res)

    res = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password}, timeout=10)
    print_result("Login", res)

    set_cookie = res.headers.get("Set-Cookie", "")
    match = re.search(r"jwt=([^;]+)", set_cookie)
    if match:
        session.headers.update({"Authorization": f"Bearer {match.group(1)}"})
    else:
        print("❌ Could not extract JWT token. Aborting.")
        return

    res = session.get(f"{BASE_URL}/auth/me", timeout=10)
    print_result("Get Me", res)

    # 2. PROFILE
    print("\n--- 2. Profile ---")
    dummy_image = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    files = {"ProfileImage": ("profile.gif", dummy_image, "image/gif")}
    data = {"FullName": "Updated Test All User"}
    res = session.put(f"{BASE_URL}/profile", data=data, files=files, timeout=10)
    print_result("Update Profile", res)

    res = session.post(f"{BASE_URL}/profile/change-password", json={"currentPassword": password, "newPassword": "NewPassword123!"}, timeout=10)
    print_result("Change Password", res)

    # Re-login with new password
    res = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": "NewPassword123!"}, timeout=10)
    match = re.search(r"jwt=([^;]+)", res.headers.get("Set-Cookie", ""))
    if match: session.headers.update({"Authorization": f"Bearer {match.group(1)}"})

    # 3. SETTINGS & PLANS
    print("\n--- 3. Settings & Plans ---")
    res = session.get(f"{BASE_URL}/settings/public", timeout=10)
    print_result("Get Public Settings", res)
    res = session.get(f"{BASE_URL}/plans", timeout=10)
    print_result("Get Plans", res)

    # 4. MEDIA
    print("\n--- 4. Media ---")
    res = session.post(f"{BASE_URL}/media/upload-url", json={"fileName": "test.txt", "contentType": "text/plain", "toolName": "tests"}, timeout=10)
    print_result("Get Upload URL", res)

    # 5. SUPPORT TICKETS
    print("\n--- 5. Support Tickets ---")
    res = session.post(f"{BASE_URL}/tickets", json={"subject": "E2E Test Issue", "message": "I need help with E2E testing"}, timeout=10)
    print_result("Create Ticket", res)
    ticket_id = None
    if res.status_code == 200:
        ticket_id = res.json().get("id")
        
    res = session.get(f"{BASE_URL}/tickets", timeout=10)
    print_result("List Tickets", res)

    if ticket_id:
        res = session.get(f"{BASE_URL}/tickets/{ticket_id}", timeout=10)
        print_result("Get Ticket Details", res)

        files = {"attachment": ("screenshot.gif", dummy_image, "image/gif")}
        data = {"content": "Here is my screenshot"}
        res = session.post(f"{BASE_URL}/tickets/{ticket_id}/message", data=data, files=files, timeout=10)
        print_result("Send Ticket Message", res)

    # 6. BLOG
    print("\n--- 6. Blog ---")
    res = session.get(f"{BASE_URL}/blogapi", timeout=10)
    print_result("List Blog Posts", res)
    blog_id = None
    if res.status_code == 200 and res.json():
        blog_id = res.json()[0].get("id")
    
    if blog_id:
        res = session.get(f"{BASE_URL}/blogapi/{blog_id}", timeout=10)
        print_result("Get Blog Details", res)
        
        res = session.post(f"{BASE_URL}/blogapi/{blog_id}/comments", json={"content": "Great post!"}, timeout=10)
        print_result("Post Comment", res)

    # 7. AI TOOLS
    print("\n--- 7. AI Tools ---")
    res = session.post(f"{BASE_URL}/ai/text-to-voice/estimate", json={"text": "Hello world", "provider": "OpenAI"}, timeout=10)
    print_result("TTS Estimate", res)

    res = session.post(f"{BASE_URL}/ai/text-to-voice/generate", json={"text": "Hello world", "provider": "OpenAI", "voiceId": "alloy"}, timeout=20)
    print_result("TTS Generate", res)

    res = session.post(f"{BASE_URL}/ai/voice-to-text/estimate", json={"durationSeconds": 10}, timeout=10)
    print_result("STT Estimate", res)

    res = session.post(f"{BASE_URL}/ai/voice-to-text/transcribe", json={"fileId": "dummy_object"}, timeout=20)
    print_result("STT Transcribe", res)

    # 8. HISTORY
    print("\n--- 8. History ---")
    res = session.get(f"{BASE_URL}/history", timeout=10)
    print_result("List History", res)
    
    history_id = None
    if res.status_code == 200 and isinstance(res.json(), list) and len(res.json()) > 0:
        history_id = res.json()[0].get("id")
        
    if history_id:
        res = session.get(f"{BASE_URL}/history/{history_id}", timeout=10)
        print_result("Get History Item", res)
        
        res = session.delete(f"{BASE_URL}/history/{history_id}", timeout=10)
        print_result("Delete History Item", res)

    # 9. PAYMENTS
    print("\n--- 9. Payments ---")
    res = session.get(f"{BASE_URL}/manualpayments/methods", timeout=10)
    print_result("List Payment Methods", res)
    method_id = None
    if res.status_code == 200 and res.json():
        method_id = res.json()[0].get("id")
        
    if method_id:
        files = {"ReceiptImage": ("receipt.gif", dummy_image, "image/gif")}
        data = {"ManualPaymentMethodId": method_id, "PlanId": 1} # Assume PlanId 1 exists or fails gracefully
        res = session.post(f"{BASE_URL}/manualpayments", data=data, files=files, timeout=10)
        print_result("Submit Manual Payment", res)

    res = session.get(f"{BASE_URL}/manualpayments/pending", timeout=10)
    print_result("Get Pending Payments", res)

    res = session.post(f"{BASE_URL}/checkoutapi/pay", json={"planId": 1, "gateway": "stripe"}, timeout=10)
    print_result("Checkout Initialize", res)

    print("\n🏁 Test run complete.")

if __name__ == "__main__":
    test_all()
