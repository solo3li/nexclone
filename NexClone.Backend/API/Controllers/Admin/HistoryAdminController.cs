using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class HistoryAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HistoryAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string searchEmail, string filterType, string filterStatus)
        {
            var query = _context.GenerationHistories
                .Include(h => h.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchEmail))
                query = query.Where(h => h.User.Email.ToLower().Contains(searchEmail.ToLower()));

            if (!string.IsNullOrEmpty(filterType) && filterType != "all")
                query = query.Where(h => h.Type == filterType);

            if (!string.IsNullOrEmpty(filterStatus) && filterStatus != "all")
                query = query.Where(h => h.Status == filterStatus);

            var history = await query
                .OrderByDescending(h => h.CreatedAt)
                .Take(1000)
                .ToListAsync();

            // Stats
            var allQuery = _context.GenerationHistories.AsQueryable();
            ViewBag.TotalCount     = await allQuery.CountAsync();
            ViewBag.CompletedCount = await allQuery.CountAsync(h => h.Status == "completed");
            ViewBag.FailedCount    = await allQuery.CountAsync(h => h.Status == "failed");
            ViewBag.ProcessingCount= await allQuery.CountAsync(h => h.Status == "processing");

            ViewBag.CurrentSearch = searchEmail;
            ViewBag.FilterType    = filterType;
            ViewBag.FilterStatus  = filterStatus;

            return View(history);
        }

        public async Task<IActionResult> Details(Guid id, [FromServices] NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            var history = await _context.GenerationHistories
                .Include(h => h.User)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (history == null) return NotFound();

            if (!string.IsNullOrEmpty(history.FileUrl) && !history.FileUrl.StartsWith("http"))
            {
                history.FileUrl = await mediaService.GetFileUrlAsync(history.FileUrl, history.Type);
            }

            return View(history);
        }
    }
}
