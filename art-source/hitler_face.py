"""First reference-led facial sculpt for the CC0 Hitler driver.

1938 Bundesarchiv portrait 183-H1216-0500-002: fuller lower face, hooded
eyes, long nasal bridge, modest chin, flat side-parted hair. Numeric offsets
are art decisions, not photogrammetry measurements. Works in kart metres.
"""
import bpy, bmesh, math
from mathutils import Vector

def refine_hitler_face(root):
    bpy.context.view_layer.update()
    head = bpy.data.objects['Pilot head']
    def g(x, center, width): return math.exp(-.5 * ((x - center) / width) ** 2)
    def field(p):
        x, y, z = p
        side = 1 if x >= 0 else -1
        front = max(0, min(1, (y + .46) / .065))
        # The first pass pushed the cheeks too far outward. Keep adult fullness
        # mostly in depth, with a restrained silhouette increase (R63 test).
        cheek = g(abs(x), .050, .024) * g(z, 1.916, .032) * front
        jaw = g(abs(x), .051, .023) * g(z, 1.866, .032) * front
        chin = g(x, 0, .038) * g(z, 1.845, .021) * front
        # R30 test: retain a modestly fuller jaw and rounder nasal tip; a broad
        # cheek push made the mouth read too cheerful in the R29 overlay.
        # R40: the comparison plate shows the imported nose still too broad
        # through the tip/alar. Narrow it slightly without changing projection.
        # R47: the overlay/profile still show a round, wide tip; reduce its
        # breadth and forward push without shortening the bridge.
        nose = g(x, 0, .023) * g(z, 1.939, .029) * front
        tip_flat = g(x, 0, .008) * g(z, 1.925, .006) * front
        bridge = g(abs(x), .012, .010) * g(z, 1.947, .023) * front
        alar = g(abs(x), .023, .012) * g(z, 1.920, .011) * front
        orbital = g(abs(x), .038, .022) * g(z, 1.960, .011) * front
        eye_band = g(abs(x), .038, .045) * g(z, 1.957, .022) * front
        upperlid = g(abs(x), .037, .020) * g(z, 1.977, .010) * front
        lowerlid = g(abs(x), .040, .021) * g(z, 1.944, .008) * front
        mouth_corner = g(abs(x), .037, .012) * g(z, 1.884, .012) * front
        # R42: the photo's closed mouth occupies less of the lower face. Pull
        # only the outer lip corners inward, leaving the centre and philtrum.
        mouth_width = g(abs(x), .035, .014) * g(z, 1.885, .009) * front
        forehead = g(x, 0, .020) * g(z, 2.003, .024) * front
        # Keep wrinkles as very low-contrast surface variation; the first
        # narrow mesh grooves read as a smile crease at game scale.
        frown = (g(x, -.009, .0035) + g(x, .009, .0035)) * g(z, 1.998, .016) * front
        fold_x = .023 + max(0, 1.925-z) * .48
        fold = g(abs(x), fold_x, .0035) * g(z, 1.903, .022) * front
        browline = g(z, 2.024, .003) * g(x, 0, .065) * front
        forehead1 = g(z, 2.006, .0025) * g(x, 0, .048) * front
        forehead2 = g(z, 1.998, .0022) * g(x, 0, .055) * front
        ear = g(abs(x), .091, .014) * g(z, 1.945, .024)
        # R54: the aligned portrait tapers more through the lower cheek than
        # this CC0 head; reduce the small outward jaw/chin push.
        # R58/R59 compressed the mouth too much. R60 tests only a slight
        # corner pull and drop to keep the closed expression nearly level.
        dx = side * (.0135*cheek + .004*jaw + .0015*chin + .0018*alar + .002*ear - .003*bridge) - x*.07*mouth_width
        # R56 moved the narrowed nose forward/down; R67 tests another 2 mm
        # against the profile while retaining the rest of the R66 face.
        dy = .002*cheek + .0015*jaw - .001*chin + .012*nose + .007*alar - .003*tip_flat
        dy += -.005*orbital + .006*upperlid + .005*lowerlid + .003*forehead
        # R38 test: strengthen the glabella and forehead furrows slightly;
        # keep them shallow enough to read as skin creases at kart scale.
        dy -= .0015*frown + .001*fold + .0008*browline
        dz = -.018*nose - .0015*upperlid + .002*lowerlid - .002*chin - .002*ear - .0038*mouth_corner + .006*eye_band
        return Vector((dx, dy, dz)), (frown, fold, lowerlid, cheek, forehead1, forehead2)
    for v in head.data.vertices:
        p = head.matrix_world @ v.co
        delta, _ = field(p)
        p += delta
        if p.z > 2.0: p.z = 2.0 + (p.z-2.0)*.72
        v.co = head.matrix_world.inverted() @ p
    head.data.update()
    # Eyes and eyebrows follow the sculpt's orbital region; reduce cartoon brow height.
    for ob in root.children:
        if ob.type != 'MESH': continue
        inv = ob.matrix_world.inverted()
        if ob.name.startswith(('Eyes', 'Eyebrows')):
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                if ob.name.startswith('Eyes'):
                    # The reference has a heavier upper lid and a less open stare.
                    eye_center = .038 if p.x >= 0 else -.038
                    # R43: shorten each eye subtly at both canthi; the front
                    # overlay shows the stock eyes extend farther sideways.
                    p.x = eye_center + (p.x - eye_center) * .94
                    # R48's extra compression made the eyes too narrow; retain
                    # R47's broader vertical opening, which matches the photo better.
                    p.z = 1.956 + (p.z-1.956)*.24
                    p.z += .004
                    p.y -= .003
                else:
                    # Narrow the stock heavy bars, lower their inner tips and
                    # lift the outer third into a restrained historical arch.
                    # R51: keep R50's moderate width and taper the outer third,
                    # following the finer brow tail in the reference.
                    taper = min(1, abs(p.x)/.07)
                    p.z = 1.977 + (p.z-1.977)*(.42 - .10*taper)
                    # R41 test: reduce the pronounced outer arch; the photo's
                    # brows sit lower and read straighter over the hooded eyes.
                    # R66 test: the R51 tails still lift too high relative to
                    # the archive portrait; lower and flatten the brow line.
                    p.z += -.003 * (1 - taper)
                    p.z += -.001 * taper
                    p.z += .001
                    # R71 (Claude, 08.10.): the photo brows are about 1.6x as thick as R67's and their inner ends
                    # dip towards the nose (the stern frown); thicken about the brow's own line, drop the inner end.
                    p.z = 1.977 + (p.z - 1.977) * 1.6 - .0018 * (1 - taper) ** 2
                    p.y += .008
                v.co = inv @ p
        if ob.name.startswith('Hair_SimpleParted'):
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                # The pack's tall quiff reads much younger than the flat,
                # combed 1938 reference. Flatten only the centre part and leave
                # the hairline/temples intact; broader reductions expose scalp.
                crown = math.exp(-.5*(p.x/.055)**2)
                p.z = 2.0 + (p.z-2.0)*(.78-.15*crown)
                v.co = inv @ p
        if ob.name == 'Pilot moustache':
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                # R10's overlay showed the toothbrush moustache nearly
                # disappearing at game scale. Recover width and especially
                # height while retaining a clear gap below the nose.
                p.y += .008
                # R55: the narrow moustache falls below photo readability in
                # the fixed render, so add a restrained height/width increase.
                p.z = 1.889 + (p.z-1.889)*1.85
                p.x *= 1.16
                v.co = inv @ p
        ob.data.update()

    # R69-R72 shape passes (Claude, 08.10.2026) run before the tint and the creases so both follow the new form;
    # the tint keeps reading the R67 positions it was tuned on.
    pre = [v.co.copy() for v in head.data.vertices]
    lift_lower_face(head)
    sweep_fringe(head)
    enlarge_ears(head)
    # R73 (darker eye and socket materials) changed nothing visible in the fixed renders and was dropped.

    # Hitler's 1938 reference has side-combed hair, not a separate forehead
    # curl. Remove the pack's stylized accessory; the parted cap remains.
    forelock = bpy.data.objects.get('Pilot forelock')
    if forelock:
        bpy.data.objects.remove(forelock, do_unlink=True)

    # Skin colour variations are exported vertex colours multiplied with the pack texture.
    # The pack has several constant-white colour sets. glTF COLOR_0 otherwise
    # selects those, dropping the new tint in Babylon despite a correct Blender render.
    for old in list(head.data.color_attributes): head.data.color_attributes.remove(old)
    colours = head.data.color_attributes.new(name='Face age tint', type='FLOAT_COLOR', domain='POINT')
    head.data.color_attributes.active_color_index = len(head.data.color_attributes)-1
    head.data.color_attributes.render_color_index = len(head.data.color_attributes)-1
    for v in head.data.vertices:
        p = head.matrix_world @ pre[v.index]
        _, (frown, fold, bags, cheek, forehead1, forehead2) = field(p)
        shade = min(.12, .035*frown + .045*fold + .06*bags + .035*forehead1 + .03*forehead2)
        colours.data[v.index].color = (1-shade, 1-shade-.022*cheek, 1-shade-.032*cheek, 1)
    for i, mat in enumerate(list(head.data.materials)):
        if not mat or not mat.use_nodes: continue
        mat = mat.copy(); mat.name = 'Hitler mature skin'; head.data.materials[i] = mat
        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
        base = bsdf.inputs['Base Color']
        source = base.links[0].from_socket if base.is_linked else None
        attr = nodes.new('ShaderNodeVertexColor'); attr.layer_name = colours.name
        mix = nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'MULTIPLY'; mix.inputs[0].default_value = 1
        if source: links.new(source, mix.inputs[1])
        else: mix.inputs[1].default_value = base.default_value
        links.new(attr.outputs['Color'], mix.inputs[2]); links.new(mix.outputs[0], base)
        bsdf.inputs['Roughness'].default_value = .72
    head['reference'] = 'Bundesarchiv Bild 183-H1216-0500-002 (1938), form study; no photo texture'
    # R17: add restrained age folds as fine, skin-coloured relief. Every point is
    # projected onto the real head mesh so the lines follow its surface rather
    # than floating in front of it. The R16 hair compression was rejected.
    eyes = bpy.data.objects.get('Eyes')
    eye_z = sum((eyes.matrix_world @ v.co).z for v in eyes.data.vertices) / len(eyes.data.vertices)
    inverse = head.matrix_world.inverted()
    direction = (inverse.to_3x3() @ Vector((0, -1, 0))).normalized()
    wrinkle = bpy.data.materials.new('Subtle facial creases'); wrinkle.diffuse_color = (.43, .34, .29, 1); wrinkle.use_nodes = True
    wrinkle_shader = wrinkle.node_tree.nodes.get('Principled BSDF')
    wrinkle_shader.inputs['Base Color'].default_value = (.43, .34, .29, 1)
    wrinkle_shader.inputs['Roughness'].default_value = 1.0
    wrinkle_shader.inputs['Specular IOR Level'].default_value = 0.0
    paths = [
        [(-.006, eye_z+.023), (-.005, eye_z+.032), (-.004, eye_z+.040)],
        [(.006, eye_z+.023), (.005, eye_z+.032), (.004, eye_z+.040)],
        [(-.034, eye_z+.047), (-.017, eye_z+.050), (0, eye_z+.048), (.017, eye_z+.050), (.034, eye_z+.047)],
        [(-.028, eye_z+.060), (-.014, eye_z+.062), (0, eye_z+.061), (.014, eye_z+.062), (.028, eye_z+.060)],
        [(-.032, eye_z-.010), (-.040, eye_z-.014), (-.049, eye_z-.012)],
        [(.032, eye_z-.010), (.040, eye_z-.014), (.049, eye_z-.012)],
        # R52: subtle nasolabial folds from the nose wings toward the mouth.
        [(-.024, eye_z-.035), (-.029, eye_z-.047), (-.033, eye_z-.061)],
        [(.024, eye_z-.035), (.029, eye_z-.047), (.033, eye_z-.061)],
    ]
    depsgraph = bpy.context.evaluated_depsgraph_get(); hair = bpy.data.objects.get('Hair_SimpleParted')
    def covered(x, z):   # R72: crease points under the new fringe would poke through the hair
        hit, _, _, _, ob, _ = bpy.context.scene.ray_cast(depsgraph, Vector((x, 1, z)), Vector((0, -1, 0)))
        return hit and ob == hair
    paths = [[(x, z + lower_face_dz(x, z)) for x, z in path] for path in paths]
    paths = [[(x, z) for x, z in path if not covered(x, z)] for path in paths]
    for path_index, path in enumerate(paths):
        if len(path) < 2: continue
        curve = bpy.data.curves.new(f'Face crease {path_index+1}', 'CURVE'); curve.dimensions = '3D'; curve.resolution_u = 8
        # R44 softens the line color and tapers its ends so the relief reads
        # as a crease in skin rather than a uniform drawn-on groove.
        nasolabial = path_index >= 6
        # R65 tests a further restrained visibility increase; R52 was too
        # strong, so keep these shallow, skin-coloured lines below 0.6 mm.
        curve.bevel_depth = .00034 if nasolabial else .00052
        curve.bevel_resolution = 2
        spline = curve.splines.new('BEZIER'); spline.bezier_points.add(len(path)-1)
        hits = 0
        for index, (x, z) in enumerate(path):
            origin = inverse @ Vector((x, 1, z))
            hit, location, normal, _ = head.ray_cast(origin, direction)
            if not hit: continue
            point = head.matrix_world @ location
            normal_world = (head.matrix_world.to_3x3() @ normal).normalized()
            point += normal_world * (.0004 if nasolabial else .0009)
            bezier = spline.bezier_points[index]; bezier.co = point
            bezier.handle_left_type = 'AUTO'; bezier.handle_right_type = 'AUTO'; hits += 1
            if nasolabial:
                bezier.radius = .18 if index in (0, len(path)-1) else .55
            else:
                bezier.radius = .32 if index in (0, len(path)-1) else .82
        if hits < 2:
            bpy.data.curves.remove(curve); continue
        line = bpy.data.objects.new(f'Pilot face crease {path_index+1}', curve); bpy.context.collection.objects.link(line); curve.materials.append(wrinkle)
        world = line.matrix_world.copy(); line.parent = root; line.matrix_world = world
        bpy.ops.object.select_all(action='DESELECT'); line.select_set(True); bpy.context.view_layer.objects.active = line
        bpy.ops.object.convert(target='MESH')
    rebuild_moustache(root, head)
    head['review_status'] = 'R67 local candidate: R66 with 2 mm more nasal projection/drop for the side profile; R57/R61 crown flattening was rejected due exposed scalp'
    print('HITLER_FACE_REFINED_R67_CANDIDATE', len(head.data.vertices))


