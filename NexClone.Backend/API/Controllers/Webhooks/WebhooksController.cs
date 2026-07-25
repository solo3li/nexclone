using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using System;

namespace NexClone.Backend.API.Controllers.Webhooks
{
    [Route("api/webhooks")]
    [ApiController]
    public class WebhooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly WalletService _walletService;

        public WebhooksController(
            ApplicationDbContext context, 
            IEmailService emailService, 
            IEmailTemplateService emailTemplateService,
            WalletService walletService)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
        }

        [HttpPost("paymob")]
        public async Task<IActionResult> PaymobWebhook([FromBody] JsonElement payload, [FromQuery] string hmac)
        {
            try
            {
                // 1. Fetch active Paymob Config to get HMAC Secret
                var paymobConfig = await _context.PaymentGatewayConfigs
                    .FirstOrDefaultAsync(c => c.ProviderName == "Paymob" && c.IsActive);

                if (paymobConfig == null || string.IsNullOrEmpty(paymobConfig.HmacSecret))
                {
                    return BadRequest("Paymob configuration or HMAC Secret missing.");
                }

                // 2. Validate HMAC (Security Check) — Paymob signs requests with HMAC SHA512
                if (string.IsNullOrEmpty(hmac))
                {
                    return Unauthorized("Missing HMAC signature.");
                }

                if (payload.TryGetProperty("obj", out var obj))
                {
                    // Verify HMAC before trusting any payload data
                    bool hmacValid = VerifyPaymobHmac(obj, hmac, paymobConfig.HmacSecret);
                    if (!hmacValid)
                    {
                        return Unauthorized("Invalid HMAC signature.");
                    }

                    bool success = obj.TryGetProperty("success", out var successProp) && successProp.GetBoolean();
                    if (!success)
                    {
                        return Ok(new { message = "Payment failed, ignored." });
                    }

                    // 3. Extract User ID and Plan Name
                    string userId = "";
                    string planName = "";

                    if (obj.TryGetProperty("payment_key_claims", out var claims) && 
                        claims.TryGetProperty("billing_data", out var billing))
                    {
                        userId = billing.TryGetProperty("first_name", out var fn) ? fn.GetString() ?? "" : "";
                        planName = billing.TryGetProperty("last_name", out var ln) ? ln.GetString() ?? "" : "";
                    }

                    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(planName))
                    {
                        return BadRequest("Missing user or plan data.");
                    }

                    // 4. Find User and Plan — Guid.TryParse prevents crash on malformed input
                    if (!Guid.TryParse(userId, out var userGuid))
                    {
                        return BadRequest("Invalid user ID format.");
                    }

                    var user = await _context.Users.FindAsync(userGuid);
                    var plan = await _context.Plans.FirstOrDefaultAsync(p => p.Name == planName);

                    if (user == null || plan == null)
                    {
                        return NotFound("User or Plan not found.");
                    }

                    // 5. Activate or Extend Subscription
                    var existingSub = await _context.Subscriptions
                        .Include(s => s.Plan)
                        .FirstOrDefaultAsync(s => s.UserId == user.Id && s.PlanId == plan.Id && (s.Status == "active" || s.Status == "freeze"));

                    Subscription currentSub = null;
                    bool shouldReset = false;

                    if (existingSub != null)
                    {
                        if (existingSub.EndDate < DateTime.UtcNow)
                        {
                            var graceEnds = existingSub.EndDate.AddDays(existingSub.Plan.GracePeriodDays);
                            if (DateTime.UtcNow > graceEnds)
                            {
                                shouldReset = true;
                            }
                        }

                        existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(plan.DurationDays);
                        existingSub.Status = "active";
                        _context.Update(existingSub);
                        currentSub = existingSub;
                    }
                    else
                    {
                        var latestSubForCredits = await _context.Subscriptions
                            .Include(s => s.Plan)
                            .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                            .OrderByDescending(s => s.EndDate)
                            .FirstOrDefaultAsync();

                        if (latestSubForCredits != null && latestSubForCredits.EndDate < DateTime.UtcNow)
                        {
                            var graceEnds = latestSubForCredits.EndDate.AddDays(latestSubForCredits.Plan.GracePeriodDays);
                            if (DateTime.UtcNow > graceEnds)
                            {
                                shouldReset = true;
                            }
                        }

                        var activeSubscriptions = await _context.Subscriptions
                            .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                            .ToListAsync();
                        foreach(var sub in activeSubscriptions)
                        {
                            sub.Status = "canceled";
                        }

                        var newSub = new Subscription
                        {
                            UserId = user.Id,
                            PlanId = plan.Id,
                            StartDate = DateTime.UtcNow,
                            EndDate = DateTime.UtcNow.AddDays(plan.DurationDays),
                            Status = "active"
                        };
                        _context.Subscriptions.Add(newSub);
                        currentSub = newSub;
                    }

                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    
                    await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset);

                    int orderId = obj.TryGetProperty("id", out var idProp) ? idProp.GetInt32() : 0;
                    int amountCents = obj.TryGetProperty("amount_cents", out var amountProp) ? amountProp.GetInt32() : 0;
                    decimal amountEgp = amountCents / 100m;

                    var payment = new Payment
                    {
                        UserId = user.Id,
                        PlanId = plan.Id,
                        SubscriptionId = currentSub?.Id,
                        Amount = amountEgp,
                        Currency = "EGP",
                        Method = "Paymob",
                        PaymentId = orderId.ToString(),
                        Status = "Completed",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Payments.Add(payment);
                    await _context.SaveChangesAsync();

                    // Send Email Receipt
                    try
                    {
                        var sub = currentSub;
                        if (sub != null && !string.IsNullOrEmpty(user.Email))
                        {
                            var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                                user.FullName ?? user.Email,
                                plan.NameAr ?? plan.Name,
                                sub.StartDate,
                                sub.EndDate,
                                plan.MonthlyCredits,
                                amountEgp);
                            
                            await _emailService.SendEmailAsync(user.Email, user.FullName ?? "", "تم تفعيل اشتراكك بنجاح - NexMedia AI", htmlBody);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to send webhook email: " + ex.Message);
                    }

                    return Ok(new { success = true, message = "Subscription activated successfully." });
                }

                return BadRequest("Invalid payload structure.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifies Paymob HMAC SHA512 signature.
        /// Paymob concatenates specific transaction fields in a fixed order and hashes with HMAC-SHA512.
        /// Reference: https://docs.paymob.com/docs/hmac-calculation
        /// </summary>
        private static bool VerifyPaymobHmac(JsonElement obj, string receivedHmac, string secret)
        {
            try
            {
                // Paymob HMAC fields in the exact order specified by Paymob documentation
                var fields = new[]
                {
                    "amount_cents", "created_at", "currency", "error_occured",
                    "has_parent_transaction", "id", "integration_id", "is_3d_secure",
                    "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
                    "is_voided", "order.id", "owner", "pending",
                    "source_data.pan", "source_data.sub_type", "source_data.type",
                    "success"
                };

                var concatenated = new StringBuilder();
                foreach (var field in fields)
                {
                    string value = "";
                    if (field.Contains('.'))
                    {
                        var parts = field.Split('.', 2);
                        if (obj.TryGetProperty(parts[0], out var nested) && nested.TryGetProperty(parts[1], out var nestedVal))
                            value = nestedVal.ToString();
                    }
                    else if (obj.TryGetProperty(field, out var val))
                    {
                        value = val.ToString();
                    }
                    concatenated.Append(value);
                }

                var keyBytes = Encoding.UTF8.GetBytes(secret);
                var messageBytes = Encoding.UTF8.GetBytes(concatenated.ToString());

                using var hmacSha512 = new HMACSHA512(keyBytes);
                var hashBytes = hmacSha512.ComputeHash(messageBytes);
                var computedHmac = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

                return CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(computedHmac),
                    Encoding.UTF8.GetBytes(receivedHmac.ToLowerInvariant()));
            }
            catch
            {
                return false;
            }
        }
    }
}
