import requests
import uuid
import time

BASE_URL = "https://api-nexclone-dev.169.58.204.169.nip.io"
AFFILIATE_EMAIL = "hamed3alii.3@gmail.com"
PASSWORD = "Password123!"

def run_test():
    print(f"🚀 Starting Affiliate System Test for {AFFILIATE_EMAIL}...")

    # 1. Login as Affiliate
    login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": AFFILIATE_EMAIL,
        "password": PASSWORD
    })
    
    if login_res.status_code != 200:
        print(f"❌ Failed to login: {login_res.text}")
        return
        
    login_data = login_res.json()
    token = login_data.get('token')
    if not token and 'data' in login_data:
        token = login_data['data'].get('token')
    elif not token:
        token = login_data.get('accessToken')
        
    print(f"✅ Logged in successfully!")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Onboard Affiliate (ignore if already onboarded)
    onboard_res = requests.post(f"{BASE_URL}/api/affiliate/onboard", json={
        "mobileNumber": "123456789"
    }, headers=headers)
    print("Onboard Response:", onboard_res.status_code, onboard_res.text)

    # 3. Get Affiliate Profile to get referral code
    profile_res = requests.get(f"{BASE_URL}/api/affiliate/profile", headers=headers)
    if profile_res.status_code != 200:
        print(f"❌ Failed to get affiliate profile: {profile_res.text}")
        return
        
    ref_code = profile_res.json()['referralCode']
    print(f"✅ Affiliate Code for Hamed: {ref_code}")

    # 4. Simulate frontend tracking a click
    track_res = requests.get(f"{BASE_URL}/api/affiliate-track/click?ref_code={ref_code}")
    if track_res.status_code != 200:
        print(f"❌ Failed to track click: {track_res.text}")
        return
        
    track_data = track_res.json()
    if not track_data.get("tracked"):
        print(f"❌ Click tracked but returned tracked=false. {track_data}")
        return
        
    session_token = track_data['sessionToken']
    print(f"✅ Click tracked! Session Token: {session_token}")

    # 5. Register a referred user
    customer_email = f"hamed_ref_{uuid.uuid4().hex[:8]}@test.com"
    cookies = {"aff_session": session_token}
    cust_res = requests.post(f"{BASE_URL}/api/auth/register", json={
        "fullName": "Referred User",
        "email": customer_email,
        "password": "Password123!"
    }, cookies=cookies)

    if cust_res.status_code != 200:
        print(f"❌ Failed to register customer: {cust_res.text}")
        return
        
    print(f"✅ Customer Registered: {customer_email}")

    # 6. Check if referral is pending in Hamed's dashboard
    ref_list_res = requests.get(f"{BASE_URL}/api/affiliate/referrals", headers=headers)
    refs = ref_list_res.json()
    print(f"✅ Affiliate Referrals Count: {len(refs)}")
    
    found = any(r.get('referredUserEmail') == customer_email for r in refs)
    if found:
        print("🎉 SUCCESS: The referred user is visible in the affiliate dashboard!")
    else:
        print("⚠️ Failed: The referred user was NOT found in the affiliate dashboard!")
        
    print("End of script.")

if __name__ == "__main__":
    time.sleep(2) # Give backend time to start
    run_test()
