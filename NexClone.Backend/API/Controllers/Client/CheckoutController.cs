using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/checkout")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public CheckoutController(
            IPaymentService paymentService,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _paymentService = paymentService;
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// Returns the list of available payment gateways for a specific plan.
        /// The frontend uses this to show the user their payment options.
        /// </summary>
        [HttpGet("gateways/{planId}")]
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
                    SortOrder       = ppg.SortOrder
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
                return Ok(new { checkoutUrl = result.CheckoutUrl, provider = result.Provider });

            return BadRequest(new { error = result.ErrorMessage });
        }
    }
}
