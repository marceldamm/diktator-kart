"""Stalin (Tripo military officer) seated in his limousine kart, as an editable Blender file (Claude, 09.10.2026).

Builds art-source/stalin-im-kart.blend from
  .tools/raw-models/military-officer-3d-model/soviet-officer-parts-separated.glb  (Body, Cap, Cape; Marcel's paid Tripo model)
  public/assets/models/hero-kart.glb                                            (runtime kart, limousine body = Stalin)

The officer gets a humanoid rig whose deform bones use the runtime names (upperarm_l, lowerarm_l, hand_l ...), so the
game's steering-wheel arm IK in src/slice-scene.ts keeps working. Hands and feet are driven by IK control bones
(Hand-Ziel, Fuss-Ziel) that Marcel can move in Pose Mode; the rest pose stays the standing model.
Kart frame: Blender +Y forward, +Z up, kart origin on the ground (same frame as the cc0 drivers).
Run: blender --background --factory-startup --python art-source/build_stalin_kart_pose.py
"""
import bpy, bmesh, os, math
from mathutils import Vector, Matrix

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OFFICER = os.path.join(ROOT, '.tools', 'raw-models', 'military-officer-3d-model', 'soviet-officer-parts-separated.glb')
KART = os.path.join(ROOT, 'public', 'assets', 'models', 'hero-kart.glb')
OUT = os.path.join(ROOT, 'art-source', 'stalin-im-kart.blend')

CAP_Z = .925       # lowest cap point (visor tip), source units
S = 2.04            # source model is 0.98 m tall; 2.0 m matches the cc0 drivers' size in the kart
CX = -0.198         # source body centre line (x)
# Runtime wheel: slice-scene.ts pulls the wheel 0.22 m towards the chest and 0.03 m up, the column grows by 1.41.
WHEEL_SHIFT = Vector((0, -.22, .03))
SEAT_HIP_Z = .935   # buttocks on the cushion
HIP_Y = -.50        # hip joints over the seat cushion (seat top z 0.85, backrest front y -0.81)

# Joints of the standing source model, measured from mesh cross-sections (source units, x relative to CX, faces -Y).
J = {
    'root': (0, .01, 0), 'pelvis': (0, .01, .47), 'spine_01': (0, .01, .53), 'spine_02': (0, .005, .61),
    'spine_03': (0, .008, .70), 'neck_01': (0, .02, .83), 'Head': (0, .0, .872), 'head_top': (0, -.005, .985),
    'clavicle': (.022, .022, .81), 'shoulder': (.118, .03, .795), 'elbow': (.145, .046, .64), 'wrist': (.15, .015, .515),
    'knuckle': (.143, .006, .466), 'fingertip': (.136, .004, .424),
    'hip': (.06, .01, .475), 'knee': (.094, .035, .275), 'ankle': (.11, .05, .085), 'ball': (.113, -.035, .02), 'toe': (.113, -.088, .02),
}
def P(name, side=1):
    x, y, z = J[name]
    return Vector((x * side, y, z)) * S


def clean():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def collection(name, parent=None):
    c = bpy.data.collections.new(name)
    (parent or bpy.context.scene.collection).children.link(c)
    return c


def move_to(ob, col):
    for c in list(ob.users_collection): c.objects.unlink(ob)
    col.objects.link(ob)


# --- Kart --------------------------------------------------------------------------------------------------------
def build_kart():
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=KART)
    names = {o.name for o in bpy.data.objects if o not in before}
    drop = ('cast-', 'armPose', 'driverPose', 'headPose', 'scarfFlap', 'variant-', 'wheelStyle', 'roadster-front')
    for n in sorted(names):
        o = bpy.data.objects.get(n)
        if o and (n.startswith(drop) or (n.startswith('body-') and not n.startswith('body-limousine'))):
            for c in o.children_recursive: bpy.data.objects.remove(c)
            bpy.data.objects.remove(o)
    kart_col = collection('Kart Fuenfjahresplan 3000')
    for n in names:
        o = bpy.data.objects.get(n)
        if o: move_to(o, kart_col)
    # Stalin's paint (cast.ts '#6f2424'); the runtime recolours the shared enamel the same way.
    for m in bpy.data.materials:
        if m.name.startswith('Petrol enamel') and m.node_tree:
            bsdf = m.node_tree.nodes.get('Principled BSDF')
            if bsdf: bsdf.inputs['Base Color'].default_value = (.158, .018, .018, 1)
    wheel = bpy.data.objects['steeringWheel']
    wheel.location += WHEEL_SHIFT
    column = bpy.data.objects['steeringWheel / Polished steel']
    column.scale.z *= 1.41    # the column's long axis (local Z) grows about its centre, as in the runtime
    bpy.context.view_layer.update()
    for o in kart_col.all_objects:
        o.hide_select = True   # beginners click the driver, not the bodywork
    return kart_col


