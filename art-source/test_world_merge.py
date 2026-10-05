"""Compare direct world batching to Blender's operator join on a small fixture.

Run from the repository root with the bundled Blender Python executable:
  .tools/blender-4.5.3-windows-x64/blender.exe --background --python art-source/test_world_merge.py
"""
import math
import os
import sys
from collections import Counter

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mesh_tools as mt


def create_fixture(prefix):
    mats = [bpy.data.materials.new(f'{prefix} material {i}') for i in range(2)]
    objects = []
    cube_vertices = [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),
                     (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]
    cube_faces = [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    for i in range(6):
        material_index = i % 2
        mesh = bpy.data.meshes.new(f'{prefix} mesh {i}')
        mesh.from_pydata(cube_vertices, [], cube_faces); mesh.materials.append(mats[material_index]); mesh.update()
        for face_index, polygon in enumerate(mesh.polygons): polygon.use_smooth = (face_index + i) % 3 == 0
        uv = mesh.uv_layers.new(name='Fixture UV')
        for loop in mesh.loops:
            co = mesh.vertices[loop.vertex_index].co
            uv.data[loop.index].uv = (co.x * .25 + i * .1, co.y * .25 - i * .05)
        obj = bpy.data.objects.new(f'{prefix} object {i}', mesh); bpy.context.scene.collection.objects.link(obj)
        obj.location = (i * 2.75, (i % 2) * -3.5, i * .25)
        obj.rotation_euler = (.1 * i, .07 * i, .19 * i)
        obj.scale = (.8 + i * .08, .9 + i * .03, 1.05)
        objects.append(obj)
    bpy.context.view_layer.update()
    return objects


def signature(objects):
    faces = Counter();uv_corners = Counter()
    for obj in objects:
        mat = obj.data.materials[0].name if obj.data.materials else 'none'
        uv = obj.data.uv_layers.get('Fixture UV')
        for polygon in obj.data.polygons:
            corners=[]
            for loop_index in polygon.loop_indices:
                loop=obj.data.loops[loop_index];world=obj.matrix_world @ obj.data.vertices[loop.vertex_index].co
                coord=tuple(round(v,4) for v in world)
                uvcoord=tuple(round(v,5) for v in uv.data[loop_index].uv) if uv else None
                corners.append((coord,uvcoord))
                uv_corners[(mat,coord,uvcoord)] += 1
            faces[(mat,polygon.use_smooth,tuple(sorted(corners)))] += 1
    return faces,uv_corners


def legacy_join(objects):
    groups={}
    for obj in objects:groups.setdefault(obj.data.materials[0].name,[]).append(obj)
    for group in groups.values():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in group:obj.select_set(True)
        bpy.context.view_layer.objects.active=group[0]
        bpy.ops.object.join()


reference=create_fixture('Reference');expected=signature(reference);legacy_join(reference)
baseline=signature([o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Reference')])
if expected!=baseline:
    print('REFERENCE_DIFF expected_faces=',sum(expected[0].values()),'actual_faces=',sum(baseline[0].values()),
          'expected_uv=',sum(expected[1].values()),'actual_uv=',sum(baseline[1].values()),
          'face_delta=',sum((expected[0]-baseline[0]).values()),'face_extra=',sum((baseline[0]-expected[0]).values()),
          'uv_delta=',sum((expected[1]-baseline[1]).values()),'uv_extra=',sum((baseline[1]-expected[1]).values()))
    print('REFERENCE_SAMPLE expected=',next(iter(expected[0].items())),'actual=',next(iter(baseline[0].items())))
    print('REFERENCE_MISSING_FACE=',next(iter((expected[0]-baseline[0]).items()),None))
    print('REFERENCE_EXTRA_FACE=',next(iter((baseline[0]-expected[0]).items()),None))
    raise AssertionError('Blender join changed world-space faces or UV corners')
for obj in [o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Reference')]:
    mesh=obj.data;bpy.data.objects.remove(obj,do_unlink=True)
    if mesh.users==0:bpy.data.meshes.remove(mesh)

optimized=create_fixture('Optimized');optimized[-1].scale.x *= -1;bpy.context.view_layer.update();expected=signature(optimized)
mt.merge_static('Fixture / ', direct_min_objects=0)
actual=signature([o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Fixture /')])
assert expected==actual, 'Direct merge changed world-space faces, material, UVs, or smooth shading'
assert len([o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Fixture /')])==2
print('WORLD_MERGE_FIXTURE_PASS faces=36 materials=2 translated_rotated_scaled=true mirrored_direct=true uv=true smooth_faces=true')
