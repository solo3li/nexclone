import re
import uuid
from playwright.sync_api import Page, expect

# Source: https://playwright.dev/python/docs/intro#writing-a-test
def test_affiliate_registration(page: Page, api_client):
    # Setup: Create a new user that acts as the affiliate
    affiliate_email = f"affiliate_{uuid.uuid4().hex[:8]}@test.com"
    api_client.register(affiliate_email, "Test1234!")
    
    # Get their referral code
    profile = api_client.get_affiliate_profile()
    code = profile["referralCode"]
    assert code is not None, "Affiliate code should be generated"

    # Use Playwright to visit the frontend with the referral link
    page.goto(f"http://localhost:3000/en/register?ref={code}")
    
    # Fill in registration form
    referred_email = f"referred_{uuid.uuid4().hex[:8]}@test.com"
    
    page.locator('input[type="text"]:not([name="manualRefCode"])').fill("Referred Test User")
    page.locator('input[type="email"]').fill(referred_email)
    page.locator('input[type="password"]').fill("Test1234!")
    page.locator('input[type="checkbox"]#privacy').check()
    
    page.locator('button[type="submit"]').click()

    # Success screen should render showing a Mail icon or "Account Created Successfully"
    expect(page.locator("text=Account Created Successfully!")).to_be_visible(timeout=10000)

    # Now verify in the backend that the affiliate's stats incremented
    stats = api_client.get_affiliate_stats()
    total_signups = stats["totalSignups"]
    assert total_signups == 1, f"Expected 1 signup, got {total_signups}"
    assert stats["totalClicks"] > 0, "Expected at least 1 click"

def test_affiliate_commission_and_payout(api_client):
    import uuid
    import subprocess

    def execute_sql(query):
        res = subprocess.run([
            "docker", "exec", "nexclone-postgres", "psql", 
            "-U", "nexclone", "-d", "nexclone_dev", 
            "-t", "-c", query
        ], capture_output=True, text=True)
        assert res.returncode == 0, f"SQL failed: {res.stderr}\nQuery: {query}"
        return res.stdout.strip()

    # 1. Setup Affiliate
    affiliate_email = f"aff_{uuid.uuid4().hex[:8]}@test.com"
    api_client.register(affiliate_email)
    profile = api_client.get_affiliate_profile()
    aff_id = profile["id"]
    code = profile["referralCode"]
    
    # Create a referred user directly
    cust_email = f"cust_{uuid.uuid4().hex[:8]}@test.com"
    api_client.register(cust_email)
    
    # 2. Lookup DB IDs and Insert mock data
    customer_id = execute_sql(f"SELECT \"Id\" FROM \"AspNetUsers\" WHERE \"Email\" = '{cust_email}' LIMIT 1")
    
    # Manually insert Affiliate Referral
    execute_sql(f"INSERT INTO \"AffiliateReferrals\" (\"AffiliateProfileId\", \"SessionToken\", \"ClickedAt\", \"AttributionExpiresAt\", \"ReferredUserId\", \"HasConverted\") VALUES ({aff_id}, 'MOCK-123', NOW(), NOW() + INTERVAL '30 days', '{customer_id}', true)")
    ref_id = execute_sql(f"SELECT \"Id\" FROM \"AffiliateReferrals\" WHERE \"AffiliateProfileId\" = {aff_id} LIMIT 1")
    
    plan_id = execute_sql("SELECT \"Id\" FROM \"Plans\" LIMIT 1")
    sub_id = execute_sql(f"SELECT \"Id\" FROM \"Subscriptions\" WHERE \"UserId\" = '{customer_id}' LIMIT 1")
    
    # If no subscription was created automatically (e.g. no free plan), insert one
    if not sub_id:
        execute_sql(f"INSERT INTO \"Subscriptions\" (\"UserId\", \"PlanId\", \"Status\", \"StartDate\", \"EndDate\", \"CreatedAt\") VALUES ('{customer_id}', {plan_id}, 'active', NOW(), NOW(), NOW())")
        sub_id = execute_sql(f"SELECT \"Id\" FROM \"Subscriptions\" WHERE \"UserId\" = '{customer_id}' LIMIT 1")

    payment_id_raw = execute_sql(f"INSERT INTO \"Payments\" (\"UserId\", \"PlanId\", \"SubscriptionId\", \"Amount\", \"Currency\", \"Method\", \"PaymentId\", \"Status\", \"CreatedAt\", \"UpdatedAt\") VALUES ('{customer_id}', {plan_id}, {sub_id}, 100, 'USD', 'Manual', 'PAY-{uuid.uuid4().hex[:6]}', 'Completed', NOW(), NOW()) RETURNING \"Id\"")
    payment_id = payment_id_raw.split()[0]
    
    # 3. Insert Commission (Available)
    amount = 100.00
    sql = f"""
        INSERT INTO "AffiliateCommissions"
        ("AffiliateProfileId", "AffiliateReferralId", "CustomerId", "PlanId", "SubscriptionId", "PaymentId", "Type", "Amount", "Currency", "Rate", "Status", "CreatedAt", "AvailableAt")
        VALUES
        ({aff_id}, {ref_id}, '{customer_id}', {plan_id}, {sub_id}, {payment_id}, 'FIRST_PURCHASE', {amount}, 'USD', 30, 'AVAILABLE', NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days');
    """
    execute_sql(sql)
    
    # 3. Assert Balance is Available
    api_client.login(affiliate_email)
    stats = api_client.get_affiliate_stats()
    print("DEBUG STATS:", stats)
    usd_balance = next((b for b in stats.get("balances", []) if b["currency"] == "USD"), None)
    assert usd_balance is not None, "USD balance missing"
    assert float(usd_balance["available"]) == amount, f"Expected available balance {amount}, got {usd_balance['available']}"
    
    # 4. Request Payout
    payout_amount = 50.00
    response = api_client.session.post(f"{api_client.base_url}/api/affiliate/payouts", json={
        "amount": payout_amount,
        "currency": "USD",
        "payoutMethod": "PayPal",
        "payoutAccount": "test@paypal.com"
    })
    response.raise_for_status()
    
    # 5. Assert Balance is Deducted
    stats_after = api_client.get_affiliate_stats()
    print("DEBUG STATS AFTER:", stats_after)
    usd_balance_after = next((b for b in stats_after.get("balances", []) if b["currency"] == "USD"), None)
    expected_remaining = amount - payout_amount
    assert float(usd_balance_after["available"]) == expected_remaining, f"Expected available balance {expected_remaining}, got {usd_balance_after['available']}"

