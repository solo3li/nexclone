using System.Collections.Generic;
using NexClone.Backend.Core.Catalogs;

namespace NexClone.Backend.Core.Interfaces
{
    public interface ITtsCatalogService
    {
        IReadOnlyList<VoiceCatalogItem> GetAllVoices(bool includeInactive = false);
        VoiceCatalogItem? GetVoiceByName(string voiceName);
        bool IsValidVoice(string voiceName);

        IReadOnlyList<OptionCatalogItem> GetAllDialects(bool includeInactive = false);
        IReadOnlyList<OptionCatalogItem> GetAllEmotions(bool includeInactive = false);
        IReadOnlyList<OptionCatalogItem> GetAllStyles(bool includeInactive = false);
    }
}
