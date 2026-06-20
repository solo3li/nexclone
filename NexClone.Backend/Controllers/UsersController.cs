using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace NexClone.Backend.Controllers
{
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var users = await _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status == "active"))
                    .ThenInclude(s => s.Plan)
                .OrderByDescending(u => u.CreatedAt)
                .Take(100)
                .ToListAsync();

            return View(users);
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == id);
                
            if (user == null) return NotFound();

            ViewData["Title"] = $"User Details - {user.Email}";
            ViewBag.Plans = new SelectList(await _context.Plans.ToListAsync(), "Id", "Name");
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AssignPlan(Guid userId, int planId)
        {
            var user = await _context.Users.FindAsync(userId);
            var plan = await _context.Plans.FindAsync(planId);

            if (user == null || plan == null) return NotFound();

            // Cancel any existing active subscriptions
            var existingSubs = await _context.Subscriptions
                .Where(s => s.UserId == userId && s.Status == "active")
                .ToListAsync();

            foreach (var sub in existingSubs)
            {
                sub.Status = "canceled";
            }

            var newSub = new Subscription
            {
                UserId = userId,
                PlanId = planId,
                Status = "active",
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(plan.DurationDays),
                CreatedAt = DateTime.UtcNow
            };

            _context.Subscriptions.Add(newSub);
            
            // Optionally, top up user credits
            user.AvailableCredits += plan.MonthlyCredits;

            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpGet("seed")]
        public async Task<IActionResult> Seed([FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            // Seed Plans
            if (!await _context.Plans.AnyAsync(p => p.Name == "Free Plan"))
            {
                var toolsFree = new System.Collections.Generic.Dictionary<string, int> { { "text-to-voice", 150 } };
                _context.Plans.Add(new Plan { Name = "Free Plan", PriceUsd = 0, PriceEgp = 0, DurationDays = 30, MonthlyCredits = 500, AllowedTools = System.Text.Json.JsonSerializer.Serialize(toolsFree), CreatedAt = DateTime.UtcNow });
            }
            if (!await _context.Plans.AnyAsync(p => p.Name == "Basic Plan"))
            {
                var toolsBasic = new System.Collections.Generic.Dictionary<string, int> { { "text-to-voice", 500 } };
                _context.Plans.Add(new Plan { Name = "Basic Plan", PriceUsd = 10, PriceEgp = 500, DurationDays = 30, MonthlyCredits = 2000, AllowedTools = System.Text.Json.JsonSerializer.Serialize(toolsBasic), CreatedAt = DateTime.UtcNow });
            }
            if (!await _context.Plans.AnyAsync(p => p.Name == "Pro Plan"))
            {
                var toolsPro = new System.Collections.Generic.Dictionary<string, int> { { "text-to-voice", -1 } };
                _context.Plans.Add(new Plan { Name = "Pro Plan", PriceUsd = 30, PriceEgp = 1500, DurationDays = 30, MonthlyCredits = 10000, AllowedTools = System.Text.Json.JsonSerializer.Serialize(toolsPro), CreatedAt = DateTime.UtcNow });
            }
            await _context.SaveChangesAsync();

            // Seed Users
            string[] emails = { "user1@test.com", "user2@test.com", "user3@test.com" };
            foreach (var email in emails)
            {
                if (await userManager.FindByEmailAsync(email) == null)
                {
                    var user = new ApplicationUser { UserName = email, Email = email, FullName = email.Split('@')[0], EmailConfirmed = true };
                    await userManager.CreateAsync(user, "Password123!");
                }
            }

            return Content("Seeded");
        }
    }
}
