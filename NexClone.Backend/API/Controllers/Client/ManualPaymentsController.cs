using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ManualPaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;

        public ManualPaymentsController(ApplicationDbContext context, IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        [HttpGet("methods")]
        [AllowAnonymous]
        public async Task<IActionResult> GetMethods()
        {
            var methods = await _context.ManualPaymentMethods
                .Where(m => m.IsActive)
                .OrderBy(m => m.Name)
                .ToListAsync();

            return Ok(methods);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitPayment([FromForm] int planId, [FromForm] IFormFile receiptImage)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (planId <= 0)
                return BadRequest(new { Message = "الخطة غير صالحة." });

            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null)
                return BadRequest(new { Message = "الخطة غير موجودة." });

            if (receiptImage == null || receiptImage.Length == 0)
                return BadRequest(new { Message = "يجب إرفاق صورة الإيصال." });

            // Check if user has an existing pending manual payment
            var pendingPayment = await _context.Payments
                .AnyAsync(p => p.UserId == userId && p.Status == "Pending" && p.Method == "Manual");
            
            if (pendingPayment)
            {
                return BadRequest(new { Message = "لديك بالفعل طلب اشتراك قيد المراجعة. يرجى الانتظار." });
            }

            try
            {
                var receiptUrl = await _mediaService.UploadFileAsync(receiptImage, "receipts");

                var payment = new Payment
                {
                    UserId = userId,
                    PlanId = plan.Id,
                    Amount = plan.PriceEgp,
                    Method = "Manual",
                    Status = "Pending",
                    ReceiptUrl = receiptUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "تم استلام طلبك بنجاح. سيتم مراجعته في أقرب وقت." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "حدث خطأ أثناء معالجة الطلب.", Details = ex.Message });
            }
        }
    }
}
