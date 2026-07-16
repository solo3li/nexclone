import re
import json

layout_path = 'NexClone.Backend/Views/Shared/_Layout.cshtml'
en_json_path = 'NexClone.Backend/Resources/en.json'
ar_json_path = 'NexClone.Backend/Resources/ar.json'

with open(en_json_path, 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

with open(ar_json_path, 'r', encoding='utf-8') as f:
    ar_dict = json.load(f)

with open(layout_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for <li class="sidebar-menu-item">...<a href="...">...<i class='...'></i> TEXT </a>
pattern = re.compile(r'(<li class="sidebar-menu-item[^"]*">\s*<a[^>]*>\s*<i[^>]*></i>\s*)([^<@]+?)(\s*</a>\s*</li>)', re.IGNORECASE | re.MULTILINE)

def repl(match):
    prefix = match.group(1)
    text = match.group(2).strip()
    suffix = match.group(3)
    
    if text and text != 'English' and text != 'اللغة العربية':
        if text not in en_dict:
            en_dict[text] = text
        if text not in ar_dict:
            ar_dict[text] = text
        return f'{prefix}@Localizer["{text}"]{suffix}'
    return match.group(0)

new_content = pattern.sub(repl, content)

if new_content != content:
    with open(layout_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    with open(en_json_path, 'w', encoding='utf-8') as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=4)
    with open(ar_json_path, 'w', encoding='utf-8') as f:
        json.dump(ar_dict, f, ensure_ascii=False, indent=4)
    print("Replaced text in _Layout.cshtml")
else:
    print("No changes made.")
