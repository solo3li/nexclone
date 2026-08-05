const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';

async function fetchApi(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  
  let text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  
  return {
    status: res.status,
    headers: res.headers,
    data
  };
}

async function runTests() {
  console.log("=== Avatar Video Test ===");
  
  const testEmail = `testuser_${crypto.randomBytes(4).toString('hex')}@example.com`;
  const password = "Password123!";
  
  console.log(`\n1. Registering user: ${testEmail}`);
  const regRes = await fetchApi("/api/auth/register", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "Test User",
      email: testEmail,
      password: password,
      country: "US"
    })
  });
  
  console.log(`\n-> Setting up user in DB...`);
  const psqlPrefix = `docker exec -e PGPASSWORD=localpassword nexclone-postgres psql -U postgres -d nexclonedb -t -c`;
  
  // Verify
  execSync(`${psqlPrefix} "UPDATE \\\"AspNetUsers\\\" SET \\\"IsVerified\\\" = true WHERE \\\"Email\\\" = '${testEmail}';"`);
  
  // Get UserId
  const userIdRaw = execSync(`${psqlPrefix} "SELECT \\\"Id\\\" FROM \\\"AspNetUsers\\\" WHERE \\\"Email\\\" = '${testEmail}';"`);
  const userId = userIdRaw.toString().trim();
  
  // Insert a Plan (or find an existing one)
  const planIdRaw = execSync(`${psqlPrefix} "SELECT \\\"Id\\\" FROM \\\"Plans\\\" LIMIT 1;"`);
  let planId = planIdRaw.toString().trim();
  
  // Insert a Subscription
  execSync(`${psqlPrefix} "INSERT INTO \\\"Subscriptions\\\" (\\\"UserId\\\", \\\"PlanId\\\", \\\"Status\\\", \\\"StartDate\\\", \\\"EndDate\\\", \\\"CreatedAt\\\") VALUES ('${userId}', ${planId}, 'active', NOW(), NOW() + INTERVAL '30 days', NOW());"`);
  
  // Update Wallet
  execSync(`${psqlPrefix} "UPDATE \\\"UserWallets\\\" SET \\\"Balance\\\" = 1000 WHERE \\\"UserId\\\" = '${userId}';"`);
  
  console.log(`\n3. Logging in...`);
  const loginRes = await fetchApi("/api/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: password
    })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  const cookies = setCookieHeader ? setCookieHeader.split(', ').find(c => c.includes('jwt=')) : null;
  const authCookie = cookies ? cookies.split(';')[0] : '';
  
  const meRes = await fetchApi("/api/auth/me", {
    headers: { Cookie: authCookie }
  });
  
  const user = meRes.data;
  const activeSubs = user.activeSubscriptions;
  const subId = activeSubs[0].id;
  
  console.log(`\n4. Testing POST /api/video/start-avatar...`);
  const axios = require('axios');
  const FormData = require('form-data');
  const formData = new FormData();
  
  const imgData = fs.readFileSync('/root/nexmedia/nexclone/lenna.jpg');
  formData.append('image', imgData, { filename: 'lenna.jpg', contentType: 'image/jpeg' });
  
  const audioData = fs.readFileSync('/root/nexmedia/nexclone/dummy.mp3');
  formData.append('audio', audioData, { filename: 'dummy.mp3', contentType: 'audio/mpeg' });
  
  formData.append('prompt', "The speaker talks naturally");
  formData.append('renderingSpeed', "std");
  formData.append('subscriptionId', subId);
  
  try {
    const avatarRes = await axios.post("http://localhost:8080/api/video/start-avatar", formData, {
      headers: {
        Cookie: authCookie,
        ...formData.getHeaders()
      }
    });
    console.log(`Avatar Status: ${avatarRes.status}`);
    console.log(`Avatar Response:`, avatarRes.data);
  } catch (err) {
    console.log(`Avatar Error Status: ${err.response?.status}`);
    console.log(`Avatar Error Data:`, err.response?.data);
  }
}
runTests();
