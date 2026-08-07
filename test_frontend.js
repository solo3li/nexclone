async function testFlow() {
  console.log("1. Simulating Frontend Login Request...");
  const loginRes = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@test.com",
      password: "Password123!"
    })
  });

  const rawData = await loginRes.json();
  console.log("Received data from API:", rawData);

  // Exact logic from useAuthStore.ts
  const token = rawData?.token || rawData?.Token;
  console.log("2. Token extracted by frontend:", token ? "SUCCESS (Token found)" : "FAILED");

  console.log("3. Simulating Frontend 'fetchMe' Request with saved token...");
  const meRes = await fetch("http://localhost:8080/api/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (meRes.ok) {
    const meData = await meRes.json();
    console.log("fetchMe successful! Status:", meRes.status);
    console.log("User Data:", meData.email, meData.fullName);
  } else {
    console.error("fetchMe failed!", meRes.status);
  }
}

testFlow();
