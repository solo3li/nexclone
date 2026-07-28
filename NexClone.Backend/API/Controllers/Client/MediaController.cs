using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NexClone.Backend.API.Controllers.Client
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;

        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        public class PresignedUrlRequest
        {
            public string FileName { get; set; }
            public string ContentType { get; set; }
            public string ToolName { get; set; }
        }

        [Authorize]
        [HttpPost("upload-url")]
        public async Task<IActionResult> GetPresignedUploadUrl([FromBody] PresignedUrlRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.ContentType))
            {
                return BadRequest("FileName and ContentType are required.");
            }
            
            // Security: Enforce Content-Type and File Extension Whitelist
            var allowedContentTypes = new System.Collections.Generic.HashSet<string>(System.StringComparer.OrdinalIgnoreCase) 
            { 
                "image/jpeg", "image/png", "image/webp", "image/gif",
                "audio/mpeg", "audio/wav", "audio/mp3", "audio/webm", "audio/ogg", "audio/x-m4a", "audio/aac", "audio/mp4",
                "video/mp4", "video/webm", "video/ogg"
            };
            
            if (!allowedContentTypes.Contains(request.ContentType))
            {
                return BadRequest(new { Message = "Unsupported ContentType. Allowed types: Images, Audio, Video." });
            }
            
            var ext = System.IO.Path.GetExtension(request.FileName).ToLowerInvariant();
            var allowedExtensions = new System.Collections.Generic.HashSet<string>(System.StringComparer.OrdinalIgnoreCase)
            {
                ".jpg", ".jpeg", ".png", ".webp", ".gif",
                ".mp3", ".wav", ".webm", ".ogg", ".m4a", ".aac",
                ".mp4"
            };
            
            if (!allowedExtensions.Contains(ext))
            {
                return BadRequest(new { Message = "Unsupported file extension." });
            }

            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            var toolName = string.IsNullOrEmpty(request.ToolName) ? "uploads" : request.ToolName; 
            var month = DateTime.UtcNow.ToString("yyyy-MM");
            var uniqueFileName = $"{Guid.NewGuid()}_{request.FileName}";

            var objectName = $"private/{userIdStr}/{toolName}/{month}/{uniqueFileName}";
            var url = await _mediaService.GeneratePresignedUploadUrlAsync(objectName, request.ContentType);
            
            return Ok(new { url, objectName });
        }
    }
}
