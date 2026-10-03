"""Original editable assets for the neutral Stadion der Eitelkeit slice.
Run: blender --background --python art-source/build_slice.py
No third party mesh content. Blender coordinates: X right, Y forward, Z up.
"""
import bpy, math, os, random
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'models')
random.seed(31)
BUILD_WORLD=False
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def mat(name, color, metal=0, rough=.5):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
    return m

teal=mat('Petrol enamel',(.018,.19,.22),.72,.24)
gold=mat('Brushed champagne brass',(.72,.43,.12),.78,.3)
cream=mat('Ivory enamel',(.82,.76,.6),.28,.28)
rubber=mat('Tire rubber',(.025,.03,.035),0,.86)
chrome=mat('Polished steel',(.48,.56,.6),.88,.23)
black=mat('Dark leather',(.035,.045,.05),0,.48)
coat=mat('Ivory racing suit',(.68,.64,.52),0,.85)
skin=mat('Warm skin',(.6,.32,.18),0,.75)
hair=mat('Hair and leather helmet',(.09,.035,.018),0,.78)
glass=mat('Smoked goggles',(.04,.13,.16),.55,.16)
red=mat('Rear lamp ruby',(.58,.025,.018),.25,.25)
glow=mat('Warm headlamp',(.95,.72,.32),.15,.18)
glow.node_tree.nodes.get('Principled BSDF').inputs['Emission Color'].default_value=(1,.56,.18,1)
glow.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=1.2

def finish(o,name,m,parent=None):
    o.name=name
    if m: o.data.materials.append(m)
    if parent: o.parent=parent
    return o

def empty(name,pos=(0,0,0),parent=None):
    o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o)
    o.location=pos; o.parent=parent; return o

def box(name,pos,size,m,bevel=.04,parent=None):
    if BUILD_WORLD:
        x,y,z=pos;a,b,c=[v/2 for v in size]
        return mesh(name,[(x+dx*a,y+dy*b,z+dz*c) for dx,dy,dz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],m,parent)
    bpy.ops.mesh.primitive_cube_add(size=1,location=pos); o=bpy.context.object
    o.scale=size; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=o.modifiers.new('Machined edges','BEVEL'); mod.width=bevel; mod.segments=3
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
        mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish(o,name,m,parent)

def ellipsoid(name,pos,size,m,parent=None,segments=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=12,location=pos)
    o=bpy.context.object; o.scale=size
    for p in o.data.polygons:p.use_smooth=True
    return finish(o,name,m,parent)

def cyl(name,pos,r,depth,m,parent=None,axis='Z',r2=None,verts=24):
    if BUILD_WORLD and axis=='Z':
        x,y,z=pos;vs=[]
        for zz,rr in [(z-depth/2,r),(z+depth/2,r if r2 is None else r2)]:
            vs.extend([(x+rr*math.cos(i*2*math.pi/verts),y+rr*math.sin(i*2*math.pi/verts),zz) for i in range(verts)])
        fs=[(i,(i+1)%verts,(i+1)%verts+verts,i+verts) for i in range(verts)]
        fs.extend([tuple(reversed(range(verts))),tuple(i+verts for i in range(verts))])
        return mesh(name,vs,fs,m,parent)
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r,radius2=r if r2 is None else r2,depth=depth,location=pos)
    o=bpy.context.object
    if axis=='X':o.rotation_euler[1]=math.pi/2
    if axis=='Y':o.rotation_euler[0]=math.pi/2
    for p in o.data.polygons:p.use_smooth=len(p.vertices)==4
    return finish(o,name,m,parent)

def tube(name,points,r,m,parent=None):
    curve=bpy.data.curves.new(name,'CURVE'); curve.dimensions='3D'
    curve.bevel_depth=r; curve.bevel_resolution=2; curve.resolution_u=10
    s=curve.splines.new('BEZIER'); s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points):
        p.co=co; p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o)
    o.data.materials.append(m);o.parent=parent
    bpy.context.view_layer.objects.active=o;o.select_set(True)
    bpy.ops.object.convert(target='MESH');o.select_set(False);return o

def torus(name,pos,major,minor,m,parent=None,axis='Z'):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=32,minor_segments=8,location=pos)
    o=bpy.context.object
    if axis=='X':o.rotation_euler[1]=math.pi/2
    if axis=='Y':o.rotation_euler[0]=math.pi/2
    for p in o.data.polygons:p.use_smooth=True
    return finish(o,name,m,parent)

