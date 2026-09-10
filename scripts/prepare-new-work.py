from pathlib import Path
from PIL import Image
import json
r=Path(__file__).resolve().parents[1]
items=[{'slug':'international-business-settlements','url':'https://international-business-settlements.evsavelev-region.chatgpt.site/','name':'Международные расчёты для бизнеса','niche':'Международные бизнес-расчёты','task':'Объяснить варианты оплаты зарубежных поставщиков и приёма платежей от иностранных контрагентов.','features':['Структура услуг и этапов','Форма параметров сделки','Ответы на вопросы']},{'slug':'bitok-consulting','url':'https://bitok-consulting.github.io/','name':'Bitok Consulting','niche':'Биток-консалтинг · обмен USDT и RUB','task':'Представить направления обмена, показать офис и помочь посетителю перейти к обсуждению сделки.','features':['Сценарии обмена','Офис и карты','Форма обращения']}]
p=r/'data/projects.json';old=json.loads(p.read_text(encoding='utf-8'));p.write_text(json.dumps(items+[i for i in old if i['slug'] not in [x['slug'] for x in items]],ensure_ascii=False,indent=2),encoding='utf-8')
manifest=[]
for item in items:
 im=Image.open(r/'qa/source-sites'/f"{item['slug']}.png").convert('RGB')
 for w in [720,1440]:
  f=r/'assets/portfolio'/f"{item['slug']}-{w}.webp";im.resize((w,round(im.height*w/im.width)),Image.Resampling.LANCZOS).save(f,'WEBP',quality=86,method=6)
  manifest.append({'file':f.relative_to(r).as_posix(),'source':item['url'],'width':w,'height':round(im.height*w/im.width),'bytes':f.stat().st_size})
(r/'data/new-work-media.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');print(manifest)
