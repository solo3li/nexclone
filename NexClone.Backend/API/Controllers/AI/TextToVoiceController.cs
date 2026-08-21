using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Hangfire;
using NexClone.Backend.Core.Messages;

namespace NexClone.Backend.API.Controllers.AI
{
    [Area("AI")]
    [Route("api/ai/text-to-voice")]
    [ApiController]
    [Authorize] // Requires JWT
    [EnableRateLimiting("ApiPolicy")]
    public class TextToVoiceController : ControllerBase
    {
        private readonly ITtsService _ttsService;
        private readonly ApplicationDbContext _dbContext;
        private readonly UsagePolicyService _usagePolicy;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly NexClone.Backend.Core.Interfaces.ITtsCatalogService _ttsCatalog;

        public TextToVoiceController(ITtsService ttsService, ApplicationDbContext dbContext, UsagePolicyService usagePolicy, IBackgroundJobClient backgroundJobClient, NexClone.Backend.Core.Interfaces.ITtsCatalogService ttsCatalog)
        {
            _ttsService = ttsService;
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _backgroundJobClient = backgroundJobClient;
            _ttsCatalog = ttsCatalog;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateAudio([FromBody] TtsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ttsSetting = await _dbContext.TextToVoiceSettings.FirstOrDefaultAsync();
            if (ttsSetting != null && !ttsSetting.IsActive)
                return BadRequest(new { error = "Text to Voice is currently disabled." });

            int maxLen = ttsSetting?.MaxTextLength ?? 5000;
            if (request.Text.Length > maxLen)
            {
                return BadRequest(new { error = $"Text length ({request.Text.Length} chars) exceeds the maximum allowed limit of {maxLen} characters." });
            }

            if (!string.IsNullOrEmpty(request.VoiceName) && !_ttsCatalog.IsValidVoice(request.VoiceName))
            {
                return BadRequest(new { error = $"The selected voice '{request.VoiceName}' is invalid or inactive." });
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var activeSubscription = await _dbContext.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == userId && s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (activeSubscription != null && !string.IsNullOrEmpty(activeSubscription.Plan.AllowedVoices))
            {
                var allowedVoices = activeSubscription.Plan.AllowedVoices.Split(',').Select(v => v.Trim()).ToList();
                if (!string.IsNullOrEmpty(request.VoiceName) && !allowedVoices.Contains(request.VoiceName))
                {
                    return BadRequest(new { error = $"The voice '{request.VoiceName}' is not allowed on your current plan." });
                }
            }

            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "text-to-voice", request.Text.Length, null, request.Quality, request.SubscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            var cost = policyResult.TotalCost;

            try
            {
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "text-to-voice",
                    Title = request.Text.Length > 30 ? request.Text.Substring(0, 30) + "..." : request.Text,
                    InputText = request.Text,
                    Status = "processing",
                    Lang = request.Language,
                    Voice = request.VoiceName,
                    CreditsUsed = cost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.TtsConsumer>(
                    c => c.Consume(new TextToVoiceMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        Text = request.Text,
                        Language = request.Language,
                        VoiceName = request.VoiceName,
                        StyleInstruction = request.StyleInstruction,
                        Quality = request.Quality,
                        StandardCost = policyResult.StandardCreditsCharged,
                        PremiumCost = policyResult.PremiumCreditsCharged
                    })
                );

                // Re-fetch updated balances to return to frontend
                var updatedUser = await _dbContext.Users.FindAsync(userId);
                return Ok(new { 
                    taskId = history.Id, 
                    status = "processing",
                    standardCredits = updatedUser?.StandardCredits ?? 0,
                    premiumCredits = updatedUser?.PremiumCredits ?? 0
                });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.StandardCreditsCharged, policyResult.PremiumCreditsCharged);
                return StatusCode(500, new { error = "Error queuing audio generation: " + ex.Message });
            }
        }

        [HttpPost("estimate")]
        public async Task<IActionResult> EstimateAudio([FromBody] TtsRequest request)
        {
            Console.WriteLine($"[ESTIMATE] Request received: TextLength={request?.Text?.Length}, Language={request?.Language}, VoiceName={request?.VoiceName}");
            if (!ModelState.IsValid)
            {
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                Console.WriteLine($"[ESTIMATE] ModelState Invalid: {errors}");
                return BadRequest(ModelState);
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) 
            {
                Console.WriteLine("[ESTIMATE] Unauthorized: Missing userId");
                return Unauthorized();
            }

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, "text-to-voice", request.Text.Length, null, request.Quality, request.SubscriptionId);
            if (!policyResult.IsAllowed)
            {
                Console.WriteLine($"[ESTIMATE] Policy Denied: {policyResult.ErrorMessage}");
                return BadRequest(new { error = policyResult.ErrorMessage });
            }

            return Ok(new { 
                estimatedCost = policyResult.TotalCost, 

            });
        }
    }

    public class TtsRequest
    {
        [Required]
        [MinLength(1, ErrorMessage = "Text cannot be empty")]
        public string Text { get; set; } = string.Empty;
        public string? Language { get; set; } = "other"; // "arabic" or "other"
        public string? VoiceName { get; set; } = string.Empty;
        public string? StyleInstruction { get; set; } = string.Empty;
        public string Quality { get; set; } = "Standard";
        public int? SubscriptionId { get; set; }
    }
}
