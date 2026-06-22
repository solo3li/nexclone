using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using NexClone.Backend.Services.Payments;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers.Api
{
    [Route("api/checkout")]
    [ApiController]
    [Authorize]
    public class CheckoutApiController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CheckoutApiController(IPaymentService paymentService, UserManager<ApplicationUser> userManager)
        {
            _paymentService = paymentService;
            _userManager = userManager;
        }

        public class CheckoutRequest
        {
            public int PlanId { get; set; }
            public string Currency { get; set; } = "USD";
        }

        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] CheckoutRequest request)
        {
            if (request == null || request.PlanId <= 0)
                return BadRequest(new { error = "Invalid plan details." });

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (request.Currency == "EGP")
            {
                var result = await _paymentService.CreatePaymobIntentAsync(
                    request.PlanId, 
                    user.Id.ToString(), 
                    user.Email ?? "user@example.com", 
                    user.UserName ?? "Guest", 
                    "User", 
                    user.PhoneNumber ?? ""
                );

                if (!result.IsSuccess)
                {
                    return BadRequest(new { error = result.ErrorMessage });
                }

                return Ok(new { checkoutUrl = result.CheckoutUrl });
            }
            else if (request.Currency == "USD")
            {
                // PayPal Integration stub
                string checkoutUrl = $"/api/webhooks/paypal-mock-success?planId={request.PlanId}&userId={user.Id}";
                return Ok(new { checkoutUrl });
            }

            return BadRequest(new { error = "Invalid Currency" });
        }
    }
}
