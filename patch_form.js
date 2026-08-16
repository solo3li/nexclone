const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\ToolConfigAdmin\\Edit.cshtml';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('onsubmit="disableSubmit"')) {
    content = content.replace(/<form\s+asp-action="SaveConfig"\s+method="post">/g, `<form asp-action="SaveConfig" method="post" onsubmit="this.querySelector('button[type=submit]').disabled = true; this.querySelector('button[type=submit]').innerText = 'Saving...';">`);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched form");
}
