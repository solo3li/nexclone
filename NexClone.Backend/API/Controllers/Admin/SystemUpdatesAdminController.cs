using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class SystemUpdatesAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SystemUpdatesAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var updates = await _context.SystemUpdates
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();
            return View(updates);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(SystemUpdate systemUpdate)
        {
            if (ModelState.IsValid)
            {
                systemUpdate.Id = Guid.NewGuid();
                systemUpdate.CreatedAt = DateTime.UtcNow;
                _context.Add(systemUpdate);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(systemUpdate);
        }

        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null) return NotFound();

            var systemUpdate = await _context.SystemUpdates.FindAsync(id);
            if (systemUpdate == null) return NotFound();

            return View(systemUpdate);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, SystemUpdate systemUpdate)
        {
            if (id != systemUpdate.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var existing = await _context.SystemUpdates.FindAsync(id);
                    if (existing == null) return NotFound();

                    existing.TitleAr = systemUpdate.TitleAr;
                    existing.DescriptionAr = systemUpdate.DescriptionAr;
                    existing.TitleEn = systemUpdate.TitleEn;
                    existing.DescriptionEn = systemUpdate.DescriptionEn;
                    
                    _context.Update(existing);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SystemUpdateExists(systemUpdate.Id))
                        return NotFound();
                    else
                        throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(systemUpdate);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var systemUpdate = await _context.SystemUpdates.FindAsync(id);
            if (systemUpdate != null)
            {
                _context.SystemUpdates.Remove(systemUpdate);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool SystemUpdateExists(Guid id)
        {
            return _context.SystemUpdates.Any(e => e.Id == id);
        }
    }
}
