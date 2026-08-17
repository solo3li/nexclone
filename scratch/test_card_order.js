const axios = require('axios');

async function testCardOrder() {
    const clientId = "ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO";
    const clientSecret = "EKpEhtnvWuz4Mu1mYQEqhMUh8wu33n152-fzQ0h1QHqoDU8OXbap7l3skGsUqNvTuHDqKf0xNXkHJ0QX";
    const apiBase = "https://api-m.sandbox.paypal.com";

    // 1. Get Access Token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await axios.post(`${apiBase}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const accessToken = tokenRes.data.access_token;
    console.log("Got access token");

    // 2. Create Order without restricting payment_source to paypal
    const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                reference_id: "test_user|27",
                description: "Subscription — pro",
                amount: {
                    currency_code: "USD",
                    value: "30.00"
                }
            }
        ]
    };

    const orderRes = await axios.post(`${apiBase}/v2/checkout/orders`, orderPayload, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    console.log("Order created:", orderRes.data.id, "Status:", orderRes.data.status);
    const orderId = orderRes.data.id;

    // 3. Test confirm payment source with standard Visa 4111111111111111
    try {
        const confirmRes = await axios.post(`${apiBase}/v2/checkout/orders/${orderId}/confirm-payment-source`, {
            payment_source: {
                card: {
                    name: "John Doe",
                    number: "4111111111111111",
                    expiry: "2028-12",
                    security_code: "123"
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Card confirmed successfully! Status:", confirmRes.data.status);

        // 4. Capture order
        const captureRes = await axios.post(`${apiBase}/v2/checkout/orders/${orderId}/capture`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Captured successfully! Status:", captureRes.data.status);
    } catch (err) {
        console.error("Confirm error:", JSON.stringify(err.response?.data || err.message, null, 2));
    }
}

testCardOrder();
