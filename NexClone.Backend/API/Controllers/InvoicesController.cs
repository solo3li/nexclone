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
                invoice.TransactionId,
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

        [HttpGet("generate-retro")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateRetroInvoices(
            [FromServices] NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService invoiceService,
            [FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var subs = await _context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => !_context.Invoices.Any(i => i.SubscriptionId == s.Id))
                .ToListAsync();

            foreach(var sub in subs)
            {
                if (sub.Plan == null || sub.User == null) continue;

                string verifyUrlBase = "https://nexmedia.ai";
                decimal amountEgp = sub.Plan.PriceEgp;
                decimal taxAmt = amountEgp * (sub.Plan.TaxPercentage / 100m);
                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-{sub.CreatedAt.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                    SubscriptionId = sub.Id,
                    UserId = sub.UserId,
                    PaymentGateway = "Retroactive",
                    PaymentMethod = "System",
                    Currency = "EGP",
                    SubTotal = amountEgp - taxAmt,
                    TaxAmount = taxAmt,
                    TotalAmount = amountEgp,
                    TransactionId = "RETRO-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    CreatedAt = sub.CreatedAt,
                    Subscription = sub
                };
                
                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                try
                {
                    byte[] pdfBytes = await invoiceService.GenerateInvoicePdfAsync(invoice, verifyUrlBase);
                    using var ms = new System.IO.MemoryStream(pdfBytes);
                    string minioUrl = await mediaService.UploadFileAsync(ms, $"invoices/{invoice.InvoiceNumber}.pdf", "application/pdf", "invoices");
                    
                    invoice.MinioPdfUrl = minioUrl;
                    _context.Invoices.Update(invoice);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to generate/upload retro invoice PDF: " + ex.Message);
                }
            }
            return Ok($"Generated {subs.Count} missing invoices");
        }
    }
}
