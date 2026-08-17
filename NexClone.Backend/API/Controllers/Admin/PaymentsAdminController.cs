using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class PaymentsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly NexClone.Backend.Core.Interfaces.IMediaService _mediaService;

        public PaymentsAdminController(ApplicationDbContext context, NexClone.Backend.Core.Interfaces.IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        public async Task<IActionResult> Index(int pageNumber = 1, string searchString = null)
        {
            int pageSize = 20;
            if (pageNumber < 1) pageNumber = 1;

            var query = _context.Payments
                .Include(p => p.User)
                .Include(p => p.Plan)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                var lowerSearch = searchString.ToLower();
                query = query.Where(p => 
                    (p.PaymentId != null && p.PaymentId.ToLower().Contains(lowerSearch)) ||
                    (p.User != null && p.User.Email != null && p.User.Email.ToLower().Contains(lowerSearch))
                );
            }

            int totalRecords = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling((double)totalRecords / pageSize);

            var payments = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.CurrentSearch = searchString;
            ViewBag.PageNumber = pageNumber;
            ViewBag.TotalPages = totalPages;

            return View(payments);
        }

        public async Task<IActionResult> Details(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Plan)
                .Include(p => p.Subscription)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return NotFound();

            // Try to find an associated invoice
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => 
                    (payment.SubscriptionId.HasValue && i.SubscriptionId == payment.SubscriptionId.Value) || 
                    (i.TransactionId != null && i.TransactionId == payment.PaymentId));

            ViewBag.Invoice = invoice;

            if (invoice != null && !string.IsNullOrWhiteSpace(invoice.MinioPdfUrl))
            {
                ViewBag.PdfUrl = await _mediaService.GetFileUrlAsync(invoice.MinioPdfUrl, "invoices");
            }

            return View(payment);
        }
    }
}
