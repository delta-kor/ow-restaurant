"""v261101: Convert current OW sources to locale-specific site datasets. Never writes OW."""
import argparse, collections, hashlib, json, re
from pathlib import Path
from ow_reader import Expr, evaluate, assignment, load_tables, rule
SITE=Path(__file__).resolve().parents[2]
ROOT=SITE.parent
LANGS=['ko','en','ja','zh-CN','zh-TW']
def norm(s):return re.sub(r'\s+','',s).casefold()
def read(p):return json.loads(p.read_text())
def write(p,obj):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def extract(path,mode):
 text=path.read_text(encoding='utf-8-sig')
 block='\n'.join(rule(text,'Global subroutine: Deluxe '+mode+' init'+str(i)) for i in [1,2]) if mode else text
 g=load_tables(block)
 for key in ['MENU_LIST','HAZARD_MENU_LIST','WEAVER_MENU_LIST','FRIDGE_LIST']:
  if g[key] and isinstance(g[key][0],str):g[key]=[[int(x) for x in row.split(',')] for row in g[key]]
 # Only evaluate the casual branch; other modes contain random expressions.
 stage_block=rule(text,'Global subroutine: Deluxe '+mode+' init3') if mode else text
 stage_tree=Expr(assignment(stage_block,'STAGE_CODE')).parse()
 assert stage_tree[0]=='index' and stage_tree[1][:2]==('call','Array')
 casual=evaluate(stage_tree[1][2][1],{})
 g['CASUAL_STAGES']=sorted({int(stage) for group in casual for stage in group})
 return g

