"""CC0 asset intake (Claude, 07.10.2026; Marcel's method switch to free packs).

Imports selected models from a CC0 pack unpacked under .tools/packs/, normalises orientation/scale, keeps one root
empty per source file (named after it) and exports one runtime GLB. Every pack used must be listed with source,
author and licence in public/assets/CREDITS.md.

Run: blender --background --python art-source/import_cc0_pack.py -- <pack-folder> <out-name> <model1.glb> [model2.glb ...]
Example (Kenney Car Kit, CC0): ... -- .tools/packs/car-kit/Models/GLB\\ format cc0-debris debris-bumper.glb debris-door.glb
Output: public/assets/models/<out-name>.glb (optimise afterwards with node art-source/optimize_assets.mjs <out-name>).
The same script imports the driver base body (Quaternius Universal Base Characters, CC0) once its zip is unpacked.
"""
import bpy, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[sys.argv.index('--') + 1:]
folder, out_name, files = args[0], args[1], args[2:]
for ob in list(bpy.data.objects): bpy.data.objects.remove(ob)
for i, name in enumerate(files):
    before = set(bpy.data.objects)
    path = os.path.join(ROOT, folder, name) if not os.path.isabs(folder) else os.path.join(folder, name)
    if name.lower().endswith('.fbx'): bpy.ops.import_scene.fbx(filepath=path)
    else: bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(os.path.splitext(name)[0], None); bpy.context.collection.objects.link(root)
    for o in new:
        if o.parent is None: o.parent = root
    root.location = (i * 3.0, 0, 0)   # spread for editing; runtime uses each root's local frame
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art-source', out_name + '.blend'))
for ob in bpy.data.objects:
    if ob.parent is None: ob.location = (0, 0, 0)
out = os.path.join(ROOT, '.tools', 'raw-models', out_name + '.glb')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True)
import shutil; shutil.copy(out, os.path.join(ROOT, 'public', 'assets', 'models', out_name + '.glb'))
print('CC0_IMPORT_DONE', out_name, len(files))
