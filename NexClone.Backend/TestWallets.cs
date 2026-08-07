using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NexClone.Backend.Infrastructure.Data;

var builder = new ConfigurationBuilder()
    .SetBasePath(Environment.CurrentDirectory)
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables();
var config = builder.Build();

var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
optionsBuilder.UseNpgsql("Host=thomas.proxy.rlwy.net;Port=26423;Database=railway;Username=postgres;Password=vEaCDNCWiHsROlcZjJUekWOgTtINWhJY");

using var context = new ApplicationDbContext(optionsBuilder.Options);

var users = context.Users
    .Include(u => u.Wallets)
    .Include(u => u.Subscriptions)
    .Where(u => u.Subscriptions.Any(s => s.Status == "active"))
    .ToList();

int emptyWalletCount = 0;
foreach (var u in users) {
    if (u.Wallets == null || !u.Wallets.Any()) {
        emptyWalletCount++;
        Console.WriteLine($"User {u.Email} has active sub but 0 wallets.");
    }
}
Console.WriteLine($"Total active subscribers: {users.Count}. Subscribers with 0 wallets: {emptyWalletCount}");
