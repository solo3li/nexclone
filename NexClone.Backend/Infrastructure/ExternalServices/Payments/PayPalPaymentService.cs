using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System;
using System.Linq;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Infrastructure.ExternalServices.Invoicing;
using Hangfire;

namespace NexClone.Backend.Infrastructure.ExternalServices.Payments
{
    /// <summary>
    /// Handles PayPal Orders API v2 payments and Hosted Card Fields.
    /// Config stored in PaymentGatewayConfig with ProviderName = "PayPal":
    ///   ClientId     = PayPal App Client ID
    ///   ClientSecret = PayPal App Client Secret
    ///   ApiBase      = "https://api-m.sandbox.paypal.com" (sandbox) or "https://api-m.paypal.com" (live)
    /// </summary>
    public class PayPalPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly WalletService _walletService;
        private readonly AffiliateService _affiliateService;
        private readonly IInvoiceGeneratorService _invoiceService;
        private readonly IMediaService _mediaService;
        private readonly IEmailTemplateService _emailTemplateService;

        public PayPalPaymentService(
            ApplicationDbContext context, 
            HttpClient httpClient,
            WalletService walletService = null,
            AffiliateService affiliateService = null,
            IInvoiceGeneratorService invoiceService = null,
            IMediaService mediaService = null,
            IEmailTemplateService emailTemplateService = null)
        {
            _context = context;
            _httpClient = httpClient;
            _walletService = walletService;
            _affiliateService = affiliateService;
            _invoiceService = invoiceService;
            _mediaService = mediaService;
            _emailTemplateService = emailTemplateService;
        }

        public async Task<PaymentResult> CreateOrderAsync(
            int planId,
            int gatewayConfigId,
            string userId,
            string userEmail,
            string currency = "USD")
        {
            // 1. Fetch Plan
            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null)
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Plan not found." };

            // 2. Fetch PayPal Config
            var config = await _context.PaymentGatewayConfigs
                .FirstOrDefaultAsync(c => c.Id == gatewayConfigId && c.ProviderName == "PayPal" && c.IsActive);

            if (config == null
                || string.IsNullOrEmpty(config.ClientId)
                || string.IsNullOrEmpty(config.ClientSecret)
                || string.IsNullOrEmpty(config.ApiBase))
            {
                return new PaymentResult { IsSuccess = false, ErrorMessage = "PayPal configuration is missing or inactive." };
            }

            // 3. Get OAuth2 Access Token from PayPal
            var accessToken = await GetAccessTokenAsync(config.ClientId, config.ClientSecret, config.ApiBase);
            if (string.IsNullOrEmpty(accessToken))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Failed to authenticate with PayPal." };

            // 4. Determine amount
            decimal basePrice = currency.ToUpperInvariant() == "USD" ? plan.PriceUsd : plan.PriceEgp;
            decimal fixedFee = currency.ToUpperInvariant() == "USD" ? plan.FixedFeeUsd : plan.FixedFeeEgp;
            decimal taxPercentage = currency.ToUpperInvariant() == "USD" ? plan.TaxPercentageUsd : plan.TaxPercentageEgp;
            
            decimal taxAmount = (basePrice + fixedFee) * (taxPercentage / 100m);
            decimal finalTotal = basePrice + fixedFee + taxAmount;
            
