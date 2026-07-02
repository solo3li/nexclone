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

        public async Task<IActionResult> Index(int? planId, string status, string datePeriod, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan)
                .AsQueryable();

            if (planId.HasValue)
            {
                query = query.Where(s => s.PlanId == planId.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(s => s.Status.ToLower() == status.ToLower());
            }

            if (!string.IsNullOrEmpty(datePeriod))
            {
                var now = DateTime.UtcNow;
                if (datePeriod == "last7days")
                {
                    var date = now.AddDays(-7);
                    query = query.Where(s => s.CreatedAt >= date);
                }
                else if (datePeriod == "last30days")
                {
                    var date = now.AddDays(-30);
                    query = query.Where(s => s.CreatedAt >= date);
                }
                else if (datePeriod == "last90days")
                {
                    var date = now.AddDays(-90);
                    query = query.Where(s => s.CreatedAt >= date);
                }
                else if (datePeriod == "custom")
                {
                    if (startDate.HasValue)
                        query = query.Where(s => s.CreatedAt >= startDate.Value.ToUniversalTime());
                    if (endDate.HasValue)
                        query = query.Where(s => s.CreatedAt <= endDate.Value.ToUniversalTime().AddDays(1).AddTicks(-1));
                }
            }

            var subscriptions = await query.OrderByDescending(s => s.CreatedAt).ToListAsync();

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
            ViewBag.Plans = await _context.Plans.ToListAsync();
            
            // Preserve filter selections in ViewBag
            ViewBag.SelectedPlanId = planId;
            ViewBag.SelectedStatus = status;
            ViewBag.SelectedDatePeriod = datePeriod;
            ViewBag.SelectedStartDate = startDate?.ToString("yyyy-MM-dd");
            ViewBag.SelectedEndDate = endDate?.ToString("yyyy-MM-dd");

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
            var sub = await _context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sub != null)
            {
                try 
                {
                    // PostgreSQL requires DateTimeKind.Utc
                    var utcEndDate = DateTime.SpecifyKind(newEndDate, DateTimeKind.Utc);
                    sub.EndDate = utcEndDate;
                    
                    // If the new end date is in the past, calculate freeze/expired status
                    if (utcEndDate <= DateTime.UtcNow)
                    {
                        var freezeEndDate = utcEndDate.AddDays(sub.Plan.GracePeriodDays);
                        if (DateTime.UtcNow <= freezeEndDate)
                        {
                            sub.Status = "freeze";
                        }
                        else
                        {
                            sub.Status = "expired";
                            if (sub.User != null)
                            {
                                sub.User.AvailableCredits = 0;
                            }
                        }
                    }
                    else
                    {
                        sub.Status = "active";
                    }

                    _context.Subscriptions.Update(sub);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Subscription end date updated successfully.";
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] = "Failed to update subscription end date: " + ex.Message;
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
