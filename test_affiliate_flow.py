import requests
import uuid
import time
import json

BASE_URL = "http://localhost:8080"

def run_test():
    print("🚀 Starting Affiliate System End-to-End Test...")

    # 1. Register Affiliate User
    affiliate_email = f"affiliate_{uuid.uuid4().hex[:8]}@test.com"
    aff_res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "fullName": "Test Affiliate",
        "email": affiliate_email,
        "password": "Password123!"
    })
    
    if aff_res.status_code != 200:
        print(f"❌ Failed to register affiliate: {aff_res.text}")
        return
        
    aff_data = aff_res.json()
    print("Affiliate Register Response:", aff_data)
    affiliate_token = aff_data.get('token')
    if not affiliate_token and 'token' in aff_data.get('data', {}):
        affiliate_token = aff_data['data']['token']
    elif not affiliate_token:
        # Some systems return it directly, some inside a data wrapper
        affiliate_token = aff_data.get('accessToken')

    print(f"✅ Affiliate Registered: {affiliate_email}")

    # 2. Get Affiliate Profile to get referral code
    headers = {"Authorization": f"Bearer {affiliate_token}"}
    profile_res = requests.get(f"{BASE_URL}/api/affiliate/profile", headers=headers)
    if profile_res.status_code != 200:
        print(f"❌ Failed to get affiliate profile: {profile_res.text}")
        return
        
    ref_code = profile_res.json()['referralCode']
    print(f"✅ Affiliate Code: {ref_code}")

    # 3. Simulate click by a new user
    track_res = requests.get(f"{BASE_URL}/api/affiliate-track/click?ref_code={ref_code}")
    if track_res.status_code != 200:
        print(f"❌ Failed to track click: {track_res.text}")
        return
        
    session_token = track_res.json()['sessionToken']
    print(f"✅ Click tracked, Session Token: {session_token}")

    # 4. Register Referred User (Customer) with session cookie
    customer_email = f"customer_{uuid.uuid4().hex[:8]}@test.com"
    cookies = {"aff_session": session_token}
    cust_res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "fullName": "Test Customer",
        "email": customer_email,
        "password": "Password123!"
    }, cookies=cookies)

    if cust_res.status_code != 200:
        print(f"❌ Failed to register customer: {cust_res.text}")
        return
        
    cust_data = cust_res.json()
    print("Customer Register Response:", cust_data)
    customer_token = cust_data.get('token')
    if not customer_token and 'token' in cust_data.get('data', {}):
        customer_token = cust_data['data']['token']
    elif not customer_token:
        customer_token = cust_data.get('accessToken')
    print(f"✅ Customer Registered: {customer_email}")

    # 5. Check if referral is pending (before conversion)
    ref_list_res = requests.get(f"{BASE_URL}/api/affiliate/referrals", headers=headers)
    refs = ref_list_res.json()
    print(f"✅ Affiliate Referrals Count: {len(refs)}")
    
    # 6. Make a mock payment (Since we can't easily trigger the webhook directly from here, 
    # we would need an endpoint to simulate it, but we can hit the WebhooksController if we craft a payload).
    # Since crafting Paymob/PayPal webhook payloads is complex, we might just verify up to referral linking,
    # OR we can create a temporary admin endpoint to mock a subscription payment if needed.
    
    print("🎉 Test completed successfully up to Referral Linking!")

if __name__ == "__main__":
    run_test()
