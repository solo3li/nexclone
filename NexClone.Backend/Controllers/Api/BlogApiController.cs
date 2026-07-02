using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace NexClone.Backend.Controllers.Api
{
    [Route("api/blog")]
    [ApiController]
    public class BlogApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly NexClone.Backend.Services.IMediaService _mediaService;

        public BlogApiController(ApplicationDbContext context, NexClone.Backend.Services.IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            var posts = await _context.BlogPosts
                .Where(p => p.IsPublished)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.MediaUrl,
                    p.MediaType,
                    p.CreatedAt,
                    CommentCount = p.Comments.Count
                })
                .ToListAsync();

            var mappedPosts = new List<object>();
            foreach (var p in posts)
            {
                string fullMediaUrl = null;
                if (!string.IsNullOrEmpty(p.MediaUrl))
                {
                    fullMediaUrl = await _mediaService.GetFileUrlAsync(p.MediaUrl);
                }
                mappedPosts.Add(new
                {
                    p.Id,
                    p.Title,
                    ContentSummary = p.Content.Length > 200 ? p.Content.Substring(0, 200) + "..." : p.Content,
                    MediaUrl = fullMediaUrl,
                    p.MediaType,
                    p.CreatedAt,
                    p.CommentCount
                });
            }

            return Ok(mappedPosts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _context.BlogPosts
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsPublished);

            if (post == null) return NotFound();

            string fullMediaUrl = null;
            if (!string.IsNullOrEmpty(post.MediaUrl))
            {
                fullMediaUrl = await _mediaService.GetFileUrlAsync(post.MediaUrl);
            }

            var comments = post.Comments.OrderBy(c => c.CreatedAt).Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.IsAdminReply,
                Author = c.IsAdminReply ? "Admin" : (c.User?.Email ?? "Anonymous")
            });

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                MediaUrl = fullMediaUrl,
                post.MediaType,
                post.CreatedAt,
                Comments = comments
            });
        }

        [HttpPost("{id}/comments")]
        [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest("Content is required.");

            Guid? userId = null;
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdStr, out var parsedId))
            {
                userId = parsedId;
            }
            
            if (userId == null) return Unauthorized();

            var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id && p.IsPublished);
            if (post == null) return NotFound("Post not found.");

            var comment = new BlogComment
            {
                BlogPostId = id,
                UserId = userId,
                Content = dto.Content,
                IsAdminReply = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogComments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }

    public class CommentDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