def mesh(name,vs,fs,m,parent=None):
    d=bpy.data.meshes.new(name);d.from_pydata(vs,[],fs);d.update()
    o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o)
    return finish(o,name,m,parent)

def merge_static(prefix):
    groups={}
    for o in list(bpy.context.scene.objects):
        if o.type=='MESH' and o.parent is None:
            key=o.data.materials[0].name if o.data.materials else 'none'
            groups.setdefault(key,[]).append(o)
    for key,objects in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join();bpy.context.object.name=prefix+key

def save(name):
    bpy.context.preferences.filepaths.save_version=0
    # Planar UVs at metre scale are preserved in GLB for tiled stone/cloth maps.
    for o in bpy.context.scene.objects:
        if o.type=='MESH' and not o.data.uv_layers:
            uv=o.data.uv_layers.new(name='Surface metre UV')
            for p in o.data.polygons:
                axis=max(range(3),key=lambda i:abs(p.normal[i]))
                axes=[i for i in range(3) if i!=axis]
                for li in p.loop_indices:
                    v=o.data.vertices[o.data.loops[li].vertex_index].co
                    uv.data[li].uv=(v[axes[0]]*.5,v[axes[1]]*.5)
    # Keep pivots editable; batch only surfaces sharing a parent and material.
    if name=='hero-kart':
        groups={}
        for o in list(bpy.context.scene.objects):
            if o.type=='MESH':
                key=(o.parent.name if o.parent else '',o.data.materials[0].name)
                groups.setdefault(key,[]).append(o)
        for key,objects in groups.items():
            bpy.ops.object.select_all(action='DESELECT')
            for o in objects:o.select_set(True)
            bpy.context.view_layer.objects.active=objects[0]
            bpy.ops.object.join();bpy.context.object.name=key[0]+' / '+key[1]
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'art-source',name+'.blend'))
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,name+'.glb'),export_format='GLB',export_yup=True,export_apply=True)

# Sculpted vintage roadster, designed at the scale of the existing controller.
kart=empty('hero-kart')
sections=[(-1.35,.42,.4,.66),(-1.1,.7,.35,.8),(-.7,.71,.32,.78),(-.25,.62,.32,.74),(.1,.58,.32,.86),(.55,.5,.34,.94),(.95,.36,.34,.8),(1.3,.26,.32,.62),(1.42,.2,.35,.5)]
vs=[];fs=[];N=20
for y,w,bottom,top in sections:
    for i in range(N):
        a=2*math.pi*i/N;vs.append((w*math.cos(a),y,(bottom+top)/2+(top-bottom)/2*math.sin(a)))
for j in range(len(sections)-1):
    for i in range(N):fs.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
fs.extend([tuple(reversed(range(N))),tuple((len(sections)-1)*N+i for i in range(N))])
body=mesh('Sculpted enamel body',vs,fs,teal,kart)
for p in body.data.polygons:p.use_smooth=True
box('Low chassis', (0,0,.28),(1.36,2.6,.12),black,.08,kart)
for s in [-1,1]:
    tube('Continuous brass pinstripe',[(s*.4,-1.32,.63),(s*.69,-.85,.66),(s*.6,.05,.76),(s*.42,.75,.72),(s*.22,1.39,.48)],.018,gold,kart)
    tube('Chassis bumper',[(s*.78,-1.35,.35),(s*.84,-.8,.3),(s*.81,.15,.3),(s*.61,1.23,.3),(s*.32,1.5,.32)],.038,chrome,kart)
    box('Ivory side pod',(s*.67,-.03,.44),(.2,1.12,.2),cream,.08,kart)
    for y in [-.4,-.22,-.04,.14]:box('Side cooling vent',(s*.78,y,.47),(.02,.085,.1),black,.012,kart)
    cyl('Headlamp cup',(s*.49,.84,.7),.12,.19,gold,kart,'Y')
    ellipsoid('Headlamp glass',(s*.49,.945,.7),(.103,.033,.103),glow,kart)
    tube('Exhaust pipe',[(s*.55,-.48,.48),(s*.65,-.9,.53),(s*.72,-1.46,.62)],.065,chrome,kart)
    cyl('Exhaust black mouth',(s*.72,-1.47,.62),.052,.015,black,kart,'Y')
    ellipsoid('Rear stop light',(s*.43,-1.35,.55),(.1,.035,.075),red,kart)
    tube('Front suspension arm',[(s*.32,.58,.37),(s*.65,.69,.32),(s*.88,.68,.34)],.035,chrome,kart)
    cyl('Rear axle',(s*.66,-.68,.33),.045,.42,chrome,kart,'X')
    for j in range(6):torus('Suspension coil',(s*.59,.62,.35+j*.035),.042,.012,chrome,kart)
    box('Rear mudguard',(s*.86,-.65,.64),(.42,.66,.07),teal,.03,kart)
