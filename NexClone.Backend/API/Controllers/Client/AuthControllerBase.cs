using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NexClone.Backend.API.Controllers.Client
{
    public abstract class AuthControllerBase : ControllerBase
    {
        protected readonly UserManager<ApplicationUser> _userManager;
        protected readonly IConfiguration _configuration;
        protected readonly ApplicationDbContext _context;
        protected readonly IMediaService _mediaService;
        protected readonly IEmailService _emailService;
        protected readonly IEmailTemplateService _emailTemplateService;
        protected readonly WalletService _walletService;
        protected readonly IHttpClientFactory _httpClientFactory;

        protected AuthControllerBase(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IMediaService mediaService,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            WalletService walletService,
            IHttpClientFactory httpClientFactory)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _mediaService = mediaService;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
            _httpClientFactory = httpClientFactory;
        }

        protected string GenerateJwtToken(ApplicationUser user)
        {
            var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found");
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        protected RefreshToken GenerateRefreshToken(Guid userId, string ipAddress)
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
    }
}