using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Hangfire;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.RateLimiting;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : AuthControllerBase
    {
        public AuthController(
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

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var modelErrors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { Errors = modelErrors });
            }

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

            var domain = request.Email.Split('@').LastOrDefault()?.ToLower();
            if (!string.IsNullOrEmpty(domain))
            {
                try
                {
                    var httpClient = _httpClientFactory.CreateClient();
                    var response = await httpClient.GetAsync($"https://open.kickbox.com/v1/disposable/{domain}");
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
                }
            }

            var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            var fingerprint = request.DeviceFingerprint ?? string.Empty;

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

            var refCodePayload = request.RefCode;
            var affCookie = Request.Cookies["aff_session"];

            var affiliateService = HttpContext.RequestServices.GetService<NexClone.Backend.Application.Services.AffiliateService>();
            if (affiliateService != null)
            {
                if (!string.IsNullOrEmpty(refCodePayload))
                {
                    await affiliateService.LinkManualReferralAsync(refCodePayload, user.Id, ipAddress, fingerprint);
                }
                else if (!string.IsNullOrEmpty(affCookie))
                {
                    await affiliateService.LinkReferralToUserAsync(affCookie, user.Id, ipAddress, fingerprint);
                }
            }

            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                FingerprintHash = fingerprint
            });

            if (!hasClaimedFreeTrial)
            {
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
            }

            await _context.SaveChangesAsync();

            var verificationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var origin = Request.Headers["Origin"].FirstOrDefault() ?? _configuration["AppSettings:DefaultFrontendUrl"] ?? "http://localhost:3000";
            var acceptLang = Request.Headers["Accept-Language"].FirstOrDefault() ?? "ar";
            var locale = acceptLang.StartsWith("en", StringComparison.OrdinalIgnoreCase) ? "en" : "ar";
            var verifyLink = $"{origin}/{locale}/verify-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(verificationToken)}";

            string emailHtml = _emailTemplateService.GetVerificationEmail(user.FullName ?? user.UserName ?? "User", verifyLink);
            BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? user.UserName ?? "User", Subject = "تفعيل الحساب - NexMedia AI", HtmlBody = emailHtml }));

            return Ok(new { Message = "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.", FreeTrialAssigned = freeTrialAssigned });
        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) {
                Console.WriteLine($"[LOGIN FAILED] User not found: {request.Email}");
                return Unauthorized(new { Message = "كلمة المرور أو البريد الإلكتروني غير صحيح." });
            }
            if (await _userManager.IsLockedOutAsync(user))
            {
                var lockoutEnd = user.LockoutEnd ?? DateTimeOffset.UtcNow.AddMinutes(15);
                var remainingSeconds = (int)Math.Max(1, (lockoutEnd - DateTimeOffset.UtcNow).TotalSeconds);
                Console.WriteLine($"[LOGIN LOCKED] User {request.Email} is locked out for {remainingSeconds}s");
                return Unauthorized(new
                {
                    Message = "تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة.",
                    IsLockedOut = true,
                    RemainingSeconds = remainingSeconds
                });
            }

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
            {
                await _userManager.AccessFailedAsync(user);

                if (await _userManager.IsLockedOutAsync(user))
                {
                    var lockoutEnd = user.LockoutEnd ?? DateTimeOffset.UtcNow.AddMinutes(15);
                    var remainingSeconds = (int)Math.Max(1, (lockoutEnd - DateTimeOffset.UtcNow).TotalSeconds);
                    Console.WriteLine($"[LOGIN JUST LOCKED] User {request.Email} just reached max attempts. Locked for {remainingSeconds}s");
                    return Unauthorized(new
                    {
                        Message = "تم قفل الحساب مؤقتاً بسبب استنفاد محاولات الدخول الخاطئة.",
                        IsLockedOut = true,
                        RemainingSeconds = remainingSeconds
                    });
                }

                var maxAttemptsSetting = await _context.AppSettings.Where(s => s.Key == "Security.MaxLoginAttempts").Select(s => s.Value).FirstOrDefaultAsync();
                int maxAttempts = int.TryParse(maxAttemptsSetting, out var ma) ? ma : 20;

                var failedCount = await _userManager.GetAccessFailedCountAsync(user);
                var remainingAttempts = Math.Max(0, maxAttempts - failedCount);
                Console.WriteLine($"[LOGIN FAILED] Wrong password for: {request.Email}. Failed count: {failedCount}/{maxAttempts}");
                return Unauthorized(new
                {
                    Message = remainingAttempts <= 3 && remainingAttempts > 0
                        ? $"كلمة المرور غير صحيحة. متبقي لديك {remainingAttempts} محاولات قبل قفل الحساب."
                        : "كلمة المرور أو البريد الإلكتروني غير صحيح.",
                    RemainingAttempts = remainingAttempts
                });
            }

            await _userManager.ResetAccessFailedCountAsync(user);

            if (!user.IsVerified) {
                Console.WriteLine($"[LOGIN FAILED] Unverified user: {request.Email}");
                return Unauthorized(new { Message = "الرجاء تأكيد بريدك الإلكتروني أولاً قبل تسجيل الدخول.", RequiresVerification = true });
            }

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
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshOptions);

            return Ok(new AuthResponse
            {
                Token = token,
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

                var result = await _userManager.CreateAsync(user, Guid.NewGuid().ToString() + "A!1a");

                if (!result.Succeeded)
                {
                    return BadRequest(new { Message = "Could not create user account." });
                }

                var refCodePayload = request.RefCode;
                var affCookie = Request.Cookies["aff_session"];

                var affiliateService = HttpContext.RequestServices.GetService<NexClone.Backend.Application.Services.AffiliateService>();
                if (affiliateService != null)
                {
                    if (!string.IsNullOrEmpty(refCodePayload))
                    {
                        await affiliateService.LinkManualReferralAsync(refCodePayload, user.Id, ipAddress, fingerprint);
                    }
                    else if (!string.IsNullOrEmpty(affCookie))
                    {
                        await affiliateService.LinkReferralToUserAsync(affCookie, user.Id, ipAddress, fingerprint);
                    }
                }
            }

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
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshOptions);

            return Ok(new AuthResponse
            {
                Token = token,
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
                return Ok(new { Message = "If an account with this email exists, a password reset link has been sent." });
            }

            var rawToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var token = Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(rawToken));

            var origin = Request.Headers["Origin"].FirstOrDefault() ?? _configuration["AppSettings:DefaultFrontendUrl"] ?? "http://localhost:3000";
            var resetLink = $"{origin}/reset-password?email={Uri.EscapeDataString(request.Email)}&token={token}";

            string emailHtml = _emailTemplateService.GetPasswordResetEmail(user.FullName ?? user.UserName ?? "User", resetLink);
            BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? user.UserName ?? "User", Subject = "إعادة تعيين كلمة المرور - NexMedia AI", HtmlBody = emailHtml }));

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
                rawToken = System.Text.Encoding.UTF8.GetString(Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlDecode(request.Token));
            }
            catch
            {
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

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

            if (user == null) return Unauthorized();

            var allSubs = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.Status == "active")
                .ThenByDescending(s => s.Status == "freeze")
                .ThenByDescending(s => s.Status == "expired")
                .ThenByDescending(s => s.EndDate)
                .ToListAsync();

            bool needsSave = false;
            bool shouldResetWallets = false;

            foreach (var sub in allSubs)
            {
                if (sub.Status == "active" && sub.EndDate <= DateTime.UtcNow)
                {
                    var freezeEndDate = sub.EndDate.AddDays(sub.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > freezeEndDate)
                    {
                        sub.Status = "expired";
                        shouldResetWallets = true;
                    }
                    else
                    {
                        sub.Status = "freeze";
                    }
                    _context.Subscriptions.Update(sub);
                    needsSave = true;
                }
                else if (sub.Status == "freeze" && sub.EndDate.AddDays(sub.Plan.GracePeriodDays) < DateTime.UtcNow)
                {
                    sub.Status = "expired";
                    shouldResetWallets = true;
                    _context.Subscriptions.Update(sub);
                    needsSave = true;
                }
            }

            if (needsSave)
            {
                await _context.SaveChangesAsync();
            }

            if (shouldResetWallets)
            {
                await _walletService.ResetAllWalletsAsync(user.Id);
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

            var activeSub = allSubs.FirstOrDefault(s => s.Status == "active" || s.Status == "freeze");

            var activeSubscriptionsResponse = allSubs
                .Where(s => s.Status == "active" || s.Status == "freeze")
                .Select(s => new {
                    Id = s.Id,
                    Name = s.Plan.Name,
                    NameAr = s.Plan.NameAr,
                    Status = s.Status,
                    EndDate = s.EndDate,
                    FreezeEndDate = s.EndDate.AddDays(s.Plan.GracePeriodDays),
                    IsFreeTrial = s.Plan.IsFreeTrial,
                    IsDefaultRegistrationPlan = s.Plan.IsDefaultRegistrationPlan
                });

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Country = user.Country,
                ImageUrl = imageUrl,
                IsVerified = user.IsVerified,
                HasPhoneNumber = !string.IsNullOrEmpty(user.PhoneNumber),
                StandardCredits = user.StandardCredits,
                PremiumCredits = user.PremiumCredits,
                IsStaff = user.IsStaff,
                ActivePlan = activeSub != null ? new {
                    Name = activeSub.Plan.Name,
                    NameAr = activeSub.Plan.NameAr,
                    Status = activeSub.Status,
                    EndDate = activeSub.EndDate,
                    FreezeEndDate = activeSub.EndDate.AddDays(activeSub.Plan.GracePeriodDays),
                    TextToImageEnabled = activeSub.Plan.TextToImageEnabled,
                    TextToVideoEnabled = activeSub.Plan.TextToVideoEnabled,
                    ImageToVideoEnabled = activeSub.Plan.ImageToVideoEnabled,
                    ReferenceToVideoEnabled = activeSub.Plan.ReferenceToVideoEnabled,
                    LipSyncEnabled = activeSub.Plan.LipSyncEnabled,
                    MotionControlEnabled = activeSub.Plan.MotionControlEnabled,
                    SttEnabled = activeSub.Plan.SttEnabled,
                    TtsEnabled = activeSub.Plan.TtsEnabled,
                    IsFreeTrial = activeSub.Plan.IsFreeTrial,
                    IsDefaultRegistrationPlan = activeSub.Plan.IsDefaultRegistrationPlan
                } : null,
                ActiveSubscriptions = activeSubscriptionsResponse,
                IsAffiliate = await _context.AffiliateProfiles.AnyAsync(p => p.UserId == user.Id && p.IsActive)
            });
        }
    }
}