box('Nose ivory inset',(0,.86,.78),(.34,.69,.045),cream,.12,kart)
for x in [-.14,-.07,0,.07,.14]:tube('Front grille rib',[(x,1.4,.38),(x,1.38,.49),(x,1.28,.61)],.012,gold,kart)
torus('Hood badge',(0,.84,.81),.08,.013,gold,kart)
box('Seat cushion',(0,-.52,.79),(.59,.7,.16),black,.07,kart)
box('Seat back',(0,-.9,1.02),(.65,.16,.54),black,.08,kart)
for x in [-.19,0,.19]:tube('Seat stitching',[(x,-.985,.82),(x,-.985,1.04),(x,-.985,1.22)],.009,gold,kart)
for i,(x,y) in enumerate([(-.83,.68),(.83,.68),(-.83,-.68),(.83,-.68)]):
    pivot=empty('wheelPivot-'+str(i),(x,y,.34),kart)
    spin=empty('wheelSpin-'+str(i),parent=pivot)
    cyl('Tire '+str(i),(0,0,0),.33,.3,rubber,spin,'X',verts=32)
    for side in [-1,1]:
        torus('Tire sidewall',(side*.15,0,0),.256,.025,rubber,spin,'X')
        cyl('Alloy rim',(side*.154,0,0),.19,.023,gold,spin,'X')
        cyl('Rim well',(side*.17,0,0),.144,.012,black,spin,'X')
        cyl('Axle cap',(side*.19,0,0),.055,.033,chrome,spin,'X')
        for j in range(8):
            a=j*math.pi/4
            tube('Alloy spoke',[(side*.184,0,0),(side*.184,.145*math.sin(a),.145*math.cos(a))],.014,gold,spin)
    for j in range(24):
        a=j*math.pi/12
        tread=box('Tire tread',(0,.328*math.sin(a),.328*math.cos(a)),(.27,.034,.014),black,.004,spin)
        tread.rotation_euler[0]=-a

driver=empty('driverPose',(0,0,0),kart)
ellipsoid('Suit torso',(0,-.47,1.24),(.37,.28,.43),coat,driver)
box('Suit belt',(0,-.28,1.02),(.54,.1,.1),black,.015,driver)
box('Belt buckle',(0,-.215,1.02),(.09,.035,.09),gold,.01,driver)
for x in [-.17,.17]:
    ellipsoid('Racing knee',(x,.02,.91),(.13,.28,.14),black,driver)
    tube('Racing arm',[(x*1.8,-.43,1.45),(x*2,-.03,1.2),(x*1.25,.25,1.19)],.095,coat,driver)
    ellipsoid('Gloved hand',(x*1.27,.24,1.2),(.09,.09,.07),black,driver)
ellipsoid('Neck',(0,-.44,1.62),(.11,.11,.13),skin,driver)
ellipsoid('Driver caricature head',(0,-.43,1.94),(.285,.245,.32),skin,driver)
ellipsoid('Leather aviator helmet',(0,-.48,2.08),(.3,.24,.24),hair,driver)
for x in [-.28,.28]:ellipsoid('Helmet ear',(x,-.44,1.97),(.045,.105,.11),hair,driver)
for x in [-.12,.12]:
    ellipsoid('Goggle brass frame',(x,-.19,2.02),(.115,.047,.072),gold,driver)
    ellipsoid('Goggle glass',(x,-.154,2.02),(.093,.016,.053),glass,driver)
