import requests
import uuid
import time
import json

BASE_URL = "https://api-nexclone-dev.169.58.204.169.nip.io"
AFFILIATE_EMAIL = "hamed3alii.3@gmail.com"
PASSWORD = "Password123!"

def run_test():
    print(f"🚀 Starting Conversion Test for {AFFILIATE_EMAIL}...")

    # 1. Login as Affiliate
    login_res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": AFFILIATE_EMAIL, "password": PASSWORD})
    token = login_res.json().get('token') or login_res.json().get('data', {}).get('token') or login_res.json().get('accessToken')
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Code
    profile_res = requests.get(f"{BASE_URL}/api/affiliate/profile", headers=headers)
    ref_code = profile_res.json()['referralCode']
    print(f"✅ Affiliate Code: {ref_code}")

    # 3. Simulate click
    track_res = requests.get(f"{BASE_URL}/api/affiliate-track/click?ref_code={ref_code}")
    session_token = track_res.json()['sessionToken']
    print(f"✅ Click tracked! Session Token: {session_token}")

    # 4. Register customer
    customer_email = f"hamed_paid_{uuid.uuid4().hex[:8]}@test.com"
    cust_res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "fullName": "Paid Customer", "email": customer_email, "password": "Password123!"
    }, cookies={"aff_session": session_token})
    print(f"✅ Customer Registered: {customer_email}")
    cust_data = cust_res.json()

    # 5. Check Initial Stats
    stats_res = requests.get(f"{BASE_URL}/api/affiliate/stats", headers=headers)
    stats_before = stats_res.json()
    print(f"📊 Stats BEFORE payment: Signups: {stats_before.get('totalSignups')}, Paid: {stats_before.get('paidCustomers')}, Active Subs: {stats_before.get('activeSubscriptions')}")

    # 6. Mock a payment (Create commission via admin)
    print(f"Mocking payment for user {customer_email} and plan 1")
    mock_res = requests.post(f"{BASE_URL}/api/webhooks/mock-payment?email={customer_email}&planId=1")
    print(f"Mock Payment Response: {mock_res.status_code} {mock_res.text}")

    # 7. Check Final Stats
    time.sleep(1)
    stats_after_res = requests.get(f"{BASE_URL}/api/affiliate/stats", headers=headers)
    stats_after = stats_after_res.json()
    print(f"📊 Stats AFTER payment: Signups: {stats_after.get('totalSignups')}, Paid: {stats_after.get('paidCustomers')}, Active Subs: {stats_after.get('activeSubscriptions')}, Conversion: {stats_after.get('conversionRate')}%")
    
    print("End of phase 1.")

if __name__ == "__main__":
    run_test()
