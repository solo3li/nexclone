using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Infrastructure.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace NexClone.Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("verify/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyInvoice(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { message = "Token is required" });

            var invoice = await _context.Invoices
                .Include(i => i.User)
                .Include(i => i.Subscription)
                .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(i => i.VerificationToken == token);

            if (invoice == null)
            {
                return NotFound(new { message = "Invoice not found or invalid token." });
            }

            var result = new
            {
                invoice.InvoiceNumber,
                Date = invoice.CreatedAt,
                CustomerName = invoice.User.FullName ?? invoice.User.Email,
                PlanName = invoice.Subscription?.Plan?.Name ?? "Custom Plan",
                invoice.PaymentGateway,
                invoice.PaymentMethod,
                invoice.SubTotal,
                invoice.TaxAmount,
                invoice.TotalAmount,
                invoice.Currency,
                invoice.MinioPdfUrl
            };

            return Ok(new { success = true, invoice = result });
        }

        [HttpGet("my-invoices")]
        [Authorize]
        public async Task<IActionResult> GetMyInvoices()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var invoices = await _context.Invoices
                .Include(i => i.Subscription)
                .ThenInclude(s => s.Plan)
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.CreatedAt)
                .Select(i => new
                {
                    i.InvoiceNumber,
                    Date = i.CreatedAt,
                    PlanName = i.Subscription.Plan.Name,
                    i.TotalAmount,
                    i.Currency,
                    i.MinioPdfUrl
                })
                .ToListAsync();

            return Ok(new { success = true, invoices });
        }
    }
}
