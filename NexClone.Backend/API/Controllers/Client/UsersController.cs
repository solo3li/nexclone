using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;

namespace NexClone.Backend.API.Controllers.Client
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly WalletService _walletService;
        private readonly IWebHostEnvironment _env;

        public UsersController(
            ApplicationDbContext context, 
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            WalletService walletService,
            IWebHostEnvironment env)
        {
            _context = context;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _walletService = walletService;
            _env = env;
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

            ViewBag.Plans = new SelectList(await _context.Plans.Where(p => p.PriceUsd > 0 && !p.IsDefaultRegistrationPlan && !p.IsDeleted).ToListAsync(), "Id", "Name");

            ViewBag.CurrentSearch = searchString;
            ViewBag.CurrentPlanId = planId;
            ViewBag.PageNumber = pageNumber;
            ViewBag.TotalPages = totalPages;

            return View(users);
        }

        public async Task<IActionResult> Details(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Payments)
                .FirstOrDefaultAsync(u => u.Id == id);
                
            if (user == null) return NotFound();

            var devices = await _context.DeviceFingerprints
                .Where(d => d.UserId == id)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            var affiliateReferral = await _context.AffiliateReferrals
                .Include(r => r.AffiliateProfile)
                .ThenInclude(ap => ap.User)
                .FirstOrDefaultAsync(r => r.ReferredUserId == id);

            ViewData["Title"] = $"User Details - {user.Email}";
            ViewBag.Plans = new SelectList(await _context.Plans.Where(p => p.PriceUsd > 0 && !p.IsDefaultRegistrationPlan && !p.IsDeleted).ToListAsync(), "Id", "Name");

            ViewBag.Devices = devices;
            ViewBag.AffiliateReferral = affiliateReferral;
            return View(user);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string email, string fullName, string password, bool isStaff, bool isSuperAdmin, List<string> visibleSections, [FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
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
                IsStaff = isStaff,
                IsSuperAdmin = isSuperAdmin,
                VisibleAdminSections = string.Join(",", visibleSections ?? new List<string>())
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                var targetPlan = await _context.Plans.FirstOrDefaultAsync(p => p.IsDefaultRegistrationPlan && !p.IsDeleted) 
                              ?? await _context.Plans.FirstOrDefaultAsync(p => p.IsFreeTrial && !p.IsDeleted);

                if (targetPlan != null)
                {
                    var sub = new Subscription
                    {
                        UserId = user.Id,
                        PlanId = targetPlan.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddDays(targetPlan.DurationDays),
                        Status = "active"
                    };
                    _context.Subscriptions.Add(sub);
                    await _context.SaveChangesAsync();

                    await _walletService.DistributePlanCreditsAsync(user.Id, targetPlan.Id, resetToZero: true, subscriptionId: sub.Id);

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
                                targetPlan.PriceEgp);
                            
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
        public async Task<IActionResult> AssignPlan(Guid userId, int planId,
            decimal? affiliateFirstCommissionPercent,
            decimal? affiliateRecurringCommissionPercent,
            DateTime? startDate,
            DateTime? endDate,
            [FromServices] NexClone.Backend.Infrastructure.ExternalServices.Invoicing.IInvoiceGeneratorService invoiceService,
            [FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var user = await _context.Users.FindAsync(userId);
            var plan = await _context.Plans.FindAsync(planId);

            if (user == null || plan == null) return NotFound();

            var existingSub = await _context.Subscriptions
                .Include(s => s.Plan)
                .FirstOrDefaultAsync(s => s.UserId == userId && s.PlanId == planId && (s.Status == "active" || s.Status == "freeze"));

            Subscription newSub = null;
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

                existingSub.StartDate = startDate ?? existingSub.StartDate;
                existingSub.EndDate = endDate ?? (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(plan.DurationDays);
                existingSub.Status = "active";
                newSub = existingSub;
            }
            else
            {
                var latestSubForCredits = await _context.Subscriptions
                    .Include(s => s.Plan)
                    .Where(s => s.UserId == user.Id && (s.Status == "active" || s.Status == "freeze"))
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefaultAsync();

                if (latestSubForCredits != null && latestSubForCredits.EndDate < DateTime.UtcNow)
                {
                    var graceEnds = latestSubForCredits.EndDate.AddDays(latestSubForCredits.Plan.GracePeriodDays);
                    if (DateTime.UtcNow > graceEnds)
                    {
                        shouldReset = true;
                    }
                }


                newSub = new Subscription
                {
                    UserId = userId,
                    PlanId = planId,
                    Status = "active",
                    StartDate = startDate ?? DateTime.UtcNow,
                    EndDate = endDate ?? (startDate ?? DateTime.UtcNow).AddDays(plan.DurationDays),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Subscriptions.Add(newSub);
            }

            await _context.SaveChangesAsync();
            await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset, subscriptionId: newSub.Id);

            // Record Payment for Admin assignment
            var payment = new Payment
            {
                UserId = user.Id,
                PlanId = plan.Id,
                SubscriptionId = newSub.Id,
                Amount = plan.PriceEgp, // Or USD depending on standard, using EGP for invoice fallback
                Currency = "EGP",
                Method = "Manual/Admin",
                PaymentId = "ADMIN-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();


            // Affiliate Commission Override — store overrides keyed by PaymentId so AffiliateService can pick them up
            if (affiliateFirstCommissionPercent.HasValue || affiliateRecurringCommissionPercent.HasValue)
            {
                try
                {
                    decimal? firstPct = affiliateFirstCommissionPercent.HasValue
                        ? Math.Max(0, Math.Min(100, affiliateFirstCommissionPercent.Value))
                        : (decimal?)null;
                    decimal? recurringPct = affiliateRecurringCommissionPercent.HasValue
                        ? Math.Max(0, Math.Min(100, affiliateRecurringCommissionPercent.Value))
                        : (decimal?)null;

                    var affiliateService = HttpContext.RequestServices.GetRequiredService<NexClone.Backend.Application.Services.AffiliateService>();
                    await affiliateService.ProcessPaymentCommissionAsync(user.Id, payment.Id, payment.Amount, payment.Currency, plan.Id, newSub.Id, firstPct, recurringPct);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Affiliate] Commission override failed: {ex.Message}");
                }
            }
            else
            {
                // No override — trigger with plan defaults
                try
                {
                    var affiliateService = HttpContext.RequestServices.GetRequiredService<NexClone.Backend.Application.Services.AffiliateService>();
                    await affiliateService.ProcessPaymentCommissionAsync(user.Id, payment.Id, payment.Amount, payment.Currency, plan.Id, newSub.Id);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Affiliate] Commission for manual plan assignment failed: {ex.Message}");
                }
            }


            // Generate Invoice
            string verifyUrlBase = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL")
                                   ?? Environment.GetEnvironmentVariable("NEXT_PUBLIC_API_URL")?.Replace("/api", "")
                                   ?? "https://nexmediaai.com";
            decimal amountEgp = plan.PriceEgp;
            decimal fixedFee = plan.FixedFeeEgp;
            decimal taxAmt = (amountEgp + fixedFee) * (plan.TaxPercentageEgp / 100m);
            decimal subTotal = amountEgp - taxAmt - fixedFee;

            var invoice = new Invoice
            {
                InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                SubscriptionId = newSub.Id,
                UserId = user.Id,
                PaymentGateway = "Admin Assigned",
                PaymentMethod = "Manual",
                Currency = "EGP",
                SubTotal = subTotal,
                TaxAmount = taxAmt,
                FixedFeeAmount = fixedFee,
                TotalAmount = amountEgp,
                TransactionId = payment.PaymentId,
                Subscription = newSub
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
                Console.WriteLine("Failed to generate/upload admin invoice PDF: " + ex.Message);
            }

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
                        plan.PriceEgp);

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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AdjustCredits(Guid userId, decimal amount, string operation)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (operation == "add")
            {
                user.StandardCredits += amount;
            }
            else if (operation == "remove")
            {
                user.StandardCredits -= amount;
                if (user.StandardCredits < 0) user.StandardCredits = 0;
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
                .Where(s => s.UserId == userId && (s.Status == "active" || s.Status == "freeze"))
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
                    activeSub.Status = "active";
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
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,FullName,Email,PhoneNumber,Country,IsStaff,IsSuperAdmin,StandardCredits,PremiumCredits")] ApplicationUser updatedUser, List<string> visibleSections)
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
            user.IsSuperAdmin = updatedUser.IsSuperAdmin;
            user.StandardCredits = updatedUser.StandardCredits;
            user.PremiumCredits = updatedUser.PremiumCredits;
            user.VisibleAdminSections = string.Join(",", visibleSections ?? new List<string>());

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

        [HttpPost]
        public async Task<IActionResult> BulkDelete([FromBody] List<Guid> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No users selected.");
            }

            var users = await _context.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
            
            if (users.Any())
            {
                var userIds = users.Select(u => u.Id).ToList();

                var blogComments = await _context.BlogComments.Where(b => b.UserId.HasValue && userIds.Contains(b.UserId.Value)).ToListAsync();
                if (blogComments.Any()) _context.BlogComments.RemoveRange(blogComments);

                var ticketMessages = await _context.TicketMessages.Where(m => m.SenderId.HasValue && userIds.Contains(m.SenderId.Value)).ToListAsync();
                if (ticketMessages.Any()) _context.TicketMessages.RemoveRange(ticketMessages);

                _context.Users.RemoveRange(users);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return StatusCode(500, "Could not delete some users because of associated records.");
                }
            }

            return Ok();
        }
        [HttpGet("seed")]
        public async Task<IActionResult> Seed([FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            // SECURITY: This endpoint is only available in Development environment
            if (!_env.IsDevelopment())
            {
                return NotFound();
            }
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCreditAmount(Guid userId, string creditType, decimal amount)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (creditType == "Premium")
            {
                user.PremiumCredits += amount;
            }
            else
            {
                user.StandardCredits += amount;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateSubscriptionDates(int subscriptionId, DateTime startDate, DateTime endDate)
        {
            var sub = await _context.Subscriptions.FindAsync(subscriptionId);
            if (sub == null) return NotFound();

            sub.StartDate = startDate;
            sub.EndDate = endDate;
            await _context.SaveChangesAsync();

            TempData["Success"] = "Subscription dates updated successfully.";
            return RedirectToAction(nameof(Details), new { id = sub.UserId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateAffiliateTrackingDates(int referralId, DateTime clickedAt, DateTime expiresAt)
        {
            var referral = await _context.AffiliateReferrals.FindAsync(referralId);
            if (referral == null) return NotFound();

            referral.ClickedAt = clickedAt;
            referral.AttributionExpiresAt = expiresAt;
            await _context.SaveChangesAsync();

            TempData["Success"] = "Affiliate tracking dates updated successfully.";
            return RedirectToAction(nameof(Details), new { id = referral.ReferredUserId });
        }
    }
}