def lift_lower_face(head):
    """R69 (Claude, 08.10.2026): with the eye rows aligned, the R68 front overlay puts the model's nostrils,
    moustache and mouth about 0.8-1.2 cm below the photo's, while eyes and chin agree. A first try lifting only the
    nose underside (R69a) squashed the tip into a pointed ski-jump in profile and was dropped. Instead the whole
    band from nose base to mouth rises smoothly; eyes and chin stay, so the nose gets shorter and the chin longer."""
    for v in head.data.vertices:
        p = head.matrix_world @ v.co
        front = max(0, min(1, (p.y + .45) / .05))
        lift = math.exp(-.5 * ((p.z - LOWER_FACE['z']) / LOWER_FACE['width_z']) ** 2) * math.exp(-.5 * (p.x / LOWER_FACE['width_x']) ** 2) * front
        if lift > 1e-4:
            p.z += LOWER_FACE['amount'] * lift
            v.co = head.matrix_world.inverted() @ p
    head.data.update()
    # R69c: the nose itself is still about 1 cm too long in front; shorten it towards the eyes with a bump that is
    # zero at the (lifted) mouth line and at the eye row, so the philtrum lengthens instead of the tip squashing.
    lo, hi = SHORT_NOSE['mouth'], SHORT_NOSE['eyes']
    for v in head.data.vertices:
        p = head.matrix_world @ v.co
        if not lo < p.z < hi: continue
        front = max(0, min(1, (p.y + .36) / .025))
        w = math.sin(math.pi * (p.z - lo) / (hi - lo)) * math.exp(-.5 * (p.x / SHORT_NOSE['width_x']) ** 2) * front
        if w > 1e-4:
            p.z += SHORT_NOSE['amount'] * w
            v.co = head.matrix_world.inverted() @ p
    head.data.update()

