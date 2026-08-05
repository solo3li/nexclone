using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class ManualPaymentsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly NexClone.Backend.Application.Services.WalletService _walletService;

        public ManualPaymentsAdminController(
            ApplicationDbContext context, 
            IEmailService emailService, 
            IEmailTemplateService emailTemplateService,
            NexClone.Backend.Application.Services.WalletService walletService)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
        }

        public async Task<IActionResult> Index()
        {
            var pending = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Plan)
                .Where(p => p.Method == "Manual" && p.Status == "Pending")
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return View(pending);
        }

        public async Task<IActionResult> Details(int id, [FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var payment = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Plan)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return NotFound();

            if (!string.IsNullOrEmpty(payment.ReceiptUrl) && !payment.ReceiptUrl.StartsWith("http"))
            {
                payment.ReceiptUrl = await mediaService.GetFileUrlAsync(payment.ReceiptUrl, "receipts");
            }

            return View(payment);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Approve(int id,
            [FromServices] NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService invoiceService,
            [FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var payment = await _context.Payments
                .Include(p => p.Plan)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);
                
            if (payment == null || payment.Status != "Pending") return NotFound();

            payment.Status = "Approved";
            payment.UpdatedAt = DateTime.UtcNow;

            var existingSub = await _context.Subscriptions
                .Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.UserId == payment.UserId && s.PlanId == payment.Plan.Id && (s.Status == "active" || s.Status == "freeze"));

            Subscription currentSub = null;
            bool shouldReset = false;

            if (existingSub != null)
            {
                if (existingSub.EndDate < DateTime.UtcNow)
                {
                    var graceEnds = existingSub.EndDate.AddDays(existingSub.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > graceEnds)
                    {
                        shouldReset = true;
                    }
                }

                existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(payment.Plan.DurationDays);
                existingSub.Status = "active";
                currentSub = existingSub;
                payment.SubscriptionId = existingSub.Id;
            }
            else
            {
                var latestSub = await _context.Subscriptions
                    .Include(s => s.Plan)
                    .Where(s => s.UserId == payment.UserId && (s.Status == "active" || s.Status == "freeze"))
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefaultAsync();

                if (latestSub != null && latestSub.EndDate < DateTime.UtcNow)
                {
                    var graceEnds = latestSub.EndDate.AddDays(latestSub.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > graceEnds)
                    {
                        shouldReset = true;
                    }
                }

                var activeSubscriptions = await _context.Subscriptions
                    .Where(s => s.UserId == payment.UserId && (s.Status == "active" || s.Status == "freeze"))
                    .ToListAsync();
                
                foreach(var sub in activeSubscriptions)
                {
                    sub.Status = "canceled";
                }

                var newSub = new Subscription
                {
                    UserId = payment.UserId,
                    PlanId = payment.Plan.Id,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(payment.Plan.DurationDays),
                    Status = "active"
                };
                _context.Subscriptions.Add(newSub);
                await _context.SaveChangesAsync();
                payment.SubscriptionId = newSub.Id;
                currentSub = newSub;
            }

            _context.Users.Update(payment.User);
            await _context.SaveChangesAsync();
            await _walletService.DistributePlanCreditsAsync(payment.User.Id, payment.Plan.Id, resetToZero: shouldReset, subscriptionId: payment.SubscriptionId);

            await _context.SaveChangesAsync();

            // Generate Invoice
            if (currentSub != null)
            {
                string verifyUrlBase = "https://nexmedia.ai";
                decimal amount = payment.Amount;
                
                decimal fixedFee = 0;
                decimal taxAmt = 0;
                
                if (payment.Currency?.ToUpper() == "USD")
                {
                    fixedFee = payment.Plan.FixedFeeUsd;
                    taxAmt = (payment.Plan.PriceUsd + fixedFee) * (payment.Plan.TaxPercentageUsd / 100m);
                }
                else
                {
                    fixedFee = payment.Plan.FixedFeeEgp;
                    taxAmt = (payment.Plan.PriceEgp + fixedFee) * (payment.Plan.TaxPercentageEgp / 100m);
                }
                
                decimal subTotal = amount - taxAmt - fixedFee;

                var invoice = new Invoice
                {
                    InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                    SubscriptionId = payment.SubscriptionId ?? 0,
                    UserId = payment.UserId,
                    PaymentGateway = payment.Method,
                    PaymentMethod = "Offline",
                    Currency = payment.Currency ?? "EGP",
                    SubTotal = subTotal,
                    TaxAmount = taxAmt,
                    FixedFeeAmount = fixedFee,
                    TotalAmount = amount,
                    TransactionId = payment.PaymentId ?? payment.Id.ToString(),
                    Subscription = currentSub
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
                    Console.WriteLine("Failed to generate/upload manual payment invoice PDF: " + ex.Message);
                }
            }

            // Send Email Receipt
            try
            {
                var sub = existingSub ?? await _context.Subscriptions.OrderByDescending(s => s.Id).FirstOrDefaultAsync(s => s.UserId == payment.UserId && s.PlanId == payment.Plan.Id);
                if (sub != null && !string.IsNullOrEmpty(payment.User.Email))
                {
                    var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                        payment.User.FullName ?? payment.User.Email,
                        payment.Plan.NameAr ?? payment.Plan.Name,
                        sub.StartDate,
                        sub.EndDate,
                        payment.Plan.MonthlyCredits,
                        payment.Amount);
                    
                    await _emailService.SendEmailAsync(payment.User.Email, payment.User.FullName ?? "", "تم تفعيل اشتراكك بنجاح - NexMedia AI", htmlBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send manual payment approval email: " + ex.Message);
            }

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reject(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null || payment.Status != "Pending") return NotFound();

            payment.Status = "Rejected";
            payment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