ellipsoid('Nose',(0,-.145,1.94),(.065,.08,.06),skin,driver)
for x in [-.055,.055]:ellipsoid('Moustache',(x,-.18,1.865),(.072,.023,.03),hair,driver)
tube('Smirk',[(-.07,-.203,1.82),(0,-.215,1.805),(.07,-.203,1.83)],.009,hair,driver)
scarf=empty('scarfFlap',parent=driver)
tube('Ivory scarf tail',[(.15,-.57,1.6),(.23,-.95,1.54),(.44,-1.23,1.66)],.075,cream,scarf)
for x in [-.32,.32]:
    box('Suit shoulder trim',(x,-.44,1.52),(.12,.28,.045),gold,.02,driver)
for side in [-1,1]:
    tube('Helmet stitched seam',[(side*.15,-.62,1.98),(side*.2,-.61,2.18),(side*.1,-.43,2.3)],.007,cream,driver)
    tube('Suit lapel',[(side*.11,-.21,1.55),(side*.17,-.19,1.32),(side*.07,-.2,1.2)],.022,teal,driver)
    tube('Suit sleeve cuff',[(side*.21,.19,1.2),(side*.25,.25,1.21),(side*.25,.28,1.15)],.02,gold,driver)
    torus('Decorative rear chassis ring',(side*.45,-1.36,.56),.15,.015,gold,kart,'Y')
    for j in range(6):
        a=j*math.pi/3
        ellipsoid('Chassis ornament',(side*.45+.13*math.cos(a),-1.39,.56+.13*math.sin(a)),(.027,.012,.046),gold,kart,segments=12)
for z in [1.15,1.28,1.4]:ellipsoid('Suit button',(0,-.18,z),(.025,.017,.025),gold,driver)
steering=empty('steeringWheel',(0,.22,1.21),kart)
torus('Steering leather rim',(0,0,0),.22,.025,black,steering,'Y')
for a in [0,2.1,4.2]:tube('Steering spoke',[(0,0,0),(.2*math.sin(a),0,.2*math.cos(a))],.018,chrome,steering)
cyl('Steering boss',(0,-.01,0),.055,.035,gold,steering,'Y')
box('Dashboard',(0,.36,1.03),(.72,.15,.19),teal,.05,kart)
for x,r in [(-.2,.063),(0,.09),(.2,.063)]:
    cyl('Gauge brass bezel',(x,.265,1.08),r,.025,gold,kart,'Y')
    cyl('Gauge face',(x,.247,1.08),r*.85,.008,cream,kart,'Y')
    tube('Gauge needle',[(x,.235,1.08),(x+.02,.235,1.08+r*.65)],.004,black,kart)
save('hero-kart')

# Monumental fictional civic stadium. All static pieces are merged by material.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
BUILD_WORLD=True
stone=mat('Warm limestone',(.56,.48,.36),0,.8)
pale=mat('Carved ivory stone',(.78,.69,.52),0,.72)
darkstone=mat('Sandstone shadow',(.33,.29,.23),0,.87)
copper=mat('Oxidised copper roof',(.07,.27,.24),.62,.48)
window=mat('Recessed blue glass',(.045,.105,.13),.35,.25)
burgundy=mat('Theatre burgundy cloth',(.32,.025,.035),0,.94)
leaf=mat('Cypress foliage',(.075,.18,.075),0,.92)
trunk=mat('Bark',(.13,.07,.035),0,.96)

def column(x,y,z,h,r=.48):
    cyl('Fluted column',(x,y,z+h/2),r,h,pale,r2=r*.88,verts=16)
    for j in range(10):
        a=j*math.pi/5
        cyl('Column flute',(x+r*.94*math.sin(a),y+r*.94*math.cos(a),z+h/2),r*.09,h*.92,darkstone,verts=6)
    for dz,rr in [(0,r*1.22),(.2,r*1.12),(h-.2,r*1.12),(h,r*1.32)]:
        cyl('Column moulding',(x,y,z+dz),rr,.2,pale)

def arch(x,y,z,width,height,depth,m):
    r=width/2;vs=[];fs=[]
    for j in range(17):
        a=j*math.pi/16
        for yy,rr in [(y-depth/2,r),(y-depth/2,r+.45),(y+depth/2,r),(y+depth/2,r+.45)]:
            vs.append((x+rr*math.cos(a),yy,z+height-r+rr*math.sin(a)))
    for j in range(16):
        k=j*4
        fs.extend([(k,k+4,k+5,k+1),(k+2,k+3,k+7,k+6),(k,k+2,k+6,k+4),(k+1,k+5,k+7,k+3)])
    mesh('Masonry arch',vs,fs,m)
    for s in [-1,1]:box('Arch pier',(x+s*(r+.22),y,z+(height-r)/2),(.45,depth,height-r),m,.02)

