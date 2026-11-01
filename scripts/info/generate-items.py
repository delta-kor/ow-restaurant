"""Current Deluxe item metadata; ability identities come from legacy HUDs."""
import json,re,sys
from pathlib import Path
SITE=Path(__file__).resolve().parents[2];ROOT=SITE.parent
sys.path.insert(0,str(SITE/'scripts/recipes'))
from convert import extract
from ow_reader import assignment,parse_value,rule
current=(ROOT/'kr_deluxe.ow').read_text(encoding='utf-8-sig')
g=extract(ROOT/'kr_deluxe.ow','ORG')
knives=parse_value(assignment(current,'KNIFE'),{})
perks=parse_value(assignment(current,'PERK_LIST'),{})
icons={};origins={}
ability_assets={('Roadhog','Ability 2'):'take-a-breather',('Ana','Ultimate'):'nano-boost',('Ashe','Ability 2'):'dynamite',('Sigma','Ability 1'):'kinetic-grasp',('Baptiste','Ultimate'):'amplification-matrix',('Torbjörn','Ultimate'):'molten-core',('Domina','Ultimate'):'panopticon',('Wrecking Ball','Ability 1'):'roll',('Mei','Ability 1'):'cryo-freeze',('Baptiste','Crouch'):'exo-boots',('Reinhardt','Ability 1'):'charge',('Kiriko','Ability 1'):'swift-step'}
for file in ['ko.ow','cafe_kr.ow']:
 text=(ROOT/'deprecated'/file).read_text(encoding='utf-8-sig')
 names=parse_value(assignment(text,'ITEM_NAME'),{})
 lists=parse_value(assignment(text,'PERK_LIST'),{})
 for group,title in enumerate(['Perk Hud','Foot Hud']):
  hud=rule(text,'Global subroutine: '+title)
  pairs=re.findall(r'Ability Icon String\(Hero\(([^)]+)\),\s*Button\(\s*([^)]+)\)\)',hud)
  assert len(pairs)==len(lists[group])
  for id,pair in zip(lists[group],pairs):
   name=names[id]
   if name=='수상한 드링크':name='싼데비슷한 드링크'
   icons[name]=ability_assets[pair];origins[name]=f'deprecated/{file}: {pair[0]} / {pair[1]}'
# Match existing recipe circle colors, rather than assigning new UI colors.
color_map={'Lime Green':'#41ba38','Turquoise':'#397f34','Green':'#1f681a','Violet':'#9f20c3','Rose':'#9f2222','Yellow':'#ce9731','Red':'#c83333','Sky Blue':'#3478b5'}
keys=['ultimate','ultimate','ultimate','secondary-fire','ultimate','secondary-fire','ultimate','ultimate','secondary-fire']
result=[]
for id in perks[0]+perks[1]+knives+[18]:
 name=g['ITEM_NAME'][id]
 if id in knives:
  k=knives.index(id);key=['primary-fire','interact'] if k in [3,6] else ['interact'];category='칼'
 elif id in perks[0]:key=[keys[perks[0].index(id)]];category='도구'
 elif id in perks[1]:key=[['jump','ability-1','ability-1'][perks[1].index(id)]];category='이동 장비'
 else:key=['interact'];category='기타'
 result.append({'id':id,'name':name,'category':category,'color':'#24bfc9' if id in [2,3,4,5] else color_map[g['ITEM_COLOR'][id][1]],'icon':icons.get(name),'iconSource':origins.get(name),'keys':key})
knife_costs=parse_value(assignment(current,'KNIFE_DECREASE'),{})
knife_amounts=parse_value(assignment(current,'KNIFE_AMOUNT'),{})
usage_costs={11:5,12:0.5,15:20,16:1,20:1,10:1,13:2,14:10}
mode_names=['연습 모드','캐주얼 다이닝','파인 다이닝','스타 비스트로','마스터쿡 챌린지','헤드셰프 챌린지']
mode_colors=[[255,50,145],[140,255,180],[110,180,255],[255,225,120],[255,120,120],[38,38,65]]
# The first two serialized rows supply the initial items for each mode.
default_rows=re.findall(r'Global\.DELUXE_DATA\[2\] = String Split\(Custom String\("([^"/]+)/([^"/]+)/',current)
assert len(default_rows)==3
theme_defaults={}
for theme,(first,second) in zip(['모듬회밥!','카페!','쿡제요리'],default_rows):
 rows=[[int(v) if v.isdigit() else None for v in row.split(',')] for row in (first,second)]
 theme_defaults[theme]={m:{rows[0][m],rows[1][m]}|({3} if m==3 else {7} if m==5 else {1}) for m in range(1,6)}
for item in result:
 id=item['id']
 if item['category']=='이동 장비':item['color']='#ff3291'
 item['singleUse']=id in [8,9,17,19]
 item['durabilityCost']=knife_costs[knives.index(id)] if id in knives else usage_costs.get(id)
 item['durabilityUnit']='칼질 1회' if id in knives else '작동 1회' if id in [12,16,20] else '사용 1회'
 item['knifeEfficiency']=round(knife_amounts[knives.index(id)] / knife_amounts[0] * 100) if id in knives else None
 item['modes']=[{'id':m,'name':mode_names[m],'color':mode_colors[m],'themes':[theme for theme,defaults in theme_defaults.items() if id in defaults[m]]} for m in range(1,6) if any(id in defaults[m] for defaults in theme_defaults.values())]
 if id in [17,10]:item['modes']=[{'id':2,'name':'파인다이닝 부터 등장','color':mode_colors[2],'themes':[]}]
assert len(result)==20 and len({r['id'] for r in result})==20
assert all(r['icon'] for r in result if r['category'] in ['도구','이동 장비'])
output=SITE/'content/info/ko/items.json';data=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert output.read_text()==data
else:output.write_text(data)
print('Validated 20 Deluxe items and 12 legacy HUD ability mappings')

loadouts=[]
for m in range(6):
 groups={}
 for theme,defaults in theme_defaults.items():
  ids=sorted((defaults[m] if m else {1,12})-{None,0},key=lambda id:(id not in knives,id))
  groups.setdefault(tuple(ids),[]).append(theme)
 loadouts.append({'id':m,'groups':[{'themes':themes,'items':list(ids)} for ids,themes in groups.items()]})
loadout_file=SITE/'content/info/ko/mode-loadouts.json'
loadout_data=json.dumps(loadouts,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert loadout_file.read_text()==loadout_data
else:loadout_file.write_text(loadout_data)
