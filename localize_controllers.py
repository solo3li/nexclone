import os
import re
import json

controllers_dir = 'NexClone.Backend/API/Controllers/Admin'
en_json_path = 'NexClone.Backend/Resources/en.json'
ar_json_path = 'NexClone.Backend/Resources/ar.json'

en_dict = {}
if os.path.exists(en_json_path):
    with open(en_json_path, 'r', encoding='utf-8') as f:
        en_dict = json.load(f)

ar_dict = {}
if os.path.exists(ar_json_path):
    with open(ar_json_path, 'r', encoding='utf-8') as f:
        ar_dict = json.load(f)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Regex to find TempData["SuccessMessage"] = "literal"; or TempData["ErrorMessage"] = "literal";
    # We only handle literal strings for now to be safe
    pattern = re.compile(r'TempData\["(SuccessMessage|ErrorMessage)"\]\s*=\s*"([^"]+)";')
    
    def repl(match):
        key_type = match.group(1)
        text = match.group(2)
        
        # Add to dictionary
        if text not in en_dict:
            en_dict[text] = text
        if text not in ar_dict:
            # We'll put English in Arabic to translate later, or guess it
            ar_dict[text] = text

        # Inline service locator for localization
        return f'TempData["{key_type}"] = HttpContext.RequestServices.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource>>()["{text}"];'

    content = pattern.sub(repl, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(controllers_dir):
    for file in files:
        if file.endswith('.cs'):
            process_file(os.path.join(root, file))

with open(en_json_path, 'w', encoding='utf-8') as f:
    json.dump(en_dict, f, ensure_ascii=False, indent=4)

with open(ar_json_path, 'w', encoding='utf-8') as f:
    json.dump(ar_dict, f, ensure_ascii=False, indent=4)

print("Controllers processed for localization.")
