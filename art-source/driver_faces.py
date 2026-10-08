"""Older, more characterful faces for the five CC0 drivers besides Hitler (Claude, 08.10.2026).

Marcel (07.10.): the Quaternius base face reads as one young, smooth superhero for everyone. This pass gives each
caricature an age and a build of its own: jowls, double chin, fuller or gaunter cheeks, heavier brow ridge, broader
or longer nose, drooping mouth corners, plus a vertex-colour age tint (folds, eye bags, forehead lines, ruddiness)
multiplied onto the pack skin texture. Hitler keeps his separate reference-led sculpt (hitler_face.py).

All offsets are art decisions in kart metres, measured from landmarks found on the mesh (eye height, nose tip), so the
same field works for every build. The field fades out above the neck seam and is applied to the head and everything
that sits on it (hair, brows, moustache, beard, cap, cigar), so attachments stay in contact; the eyeballs stay put.
"""
import bpy, math
from mathutils import Vector

# Per driver: strength of each feature (1 = the reference amount below).
FACES = {
    # ~65: heavy, pock-marked, broad nose, greying; stern mouth.
    'stalin':    dict(jowl=.9, chin2=.6, cheek=.6, round=.3, gaunt=0, bags=1., brow=1., nose=.9, long_nose=.2, jaw=.4, chin_fwd=0, lip=.2, mouth_down=.8, tint=1., ruddy=.6, pocks=.9, lines=1., lids=1., brow_thick=1.15),
    # ~55: massive jaw thrust forward, pouting lower lip, heavy brow, jowls.
    'mussolini': dict(jowl=1., chin2=.5, cheek=.4, round=.2, gaunt=0, bags=.7, brow=1.3, nose=.5, long_nose=0, jaw=1.4, chin_fwd=1.2, lip=1., mouth_down=.9, tint=.8, ruddy=.4, pocks=0, lines=.8, lids=.8, brow_thick=1.),
    # ~70: very round soft face, double chin, small tired eyes, high forehead.
    'mao':       dict(jowl=.8, chin2=1.2, cheek=1.2, round=1.1, gaunt=0, bags=.9, brow=.3, nose=.7, long_nose=0, jaw=.5, chin_fwd=0, lip=.3, mouth_down=.2, tint=.9, ruddy=.3, pocks=0, lines=.7, lids=1.2, brow_thick=.6),
    # ~40: chubby, round cheeks, double chin; little ageing, much fullness.
    'kim':       dict(jowl=.6, chin2=1.1, cheek=1.4, round=1.3, gaunt=0, bags=.3, brow=.2, nose=.5, long_nose=0, jaw=.7, chin_fwd=0, lip=.4, mouth_down=0, tint=.35, ruddy=.2, pocks=0, lines=.2, lids=.4, brow_thick=.7),
    # ~60: long weathered face, hollow cheeks above the beard, long nose, eye bags.
    'castro':    dict(jowl=.2, chin2=0, cheek=0, round=0, gaunt=1., bags=1., brow=.8, nose=.6, long_nose=1., jaw=.2, chin_fwd=.4, lip=.2, mouth_down=.3, tint=.75, ruddy=.3, pocks=0, lines=.9, lids=1., brow_thick=.85),
}
# Meshes that never follow the face field (body, clothing, neck collar and the eyeballs themselves).
STATIC = ('Pilot suit', 'SuperHero', 'Eyes', 'Icosphere', 'collar', 'button', 'harness', 'bib', 'belt', 'sash', 'pocket', 'lapel', 'tie')

def g(x, c, w): return math.exp(-.5 * ((x - c) / w) ** 2)

