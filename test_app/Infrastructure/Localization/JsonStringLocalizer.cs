using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.Extensions.Localization;

namespace NexClone.Backend.Infrastructure.Localization
{
    public class JsonStringLocalizer : IStringLocalizer
    {
        private readonly string _resourcesPath;
        private readonly string _culture;
        private readonly ConcurrentDictionary<string, string> _localizationCache;

        public JsonStringLocalizer(string resourcesPath, string culture)
        {
            _resourcesPath = resourcesPath;
            _culture = culture;
            _localizationCache = new ConcurrentDictionary<string, string>();
            LoadTranslations();
        }

        private void LoadTranslations()
        {
            var filePath = Path.Combine(_resourcesPath, $"{_culture}.json");
            if (!File.Exists(filePath))
            {
                // Fallback to English if file doesn't exist
                filePath = Path.Combine(_resourcesPath, "en.json");
            }

            if (File.Exists(filePath))
            {
                var json = File.ReadAllText(filePath);
                var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
                if (dict != null)
                {
                    foreach (var kvp in dict)
                    {
                        _localizationCache[kvp.Key] = kvp.Value;
                    }
                }
            }
        }

        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        {
            return _localizationCache.Select(kvp => new LocalizedString(kvp.Key, kvp.Value, false));
        }

        private string? GetString(string name)
        {
            if (_localizationCache.TryGetValue(name, out var value))
            {
                return value;
            }
            return null; // Return null so we can default to the key
        }
    }
}