# --- Officer meshes ----------------------------------------------------------------------------------------------
def import_officer():
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=OFFICER)
    parts = {o.name: o for o in bpy.data.objects if o not in before and o.type == 'MESH'}
    for o in [o for o in bpy.data.objects if o not in before and o.type != 'MESH']: bpy.data.objects.remove(o)
    for o in parts.values():
        o.data.transform(o.matrix_world); o.parent = None; o.matrix_world = Matrix.Identity(4)
    body, cap, coat = parts['Body'], parts['Cap'], parts['Cape']
    # Tripo's part split left a few coat islands in Body (sleeve, skirt) and the coat collar in Cap.
    def move_islands(src, dst, test):
        bm = bmesh.new(); bm.from_mesh(src.data)
        seen, moving = set(), []
        for v in bm.verts:
            if v in seen: continue
            stack, island = [v], []
            seen.add(v)
            while stack:
                a = stack.pop(); island.append(a)
                for e in a.link_edges:
                    b = e.other_vert(a)
                    if b not in seen: seen.add(b); stack.append(b)
            if test(island): moving.extend(island)
        if not moving: bm.free(); return
        dup = bmesh.new(); dup.from_mesh(src.data)
        keep_idx = {v.index for v in moving}
        bmesh.ops.delete(dup, geom=[v for v in dup.verts if v.index not in keep_idx], context='VERTS')
        piece = bpy.data.meshes.new('piece'); dup.to_mesh(piece); dup.free()
        bmesh.ops.delete(bm, geom=moving, context='VERTS'); bm.to_mesh(src.data); bm.free()
        tmp = bpy.data.objects.new('piece', piece); bpy.context.scene.collection.objects.link(tmp)
        bpy.ops.object.select_all(action='DESELECT'); tmp.select_set(True); dst.select_set(True)
        bpy.context.view_layer.objects.active = dst; bpy.ops.object.join()
    move_islands(body, coat, lambda isl: min(v.co.x for v in isl) > -.02)
    move_islands(cap, coat, lambda isl: max(v.co.z for v in isl) < .84)
    # Centre the body on x = 0 (feet stay on z = 0), then scale to 2 m.
    for o in (body, coat):
        o.data.transform(Matrix.Translation((-CX, 0, 0)))
    # Cap: the source cap is 1.6x the head width. Fit it over the crown, band just above the brows.
    cv = [v.co for v in cap.data.vertices]
    c_min, c_max = Vector([min(v[i] for v in cv) for i in range(3)]), Vector([max(v[i] for v in cv) for i in range(3)])
    c_mid = (c_min + c_max) / 2
    k = .80
    cap.data.transform(Matrix.Translation((0, -.012, CAP_Z)) @ Matrix.Scale(k, 4) @ Matrix.Translation((-c_mid.x, -c_mid.y, -c_min.z)))
    for o in (body, cap, coat):
        o.data.transform(Matrix.Scale(S, 4))
        for p in o.data.polygons: p.use_smooth = True
    body.name, cap.name, coat.name = 'Stalin Koerper', 'Stalin Muetze', 'Stalin Mantel'
    return body, cap, coat


