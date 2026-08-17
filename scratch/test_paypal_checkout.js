const axios = require('axios');

async function testCheckoutPay() {
    const BACKEND_URL = "https://noon-postings-modular-virtually.trycloudflare.com";

    // 1. Login with test user to get token
    const testEmail = "test_cf_1787000245254@nexmedia-test.com";
    const testPassword = "Password123!";

    const loginRes = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: testEmail,
        password: testPassword
    });

    const token = loginRes.data.token || loginRes.data.Token;
    console.log("Logged in, token acquired.");

    // 2. Fetch gateways for plan 27
    const gwRes = await axios.get(`${BACKEND_URL}/api/checkout/gateways/27`);
    console.log("Gateways for Plan 27:", gwRes.data);

    // 3. Initiate PayPal payment
    console.log("Initiating PayPal payment for Plan 27 (USD)...");
    const payRes = await axios.post(`${BACKEND_URL}/api/checkout/pay`, {
        planId: 27,
        gatewayConfigId: 4,
        currency: "USD",
        method: "card"
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log("Checkout Result:", payRes.data);
    if (payRes.data?.checkoutUrl) {
        console.log("\n>>> PAYPAL CHECKOUT URL GENERATED SUCCESSFULLY! <<<");
        console.log(payRes.data.checkoutUrl);
    }
}

testCheckoutPay().catch(err => {
    console.error("Error testing checkout pay:", err.response?.data || err.message);
});
