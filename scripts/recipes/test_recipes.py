"""v261101: Cross-language structure, supply reachability, and known regression checks."""
import json, unittest
from pathlib import Path
from convert import validate
SITE=Path(__file__).resolve().parents[2]
DATA=json.loads((SITE/'store/datasets.json').read_text())
def actions(d):return {(a['type'],tuple(sorted(a['input'])),tuple(a['output']),a['effort']) for a in d['actions']}
def item(d,name):return next(x['id'] for x in d['items'] if x['name'][0]==name)
def reachable(d,s,target,extra):
 available=set(s['fridge'])
 if extra:available.update(d['items'][target]['additionalItems'])
 while True:
  before=len(available)
  for a in d['actions']:
   if all(x in available for x in a['input']):available.update(a['output'])
  if target in available:return True
  if before==len(available):return False
class RecipeTests(unittest.TestCase):
 def test_casual_dining_uses_locale_stage_schedule(self):
  def casual(theme,lang):return [s['id'] for s in DATA[theme][lang]['stages'] if s['casualDining']]
  self.assertEqual(casual('default-classic','ko'),[0,1,2,3,4])
  self.assertEqual(casual('default-classic','ja'),[0,1,2,3,6])
  self.assertEqual(casual('default-world','en'),[0,6,8,10,11])
  self.assertEqual(casual('default-world','ja'),[1,6,8,10,11])
  self.assertEqual(casual('joseon-third','ko'),[0,6,7,8,11])
  self.assertEqual(casual('joseon-cafe','ko'),[0,2,5,7,8,10])
  for theme in ['default-classic','default-cafe','default-world']:
   for lang in ['zh-CN','zh-TW']:self.assertEqual(casual(theme,lang),casual(theme,'en'))
 def test_references(self):
  for themes in DATA.values():
   for d in themes.values():validate(d)
 def test_joseon_only_korean_and_two_themes(self):
  for theme,count,groups in [('joseon-third',516,12),('joseon-cafe',522,14)]:
   self.assertEqual(list(DATA[theme]),['ko']);d=DATA[theme]['ko'];self.assertEqual(len(d['items']),count);self.assertEqual(len(d['stages']),groups)
   for s in d['stages']:self.assertIn(21,s['fridge']);self.assertFalse(s['additionalMenu'])
 def test_chinese_matches_english_cooking(self):
  for id in ['default-classic','default-cafe','default-world']:
   en=DATA[id]['en']
   for lang in ['zh-CN','zh-TW']:
    d=DATA[id][lang];self.assertEqual(en['actions'],d['actions'])
    for kind in ['items','stages']:
     self.assertEqual([{k:v for k,v in x.items() if k!='name'} for x in en[kind]], [{k:v for k,v in x.items() if k!='name'} for x in d[kind]])
    self.assertTrue(all(x['name'][0] for x in d['items']))
 def test_cafe_tea_leaves(self):
  d=DATA['default-cafe']['en'];tea=item(d,'Tea Leaves');water=item(d,'Water');out=item(d,'Matcha+Water')
  self.assertIn((6,tuple(sorted([tea,water])),(out,),None),actions(d))
 def test_japanese_naruto(self):
  d=DATA['default-classic']['ja'];source=item(d,'薄切り鳴門巻き');out=item(d,'鳴門巻きうどん')
  self.assertTrue(any(a['type']==6 and source in a['input'] and out in a['output'] for a in d['actions']))
  self.assertIn(item(d,'鳴門巻き'),d['stages'][7]['fridge'])
 def test_third_frying(self):
  d=DATA['third']['ko'];self.assertIn((2,(item(d,'튀김가루'),),(item(d,'튀김 부스러기'),),5),actions(d))
 def test_butcher_only_classic(self):
  for id,langs in DATA.items():
   for d in langs.values():
    for s in d['stages']:self.assertEqual(s['additionalMenu'],id=='default-classic' and s['id']==11)
 def test_every_order_reachable(self):
  failures=[]
  for id,langs in DATA.items():
   for lang,d in langs.items():
    for s in d['stages']:
     for key in ['menus','hazardMenus','weaverMenus']:
      for target in set(s[key]):
       if target==0:continue
       if not reachable(d,s,target,key=='weaverMenus' or s['additionalMenu']):failures.append((id,lang,s['id'],key,target,d['items'][target]['name'][0]))
  self.assertEqual(failures,[],str(failures[:30]))
if __name__=='__main__':unittest.main(verbosity=2)
