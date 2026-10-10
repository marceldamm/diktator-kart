"""Swap the kart inside the six driver pose files for the current public/assets/models/hero-kart.glb (Claude, 10.10.2026).

Only the 'Kart <name>' collection is replaced (same import, paint, wheel shift and column scale as
build_driver_kart_pose.py); the driver, its rig and Marcel's pose edits stay untouched, and the pedals keep their
pose-file position under the feet. Used after the leg-room cockpit cut so the Blender files show the new bodies.
Run: blender --background --factory-startup --python art-source/update_kart_in_pose_blends.py -- <id[,id]|all>
"""
import bpy, os, sys, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('pose_builder', os.path.join(ROOT, 'art-source', 'build_driver_kart_pose.py'))
builder = importlib.util.module_from_spec(spec); sys.path.insert(0, os.path.join(ROOT, 'art-source')); spec.loader.exec_module(builder)


def update(driver):
    path = os.path.join(ROOT, 'art-source', f'{driver}-im-kart.blend')
    bpy.ops.wm.open_mainfile(filepath=path)
    if bpy.context.object and bpy.context.object.mode != 'OBJECT': bpy.ops.object.mode_set(mode='OBJECT')
    old = next(c for c in bpy.data.collections if c.name.startswith('Kart '))
    pedals = {n: (bpy.data.objects[n].location.copy(), bpy.data.objects[n].rotation_euler.copy()) for n in ('pedal-gas', 'pedal-brake') if n in bpy.data.objects}
    for o in list(old.all_objects): bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.collections.remove(old)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for item in list(block):
            if item.users == 0: block.remove(item)
    builder.ID = driver
    builder.build_kart()
    for n, (loc, rot) in pedals.items():
        o = bpy.data.objects[n]; o.rotation_mode = 'XYZ'; o.location = loc; o.rotation_euler = rot
    rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    for o in bpy.context.selected_objects: o.select_set(False)
    rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    bpy.ops.wm.save_as_mainfile(filepath=path, compress=True)
    print('KART_UPDATED', path)


arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv and len(sys.argv) > sys.argv.index('--') + 1 else 'all'
for d in (builder.DRIVERS if arg == 'all' else arg.split(',')): update(d)
