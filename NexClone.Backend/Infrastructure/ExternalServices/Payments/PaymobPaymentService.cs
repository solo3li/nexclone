using System;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices.Payments
{
    public class PaymobPaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly PayPalPaymentService _payPal;

        public PaymobPaymentService(ApplicationDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
            _payPal = new PayPalPaymentService(context, httpClient);
        }

        /// <inheritdoc/>
        public async Task<PaymentResult> InitiatePaymentAsync(
            int planId,
            int gatewayConfigId,
            string userId,
            string userEmail,
            string userName,
            string phoneNumber,
            string currency)
        {
            return currency.ToUpperInvariant() switch
            {
                "EGP" => await CreatePaymobIntentAsync(planId, gatewayConfigId, userId, userEmail, userName, phoneNumber),
                "USD" => await _payPal.CreateOrderAsync(planId, gatewayConfigId, userId, userEmail, "USD"),
                _     => new PaymentResult { IsSuccess = false, ErrorMessage = $"Currency '{currency}' is not yet supported." }
            };
        }

        private async Task<PaymentResult> CreatePaymobIntentAsync(
            int planId,
            int gatewayConfigId,
            string userId,
            string userEmail,
            string userName,
            string phoneNumber)
        {
            // 1. Fetch Plan
            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null) return new PaymentResult { IsSuccess = false, ErrorMessage = "Plan not found." };

            // 2. Fetch Paymob Config by the resolved gatewayConfigId (already validated by caller)
            var paymobConfig = await _context.PaymentGatewayConfigs
                .FirstOrDefaultAsync(c => c.Id == gatewayConfigId && c.ProviderName == "Paymob" && c.IsActive);

            if (paymobConfig == null || string.IsNullOrEmpty(paymobConfig.SecretKey) || string.IsNullOrEmpty(paymobConfig.PublicKey))
            {
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Paymob configuration is missing or inactive." };
            }

            // Parse IntegrationId — must be a valid integer set in admin panel
            if (string.IsNullOrEmpty(paymobConfig.IntegrationId) || !int.TryParse(paymobConfig.IntegrationId, out int integrationId))
            {
                return new PaymentResult { IsSuccess = false, ErrorMessage = "Paymob IntegrationId is missing or invalid. Please set it in the admin panel." };
            }

            // 3. Prepare payload (amount in cents)
            decimal basePrice = plan.PriceEgp;
            decimal fixedFee = plan.FixedFeeEgp;
            decimal taxAmount = (basePrice + fixedFee) * (plan.TaxPercentageEgp / 100m);
            decimal finalTotal = basePrice + fixedFee + taxAmount;
            int amountCents = (int)Math.Round(finalTotal * 100);

            var payload = new
            {
                amount = amountCents,
                currency = "EGP",
                payment_methods = new[] { integrationId },
                items = new[]
                {
                    new
                    {
                        name = (plan.Name.Length > 50) ? plan.Name.Substring(0, 50) : plan.Name,
                        amount = amountCents,
                        description = $"Subscription for {plan.Name}",
                        quantity = 1
                    }
                },
                billing_data = new
                {
                    apartment = "NA",
                    first_name = (userId.Length > 50) ? userId.Substring(0, 50) : userId,
                    last_name = (plan.Name.Length > 50) ? plan.Name.Substring(0, 50) : plan.Name,
                    street = "NA",
                    building = "NA",
                    phone_number = string.IsNullOrEmpty(phoneNumber)
                        ? "+201000000000"
                        : (phoneNumber.Length > 15 ? phoneNumber.Substring(0, 15) : phoneNumber),
                    country = "EG",
                    email = string.IsNullOrEmpty(userEmail) ? "test@mail.com" : userEmail,
                    floor = "NA",
                    state = "NA",
                    city = "NA"
                },
                expiration = 3600
            };

            // 4. Send Request to Paymob Intention API
            var request = new HttpRequestMessage(HttpMethod.Post, "https://accept.paymob.com/v1/intention/");
            request.Headers.Authorization = new AuthenticationHeaderValue("Token", paymobConfig.SecretKey);
            request.Content = new System.Net.Http.StringContent(
                JsonSerializer.Serialize(payload),
                System.Text.Encoding.UTF8,
                "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(responseContent);
                var root = doc.RootElement;
                if (root.TryGetProperty("client_secret", out var clientSecretElement))
                {
                    string clientSecret = clientSecretElement.GetString() ?? "";
                    string checkoutUrl = $"https://accept.paymob.com/unifiedcheckout/?publicKey={paymobConfig.PublicKey}&clientSecret={clientSecret}";

                    return new PaymentResult
                    {
                        IsSuccess = true,
                        CheckoutUrl = checkoutUrl,
                        Provider = "Paymob"
                    };
                }
                return new PaymentResult { IsSuccess = false, ErrorMessage = "No client secret returned from Paymob." };
            }

            return new PaymentResult { IsSuccess = false, ErrorMessage = $"Paymob Error: {responseContent}" };
        }
    }
}
