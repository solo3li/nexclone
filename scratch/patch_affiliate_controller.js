const fs = require('fs');
const file = 'NexClone.Backend/API/Controllers/Client/AffiliateController.cs';
let content = fs.readFileSync(file, 'utf8');

const original = `            var payouts = await _db.AffiliatePayouts
                .Where(p => p.AffiliateProfileId == profile.Id)
                .OrderByDescending(p => p.RequestedAt)
                .Select(p => new
                {
                    id = p.Id,
                    amount = p.Amount,
                    currency = p.Currency,
                    payoutMethod = p.PayoutMethod,
                    payoutAccount = p.PayoutAccount,
                    status = p.Status,
                    rejectionReason = p.RejectionReason,
                    transferReceiptUrl = p.TransferReceiptUrl,
                    affiliateMessage = p.AffiliateMessage,
                    requestedAt = p.RequestedAt,
                    processedAt = p.ProcessedAt
                })
                .ToListAsync();

            return Ok(payouts);`;

const replacement = `            var payouts = await _db.AffiliatePayouts
                .Where(p => p.AffiliateProfileId == profile.Id)
                .OrderByDescending(p => p.RequestedAt)
                .ToListAsync();

            var result = new System.Collections.Generic.List<object>();
            foreach (var p in payouts)
            {
                string receiptUrl = null;
                if (!string.IsNullOrEmpty(p.TransferReceiptUrl))
                {
                    receiptUrl = await _mediaService.GetFileUrlAsync(p.TransferReceiptUrl);
                }

                result.Add(new
                {
                    id = p.Id,
                    amount = p.Amount,
                    currency = p.Currency,
                    payoutMethod = p.PayoutMethod,
                    payoutAccount = p.PayoutAccount,
                    status = p.Status,
                    rejectionReason = p.RejectionReason,
                    transferReceiptUrl = receiptUrl,
                    affiliateMessage = p.AffiliateMessage,
                    requestedAt = p.RequestedAt,
                    processedAt = p.ProcessedAt
                });
            }

            return Ok(result);`;

content = content.replace(original, replacement);
fs.writeFileSync(file, content);
console.log('Patched AffiliateController');