# --- Rig -----------------------------------------------------------------------------------------------------------
def build_rig():
    data = bpy.data.armatures.new('Stalin Skelett')
    rig = bpy.data.objects.new('Stalin Rig', data)
    bpy.context.scene.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='EDIT')
    eb = data.edit_bones
    def bone(name, head, tail, parent=None, deform=True, connect=False, roll=0.0):
        b = eb.new(name); b.head = head; b.tail = tail; b.roll = roll
        if parent: b.parent = eb[parent]; b.use_connect = connect
        b.use_deform = deform
        return b
    bone('root', P('root'), P('root') + Vector((0, .3, 0)))
    bone('pelvis', P('pelvis'), P('spine_01'), 'root')
    bone('spine_01', P('spine_01'), P('spine_02'), 'pelvis', connect=True)
    bone('spine_02', P('spine_02'), P('spine_03'), 'spine_01', connect=True)
    bone('spine_03', P('spine_03'), P('neck_01'), 'spine_02', connect=True)
    bone('neck_01', P('neck_01'), P('Head'), 'spine_03', connect=True)
    bone('Head', P('Head'), P('head_top'), 'neck_01', connect=True)
    for sd, s in (('l', 1), ('r', -1)):
        bone(f'clavicle_{sd}', P('clavicle', s), P('shoulder', s), 'spine_03')
        bone(f'upperarm_{sd}', P('shoulder', s), P('elbow', s), f'clavicle_{sd}', connect=True)
        bone(f'lowerarm_{sd}', P('elbow', s), P('wrist', s), f'upperarm_{sd}', connect=True)
        bone(f'hand_{sd}', P('wrist', s), P('knuckle', s), f'lowerarm_{sd}', connect=True)
        bone(f'fingers_{sd}', P('knuckle', s), P('fingertip', s), f'hand_{sd}', connect=True)
        bone(f'thigh_{sd}', P('hip', s), P('knee', s), 'pelvis')
        bone(f'calf_{sd}', P('knee', s), P('ankle', s), f'thigh_{sd}', connect=True)
        bone(f'foot_{sd}', P('ankle', s), P('ball', s), f'calf_{sd}', connect=True)
        bone(f'ball_{sd}', P('ball', s), P('toe', s), f'foot_{sd}', connect=True)
        # Controls (no deform): where hand and foot should be, and which way elbow and knee point.
        w, a = P('wrist', s), P('ankle', s)
        bone(f'Hand-Ziel_{sd}', w, w + (P('knuckle', s) - w).normalized() * .16, 'root', deform=False)
        bone(f'Fuss-Ziel_{sd}', a, a + (P('ball', s) - a).normalized() * .2, 'root', deform=False)
        e, k = P('elbow', s), P('knee', s)
        bone(f'Ellbogen-Richtung_{sd}', e + Vector((s * .25, .45, 0)), e + Vector((s * .25, .45, .08)), 'root', deform=False)
        bone(f'Knie-Richtung_{sd}', k + Vector((s * .05, -.6, 0)), k + Vector((s * .05, -.6, .08)), 'root', deform=False)
    # Consistent bone rolls (Z axis towards the back of the character) for predictable rotations.
    bpy.ops.armature.select_all(action='SELECT')
    bpy.ops.armature.calculate_roll(type='GLOBAL_POS_Y')
    bpy.ops.object.mode_set(mode='OBJECT')
    return rig


# Mannequin radii (m) per deform bone: a watertight stand-in for bone-heat weights.
RADIUS = {'root': 0, 'pelvis': .15, 'spine_01': .15, 'spine_02': .15, 'spine_03': .14, 'neck_01': .065, 'Head': .1,
          'clavicle': .055, 'upperarm': .058, 'lowerarm': .05, 'hand': .042, 'fingers': .032,
          'thigh': .085, 'calf': .065, 'foot': .055, 'ball': .045}


