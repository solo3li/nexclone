const { Client } = require('./node_modules/pg');

const client = new Client({
    host: 'tramway.proxy.rlwy.net',
    port: 37832,
    database: 'railway',
    user: 'postgres',
    password: 'fjHiGhuAwFClkSnGjPrfwwTmNFGGjFEu',
    ssl: { rejectUnauthorized: false }
});

async function main() {
    await client.connect();
    const res = await client.query(`
        SELECT ppg."Id", ppg."PlanId", p."Name" as "PlanName", ppg."GatewayConfigId", ppg."Currency", ppg."IsActive", ppg."DisplayName"
        FROM "PlanPaymentGateways" ppg
        JOIN "Plans" p ON p."Id" = ppg."PlanId"
        WHERE ppg."GatewayConfigId" = 4
    `);
    console.log("Plans linked to PayPal:", res.rows);
    await client.end();
}

main().catch(console.error);
