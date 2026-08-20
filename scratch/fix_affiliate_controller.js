const fs = require('fs');
const file = 'NexClone.Backend/API/Controllers/Client/AffiliateController.cs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'NexClone.Backend.Application.Services.IMediaService',
    'NexClone.Backend.Core.Interfaces.IMediaService'
);
content = content.replace(
    'NexClone.Backend.Application.Services.IMediaService',
    'NexClone.Backend.Core.Interfaces.IMediaService'
);

fs.writeFileSync(file, content);
console.log('Fixed interface namespace');
