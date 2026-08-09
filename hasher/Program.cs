using Microsoft.AspNetCore.Identity; using System; var hasher = new PasswordHasher<object>(); Console.WriteLine($"HASH: {hasher.HashPassword(null, "Admin123!")}");