def weight(rig, body, cap, coat):
    """Tripo's surfaces are hundreds of open islands, so bone heat fails on them (and on a voxel remesh). Bone heat
    runs on a watertight metaball mannequin built around the bones; its weights transfer to the nearest surface."""
    mb = bpy.data.metaballs.new('mannequin'); mb.resolution = .012; mb.threshold = .6
    for bone in rig.data.bones:
        if not bone.use_deform: continue
        r = RADIUS[bone.name.rsplit('_', 1)[0] if bone.name.endswith(('_l', '_r')) else bone.name]
        if not r: continue
        h, t = bone.head_local, bone.tail_local
        el = mb.elements.new(); el.type = 'CAPSULE'; el.radius = r * 1.25
        el.size_x = max((t - h).length / 2, .001); el.co = (h + t) / 2
        el.rotation = Vector((1, 0, 0)).rotation_difference((t - h).normalized())
    mball = bpy.data.objects.new('mannequin', mb); bpy.context.scene.collection.objects.link(mball)
    bpy.context.view_layer.update()
    deps = bpy.context.evaluated_depsgraph_get()
    proxy = bpy.data.objects.new('weight proxy', bpy.data.meshes.new_from_object(mball.evaluated_get(deps)))
    bpy.context.scene.collection.objects.link(proxy)
    bpy.data.objects.remove(mball)
    print('PROXY_VERTS', len(proxy.data.vertices))
    bpy.ops.object.select_all(action='DESELECT'); proxy.select_set(True); rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    print('PROXY_WEIGHTED', sum(1 for v in proxy.data.vertices if v.groups))
    # Purely positional sampling: coincident seam vertices of neighbouring UV islands get identical weights, so the
    # surface never opens up. Gaussian over the nearest mannequin points, measured from the closest one.
    from mathutils.kdtree import KDTree
    pv = proxy.data.vertices
    tree = KDTree(len(pv))
    for v in pv: tree.insert(v.co, v.index)
    tree.balance()
    names = [g.name for g in proxy.vertex_groups]
    pw = [{names[g.group]: g.weight for g in v.groups} for v in pv]
    for target in (body, coat):
        for g in list(target.vertex_groups): target.vertex_groups.remove(g)
        groups = {n: target.vertex_groups.new(name=n) for n in names}
        for v in target.data.vertices:
            near = tree.find_n(v.co, 24)
            d0 = near[0][2]
            acc = {}
            for co, i, d in near:
                k = math.exp(-((d - d0) / .02) ** 2)
                for n, w in pw[i].items(): acc[n] = acc.get(n, 0) + w * k
            top = sorted(acc.items(), key=lambda kv: -kv[1])[:4]
            total = sum(w for _, w in top) or 1
            for n, w in top:
                if w / total > .01: groups[n].add([v.index], w / total, 'REPLACE')
    bpy.data.objects.remove(proxy)
    for g in list(cap.vertex_groups): cap.vertex_groups.remove(g)
    cap.vertex_groups.new(name='Head').add(range(len(cap.data.vertices)), 1.0, 'REPLACE')
    for o in (body, cap, coat):
        o.parent = rig
        o.matrix_parent_inverse = Matrix.Identity(4)
        mod = o.modifiers.new('Stalin Rig', 'ARMATURE'); mod.object = rig


def setup_controls(rig):
    data = rig.data
    body_c = data.collections.new('Koerper-Knochen')
    ctrl_c = data.collections.new('Steuerung Haende und Fuesse')
    for b in data.bones:
        (ctrl_c if not b.use_deform else body_c).assign(b)
        if not b.use_deform:
            b.color.palette = 'THEME01' if 'Ziel' in b.name else 'THEME04'
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    pb = rig.pose.bones
    for sd in ('l', 'r'):
        for chain, tgt, pole in ((f'lowerarm_{sd}', f'Hand-Ziel_{sd}', f'Ellbogen-Richtung_{sd}'),
                                 (f'calf_{sd}', f'Fuss-Ziel_{sd}', f'Knie-Richtung_{sd}')):
            c = pb[chain].constraints.new('IK'); c.name = 'IK'
            c.target = rig; c.subtarget = tgt; c.pole_target = rig; c.pole_subtarget = pole
            c.chain_count = 2; c.use_stretch = False
        for bn, tgt in ((f'hand_{sd}', f'Hand-Ziel_{sd}'), (f'foot_{sd}', f'Fuss-Ziel_{sd}')):
            c = pb[bn].constraints.new('COPY_ROTATION'); c.name = 'Ausrichtung'
            c.target = rig; c.subtarget = tgt
    for p in pb: p.rotation_mode = 'XYZ'
    bpy.ops.object.mode_set(mode='OBJECT')
    data.display_type = 'OCTAHEDRAL'
    rig.show_in_front = True