LOWER_FACE = dict(z=1.893, width_z=.022, width_x=.06, amount=.008)

def lower_face_dz(x, z):
    """Approximate R69 lift at a surface point, for features placed by fixed coordinates (crease paths)."""
    d = LOWER_FACE['amount'] * math.exp(-.5 * ((z - LOWER_FACE['z']) / LOWER_FACE['width_z']) ** 2) * math.exp(-.5 * (x / LOWER_FACE['width_x']) ** 2)
    z1 = z + d; lo, hi = SHORT_NOSE['mouth'], SHORT_NOSE['eyes']
    if lo < z1 < hi: d += SHORT_NOSE['amount'] * math.sin(math.pi * (z1 - lo) / (hi - lo)) * math.exp(-.5 * (x / SHORT_NOSE['width_x']) ** 2)
    return d
SHORT_NOSE = dict(mouth=1.8915, eyes=1.955, width_x=.022, amount=.008)

def sweep_fringe(head):
    """R70 (Claude, 08.10.2026): in the 1938 portrait the side-parted hair falls diagonally across the forehead, from
    the parting high on the viewer's right down to just above the viewer's left brow (his right, +X in the kart
    frame). The pack hair stopped in a level hairline, leaving a tall bare forehead. Instead of a separate curl
    (rejected earlier), the hair shell's own front edge is drawn down that diagonal and kept on the skin."""
    hair = bpy.data.objects.get('Hair_SimpleParted')
    if not hair: return
    inverse_head = head.matrix_world.inverted(); back = (inverse_head.to_3x3() @ Vector((0, -1, 0))).normalized()
    def skin_y(x, z):
        hit, location, _, _ = head.ray_cast(inverse_head @ Vector((x, 0, z)), back)
        return (head.matrix_world @ location).y if hit else None
    f = FRINGE; inv = hair.matrix_world.inverted()
    for v in hair.data.vertices:
        p = hair.matrix_world @ v.co
        if p.z < 1.99 or p.y < -.42: continue
        across = max(0., min(1., (p.x - f['start_x']) / (f['end_x'] - f['start_x']))); across = across * across * (3 - 2 * across)
        w = across * max(0., min(1., (p.y + .41) / .04)) * min(1., math.exp(-(p.z - f['hairline']) / f['falloff']))
        if w < 1e-3: continue
        before = skin_y(p.x, p.z)
        p.z -= f['drop'] * w; p.x += f['sweep'] * w
        after = skin_y(p.x, p.z)
        if before is not None and after is not None: p.y = after + max(p.y - before, f['lift'])
        v.co = inv @ p
    hair.data.update()

