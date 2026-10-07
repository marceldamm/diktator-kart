"""CC0 drivers (Claude, 07.10.2026; Marcel's method switch): all six caricatures built on Quaternius "Universal
Base Characters" (Superhero_Male_FullBody + hairstyles, CC0 1.0, https://quaternius.itch.io/universal-base-characters).

Per driver: import the rigged base body and a hairstyle, adjust the build (bone girth), pose it into the kart seat
with IK (hands on the wheel rim, feet on the pedals), bake the pose, derive a cloth shell (suit, tunic or fatigues)
from the body, then add the identifying details (moustache, forelock, beard, cap, cigar, collar, buttons, tie).
Exports public/assets/models/cc0-driver-<id>.glb in the kart frame (+Y forward). Pack expected under .tools/packs/ubc/.
Run: blender --background --python art-source/build_cc0_driver.py -- <id|all>
"""
import bpy, bmesh, os, sys, math, shutil
import numpy as np
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hitler_face import refine_hitler_face

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACK = os.path.join(ROOT, '.tools', 'packs', 'ubc', 'Universal Base Characters[Standard]')
HAIR = os.path.join(PACK, 'Hairstyles', 'Origin at 0', 'glTF (Godot)')

SLIM = {'spine_03': (.8, 1, .86), 'spine_02': (.88, 1, .92), 'neck_01': (.82, 1, .82), 'clavicle_l': (.85, .82, .85),
        'clavicle_r': (.85, .82, .85), 'upperarm_l': (.74, 1, .74), 'upperarm_r': (.74, 1, .74),
        'lowerarm_l': (.84, 1, .84), 'lowerarm_r': (.84, 1, .84), 'thigh_l': (.9, 1, .9), 'thigh_r': (.9, 1, .9)}
def build(**over): return {**SLIM, **over}
STOUT = build(**{'spine_03': (.92, 1, 1.0), 'spine_02': (1.12, 1, 1.22), 'spine_01': (1.16, 1, 1.25), 'pelvis': (1.06, 1, 1.08),
                 'neck_01': (.98, 1, .98), 'upperarm_l': (.84, 1, .84), 'upperarm_r': (.84, 1, .84), 'thigh_l': (1, 1, 1), 'thigh_r': (1, 1, 1)})
# Colours are linear RGB. Cloth colours follow cast.ts (uniform), toned to real fabric.
SPECS = {
    'hitler':    dict(hair=['Hair_SimpleParted'], hair_rgb=(.025, .018, .013), cloth=(.008, .007, .007), girth=SLIM, pale=.25,
                      details=['toothbrush', 'leather-collar', 'leather-harness', 'leather-belt']),
    'stalin':    dict(hair=['Hair_SimpleParted'], hair_rgb=(.09, .085, .075), cloth=(.17, .18, .14), girth=build(**{'spine_02': (1.0, 1, 1.05)}), pale=.12,
                      details=['walrus', 'stand-collar', 'buttons']),
    'mussolini': dict(hair=[], hair_rgb=(.02, .016, .012), cloth=(.012, .012, .014), girth=build(**{'neck_01': (1.0, 1, 1.0), 'spine_03': (.92, 1, .95)}), pale=.12,
                      details=['stand-collar', 'buttons', 'sash']),
    'mao':       dict(hair=['Hair_SimpleParted'], hair_rgb=(.018, .015, .013), cloth=(.24, .25, .21), girth=build(**{'spine_02': (1.0, 1, 1.08)}), pale=.12,
                      details=['stand-collar', 'buttons', 'mole', 'swept-back']),
    'kim':       dict(hair=['Hair_Buzzed'], hair_rgb=(.012, .01, .009), cloth=(.016, .017, .02), girth=STOUT, pale=.12,
                      details=['stand-collar', 'buttons', 'top-hair']),
    'castro':    dict(hair=['Hair_SimpleParted', 'Hair_Beard'], hair_rgb=(.022, .016, .012), cloth=(.07, .085, .035), girth=build(**{'clavicle_l': (.95, .95, .95), 'clavicle_r': (.95, .95, .95)}), pale=.12,
                      details=['shirt-collar-cloth', 'pockets', 'patrol-cap', 'cigar']),
}
# Grip and pedals measured in the game (kart frame, 07.10.): wheel rim at x +-0.21, 1.18 m up, 0.1 m ahead of the
# seat origin once the runtime pulls the wheel 10 cm in; pedals 0.72 m ahead, 0.6 m up.
SEAT = (-.48, .05)   # root offset forward/up in the kart frame (Blender Y forward)
SCALE = 1.12         # Marcel 07.10.: the first pilot sat too low and looked too small

