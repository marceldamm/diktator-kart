"""First reference-led facial sculpt for the CC0 Hitler driver.

1938 Bundesarchiv portrait 183-H1216-0500-002: fuller lower face, hooded
eyes, long nasal bridge, modest chin, flat side-parted hair. Numeric offsets
are art decisions, not photogrammetry measurements. Works in kart metres.
"""
import bpy, math
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
        # mostly in depth, with only a restrained increase to the silhouette.
        cheek = g(abs(x), .050, .024) * g(z, 1.916, .032) * front
        jaw = g(abs(x), .051, .023) * g(z, 1.866, .032) * front
        chin = g(x, 0, .038) * g(z, 1.845, .021) * front
        # Keep the bridge narrow, but give the lower tip and alae a softer,
        # broader transition; the previous point-like tip looked too stylized.
        nose = g(x, 0, .019) * g(z, 1.939, .029) * front
        bridge = g(abs(x), .012, .010) * g(z, 1.947, .023) * front
        alar = g(abs(x), .019, .011) * g(z, 1.920, .011) * front
        orbital = g(abs(x), .038, .022) * g(z, 1.960, .011) * front
        upperlid = g(abs(x), .037, .020) * g(z, 1.977, .010) * front
        lowerlid = g(abs(x), .040, .021) * g(z, 1.944, .008) * front
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
        dx = side * (.010*cheek + .004*jaw + .003*chin + .0015*alar + .002*ear - .005*bridge)
        dy = .002*cheek + .0015*jaw - .001*chin + .017*nose + .0045*alar
        dy += -.005*orbital + .006*upperlid + .005*lowerlid + .003*forehead
        dy -= .001*frown + .0007*fold + .0005*browline
        dz = -.014*nose - .0015*upperlid + .002*lowerlid - .002*chin - .002*ear
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
                    p.z = 1.956 + (p.z-1.956)*.36
                    p.y -= .003
                else:
                    # Narrow the stock heavy bars, lower their inner tips and
                    # lift the outer third into a restrained historical arch.
                    p.z = 1.977 + (p.z-1.977)*.30
                    p.z += -.006 * (1 - min(1, abs(p.x)/.07))
                    p.z += .004 * min(1, abs(p.x)/.07)
                    p.y += .008
                v.co = inv @ p
        if ob.name.startswith('Hair_SimpleParted'):
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                # The pack's tall quiff reads much younger than the flat,
                # combed 1938 reference. Flatten only the crown above the
                # hairline; keep its temple fit and lower edge unchanged.
                # R16's uniform flattening exposed the temples. Flatten only the
                # centre part and leave the hairline at both sides intact.
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
                p.z = 1.889 + (p.z-1.889)*1.65
                p.x *= 1.12
                v.co = inv @ p
        ob.data.update()

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
        p = head.matrix_world @ v.co
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
    wrinkle = bpy.data.materials.new('Subtle facial creases'); wrinkle.diffuse_color = (.38, .28, .22, 1); wrinkle.use_nodes = True
    wrinkle_shader = wrinkle.node_tree.nodes.get('Principled BSDF')
    wrinkle_shader.inputs['Base Color'].default_value = (.38, .28, .22, 1)
    wrinkle_shader.inputs['Roughness'].default_value = 1.0
    wrinkle_shader.inputs['Specular IOR Level'].default_value = 0.0
    paths = [
        [(-.006, eye_z+.023), (-.005, eye_z+.032), (-.004, eye_z+.040)],
        [(.006, eye_z+.023), (.005, eye_z+.032), (.004, eye_z+.040)],
        [(-.034, eye_z+.047), (-.017, eye_z+.050), (0, eye_z+.048), (.017, eye_z+.050), (.034, eye_z+.047)],
        [(-.028, eye_z+.060), (-.014, eye_z+.062), (0, eye_z+.061), (.014, eye_z+.062), (.028, eye_z+.060)],
        [(-.032, eye_z-.010), (-.040, eye_z-.014), (-.049, eye_z-.012)],
        [(.032, eye_z-.010), (.040, eye_z-.014), (.049, eye_z-.012)],
    ]
    for path_index, path in enumerate(paths):
        curve = bpy.data.curves.new(f'Face crease {path_index+1}', 'CURVE'); curve.dimensions = '3D'; curve.resolution_u = 8
        curve.bevel_depth = .00022; curve.bevel_resolution = 2
        spline = curve.splines.new('BEZIER'); spline.bezier_points.add(len(path)-1)
        hits = 0
        for index, (x, z) in enumerate(path):
            origin = inverse @ Vector((x, 1, z))
            hit, location, normal, _ = head.ray_cast(origin, direction)
            if not hit: continue
            point = head.matrix_world @ location
            normal_world = (head.matrix_world.to_3x3() @ normal).normalized()
            point += normal_world * .0009
            bezier = spline.bezier_points[index]; bezier.co = point
            bezier.handle_left_type = 'AUTO'; bezier.handle_right_type = 'AUTO'; hits += 1
        if hits < 2:
            bpy.data.curves.remove(curve); continue
        line = bpy.data.objects.new(f'Pilot face crease {path_index+1}', curve); bpy.context.collection.objects.link(line); curve.materials.append(wrinkle)
        world = line.matrix_world.copy(); line.parent = root; line.matrix_world = world
        bpy.ops.object.select_all(action='DESELECT'); line.select_set(True); bpy.context.view_layer.objects.active = line
        bpy.ops.object.convert(target='MESH')
    head['review_status'] = 'R28: R26 face/hair with slightly broader nasal tip and alae; R27 top-hair trim rejected after bald rear patch; likeness pending'
    print('HITLER_FACE_REFINED_R28', len(head.data.vertices))
