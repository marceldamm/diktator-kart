"""Lighter runtime copy of the CC0 park tree: decimates leaves and branches of art-source/park-tree.blend.
Run: blender --background art-source/park-tree.blend --python art-source/decimate_tree.py
Writes .tools/raw-models/park-tree.glb (then: node art-source/optimize_assets.mjs park-tree). The .blend stays unchanged.
"""
import bpy, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for o in bpy.context.scene.objects:
    if o.type != 'MESH': continue
    ratio = .18 if 'leaves' in (o.active_material.name if o.active_material else '') else .35
    m = o.modifiers.new('Runtime decimate', 'DECIMATE'); m.ratio = ratio
raw = os.path.join(ROOT, '.tools', 'raw-models'); os.makedirs(raw, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=os.path.join(raw, 'park-tree.glb'), export_format='GLB', export_yup=True, export_apply=True)
print('TREE_DECIMATED')
