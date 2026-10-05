"""Original editable assets for the neutral Stadion der Eitelkeit slice.
Run: blender --background --python art-source/build_slice.py
No third party mesh content. Blender coordinates: X right, Y forward, Z up.
"""
import bpy, math, os, random, shutil, time
import numpy as np
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'models')
random.seed(31)
BUILD_WORLD=False
BUILD_PROGRESS_START=None
BUILD_MESH_COUNT=0
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
    if BUILD_WORLD:
        x,y,z=pos;rx,ry,rz=size;vs=[];fs=[];rings=12
        for i in range(rings+1):
            a=i*math.pi/rings
            for j in range(segments):
                b=j*2*math.pi/segments
                vs.append((x+rx*math.sin(a)*math.cos(b),y+ry*math.sin(a)*math.sin(b),z+rz*math.cos(a)))
        for i in range(rings):
            for j in range(segments):
                k=i*segments+j;n=i*segments+(j+1)%segments
                fs.append((k,n,n+segments,k+segments))
        o=mesh(name,vs,fs,m,parent)
        for p in o.data.polygons:p.use_smooth=True
        return o
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
    global BUILD_MESH_COUNT
    d=bpy.data.meshes.new(name);d.from_pydata(vs,[],fs);d.update()
    o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o)
    if BUILD_WORLD:
        BUILD_MESH_COUNT+=1
        if BUILD_MESH_COUNT%100==0:
            elapsed=time.perf_counter()-(BUILD_PROGRESS_START or time.perf_counter())
            print(f'WORLD_PROGRESS meshes={BUILD_MESH_COUNT} elapsed={elapsed:.1f}s objects={len(bpy.context.scene.objects)}',flush=True)
    return finish(o,name,m,parent)

def begin_world_profile():
    global BUILD_PROGRESS_START, BUILD_MESH_COUNT
    BUILD_PROGRESS_START=time.perf_counter(); BUILD_MESH_COUNT=0
    print('WORLD_STAGE geometry-start',flush=True)

