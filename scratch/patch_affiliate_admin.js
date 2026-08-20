const fs = require('fs');
const file = 'NexClone.Backend/API/Controllers/Admin/AffiliateAdminController.cs';
let content = fs.readFileSync(file, 'utf8');

const injection = `
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCommissionStatus(int commissionId, string newStatus)
        {
            var commission = await _db.AffiliateCommissions.FindAsync(commissionId);
            if (commission == null) return NotFound();

            commission.Status = newStatus.ToUpperInvariant();
            await _db.SaveChangesAsync();

            TempData["Success"] = $"Commission #{commissionId} status updated to {newStatus}.";
            return RedirectToAction(nameof(Details), new { id = commission.AffiliateProfileId });
        }

        // ─── Payout Requests ─────────────────────────────────────────────────`;

content = content.replace('// ─── Payout Requests ─────────────────────────────────────────────────', injection);
fs.writeFileSync(file, content);
console.log('Patched backend controller');
