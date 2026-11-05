"""Extract guide terminology from current Deluxe sources and existing Chinese translations."""
import sys,json,re
from pathlib import Path
SITE=Path(__file__).resolve().parents[2];ROOT=SITE.parent
sys.path.insert(0,str(SITE/'scripts/recipes'))
from convert import extract
from opencc import OpenCC
cc=OpenCC('s2t')
base_items=json.loads((SITE/'content/info/ko/items.json').read_text())
base_customers=json.loads((SITE/'content/info/ko/customers.json').read_text())
cn=json.loads((SITE/'store/translations/zh-CN.json').read_text())
norm=lambda s:s.lower().replace(' ','')
source={loc:(ROOT/f'{file}_deluxe.ow').read_text(encoding='utf-8-sig') for loc,file in [('ko','kr'),('en','en'),('ja','jp')]}
def source_labels(text):
 pairs=re.findall(r'String Split\(Custom String\("([^"\n]+/[^"\n]+/\{0\})",\s*Custom String\("([^"\n]+)"\)\), Custom String\("/"\)\)',text)
 mode=next(a.replace('{0}',b).split('/') for a,b in pairs if len(a.replace('{0}',b).split('/'))==6)
 difficulty=re.search(r'Custom String\("([^"\n]+/[^"\n]+/[^"\n]+/Hell\'s Kitchen)"\)',text).group(1).split('/')
 theme=next(s.split('/') for s in re.findall(r'Custom String\("([^"\n]+)"\)',text) if s.startswith(('모듬회밥!/','OverwatchCooked!/','クラシック/')) and len(s.split('/'))==3)
 return mode,difficulty,theme
def customer_names(text):
 pairs=re.findall(r'Custom String\("([^"\n]+/[^"\n]+\{0\})",\s*Custom String\("([^"\n]+)"\)\)',text)
 pairs=[(a,b) for a,b in pairs if a.startswith(('평범한 손님/','Regular Customer/','普通の客/'))]
 a,b=pairs[-1];return a.replace('{0}',b).split('/')
kr_names=customer_names(source['ko'])
zh_names='普通顾客/大胃王/挑剔的顾客/急躁的顾客/竞食选手/预约顾客/美食评论家/吃播博主/怪食客/暴躁的顾客/elBuffi VVIP/料理研究员/独食顾客/可疑的顾客/狡黠的顾客/美食家/混乱的顾客/惹人注意的顾客/外卖猫/巨食客/吵闹的顾客'.split('/')
modes={'ko':['연습 모드','캐주얼 다이닝','파인 다이닝','스타 비스트로','마스터쿡 챌린지','헤드셰프 챌린지'],'en':['Practice','Casual Dining','Fine Dining','Buzzy Restaurant','MasterChef Challenge','HeadChef Challenge'],'ja':['練習モード','カジュアルダイニング','ファインダイニング','スター・ビストロ','マスターシェフチャレンジ','ヘッドシェフ・チャレンジ'],'zh-CN':['练习模式','休闲餐饮','精致餐饮','星级小馆','主厨挑战','总厨挑战']}
difficulties={'ko':['수습 난이도','숙련 난이도','전문 난이도',"Hell's Kitchen"],'en':['Apprentice','Journeyman','Professional',"Hell's Kitchen"],'ja':['入門レベル','熟練レベル','プロレベル',"Hell's Kitchen"],'zh-CN':['学徒难度','熟练难度','专业难度',"Hell's Kitchen"]}
themes={'ko':['모듬회밥!','카페!','쿡제요리'],'en':['OverwatchCooked!','Cafe & Dessert','World Cuisine'],'ja':['クラシック','カフェ&デザート','世界の料理'],'zh-CN':['什锦料理！','咖啡馆！','世界料理']}
all_terms={}
for loc,file in [('ko','kr'),('en','en'),('ja','jp')]:
 g=extract(ROOT/f'{file}_deluxe.ow','ORG');names=dict(zip(kr_names,customer_names(source[loc])))
 mode,difficulty,theme=source_labels(source[loc])
 all_terms[loc]={'items':{str(i['id']):g['ITEM_NAME'][i['id']] for i in base_items},'customers':{c['slug']:names[c['name']] for c in base_customers},'modes':mode,'difficulties':difficulty,'themes':theme}
zh_items={}
for id,name in all_terms['en']['items'].items():
 key=norm(name);key={'9':'suspiciousdrinks'}.get(id,key)
 zh_items[id]=cn.get(key,name)
all_terms['zh-CN']={'items':zh_items,'customers':{c['slug']:dict(zip(kr_names,zh_names))[c['name']] for c in base_customers},'modes':modes['zh-CN'],'difficulties':difficulties['zh-CN'],'themes':themes['zh-CN']}
all_terms['zh-TW']=json.loads(cc.convert(json.dumps(all_terms['zh-CN'],ensure_ascii=False)))
p=SITE/'content/info/terms.json';data=json.dumps(all_terms,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
print('Extracted KR/EN/JA Workshop terminology; reused Chinese item translations and converted traditional Chinese.')
