using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;
using System;
using NexClone.Backend.Services;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class ManualPaymentsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;

        public ManualPaymentsAdminController(ApplicationDbContext context, IEmailService emailService, IEmailTemplateService emailTemplateService)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
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

        public async Task<IActionResult> Details(int id, [FromServices] NexClone.Backend.Services.IMediaService mediaService)
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
        public async Task<IActionResult> Approve(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Plan)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);
                
            if (payment == null || payment.Status != "Pending") return NotFound();

            payment.Status = "Approved";
            payment.UpdatedAt = DateTime.UtcNow;

            var existingSub = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == payment.UserId && s.PlanId == payment.PlanId);

            if (existingSub != null)
            {
                existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(payment.Plan.DurationDays);
                existingSub.Status = "Active";
                payment.SubscriptionId = existingSub.Id;
            }
            else
            {
                var newSub = new Subscription
                {
                    UserId = payment.UserId,
                    PlanId = payment.Plan.Id,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(payment.Plan.DurationDays),
                    Status = "Active"
                };
                _context.Subscriptions.Add(newSub);
                await _context.SaveChangesAsync();
                payment.SubscriptionId = newSub.Id;
            }

            var latestSub = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == payment.UserId)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefaultAsync();

            if (latestSub != null && latestSub.EndDate < DateTime.UtcNow)
            {
                var graceEnds = latestSub.EndDate.AddDays(latestSub.Plan.GracePeriodDays);
                if (DateTime.UtcNow > graceEnds)
                {
                    payment.User.AvailableCredits = 0;
                }
            }

            // Increment User Credits
            payment.User.AvailableCredits += payment.Plan.MonthlyCredits;
            _context.Users.Update(payment.User);

            await _context.SaveChangesAsync();

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
