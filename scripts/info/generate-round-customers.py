"""Round customer types, preserving random choices from the shared Deluxe initializer."""
import json,re,sys
from pathlib import Path
SITE=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(SITE/'scripts/recipes'))
from ow_reader import Expr,evaluate,rule,assignment
source=(SITE.parent/'kr_deluxe.ow').read_text(encoding='utf-8-sig')
block=rule(source,'Global subroutine: Deluxe common customer init')
base=assignment(block,'CUSTOMER_LIST')
overrides=re.findall(r'Global.CUSTOMER_LIST\[(\d+)\] = ([^;]+);',block)
for name in ['en_deluxe.ow','jp_deluxe.ow','Joseon_deluxe.ow']:
 other=rule((SITE.parent/name).read_text(encoding='utf-8-sig'),'Global subroutine: Deluxe common customer init')
 assert re.sub(r'\s+','',base)==re.sub(r'\s+','',assignment(other,'CUSTOMER_LIST')),name
 assert [(i,re.sub(r'\s+','',e)) for i,e in overrides]==[(i,re.sub(r'\s+','',e)) for i,e in re.findall(r'Global.CUSTOMER_LIST\[(\d+)\] = ([^;]+);',other)],name
heroes=re.findall(r'Hero\(([^)]+)\)',re.search(r'Array\(Hero\(Soldier: 76\).*?Index Of Array Value',block,re.S)[0])
slug=lambda name:re.sub('[^a-z0-9]','',name.lower())
def walk(node):
 if node[0]!='call':return []
 if node[1]=='Hero':return [slug(node[2][0][1])]
 return [v for arg in node[2] for v in walk(arg)]
def entries(node):
 if node[0]!='call':raise ValueError(node)
 if node[1]=='Hero':return [{'random':False,'heroes':walk(node)}]
 if node[1]=='Random Value In Array':return [{'random':True,'heroes':walk(node)}]
 assert node[1]=='Array'
 return [v for arg in node[2] for v in entries(arg)]
result=[]
for mode in range(1,6):
 rows=evaluate(Expr(base).parse(),{'Global.stageMode':[0,mode]})
 rows=[[{'random':False,'heroes':[slug(heroes[int(v)])]} for v in row.split(',')] for row in rows]
 if mode in [2,3,4]:
  index,expr=overrides[mode-2];rows[int(index)]=entries(Expr(expr).parse())
 rounds=[]
 for i,row in enumerate(rows):
  unique=[]
  for entry in row:
   if entry not in unique:unique.append(entry)
  rounds.append({'round':i+1,'bonus':mode==4 and i>=8,'customers':unique})
 result.append({'mode':mode,'rounds':rounds})
assert [len(m['rounds']) for m in result]==[15,15,15,13,20]
known={c['slug'] for c in json.loads((SITE/'content/info/ko/customers.json').read_text())}
assert all(hero in known for mode in result for row in mode['rounds'] for entry in row['customers'] for hero in entry['heroes'])
p=SITE/'content/info/ko/round-customers.json';data=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
print('Validated shared Deluxe customer schedules: 15/15/15/13/20 rounds; random bosses preserved.')
