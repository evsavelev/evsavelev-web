from pathlib import Path
from PIL import Image
import json,re,requests
root=Path(__file__).resolve().parents[1]
out=root/'assets/portfolio';out.mkdir(parents=True,exist_ok=True)
names=['tehnologiya-nizhnevartovsk','vual-nizhnevartovsk','kinder-party-dom-nizhnevartovsk','style-dance-nizhnevartovsk','gildiya-law-nizhnevartovsk','autodoctor-nizhnevartovsk','billboard-nizhnevartovsk','imperiya-beauty-nizhnevartovsk']
manifest=[]
for name in names:
    im=Image.open(root/'qa/source-sites'/f'{name}.png').convert('RGB')
    for width in (720,1440):
        copy=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
        dest=out/f'{name}-{width}.webp';copy.save(dest,'WEBP',quality=86,method=6)
        manifest.append({'file':dest.relative_to(root).as_posix(),'width':copy.width,'height':copy.height,'bytes':dest.stat().st_size,'source':'https://evsavelev.github.io/'+name+'/','captured':'2026-09-10','method':'Playwright 1440x1000 viewport, original page, resized/encoded WebP only'})
(root/'data').mkdir(exist_ok=True)
(root/'data/media.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
fonts=root/'assets/fonts';fonts.mkdir(exist_ok=True)
css=requests.get('https://fonts.googleapis.com/css2?family=Inter:wght@300..500&display=swap',headers={'User-Agent':'Mozilla/5.0'},timeout=30);css.raise_for_status()
blocks=re.findall(r'/\* (.*?) \*/\s*(@font-face\s*\{.*?\})',css.text,re.S)
local=[]
for subset,block in blocks:
    if subset not in ('latin','cyrillic'):continue
    url=re.search(r'url\((.*?)\)',block).group(1);r=requests.get(url,timeout=30);r.raise_for_status()
    name=f'inter-{subset}.woff2';(fonts/name).write_bytes(r.content)
    local.append(block.replace(url,'./'+name))
if len(local)!=2:raise ValueError('Expected latin and cyrillic WOFF2 subsets')
(fonts/'fonts.css').write_text('\n'.join(local),encoding='utf-8')
license=requests.get('https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt',timeout=30);license.raise_for_status();(fonts/'OFL.txt').write_text(license.text,encoding='utf-8')
print('Portfolio bytes:',sum(x['bytes'] for x in manifest),'Fonts:',[(x.name,x.stat().st_size) for x in fonts.glob('*.woff2')])
