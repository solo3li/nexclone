using Microsoft.Extensions.Localization;
using System.Globalization;

namespace NexClone.Backend.Infrastructure.Localization
{
    public class JsonStringLocalizerFactory : IStringLocalizerFactory
    {
        private readonly string _resourcesPath;

        public JsonStringLocalizerFactory(IWebHostEnvironment env)
        {
            _resourcesPath = Path.Combine(env.ContentRootPath, "Resources");
        }

        public IStringLocalizer Create(Type resourceSource)
        {
            return new JsonStringLocalizer(_resourcesPath, CultureInfo.CurrentUICulture.Name);
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            return new JsonStringLocalizer(_resourcesPath, CultureInfo.CurrentUICulture.Name);
        }
    }
}
