"""Original editable stadium furniture and fictional adult spectator silhouettes."""
import os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *
import mesh_tools as mesh_helpers
mesh_helpers.BUILD_WORLD=True
stone=mat('Tribune limestone',(.56,.51,.4),0,.88)
wood=mat('Oiled stadium wood',(.17,.11,.055),0,.76)
cloth=mat('Striped canopy cloth',(.025,.16,.17),0,.91)
burgundy=mat('Spectator burgundy',(.24,.025,.04),0,.85)
olive=mat('Spectator olive',(.14,.17,.09),0,.92)
navy=mat('Spectator navy',(.04,.085,.14),0,.85)
def text(body,pos,size=.5,rotation=(math.pi/2,0,0)):
    c=bpy.data.curves.new(body,'FONT');c.body=body;c.align_x='CENTER';c.size=size;c.extrude=.005
    o=bpy.data.objects.new(body,c);bpy.context.collection.objects.link(o);o.location=pos;o.rotation_euler=rotation;o.data.materials.append(cream)
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
for side in [-1,1]:
    for y in [-35,35]:
        for row in range(3):
            x=side*(21-row*1.05);height=.65+row*.65
            box('Tribune tier',(x,y,height/2),(1.15,23,height),stone,.025)
            box('Bench seat',(x,y,height+.09),(.68,22,.17),wood,.025)
            for j in range(7):
                py=y-9+j*3+random.uniform(-.25,.25);px=x+random.uniform(-.12,.12)
                suit=[burgundy,olive,navy,coat][(j+row)%4]
                ellipsoid('Spectator coat',(px,py,height+.56),(.24,.27,.42),suit,segments=12)
                ellipsoid('Spectator head',(px,py,height+1.13),(.17,.17,.23),skin,segments=12)
                cyl('Spectator hat',(px,py,height+1.32),.19,.09,hair,verts=12)
                for delta in [-.14,.14]:
                    tube('Seated trouser leg',[(px,py+delta,height+.32),(px+side*.34,py+delta,height+.26),(px+side*.36,py+delta,height-.13)],.095,suit)
                if j%3==0:
                    tube('Raised waving arm',[(px,py+.25,height+.74),(px+side*.28,py+.25,height+1),(px+side*.35,py+.25,height+1.38)],.075,suit)
                    ellipsoid('Spectator glove',(px+side*.35,py+.25,height+1.41),(.09,.1,.1),cream,segments=12)
        for py in [y-11.5,y+11.5]:
            for x in [side*17.8,side*23]:cyl('Canopy iron post',(x,py,2.3),.075,4.6,chrome,verts=12)
        for j in range(12):
            box('Striped awning',(side*20.4,y-11+j*2,4.63),(5.8,1.98,.16),cloth if j%2 else cream,.01)
        box('Canopy valance',(side*23.2,y,4.31),(.12,24,.63),cloth,.01)
        text('APPLAUS AB REIHE DREI',(side*20.5,y-12.04,3.75),.38)

# Ticket booths sit beyond the barriers, leaving the entire track corridor clear.
for x,y in [(-47,77),(47,-76)]:
    box('Ticket booth',(x,y,1.2),(3.8,3,2.4),cloth,.06)
    box('Booth window',(x,y-1.52,1.55),(2.7,.05,1),black,.01)
    box('Ticket counter',(x,y-1.7,1.04),(3,.7,.14),wood,.04)
    box('Booth roof',(x,y,2.65),(4.4,3.5,.32),burgundy,.03)
    text('KASSE',(x,y-1.82,2.45),.55)
    for j in range(5):
        envelope=box('Ticket stack',(x-.8+j*.4,y-1.8,1.17),(.24,.24,.11),cream,.01)

# A theatrical but readable race gantry over the actual start line.
for x in [23.3,40.7]:
    cyl('Finish bridge column',(x,-38,3.6),.36,7.2,stone,verts=16)
    box('Finish bridge plinth',(x,-38,.28),(1.35,1.35,.56),stone,.04)
    cyl('Finish bridge cap',(x,-38,7.1),.53,.28,gold,verts=16)
box('Race banner',(32,-38,7.24),(18,.45,1.65),cloth,.025)
for z in [6.38,8.09]:box('Banner brass rail',(32,-38,z),(18.2,.54,.08),gold,.01)
text('ZIEL NACH VORSCHRIFT',(32,-38.26,7.1),.71)
for x in [24.6,39.4]:
    cyl('Flag mast',(x,-38,9.1),.035,2.4,gold,verts=12)
    vs=[(x,-38+i*.5,9.7+j*.8+math.sin(i*1.5)*.13) for j in [0,1] for i in range(5)]
    mesh('Waving neutral race pennant',vs,[(i,i+1,i+6,i+5) for i in range(4)],burgundy)

