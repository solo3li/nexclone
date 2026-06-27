using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace NexClone.Backend.Controllers
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
            var plans = await _context.Plans.OrderBy(p => p.Id).ToListAsync();
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
            return RedirectToAction(nameof(Index));
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
                existingPlan.DurationDays = plan.DurationDays;
                existingPlan.GracePeriodDays = plan.GracePeriodDays;
                existingPlan.PriceUsd = plan.PriceUsd;
                existingPlan.PriceEgp = plan.PriceEgp;
                existingPlan.MonthlyCredits = plan.MonthlyCredits;

                existingPlan.TtsEnabled = plan.TtsEnabled;
                existingPlan.TtsMaxCharsPerRequest = plan.TtsMaxCharsPerRequest;
                existingPlan.TtsCharactersBlock = plan.TtsCharactersBlock;
                existingPlan.TtsCostPerChar = plan.TtsCostPerChar;
                existingPlan.TtsCostPerCharMedium = plan.TtsCostPerCharMedium;
                existingPlan.TtsCostPerCharHigh = plan.TtsCostPerCharHigh;
                existingPlan.TtsCustomInstructionsEnabled = plan.TtsCustomInstructionsEnabled;

                existingPlan.SttEnabled = plan.SttEnabled;
                existingPlan.SttMaxFileSizeMb = plan.SttMaxFileSizeMb;
                existingPlan.SttCostPerMinute = plan.SttCostPerMinute;

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

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan != null)
            {
                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool PlanExists(int id)
        {
            return _context.Plans.Any(e => e.Id == id);
        }
    }
}
