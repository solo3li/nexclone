using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace NexClone.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ManualPaymentsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ManualPaymentsAdminController(ApplicationDbContext context)
        {
            _context = context;
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

        [HttpPost]
        public async Task<IActionResult> Approve(int id)
        {
            var payment = await _context.Payments.Include(p => p.Plan).FirstOrDefaultAsync(p => p.Id == id);
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

            await _context.SaveChangesAsync();
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
