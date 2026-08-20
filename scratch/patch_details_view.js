const fs = require('fs');
const file = 'NexClone.Backend/Views/AffiliateAdmin/Details.cshtml';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    '<th style="padding:0.5rem 0.75rem; text-align:center; background:#e0e0e0;">Available At</th>',
    '<th style="padding:0.5rem 0.75rem; text-align:center; background:#e0e0e0;">Available At</th>\n                <th style="padding:0.5rem 0.75rem; text-align:center; background:#e0e0e0;">Actions</th>'
);

const oldRowEnd = `                    <td style="padding:0.5rem 0.75rem; text-align:center; font-size:0.75rem;">@c.AvailableAt.ToShortDateString()</td>
                </tr>`;

const newRowEnd = `                    <td style="padding:0.5rem 0.75rem; text-align:center; font-size:0.75rem;">@c.AvailableAt.ToShortDateString()</td>
                    <td style="padding:0.5rem 0.75rem; text-align:center;">
                        <form asp-action="UpdateCommissionStatus" method="post" style="display:flex; gap:0.5rem; justify-content:center; align-items:center;">
                            <input type="hidden" name="commissionId" value="@c.Id" />
                            <select name="newStatus" style="padding:0.25rem; font-size:0.75rem; border:1px solid #ccc;">
                                @foreach(var s in new[] { "PENDING", "AVAILABLE", "PAID", "CANCELLED", "REVERSED" })
                                {
                                    if (c.Status == s) {
                                        <option value="@s" selected>@s</option>
                                    } else {
                                        <option value="@s">@s</option>
                                    }
                                }
                            </select>
                            <button type="submit" class="bx--btn bx--btn--primary bx--btn--sm" style="min-height:unset; padding:0.25rem 0.5rem; font-size:0.75rem;">Update</button>
                        </form>
                    </td>
                </tr>`;

content = content.replace(oldRowEnd, newRowEnd);

fs.writeFileSync(file, content);
console.log('Patched view');