def test_affiliate_payout_ui_and_admin(page: Page, api_client):
    import uuid
    import subprocess
    
    def execute_sql(query):
        res = subprocess.run([
            "docker", "exec", "nexclone-postgres", "psql",
            "-U", "nexclone", "-d", "nexclone_dev",
            "-t", "-c", query
        ], capture_output=True, text=True)
        assert res.returncode == 0
        return res.stdout.strip()
        
    # 1. Setup Affiliate
    aff_email = f"aff_{uuid.uuid4().hex[:8]}@test.com"
    aff_pass = "Password123!"
    api_client.register(aff_email, aff_pass)
    profile = api_client.get_affiliate_profile()
    aff_id = profile["id"]
    
    # Insert available balance via commission
    cust_email = f"cust_{uuid.uuid4().hex[:8]}@test.com"
    api_client.register(cust_email)
    
    # 2. Lookup DB IDs and Insert mock data
    customer_id = execute_sql(f"SELECT \"Id\" FROM \"AspNetUsers\" WHERE \"Email\" = '{cust_email}' LIMIT 1")

    # Manually insert Affiliate Referral
    execute_sql(f"INSERT INTO \"AffiliateReferrals\" (\"AffiliateProfileId\", \"SessionToken\", \"ClickedAt\", \"AttributionExpiresAt\", \"ReferredUserId\", \"HasConverted\") VALUES ({aff_id}, 'MOCK-123', NOW(), NOW() + INTERVAL '30 days', '{customer_id}', true)")
    ref_id = execute_sql(f"SELECT \"Id\" FROM \"AffiliateReferrals\" WHERE \"AffiliateProfileId\" = {aff_id} LIMIT 1")

    plan_id = execute_sql("SELECT \"Id\" FROM \"Plans\" LIMIT 1")
    sub_id = execute_sql(f"SELECT \"Id\" FROM \"Subscriptions\" WHERE \"UserId\" = '{customer_id}' LIMIT 1")

    # If no subscription was created automatically, insert one
    if not sub_id:
        execute_sql(f"INSERT INTO \"Subscriptions\" (\"UserId\", \"PlanId\", \"Status\", \"StartDate\", \"EndDate\", \"CreatedAt\") VALUES ('{customer_id}', {plan_id}, 'active', NOW(), NOW(), NOW())")
        sub_id = execute_sql(f"SELECT \"Id\" FROM \"Subscriptions\" WHERE \"UserId\" = '{customer_id}' LIMIT 1")

    payment_id_raw = execute_sql(f"INSERT INTO \"Payments\" (\"UserId\", \"PlanId\", \"SubscriptionId\", \"Amount\", \"Currency\", \"Method\", \"PaymentId\", \"Status\", \"CreatedAt\", \"UpdatedAt\") VALUES ('{customer_id}', {plan_id}, {sub_id}, 100, 'USD', 'Manual', 'PAY-{uuid.uuid4().hex[:6]}', 'Completed', NOW(), NOW()) RETURNING \"Id\"")
    payment_id = payment_id_raw.split()[0]

    execute_sql(f"""
        INSERT INTO "AffiliateCommissions"
        ("AffiliateProfileId", "AffiliateReferralId", "CustomerId", "PlanId", "SubscriptionId", "PaymentId", "Type", "Amount", "Currency", "Rate", "Status", "CreatedAt", "AvailableAt")
        VALUES
        ({aff_id}, {ref_id}, '{customer_id}', {plan_id}, {sub_id}, {payment_id}, 'FIRST_PURCHASE', 100, 'USD', 30, 'AVAILABLE', NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days');
    """)
    
    # 2. Login to UI
    page.goto("http://localhost:3000/en/login")
    page.fill('input[type="email"]', aff_email)
    page.fill('input[type="password"]', aff_pass)
    page.click('button[type="submit"]')
    page.wait_for_url("http://localhost:3000/en", timeout=10000)
    
    # Wait for the Navbar to show the Affiliate link
    page.wait_for_selector('a[href="/en/affiliate"]', timeout=10000)
    
    # 3. Navigate to Affiliate Dashboard and Withdrawals Tab
    # Use client-side navigation instead of page.goto to preserve state!
    page.click('a[href="/en/affiliate"]')
    
    try:
        page.wait_for_selector('text="Withdrawals"', timeout=10000)
    except Exception as e:
        page.screenshot(path="debug_affiliate_dashboard.png", full_page=True)
        raise e
    page.click('button:has-text("Withdrawals")')
    page.wait_for_selector('text="Request Payout"', timeout=5000)
    
    # 4. Request payout > Available balance
    page.fill('input[type="number"]', "150")
    page.fill('textarea', "test@paypal.com")
    page.click('button:has-text("Submit Payout Request")')
    
    # Expect error toast or validation
    error_msg = page.locator('text=/exceeds|Insufficient/i').first
    error_msg.wait_for(state="visible", timeout=5000)
    
    # 5. Request valid payout
    page.fill('input[type="number"]', "50")
    page.click('button:has-text("Submit Payout Request")')
    
    success_msg = page.locator('text=/Payout request submitted successfully/i').first
    success_msg.wait_for(state="visible", timeout=5000)
    
    # Verify the payout was inserted into the database by the UI
    payout_count = execute_sql(f"""
        SELECT COUNT(*) FROM "AffiliatePayouts"
        WHERE "AffiliateProfileId" = {aff_id} AND "Amount" = 50 AND "Status" = 'PENDING'
    """)
    assert int(payout_count.strip()) == 1, "Payout should be recorded in the database"
    
    # 6. Admin Approval via SQL (Since Admin is MVC)
    execute_sql(f"""
        UPDATE "AffiliatePayouts" 
        SET "Status" = 'APPROVED'
        WHERE "AffiliateProfileId" = {aff_id} AND "Status" = 'PENDING';
    """)
    
    execute_sql(f"""
        UPDATE "AffiliatePayouts" 
        SET "Status" = 'PAID'
        WHERE "AffiliateProfileId" = {aff_id} AND "Status" = 'APPROVED';
    """)
    
    # 7. Check final balances via API
    api_client.login(aff_email, aff_pass)
    stats_after = api_client.get_affiliate_stats()
    
    usd_balance_after = next((b for b in stats_after.get("balances", []) if b["currency"] == "USD"), None)
    assert usd_balance_after["available"] == 50.0, "Available balance should be deducted by 50"

