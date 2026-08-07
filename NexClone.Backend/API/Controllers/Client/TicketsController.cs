using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;

        public TicketsController(ApplicationDbContext context, IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var tickets = await _context.SupportTickets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        public class CreateTicketRequest
        {
            public string Subject { get; set; } = string.Empty;
            public string Message { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Subject) || string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { Message = "Subject and Message are required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = new SupportTicket
            {
                UserId = userId,
                Subject = request.Subject,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync(); // Save to get the Ticket Id

            var message = new TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Content = request.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(ticket);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = await _context.SupportTickets
                .Include(t => t.Messages)
                .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (ticket == null) return NotFound();

            // Map attachment URLs securely and hide sensitive sender info
            var safeMessages = new System.Collections.Generic.List<object>();
            foreach (var msg in ticket.Messages)
            {
                if (!string.IsNullOrEmpty(msg.AttachmentUrl) && !msg.AttachmentUrl.StartsWith("http"))
                {
                    msg.AttachmentUrl = await _mediaService.GetFileUrlAsync(msg.AttachmentUrl);
                }
                
                safeMessages.Add(new {
                    Id = msg.Id,
                    Content = msg.Content,
                    AttachmentUrl = msg.AttachmentUrl,
                    CreatedAt = msg.CreatedAt,
                    Sender = msg.Sender == null ? null : new {
                        Id = msg.Sender.Id,
                        FullName = msg.Sender.FullName,
                        ImageUrl = msg.Sender.ImageUrl,
                        IsStaff = msg.Sender.IsStaff
                    }
                });
            }

            return Ok(new {
                Id = ticket.Id,
                Subject = ticket.Subject,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                Messages = safeMessages
            });
        }

        [HttpPost("{id}/message")]
        public async Task<IActionResult> AddMessage(int id, [FromForm] string content, [FromForm] IFormFile? attachment)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = await _context.SupportTickets.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (ticket == null) return NotFound();

            if (ticket.Status == "Closed")
                return BadRequest(new { Message = "Cannot reply to a closed ticket." });

            string attachmentUrl = null;

            if (attachment != null)
            {
                var ext = System.IO.Path.GetExtension(attachment.FileName).ToLowerInvariant();
                
                // Security: Prevent XSS by restricting allowed file extensions
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".pdf", ".zip", ".rar" };
                if (!allowedExtensions.Contains(ext))
                {
                    return BadRequest(new { Message = $"File type {ext} is not allowed. Allowed types: jpg, jpeg, png, pdf, zip, rar." });
                }

                string fileName = $"{Guid.NewGuid()}{ext}";
                string objectKey = $"tickets/{id}/{fileName}";
                using var stream = attachment.OpenReadStream();
                attachmentUrl = await _mediaService.UploadFileAsync(stream, objectKey, attachment.ContentType);
            }

            var message = new TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Content = content ?? "",
                AttachmentUrl = attachmentUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(message);
            
            ticket.UpdatedAt = DateTime.UtcNow;
            ticket.Status = "Open"; // Re-open if it was answered

            await _context.SaveChangesAsync();

            // Resolve URL for immediate return
            if (!string.IsNullOrEmpty(message.AttachmentUrl) && !message.AttachmentUrl.StartsWith("http"))
            {
                message.AttachmentUrl = await _mediaService.GetFileUrlAsync(message.AttachmentUrl);
            }

            var user = await _context.Users.FindAsync(userId);
            message.Sender = user;

            return Ok(message);
        }
    }
}
