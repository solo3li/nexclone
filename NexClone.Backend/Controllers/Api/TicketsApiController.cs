using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using System;
using Microsoft.AspNetCore.Authorization;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http;
using NexClone.Backend.Services;
using System.Collections.Generic;

namespace NexClone.Backend.Controllers.Api
{
    [Route("api/tickets")]
    [ApiController]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    public class TicketsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<TicketHub> _hubContext;
        private readonly IMediaService _mediaService;

        public TicketsApiController(ApplicationDbContext context, IHubContext<TicketHub> hubContext, IMediaService mediaService)
        {
            _context = context;
            _hubContext = hubContext;
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyTickets()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var tickets = await _context.SupportTickets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.UpdatedAt)
                .Select(t => new { t.Id, t.Subject, t.Status, t.UpdatedAt })
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = new SupportTicket
            {
                UserId = userId,
                Subject = dto.Subject,
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();

            var message = new TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Content = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsAdminMessage = false
            };
            
            _context.TicketMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { ticket.Id });
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

            var messages = new List<object>();
            foreach(var m in ticket.Messages.OrderBy(m => m.CreatedAt))
            {
                string fullMediaUrl = null;
                if (!string.IsNullOrEmpty(m.AttachmentUrl))
                {
                    fullMediaUrl = await _mediaService.GetFileUrlAsync(m.AttachmentUrl);
                }

                messages.Add(new
                {
                    m.Id,
                    m.Content,
                    m.CreatedAt,
                    m.IsAdminMessage,
                    SenderName = m.IsAdminMessage ? "Admin" : m.Sender?.Email,
                    AttachmentUrl = fullMediaUrl,
                    m.AttachmentType
                });
            }

            return Ok(new
            {
                ticket.Id,
                ticket.Subject,
                ticket.Status,
                Messages = messages
            });
        }

        [HttpPost("{id}/message")]
        public async Task<IActionResult> SendMessage(int id, [FromForm] string content, [FromForm] IFormFile? attachment)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = await _context.SupportTickets.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (ticket == null) return NotFound();

            string attachmentUrl = "";
            string attachmentType = "";

            if (attachment != null)
            {
                attachmentUrl = await _mediaService.UploadFileAsync(attachment.OpenReadStream(), attachment.FileName, attachment.ContentType);
                if (attachment.ContentType.StartsWith("image")) attachmentType = "image";
                else if (attachment.ContentType.StartsWith("audio")) attachmentType = "audio";
                else attachmentType = "file";
            }

            var message = new TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Content = content ?? "",
                AttachmentUrl = attachmentUrl,
                AttachmentType = attachmentType,
                CreatedAt = DateTime.UtcNow,
                IsAdminMessage = false
            };

            _context.TicketMessages.Add(message);
            ticket.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            string fullMediaUrl = string.IsNullOrEmpty(attachmentUrl) ? null : await _mediaService.GetFileUrlAsync(attachmentUrl);

            var messageDto = new
            {
                Id = message.Id,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                IsAdminMessage = message.IsAdminMessage,
                SenderName = "User",
                AttachmentUrl = fullMediaUrl,
                AttachmentType = message.AttachmentType
            };

            // Broadcast to room
            await _hubContext.Clients.Group($"ticket_{id}").SendAsync("ReceiveMessage", messageDto);

            return Ok(messageDto);
        }
    }

    public class CreateTicketDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