def age_face(root, id):
    spec = FACES.get(id)
    if not spec: return
    bpy.context.view_layer.update()
    head = bpy.data.objects['Pilot head']; eyes = bpy.data.objects['Eyes']
    eye_z = sum((eyes.matrix_world @ v.co).z for v in eyes.data.vertices) / len(eyes.data.vertices)
    pts = [head.matrix_world @ v.co for v in head.data.vertices]
    tip_y = max(p.y for p in pts if abs(p.x) < .015 and -.05 < p.z - eye_z < 0)
    neck_z = min(p.z for p in pts) - eye_z
    s = spec

    def field(p):
        x, y, z = p; Z = z - eye_z; ax = abs(x); side = 1 if x >= 0 else -1
        front = max(0., min(1., (y - tip_y + .095) / .06))          # face side of the head
        fade = max(0., min(1., (Z - neck_z - .04) / .04))            # nothing moves at the neck seam
        if fade <= 0: return Vector(), {}
        jowl = g(ax, .056, .02) * g(Z, -.098, .022) * front
        chin2 = g(x, 0, .04) * g(Z, -.135, .014) * max(0., min(1., (y - tip_y + .14) / .05))
        cheek = g(ax, .05, .024) * g(Z, -.045, .028) * front
        hollow = g(ax, .052, .014) * g(Z, -.05, .016) * front
        roundf = g(Z, -.07, .045) * front * min(1., ax / .03)
        bags = g(ax, .036, .014) * g(Z, -.017, .006) * front
        brow = g(ax, .03, .028) * g(Z, .028, .01) * front
        nose = g(x, 0, .02) * g(Z, -.025, .022) * front
        nose_low = g(x, 0, .016) * g(Z, -.04, .012) * front
        jaw = g(ax, .055, .03) * g(Z, -.1, .03) * front
        chin = g(x, 0, .028) * g(Z, -.113, .02) * front
        lip = g(x, 0, .018) * g(Z, -.081, .006) * front
        corner = g(ax, .026, .009) * g(Z, -.073, .009) * front
        lids = g(ax, .036, .016) * g(Z, .011, .006) * front
        fold = g(ax, .024 + max(0, -.035 - Z) * .45, .005) * g(Z, -.055, .02) * front
        dx = side * (.012 * s['jowl'] * jowl + .011 * s['cheek'] * cheek + .014 * s['round'] * roundf + .014 * s['jaw'] * jaw - .007 * s['gaunt'] * hollow) + x * .4 * s['nose'] * nose
        dy = (.006 * s['cheek'] * cheek + .014 * s['chin2'] * chin2 + .004 * s['bags'] * bags + .008 * s['brow'] * brow + .006 * s['nose'] * nose
              + .014 * s['chin_fwd'] * chin + .005 * s['lip'] * lip - .006 * s['gaunt'] * hollow + .004 * s['jowl'] * jowl
              + .001 * s['lids'] * lids - .003 * s['lines'] * fold)
        dz = (-.01 * s['jowl'] * jowl - .009 * s['chin2'] * chin2 - .0025 * s['bags'] * bags - .007 * s['long_nose'] * nose_low
              - .004 * s['mouth_down'] * corner - .008 * s['long_nose'] * chin - .0015 * s['lip'] * lip - .0028 * s['lids'] * lids)
        marks = dict(jowl=jowl, bags=bags, cheek=cheek, nose=nose, front=front, Z=Z, ax=ax, x=x)
        return Vector((dx, dy, dz)) * fade, marks

    movers = [o for o in root.children_recursive if o.type == 'MESH' and not any(k in o.name for k in STATIC)]
    for ob in movers:
        inv = ob.matrix_world.inverted()
        for v in ob.data.vertices:
            p = ob.matrix_world @ v.co
            d, _ = field(p)
            if d.length_squared: v.co = inv @ (p + d)
        ob.data.update()

    # Brows: bushy for Stalin, thin for Mao and Kim; each brow scales about its own centre line.
    brows = bpy.data.objects.get('Eyebrows')
    if brows and s['brow_thick'] != 1:
        inv = brows.matrix_world.inverted(); world = [brows.matrix_world @ v.co for v in brows.data.vertices]
        for sd in (-1, 1):
            side = [i for i, p in enumerate(world) if p.x * sd > 0]
            if not side: continue
            mid = sum(world[i].z for i in side) / len(side)
            for i in side:
                p = world[i].copy(); p.z = mid + (p.z - mid) * s['brow_thick']; brows.data.vertices[i].co = inv @ p
        brows.data.update()

    # Age tint: soft darkening in folds and bags, forehead lines, crow's feet, a little ruddiness on nose and cheeks.
    # The pack ships constant-white colour sets; glTF COLOR_0 would pick one of those instead of the tint.
    for old in list(head.data.color_attributes): head.data.color_attributes.remove(old)
    colours = head.data.color_attributes.new(name='Face age tint', type='FLOAT_COLOR', domain='POINT')
    head.data.color_attributes.active_color_index = len(head.data.color_attributes) - 1
    head.data.color_attributes.render_color_index = len(head.data.color_attributes) - 1
    for v in head.data.vertices:
        p = head.matrix_world @ v.co
        _, m = field(p)
        if not m: colours.data[v.index].color = (1, 1, 1, 1); continue
        Z, ax, front = m['Z'], m['ax'], m['front']
        fold = g(ax, .024 + max(0, -.035 - Z) * .45, .005) * g(Z, -.055, .022) * front
        forehead = (g(Z, .052, .004) + g(Z, .064, .004) + .7 * g(Z, .076, .004)) * g(ax, 0, .045) * front
        frown = g(ax, .008, .004) * g(Z, .036, .012) * front
        crow = g(ax, .062, .007) * g(Z, .0, .012) * front
        under = g(ax, .036, .016) * g(Z, -.024, .008) * front
        pock = (.5 + .5 * math.sin(v.index * 12.9898) * math.sin(v.index * 78.233)) * g(ax, .045, .03) * g(Z, -.04, .035) * front
        shade = s['tint'] * (.16 * fold + .12 * s['lines'] * forehead + .1 * frown + .1 * crow + .16 * under) + .08 * s['pocks'] * pock
        shade = min(.3, shade)
        red = s['ruddy'] * (.1 * m['nose'] + .08 * m['cheek'])
        colours.data[v.index].color = (1 - shade, 1 - shade - red, 1 - shade - red * 1.15, 1)
    for i, mat in enumerate(list(head.data.materials)):
        if not mat or not mat.use_nodes: continue
        mat = mat.copy(); mat.name = f'{id.capitalize()} mature skin'; head.data.materials[i] = mat
        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
        base = bsdf.inputs['Base Color']
        source = base.links[0].from_socket if base.is_linked else None
        attr = nodes.new('ShaderNodeVertexColor'); attr.layer_name = colours.name
        mix = nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'MULTIPLY'; mix.inputs[0].default_value = 1
        if source: links.new(source, mix.inputs[1])
        else: mix.inputs[1].default_value = base.default_value
        links.new(attr.outputs['Color'], mix.inputs[2]); links.new(mix.outputs[0], base)
        bsdf.inputs['Roughness'].default_value = .7
    head['age_pass'] = f'driver_faces.py 08.10.2026 ({id})'
    print('DRIVER_FACE_AGED', id, len(movers))
