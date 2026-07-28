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
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.IO;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;
        private readonly IHubContext<TicketHub> _hubContext;

        public TicketsController(ApplicationDbContext context, IMediaService mediaService, IHubContext<TicketHub> hubContext)
        {
            _context = context;
            _mediaService = mediaService;
            _hubContext = hubContext;
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
            await _context.SaveChangesAsync();

            var message = new TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Content = request.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
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

            // Mark admin messages as read by user
            bool updatedRead = false;
            foreach (var m in ticket.Messages.Where(m => m.IsAdminMessage && !m.IsRead))
            {
                m.IsRead = true;
                updatedRead = true;
            }
            if (updatedRead)
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group($"ticket_{id}").SendAsync("MessagesMarkedRead", new { ticketId = id });
            }

            var safeMessages = new List<object>();
            foreach (var msg in ticket.Messages.OrderBy(m => m.CreatedAt))
            {
                var url = msg.AttachmentUrl;
                if (!string.IsNullOrEmpty(url) && !url.StartsWith("http"))
                {
                    url = await _mediaService.GetFileUrlAsync(url);
                }

                safeMessages.Add(new
                {
                    id = msg.Id,
                    content = msg.Content,
                    attachmentUrl = url,
                    attachmentType = msg.AttachmentType,
                    createdAt = msg.CreatedAt,
                    isAdminMessage = msg.IsAdminMessage,
                    isRead = msg.IsRead,
                    replyToMessageId = msg.ReplyToMessageId,
                    replyToSender = msg.ReplyToSender,
                    replyToContent = msg.ReplyToContent,
                    senderName = msg.IsAdminMessage ? "Admin" : (msg.Sender?.FullName ?? msg.Sender?.Email ?? "User"),
                    sender = msg.Sender == null ? null : new
                    {
                        id = msg.Sender.Id,
                        fullName = msg.Sender.FullName,
                        imageUrl = msg.Sender.ImageUrl
                    }
                });
            }

            return Ok(new
            {
                id = ticket.Id,
                subject = ticket.Subject,
                status = ticket.Status,
                createdAt = ticket.CreatedAt,
                updatedAt = ticket.UpdatedAt,
                messages = safeMessages
            });
        }

        [HttpPost("{id}/message")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddMessage(int id, [FromForm] string content, [FromForm] IFormFile? attachment, [FromForm] int? replyToMessageId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var ticket = await _context.SupportTickets.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (ticket == null) return NotFound();

            if (ticket.Status == "Closed")
                return BadRequest(new { Message = "Cannot reply to a closed ticket." });

            string attachmentUrl = "";
            string attachmentType = "";

            if (attachment != null)
            {
                var ext = Path.GetExtension(attachment.FileName).ToLowerInvariant();
                string[] allowedExtensions = {
                    ".jpg", ".jpeg", ".png", ".gif", ".webp",
                    ".mp4", ".webm", ".mov", ".mkv", ".avi",
                    ".mp3", ".wav", ".ogg", ".m4a", ".aac",
                    ".pdf", ".doc", ".docx", ".zip", ".rar", ".txt"
                };

                if (!allowedExtensions.Contains(ext))
                {
                    return BadRequest(new { Message = $"File type {ext} is not allowed." });
                }

                var ct = attachment.ContentType.ToLowerInvariant();
                if (ct.StartsWith("image/") || new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" }.Contains(ext))
                    attachmentType = "image";
                else if (ct.StartsWith("video/") || new[] { ".mp4", ".webm", ".mov", ".mkv", ".avi" }.Contains(ext))
                    attachmentType = "video";
                else if (ct.StartsWith("audio/") || new[] { ".mp3", ".wav", ".ogg", ".m4a", ".aac" }.Contains(ext))
                    attachmentType = "audio";
                else
                    attachmentType = "file";

                string fileName = $"{Guid.NewGuid()}{ext}";
                string objectKey = $"tickets/{id}/{fileName}";
                using var stream = attachment.OpenReadStream();
                attachmentUrl = await _mediaService.UploadFileAsync(stream, objectKey, attachment.ContentType);
            }

            string replySender = null;
            string replyContent = null;
            if (replyToMessageId.HasValue)
            {
                var refMsg = await _context.TicketMessages.Include(m => m.Sender).FirstOrDefaultAsync(m => m.Id == replyToMessageId.Value && m.TicketId == id);
                if (refMsg != null)
                {
                    replySender = refMsg.IsAdminMessage ? "Admin" : (refMsg.Sender?.FullName ?? refMsg.Sender?.Email ?? "User");
                    replyContent = !string.IsNullOrEmpty(refMsg.Content) ? refMsg.Content : $"[{refMsg.AttachmentType.ToUpper()} Attachment]";
                }
            }

            var user = await _context.Users.FindAsync(userId);
            var senderDisplayName = user?.FullName ?? user?.Email ?? "User";

            var message = new TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Content = content ?? "",
                AttachmentUrl = attachmentUrl,
                AttachmentType = attachmentType,
                CreatedAt = DateTime.UtcNow,
                IsAdminMessage = false,
                IsRead = false,
                ReplyToMessageId = replyToMessageId,
                ReplyToSender = replySender,
                ReplyToContent = replyContent
            };

            _context.TicketMessages.Add(message);
            ticket.UpdatedAt = DateTime.UtcNow;
            if (ticket.Status == "Closed") ticket.Status = "Open";

            await _context.SaveChangesAsync();

            string fullMediaUrl = string.IsNullOrEmpty(attachmentUrl) ? null : await _mediaService.GetFileUrlAsync(attachmentUrl);

            var messageDto = new
            {
                id = message.Id,
                content = message.Content,
                attachmentUrl = fullMediaUrl,
                attachmentType = message.AttachmentType,
                createdAt = message.CreatedAt,
                isAdminMessage = false,
                isRead = false,
                replyToMessageId = message.ReplyToMessageId,
                replyToSender = message.ReplyToSender,
                replyToContent = message.ReplyToContent,
                senderName = senderDisplayName
            };

            // Broadcast via SignalR to group
            await _hubContext.Clients.Group($"ticket_{id}").SendAsync("ReceiveMessage", messageDto);

            return Ok(messageDto);
        }
    }
}
