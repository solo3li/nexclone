const axios = require('axios');
const { Client } = require('./node_modules/pg');

const clientId = "ARjmGWCzZOQte5ev7zNvng8eTjtoHSdkWelVbPmI_fHqu3dXua5gtiM-udVH1AD0RP_5FhSUCfV-I7sO";
const clientSecret = "EKpEhtnvWuz4Mu1mYQEqhMUh8wu33n152-fzQ0h1QHqoDU8OXbap7l3skGsUqNvTuHDqKf0xNXkHJ0QX";

async function testPayPal(apiBase) {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    try {
        const res = await axios.post(`${apiBase}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log(`[SUCCESS] Connected to PayPal (${apiBase}): AppID = ${res.data?.app_id}, Scope = ${res.data?.scope}`);
        return true;
    } catch (e) {
        console.log(`[FAILED] Connection to PayPal (${apiBase}):`, e.response?.data?.error_description || e.message);
        return false;
    }
}

async function updateDb(apiBase) {
    const client = new Client({
        host: 'tramway.proxy.rlwy.net',
        port: 37832,
        database: 'railway',
        user: 'postgres',
        password: 'fjHiGhuAwFClkSnGjPrfwwTmNFGGjFEu',
        ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    await client.query(`
        UPDATE "PaymentGatewayConfigs"
        SET "ClientId" = $1, "ClientSecret" = $2, "ApiBase" = $3, "IsActive" = true, "UpdatedAt" = NOW()
        WHERE "ProviderName" = 'PayPal'
    `, [clientId, clientSecret, apiBase]);
    console.log("Updated PayPal configuration in Database successfully!");
    await client.end();
}

async function main() {
    console.log("Testing PayPal Sandbox...");
    const isSandbox = await testPayPal('https://api-m.sandbox.paypal.com');

    let apiBase = 'https://api-m.sandbox.paypal.com';
    if (!isSandbox) {
        console.log("Testing PayPal Live...");
        const isLive = await testPayPal('https://api-m.paypal.com');
        if (isLive) {
            apiBase = 'https://api-m.paypal.com';
        }
    }

    await updateDb(apiBase);
}

main().catch(console.error);
