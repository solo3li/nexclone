const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:fjHiGhuAwFClkSnGjPrfwwTmNFGGjFEu@tramway.proxy.rlwy.net:37832/railway',
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  client.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'AppSettings' AND column_name = 'Key'", (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    client.end();
  });
});
