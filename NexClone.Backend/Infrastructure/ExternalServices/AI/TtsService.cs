using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices.AI
{
    public class TtsService : ITtsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly NexClone.Backend.Core.Interfaces.ITtsCatalogService _ttsCatalog;

        public TtsService(ApplicationDbContext dbContext, IHttpClientFactory httpClientFactory, NexClone.Backend.Core.Interfaces.ITtsCatalogService ttsCatalog)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
            _ttsCatalog = ttsCatalog;
        }

        public async Task<(Stream AudioStream, string ContentType, string FileExtension, string ProviderName, string ModelName)> GenerateAudioAsync(
            string text, 
            string language, 
            string voiceName, 
            string styleInstruction,
            string quality = "Standard")
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new ArgumentException("Text cannot be empty.");

            bool useFallbackModel = false;
            // --- Quota-based Fallback Routing (Only for High Quality) ---
            var ttsSettings = await _dbContext.TextToVoiceSettings.FirstOrDefaultAsync();
            if (quality.Equals("High", StringComparison.OrdinalIgnoreCase) && ttsSettings != null && ttsSettings.FallbackThresholdLimit.HasValue && ttsSettings.FallbackThresholdLimit.Value > 0)
            {
                var now = DateTime.UtcNow;
                
                // Reset counter if duration has passed
                if (ttsSettings.FallbackResetDurationHours.HasValue && ttsSettings.LastResetDate.HasValue)
                {
                    if ((now - ttsSettings.LastResetDate.Value).TotalHours >= ttsSettings.FallbackResetDurationHours.Value)
                    {
                        ttsSettings.CurrentPrimaryRequestCount = 0;
                        ttsSettings.LastResetDate = now;
                    }
                }
                else if (!ttsSettings.LastResetDate.HasValue)
                {
                    ttsSettings.LastResetDate = now;
                }

                if (ttsSettings.CurrentPrimaryRequestCount >= ttsSettings.FallbackThresholdLimit.Value)
                {
                    // Threshold exceeded, force fallback model
                    useFallbackModel = true;
                }
                else
                {
                    // Threshold not exceeded, keep High quality (Primary) and increment counter
                    ttsSettings.CurrentPrimaryRequestCount++;
                }
                await _dbContext.SaveChangesAsync();
            }
            // -------------------------------------

            // Resolve model based on quality from dedicated pricing table
            var pricing = await _dbContext.TextToVoiceModelPricings
                .FirstOrDefaultAsync(p => p.QualityLevel.ToLower() == quality.ToLower() && p.IsActive);

            string modelName = pricing?.ModelName ?? (
                quality.Equals("High", StringComparison.OrdinalIgnoreCase) ? "gemini-3.1-flash-tts-preview" :
                "gemini-2.5-flash-preview-tts"
            );

            if (useFallbackModel)
            {
                modelName = "gemini-2.5-pro-preview-tts";
            }

            var geminiConfig = await _dbContext.ApiConfigurations.FirstOrDefaultAsync(c => c.ProviderName == "Gemini" && c.IsActive);
            
            if (geminiConfig == null || string.IsNullOrWhiteSpace(geminiConfig.ApiKey))
            {
                throw new Exception("Gemini API is not configured or active.");
            }

            var (gStream, gType, gExt) = await GenerateGeminiAudioAsync(text, voiceName, styleInstruction, geminiConfig, modelName);
            return (gStream, gType, gExt, "Gemini", modelName);
        }


        private async Task<(Stream, string, string)> GenerateGeminiAudioAsync(string text, string voiceName, string styleInstruction, ApiConfiguration config, string customModelName = null)
        {
            string geminiVoice = "Puck"; // default

            var voiceModel = _ttsCatalog.GetVoiceByName(voiceName);
            if (voiceModel != null && !string.IsNullOrEmpty(voiceModel.GeminiVoice))
            {
                geminiVoice = voiceModel.GeminiVoice;
            }
            else if (voiceModel != null && voiceModel.Gender?.ToLower() == "female")
            {
                geminiVoice = "Aoede"; // fallback for female if no specific GeminiVoice
            }

            var prompt = string.IsNullOrWhiteSpace(styleInstruction) ? 
                $"Read the following text aloud:\n\n{text}" : 
                $"Read the following text aloud in this style: {styleInstruction}\n\n{text}";

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(300);
            client.DefaultRequestHeaders.Add("x-goog-api-key", config.ApiKey);

            string modelName = string.IsNullOrWhiteSpace(customModelName) ? "gemini-3.1-flash-tts-preview" : customModelName.Split(',')[0].Trim();

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent";
            
            var payload = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                },
                generationConfig = new
                {
                    responseModalities = new[] { "AUDIO" },
                    speechConfig = new
                    {
                        voiceConfig = new
                        {
                            prebuiltVoiceConfig = new { voiceName = geminiVoice }
                        }
                    }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error ({modelName}): {error}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(jsonResponse);
            
            var candidates = jsonDoc.RootElement.GetProperty("candidates");
            if (candidates.GetArrayLength() > 0)
            {
                var candidate = candidates[0];
                if (candidate.TryGetProperty("finishReason", out var finishReason))
                {
                    if (finishReason.GetString() == "OTHER" && !candidate.TryGetProperty("content", out _))
                    {
                        throw new Exception($"Gemini model '{modelName}' finished with OTHER (no audio produced).");
                    }
                }

                if (!candidate.TryGetProperty("content", out var contentElem))
                    throw new Exception("Candidate missing content property.");

                var inlineData = contentElem
                    .GetProperty("parts")[0]
                    .GetProperty("inlineData");
                
                var base64Audio = inlineData.GetProperty("data").GetString();
                if (string.IsNullOrEmpty(base64Audio))
                    throw new Exception("Gemini API returned empty audio data.");

                var audioBytes = Convert.FromBase64String(base64Audio);
                var mimeType = inlineData.GetProperty("mimeType").GetString() ?? "";
                
                if (mimeType.ToLowerInvariant().Contains("audio/l16") || mimeType.ToLowerInvariant().Contains("pcm"))
                {
                    var wavBytes = PcmToWav(audioBytes, 24000, 1, 16);
                    return (new MemoryStream(wavBytes), "audio/wav", "wav");
                }
                else if (mimeType.ToLowerInvariant().Contains("ogg"))
                {
                    return (new MemoryStream(audioBytes), "audio/ogg", "ogg");
                }
                else if (mimeType.ToLowerInvariant().Contains("wav"))
                {
                    return (new MemoryStream(audioBytes), "audio/wav", "wav");
                }
                else if (mimeType.ToLowerInvariant().Contains("mpeg") || mimeType.ToLowerInvariant().Contains("mp3"))
                {
                    return (new MemoryStream(audioBytes), "audio/mpeg", "mp3");
                }
                
                string ext = mimeType.Split('/').LastOrDefault()?.Split(';').FirstOrDefault() ?? "bin";
                return (new MemoryStream(audioBytes), mimeType, ext);
            }
            throw new Exception("Gemini API returned no candidates.");
        }

        private static byte[] PcmToWav(byte[] pcmData, int sampleRate, int channels, int bitsPerSample)
        {
            using var ms = new MemoryStream();
            using var writer = new BinaryWriter(ms);
            
            int dataSize = pcmData.Length;
            int byteRate = sampleRate * channels * (bitsPerSample / 8);
            short blockAlign = (short)(channels * (bitsPerSample / 8));

            writer.Write(Encoding.ASCII.GetBytes("RIFF"));
            writer.Write(36 + dataSize);
            writer.Write(Encoding.ASCII.GetBytes("WAVE"));
            writer.Write(Encoding.ASCII.GetBytes("fmt "));
            writer.Write(16); // Subchunk1Size
            writer.Write((short)1); // AudioFormat (PCM)
            writer.Write((short)channels);
            writer.Write(sampleRate);
            writer.Write(byteRate);
            writer.Write(blockAlign);
            writer.Write((short)bitsPerSample);
            writer.Write(Encoding.ASCII.GetBytes("data"));
            writer.Write(dataSize);
            writer.Write(pcmData);

            return ms.ToArray();
        }
    }
}
