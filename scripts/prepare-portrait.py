from pathlib import Path
from PIL import Image
import hashlib, json, shutil

root = Path(__file__).resolve().parents[1]
source = Path(r'C:\Users\пк\Downloads\ChatGPT Image 10 сент. 2026 г., 18_31_57.png')
archive = root / 'source-media' / 'evgeniy-savelev-original.png'
archive.parent.mkdir(exist_ok=True)
if source.exists():
    shutil.copy2(source, archive)
image = Image.open(archive).convert('RGB')
dest = root / 'assets' / 'images'
dest.mkdir(parents=True, exist_ok=True)
manifest = {'source': source.name, 'sourceSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'originalSize': list(image.size), 'preparation': 'User-authorized technical resize and WebP encoding only; full original frame; no retouching, generation, color or identity changes', 'variants': []}
for width in (480, 720, 960):
    resized = image.resize((width, round(width * image.height / image.width)), Image.Resampling.LANCZOS)
    file = dest / f'evgeniy-savelev-{width}.webp'
    resized.save(file, 'WEBP', quality=85, method=6)
    manifest['variants'].append({'file':file.relative_to(root).as_posix(),'width':resized.width,'height':resized.height,'bytes':file.stat().st_size})
(root/'data'/'portrait.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(manifest, ensure_ascii=False, indent=2))
