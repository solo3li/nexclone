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

        public PlansAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Subscription Plans Management";
            var plans = await _context.Plans.Where(p => !p.IsDeleted).OrderBy(p => p.Id).ToListAsync();
            return View(plans);
        }

        public async Task<IActionResult> Create()
        {
            ViewData["Title"] = "Create Plan";
            ViewBag.AllVoices = await _context.Voices.Where(v => v.IsActive).ToListAsync();
            return View(new Plan());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Plan plan, [FromForm] List<string> selectedVoices)
        {
            // Set defaults for missing fields from the form
            if (string.IsNullOrEmpty(plan.NameAr)) plan.NameAr = plan.Name;
            
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
            
            // Redirect to ManageWallets so the admin can configure wallet limits and tool overrides immediately
            return RedirectToAction(nameof(ManageWallets), new { id = plan.Id });
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var plan = await _context.Plans.FindAsync(id);
            if (plan == null) return NotFound();

            ViewData["Title"] = $"Edit Plan - {plan.Name}";
            ViewBag.AllVoices = await _context.Voices.Where(v => v.IsActive).ToListAsync();
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
                existingPlan.DurationDays = plan.DurationDays;
                existingPlan.GracePeriodDays = plan.GracePeriodDays;
                existingPlan.PriceUsd = plan.PriceUsd;
                existingPlan.PriceEgp = plan.PriceEgp;
                existingPlan.MonthlyCredits = plan.MonthlyCredits;

                existingPlan.TaxPercentageUsd = plan.TaxPercentageUsd;
                existingPlan.TaxPercentageEgp = plan.TaxPercentageEgp;
                existingPlan.FixedFeeUsd = plan.FixedFeeUsd;
                existingPlan.FixedFeeEgp = plan.FixedFeeEgp;

                existingPlan.TtsEnabled = plan.TtsEnabled;
                existingPlan.TtsMaxCharsPerRequest = plan.TtsMaxCharsPerRequest;
                existingPlan.TtsCharactersBlock = plan.TtsCharactersBlock;
                existingPlan.TtsCostPerChar = plan.TtsCostPerChar;
                existingPlan.TtsCostPerCharHigh = plan.TtsCostPerCharHigh;
                existingPlan.TtsCustomInstructionsEnabled = plan.TtsCustomInstructionsEnabled;

                existingPlan.SttEnabled = plan.SttEnabled;
                existingPlan.SttMaxFileSizeMb = plan.SttMaxFileSizeMb;
                existingPlan.SttCostPerMinute = plan.SttCostPerMinute;

                existingPlan.AvatarVideoEnabled = plan.AvatarVideoEnabled;
                existingPlan.AvatarVideoCostPerGeneration = plan.AvatarVideoCostPerGeneration;
                existingPlan.AvatarVideoProCost = plan.AvatarVideoProCost;
                existingPlan.AvatarVideoMaxFileSizeMb = plan.AvatarVideoMaxFileSizeMb;
                existingPlan.AvatarVideoMaxCharsPerRequest = plan.AvatarVideoMaxCharsPerRequest;

                existingPlan.LipSyncEnabled = plan.LipSyncEnabled;
                existingPlan.LipSyncCostPerGeneration = plan.LipSyncCostPerGeneration;

                existingPlan.MotionControlEnabled = plan.MotionControlEnabled;
                existingPlan.MotionControlCostPerGeneration = plan.MotionControlCostPerGeneration;
                existingPlan.MotionControlProCost = plan.MotionControlProCost;
                existingPlan.MotionControlMaxVideoFileSizeMb = plan.MotionControlMaxVideoFileSizeMb;
                existingPlan.MotionControlMaxImageFileSizeMb = plan.MotionControlMaxImageFileSizeMb;

                existingPlan.IsFreeTrial = plan.IsFreeTrial;
                
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

        [HttpGet]
        public async Task<IActionResult> ManageWallets(int id)
        {
            var plan = await _context.Plans
                .Include(p => p.PackageWallets)
                .Include(p => p.PackageToolWallets)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (plan == null) return NotFound();

            ViewData["Title"] = $"Manage Wallets for {plan.Name}";
            ViewBag.WalletTypes = await _context.WalletTypes.ToListAsync();
            ViewBag.Tools = await _context.ToolConfigurations.ToListAsync();

            return View(plan);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ManageWallets(int id, List<int> walletTypeIds, List<decimal> creditsAmounts, List<Guid> toolIds, List<int> toolWalletTypeIds)
        {
            var plan = await _context.Plans
                .Include(p => p.PackageWallets)
                .Include(p => p.PackageToolWallets)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (plan == null) return NotFound();

            // Update Package Wallets (Base Balances)
            _context.PackageWallets.RemoveRange(plan.PackageWallets);
            if (walletTypeIds != null && creditsAmounts != null)
            {
                for (int i = 0; i < walletTypeIds.Count; i++)
                {
                    if (i < creditsAmounts.Count)
                    {
                        plan.PackageWallets.Add(new PackageWallet
                        {
                            PlanId = id,
                            WalletTypeId = walletTypeIds[i],
                            CreditsAmount = creditsAmounts[i]
                        });
                    }
                }
            }

            // Update Package Tool Wallets (Overrides)
            _context.PackageToolWallets.RemoveRange(plan.PackageToolWallets);
            if (toolIds != null && toolWalletTypeIds != null)
            {
                for (int i = 0; i < toolIds.Count; i++)
                {
                    if (i < toolWalletTypeIds.Count)
                    {
                        plan.PackageToolWallets.Add(new PackageToolWallet
                        {
                            PlanId = id,
                            ToolConfigurationId = toolIds[i],
                            WalletTypeId = toolWalletTypeIds[i]
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
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
