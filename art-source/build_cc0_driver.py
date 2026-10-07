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
brows = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Eyebrows')]
# Hair and brows ride on the head bone so they follow the posed head.
bpy.context.view_layer.update()
for h in hair:
    mw = h.matrix_world.copy(); h.parent = arm; h.parent_type = 'BONE'; h.parent_bone = 'Head'
    bpy.context.view_layer.update(); h.matrix_world = mw

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
    aim(f'thigh_{sd}', (0, -1, -.08)); aim(f'calf_{sd}', (0, -.3, -1)); aim(f'foot_{sd}', (0, -1, -.2))
    s = 1 if sd == 'l' else -1
    aim(f'upperarm_{sd}', (s * .18, -.75, -.6)); aim(f'lowerarm_{sd}', (s * -.12, -1, .18)); aim(f'hand_{sd}', (s * -.1, -1, .05))
aim('spine_03', (0, -.03, 1)); aim('neck_01', (0, -.02, 1)); aim('Head', (0, -.04, 1))
# The pack only ships a superhero build; slim it to an ordinary 1930s civilian. Each bone scales only its own
# weights (no scale inheritance); local Y runs along the bone, so X/Z is girth.
bpy.ops.object.mode_set(mode='EDIT')
for eb in arm.data.edit_bones: eb.inherit_scale = 'NONE'
bpy.ops.object.mode_set(mode='POSE')
girth = {'spine_03': (.8, 1, .86), 'spine_02': (.88, 1, .92), 'neck_01': (.82, 1, .82), 'clavicle_l': (.85, .82, .85),
         'clavicle_r': (.85, .82, .85), 'upperarm_l': (.74, 1, .74), 'upperarm_r': (.74, 1, .74),
         'lowerarm_l': (.84, 1, .84), 'lowerarm_r': (.84, 1, .84), 'thigh_l': (.9, 1, .9), 'thigh_r': (.9, 1, .9)}
for name, s in girth.items():
    if name in arm.pose.bones: arm.pose.bones[name].scale = s
# Grip and pedals measured in the game (kart frame, 07.10.): wheel rim at x +-0.21, 1.2 m up, 0.2 m ahead of the
# seat origin; pedals 0.75 m ahead, 0.5 m up. Converted into the unrotated, unscaled pack frame (faces -Y) below.
SEAT = (-.48, .05)   # root offset forward/up in the kart frame (Blender Y forward)
def pack_frame(x, fwd, up): return Vector((-x, -(fwd - SEAT[0]), up - SEAT[1])) / 1.12
def ik(bone, at):
    e = bpy.data.objects.new(f'ik-{bone}', None); bpy.context.collection.objects.link(e); e.location = at
    c = arm.pose.bones[bone].constraints.new('IK'); c.target = e; c.chain_count = 2; c.use_stretch = False
for sd, x in (('l', -1), ('r', 1)):
    ik(f'lowerarm_{sd}', pack_frame(x * .21, .1, 1.18))
    ik(f'calf_{sd}', pack_frame(x * .19, .72, .6))
bpy.ops.object.mode_set(mode='OBJECT')

# --- Bake pose into meshes ------------------------------------------------------------------------
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    for mod in list(o.modifiers):
        if mod.type == 'ARMATURE': bpy.ops.object.modifier_apply(modifier=mod.name)
for o in meshes:
    mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
bpy.context.view_layer.update()
neck_at = arm.matrix_world @ arm.pose.bones['neck_01'].head
chest_at = arm.matrix_world @ arm.pose.bones['spine_03'].head
bpy.data.objects.remove(arm)
for e in [o for o in bpy.data.objects if o.name.startswith('ik-')]: bpy.data.objects.remove(e)

