using System;
using Npgsql;
string connStr = ""Host=tramway.proxy.rlwy.net;Port=45956;Database=railway;Username=postgres;Password=xMItPohJvEDuPclYyKqKAlwLqOWhXhKk"";
using var conn = new NpgsqlConnection(connStr);
conn.Open();
using var cmd = new NpgsqlCommand(""SELECT \""Email\"", \""IsVerified\"" FROM \""Users\"" WHERE \""Email\""='hamed3alii.3@gmail.com';" ??????", conn);
using var reader = cmd.ExecuteReader();
if (reader.Read()) {
    Console.WriteLine($""Found: {reader.GetString(0)}, Verified: {reader.GetBoolean(1)}"");
} else {
    Console.WriteLine(""User not found."");
}
