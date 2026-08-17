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

    // 1. Fetch active plans
    const activePlans = await client.query('SELECT "Id", "Name" FROM "Plans" WHERE "IsDeleted" = false');
    console.log("Active plans:", activePlans.rows);

    // 2. Fetch gateways
    const gateways = await client.query('SELECT "Id", "ProviderName" FROM "PaymentGatewayConfigs" WHERE "IsActive" = true');
    console.log("Active gateways:", gateways.rows);

    const paymob = gateways.rows.find(g => g.ProviderName === 'Paymob');
    const paypal = gateways.rows.find(g => g.ProviderName === 'PayPal');

    for (const plan of activePlans.rows) {
        // Link Paymob for EGP
        if (paymob) {
            const existingPaymob = await client.query(
                'SELECT * FROM "PlanPaymentGateways" WHERE "PlanId" = $1 AND "GatewayConfigId" = $2 AND "Currency" = $3',
                [plan.Id, paymob.Id, 'EGP']
            );
            if (existingPaymob.rows.length === 0) {
                await client.query(`
                    INSERT INTO "PlanPaymentGateways" ("PlanId", "GatewayConfigId", "Currency", "DisplayName", "IsDefault", "IsActive", "SortOrder")
                    VALUES ($1, $2, 'EGP', 'Paymob', true, true, 1)
                `, [plan.Id, paymob.Id]);
                console.log(`Linked Paymob (EGP) to Plan ${plan.Id} (${plan.Name})`);
            } else {
                await client.query('UPDATE "PlanPaymentGateways" SET "IsActive" = true WHERE "Id" = $1', [existingPaymob.rows[0].Id]);
                console.log(`Updated Paymob (EGP) for Plan ${plan.Id} (${plan.Name}) to Active`);
            }
        }

        // Link PayPal for USD
        if (paypal) {
            const existingPaypal = await client.query(
                'SELECT * FROM "PlanPaymentGateways" WHERE "PlanId" = $1 AND "GatewayConfigId" = $2 AND "Currency" = $3',
                [plan.Id, paypal.Id, 'USD']
            );
            if (existingPaypal.rows.length === 0) {
                await client.query(`
                    INSERT INTO "PlanPaymentGateways" ("PlanId", "GatewayConfigId", "Currency", "DisplayName", "IsDefault", "IsActive", "SortOrder")
                    VALUES ($1, $2, 'USD', 'PayPal', true, true, 1)
                `, [plan.Id, paypal.Id]);
                console.log(`Linked PayPal (USD) to Plan ${plan.Id} (${plan.Name})`);
            } else {
                await client.query('UPDATE "PlanPaymentGateways" SET "IsActive" = true WHERE "Id" = $1', [existingPaypal.rows[0].Id]);
                console.log(`Updated PayPal (USD) for Plan ${plan.Id} (${plan.Name}) to Active`);
            }
        }
    }

    console.log("\n=== VERIFYING PLAN PAYMENT GATEWAYS FOR ACTIVE PLANS ===");
    const res = await client.query(`
        SELECT ppg."Id", ppg."PlanId", p."Name" as "PlanName", ppg."GatewayConfigId", gc."ProviderName", ppg."Currency", ppg."IsActive"
        FROM "PlanPaymentGateways" ppg
        JOIN "Plans" p ON p."Id" = ppg."PlanId"
        JOIN "PaymentGatewayConfigs" gc ON gc."Id" = ppg."GatewayConfigId"
        WHERE p."IsDeleted" = false
    `);
    console.log(res.rows);

    await client.end();
}

main().catch(console.error);
