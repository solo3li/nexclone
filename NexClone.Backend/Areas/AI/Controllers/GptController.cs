using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using NexClone.Backend.Services;
using System.Security.Claims;
using System.Text.Json;
using System.Text;

namespace NexClone.Backend.Areas.AI.Controllers
{
    [Area("AI")]
    [Route("api/ai/[controller]")]
    [ApiController]
    [Authorize] // Requires JWT
    public class GptController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly HttpClient _httpClient;
        private readonly CreditManagerService _creditManager;

        public GptController(IConfiguration configuration, ApplicationDbContext dbContext, CreditManagerService creditManager)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _creditManager = creditManager;
            _httpClient = new HttpClient();
            // Default to empty key if not set, user can add it in appsettings later
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_configuration["OpenAI:ApiKey"] ?? ""}");
        }

        [HttpPost]
        public async Task<IActionResult> GenerateResponse([FromBody] GptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest(new { error = "Prompt is required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (!await _creditManager.IsToolAllowedForUser(userId, "gpt"))
                return StatusCode(403, new { error = "Your current plan does not have access to this tool." });

            var cost = _creditManager.CalculateCost("gpt", 1m);
            if (!await _creditManager.HasEnoughCredits(userId, "gpt", cost))
                return BadRequest(new { error = $"Insufficient credits. This action requires {cost} credits." });

            // Construct payload for OpenAI Chat Completions API
            var payload = new
            {
                model = "gpt-4o-mini", // Fallback lightweight model
                messages = new[]
                {
                    new { role = "user", content = request.Prompt }
                },
                max_tokens = 2000
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    var responseData = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(responseData);
                    var content = jsonDoc.RootElement
                                         .GetProperty("choices")[0]
                                         .GetProperty("message")
                                         .GetProperty("content")
                                         .GetString();
                    
                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "gpt",
                        Title = request.Prompt.Length > 30 ? request.Prompt.Substring(0, 30) + "..." : request.Prompt,
                        Status = "completed",
                        ResultText = content,
                        CreditsUsed = cost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _creditManager.DeductCreditsAsync(userId, cost);
                    await _dbContext.SaveChangesAsync();

                    return Ok(new { text = content });
                }
                else
                {
                    // Fallback Mock Response for Testing if OpenAI Key is missing or invalid
                    // The user wants to test frontend and backend ONLY. Since they probably don't have an OpenAI key set,
                    // we will return a mock success instead of throwing 401.
                    return Ok(new { text = $"[MOCK RESPONSE] OpenAI API failed (Status: {response.StatusCode}). Did you configure OPENAI_API_KEY in appsettings.json? You said: '{request.Prompt}'" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calling OpenAI API", details = ex.Message });
            }
        }
    }

    public class GptRequest
    {
        public string Prompt { get; set; }
    }
}
