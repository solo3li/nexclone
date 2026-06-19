using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Services;
using System;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
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
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> GetPresignedUploadUrl([FromBody] PresignedUrlRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.ContentType))
            {
                return BadRequest("FileName and ContentType are required.");
            }

            var objectName = $"{Guid.NewGuid()}_{request.FileName}";
            var url = await _mediaService.GeneratePresignedUploadUrlAsync(objectName, request.ContentType);
            
            return Ok(new { url, objectName });
        }
    }
}
