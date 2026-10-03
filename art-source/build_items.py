"""Original neutral postal props for the confirmed three item archetypes."""
import os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *
paper=mat('Permit paper',(.81,.75,.57),0,.82)
ink=mat('Official burgundy',(.3,.035,.045),.35,.38)
blue=mat('Search lantern',(.025,.31,.36),.55,.25)
def envelope(parent,pos,size=(.65,.05,.4)):
    box('Sealed envelope',pos,size,paper,.03,parent)
    x,y,z=pos
    tube('Envelope flap',[(x-size[0]/2,y-.04,z),(x,y-.055,z+.14),(x+size[0]/2,y-.04,z)],.012,gold,parent)
    cyl('Wax seal',(x,y-.055,z),.08,.025,ink,parent,axis='Y',verts=16)

root=empty('direct')
cyl('Pneumatic brass capsule',(0,0,0),.16,.95,gold,root,axis='Y',verts=24)
ellipsoid('Capsule cap',(0,.53,0),(.17,.13,.17),chrome,root)
for side in [-1,1]:envelope(root,(side*.24,-.3,0),(.38,.05,.28))
torus('Delivery seal',(0,-.42,0),.16,.026,ink,root,axis='Y')
root=empty('homing')
ellipsoid('Search casing',(0,0,0),(.28,.42,.23),ink,root)
cyl('Search lens',(0,.37,0),.17,.12,gold,root,axis='Y')
ellipsoid('Blue lens',(0,.46,0),(.145,.045,.145),blue,root)
for side in [-1,1]:envelope(root,(side*.3,-.21,0),(.46,.055,.35))
root=empty('trap')
box('Stamp base',(0,0,.17),(.92,.7,.22),ink,.06,root)
box('Stamp metal plate',(0,0,.04),(.97,.75,.08),gold,.02,root)
cyl('Stamp grip',(0,0,.48),.12,.55,black,root)
ellipsoid('Stamp handle',(0,0,.78),(.27,.23,.18),black,root)
root=empty('pickup')
box('Dispatch crate',(0,0,0),(.7,.7,.7),teal,.08,root)
for x in [-.27,.27]:box('Brass crate belt',(x,0,0),(.035,.76,.76),gold,.01,root)
envelope(root,(0,-.37,0),(.49,.06,.34))
# Join by parent/material while retaining four editable model roots.
groups={}
for o in list(bpy.context.scene.objects):
    if o.type=='MESH':groups.setdefault((o.parent,o.data.materials[0].name),[]).append(o)
for (parent,name),objects in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();objects[0].name=parent.name+' / '+name
save('items')