def dome(x,y,z,r,h):
    cyl('Dome drum',(x,y,z+1.4),r*.82,2.8,pale,verts=48)
    vs=[];fs=[];S=48;R=14
    for i in range(R+1):
        a=i*math.pi/2/R
        for j in range(S):
            b=j*2*math.pi/S;vs.append((x+r*math.cos(a)*math.cos(b),y+r*math.cos(a)*math.sin(b),z+2.8+h*math.sin(a)))
    for i in range(R):
        for j in range(S):fs.append((i*S+j,i*S+(j+1)%S,(i+1)*S+(j+1)%S,(i+1)*S+j))
    d=mesh('Ribbed copper dome',vs,fs,copper)
    for p in d.data.polygons:p.use_smooth=True
    for j in range(16):
        b=j*math.pi/8
        tube('Dome brass rib',[(x+r*math.cos(i*math.pi/24)*math.cos(b),y+r*math.cos(i*math.pi/24)*math.sin(b),z+2.8+h*math.sin(i*math.pi/24)) for i in range(13)],.06,gold)
    cyl('Dome lantern',(x,y,z+2.8+h+1.1),.9,2.2,pale,verts=12)
    cyl('Lantern roof',(x,y,z+2.8+h+2.5),1.2,.8,copper,r2=.05)
    cyl('Finial',(x,y,z+2.8+h+3.2),.08,1.2,gold)

def text(name,body,pos,size,m,rotation=(math.pi/2,0,0)):
    c=bpy.data.curves.new(name,'FONT');c.body=body;c.align_x='CENTER';c.size=size;c.extrude=.016
    o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.location=pos;o.rotation_euler=rotation;o.data.materials.append(m)
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')

# Building is beyond the northern curve, never a hidden track obstruction.
Y=127
box('Palace podium',(0,Y,1),(63,22,2),darkstone,.12)
box('Main hall',(0,Y+3,9),(45,16,16),stone,.08)
for z in [2.1,10.8,17.2,18]:box('Palace cornice',(0,Y-5,z),(53,1.8,.5),pale,.05)
for x in range(-24,25,4):
    column(x,Y-7,2.2,8.4,.55)
    arch(x,Y-6.8,2.2,2.6,7,.5,pale)
    box('Deep arcade',(x,Y-6.15,5.4),(2.5,.1,6.5),window,.02)
    box('Upper window',(x,Y-5.15,14),(1.8,.12,3.1),window,.04)
    arch(x,Y-5.3,12.5,1.8,3.6,.35,pale)
    box('Balustrade',(x,Y-7,11.6),(3.5,.6,.24),pale,.03)
    for dx in [-1.2,-.6,0,.6,1.2]:cyl('Baluster',(x+dx,Y-7,11.2),.09,.7,pale,verts=8)
for side in [-1,1]:
    x=side*31
    box('Civic tower',(x,Y,12),(10,13,24),stone,.1)
    for z in [2,9,19,24]:box('Tower cornice',(x,Y,z),(11.3,14.2,.5),pale,.05)
    for dx in [-2.8,0,2.8]:
        column(x+dx,Y-6.8,10,8,.35)
        box('Tower window',(x+dx,Y-6.59,14),(1.3,.12,5),window,.03)
    dome(x,Y,24,5.2,4)
    box('Banner',(x,Y-7.15,6.5),(2.1,.09,6.1),burgundy,.01)
    torus('Civic seal',(x,Y-7.23,7.7),.52,.09,gold,axis='Y')
    text('Civic mark','?',(x,Y-7.28,7.15),1.05,gold)
dome(0,Y+3,17.5,10,8)
text('Stadium sign','STADION DER EITELKEIT',(0,Y-7.98,17.65),1.1,gold)
text('Satirical subtitle','APPLAUS NUR MIT GENEHMIGUNG',(0,Y-7.98,16.2),.48,pale)
for step in range(5):box('Palace stairs',(0,Y-12+step*.7,.16+step*.18),(49,1.1,.32+step*.36),pale,.03)