def pick_pole_angles(rig):
    """IK pole angle that makes each elbow/knee actually point at its direction bone."""
    pb = rig.pose.bones
    for sd in ('l', 'r'):
        for chain, mid, pole in ((f'lowerarm_{sd}', f'lowerarm_{sd}', f'Ellbogen-Richtung_{sd}'),
                                 (f'calf_{sd}', f'calf_{sd}', f'Knie-Richtung_{sd}')):
            c = pb[chain].constraints['IK']
            best = None
            for deg in range(-180, 180, 5):
                c.pole_angle = math.radians(deg); bpy.context.view_layer.update()
                joint = pb[mid].head; root = pb[chain].parent.head; end = pb[chain].tail
                axis = (end - root).normalized()
                def off(p): v = p - root; return (v - axis * v.dot(axis)).normalized()
                score = off(joint).dot(off(pb[pole].head))
                if best is None or score > best[0]: best = (score, deg)
            c.pole_angle = math.radians(best[1])
            print('POLE', chain, best)


# --- Seated pose ---------------------------------------------------------------------------------------------------
def to_rig(rig, world):
    return rig.matrix_world.inverted() @ Vector(world)


def place_bone(rig, name, head_world, dir_world=None, up_world=None):
    """Move a control bone (root-parented, root at rest) so its head is at head_world, pointing along dir_world."""
    pb = rig.pose.bones[name]
    m = pb.matrix.copy()
    h = to_rig(rig, head_world)
    if dir_world is not None:
        d = (rig.matrix_world.inverted().to_3x3() @ Vector(dir_world)).normalized()
        y_now = m.to_3x3().col[1].normalized()
        q = y_now.rotation_difference(d)
        r = q.to_matrix() @ m.to_3x3()
        if up_world is not None:   # spin about the bone so its Z axis follows up_world
            u = (rig.matrix_world.inverted().to_3x3() @ Vector(up_world))
            u = (u - d * u.dot(d)).normalized(); z = r.col[2].normalized()
            ang = z.angle(u); sgn = 1 if z.cross(u).dot(d) > 0 else -1
            from mathutils import Quaternion
            r = Quaternion(d, sgn * ang).to_matrix() @ r
        m = r.to_4x4()
    m.translation = h
    pb.matrix = m
    bpy.context.view_layer.update()


def rotate_local(rig, name, axis, deg):
    pb = rig.pose.bones[name]
    i = 'XYZ'.index(axis)
    e = list(pb.rotation_euler); e[i] += math.radians(deg); pb.rotation_euler = e
    bpy.context.view_layer.update()


def seat_pose(rig):
    # Face +Y; hips over the cushion. Standing hip height (0.97 m) already matches the seat (0.85 m + 0.11 m).
    rig.rotation_euler = (0, 0, math.pi)
    hip_rest = P('hip')
    rig.location = (0, HIP_Y + hip_rest.y, SEAT_HIP_Z - hip_rest.z)
    bpy.context.view_layer.update()
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    for p in rig.pose.bones: p.rotation_euler = (0, 0, 0); p.location = (0, 0, 0)
    bpy.context.view_layer.update()
    POSE = {   # degrees about each bone's local X (negative = lean forward, towards the wheel)
        'spine_01': -6, 'spine_02': -7, 'spine_03': -4, 'neck_01': 8, 'Head': 6,
    }
    for name, deg in POSE.items(): rotate_local(rig, name, 'X', deg)
    for sd, sg in (('l', 1), ('r', -1)): rotate_local(rig, f'fingers_{sd}', 'Z', sg * FINGER_CURL)   # curl towards the palm
    wheel = bpy.data.objects['steeringWheel']
    wm = wheel.matrix_world
    spin = (wm.to_3x3() @ Vector((0, 1, 0))).normalized()    # rim plane = wheel local X/Z, axis = local Y
    up = (wm.to_3x3() @ Vector((0, 0, 1))).normalized()
    centre = wm.translation
    r = .212
    for sd, s in (('l', -1), ('r', 1)):          # character left = world -X after the 180 deg turn
        ang = math.radians(GRIP_DEG)
        grip = centre + Vector((s * r * math.sin(ang), 0, 0)) + up * (r * math.cos(ang))
        out = Vector((s, 0, 0))
        wrist = grip - spin * HAND_BACK + out * HAND_OUT - up * HAND_DOWN
        place_bone(rig, f'Hand-Ziel_{sd}', wrist, dir_world=(grip + spin * .02 - wrist), up_world=-up)
        place_bone(rig, f'Ellbogen-Richtung_{sd}', Vector((s * .55, -.55, 1.15)))
        # Feet: ball of the foot on the (moved) pedal pad, heel low.
        ankle = Vector((s * FOOT_X, FOOT_Y, FOOT_Z))
        # The foot bone runs ankle -> ball, 37 deg below a flat sole; tilt the sole by FOOT_PITCH (toes up).
        rest = P('ball') - P('ankle')
        q = math.radians(FOOT_PITCH) - math.atan2(-rest.z, abs(rest.y))
        place_bone(rig, f'Fuss-Ziel_{sd}', ankle, dir_world=Vector((0, math.cos(q), math.sin(q))),
                   up_world=Vector((0, math.sin(q), -math.cos(q))))
        place_bone(rig, f'Knie-Richtung_{sd}', Vector((s * .25, -.05, 1.6)))
    bpy.ops.object.mode_set(mode='OBJECT')


