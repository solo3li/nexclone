using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class TicketsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;
        private readonly IHubContext<TicketHub> _hubContext;

        public TicketsAdminController(ApplicationDbContext context, IMediaService mediaService, IHubContext<TicketHub> hubContext)
        {
            _context = context;
            _mediaService = mediaService;
            _hubContext = hubContext;
        }

        public async Task<IActionResult> Index(string searchEmail, string status)
        {
            ViewData["Title"] = "Support Tickets";
            var query = _context.SupportTickets.Include(t => t.User).AsQueryable();

            if (!string.IsNullOrEmpty(searchEmail))
            {
                var search = searchEmail.ToLower();
                query = query.Where(t => (t.User != null && t.User.Email.ToLower().Contains(search)) || t.Subject.ToLower().Contains(search));
            }

            if (!string.IsNullOrEmpty(status) && status != "all")
            {
                query = query.Where(t => t.Status == status);
            }

            var tickets = await query.OrderByDescending(t => t.UpdatedAt).ToListAsync();

            ViewBag.CurrentSearch = searchEmail;
            ViewBag.CurrentStatus = status;

            return View(tickets);
        }

        public async Task<IActionResult> Chat(int id)
        {
            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .Include(t => t.Messages)
                .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound();

            ViewData["Title"] = $"Ticket #{ticket.Id}: {ticket.Subject}";

            // Mark user messages as read when Admin opens Chat
            bool updatedRead = false;
            foreach (var m in ticket.Messages.Where(m => !m.IsAdminMessage && !m.IsRead))
            {
                m.IsRead = true;
                updatedRead = true;
            }
            if (updatedRead)
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group($"ticket_{id}").SendAsync("MessagesMarkedRead", new { ticketId = id });
            }

            // Map attachment URLs
            foreach (var msg in ticket.Messages)
            {
                if (!string.IsNullOrEmpty(msg.AttachmentUrl) && !msg.AttachmentUrl.StartsWith("http"))
                {
                    msg.AttachmentUrl = await _mediaService.GetFileUrlAsync(msg.AttachmentUrl);
                }
            }

            return View(ticket);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket != null)
            {
                ticket.Status = status;
                ticket.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group($"ticket_{id}").SendAsync("StatusUpdated", new { ticketId = id, status });
            }
            return RedirectToAction(nameof(Chat), new { id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendMessage(int id, string content, IFormFile? attachment, int? replyToMessageId)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound();

            string attachmentUrl = "";
            string attachmentType = "";

            if (attachment != null)
            {
                var ext = Path.GetExtension(attachment.FileName).ToLowerInvariant();
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

            var message = new TicketMessage
            {
                TicketId = id,
                SenderId = null, // null for admin
                Content = content ?? "",
                AttachmentUrl = attachmentUrl,
                AttachmentType = attachmentType,
                CreatedAt = DateTime.UtcNow,
                IsAdminMessage = true,
                IsRead = false,
                ReplyToMessageId = replyToMessageId,
                ReplyToSender = replySender,
                ReplyToContent = replyContent
            };

            _context.TicketMessages.Add(message);
            ticket.UpdatedAt = DateTime.UtcNow;
            if (ticket.Status == "Open") ticket.Status = "InProgress";
            await _context.SaveChangesAsync();

            string fullMediaUrl = string.IsNullOrEmpty(attachmentUrl) ? null : await _mediaService.GetFileUrlAsync(attachmentUrl);

            var messageDto = new
            {
                id = message.Id,
                content = message.Content,
                attachmentUrl = fullMediaUrl,
                attachmentType = message.AttachmentType,
                createdAt = message.CreatedAt,
                isAdminMessage = true,
                isRead = false,
                replyToMessageId = message.ReplyToMessageId,
                replyToSender = message.ReplyToSender,
                replyToContent = message.ReplyToContent,
                senderName = "Admin"
            };

            // Broadcast via SignalR to group
            await _hubContext.Clients.Group($"ticket_{id}").SendAsync("ReceiveMessage", messageDto);

            return RedirectToAction(nameof(Chat), new { id });
        }
    }
}
