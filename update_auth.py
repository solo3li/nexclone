import re
import sys

file_path = "/root/nexmedia/nexclone/NexClone.Backend/API/Controllers/Client/AuthController.cs"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update GenerateJwtToken expiry
content = re.sub(
    r'expires:\s*DateTime\.UtcNow\.AddDays\(15\)',
    r'expires: DateTime.UtcNow.AddMinutes(15)',
    content
)

# 2. Add GenerateRefreshToken and replace RefreshTokenEndpoint, Logout, and add LogoutAll
replacement_endpoints = """
        private RefreshToken GenerateRefreshToken(Guid userId, string ipAddress)
        {
            var randomBytes = new byte[64];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return new RefreshToken
            {
                UserId = userId,
                Token = Convert.ToBase64String(randomBytes),
                ExpiresAt = DateTime.UtcNow.AddDays(15),
                CreatedByIp = ipAddress
            };
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokenEndpoint()
        {
            var refreshTokenCookie = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshTokenCookie))
                return Unauthorized(new { Message = "لا يوجد توكن تحديث صالح." });

            var existingToken = await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == refreshTokenCookie);

            if (existingToken == null || !existingToken.IsActive)
                return Unauthorized(new { Message = "توكن التحديث غير صالح أو منتهي." });

            // Revoke old token
            existingToken.IsRevoked = true;
            existingToken.RevokedAt = DateTime.UtcNow;
            existingToken.RevokedByIp = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString();

            // Generate new tokens
            var newJwt = GenerateJwtToken(existingToken.User);
            var newRefreshToken = GenerateRefreshToken(existingToken.UserId, existingToken.RevokedByIp ?? "Unknown");
            existingToken.ReplacedByToken = newRefreshToken.Token;

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            var jwtOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, Expires = DateTime.UtcNow.AddMinutes(15), IsEssential = true };
            var refreshOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, Expires = DateTime.UtcNow.AddDays(15), IsEssential = true };

            Response.Cookies.Append("jwt", newJwt, jwtOptions);
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, refreshOptions);

            return Ok(new AuthResponse { Token = newJwt, Email = existingToken.User.Email!, IsVerified = existingToken.User.IsVerified });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshTokenCookie = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshTokenCookie))
            {
                var existingToken = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshTokenCookie);
                if (existingToken != null)
                {
                    existingToken.IsRevoked = true;
                    existingToken.RevokedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }

            var cookieOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None };
            Response.Cookies.Delete("jwt", cookieOptions);
            Response.Cookies.Delete("refreshToken", cookieOptions);
            return Ok(new { Message = "تم تسجيل الخروج بنجاح" });
        }

        [Authorize]
        [HttpPost("logout-all")]
        public async Task<IActionResult> LogoutAll()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
                         
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var parsedUserId))
                return Unauthorized();

            var activeTokens = await _context.RefreshTokens
                .Where(r => r.UserId == parsedUserId && !r.IsRevoked && r.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            foreach (var t in activeTokens)
            {
                t.IsRevoked = true;
                t.RevokedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();

            var cookieOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None };
            Response.Cookies.Delete("jwt", cookieOptions);
            Response.Cookies.Delete("refreshToken", cookieOptions);
            return Ok(new { Message = "تم تسجيل الخروج من جميع الأجهزة بنجاح" });
        }
"""

old_endpoints = """        [HttpPost("refresh-token")]
        public IActionResult RefreshTokenEndpoint()
        {
            return BadRequest(new { Message = "Refresh tokens are no longer used. Please use the 15-day JWT." });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
            Response.Cookies.Delete("jwt", cookieOptions);
            return Ok(new { Message = "Logged out" });
        }"""

content = content.replace(old_endpoints, replacement_endpoints)


# 3. Modify Login logic
login_token_logic = """            var token = GenerateJwtToken(user);
            
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(15),
                IsEssential = true
            };
            Response.Cookies.Append("jwt", token, cookieOptions);"""

new_login_token_logic = """            var token = GenerateJwtToken(user);
            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var refreshToken = GenerateRefreshToken(user.Id, ipAddress);
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15),
                IsEssential = true
            };
            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(15),
                IsEssential = true
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshOptions);"""

# Notice in Login there is `var ipAddress` already defined earlier. So we shouldn't redefine it.
# Let's fix that.
new_login_token_logic_safe = """            var token = GenerateJwtToken(user);
            
            // X-Forwarded-For was fetched earlier in Login as ipAddress. We can use it.
            // But just in case, we do it safely:
            var ipAddrForRefresh = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var refreshToken = GenerateRefreshToken(user.Id, ipAddrForRefresh);
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15),
                IsEssential = true
            };
            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(15),
                IsEssential = true
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshOptions);"""

content = content.replace(login_token_logic, new_login_token_logic_safe)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AuthController.cs successfully.")
