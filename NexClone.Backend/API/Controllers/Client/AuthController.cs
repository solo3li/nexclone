using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.RateLimiting;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly WalletService _walletService;

        public AuthController(
            UserManager<ApplicationUser> userManager, 
            IConfiguration configuration, 
            ApplicationDbContext context, 
            IMediaService mediaService, 
            IEmailService emailService, 
            IEmailTemplateService emailTemplateService,
            WalletService walletService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _mediaService = mediaService;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
        }

        private static readonly HttpClient _httpClient = new HttpClient();

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var modelErrors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { Errors = modelErrors });
            }

            // 1. Check if email already exists
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                if (existingUser.IsVerified)
                {
                    return BadRequest(new { Errors = new[] { "هذا البريد مسجل بالفعل، يرجى تسجيل الدخول بدلاً من ذلك." } });
                }
                else
                {
                    return BadRequest(new { Errors = new[] { "هذا البريد مسجل لدينا ولكنه يحتاج إلى تفعيل. يرجى مراجعة صندوق الوارد الخاص بك أو تسجيل الدخول لإعادة إرسال رابط التفعيل." } });
                }
            }

            // 2. Check for disposable email
            var domain = request.Email.Split('@').LastOrDefault()?.ToLower();
            if (!string.IsNullOrEmpty(domain))
            {
                try
                {
                    var response = await _httpClient.GetAsync($"https://open.kickbox.com/v1/disposable/{domain}");
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        using var doc = System.Text.Json.JsonDocument.Parse(content);
                        if (doc.RootElement.TryGetProperty("disposable", out var isDisposableElement) && isDisposableElement.GetBoolean())
                        {
                            return BadRequest(new { Errors = new[] { "عفواً، لا يمكن التسجيل باستخدام بريد إلكتروني مؤقت (Disposable Email)." } });
                        }
                    }
                }
                catch
                {
                    // Ignore errors so registration isn't blocked if API is down
                }
            }

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            var fingerprint = request.DeviceFingerprint ?? string.Empty;

            // Check if this fingerprint or IP has ever registered an account
            bool hasClaimedFreeTrial = false;
            bool freeTrialAssigned = false;
            
            if (!string.IsNullOrEmpty(fingerprint))
            {
                hasClaimedFreeTrial = await _context.DeviceFingerprints.AnyAsync(df => df.FingerprintHash == fingerprint);
            }
            
            if (!hasClaimedFreeTrial)
            {
                hasClaimedFreeTrial = await _context.DeviceFingerprints.AnyAsync(df => df.IpAddress == ipAddress);
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                Country = request.Country,
                CreatedAt = DateTime.UtcNow,
                LastVerificationEmailSentAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = new List<string>();
                foreach (var error in result.Errors)
                    errors.Add(error.Description);
                return BadRequest(new { Errors = errors });
            }


            // Log fingerprint
            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                FingerprintHash = fingerprint
            });


            // Assign free trial plan if eligible
            if (!hasClaimedFreeTrial)
            {
                var targetPlan = await _context.Plans.FirstOrDefaultAsync(p => p.IsDefaultRegistrationPlan)
                              ?? await _context.Plans.FirstOrDefaultAsync(p => p.IsFreeTrial);

                if (targetPlan != null)
                {
                    _context.Subscriptions.Add(new Subscription
                    {
                        UserId = user.Id,
                        PlanId = targetPlan.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddDays(targetPlan.DurationDays),
                        Status = "active"
                    });
                    freeTrialAssigned = true;
                }
            }

            await _context.SaveChangesAsync();

            var verificationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var origin = Request.Headers["Origin"].FirstOrDefault() ?? "http://178.62.192.74:3000";
            var locale = origin.Contains("localhost") ? "ar" : "ar";
            var verifyLink = $"{origin}/{locale}/verify-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(verificationToken)}";

            string emailHtml = $@"
