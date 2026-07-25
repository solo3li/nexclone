using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;
using NexClone.Backend.Localization;

namespace NexClone.Backend.Filters
{
    public class CrudSuccessMessageFilter : IActionFilter
    {
        private readonly IStringLocalizer<SharedResource> _localizer;

        public CrudSuccessMessageFilter(IStringLocalizer<SharedResource> localizer)
        {
            _localizer = localizer;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Do nothing before action
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Only care about POST, PUT, DELETE
            var request = context.HttpContext.Request;
            if (request.Method == "POST" || request.Method == "PUT" || request.Method == "DELETE")
            {
                // Check if the result is a redirect (which typically happens after a successful CRUD operation)
                if (context.Exception == null && (context.Result is RedirectToActionResult || context.Result is RedirectResult || context.Result is LocalRedirectResult))
                {
                    if (context.Controller is Controller controller)
                    {
                        // Check if a success or error message is already set
                        if (controller.TempData["SuccessMessage"] == null && 
                            controller.TempData["Success"] == null &&
                            controller.TempData["ErrorMessage"] == null && 
                            controller.TempData["Error"] == null)
                        {
                            // If no message was set, set a generic success message
                            controller.TempData["SuccessMessage"] = _localizer["Operation completed successfully."].Value ?? "Operation completed successfully.";
                        }
                    }
                }
            }
        }
    }
}