def solid(name, rgb, rough=.6, metal=0.):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    return m

def make(id):
    spec = SPECS[id]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PACK, 'Base Characters', 'Godot - UE', 'Superhero_Male_FullBody.gltf'))
    for o in list(bpy.data.objects):
        if o.name.startswith('Icokugel'): bpy.data.objects.remove(o)
    arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    body = next(o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('SuperHero'))
    before = set(bpy.data.objects)
    for h in spec['hair']: bpy.ops.import_scene.gltf(filepath=os.path.join(HAIR, f'{h}.gltf'))
    hair = [o for o in bpy.data.objects if o not in before and o.type == 'MESH']
    brows = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Eyebrows')]
    for o in [o for o in bpy.data.objects if o not in before and o.type != 'MESH']: bpy.data.objects.remove(o)
    # Hair rides on the head bone so it follows the posed head.
    bpy.context.view_layer.update()
    for h in hair:
        mw = h.matrix_world.copy(); h.parent = arm; h.parent_type = 'BONE'; h.parent_bone = 'Head'
        bpy.context.view_layer.update(); h.matrix_world = mw

    # --- Seat pose: aim bones (armature space, pack faces -Y), then IK for hands and feet ---------------
    bpy.context.view_layer.objects.active = arm; bpy.ops.object.mode_set(mode='POSE')
    def aim(name, direction):
        bpy.context.view_layer.update()
        pb = arm.pose.bones[name]
        q = (pb.tail - pb.head).normalized().rotation_difference(Vector(direction).normalized())
        m = pb.matrix.copy(); r = q.to_matrix().to_4x4() @ m.to_3x3().to_4x4(); r.translation = m.to_translation(); pb.matrix = r
    for sd in ('l', 'r'):
        aim(f'thigh_{sd}', (0, -1, -.08)); aim(f'calf_{sd}', (0, -.3, -1)); aim(f'foot_{sd}', (0, -1, -.2))
        s = 1 if sd == 'l' else -1
        aim(f'upperarm_{sd}', (s * .18, -.75, -.6)); aim(f'lowerarm_{sd}', (s * -.12, -1, .18)); aim(f'hand_{sd}', (s * -.1, -1, .05))
    aim('spine_03', (0, -.03, 1)); aim('neck_01', (0, -.02, 1)); aim('Head', (0, -.04, 1))
    # Build: each bone scales only its own weights (no inheritance); local Y runs along the bone, X/Z is girth.
    bpy.ops.object.mode_set(mode='EDIT')
    for eb in arm.data.edit_bones: eb.inherit_scale = 'NONE'
    bpy.ops.object.mode_set(mode='POSE')
    for name, s in spec['girth'].items():
        if name in arm.pose.bones: arm.pose.bones[name].scale = s
    def pack_frame(x, fwd, up): return Vector((-x, -(fwd - SEAT[0]), up - SEAT[1])) / SCALE
    def ik(bone, at):
        e = bpy.data.objects.new(f'ik-{bone}', None); bpy.context.collection.objects.link(e); e.location = at
        c = arm.pose.bones[bone].constraints.new('IK'); c.target = e; c.chain_count = 2; c.use_stretch = False
    for sd, x in (('l', -1), ('r', 1)):
        ik(f'lowerarm_{sd}', pack_frame(x * .21, .1, 1.18)); ik(f'calf_{sd}', pack_frame(x * .19, .72, .6))
    bpy.ops.object.mode_set(mode='OBJECT')

    # --- Bake the pose ---------------------------------------------------------------------------------
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

    # --- Cloth shell: body copy without head, neck and hands; fabric drapes over the muscle grooves ----------
    cloth = solid('Pilot cloth', spec['cloth'], .86)
    if id == 'hitler':
        cloth.name = 'Black leather'
        leather_shader = cloth.node_tree.nodes['Principled BSDF']
        leather_shader.inputs['Roughness'].default_value = .36
        leather_shader.inputs['Metallic'].default_value = .04
    suit = body.copy(); suit.data = body.data.copy(); bpy.context.collection.objects.link(suit); suit.name = 'Pilot suit'
    skin_groups = [g.index for g in body.vertex_groups if g.name.startswith(('Head', 'neck', 'hand', 'index', 'middle', 'pinky', 'ring', 'thumb'))]
    bm = bmesh.new(); bm.from_mesh(suit.data); deform = bm.verts.layers.deform.active
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if sum(w for g, w in v[deform].items() if g in skin_groups) > .35], context='VERTS')
    group_name = {g.index: g.name for g in body.vertex_groups}
    def region(v):
        w = {}
        for g, x in v[deform].items():
            n = group_name.get(g, ''); k = 'torso' if n.startswith(('spine', 'pelvis', 'clavicle')) else 'arm' if 'arm' in n else 'leg'
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
    # Alternate smoothing with a "stay outside the skin" clamp: grooves get bridged, thin limbs never sink in.
    def clamp():
        for v in bm.verts:
            o, n = orig[v]; d = (v.co - o).dot(n)
            if d < offs[v]: v.co += n * (offs[v] - d)
    for _ in range(30):
        bmesh.ops.smooth_vert(bm, verts=inner, factor=.5, use_axis_x=True, use_axis_y=True, use_axis_z=True); clamp()
    bm.to_mesh(suit.data); bm.free()
    suit.data.materials.clear(); suit.data.materials.append(cloth)
    for p in suit.data.polygons: p.use_smooth = True
    # Where skin would still poke through the shell (armpits, knees), the body itself wears the cloth colour.
    body.data.materials.append(cloth); slot = len(body.data.materials) - 1
    for p in body.data.polygons:
        if all(sum(g.weight for g in body.data.vertices[i].groups if g.group in skin_groups) <= .35 for i in p.vertices): p.material_index = slot

    # --- Skin: the pack's light texture, toned towards a pale European skin per driver --------------------
    light = bpy.data.images.load(os.path.join(PACK, 'Base Characters', 'Textures', 'T_Superhero_Male_Ligh.png'))
    for m in body.data.materials:
        if m and m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type == 'TEX_IMAGE' and n.image and 'Dark' in n.image.name: n.image = light
    px = np.empty(len(light.pixels), dtype=np.float32); light.pixels.foreach_get(px); px = px.reshape(-1, 4)
    px[:, :3] = px[:, :3] * (1 - spec['pale']) + np.array([.86, .66, .56], dtype=np.float32) * spec['pale']
    light.pixels.foreach_set(px.ravel()); light.update()

    hair_mat = solid('Pilot hair', spec['hair_rgb'], .58)
    if id == 'hitler':
        hair_mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .82
    brow_mat = solid('Pilot eyebrows', tuple(c * .72 for c in spec['hair_rgb']), .82)
    for h in hair: h.data.materials.clear(); h.data.materials.append(hair_mat)
    for b in brows: b.data.materials.clear(); b.data.materials.append(brow_mat)

    # --- Face landmarks ---------------------------------------------------------------------------------
    eyes = next(o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Eyes'))
    eye_pts = [eyes.matrix_world @ v.co for v in eyes.data.vertices]; eye_z = sum(p.z for p in eye_pts) / len(eye_pts)
    face = [body.matrix_world @ v.co for v in body.data.vertices]
    tip = min((p for p in face if eye_z - .075 < p.z < eye_z - .015 and abs(p.x) < .02), key=lambda p: p.y)
    brow_y = min(p.y for p in face if eye_z + .04 < p.z < eye_z + .09 and abs(p.x) < .03)
    head_groups = [g.index for g in body.vertex_groups if g.name.startswith('Head')]
    skull = [body.matrix_world @ v.co for v in body.data.vertices if sum(g.weight for g in v.groups if g.group in head_groups) > .5]
    top = max(p.z for p in skull); head_y = sum(p.y for p in skull) / len(skull)
    shell = [suit.matrix_world @ v.co for v in suit.data.vertices]
    def chest_front(z): return min((p.y for p in shell if abs(p.x) < .025 and abs(p.z - z) < .02), default=neck_at.y - .1) - .004

    def blob(name, mat, loc, scale, rot=(0, 0, 0), kind='sphere'):
        if kind == 'sphere': bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=loc)
        elif kind == 'cube': bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
        elif kind == 'torus':   # scale = (radius x, radius y, height)
            bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=.26, location=loc); scale = (scale[0], scale[1], scale[2] / .26)
        else: bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=1, depth=1, location=loc)
        o = bpy.context.active_object; o.name = name; o.scale = scale; o.rotation_euler = rot
        bpy.ops.object.transform_apply(scale=True, rotation=True); o.data.materials.append(mat)
        for p in o.data.polygons: p.use_smooth = kind != 'cube'
        return o
    whisker = solid('Pilot moustache', tuple(c * .8 for c in spec['hair_rgb']), .9)
    shirt = solid('Pilot shirt', (.015, .013, .012) if id == 'hitler' else (.78, .76, .7), .3 if id == 'hitler' else .6)
    brass = solid('Pilot hardware', (.38, .38, .36), .3, .82)
    d = set(spec['details'])
    if 'toothbrush' in d:   # narrow, flat brush band directly under the nose
        # The root is flipped 180° into the kart frame; keep the patch tucked
        # against the upper lip. A bevel keeps the silhouette crisp without a cube edge.
        moustache = blob('Pilot moustache', whisker, (0, tip.y + .022, tip.z - .019), (.013, .006, .002))
        bevel = moustache.modifiers.new('Soft moustache edge', 'BEVEL'); bevel.width = .001; bevel.segments = 3
        moustache.modifiers.new('Weighted moustache normals', 'WEIGHTED_NORMAL')
    if 'walrus' in d:       # broad, drooping at the ends
        for sd in (-1, 1): blob('Pilot moustache', whisker, (sd * .019, tip.y + .022, tip.z - .024), (.03, .016, .013), (0, sd * -.38, 0))
    if 'forelock' in d:     # parted on his right, swept down across the forehead to his left temple (his left is +X)
        blob('Pilot forelock', hair_mat, (.018, brow_y + .001, eye_z + .056), (.033, .004, .006), (0, .5, 0))
    if 'mole' in d:
        chin_y = min(p.y for p in face if tip.z - .075 < p.z < tip.z - .055 and abs(p.x) < .02)
        blob('Pilot mole', solid('Pilot mole skin', (.18, .09, .06), .7), (.012, chin_y + .002, tip.z - .065), (.0055, .0045, .0055))
    if 'swept-back' in d:   # high forehead: push the hairline back and up
        for h in hair:
            for v in h.data.vertices:
                w = h.matrix_world @ v.co
                if w.y < head_y and w.z < top: v.co = h.matrix_world.inverted() @ (w + Vector((0, .018, .012)))
    if 'top-hair' in d:     # short sides, a combed-back block on top
        blob('Pilot top hair', hair_mat, (0, head_y - .02, top - .03), (.078, .105, .04))
    if 'shirt-collar' in d:
        blob('Pilot shirt collar', shirt, (neck_at.x, neck_at.y - .005, neck_at.z - .015), (.073, .065, .025), kind='torus')
    if 'stand-collar' in d or 'shirt-collar-cloth' in d:
        blob('Pilot cloth collar', cloth, (neck_at.x, neck_at.y - .004, neck_at.z + .012), (.07, .064, .05), kind='torus')
    if 'tie' in d:
        blob('Pilot tie', solid('Pilot tie', (.05, .03, .025), .5), (0, chest_front((neck_at.z + chest_at.z) / 2) + .002, (neck_at.z + chest_at.z) / 2 - .03), (.045, .012, max(.12, neck_at.z - chest_at.z)), kind='cube')
    if 'lapels' in d:
        for sd in (-1, 1):
            z = (neck_at.z + chest_at.z) / 2 - .05
            blob('Pilot lapel', cloth, (sd * .07, chest_front(z) + .006, z), (.06, .012, .2), (0, sd * .35, 0), kind='cube')
    if 'leather-collar' in d:
        harness_mat = solid('Harness leather', (.025, .023, .021), .34, .02)
        blob('Pilot leather collar', harness_mat, (neck_at.x, neck_at.y - .005, neck_at.z - .015), (.076, .066, .027), kind='torus')
        blob('Pilot collar buckle', brass, (0, neck_at.y - .073, neck_at.z - .015), (.018, .008, .022), kind='cube')
    if 'leather-harness' in d:
        harness_mat = bpy.data.materials.get('Harness leather') or solid('Harness leather', (.025, .023, .021), .34, .02)
        mid = (neck_at.z + chest_at.z) / 2 - .025
        length = max(.20, neck_at.z - chest_at.z - .04)
        panel_center = (neck_at.z + .004 + chest_at.z - .035) / 2
        panel_height = max(.10, neck_at.z - chest_at.z - .039)
        panel = blob('Pilot leather bib', harness_mat, (0, chest_front(panel_center) + .010, panel_center), (.080, .012, panel_height / 2), kind='cube')
        panel_bevel = panel.modifiers.new('Rounded bib edge', 'BEVEL'); panel_bevel.width = .016; panel_bevel.segments = 4
        panel.modifiers.new('Bib normals', 'WEIGHTED_NORMAL')
        for sd in (-1, 1):
            strap = blob('Pilot leather harness', harness_mat, (0, chest_front(mid) + .020, mid), (.024, .014, length / 2), (0, sd * .36, 0), kind='cube')
            bevel = strap.modifiers.new('Rounded harness edge', 'BEVEL'); bevel.width = .008; bevel.segments = 3
            strap.modifiers.new('Harness normals', 'WEIGHTED_NORMAL')
        blob('Pilot harness ring', brass, (0, chest_front(mid) + .030, mid), (.023, .023, .005), kind='torus')
    if 'leather-belt' in d:
        harness_mat = bpy.data.materials.get('Harness leather') or solid('Harness leather', (.025, .023, .021), .34, .02)
        belt_z = chest_at.z - .13
        belt = blob('Pilot leather belt', harness_mat, (0, chest_front(belt_z) + .015, belt_z), (.16, .014, .022), kind='cube')
        bevel = belt.modifiers.new('Rounded belt edge', 'BEVEL'); bevel.width = .006; bevel.segments = 3
        belt.modifiers.new('Belt normals', 'WEIGHTED_NORMAL')
        blob('Pilot belt buckle', brass, (0, chest_front(belt_z) + .026, belt_z), (.025, .008, .028), kind='cube')
    if 'buttons' in d:
        for i in range(5):
            z = neck_at.z - .07 - i * .085
            blob('Pilot button', brass, (0, chest_front(z), z), (.009, .005, .009))
    if 'sash' in d:         # diagonal belt strap over the black shirt
        z = chest_at.z - .05
        blob('Pilot sash', solid('Pilot leather', (.05, .03, .018), .45), (0, chest_front(z) + .004, z), (.035, .01, .34), (0, .62, 0), kind='cube')
    if 'pockets' in d:
        for sd in (-1, 1):
            z = chest_at.z + .02
            blob('Pilot pocket', cloth, (sd * .075, chest_front(z) + .002, z), (.06, .01, .065), kind='cube')
    if 'patrol-cap' in d:   # flat-topped patrol cap with a short visor
        cap = solid('Pilot cap', tuple(c * .85 for c in spec['cloth']), .8)
        blob('Pilot cap', cap, (0, head_y + .005, top - .015), (.105, .112, .055), kind='cylinder')
        blob('Pilot cap visor', cap, (0, head_y - .1, top - .055), (.08, .05, .006), (-.25, 0, 0), kind='cylinder')
    if 'cigar' in d:
        blob('Pilot cigar', solid('Pilot cigar leaf', (.16, .08, .035), .8), (-.03, tip.y - .03, tip.z - .045), (.007, .007, .07), (1.35, 0, .5), kind='cylinder')

    # --- Head and neck as their own mesh: the cockpit camera hides them at runtime ------------------------
    head_neck = [g.index for g in body.vertex_groups if g.name.startswith(('Head', 'neck'))]
    head = body.copy(); head.data = body.data.copy(); bpy.context.collection.objects.link(head); head.name = 'Pilot head'
    for ob, keep_head in ((head, True), (body, False)):
        flags = [sum(g.weight for g in v.groups if g.group in head_neck) > .5 for v in ob.data.vertices]
        bm = bmesh.new(); bm.from_mesh(ob.data)
        dead = [f for f in bm.faces if (sum(flags[v.index] for v in f.verts) * 2 > len(f.verts)) != keep_head]
        bmesh.ops.delete(bm, geom=dead, context='FACES'); bm.to_mesh(ob.data); bm.free()

    # Textures at 1024 px: six drivers share the screen, the pack ships 2-4k maps.
    for img in bpy.data.images:
        if img.size[0] > 1024: img.scale(1024, 1024)
        if img.size[0]: img.pack()

    # --- Into the kart frame: face +Y, pelvis over the seat cushion ----------------------------------------
    root = bpy.data.objects.new(f'cc0-driver-{id}', None); bpy.context.collection.objects.link(root)
    for o in [o for o in bpy.data.objects if o.type == 'MESH']:
        mw = o.matrix_world.copy(); o.parent = root; o.matrix_world = mw
    root.rotation_euler[2] = math.pi; root.scale = (SCALE,) * 3; root.location = (0, SEAT[0], SEAT[1])
    if id == 'hitler': refine_hitler_face(root)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, '.tools', 'raw-models', f'cc0-driver-{id}.blend'))
    out = os.path.join(ROOT, '.tools', 'raw-models', f'cc0-driver-{id}.glb')
    face_export = dict(export_vertex_color='NAME', export_vertex_color_name='Face age tint', export_all_vertex_colors=False) if id == 'hitler' else {}
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, export_apply=True, **face_export)
    shutil.copy(out, os.path.join(ROOT, 'public', 'assets', 'models', f'cc0-driver-{id}.glb'))
    print('CC0_DRIVER_DONE', id)

arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'all'
for id in (SPECS if arg == 'all' else arg.split(',')): make(id)
