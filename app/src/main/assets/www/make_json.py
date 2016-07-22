#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import json
from os import listdir
from os.path import isfile, join, basename, splitext, isdir

categorias=['personas', 'verbos', 'objetos', 'alimentos', 'animales', 'lugares', 'colores', 'adjetivos', 'sociales', 'interrogativas', 'numeros', 'abecedario']
invalidos=[]

def list_elements(path):
    out = []
    for f in listdir(path): 
        base = basename(join(path,f))
        name = splitext(base)[0]
        if (not exist_file(join(path,name+".png"))): invalidos.append(join(path,name+".png"))
        if (not exist_file(join(path,name+".mp3"))): invalidos.append(join(path,name+".mp3"))
        if name not in out:
            out.append(name)
    out.sort()
    return out

def exist_file(path):
    return os.path.exists(path)

def read_file(path):
    f = open(path, 'rw')
    text = f.read()
    f.close()
    return text

def get_colour(path):
    _colour_default = 'red'
    if exist_file(path):
        return read_file(path)
    return _colour_default

def path_to_dict(path):
    d = {}
    d['name'] = basename(path)
    d['color'] = get_colour(join(path, "color"))
    if exist_file(join(path,'elementos')):
        d['elementos'] = list_elements(join(path,'elementos'))
    else:
        o=[]
        for f in listdir(path):        
           sd = {}
           if isdir(join(path,f)):
               path2 = join(path,f)           
               sd['name'] = basename(path2)
               sd['color'] = get_colour(join(path2, "color"))
               sd['elementos'] = list_elements(join(path2,'elementos'))
               o.append(sd)
        d['subcategorias'] = o
    return d

o=[]
for f in categorias:
    o.append(path_to_dict(join('categorias',f)))

str_output = json.dumps(o, ensure_ascii=False, encoding='utf8')

f = open('js/items.js', 'w')
f.write("var ITEMS = ")
f.write(str_output.encode('utf8'))
f.write(";")
f.close()

print "editar YO y QUIERO"

for i in invalidos:
    print i
