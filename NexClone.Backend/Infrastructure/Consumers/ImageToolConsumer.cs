using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Hubs;

using Hangfire;

namespace NexClone.Backend.Infrastructure.Consumers
{
    [Queue("image_queue")]
    public class ImageToolConsumer : BaseAiTaskConsumer
    {
        public ImageToolConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<ImageToolConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(ImageToolMessage message)
        {
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                var (apiKey, defaultModel) = await GetToolConfigAsync("text-to-image");

                var client = _httpClientFactory.CreateClient("AIGateway");
                if (!client.DefaultRequestHeaders.Contains("x-api-key"))
                    client.DefaultRequestHeaders.Add("x-api-key", apiKey);
                if (!client.DefaultRequestHeaders.Contains("Authorization"))
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                string endpoint = "https://api.crun.ai/api/v1/client/job/CreateTask";

                string crunModel = (message.Model ?? "grok-imagine").ToLower().Trim();
                if (crunModel == "grok" || crunModel == "grok-imagine" || crunModel == "grok-image" || crunModel == "grok-imagine (t2i)" || crunModel == "t2i")
                    crunModel = "grok-imagine/t2i";

                string promptText = !string.IsNullOrWhiteSpace(message.Prompt) ? message.Prompt : (history.InputText ?? "");
                if (string.IsNullOrWhiteSpace(promptText))
                    throw new Exception("Prompt cannot be empty.");

                var payload = new {
                    model = crunModel,
                    input = new {
                        prompt = promptText,
                        aspect_ratio = !string.IsNullOrEmpty(message.AspectRatio) ? message.AspectRatio : "1:1"
                    }
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload, new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");
                
                var submitResponse = await client.PostAsync(endpoint, jsonContent);
                var submitResult = await submitResponse.Content.ReadAsStringAsync();
                
                if (!submitResponse.IsSuccessStatusCode)
                    throw new Exception($"Crun AI submit failed: {submitResult}");

                using var doc = JsonDocument.Parse(submitResult);
                if (!doc.RootElement.TryGetProperty("data", out var dataEl) || !dataEl.TryGetProperty("task_id", out var taskIdEl))
                {
                    throw new Exception($"Invalid response from Crun AI: {submitResult}");
                }

                string taskId = taskIdEl.GetString();
                history.ResultText = taskId;
                await _dbContext.SaveChangesAsync();

                string outputUrl = await PollCrunApiTask(client, taskId);

                history.Status = "succeeded";
                history.FileUrl = outputUrl;
                history.ResultText = "Complete";
                await _dbContext.SaveChangesAsync();

                await NotifyUserSuccess(message.UserId, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing image tool task.");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                history.ResultText = "Error";
                await _dbContext.SaveChangesAsync();
                
                await _usagePolicy.RefundByToolAsync(message.UserId, "text-to-image", history.CreditsUsed);
                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
