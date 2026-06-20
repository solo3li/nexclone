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
            if (!await _context.Plans.AnyAsync(p => p.Name == "Free Tier"))
            {
                _context.Plans.Add(new Plan { 
                    Name = "Free Tier", 
                    PriceUsd = 0, PriceEgp = 0, 
                    DurationDays = 30, MonthlyCredits = 50, 
                    TtsEnabled = true, TtsMaxCharsPerRequest = 250, TtsCostPerChar = 0.01m,
                    SttEnabled = true, SttMaxFileSizeMb = 5, SttCostPerMinute = 1.0m,
                    IsFreeTrial = true,
                    CreatedAt = DateTime.UtcNow 
                });
            }
            if (!await _context.Plans.AnyAsync(p => p.Name == "Pro Tier"))
            {
                _context.Plans.Add(new Plan { 
                    Name = "Pro Tier", 
                    PriceUsd = 15, PriceEgp = 750, 
                    DurationDays = 30, MonthlyCredits = 2500, 
                    TtsEnabled = true, TtsMaxCharsPerRequest = 2000, TtsCostPerChar = 0.005m,
                    SttEnabled = true, SttMaxFileSizeMb = 25, SttCostPerMinute = 0.5m,
                    IsFreeTrial = false,
                    CreatedAt = DateTime.UtcNow 
                });
            }
            if (!await _context.Plans.AnyAsync(p => p.Name == "Enterprise Tier"))
            {
                _context.Plans.Add(new Plan { 
                    Name = "Enterprise Tier", 
                    PriceUsd = 49, PriceEgp = 2450, 
                    DurationDays = 30, MonthlyCredits = 10000, 
                    TtsEnabled = true, TtsMaxCharsPerRequest = -1, TtsCostPerChar = 0.002m,
                    SttEnabled = true, SttMaxFileSizeMb = -1, SttCostPerMinute = 0.2m,
                    IsFreeTrial = false,
                    CreatedAt = DateTime.UtcNow 
                });
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
