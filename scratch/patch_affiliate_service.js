const fs = require('fs');
const file = 'NexClone.Backend/Application/Services/AffiliateService.cs';
let content = fs.readFileSync(file, 'utf8');

// Patch SaveSettingsAsync
content = content.replace(
    'await UpsertSettingAsync(KEY_MIN_USD, dto.MinPayoutUsd.ToString("F2"), "Minimum payout amount in USD");\n            await UpsertSettingAsync(KEY_MIN_EGP, dto.MinPayoutEgp.ToString("F2"), "Minimum payout amount in EGP");',
    'await UpsertSettingAsync(KEY_MIN_USD, dto.MinPayoutUsd.ToString("F2", System.Globalization.CultureInfo.InvariantCulture), "Minimum payout amount in USD");\n            await UpsertSettingAsync(KEY_MIN_EGP, dto.MinPayoutEgp.ToString("F2", System.Globalization.CultureInfo.InvariantCulture), "Minimum payout amount in EGP");'
);

// Patch GetDecimal
content = content.replace(
    '=> d.TryGetValue(key, out var v) && decimal.TryParse(v, out var n) ? n : def;',
    '=> d.TryGetValue(key, out var v) && decimal.TryParse(v, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var n) ? n : def;'
);

fs.writeFileSync(file, content);
console.log('Patched AffiliateService');
