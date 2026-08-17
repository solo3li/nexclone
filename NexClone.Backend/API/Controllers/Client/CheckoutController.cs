using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.ExternalServices.Payments;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/checkout")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly PayPalPaymentService _payPalService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public CheckoutController(
            IPaymentService paymentService,
            PayPalPaymentService payPalService,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _paymentService = paymentService;
            _payPalService = payPalService;
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// Returns the list of available payment gateways for a specific plan.
        /// The frontend uses this to show the user their payment options.
        /// </summary>
        [HttpGet("gateways/{planId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetGatewaysForPlan(int planId)
        {
            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null || plan.IsDeleted)
                return NotFound(new { error = "Plan not found." });

            var gateways = await _context.PlanPaymentGateways
                .Include(ppg => ppg.GatewayConfig)
                .Where(ppg => ppg.PlanId == planId && ppg.IsActive && ppg.GatewayConfig.IsActive)
                .OrderBy(ppg => ppg.SortOrder)
                .Select(ppg => new
                {
                    GatewayConfigId = ppg.GatewayConfigId,
                    ProviderName    = ppg.GatewayConfig.ProviderName,
                    DisplayName     = ppg.DisplayName ?? ppg.GatewayConfig.ProviderName,
                    Currency        = ppg.Currency,
                    IsDefault       = ppg.IsDefault,
                    SortOrder       = ppg.SortOrder,
                    ClientId        = ppg.GatewayConfig.ProviderName == "PayPal" ? ppg.GatewayConfig.ClientId : null
                })
                .ToListAsync();

            return Ok(gateways);
        }

        public class CheckoutRequest
        {
            public int PlanId          { get; set; }
            public int GatewayConfigId { get; set; }
            public string Currency     { get; set; } = "EGP";
            public string Method       { get; set; }
        }

        public class CapturePayPalRequest
        {
            public string OrderId { get; set; }
        }

        /// <summary>
        /// Initiates a payment session via the selected gateway.
        /// Returns a checkout URL for the user to complete payment.
        /// </summary>
        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] CheckoutRequest request)
        {
            if (request == null || request.PlanId <= 0)
                return BadRequest(new { error = "Invalid plan ID." });

            if (request.GatewayConfigId <= 0)
                return BadRequest(new { error = "A payment gateway must be selected." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { error = "User not found." });

            // Validate that this gateway is actually linked to this plan and currency
            var gatewayLink = await _context.PlanPaymentGateways
                .Include(ppg => ppg.GatewayConfig)
                .FirstOrDefaultAsync(ppg =>
                    ppg.PlanId          == request.PlanId &&
                    ppg.GatewayConfigId == request.GatewayConfigId &&
                    ppg.Currency        == request.Currency.ToUpperInvariant() &&
                    ppg.IsActive        &&
                    ppg.GatewayConfig.IsActive);

            if (gatewayLink == null)
                return BadRequest(new { error = "The selected payment gateway is not available for this plan and currency." });

            // Dispatch to the payment service — routing is handled internally per currency
            var result = await _paymentService.InitiatePaymentAsync(
                planId:         request.PlanId,
                gatewayConfigId: request.GatewayConfigId,
                userId:         userId,
                userEmail:      user.Email ?? "user@example.com",
                userName:       user.FullName ?? "User",
                phoneNumber:    user.PhoneNumber ?? "+201000000000",
                currency:       request.Currency.ToUpperInvariant(),
                method:         request.Method);

            if (result.IsSuccess)
                return Ok(new { checkoutUrl = result.CheckoutUrl, provider = result.Provider, orderId = result.OrderId, clientId = result.ClientId });

            return BadRequest(new { error = result.ErrorMessage });
        }

        /// <summary>
        /// Creates a PayPal Order for Hosted Card Fields on frontend.
        /// </summary>
        [HttpPost("create-paypal-order")]
        public async Task<IActionResult> CreatePayPalOrder([FromBody] CheckoutRequest request)
        {
            if (request == null || request.PlanId <= 0)
                return BadRequest(new { error = "Invalid plan ID." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { error = "User not found." });

            var paypalConfig = await _context.PaymentGatewayConfigs.FirstOrDefaultAsync(c => c.ProviderName == "PayPal" && c.IsActive);
            if (paypalConfig == null) return BadRequest(new { error = "PayPal is not configured." });

            var result = await _payPalService.CreateOrderAsync(request.PlanId, paypalConfig.Id, userId, user.Email ?? "user@example.com", "USD");
            if (!result.IsSuccess) return BadRequest(new { error = result.ErrorMessage });

            return Ok(new { orderId = result.OrderId, clientId = result.ClientId, checkoutUrl = result.CheckoutUrl });
        }

        /// <summary>
        /// Captures an authorized PayPal Order submitted via Hosted Card Fields.
        /// </summary>
        [HttpPost("capture-paypal-order")]
        public async Task<IActionResult> CapturePayPalOrder([FromBody] CapturePayPalRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.OrderId))
                return BadRequest(new { error = "Invalid Order ID." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _payPalService.CaptureOrderAsync(request.OrderId, userId);
            if (!result.IsSuccess) return BadRequest(new { error = result.ErrorMessage });

            return Ok(new { success = true, orderId = result.OrderId });
        }
    }
}
