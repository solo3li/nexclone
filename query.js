const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:fjHiGhuAwFClkSnGjPrfwwTmNFGGjFEu@tramway.proxy.rlwy.net:37832/railway',
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  client.query("SELECT * FROM \"ToolConfigurations\" WHERE \"ToolName\" = 'text-to-voice'", (err, res) => {
    if (err) throw err;
    console.log(res.rows[0].AdditionalSettings);
    client.end();
  });
});
