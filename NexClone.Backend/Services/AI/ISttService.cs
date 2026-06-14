using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace NexClone.Backend.Services.AI
{
    public interface ISttService
    {
        Task<SttResult> TranscribeAudioAsync(IFormFile audioFile, bool translate, string targetLanguage);
    }

    public class SttResult
    {
        public bool Success { get; set; }
        public string? OriginalText { get; set; }
        public string? TranslatedText { get; set; }
        public string? TargetLanguage { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
