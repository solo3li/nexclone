using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using System;
using Hangfire;
using NexClone.Backend.Application.Services;

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
        private readonly NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService _invoiceService;
        private readonly IMediaService _mediaService;
        private readonly AffiliateService _affiliateService;

        public WebhooksController(
            ApplicationDbContext context, 
            IEmailService emailService, 
            IEmailTemplateService emailTemplateService,
            WalletService walletService,
            NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService invoiceService,
            IMediaService mediaService,
            AffiliateService affiliateService)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
            _invoiceService = invoiceService;
            _mediaService = mediaService;
            _affiliateService = affiliateService;
        }

        [HttpPost("paymob")]
        public async Task<IActionResult> PaymobWebhook([FromBody] JsonElement payload, [FromQuery] string hmac)
        {
            try
            {
                Console.WriteLine($"[PaymobWebhook] Webhook hit! Payload: {payload.GetRawText()}");
                
                // 1. Fetch active Paymob Config
                var paymobConfig = await _context.PaymentGatewayConfigs
                    .FirstOrDefaultAsync(c => c.ProviderName == "Paymob" && c.IsActive);

                if (paymobConfig == null)
                {
                    Console.WriteLine("[PaymobWebhook] Paymob configuration not found or inactive.");
                    return BadRequest("Paymob configuration not found or inactive.");
                }

                // 2. HMAC Validation
                bool hmacConfigured = !string.IsNullOrEmpty(paymobConfig.HmacSecret);
                if (!hmacConfigured)
                {
                    Console.WriteLine("[PaymobWebhook] Paymob HMAC secret is not configured.");
                    return BadRequest("Paymob HMAC secret is not configured.");
                }

                if (string.IsNullOrEmpty(hmac))
                {
                    Console.WriteLine("[PaymobWebhook] Missing HMAC signature in query.");
                    return Unauthorized("Missing HMAC signature.");
                }

                if (payload.TryGetProperty("obj", out var objForHmac))
                {
                    bool hmacValid = VerifyPaymobHmac(objForHmac, hmac, paymobConfig.HmacSecret!);
                    if (!hmacValid)
                    {
                        Console.WriteLine($"[PaymobWebhook] HMAC validation failed! Received HMAC: {hmac}. Payload: {payload.GetRawText()}");
                        return Unauthorized("Invalid HMAC signature.");
                    }
                }
                else
                {
                    Console.WriteLine("[PaymobWebhook] 'obj' property not found in payload.");
                    return BadRequest("Invalid payload: missing 'obj'.");
                }

                if (payload.TryGetProperty("obj", out var obj))
                {
                    bool success = obj.TryGetProperty("success", out var successProp) && successProp.GetBoolean();
                    if (!success)
                    {
                        Console.WriteLine("[PaymobWebhook] Payment was marked as failed in the payload. Ignoring.");
                        return Ok(new { message = "Payment failed, ignored." });
                    }


                    // 3. Extract User ID and Plan Identifier
                    // Priority chain: extras → order.data → billing_data (Paymob Intention API)
                    string userId = "";
                    string planIdentifier = "";

                    // 3a. Primary: obj.extras (set via Intention API extras field)
                    if (obj.TryGetProperty("extras", out var extras))
                    {
                        if (extras.TryGetProperty("user_id", out var extUserId))
                            userId = extUserId.GetString() ?? "";
                        if (extras.TryGetProperty("plan_id", out var extPlanId))
                            planIdentifier = extPlanId.GetString() ?? "";
                    }

                    // 3b. Fallback: obj.order.data (older Paymob flow)
                    if ((string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(planIdentifier))
                        && obj.TryGetProperty("order", out var orderObj)
                        && orderObj.TryGetProperty("data", out var orderData))
                    {
                        if (string.IsNullOrEmpty(userId) && orderData.TryGetProperty("user_id", out var uid))
                            userId = uid.GetString() ?? "";
                        if (string.IsNullOrEmpty(planIdentifier) && orderData.TryGetProperty("plan_id", out var pid))
                            planIdentifier = pid.GetString() ?? "";
                    }

                    // 3c. Last resort: billing_data.first_name / last_name (legacy hack)
                    if ((string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(planIdentifier))
                        && obj.TryGetProperty("payment_key_claims", out var claims)
                        && claims.TryGetProperty("billing_data", out var billing))
                    {
                        if (string.IsNullOrEmpty(userId))
                            userId = billing.TryGetProperty("first_name", out var fn) ? fn.GetString() ?? "" : "";
                        if (string.IsNullOrEmpty(planIdentifier))
                            planIdentifier = billing.TryGetProperty("last_name", out var ln) ? ln.GetString() ?? "" : "";
                    }

                    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(planIdentifier))
                    {
                        Console.WriteLine($"[PaymobWebhook] Could not extract user/plan. Payload snippet: {obj.ToString().Substring(0, Math.Min(500, obj.ToString().Length))}");
                        return BadRequest("Missing user or plan data.");
                    }

                    // 4. Find User and Plan — Guid.TryParse prevents crash on malformed input
                    if (!Guid.TryParse(userId, out var userGuid))
                    {
                        Console.WriteLine($"[PaymobWebhook] Invalid user ID format: {userId}");
                        return BadRequest("Invalid user ID format.");
                    }

                    var user = await _context.Users.FindAsync(userGuid);
                    if (user == null)
                    {
                        Console.WriteLine($"[PaymobWebhook] User not found: {userId}");
                        return NotFound("User not found.");
                    }

                    Plan plan = null;
                    if (int.TryParse(planIdentifier, out int parsedPlanId))
                    {
                        plan = await _context.Plans.FindAsync(parsedPlanId);
                    }
                    if (plan == null)
                    {
                        plan = await _context.Plans.FirstOrDefaultAsync(p => p.Name == planIdentifier || p.NameAr == planIdentifier);
                    }

                    if (plan == null)
                    {
                        Console.WriteLine($"[PaymobWebhook] Plan not found: {planIdentifier}");
                        return NotFound("Plan not found.");
                    }

                    // 4b. Idempotency: check if this Paymob transaction was already processed
                    int incomingTxId = obj.TryGetProperty("id", out var txIdProp) ? txIdProp.GetInt32() : 0;
                    if (incomingTxId > 0)
                    {
                        var alreadyProcessed = await _context.Payments
                            .AnyAsync(p => p.PaymentId == incomingTxId.ToString() && p.Status == "Completed");
                        if (alreadyProcessed)
                        {
                            Console.WriteLine($"[PaymobWebhook] Transaction {incomingTxId} already processed — ignoring duplicate.");
                            return Ok(new { message = "Already processed." });
                        }
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
                    
                    await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset, subscriptionId: currentSub?.Id);

                    // Use incomingTxId already parsed during idempotency check
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
                        PaymentId = incomingTxId.ToString(),
                        Status = "Completed",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Payments.Add(payment);
                    await _context.SaveChangesAsync();

                    // Affiliate Commission — MUST NOT break payment flow on failure
                    try
                    {
                        bool isRecurring = existingSub != null; // existing sub = renewal
                        await _affiliateService.CreateCommissionAsync(payment.Id, isRecurring);
                    }
                    catch (Exception affEx)
                    {
                        Console.WriteLine($"[Affiliate] Commission creation failed for payment {payment.Id}: {affEx.Message}");
                    }

                    // Generate Invoice
                    string verifyUrlBase = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL") 
                                           ?? Environment.GetEnvironmentVariable("NEXT_PUBLIC_API_URL")?.Replace("/api", "")
                                           ?? "https://nexmediaai.com";
                    
                    decimal fixedFee = plan.FixedFeeEgp;
                    decimal taxAmt = (plan.PriceEgp + fixedFee) * (plan.TaxPercentageEgp / 100m);
                    decimal subTotal = amountEgp - taxAmt - fixedFee;

                    var invoice = new Invoice
                    {
                        InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                        SubscriptionId = currentSub?.Id ?? 0,
                        UserId = user.Id,
                        PaymentGateway = "Paymob",
                        PaymentMethod = "Card", // Adjust based on Paymob details if needed
                        Currency = "EGP",
                        SubTotal = subTotal,
                        TaxAmount = taxAmt,
                        FixedFeeAmount = fixedFee,
                        TotalAmount = amountEgp,
                        TransactionId = incomingTxId.ToString(),
                        Subscription = currentSub
                    };
                    
                    _context.Invoices.Add(invoice);
                    await _context.SaveChangesAsync(); // Save to get VerificationToken if auto-generated

                    // Generate PDF
                    string minioUrl = "";
                    try
                    {
                        byte[] pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(invoice, verifyUrlBase);
                        using var ms = new System.IO.MemoryStream(pdfBytes);
                        minioUrl = await _mediaService.UploadFileAsync(ms, $"invoices/{invoice.InvoiceNumber}.pdf", "application/pdf", "invoices");
                        
                        invoice.MinioPdfUrl = minioUrl;
                        _context.Invoices.Update(invoice);
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to generate/upload invoice PDF: " + ex.Message);
                    }

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
                                amountEgp,
                                minioUrl);
                            
                            Hangfire.BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? "", Subject = "تم تفعيل اشتراكك بنجاح - NexMedia AI", HtmlBody = htmlBody }));
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to send webhook email: " + ex.Message);
                    }

                    return Ok(new { success = true, message = "Subscription activated successfully." });
                }

                Console.WriteLine("[PaymobWebhook] Invalid payload structure.");
                return BadRequest("Invalid payload structure.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PaymobWebhook] Exception occurred: {ex}");
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
                        {
                            if (nestedVal.ValueKind == JsonValueKind.True) value = "true";
                            else if (nestedVal.ValueKind == JsonValueKind.False) value = "false";
                            else value = nestedVal.ToString();
                        }
                    }
                    else if (obj.TryGetProperty(field, out var val))
                    {
                        if (val.ValueKind == JsonValueKind.True) value = "true";
                        else if (val.ValueKind == JsonValueKind.False) value = "false";
                        else value = val.ToString();
                    }
                    concatenated.Append(value);
                }

                var keyBytes     = Encoding.UTF8.GetBytes(secret);
                var messageBytes = Encoding.UTF8.GetBytes(concatenated.ToString());

                using var hmacSha512 = new HMACSHA512(keyBytes);
                var hashBytes        = hmacSha512.ComputeHash(messageBytes);
                var computedHmac     = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

                return CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(computedHmac),
                    Encoding.UTF8.GetBytes(receivedHmac.ToLowerInvariant()));
            }
            catch
            {
                return false;
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // PayPal Webhook  POST /api/webhooks/paypal
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Handles PayPal PAYMENT.CAPTURE.COMPLETED webhook events.
        /// PayPal sends an event body + signature headers to verify authenticity.
        /// reference_id in the purchase_unit carries "{userId}|{planId}" set during order creation.
        /// </summary>
        [HttpPost("paypal")]
        public async Task<IActionResult> PayPalWebhook([FromBody] JsonElement payload)
        {
            try
            {
                // 1. Fetch active PayPal config for webhook ID & credentials
                var paypalConfig = await _context.PaymentGatewayConfigs
                    .FirstOrDefaultAsync(c => c.ProviderName == "PayPal" && c.IsActive);

                if (paypalConfig == null)
                    return BadRequest("PayPal configuration is missing or inactive.");

                // 2. Verify signature using PayPal headers
                //    PayPal sends: PAYPAL-TRANSMISSION-ID, PAYPAL-TRANSMISSION-TIME,
                //                  PAYPAL-CERT-URL, PAYPAL-TRANSMISSION-SIG
                var transmissionId   = Request.Headers["PAYPAL-TRANSMISSION-ID"].FirstOrDefault();
                var transmissionTime = Request.Headers["PAYPAL-TRANSMISSION-TIME"].FirstOrDefault();
                var certUrl          = Request.Headers["PAYPAL-CERT-URL"].FirstOrDefault();
                var transmissionSig  = Request.Headers["PAYPAL-TRANSMISSION-SIG"].FirstOrDefault();
                var webhookId        = paypalConfig.IntegrationId; // Store PayPal Webhook ID in IntegrationId field

                if (string.IsNullOrEmpty(transmissionId) || string.IsNullOrEmpty(transmissionSig))
                    return Unauthorized("Missing PayPal signature headers.");

                // NOTE: Full PayPal signature verification requires calling PayPal's verify-webhook-signature API.
                // For production, uncomment and implement VerifyPayPalSignatureAsync below.
                // For now we trust the payload if headers are present (add full verification before go-live).

                // 3. Only handle PAYMENT.CAPTURE.COMPLETED events
                if (!payload.TryGetProperty("event_type", out var eventType)
                    || eventType.GetString() != "PAYMENT.CAPTURE.COMPLETED")
                {
                    return Ok(new { message = "Event ignored." });
                }

                // 4. Extract reference_id → "{userId}|{planId}"
                string referenceId = string.Empty;
                if (payload.TryGetProperty("resource", out var resource)
                    && resource.TryGetProperty("supplementary_data", out var suppData)
                    && suppData.TryGetProperty("related_ids", out var relatedIds)
                    && relatedIds.TryGetProperty("order_id", out var _))
                {
                    // Fallback: try purchase_units path
                }

                // Primary: purchase_units[0].reference_id from the capture resource
                if (payload.TryGetProperty("resource", out var res2)
                    && res2.TryGetProperty("purchase_units", out var units)
                    && units.GetArrayLength() > 0)
                {
                    var unit = units[0];
                    if (unit.TryGetProperty("reference_id", out var refEl))
                        referenceId = refEl.GetString() ?? string.Empty;
                }

                // Alternative: the capture itself stores the reference via custom_id
                if (string.IsNullOrEmpty(referenceId)
                    && payload.TryGetProperty("resource", out var res3)
                    && res3.TryGetProperty("custom_id", out var customId))
                {
                    referenceId = customId.GetString() ?? string.Empty;
                }

                if (string.IsNullOrEmpty(referenceId) || !referenceId.Contains('|'))
                    return BadRequest("Missing or invalid reference_id.");

                var parts = referenceId.Split('|', 2);
                if (!Guid.TryParse(parts[0], out var userGuid) || !int.TryParse(parts[1], out var planId))
                    return BadRequest("Invalid reference_id format.");

                // 5. Find user & plan
                var user = await _context.Users.FindAsync(userGuid);
                var plan = await _context.Plans.FindAsync(planId);
                if (user == null || plan == null)
                    return NotFound("User or Plan not found.");

                // 6. Extract amount
                decimal amountUsd = 0;
                if (payload.TryGetProperty("resource", out var res4)
                    && res4.TryGetProperty("amount", out var amt)
                    && amt.TryGetProperty("value", out var val))
                {
                    decimal.TryParse(val.GetString(), System.Globalization.NumberStyles.Any,
                        System.Globalization.CultureInfo.InvariantCulture, out amountUsd);
                }

                // 6b. Idempotency: check if already processed via CaptureOrderAsync or previous webhook
                // Extract the PayPal order ID from the resource
                string paypalOrderId = string.Empty;
                if (payload.TryGetProperty("resource", out var resForId))
                {
                    // For PAYMENT.CAPTURE.COMPLETED, resource.id is the capture ID
                    // The supplementary_data.related_ids.order_id is the order ID
                    if (resForId.TryGetProperty("supplementary_data", out var suppD)
                        && suppD.TryGetProperty("related_ids", out var relIds)
                        && relIds.TryGetProperty("order_id", out var orderIdEl))
                    {
                        paypalOrderId = orderIdEl.GetString() ?? string.Empty;
                    }
                    if (string.IsNullOrEmpty(paypalOrderId) && resForId.TryGetProperty("id", out var captureIdEl))
                    {
                        paypalOrderId = captureIdEl.GetString() ?? string.Empty;
                    }
                }

                if (!string.IsNullOrEmpty(paypalOrderId))
                {
                    var alreadyDone = await _context.Payments
                        .AnyAsync(p => p.PaymentId == paypalOrderId && p.Status == "Completed");
                    if (alreadyDone)
                    {
                        Console.WriteLine($"[PayPalWebhook] Order {paypalOrderId} already processed — ignoring duplicate.");
                        return Ok(new { message = "Already processed." });
                    }
                }

                // 7. Activate / extend subscription (same logic as Paymob webhook)
                var existingSub = await _context.Subscriptions
                    .Include(s => s.Plan)
                    .FirstOrDefaultAsync(s => s.UserId == user.Id && s.PlanId == plan.Id
                        && (s.Status == "active" || s.Status == "freeze"));

                Subscription currentSub;
                bool shouldReset = false;

                if (existingSub != null)
                {
                    if (existingSub.EndDate < DateTime.UtcNow)
                    {
                        var graceEnds = existingSub.EndDate.AddDays(existingSub.Plan.GracePeriodDays);
                        if (DateTime.UtcNow > graceEnds) shouldReset = true;
                    }
                    existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow
                        ? existingSub.EndDate : DateTime.UtcNow).AddDays(plan.DurationDays);
                    existingSub.Status = "active";
                    _context.Update(existingSub);
                    currentSub = existingSub;
                }
                else
                {
                    var activeSubscriptions = await _context.Subscriptions
                        .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                        .ToListAsync();
                    foreach (var sub in activeSubscriptions) sub.Status = "canceled";

                    var newSub = new Subscription
                    {
                        UserId    = user.Id,
                        PlanId    = plan.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate   = DateTime.UtcNow.AddDays(plan.DurationDays),
                        Status    = "active"
                    };
                    _context.Subscriptions.Add(newSub);
                    currentSub = newSub;
                }

                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset, subscriptionId: currentSub?.Id);

                // 8. Record payment — use paypalOrderId for idempotency key (not transmissionId which changes per webhook delivery)
                _context.Payments.Add(new Payment
                {
                    UserId         = user.Id,
                    PlanId         = plan.Id,
                    SubscriptionId = currentSub?.Id,
                    Amount         = amountUsd,
                    Currency       = "USD",
                    Method         = "PayPal",
                    PaymentId      = !string.IsNullOrEmpty(paypalOrderId) ? paypalOrderId : transmissionId,
                    Status         = "Completed",
                    CreatedAt      = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();

                // Affiliate Commission — MUST NOT break payment flow on failure
                var paypalPayment = await _context.Payments
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefaultAsync(p => p.UserId == user.Id && p.PaymentId == transmissionId);
                if (paypalPayment != null)
                {
                    try
                    {
                        bool isRecurringPayPal = existingSub != null;
                        await _affiliateService.CreateCommissionAsync(paypalPayment.Id, isRecurringPayPal);
                    }
                    catch (Exception affPayPalEx)
                    {
                        Console.WriteLine($"[Affiliate] Commission creation failed for PayPal payment {paypalPayment.Id}: {affPayPalEx.Message}");
                    }
                }

                // 9. Generate Invoice
                string verifyUrlBase = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL") 
                                       ?? Environment.GetEnvironmentVariable("NEXT_PUBLIC_API_URL")?.Replace("/api", "")
                                       ?? "https://nexmediaai.com";
                
                decimal fixedFeeUsd = plan.FixedFeeUsd;
                decimal taxAmtUsd = (plan.PriceUsd + fixedFeeUsd) * (plan.TaxPercentageUsd / 100m);
                decimal subTotalUsd = amountUsd - taxAmtUsd - fixedFeeUsd;

                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                    SubscriptionId = currentSub?.Id ?? 0,
                    UserId = user.Id,
                    PaymentGateway = "PayPal",
                    PaymentMethod = "Card/PayPal Wallet",
                    Currency = "USD",
                    SubTotal = subTotalUsd,
                    TaxAmount = taxAmtUsd,
                    FixedFeeAmount = fixedFeeUsd,
                    TotalAmount = amountUsd,
                    TransactionId = transmissionId,
                    Subscription = currentSub
                };
                
                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                // Generate PDF
                string minioUrl = "";
                try
                {
                    byte[] pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(invoice, verifyUrlBase);
                    using var ms = new System.IO.MemoryStream(pdfBytes);
                    minioUrl = await _mediaService.UploadFileAsync(ms, $"invoices/{invoice.InvoiceNumber}.pdf", "application/pdf", "invoices");
                    
                    invoice.MinioPdfUrl = minioUrl;
                    _context.Invoices.Update(invoice);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to generate/upload invoice PDF: " + ex.Message);
                }

                // 10. Send receipt email
                try
                {
                    if (!string.IsNullOrEmpty(user.Email) && currentSub != null)
                    {
                        var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                            user.FullName ?? user.Email,
                            plan.NameAr ?? plan.Name,
                            currentSub.StartDate,
                            currentSub.EndDate,
                            plan.MonthlyCredits,
                            amountUsd,
                            minioUrl);
                        Hangfire.BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? "", Subject = "تم تفعيل اشتراكك بنجاح - NexMedia AI", HtmlBody = htmlBody }));
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("PayPal webhook email failed: " + ex.Message);
                }

                return Ok(new { success = true, message = "Subscription activated via PayPal." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
