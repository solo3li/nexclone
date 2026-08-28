using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using ClosedXML.Excel;
using System.Text;

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

            var payments = await _context.Payments
                .Include(p => p.Plan)
                .Where(p => p.UserId == id)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            ViewData["Title"] = $"User Details - {user.Email}";
            ViewBag.Plans = new SelectList(await _context.Plans.Where(p => p.PriceUsd > 0 && !p.IsDefaultRegistrationPlan && !p.IsDeleted).ToListAsync(), "Id", "Name");

            ViewBag.Devices = devices;
            ViewBag.AffiliateReferral = affiliateReferral;
            ViewBag.Payments = payments;
            ViewBag.IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow;
            ViewBag.LockoutEnd = user.LockoutEnd;
            ViewBag.AccessFailedCount = user.AccessFailedCount;
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
        public async Task<IActionResult> AssignPlan(Guid userId, int planId, string currency,
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

                existingSub.StartDate = existingSub.StartDate;
                existingSub.EndDate = (existingSub.EndDate > DateTime.UtcNow ? existingSub.EndDate : DateTime.UtcNow).AddDays(plan.DurationDays);
                existingSub.Status = "active";
                newSub = existingSub;

                var otherStackedSubs = await _context.Subscriptions
                    .Where(s => s.UserId == userId && s.Id != existingSub.Id && (s.Status == "active" || s.Status == "freeze"))
                    .ToListAsync();
                foreach (var sub in otherStackedSubs)
                {
                    sub.Status = "canceled";
                }
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

                var competingSubs = await _context.Subscriptions
                    .Where(s => s.UserId == userId && (s.Status == "active" || s.Status == "freeze"))
                    .ToListAsync();
                foreach (var sub in competingSubs)
                {
                    sub.Status = "canceled";
                }

                newSub = new Subscription
                {
                    UserId = userId,
                    PlanId = planId,
                    Status = "active",
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(plan.DurationDays),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Subscriptions.Add(newSub);
            }

            await _context.SaveChangesAsync();
            await _walletService.DistributePlanCreditsAsync(user.Id, plan.Id, resetToZero: shouldReset, subscriptionId: newSub.Id);

            string resolvedCurrency = !string.IsNullOrWhiteSpace(currency) ? currency.ToUpper() : "EGP";
            decimal paymentAmount = resolvedCurrency == "USD" ? plan.PriceUsd : plan.PriceEgp;
            var payment = new Payment
            {
                UserId = user.Id,
                PlanId = plan.Id,
                SubscriptionId = newSub.Id,
                Amount = paymentAmount,
                Currency = resolvedCurrency,
                Method = "Manual/Admin",
                PaymentId = "ADMIN-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            try
            {
                var affiliateService = HttpContext.RequestServices.GetRequiredService<NexClone.Backend.Application.Services.AffiliateService>();
                await affiliateService.ProcessPaymentCommissionAsync(user.Id, payment.Id, payment.Amount, payment.Currency, plan.Id, newSub.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Affiliate] Commission for manual plan assignment failed: {ex.Message}");
            }


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
                byte[] pdfBytes = await invoiceService.GenerateInvoicePdfAsync(invoice);
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

            if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
            {
                TempData["Error"] = "Password must be at least 6 characters long.";
                return RedirectToAction(nameof(Details), new { id = userId });
            }

            if (await userManager.HasPasswordAsync(user))
            {
                var removeResult = await userManager.RemovePasswordAsync(user);
                if (!removeResult.Succeeded)
                {
                    TempData["Error"] = string.Join("<br/>", removeResult.Errors.Select(e => e.Description));
                    return RedirectToAction(nameof(Details), new { id = userId });
                }
            }

            var addResult = await userManager.AddPasswordAsync(user, newPassword);
            if (!addResult.Succeeded)
            {
                TempData["Error"] = string.Join("<br/>", addResult.Errors.Select(e => e.Description));
                return RedirectToAction(nameof(Details), new { id = userId });
            }

            await userManager.SetLockoutEndDateAsync(user, null);
            await userManager.ResetAccessFailedCountAsync(user);
            await userManager.UpdateSecurityStampAsync(user);
            await userManager.UpdateAsync(user);

            TempData["Success"] = "Password changed and account unlocked successfully.";
            return RedirectToAction(nameof(Details), new { id = userId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnlockUser(Guid userId, [FromServices] Microsoft.AspNetCore.Identity.UserManager<ApplicationUser> userManager)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null) return NotFound();

            await userManager.SetLockoutEndDateAsync(user, null);
            await userManager.ResetAccessFailedCountAsync(user);
            await userManager.UpdateSecurityStampAsync(user);

            TempData["Success"] = "User account has been unlocked and failed login attempts reset to 0.";
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
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,FullName,Email,PhoneNumber,Country,IsStaff,IsSuperAdmin,StandardCredits,PremiumCredits,IsVerified")] ApplicationUser updatedUser, List<string> visibleSections)
        {
            if (id != updatedUser.Id) return NotFound();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.UserName = updatedUser.Email;
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.Country = updatedUser.Country;
            user.IsStaff = updatedUser.IsStaff;
            user.IsSuperAdmin = updatedUser.IsSuperAdmin;
            user.IsVerified = updatedUser.IsVerified;
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
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    foreach (var user in users)
                    {
                        var blogComments = await _context.BlogComments
                            .Where(b => b.UserId == user.Id)
                            .ToListAsync();
                        if (blogComments.Any()) _context.BlogComments.RemoveRange(blogComments);

                        var ticketMessages = await _context.TicketMessages
                            .Where(m => m.SenderId == user.Id)
                            .ToListAsync();
                        if (ticketMessages.Any()) _context.TicketMessages.RemoveRange(ticketMessages);

                        _context.Users.Remove(user);
                        await _context.SaveChangesAsync();
                    }

                    await transaction.CommitAsync();
                    return Ok(new { deleted = users.Count });
                }
                catch (DbUpdateException)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(409, new
                    {
                        message = "Bulk delete cancelled: one or more selected users have records that prevent deletion (e.g. affiliate or commission ledger entries). No users were deleted."
                    });
                }
            }

            return Ok(new { deleted = 0 });
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

            sub.StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            sub.EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);
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

            referral.ClickedAt = DateTime.SpecifyKind(clickedAt, DateTimeKind.Utc);
            referral.AttributionExpiresAt = DateTime.SpecifyKind(expiresAt, DateTimeKind.Utc);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Affiliate tracking dates updated successfully.";
            return RedirectToAction(nameof(Details), new { id = referral.ReferredUserId });
        }

        private async Task<System.Collections.Generic.List<NexClone.Backend.Core.Entities.ApplicationUser>> GetFilteredUsersAsync(string searchString, int? planId)
        {
            var query = _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status == "active" && s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan))
                    .ThenInclude(s => s.Plan)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                searchString = searchString.ToLower();
                query = query.Where(u => 
                    u.Email.ToLower().Contains(searchString) || 
                    (u.PhoneNumber != null && u.PhoneNumber.Contains(searchString)) || 
                    u.Id.ToString().Contains(searchString));
            }

            if (planId.HasValue)
            {
                query = query.Where(u => u.Subscriptions.Any(s => s.Status == "active" && s.PlanId == planId.Value && s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan));
            }

            return await query.ToListAsync();
        }

        private string EscapeCsv(string str)
        {
            if (string.IsNullOrEmpty(str)) return "";
            str = str.Replace("\"", "\"\"");
            if (str.Contains(",") || str.Contains("\"") || str.Contains("\n") || str.Contains("\r"))
            {
                return $"\"{str}\"";
            }
            return str;
        }

        private string EscapeSql(string str)
        {
            if (string.IsNullOrEmpty(str)) return "";
            return str.Replace("'", "''");
        }

        [HttpGet]
        public async Task<IActionResult> ExportCsv(string searchString, int? planId)
        {
            var users = await GetFilteredUsersAsync(searchString, planId);
            var sb = new StringBuilder();
            sb.AppendLine("ID,Email,Phone,EmailConfirmed,IsVerified,TwoFactorEnabled,Country,TotalCredits,Role,JoinedDate,CurrentPlan");

            foreach (var u in users)
            {
                var currentSub = u.Subscriptions?.FirstOrDefault(s => s.Status == "active");
                var currentPlan = currentSub?.Plan?.Name ?? "No Active Paid Plan";
                var role = u.IsSuperAdmin ? "SuperAdmin" : (u.IsStaff ? "Staff" : "User");
                var totalCredits = u.StandardCredits + u.PremiumCredits;
                
                sb.AppendLine($"{u.Id},{EscapeCsv(u.Email)},{EscapeCsv(u.PhoneNumber)},{u.EmailConfirmed},{u.IsVerified},{u.TwoFactorEnabled},{EscapeCsv(u.Country)},{totalCredits},{EscapeCsv(role)},{u.CreatedAt:yyyy-MM-dd HH:mm:ss},{EscapeCsv(currentPlan)}");
            }

            return File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", "users_export.csv");
        }

        [HttpGet]
        public async Task<IActionResult> ExportExcel(string searchString, int? planId)
        {
            var users = await GetFilteredUsersAsync(searchString, planId);

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Users");
                
                worksheet.Cell(1, 1).Value = "ID";
                worksheet.Cell(1, 2).Value = "Email";
                worksheet.Cell(1, 3).Value = "Phone";
                worksheet.Cell(1, 4).Value = "Email Confirmed";
                worksheet.Cell(1, 5).Value = "Is Verified";
                worksheet.Cell(1, 6).Value = "Two Factor Enabled";
                worksheet.Cell(1, 7).Value = "Country";
                worksheet.Cell(1, 8).Value = "Total Credits";
                worksheet.Cell(1, 9).Value = "Role";
                worksheet.Cell(1, 10).Value = "Joined Date";
                worksheet.Cell(1, 11).Value = "Current Plan";

                var headerRow = worksheet.Row(1);
                headerRow.Style.Font.Bold = true;

                for (int i = 0; i < users.Count; i++)
                {
                    var u = users[i];
                    var currentSub = u.Subscriptions?.FirstOrDefault(s => s.Status == "active");
                    var currentPlan = currentSub?.Plan?.Name ?? "No Active Paid Plan";
                    var role = u.IsSuperAdmin ? "SuperAdmin" : (u.IsStaff ? "Staff" : "User");
                    var totalCredits = u.StandardCredits + u.PremiumCredits;

                    int row = i + 2;
                    worksheet.Cell(row, 1).Value = u.Id.ToString();
                    worksheet.Cell(row, 2).Value = u.Email;
                    worksheet.Cell(row, 3).Value = u.PhoneNumber;
                    worksheet.Cell(row, 4).Value = u.EmailConfirmed;
                    worksheet.Cell(row, 5).Value = u.IsVerified;
                    worksheet.Cell(row, 6).Value = u.TwoFactorEnabled;
                    worksheet.Cell(row, 7).Value = u.Country;
                    worksheet.Cell(row, 8).Value = totalCredits;
                    worksheet.Cell(row, 9).Value = role;
                    worksheet.Cell(row, 10).Value = u.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    worksheet.Cell(row, 11).Value = currentPlan;
                }

                worksheet.Columns().AdjustToContents();

                using (var stream = new System.IO.MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "users_export.xlsx");
                }
            }
        }

        [HttpGet]
        public async Task<IActionResult> ExportSql(string searchString, int? planId)
        {
            var users = await GetFilteredUsersAsync(searchString, planId);
            var sb = new StringBuilder();
            sb.AppendLine("-- Users Export SQL");
            sb.AppendLine("CREATE TABLE IF NOT EXISTS UsersExport (");
            sb.AppendLine("    Id VARCHAR(255),");
            sb.AppendLine("    Email VARCHAR(255),");
            sb.AppendLine("    Phone VARCHAR(255),");
            sb.AppendLine("    EmailConfirmed BOOLEAN,");
            sb.AppendLine("    IsVerified BOOLEAN,");
            sb.AppendLine("    TwoFactorEnabled BOOLEAN,");
            sb.AppendLine("    Country VARCHAR(255),");
            sb.AppendLine("    TotalCredits DECIMAL(18,2),");
            sb.AppendLine("    Role VARCHAR(255),");
            sb.AppendLine("    JoinedDate TIMESTAMP,");
            sb.AppendLine("    CurrentPlan VARCHAR(255)");
            sb.AppendLine(");");
            sb.AppendLine();

            foreach (var u in users)
            {
                var currentSub = u.Subscriptions?.FirstOrDefault(s => s.Status == "active");
                var currentPlan = currentSub?.Plan?.Name ?? "No Active Paid Plan";
                var userRole = u.IsSuperAdmin ? "SuperAdmin" : (u.IsStaff ? "Staff" : "User");
                var totalCredits = u.StandardCredits + u.PremiumCredits;
                
                var email = EscapeSql(u.Email);
                var phone = EscapeSql(u.PhoneNumber);
                var country = EscapeSql(u.Country);
                var role = EscapeSql(userRole);
                var plan = EscapeSql(currentPlan);

                sb.AppendLine($"INSERT INTO UsersExport (Id, Email, Phone, EmailConfirmed, IsVerified, TwoFactorEnabled, Country, TotalCredits, Role, JoinedDate, CurrentPlan) VALUES ('{u.Id}', '{email}', '{phone}', {(u.EmailConfirmed ? "true" : "false")}, {(u.IsVerified ? "true" : "false")}, {(u.TwoFactorEnabled ? "true" : "false")}, '{country}', {totalCredits}, '{role}', '{u.CreatedAt:yyyy-MM-dd HH:mm:ss}', '{plan}');");
            }

            return File(Encoding.UTF8.GetBytes(sb.ToString()), "application/sql", "users_export.sql");
        }
    }
}
