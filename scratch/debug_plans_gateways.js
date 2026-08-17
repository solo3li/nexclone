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

    console.log("=== ALL PLANS ===");
    const plans = await client.query('SELECT "Id", "Name", "PriceUsd", "PriceEgp", "IsDeleted" FROM "Plans"');
    console.log(plans.rows);

    console.log("\n=== ALL PLAN PAYMENT GATEWAYS ===");
    const ppg = await client.query(`
        SELECT ppg."Id", ppg."PlanId", p."Name" as "PlanName", ppg."GatewayConfigId", gc."ProviderName", ppg."Currency", ppg."IsActive", gc."IsActive" as "GatewayIsActive"
        FROM "PlanPaymentGateways" ppg
        LEFT JOIN "Plans" p ON p."Id" = ppg."PlanId"
        LEFT JOIN "PaymentGatewayConfigs" gc ON gc."Id" = ppg."GatewayConfigId"
    `);
    console.log(ppg.rows);

    await client.end();
}

main().catch(console.error);
