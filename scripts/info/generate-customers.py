"""Build customer order, mode tags and boss metadata from original Korean Deluxe."""
import json, re, sys
from pathlib import Path
SITE=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(SITE/'scripts/recipes'))
from ow_reader import Expr, evaluate, rule, assignment
text=(SITE.parent/'kr_deluxe.ow').read_text(encoding='utf-8-sig')
block=rule(text,'Global subroutine: Deluxe common customer init')
heroes=re.findall(r'Hero\(([^)]+)\)',re.search(r'Array\(Hero\(Soldier: 76\).*?Index Of Array Value',block,re.S)[0])
slug=lambda name:re.sub('[^a-z0-9]','',name.lower())
hero_ids={name:i for i,name in enumerate(heroes)}
names='평범한 손님/요리연구가/대식가/성급한 손님/깐깐한 손님/음식 평론가/푸드파이터/예약 손님/먹방 유튜버/포악한 손님/괴식가/혼밥 손님/여우같은 손님/수상한 손님/미식가/대혼돈의 손님/관심이가는손님/배달냥이/거대식가/시끄러운 손님/엘버피 VVIP'.split('/')
mode_names=['연습 모드','캐주얼 다이닝','파인 다이닝','스타 비스트로','마스터쿡 챌린지','헤드셰프 챌린지']
colors=[[255,50,145],[140,255,180],[110,180,255],[255,225,120],[255,120,120],[38,38,65]]
overrides=re.findall(r'Global.CUSTOMER_LIST\[(\d+)\] = ([^;]+);',block)
def walk(node):
 if node[0]=='call':
  if node[1]=='Hero':return [hero_ids[node[2][0][1]]]
  return [v for arg in node[2] for v in walk(arg)]
 return []
boss=[]
# Parse random groups through AST, including their final Hero token.
def find_boss(node):
 if node[0]=='call':
  if node[1]=='Random Value In Array':
   for i in walk(node):
    if i not in boss:boss.append(i)
  for arg in node[2]:find_boss(arg)
for _,expr in overrides:find_boss(Expr(expr).parse())
orders={}
for mode in range(1,6):
 rows=evaluate(Expr(assignment(block,'CUSTOMER_LIST')).parse(),{'Global.stageMode':[0,mode]})
 rows=[[int(v) for v in row.split(',')] for row in rows]
 if mode in [2,3,4]:
  idx,expr=overrides[mode-2];rows[int(idx)]=walk(Expr(expr).parse())
 orders[mode]=list(dict.fromkeys(v for row in rows for v in row))
order=list(dict.fromkeys(v for mode in range(1,6) for v in orders[mode] if v not in boss))+boss
assert len(order)==21 and len(set(order))==21
result=[{'hero':heroes[i],'slug':slug(heroes[i]),'name':names[i],'boss':i in boss,'modes':[{'id':m,'name':mode_names[m],'color':colors[m]} for m in range(1,6) if i in orders[m]]} for i in order]
spawn=rule(text,'Dummy: Spawn')
spawn_heroes=re.findall(r'Hero\(([^)]+)\)',re.search(r'Event Player.controlingIndex = Index Of Array Value\(Array\((.*?)\), Hero Of',spawn,re.S)[1])
spawn_slugs=[slug(hero) for hero in spawn_heroes]
base_expr=re.search(r'Event Player.score = (Array\([^;]+?\))\[Event Player.controlingIndex\]',spawn)[1]
base_scores=evaluate(Expr(base_expr).parse(),{})
count_expr=re.search(r'Event Player.orderCount = (Array\([^;]+?\))\[Event Player.controlingIndex\]',spawn)[1]
counts=evaluate(Expr(count_expr).parse(),{})
for customer in result:
 index=spawn_slugs.index(customer['slug'])
 customer['score']={'adjustment':base_scores[index] or 0,'orders':counts[index] or 1,'multiPlate':customer['slug'] in ['zarya','reinhardt'],'bonus':50 if customer['slug']=='kiriko' else 0}
assert next(c['score'] for c in result if c['slug']=='soldier76')['adjustment']==0
output=SITE/'content/info/ko/customers.json'
data=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert output.read_text()==data
else:output.write_text(data)
print('Validated 21 customer types; bosses:',[names[i] for i in boss])