<div style='font-family: Arial, sans-serif; background-color: #0a0015; color: #ffffff; padding: 40px; text-align: center; border-radius: 8px;'>
    <h2 style='color: #8b5cf6;'>تأكيد البريد الإلكتروني</h2>
    <p style='color: #d1d5db; font-size: 16px; margin-bottom: 30px;'>مرحباً بك في NexMedia! يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.</p>
    <a href='{verifyLink}' style='background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block;'>تفعيل الحساب</a>
</div>";

            await _emailService.SendEmailAsync(user.Email, user.FullName ?? user.UserName ?? "User", "تفعيل الحساب - NexMedia", emailHtml);

            return Ok(new { Message = "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.", FreeTrialAssigned = freeTrialAssigned });

        }

        [HttpGet("resend-cooldown")]
        public async Task<IActionResult> GetResendCooldown([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest(new { Message = "البريد الإلكتروني مطلوب." });

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound(new { Message = "المستخدم غير موجود." });

            if (user.IsVerified) return Ok(new { Allowed = false, Message = "تم تفعيل الحساب مسبقاً." });

            if (user.LastVerificationEmailSentAt.HasValue)
            {
                var timeSinceLastEmail = DateTime.UtcNow - user.LastVerificationEmailSentAt.Value;
                var cooldown = TimeSpan.FromMinutes(5);

                if (timeSinceLastEmail < cooldown)
                {
                    var remainingSeconds = (int)(cooldown - timeSinceLastEmail).TotalSeconds;
                    return Ok(new { Allowed = false, RemainingSeconds = remainingSeconds });
                }
            }

            return Ok(new { Allowed = true, RemainingSeconds = 0 });
        }

        [HttpPost("resend-verification")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> ResendVerification([FromBody] VerifyEmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Email)) return BadRequest(new { Message = "البريد الإلكتروني مطلوب." });

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return NotFound(new { Message = "المستخدم غير موجود." });

            if (user.IsVerified) return BadRequest(new { Message = "تم تفعيل الحساب مسبقاً." });

            if (user.LastVerificationEmailSentAt.HasValue)
            {
                var timeSinceLastEmail = DateTime.UtcNow - user.LastVerificationEmailSentAt.Value;
                if (timeSinceLastEmail < TimeSpan.FromMinutes(5))
                {
                    return StatusCode(429, new { Message = "الرجاء الانتظار قبل طلب رسالة جديدة." });
                }
            }

            user.LastVerificationEmailSentAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var verificationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var origin = Request.Headers["Origin"].FirstOrDefault() ?? "http://178.62.192.74:3000";
            var locale = origin.Contains("localhost") ? "ar" : "ar";
            var verifyLink = $"{origin}/{locale}/verify-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(verificationToken)}";

            string emailHtml = $@"
<div style='font-family: Arial, sans-serif; background-color: #0a0015; color: #ffffff; padding: 40px; text-align: center; border-radius: 8px;'>
    <h2 style='color: #8b5cf6;'>تأكيد البريد الإلكتروني</h2>
    <p style='color: #d1d5db; font-size: 16px; margin-bottom: 30px;'>مرحباً بك مجدداً في NexMedia! يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.</p>
    <a href='{verifyLink}' style='background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block;'>تفعيل الحساب</a>
</div>";

            await _emailService.SendEmailAsync(user.Email, user.FullName ?? user.UserName ?? "User", "إعادة إرسال: تفعيل الحساب - NexMedia", emailHtml);

            return Ok(new { Message = "تم إرسال رسالة التفعيل بنجاح." });
        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized(new { Message = "كلمة المرور أو البريد الإلكتروني غير صحيح." });

            if (!user.IsVerified)
                return Unauthorized(new { Message = "الرجاء تأكيد بريدك الإلكتروني أولاً قبل تسجيل الدخول.", RequiresVerification = true });

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            var fingerprint = request.DeviceFingerprint ?? string.Empty;

            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                FingerprintHash = fingerprint
            });
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            SetTokenCookie(token);
            await CreateAndSetRefreshTokenAsync(user, ipAddress);

            return Ok(new AuthResponse
            {
                Email = user.Email!,
                IsVerified = user.IsVerified
            });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var googleClientId = await _context.AppSettings
                .Where(s => s.Key == "OAuth.GoogleClientId")
                .Select(s => s.Value)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(googleClientId))
            {
                return BadRequest(new { Message = "Google Login is not configured on this server." });
            }

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { googleClientId }
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized(new { Message = "Invalid Google Token." });
            }

            var user = await _userManager.FindByEmailAsync(payload.Email);
            var isNewUser = false;

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            var fingerprint = request.DeviceFingerprint ?? string.Empty;

            if (user == null)
            {
                isNewUser = true;
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FullName = payload.Name ?? "Google User",
                    Country = "Unknown",
                    CreatedAt = DateTime.UtcNow,
                    IsVerified = payload.EmailVerified
                };

                // Create user with a strong random password
                var result = await _userManager.CreateAsync(user, Guid.NewGuid().ToString() + "A!1a");
                
                if (!result.Succeeded)
                {
                    return BadRequest(new { Message = "Could not create user account." });
                }
                
            }

            // Check trial eligibility if new user — gate free plan via fingerprint/IP check
            if (isNewUser)
            {
                bool hasClaimedFreeTrial = false;
                
                if (!string.IsNullOrEmpty(fingerprint))
                {
                    hasClaimedFreeTrial = await _context.DeviceFingerprints.AnyAsync(df => df.FingerprintHash == fingerprint);
                }
                
                if (!hasClaimedFreeTrial)
                {
                    hasClaimedFreeTrial = await _context.DeviceFingerprints.AnyAsync(df => df.IpAddress == ipAddress);
                }

                if (!hasClaimedFreeTrial)
                {
                    // Assign the default free/trial plan
                    var targetPlan = await _context.Plans.FirstOrDefaultAsync(p => p.IsDefaultRegistrationPlan) 
                                  ?? await _context.Plans.FirstOrDefaultAsync(p => p.IsFreeTrial);

                    if (targetPlan != null)
                    {
                        bool canClaimFreePlan = true;
                        var enableFingerprintCheckStr = await _context.AppSettings
                            .Where(s => s.Key == "FreePlan.FingerprintCheck").Select(s => s.Value).FirstOrDefaultAsync();

                        if (bool.TryParse(enableFingerprintCheckStr, out bool enableFingerprintCheck) 
                            && enableFingerprintCheck && !string.IsNullOrEmpty(fingerprint))
                        {
                            var maxUsesStr = await _context.AppSettings
                                .Where(s => s.Key == "FreePlan.MaxUsesPerDevice").Select(s => s.Value).FirstOrDefaultAsync();
                            int maxUses = int.TryParse(maxUsesStr, out int m) ? m : 1;

                            var usersWithThisFingerprint = await _context.DeviceFingerprints
                                .Where(df => df.FingerprintHash == fingerprint)
                                .Select(df => df.UserId)
                                .Distinct()
                                .ToListAsync();

                            if (usersWithThisFingerprint.Any())
                            {
                                var timesClaimed = await _context.Subscriptions
                                    .CountAsync(s => s.PlanId == targetPlan.Id && usersWithThisFingerprint.Contains(s.UserId));
                                if (timesClaimed >= maxUses)
                                    canClaimFreePlan = false;
                            }
                        }

                        if (canClaimFreePlan)
                        {
                            var sub = new Subscription
                            {
                                UserId = user.Id,
                                PlanId = targetPlan.Id,
                                StartDate = DateTime.UtcNow,
                                EndDate = DateTime.UtcNow.AddDays(targetPlan.DurationDays),
                                Status = "active"
                            };
                            _context.Subscriptions.Add(sub);
                        }
                    }
                }
            }

            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                FingerprintHash = fingerprint
            });
            
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            SetTokenCookie(token);
            await CreateAndSetRefreshTokenAsync(user, ipAddress);

            return Ok(new AuthResponse
            {
                Email = user.Email!,
                IsVerified = user.IsVerified
            });
        }


        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Return success even if not found to prevent email enumeration attacks
                return Ok(new { Message = "If an account with this email exists, a password reset link has been sent." });
            }

            var rawToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var token = Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(rawToken));
            
            var origin = Request.Headers["Origin"].FirstOrDefault() ?? "http://178.62.192.74:3000";
            var resetLink = $"{origin}/reset-password?email={Uri.EscapeDataString(request.Email)}&token={token}";

            string emailHtml = $@"
