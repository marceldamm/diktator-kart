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
        cheek = g(abs(x), .050, .026) * g(z, 1.916, .034) * front
        jaw = g(abs(x), .051, .025) * g(z, 1.866, .035) * front
        chin = g(x, 0, .040) * g(z, 1.845, .022) * front
        nose = g(x, 0, .014) * g(z, 1.939, .027) * front
        alar = g(abs(x), .016, .008) * g(z, 1.920, .009) * front
        orbital = g(abs(x), .038, .022) * g(z, 1.960, .011) * front
        upperlid = g(abs(x), .037, .020) * g(z, 1.977, .010) * front
        lowerlid = g(abs(x), .040, .021) * g(z, 1.944, .008) * front
        forehead = g(x, 0, .020) * g(z, 2.003, .024) * front
        # Soft age relief cut into the mesh, not detached nasolabial tubes.
        frown = (g(x, -.009, .0035) + g(x, .009, .0035)) * g(z, 1.998, .016) * front
        fold_x = .023 + max(0, 1.925-z) * .48
        fold = g(abs(x), fold_x, .0035) * g(z, 1.903, .022) * front
        browline = g(z, 2.024, .003) * g(x, 0, .065) * front
        ear = g(abs(x), .091, .014) * g(z, 1.945, .024)
        dx = side * (.014*cheek + .012*jaw + .005*chin + .003*alar + .002*ear)
        dy = .006*cheek + .005*jaw - .002*chin + .016*nose + .005*alar
        dy += -.005*orbital + .006*upperlid + .005*lowerlid + .003*forehead
        dy -= .0025*frown + .002*fold + .001*browline
        dz = -.009*nose - .0025*upperlid + .003*lowerlid - .003*chin - .002*ear
        return Vector((dx, dy, dz)), (frown, fold, lowerlid, cheek)
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
                    p.z = 1.961 + (p.z-1.961)*.86
                    p.y -= .003
                else:
                    p.z = 1.977 + (p.z-1.977)*.50
                    p.z -= .001 + .005 * min(1, abs(p.x)/.07)
                    p.y += .010
                    p.z += .003
                v.co = inv @ p
        if ob.name.startswith('Hair_SimpleParted'):
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                # Use the same skull warp to preserve the fitted scalp clearance.
                if p.z > 2.0: p.z = 2.0 + (p.z-2.0)*.72
                v.co = inv @ p
        if ob.name == 'Pilot forelock':
            # Keep its attachment while lowering the swept lock and flattening volume.
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co
                p.z = 2.003 + (p.z-2.003)*.65
                v.co = inv @ p
        if ob.name == 'Pilot moustache':
            for v in ob.data.vertices:
                p = ob.matrix_world @ v.co; p.y += .008; p.z -= .007
                p.x *= .92
                v.co = inv @ p
        ob.data.update()

    # Skin colour variations are exported vertex colours multiplied with the pack texture.
    # The pack has several constant-white colour sets. glTF COLOR_0 otherwise
    # selects those, dropping the new tint in Babylon despite a correct Blender render.
    for old in list(head.data.color_attributes): head.data.color_attributes.remove(old)
    colours = head.data.color_attributes.new(name='Face age tint', type='FLOAT_COLOR', domain='POINT')
    head.data.color_attributes.active_color_index = len(head.data.color_attributes)-1
    head.data.color_attributes.render_color_index = len(head.data.color_attributes)-1
    for v in head.data.vertices:
        p = head.matrix_world @ v.co
        _, (frown, fold, bags, cheek) = field(p)
        shade = min(.16, .07*frown + .07*fold + .08*bags)
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
    head['review_status'] = 'First facial pass; human likeness acceptance pending'
    print('HITLER_FACE_REFINED', len(head.data.vertices))
