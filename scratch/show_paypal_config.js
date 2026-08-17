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
    const res = await client.query('SELECT "Id", "ProviderName", "ClientId", "ClientSecret", "ApiBase", "IsActive", "UpdatedAt" FROM "PaymentGatewayConfigs" WHERE "ProviderName" = \'PayPal\'');
    console.log(JSON.stringify(res.rows[0], null, 2));
    await client.end();
}
main().catch(console.error);
