using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.API.Controllers.AI
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class VoicesController : Controller
    {
        private readonly NexClone.Backend.Core.Interfaces.ITtsCatalogService _ttsCatalog;

        public VoicesController(NexClone.Backend.Core.Interfaces.ITtsCatalogService ttsCatalog)
        {
            _ttsCatalog = ttsCatalog;
        }

        public IActionResult Index()
        {
            var voices = _ttsCatalog.GetAllVoices(includeInactive: true).OrderBy(v => v.Order).ToList();
            return View(voices);
        }
    }
}