            var amountStr = finalTotal.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);

            // 5. Build return/cancel URLs
            var frontendOrigin = await _context.AppSettings
                .Where(s => s.Key == "Origin.AllowedOrigins")
                .Select(s => s.Value)
                .FirstOrDefaultAsync();
            var baseUrl = frontendOrigin?.Split(',')[0]?.Trim() ?? "http://localhost:3000";
            var returnUrl = $"{baseUrl}/payment/success?planId={planId}&provider=PayPal";
            var cancelUrl = $"{baseUrl}/pricing";

            // 6. Create PayPal Order
            var orderPayload = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        reference_id = $"{userId}|{planId}",
                        description  = $"Subscription — {plan.Name}",
                        amount       = new
                        {
                            currency_code = currency.ToUpperInvariant(),
                            value         = amountStr
                        }
                    }
                },
                payment_source = new
                {
                    paypal = new
                    {
                        experience_context = new
                        {
                            payment_method_preference = "UNRESTRICTED",
                            brand_name = "NexMedia AI",
                            landing_page = "GUEST_CHECKOUT",
                            user_action = "PAY_NOW",
                            return_url = returnUrl,
                            cancel_url = cancelUrl
                        }
                    }
                }
            };

            var orderRequest = new HttpRequestMessage(HttpMethod.Post, $"{config.ApiBase}/v2/checkout/orders");
            orderRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            orderRequest.Content = new System.Net.Http.StringContent(
                JsonSerializer.Serialize(orderPayload),
                System.Text.Encoding.UTF8,
                "application/json");

            var orderResponse = await _httpClient.SendAsync(orderRequest);
            var orderContent  = await orderResponse.Content.ReadAsStringAsync();

            if (!orderResponse.IsSuccessStatusCode)
                return new PaymentResult { IsSuccess = false, ErrorMessage = $"PayPal Order Error: {orderContent}" };

            // 7. Extract Order ID & Approval URL
            using var doc  = JsonDocument.Parse(orderContent);
            var root       = doc.RootElement;
            var orderId    = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
            var approvalUrl = string.Empty;

            if (root.TryGetProperty("links", out var links))
            {
                foreach (var link in links.EnumerateArray())
                {
                    if (link.TryGetProperty("rel", out var rel) && link.TryGetProperty("href", out var href))
                    {
                        var relStr = rel.GetString();
                        if (relStr == "approve" || relStr == "payer-action")
                        {
                            approvalUrl = href.GetString() ?? string.Empty;
                            if (relStr == "payer-action") 
                                break;
                        }
                    }
                }
            }

            return new PaymentResult
            {
                IsSuccess   = true,
                OrderId     = orderId,
                ClientId    = config.ClientId,
                CheckoutUrl = approvalUrl,
                Provider    = "PayPal"
            };
        }

        public async Task<PaymentResult> CaptureOrderAsync(string orderId, string userId)
        {
            if (string.IsNullOrEmpty(orderId))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Invalid Order ID." };

            var config = await _context.PaymentGatewayConfigs
                .FirstOrDefaultAsync(c => c.ProviderName == "PayPal" && c.IsActive);

            if (config == null || string.IsNullOrEmpty(config.ClientId) || string.IsNullOrEmpty(config.ClientSecret) || string.IsNullOrEmpty(config.ApiBase))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "PayPal configuration missing." };

            var accessToken = await GetAccessTokenAsync(config.ClientId, config.ClientSecret, config.ApiBase);
            if (string.IsNullOrEmpty(accessToken))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Failed to authenticate with PayPal." };

            // Check if already processed
            var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.PaymentId == orderId && p.Status == "Completed");
            if (existingPayment != null)
            {
                return new PaymentResult { IsSuccess = true, OrderId = orderId, Provider = "PayPal" };
            }

            // Capture order via PayPal API
            var captureRequest = new HttpRequestMessage(HttpMethod.Post, $"{config.ApiBase}/v2/checkout/orders/{orderId}/capture");
            captureRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            captureRequest.Content = new System.Net.Http.StringContent("{}", System.Text.Encoding.UTF8, "application/json");

            var captureResponse = await _httpClient.SendAsync(captureRequest);
            var captureContent = await captureResponse.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(captureContent);
            var root = doc.RootElement;
            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : "";

            if (status != "COMPLETED")
            {
                return new PaymentResult { IsSuccess = false, ErrorMessage = $"PayPal capture returned status: {status}. Raw: {captureContent}" };
            }

            // Extract reference_id -> "userId|planId"
            string referenceId = "";
            decimal amountUsd = 0;

            if (root.TryGetProperty("purchase_units", out var units) && units.GetArrayLength() > 0)
            {
                var unit = units[0];
                if (unit.TryGetProperty("reference_id", out var refEl))
                    referenceId = refEl.GetString() ?? "";

                if (unit.TryGetProperty("payments", out var paymentsEl) &&
                    paymentsEl.TryGetProperty("captures", out var capturesEl) &&
                    capturesEl.GetArrayLength() > 0)
                {
                    var cap = capturesEl[0];
                    if (cap.TryGetProperty("amount", out var amtEl) && amtEl.TryGetProperty("value", out var valEl))
                    {
                        decimal.TryParse(valEl.GetString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out amountUsd);
                    }
                }
            }

            if (string.IsNullOrEmpty(referenceId) || !referenceId.Contains('|'))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Missing reference metadata in PayPal order." };

            var parts = referenceId.Split('|', 2);
            if (!Guid.TryParse(parts[0], out var userGuid) || !int.TryParse(parts[1], out var planId))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Malformed reference ID." };

            var user = await _context.Users.FindAsync(userGuid);
            var plan = await _context.Plans.FindAsync(planId);
            if (user == null || plan == null)
                return new PaymentResult { IsSuccess = false, ErrorMessage = "User or Plan not found." };

            // Activate Subscription
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
                    if (DateTime.UtcNow > graceEnds) shouldReset = true;
                }
                existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(plan.DurationDays);
                existingSub.Status = "active";
                _context.Update(existingSub);
                currentSub = existingSub;
            }
            else
            {
                var latestSub = await _context.Subscriptions
                    .Include(s => s.Plan)
                    .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefaultAsync();

                if (latestSub != null && latestSub.EndDate < DateTime.UtcNow)
                {
                    var graceEnds = latestSub.EndDate.AddDays(latestSub.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > graceEnds) shouldReset = true;
                }

                var activeSubs = await _context.Subscriptions
                    .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                    .ToListAsync();
                foreach (var s in activeSubs) s.Status = "canceled";

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

            if (_walletService != null)
            {
                await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset, subscriptionId: currentSub?.Id);
            }

            var payment = new Payment
            {
                UserId = user.Id,
                PlanId = plan.Id,
                SubscriptionId = currentSub?.Id,
                Amount = amountUsd,
                Currency = "USD",
                Method = "PayPal_Card",
                PaymentId = orderId,
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Affiliate Commission
            if (_affiliateService != null)
            {
                try
                {
                    bool isRecurring = existingSub != null;
                    await _affiliateService.CreateCommissionAsync(payment.Id, isRecurring);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Affiliate Error]: {ex.Message}");
                }
            }

            // Invoice PDF
            if (_invoiceService != null && _mediaService != null)
            {
                try
                {
                    decimal fixedFee = plan.FixedFeeUsd;
                    decimal taxAmt = (plan.PriceUsd + fixedFee) * (plan.TaxPercentageUsd / 100m);
                    decimal subTotal = amountUsd - taxAmt - fixedFee;

                    var invoice = new Invoice
                    {
                        InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                        SubscriptionId = currentSub?.Id ?? 0,
                        UserId = user.Id,
                        PaymentGateway = "PayPal",
                        PaymentMethod = "Card",
                        Currency = "USD",
                        SubTotal = subTotal,
                        TaxAmount = taxAmt,
                        FixedFeeAmount = fixedFee,
                        TotalAmount = amountUsd,
                        TransactionId = orderId,
                        Subscription = currentSub
                    };
                    _context.Invoices.Add(invoice);
                    await _context.SaveChangesAsync();

                    string verifyUrlBase = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL") ?? "https://nexmediaai.com";
                    byte[] pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(invoice, verifyUrlBase);
                    using var ms = new System.IO.MemoryStream(pdfBytes);
                    var minioUrl = await _mediaService.UploadFileAsync(ms, $"invoices/{invoice.InvoiceNumber}.pdf", "application/pdf", "invoices");
                    invoice.MinioPdfUrl = minioUrl;
                    _context.Invoices.Update(invoice);
                    await _context.SaveChangesAsync();

                    if (_emailTemplateService != null && !string.IsNullOrEmpty(user.Email))
                    {
                        var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                            user.FullName ?? user.Email,
                            plan.NameAr ?? plan.Name,
                            currentSub.StartDate,
                            currentSub.EndDate,
                            plan.MonthlyCredits,
                            amountUsd,
                            minioUrl);
                        BackgroundJob.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(c => c.Consume(new NexClone.Backend.Core.Messages.SendEmailMessage { ToEmail = user.Email, ToName = user.FullName ?? "", Subject = "تم تفعيل اشتراكك بنجاح - NexMedia AI", HtmlBody = htmlBody }));
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Invoice Error]: {ex.Message}");
                }
            }

            return new PaymentResult
            {
                IsSuccess = true,
                OrderId = orderId,
                Provider = "PayPal"
            };
        }

        /// <summary>
        /// Gets a short-lived OAuth2 Bearer token using Client Credentials flow.
        /// </summary>
        private async Task<string?> GetAccessTokenAsync(string clientId, string clientSecret, string apiBase)
        {
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, $"{apiBase}/v1/oauth2/token");

            var credentials = System.Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            tokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
            tokenRequest.Content = new System.Net.Http.FormUrlEncodedContent(new[]
            {
                new System.Collections.Generic.KeyValuePair<string, string>("grant_type", "client_credentials")
            });

            var tokenResponse = await _httpClient.SendAsync(tokenRequest);
            if (!tokenResponse.IsSuccessStatusCode) return null;

            var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
            using var doc    = JsonDocument.Parse(tokenContent);

            return doc.RootElement.TryGetProperty("access_token", out var at)
                ? at.GetString()
                : null;
        }
    }
}