def merge_static(prefix,direct_min_objects=6000):
    started=time.perf_counter()
    groups={}
    for o in list(bpy.context.scene.objects):
        if o.type=='MESH' and o.parent is None:
            key=o.data.materials[0].name if o.data.materials else 'none'
            groups.setdefault(key,[]).append(o)
    print(f'WORLD_STAGE merge-start groups={len(groups)} objects={sum(len(v) for v in groups.values())}',flush=True)
    for index,(key,objects) in enumerate(groups.items(),1):
        group_started=time.perf_counter()
        # World construction calls this before save() creates tiled UVs. Merge
        # those static surfaces directly in world space; object.join evaluates
        # the dependency graph and selected thousands of objects repeatedly.
        uv_names=tuple(layer.name for layer in objects[0].data.uv_layers)
        # On production geometry, bulk was slightly slower even for the
        # 5,047-object group. Keep all current groups on Blender's join path;
        # fixtures/benchmarks may lower this threshold to exercise bulk.
        direct=len(objects)>=direct_min_objects and all(len(o.data.materials)<=1 and all(p.material_index==0 for p in o.data.polygons)
                   and tuple(layer.name for layer in o.data.uv_layers)==uv_names for o in objects)
        if direct:
            vertex_count=sum(len(o.data.vertices) for o in objects)
            loop_count=sum(len(o.data.loops) for o in objects)
            polygon_count=sum(len(o.data.polygons) for o in objects)
            vertex_values=np.empty(vertex_count*3,dtype=np.float32)
            loop_vertices=np.empty(loop_count,dtype=np.int32)
            loop_starts=np.empty(polygon_count,dtype=np.int32)
            loop_totals=np.empty(polygon_count,dtype=np.int32)
            smooth=np.empty(polygon_count,dtype=np.bool_)
            uv_values={name:np.empty(loop_count*2,dtype=np.float32) for name in uv_names}
            vertex_offset=loop_offset=polygon_offset=0
            for obj in objects:
                source=obj.data;vertices=len(source.vertices);loops=len(source.loops);polygons=len(source.polygons)
                vertex_slice=slice(vertex_offset*3,(vertex_offset+vertices)*3)
                local=np.empty(vertices*3,dtype=np.float32);source.vertices.foreach_get('co',local)
                matrix=np.asarray(obj.matrix_world,dtype=np.float32)
                world=local.reshape((-1,3)) @ matrix[:3,:3].T + matrix[:3,3]
                vertex_values[vertex_slice]=world.reshape(-1)
                mirrored=np.linalg.det(matrix[:3,:3])<0
                loop_slice=slice(loop_offset,loop_offset+loops);source.loops.foreach_get('vertex_index',loop_vertices[loop_slice])
                loop_vertices[loop_slice]+=vertex_offset
                poly_slice=slice(polygon_offset,polygon_offset+polygons)
                source.polygons.foreach_get('loop_start',loop_starts[poly_slice]);loop_starts[poly_slice]+=loop_offset
                source.polygons.foreach_get('loop_total',loop_totals[poly_slice]);source.polygons.foreach_get('use_smooth',smooth[poly_slice])
                for name,layer in zip(uv_names,source.uv_layers):
                    target=uv_values[name][loop_offset*2:(loop_offset+loops)*2]
                    layer.data.foreach_get('uv',target)
                if mirrored:
                    for face_start,face_size in zip(loop_starts[poly_slice],loop_totals[poly_slice]):
                        loop_vertices[face_start:face_start+face_size]=loop_vertices[face_start:face_start+face_size][::-1]
                        for values in uv_values.values():
                            start=face_start*2;end=(face_start+face_size)*2
                            values[start:end]=values[start:end].reshape((-1,2))[::-1].reshape(-1)
                vertex_offset+=vertices;loop_offset+=loops;polygon_offset+=polygons
            data=bpy.data.meshes.new(prefix+key)
            data.vertices.add(vertex_count);data.vertices.foreach_set('co',vertex_values)
            data.loops.add(loop_count);data.loops.foreach_set('vertex_index',loop_vertices)
            data.polygons.add(polygon_count);data.polygons.foreach_set('loop_start',loop_starts)
            data.polygons.foreach_set('loop_total',loop_totals);data.polygons.foreach_set('use_smooth',smooth)
            material=objects[0].data.materials[0] if objects[0].data.materials else None
            if material:data.materials.append(material)
            data.update(calc_edges=True)
            for name,values in uv_values.items():
                layer=data.uv_layers.new(name=name)
                layer.data.foreach_set('uv',values)
            merged=bpy.data.objects.new(prefix+key,data);bpy.context.scene.collection.objects.link(merged)
            for obj in objects:
                old_data=obj.data;bpy.data.objects.remove(obj,do_unlink=True)
                if old_data.users==0:bpy.data.meshes.remove(old_data)
        else:
            # Retain Blender's full join semantics for future world surfaces
            # carrying mixed material slots or incompatible UV layouts.
            bpy.ops.object.select_all(action='DESELECT')
            for o in objects:o.select_set(True)
            bpy.context.view_layer.objects.active=objects[0]
            bpy.ops.object.join();bpy.context.object.name=prefix+key
        print(f'WORLD_PROGRESS merge-group={index}/{len(groups)} material={key} objects={len(objects)} elapsed={time.perf_counter()-group_started:.1f}s total={time.perf_counter()-started:.1f}s',flush=True)

def save(name):
    started=time.perf_counter()
    bpy.context.preferences.filepaths.save_version=0
    if BUILD_WORLD: print(f'WORLD_STAGE uv-start objects={len(bpy.context.scene.objects)}',flush=True)
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
    if BUILD_WORLD: print(f'WORLD_STAGE blend-save elapsed={time.perf_counter()-started:.1f}s',flush=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'art-source',name+'.blend'))
    raw=os.path.join(ROOT,'.tools','raw-models');os.makedirs(raw,exist_ok=True)
    if BUILD_WORLD: print(f'WORLD_STAGE glb-export-start elapsed={time.perf_counter()-started:.1f}s',flush=True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(raw,name+'.glb'),export_format='GLB',export_yup=True,export_apply=True)
    if BUILD_WORLD: print(f'WORLD_STAGE runtime-copy elapsed={time.perf_counter()-started:.1f}s',flush=True)
    shutil.copyfile(os.path.join(raw,name+'.glb'),os.path.join(OUT,name+'.glb'))
    if BUILD_WORLD: print(f'WORLD_STAGE complete elapsed={time.perf_counter()-started:.1f}s',flush=True)

