const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    const newSection = `
        <h4 style="margin-bottom: 1.5rem; font-weight: 400; font-size: 1.1rem;">@Localizer["Video & Image Generation Settings"]</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; background: #f4f4f4; padding: 1.5rem;">
            <div class="bx--form-item bx--checkbox-wrapper">
                <input type="checkbox" id="TextToVideoEnabled" name="TextToVideoEnabled" value="true" class="bx--checkbox" @(Model?.TextToVideoEnabled != false ? "checked" : "") />
                <label for="TextToVideoEnabled" class="bx--checkbox-label">
                    <span class="bx--checkbox-label-text" style="font-weight: bold;">@Localizer["Enable Text-to-Video"]</span>
                </label>
                <input type="hidden" name="TextToVideoEnabled" value="false" />
            </div>
            
            <div class="bx--form-item bx--checkbox-wrapper">
                <input type="checkbox" id="ImageToVideoEnabled" name="ImageToVideoEnabled" value="true" class="bx--checkbox" @(Model?.ImageToVideoEnabled != false ? "checked" : "") />
                <label for="ImageToVideoEnabled" class="bx--checkbox-label">
                    <span class="bx--checkbox-label-text" style="font-weight: bold;">@Localizer["Enable Image-to-Video"]</span>
                </label>
                <input type="hidden" name="ImageToVideoEnabled" value="false" />
            </div>
            
            <div class="bx--form-item bx--checkbox-wrapper">
                <input type="checkbox" id="ReferenceToVideoEnabled" name="ReferenceToVideoEnabled" value="true" class="bx--checkbox" @(Model?.ReferenceToVideoEnabled != false ? "checked" : "") />
                <label for="ReferenceToVideoEnabled" class="bx--checkbox-label">
                    <span class="bx--checkbox-label-text" style="font-weight: bold;">@Localizer["Enable Reference-to-Video"]</span>
                </label>
                <input type="hidden" name="ReferenceToVideoEnabled" value="false" />
            </div>
            
            <div class="bx--form-item bx--checkbox-wrapper">
                <input type="checkbox" id="TextToImageEnabled" name="TextToImageEnabled" value="true" class="bx--checkbox" @(Model?.TextToImageEnabled != false ? "checked" : "") />
                <label for="TextToImageEnabled" class="bx--checkbox-label">
                    <span class="bx--checkbox-label-text" style="font-weight: bold;">@Localizer["Enable Text-to-Image"]</span>
                </label>
                <input type="hidden" name="TextToImageEnabled" value="false" />
            </div>
        </div>
`;

    const targetRegex = /<h4 style="margin-bottom: 1\.5rem; font-weight: 400; font-size: 1\.1rem;">@Localizer\["Avatar Video & Lip-Sync Settings"\]<\/h4>/;
    
    if (content.match(targetRegex) && content.indexOf('Video & Image Generation Settings') === -1) {
        content = content.replace(targetRegex, newSection + '\n        ' + content.match(targetRegex)[0]);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Patched ' + file);
    }
}

patchFile('c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\PlansAdmin\\Create.cshtml');
patchFile('c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\PlansAdmin\\Edit.cshtml');