<div style='font-family: Arial, sans-serif; background-color: #0a0015; color: #ffffff; padding: 40px; text-align: center; border-radius: 8px;'>
    <h2 style='color: #8b5cf6;'>إعادة تعيين كلمة المرور</h2>
    <p style='color: #d1d5db; font-size: 16px; margin-bottom: 30px;'>لقد طلبت إعادة تعيين كلمة المرور الخاصة بحسابك في NexMedia. اضغط على الزر أدناه لاختيار كلمة مرور جديدة.</p>
    <a href='{resetLink}' style='background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block;'>إعادة تعيين كلمة المرور</a>
    <p style='color: #9ca3af; font-size: 14px; margin-top: 30px;'>إذا لم تقم بطلب ذلك، يمكنك تجاهل هذه الرسالة.</p>
</div>
            ";

            await _emailService.SendEmailAsync(user.Email, user.FullName ?? user.UserName ?? "User", "إعادة تعيين كلمة المرور - NexMedia", emailHtml);

            return Ok(new { Message = "If an account with this email exists, a password reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { Message = "Invalid request." });
            }

            string rawToken = request.Token;
            try
            {
                // Try Base64UrlDecode for new tokens
                rawToken = System.Text.Encoding.UTF8.GetString(Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlDecode(request.Token));
            }
            catch
            {
                // Fallback for old tokens (replace spaces that were incorrectly decoded back to +)
                rawToken = request.Token.Replace(" ", "+");
            }

            var result = await _userManager.ResetPasswordAsync(user, rawToken, request.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Password has been reset successfully." });
            }

            var errors = new List<string>();
            foreach (var error in result.Errors)
            {
                errors.Add(error.Description);
            }

            return BadRequest(new { Errors = errors });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new { Message = "طلب غير صالح." });
            }

            var result = await _userManager.ConfirmEmailAsync(user, request.Token);

            if (result.Succeeded)
            {
                user.IsVerified = true;
                await _userManager.UpdateAsync(user);
                return Ok(new { Message = "تم تفعيل البريد الإلكتروني بنجاح." });
            }

            return BadRequest(new { Message = "رابط التفعيل غير صالح أو منتهي الصلاحية." });
        }

        private string GenerateJwtToken(ApplicationUser user)
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
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetTokenCookie(string token)
        {
            var isHttps = Request.IsHttps || Request.Headers["X-Forwarded-Proto"] == "https";
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddHours(1),
                Path = "/"
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
        }

        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            var randomBytes = new byte[64];
            rng.GetBytes(randomBytes);

            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomBytes),
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var isHttps = Request.IsHttps || Request.Headers["X-Forwarded-Proto"] == "https";
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        private async Task<RefreshToken> CreateAndSetRefreshTokenAsync(ApplicationUser user, string ipAddress)
        {
            var refreshToken = GenerateRefreshToken(ipAddress);
            refreshToken.UserId = user.Id;

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(refreshToken.Token);
            return refreshToken;
        }

        public class RefreshTokenRequest
        {
            public string? RefreshToken { get; set; }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokenEndpoint([FromBody] RefreshTokenRequest? request)
        {
            var token = request?.RefreshToken ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { Message = "Refresh Token is required." });
            }

            var refreshToken = await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                return Unauthorized(new { Message = "Invalid or expired Refresh Token." });
            }

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            var newRefreshToken = GenerateRefreshToken(ipAddress);
            newRefreshToken.UserId = refreshToken.UserId;

            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            var newJwt = GenerateJwtToken(refreshToken.User);
            SetTokenCookie(newJwt);
            SetRefreshTokenCookie(newRefreshToken.Token);

            return Ok(new
            {
                Message = "Token refreshed successfully.",
                AccessToken = newJwt,
                RefreshToken = newRefreshToken.Token,
                ExpiresIn = 3600
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(token))
            {
                var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
                if (refreshToken != null && refreshToken.IsActive)
                {
                    var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
                    refreshToken.IsRevoked = true;
                    refreshToken.RevokedAt = DateTime.UtcNow;
                    refreshToken.RevokedByIp = ipAddress;
                    await _context.SaveChangesAsync();
                }
            }

            var isHttps = Request.IsHttps || Request.Headers["X-Forwarded-Proto"] == "https";
            Response.Cookies.Append("jwt", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(-10),
                Path = "/"
            });
            Response.Cookies.Append("refreshToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(-10),
                Path = "/"
            });
            return Ok(new { Message = "Logged out" });
        }

        [HttpPost("add-phone")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddPhone([FromBody] AddPhoneRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            if (!string.IsNullOrEmpty(user.PhoneNumber))
            {
                return BadRequest(new { Message = "لقد قمت بإضافة رقم هاتف مسبقاً." });
            }

            var phoneExists = await _userManager.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber);
            if (phoneExists)
            {
                return BadRequest(new { Message = "رقم الهاتف مسجل بالفعل لحساب آخر." });
            }

            user.PhoneNumber = request.PhoneNumber;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new { Message = "فشل في حفظ رقم الهاتف، يرجى المحاولة مرة أخرى." });
            }

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var fingerprint = request.DeviceFingerprint ?? string.Empty;

            // Log the device fingerprint
            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown",
                FingerprintHash = fingerprint
            });

            // Assign default plan if they don't already have one
            var hasActiveSub = await _context.Subscriptions.AnyAsync(s => s.UserId == user.Id && s.Status == "active");
            if (!hasActiveSub)
            {
                var targetPlan = await _context.Plans.FirstOrDefaultAsync(p => p.IsDefaultRegistrationPlan && !p.IsDeleted) 
                              ?? await _context.Plans.FirstOrDefaultAsync(p => p.IsFreeTrial && !p.IsDeleted);
                if (targetPlan != null)
                {
                    bool canClaimFreePlan = true;
                    var enableFingerprintCheckStr = await _context.AppSettings.Where(s => s.Key == "FreePlan.FingerprintCheck").Select(s => s.Value).FirstOrDefaultAsync();
                    if (bool.TryParse(enableFingerprintCheckStr, out bool enableFingerprintCheck) && enableFingerprintCheck && !string.IsNullOrEmpty(fingerprint))
                    {
                        var maxUsesStr = await _context.AppSettings.Where(s => s.Key == "FreePlan.MaxUsesPerDevice").Select(s => s.Value).FirstOrDefaultAsync();
                        int maxUses = int.TryParse(maxUsesStr, out int m) ? m : 1;
                        
                        var usersWithThisFingerprint = await _context.DeviceFingerprints
                            .Where(df => df.FingerprintHash == fingerprint)
                            .Select(df => df.UserId)
                            .Distinct()
                            .ToListAsync();
                            
                        if (usersWithThisFingerprint.Any())
                        {
                            var timesClaimed = await _context.Subscriptions
                                .CountAsync(s => s.PlanId == targetPlan.Id && usersWithThisFingerprint.Contains(s.UserId));
                                
                            if (timesClaimed >= maxUses)
                            {
                                canClaimFreePlan = false;
                            }
                        }
                    }

                    if (canClaimFreePlan)
                    {
                        var sub = new Subscription
                        {
                            UserId = user.Id,
                            PlanId = targetPlan.Id,
                            StartDate = DateTime.UtcNow,
                            EndDate = DateTime.UtcNow.AddDays(targetPlan.DurationDays),
                            Status = "active"
                        };
                        _context.Subscriptions.Add(sub);
                        await _context.SaveChangesAsync();
                        
                        await _walletService.DistributePlanCreditsAsync(user.Id, targetPlan.Id, resetToZero: true);
                        
                        try
                        {
                            if (!string.IsNullOrEmpty(user.Email))
                            {
                                var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                                    user.FullName ?? user.Email,
                                    targetPlan.NameAr ?? targetPlan.Name,
                                    sub.StartDate,
                                    sub.EndDate,
                                    targetPlan.MonthlyCredits,
                                    targetPlan.PriceEgp);
                                
                                await _emailService.SendEmailAsync(user.Email, user.FullName ?? "", "تم تفعيل اشتراكك بنجاح - NexMedia AI", htmlBody);
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Failed to send free plan email: " + ex.Message);
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تسجيل رقم الهاتف بنجاح." });
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Wallets)
                    .ThenInclude(w => w.WalletType)
                .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));
                
            if (user == null) return Unauthorized();

            var activeSub = await _context.Subscriptions
                .Include(s => s.Plan)
                .OrderByDescending(s => s.Status == "active")
                .ThenByDescending(s => s.Status == "freeze")
                .ThenByDescending(s => s.Status == "expired")
                .ThenByDescending(s => s.EndDate)
                .FirstOrDefaultAsync(s => s.UserId == user.Id);

            if (activeSub != null)
            {
                bool needsSave = false;
                bool shouldResetWallets = false;

                if (activeSub.Status == "active" && activeSub.EndDate <= DateTime.UtcNow)
                {
                    var freezeEndDate = activeSub.EndDate.AddDays(activeSub.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > freezeEndDate)
                    {
                        activeSub.Status = "expired";
                        shouldResetWallets = true;
                    }
                    else
                    {
                        activeSub.Status = "freeze";
                    }
                    needsSave = true;
                }
                else if (activeSub.Status == "freeze" && activeSub.EndDate.AddDays(activeSub.Plan.GracePeriodDays) < DateTime.UtcNow)
                {
                    activeSub.Status = "expired";
                    shouldResetWallets = true;
                    needsSave = true;
                }

                if (needsSave)
                {
                    _context.Subscriptions.Update(activeSub);
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                }

                if (shouldResetWallets)
                {
                    await _walletService.ResetAllWalletsAsync(user.Id);
                }
            }

            string? imageUrl = null;
            if (!string.IsNullOrEmpty(user.ImageUrl))
            {
                if (user.ImageUrl.StartsWith("http"))
                {
                    imageUrl = user.ImageUrl;
                }
                else
                {
                    imageUrl = await _mediaService.GetFileUrlAsync(user.ImageUrl, "profile");
                }
            }

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Country = user.Country,
                ImageUrl = imageUrl,
                IsVerified = user.IsVerified,
                HasPhoneNumber = !string.IsNullOrEmpty(user.PhoneNumber),
                AvailableCredits = user.AvailableCredits, // Keep for backwards compatibility temporarily
                Wallets = user.Wallets.Select(w => new { Code = w.WalletType.Code, Balance = w.Balance }),
                IsStaff = user.IsStaff,
                ActivePlan = activeSub != null ? new {
                    Name = activeSub.Plan.Name,
                    NameAr = activeSub.Plan.NameAr,
                    Status = activeSub.Status,
                    EndDate = activeSub.EndDate,
                    TtsCustomInstructionsEnabled = activeSub.Plan.TtsCustomInstructionsEnabled,
                    AvatarVideoCostPerGeneration = activeSub.Plan.AvatarVideoCostPerGeneration,
                    LipSyncCostPerGeneration = activeSub.Plan.LipSyncCostPerGeneration,
                    SttCostPerMinute = activeSub.Plan.SttCostPerMinute,
                    TtsCostPerChar = activeSub.Plan.TtsCostPerChar,
                    TtsCostPerCharHigh = activeSub.Plan.TtsCostPerCharHigh,
                    IsFreeTrial = activeSub.Plan.IsFreeTrial,
                    IsDefaultRegistrationPlan = activeSub.Plan.IsDefaultRegistrationPlan
                } : null
            });
        }

    }
}