GRIP_DEG = 72      # angle on the rim from 12 o'clock: ~ quarter to three
HAND_BACK = .07    # wrist behind the rim plane
HAND_OUT = .015
HAND_DOWN = .02
FINGER_CURL = 75
FOOT_X, FOOT_Y, FOOT_Z, FOOT_PITCH = .16, .2, .97, 25


def place_pedals(rig):
    """Game pedals sit inside the closed limousine floor (y 0.8, z 0.5); here each pad goes under the ball of a foot,
    hinged at the floor like a real floor pedal. Pad centre in pedal space (0, -0.05, 0.2), pad faces local -Y."""
    p_rad = math.radians(FOOT_PITCH)
    pad_n = Vector((0, -math.sin(p_rad), math.cos(p_rad)))
    for name, sd in (('pedal-gas', 'r'), ('pedal-brake', 'l')):
        ped = bpy.data.objects[name]
        ball = rig.matrix_world @ rig.pose.bones[f'ball_{sd}'].head
        pad_centre = ball - pad_n * (.045 + .012)
        ped.rotation_mode = 'XYZ'   # glTF import uses quaternions
        ped.rotation_euler = (p_rad - math.pi / 2, 0, 0)
        ped.location = pad_centre - ped.rotation_euler.to_matrix() @ Vector((0, -.05, .2))
        print('PEDAL', name, tuple(round(x, 3) for x in ped.location))


def report(rig):
    for n in ('pelvis', 'thigh_l', 'calf_l', 'foot_l', 'ball_l', 'upperarm_l', 'lowerarm_l', 'hand_l', 'hand_r', 'Head'):
        print('JOINT', n, tuple(round(x, 3) for x in rig.matrix_world @ rig.pose.bones[n].head))
    body = bpy.data.objects['Stalin Koerper']
    me = body.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    vs = [body.matrix_world @ v.co for v in me.vertices]
    seat = [v for v in vs if -.8 < v.y < -.25]
    feet = [v for v in vs if v.y > .05 and v.z < 1.05]
    print('LOWEST_SEAT', round(min(v.z for v in seat), 3), 'LOWEST_FEET', round(min(v.z for v in feet), 3) if feet else None,
          'MOST_FORWARD', round(max(v.y for v in vs), 3), 'BACKMOST', round(min(v.y for v in vs), 3))


def main():
    clean()
    kart = build_kart()
    body, cap, coat = import_officer()
    rig = build_rig()
    weight(rig, body, cap, coat)
    setup_controls(rig)
    char = collection('Stalin Fahrer')
    for o in (rig, body, cap): move_to(o, char)
    coat_col = collection('Mantel (ausgeblendet, nicht im Spiel)')
    move_to(coat, coat_col)
    coat.hide_set(True); coat.hide_render = True   # eye + camera icon in the Outliner show it again
    seat_pose(rig)
    pick_pole_angles(rig)
    bpy.context.view_layer.update()
    place_pedals(rig)
    report(rig)
    for o in bpy.context.selected_objects: o.select_set(False)
    rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUT, compress=True)
    print('STALIN_KART_SAVED', OUT)


if __name__ == '__main__':
    main()
