"""CC0 driver pilot (Claude, 07.10.2026; Marcel's method switch): Hitler built on Quaternius "Universal Base
Characters" (Superhero_Male_FullBody, CC0 1.0, https://quaternius.itch.io/universal-base-characters).

Steps: import the rigged base body and the side-parted hairstyle, pose it into the kart seat (thighs forward,
calves down, hands on the wheel), bake the pose, derive a civilian suit shell from the body (head and hands stay
skin), add the toothbrush moustache, place it in the kart frame (+Y forward, seat at y -0.55) and export
public/assets/models/cc0-driver-hitler.glb. Unpacked pack expected under .tools/packs/ubc/.
Run: blender --background --python art-source/build_cc0_driver.py
"""
import bpy, bmesh, os, math
from mathutils import Vector, Matrix

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, '.tools', 'packs', 'ubc', 'Universal Base Characters[Standard]')
for ob in list(bpy.data.objects): bpy.data.objects.remove(ob)
bpy.ops.import_scene.gltf(filepath=os.path.join(PACK, 'Base Characters', 'Godot - UE', 'Superhero_Male_FullBody.gltf'))
for o in list(bpy.data.objects):
    if o.name.startswith('Icokugel'): bpy.data.objects.remove(o)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
body = next(o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('SuperHero'))
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=os.path.join(PACK, 'Hairstyles', 'Origin at 0', 'glTF (Godot)', 'Hair_SimpleParted.gltf'))
hair = [o for o in bpy.data.objects if o not in before and o.type == 'MESH']

# --- Seat pose: aim each bone (armature space) at a target direction, parents first. ---------------
bpy.context.view_layer.objects.active = arm; bpy.ops.object.mode_set(mode='POSE')
def aim(name, direction):
    bpy.context.view_layer.update()
    pb = arm.pose.bones[name]
    cur = (pb.tail - pb.head).normalized()
    q = cur.rotation_difference(Vector(direction).normalized())
    m = pb.matrix.copy(); loc = m.to_translation()
    r = q.to_matrix().to_4x4() @ m.to_3x3().to_4x4(); r.translation = loc
    pb.matrix = r
# Character faces -Y in the pack. Thighs forward and a little up, calves down to the pedals, feet flat.
for sd in ('l', 'r'):
    aim(f'thigh_{sd}', (0, -1, .12)); aim(f'calf_{sd}', (0, -.45, -1)); aim(f'foot_{sd}', (0, -1, -.2))
    s = 1 if sd == 'l' else -1
    aim(f'upperarm_{sd}', (s * .18, -.75, -.6)); aim(f'lowerarm_{sd}', (s * -.12, -1, .18)); aim(f'hand_{sd}', (s * -.1, -1, .05))
aim('spine_03', (0, -.12, 1)); aim('Head', (0, .02, 1))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Bake pose into meshes ------------------------------------------------------------------------
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    for mod in list(o.modifiers):
        if mod.type == 'ARMATURE': bpy.ops.object.modifier_apply(modifier=mod.name)
for o in meshes:
    mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
bpy.data.objects.remove(arm)

# --- Suit shell: body copy without head/neck and hands, pushed out a little, wool material ----------------
suit_mat = bpy.data.materials.new('Pilot civilian suit'); suit_mat.use_nodes = True
bsdf = suit_mat.node_tree.nodes['Principled BSDF']; bsdf.inputs['Base Color'].default_value = (.075, .055, .04, 1); bsdf.inputs['Roughness'].default_value = .86
suit = body.copy(); suit.data = body.data.copy(); bpy.context.collection.objects.link(suit); suit.name = 'Pilot suit'
skin_groups = [g.index for g in body.vertex_groups if g.name.startswith(('Head', 'neck', 'hand', 'index', 'middle', 'pinky', 'ring', 'thumb'))]
bm = bmesh.new(); bm.from_mesh(suit.data); deform = bm.verts.layers.deform.active
drop = [v for v in bm.verts if sum(w for g, w in v[deform].items() if g in skin_groups) > .35]
bmesh.ops.delete(bm, geom=drop, context='VERTS')
for v in bm.verts: v.co += v.normal * .014
bm.to_mesh(suit.data); bm.free()
suit.data.materials.clear(); suit.data.materials.append(suit_mat)
for p in suit.data.polygons: p.use_smooth = True

# --- Hair colour, moustache --------------------------------------------------------------------------
for h in hair:
    for m in h.data.materials:
        if m and m.use_nodes and 'Principled BSDF' in m.node_tree.nodes:
            node = m.node_tree.nodes['Principled BSDF']; node.inputs['Base Color'].default_value = (.03, .022, .016, 1)
            for link in list(node.inputs['Base Color'].links): m.node_tree.links.remove(link)
tache_mat = bpy.data.materials.new('Pilot moustache'); tache_mat.use_nodes = True
tache_mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.02, .016, .012, 1)
# Find the nose tip: the most forward (-Y) body vertex in the face band.
face = [body.matrix_world @ v.co for v in body.data.vertices]
tip = min((p for p in face if 1.6 < p.z < 1.72 and abs(p.x) < .03), key=lambda p: p.y)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, tip.y + .012, tip.z - .038))
tache = bpy.context.active_object; tache.name = 'Pilot moustache'; tache.scale = (.042, .012, .016)
bpy.ops.object.transform_apply(scale=True); tache.data.materials.append(tache_mat)

# --- Into the kart frame: face +Y, pelvis over the seat cushion ----------------------------------------
root = bpy.data.objects.new('cc0-driver-hitler', None); bpy.context.collection.objects.link(root)
for o in [o for o in bpy.data.objects if o.type == 'MESH']:
    mw = o.matrix_world.copy(); o.parent = root; o.matrix_world = mw
root.rotation_euler[2] = math.pi
root.location = (0, -.5, -.08)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art-source', 'cc0-driver-hitler.blend'))
out = os.path.join(ROOT, '.tools', 'raw-models', 'cc0-driver-hitler.glb')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, export_apply=True)
import shutil; shutil.copy(out, os.path.join(ROOT, 'public', 'assets', 'models', 'cc0-driver-hitler.glb'))
print('CC0_DRIVER_DONE', tip)
