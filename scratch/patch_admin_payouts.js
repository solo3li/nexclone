const fs = require('fs');
const file = 'NexClone.Backend/Views/AffiliateAdmin/PayoutRequests.cshtml';
let content = fs.readFileSync(file, 'utf8');

const originalLink = `@if (!string.IsNullOrEmpty(payout.TransferReceiptUrl))
                        {
                            <div style="margin-top:4px;"><a href="@Url.Action("ViewReceipt", "AffiliateAdmin", new { id = payout.Id })" target="_blank" style="font-size:0.75rem; color:#0f62fe; text-decoration:underline;">View Receipt</a></div>
                        }`;

const replacementImage = `@if (!string.IsNullOrEmpty(payout.TransferReceiptUrl))
                        {
                            <div style="margin-top:8px; display:flex; justify-content:center;">
                                <a href="@Url.Action("ViewReceipt", "AffiliateAdmin", new { id = payout.Id })" target="_blank" style="display:block; border:1px solid #e0e0e0; border-radius:4px; overflow:hidden; width:80px; height:80px; position:relative;">
                                    <img src="@Url.Action("ViewReceipt", "AffiliateAdmin", new { id = payout.Id })" alt="Receipt" style="width:100%; height:100%; object-fit:cover;" />
                                </a>
                            </div>
                        }`;

content = content.replace(originalLink, replacementImage);
fs.writeFileSync(file, content);
console.log('Patched PayoutRequests.cshtml');
