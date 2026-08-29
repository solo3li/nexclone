using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;

        public BlogController(ApplicationDbContext context, IMediaService mediaService)
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
                .ToListAsync();

            // Map URLs
            foreach (var post in posts)
            {
                if (!string.IsNullOrEmpty(post.MediaUrl) && !post.MediaUrl.StartsWith("http"))
                {
                    post.MediaUrl = await _mediaService.GetFileUrlAsync(post.MediaUrl);
                }
            }

            return Ok(posts);
        }

        [HttpGet("{slugOrId}")]
        public async Task<IActionResult> GetPost(string slugOrId)
        {
            var isNumeric = int.TryParse(slugOrId, out int id);
            var post = await _context.BlogPosts
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => (isNumeric && p.Id == id) || p.Slug == slugOrId);

            if (post == null || !post.IsPublished) return NotFound();

            if (!string.IsNullOrEmpty(post.MediaUrl) && !post.MediaUrl.StartsWith("http"))
            {
                post.MediaUrl = await _mediaService.GetFileUrlAsync(post.MediaUrl);
            }

            // Remove sensitive info from users in comments by mapping to safe objects
            var safeComments = post.Comments.Select(comment => new {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                User = comment.User == null ? null : new {
                    Id = comment.User.Id,
                    FullName = comment.User.FullName,
                    ImageUrl = comment.User.ImageUrl
                }
            }).ToList();

            return Ok(new {
                Id = post.Id,
                Slug = post.Slug,
                Category = post.Category,
                TitleEn = post.TitleEn,
                TitleAr = post.TitleAr,
                ContentEn = post.ContentEn,
                ContentAr = post.ContentAr,

                MediaUrl = post.MediaUrl,
                MediaType = post.MediaType,
                CreatedAt = post.CreatedAt,
                Comments = safeComments
            });
        }

        public class CommentRequest
        {
            public string Content { get; set; } = string.Empty;
        }

        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest(new { Message = "Comment content is required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id && p.IsPublished);
            if (post == null) return NotFound();

            var comment = new BlogComment
            {
                BlogPostId = id,
                UserId = userId,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogComments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            comment.User = user;

            if (comment.User != null)
            {
                comment.User.PasswordHash = "";
            }

            return Ok(comment);
        }
    }
}