# Kart metres: the fringe starts at the parting side (x=-0.035) and reaches its lowest at x=+0.06.
FRINGE = dict(start_x=-.035, end_x=.06, hairline=2.022, falloff=.03, drop=.03, sweep=.006, lift=.002)

def enlarge_ears(head):
    """R72 (Claude, 08.10.2026): the portrait's ears are large and low, top near the eye row and lobes down at the
    moustache, and they stand off the head; the pack ears end at the nose base. Each ear grows about its centre,
    drops and stands out a little; a soft mask keeps the join to the skull smooth."""
    e = EARS; inv = head.matrix_world.inverted()
    for v in head.data.vertices:
        p = head.matrix_world @ v.co; ax = abs(p.x)
        m = max(0., min(1., (ax - e['inner']) / (e['outer'] - e['inner']))) * math.exp(-.5 * ((p.z - e['z']) / .03) ** 2) * math.exp(-.5 * ((p.y - e['y']) / .03) ** 2)
        if m < 1e-3: continue
        side = 1 if p.x > 0 else -1
        t = Vector((p.x + side * e['stand_off'] * (ax - e['inner']) / .02, e['y'] + (p.y - e['y']) * e['scale'], e['z'] + (p.z - e['z']) * e['scale'] - e['drop']))
        v.co = inv @ p.lerp(t, m)
    head.data.update()

