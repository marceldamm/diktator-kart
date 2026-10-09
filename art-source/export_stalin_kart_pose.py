"""Export the pose from art-source/stalin-im-kart.blend into the game (Claude, 09.10.2026).

Reads the saved .blend (never changes it), bakes the current seated pose into the rest pose like the cc0 drivers
(art-source/build_cc0_driver.py) and writes public/assets/models/stalin-driver.glb in the kart frame. Only the deform
bones are exported; the arm chain (upperarm/lowerarm/hand) stays skinned so the runtime keeps the hands on the
turning wheel. The coat stays out while it is hidden in the .blend.
Run: double-click art-source/Stalin-Pose-ins-Spiel-exportieren.cmd, or
     blender --background --factory-startup --python art-source/export_stalin_kart_pose.py
"""
import bpy, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, 'art-source', 'stalin-im-kart.blend')
OUT = os.path.join(ROOT, 'public', 'assets', 'models', 'stalin-driver.glb')


def main():
    bpy.ops.wm.open_mainfile(filepath=SOURCE)
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    rig = bpy.data.objects['Stalin Rig']
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and not o.hide_get() and not o.hide_viewport
              and any(m.type == 'ARMATURE' for m in o.modifiers)]
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and o not in meshes]:
        print('SKIPPED (hidden):', o.name)
    # The runtime looks for a "Pilot head" mesh (selection-card portrait, hiding the head in the cockpit camera) and
    # treats meshes named "...cap" as part of the head. Split the head off the body at the neck.
    body = bpy.data.objects['Stalin Koerper']
    if body in meshes:
        import bmesh
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
    cap = bpy.data.objects.get('Stalin Muetze')
    if cap in meshes: cap.name = 'Pilot cap'
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
        o.modifiers.new('Stalin Rig', 'ARMATURE').object = rig
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    for o in meshes: o.select_set(True)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_yup=True,
                              export_def_bones=True, export_animations=False, export_apply=False)
    print('STALIN_EXPORTED', OUT, os.path.getsize(OUT), [o.name for o in meshes])


if __name__ == '__main__':
    main()
