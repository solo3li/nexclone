using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MassTransit;
using NexClone.Backend.Core.Messages;

namespace NexClone.Backend.API.Controllers.AI
{
    [Area("AI")]
    [Route("api/ai/voice-to-text")]
    [ApiController]
    [Authorize] // Requires JWT
    [EnableRateLimiting("ApiPolicy")]
    public class VoiceToTextController : ControllerBase
    {
        private readonly ISttService _sttService;
        private readonly ApplicationDbContext _dbContext;
        private readonly UsagePolicyService _usagePolicy;
        private readonly IMediaService _mediaService;
        private readonly IPublishEndpoint _publishEndpoint;

        public VoiceToTextController(ISttService sttService, ApplicationDbContext dbContext, UsagePolicyService usagePolicy, IMediaService mediaService, IPublishEndpoint publishEndpoint)
        {
            _sttService = sttService;
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _mediaService = mediaService;
            _publishEndpoint = publishEndpoint;
        }

        public class TranscribeRequest
        {
            public string FileId { get; set; }
            public bool Translate { get; set; } = false;
            public string TargetLanguage { get; set; } = "en";
            public int? SubscriptionId { get; set; }
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeAudio([FromBody] TranscribeRequest request)
        {
            if (string.IsNullOrEmpty(request.FileId))
                return BadRequest(new { error = "No fileId provided" });

            byte[] audioData;
            try
            {
                audioData = await _mediaService.DownloadFileAsync(request.FileId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Could not retrieve file from storage", details = ex.Message });
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            double audioDurationMinutes = 1.0;
            try
            {
                var extension = System.IO.Path.GetExtension(request.FileId);
                if (string.IsNullOrEmpty(extension)) extension = ".mp3"; // Fallback extension
                
                var tempFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), Guid.NewGuid().ToString() + extension);
                
                System.IO.File.WriteAllBytes(tempFile, audioData);
                using (var tfile = TagLib.File.Create(tempFile))
                {
                    audioDurationMinutes = tfile.Properties.Duration.TotalMinutes;
                }
                System.IO.File.Delete(tempFile);
                
                // Ensure at least 0.01 minutes
                if (audioDurationMinutes <= 0) audioDurationMinutes = 0.01;
            }
            catch (Exception ex)
            {
                // Fallback to estimation based on size if TagLib fails on webm etc
                audioDurationMinutes = (double)(audioData.Length / 1024000m); 
                if (audioDurationMinutes <= 0) audioDurationMinutes = 0.01;
                Console.WriteLine($"[WARNING] TagLib failed for {request.FileId}. Fallback duration: {audioDurationMinutes} mins. Error: {ex.Message}");
            }

            // Round up to the nearest minute (e.g. 1.2 -> 2, 0.5 -> 1)
            audioDurationMinutes = Math.Ceiling(audioDurationMinutes);
            if (audioDurationMinutes < 1) audioDurationMinutes = 1;

            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "voice-to-text", audioData.Length, (decimal)audioDurationMinutes, "Standard", request.SubscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            var cost = policyResult.TotalCost;

            try
            {
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "voice-to-text",
                    Title = request.FileId.Split('/').LastOrDefault() ?? "Audio File",
                    FileUrl = request.FileId,
                    Status = "processing",
                    Lang = request.TargetLanguage,
                    CreditsUsed = cost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                await _publishEndpoint.Publish(new VoiceToTextMessage
                {
                    HistoryId = history.Id,
                    UserId = userId,
                    FileId = request.FileId,
                    Translate = request.Translate,
                    TargetLanguage = request.TargetLanguage,
                    Cost = cost,
                    ChargedWalletTypeId = policyResult.ChargedWalletTypeId
                });

                return Ok(new
                {
                    taskId = history.Id,
                    status = "processing"
                });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.ChargedWalletTypeId, cost);
                return StatusCode(500, new { error = "Internal server error during queuing.", details = ex.Message });
            }
        }
        public class EstimateRequest
        {
            public long FileSizeBytes { get; set; }
            public double DurationMinutes { get; set; }
            public int? SubscriptionId { get; set; }
        }

        [HttpPost("estimate")]
        public async Task<IActionResult> EstimateAudio([FromBody] EstimateRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            double duration = request.DurationMinutes <= 0 ? 0.01 : request.DurationMinutes;

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, "voice-to-text", request.FileSizeBytes, (decimal)duration, "Standard", request.SubscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { estimatedCost = policyResult.TotalCost, chargedWalletName = policyResult.ChargedWalletName });
        }
    }
}
