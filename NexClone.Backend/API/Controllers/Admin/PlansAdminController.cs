using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using NexClone.Backend.Core.Entities;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class PlansAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly NexClone.Backend.Core.Interfaces.ITtsCatalogService _ttsCatalog;

        public PlansAdminController(ApplicationDbContext context, NexClone.Backend.Core.Interfaces.ITtsCatalogService ttsCatalog)
        {
            _context = context;
            _ttsCatalog = ttsCatalog;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Subscription Plans Management";
            var plans = await _context.Plans.Where(p => !p.IsDeleted).OrderBy(p => p.Id).ToListAsync();
            return View(plans);
        }

        [AllowAnonymous]
        [HttpGet("seed-test-plans")]
        public async Task<IActionResult> SeedTestPlans()
        {
            var plans = new List<Plan>
            {
                new Plan
                {
                    Name = "Basic Monthly", NameAr = "أساسي شهري",
                    DurationDays = 30, PriceUsd = 10, PriceEgp = 500,
                    AffiliateFirstCommissionType = "Percentage", AffiliateFirstCommissionValueUsd = 20, AffiliateFirstCommissionValueEgp = 20,
                    AffiliateRecurringCommissionType = "Percentage", AffiliateRecurringCommissionValueUsd = 10, AffiliateRecurringCommissionValueEgp = 10,
                    MonthlyCredits = 100, StandardCredits = 100, PremiumCredits = 10
                },
                new Plan
                {
                    Name = "Pro Quarterly", NameAr = "احترافي ربع سنوي",
                    DurationDays = 90, PriceUsd = 25, PriceEgp = 1200,
                    AffiliateFirstCommissionType = "Fixed", AffiliateFirstCommissionValueUsd = 10, AffiliateFirstCommissionValueEgp = 400,
                    AffiliateRecurringCommissionType = "Percentage", AffiliateRecurringCommissionValueUsd = 15, AffiliateRecurringCommissionValueEgp = 15,
                    MonthlyCredits = 350, StandardCredits = 350, PremiumCredits = 40
                },
                new Plan
                {
                    Name = "Elite Semi-Annual", NameAr = "نخبة نصف سنوي",
                    DurationDays = 180, PriceUsd = 45, PriceEgp = 2200,
                    AffiliateFirstCommissionType = "Fixed", AffiliateFirstCommissionValueUsd = 20, AffiliateFirstCommissionValueEgp = 900,
                    AffiliateRecurringCommissionType = "Fixed", AffiliateRecurringCommissionValueUsd = 5, AffiliateRecurringCommissionValueEgp = 250,
                    MonthlyCredits = 800, StandardCredits = 800, PremiumCredits = 100
                },
                new Plan
                {
                    Name = "Ultimate Annual", NameAr = "ألتيميت سنوي",
                    DurationDays = 365, PriceUsd = 80, PriceEgp = 4000,
                    AffiliateFirstCommissionType = "Fixed", AffiliateFirstCommissionValueUsd = 40, AffiliateFirstCommissionValueEgp = 1800,
                    AffiliateRecurringCommissionType = "Fixed", AffiliateRecurringCommissionValueUsd = 10, AffiliateRecurringCommissionValueEgp = 500,
                    MonthlyCredits = 2000, StandardCredits = 2000, PremiumCredits = 300
                }
            };
            
            _context.Plans.AddRange(plans);
            await _context.SaveChangesAsync();
            return Ok("Seeded 4 test plans successfully with advanced affiliate settings.");
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Create Plan";
            ViewBag.AllVoices = _ttsCatalog.GetAllVoices(includeInactive: false).ToList();
            return View(new Plan());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Plan plan, [FromForm] List<string> selectedVoices)
        {
            // Set defaults for missing fields from the form
            if (string.IsNullOrEmpty(plan.NameAr)) plan.NameAr = plan.Name;
            
            if (plan.FixedFeeUsd > 0) plan.TaxPercentageUsd = 0;
            if (plan.TaxPercentageUsd > 0) plan.FixedFeeUsd = 0;
            
            if (plan.FixedFeeEgp > 0) plan.TaxPercentageEgp = 0;
            if (plan.TaxPercentageEgp > 0) plan.FixedFeeEgp = 0;
            
            if (selectedVoices != null && selectedVoices.Any())
            {
                plan.AllowedVoices = string.Join(",", selectedVoices);
            }

            if (plan.IsDefaultRegistrationPlan)
            {
                var otherDefaults = await _context.Plans.Where(p => p.IsDefaultRegistrationPlan).ToListAsync();
                foreach(var p in otherDefaults) p.IsDefaultRegistrationPlan = false;
            }

            _context.Add(plan);
            await _context.SaveChangesAsync();
            
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var plan = await _context.Plans.FindAsync(id);
            if (plan == null) return NotFound();

            ViewData["Title"] = $"Edit Plan - {plan.Name}";
            ViewBag.AllVoices = _ttsCatalog.GetAllVoices(includeInactive: false).ToList();
            return View(plan);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Plan plan, [FromForm] List<string> selectedVoices)
        {
            if (id != plan.Id) return NotFound();

            // We do not check ModelState.IsValid here for the entire object because we know some properties (like NameAr, Description) 
            // are missing from the Edit form and will fail validation.
            // We just fetch the existing and update.
            var existingPlan = await _context.Plans.FindAsync(id);
            if (existingPlan == null) return NotFound();

            try
            {
                existingPlan.Name = plan.Name;
                existingPlan.NameAr = plan.NameAr;
                existingPlan.Description = plan.Description;
                existingPlan.DescriptionAr = plan.DescriptionAr;
                existingPlan.Features = plan.Features;
                existingPlan.FeaturesAr = plan.FeaturesAr;
                existingPlan.DurationDays = plan.DurationDays;
                existingPlan.GracePeriodDays = plan.GracePeriodDays;
                existingPlan.PriceUsd = plan.PriceUsd;
                existingPlan.PriceEgp = plan.PriceEgp;
                existingPlan.MonthlyCredits = plan.MonthlyCredits;
                existingPlan.StandardCredits = plan.StandardCredits;
                existingPlan.PremiumCredits = plan.PremiumCredits;

                if (plan.FixedFeeUsd > 0) plan.TaxPercentageUsd = 0;
                if (plan.TaxPercentageUsd > 0) plan.FixedFeeUsd = 0;
                if (plan.FixedFeeEgp > 0) plan.TaxPercentageEgp = 0;
                if (plan.TaxPercentageEgp > 0) plan.FixedFeeEgp = 0;

                existingPlan.TaxPercentageUsd = plan.TaxPercentageUsd;
                existingPlan.TaxPercentageEgp = plan.TaxPercentageEgp;
                existingPlan.FixedFeeUsd = plan.FixedFeeUsd;
                existingPlan.FixedFeeEgp = plan.FixedFeeEgp;

                existingPlan.TtsEnabled = plan.TtsEnabled;
                existingPlan.SttEnabled = plan.SttEnabled;
                existingPlan.AvatarVideoEnabled = plan.AvatarVideoEnabled;
                existingPlan.TextToVideoEnabled = plan.TextToVideoEnabled;
                existingPlan.ImageToVideoEnabled = plan.ImageToVideoEnabled;
                existingPlan.ReferenceToVideoEnabled = plan.ReferenceToVideoEnabled;
                existingPlan.TextToImageEnabled = plan.TextToImageEnabled;
                existingPlan.LipSyncEnabled = plan.LipSyncEnabled;
                existingPlan.MotionControlEnabled = plan.MotionControlEnabled;

                existingPlan.IsFreeTrial = plan.IsFreeTrial;
                
                existingPlan.AffiliateFirstCommissionType = plan.AffiliateFirstCommissionType;
                existingPlan.AffiliateFirstCommissionValueUsd = plan.AffiliateFirstCommissionValueUsd;
                existingPlan.AffiliateFirstCommissionValueEgp = plan.AffiliateFirstCommissionValueEgp;
                
                existingPlan.AffiliateRecurringCommissionType = plan.AffiliateRecurringCommissionType;
                existingPlan.AffiliateRecurringCommissionValueUsd = plan.AffiliateRecurringCommissionValueUsd;
                existingPlan.AffiliateRecurringCommissionValueEgp = plan.AffiliateRecurringCommissionValueEgp;
                
                existingPlan.IsDefaultRegistrationPlan = plan.IsDefaultRegistrationPlan;
                if (existingPlan.IsDefaultRegistrationPlan)
                {
                    var otherDefaults = await _context.Plans.Where(p => p.IsDefaultRegistrationPlan && p.Id != existingPlan.Id).ToListAsync();
                    foreach (var p in otherDefaults) p.IsDefaultRegistrationPlan = false;
                }

                if (selectedVoices != null && selectedVoices.Any())
                {
                    existingPlan.AllowedVoices = string.Join(",", selectedVoices);
                }
                else
                {
                    existingPlan.AllowedVoices = null;
                }

                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlanExists(plan.Id)) return NotFound();
                else throw;
            }
        }



        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan != null)
            {
                plan.IsDeleted = true;
                _context.Plans.Update(plan);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No plans selected.");
            }

            var plans = await _context.Plans.Where(p => ids.Contains(p.Id)).ToListAsync();
            if (plans.Any())
            {
                foreach (var plan in plans)
                {
                    plan.IsDeleted = true;
                }
                _context.Plans.UpdateRange(plans);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }

        // ─── Manage Payment Gateways ────────────────────────────────────────────────

        [HttpGet]
        public async Task<IActionResult> ManageGateways(int id)
        {
            var plan = await _context.Plans
                .Include(p => p.PlanPaymentGateways)
                    .ThenInclude(ppg => ppg.GatewayConfig)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null) return NotFound();

            ViewData["Title"] = $"Payment Gateways for {plan.Name}";
            ViewBag.AllGateways = await _context.PaymentGatewayConfigs
                .Where(g => g.IsActive)
                .ToListAsync();

            return View(plan);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddGateway(
            int planId,
            int gatewayConfigId,
            string currency,
            string? displayName,
            bool isDefault,
            int sortOrder)
        {
            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null) return NotFound();

            var gateway = await _context.PaymentGatewayConfigs.FindAsync(gatewayConfigId);
            if (gateway == null) return NotFound();

            // If marking as default, unset any existing default for this plan+currency
            if (isDefault)
            {
                var existingDefaults = await _context.PlanPaymentGateways
                    .Where(ppg => ppg.PlanId == planId && ppg.Currency == currency.ToUpperInvariant() && ppg.IsDefault)
                    .ToListAsync();
                foreach (var d in existingDefaults) d.IsDefault = false;
            }

            _context.PlanPaymentGateways.Add(new PlanPaymentGateway
            {
                PlanId          = planId,
                GatewayConfigId = gatewayConfigId,
                Currency        = currency.ToUpperInvariant(),
                DisplayName     = displayName,
                IsDefault       = isDefault,
                SortOrder       = sortOrder,
                IsActive        = true
            });

            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Payment gateway added successfully.";
            return RedirectToAction(nameof(ManageGateways), new { id = planId });
        }

        [HttpPost]
        public async Task<IActionResult> RemoveGateway(int id, int planId)
        {
            var link = await _context.PlanPaymentGateways.FindAsync(id);
            if (link != null)
            {
                _context.PlanPaymentGateways.Remove(link);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Gateway removed from plan.";
            }
            return RedirectToAction(nameof(ManageGateways), new { id = planId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleGateway(int id, int planId)
        {
            var link = await _context.PlanPaymentGateways.FindAsync(id);
            if (link != null)
            {
                link.IsActive = !link.IsActive;
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(ManageGateways), new { id = planId });
        }

        // ────────────────────────────────────────────────────────────────────────────

        private bool PlanExists(int id)
        {
            return _context.Plans.Any(e => e.Id == id);
        }
    }
}