# Park paths and benches add foreground layers around the fountains.
for y in [-40,40]:box('Park cross path',(0,y,.032),(47,3,.06),stone,.005)
for x in [-9,9]:
    for y in [-18,18]:
        box('Park bench seat',(x,y,.58),(2.6,.65,.15),wood,.025)
        box('Park bench back',(x,y+.3,.93),(2.6,.12,.7),wood,.025)
        for px in [x-.9,x+.9]:box('Bench iron foot',(px,y,.29),(.1,.6,.58),chrome,.015)
# Shop fronts make the boulevard feel inhabited rather than an empty facade wall.
glass=mat('Shop blue glass',(.025,.085,.11),.25,.32)
brick=mat('Background terracotta',(.28,.13,.075),0,.9)
copper=mat('Station weathered copper',(.055,.21,.19),.5,.53)
leaf=mat('Park hedge foliage',(.04,.13,.045),0,.96)
flower=mat('Park burgundy flowers',(.38,.035,.065),0,.85)
for side in [-1,1]:
    for idx,y in enumerate(range(-65,66,18)):
        face=side*56.92
        for dy in [-4.3,0,4.3]:
            box('Shop display window',(face,y+dy,1.75),(.08,3.25,2.6),glass,.012)
            for dz in [.42,3.05]:box('Shop window stone sill',(face-side*.11,y+dy,dz),(.35,3.55,.15),stone,.018)
            for py in [y+dy-1.68,y+dy+1.68]:box('Shop window jamb',(face-side*.1,py,1.75),(.2,.14,2.7),stone,.02)
            box('Shop brass transom',(face-side*.13,y+dy,2.35),(.13,3.3,.05),gold,.005)
            for j in range(6):
                awning=box('Shop striped awning',(face-side*.8,y+dy-1.5+j*.6,3.2),(1.7,.59,.13),cloth if (j+idx)%2 else cream,.01)
                awning.rotation_euler[1]=side*.18
            box('Shop valance',(face-side*1.62,y+dy,3.05),(.08,3.6,.34),cloth,.01)
        text(['ANTRAG & SOHN','CAFÉ AKTENPAUSE','WERKSTATT 08/15','POST AM RING'][idx%4],(face-side*.2,y,3.64),.41,(math.pi/2,0,-side*math.pi/2))
        box('Shopfront cornice',(face-side*.2,y,4),(1,15.4,.24),stone,.025)

# Fictional railway hall behind the southern trophy gate; no historic landmark copy.
box('Station base',(0,-144,.32),(72,25,.64),stone,.04)
box('Station hall walls',(0,-147,5.2),(68,18,10.4),brick,.045)
for x in range(-30,31,5):
    box('Station facade pier',(x,-137.75,5.2),(.9,.6,10.4),stone,.02)
    box('Station tall glass',(x+2.3,-137.63,5.25),(3.6,.1,7.4),glass,.015)
    for z in [2.7,5.2,7.7]:box('Station window transom',(x+2.3,-137.54,z),(3.7,.15,.1),gold,.005)
box('Station stone cornice',(0,-137.5,10.7),(71,1.4,.65),stone,.04)
vs=[];fs=[]
for j in range(17):
    angle=j*math.pi/16
    for y in [-158,-136]:vs.append((35*math.cos(angle),y,10.9+11*math.sin(angle)))
for j in range(16):fs.append((j*2,j*2+1,j*2+3,j*2+2))
mesh('Arched station roof',vs,fs,copper)
for y in [-158,-149,-140,-136]:
    tube('Station roof iron ribs',[(35*math.cos(j*math.pi/24),y,10.97+11*math.sin(j*math.pi/24)) for j in range(25)],.11,chrome)
text('BAHNHOF EHRENSACHE',(0,-136.7,11.25),.94,(math.pi/2,0,math.pi))
# City depth in the two otherwise open corners. Window bands are batched by material.
for side in [-1,1]:
    for i in range(7):
        x=side*(66+i*9);y=-112-(i%3)*16;h=10+(i%4)*4
        box('Distant city block',(x,y,h/2),(8.8,17,h),brick if i%2 else stone,.02)
        box('Distant city roof',(x,y,h+.35),(9.3,17.5,.7),copper,.01)
        for z in range(4,h-1,3):
            for dx in [-2.8,0,2.8]:box('Distant window',(x+dx,y+8.54,z),(1.3,.08,1.6),glass,.005)
        cyl('City chimney',(x+2,y+3,h+1),.32,2,brick,verts=8)

# Planted, bounded park beds give the inner turn a foreground layer.
for x in [-8,8]:
    for y in [-58,58]:
        box('Garden stone edging',(x,y,.18),(6.2,3.2,.35),stone,.035)
        box('Garden hedge',(x,y,.46),(5.9,2.9,.62),leaf,.2)
        for j in range(18):
            px=x+random.uniform(-2.6,2.6);py=y+random.uniform(-1.1,1.1)
            cyl('Flower stalk',(px,py,.88),.025,.3,leaf,verts=6)
            ellipsoid('Garden flower',(px,py,1.06),(.13,.13,.08),flower,segments=8)
merge_static('Stadium props / ')
save('stadium-props')
