"""v261101: Read-only Workshop expression evaluator for site data extraction."""
import ast
import copy
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ART = Path(__file__).resolve().parent


class Expr:
    def __init__(self, text):
        self.tokens = re.findall(r'"(?:\\.|[^"\\])*"|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9 .:]*|==|!=|>=|<=|[(),\[\]*+/%?:<>-]', text)
        self.tokens = [s.strip() for s in self.tokens]
        self.i = 0

    def take(self, value=None):
        token = self.tokens[self.i]
        if value is not None:
            assert token == value, (value, token, self.tokens[max(0,self.i-4):self.i+5])
        self.i += 1
        return token

    def parse(self, level=0):
        token = self.take()
        if token.startswith('"'):
            node = ('literal', json.loads(token, strict=False))
        elif re.fullmatch(r'\d+(?:\.\d+)?', token):
            node = ('literal', float(token) if '.' in token else int(token))
        elif token == '-':
            node = ('binary', '-', ('literal', 0), self.parse(30))
        elif token == '(':
            node = self.parse()
            self.take(')')
        elif self.i < len(self.tokens) and self.tokens[self.i] == '(':
            self.take('(')
            args = []
            if self.tokens[self.i] != ')':
                while True:
                    args.append(self.parse())
                    if self.tokens[self.i] != ',':
                        break
                    self.take(',')
            self.take(')')
            node = ('call', token, args)
        else:
            node = ('name', token)
        while self.i < len(self.tokens):
            op = self.tokens[self.i]
            if op == '[':
                self.take('[')
                index = self.parse()
                self.take(']')
                node = ('index', node, index)
                continue
            rank = {'==':5,'!=':5,'+':10,'-':10,'*':20,'/':20,'%':20}.get(op, -1)
            if rank < level:
                break
            self.take()
            node = ('binary', op, node, self.parse(rank+1))
        if level == 0 and self.i < len(self.tokens) and self.tokens[self.i] == '?':
            self.take('?')
            yes = self.parse()
            self.take(':')
            node = ('ternary', node, yes, self.parse())
        return node


def evaluate(node, env):
    kind = node[0]
    if kind == 'literal': return node[1]
    if kind == 'name':
        key = node[1]
        if key == 'Empty Array': return []
        if key == 'False': return 0
        if key == 'True': return 1
        if key == 'Null': return None
        return env[key]
    if kind == 'index': return evaluate(node[1], env)[int(evaluate(node[2],env))]
    if kind == 'ternary': return evaluate(node[2] if evaluate(node[1],env) else node[3],env)
    if kind == 'binary':
        a,b = evaluate(node[2],env), evaluate(node[3],env)
        op=node[1]
        if op=='+':return a+b
        if op=='-':return a-b
        if op=='*':return a*b
        if op=='/':return a/b
        if op=='%':return a%b
        if op=='==':return a==b
        if op=='!=':return a!=b
        raise ValueError(op)
    name,args=node[1:]
    if name=='Mapped Array':
        return [evaluate(args[1],dict(env,**{'Current Array Element':v,'Current Array Index':i})) for i,v in enumerate(evaluate(args[0],env))]
    if name=='Color': return ('color',args[0][1])
    values=[evaluate(a,env) for a in args]
    if name=='Custom Color':return ('custom_color',*values)
    if name=='Array':return values
    if name=='Append To Array':return values[0]+(values[1] if isinstance(values[1],list) else [values[1]])
    if name=='String Split':return values[0].split(values[1])
    if name=='Custom String':
        text=values[0]
        for i,v in enumerate(values[1:]):text=text.replace('{'+str(i)+'}',str(v))
        return text
    if name=='Index Of Array Value':
        try:return values[0].index(values[1])
        except ValueError:return -1
    if name=='Random Integer':return env['__rng__'].randint(*values)
    if name=='Random Value In Array':return env['__rng__'].choice(values[0])
    if name=='Randomized Array':
        result=values[0][:];env['__rng__'].shuffle(result);return result
    raise ValueError(name)


def parse_value(text, env):
    p=Expr(text);node=p.parse()
    assert p.i==len(p.tokens),(p.tokens[p.i:],text[:100])
    return evaluate(node,env)


TABLES = ['ITEM_NAME','ITEM_COLOR','ITEM_SCORE','CUTTING_NEEDED','CUTTING_RESULT',
          'GRILLING_NEEDED','GRILLING_RESULT','FRYING_NEEDED','FRYING_RESULT',
          'POT_TIME','POT_RESULT','PAN_NEEDED','PAN_RESULT','ICE_NEEDED','ICE_RESULT',
          'IMPACT_RESULT','RAW_MIX','RAW_RESULT','MENU_LIST','HAZARD_MENU_LIST',
          'FRIDGE_LIST','ADDITIONAL_MATERIAL_LIST','WEAVER_MENU_LIST','STAGE_NAME']


def load_tables(text):
    env={}
    for m in re.finditer(r'Global\.(\w+)(\[\d+\])?\s*=\s*([^;]*);',text):
        name,index,expr=m.groups()
        if name not in TABLES and name!='MIXING_RECIPE':continue
        if name=='MIXING_RECIPE' and not expr.lstrip().startswith(('String Split','Append To Array')):continue
        try:value=parse_value(expr,env)
        except Exception as e:raise ValueError((name,expr[:120])) from e
        if index:env['Global.'+name][int(index[1:-1])]=value
        else:env['Global.'+name]=value
    return {k.removeprefix('Global.'):v for k,v in env.items() if k!='Global.MIXING_RECIPE'}


def rule(text, title):
    start=text.index('rule("'+title+'")')
    next_rule=re.search(r'^rule\(',text[start+1:],re.M)
    end=start+1+next_rule.start() if next_rule else len(text)
    return text[start:end]


def assignment(text, name):
    return re.search(r'Global\.'+name+r'\s*=\s*([^;]*);',text)[1]


ITEM_FIELDS=TABLES[:16]+['ADDITIONAL_MATERIAL_LIST']
RESULT_FIELDS={'CUTTING_RESULT','GRILLING_RESULT','FRYING_RESULT','POT_RESULT','PAN_RESULT','ICE_RESULT','IMPACT_RESULT','ADDITIONAL_MATERIAL_LIST'}
MENU_FIELDS={'MENU_LIST','FRIDGE_LIST','HAZARD_MENU_LIST','WEAVER_MENU_LIST'}


def map_nested(value,mapping):
    if isinstance(value,list):return [map_nested(v,mapping) for v in value]
    if value is None or value in (-1,-2):return value
    return mapping[int(value)]
