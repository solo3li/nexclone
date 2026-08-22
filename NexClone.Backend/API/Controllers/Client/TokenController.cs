using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/auth")]
    [ApiController]
    public class TokenController : AuthControllerBase
    {
        public TokenController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IMediaService mediaService,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            WalletService walletService,
            IHttpClientFactory httpClientFactory)
            : base(userManager, configuration, context, mediaService, emailService, emailTemplateService, walletService, httpClientFactory)
        {
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

            existingToken.IsRevoked = true;
            existingToken.RevokedAt = DateTime.UtcNow;
            existingToken.RevokedByIp = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString();

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
    }
}