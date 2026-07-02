using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;
using System.Linq;
using NexClone.Backend.Services;
using Microsoft.AspNetCore.Http;
using System;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace NexClone.Backend.Controllers
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

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Support Tickets";
            var tickets = await _context.SupportTickets
                .Include(t => t.User)
                .OrderByDescending(t => t.UpdatedAt)
                .ToListAsync();
            return View(tickets);
        }

        public async Task<IActionResult> Chat(int id)
        {
            var ticket = await _context.SupportTickets
                .Include(t => t.User)
                .Include(t => t.Messages)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound();

            ViewData["Title"] = $"Ticket #{ticket.Id}: {ticket.Subject}";
            
            // Map attachments
            foreach(var msg in ticket.Messages)
            {
                if (!string.IsNullOrEmpty(msg.AttachmentUrl))
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
            }
            return RedirectToAction(nameof(Chat), new { id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendMessage(int id, string content, IFormFile? attachment)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
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
                SenderId = null, // null for admin
                Content = content ?? "",
                AttachmentUrl = attachmentUrl,
                AttachmentType = attachmentType,
                CreatedAt = DateTime.UtcNow,
                IsAdminMessage = true
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
                createdAt = message.CreatedAt,
                isAdminMessage = message.IsAdminMessage,
                senderName = "Admin",
                attachmentUrl = fullMediaUrl,
                attachmentType = message.AttachmentType
            };

            await _hubContext.Clients.Group($"ticket_{id}").SendAsync("ReceiveMessage", messageDto);

            return RedirectToAction(nameof(Chat), new { id });
        }
    }
}
