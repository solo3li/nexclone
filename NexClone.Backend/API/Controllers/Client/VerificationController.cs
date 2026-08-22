using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/auth")]
    [ApiController]
    public class VerificationController : AuthControllerBase
    {
        public VerificationController(
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
            var origin = Request.Headers["Origin"].FirstOrDefault() ?? _configuration["AppSettings:DefaultFrontendUrl"] ?? "http://localhost:3000";
            var acceptLang = Request.Headers["Accept-Language"].FirstOrDefault() ?? "ar";
            var locale = acceptLang.StartsWith("en", StringComparison.OrdinalIgnoreCase) ? "en" : "ar";
            var verifyLink = $"{origin}/{locale}/verify-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(verificationToken)}";

            string emailHtml = _emailTemplateService.GetVerificationEmail(user.FullName ?? user.UserName ?? "User", verifyLink);
            BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? user.UserName ?? "User", Subject = "إعادة إرسال: تفعيل الحساب - NexMedia AI", HtmlBody = emailHtml }));

            return Ok(new { Message = "تم إرسال رسالة التفعيل بنجاح." });
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
    }
}