# Boulevard terraces: varied façades, recessed windows, balconies, pitched roofs.
for side in [-1,1]:
    for idx,y in enumerate(range(-65,66,18)):
        x=side*64;h=12+(idx%3)*2
        box('Boulevard house',(x,y,h/2),(14,16,h),stone if idx%2 else pale,.1)
        for z in [1,4,h-.7,h]:box('Facade belt',(x,y,z),(14.6,16.4,.28),darkstone,.04)
        # Inward face points along X. Roof is a real pitched silhouette.
        vs=[(x-7.6,y-8.6,h),(x-7.6,y+8.6,h),(x+7.6,y-8.6,h),(x+7.6,y+8.6,h),(x,y-8.6,h+3),(x,y+8.6,h+3)]
        mesh('Pitched copper roof',vs,[(0,1,5,4),(2,4,5,3),(0,4,2),(1,3,5)],copper)
        for z in [5.6,9,12.4]:
            if z>h-1:continue
            for dy in [-5.2,-1.8,1.8,5.2]:
                box('Window recess',(x-side*7.06,y+dy,z),(.12,1.6,2.1),window,.03)
                for dz in [-1.1,1.1]:box('Window moulding',(x-side*7.2,y+dy,z+dz),(.25,2,.14),pale,.02)
                box('Window mullion',(x-side*7.24,y+dy,z),(.15,.07,2.1),gold,.008)
                if idx%2==0:
                    box('Balcony slab',(x-side*7.6,y+dy,z-1.15),(1.1,2.3,.15),pale,.03)
                    for dd in [-.9,-.45,0,.45,.9]:cyl('Balcony spindle',(x-side*8.03,y+dy+dd,z-.68),.032,.85,black,verts=6)
                    tube('Balcony rail',[(x-side*8.03,y+dy-1.1,z-.25),(x-side*8.03,y+dy+1.1,z-.25)],.035,black)
        box('House chimney',(x+2,y+3,h+2),(1.2,1.1,2.5),darkstone,.03)

# Gate at southern end: three clear arches and visible bureaucracy gag.
for x in [-10,10]:
    box('Gate tower',(x,-113,5),(4,5,10),pale,.08)
    box('Gate cornice',(x,-113,10),(5,6,.55),gold,.05)
arch(0,-113,0,15,9,2,pale)
text('Gate sign','AMT FUER UEBERHOLGENEHMIGUNGEN',(0,-111.6,10.8),.6,gold,(math.pi/2,0,math.pi))
for x in [-10,10]:
    cyl('Gate plinth',(x,-113,11.1),1,.9,darkstone)
    # Oversized trophy rather than a historical icon.
    cyl('Trophy stem',(x,-113,12),.18,1,gold)
    cyl('Trophy cup',(x,-113,13),.5,1,gold,r2=.95)
    for s in [-1,1]:torus('Trophy handle',(x+s*.9,-113,13),.42,.08,gold,axis='Y')

# Central park and trimmed cypresses form depth without blocking the road.
for x in [-15,15]:
    for y in range(-60,61,15):
        cyl('Tree trunk',(x,y,1.5),.22,3,trunk,verts=8)
        vs=[];fs=[];rings=18;sides=14
        for i in range(rings):
            z=1.5+i*.35;r=1.15*math.sin(math.pi*(i+.4)/rings)**.6
            for j in range(sides):
                a=j*math.pi*2/sides;rr=r*(.82+random.random()*.32)
                vs.append((x+rr*math.cos(a),y+rr*math.sin(a),z+(random.random()-.5)*.23))
        for i in range(rings-1):
            for j in range(sides):fs.append((i*sides+j,i*sides+(j+1)%sides,(i+1)*sides+(j+1)%sides,(i+1)*sides+j))
        tree=mesh('Sculpted cypress foliage',vs,fs,leaf)
        for p in tree.data.polygons:p.use_smooth=True
        box('Tree planter',(x,y,.25),(3.2,3.2,.5),pale,.08)
for y in [-40,40]:
    cyl('Fountain basin',(0,y,.25),5.6,.5,pale,verts=48)
    torus('Fountain rim',(0,y,.55),5.2,.24,pale)
    cyl('Fountain pedestal',(0,y,1.2),.7,1.4,pale)
    cyl('Fountain upper basin',(0,y,2),2.2,.35,pale,r2=2.5,verts=32)
    cyl('Fountain finial',(0,y,2.7),.25,1.2,gold,r2=.05)
merge_static('Architecture / ')
save('stadium-world')
print('SLICE_ASSETS_COMPLETE')
