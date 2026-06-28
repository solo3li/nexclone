using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class SubscriptionsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SubscriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var subscriptions = await _context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            var userIds = subscriptions.Select(s => s.UserId).Distinct().ToList();

            var lastUsedDates = new Dictionary<Guid, DateTime?>();
            
            foreach (var uid in userIds)
            {
                var lastGen = await _context.GenerationHistories
                    .Where(g => g.UserId == uid)
                    .OrderByDescending(g => g.CreatedAt)
                    .Select(g => (DateTime?)g.CreatedAt)
                    .FirstOrDefaultAsync();
                
                lastUsedDates[uid] = lastGen;
            }

            ViewBag.LastUsedDates = lastUsedDates;

            return View(subscriptions);
        }

        public async Task<IActionResult> Details(int id)
        {
            var subscription = await _context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (subscription == null)
            {
                TempData["ErrorMessage"] = "Subscription not found.";
                return RedirectToAction(nameof(Index));
            }

            var history = await _context.GenerationHistories
                .Where(g => g.UserId == subscription.UserId)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            ViewBag.History = history;

            return View(subscription);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateEndDate(int id, DateTime newEndDate)
        {
            var sub = await _context.Subscriptions.FindAsync(id);
            if (sub != null)
            {
                try 
                {
                    // PostgreSQL requires DateTimeKind.Utc
                    var utcEndDate = DateTime.SpecifyKind(newEndDate, DateTimeKind.Utc);
                    sub.EndDate = utcEndDate;
                    // If the new end date is in the past, update the status to expired
                    if (utcEndDate <= DateTime.UtcNow)
                    {
                        sub.Status = "expired";
                    }
                    else if (sub.Status == "expired")
                    {
                        sub.Status = "active";
                    }

                    _context.Subscriptions.Update(sub);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Subscription end date updated successfully.";
                }
                catch (Exception)
                {
                    TempData["ErrorMessage"] = "Failed to update subscription end date.";
                }
            }
            else 
            {
                TempData["ErrorMessage"] = "Subscription not found.";
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var sub = await _context.Subscriptions.FindAsync(id);
            if (sub != null)
            {
                try 
                {
                    _context.Subscriptions.Remove(sub);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Subscription deleted successfully.";
                }
                catch (Exception)
                {
                    TempData["ErrorMessage"] = "Failed to delete subscription.";
                }
            }
            else 
            {
                TempData["ErrorMessage"] = "Subscription not found.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