def dataset(g,lang,water=None,melts=False,additional=False):
 names=g['ITEM_NAME'];n=len(names)
 def at(key,i,default=0):return g.get(key,[])[i] if i<len(g.get(key,[])) else default
 items=[]
 # Reader resolves colors; map RGB tuples to existing site color tokens.
 palette=[('D',('color','Black')),('R',('color','Red')),('M',('custom_color',180,100,0,255)),('Y',('color','Yellow')),('W',('color','White')),('L',('color','Lime Green')),('G',('color','Green')),('H',('custom_color',255,200,100,255)),('T',('color','Turquoise')),('S',('custom_color',100,60,0,255)),('C',('custom_color',255,65,0,255)),('F',('custom_color',255,255,190,255)),('V',('custom_color',0,125,0,255)),('O',('color','Orange')),('A',('custom_color',246,86,86,255)),('P',('custom_color',250,150,70,255)),('B',('color','Sky Blue')),('N',('custom_color',255,192,243,255)),('Q',('custom_color',255,108,141,255)),('X',('custom_color',255,239,104,255)),('Z',('color','Violet')),('U',('color','Rose')),('E',('color','Gray')),('J',('custom_color',96,255,181,255)),('K',('color','Purple'))]
 colors={tuple(v):k for k,v in palette}
 for i,name in enumerate(names):
  extra=at('ADDITIONAL_MATERIAL_LIST',i);extra=extra if isinstance(extra,list) else ([extra] if extra else [])
  color=tuple(at('ITEM_COLOR',i,('color','Black')))
  assert color in colors,(i,color)
  items.append({'id':i,'name':[name]*5,'canMelt':melts and i in g.get('ICE_RESULT',[]),'colorCode':colors[color],'additionalItems':extra})
 actions=[]
 for i in range(n):
  for typ,needed,result in [(0,'CUTTING_NEEDED','CUTTING_RESULT'),(1,'GRILLING_NEEDED','GRILLING_RESULT'),(2,'FRYING_NEEDED','FRYING_RESULT'),(3,'POT_TIME','POT_RESULT'),(4,'PAN_NEEDED','PAN_RESULT'),(5,None,'IMPACT_RESULT'),(7,'ICE_NEEDED','ICE_RESULT')]:
   if typ==7 and 'ICE_NEEDED' not in g:continue
   if result not in g or i>=len(g[result]) or (needed and i>=len(g.get(needed,[]))):continue
   out=at(result,i);eff=at(needed,i) if needed else None
   if (typ==0 and eff==99) or (typ==3 and not eff) or (typ not in [0,3] and not out):continue
   actions.append({'type':typ,'input':[i],'output':out if isinstance(out,list) else [out],'effort':eff})
 assert len(g['RAW_MIX'])==len(g['RAW_RESULT'])
 for pair,out in zip(g['RAW_MIX'],g['RAW_RESULT']):actions.append({'type':6,'input':[pair%1000,pair//1000],'output':[out],'effort':None})
 stages=[]
 for i,name in enumerate(g['STAGE_NAME']):
  fridge=list(g['FRIDGE_LIST'][i])
  if water is not None and water not in fridge:fridge.append(water)
  stages.append({'id':i,'name':[name]*5,'fridge':fridge,'menus':g['MENU_LIST'][i],'hazardMenus':g['HAZARD_MENU_LIST'][i],'weaverMenus':g['WEAVER_MENU_LIST'][i],'additionalMenu':additional and i==11,'casualDining':i in g['CASUAL_STAGES']})
 data={'items':items,'actions':actions,'stages':stages,'sinkItems':[] if water is None else [water]}
 validate(data)
 return data

def validate(d):
 n=len(d['items'])
 assert [x['id'] for x in d['items']]==list(range(n))
 for a in d['actions']:
  assert all(type(x)==int and 0<=x<n for x in a['input']+a['output']),a
  assert a['effort'] is None or isinstance(a['effort'],(int,float))
 for s in d['stages']:
  assert all(type(x)==int and 0<=x<n for key in ['fridge','menus','hazardMenus','weaverMenus'] for x in s[key]),s
 for x in d['items']:assert all(type(i)==int and 0<=i<n for i in x['additionalItems'])


def main():
 parser=argparse.ArgumentParser();parser.add_argument('--sources',type=Path,default=ROOT);parser.add_argument('--check',action='store_true');args=parser.parse_args()
 specs=[('default-classic','ORG',True),('default-cafe','CAFE',False),('default-world','GC',False)]
 all_data={};sources={};manifest=[]
 def add(id,lang,file,mode,**opts):
  p=args.sources/file;sources[file]=hashlib.sha256(p.read_bytes()).hexdigest();g=extract(p,mode);d=dataset(g,lang,**opts)
  all_data.setdefault(id,{})[lang]=d
  manifest.append({'id':id,'language':lang,'source':file,'initializer':mode,'items':len(d['items']),'actions':len(d['actions']),'stages':len(d['stages'])})
 for lang,prefix in [('ko','kr'),('en','en'),('ja','jp')]:
  for id,mode,melt in specs:add(id,lang,prefix+'_deluxe.ow',mode,melts=melt,additional=melt)
 add('joseon-third','ko','Joseon_deluxe.ow','N3',water=21)
 add('joseon-cafe','ko','Joseon_deluxe.ow','CAFE',water=21)
 add('third','ko','kc_kr.ow',None)
 translations=read(SITE/'store/translations/zh-CN.json');missing=set()
 from opencc import OpenCC
 traditional=OpenCC('s2twp')
 for id,_,_ in specs:
  en=all_data[id]['en']
  for lang in ['zh-CN','zh-TW']:
   d=json.loads(json.dumps(en))
   for kind in ['items','stages']:
    for row in d[kind]:
     name=row['name'][0];key=norm(name)
     if key not in translations:missing.add(name);continue
     translated=translations[key]
     if lang=='zh-TW':
      translated=traditional.convert(translated)
     row['name']=[translated]*5
   all_data[id][lang]=d
   origin=next(x for x in manifest if x['id']==id and x['language']=='en')
   manifest.append({**origin,'language':lang,'structureLanguage':'en','translation':'store/translations/zh-CN.json','traditionalConversion':'OpenCC s2twp' if lang=='zh-TW' else None})
 report={'sources':sources,'datasets':manifest,'missingChinese':sorted(missing),'schemaVersion':1}
 if missing:
  write(SITE/'store/translations/missing.json',report);raise SystemExit('Missing Chinese translations: '+str(len(missing)))
 output=SITE/'store/datasets.json';mfile=SITE/'store/dataset-manifest.json'
 if args.check:
  assert read(output)==all_data,'Generated data differs from current OW/translations'
  assert read(mfile)==report,'Manifest differs'
 else:write(output,all_data);write(mfile,report)
 print('Validated',sum(map(len,all_data.values())),'datasets from',len(sources),'OW files')
if __name__=='__main__':main()
