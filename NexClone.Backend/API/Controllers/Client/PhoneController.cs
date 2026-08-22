using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/auth")]
    [ApiController]
    public class PhoneController : AuthControllerBase
    {
        public PhoneController(
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

            _context.DeviceFingerprints.Add(new DeviceFingerprint
            {
                UserId = user.Id,
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown",
                FingerprintHash = fingerprint
            });

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

                        await _walletService.DistributePlanCreditsAsync(user.Id, targetPlan.Id, resetToZero: true, subscriptionId: sub.Id);

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

                                BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? "", Subject = "تم تفعيل اشتراكك بنجاح - NexMedia AI", HtmlBody = htmlBody }));
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
    }
}