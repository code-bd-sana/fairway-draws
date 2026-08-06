import os

replacements = {
    "Airsoft Draws": "Charity Draws",
    "airsoft draws": "charity draws",
    "Airsoft Draws'": "Charity Draws'",
    "Airsoft draws": "Charity draws",
    "Airsoft": "Charity",
    "airsoft": "charity",
    "airsoftdraws": "charitydraws"
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        pass

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css')):
            filepath = os.path.join(root, file)
            replace_in_file(filepath)

print("Done replacing.")
