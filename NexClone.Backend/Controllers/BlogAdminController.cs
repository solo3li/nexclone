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

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class BlogAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;

        public BlogAdminController(ApplicationDbContext context, IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Blog Posts";
            var posts = await _context.BlogPosts.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return View(posts);
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Create Post";
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(BlogPost post, IFormFile? MediaFile, string? MediaUrl, string? MediaType)
        {
            // Remove navigation properties from validation
            ModelState.Remove("Comments");
            
            if (ModelState.IsValid)
            {
                // Priority 1: uploaded file
                if (MediaFile != null && MediaFile.Length > 0)
                {
                    try
                    {
                        var fileUrl = await _mediaService.UploadFileAsync(MediaFile.OpenReadStream(), MediaFile.FileName, MediaFile.ContentType);
                        if (!string.IsNullOrEmpty(fileUrl))
                        {
                            post.MediaUrl = fileUrl;
                            post.MediaType = MediaFile.ContentType.StartsWith("video") ? "video" : "image";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"[BlogAdmin] File upload error: {ex.Message}");
                    }
                }
                // Priority 2: direct URL entered manually
                else if (!string.IsNullOrWhiteSpace(MediaUrl))
                {
                    post.MediaUrl = MediaUrl;
                    post.MediaType = string.IsNullOrWhiteSpace(MediaType) ? "image" : MediaType;
                }
                
                post.CreatedAt = DateTime.UtcNow;
                post.Comments = new List<BlogComment>();
                _context.BlogPosts.Add(post);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            
            return View(post);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return NotFound();

            ViewData["Title"] = "Edit Post";
            return View(post);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, BlogPost post, IFormFile? MediaFile)
        {
            if (id != post.Id) return NotFound();

            // Remove navigation properties from validation
            ModelState.Remove("Comments");

            if (ModelState.IsValid)
            {
                var existing = await _context.BlogPosts.FindAsync(id);
                if (existing == null) return NotFound();

                existing.Title = post.Title;
                existing.Content = post.Content;
                existing.IsPublished = post.IsPublished;

                if (MediaFile != null && MediaFile.Length > 0)
                {
                    try
                    {
                        var fileUrl = await _mediaService.UploadFileAsync(MediaFile.OpenReadStream(), MediaFile.FileName, MediaFile.ContentType);
                        if (!string.IsNullOrEmpty(fileUrl))
                        {
                            existing.MediaUrl = fileUrl;
                            existing.MediaType = MediaFile.ContentType.StartsWith("video") ? "video" : "image";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"[BlogAdmin] File upload error on edit: {ex.Message}");
                    }
                }

                _context.Update(existing);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(post);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post != null)
            {
                _context.BlogPosts.Remove(post);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Comments(int id)
        {
            var post = await _context.BlogPosts
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == id);
                
            if (post == null) return NotFound();

            ViewData["Title"] = $"Comments for: {post.Title}";
            return View(post);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ReplyComment(int postId, string content)
        {
            var comment = new BlogComment
            {
                BlogPostId = postId,
                Content = content,
                IsAdminReply = true,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.BlogComments.Add(comment);
            await _context.SaveChangesAsync();
            
            return RedirectToAction(nameof(Comments), new { id = postId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteComment(int id, int postId)
        {
            var comment = await _context.BlogComments.FindAsync(id);
            if (comment != null)
            {
                _context.BlogComments.Remove(comment);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Comments), new { id = postId });
        }
    }
}
