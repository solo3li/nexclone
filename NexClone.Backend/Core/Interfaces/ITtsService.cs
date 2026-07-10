using System.IO;
using System.Threading.Tasks;

namespace NexClone.Backend.Core.Interfaces
{
    public interface ITtsService
    {
        Task<(Stream AudioStream, string ContentType, string FileExtension, string ProviderName, string ModelName)> GenerateAudioAsync(
            string text, 
            string language, 
            string voiceName, 
            string styleInstruction,
            string quality);
    }
}
