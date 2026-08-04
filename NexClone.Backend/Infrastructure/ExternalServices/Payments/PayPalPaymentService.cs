using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices.Payments
{
    /// <summary>
    /// Handles PayPal Orders API v2 payments.
    /// Uses Client Credentials flow to get an access token, then creates an order.
    /// Config stored in PaymentGatewayConfig with ProviderName = "PayPal":
    ///   ClientId     = PayPal App Client ID
    ///   ClientSecret = PayPal App Client Secret
    ///   ApiBase      = "https://api-m.sandbox.paypal.com" (sandbox) or "https://api-m.paypal.com" (live)
    /// </summary>
    public class PayPalPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public PayPalPaymentService(ApplicationDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
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
            var amount = currency.ToUpperInvariant() == "USD" ? plan.PriceUsd : plan.PriceEgp;
            var amountStr = amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);

            // 5. Build return/cancel URLs — these should come from AppSettings ideally
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
                        reference_id = $"{userId}|{planId}", // Used in webhook to identify user+plan
                        description  = $"Subscription — {plan.Name}",
                        amount       = new
                        {
                            currency_code = currency.ToUpperInvariant(),
                            value         = amountStr
                        }
                    }
                },
                application_context = new
                {
                    brand_name          = "NexMedia AI",
                    landing_page        = "BILLING",
                    user_action         = "PAY_NOW",
                    return_url          = returnUrl,
                    cancel_url          = cancelUrl
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

            // 7. Extract the approval URL from the response
            using var doc  = JsonDocument.Parse(orderContent);
            var root       = doc.RootElement;
            var orderId    = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
            var approvalUrl = string.Empty;

            if (root.TryGetProperty("links", out var links))
            {
                foreach (var link in links.EnumerateArray())
                {
                    if (link.TryGetProperty("rel", out var rel) && rel.GetString() == "approve"
                        && link.TryGetProperty("href", out var href))
                    {
                        approvalUrl = href.GetString() ?? string.Empty;
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(approvalUrl))
                return new PaymentResult { IsSuccess = false, ErrorMessage = "No approval URL returned from PayPal." };

            return new PaymentResult
            {
                IsSuccess   = true,
                CheckoutUrl = approvalUrl,
                Provider    = "PayPal"
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
