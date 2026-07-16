import os
import re
import json

views_dir = 'NexClone.Backend/Views'
en_json_path = 'NexClone.Backend/Resources/en.json'
ar_json_path = 'NexClone.Backend/Resources/ar.json'

# Load or initialize
en_dict = {}
if os.path.exists(en_json_path):
    with open(en_json_path, 'r', encoding='utf-8') as f:
        en_dict = json.load(f)

def add_to_dict(text):
    text = text.strip()
    if not text or len(text) < 2 or text.isnumeric():
        return text
    # Avoid replacing if it contains Razor syntax or weird characters
    if '@' in text or '{' in text or '}' in text:
        return text

    key = text
    en_dict[key] = text
    return f'@Localizer["{key}"]'

# Patterns to replace text inside tags
# This regex looks for > text < where text doesn't contain < or >
# We only want to target specific tags to be safe
tags_to_target = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'span', 'p', 'th', 'td', 'label', 'button', 'div', 'li']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Inject Localizer at the top if not present
    if '@inject Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource> Localizer' not in content:
        # Find first line after @model or @{ ... } or just put it at top
        if content.startswith('@model '):
            lines = content.split('\n')
            lines.insert(1, '@inject Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource> Localizer')
            content = '\n'.join(lines)
        else:
            content = '@inject Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource> Localizer\n' + content

    # Replace text between targeted tags
    for tag in tags_to_target:
        # regex: <tag ...>text</tag>
        # text should have at least one letter, and no < or >
        pattern = re.compile(rf'(<{tag}[^>]*>\s*)([^<>\n]+?)(\s*</{tag}>)', re.IGNORECASE)
        
        def repl(match):
            prefix = match.group(1)
            text = match.group(2)
            suffix = match.group(3)
            
            if text.strip() and re.search('[a-zA-Z]', text):
                new_text = add_to_dict(text)
                return f"{prefix}{new_text}{suffix}"
            return match.group(0)

        content = pattern.sub(repl, content)

    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(views_dir):
    for file in files:
        if file.endswith('.cshtml'):
            process_file(os.path.join(root, file))

with open(en_json_path, 'w', encoding='utf-8') as f:
    json.dump(en_dict, f, ensure_ascii=False, indent=4)

if not os.path.exists(ar_json_path):
    with open(ar_json_path, 'w', encoding='utf-8') as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=4)

print(f"Processed views. Found {len(en_dict)} unique strings.")
