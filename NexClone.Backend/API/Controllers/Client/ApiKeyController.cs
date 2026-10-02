using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApiKeyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApiKeyController(ApplicationDbContext context)
        {
            _context = context;
        }

        private static string HashKey(string key)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(key));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }

        private static string GenerateRawKey()
        {
            byte[] randomBytes = new byte[24];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            string token = Convert.ToHexString(randomBytes).ToLowerInvariant();
            return $"nex_live_{token}";
        }

        [HttpGet("my-key")]
        public async Task<IActionResult> GetMyKey()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var activeKey = await _context.UserApiKeys
                .FirstOrDefaultAsync(k => k.UserId == userId && k.IsActive);

            if (activeKey == null)
            {
                // Generate default key for user on first request
                string rawKey = GenerateRawKey();
                string hash = HashKey(rawKey);

                activeKey = new UserApiKey
                {
                    UserId = userId,
                    KeyHash = hash,
                    KeyPrefix = rawKey.Substring(0, 16) + "...",
                    Name = "Default MCP Key",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.UserApiKeys.Add(activeKey);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    apiKey = rawKey,
                    prefix = activeKey.KeyPrefix,
                    createdAt = activeKey.CreatedAt,
                    isActive = activeKey.IsActive
                });
            }

            return Ok(new
            {
                apiKey = (string?)null, // Hidden for security unless regenerating, but prefix provided
                prefix = activeKey.KeyPrefix,
                createdAt = activeKey.CreatedAt,
                lastUsedAt = activeKey.LastUsedAt,
                isActive = activeKey.IsActive
            });
        }

        [HttpPost("regenerate")]
        public async Task<IActionResult> RegenerateKey()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Deactivate all existing keys for this user
            var oldKeys = await _context.UserApiKeys
                .Where(k => k.UserId == userId && k.IsActive)
                .ToListAsync();

            foreach (var k in oldKeys)
            {
                k.IsActive = false;
            }

            // Create new key
            string rawKey = GenerateRawKey();
            string hash = HashKey(rawKey);

            var newKey = new UserApiKey
            {
                UserId = userId,
                KeyHash = hash,
                KeyPrefix = rawKey.Substring(0, 16) + "...",
                Name = "MCP & API Key",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.UserApiKeys.Add(newKey);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                apiKey = rawKey,
                prefix = newKey.KeyPrefix,
                createdAt = newKey.CreatedAt,
                isActive = newKey.IsActive,
                message = "API Key generated successfully. Please copy it now."
            });
        }
    }
}