# --- Suit shell: body copy without head/neck and hands, pushed out a little, wool material ----------------
suit_mat = bpy.data.materials.new('Pilot civilian suit'); suit_mat.use_nodes = True
bsdf = suit_mat.node_tree.nodes['Principled BSDF']; bsdf.inputs['Base Color'].default_value = (.075, .055, .04, 1); bsdf.inputs['Roughness'].default_value = .86
suit = body.copy(); suit.data = body.data.copy(); bpy.context.collection.objects.link(suit); suit.name = 'Pilot suit'
skin_groups = [g.index for g in body.vertex_groups if g.name.startswith(('Head', 'neck', 'hand', 'index', 'middle', 'pinky', 'ring', 'thumb'))]
bm = bmesh.new(); bm.from_mesh(suit.data); deform = bm.verts.layers.deform.active
drop = [v for v in bm.verts if sum(w for g, w in v[deform].items() if g in skin_groups) > .35]
bmesh.ops.delete(bm, geom=drop, context='VERTS')
# Cloth hides the superhero muscle relief: smooth the shell hard, then inflate by region (loose jacket torso,
# sleeves and trousers a little tighter).
group_name = {g.index: g.name for g in body.vertex_groups}
def region(v):
    w = {}
    for g, x in v[deform].items():
        n = group_name.get(g, '')
        k = 'torso' if n.startswith(('spine', 'pelvis', 'clavicle')) else 'arm' if 'arm' in n else 'leg'
        w[k] = w.get(k, 0) + x
    return max(w, key=w.get) if w else 'torso'
push = {'torso': .03, 'arm': .02, 'leg': .018}
offs = {v: push[region(v)] for v in bm.verts}
bm.normal_update()
orig = {v: (v.co.copy(), v.normal.copy()) for v in bm.verts}
rim = {v for v in bm.verts if v.is_boundary}
for _ in range(3): rim |= {e.other_vert(v) for v in list(rim) for e in v.link_edges}
inner = [v for v in bm.verts if v not in rim]
for v in rim: offs[v] = min(offs[v], .012)
# Cloth under tension: alternate smoothing with a "stay outside the skin" clamp. Grooves between muscles get
# bridged like fabric does, while the shell never sinks into the body (smoothing alone shrinks thin limbs).
def clamp():
    for v in bm.verts:
        o, n = orig[v]; d = (v.co - o).dot(n)
        if d < offs[v]: v.co += n * (offs[v] - d)
for _ in range(30):
    bmesh.ops.smooth_vert(bm, verts=inner, factor=.5, use_axis_x=True, use_axis_y=True, use_axis_z=True); clamp()
bm.to_mesh(suit.data); bm.free()
suit.data.materials.clear(); suit.data.materials.append(suit_mat)
# Where skin would still poke through the shell (armpits, knees), the body itself wears the suit colour.
body.data.materials.append(suit_mat); slot = len(body.data.materials) - 1
for p in body.data.polygons:
    vs = [body.data.vertices[i] for i in p.vertices]
    if all(sum(g.weight for g in v.groups if g.group in skin_groups) <= .35 for v in vs): p.material_index = slot
for p in suit.data.polygons: p.use_smooth = True

# --- Pale skin: the pack also ships a light texture for the same UV layout ---------------------------------
light = bpy.data.images.load(os.path.join(PACK, 'Base Characters', 'Textures', 'T_Superhero_Male_Ligh.png'))
for m in body.data.materials:
    if m and m.use_nodes:
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image and 'Dark' in n.image.name: n.image = light
# ...and a further quarter towards a pale Central European tone.
import numpy as np
px = np.empty(len(light.pixels), dtype=np.float32); light.pixels.foreach_get(px); px = px.reshape(-1, 4)
px[:, :3] = px[:, :3] * .75 + np.array([.86, .66, .56], dtype=np.float32) * .25
light.pixels.foreach_set(px.ravel()); light.update(); light.pack()

# --- Hair colour, moustache --------------------------------------------------------------------------
for h in hair + brows:
    h.data.materials.clear(); dark = bpy.data.materials.new('Pilot hair'); dark.use_nodes = True
    dark.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.025, .018, .013, 1); dark.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .45
    h.data.materials.append(dark)
    for m in []:
        if m and m.use_nodes and 'Principled BSDF' in m.node_tree.nodes:
            node = m.node_tree.nodes['Principled BSDF']; node.inputs['Base Color'].default_value = (.03, .022, .016, 1)
            for link in list(node.inputs['Base Color'].links): m.node_tree.links.remove(link)
