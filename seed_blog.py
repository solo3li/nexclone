import re
import json
import psycopg2

with open('/root/nexmedia/nexclone/frontend/src/data/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the JSON array part
start = content.find('[')
end = content.rfind(']') + 1
json_str = content[start:end]

# It has single quotes or trailing commas maybe? No, looking at it, it's valid JSON-like but might have some differences.
# Actually, the file output from earlier showed double quotes for keys. Let's try to json.loads it.
# If it fails, we will use a regex approach.

try:
    articles = json.loads(json_str)
except Exception as e:
    print("Failed to parse JSON directly, trying JS parser or eval...", e)
    import ast
    # ast.literal_eval doesn't like true/false
    json_str = json_str.replace('true', 'True').replace('false', 'False')
    # but there are no booleans. Let's try to use json5 or just print it.
    pass

# Better approach: let's write a node script that uses the TS compiler or requires it!