EARS = dict(inner=.078, outer=.09, z=1.948, y=-.478, scale=1.18, drop=.008, stand_off=.003)

def rebuild_moustache(root, head):
    """R68 (Claude, 08.10.2026): the R67 moustache was a 4 mm flattened ellipsoid and vanished in every fixed view,
    while it is the strongest landmark of the 1938 portrait: a dark, boxy block as wide as the nose, filling the
    whole philtrum from the nostrils to the upper lip. Rebuild it as a shell projected onto the actual lip surface
    so it neither floats nor sinks in; its outer rows taper like trimmed bristles."""
    old = bpy.data.objects.get('Pilot moustache')
    mat = old.data.materials[0] if old and old.data.materials else None
    if old: bpy.data.objects.remove(old, do_unlink=True)
    inverse = head.matrix_world.inverted()
    direction = (inverse.to_3x3() @ Vector((0, -1, 0))).normalized()
    nx, nz, half, bottom, top = 9, 6, MOUSTACHE['half_width'], MOUSTACHE['bottom'], MOUSTACHE['top']
    bm = bmesh.new(); front, back = [], []
    for j in range(nz):
        rf, rb = [], []
        for i in range(nx):
            x = -half + 2 * half * i / (nx - 1); z = bottom + (top - bottom) * j / (nz - 1)
            # The philtrum is short under the lowered R67 nose: upper rows stay on the lip plane and disappear
            # under the nose, so from the front the block hangs from the nostrils like the 1938 moustache.
            hit, location, normal, _ = head.ray_cast(inverse @ Vector((x, 0, min(z, MOUSTACHE['lip_top']))), direction)
            if not hit: raise RuntimeError(f'moustache ray missed the lip at x={x:.3f} z={z:.3f}')
            p = head.matrix_world @ location; p.z = z
            edge = min(i, nx - 1 - i, j)
            depth = MOUSTACHE['depth'] * (.55 if edge == 0 else .85 if edge == 1 else 1)
            n = Vector((0, 1, 0))
            rf.append(bm.verts.new(p + n * depth)); rb.append(bm.verts.new(p - n * .002))
        front.append(rf); back.append(rb)
    for j in range(nz - 1):
        for i in range(nx - 1):
            bm.faces.new((front[j][i], front[j][i + 1], front[j + 1][i + 1], front[j + 1][i]))
            bm.faces.new((back[j][i], back[j + 1][i], back[j + 1][i + 1], back[j][i + 1]))
    ring = [(0, i) for i in range(nx)] + [(j, nx - 1) for j in range(1, nz)] + [(nz - 1, i) for i in range(nx - 2, -1, -1)] + [(j, 0) for j in range(nz - 2, 0, -1)]
    for k in range(len(ring)):
        (a, b), (c, d) = ring[k], ring[(k + 1) % len(ring)]
        bm.faces.new((front[a][b], back[a][b], back[c][d], front[c][d]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new('Pilot moustache'); bm.to_mesh(mesh); bm.free()
    if mat: mesh.materials.append(mat)
    ob = bpy.data.objects.new('Pilot moustache', mesh); bpy.context.collection.objects.link(ob)
    ob.parent = root; ob.matrix_parent_inverse = root.matrix_world.inverted()

# Kart metres. R68: as wide as the nose wings, from the mouth line up under the nose (nostrils ~1.894-1.898).
MOUSTACHE = dict(half_width=.019, bottom=1.8925, top=1.912, lip_top=1.904, depth=.006)
