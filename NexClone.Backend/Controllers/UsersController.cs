using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;
using System.Linq;
using NexClone.Backend.Services;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;

        public UsersController(ApplicationDbContext context, IEmailService emailService, IEmailTemplateService emailTemplateService)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
        }

        public async Task<IActionResult> Index(string searchString, int? planId, int pageNumber = 1)
        {
            int pageSize = 20;
            if (pageNumber < 1) pageNumber = 1;

            var query = _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status == "active" && s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan))
                    .ThenInclude(s => s.Plan)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                searchString = searchString.ToLower();
                query = query.Where(u => 
                    u.Email.ToLower().Contains(searchString) || 
                    u.PhoneNumber.Contains(searchString) || 
                    u.Id.ToString().Contains(searchString));
            }

            if (planId.HasValue)
            {
                query = query.Where(u => u.Subscriptions.Any(s => s.Status == "active" && s.PlanId == planId.Value && s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan));
            }

            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.Plans = new SelectList(await _context.Plans.Where(p => p.PriceUsd > 0 && !p.IsDefaultRegistrationPlan).ToListAsync(), "Id", "Name");
            ViewBag.CurrentSearch = searchString;
            ViewBag.CurrentPlanId = planId;
            ViewBag.PageNumber = pageNumber;
            ViewBag.TotalPages = totalPages;

            return View(users);
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan))
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == id);
                
            if (user == null) return NotFound();

            var devices = await _context.DeviceFingerprints
                .Where(d => d.UserId == id)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            ViewData["Title"] = $"User Details - {user.Email}";
            ViewBag.Plans = new SelectList(await _context.Plans.Where(p => p.PriceUsd > 0 && !p.IsDefaultRegistrationPlan).ToListAsync(), "Id", "Name");
            ViewBag.Devices = devices;
            return View(user);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string email, string fullName, string password, [FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                ModelState.AddModelError("", "Email and Password are required.");
                return View();
            }

            var user = new ApplicationUser 
            { 
                UserName = email, 
                Email = email, 
                FullName = fullName,
                CreatedAt = DateTime.UtcNow,
                IsVerified = true,
                AvailableCredits = 0
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                var targetPlan = await _context.Plans.FirstOrDefaultAsync(p => p.IsDefaultRegistrationPlan) 
                              ?? await _context.Plans.FirstOrDefaultAsync(p => p.IsFreeTrial);

                if (targetPlan != null)
                {
                    user.AvailableCredits = targetPlan.MonthlyCredits;
                    var sub = new Subscription
                    {
                        UserId = user.Id,
                        PlanId = targetPlan.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddDays(targetPlan.DurationDays),
                        Status = "Active"
                    };
                    _context.Subscriptions.Add(sub);
                    await _context.SaveChangesAsync();

                    try
                    {
                        if (!string.IsNullOrEmpty(user.Email))
                        {
                            var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                                user.FullName ?? user.Email,
                                targetPlan.NameAr ?? targetPlan.Name,
                                sub.StartDate,
                                sub.EndDate,
                                targetPlan.MonthlyCredits,
                                0m);
                            
                            await _emailService.SendEmailAsync(user.Email, user.FullName ?? "", "تم تفعيل اشتراكك بنجاح - NexMedia AI", htmlBody);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to send plan assignment email (Create): " + ex.Message);
                    }
                }

                return RedirectToAction(nameof(Index));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AssignPlan(Guid userId, int planId)
        {
            var user = await _context.Users.FindAsync(userId);
            var plan = await _context.Plans.FindAsync(planId);

            if (user == null || plan == null) return NotFound();

            // Cancel any existing active subscriptions
            var activeSubscriptions = await _context.Subscriptions
                .Where(s => s.UserId == userId && (s.Status == "active" || s.Status == "active"))
                .ToListAsync();

            foreach (var sub in activeSubscriptions)
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
            
            var latestSubForCredits = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefaultAsync();

            if (latestSubForCredits != null && latestSubForCredits.EndDate < DateTime.UtcNow)
            {
                var graceEnds = latestSubForCredits.EndDate.AddDays(latestSubForCredits.Plan.GracePeriodDays);
                if (DateTime.UtcNow > graceEnds)
                {
                    user.AvailableCredits = 0;
                }
            }

            // Optionally, top up user credits
            user.AvailableCredits += plan.MonthlyCredits;

            await _context.SaveChangesAsync();

            // Send Email Receipt
            try
            {
                if (!string.IsNullOrEmpty(user.Email))
                {
                    var htmlBody = _emailTemplateService.GetSubscriptionReceiptEmail(
                        user.FullName ?? user.Email,
                        plan.NameAr ?? plan.Name,
                        newSub.StartDate,
                        newSub.EndDate,
                        plan.MonthlyCredits,
                        0m);
                    
                    await _emailService.SendEmailAsync(user.Email, user.FullName ?? "", "تم تفعيل اشتراكك بنجاح - NexMedia AI", htmlBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send plan assignment email: " + ex.Message);
            }

            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpPost]
        public async Task<IActionResult> AdjustCredits(Guid userId, decimal amount, string operation)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (operation == "add")
            {
                user.AvailableCredits += amount;
            }
            else if (operation == "remove")
            {
                user.AvailableCredits -= amount;
                if (user.AvailableCredits < 0) user.AvailableCredits = 0;
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ExtendSubscription(Guid userId, int extraDays)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var activeSub = await _context.Subscriptions
                .Where(s => s.UserId == userId && (s.Status == "active" || s.Status == "active"))
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefaultAsync();

            if (activeSub == null)
            {
                activeSub = await _context.Subscriptions
                    .Where(s => s.UserId == userId)
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefaultAsync();
            }

            if (activeSub != null)
            {
                activeSub.EndDate = activeSub.EndDate.AddDays(extraDays);
                if (activeSub.EndDate > DateTime.UtcNow)
                {
                    activeSub.Status = "Active";
                }
                await _context.SaveChangesAsync();
                TempData["Success"] = $"Extended subscription by {extraDays} days.";
            }
            else
            {
                TempData["Error"] = "User has no subscriptions to extend. Please assign a plan first.";
            }

            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(Guid userId, string newPassword, [FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null) return NotFound();

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
            {
                // In a real app we'd show errors, but for simplicity we'll just redirect back.
                // Could use TempData to show error message
            }

            return RedirectToAction(nameof(Details), new { id = userId });
        }
        [HttpGet]
        public async Task<IActionResult> Edit(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,FullName,Email,PhoneNumber,Country,IsStaff")] ApplicationUser updatedUser)
        {
            if (id != updatedUser.Id) return NotFound();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.UserName = updatedUser.Email; // Keep UserName sync
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.Country = updatedUser.Country;
            user.IsStaff = updatedUser.IsStaff;

            try
            {
                _context.Update(user);
                await _context.SaveChangesAsync();
                TempData["Success"] = "User details updated successfully.";
                return RedirectToAction(nameof(Details), new { id = user.Id });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(user.Id)) return NotFound();
                else throw;
            }
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                var blogComments = await _context.BlogComments.Where(b => b.UserId == id).ToListAsync();
                if (blogComments.Any()) _context.BlogComments.RemoveRange(blogComments);

                var ticketMessages = await _context.TicketMessages.Where(m => m.SenderId == id).ToListAsync();
                if (ticketMessages.Any()) _context.TicketMessages.RemoveRange(ticketMessages);

                _context.Users.Remove(user);
                
                try
                {
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "User deleted successfully.";
                }
                catch (Exception ex)
                {
                    TempData["Error"] = "Could not delete user because they have associated records that prevent deletion. " + (ex.InnerException?.Message ?? ex.Message);
                }
            }
            return RedirectToAction(nameof(Index));
        }
        [HttpGet("seed")]
        public async Task<IActionResult> Seed([FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            // Seed Plans
            if (!await _context.Plans.AnyAsync(p => p.Name == "Free Tier"))
            {
                _context.Plans.Add(new Plan { 
                    Name = "Free Tier", 
                    NameAr = "الباقة المجانية",
                    Description = "Get started with limited features.",
                    DescriptionAr = "ابدأ بخصائص محدودة.",
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
                    NameAr = "الباقة الاحترافية",
                    Description = "Best for professionals and creators.",
                    DescriptionAr = "الأفضل للمحترفين وصناع المحتوى.",
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
                    NameAr = "باقة الشركات",
                    Description = "Unlimited access for heavy users and teams.",
                    DescriptionAr = "وصول غير محدود للمستخدمين بكثافة والفرق.",
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
