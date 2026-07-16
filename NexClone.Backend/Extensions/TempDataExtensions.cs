using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Localization;

namespace NexClone.Backend.Extensions
{
    public static class TempDataExtensions
    {
        public static void SetSuccessMessage(this ITempDataDictionary tempData, HttpContext context, string message)
        {
            var localizer = context.RequestServices.GetRequiredService<IStringLocalizer<SharedResource>>();
            tempData["SuccessMessage"] = localizer[message].Value;
        }

        public static void SetErrorMessage(this ITempDataDictionary tempData, HttpContext context, string message)
        {
            var localizer = context.RequestServices.GetRequiredService<IStringLocalizer<SharedResource>>();
            tempData["ErrorMessage"] = localizer[message].Value;
        }
    }
}
