"""Export the poses from art-source/<id>-im-kart.blend into the game (Claude, 09.10.2026).

Reads each saved .blend (never changes it), bakes the current seated pose into the rest pose like the cc0 drivers
(art-source/build_cc0_driver.py) and writes public/assets/models/<id>-driver.glb in the kart frame. Only the deform
bones are exported; the arm chain (upperarm/lowerarm/hand) stays skinned so the runtime keeps the hands on the
turning wheel. The head is split off as "Pilot head" (selection-card portrait, hidden in the cockpit camera).
Meshes hidden in the .blend (Stalin's coat) stay out.
Run: double-click art-source/Fahrer-Posen-ins-Spiel-exportieren.cmd, or
     blender --background --factory-startup --python art-source/export_driver_kart_pose.py -- <id[,id]|all>
"""
import bpy, bmesh, os, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def export(source):
    id = os.path.basename(source)[:-len('-im-kart.blend')]
    out = os.path.join(ROOT, 'public', 'assets', 'models', f'{id}-driver.glb')
    bpy.ops.wm.open_mainfile(filepath=source)
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and not o.hide_get() and not o.hide_viewport
              and any(m.type == 'ARMATURE' for m in o.modifiers)]
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and o not in meshes]:
        print('SKIPPED (hidden):', o.name)
    body = next(o for o in meshes if o.name.endswith('Koerper'))
    # Split the head off the body at the neck.
    head_group = body.vertex_groups['Head'].index
    bpy.ops.object.select_all(action='DESELECT'); body.select_set(True); bpy.context.view_layer.objects.active = body
    bpy.ops.object.mode_set(mode='EDIT')
    bm = bmesh.from_edit_mesh(body.data); deform = bm.verts.layers.deform.verify()
    for v in bm.verts: v.select_set(v[deform].get(head_group, 0) > .5)
    bm.select_flush_mode(); bmesh.update_edit_mesh(body.data)
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    head = next(o for o in bpy.context.selected_objects if o != body)
    head.name = 'Pilot head'; meshes.append(head)
    # Bake: the posed mesh becomes the mesh, the pose becomes the rest pose.
    for o in meshes:
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
        for mod in [m for m in o.modifiers if m.type == 'ARMATURE']:
            bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.select_all(action='DESELECT'); rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.visual_transform_apply()
    for pb in rig.pose.bones:
        for c in list(pb.constraints): pb.constraints.remove(c)
    bpy.ops.pose.armature_apply(selected=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    for o in meshes:
        o.modifiers.new(rig.name, 'ARMATURE').object = rig
    # Textures at 1024 px like the cc0 drivers: six drivers share the screen, Tripo ships 2k maps.
    for img in bpy.data.images:
        if img.size[0] > 1024: img.scale(1024, 1024)
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    for o in meshes: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_yup=True,
                              export_def_bones=True, export_animations=False, export_apply=False)
    print('DRIVER_EXPORTED', out, os.path.getsize(out), [o.name for o in meshes])


def main():
    arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv and len(sys.argv) > sys.argv.index('--') + 1 else 'all'
    sources = sorted(glob.glob(os.path.join(ROOT, 'art-source', '*-im-kart.blend')))
    if arg != 'all':
        sources = [s for s in sources if os.path.basename(s)[:-len('-im-kart.blend')] in arg.split(',')]
    for s in sources: export(s)


if __name__ == '__main__':
    main()
