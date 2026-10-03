"""Original articulated German shepherd. X right / Y forward / Z up. No external mesh."""
import os,sys,math,bpy
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *
tan=mat('Shepherd tawny fur',(.38,.23,.105),0,.94)
dark=mat('Shepherd black saddle',(.027,.031,.027),0,.9)
light=mat('Shepherd cheek and chest',(.57,.39,.19),0,.88)
mouth=mat('Shepherd mouth',(.07,.029,.026),0,.7)
tongue=mat('Shepherd tongue',(.49,.16,.18),0,.64)
eye=mat('Shepherd amber eyes',(.24,.115,.019),0,.27)
root=empty('shepherd')
ellipsoid('Rib cage',(0,-.13,.61),(.23,.48,.25),tan,root,segments=20)
ellipsoid('Dark saddle',(0,-.2,.765),(.215,.385,.125),dark,root,segments=20)
ellipsoid('Sloping haunch',(0,-.48,.52),(.24,.25,.25),tan,root,segments=16)
neck=ellipsoid('Alert neck',(0,.31,.78),(.185,.23,.27),tan,root,segments=20);neck.rotation_euler.x=-.27
ellipsoid('Chest ruff',(0,.36,.60),(.19,.19,.25),light,root,segments=16)
head=empty('dogHead',(0,.47,.93),root)
ellipsoid('Long wedge skull',(0,.08,.09),(.15,.22,.18),dark,head,segments=20)
for side in [-1,1]:
 ellipsoid('Tan cheek',(side*.093,.15,.045),(.07,.12,.105),tan,head,segments=16)
 ear=mesh('Pointed erect ear',[(side*.06,.0,.17),(side*.16,-.075,.19),(side*.125,.0,.46),(side*.085,.09,.19)],[(0,1,2),(0,2,3),(0,3,1),(1,3,2)],tan,head)
 mesh('Dark inner ear',[(side*.083,.02,.205),(side*.133,-.015,.23),(side*.123,.013,.39)],[(0,1,2)],dark,head)
 ellipsoid('Amber eye',(side*.118,.234,.12),(.029,.025,.026),eye,head,segments=12)
 ellipsoid('Dark eye pupil',(side*.12,.252,.12),(.017,.01,.019),black,head,segments=12)
 ellipsoid('Eye catchlight',(side*.115,.26,.13),(.005,.004,.005),cream,head,segments=8)
ellipsoid('Tapered muzzle',(0,.28,.015),(.095,.155,.075),tan,head,segments=16)
ellipsoid('Black nose',(0,.405,.03),(.082,.05,.053),dark,head,segments=16)
ellipsoid('Open mouth',(0,.31,-.056),(.075,.12,.024),mouth,head,segments=16)
ellipsoid('Lower jaw',(0,.28,-.075),(.08,.135,.034),light,head,segments=16)
ellipsoid('Panting tongue',(0,.37,-.08),(.038,.077,.014),tongue,head,segments=12)
torus('Plain leather collar',(0,.32,.88),.165,.025,black,root,axis='Y')
badge=cyl('Plain brass tag',(0,.49,.74),.044,.015,gold,root,axis='Y',verts=16)
for i,(x,y) in enumerate([(-.15,.24),(.15,.24),(-.17,-.48),(.17,-.48)]):
 leg=empty('dogLeg-'+str(i),(x,y,.54 if i<2 else .47),root)
 upper=ellipsoid('Upper leg',(0,0,-.12),(.068,.078,.16),tan,leg,segments=12)
 lower=ellipsoid('Lower leg',(0,.025,-.31 if i<2 else -.27),(.04,.046,.15 if i<2 else .12),tan,leg,segments=12)
 ellipsoid('Dark paw',(0,.067,-.475 if i<2 else -.405),(.061,.1,.038),dark,leg,segments=12)
tail=empty('dogTail',(0,-.63,.57),root)
tube('Brush tail',[(0,0,0),(0,-.22,-.12),(.05,-.42,-.29),(.07,-.48,-.38)],.065,dark,tail)
# Batch surfaces by articulation parent and material; preserve editable motion nodes.
groups={}
for o in list(bpy.context.scene.objects):
 if o.type=='MESH':groups.setdefault((o.parent,o.data.materials[0].name),[]).append(o)
for (parent,name),objects in groups.items():
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();objects[0].name=parent.name+' / '+name
save('shepherd')