tache_mat = bpy.data.materials.new('Pilot moustache'); tache_mat.use_nodes = True
tache_mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.02, .016, .012, 1)
# Find the nose tip from the eyes: the most forward (-Y) face vertex a few cm below eye height.
eyes = next(o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Eyes'))
eye_pts = [eyes.matrix_world @ v.co for v in eyes.data.vertices]; eye_z = sum(p.z for p in eye_pts) / len(eye_pts)
face = [body.matrix_world @ v.co for v in body.data.vertices]
tip = min((p for p in face if eye_z - .075 < p.z < eye_z - .015 and abs(p.x) < .02), key=lambda p: p.y)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, tip.y + .027, tip.z - .019))
tache = bpy.context.active_object; tache.name = 'Pilot moustache'; tache.scale = (.03, .016, .014)   # toothbrush: about the width of the nose
# Forelock: parted on his right, swept down across the forehead to his left temple (the pack faces -Y, his left is +X).
brow_y = min(p.y for p in face if eye_z + .04 < p.z < eye_z + .09 and abs(p.x) < .03)
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=(.018, brow_y + .003, eye_z + .056))
lock = bpy.context.active_object; lock.name = 'Pilot forelock'; lock.scale = (.058, .01, .014); lock.rotation_euler = (0, .5, 0)
bpy.ops.object.transform_apply(scale=True, rotation=True); lock.data.materials.append(hair[0].data.materials[0])
bpy.ops.object.transform_apply(scale=True); tache.data.materials.append(tache_mat)

# --- Shirt collar, tie and lapels (civilian suit of the 1930s; no insignia) ------------------------------
def solid(name, rgb, rough=.6):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    return m
shirt, tie_mat = solid('Pilot shirt', (.78, .76, .7)), solid('Pilot tie', (.05, .03, .025), .5)
bpy.ops.mesh.primitive_torus_add(major_radius=.068, minor_radius=.018, location=(neck_at.x, neck_at.y - .005, neck_at.z - .015))
collar = bpy.context.active_object; collar.name = 'Pilot shirt collar'; collar.scale = (1.08, .95, 1.4); collar.data.materials.append(shirt)
front = neck_at.y - .1
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, front + .015, (neck_at.z + chest_at.z) / 2 - .03))
tie = bpy.context.active_object; tie.name = 'Pilot tie'; tie.scale = (.045, .012, max(.12, neck_at.z - chest_at.z)); tie.data.materials.append(tie_mat)
for sd in (-1, 1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(sd * .07, front + .02, (neck_at.z + chest_at.z) / 2 - .05))
    lapel = bpy.context.active_object; lapel.name = 'Pilot lapel'; lapel.scale = (.06, .012, .2); lapel.rotation_euler[1] = sd * .35; lapel.data.materials.append(suit_mat)
for o in [o for o in bpy.data.objects if o.name.startswith(('Pilot shirt collar', 'Pilot tie', 'Pilot lapel'))]:
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.transform_apply(scale=True, rotation=True); o.select_set(False)

# --- Separate head and neck from the body: the cockpit camera sits at eye height and hides them at runtime. ---
head_groups = [g.index for g in body.vertex_groups if g.name.startswith(('Head', 'neck'))]
head = body.copy(); head.data = body.data.copy(); bpy.context.collection.objects.link(head); head.name = 'Pilot head'
def is_head(v): return sum(g.weight for g in v.groups if g.group in head_groups) > .5
for ob, keep_head in ((head, True), (body, False)):
    bm = bmesh.new(); bm.from_mesh(ob.data)
    flags = [is_head(ob.data.vertices[i]) for i in range(len(ob.data.vertices))]
    bm.faces.ensure_lookup_table()
    dead = [f for f in bm.faces if (sum(flags[v.index] for v in f.verts) * 2 > len(f.verts)) != keep_head]
    bmesh.ops.delete(bm, geom=dead, context='FACES'); bm.to_mesh(ob.data); bm.free()

# --- Into the kart frame: face +Y, pelvis over the seat cushion ----------------------------------------
root = bpy.data.objects.new('cc0-driver-hitler', None); bpy.context.collection.objects.link(root)
for o in [o for o in bpy.data.objects if o.type == 'MESH']:
    mw = o.matrix_world.copy(); o.parent = root; o.matrix_world = mw
root.rotation_euler[2] = math.pi
root.scale = (1.12, 1.12, 1.12)   # Marcel 07.10.: the pilot sat too low and looked too small
root.location = (0, SEAT[0], SEAT[1])   # side view 07.10.: floated ~7 cm over the cushion
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art-source', 'cc0-driver-hitler.blend'))
out = os.path.join(ROOT, '.tools', 'raw-models', 'cc0-driver-hitler.glb')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, export_apply=True)
import shutil; shutil.copy(out, os.path.join(ROOT, 'public', 'assets', 'models', 'cc0-driver-hitler.glb'))
print('CC0_DRIVER_DONE', tip)
