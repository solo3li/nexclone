using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexClone.Backend.Services.AI
{
    public class TtsService : ITtsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpClientFactory _httpClientFactory;

        public TtsService(ApplicationDbContext dbContext, IHttpClientFactory httpClientFactory)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
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

            var toolConfig = await _dbContext.ToolConfigurations
                .Include(t => t.RoutingRules)
                .FirstOrDefaultAsync(t => t.ToolName == "text-to-voice" && t.IsActive);
            
            var (providerName, customModelName) = await ResolveProviderAsync(toolConfig, language, quality);

            var apiConfig = await _dbContext.ApiConfigurations.FirstOrDefaultAsync(c => c.ProviderName == providerName && c.IsActive);
            if (apiConfig == null)
                throw new Exception($"No active configuration found for provider '{providerName}'.");

            if (providerName.Equals("Gemini", StringComparison.OrdinalIgnoreCase))
            {
                var result = await GenerateGeminiAudioAsync(text, voiceName, styleInstruction, apiConfig, customModelName);
                return (result.Item1, result.Item2, result.Item3, providerName, customModelName ?? "gemini-2.5-flash-preview-tts");
            }
            else if (providerName.Equals("Darijat", StringComparison.OrdinalIgnoreCase))
            {
                var result = await GenerateDarijatAudioAsync(text, voiceName, styleInstruction, apiConfig);
                return (result.Item1, result.Item2, result.Item3, providerName, customModelName ?? "darijat-voice");
            }
            else
            {
                // Default to OpenAI
                var result = await GenerateOpenAiAudioAsync(text, voiceName, apiConfig, customModelName);
                return (result.Item1, result.Item2, result.Item3, providerName, customModelName ?? "tts-1");
            }
        }

        private async Task<(string ProviderName, string ModelName)> ResolveProviderAsync(ToolConfiguration config, string language, string quality)
        {
            if (config == null || config.RoutingRules == null || !config.RoutingRules.Any())
            {
                // Default logic if no ToolConfiguration or rules are set
                string provider = "OpenAI";
                if (language?.ToLower() == "arabic")
                {
                    bool hasGemini = await _dbContext.ApiConfigurations.AnyAsync(c => c.ProviderName == "Gemini" && c.IsActive);
                    provider = hasGemini ? "Gemini" : "Darijat";
                }
                return (provider, null);
            }

            var rules = config.RoutingRules
                .Where(r => r.QualityLevel == quality)
                .OrderBy(r => r.Id)
                .ToList();

            if (!rules.Any())
            {
                // Fallback to Standard or first available rule if requested quality doesn't exist
                var fallbackRule = config.RoutingRules.FirstOrDefault(r => r.QualityLevel == "Standard") ?? config.RoutingRules.FirstOrDefault();
                if (fallbackRule != null)
                {
                    rules.Add(fallbackRule);
                }
            }

            var today = DateTime.UtcNow.Date;
            var now = DateTime.UtcNow.TimeOfDay;
            var oneMinuteAgo = DateTime.UtcNow.AddMinutes(-1);

            foreach (var rule in rules)
            {
                // Time check
                if (rule.ActiveFromTime.HasValue && rule.ActiveToTime.HasValue)
                {
                    if (rule.ActiveFromTime <= rule.ActiveToTime)
                    {
                        if (now < rule.ActiveFromTime || now > rule.ActiveToTime)
                            continue;
                    }
                    else // wraps around midnight
                    {
                        if (now < rule.ActiveFromTime && now > rule.ActiveToTime)
                            continue;
                    }
                }

                // Quota Check
                if (rule.MaxDailyRequests.HasValue)
                {
                    // Match the model exactly to allow fallback sequence for same tool
                    var dailyCount = await _dbContext.GenerationHistories
                        .CountAsync(h => h.Type == config.ToolName && h.ResultText == rule.ModelName && h.CreatedAt >= today);
                    
                    if (dailyCount >= rule.MaxDailyRequests.Value)
                        continue;
                }

                if (rule.MaxRequestsPerMinute.HasValue)
                {
                    var minuteCount = await _dbContext.GenerationHistories
                        .CountAsync(h => h.Type == config.ToolName && h.ResultText == rule.ModelName && h.CreatedAt >= oneMinuteAgo);

                    if (minuteCount >= rule.MaxRequestsPerMinute.Value)
                        continue;
                }

                return (rule.ProviderName, rule.ModelName);
            }

            throw new Exception("يوجد ضغط حاليا الرجاء التحويل لجودة اخرى او الانتظار حتى يقل الضغط");
        }

        private async Task<(Stream, string, string)> GenerateOpenAiAudioAsync(string text, string voiceName, ApiConfiguration config, string customModelName = null)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {config.ApiKey}");

            var validOpenAiVoices = new[] { "alloy", "echo", "fable", "onyx", "nova", "shimmer" };
            var safeVoiceName = string.IsNullOrWhiteSpace(voiceName) || !validOpenAiVoices.Contains(voiceName.ToLower()) ? "alloy" : voiceName.ToLower();

            var payload = new
            {
                model = string.IsNullOrWhiteSpace(customModelName) ? "tts-1" : customModelName,
                input = text,
                voice = safeVoiceName,
                response_format = "mp3"
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/audio/speech", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API Error: {error}");
            }

            var stream = await response.Content.ReadAsStreamAsync();
            return (stream, "audio/mpeg", "mp3");
        }

        private async Task<(Stream, string, string)> GenerateDarijatAudioAsync(string text, string voiceName, string styleInstruction, ApiConfiguration config)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {config.ApiKey}");
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var payload = new
            {
                text = text,
                voice_name = voiceName,
                human_simulation = true,
                style_instruction = styleInstruction
            };

            var url = config.BaseUrl ?? "https://tts.darijat.com/api/v1/external/generate-audio";
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Darijat API Error: {error}");
            }

            // Darijat can return direct audio or JSON with audio_url
            var contentType = response.Content.Headers.ContentType?.MediaType;

            if (contentType != null && contentType.Contains("application/json"))
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(jsonResponse);
                
                string? audioUrl = null;
                if (jsonDoc.RootElement.TryGetProperty("audio_url", out var urlElement))
                    audioUrl = urlElement.GetString();
                else if (jsonDoc.RootElement.TryGetProperty("url", out var urlProp))
                    audioUrl = urlProp.GetString();

                if (string.IsNullOrEmpty(audioUrl))
                    throw new Exception("Darijat API returned JSON without audio URL.");

                var audioResponse = await client.GetAsync(audioUrl);
                audioResponse.EnsureSuccessStatusCode();
                var stream = await audioResponse.Content.ReadAsStreamAsync();
                return (stream, "audio/mpeg", "mp3");
            }
            else
            {
                var stream = await response.Content.ReadAsStreamAsync();
                return (stream, "audio/mpeg", "mp3");
            }
        }

        private async Task<(Stream, string, string)> GenerateGeminiAudioAsync(string text, string voiceName, string styleInstruction, ApiConfiguration config, string customModelName = null)
        {
            // Resolve Gemini voice from Darijat mapping
            string geminiVoice = "Zephyr";
            var voiceModel = await _dbContext.Voices.FirstOrDefaultAsync(v => v.VoiceName == voiceName);
            if (voiceModel != null && !string.IsNullOrEmpty(voiceModel.GeminiVoice))
            {
                geminiVoice = voiceModel.GeminiVoice;
            }

            var prompt = string.IsNullOrWhiteSpace(styleInstruction) ? 
                $"Read the following text aloud:\n\n{text}" : 
                $"Read the following text aloud in this style: {styleInstruction}\n\n{text}";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("x-goog-api-key", config.ApiKey);

            var modelNamesStr = string.IsNullOrWhiteSpace(customModelName) ? "gemini-2.5-flash-preview-tts" : customModelName; 
            if (string.IsNullOrWhiteSpace(customModelName) && !string.IsNullOrEmpty(config.AdditionalSettings))
            {
                try
                {
                    using var doc = JsonDocument.Parse(config.AdditionalSettings);
                    if (doc.RootElement.TryGetProperty("gemini_model", out var mElement))
                        modelNamesStr = mElement.GetString() ?? modelNamesStr;
                }
                catch { }
            }

            var modelNames = modelNamesStr.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(m => m.Trim()).ToArray();
            Exception lastException = null;

            foreach (var modelName in modelNames)
            {
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
                    lastException = new Exception($"Gemini API Error ({modelName}): {error}");
                    continue; // Try next fallback model
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(jsonResponse);
                
                try
                {
                    var inlineData = jsonDoc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
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
                catch (Exception ex)
                {
                    lastException = new Exception($"Error parsing Gemini response from model {modelName}: {ex.Message}");
                    continue; // Try next fallback model on parse error
                }
            }

            throw lastException ?? new Exception("Gemini API failed with all available fallback models.");
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
