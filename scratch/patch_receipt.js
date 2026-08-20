const fs = require('fs');
const file = 'NexClone.Backend/API/Controllers/Admin/AffiliateAdminController.cs';
let content = fs.readFileSync(file, 'utf8');

const injection = `
        [HttpGet]
        public async Task<IActionResult> ViewReceipt(int id)
        {
            var payout = await _db.AffiliatePayouts.FindAsync(id);
            if (payout == null || string.IsNullOrEmpty(payout.TransferReceiptUrl)) return NotFound();
            
            var url = await _mediaService.GetFileUrlAsync(payout.TransferReceiptUrl);
            return Redirect(url);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdatePayoutStatus(int id, string newStatus, string? rejectionReason = null, IFormFile? receipt = null)`;

content = content.replace(
    '[HttpPost]\n        [ValidateAntiForgeryToken]\n        public async Task<IActionResult> UpdatePayoutStatus(int id, string newStatus, string? rejectionReason = null, IFormFile? receipt = null)',
    injection
);

fs.writeFileSync(file, content);

const viewFile = 'NexClone.Backend/Views/AffiliateAdmin/PayoutRequests.cshtml';
let viewContent = fs.readFileSync(viewFile, 'utf8');
viewContent = viewContent.replace(
    '<a href="@payout.TransferReceiptUrl"',
    '<a href="@Url.Action("ViewReceipt", "AffiliateAdmin", new { id = payout.Id })"'
);
fs.writeFileSync(viewFile, viewContent);

console.log('Patched receipt viewing logic');
