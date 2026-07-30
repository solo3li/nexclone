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
    public class VttConsumer : BaseAiTaskConsumer, IConsumer<VoiceToTextMessage>
    {
        public VttConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<VttConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(ConsumeContext<VoiceToTextMessage> context)
        {
            var message = context.Message;
            _logger.LogInformation($"[VoiceToText Task {message.HistoryId}] Started consumer.");

            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                byte[] audioData = await _mediaService.DownloadFileAsync(message.FileId);

                var result = await _sttService.TranscribeAudioAsync(audioData, message.FileId, "audio/mpeg", message.Translate, message.TargetLanguage);

                if (!result.Success)
                    throw new Exception(result.ErrorMessage);

                history.Status = "completed";
                history.ResultText = message.Translate ? result.TranslatedText : result.OriginalText;
                await _dbContext.SaveChangesAsync();

                await NotifyUserSuccess(message.UserId, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[VoiceToText Task {message.HistoryId}] Failed");
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
