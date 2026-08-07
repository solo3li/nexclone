using MassTransit;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.Consumers
{
    public class TtsConsumer : BaseAiTaskConsumer, IConsumer<TextToVoiceMessage>
    {
        public TtsConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<TtsConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(ConsumeContext<TextToVoiceMessage> context)
        {
            var message = context.Message;
            _logger.LogInformation($"[TextToVoice Task {message.HistoryId}] Started consumer.");

            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                var (audioStream, contentType, fileExtension, providerName, modelName) = await _ttsService.GenerateAudioAsync(
                    message.Text,
                    message.Language,
                    message.VoiceName,
                    message.StyleInstruction,
                    message.Quality
                );

                string fileName = $"{Guid.NewGuid()}.{fileExtension}";
                string objectKey = $"text-to-voice/{message.UserId:N}/{DateTime.UtcNow:yyyy-MM}/{fileName}";
                
                audioStream.Position = 0;
                string fileUrl = await _mediaService.UploadFileAsync(audioStream, objectKey, contentType);

                history.Status = "completed";
                history.FileUrl = fileUrl;
                history.ResultText = modelName ?? "";
                await _dbContext.SaveChangesAsync();

                await NotifyUserSuccess(message.UserId, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[TextToVoice Task {message.HistoryId}] Failed");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                await _dbContext.SaveChangesAsync();

                if (message.Cost > 0)
                    await _usagePolicy.RefundAsync(message.UserId, message.ChargedWalletTypeId, message.Cost);

                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
