using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class WalletTypesAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public WalletTypesAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Wallet Types Management";
            var walletTypes = await _context.WalletTypes.OrderBy(w => w.Id).ToListAsync();
            return View(walletTypes);
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Create Wallet Type";
            return View(new WalletType());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(WalletType walletType)
        {
            if (ModelState.IsValid)
            {
                walletType.CreatedAt = System.DateTime.UtcNow;
                _context.Add(walletType);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(walletType);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var walletType = await _context.WalletTypes.FindAsync(id);
            if (walletType == null) return NotFound();

            ViewData["Title"] = $"Edit Wallet Type - {walletType.Name}";
            return View(walletType);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, WalletType walletType)
        {
            if (id != walletType.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var existing = await _context.WalletTypes.FindAsync(id);
                    if (existing == null) return NotFound();

                    existing.Name = walletType.Name;
                    existing.Code = walletType.Code;
                    existing.Icon = walletType.Icon;
                    existing.IsActive = walletType.IsActive;

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WalletTypeExists(walletType.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(walletType);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var walletType = await _context.WalletTypes.FindAsync(id);
            if (walletType != null)
            {
                _context.WalletTypes.Remove(walletType);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool WalletTypeExists(int id)
        {
            return _context.WalletTypes.Any(e => e.Id == id);
        }
    }
}
