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
            // Invoice verification feature was removed; kept as a stub so old QR/bookmarked
            // links degrade gracefully instead of 404ing at the API level.
            return NotFound(new { message = "Invoice verification is no longer available." });
        }

        [HttpGet("my-invoices")]
        [Authorize]
        public async Task<IActionResult> GetMyInvoices([FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var invoices = await _context.Invoices
                .Include(i => i.Subscription)
                .ThenInclude(s => s.Plan)
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            var result = new System.Collections.Generic.List<object>();
            foreach (var i in invoices)
            {
                var pdfUrl = string.IsNullOrWhiteSpace(i.MinioPdfUrl) ? null : await mediaService.GetFileUrlAsync(i.MinioPdfUrl, "invoices");
                result.Add(new
                {
                    i.InvoiceNumber,
                    Date = i.CreatedAt,
                    PlanName = i.Subscription?.Plan?.Name ?? "Custom Plan",
                    i.TotalAmount,
                    i.Currency,
                    MinioPdfUrl = pdfUrl
                });
            }

            return Ok(new { success = true, invoices = result });
        }

        [HttpGet("generate-retro")]
        [Authorize(Roles = "Admin")]
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

                var payment = await _context.Payments.FirstOrDefaultAsync(p => p.SubscriptionId == sub.Id);
                string currency = payment?.Currency ?? "EGP";

                decimal fixedFee = 0;
                decimal taxAmt = 0;
                decimal totalAmt = 0;

                if (currency.ToUpper() == "USD")
                {
                    fixedFee = sub.Plan.FixedFeeUsd;
                    taxAmt = (sub.Plan.PriceUsd + fixedFee) * (sub.Plan.TaxPercentageUsd / 100m);
                    totalAmt = sub.Plan.PriceUsd;
                }
                else
                {
                    fixedFee = sub.Plan.FixedFeeEgp;
                    taxAmt = (sub.Plan.PriceEgp + fixedFee) * (sub.Plan.TaxPercentageEgp / 100m);
                    totalAmt = sub.Plan.PriceEgp;
                }

                decimal subTotal = totalAmt - taxAmt - fixedFee;

                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                    SubscriptionId = sub.Id,
                    UserId = sub.UserId,
                    PaymentGateway = payment?.Method ?? "Manual",
                    PaymentMethod = "Offline",
                    Currency = currency,
                    SubTotal = subTotal,
                    TaxAmount = taxAmt,
                    FixedFeeAmount = fixedFee,
                    TotalAmount = totalAmt,
                    TransactionId = "MANUAL-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    CreatedAt = sub.CreatedAt,
                    Subscription = sub
                };
                
                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                try
                {
                    byte[] pdfBytes = await invoiceService.GenerateInvoicePdfAsync(invoice);
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
