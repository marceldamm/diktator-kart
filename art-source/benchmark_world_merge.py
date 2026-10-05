"""Compare operator and bulk mesh merge with a 13,338-object/32-material fixture.

Run with the bundled Blender from the repository root:
  .tools/blender-4.5.3-windows-x64/blender.exe --background --python art-source/benchmark_world_merge.py
"""
import math
import os
import sys
import time

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mesh_tools as mt

GROUP_COUNTS=[5047,1219,1493,994]+[164]*27+[157]
SEGMENTS=16
vertices=[(radius*math.cos(i*2*math.pi/SEGMENTS),radius*math.sin(i*2*math.pi/SEGMENTS),z)
          for z,radius in [(-.5,.8),(.5,1.0)] for i in range(SEGMENTS)]
faces=[(i,(i+1)%SEGMENTS,(i+1)%SEGMENTS+SEGMENTS,i+SEGMENTS) for i in range(SEGMENTS)]
faces.extend([tuple(reversed(range(SEGMENTS))),tuple(range(SEGMENTS,SEGMENTS*2))])


def create_dataset(prefix):
    groups={};materials=[]
    for index,count in enumerate(GROUP_COUNTS):
        material=bpy.data.materials.new(f'{prefix} material {index}');materials.append(material)
        mesh=bpy.data.meshes.new(f'{prefix} repeated static shape {index}')
        mesh.from_pydata(vertices,[],faces);mesh.materials.append(material);mesh.update()
        objects=[]
        for item in range(count):
            obj=bpy.data.objects.new(f'{prefix} group {index} object {item}',mesh);bpy.context.scene.collection.objects.link(obj)
            obj.location=(item%97,(item//97)%53,(index%7)*.2);obj.rotation_euler[2]=(item%19)*.01;obj.scale=(.9+(item%5)*.03,1.05,.95)
            objects.append(obj)
        groups[material.name]=objects
    bpy.context.view_layer.update()
    return groups


def legacy_merge(groups):
    for name,objects in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join();bpy.context.object.name='Legacy / '+name


def counts(prefix):
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith(prefix)]
    return len(meshes),sum(len(o.data.vertices) for o in meshes),sum(len(o.data.polygons) for o in meshes)


legacy=create_dataset('Legacy');expected=(sum(GROUP_COUNTS)*len(vertices),sum(GROUP_COUNTS)*len(faces))
started=time.perf_counter();legacy_merge(legacy);legacy_seconds=time.perf_counter()-started
legacy_counts=counts('Legacy / ')
assert legacy_counts==(32,*expected),f'Operator output mismatch: {legacy_counts}'
for obj in [o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Legacy / ')]:
    bpy.data.objects.remove(obj,do_unlink=True)
for mesh in list(bpy.data.meshes):
    if mesh.users==0:bpy.data.meshes.remove(mesh)
for material in list(bpy.data.materials):
    if material.users==0:bpy.data.materials.remove(material)

create_dataset('Bulk');started=time.perf_counter();mt.merge_static('Bulk / ', direct_min_objects=0);bulk_seconds=time.perf_counter()-started
bulk_counts=counts('Bulk / ')
assert bulk_counts==(32,*expected),f'Bulk output mismatch: {bulk_counts}'
print(f'WORLD_MERGE_BENCHMARK_PASS objects={sum(GROUP_COUNTS)} groups=32 vertices={expected[0]} faces={expected[1]} operator_s={legacy_seconds:.2f} bulk_s={bulk_seconds:.2f} speedup={legacy_seconds/bulk_seconds:.2f}x')
