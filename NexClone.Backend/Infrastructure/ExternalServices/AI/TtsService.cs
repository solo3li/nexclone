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
                    // Threshold exceeded, force Medium quality (Fallback)
                    quality = "Medium";
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
                quality.Equals("High", StringComparison.OrdinalIgnoreCase) ? "gemini-2.5-flash-preview-tts" :
                quality.Equals("Medium", StringComparison.OrdinalIgnoreCase) ? "gemini-2.5-flash-preview-tts" :
                "gemini-2.5-flash-preview-tts"
            );

            var isArabic = string.Equals(language, "arabic", StringComparison.OrdinalIgnoreCase);
            var darijatConfig = await _dbContext.ApiConfigurations.FirstOrDefaultAsync(c => c.ProviderName == "Darijat" && c.IsActive);
            var geminiConfig = await _dbContext.ApiConfigurations.FirstOrDefaultAsync(c => c.ProviderName == "Gemini" && c.IsActive);
            var openAiConfig = await _dbContext.ApiConfigurations.FirstOrDefaultAsync(c => c.ProviderName == "OpenAI" && c.IsActive);

            // 1. If Arabic and Darijat configured, try Darijat
            if (isArabic && darijatConfig != null && !string.IsNullOrWhiteSpace(darijatConfig.ApiKey))
            {
                try
                {
                    var (dStream, dType, dExt) = await GenerateDarijatAudioAsync(text, voiceName, styleInstruction, darijatConfig);
                    return (dStream, dType, dExt, "Darijat", "darijat-voice");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[TTS] Darijat generation error: {ex.Message}. Falling back to Gemini...");
                }
            }

            // 2. Gemini
            if (geminiConfig != null && !string.IsNullOrWhiteSpace(geminiConfig.ApiKey))
            {
                try
                {
                    var (gStream, gType, gExt) = await GenerateGeminiAudioAsync(text, voiceName, styleInstruction, geminiConfig, modelName);
                    return (gStream, gType, gExt, "Gemini", modelName);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[TTS] Gemini generation error: {ex.Message}. Falling back to OpenAI if available...");
                    if (openAiConfig == null) throw;
                }
            }

            // 3. OpenAI Fallback
            if (openAiConfig != null && !string.IsNullOrWhiteSpace(openAiConfig.ApiKey))
            {
                var (oStream, oType, oExt) = await GenerateOpenAiAudioAsync(text, voiceName, openAiConfig, null);
                return (oStream, oType, oExt, "OpenAI", "tts-1");
            }

            throw new Exception("No active TTS provider configured or all providers failed.");
        }

        private async Task<(Stream, string, string)> GenerateOpenAiAudioAsync(string text, string voiceName, ApiConfiguration config, string customModelName = null)
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(300);
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
            client.Timeout = TimeSpan.FromSeconds(300);
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
            var validGeminiVoices = new[] { "Puck", "Charon", "Kore", "Fenrir", "Aoede" };
            string geminiVoice = "Puck";

            var voiceModel = await _dbContext.Voices.FirstOrDefaultAsync(v => v.VoiceName == voiceName || v.Name == voiceName);
            if (voiceModel != null && !string.IsNullOrEmpty(voiceModel.GeminiVoice) && validGeminiVoices.Contains(voiceModel.GeminiVoice))
            {
                geminiVoice = voiceModel.GeminiVoice;
            }
            else if (voiceModel != null && voiceModel.Gender?.ToLower() == "female")
            {
                geminiVoice = "Aoede";
            }

            var prompt = string.IsNullOrWhiteSpace(styleInstruction) ? 
                $"Read the following text aloud:\n\n{text}" : 
                $"Read the following text aloud in this style: {styleInstruction}\n\n{text}";

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(300);
            client.DefaultRequestHeaders.Add("x-goog-api-key", config.ApiKey);

            // Construct list of model candidates to try with graceful fallbacks
            var modelNames = new List<string>();
            if (!string.IsNullOrWhiteSpace(customModelName))
            {
                var parts = customModelName.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(m => m.Trim());
                foreach (var p in parts)
                {
                    if (!modelNames.Contains(p)) modelNames.Add(p);
                }
            }
            
            if (!modelNames.Contains("gemini-2.5-flash-preview-tts")) modelNames.Add("gemini-2.5-flash-preview-tts");
            if (!modelNames.Contains("gemini-2.0-flash")) modelNames.Add("gemini-2.0-flash");
            if (!modelNames.Contains("gemini-2.5-flash")) modelNames.Add("gemini-2.5-flash");

            Exception lastException = null;

            foreach (var modelName in modelNames)
            {
                try
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
                        continue;
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
                catch (Exception ex)
                {
                    Console.WriteLine($"[Gemini TTS Error on {modelName}]: {ex.Message}");
                    lastException = ex;
                    continue; // Try next fallback model
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
