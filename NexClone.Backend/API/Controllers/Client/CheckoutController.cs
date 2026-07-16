using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using NexClone.Backend.Core.Interfaces; // Assuming IPaymentService is here
using NexClone.Backend.Infrastructure.ExternalServices.Payments; // Or maybe it's here

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/checkout")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CheckoutController(IPaymentService paymentService, UserManager<ApplicationUser> userManager)
        {
            _paymentService = paymentService;
            _userManager = userManager;
        }

        public class CheckoutRequest
        {
            public int PlanId { get; set; }
            public string Currency { get; set; } = "EGP";
        }

        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] CheckoutRequest request)
        {
            if (request == null || request.PlanId <= 0)
            {
                return BadRequest(new { error = "Invalid plan ID." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            // For now, assume only Paymob (EGP). PayPal (USD) might be added later.
            if (request.Currency == "EGP")
            {
                var result = await _paymentService.CreatePaymobIntentAsync(
                    request.PlanId, 
                    userId, 
                    user.Email ?? "user@example.com", 
                    user.FullName ?? "User", 
                    "Customer", 
                    user.PhoneNumber ?? "+201000000000"
                );

                if (result.IsSuccess)
                {
                    return Ok(new { checkoutUrl = result.CheckoutUrl });
                }
                else
                {
                    return BadRequest(new { error = result.ErrorMessage });
                }
            }
            else
            {
                return BadRequest(new { error = "Currency not supported for checkout currently." });
            }
        }
    }
}
