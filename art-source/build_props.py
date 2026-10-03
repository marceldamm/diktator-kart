"""Original editable stadium furniture and fictional adult spectator silhouettes."""
import os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *
BUILD_WORLD=False
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
merge_static('Stadium props / ')
save('stadium-props')
