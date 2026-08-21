using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using NexClone.Backend.Core.Catalogs;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.Application.Services
{
    public class TtsCatalogService : ITtsCatalogService
    {
        private readonly List<VoiceCatalogItem> _voices = new();
        private readonly List<OptionCatalogItem> _dialects = new();
        private readonly List<OptionCatalogItem> _emotions = new();
        private readonly List<OptionCatalogItem> _styles = new();

        public TtsCatalogService(IWebHostEnvironment env)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            
            string basePath = Path.Combine(env.ContentRootPath, "Data", "Catalogs");

            if (!Directory.Exists(basePath))
            {
                throw new DirectoryNotFoundException($"Catalogs directory not found at {basePath}");
            }

            _voices = LoadCatalog<VoiceCatalogItem>(Path.Combine(basePath, "tts_voices.json"), options);
            _dialects = LoadCatalog<OptionCatalogItem>(Path.Combine(basePath, "tts_dialects.json"), options);
            _emotions = LoadCatalog<OptionCatalogItem>(Path.Combine(basePath, "tts_emotions.json"), options);
            _styles = LoadCatalog<OptionCatalogItem>(Path.Combine(basePath, "tts_styles.json"), options);
            
            ValidateUnique(_voices, v => v.Id, "Voices ID");
            ValidateUnique(_voices, v => v.VoiceName, "Voices VoiceName");
            
            ValidateUnique(_dialects, d => d.Id, "Dialects ID");
            ValidateUnique(_dialects, d => d.Value, "Dialects Value");
            
            ValidateUnique(_emotions, e => e.Id, "Emotions ID");
            ValidateUnique(_emotions, e => e.Value, "Emotions Value");
            
            ValidateUnique(_styles, s => s.Id, "Styles ID");
            ValidateUnique(_styles, s => s.Value, "Styles Value");
        }

        private List<T> LoadCatalog<T>(string filePath, JsonSerializerOptions options)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Required TTS catalog file missing: {filePath}");
            }
            
            var json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<T>>(json, options) ?? new List<T>();
        }

        private void ValidateUnique<T>(IEnumerable<T> collection, Func<T, string> keySelector, string fieldName)
        {
            var duplicates = collection
                .GroupBy(keySelector)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicates.Any())
            {
                throw new InvalidDataException($"Duplicate {fieldName} found in TTS catalog: {string.Join(", ", duplicates)}");
            }
        }

        public IReadOnlyList<VoiceCatalogItem> GetAllVoices(bool includeInactive = false)
        {
            return includeInactive ? _voices.AsReadOnly() : _voices.Where(v => v.IsActive).ToList().AsReadOnly();
        }

        public VoiceCatalogItem? GetVoiceByName(string voiceName)
        {
            return _voices.FirstOrDefault(v => v.VoiceName.Equals(voiceName, StringComparison.OrdinalIgnoreCase));
        }

        public bool IsValidVoice(string voiceName)
        {
            return _voices.Any(v => v.VoiceName.Equals(voiceName, StringComparison.OrdinalIgnoreCase) && v.IsActive);
        }

        public IReadOnlyList<OptionCatalogItem> GetAllDialects(bool includeInactive = false)
        {
            return includeInactive ? _dialects.AsReadOnly() : _dialects.Where(d => d.IsActive).ToList().AsReadOnly();
        }

        public IReadOnlyList<OptionCatalogItem> GetAllEmotions(bool includeInactive = false)
        {
            return includeInactive ? _emotions.AsReadOnly() : _emotions.Where(e => e.IsActive).ToList().AsReadOnly();
        }

        public IReadOnlyList<OptionCatalogItem> GetAllStyles(bool includeInactive = false)
        {
            return includeInactive ? _styles.AsReadOnly() : _styles.Where(s => s.IsActive).ToList().AsReadOnly();
        }
    }
}
