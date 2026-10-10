"""Export the poses from art-source/<id>-im-kart.blend into the game (Claude, 09.10.2026).

Reads each saved .blend (never changes it), bakes the current seated pose into the rest pose like the cc0 drivers
(art-source/build_cc0_driver.py) and writes public/assets/models/<id>-driver.glb in the kart frame. Only the deform
bones are exported; the arm chain (upperarm/lowerarm/hand) stays skinned so the runtime keeps the hands on the
turning wheel. The head is split off as "Pilot head" (selection-card portrait, hidden in the cockpit camera).
Meshes hidden in the .blend (Stalin's coat) stay out.
Run: double-click art-source/Fahrer-Posen-ins-Spiel-exportieren.cmd, or
     blender --background --factory-startup --python art-source/export_driver_kart_pose.py -- <id[,id]|all>
"""
import bpy, bmesh, os, sys, glob, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def clean_arm_weights(rig, mesh):
    """Keep coat/chest surfaces outside the sleeve envelope attached to the torso.

    Works in the saved rest frame; does not alter Marcel's IK targets or seated pose.
    Positional weights give coincident UV seam vertices the same correction.
    """
    arms = [b for b in rig.data.bones if b.name.startswith(('upperarm_', 'lowerarm_', 'hand_', 'fingers_'))]
    torso = [b for b in rig.data.bones if b.name in ('pelvis', 'spine_01', 'spine_02', 'spine_03') or b.name.startswith('thigh_')]
    groups = {g.index: g for g in mesh.vertex_groups}
    # Tripo leaves large coat panels next to the wrist. Their lower ends can be nearer to the hand than the hip.
    # Recognise these mixed-weight lower garment islands, keeping pure sleeve/hand islands articulated.
    adjacent = [set() for v in mesh.data.vertices]
    for edge in mesh.data.edges:
        a, b = edge.vertices; adjacent[a].add(b); adjacent[b].add(a)
    garment, seen = set(), set()
    wrist_z = min(rig.data.bones[f'hand_{sd}'].head_local.z for sd in ('l', 'r'))
    for vertex in mesh.data.vertices:
        if vertex.index in seen: continue
        stack, island = [vertex.index], []; seen.add(vertex.index)
        while stack:
            i = stack.pop(); island.append(i)
            for j in adjacent[i]:
                if j not in seen: seen.add(j); stack.append(j)
        if len(island) < 20: continue
        verts = [mesh.data.vertices[i] for i in island]
        arm_average = sum(sum(g.weight for g in v.groups if groups[g.group].name.startswith(('upperarm_', 'lowerarm_', 'hand_', 'fingers_'))) for v in verts) / len(verts)
        central_cloth = min(abs(v.co.x) for v in verts) < .17
        lower_cloth = min(v.co.z for v in verts) < wrist_z - .14
        if (central_cloth or lower_cloth) and .001 < arm_average < .8:
            garment.update(island)
    def distance(p, b):
        axis = b.tail_local - b.head_local
        f = max(0., min(1., (p - b.head_local).dot(axis) / max(axis.length_squared, 1e-9)))
        return (p - b.head_local - axis * f).length
    changed = 0
    for v in mesh.data.vertices:
        weights = [(groups[g.group], g.weight) for g in v.groups]
        if not any(g.name.startswith(('upperarm_', 'lowerarm_', 'hand_', 'fingers_')) for g, w in weights): continue
        dist = min(distance(v.co, b) for b in arms)
        keep = 0 if v.index in garment else max(0., min(1., (.135 - dist) / .04))
        if keep >= 1: continue
        adjusted = [(g, w * keep if g.name.startswith(('upperarm_', 'lowerarm_', 'hand_', 'fingers_')) else w) for g, w in weights]
        total = sum(w for g, w in adjusted)
        if total < 1e-5:
            b = min(torso, key=lambda b: distance(v.co, b))
            group = mesh.vertex_groups.get(b.name) or mesh.vertex_groups.new(name=b.name)
            adjusted, total = [(group, 1)], 1
        for g, w in weights: g.remove([v.index])
        for g, w in adjusted:
            if w / total > .001: g.add([v.index], w / total, 'REPLACE')
        changed += 1
    print('ARM_ENVELOPE', mesh.name, changed)
    # UV islands duplicate the same surface vertex. Rejoin their skinning numerically so corrected garment/sleeve
    # boundaries stay welded during an arm lift (without changing UVs or joining the original mesh).
    seams = {}
    for v in mesh.data.vertices:
        key = tuple(round(co, 5) for co in v.co)
        seams.setdefault(key, []).append(v)
    for copies in seams.values():
        if len(copies) < 2: continue
        average = {}
        for v in copies:
            for g in v.groups: average[g.group] = average.get(g.group, 0) + g.weight / len(copies)
        top = sorted(average.items(), key=lambda p: -p[1])[:4]
        total = sum(w for i, w in top) or 1
        for v in copies:
            for g in list(v.groups): mesh.vertex_groups[g.group].remove([v.index])
            for i, w in top: mesh.vertex_groups[i].add([v.index], w / total, 'REPLACE')


def export(source):
    id = os.path.basename(source)[:-len('-im-kart.blend')]
    out = os.path.join(ROOT, 'public', 'assets', 'models', f'{id}-driver.glb')
    export_dir = os.path.join(ROOT, '.tools', 'driver-export')
    os.makedirs(export_dir, exist_ok=True)
    pending = os.path.join(export_dir, f'{id}-driver.glb')
    bpy.ops.wm.open_mainfile(filepath=source)
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and not o.hide_get() and not o.hide_viewport
              and any(m.type == 'ARMATURE' for m in o.modifiers)]
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and o not in meshes]:
        print('SKIPPED (hidden):', o.name)
    body = next(o for o in meshes if o.name.endswith('Koerper'))
    for mesh in meshes: clean_arm_weights(rig, mesh)
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
    bpy.ops.export_scene.gltf(filepath=pending, export_format='GLB', use_selection=True, export_yup=True,
                              export_def_bones=True, export_animations=False, export_apply=False)
    # The development server may briefly read the existing model. Publish a complete file, retrying that short lock.
    for attempt in range(10):
        try:
            os.replace(pending, out)
            break
        except OSError:
            if attempt == 9: raise
            time.sleep(.2)
    print('DRIVER_EXPORTED', out, os.path.getsize(out), [o.name for o in meshes])


def main():
    arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv and len(sys.argv) > sys.argv.index('--') + 1 else 'all'
    sources = sorted(glob.glob(os.path.join(ROOT, 'art-source', '*-im-kart.blend')))
    if arg != 'all':
        sources = [s for s in sources if os.path.basename(s)[:-len('-im-kart.blend')] in arg.split(',')]
    for s in sources: export(s)


if __name__ == '__main__':
    main()
