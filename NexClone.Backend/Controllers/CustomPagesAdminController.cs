using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class CustomPagesAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomPagesAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Custom Pages";
            var pages = await _context.CustomPages.ToListAsync();
            return View(pages);
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Create Custom Page";
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CustomPage page)
        {
            if (ModelState.IsValid)
            {
                page.UpdatedAt = System.DateTime.UtcNow;
                _context.CustomPages.Add(page);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["Title"] = "Create Custom Page";
            return View(page);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var page = await _context.CustomPages.FindAsync(id);
            if (page == null) return NotFound();

            ViewData["Title"] = "Edit Custom Page";
            return View(page);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CustomPage page)
        {
            if (id != page.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    page.UpdatedAt = System.DateTime.UtcNow;
                    _context.Update(page);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PageExists(page.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["Title"] = "Edit Custom Page";
            return View(page);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var page = await _context.CustomPages.FindAsync(id);
            if (page != null)
            {
                _context.CustomPages.Remove(page);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool PageExists(int id)
        {
            return _context.CustomPages.Any(e => e.Id == id);
        }
    }
}
