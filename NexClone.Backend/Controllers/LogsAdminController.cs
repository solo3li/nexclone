using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class LogsAdminController : Controller
    {
        public async Task<IActionResult> Index()
        {
            var logsDir = Path.Combine(Directory.GetCurrentDirectory(), "logs");
            string logs = "Log file not found or empty.";
            string logFilePath = null;

            if (Directory.Exists(logsDir))
            {
                var files = Directory.GetFiles(logsDir, "system*.log");
                if (files.Length > 0)
                {
                    logFilePath = files.OrderByDescending(f => System.IO.File.GetLastWriteTime(f)).First();
                }
            }

            if (logFilePath != null && System.IO.File.Exists(logFilePath))
            {
                try
                {
                    // Read last 1000 lines
                    using var stream = new FileStream(logFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                    using var reader = new StreamReader(stream);
                    var allText = await reader.ReadToEndAsync();
                    var lines = allText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    
                    if (lines.Length > 1000)
                    {
                        logs = string.Join("\n", lines[^1000..]);
                    }
                    else
                    {
                        logs = string.Join("\n", lines);
                    }
                }
                catch (System.Exception ex)
                {
                    logs = $"Error reading log file: {ex.Message}";
                }
            }

            return View("Index", logs);
        }
        
        [HttpPost]
        public IActionResult ClearLogs()
        {
            var logsDir = Path.Combine(Directory.GetCurrentDirectory(), "logs");
            if (Directory.Exists(logsDir))
            {
                var files = Directory.GetFiles(logsDir, "system*.log");
                foreach (var file in files)
                {
                    try
                    {
                        using var stream = new FileStream(file, FileMode.Truncate, FileAccess.Write, FileShare.ReadWrite);
                    }
                    catch { }
                }
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
