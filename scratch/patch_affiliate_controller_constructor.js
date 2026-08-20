const fs = require('fs');
const file = 'NexClone.Backend/API/Controllers/Client/AffiliateController.cs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'private readonly ApplicationDbContext _db;',
    'private readonly ApplicationDbContext _db;\n        private readonly NexClone.Backend.Application.Services.IMediaService _mediaService;'
);

content = content.replace(
    'public AffiliateController(AffiliateService affiliateService, ApplicationDbContext db)',
    'public AffiliateController(AffiliateService affiliateService, ApplicationDbContext db, NexClone.Backend.Application.Services.IMediaService mediaService)'
);

content = content.replace(
    '_db = db;',
    '_db = db;\n            _mediaService = mediaService;'
);

fs.writeFileSync(file, content);
console.log('Patched constructor');
